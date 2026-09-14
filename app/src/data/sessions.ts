import { modulesForSession, type Module } from "./modules";

export type Track = "stats" | "ethics" | "both";

export type Block = {
  minutes: number;
  track: Track;
  title: string;
  detail: string;
  /** a file under ~/PhD, or an in-app route when it starts with "/" */
  resource?: string;
};

export type Session = {
  n: number;
  date: string;      // ISO, America/Denver
  day: string;
  start: string;
  hours: number;
  week: number;
  theme: string;
  /** what this session covers in the PhDAI 730 syllabus's own terms */
  syllabus: string;
  blocks: Block[];
};

export const TERM_START = "2026-10-19";
export const PREP_START = "2026-09-15";

/* ---------------------------------------------------------------------------
   Fifteen prep sessions, Sep 15 → Oct 17. Blocks are generated from the
   lessons scheduled for each session (src/data/modules.ts) plus a closing
   cards-and-notation block, so the plan and the lessons cannot drift apart.
   Themes follow the PhDAI 730 syllabus order: McClave ch 3–5 → 11 → 12 →
   13 → 14, with the Das Python chapters interleaved.
   ------------------------------------------------------------------------ */
type Spec = { n: number; date: string; day: string; start: string; hours: number; week: number; theme: string; syllabus: string; notation?: string };

const SPEC: Spec[] = [
  { n: 1,  date: "2026-09-15", day: "Tue", start: "4:00am", hours: 2, week: 1, theme: "Ground zero — first data, first Python, first probability",
    syllabus: "McClave ch 3 (Probability) · Das ch 1–2", notation: "n, x̄ vs µ, Σ, P(·)" },
  { n: 2,  date: "2026-09-17", day: "Thu", start: "4:00am", hours: 2, week: 1, theme: "Shape, center, spread — functions — the ethics landscape",
    syllabus: "McClave ch 2 recap · Das ch 6 (Functions)", notation: "σ, σ², median, IQR" },
  { n: 3,  date: "2026-09-19", day: "Sat", start: "5:00am", hours: 3, week: 1, theme: "Discrete random variables — lists & dicts — NIST AI RMF",
    syllabus: "McClave ch 4 (Discrete RVs: binomial, Poisson) · Das ch 9–10", notation: "E(X), Var(X), X ~ Bin(n, p), X ~ Pois(λ)" },
  { n: 4,  date: "2026-09-22", day: "Tue", start: "4:00am", hours: 2, week: 2, theme: "Continuous random variables — and Bayes by counting",
    syllabus: "McClave ch 5 (Normal, uniform, exponential) · ch 3 §3.7 Bayes", notation: "X ~ N(µ, σ²), z, P(A|B)" },
  { n: 5,  date: "2026-09-24", day: "Thu", start: "4:00am", hours: 2, week: 2, theme: "The CLT and the standard error — the bias taxonomy",
    syllabus: "McClave ch 5 → sampling distributions (bridge to inference)", notation: "x̄ ~ N(µ, σ/√n), SE" },
  { n: 6,  date: "2026-09-26", day: "Sat", start: "5:00am", hours: 3, week: 2, theme: "Hypothesis testing — classes — the fairness impossibility",
    syllabus: "Inference recap the regression chapters assume · Das ch 11 (Classes)", notation: "H₀, Hₐ, α, p, t" },
  { n: 7,  date: "2026-09-29", day: "Tue", start: "4:00am", hours: 2, week: 3, theme: "Errors and power — simple linear regression",
    syllabus: "McClave ch 11 §11.1–11.4 (the model, least squares, r, r²)", notation: "β₀, β₁, ŷ, ε, SSE, r, r²" },
  { n: 8,  date: "2026-10-01", day: "Thu", start: "4:00am", hours: 2, week: 3, theme: "Inference in regression — transparency & explainability",
    syllabus: "McClave ch 11 §11.5–11.7 (slope test, CI vs PI)", notation: "s_β̂₁, t, CI for E(y), PI" },
  { n: 9,  date: "2026-10-03", day: "Sat", start: "5:00am", hours: 3, week: 3, theme: "Multiple regression — pandas for data science — SR 11-7",
    syllabus: "McClave ch 12 §12.1–12.4 (F-test, adjusted R², VIF) · Das ch 15", notation: "F, R²_adj, VIF, k" },
  { n: 10, date: "2026-10-06", day: "Tue", start: "4:00am", hours: 2, week: 4, theme: "Model building — and the chi-square goodness-of-fit test",
    syllabus: "McClave ch 12 §12.5–12.9 · ch 13 §13.1–13.2", notation: "x₁x₂, x², dummies, nested F, χ², Eᵢ" },
  { n: 11, date: "2026-10-08", day: "Thu", start: "4:00am", hours: 2, week: 4, theme: "Contingency tables — privacy & societal impact",
    syllabus: "McClave ch 13 §13.3–13.4 (test of independence)", notation: "Êᵢⱼ = rᵢcⱼ/n, (r−1)(c−1) df" },
  { n: 12, date: "2026-10-10", day: "Sat", start: "5:00am", hours: 3, week: 4, theme: "Residual diagnostics — classification — your first APA paper",
    syllabus: "McClave ch 12 §12.12 (residual analysis) · logistic regression for the case study", notation: "standardised residual, Cook's D, Q–Q" },
  { n: 13, date: "2026-10-13", day: "Tue", start: "4:00am", hours: 2, week: 5, theme: "Nonparametric statistics, end to end",
    syllabus: "McClave ch 14 (sign, rank-sum, signed-rank, Kruskal–Wallis, Friedman, Spearman)", notation: "S, T₁, T₊, H, F_r, r_s" },
  { n: 14, date: "2026-10-15", day: "Thu", start: "4:00am", hours: 2, week: 5, theme: "The case-study workflow — and the discussion-board voice",
    syllabus: "Case Study Parts 1–2 rehearsal (300 of the 1,000 points)", notation: "APA statistics format" },
  { n: 15, date: "2026-10-17", day: "Sat", start: "5:00am", hours: 3, week: 5, theme: "Final review — where both courses meet — launch readiness",
    syllabus: "Every method once · Practical Connection · model evaluation & fairness", notation: "the whole cheatsheet" },
];

const TRACK_WORD: Record<Track, string> = { stats: "Statistics", ethics: "Ethics", both: "Both" };

function blockFor(m: Module): Block {
  const steps = [m.video ? "watch" : null, "read", m.exercises.length ? "practise" : null, m.quiz.length ? "quiz" : null].filter(Boolean).join(" · ");
  return { minutes: m.minutes, track: m.track, title: m.title, detail: `${TRACK_WORD[m.track]} lesson — ${steps}. ${m.summary}`, resource: `/learn/${m.id}` };
}

export const SESSIONS: Session[] = SPEC.map((s) => {
  const lessons = modulesForSession(s.n).map(blockFor);
  const used = lessons.reduce((a, b) => a + b.minutes, 0);
  const spare = Math.max(10, s.hours * 60 - used);
  const closing: Block = {
    minutes: Math.min(spare, 30), track: "both",
    title: s.notation ? `Cards & notation: ${s.notation}` : "Cards & notation",
    detail: s.n === 15
      ? "Clear the whole review queue, then re-read the notation cheatsheet end to end — and keep it open during your first 730 lecture."
      : "Clear the review queue, then open the notation decoder for today's symbols and say each one out loud in plain English.",
    resource: "/cards",
  };
  return { ...s, blocks: [...lessons, closing] };
});

export const TOTAL_HOURS = SESSIONS.reduce((s, x) => s + x.hours, 0);
