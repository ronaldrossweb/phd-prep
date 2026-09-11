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

  const statsHours = SESSIONS.flatMap((s) => s.blocks)
    .filter((b) => b.track === "stats").reduce((a, b) => a + b.minutes, 0) / 60;
  const ethicsHours = SESSIONS.flatMap((s) => s.blocks)
    .filter((b) => b.track === "ethics").reduce((a, b) => a + b.minutes, 0) / 60;
  const bothHours = SESSIONS.flatMap((s) => s.blocks)
    .filter((b) => b.track === "both").reduce((a, b) => a + b.minutes, 0) / 60;

  return (
    <>
      <h2>Progress</h2>

      <div className="statgrid">
        <div className="stat"><div className="v">{sessionsDone}</div><div className="k">Sessions</div></div>
        <div className="stat"><div className="v">{hours.toFixed(1)}</div><div className="k">Hours</div></div>
        <div className="stat"><div className="v">{reviews}</div><div className="k">Reviews</div></div>
      </div>

      <div className="card">
        <h3>Time logged</h3>
        <div className="meter">
          <span style={{ width: `${Math.min(100, (hours / TOTAL_HOURS) * 100)}%`, background: "var(--good)" }} />
        </div>
        <p className="tiny faint">{hours.toFixed(1)} of {TOTAL_HOURS} planned hours</p>
      </div>

      <h2>Mastery by deck</h2>
      <div className="card">
        {DECKS.map((d) => {
          const all = CARDS.filter((c) => c.deck === d);
          const open = unlocked.filter((c) => c.deck === d);
          const m = open.length
            ? open.reduce((a, c) => a + mastery(progress.cards[c.id]), 0) / open.length
            : 0;
          return (
            <div key={d} style={{ marginBottom: ".9rem" }}>
              <div className="small" style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{DECK_LABELS[d]}</strong>
                <span className="faint">{open.length}/{all.length} unlocked</span>
              </div>
              <div className="meter">
                <span style={{ width: `${m * 100}%`, background: "var(--accent)" }} />
              </div>
              <div className="tiny faint">{Math.round(m * 100)}% mastery</div>
            </div>
          );
        })}
        <p className="tiny faint" style={{ marginBottom: 0 }}>
          Mastery is the scheduling interval as a share of 21 days — it rises as cards stop coming back.
        </p>
      </div>

      <h2>How the 35 hours split</h2>
      <div className="card">
        <div className="small" style={{ display: "flex", justifyContent: "space-between" }}>
          <span><span className="pill stats">Statistics</span></span>
          <span className="faint">{statsHours.toFixed(1)}h</span>
        </div>
        <div className="small" style={{ display: "flex", justifyContent: "space-between", marginTop: ".5rem" }}>
          <span><span className="pill ethics">Ethics</span></span>
          <span className="faint">{ethicsHours.toFixed(1)}h</span>
        </div>
        <div className="small" style={{ display: "flex", justifyContent: "space-between", marginTop: ".5rem" }}>
          <span><span className="pill both">Both</span></span>
          <span className="faint">{bothHours.toFixed(1)}h</span>
        </div>
        <p className="tiny faint" style={{ marginTop: ".7rem", marginBottom: 0 }}>
          Weighted toward statistics and Python, which is the harder track from a cold start. Ethics
          builds on judgement you already have.
        </p>
      </div>

      {lapses > 0 && (
        <>
          <h2>Cards you keep forgetting</h2>
          <div className="card">
            {unlocked
              .map((c) => ({ c, s: progress.cards[c.id] }))
              .filter((x) => x.s && x.s.lapses > 0)
              .sort((a, b) => b.s!.lapses - a.s!.lapses)
              .slice(0, 8)
              .map(({ c, s }) => (
                <div key={c.id} className="small" style={{
                  display: "flex", justifyContent: "space-between", gap: ".7rem",
                  padding: ".4rem 0", borderBottom: "1px solid var(--border)",
                }}>
                  <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.front.replace(/[`*]/g, "")}
                  </span>
                  <span className="faint tiny" style={{ flexShrink: 0 }}>×{s!.lapses}</span>
                </div>
              ))}
            <p className="tiny faint" style={{ marginTop: ".7rem", marginBottom: 0 }}>
              Worth re-reading the underlying note rather than drilling the card.
            </p>
          </div>
        </>
      )}

      <h2>Cross-device sync</h2>
      <div className="card">
        <p className="small muted" style={{ marginTop: 0 }}>
          Progress is always saved on this device. To share it between your Mac and your phone, set
          <code>STUDY_PIN</code> in the Netlify dashboard, then enter the same PIN here on each device.
        </p>
        <input
          type="password"
          defaultValue={getPin()}
          onChange={(e) => setPin(e.target.value.trim())}
          placeholder="Study PIN (leave blank for local only)"
          autoCapitalize="none"
          autoCorrect="off"
        />
        <p className="tiny faint" style={{ marginBottom: 0, marginTop: ".5rem" }}>
          Status: <strong>{sync === "off" ? "local only" : sync}</strong>. Reload after entering a PIN
          to pull down existing progress. Until <code>STUDY_PIN</code> is set, the sync endpoint
          refuses every request, so an unconfigured site is never left open. The PIN deters a
          stumbled-upon URL rather than a determined attacker — keep nothing sensitive here.
        </p>
      </div>
    </>
  );
}
