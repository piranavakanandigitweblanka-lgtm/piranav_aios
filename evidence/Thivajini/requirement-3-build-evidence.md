# Thivajini — Requirement 3 — Build Evidence
## Date: 2026-07-09

**Title:** Req 3 Stock-Spend Tracker Build Evidence
**Purpose:** Documents what was built, data used, and counts confirmed
**Team Member:** Thivajini
**Business Question:** Which LEDSone FR products are wasting Google Ads spend due to OOS or low stock?

## What Was Built

**File modified:** Staff-requirements/pages/thivajini.html
- Panel-3 replaced with full Stock-Spend Tracker dashboard
- Req 3 tab nav updated: "—" → "Stock-Spend Tracker / Req 3"
- Panel-1 (Req 1) unchanged
- Panel-2 (Req 2) unchanged
- R3PRODUCTS JS array embedded (324 products, ~152KB)
- r3Render(), r3CSV() functions added

## Dashboard Components

| Component | Included |
|-----------|----------|
| KPI cards (9) | STOP, ACT SOON, MONITOR, OK, Total, Wasted Spend, Match counts |
| Segment colour rows | STOP=red, ACT SOON=orange, MONITOR=amber, OK=white |
| Search filter | SKU / product name / variant ID |
| Campaign filter | Topsell / Imp_Click |
| Feed Availability filter | in stock / out of stock |
| Match Method filter | product_id / record_id / missing |
| Flag filter | STOP / ACT SOON / MONITOR / OK |
| Sort options | Flag, 30d Spend, Wasted Spend, Stock, Clicks |
| CSV export | 18 columns |
| Footer notes | Data sources, business rules, match method explanation |

## Data Counts (Fresh PostgreSQL — 2026-07-09)

| Metric | Count/Value |
|--------|-------------|
| Total products (30d spend or impressions) | 324 |
| STOP — Out of Stock | 14 |
| ACT SOON — Low Stock | 1 |
| MONITOR | 3 |
| OK | 306 |
| Total wasted spend (STOP only) | €13.40 |
| Product ID match | 144 |
| Record ID match | 102 |
| Missing mapping | 78 |
| Low stock threshold | 5 units (default) |
| Campaigns found | 2 (Topsell, Imp_Click) |

## SQL Used

### Primary production query
- ppc_etl_performance_data (sub_source_id=233, last 30 days)
- google_merchant_products (merchant_id=5551466539, DISTINCT ON product_id)
- listing_data (sub_source=233, ref_id=variant_id for stock)
- public.ppc (campaign name lookup)
- 3-way join: product_id direct + record_id fallback + listing_data.ref_id for stock

## AIOS Constraint Compliance

| Rule | Status |
|------|--------|
| No PostgreSQL modifications | CONFIRMED |
| No fake data invented | CONFIRMED |
| Not reusing stale cppc_workbook_stock_spend_v1 | CONFIRMED |
| Only LEDSone FR (sub_source_id=233) | CONFIRMED |
| Req 1 and Req 2 unchanged | CONFIRMED |
| No Vercel deployment | CONFIRMED |

## Files Created/Modified
- Staff-requirements/pages/thivajini.html — MODIFIED
- evidence/Thivajini/requirement-3-data-mapping.md
- evidence/Thivajini/requirement-3-build-evidence.md (this file)
- validation/Thivajini/requirement-3-validation.md
- handover/Thivajini/requirement-3-handover.md
- reports/Thivajini/requirement-3-summary.md
- vercel/Thivajini/requirement-3-deployment-notes.md

## PASS / FAIL: PASS

**Owner:** Thivajini | **Reviewer:** GPT / Piranav
