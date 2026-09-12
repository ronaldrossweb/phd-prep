import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { currentSession, useStudy } from "../App";
import { SESSIONS } from "../data/sessions";
import { MODULES, moduleById, modulesForSession, stepsFor, type Module, type StepKind } from "../data/modules";
import { Practice } from "../components/Practice";
import { Quiz } from "../components/Quiz";
import { fmt } from "../lib/fmt";
import { logExercise, logQuiz, saveModuleProgress } from "../lib/cloud";
import { ensurePackages } from "../lib/pyodide";
import { IconCheck, IconChevronLeft, IconChevronRight } from "../components/Icons";
import { todayISO } from "../lib/store";

const STEP_LABEL: Record<StepKind, string> = { watch: "Watch", read: "Read", practice: "Practice", quiz: "Quiz" };

/* ------------------------------------------------ local module progress */
const MP_KEY = "phd-prep-modules-v1";
type ModuleProg = Record<string, string[]>;   // moduleId -> steps done
function loadMP(): ModuleProg { try { return JSON.parse(localStorage.getItem(MP_KEY) ?? "{}"); } catch { return {}; } }
function saveMP(p: ModuleProg) { try { localStorage.setItem(MP_KEY, JSON.stringify(p)); } catch { /* ignore */ } }

export function useModuleProgress() {
  const [mp, setMp] = useState<ModuleProg>(loadMP);
  const { session } = useStudy();
  const markStep = (m: Module, step: StepKind) => {
    setMp((prev) => {
      const done = new Set(prev[m.id] ?? []); done.add(step);
      const next = { ...prev, [m.id]: [...done] };
      saveMP(next);
      const all = stepsFor(m).every((s) => done.has(s));
      void saveModuleProgress(session, m.id, [...done], all);
      return next;
    });
  };
  const isComplete = (m: Module) => { const d = new Set(mp[m.id] ?? []); return stepsFor(m).every((s) => d.has(s)); };
  return { mp, markStep, isComplete };
}

/* ================================================================ index */
export default function Learn() {
  const { id } = useParams();
  if (id) return <ModuleView id={id} />;
  return <LearnIndex />;
}

function LearnIndex() {
  const { mp, isComplete } = useModuleProgress();
  const cur = currentSession();
  const today = todayISO();
  const done = MODULES.filter(isComplete).length;

  return (
    <>
      <h2 className="h-section">Learn</h2>
      <p className="small muted" style={{ marginTop: "-.35rem" }}>
        {MODULES.length} lessons across 15 sessions. Each one: watch, read, practise in a live Python
        environment, then a short quiz. {done} complete.
      </p>
      <div className="meter brass" style={{ marginBottom: "1.2rem" }}>
        <span style={{ width: `${(done / Math.max(1, MODULES.length)) * 100}%` }} />
      </div>

      {SESSIONS.map((s) => {
        const mods = modulesForSession(s.n);
        if (!mods.length) return null;
        const isNow = s.n === cur.n && s.date >= today;
        return (
          <div key={s.n}>
            <div className="eyebrow" style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
              <span>Session {s.n} · {s.day} {new Date(s.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              {isNow && <span style={{ color: "var(--brass)" }}>Up next</span>}
            </div>
            <div className="card card-tight">
              {mods.map((m) => {
                const doneSteps = new Set(mp[m.id] ?? []);
                const total = stepsFor(m).length;
                const complete = isComplete(m);
                return (
                  <Link key={m.id} to={`/learn/${m.id}`} className="sesslink">
                    <span className={`sessn${complete ? " done" : ""}`}>{complete ? <IconCheck /> : doneSteps.size ? `${doneSteps.size}/${total}` : "·"}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <div className="sesstitle">{m.title}</div>
                      <div className="sessdate">
                        <span className={`pill ${m.track}`} style={{ marginRight: ".4rem" }}>{m.track === "both" ? "Both" : m.track === "stats" ? "Statistics" : "Ethics"}</span>
                        {m.minutes} min · {stepsFor(m).map((k) => STEP_LABEL[k]).join(" · ")}
                      </div>
                    </span>
                    <span className="chev"><IconChevronRight /></span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ============================================================== module */
function ModuleView({ id }: { id: string }) {
  const m = moduleById(id);
  const { session } = useStudy();
  const { mp, markStep } = useModuleProgress();
  const steps = useMemo(() => (m ? stepsFor(m) : []), [m]);
  const doneSteps = new Set(mp[id] ?? []);
  const firstOpen = steps.find((s) => !doneSteps.has(s)) ?? steps[0];
  const [step, setStep] = useState<StepKind>(firstOpen);

  useEffect(() => { if (m?.packages?.length) void ensurePackages(m.packages).catch(() => {}); }, [m]);

  if (!m) return <div className="empty"><h3>No such lesson</h3></div>;

  const idx = steps.indexOf(step);
  const next = steps[idx + 1];
  const prevMod = MODULES[MODULES.indexOf(m) - 1];
  const nextMod = MODULES[MODULES.indexOf(m) + 1];

  function advance() {
    markStep(m!, step);
    if (next) setStep(next);
  }

  return (
    <>
      <Link to="/learn" className="backlink"><IconChevronLeft /> All lessons</Link>
      <div className="eyebrow">Session {m.session} · {m.minutes} min</div>
      <h2 className="h-section" style={{ margin: "0 0 .35rem" }}>{m.title}</h2>
      <p className="small muted" style={{ marginTop: 0 }}>{m.summary}</p>

      <div className="steps">
        {steps.map((s, i) => (
          <button key={s} className={`step${step === s ? " on" : ""}${doneSteps.has(s) ? " done" : ""}`} onClick={() => setStep(s)}>
            <span className="step-n">{doneSteps.has(s) ? <IconCheck /> : i + 1}</span>{STEP_LABEL[s]}
          </button>
        ))}
      </div>

      {step === "watch" && m.video && (
        <div className="card">
          <div className="video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${m.video.youtubeId}?rel=0&modestbranding=1`}
              title={m.video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="small" style={{ marginTop: ".8rem" }}>
            <strong>{m.video.title}</strong> <span className="faint">· {m.video.channel} · {m.video.minutes} min</span>
          </div>
          <div className="eyebrow" style={{ marginTop: ".9rem" }}>Watch for</div>
          <ul className="watchfor">{m.video.watchFor.map((w, i) => <li key={i}>{fmt(w, `wf${i}`, { math: true })}</li>)}</ul>
          <button className="btn primary" style={{ marginTop: ".6rem" }} onClick={advance}>I've watched it <IconChevronRight /></button>
        </div>
      )}

      {step === "read" && (
        <div className="card reading">
          <div className="keyidea"><span className="eyebrow" style={{ margin: 0 }}>Key idea</span><p>{fmt(m.reading.keyIdea, "ki", { math: true })}</p></div>
          {m.reading.body.map((p, i) => (
            p.startsWith("```")
              ? <pre key={i}><code>{p.replace(/^```\w*\n?/, "").replace(/```$/, "")}</code></pre>
              : p.startsWith("## ")
                ? <h3 key={i} className="reading-h">{p.slice(3)}</h3>
                : <p key={i}>{fmt(p, `p${i}`, { math: m.track !== "ethics" })}</p>
          ))}
          <button className="btn primary" onClick={advance}>{next ? "Continue" : "Done"} <IconChevronRight /></button>
        </div>
      )}

      {step === "practice" && (
        <div className="card">
          <p className="tiny faint" style={{ marginTop: 0 }}>
            Real Python, running in your browser. The datasets from the notebooks are available under <code>data/</code>.
          </p>
          {m.exercises.map((ex) => (
            <Practice key={ex.id} exercise={ex} setup={m.setup} onResult={(ok, code) => void logExercise(session, m.id, ex.id, ok, code)} />
          ))}
          <button className="btn primary" onClick={advance}>{next ? "Continue to quiz" : "Done"} <IconChevronRight /></button>
        </div>
      )}

      {step === "quiz" && (
        <div className="card">
          <Quiz
            questions={m.quiz}
            onAnswer={(q, chosen, correct) => void logQuiz(session, m.id, q.id, q.choices[chosen], correct)}
            onComplete={() => markStep(m, "quiz")}
          />
        </div>
      )}

      <div className="btnrow" style={{ justifyContent: "space-between", marginTop: "1.2rem" }}>
        {prevMod ? <Link className="btn quiet" to={`/learn/${prevMod.id}`}><IconChevronLeft /> {prevMod.title}</Link> : <span />}
        {nextMod && <Link className="btn quiet" to={`/learn/${nextMod.id}`}>{nextMod.title} <IconChevronRight /></Link>}
      </div>
    </>
  );
}
