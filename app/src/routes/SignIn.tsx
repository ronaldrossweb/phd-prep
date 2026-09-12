import { useState } from "react";
import { supabase } from "../lib/supabase";
import { DrawnMark, Reveal, useCountUp } from "../components/Fx";
import { MODULES } from "../data/modules";
import { CARDS } from "../data/cards";
import { TERM_START } from "../data/sessions";
import { daysUntil } from "../lib/store";

type Mode = "signin" | "signup" | "reset";

export default function SignIn() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  const days = useCountUp(Math.max(0, daysUntil(TERM_START)), 1100);
  const lessons = useCountUp(MODULES.length, 900);
  const exercises = useCountUp(MODULES.reduce((a, m) => a + m.exercises.length, 0), 1000);
  const cards = useCountUp(CARDS.length, 1200);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg({ kind: "ok", text: "Account created — signing you in." });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + import.meta.env.BASE_URL,
        });
        if (error) throw error;
        setMsg({ kind: "ok", text: "Check your email for the reset link." });
      }
    } catch (err) {
      setMsg({ kind: "error", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="landing">
      <div className="orb a" /><div className="orb b" />
      <div className="landing-inner">
        <div className="landing-copy">
          <DrawnMark size={200} />
          <div className="landing-eyebrow">PhDAI 730 · Statistics for AI &nbsp;·&nbsp; PhDAI 832 · Ethics in Responsible AI</div>
          <h1 className="landing-title">
            Learn it <em>before</em> the term<br />makes you learn it.
          </h1>
          <p className="landing-sub">
            Short video, a tight read, then real Python in your browser with answers that check
            themselves — and a quiz that remembers what you got wrong. Fifteen sessions. One place.
          </p>
          <div className="landing-facts">
            <Reveal delay={100}><div className="fact"><div className="v">{days}</div><div className="k">days to Oct 19</div></div></Reveal>
            <Reveal delay={200}><div className="fact"><div className="v">{lessons}</div><div className="k">lessons</div></div></Reveal>
            <Reveal delay={300}><div className="fact"><div className="v">{exercises}</div><div className="k">live exercises</div></div></Reveal>
            <Reveal delay={400}><div className="fact"><div className="v">{cards}</div><div className="k">flashcards</div></div></Reveal>
          </div>
        </div>

        <div className="signin-card">
          <div className="eyebrow" style={{ marginBottom: ".2rem" }}>
            {mode === "signin" ? "Welcome back" : mode === "signup" ? "Start here" : "Reset password"}
          </div>
          <h2 className="signin-title" style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>
            {mode === "signin" ? "Sign in and pick up where you left off"
              : mode === "signup" ? "Create your account"
              : "We'll email you a link"}
          </h2>

          <form onSubmit={submit} className="signin-form">
            <label className="field">
              <span className="field-k">Email</span>
              <input type="email" required autoComplete="email" value={email}
                     onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </label>
            {mode !== "reset" && (
              <label className="field">
                <span className="field-k">Password</span>
                <input type="password" required minLength={6}
                       autoComplete={mode === "signup" ? "new-password" : "current-password"}
                       value={password} onChange={(e) => setPassword(e.target.value)}
                       placeholder={mode === "signup" ? "at least 6 characters" : "••••••••"} />
              </label>
            )}
            {msg && <p className={`small ${msg.kind === "error" ? "signin-error" : "signin-ok"}`}>{msg.text}</p>}
            <button className="btn primary wide" disabled={busy}>
              {busy ? "…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </button>
          </form>

          <div className="signin-links">
            {mode !== "signin" && <button className="linkbtn" onClick={() => { setMode("signin"); setMsg(null); }}>Sign in</button>}
            {mode !== "signup" && <button className="linkbtn" onClick={() => { setMode("signup"); setMsg(null); }}>Create account</button>}
            {mode !== "reset"  && <button className="linkbtn" onClick={() => { setMode("reset");  setMsg(null); }}>Forgot password</button>}
          </div>
          <p className="tiny faint center" style={{ marginTop: "1.2rem" }}>
            Your progress, exercise results and quiz history are stored against this account and
            readable only by you.
          </p>
        </div>
      </div>
    </div>
  );
}
