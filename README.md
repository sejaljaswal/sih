# Sahaayak

A cooperative-owned digital marketplace for household and community services,
built for Smart India Hackathon 2026 (PS 26089, Ministry of Cooperation / NCCT).
Labour Cooperative Societies verify and register their own skilled workers;
households book them; payment splits automatically into worker wage, society
commission and a welfare contribution.

See [`CLAUDE.md`](./CLAUDE.md) for full project context, conventions and
non-negotiable rules. Full specs live in [`docs/PRD.md`](./docs/PRD.md) and
[`docs/ARCHITECTURE-V2.md`](./docs/ARCHITECTURE-V2.md); the visual system is
in [`design/DESIGN.md`](./design/DESIGN.md) (reference mockup:
[`design/sahaayak-ui.html`](./design/sahaayak-ui.html)).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS · shadcn/ui ·
Supabase (Postgres + PostGIS, Auth, Storage, Realtime) · next-intl (en/hi/pa) ·
react-hook-form + zod · Razorpay test mode.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in a real Supabase project's keys
npm run dev                        # http://localhost:3000
```

### Database

```bash
npx supabase start                                              # local Postgres via Docker
npx supabase db push                                             # apply migrations
npx supabase gen types typescript --local > lib/types/database.ts
```

Migrations live in `supabase/migrations/`; every table is default-deny RLS.
`supabase/tests/rls_role_isolation.sql` is a standalone role-isolation test —
run it against any Supabase Postgres connection with
`psql <connection> -v ON_ERROR_STOP=1 -f supabase/tests/rls_role_isolation.sql`.

## Commands

```bash
npm run dev          # start the dev server
npm run build         # production build — run before pushing
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
```

## Status

Scaffold, database schema, RLS, phone-styled auth, and the full visual system
(all 13 reference screens) are in place. See `CLAUDE.md`'s build order for
what's next — booking flow, matching, payments, and dashboards are still
placeholder/demo data pending their own build steps.
