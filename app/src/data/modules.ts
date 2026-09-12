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

// Content lives in per-week files to keep each one reviewable.
import { WEEK1 } from "./modules/week1";
import { WEEK2 } from "./modules/week2";
import { WEEK3 } from "./modules/week3";
import { WEEK4 } from "./modules/week4";
import { WEEK5 } from "./modules/week5";

export const MODULES: Module[] = [...WEEK1, ...WEEK2, ...WEEK3, ...WEEK4, ...WEEK5];

export const modulesForSession = (n: number) => MODULES.filter((m) => m.session === n);
export const moduleById = (id: string) => MODULES.find((m) => m.id === id);
