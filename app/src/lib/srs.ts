/**
 * SM-2 spaced repetition.
 *
 * Each card carries an ease factor, an interval in days, and a repetition count.
 * Grading a card updates those and schedules the next review. Grades:
 *   0 = again (forgot)   1 = hard   2 = good   3 = easy
 */

export type Grade = 0 | 1 | 2 | 3;

export type CardState = {
  ease: number;        // ease factor, 1.3 .. 2.8
  interval: number;    // days until next review
  reps: number;        // successful reviews in a row
  lapses: number;      // times forgotten
  due: string;         // ISO date-time
  lastReviewed: string;
};

export const MIN_EASE = 1.3;
export const MAX_EASE = 2.8;

export function initialState(now = new Date()): CardState {
  return {
    ease: 2.5,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: now.toISOString(),
    lastReviewed: "",
  };
}

const DAY = 86_400_000;

export function grade(state: CardState, g: Grade, now = new Date()): CardState {
  let { ease, interval, reps, lapses } = state;

  if (g === 0) {
    // Forgot: reset the interval, drop ease, count a lapse. Card comes back today.
    lapses += 1;
    reps = 0;
    interval = 0;
    ease = Math.max(MIN_EASE, ease - 0.2);
    return {
      ease, interval, reps, lapses,
      due: new Date(now.getTime() + 60_000).toISOString(), // ~1 min, i.e. this session
      lastReviewed: now.toISOString(),
    };
  }

  // Ease adjustment per SM-2, mapped to our 1..3 grades.
  if (g === 1) ease = Math.max(MIN_EASE, ease - 0.15);
  if (g === 3) ease = Math.min(MAX_EASE, ease + 0.15);

  reps += 1;

  // First two reps use fixed steps so the grade buttons offer genuinely
  // different promises (Good and Easy previously both landed on 2 days).
  if (reps === 1) interval = g === 1 ? 1 : g === 2 ? 2 : 4;
  else if (reps === 2) interval = g === 1 ? 3 : g === 2 ? 6 : 10;
  else interval = Math.round(interval * (g === 1 ? Math.max(1.2, ease - 0.4) : ease));

  interval = Math.min(interval, 180);

  return {
    ease, interval, reps, lapses,
    due: new Date(now.getTime() + interval * DAY).toISOString(),
    lastReviewed: now.toISOString(),
  };
}

export function isDue(state: CardState | undefined, now = new Date()): boolean {
  if (!state) return true;              // never seen -> due
  return new Date(state.due) <= now;
}

/** Human-readable next-review hint, for the grading buttons. */
export function previewInterval(state: CardState, g: Grade): string {
  if (g === 0) return "now";
  const next = grade(state, g).interval;
  if (next === 0) return "now";
  if (next === 1) return "1 day";
  if (next < 30) return `${next} days`;
  const months = Math.round(next / 30);
  return months === 1 ? "1 month" : `${months} months`;
}

/** Mastery 0..1 — how well established a card is. */
export function mastery(state: CardState | undefined): number {
  if (!state || state.reps === 0) return 0;
  return Math.min(1, state.interval / 21);
}
