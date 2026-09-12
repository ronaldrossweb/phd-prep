import { useRef, useState } from "react";
import type { QuizQuestion } from "../data/modules";
import { fmt } from "../lib/fmt";
import { burst, useCountUp } from "../components/Fx";

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
      if (score / questions.length >= 0.6) burst();
      onComplete(score, questions.length);
    } else {
      setI(i + 1); setChosen(null);
    }
  }

  if (done) return <Done score={score} total={questions.length} onRetake={() => { locked.current = false; setI(0); setChosen(null); setScore(0); setDone(false); }} />;

  return renderQuestion();

  function renderQuestion() {
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
}

function Done({ score, total, onRetake }: { score: number; total: number; onRetake: () => void }) {
  const shown = useCountUp(score, 700);
  const pct = Math.round((score / total) * 100);
  return (
    <div className="celebrate">
      <div className="eyebrow">Quiz complete</div>
      <div className="big">{shown}<span className="faint" style={{ fontSize: "1.4rem" }}>/{total}</span></div>
      <h3>{pct === 100 ? "Every single one." : pct >= 70 ? "Solid." : "Worth another pass."}</h3>
      <p className="small muted" style={{ maxWidth: "36ch", margin: ".2rem auto .9rem" }}>
        {pct === 100 ? "Move on with confidence — this one is yours."
          : pct >= 70 ? "Re-read the explanations you missed before moving on; they get built on."
          : "Go back through the reading before the next lesson — the ideas here are load-bearing."}
      </p>
      <button className="btn quiet" onClick={onRetake}>Retake</button>
    </div>
  );
}
