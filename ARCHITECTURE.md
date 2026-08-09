# Architecture

MVP scope: help an engineer get better at technical writing in 5-minute daily reps. Nothing beyond that loop for v1 — no teams, no orgs, no content library beyond a topic list. Hosting on the public internet is a v1 requirement, not a "later" concern, so every choice below defaults to something with a free tier that scales down to $0/month for a single user and up cleanly if it gets traction.

## Stack

- **App:** Next.js (App Router), one codebase for UI + API routes. Deploys to Vercel free tier.
- **Auth:** Auth.js (NextAuth) with GitHub OAuth. Fits the engineer audience — they already have GitHub accounts, no password flow to build.
- **Database:** Postgres via Supabase or Neon (free tier). Prisma as the ORM.
- **LLM scoring:** Groq API (free tier), running Llama 3.3 70B with JSON-mode structured output. Chosen over Claude/OpenAI because the requirement is a free evaluator; Groq's free rate limits are generous enough for a daily-use single/small-user app, and it's an API call (not self-hosted), so it works the same in production as in dev. Gemini 2.0 Flash free tier is the fallback if Groq limits become a problem.

## Core loop

1. User logs in (GitHub OAuth) → dashboard shows "Start today's sprint."
2. Server hands back a random topic from a seeded `topics` table.
3. Client starts a 5-minute countdown; user writes in a plain textarea/editor.
4. On submit (or timer expiry), the draft goes to `POST /api/submissions`.
5. Server builds a rubric prompt from Google's tech-writing guide dimensions, calls Groq, gets back structured per-dimension scores + feedback.
6. Server computes XP, updates streak, checks badge rules, writes everything to Postgres in one transaction.
7. Client renders the score breakdown, updated XP/streak, and any newly unlocked badge.

## Data model

- `users` — id, github_id, username, avatar_url, created_at
- `topics` — id, text, category, difficulty
- `submissions` — id, user_id, topic_id, content, word_count, time_spent_sec, created_at
- `scores` — id, submission_id, dimension, score (1-5), feedback_text
- `streaks` — user_id, current_streak, longest_streak, last_submission_date
- `xp` — user_id, total_xp, level
- `badges` — id, code, name, description
- `user_badges` — user_id, badge_id, earned_at

## Scoring rubric (from Google's tech-writing guide)

Five dimensions, each scored 1-5 by the LLM with a one-line reason, plus an overall average:

1. Active voice
2. Clarity (short sentences, concrete verbs)
3. Concision (no filler/redundant words)
4. Audience awareness (jargon defined, right level of detail)
5. Structure (leads with the point, uses lists/parallelism where appropriate)

## Gamification rules (MVP)

- **XP:** 10 base (for completing) + `round(overall_score_pct * 40)` + `min(streak_days, 10) * 2`
- **Streak:** +1 for a submission on a new calendar day following the last one; resets to 1 if a day is skipped. No grace period in v1.
- **Badges (starter set):** First Draft (1st submission), Active Voice Ace (5 submissions at 5/5 on active voice), Concise Coder (5 submissions at 5/5 on concision), Week Warrior (7-day streak), Consistency Champion (30-day streak).

## API surface (v1)

- `POST /api/submissions` — `{ topicId, content, timeSpentSec }` → `{ scores, xpEarned, totalXp, streak, badgesUnlocked }`
- `GET /api/topics/random`
- `GET /api/me/stats` — XP, streak, badge list, submission history

## Design principles

Uncluttered, clean, fresh. One primary action per screen, generous whitespace, grayscale-first palette with a single accent reserved for the primary CTA. No dashboards stacked with more than 3 stats at once — streak, level, XP is the ceiling for the home screen. The writing screen in particular should feel like a quiet page, not a tool with chrome around it: topic, timer, textarea, submit — nothing else competing for attention.

## Explicitly out of scope for v1

Teams/orgs, leaderboards across users, mobile/native app, offline mode, editing past submissions, multiple writing formats beyond free text. Add these once the core loop proves people come back daily.

## Hosting

Vercel (app, free tier) + Supabase or Neon (Postgres, free tier). Groq API calls billed per free-tier limits — no infra to manage, no cost to start.

## Environments

| Environment | Trigger | App | Database | Notes |
|---|---|---|---|---|
| Local | `next dev` on your machine | localhost | Personal dev branch (Neon) or shared dev project (Supabase) | `.env`, untracked, your own low-volume Groq key |
| QA / Preview | Every PR | Vercel Preview Deployment (auto URL per PR) | Neon DB branch per PR (or shared QA Supabase project) | Env vars scoped to "Preview" in Vercel dashboard |
| Prod | Merge to `main` | Vercel Production | Prod Supabase/Neon project | Env vars scoped to "Production" in Vercel dashboard |

Rule: every environment has its own GitHub OAuth app, DB, and Groq API key. A leaked QA credential should never expose prod data.

## Secrets & security

- No secret values are ever committed. `.gitignore` excludes all `.env*` files except `.env.example`.
- `.env.example` lists required variable names only — no real values, committed to the repo as documentation.
- Real values live in exactly two places: Vercel's Environment Variables UI (Preview and Production scoped separately) and each contributor's local `.env` (untracked, never shared).
- GitHub Actions, if added, use encrypted repo/environment secrets — never inline in workflow YAML.
- Enable GitHub secret scanning + push protection on the repo (free) as a backstop against accidental commits.
- User-submitted writing is untrusted input to the LLM prompt: keep it in a clearly delimited section rather than concatenated into instructions, to limit prompt-injection risk, and never let LLM output trigger anything beyond returning scores/feedback text.
- Rate-limit `POST /api/submissions` per user (simple DB counter is enough for MVP) to bound cost and abuse.

## Workflow

Small, focused PRs rather than large batched ones — each PR should be independently reviewable and revertible. Branch protection on `main`: require PR review + passing checks before merge, no direct pushes.

## Manual setup checklist (human-only)

Steps that need to happen outside of any coding assistant, by whoever owns the accounts:

1. Create the GitHub OAuth App (one per environment) and note client ID/secret.
2. Create Vercel account, link the GitHub repo, set env vars per environment in the dashboard.
3. Create Supabase/Neon projects (dev, QA, prod) and get connection strings.
4. Generate Groq API keys (one per environment).
5. Enter all real secret values directly into Vercel/GitHub's secret stores — not into any file an assistant writes or any chat log.
6. Set GitHub branch protection rules and PR review requirements.
7. (Optional) buy/configure a custom domain and DNS, if not using the default `vercel.app` URL.
