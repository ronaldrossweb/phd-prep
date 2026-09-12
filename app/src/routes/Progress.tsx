import { useMemo, useState } from "react";
import { useStudy } from "../App";
import { SESSIONS, TOTAL_HOURS } from "../data/sessions";
import { computeMetrics, pct } from "../lib/metrics";
import { supabase } from "../lib/supabase";
import { getTutorKey, setTutorKey } from "../lib/tutorClient";
import { DayActivity, DeckAccuracy, MasteryBar, Sparkline } from "../components/Charts";

const RANGES = [
  { d: 7, label: "7 days" },
  { d: 14, label: "14 days" },
  { d: 30, label: "30 days" },
];

export default function Progress() {
  const { progress, sync, session, refreshTutor } = useStudy();
  const [range, setRange] = useState(14);

  const m = useMemo(() => computeMetrics(progress, range), [progress, range]);

  const sessionsDone = Object.keys(progress.sessionsDone).length;
  const hours = progress.minutesLogged / 60;
  const trackHours = (t: string) =>
    SESSIONS.flatMap((s) => s.blocks).filter((b) => b.track === t)
      .reduce((a, b) => a + b.minutes, 0) / 60;

  const noData = m.reviews === 0;

  return (
    <>
      <h2 className="h-section">Dashboard</h2>

      {/* One filter row, above everything it scopes. */}
      <div className="filterbar">
        <span className="eyebrow" style={{ margin: 0 }}>Window</span>
        <div className="segmented" role="group" aria-label="Time window">
          {RANGES.map((r) => (
            <button
              key={r.d}
              className={`segbtn${range === r.d ? " on" : ""}`}
              onClick={() => setRange(r.d)}
              aria-pressed={range === r.d}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- KPI row */}
      <div className="kpis">
        <div className="kpi lead">
          <div className="kpi-k">Recall accuracy</div>
          <div className={`kpi-v${noData ? " none" : ""}`}>
            {noData ? "Not yet" : pct(m.recall)}
            {m.trend.length > 1 && (
              <span className="kpi-spark"><Sparkline points={m.trend.map((t) => t.value)} /></span>
            )}
          </div>
          <div className="kpi-note">
            {noData
              ? "no reviews in this window"
              : `${pct(m.confident)} of those felt comfortable`}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-k">Reviews</div>
          <div className="kpi-v">{m.reviews}</div>
          <div className="kpi-note">{m.today} today</div>
        </div>
        <div className="kpi">
          <div className="kpi-k">Streak</div>
          <div className="kpi-v">{m.streak}</div>
          <div className="kpi-note">{m.streak === 1 ? "day" : "days"} in a row</div>
        </div>
        <div className="kpi">
          <div className="kpi-k">Locked in</div>
          <div className="kpi-v">{m.mastery.mature}</div>
          <div className="kpi-note">cards at 21+ days</div>
        </div>
      </div>

      {noData && (
        <div className="card">
          <p className="small muted" style={{ margin: 0 }}>
            <strong>Nothing to measure yet.</strong> Accuracy tracking starts the moment you grade
            your first card — every review is logged with its outcome and timestamp, so these charts
            fill in as you work. Nothing here is back-filled or estimated.
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------ charts */}
      <div className="chartgrid">
        <DayActivity days={m.days} />
        <DeckAccuracy byDeck={m.byDeck} />
        <MasteryBar mastery={m.mastery} />

        {m.hardest.length > 0 && (
          <figure className="chart">
            <figcaption className="chart-head">
              <div>
                <h3>Cards fighting back</h3>
                <p className="tiny faint">
                  Most-forgotten first. Re-read the underlying note rather than drilling the card.
                </p>
              </div>
            </figcaption>
            <div className="tablewrap">
              <table className="datatable">
                <thead><tr><th>Card</th><th>Forgotten</th><th>Reviews</th></tr></thead>
                <tbody>
                  {m.hardest.map((h) => (
                    <tr key={h.id}>
                      <td className="clip">{h.front}</td>
                      <td>{h.lapses}×</td>
                      <td>{h.reviews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </figure>
        )}
      </div>

      {/* ------------------------------------------------------- plan progress */}
      <h2 className="h-section">The plan</h2>
      <div className="chartgrid">
        <figure className="chart">
          <figcaption className="chart-head">
            <div><h3>Sessions and hours</h3></div>
          </figcaption>
          <div className="hbars">
            <div className="hbar">
              <span className="hbar-label">Sessions</span>
              <span className="hbar-track">
                <span className="hbar-fill" style={{ width: `${(sessionsDone / 15) * 100}%` }} />
              </span>
              <span className="hbar-val num">{sessionsDone}<span className="faint">/15</span></span>
            </div>
            <div className="hbar">
              <span className="hbar-label">Hours</span>
              <span className="hbar-track">
                <span className="hbar-fill"
                      style={{ width: `${Math.min(100, (hours / TOTAL_HOURS) * 100)}%` }} />
              </span>
              <span className="hbar-val num">
                {hours.toFixed(1)}<span className="faint">/{TOTAL_HOURS}</span>
              </span>
            </div>
          </div>
        </figure>

        <figure className="chart">
          <figcaption className="chart-head">
            <div>
              <h3>How the 35 hours split</h3>
              <p className="tiny faint">
                Weighted toward statistics and Python — the harder track from a cold start.
              </p>
            </div>
          </figcaption>
          <div className="hbars">
            {([["stats", "Statistics"], ["ethics", "Ethics"], ["both", "Both"]] as const).map(
              ([t, label]) => (
                <div className="hbar" key={t}>
                  <span className="hbar-label">{label}</span>
                  <span className="hbar-track">
                    <span className={`hbar-fill track-${t}`}
                          style={{ width: `${(trackHours(t) / TOTAL_HOURS) * 100}%` }} />
                  </span>
                  <span className="hbar-val num">{trackHours(t).toFixed(1)}h</span>
                </div>
              ),
            )}
          </div>
        </figure>
      </div>

      {/* ---------------------------------------------------------- account */}
      <h2 className="h-section">Account</h2>
      <div className="chartgrid">
        <div className="card" style={{ margin: 0 }}>
          <h3>Signed in</h3>
          <p className="small muted" style={{ marginTop: 0 }}>
            {session?.user.email}
            <br />
            <span className="tiny faint">
              Cloud status: <strong style={{ color: "var(--text-2)" }}>{sync}</strong>. Progress, review
              history, exercise results and quiz answers are stored against this account and readable
              only by you.
            </span>
          </p>
          <button className="btn quiet" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>

        <div className="card" style={{ margin: 0 }}>
          <h3>Tutor key</h3>
          <p className="small muted" style={{ marginTop: 0 }}>
            The tutor calls Anthropic directly from this device using a key you provide. The key is
            stored only in this browser and sent only to Anthropic. Create one at console.anthropic.com.
          </p>
          <input
            type="password"
            defaultValue={getTutorKey()}
            onChange={(e) => { setTutorKey(e.target.value.trim()); refreshTutor(); }}
            placeholder="sk-ant-… (leave blank to hide the tutor)"
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>
      </div>
    </>
  );
}
