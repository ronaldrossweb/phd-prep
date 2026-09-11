import { useMemo } from "react";
import { unlockedCards, useStudy } from "../App";
import { CARDS, DECK_LABELS, type Deck } from "../data/cards";
import { SESSIONS, TOTAL_HOURS } from "../data/sessions";
import { mastery } from "../lib/srs";
import { getPin, setPin } from "../lib/store";

const DECKS: Deck[] = ["notation", "stats", "python", "ethics"];

export default function Progress() {
  const { progress, sync } = useStudy();
  const unlocked = useMemo(() => unlockedCards(progress), [progress]);

  const sessionsDone = Object.keys(progress.sessionsDone).length;
  const hours = progress.minutesLogged / 60;
  const lapses = Object.values(progress.cards).reduce((a, c) => a + c.lapses, 0);
  const reviews = Object.values(progress.cards).reduce((a, c) => a + c.reps + c.lapses, 0);

  const trackHours = (t: string) =>
    SESSIONS.flatMap((s) => s.blocks).filter((b) => b.track === t)
      .reduce((a, b) => a + b.minutes, 0) / 60;

  return (
    <>
      <h2 className="h-section">Progress</h2>

      <div className="statgrid">
        <div className="stat"><div className="v">{sessionsDone}</div><div className="k">Sessions</div></div>
        <div className="stat"><div className="v">{hours.toFixed(1)}</div><div className="k">Hours</div></div>
        <div className="stat"><div className="v">{reviews}</div><div className="k">Reviews</div></div>
      </div>

      <div className="card">
        <div className="rowline">
          <span className="small" style={{ fontWeight: 650 }}>Time logged</span>
          <span className="tiny faint num">{hours.toFixed(1)} / {TOTAL_HOURS}h</span>
        </div>
        <div className="meter brass">
          <span style={{ width: `${Math.min(100, (hours / TOTAL_HOURS) * 100)}%` }} />
        </div>
      </div>

      <h2 className="h-section">Mastery by deck</h2>
      <div className="card">
        {DECKS.map((d, i) => {
          const all = CARDS.filter((c) => c.deck === d);
          const open = unlocked.filter((c) => c.deck === d);
          const m = open.length
            ? open.reduce((a, c) => a + mastery(progress.cards[c.id]), 0) / open.length
            : 0;
          return (
            <div key={d} style={{ marginBottom: i === DECKS.length - 1 ? ".7rem" : "1rem" }}>
              <div className="rowline">
                <span className="small" style={{ fontWeight: 650 }}>{DECK_LABELS[d]}</span>
                <span className="tiny faint num">{Math.round(m * 100)}% · {open.length}/{all.length}</span>
              </div>
              <div className="meter brass">
                <span style={{ width: `${m * 100}%` }} />
              </div>
            </div>
          );
        })}
        <p className="tiny faint" style={{ marginBottom: 0 }}>
          Mastery is the scheduling interval as a share of 21 days — it rises as cards stop coming back.
        </p>
      </div>

      <h2 className="h-section">How the 35 hours split</h2>
      <div className="card">
        {([["stats", "Statistics"], ["ethics", "Ethics"], ["both", "Both"]] as const).map(
          ([t, label]) => (
            <div key={t} className="rowline" style={{ marginBottom: ".55rem" }}>
              <span className={`pill ${t}`}>{label}</span>
              <span className="tiny faint num">{trackHours(t).toFixed(1)}h</span>
            </div>
          ),
        )}
        <p className="tiny faint" style={{ marginTop: ".8rem", marginBottom: 0 }}>
          Weighted toward statistics and Python, which is the harder track from a cold start. Ethics
          builds on judgement you already have.
        </p>
      </div>

      {lapses > 0 && (
        <>
          <h2 className="h-section">Cards you keep forgetting</h2>
          <div className="card">
            {unlocked
              .map((c) => ({ c, s: progress.cards[c.id] }))
              .filter((x) => x.s && x.s.lapses > 0)
              .sort((a, b) => b.s!.lapses - a.s!.lapses)
              .slice(0, 8)
              .map(({ c, s }) => (
                <div key={c.id} className="rowline" style={{
                  padding: ".45rem 0", borderBottom: "1px solid var(--border-soft)",
                }}>
                  <span className="small" style={{
                    flex: 1, minWidth: 0, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {c.front.replace(/[`*]/g, "")}
                  </span>
                  <span className="tiny faint num">×{s!.lapses}</span>
                </div>
              ))}
            <p className="tiny faint" style={{ marginTop: ".8rem", marginBottom: 0 }}>
              Worth re-reading the underlying note rather than drilling the card.
            </p>
          </div>
        </>
      )}

      <h2 className="h-section">Cross-device sync</h2>
      <div className="card">
        <p className="small muted" style={{ marginTop: 0 }}>
          Progress always saves on this device. To share it between your Mac and your phone, set
          <code>STUDY_PIN</code> in the Netlify dashboard, then enter the same PIN here on each device.
        </p>
        <input
          type="password"
          defaultValue={getPin()}
          onChange={(e) => setPin(e.target.value.trim())}
          placeholder="Study PIN — blank for this device only"
          autoCapitalize="none"
          autoCorrect="off"
        />
        <p className="tiny faint" style={{ marginBottom: 0, marginTop: ".6rem" }}>
          Status <strong style={{ color: "var(--text-2)" }}>
            {sync === "off" ? "on this device only" : sync}
          </strong>. Reload after entering a PIN to pull down existing progress. Until{" "}
          <code>STUDY_PIN</code> is set the sync endpoint refuses every request, so an unconfigured
          site is never left open. The PIN deters a stumbled-upon URL rather than a determined
          attacker — keep nothing sensitive here.
        </p>
      </div>
    </>
  );
}
