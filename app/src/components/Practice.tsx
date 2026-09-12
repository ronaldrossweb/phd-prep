import { useEffect, useRef, useState } from "react";
import { checkPython, getPyodide, type LoadPhase, onLoadPhase, runPython, type RunResult } from "../lib/pyodide";

export type Exercise = {
  id: string;
  title: string;
  prompt: string;          // what to do, markdown-lite via fmt
  starter: string;         // code pre-filled in the editor
  check: string;           // Python: assertions over the learner's globals
  solution: string;        // revealed on request
  hint?: string;
};

type Props = {
  exercise: Exercise;
  setup?: string;
  /** Solutions of the module's earlier exercises, replayed silently first so
      this exercise stands alone even after a page reload. */
  prereq?: string;
  /** Pyodide packages this exercise needs beyond numpy/pandas/matplotlib. */
  packages?: string[];
  onResult: (passed: boolean, code: string) => void;
};

const PHASE_LABEL: Record<LoadPhase, string> = {
  idle: "", script: "Fetching the Python runtime…", runtime: "Starting Python…",
  packages: "Loading numpy, pandas, matplotlib…", data: "Loading the datasets…",
  ready: "", failed: "The Python runtime failed to load.",
};

export function Practice({ exercise, setup, prereq, packages, onResult }: Props) {
  const [code, setCode] = useState(exercise.starter);
  const [result, setResult] = useState<RunResult | null>(null);
  const [check, setCheck] = useState<{ ok: boolean; message: string } | null>(null);
  const [busy, setBusy] = useState<"run" | "check" | null>(null);
  const [phase, setPhase] = useState<LoadPhase>("idle");
  const [detail, setDetail] = useState<string | undefined>();
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(exercise.starter); setResult(null); setCheck(null); setShowSolution(false); setShowHint(false);
  }, [exercise.id, exercise.starter]);

  useEffect(() => onLoadPhase((p, d) => { setPhase(p); setDetail(d); }), []);

  // Warm the runtime as soon as a practice block is on screen.
  useEffect(() => { getPyodide().catch(() => {}); }, []);

  // Earlier exercises are replayed inside a stdout redirect, and their figures
  // closed, so only this exercise's own output reaches the learner.
  const silentPrereq = prereq
    ? "import io as _io, contextlib as _cl\nwith _cl.redirect_stdout(_io.StringIO()):\n"
      + prereq.split("\n").map((l) => "    " + l).join("\n")
      + "\nimport matplotlib.pyplot as _plt; _plt.close(\"all\")"
    : "";
  const pre = [setup, silentPrereq].filter(Boolean).join("\n\n");
  const withSetup = (c: string) => (pre ? `${pre}\n\n${c}` : c);
  const offset = pre ? pre.split("\n").length + 1 : 0;

  async function run() {
    setBusy("run"); setCheck(null);
    try { setResult(await runPython(withSetup(code), offset, packages)); }
    finally { setBusy(null); }
  }

  async function verify() {
    setBusy("check");
    try {
      const r = await runPython(withSetup(code), offset, packages);
      setResult(r);
      if (r.error) { setCheck({ ok: false, message: "Fix the error above first." }); onResult(false, code); return; }
      const c = await checkPython(exercise.check);
      setCheck(c);
      onResult(c.ok, code);
    } finally { setBusy(null); }
  }

  // Tab inserts two spaces; Cmd/Ctrl+Enter runs.
  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget; const s = el.selectionStart, t = el.selectionEnd;
      const next = code.slice(0, s) + "  " + code.slice(t);
      setCode(next);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault(); void run();
    }
  }

  const loading = phase !== "ready" && phase !== "idle" && phase !== "failed";

  return (
    <div className="practice">
      <div className="practice-head">
        <h3>{exercise.title}</h3>
        <p className="small muted" style={{ margin: ".25rem 0 0" }}>{exercise.prompt}</p>
      </div>

      <div className="editor-wrap">
        <div className="editor-bar">
          <span className="tiny faint mono">python</span>
          <span className="tiny faint">{loading ? PHASE_LABEL[phase] : phase === "failed" ? PHASE_LABEL.failed : "⌘/Ctrl+Enter runs"}</span>
        </div>
        <textarea
          ref={ta}
          className="editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          rows={Math.max(6, Math.min(22, code.split("\n").length + 1))}
        />
      </div>

      <div className="btnrow" style={{ marginTop: ".55rem" }}>
        <button className="btn" onClick={run} disabled={busy !== null || phase === "failed"}>
          {busy === "run" ? "Running…" : "Run"}
        </button>
        <button className="btn primary" onClick={verify} disabled={busy !== null || phase === "failed"}>
          {busy === "check" ? "Checking…" : "Check answer"}
        </button>
        {exercise.hint && <button className="btn quiet" onClick={() => setShowHint((h) => !h)}>Hint</button>}
        <button className="btn quiet" onClick={() => setShowSolution((s) => !s)}>
          {showSolution ? "Hide solution" : "Solution"}
        </button>
      </div>

      {loading && detail && <p className="tiny faint" style={{ marginTop: ".5rem" }}>{detail}</p>}
      {showHint && exercise.hint && <p className="small muted callout">{exercise.hint}</p>}

      {result && (
        <div className="output">
          {result.stdout && <pre className="out-stdout">{result.stdout}</pre>}
          {result.error && <pre className="out-error">{result.error}</pre>}
          {result.stderr && !result.error && <pre className="out-stderr">{result.stderr}</pre>}
          {result.figures.map((src, i) => <img key={i} src={src} alt={`figure ${i + 1}`} className="out-fig" />)}
          {!result.stdout && !result.error && !result.stderr && result.figures.length === 0 && (
            <p className="tiny faint">Ran with no output ({result.ms} ms). Use <code>print()</code> to see values.</p>
          )}
        </div>
      )}

      {check && (
        <div className={`verdict ${check.ok ? "pass" : "fail"}`}>
          <strong>{check.ok ? "Correct." : "Not yet."}</strong>
          {check.message && <span> {check.message}</span>}
        </div>
      )}

      {showSolution && (
        <div className="solution">
          <div className="tiny faint" style={{ marginBottom: ".3rem" }}>One solution — compare, then close it and write your own.</div>
          <pre>{exercise.solution}</pre>
        </div>
      )}
    </div>
  );
}
