---
name: sales2026-uk-grand-total
description: UK Grand Total sub-tab under Sales 2026 admin panel — aggregates all 14 UK sales endpoints into 6 channel groups with live data, donut chart, bar chart, and breakdown table.
metadata:
  type: capability
  date: 2026-09-17
---

## What It Does

Adds a 4th sub-tab "UK Total" under Sales 2026 in the admin panel (alongside DE, UK, FR). Shows ledsone.co.uk net sales grouped by channel for any selected month, with full visualisation.

## Where It Is

- **Frontend:** `dm-dashboard/frontend/src/admin/pages/Sales2026.jsx` — `UkGrandTotalView` component + `UK_GROUPS` config + `DonutChart` component
- **Nav:** `dm-dashboard/frontend/src/admin/AdminLayout.jsx` — `sales2026-uk-total` nav item + render panel

## Channel Groups

| Group | Endpoints |
|---|---|
| ADS | uk-dm-ad, uk-sonya, uk-sajeepan, uk-thishoban, uk-theekshy, uk-thanishtika, uk-cppc |
| SEO / Organic | uk-kamsi, uk-dilaksi, uk-organic |
| META | uk-meta |
| EMAIL | uk-sukirtha |
| DIRECT | uk-direct |
| NOT ASSIGNED | uk-not-assigned |

## UI Components

- Header: title + LIVE badge + single month picker + green Refresh + last updated timestamp
- KPI cards: UK Grand Total (large) + 6 colour-coded group cards with icons + % of total
- Bar chart: pure CSS horizontal bars proportional to max group value
- Donut chart: inline SVG with legend
- Breakdown table: colour left border per group, expand/collapse rows, Expand All toggle, green grand total footer

## Data Source

- Same 14 existing `/api/sales/uk-*?month=YYYY-MM` endpoints — no new backend
- Uses `combinedSummary.netSales` — matches individual tab Net Sales value
- Single month filter (same UX as individual UK tabs) — prevents mismatch
- Month picker auto-extends each month from `CURRENT_MONTH` clock — no manual edits needed

## Commits

- `18a6cd7` — initial build (piranv-work)
- `48e3933` — full UI/UX redesign matching screenshot
- `78d0cae` — date filter visibility fix (transparent → bordered selects)
- `f8738bf` — reverted grossSales back to netSales
- `2c8e16e` — From/To range → single month picker (matches individual tabs)

All on `websitetecteam-arch/dm-dashboard` piranv-work.
