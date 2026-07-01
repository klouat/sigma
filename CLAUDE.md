# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

SIGMA-Sholat — an Arabic sign language (BISINDO) detection platform for deaf students learning sholat. It uses a webcam with MediaPipe hand landmarker to classify Arabic character hand signs and harakat (diacritic) movements in real time.

## Commands

```bash
npm run dev        # Next.js dev server
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run check      # lint + typecheck + build (all three)
```

## Tech stack

- **Next.js 16** App Router (React 19, TypeScript 5 strict mode)
- **Tailwind CSS v4** + `shadcn` components + `tw-animate-css`
- **MediaPipe** (`@mediapipe/tasks-vision`) for hand landmark detection
- **Supabase** Auth (email/password) with SSR client (`@supabase/ssr`)
- **Base UI** (`@base-ui/react`) for low-level UI primitives

## Architecture

### Pages (App Router)

| Route | Purpose |
|---|---|
| `/` | Landing page (static content from `lib/site-data.ts`) |
| `/arabic-detector` | Live webcam gesture detection (the core feature) |
| `/login`, `/register` | Supabase email/password auth via server actions |
| `/dashboard` | Protected page showing user profile from `users` table |

### Gesture detection pipeline

The detection flows through four layers in `lib/gestures/`:

1. **`features.ts`** — Raw MediaPipe landmarks → feature vector (`GestureFeatures`, ~50 numeric scores). Computes per-finger raised scores, finger gaps, shapes (fist, open palm, curled), thumb position, spread, extension ratio, etc.

2. **`classifiers/*.ts`** — One file per character/harakat. Each exports a `score*(f: GestureFeatures): number` function that returns a 0–1 confidence score. These are hand-tuned heuristic scorers (not ML models).

3. **`classify.ts`** — Runs every character scorer against a feature vector, picks the highest score. The `SCORERS` record maps `CharacterKey` → scorer function. Also handles the `lamAlif` special case (both hands detected simultaneously with `lam` + `alif`).

4. **`constants.ts`** — `KNOWN_CHARACTERS` array (30 entries), `KNOWN_HARAKAT` array (7 entries), threshold constants (`CHARACTER_THRESHOLD = 55`, `HARAKAT_THRESHOLD = 80`), color maps, MediaPipe model paths.

**Harakat detection** (`features.ts:classifyHarakatMotion`) uses motion trail samples over 1200ms. It classifies direction: horizontal → Fathah, downward → Kasrah, curved → Dammah, still → Sukun, double horizontal → Fathatain, V-shape variants → Kasratain/Dammatain.

### Classifier design pattern

When writing a character classifier:

- Derive intermediate signals from `GesturesFeatures` (e.g., `noIndex = 1 - max(f.indexRaised, f.fingerScores.index * 0.75)`)
- Use **threshold gates** (`max(0, (value - threshold) * slope)`) to squash low-noise values to zero before they participate in scoring, preventing false positives from accumulating
- Multiply conflicting signals to create "AND" conditions (e.g., `thumbPinkyOnly = thumbGate * pinkyGate * threeCurled`)
- Return a weighted sum of components in 0–1 range

### API routes

- `POST /api/dataset-samples` — Appends a landmark sample as JSONL to `dataset/characters-<label>.jsonl` or `dataset/harakat-<label>.jsonl`
- `GET /api/sign-reference/[sign]` — Serves reference PNG images from `huruf/` directory
- `GET /api/harakat-reference/[kind]` — Serves harakat reference images

### Auth

Supabase server-side auth via `utils/supabase/server.ts`. Server actions in `app/login/actions.ts` and `app/register/actions.ts`. The dashboard reads the `users` table (joined via `auth.users.id`). Public routes: `/`, `/arabic-detector`, `/login`, `/register`. Protected: `/dashboard`.

### UI system

- `components/ui/` — shadcn components (button, card, field, input, label, separator)
- `components/landing-page.tsx` — The landing page with feature cards, workflow steps, team info, student/teacher dashboard mockups
- `components/arabic-sign-detector.tsx` — The full detector page: camera setup, MediaPipe loading, canvas overlay rendering, detection state, dataset collection UI, reference image grids
- `lib/utils.ts` — Just the `cn()` helper (clsx + tailwind-merge)

### Dataset collection

When collection mode is active on `/arabic-detector`, confirmed detections auto-save as JSONL files. Reference images live in `huruf/` and `harakat/`. The dataset directory is gitignored. See `docs/collecting-landmark-samples.md` for the collection workflow.