# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 React application. Route files live in `app/`, including public pages, auth routes, dashboard routes, and API handlers such as `app/api/sign-reference/[sign]/route.ts`. Shared UI belongs in `components/`. Arabic sign detection logic is concentrated in `lib/gestures/`, with per-character scorers in `lib/gestures/classifiers/`, shared feature extraction in `features.ts`, and supported character metadata in `constants.ts`. Static and reference assets live in `public/`, `huruf/`, and `harakat/`. Supabase-related files are in `supabase/` and helper utilities are in `utils/`.

## Build, Test, and Development Commands

- `npm run dev`: start the local Next.js development server.
- `npm run build`: create a production build.
- `npm run start`: serve the production build after `npm run build`.
- `npm run lint`: run ESLint over the repository.
- `npm run typecheck`: run TypeScript without emitting files.
- `npm run check`: run lint, typecheck, and build in sequence.

Use `npm run dev` for normal UI work. Use `npm run check` before larger handoffs or pull requests.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Follow the existing two-space indentation and semicolon style. Keep gesture scorer files small and named after their character key, for example `lib/gestures/classifiers/ba.ts` exporting `scoreBa`. Use camelCase for variables and functions, PascalCase for React components and exported types, and lowercase route folders under `app/`. Keep Arabic character metadata centralized in `lib/gestures/constants.ts`.

## Testing Guidelines

No dedicated test framework or test files are currently present. For now, validate changes with targeted manual checks in `npm run dev`, plus `npm run lint`, `npm run typecheck`, or `npm run check` when appropriate. If tests are added, prefer colocated `*.test.ts` or `*.test.tsx` files and cover gesture feature extraction and classifier edge cases separately from UI behavior.

## Commit & Pull Request Guidelines

Local Git history was not available in this checkout, so no repository-specific commit convention could be confirmed. Use short imperative commit messages, for example `Add dzal gesture classifier` or `Tune shod detection threshold`. Pull requests should include a concise description, validation performed, linked issues when applicable, and screenshots or short clips for UI or camera-detection changes.

## Security & Configuration Tips

Keep secrets in `.env.local` and never commit them. Treat `.cache/`, `.venv/`, `.python_packages/`, `.next/`, and `node_modules/` as generated local state. When adding dataset or model assets, document their source and keep large generated files out of Git unless the project explicitly requires them.
