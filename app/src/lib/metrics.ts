/**
 * Everything the dashboard reports, derived from the review log and card states.
 *
 * Two accuracy numbers, deliberately, because one would be ambiguous:
 *   recall     — you remembered it at all      (Hard, Good or Easy)
 *   confident  — you remembered it comfortably (Good or Easy)
 * Reporting only the first flatters; only the second punishes honest "Hard"
 * answers. Both together are the truthful summary.
 */
import { CARDS, type Deck } from "../data/cards";
import type { CardState } from "./srs";
import type { Progress, ReviewEvent } from "./store";
import { TZ } from "./store";

export type DayBucket = {
  date: string;      // YYYY-MM-DD, local
  label: string;     // short axis label
  forgot: number;    // grade 0
  hard: number;      // grade 1
  knew: number;      // grade 2 or 3
  total: number;
};

export type DeckStat = {
  deck: Deck;
  reviews: number;
  recall: number;      // 0..1, NaN-free (0 when no reviews)
  confident: number;
  unlocked: number;
  size: number;
};

export type MasteryBuckets = {
  fresh: number;     // never reviewed
  learning: number;  // interval < 7 days
  young: number;     // 7–20 days
  mature: number;    // 21 days or more
};

export type Metrics = {
  reviews: number;
  recall: number;
  confident: number;
  today: number;
  streak: number;
  days: DayBucket[];
  byDeck: DeckStat[];
  mastery: MasteryBuckets;
  /** Rolling recall accuracy per day that had reviews, for the sparkline. */
  trend: { date: string; value: number }[];
  hardest: { id: string; front: string; lapses: number; reviews: number }[];
};

const localDate = (ms: number) =>
  new Date(ms).toLocaleDateString("en-CA", { timeZone: TZ });

export const deckOf = (cardId: string) => cardId.split("-")[0] as Deck;

function emptyDay(date: string): DayBucket {
  const d = new Date(date + "T12:00:00");
  return {
    date,
    label: d.toLocaleDateString("en-US", { weekday: "narrow" }),
    forgot: 0, hard: 0, knew: 0, total: 0,
  };
}

export function computeMetrics(progress: Progress, windowDays: number): Metrics {
  const log: ReviewEvent[] = progress.reviews ?? [];
  const cards = progress.cards ?? {};

  /* ---------------------------------------------------------- day buckets */
  const days: DayBucket[] = [];
  const byDate = new Map<string, DayBucket>();
  const now = new Date();
  for (let i = windowDays - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86_400_000);
    const key = d.toLocaleDateString("en-CA", { timeZone: TZ });
    const b = emptyDay(key);
    days.push(b);
    byDate.set(key, b);
  }

  const windowStart = days.length ? days[0].date : localDate(Date.now());

  /* ------------------------------------------------- totals (whole window) */
  let reviews = 0, recalled = 0, confident = 0;
  const deckAgg = new Map<Deck, { n: number; r: number; c: number }>();
  const perCard = new Map<string, number>();

  for (const [id, g, at] of log) {
    const date = localDate(at);
    if (date < windowStart) continue;

    reviews += 1;
    if (g >= 1) recalled += 1;
    if (g >= 2) confident += 1;

    const bucket = byDate.get(date);
    if (bucket) {
      bucket.total += 1;
      if (g === 0) bucket.forgot += 1;
      else if (g === 1) bucket.hard += 1;
      else bucket.knew += 1;
    }

    const dk = deckOf(id);
    const agg = deckAgg.get(dk) ?? { n: 0, r: 0, c: 0 };
    agg.n += 1;
    if (g >= 1) agg.r += 1;
    if (g >= 2) agg.c += 1;
    deckAgg.set(dk, agg);

    perCard.set(id, (perCard.get(id) ?? 0) + 1);
  }

  /* ------------------------------------------------------------- by deck */
  const decks: Deck[] = ["notation", "stats", "python", "ethics"];
  const byDeck: DeckStat[] = decks.map((deck) => {
    const a = deckAgg.get(deck) ?? { n: 0, r: 0, c: 0 };
    const all = CARDS.filter((c) => c.deck === deck);
    const unlocked = all.filter((c) => cards[c.id]).length;
    return {
      deck,
      reviews: a.n,
      recall: a.n ? a.r / a.n : 0,
      confident: a.n ? a.c / a.n : 0,
      unlocked,
      size: all.length,
    };
  });

  /* ------------------------------------------------------------ mastery */
  const mastery: MasteryBuckets = { fresh: 0, learning: 0, young: 0, mature: 0 };
  for (const c of CARDS) {
    const st: CardState | undefined = cards[c.id];
    if (!st || st.reps === 0) mastery.fresh += 1;
    else if (st.interval < 7) mastery.learning += 1;
    else if (st.interval < 21) mastery.young += 1;
    else mastery.mature += 1;
  }

  /* ------------------------------------------------------------- streak */
  const daysWithReviews = new Set(log.map(([, , at]) => localDate(at)));
  let streak = 0;
  for (let i = 0; ; i++) {
    const key = new Date(now.getTime() - i * 86_400_000)
      .toLocaleDateString("en-CA", { timeZone: TZ });
    if (daysWithReviews.has(key)) streak += 1;
    else if (i > 0) break;           // today with no reviews yet does not break it
    else if (i === 0) continue;
    if (i > 400) break;
  }

  /* -------------------------------------------------------------- trend */
  const trend = days
    .filter((d) => d.total > 0)
    .map((d) => ({ date: d.date, value: (d.hard + d.knew) / d.total }));

  /* ------------------------------------------------------------ hardest */
  const hardest = CARDS
    .map((c) => ({
      id: c.id,
      front: c.front.replace(/[`*]/g, ""),
      lapses: cards[c.id]?.lapses ?? 0,
      reviews: perCard.get(c.id) ?? 0,
    }))
    .filter((x) => x.lapses > 0)
    .sort((a, b) => b.lapses - a.lapses || b.reviews - a.reviews)
    .slice(0, 6);

  return {
    reviews,
    recall: reviews ? recalled / reviews : 0,
    confident: reviews ? confident / reviews : 0,
    today: byDate.get(localDate(Date.now()))?.total ?? 0,
    streak,
    days,
    byDeck,
    mastery,
    trend,
    hardest,
  };
}

export const pct = (x: number) => `${Math.round(x * 100)}%`;
