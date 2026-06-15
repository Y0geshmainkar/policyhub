# PolicyHub

A frontend demo of an insurance self-service portal. Demonstrates React + Redux architecture, a backend data-normalization layer, secure payment UX patterns, and accessibility.

## Quick Start

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # run unit tests
npm run build     # production build
```

## Tech Stack

- **React 18 + TypeScript** via Vite 5
- **Redux Toolkit** — `createSlice`, `configureStore`, typed hooks
- **React Router v6** — `/` dashboard, `/policy/:id` detail
- **SCSS Modules** — design tokens in `_tokens.scss`, no Tailwind
- **Axios** (Phase 3) — interceptors for global loading state
- **Jest + React Testing Library** — unit and component tests

## Architecture

```
src/
├── data/
│   ├── normalizers.ts   ← adapter functions per source system
│   └── mockData.ts      ← raw mock records → normalized via adapters
├── types/
│   └── policy.ts        ← Policy interface + Division/Status types
├── store/
│   ├── index.ts         ← configureStore
│   ├── policiesSlice.ts ← policies, activeDivision, selectedPolicyId
│   └── hooks.ts         ← useAppDispatch, useAppSelector
├── components/
│   ├── Header/
│   ├── Sidebar/         ← folder-tab navigation, roving tabindex
│   ├── PolicyCard/
│   └── StatusBadge/
├── pages/
│   ├── Dashboard/       ← filtered grid by activeDivision
│   └── PolicyDetail/    ← full policy view + sourceSystem badge
└── styles/
    ├── _tokens.scss     ← design tokens (colors, fonts, spacing)
    └── global.scss      ← resets, typography, focus ring
```

## Normalization Layer

Real insurance platforms aggregate data from multiple backend systems with incompatible schemas. This project models that directly:

| Source System | Policy ID field | Premium field    | Status codes         |
|---------------|-----------------|------------------|----------------------|
| CFO           | `policyId`      | `monthlyPremium` | `ACTIVE / DUE`       |
| OIPA          | `polNum`        | `premAmt`        | `01 / 02`            |
| OPA-LNL       | `policy_number` | `premium_amount` | `ACT / DUE`          |
| LNL           | `id`            | `amount`         | `A / D / L`          |

Each source has a dedicated `normalize*()` adapter in `src/data/normalizers.ts` that maps raw fields into the common `Policy` type. Components always consume the normalized shape — they never touch raw data.

The generic `normalizePolicy(raw, sourceSystem)` dispatcher is the public API. Unit tests in `src/__tests__/normalizers.test.ts` cover all four adapters.

**Interview talking points:**
- Demonstrates the Adapter pattern in a real enterprise context
- Adding a new source system = one new raw interface + one adapter function, zero component changes
- The `sourceSystem` field preserved on every `Policy` enables the "via CFO" badge on detail pages (Phase 2) — useful for debugging in production

## Design System

| Token        | Value     | Usage                          |
|--------------|-----------|--------------------------------|
| `$navy`      | `#1B2A40` | Header, sidebar, headings      |
| `$parchment` | `#F6F2E9` | Page background                |
| `$gold`      | `#B8923B` | Premium amounts, CTA, focus    |
| `$forest`    | `#3F6B52` | Active status badge            |
| `$rust`      | `#BC5A3C` | Due/lapsed status badge        |

Fonts: **Lora** (headings), **Inter** (body), **IBM Plex Mono** (policy IDs, amounts).

## Accessibility

- Sidebar uses `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`
- Roving `tabindex` — only the active tab is in the tab order; Arrow Up/Down moves focus
- `role="tabpanel"` on the main content area linked via `aria-labelledby`
- Global `:focus-visible` ring using `$gold` — never suppressed
- `StatusBadge` uses `aria-label` for screen reader context

## Phases

- **Phase 1** ✅ — Core dashboard (this PR)
- **Phase 2** — Policy detail + AutoPay toggle (Redux action)
- **Phase 3** — Payment modal, card tokenization, Axios interceptors
- **Phase 4** — Jest/RTL tests for all components, Storybook stories

## Deployment

GitHub Actions (`.github/workflows/ci-cd.yml`) runs tests on every push/PR, then deploys to GitHub Pages on `main`. Enable Pages in repo settings → **GitHub Actions** as source.
