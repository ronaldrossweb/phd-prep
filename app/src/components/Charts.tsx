import { useState } from "react";
import type { DayBucket, DeckStat, MasteryBuckets } from "../lib/metrics";
import { pct } from "../lib/metrics";
import { DECK_LABELS } from "../data/cards";

/* ===========================================================================
   Chart primitives, built from CSS boxes rather than a scaled SVG so that
   labels stay crisp at every width and hover targets are real elements.

   Conventions from the house data-viz rules:
   - 2px surface gaps between stacked segments, never borders
   - solid hairline baselines, no dashed grid
   - a legend whenever there is more than one series; labels selective
   - every chart has a table-view twin; tooltips enhance but never gate
   - sans figures; tabular-nums only where numbers stack vertically
   ======================================================================== */

/* ------------------------------------------------------------------ legend */
export function Legend({ items }: { items: { label: string; cls: string; note?: string }[] }) {
  return (
    <ul className="legend">
      {items.map((i) => (
        <li key={i.label}>
          <span className={`swatch ${i.cls}`} />
          {i.label}
          {i.note && <span className="faint"> {i.note}</span>}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------- daily review activity */
export function DayActivity({ days }: { days: DayBucket[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const max = Math.max(1, ...days.map((d) => d.total));
  const active = hover === null ? null : days[hover];

  return (
    <figure className="chart">
      <figcaption className="chart-head">
        <div>
          <h3>Review activity</h3>
          <p className="tiny faint">
            Bar height is how many cards you reviewed; the split is how they went.
          </p>
        </div>
        <button className="tablebtn" onClick={() => setTable((t) => !t)}
                aria-expanded={table}>
          {table ? "Chart" : "Numbers"}
        </button>
      </figcaption>

      <Legend items={[
        { label: "Knew it", cls: "pos" },
        { label: "Hard", cls: "mid" },
        { label: "Forgot", cls: "neg" },
      ]} />

      {table ? (
        <DayTable days={days} />
      ) : (
        <div className="plot" role="group" aria-label="Reviews per day">
          {active && (
            <div className="tip" style={{
              left: `${((hover! + 0.5) / days.length) * 100}%`,
            }}>
              <strong>{new Date(active.date + "T12:00:00").toLocaleDateString("en-US",
                { weekday: "short", month: "short", day: "numeric" })}</strong>
              {active.total === 0 ? (
                <span>no reviews</span>
              ) : (
                <>
                  <span>{active.total} review{active.total === 1 ? "" : "s"}</span>
                  <span>{active.knew} knew · {active.hard} hard · {active.forgot} forgot</span>
                  <span className="tip-accent">
                    {pct((active.hard + active.knew) / active.total)} recalled
                  </span>
                </>
              )}
            </div>
          )}

          <div className="cols">
            {days.map((d, i) => (
              <button
                key={d.date}
                className={`col${hover === i ? " hot" : ""}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                aria-label={`${d.date}: ${d.total} reviews, ${d.knew} knew, ${d.hard} hard, ${d.forgot} forgot`}
              >
                <span className="stack" style={{ height: `${(d.total / max) * 100}%` }}>
                  {d.knew > 0 && <span className="seg pos" style={{ flexGrow: d.knew }} />}
                  {d.hard > 0 && <span className="seg mid" style={{ flexGrow: d.hard }} />}
                  {d.forgot > 0 && <span className="seg neg" style={{ flexGrow: d.forgot }} />}
                </span>
              </button>
            ))}
          </div>

          <div className="axis">
            {days.map((d, i) => (
              <span key={d.date} className="tick">
                {days.length <= 14 || i % 3 === 0 ? d.label : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </figure>
  );
}

function DayTable({ days }: { days: DayBucket[] }) {
  const rows = days.filter((d) => d.total > 0);
  if (rows.length === 0) return <p className="small faint">No reviews in this window yet.</p>;
  return (
    <div className="tablewrap">
      <table className="datatable">
        <thead>
          <tr><th>Day</th><th>Knew</th><th>Hard</th><th>Forgot</th><th>Recalled</th></tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.date}>
              <td>{new Date(d.date + "T12:00:00").toLocaleDateString("en-US",
                { month: "short", day: "numeric" })}</td>
              <td>{d.knew}</td><td>{d.hard}</td><td>{d.forgot}</td>
              <td>{pct((d.hard + d.knew) / d.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------------------------------- accuracy by deck */
export function DeckAccuracy({ byDeck }: { byDeck: DeckStat[] }) {
  const any = byDeck.some((d) => d.reviews > 0);
  return (
    <figure className="chart">
      <figcaption className="chart-head">
        <div>
          <h3>Recall by deck</h3>
          <p className="tiny faint">
            Share of reviews you recalled at all — Hard still counts as remembered.
          </p>
        </div>
      </figcaption>

      {!any ? (
        <p className="small faint">Grade some cards and this fills in.</p>
      ) : (
        <div className="hbars">
          {byDeck.map((d) => (
            <div className="hbar" key={d.deck}>
              <span className="hbar-label">{DECK_LABELS[d.deck]}</span>
              <span className="hbar-track">
                <span className="hbar-fill" style={{ width: `${d.recall * 100}%` }} />
              </span>
              <span className="hbar-val num">
                {d.reviews ? pct(d.recall) : "—"}
                <span className="faint tiny"> {d.reviews ? `n=${d.reviews}` : "no reviews"}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </figure>
  );
}

/* ------------------------------------------------- mastery distribution */
const MASTERY_STEPS: { key: keyof MasteryBuckets; label: string; cls: string }[] = [
  { key: "fresh",    label: "Unseen",   cls: "r1" },
  { key: "learning", label: "Learning", cls: "r2" },
  { key: "young",    label: "Holding",  cls: "r3" },
  { key: "mature",   label: "Locked in", cls: "r4" },
];

export function MasteryBar({ mastery }: { mastery: MasteryBuckets }) {
  const total = MASTERY_STEPS.reduce((a, s) => a + mastery[s.key], 0) || 1;
  return (
    <figure className="chart">
      <figcaption className="chart-head">
        <div>
          <h3>Where the deck stands</h3>
          <p className="tiny faint">
            By scheduling interval: learning under a week, holding to three weeks,
            locked in beyond.
          </p>
        </div>
      </figcaption>

      <div className="stackbar" role="img"
           aria-label={MASTERY_STEPS.map((s) => `${s.label} ${mastery[s.key]}`).join(", ")}>
        {MASTERY_STEPS.map((s) =>
          mastery[s.key] > 0 ? (
            <span key={s.key} className={`sseg ${s.cls}`}
                  style={{ flexGrow: mastery[s.key] }} />
          ) : null,
        )}
      </div>

      <Legend items={MASTERY_STEPS.map((s) => ({
        label: s.label,
        cls: s.cls,
        note: `${mastery[s.key]}`,
      }))} />
      <p className="tiny faint" style={{ marginBottom: 0 }}>
        {Math.round((mastery.mature / total) * 100)}% of {total} cards are locked in.
      </p>
    </figure>
  );
}

/* -------------------------------------------------------------- sparkline */
export function Sparkline({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const W = 100, H = 28, pad = 2;
  const step = (W - pad * 2) / (points.length - 1);
  const d = points
    .map((v, i) => `${i === 0 ? "M" : "L"} ${(pad + i * step).toFixed(2)} ${(H - pad - v * (H - pad * 2)).toFixed(2)}`)
    .join(" ");
  const last = points[points.length - 1];
  return (
    <svg className="spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={(pad + (points.length - 1) * step).toFixed(2)}
              cy={(H - pad - last * (H - pad * 2)).toFixed(2)} r="2.6" fill="currentColor" />
    </svg>
  );
}
