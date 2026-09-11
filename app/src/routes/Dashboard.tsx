import { Link } from "react-router-dom";
import { currentSession, unlockedCards, useStudy } from "../App";
import { SESSIONS, TERM_START, TOTAL_HOURS } from "../data/sessions";
import { CARDS } from "../data/cards";
import { daysUntil, todayISO } from "../lib/store";
import { mastery } from "../lib/srs";

export default function Dashboard() {
  const { progress, dueCount } = useStudy();
  const session = currentSession();
  const today = todayISO();
  const isToday = session.date === today;
  const days = daysUntil(TERM_START);
  const untilSession = daysUntil(session.date);

  const doneCount = Object.keys(progress.sessionsDone).length;
  const hoursDone = Math.round(progress.minutesLogged / 60);
  const unlocked = unlockedCards(progress);
  const seen = unlocked.filter((c) => progress.cards[c.id]?.reps > 0).length;
  const avgMastery = unlocked.length
    ? unlocked.reduce((a, c) => a + mastery(progress.cards[c.id]), 0) / unlocked.length
    : 0;

  const blocksDone = session.blocks.filter(
    (_, i) => progress.blocksDone[`${session.n}:${i}`],
  ).length;

  return (
    <>
      <div className="hero">
        <div className="big">{days > 0 ? days : 0}</div>
        <div className="label">
          {days > 0
            ? "days until PhDAI 730 & 832 begin — Monday, October 19"
            : "The term has begun. Keep the notation decoder open."}
        </div>
      </div>

      <div className="statgrid">
        <div className="stat">
          <div className="v">{doneCount}<span className="faint" style={{ fontSize: ".8rem" }}>/15</span></div>
          <div className="k">Sessions</div>
        </div>
        <div className="stat">
          <div className="v">{hoursDone}<span className="faint" style={{ fontSize: ".8rem" }}>/{TOTAL_HOURS}</span></div>
          <div className="k">Hours</div>
        </div>
        <div className="stat">
          <div className="v" style={{ color: dueCount ? "var(--warn)" : "var(--good)" }}>{dueCount}</div>
          <div className="k">Cards due</div>
        </div>
      </div>

      <h2>{isToday ? "Today's session" : untilSession > 0 ? "Next session" : "Most recent session"}</h2>
      <div className="card">
        <div className="block-meta">
          <span className="pill">Session {session.n} of 15</span>
          <span className="pill">Week {session.week}</span>
          <span className="faint tiny">
            {session.day} {new Date(session.date + "T12:00:00").toLocaleDateString("en-US",
              { month: "short", day: "numeric" })} · {session.start} · {session.hours}h
          </span>
        </div>
        <h3 style={{ marginTop: ".4rem" }}>{session.theme}</h3>
        <div className="meter">
          <span style={{
            width: `${(blocksDone / session.blocks.length) * 100}%`,
            background: "var(--good)",
          }} />
        </div>
        <p className="small muted" style={{ margin: ".3rem 0 .8rem" }}>
          {blocksDone} of {session.blocks.length} blocks done
        </p>
        <Link className="btn primary wide" to={`/sessions/${session.n}`}>
          {isToday ? "Start session" : "Open session plan"}
        </Link>
      </div>

      {dueCount > 0 && (
        <>
          <h2>Review queue</h2>
          <div className="card">
            <p className="small muted" style={{ marginTop: 0 }}>
              {dueCount} card{dueCount === 1 ? "" : "s"} due now. These are scheduled by how well you
              knew them last time, so the queue is exactly what you are about to forget.
            </p>
            <Link className="btn wide" to="/cards">Review {dueCount} card{dueCount === 1 ? "" : "s"}</Link>
          </div>
        </>
      )}

      <h2>Deck progress</h2>
      <div className="card">
        <div className="block-meta" style={{ marginBottom: ".5rem" }}>
          <span className="faint small">
            {seen} of {unlocked.length} unlocked cards seen · {CARDS.length} total in the deck
          </span>
        </div>
        <div className="meter">
          <span style={{ width: `${avgMastery * 100}%`, background: "var(--accent)" }} />
        </div>
        <p className="tiny faint" style={{ marginBottom: 0 }}>
          Average mastery {Math.round(avgMastery * 100)}% · cards unlock as you reach each session
        </p>
      </div>

      <h2>The five weeks</h2>
      <div className="card">
        {[1, 2, 3, 4, 5].map((w) => {
          const ws = SESSIONS.filter((s) => s.week === w);
          const done = ws.filter((s) => progress.sessionsDone[s.n]).length;
          return (
            <div key={w} style={{ marginBottom: ".8rem" }}>
              <div className="small" style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Week {w}</strong>
                <span className="faint">{done}/{ws.length}</span>
              </div>
              <div className="meter">
                <span style={{ width: `${(done / ws.length) * 100}%`, background: "var(--good)" }} />
              </div>
              <div className="tiny faint">{ws[0].theme.split("—")[0].trim()}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
