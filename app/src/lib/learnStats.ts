/**
 * Exercise and quiz accuracy, read from the user's own rows in Supabase.
 * Row-level security means these queries can only ever return the signed-in
 * user's data.
 */
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { MODULES } from "../data/modules";

export type LearnStats = {
  quizAnswered: number;
  quizCorrect: number;
  exerciseAttempts: number;
  exercisePassed: number;
  /** distinct exercises passed at least once */
  exercisesSolved: number;
  totalExercises: number;
  modulesCompleted: number;
  totalModules: number;
  byModule: { id: string; title: string; quizAcc: number | null; quizN: number; exSolved: number; exTotal: number }[];
};

export async function fetchLearnStats(session: Session | null, windowDays: number): Promise<LearnStats | null> {
  if (!session) return null;
  const uid = session.user.id;
  const since = new Date(Date.now() - windowDays * 86_400_000).toISOString();

  const [{ data: quiz }, { data: ex }, { data: mp }] = await Promise.all([
    supabase.from("quiz_answers").select("module_id, question_id, correct, answered_at")
      .eq("user_id", uid).gte("answered_at", since).limit(5000),
    supabase.from("exercise_attempts").select("module_id, exercise_id, passed, attempted_at")
      .eq("user_id", uid).limit(5000),
    supabase.from("module_progress").select("module_id, completed_at").eq("user_id", uid),
  ]);

  const q = quiz ?? [], e = ex ?? [];
  const solved = new Set(e.filter((r) => r.passed).map((r) => `${r.module_id}/${r.exercise_id}`));
  const totalExercises = MODULES.reduce((a, m) => a + m.exercises.length, 0);

  const byModule = MODULES.map((m) => {
    const mq = q.filter((r) => r.module_id === m.id);
    const exSolved = m.exercises.filter((x) => solved.has(`${m.id}/${x.id}`)).length;
    return {
      id: m.id, title: m.title,
      quizN: mq.length,
      quizAcc: mq.length ? mq.filter((r) => r.correct).length / mq.length : null,
      exSolved, exTotal: m.exercises.length,
    };
  }).filter((r) => r.quizN > 0 || r.exSolved > 0);

  return {
    quizAnswered: q.length,
    quizCorrect: q.filter((r) => r.correct).length,
    exerciseAttempts: e.filter((r) => r.attempted_at >= since).length,
    exercisePassed: e.filter((r) => r.passed && r.attempted_at >= since).length,
    exercisesSolved: solved.size,
    totalExercises,
    modulesCompleted: (mp ?? []).filter((r) => r.completed_at).length,
    totalModules: MODULES.length,
    byModule,
  };
}
