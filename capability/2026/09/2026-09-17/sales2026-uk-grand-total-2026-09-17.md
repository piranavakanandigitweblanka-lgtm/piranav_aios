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

---

## Extension — Sales2026 UK Shopify Actuals Tab (2026-09-22)

A separate "Shopify Actuals" tab was added to the UK panel of Sales2026 on 2026-09-22. This is a different approach from the UK Grand Total tab above.

| Property | UK Grand Total | Shopify Actuals |
|---|---|---|
| Data source | 14 existing `/api/sales/uk-*` endpoints | New `/api/sales/uk-shopify-actuals` endpoint using ShopifyQL |
| Aggregation | 6 channel groups | Monthly buckets (all non-cancelled, non-test UK orders) |
| Metrics | Net Sales per channel | Gross, Discounts, Sales Reversals, Net Sales, Shipping, Return Fees, Taxes, Total Sales |
| Purpose | Channel attribution view | Direct Shopify revenue actuals view |

**Backend:** `backend/app/sales.py` — new `_build_uk_shopify_actuals_payload()` function + `/uk-shopify-actuals` endpoint using ShopifyQL API.
**Frontend:** `frontend/src/admin/pages/Sales2026.jsx` — tab switcher (Channel Summary / Shopify Actuals) + 6 KPI cards + monthly table + Grand Total row.

**Key commits:** `ae3314f`, `6a769ad`, `109e349`, `8b85c4a`, `c2a9d7b`, `6ffd3f8` on `websitetecteam-arch/dm-dashboard piranv-work`
**Evidence:** `closure/README.md — 2026-09-22 Sales2026 UK Shopify Actuals Tab`
**Prompt:** `prompts/implementation/sales2026-uk-shopify-actuals-tab.md`, `prompts/implementation/sales2026-uk-shopify-actuals-shopifyql.md`

---

## Last Updated
2026-10-08

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-09-17 | UK Grand Total sub-tab built and deployed | commits `18a6cd7`, `48e3933`, `78d0cae`, `f8738bf`, `2c8e16e` |
| 2026-09-22 | Shopify Actuals tab extended onto UK panel | commits `ae3314f`–`6ffd3f8` on piranv-work |
| 2026-10-08 | Extension documented in this capability file | `closure/README.md — 2026-09-22` |
