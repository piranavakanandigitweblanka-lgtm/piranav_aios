# Evidence — Sonya Req 1 Stage Column Accordion UI

## Title
Sonya Req 1 — Stage column updated to accordion/dropdown UI (4 periods per row)

## Date
2026-07-08

## Member
Sonya

## Requirement
Requirement 1 — Campaign Data

## Change
Stage column changed from always-visible 60d/90d blocks to a per-row accordion.

---

## Previous UI (replaced)
Stage column showed two permanently visible blocks:
- 60 Days Performance (2026-05-09 – 2026-07-07)
- 90 Days Performance (2026-04-09 – 2026-07-07)

Table was wide and data was always expanded, making rows heavy.

---

## New UI

Each campaign row shows a compact button:

```
View Stage Details ▼
```

Clicking expands (per row, independently):

```
1. Last 30 Days       (2026-06-08 – 2026-07-07)
   Cost | ROAS | Conv. | Conv. Value

2. Before Last        (2026-05-09 – 2026-06-07)
   Cost | ROAS | Conv. | Conv. Value

3. Last 60 Days       (2026-05-09 – 2026-07-07)
   Cost | ROAS | Conv. | Conv. Value

4. Last 90 Days       (2026-04-09 – 2026-07-07)
   Cost | ROAS | Conv. | Conv. Value
```

Clicking again collapses. Button text toggles:
- Collapsed: "View Stage Details ▼"
- Expanded:  "Hide Stage Details ▲"

Each row is independent — expanding one does not affect others.

---

## Data Added to RAW

`bl` (Before Last — 2026-05-09 to 2026-06-07) re-added to each campaign.
Values derived from original data (not re-queried):

| Campaign | bl.cost | bl.cv | bl.conv | bl.roas |
|---|---|---|---|---|
| 20810136438 | £7,580.19 | £27,168.08 | 796.68 | 358.41% |
| 21435967873 | £2,713.00 | £10,549.56 | 281.58 | 388.85% |
| 22943583032 | £355.02 | £1,198.25 | 28.89 | 337.52% |
| 23526695953 | £326.75 | £1,042.30 | 27.21 | 318.99% |
| 23914872425 | £27.64 | £75.35 | 2.00 | 272.61% |
| 23515806682 | £271.18 | £2,166.92 | 11.25 | 799.07% |
| 23729304135 | £387.12 | £1,552.24 | 21.04 | 400.97% |
| 22847654610 | £158.43 | £351.28 | 14.42 | 221.73% |
| 23793722836 | £19.98 | £0.00 | 0.00 | — |

---

## Data Source
`public.ppc_etl_performance_data` — unchanged. All 4 period values embedded in RAW array.

---

## Files Changed
- `Staff-requirements/pages/sonya.html`
  - CSS: added `.stg-btn`, `.stg-panel` styles; reduced `.stage-cell` min-width to 160px
  - RAW array: added `bl` object per campaign
  - `stageHTML()`: replaced always-visible blocks with accordion button + collapsible panel
  - `toggleStage()`: new function for per-row expand/collapse
  - Table header: "Stage of Ads — 60 Days & 90 Days" → "Stage of Ads"
  - Validation, footnotes, footer updated
