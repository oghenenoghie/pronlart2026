# Pronlart

A curated marketplace for original paintings, sculpture and bronze — collectors
browse and buy, artists submit work to sell, and visitors explore art through
thirteen movements from Renaissance to Bronze. See
`.claude/skills/art-gallery-website/SKILL.md` for the full project brief (design
system, data model, routes, conventions, build order).

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS v3 · Lenis · Motion · GSAP ·
Supabase — see the skill doc for the complete, locked stack.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in values as later build steps
(Supabase, email, payments) are wired up.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit` — type-check

## Deployment

Deploys to Vercel; CI (`.github/workflows/ci.yml`) runs lint, typecheck and
build on every push and pull request.
