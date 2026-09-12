import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Mark } from "../components/Logo";

type Mode = "signin" | "signup" | "reset";

export default function SignIn() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

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
    <div className="signin">
      <div className="signin-card">
        <div className="signin-brand">
          <span className="brand-mark" style={{ width: 52, height: 52, borderRadius: 14 }}>
            <Mark style={{ color: "var(--brass)", width: 36 }} />
          </span>
          <h1 className="signin-title">PhD Prep</h1>
          <p className="small muted" style={{ margin: 0 }}>
            PhDAI 730 · Statistics for AI &nbsp;·&nbsp; PhDAI 832 · Ethics in Responsible AI
          </p>
        </div>

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

          {msg && (
            <p className={`small ${msg.kind === "error" ? "signin-error" : "signin-ok"}`}>{msg.text}</p>
          )}

          <button className="btn primary wide" disabled={busy}>
            {busy ? "…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </button>
        </form>

        <div className="signin-links">
          {mode !== "signin" && <button className="linkbtn" onClick={() => { setMode("signin"); setMsg(null); }}>Sign in</button>}
          {mode !== "signup" && <button className="linkbtn" onClick={() => { setMode("signup"); setMsg(null); }}>Create account</button>}
          {mode !== "reset"  && <button className="linkbtn" onClick={() => { setMode("reset");  setMsg(null); }}>Forgot password</button>}
        </div>

        <p className="tiny faint center" style={{ marginTop: "1.4rem" }}>
          Your progress, exercise results and quiz history are stored against this account and are
          readable only by you.
        </p>
      </div>
    </div>
  );
}
