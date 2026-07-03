# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

TheChemstore is a chemistry-focused web app: a jobs board (aggregated daily from external sources and AI-categorized), a tuition academy section, and a bookstore. It's a monorepo with two independently-built apps plus Docker orchestration:

- `frontend/` — React 19 + Vite 6 + Tailwind v4 SPA (TypeScript, **pnpm**)
- `backend/` — Express 5 + MongoDB/Mongoose REST API (CommonJS, **npm**)
- `docker-compose.yml` — runs frontend, backend, and MongoDB together for local dev

The two halves currently live somewhat independently: the frontend still renders static dummy data from `src/data/` and has not yet been wired to the backend API (see Integration status below).

## Commands

### Frontend (`cd frontend`, uses pnpm)
- `pnpm dev` — Vite dev server (http://localhost:5173)
- `pnpm build` — production build
- `pnpm typecheck` — `tsc --noEmit` (no emit; the type gate)
- `pnpm lint` / `pnpm lint:fix` — ESLint
- `pnpm format` / `pnpm format:check` — Prettier over `src/**/*.{ts,tsx,css}`

There is no test runner configured in either app. Before considering a frontend change done, run `pnpm typecheck` and `pnpm build` (the established verification gate — there are no unit tests).

### Backend (`cd backend`, uses npm)
- `npm run dev` — nodemon (http://localhost:5000)
- `npm start` — plain node
- `npm test` — **not configured** (exits 1)
- API docs (Swagger UI): http://localhost:5000/api-docs ; raw spec at `/api-docs.json`

### Full stack (Docker)
- `cp backend/.env.example backend/.env` (one-time), then `docker compose up --build`

## Package managers (important)
- **Frontend: pnpm only** (`pnpm-lock.yaml`). The `frontend/README.md` says `npm` but it is stale — use pnpm.
- **Backend: npm** (`package-lock.json`).
Don't mix them.

## Backend architecture

Classic layered Express app, entry at `backend/index.js`. Routes → controllers → models, with Mongoose for persistence.

**Express 5 async handling:** controllers are written as bare `async` functions with **no try/catch** — they rely on Express 5 auto-forwarding rejected promises to the central `middleware/errorHandler.js`. That handler maps Mongoose/JWT error shapes (duplicate-key 11000, ValidationError, JWT errors) to HTTP responses. Follow this pattern: throw or let it reject; don't add try/catch boilerplate in controllers.

**Validation:** `express-validator` chains are declared inline in the route files, followed by the shared `middleware/validate.js` which returns a 422 with `{ field, message }` errors. Add new input validation as route-level chains, not in controllers.

**Auth:** JWT Bearer tokens. `middleware/auth.js` exports `protect` (verifies token, loads `req.user`) and `requireVerified`. Signup sends an email-verification token (24h); users can't log in until verified. Passwords hashed via a Mongoose `pre('save')` hook on the User model; `password` and token fields use `select: false` and must be explicitly `.select('+password')`'d when needed.

**Response envelope:** every endpoint returns `{ success: boolean, ... }` — list endpoints add `data` + `pagination`; errors add `message` (and `errors` for validation). Keep new endpoints consistent with this shape.

### Job aggregation pipeline (the core backend feature)
Runs daily at 2 AM IST via `node-cron` (`cron/dailyJobSync.js`, scheduled from `index.js` on boot; schedule overridable with `JOB_SYNC_CRON`). Also triggerable manually via `POST /api/jobs/sync` with the `SYNC_SECRET` body param (fire-and-forget).

Flow:
1. `services/jobFetcher.js` — queries the JSearch RapidAPI across several chemistry sub-discipline search terms, normalizes each result into the `Job` shape, and computes a `dedupeHash` = SHA-256 of normalized `title|company|location`.
2. `cron/dailyJobSync.js` — dedupes incoming hashes against existing DB records (bumps `lastSeenAt` on known ones, `insertMany({ ordered: false })` for new), then `expireStaleJobs()` flips `isActive: false` on jobs not seen within `JOB_TTL_DAYS` (default 30).
3. `services/jobEnricher.js` — batches jobs to Google Gemini (`gemini-1.5-flash`) to classify `chemistryField`, `experienceLevel`, and `skills`. **Note:** `enrichJobs` is implemented but **not currently wired into `runDailySync`** — enrichment is not happening in the sync flow as written. Wire it in (between insert and store) if enrichment is expected.

The `Job` model (`models/Job.js`) carries a MongoDB text index over `title/description/company` (used by the `q` search param) plus many single-field indexes backing the filter query in `getJobs`. The `dedupeHash` is `unique`.

## Frontend architecture

Vite SPA, entry `src/main.tsx` → `src/App.tsx`. Single route (`/`) rendering a `Home` composed of feature sections.

- **`@/` alias** → `src/` (configured in both `vite.config.ts` and `tsconfig.json`). All app code imports via `@/`; keep new code consistent.
- **Feature folders** under `src/features/` (navigation, hero, jobs, products, academy, footer) — one section component each. Above-the-fold (`Navigation`, `Hero`) are imported eagerly; everything below is `React.lazy` + `Suspense` with per-section skeletons from `components/ui/Skeletons.tsx`, each wrapped in an `ErrorBoundary`.
- **shadcn/ui (new-york style)** is the component foundation in `src/components/ui/`. It uses the **unified `radix-ui` package**, not individual `@radix-ui/react-*` packages. Design tokens live in `src/styles/theme.css`; the `cn()` helper in `src/lib/utils.ts`. Do **not** run `shadcn init` (it would overwrite `theme.css`); add components with `pnpm dlx shadcn@latest add <name>`.
- **React Compiler** is enabled (`babel-plugin-react-compiler` in `vite.config.ts`) — avoid manual `useMemo`/`useCallback` micro-optimizations; let the compiler handle memoization.
- **Routing:** `react-router` v7 in declarative `BrowserRouter` mode (not the data-router). More pages are planned; convert nav `#anchor` links to `<Link>` and add a 404 catch-all when they land.

### Integration status (read before wiring frontend↔backend)
- `frontend/src/services/api.ts` returns **dummy data** from `src/data/` behind fake `setTimeout` promises — it is a placeholder, not a real client.
- The frontend `Job` type (`src/types/index.ts`) is a flat shape (`id`, `logo`, `type`, …) that does **not** match the backend `Job` model (nested `location`/`salary`, `chemistryField`, etc.). Reconcile these when connecting the API.
- `VITE_API_BASE_URL` is the intended API base (set to `http://localhost:5000/api` in docker-compose). The roadmap is to adopt TanStack Query (`@tanstack/react-query`) for fetching/caching — not yet installed.

## Configuration

Backend secrets come from `backend/.env` (see `backend/.env.example`): `MONGODB_URI`, `JWT_SECRET`/`JWT_EXPIRES_IN`, Gmail SMTP (`EMAIL_USER`/`EMAIL_PASS` app password/`EMAIL_FROM`), `RAPIDAPI_KEY` (JSearch), `GEMINI_API_KEY`, `JOB_SYNC_CRON`, `JOB_TTL_DAYS`, `SYNC_SECRET`, `CLIENT_URL` (CORS origin). docker-compose overrides `PORT`, `MONGODB_URI`, and `CLIENT_URL` to wire the containers together.
