import { useEffect, useRef, useState, type ReactNode } from "react";

/* ===========================================================================
   Motion toolkit. Everything here respects prefers-reduced-motion.
   ======================================================================== */

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------- count-up */
/** Animates a number from 0 to `value` with an ease-out curve. */
export function useCountUp(value: number, ms = 900): number {
  const [v, setV] = useState(reducedMotion() ? value : 0);
  const from = useRef(0);
  useEffect(() => {
    if (reducedMotion() || document.visibilityState === "hidden") { setV(value); from.current = value; return; }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(a + (value - a) * e));
      if (p < 1) raf = requestAnimationFrame(step);
      else from.current = value;
    };
    raf = requestAnimationFrame(step);
    // Safety net: whatever happens to rAF, land on the real value.
    const settle = setTimeout(() => { setV(value); from.current = value; }, ms + 200);
    return () => { cancelAnimationFrame(raf); clearTimeout(settle); };
  }, [value, ms]);
  return v;
}

/* -------------------------------------------------------- progress ring */
export function Ring({ value, size = 44, stroke = 4, children, tone = "brass" }: {
  value: number; size?: number; stroke?: number; children?: ReactNode; tone?: "brass" | "good" | "muted";
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, value)));
  return (
    <span className={`ring ring-${tone}`} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-fill" strokeWidth={stroke}
                strokeDasharray={c} strokeDashoffset={off}
                transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <span className="ring-label">{children}</span>
    </span>
  );
}

/* --------------------------------------------------------------- confetti */
/** A brief burst of brass and ink particles. Fire-and-forget. */
export function burst(origin?: { x: number; y: number }) {
  if (reducedMotion()) return;
  const host = document.createElement("div");
  host.className = "confetti";
  document.body.appendChild(host);
  const cx = origin?.x ?? window.innerWidth / 2;
  const cy = origin?.y ?? window.innerHeight * 0.35;
  const colors = ["#CEA65E", "#E3C288", "#1FA57F", "#74AEE8", "#E9ECF2"];
  const n = 42;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    const a = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.6;
    const v = 140 + Math.random() * 220;
    p.style.setProperty("--dx", `${Math.cos(a) * v}px`);
    p.style.setProperty("--dy", `${Math.sin(a) * v - 120}px`);
    p.style.setProperty("--r", `${Math.random() * 720 - 360}deg`);
    p.style.setProperty("--c", colors[i % colors.length]);
    p.style.setProperty("--s", `${6 + Math.random() * 6}px`);
    p.style.left = `${cx}px`; p.style.top = `${cy}px`;
    host.appendChild(p);
  }
  setTimeout(() => host.remove(), 1400);
}

/* ------------------------------------------------------------ toast float */
/** Floats a short label up from an element, e.g. "+2 days". */
export function floatLabel(el: Element, text: string) {
  if (reducedMotion()) return;
  const r = el.getBoundingClientRect();
  const t = document.createElement("div");
  t.className = "floatlabel";
  t.textContent = text;
  t.style.left = `${r.left + r.width / 2}px`;
  t.style.top = `${r.top}px`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 900);
}

/* ----------------------------------------------------------- reveal on scroll */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(reducedMotion());
  useEffect(() => {
    if (reducedMotion() || !ref.current) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setOn(true); io.disconnect(); }
    }, { rootMargin: "0px 0px -8% 0px" });
    io.observe(ref.current);
    const fallback = setTimeout(() => { setOn(true); io.disconnect(); }, 900);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);
  return (
    <div ref={ref} className={`reveal${on ? " in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ----------------------------------------------------------- animated mark */
/** The brand curve drawing itself in, used on the sign-in hero. */
export function DrawnMark({ size = 220 }: { size?: number }) {
  const PEAK = 16, SIGMA = 4.7, BASE = 24.8, HEIGHT = 15.2, TH = 20.3, X0 = 4, X1 = 28;
  const y = (x: number) => BASE - HEIGHT * Math.exp(-((x - PEAK) ** 2) / (2 * SIGMA ** 2));
  let d = `M ${X0} ${y(X0).toFixed(2)}`;
  for (let x = X0; x <= X1; x += 0.2) d += ` L ${x.toFixed(2)} ${y(x).toFixed(2)}`;
  let tail = `M ${TH + 0.7} ${BASE}`;
  for (let x = TH + 0.7; x <= X1; x += 0.2) tail += ` L ${x.toFixed(2)} ${y(x).toFixed(2)}`;
  tail += ` L ${X1} ${BASE} Z`;
  return (
    <svg className="drawnmark" viewBox="2 7 28 20" width={size} height={size * 20 / 28} aria-hidden="true">
      <path className="dm-base" d={`M ${X0} ${BASE} L ${X1} ${BASE}`} />
      <path className="dm-tail" d={tail} />
      <path className="dm-curve" d={d} pathLength={100} />
      <path className="dm-th" d={`M ${TH} ${BASE + 1} L ${TH} ${(y(TH) - 1.2).toFixed(2)}`} pathLength={100} />
    </svg>
  );
}
