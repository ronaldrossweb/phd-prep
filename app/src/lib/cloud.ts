/**
 * Cloud persistence on Supabase.
 *
 * Offline-first stays the rule: localStorage is written first and instantly;
 * the cloud copy is pulled on sign-in and merged, then pushed in the
 * background after every change. Reviews are an append-only log, so only the
 * events newer than the last successful push are inserted.
 */
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { type Progress, type ReviewEvent, merge, MAX_REVIEWS } from "./store";

export type CloudStatus = "off" | "syncing" | "ok" | "error" | "offline";

const PUSHED_KEY = "phd-prep-reviews-pushed-until";

function pushedUntil(): number {
  try { return Number(localStorage.getItem(PUSHED_KEY) ?? 0); } catch { return 0; }
}
function setPushedUntil(ms: number) {
  try { localStorage.setItem(PUSHED_KEY, String(ms)); } catch { /* ignore */ }
}

/** Pull the user's state and review log from the cloud and merge with local. */
export async function pullCloud(session: Session, local: Progress): Promise<Progress> {
  const uid = session.user.id;

  const [{ data: st }, { data: rv }] = await Promise.all([
    supabase.from("study_state").select("state").eq("user_id", uid).maybeSingle(),
    supabase.from("reviews").select("card_id, grade, reviewed_at")
      .eq("user_id", uid).order("reviewed_at", { ascending: true }).limit(MAX_REVIEWS),
  ]);

  const remote: Progress = {
    ...(st?.state as Progress | undefined ?? { cards: {}, sessionsDone: {}, blocksDone: {}, minutesLogged: 0, updatedAt: new Date(0).toISOString() }),
    reviews: (rv ?? []).map((r) => [r.card_id, r.grade, new Date(r.reviewed_at).getTime()] as ReviewEvent),
  };
  if (!remote.cards) remote.cards = {};

  return merge(local, remote);
}

let timer: ReturnType<typeof setTimeout> | undefined;

/** Debounced background push of state + any new review events. */
export function pushCloudDebounced(
  session: Session | null,
  p: Progress,
  onStatus: (s: CloudStatus) => void,
) {
  if (!session) { onStatus("off"); return; }
  clearTimeout(timer);
  timer = setTimeout(() => void pushCloud(session, p, onStatus), 1200);
}

export async function pushCloud(session: Session, p: Progress, onStatus: (s: CloudStatus) => void) {
  if (!navigator.onLine) { onStatus("offline"); return; }
  onStatus("syncing");
  const uid = session.user.id;
  try {
    // 1. the state document (everything except the review log)
    const { reviews, ...doc } = p;
    const { error: e1 } = await supabase.from("study_state")
      .upsert({ user_id: uid, state: doc, updated_at: new Date().toISOString() });
    if (e1) throw e1;

    // 2. new review events only
    const since = pushedUntil();
    const fresh = (reviews ?? []).filter(([, , at]) => at > since);
    if (fresh.length) {
      const rows = fresh.map(([card_id, grade, at]) => ({
        user_id: uid, card_id, grade, reviewed_at: new Date(at).toISOString(),
      }));
      const { error: e2 } = await supabase.from("reviews")
        .upsert(rows, { onConflict: "user_id,card_id,reviewed_at", ignoreDuplicates: true });
      if (e2) throw e2;
      setPushedUntil(Math.max(...fresh.map((f) => f[2])));
    }
    onStatus("ok");
  } catch {
    onStatus("error");
  }
}

/* ---------------------------------------------------------- lesson events */

export async function logExercise(session: Session | null, moduleId: string, exerciseId: string, passed: boolean, code: string) {
  if (!session) return;
  await supabase.from("exercise_attempts").insert({
    user_id: session.user.id, module_id: moduleId, exercise_id: exerciseId, passed, code: code.slice(0, 4000),
  });
}

export async function logQuiz(session: Session | null, moduleId: string, questionId: string, chosen: string, correct: boolean) {
  if (!session) return;
  await supabase.from("quiz_answers").insert({
    user_id: session.user.id, module_id: moduleId, question_id: questionId, chosen, correct,
  });
}

export async function saveModuleProgress(session: Session | null, moduleId: string, stepsDone: string[], completed: boolean) {
  if (!session) return;
  await supabase.from("module_progress").upsert({
    user_id: session.user.id, module_id: moduleId, steps_done: stepsDone,
    completed_at: completed ? new Date().toISOString() : null, updated_at: new Date().toISOString(),
  });
}
