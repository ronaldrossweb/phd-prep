import { useMemo, useRef, useState } from "react";
import { unlockedCards, useStudy } from "../App";
import { DECK_LABELS, type Deck } from "../data/cards";
import { fmt } from "../lib/fmt";
import { cardState } from "../lib/store";
import { type Grade, isDue, previewInterval } from "../lib/srs";
import { IconCheckCircle, IconLayers } from "../components/Icons";

const DECKS: (Deck | "all")[] = ["all", "notation", "stats", "python", "ethics"];

const GRADES: { g: Grade; label: string; cls: string }[] = [
  { g: 0, label: "Again", cls: "g0" },
  { g: 1, label: "Hard", cls: "g1" },
  { g: 2, label: "Good", cls: "g2" },
  { g: 3, label: "Easy", cls: "g3" },
];

export default function Cards() {
  const { progress, gradeOne } = useStudy();
  const [deck, setDeck] = useState<Deck | "all">("all");
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const unlocked = useMemo(() => unlockedCards(progress), [progress]);

  const queue = useMemo(
    () =>
      unlocked.filter(
        (c) => (deck === "all" || c.deck === deck) && isDue(progress.cards[c.id]),
      ),
    [unlocked, deck, progress],
  );

  const card = queue[0];
  // Notation and statistics cards carry mathematics; Python cards carry code.
  const isMath = card ? card.deck === "notation" || card.deck === "stats" : false;
  // A front that is nothing but one backticked symbol should be shown large.
  const solo = card ? /^`[^`]{1,14}`$/.test(card.front.trim()) : false;

  const dueByDeck = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of unlocked) {
      if (!isDue(progress.cards[c.id])) continue;
      m.all = (m.all ?? 0) + 1;
      m[c.deck] = (m[c.deck] ?? 0) + 1;
    }
    return m;
  }, [unlocked, progress]);

  function submit(g: Grade) {
    if (!card) return;
    gradeOne(card.id, g);
    setRevealed(false);
    setReviewed((n) => n + 1);
  }

  /* Swipe: left = Again, right = Good. Only once the answer is showing. */
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s || !revealed) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx)) return;
    submit(dx < 0 ? 0 : 2);
  }

  return (
    <>
      <div className="chips">
        {DECKS.map((d) => (
          <button
            key={d}
            className={`chip${deck === d ? " on" : ""}`}
            onClick={() => { setDeck(d); setRevealed(false); }}
          >
            {d === "all" ? "All" : DECK_LABELS[d]}
            {dueByDeck[d] ? <span className="n">{dueByDeck[d]}</span> : null}
          </button>
        ))}
      </div>

      {!card ? (
        <div className="empty">
          <span className="glyph">
            {unlocked.length === 0 ? <IconLayers /> : <IconCheckCircle />}
          </span>
          <h3>
            {reviewed > 0
              ? `${reviewed} card${reviewed === 1 ? "" : "s"} reviewed`
              : unlocked.length === 0
                ? "Deck locked"
                : "Queue clear"}
          </h3>
          <p>
            {unlocked.length === 0
              ? "Cards unlock as you work through the sessions."
              : "Nothing is due. Come back when the schedule brings them round — that gap is what makes the repetition spaced."}
          </p>
        </div>
      ) : (
        <>
          <div
            className="flash"
            onClick={() => !revealed && setRevealed(true)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className={`q${solo ? " solo" : ""}`}>
              {fmt(card.front, `q-${card.id}`, { math: isMath })}
            </div>
            {revealed
              ? <div className="a">{fmt(card.back, `a-${card.id}`, { math: isMath })}</div>
              : <div className="tapcue">Tap to reveal</div>}
          </div>

          {!revealed ? (
            <button
              className="btn primary wide"
              style={{ marginTop: ".75rem" }}
              onClick={() => setRevealed(true)}
            >
              Show answer
            </button>
          ) : (
            <div className="gradegrid">
              {GRADES.map(({ g, label, cls }) => (
                <button key={g} className={`gradebtn ${cls}`} onClick={() => submit(g)}>
                  <span>{label}</span>
                  <span className="hint">{previewInterval(cardState(progress, card.id), g)}</span>
                </button>
              ))}
            </div>
          )}

          <div className="center" style={{ marginTop: "1rem" }}>
            <span className="pill">{DECK_LABELS[card.deck]}</span>
            <p className="tiny faint num" style={{ marginTop: ".5rem" }}>
              {queue.length} in queue · {reviewed} this sitting
            </p>
            {revealed && (
              <p className="tiny faint" style={{ marginTop: ".2rem" }}>
                swipe ← again · swipe → good
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
}
