import { getStore } from "@netlify/blobs";

/**
 * Cross-device progress sync.
 *
 * FAILS CLOSED: without STUDY_PIN configured on the site, every request is refused.
 * The app then runs happily in local-only mode, so an unconfigured deployment is
 * never an open read/write endpoint.
 */

const KEY = "progress.json";

export default async function handler(req: Request) {
  const pin = process.env.STUDY_PIN;

  if (!pin) {
    return json({ error: "Sync is not configured. Set STUDY_PIN in Netlify to enable it." }, 503);
  }

  const supplied = req.headers.get("x-study-pin") ?? "";
  if (!timingSafeEqual(supplied, pin)) {
    return json({ error: "Bad PIN" }, 401);
  }

  const store = getStore({ name: "phd-prep", consistency: "strong" });

  if (req.method === "GET") {
    const blob = await store.get(KEY, { type: "json" }).catch(() => null);
    return json(blob ?? null);
  }

  if (req.method === "PUT") {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }
    if (!body || typeof body !== "object" || !("cards" in body)) {
      return json({ error: "Not a progress object" }, 400);
    }
    await store.setJSON(KEY, body);
    return json({ ok: true, savedAt: new Date().toISOString() });
  }

  return json({ error: "Method not allowed" }, 405);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

/** Constant-time-ish compare, so the PIN can't be probed a character at a time. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const config = { path: "/api/sync" };
