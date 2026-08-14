# PMO Dashboard — Phase 3 (React)

React (Vite) port of the Delhi NCR Clean Air monitoring dashboards.

## Run locally (VS Code)

Open this folder in VS Code, then in its terminal:

```bash
npm install      # once — needs Node 18 or newer
npm run dev      # http://localhost:5173
```

`npm run build` writes a static `dist/` folder; `npm run preview` serves it.
Nothing else to configure — no env vars, no backend, no API keys.

## Structure

| File | Purpose |
|---|---|
| `src/data.js` | All metric definitions — L1 + L2 per initiative, NCR totals, per-state weights (`REGION_W`), ministries, nav. Single source of truth. |
| `src/ui.jsx` | Shared pieces: status bar, info button, date-range and state dropdowns, the metric detail drawer, the L2 grid template. |
| `src/Process.jsx` | Full-page process view — L1 cards across the top, the complete L2 list below, definitions in a drawer. |
| `src/Summary.jsx` | Consolidated Delhi NCR summary — one card per initiative, grouped by ministry. |
| `src/Comparative.jsx` | One card per state for a single initiative (Delhi, UP, Rajasthan, Haryana). |
| `src/App.jsx` | Hash router: `#summary` (initiative tiles), `#<initiative>` (process at Delhi NCR level), `#<initiative>/<state>`, `#<initiative>/comparative` — browser Back and refresh both work. |

## Data model

Each initiative in `INITIATIVES` carries its L1 metric(s) and its full L2 list as
`{ num, den }` NCR totals plus definition metadata (formula, rationale, agency,
data source, process context, glossary). State-level figures are derived from
`REGION_W` — `[share of denominator, relative performance]` per state — so state
values always sum back to the NCR total. The date range scales numerators via
`rangeFactor`; denominators are targets and do not move.

Replace `num`/`den` with live API values and the whole UI follows.

## Segments

Initiatives with a meaningful breakdown carry a `splits` list, surfaced as a
dropdown on the process page: PARIVARTAN (Trucks / Buses), MRS (all road widths,
above 15 m, 10–15 m, below 10 m) and CEMS/APCD (APCD scheme / OCEMS installation).
A row tagged `seg` shows only under that segment; untagged rows are rescaled by
the segment's share of the base (`mult`) and its relative performance (`perf`).
The tile levels always show every segment combined.

## Status bands

`>= 75%` green · `50–74%` amber · `< 50%` red. Metrics flagged `invert: true`
(e.g. % applications rejected) band on the inverse; `rate: true` metrics
(e.g. intake per SCC) have no target band.
