# Build tasks

Each task below is scoped to be a single small PR — independently mergeable, buildable/testable on its own, small enough to finish in one focused session. Work top to bottom within a phase; phases are ordered by dependency.

## Phase 0 — repo & tooling

- [x] **0.1** Scaffold Next.js app (TypeScript, App Router, ESLint, Prettier). No features — just a running `npm run dev` skeleton and a README with setup steps.
- [ ] **0.2** Add Prisma, connect to a dev Postgres, add schema for `users` and `topics` only, write a seed script with ~20 starter topics.
- [ ] **0.3** Add Auth.js with GitHub OAuth — login/logout and one protected route (`/dashboard` redirects to login if signed out).
- [ ] **0.4** GitHub Actions CI: lint + typecheck + build on every PR.

## Phase 1 — core writing loop (stub scoring)

- [ ] **1.1** `GET /api/topics/random` — returns one topic from the seeded table.
- [ ] **1.2** Writing screen UI: topic display, 5-minute countdown timer, textarea, submit button. Client-only, no backend wiring yet — per the mockup, no extra chrome.
- [ ] **1.3** `submissions` table in Prisma schema + `POST /api/submissions` that persists `{topicId, content, timeSpentSec}` and returns a stub score (fixed value, no LLM call yet).
- [ ] **1.4** Wire the writing screen's submit button to the API and show the (stub) result.

## Phase 2 — real LLM scoring

- [ ] **2.1** Groq client wrapper + rubric prompt template as an isolated server-side function — takes text, returns the 5-dimension JSON. Unit-testable without touching the API route.
- [ ] **2.2** `scores` table in Prisma schema. Wire `POST /api/submissions` to call the Groq wrapper instead of the stub and persist per-dimension scores.
- [ ] **2.3** Score breakdown UI component — 5 dimensions + overall + one-line feedback each.

## Phase 3 — gamification

- [ ] **3.1** XP calculation + streak update as pure functions with unit tests (no DB/API involved).
- [ ] **3.2** Badge rule evaluation as pure functions with unit tests.
- [ ] **3.3** `streaks`, `xp`, `badges`, `user_badges` tables in Prisma schema. Wire 3.1/3.2 into the submission flow and persist.
- [ ] **3.4** Dashboard UI — streak/level/XP cards + "start today's sprint" CTA + recent submissions list, per the mockup (3-stat ceiling, one CTA).

## Phase 4 — polish & deploy

- [ ] **4.1** Rate limit `POST /api/submissions` per user (simple DB counter).
- [ ] **4.2** Finalize `.env.example`, add env var validation on boot (fail fast if a required var is missing).
- [ ] **4.3** First deploy: Vercel project + prod Supabase/Neon + prod env vars set in Vercel dashboard (manual steps per ARCHITECTURE.md checklist) + smoke test.
- [ ] **4.4** Wire up Preview environment: Vercel Preview Deployments + per-PR Neon DB branch (or shared QA project), confirm a test PR gets its own working preview URL.

## Notes

- Each task should ship its own tests where the task involves logic (2.1, 3.1, 3.2 especially).
- If a task above still feels big once you're in it, split it further rather than letting the PR grow — the `pr-slicer` skill is there for that.
- Update the checkbox here when a task's PR merges, so this file stays the source of truth for "what's next."
