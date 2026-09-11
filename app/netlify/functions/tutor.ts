import Anthropic from "@anthropic-ai/sdk";

/**
 * The study tutor.
 *
 * GET  -> { configured: boolean }   (the app hides the Tutor tab when false)
 * POST -> { text: string }
 *
 * Requires ANTHROPIC_API_KEY as a Netlify environment variable. Note that Netlify
 * reserves the NETLIFY_ prefix for its own variables, so the key must NOT be named
 * NETLIFY_ANTHROPIC_KEY.
 */

const MODEL = "claude-opus-5";
const MAX_TURNS = 24;

const SYSTEM = `You are a patient statistics and AI-ethics tutor for Ronald, a 42-year-old banking
executive starting an Executive PhD in Artificial Intelligence at the University of the Cumberlands.
He is taking two courses beginning October 19, 2026: PhDAI 730 (Statistics for AI) and PhDAI 832
(Ethics in Responsible AI).

Who you are teaching:
- Strong data INTUITION from twenty years in banking, but no formal statistics training.
- Effectively no prior Python.
- Analytical, and specifically wants to understand the MECHANISM before accepting a rule. Give him
  the "why" before the "what". Never lead with a procedure he is supposed to trust.
- He learns best from simulation and concrete counting, not from algebraic derivation.
- His domain is banking: credit risk, fraud/AML, fair lending, model risk management (SR 11-7).
  Use those examples when one fits naturally; do not force them.

How to answer:
- Lead with the intuition in plain English. Introduce notation only after the idea has landed, and
  when you do, say how the symbol is read aloud.
- Be concise. Two or three tight paragraphs beats an essay. Use a short list where it genuinely helps.
- Prefer a worked numeric example over an abstract statement.
- Markdown: **bold** for key terms and \`code\` for symbols and Python. No headings.
- If he asks you to quiz him, ask ONE question and stop. Wait for his answer before the next.
- If he states something incorrect, say so directly and explain the correction. Do not soften it.
- If a question is outside these two courses, answer briefly and steer back.

Things he has already worked through, so you can build on them: that a 96%-recall fraud model can
have 9% precision because of the base rate; that the CLT makes sample means normal regardless of the
population; that SE = sigma/sqrt(n); that a p-value can be built by shuffling labels; that a model
with 90.8% accuracy can catch zero of 110 defaults; and that removing a protected attribute does not
remove disparity because proxies carry it.`;

export default async function handler(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;

  if (req.method === "GET") {
    return json({ configured: Boolean(key) });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }
  if (!key) {
    return json(
      { error: "Tutor is not configured. Add ANTHROPIC_API_KEY in the Netlify dashboard." },
      503,
    );
  }

  let body: { messages?: { role: string; content: string }[]; sessionReached?: number };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages = incoming
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, 8000) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return json({ error: "Expected a trailing user message" }, 400);
  }

  const reached = Number(body.sessionReached) || 1;

  const client = new Anthropic({ apiKey: key });

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      system: [
        {
          type: "text",
          text: SYSTEM,
          // Stable prefix -> cached across turns, which keeps the running cost low.
          cache_control: { type: "ephemeral" },
        },
        {
          type: "text",
          text: `He has reached session ${reached} of 15 in his prep plan. Do not assume knowledge from later sessions without briefly introducing it.`,
        },
      ],
      messages,
    });

    if (res.stop_reason === "refusal") {
      return json({ error: "The model declined to answer that. Try rephrasing." }, 422);
    }

    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return json({ text: text || "(empty response)" });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) {
      return json({ error: "The API key was rejected. Check ANTHROPIC_API_KEY in Netlify." }, 502);
    }
    if (e instanceof Anthropic.RateLimitError) {
      return json({ error: "Rate limited. Wait a moment and try again." }, 429);
    }
    if (e instanceof Anthropic.APIError) {
      return json({ error: `Claude API error ${e.status}: ${e.message}` }, 502);
    }
    return json({ error: (e as Error).message || "Unknown error" }, 500);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export const config = { path: "/api/tutor" };
