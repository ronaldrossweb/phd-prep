import { Link } from "react-router-dom";
import { currentSession, unlockedCards, useStudy } from "../App";
import { SESSIONS, TERM_START, TOTAL_HOURS } from "../data/sessions";
import { CARDS } from "../data/cards";
import { daysUntil, todayISO } from "../lib/store";
import { mastery } from "../lib/srs";
import { HeroCurve } from "../components/Logo";
import { IconChevronRight, IconLayers } from "../components/Icons";

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
  const seen = unlocked.filter((c) => (progress.cards[c.id]?.reps ?? 0) > 0).length;
  const avgMastery = unlocked.length
    ? unlocked.reduce((a, c) => a + mastery(progress.cards[c.id]), 0) / unlocked.length
    : 0;

  const blocksDone = session.blocks.filter(
    (_, i) => progress.blocksDone[`${session.n}:${i}`],
  ).length;

  const dateLabel = new Date(session.date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

  return (
    <>
      <section className="hero">
        <HeroCurve className="hero-curve" />
        <div className="hero-inner">
          <div className="eyebrow">Countdown</div>
          <div className="big">
            {days > 0 ? days : 0}
            <span className="big-unit">{days === 1 ? "day" : "days"}</span>
          </div>
          <p className="label">
            {days > 0
              ? "until PhDAI 730 and 832 begin — Monday, October 19"
              : "The term has begun. Keep the notation decoder open."}
          </p>
        </div>
      </section>

      <div className="statgrid">
        <div className="stat">
          <div className="v">{doneCount}<small>/15</small></div>
          <div className="k">Sessions</div>
        </div>
        <div className="stat">
          <div className="v">{hoursDone}<small>/{TOTAL_HOURS}</small></div>
          <div className="k">Hours</div>
        </div>
        <div className="stat">
          <div className="v" style={{ color: dueCount ? "var(--brass)" : "var(--good)" }}>
            {dueCount}
          </div>
          <div className="k">Cards due</div>
        </div>
      </div>

      <h2 className="h-section">
        {isToday ? "Today" : untilSession > 0 ? "Up next" : "Most recent"}
      </h2>

      <div className="card">
        <div className="block-meta">
          <span className="pill brass">Session {session.n} / 15</span>
          <span className="pill">Week {session.week}</span>
        </div>
        <div className="sessdate" style={{ marginBottom: ".45rem" }}>
          {dateLabel} · {session.start} · {session.hours}h
        </div>
        <h3 style={{ fontFamily: "var(--display)", fontSize: "1.06rem", lineHeight: 1.32 }}>
          {session.theme}
        </h3>

        <div className="meter good" style={{ marginTop: ".8rem" }}>
          <span style={{ width: `${(blocksDone / session.blocks.length) * 100}%` }} />
        </div>
        <p className="tiny faint" style={{ margin: "0 0 .9rem" }}>
          {blocksDone} of {session.blocks.length} blocks complete
        </p>

        <Link className="btn primary wide" to={`/sessions/${session.n}`}>
          {isToday ? "Begin session" : "Open session plan"}
          <IconChevronRight />
        </Link>
      </div>

      {dueCount > 0 && (
        <>
          <h2 className="h-section">Review queue</h2>
          <div className="card">
            <p className="small muted" style={{ marginTop: 0 }}>
              {dueCount} card{dueCount === 1 ? "" : "s"} due. The queue is scheduled by how well you
              knew each card last time, so it holds exactly what you are about to forget.
            </p>
            <Link className="btn wide" to="/cards">
              <IconLayers />
              Review {dueCount} card{dueCount === 1 ? "" : "s"}
            </Link>
          </div>
        </>
      )}

      <h2 className="h-section">The five weeks</h2>
      <div className="card">
        {[1, 2, 3, 4, 5].map((w) => {
          const ws = SESSIONS.filter((s) => s.week === w);
          const done = ws.filter((s) => progress.sessionsDone[s.n]).length;
          return (
            <div key={w} style={{ marginBottom: w === 5 ? 0 : "1rem" }}>
              <div className="rowline">
                <span className="small" style={{ fontWeight: 650 }}>Week {w}</span>
                <span className="tiny faint num">{done}/{ws.length}</span>
              </div>
              <div className="meter good">
                <span style={{ width: `${(done / ws.length) * 100}%` }} />
              </div>
              <div className="tiny faint">{ws[0].theme.split("—")[0].trim()}</div>
            </div>
          );
        })}
      </div>

      <h2 className="h-section">Deck</h2>
      <div className="card">
        <div className="rowline">
          <span className="small" style={{ fontWeight: 650 }}>Average mastery</span>
          <span className="tiny faint num">{Math.round(avgMastery * 100)}%</span>
        </div>
        <div className="meter brass">
          <span style={{ width: `${avgMastery * 100}%` }} />
        </div>
        <p className="tiny faint" style={{ marginBottom: 0 }}>
          {seen} of {unlocked.length} unlocked cards seen · {CARDS.length} in the full deck ·
          cards unlock as you reach each session
        </p>
      </div>
    </>
  );
}
