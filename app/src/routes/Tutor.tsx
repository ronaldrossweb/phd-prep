import { useEffect, useRef, useState } from "react";
import { unlockedCards, useStudy } from "../App";
import { fmt } from "../lib/fmt";
import { IconSend } from "../components/Icons";

type Msg = { role: "user" | "assistant"; content: string };

const PRESETS = [
  "Explain the difference between σ and the standard error, differently than my notes do.",
  "Quiz me on conditional probability. One question at a time, and wait for my answer.",
  "Why can't demographic parity and equalized odds both hold?",
  "I don't understand why variance is squared. Try another angle.",
];

export default function Tutor() {
  const { progress } = useStudy();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [via, setVia] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    fetch("/api/tutor")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setVia(j?.via ?? null))
      .catch(() => setVia(null));
  }, []);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;

    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    setErr("");

    abort.current?.abort();
    abort.current = new AbortController();

    // Where he is in the plan, so the tutor pitches at the right level.
    const reached = unlockedCards(progress).reduce((a, c) => Math.max(a, c.session), 0);

    try {
      const r = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next, sessionReached: reached }),
        signal: abort.current.signal,
      });

      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || `Request failed (${r.status})`);
      }

      const j = await r.json();
      setMsgs([...next, { role: "assistant", content: j.text }]);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setErr((e as Error).message);
      setMsgs(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h2 className="h-section">Tutor</h2>
      <p className="small muted" style={{ marginTop: "-.35rem" }}>
        Knows where you are in the plan and that you want the reasoning before the recipe. Good for
        “explain that another way”, “quiz me”, or “check my answer”.
      </p>

      {msgs.length === 0 && (
        <div className="card">
          <div className="eyebrow">Try one of these</div>
          {PRESETS.map((p) => (
            <button
              key={p}
              className="btn quiet preset"
              onClick={() => send(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="chat">
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.role === "user" ? "user" : "bot"}`}>
            {m.role === "user" ? m.content : fmt(m.content, `m${i}`)}
          </div>
        ))}
        {busy && <div className="msg bot faint">Thinking…</div>}
      </div>

      {err && (
        <div className="card" style={{ borderColor: "var(--bad)" }}>
          <p className="small" style={{ margin: 0 }}>
            <strong>Couldn't reach the tutor.</strong> {err}
          </p>
        </div>
      )}

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(input);
        }}
        placeholder="Ask anything about either course…"
      />
      <div className="btnrow" style={{ marginTop: ".5rem" }}>
        <button className="btn primary" onClick={() => send(input)} disabled={busy || !input.trim()}>
          <IconSend /> Ask
        </button>
        {msgs.length > 0 && (
          <button className="btn quiet" onClick={() => { setMsgs([]); setErr(""); }}>Clear</button>
        )}
      </div>
      <p className="tiny faint" style={{ marginTop: ".6rem" }}>
        ⌘+Enter to send. Answers come from Claude and can be wrong — check anything surprising against
        your notes.
        {via === "netlify-ai-gateway" && (
          <>
            <br />
            Routed through Netlify AI Gateway, so usage is billed on your Netlify plan — no Anthropic
            key needed.
          </>
        )}
        {via === "anthropic-direct" && (
          <>
            <br />
            Using your own Anthropic API key, billed directly by Anthropic.
          </>
        )}
      </p>
    </>
  );
}
