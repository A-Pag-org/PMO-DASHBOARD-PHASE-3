# PMO Dashboard — Phase 3 (React)

React (Vite) port of the Delhi NCR Clean Air monitoring dashboards.

```bash
npm install
npm run dev
```

## Structure

| File | Purpose |
|---|---|
| `src/data.js` | All metric definitions — L1 + L2 per initiative, NCR totals, per-state weights (`REGION_W`), ministries, nav. Single source of truth. |
| `src/ui.jsx` | Shared pieces: status bar, info button, date-range and state dropdowns, the Process popup (L1 cards + all-stages L2 list) and the metric detail drawer. |
| `src/Summary.jsx` | Consolidated Delhi NCR summary — one card per initiative, grouped by ministry. |
| `src/Dashboard.jsx` | Single initiative, one card per state (Delhi, UP, Rajasthan, Haryana). |
| `src/App.jsx` | Screen switch between the summary and each initiative. |

## Data model

Each initiative in `INITIATIVES` carries its L1 metric(s) and its full L2 list as
`{ num, den }` NCR totals plus definition metadata (formula, rationale, agency,
data source, process context, glossary). State-level figures are derived from
`REGION_W` — `[share of denominator, relative performance]` per state — so state
values always sum back to the NCR total. The date range scales numerators via
`rangeFactor`; denominators are targets and do not move.

Replace `num`/`den` with live API values and the whole UI follows.

## Status bands

`>= 75%` green · `50–74%` amber · `< 50%` red. Metrics flagged `invert: true`
(e.g. % applications rejected) band on the inverse; `rate: true` metrics
(e.g. intake per SCC) have no target band.
