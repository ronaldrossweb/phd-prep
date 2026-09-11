import { Link, useParams } from "react-router-dom";
import { currentSession, useStudy } from "../App";
import { SESSIONS, type Track } from "../data/sessions";
import { fmt } from "../lib/fmt";
import { todayISO } from "../lib/store";

const TRACK_LABEL: Record<Track, string> = {
  stats: "Statistics",
  ethics: "Ethics",
  both: "Both",
};

export default function SessionView() {
  const { n } = useParams();
  const { progress, toggleBlock, toggleSession } = useStudy();

  // No :n in the URL -> show the whole plan.
  if (!n) {
    const today = todayISO();
    const cur = currentSession();
    return (
      <>
        <h2>The 15 sessions</h2>
        <p className="small muted">
          Tue &amp; Thu 4:00–6:00am · Sat 5:00–8:00am · Sep 15 → Oct 17 · 35 hours
        </p>
        {[1, 2, 3, 4, 5].map((w) => (
          <div key={w}>
            <h3 style={{ marginTop: "1.3rem", color: "var(--muted)" }}>Week {w}</h3>
            <div className="card card-tight">
              {SESSIONS.filter((s) => s.week === w).map((s) => {
                const done = Boolean(progress.sessionsDone[s.n]);
                const isNow = s.n === cur.n && s.date >= today;
                return (
                  <Link key={s.n} to={`/sessions/${s.n}`} className="sesslink">
                    <span className={`sessn${done ? " done" : isNow ? " now" : ""}`}>
                      {done ? "✓" : s.n}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <div className="small" style={{ fontWeight: 600 }}>
                        {s.day} {new Date(s.date + "T12:00:00").toLocaleDateString("en-US",
                          { month: "short", day: "numeric" })}
                        <span className="faint" style={{ fontWeight: 400 }}> · {s.hours}h</span>
                      </div>
                      <div className="tiny faint" style={{
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {s.theme}
                      </div>
                    </span>
                    <span className="faint">›</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </>
    );
  }

  const session = SESSIONS.find((s) => s.n === Number(n));
  if (!session) return <div className="empty">No such session.</div>;

  const done = Boolean(progress.sessionsDone[session.n]);
  const blocksDone = session.blocks.filter((_, i) => progress.blocksDone[`${session.n}:${i}`]).length;

  return (
    <>
      <Link to="/sessions" className="small faint">‹ All sessions</Link>

      <h2 style={{ marginTop: ".7rem" }}>Session {session.n}</h2>
      <div className="block-meta">
        <span className="pill">Week {session.week}</span>
        <span className="faint tiny">
          {session.day} {new Date(session.date + "T12:00:00").toLocaleDateString("en-US",
            { month: "long", day: "numeric" })} · {session.start} · {session.hours} hours
        </span>
      </div>
      <p className="muted" style={{ marginTop: ".2rem" }}>{session.theme}</p>

      <div className="meter">
        <span style={{
          width: `${(blocksDone / session.blocks.length) * 100}%`,
          background: "var(--good)",
        }} />
      </div>
      <p className="tiny faint">{blocksDone} of {session.blocks.length} blocks complete</p>

      <div className="card">
        {session.blocks.map((b, i) => {
          const key = `${session.n}:${i}`;
          const on = Boolean(progress.blocksDone[key]);
          return (
            <div key={key} className={`block${on ? " done" : ""}`}>
              <button
                className={`checkbox${on ? " on" : ""}`}
                onClick={() => toggleBlock(key)}
                aria-label={on ? "Mark incomplete" : "Mark complete"}
              >
                {on ? "✓" : ""}
              </button>
              <div>
                <div className="block-title">{b.title}</div>
                <div className="block-meta">
                  <span className={`pill ${b.track}`}>{TRACK_LABEL[b.track]}</span>
                  <span className="faint tiny">{b.minutes} min</span>
                </div>
                <div className="block-detail">{fmt(b.detail, key)}</div>
                {b.resource && <div className="res">~/PhD/{b.resource}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className={`btn wide ${done ? "" : "primary"}`}
        onClick={() => toggleSession(session.n)}
      >
        {done ? "✓ Session complete — tap to undo" : "Mark session complete"}
      </button>

      <p className="tiny faint center" style={{ marginTop: ".8rem" }}>
        Completing a session unlocks its cards in the review queue.
      </p>
    </>
  );
}
