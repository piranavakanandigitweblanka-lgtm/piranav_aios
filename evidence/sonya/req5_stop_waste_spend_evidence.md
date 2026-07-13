# Sonya Req5 — Stop Waste Spend Evidence

**Title:** Stop Waste Spend Tab — PostgreSQL Discovery & Data Evidence
**Task:** sonya-requirement-5-stop-waste-spend
**Date:** 2026-07-13
**Member:** Piranav
**Team:** Google Ads Team
**Requirement Source:** GPT-approved Requirement 5 brief
**Reviewer:** GPT

---

## PostgreSQL Sources

| Table | Schema | Purpose |
|---|---|---|
| `campaign_performance` | google_ads | 30/60/90-day cost, conv, cv per campaign |
| `campaigns` | google_ads | Campaign names, IDs, budgets, status |
| `asset_performance` | google_ads | Per-asset cost, clicks, conversions |
| `campaign_search_term_data` | google_ads | Search terms with clicks, conversions |

**No geo/geographic table found** across any schema — checked: inventory, google_ads, google_analytics, google_search_console, public. Geo Exclude column shows "No Data Available".

---

## Schemas Inspected

accounting, amazon_campaigns, business_reports, customer_service, customers, google_ads, google_analytics, google_search_console, inventory, listings, order_management, public, reports, staff, suppliers

---

## Data As-Of

MAX(date) in campaign_performance = **2026-07-13**

- Last 30 days: 2026-06-14 → 2026-07-13
- Prev 30 days: 2026-05-15 → 2026-06-13
- Prev 60–90 days: 2026-04-15 → 2026-05-14

---

## Sonya Campaigns Found: 20

10 have campaign_performance data in the 90-day window; 10 are paused/inactive with no recent spend.

Active campaigns (have 30d spend):
- Pmax UK | Sonya | Klarna | PH_ALL ... (£2,134.76 / 30d, ROAS 331%)
- Pmax UK | Sonya | Shoptimised | SUMMER_TRENDS ... (£623.72 / 30d, ROAS 177%)
- Pmax UK | Sonya | Klarna | EUR_76 ... (£403.14 / 30d, ROAS 239%)
- Pmax UK | Sonya | Shoptimised | English_EU ... (£153.91 / 30d, ROAS 130%)
- ES Pmax UK | Sonya | GCSS | BATTLE ... (£115.63 / 30d, ROAS 29%)
- Pmax UK | Sonya | Klarna | GB C1 | Zombies ... (£100.03 / 30d, ROAS 225%)
- Pmax UK | Sonya | Shoptimised | SONYA2026 ... (£96.76 / 30d, ROAS 103%)
- Pmax UK | Sonya | GCSS | NICC_07 ... (£1.04 / 30d — nearly paused)

---

## Wasteful Products (cost>99, clicks>2, CVR<0.01%, last 90d)

**Count: 0** — No product variants met all three criteria. The CVR threshold is very strict; most wasteful products either have fewer than 3 clicks or show at least some conversions when cost>99.

---

## Wasteful Assets (cost>3, clicks>2, conversions=0, last 90d)

**Count: 17 asset IDs across 3 campaigns**

| Campaign | Asset IDs |
|---|---|
| Pmax UK Sonya Klarna PH_ALL | 256278224260, 66365260396, 135608169877, 259200709906, 202642236934, 156650804034, 145026465870, 288813460011, 327827050731 (9 assets) |
| Pmax UK Sonya Shoptimised SUMMER_TRENDS | 281655712047, 281655712044 (2 assets) |
| Pmax UK Sonya GCSS NICC_07 | 40530256194, 358906682760, 354956396537, 354956396540, 358906682766, 179046405474 (6 assets) |

---

## Negative Keyword Candidates (clicks>5, conversions=0, last 90d)

**Count: 44 search terms across 4 campaigns**

Note: `cost` column in campaign_search_term_data is NULL for all rows — threshold adjusted to clicks>5 and conversions=0. Top wasteful terms include: "industrial lighting" (15 clk), "ledsone uk" (34 clk), "pool table lights" (20 clk), "spider ceiling light" (13 clk), "plug in wall lights" (12 clk each in 2 campaigns).

---

## Geo Exclude

**No geo performance table found.** Searched for tables with names containing 'geo', 'geographic', 'location'. Only matches were inventory.local_inventory_current_stock_location_wise and pg_catalog.pg_largeobject_metadata — neither is a geo ads performance source. Displayed as "No Data Available".

---

## Files Changed

- `Staff-requirements/pages/sonya.html` — panel-5 placeholder replaced, SWS_CAMPAIGNS + JS injected

## Status: PASS (with known data gaps)

## Known Risks
- Wasteful products: 0 found — criteria may be too strict or product-level CVR data is aggregated differently
- Geo: no source table available
- Search term cost field is NULL in campaign_search_term_data
- 10 of 20 campaigns have no 90-day spend data (paused)

## Next Action
- GPT to review if wasteful product thresholds should be relaxed
- GPT to confirm geo data source or mark as permanently unavailable
- No git push until GPT approval

## PASS / FAIL: PASS
