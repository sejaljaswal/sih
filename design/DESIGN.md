# DESIGN.md — Sahaayak

Visual reference: `docs/sahaayak-ui.html` (open in a browser). Screen inventory:
`docs/PRD.md` §15. Route locations: `docs/ARCHITECTURE-V2.md` §3.1.

---

## Direction

The visual language comes from what cooperative societies already use: **paper
membership registers, receipt books and rubber stamps**. Verification reads as a
society seal, not a platform checkmark. Money screens read as a receipt, not a
fintech dashboard.

Three rules the design exists to serve:

1. **Money is the hero.** Any screen touching a rupee names where it goes.
2. **Trust is a stamp.** The society verified this person; the badge says which society.
3. **Ledger, not dashboard.** Ruled rows, tabular figures, double-rule totals.

Consciously avoided: purple/orange gradient card kits (reads as the private
aggregator we're displacing), government-portal blue, and cream + display-serif +
terracotta.

---

## Tailwind config

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        ink:    { DEFAULT:'#14211B', 2:'#3A4740', 3:'#5E6B62', 4:'#8C978F' },
        sage:   { 50:'#F4F6F1', 100:'#E9ECE5', 200:'#DADFD4', 300:'#C3CABB' },
        green:  { 50:'#EEF5F1', 100:'#D6E7DE', 200:'#A9CDBC', 300:'#6FAA93',
                  500:'#25795D', 600:'#17624A', 700:'#0E4A37', 900:'#092E22' },
        ochre:  { 50:'#FBF3E4', 100:'#F6E3BF', 300:'#E0AC5B', 500:'#C87F1B', 700:'#965C10' },
        slateb: { 100:'#DCE7EC', 500:'#3E7C9A', 700:'#2A5B73' },
        brick:  { 100:'#F5DEDB', 500:'#B04A3F', 700:'#8A362D' },
      },
      fontFamily: {
        sans: ['var(--font-familjen)', 'var(--font-noto-deva)', 'system-ui', 'sans-serif'],
        deva: ['var(--font-noto-deva)', 'var(--font-familjen)', 'sans-serif'],
      },
      borderRadius: { xs:'3px', card:'10px', pill:'999px' },
    },
  },
}
```

**Colour roles — do not reuse across roles.**

| Token | Only used for |
|---|---|
| `green-600` | Structure: primary actions, verified state, worker's share |
| `green-900` | Admin sidebar |
| `ochre-500` | **Three things only** — emergency, countdowns, the welfare fund. Never a general accent. |
| `slateb-500` | Society commission (in split views) |
| `brick-500` | Rejection, shortage, destructive |
| `sage-100` | Page canvas |
| `#A8ADA3` | Platform fee — deliberately drab, it's the least important slice |

**Split bar colours are fixed per destination** and appear nowhere else:
worker `#17624A` · society `#3E7C9A` · welfare `#C87F1B` · platform `#A8ADA3`.

---

## Type

```ts
// app/[locale]/layout.tsx
import { Familjen_Grotesk, Noto_Sans_Devanagari } from 'next/font/google'
const familjen = Familjen_Grotesk({ subsets:['latin'], variable:'--font-familjen' })
const noto = Noto_Sans_Devanagari({ subsets:['devanagari'], variable:'--font-noto-deva' })
```

One family for Latin, one for Devanagari. No display face — weight and size carry hierarchy.

**Two scales.** Worker screens step up because they are read outdoors, quickly, often
by someone with lower literacy.

| Role | Customer / admin | Worker |
|---|---|---|
| Page title | 19px / 700 | 19–26px / 700 |
| Section heading | 14px / 700 | 15px / 700 |
| Body | 13–15px / 400 | 15–17px / 500 |
| Caption | 11.5–12px | 13px |
| Amount (hero) | 34–40px / 700 | 40–46px / 700 |
| Min touch target | 44px | **56px** |

**All amounts use `font-variant-numeric: tabular-nums lining-nums`** so figures align
down a column. Add a `.num` utility and apply it to every rupee value, count, date and
distance.

---

## Signature components

### `<SocietyStamp size="xs|sm|lg" society state="verified|pending" />`

Circular, double-ruled, rotated `-9deg`, opacity `.92` so it reads as ink on paper.

```css
.stamp{ display:inline-flex; flex-direction:column; align-items:center;
  justify-content:center; border:2px solid #17624A; color:#17624A;
  border-radius:50%; transform:rotate(-9deg); font-weight:700; line-height:1.05;
  text-align:center; box-shadow:inset 0 0 0 1px #17624A; opacity:.92 }
.stamp-xs{width:52px;height:52px;font-size:5.5px}
.stamp-sm{width:74px;height:74px;font-size:7.5px}
.stamp-lg{width:104px;height:104px;font-size:10px}
```

Pending state: `border-style:dashed`, `opacity:.4` — an unstamped register entry.
Content is always three lines: mark, society name, registration year.

### `<SplitBar amounts breakdown />`

The product's signature. A horizontal stacked bar, **never a pie or donut**.

- Segment widths proportional, with a **1px minimum** so small slices never vanish.
- Print the amount inside a segment only above 8% width; otherwise it lives in the legend.
- 1px `ink` border around the whole bar, `3px` radius — a receipt rule, not a rounded card.
- Legend rows below: swatch · destination name · sub-label · amount, amounts right-aligned and tabular.
- **Always followed by one plain-language sentence** naming where the money stayed:
  "₹80 stayed in Shimla with your own society."

### `<LedgerRows>`

Line items on repeating 28px rules, closed with a double-rule total.

```css
.ledger{background-image:repeating-linear-gradient(to bottom,
  transparent 0 27px,#DADFD4 27px 28px)}
.rule-total{border-top:1px solid #14211B;border-bottom:3px double #14211B}
```

### `<OfferCard>` (worker)

Dark `ink` background — it takes over the screen, so it must not read as a normal card.
Earning is the largest element on the screen at 46px. Two buttons only: accept (green,
56px tall, 20px label) and decline (outline). Countdown is an ochre bar plus a `m:ss`
figure.

### `<ScoreBreakdown>`

The audit table on the society booking detail. Weights sit in the column headers,
the fairness column is emphasised in `ochre-700`, and the accepted row is tinted
`green-50`. This is the screen that proves the fairness claim — give it real space.

---

## Layout

| Breakpoint | Who | Shell |
|---|---|---|
| `<640px` | Customer + worker (primary) | Single column, bottom tab bar, sticky bottom CTA |
| `640–1024px` | Tablet | Two columns, collapsible sidebar |
| `>1024px` | Society + federation | `green-900` sidebar + content, tables and charts |

Build mobile-first. Admin routes are not optimised below 640px — nobody verifies
documents on a phone.

---

## Copy rules

- **Sentence case everywhere.** No ALL-CAPS labels.
- Buttons name what happens: "Approve and issue badge", not "Submit".
- The same action keeps the same word through the whole flow.
- Empty states give direction, not mood: "That's the whole queue" beats "No items found".
- Errors say what happened and what to do: "ITI certificate is blurred — send it again".
- Never explain the system to the user. "Your society is checking your documents",
  not "Verification status: PENDING".

---

## Motion

**One animation in the entire product** — the expanding radar rings while matching,
because a wait needs to show the system is working. Everything else responds only to
a tap: sheets opening, an accordion expanding, a confirmation.

No card hover lifts. No scroll-reveal. No skeleton shimmer where a simple ruled
placeholder will do. Wrap the radar in `@media (prefers-reduced-motion: no-preference)`.

---

## Quality floor

- Every screen checked in **Hindi at 360px** before it is called done — Devanagari runs
  20–30% longer, so buttons wrap to two lines rather than truncating.
- Visible keyboard focus ring: `2px` `green-600` offset `2px`.
- Body text meets WCAG AA against its surface; `ink-4` is decorative only, never body copy.
- Every icon that carries meaning has a text label beside it. Workers should never have
  to decode a glyph.
- No fixed-width container holds translated text.
