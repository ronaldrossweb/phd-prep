import type { Exercise } from "../components/Practice";
import type { Track } from "./sessions";

/* ---------------------------------------------------------------------------
   A module is one self-contained lesson: watch → read → practice → quiz.
   Sessions are made of modules. Every video id below is verified against
   YouTube's oEmbed endpoint by scripts/verify-videos.mjs before a deploy.
   ------------------------------------------------------------------------ */

export type Video = {
  youtubeId: string;
  title: string;
  channel: string;
  minutes: number;
  watchFor: string[];   // 2–4 things to notice
};

export type Reading = {
  /** Markdown-lite paragraphs (fmt): **bold**, `code`, ```fences``` */
  body: string[];
  keyIdea: string;
};

export type QuizQuestion = {
  id: string;
  q: string;
  choices: string[];
  answer: number;        // index into choices
  why: string;           // shown after answering
};

export type Module = {
  id: string;
  session: number;
  track: Track;
  title: string;
  minutes: number;
  summary: string;
  video?: Video;
  reading: Reading;
  exercises: Exercise[];
  quiz: QuizQuestion[];
  /** heavier Pyodide packages to load for this module's practice */
  packages?: string[];
  /** Python run before every Run/Check so each exercise stands alone
      (loads the data the module works with). Must be idempotent. */
  setup?: string;
};

export type StepKind = "watch" | "read" | "practice" | "quiz";

export function stepsFor(m: Module): StepKind[] {
  const s: StepKind[] = [];
  if (m.video) s.push("watch");
  s.push("read");
  if (m.exercises.length) s.push("practice");
  if (m.quiz.length) s.push("quiz");
  return s;
}

// Content lives in per-topic files to keep each one reviewable.
import { WEEK1 } from "./modules/week1";
import { WEEK2 } from "./modules/week2";
import { WEEK3 } from "./modules/week3";
import { WEEK4 } from "./modules/week4";
import { WEEK5 } from "./modules/week5";
import { COURSE_W1 } from "./modules/course-w1";
import { COURSE_PY } from "./modules/course-py";
import { COURSE_REG } from "./modules/course-w2-w5";
import { COURSE_CAT_NP } from "./modules/course-w4-w8";

/** The order lessons appear inside a session (and in prev/next navigation). */
const ORDER: Record<number, string[]> = {
  1: ["s1-first-contact", "py-basics", "w1-probability"],
  2: ["s2-shape-center-spread", "py-functions", "s2-framework-map"],
  3: ["w1-discrete-rv", "py-lists-dicts", "s3-nist-rmf"],
  4: ["w1-continuous-rv", "s6-bayes"],
  5: ["s9-clt", "s5-bias-taxonomy"],
  6: ["s10-hypothesis-testing", "py-classes", "s6-fairness-impossibility"],
  7: ["s11-errors-power", "w2-simple-regression"],
  8: ["w3-regression-inference", "s8-transparency"],
  9: ["w3-multiple-regression", "py-data-science", "s9-sr117"],
  10: ["w4-model-building", "w4-chi-square-gof"],
  11: ["w5-contingency-tables", "s11-privacy-impact"],
  12: ["w5-residuals-diagnostics", "s14-classification", "s12-apa-brief"],
  13: ["w6-nonparametric-one-two", "w6-nonparametric-many", "w7-spearman-and-choosing"],
  14: ["w7-case-study-workflow", "s14-banking-cases"],
  15: ["w8-review-and-practical-connection", "s15-model-evaluation"],
  0: ["s3-distribution-zoo", "s4-randomness", "s5-conditioning", "s7-expectation-variance", "s8-normal",
      "s12-bootstrap", "s13-regression", "py-recursion", "py-inheritance", "py-strings", "py-files-exceptions", "py-modules"],
};

const POOL: Module[] = [...WEEK1, ...WEEK2, ...WEEK3, ...WEEK4, ...WEEK5, ...COURSE_W1, ...COURSE_PY, ...COURSE_REG, ...COURSE_CAT_NP];
const byId = new Map(POOL.map((m) => [m.id, m]));
const pick = (ids: string[]) => ids.map((id) => { const m = byId.get(id); if (!m) throw new Error(`module missing: ${id}`); return m; });

/** The 15-session prep plan, in teaching order (session 1 → 15). */
export const MODULES: Module[] = Array.from({ length: 15 }, (_, i) => pick(ORDER[i + 1] ?? [])).flat();
/** Optional foundations & extra Das chapters — reachable from the Course page and the Learn index, not scheduled. */
export const EXTRAS: Module[] = pick(ORDER[0]);
export const ALL_MODULES: Module[] = [...MODULES, ...EXTRAS];

export const modulesForSession = (n: number) => MODULES.filter((m) => m.session === n);
export const moduleById = (id: string) => ALL_MODULES.find((m) => m.id === id);
