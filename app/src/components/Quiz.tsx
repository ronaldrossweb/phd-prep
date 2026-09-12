import { useRef, useState } from "react";
import type { QuizQuestion } from "../data/modules";
import { fmt } from "../lib/fmt";

type Props = {
  questions: QuizQuestion[];
  onAnswer: (q: QuizQuestion, chosen: number, correct: boolean) => void;
  onComplete: (score: number, total: number) => void;
};

export function Quiz({ questions, onAnswer, onComplete }: Props) {
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  // State reads are stale within a render; a second tap before React commits
  // would pass the `chosen === null` check and count an answer twice.
  const locked = useRef(false);

  const q = questions[i];

  function pick(idx: number) {
    if (locked.current || chosen !== null) return;
    locked.current = true;
    setChosen(idx);
    const ok = idx === q.answer;
    if (ok) setScore((s) => s + 1);
    onAnswer(q, idx, ok);
  }

  function next() {
    locked.current = false;
    if (i + 1 >= questions.length) {
      setDone(true);
      onComplete(score, questions.length);
    } else {
      setI(i + 1); setChosen(null);
    }
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-done">
        <div className="eyebrow">Quiz complete</div>
        <div className="quiz-score">{score}<span className="faint">/{questions.length}</span></div>
        <p className="small muted">
          {pct === 100 ? "Every one. Move on with confidence."
            : pct >= 70 ? "Solid. Re-read the explanations you missed before moving on."
            : "Worth a second pass through the reading before the next module — the ideas here get built on."}
        </p>
        <button className="btn quiet" onClick={() => { locked.current = false; setI(0); setChosen(null); setScore(0); setDone(false); }}>
          Retake
        </button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-meta tiny faint">Question {i + 1} of {questions.length}</div>
      <div className="quiz-q">{fmt(q.q, q.id, { math: true })}</div>
      <div className="choices">
        {q.choices.map((c, idx) => {
          const state = chosen === null ? "" : idx === q.answer ? " right" : idx === chosen ? " wrong" : " dim";
          return (
            <button key={idx} className={`choice${state}`} onClick={() => pick(idx)} disabled={chosen !== null}>
              <span className="choice-k">{String.fromCharCode(65 + idx)}</span>
              <span>{fmt(c, `${q.id}-${idx}`, { math: true })}</span>
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <>
          <div className={`verdict ${chosen === q.answer ? "pass" : "fail"}`}>
            <strong>{chosen === q.answer ? "Right." : "Not quite."}</strong> {fmt(q.why, `${q.id}-why`, { math: true })}
          </div>
          <button className="btn primary" style={{ marginTop: ".7rem" }} onClick={next}>
            {i + 1 >= questions.length ? "Finish" : "Next question"}
          </button>
        </>
      )}
    </div>
  );
}
