import { useMemo, useRef, useState } from "react";
import { unlockedCards, useStudy } from "../App";
import { DECK_LABELS, type Deck } from "../data/cards";
import { fmt } from "../lib/fmt";
import { cardState } from "../lib/store";
import { type Grade, isDue, previewInterval } from "../lib/srs";
import { IconCheckCircle, IconLayers } from "../components/Icons";
import { burst, floatLabel } from "../components/Fx";
import { computeMetrics } from "../lib/metrics";

const DECKS: (Deck | "all")[] = ["all", "notation", "stats", "python", "ethics"];

const GRADES: { g: Grade; label: string; cls: string }[] = [
  { g: 0, label: "Again", cls: "g0" },
  { g: 1, label: "Hard", cls: "g1" },
  { g: 2, label: "Good", cls: "g2" },
  { g: 3, label: "Easy", cls: "g3" },
];

const PRAISE = ["Nice.", "Locked in.", "That one's yours.", "Clean.", "Good recall."];

export default function Cards() {
  const { progress, gradeOne } = useStudy();
  const [deck, setDeck] = useState<Deck | "all">("all");
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [drag, setDrag] = useState(0);
  const [swipeDir, setSwipeDir] = useState<"" | "left" | "right">("");
  const [pop, setPop] = useState<Grade | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const unlocked = useMemo(() => unlockedCards(progress), [progress]);
  const streak = useMemo(() => computeMetrics(progress, 30).streak, [progress]);

  const queue = useMemo(
    () => unlocked.filter((c) => (deck === "all" || c.deck === deck) && isDue(progress.cards[c.id])),
    [unlocked, deck, progress],
  );
  const card = queue[0];
  const isMath = card ? card.deck === "notation" || card.deck === "stats" : false;
  const solo = card ? /^`[^`]{1,14}`$/.test(card.front.trim()) : false;

  const dueByDeck = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of unlocked) {
      if (!isDue(progress.cards[c.id])) continue;
      m.all = (m.all ?? 0) + 1; m[c.deck] = (m[c.deck] ?? 0) + 1;
    }
    return m;
  }, [unlocked, progress]);

  function submit(g: Grade, from?: Element) {
    if (!card) return;
    const label = g === 0 ? "back soon" : `+${previewInterval(cardState(progress, card.id), g)}`;
    if (from) floatLabel(from, g >= 2 ? `${PRAISE[reviewed % PRAISE.length]} ${label}` : label);
    setPop(g);
    setTimeout(() => setPop(null), 350);
    gradeOne(card.id, g);
    setRevealed(false); setDrag(0); setSwipeDir("");
    setReviewed((n) => {
      const next = n + 1;
      if (queue.length === 1 && flashRef.current) {
        const r = flashRef.current.getBoundingClientRect();
        burst({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
      return next;
    });
  }

  /* Swipe with live feedback: the card follows the finger, tilts, and hints. */
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]; touchStart.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchMove(e: React.TouchEvent) {
    const s = touchStart.current; if (!s || !revealed) return;
    const t = e.touches[0]; const dx = t.clientX - s.x, dy = t.clientY - s.y;
    if (Math.abs(dy) > Math.abs(dx)) return;
    setDrag(dx);
    setSwipeDir(dx < -40 ? "left" : dx > 40 ? "right" : "");
  }
  function onTouchEnd(e: React.TouchEvent) {
    const s = touchStart.current; touchStart.current = null;
    if (!s || !revealed) { setDrag(0); setSwipeDir(""); return; }
    const t = e.changedTouches[0]; const dx = t.clientX - s.x, dy = t.clientY - s.y;
    if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx)) { setDrag(0); setSwipeDir(""); return; }
    submit(dx < 0 ? 0 : 2, flashRef.current ?? undefined);
  }

  return (
    <>
      <div className="rowline" style={{ marginBottom: ".8rem" }}>
        <div className="chips" style={{ margin: 0 }}>
          {DECKS.map((d) => (
            <button key={d} className={`chip${deck === d ? " on" : ""}`}
                    onClick={() => { setDeck(d); setRevealed(false); }}>
              {d === "all" ? "All" : DECK_LABELS[d]}
              {dueByDeck[d] ? <span className="n">{dueByDeck[d]}</span> : null}
            </button>
          ))}
        </div>
        {streak > 0 && <span className={`streakpill${reviewed > 0 ? " pulse" : ""}`}>🔥 {streak}-day streak</span>}
      </div>

      {!card ? (
        <div className="empty">
          <span className="glyph">{unlocked.length === 0 ? <IconLayers /> : <IconCheckCircle />}</span>
          <h3>{reviewed > 0 ? `${reviewed} card${reviewed === 1 ? "" : "s"} reviewed` : unlocked.length === 0 ? "Deck locked" : "Queue clear"}</h3>
          <p>{unlocked.length === 0
            ? "Cards unlock as you work through the lessons."
            : reviewed > 0
              ? "That's the queue. Whatever comes back tomorrow is exactly what you were about to forget."
              : "Nothing is due. Come back when the schedule brings them round — that gap is what makes the repetition spaced."}</p>
        </div>
      ) : (
        <>
          <div className="flipwrap">
            <div
              ref={flashRef}
              className={`flash${drag ? " dragging" : ""}`}
              data-swipe={swipeDir}
              style={{ transform: drag ? `translateX(${drag * 0.35}px) rotate(${drag * 0.03}deg)` : undefined }}
              onClick={() => !revealed && setRevealed(true)}
              onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
            >
              <span className="swipehint left">Again</span>
              <span className="swipehint right">Good</span>
              <div className={`flip${revealed ? " shown" : ""}`}>
                <div className="face front">
                  <div className={`q${solo ? " solo" : ""}`}>{fmt(card.front, `q-${card.id}`, { math: isMath })}</div>
                  <div className="tapcue">Tap to reveal</div>
                </div>
                <div className="face back">
                  <div className="q" style={{ fontSize: ".95rem", textAlign: "left", opacity: .75 }}>{fmt(card.front, `qb-${card.id}`, { math: isMath })}</div>
                  <div className="a">{fmt(card.back, `a-${card.id}`, { math: isMath })}</div>
                </div>
              </div>
            </div>
          </div>

          {!revealed ? (
            <button className="btn primary wide" style={{ marginTop: ".75rem" }} onClick={() => setRevealed(true)}>
              Show answer
            </button>
          ) : (
            <div className="gradegrid">
              {GRADES.map(({ g, label, cls }) => (
                <button key={g} className={`gradebtn ${cls}${pop === g ? " pop" : ""}`}
                        onClick={(e) => submit(g, e.currentTarget)}>
                  <span>{label}</span>
                  <span className="hint">{previewInterval(cardState(progress, card.id), g)}</span>
                </button>
              ))}
            </div>
          )}

          <div className="center" style={{ marginTop: "1rem" }}>
            <span className="pill">{DECK_LABELS[card.deck]}</span>
            <p className="tiny faint num" style={{ marginTop: ".5rem" }}>{queue.length} in queue · {reviewed} this sitting</p>
            {revealed && <p className="tiny faint" style={{ marginTop: ".2rem" }}>swipe ← again · swipe → good</p>}
          </div>
        </>
      )}
    </>
  );
}
