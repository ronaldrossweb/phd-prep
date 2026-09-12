/**
 * Bring-your-own-key tutor. The key is stored only in this browser's
 * localStorage and sent only to api.anthropic.com. There is no server.
 */
import Anthropic from "@anthropic-ai/sdk";

const KEY = "phd-prep-anthropic-key";
export const getTutorKey = () => { try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; } };
export const setTutorKey = (k: string) => { try { k ? localStorage.setItem(KEY, k) : localStorage.removeItem(KEY); } catch { /* ignore */ } };

const MODEL = "claude-opus-5";

export const SYSTEM = `You are a patient statistics and AI-ethics tutor for Ronald, a banking executive
starting an Executive PhD in Artificial Intelligence (University of the Cumberlands). His two courses
begin October 19, 2026: PhDAI 730 Statistics for AI and PhDAI 832 Ethics in Responsible AI.
He has strong data intuition from banking, no formal statistics, and is new to Python. He wants the
mechanism before the rule; teach by simulation and concrete counting, not algebra. Use banking examples
(credit risk, fraud/AML, fair lending, SR 11-7 model risk) when they fit. Be concise: two or three tight
paragraphs. Introduce notation only after the idea lands, and say how each symbol is read aloud.
Markdown: **bold** key terms, \`code\` for symbols and Python, no headings. If asked to quiz him, ask ONE
question and stop. If he is wrong, say so directly and explain.`;

export async function askTutor(messages: { role: "user" | "assistant"; content: string }[], sessionReached: number): Promise<string> {
  const key = getTutorKey();
  if (!key) throw new Error("No API key set. Add one under Dashboard → Tutor key.");
  const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    system: [
      { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
      { type: "text", text: `He has reached session ${sessionReached} of 15 in his prep plan.` },
    ],
    messages,
  });
  if (res.stop_reason === "refusal") throw new Error("The model declined that request. Try rephrasing.");
  return res.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("\n").trim();
}
