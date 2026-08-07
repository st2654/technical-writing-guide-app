# technical-writing-guide-app

A 5-minute daily writing sprint app that scores your technical writing against Google's tech-writing guide and gamifies the habit with streaks, XP, and badges.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the system design and [TASKS.md](./TASKS.md) for the build plan.

## Getting started

Requires Node 20+.

```bash
npm install
cp .env.example .env.local   # fill in real values — see ARCHITECTURE.md "Secrets & security"
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the local dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the codebase

## Security

Never commit real values to `.env.local` or any other file — see `ARCHITECTURE.md` for how secrets are managed across environments.
