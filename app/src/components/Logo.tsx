import type { SVGProps } from "react";

/* ---------------------------------------------------------------------------
   The mark: a normal distribution cut by a decision threshold, with the
   flagged tail beyond it. Statistics on one axis, the policy choice on the
   other — which is what these two courses are about together.
   Geometry matches the generated PNG icons in /public.
   ------------------------------------------------------------------------ */

const PEAK = 16, SIGMA = 4.7, BASE = 24.8, HEIGHT = 15.2;
const THRESH = 20.3, X0 = 4, X1 = 28, GAP = 0.7;

const y = (x: number) => BASE - HEIGHT * Math.exp(-((x - PEAK) ** 2) / (2 * SIGMA ** 2));

/** Filled area under the curve from a to b. */
function area(a: number, b: number, step = 0.35): string {
  let d = `M ${a} ${BASE}`;
  for (let x = a; x < b; x += step) d += ` L ${x.toFixed(2)} ${y(x).toFixed(2)}`;
  return `${d} L ${b} ${y(b).toFixed(2)} L ${b} ${BASE} Z`;
}

/** Just the curve, as a stroke. */
function strokePath(a: number, b: number, step = 0.35): string {
  let d = `M ${a} ${y(a).toFixed(2)}`;
  for (let x = a; x < b; x += step) d += ` L ${x.toFixed(2)} ${y(x).toFixed(2)}`;
  return `${d} L ${b} ${y(b).toFixed(2)}`;
}

const BODY = area(X0, THRESH - GAP);
const TAIL = area(THRESH + GAP, X1);

/* The drawing occupies x 4..28 and y ~9.6..24.8, so a 0 0 32 32 viewBox wastes
   most of the box and the mark reads as a blob at 24px. Crop to the ink. */
const VB = `${X0 - 0.8} ${(y(PEAK) - 0.8).toFixed(2)} ${X1 - X0 + 1.6} ${(BASE - y(PEAK) + 1.6).toFixed(2)}`;

export function Mark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VB} fill="none" aria-hidden="true" {...props}>
      <path d={BODY} fill="currentColor" />
      <path d={TAIL} fill="currentColor" opacity=".52" />
    </svg>
  );
}

/** Large decorative curve for the hero. */
export function HeroCurve(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="2 6 28 21" fill="none" aria-hidden="true" {...props}>
      <path d={strokePath(X0, X1, 0.2)} stroke="currentColor" strokeWidth="1.1"
            strokeLinecap="round" fill="none" />
      <path d={TAIL} fill="currentColor" opacity=".3" />
      <path d={`M ${THRESH} ${BASE + 1} L ${THRESH} ${(y(THRESH) - 1).toFixed(2)}`}
            stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d={`M ${X0} ${BASE} L ${X1} ${BASE}`} stroke="currentColor"
            strokeWidth=".7" opacity=".55" strokeLinecap="round" />
    </svg>
  );
}

export function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Mark style={{ color: "var(--brass)" }} />
      </span>
      <span style={{ minWidth: 0 }}>
        <div className="brand-name">PhD Prep</div>
        <div className="brand-sub">PhDAI 730 · 832</div>
      </span>
    </div>
  );
}
