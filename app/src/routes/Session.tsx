import { Link, useParams } from "react-router-dom";
import { currentSession, useStudy } from "../App";
import { SESSIONS, type Track } from "../data/sessions";
import { fmt } from "../lib/fmt";
import { todayISO } from "../lib/store";
import { IconCheck, IconChevronLeft, IconChevronRight } from "../components/Icons";

const TRACK_LABEL: Record<Track, string> = {
  stats: "Statistics",
  ethics: "Ethics",
  both: "Both",
};

export default function SessionView() {
  const { n } = useParams();
  const { progress, toggleBlock, toggleSession } = useStudy();

  /* ------------------------------------------------- the whole plan */
  if (!n) {
    const today = todayISO();
    const cur = currentSession();
    return (
      <>
        <h2 className="h-section">The fifteen sessions</h2>
        <p className="small muted" style={{ marginTop: "-.35rem" }}>
          Tue &amp; Thu 4:00–6:00am · Sat 5:00–8:00am · Sep 15 → Oct 17 · 35 hours
        </p>

        {[1, 2, 3, 4, 5].map((w) => (
          <div key={w}>
            <div className="eyebrow" style={{ marginTop: "1.6rem" }}>Week {w}</div>
            <div className="card card-tight">
              {SESSIONS.filter((s) => s.week === w).map((s) => {
                const done = Boolean(progress.sessionsDone[s.n]);
                const isNow = s.n === cur.n && s.date >= today;
                return (
                  <Link key={s.n} to={`/sessions/${s.n}`} className="sesslink">
                    <span className={`sessn${done ? " done" : isNow ? " now" : ""}`}>
                      {done ? <IconCheck /> : s.n}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <div className="sesstitle" style={{
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {s.theme.split("—")[0].trim()}
                      </div>
                      <div className="sessdate">
                        {new Date(s.date + "T12:00:00").toLocaleDateString("en-US",
                          { weekday: "short", month: "short", day: "numeric" })} · {s.hours}h
                      </div>
                    </span>
                    <span className="chev"><IconChevronRight /></span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </>
    );
  }

  /* ------------------------------------------------- one session */
  const session = SESSIONS.find((s) => s.n === Number(n));
  if (!session) {
    return (
      <div className="empty">
        <h3>No such session</h3>
        <p>Sessions run from 1 to 15.</p>
      </div>
    );
  }

  const done = Boolean(progress.sessionsDone[session.n]);
  const blocksDone = session.blocks.filter((_, i) => progress.blocksDone[`${session.n}:${i}`]).length;

  return (
    <>
      <Link to="/sessions" className="backlink">
        <IconChevronLeft /> All sessions
      </Link>

      <div className="eyebrow">Session {session.n} of 15 · Week {session.week}</div>
      <h2 className="h-section" style={{ margin: "0 0 .5rem" }}>{session.theme}</h2>
      <div className="sessdate" style={{ marginBottom: ".9rem" }}>
        {new Date(session.date + "T12:00:00").toLocaleDateString("en-US",
          { weekday: "long", month: "long", day: "numeric" })} · {session.start} · {session.hours} hours
      </div>

      <div className="meter good">
        <span style={{ width: `${(blocksDone / session.blocks.length) * 100}%` }} />
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
                aria-pressed={on}
              >
                <IconCheck />
              </button>
              <div>
                <div className="block-title">{b.title}</div>
                <div className="block-meta">
                  <span className={`pill ${b.track}`}>{TRACK_LABEL[b.track]}</span>
                  <span className="tiny faint num">{b.minutes} min</span>
                </div>
                <div className="block-detail">{fmt(b.detail, key)}</div>
                {b.resource && <div className="res">~/PhD/{b.resource}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className={`btn wide ${done ? "quiet" : "primary"}`}
        onClick={() => toggleSession(session.n)}
      >
        {done ? <><IconCheck /> Complete — tap to undo</> : "Mark session complete"}
      </button>

      <p className="tiny faint center" style={{ marginTop: ".85rem" }}>
        Completing a session unlocks its cards in the review queue.
      </p>
    </>
  );
}
