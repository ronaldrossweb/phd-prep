# PhD Prep — study app

Live: **https://ross-phd-prep.netlify.app**

A mobile-first PWA for the five-week run-up to PhDAI 730 (Statistics for AI) and PhDAI 832
(Ethics in Responsible AI), term starting 2026-10-19.

## Screens

| Route | What it does |
|---|---|
| `/` | Countdown to Oct 19, today's session, review queue, per-week progress |
| `/sessions` | All 15 sessions; `/sessions/:n` is one session's agenda with per-block checkboxes |
| `/cards` | SM-2 spaced repetition over 204 cards, filterable by deck; swipe ← Again / → Good |
| `/notation` | Searchable notation decoder, 43 entries |
| `/tutor` | Claude-backed tutor that knows the plan and the learner's level |
| `/progress` | Hours logged, mastery by deck, most-forgotten cards, sync settings |

## Content is generated, not duplicated

`src/data/notation.ts` is **generated** from `~/PhD/00-notation-cheatsheet.md` so the two cannot
drift. After editing the cheat-sheet:

```bash
node scripts/gen-notation.mjs
```

`src/data/sessions.ts` and `src/data/cards.ts` are authored directly and mirror `~/PhD/00-roadmap.md`.

## Persistence

Offline-first. `localStorage` is the immediate source of truth, so the app is instant and works with
no signal. A debounced background `PUT /api/sync` pushes to Netlify Blobs; on load the remote copy is
merged in, preferring whichever side touched each card most recently.

**Sync is opt-in and fails closed.** `/api/sync` refuses every request unless `STUDY_PIN` is set as a
site environment variable, so an unconfigured deployment is never an open read/write endpoint. To
enable it: set `STUDY_PIN` in the Netlify dashboard, redeploy, then enter the same PIN on each device
under *Stats → Cross-device sync*.

The PIN deters a stumbled-upon URL. It is **not** strong authentication — keep nothing sensitive here.

## The tutor

`netlify/functions/tutor.ts` calls `claude-opus-5` with adaptive thinking at medium effort, and a
cached system prompt carrying the learner's profile and current session.

Credentials resolve in one of two ways:

1. **Netlify AI Gateway** (what this site uses today). Netlify injects `ANTHROPIC_API_KEY` — a
   short-lived JWT — plus `ANTHROPIC_BASE_URL` pointing at its own proxy. No key of your own is
   needed, and usage is billed through your Netlify plan.
2. **Your own Anthropic key.** Set `ANTHROPIC_API_KEY` to an `sk-ant-...` value as a site env var.
   The function detects a non-JWT key and pins `baseURL` back to `api.anthropic.com`, so the
   gateway's lingering `ANTHROPIC_BASE_URL` cannot misroute it.

`GET /api/tutor` reports `{ configured, via, model }`; the UI hides the Tutor tab when it is not
configured.

## Develop

```bash
npm install
npm run dev          # Vite only -- /api/* will 404
netlify dev          # Vite + functions, so /api/* works
npm run build
netlify deploy --prod --build
```

## Stack

Vite 8 · React 19 · TypeScript 6 · react-router 7 · vite-plugin-pwa · Netlify Functions + Blobs ·
`@anthropic-ai/sdk`.
