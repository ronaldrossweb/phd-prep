/**
 * Offline-first study state.
 *
 * localStorage is the immediate source of truth, so the app is instant and works
 * with no signal. A debounced background PUT pushes to Netlify Blobs; on load we
 * merge the remote copy in, preferring whichever copy touched each card last.
 *
 * Sync is OPT-IN and fails closed: /api/sync refuses everything unless STUDY_PIN
 * is configured on the site. Until then the app is simply local-only.
 */
import { type CardState, initialState } from "./srs";

const KEY = "phd-prep-state-v1";
const PIN_KEY = "phd-prep-pin";

export type Progress = {
  cards: Record<string, CardState>;
  /** session number -> ISO timestamp completed */
  sessionsDone: Record<number, string>;
  /** "sessionN:blockI" -> true */
  blocksDone: Record<string, boolean>;
  minutesLogged: number;
  updatedAt: string;
};

export function emptyProgress(): Progress {
  return {
    cards: {},
    sessionsDone: {},
    blocksDone: {},
    minutesLogged: 0,
    updatedAt: new Date(0).toISOString(),
  };
}

export function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    return { ...emptyProgress(), ...JSON.parse(raw) };
  } catch {
    return emptyProgress();
  }
}

export function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode / quota -- the app still works for this session */
  }
}

export function getPin(): string {
  try {
    return localStorage.getItem(PIN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setPin(pin: string) {
  try {
    pin ? localStorage.setItem(PIN_KEY, pin) : localStorage.removeItem(PIN_KEY);
  } catch { /* ignore */ }
}

export function cardState(p: Progress, id: string): CardState {
  return p.cards[id] ?? initialState(new Date(0));
}

/* ------------------------------------------------------------------ merging */

/** Per-card last-write-wins on lastReviewed; counters take the max. */
export function merge(a: Progress, b: Progress): Progress {
  const cards: Record<string, CardState> = { ...a.cards };
  for (const [id, rs] of Object.entries(b.cards)) {
    const ls = cards[id];
    if (!ls || new Date(rs.lastReviewed || 0) > new Date(ls.lastReviewed || 0)) {
      cards[id] = rs;
    }
  }
  return {
    cards,
    sessionsDone: { ...b.sessionsDone, ...a.sessionsDone },
    blocksDone: { ...b.blocksDone, ...a.blocksDone },
    minutesLogged: Math.max(a.minutesLogged, b.minutesLogged),
    updatedAt: new Date().toISOString(),
  };
}

/* -------------------------------------------------------------------- sync */

export type SyncStatus = "off" | "syncing" | "ok" | "error" | "offline";

let timer: ReturnType<typeof setTimeout> | undefined;

export async function pull(): Promise<Progress | null> {
  const pin = getPin();
  if (!pin) return null;
  try {
    const r = await fetch("/api/sync", { headers: { "x-study-pin": pin } });
    if (!r.ok) return null;
    const j = await r.json();
    return j && j.cards ? (j as Progress) : null;
  } catch {
    return null;
  }
}

export function pushDebounced(p: Progress, onStatus: (s: SyncStatus) => void) {
  const pin = getPin();
  if (!pin) {
    onStatus("off");
    return;
  }
  clearTimeout(timer);
  timer = setTimeout(async () => {
    if (!navigator.onLine) {
      onStatus("offline");
      return;
    }
    onStatus("syncing");
    try {
      const r = await fetch("/api/sync", {
        method: "PUT",
        headers: { "content-type": "application/json", "x-study-pin": pin },
        body: JSON.stringify(p),
      });
      onStatus(r.ok ? "ok" : "error");
    } catch {
      onStatus("offline");
    }
  }, 1500);
}

/* ------------------------------------------------------------------- dates */

export const TZ = "America/Denver";

export function todayISO(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

export function daysUntil(iso: string): number {
  const today = new Date(todayISO() + "T00:00:00");
  const target = new Date(iso + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
