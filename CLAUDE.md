# CLAUDE.md — Sahaayak

Project context for Claude Code. This file is loaded into every session, so it stays
short. The two long documents in `docs/` are read **on demand**, not by default.

---

## What this is

**Sahaayak** is a cooperative-owned digital marketplace for household and community
services, built for Smart India Hackathon 2026 (PS 26089, Ministry of Cooperation /
NCCT). Labour Cooperative Societies verify and register their own skilled workers
(electricians, plumbers, caregivers, cleaners); households book them; payment splits
automatically into worker wage, society commission and a welfare contribution.

The differentiator is **not** the booking flow — it is that the platform is owned by
the cooperative, wages have a society-set floor, job allocation is fairness-aware,
and welfare funding is inside the payment split rather than an optional add-on.

Team: 5–6 students. Budget: ₹0. Everything must run on free tiers.

---

## Reference documents

Read these when a task touches their area. Do not read both in full for a small change.

| File | Authoritative for |
|---|---|
| `docs/PRD.md` (v1) | PRD, personas, user stories, FR/NFR (§5) · RBAC matrix (§8) · **database schema (§11)** · geo-matching logic (§12) · AI models (§13) · frontend IA and screen list (§15) · i18n (§16) · security & privacy (§17) · demo script (§21) |
| `docs/ARCHITECTURE-V2.md` | **Stack** · app architecture and route structure (§3) · server actions (§3.3) · **matching SQL function (§4)** · AI without a Python server (§5) · **RLS (§6)** · PWA (§7) · deployment (§8) · build order (§12) |

**v2 supersedes v1 sections 3, 9, 14, 15, 18, 19 and 20.** Where they disagree on
stack, architecture, API shape or deployment, **v2 wins**. Everything else in v1 is
still current.

Quick routing:
- Building a screen → v1 §15 (what screens exist) + v2 §3.1 (where they live)
- Writing a table or migration → v1 §11
- Matching or ranking → v2 §4, then v1 §12 for the rationale
- Anything touching permissions → v1 §8 + v2 §6
- AI work → v1 §13 + v2 §5

---

## Stack — do not substitute

```
Next.js 15 (App Router) · React 19 · TypeScript (strict)
TailwindCSS · shadcn/ui
Supabase: Postgres 15 + PostGIS · Auth · Storage · Realtime
Business logic: Server Actions + Route Handlers
Matching: Postgres plpgsql function via supabase.rpc()
Forms: react-hook-form + zod
Server state: TanStack Query · Client state: Zustand (minimal)
Maps: Leaflet + react-leaflet + OpenStreetMap + Nominatim
Charts: Recharts
i18n: next-intl
PWA: next-pwa
Payments: Razorpay TEST MODE
PDF: @react-pdf/renderer
ML: Python offline (scikit-learn, statsmodels) → writes to Postgres
Deploy: Vercel + Supabase (both free)
```

If a task seems to need a library not listed here, **ask before adding it**. Every
dependency is a thing six students have to learn and a thing that can break the build
the night before the finale.

---

## Non-negotiable rules

1. **Money is `BIGINT` paise.** Never float, never decimal, never rupees in the DB.
   `₹800.50` is `80050`. Format for display only, at the edge.
2. **`SUPABASE_SERVICE_ROLE_KEY` is server-only.** It must never be prefixed
   `NEXT_PUBLIC_`, never imported into a client component, never reach the bundle.
3. **No client-side writes.** All mutations go through server actions in `app/actions/`
   using the service-role client. The browser gets the anon key and read access only.
4. **RLS is default-deny on every table.** A new table without policies is a bug.
5. **Prices are computed server-side** from the stored society rate card. Never trust
   an amount sent by the client. Snapshot the rate card onto the booking row.
6. **No hardcoded user-facing strings.** Everything goes through `next-intl` keys.
   Server code returns `message_key`, never a translated sentence.
7. **Locations are `geography(Point,4326)`** with GIST indexes. Not float lat/lng columns.
8. **Server actions live in `app/actions/<domain>.ts`**, never inline in a page or
   component. They are the seam that lets logic be extracted later.
9. **Always store `score_breakdown`** on `booking_offers`. Explainable matching is the
   product's central claim; a match we cannot explain is worthless.
10. **External providers sit behind an adapter** (`lib/adapters/`) with a mock
    implementation selected by env var: `SMS_PROVIDER`, `KYC_PROVIDER`,
    `INSURANCE_PROVIDER`. Swapping in a real integration must be a config change.
11. **Every schema change is a migration file** in `supabase/migrations/`. No changes
    made by hand in the Supabase dashboard.
12. **Do not build Phase 2 or Phase 3 features.** See "Out of scope" below.

---

## Directory structure

```
sahaayak/
├── CLAUDE.md
├── docs/
│   ├── PRD.md                       # v1 — full PRD + architecture
│   └── ARCHITECTURE-V2.md           # v2 — Next.js + Supabase (authoritative on stack)
├── app/
│   ├── [locale]/
│   │   ├── (public)/                # landing, login, register
│   │   ├── (customer)/              # home, services, book, bookings, profile
│   │   ├── (worker)/                # dashboard, offers, jobs, earnings, profile
│   │   ├── (society)/               # overview, verification, workers, rates, analytics
│   │   └── (federation)/            # overview, societies, heatmap, insights, welfare
│   ├── api/
│   │   ├── payments/{create-order,verify,webhook}/route.ts
│   │   ├── ai/classify/route.ts
│   │   └── invoice/[bookingId]/route.ts
│   ├── actions/                     # auth · bookings · offers · workers ·
│   │                                # verification · rates · payments · ratings · analytics
│   └── middleware.ts                # locale → session → role guard
├── components/
│   ├── ui/                          # shadcn primitives — OWNED, ask before editing
│   └── domain/                      # WorkerCard, OfferCard, PriceBreakupCard,
│                                    # StatusTimeline, MapPicker, StarRating
├── lib/
│   ├── supabase/{client,server,middleware}.ts
│   ├── adapters/{sms,kyc,insurance}/
│   ├── ai/{classify.ts,classifier.json}
│   ├── pricing.ts                   # split calculation — single source of truth
│   └── types/database.ts            # generated from Supabase
├── messages/{en,hi,pa}.json
├── supabase/
│   ├── migrations/
│   └── seed/
├── ml/
│   ├── train_forecast.py
│   ├── train_classifier.py
│   ├── export_classifier.py
│   └── data/training_phrases.csv
└── public/{manifest.json, icons}
```

---

## Conventions

- **TypeScript strict.** No `any`. Database types come from
  `supabase gen types typescript` into `lib/types/database.ts` — regenerate after
  every migration, do not hand-write them.
- **zod schemas are shared** between the form and the server action. Define once in
  `lib/schemas/`, import in both.
- **Server Components by default.** Add `'use client'` only when the component needs
  state, effects, or a browser API. Data for initial render is fetched in the RSC.
- **Files:** kebab-case (`worker-card.tsx`). **Components:** PascalCase.
  **Server actions:** camelCase verbs (`acceptOffer`, `verifyWorker`).
- **Errors:** server actions return `{ ok: true, data }` or
  `{ ok: false, code, messageKey }`. They do not throw across the boundary, and they
  do not return English prose meant for a user.
- **Comments explain why, not what.** The code says what it does.
- Money formatting, date formatting and pluralisation all go through `Intl` with the
  active locale.

---

## Domain glossary

| Term | Meaning |
|---|---|
| **Federation** | State/district-level body governing many Societies |
| **Society** | Labour Cooperative Society — registers, verifies and employs the workers |
| **Worker** | A verified member of one Society who performs services |
| **Rate card** | Per-society, per-service pricing: customer price, floor wage, commission %, welfare %, platform % |
| **Split** | The four-way division of a payment: worker / society commission / welfare / platform |
| **Welfare contribution** | A percentage of every job automatically credited to the worker's welfare ledger, funding insurance |
| **Offer** | A dispatched job invitation to one worker, with an expiry timer |
| **Fairness score** | Ranking component that boosts workers with fewer jobs in the last 7 days relative to their society average |
| **Start-OTP** | 4-digit code the customer gives the worker to begin the job — prevents falsely-started jobs |
| **Emergency booking** | On-demand booking: wider radius, parallel offers to 5 workers, 30s timer, surcharge that goes **entirely to the worker** |

---

## Commands

```bash
npm run dev                     # next dev
npm run build                   # always run before pushing
npm run lint && npm run typecheck

npx supabase start              # local stack
npx supabase migration new <name>
npx supabase db push
npx supabase gen types typescript --local > lib/types/database.ts
npm run seed                    # 1 federation, 3 societies, 40 workers, 8 months bookings

python ml/train_forecast.py     # writes demand_forecasts in Supabase
python ml/train_classifier.py && python ml/export_classifier.py
```

---

## Known traps in this stack

These have cost teams a day each. Encode them, don't rediscover them.

- **Leaflet breaks SSR.** Import map components with
  `dynamic(() => import('...'), { ssr: false })`. Same for anything touching `window`.
- **Recharts needs `'use client'`.**
- **Razorpay webhooks need the raw body** for signature verification — use a Route
  Handler and read `await req.text()`, not `req.json()`.
- **Vercel free tier has a 10-second function timeout.** Nothing in the request path
  may exceed it. Model training runs offline, never in a request.
- **Nominatim rate-limits to ~1 request/second** and requires a User-Agent. Debounce
  the address search and cache results.
- **Supabase free projects pause after 7 idle days.** Someone logs in weekly.
- **`revalidatePath`** after every mutation that changes a list the user is looking at,
  or the UI silently shows stale data.
- **Devanagari text runs 20–30% longer than English.** Check every layout in Hindi at
  360px width before calling a screen done.
- **Realtime needs the table added to the publication:**
  `alter publication supabase_realtime add table booking_offers;`

---

## Definition of done

A task is complete when:

1. It type-checks and builds (`npm run build`).
2. RLS policies exist for any new table, and a non-owner cannot read the row.
3. All user-facing strings are i18n keys present in `en`, `hi` and `pa`.
4. It renders correctly at 360px width.
5. Loading and empty states exist — no bare spinners on a blank page.
6. Errors are handled and surfaced as a localised message.
7. Money is paise end to end and computed server-side.
8. No secret is exposed to the client bundle.

---

## Build order

Follow `docs/ARCHITECTURE-V2.md` §12. Summary:

```
1–3   Scaffold · Supabase + PostGIS + full schema · RLS policies + role tests
4–6   Auth (phone-styled email login, role in app_metadata) · middleware · next-intl · route shells
7–8   Seed data generator · catalogue + rate cards
9–11  Worker registration + private document upload · society verification queue · address picker
12–15 find_candidate_workers() · booking creation · offer dispatch + Realtime · job lifecycle + start-OTP
16–18 Razorpay + split + welfare ledger · earnings · ratings
19–21 Society dashboard · Federation dashboard · forecast script → insights page
22–23 Classifier · invoice PDF · i18n pass · responsive QA · PWA · rehearse
```

Steps 1–17 are the product. Steps 18–23 are what wins the round.

---

## Out of scope — do not build

Real SMS · DigiLocker eKYC · live payment settlement or payouts · recurring bookings ·
grievance workflow · road-distance ETA · availability calendar · LightGBM forecasting ·
sentiment analysis · Bhashini voice · WhatsApp/IVR · Redis/Celery · live GPS tracking ·
bulk import · report export · multi-tenancy · OR-Tools optimisation · MLOps · dynamic
pricing · ONDC · institution accounts · training marketplace · fraud detection.

If a task seems to require one of these, say so and propose the mock instead.

---

## Mocked in Phase 1

Each is a real interface with a fake implementation, selected by env var. Keep it that way.

| Mocked | Env | Note |
|---|---|---|
| SMS OTP | `SMS_PROVIDER=mock` | Fixed code shown on screen in dev |
| eKYC | `KYC_PROVIDER=mock` | Returns a stubbed verified identity |
| Insurance / e-Shram | `INSURANCE_PROVIDER=mock` | Writes a real policy row |
| Payment | Razorpay **test mode** | Real checkout, real webhooks, no money |
| Worker GPS movement | — | Simulated position updates |
| Booking history | — | Synthetic but seasonally realistic seed data |

---

## How to work with me

- **Ask before**: adding a dependency, changing the schema, altering `components/ui/`
  or `lib/`, or refactoring anything outside the current task.
- **Keep changes scoped.** One task, one concern. Six people share this repo and a
  wide diff is a merge conflict with someone else's work.
- **Flag rule violations** rather than working around them. If a task can only be done
  by trusting a client-supplied price, say so — the task is wrong, not the rule.
- **Prefer the boring solution.** This ships in four weeks and is demoed live.
- If something in `docs/` contradicts what a task asks for, say which document and
  section, and ask.
