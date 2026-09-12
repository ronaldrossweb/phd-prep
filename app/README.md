# PhD Prep — study app

Live: **https://ronaldrossweb.github.io/phd-prep/** (GitHub Pages, auto-deployed from `main`)
Source: **https://github.com/ronaldrossweb/phd-prep**

A learning portal — video, written lessons, a live in-browser Python environment with checked exercises, and quizzes — for the five-week run-up to PhDAI 730 (Statistics for AI) and PhDAI 832
(Ethics in Responsible AI), term starting 2026-10-19.

## Screens

| Route | What it does |
|---|---|
| `/` | Countdown to Oct 19, today's session, review queue, per-week progress |
| `/learn` | All 24 lessons by session; `/learn/:id` runs one lesson: watch → read → practice → quiz |
| `/sessions` | All 15 sessions; `/sessions/:n` is one session's agenda with per-block checkboxes |
| `/cards` | SM-2 spaced repetition over 204 cards, filterable by deck; swipe ← Again / → Good |
| `/notation` | Searchable notation decoder, 43 entries |
| `/tutor` | Claude-backed tutor that knows the plan and the learner's level |
| `/progress` | Dashboard: recall accuracy, review activity, per-deck accuracy, mastery distribution, most-forgotten cards, plan progress, sync settings |

## Content is generated, not duplicated

`src/data/notation.ts` is **generated** from `~/PhD/00-notation-cheatsheet.md` so the two cannot
drift. After editing the cheat-sheet:

```bash
node scripts/gen-notation.mjs
```

`src/data/sessions.ts` and `src/data/cards.ts` are authored directly and mirror `~/PhD/00-roadmap.md`.

## Three layouts, one markup

| Width | Navigation | Content |
|---|---|---|
| < 780px | fixed bottom tab bar, icon over label | single column |
| 780–1023px | sticky tab strip under the header, icon beside label | single column, wider |
| >= 1024px | **full-height left sidebar**, 216px | up to 1060px, charts in two columns |

The nav is the same six `NavLink`s at every size — only CSS changes its shape, so there is no
duplicated markup or JS breakpoint to keep in sync.

## Accuracy tracking

`Progress.reviews` is an append-only log of `[cardId, grade, epochMs]` tuples, capped at 5,000 and
merged across devices by de-duplicating on `cardId|timestamp`. The deck is derived from the card-id
prefix rather than stored. Everything on the dashboard is computed from that log in
`src/lib/metrics.ts` — nothing is back-filled or estimated, so the charts are empty until the first
card is graded.

**Two accuracy numbers, deliberately.** *Recall* counts a card as remembered if it was graded Hard,
Good or Easy; *confident* counts only Good or Easy. Reporting the first alone flatters, the second
alone punishes an honest "Hard" — both together are the truthful summary.

### Chart rules this app follows

Charts are CSS boxes, not scaled SVG, so labels stay crisp at every width and hover targets are real
focusable elements. Beyond that:

- **The palette was computed, not eyeballed.** Recall outcomes are an ordered scale with polarity, so
  they use a **diverging** scale — rust / neutral gray / green — not traffic lights. Both modes were
  run through the palette validator: the light steps pass every check, and the dark pair sits in the
  CVD 6–8 warn band, which is legal only with secondary encoding, so those charts always ship a
  legend, 2px segment gaps and direct labels. An earlier traffic-light palette failed outright (an
  amber that computed as gray, and a red/amber pair at ΔE 3.3 under deuteranopia).
- **Mastery** is ordered magnitude, so it uses a single-hue brass ordinal ramp (validated with
  `--ordinal`), never a multi-hue scale.
- **Per-deck accuracy is one series**, so every bar is one colour — a value-ramp across nominal
  categories would just re-encode bar length as hue.
- One axis, never two. 2px surface gaps rather than borders between stacked segments. Solid hairline
  baselines, no dashed grid. Thin marks — columns cap at 34px so wide screens don't get heavy blocks.
- **Every chart has a table view** (the "Numbers" toggle), so no value is reachable only by hovering,
  and keyboard focus shows the same tooltip as the mouse.
- Data figures wear the interface sans with proportional digits; `tabular-nums` appears only where
  numbers stack vertically (table rows, axis ticks). Fraunces is kept for the countdown, which is a
  brand moment rather than a data figure.
- One filter row (7/14/30 days) above the charts, scoping all of them — never a filter per card.

## Accounts and data (Supabase)

Sign-in is email + password on Supabase Auth (project `ygzdeyatsxfniubayxli`, us-west-1). Every
table is row-level-secured to `auth.uid()`, so a user can only ever read or write their own rows:
`profiles`, `study_state` (one JSON document per user), `reviews`, `exercise_attempts`,
`quiz_answers`, `module_progress`. Schema lives in `supabase/migrations/`; apply with
`supabase db push`. Auth URLs are in `supabase/config.toml`; apply with `supabase config push`.

Offline-first still holds: localStorage is written first; the cloud copy is pulled on sign-in and
merged (per-card last-write-wins; the review log is unioned), then pushed in the background.

The anon key in `src/lib/supabase.ts` is public by design — it grants only what RLS allows.

## The lesson engine

`src/lib/pyodide.ts` loads Pyodide (WebAssembly Python) from jsDelivr on the first lesson that needs
it, with numpy, pandas and matplotlib; heavier packages a module declares (`packages: ["scipy"]`)
are awaited inside each run. The notebook datasets in `public/data/` are mounted at `data/` in the
virtual filesystem, so lesson code reads `data/lending.csv` exactly as the notebooks do.

Conventions that make exercises robust after a page reload:

- **`setup`** on a module runs before every Run/Check (imports, data loading; idempotent).
- **Prerequisite replay:** earlier exercises' *solutions* run silently first (stdout redirected,
  figures closed), so exercise 3 works without the learner having re-run 1 and 2.
- Therefore **every `solution` must be a complete runnable program**, not a fragment.
- `check` is Python assertions over the learner's globals; assertion messages are shown verbatim,
  so write them as hints. Reported line numbers subtract the hidden setup lines.
- Video ids are verified against YouTube's oEmbed endpoint: `node scripts/verify-videos.mjs`.

## The tutor

Bring-your-own-key: an Anthropic key pasted under *Dashboard → Tutor key* is stored only in that
browser and sent only to `api.anthropic.com` (`dangerouslyAllowBrowser`, since there is no server).
The Tutor tab is hidden until a key is present.

## Develop

```bash
npm install
npm run dev          # add ?dev=1 to the URL to skip sign-in locally (stripped from builds)
npm run build
git push             # GitHub Actions builds and deploys to Pages
```

## Design system

Ink and brass, not the default slate-blue. Tokens live at the top of `src/styles.css` with a full
light-mode override under `prefers-color-scheme`.

| Role | Value |
|---|---|
| Ground (dark / light) | `#0A0C12` / `#FBFAF7` warm parchment |
| Brand accent | brass `#CEA65E` dark, `#8A6A27` light (darkened for contrast) |
| Tracks | statistics blue, ethics terracotta, both violet |

**Four typefaces, each with a job:**

| Face | Used for |
|---|---|
| **Fraunces** | display — the wordmark, hero numerals, section headings |
| **Inter** | the entire interface |
| **Newsreader** | mathematics. A sigma set in serif reads as mathematics; the same sigma in a monospace face reads as a string literal. `fmt(..., { math: true })` switches inline code spans to it for the notation and statistics decks. |
| **JetBrains Mono** | code, dates, file paths |

**The mark** (`src/components/Logo.tsx`, and the PNGs in `public/`) is a normal distribution cut by a
decision threshold with the flagged tail beyond it — statistics on one axis, the policy choice on the
other. The React component and the generated icons share the same geometry constants, so they cannot
drift. Regenerate the PNGs by re-running the Pillow script recorded in the session, or edit the
constants in both places together.

Two deliberate non-choices: **no `backdrop-filter`** (unsupported widely enough that the nav bars
degraded to text bleeding through, so they are fully opaque), and **no icon font** (the icons are
inline SVG in `src/components/Icons.tsx`).

## Stack

Vite 8 · React 19 · TypeScript 6 · react-router 7 · vite-plugin-pwa · Pyodide · Supabase (auth + Postgres) ·
GitHub Pages · `@anthropic-ai/sdk`. Webfonts are runtime-cached so typography survives an offline commute.
