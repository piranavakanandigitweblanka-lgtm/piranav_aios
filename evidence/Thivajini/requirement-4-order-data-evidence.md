# Thivajini — Requirement 4 — Order Data — Evidence
## Date: 2026-07-09

**Title:** Req 4 Order Data Build Evidence
**Team Member:** Thivajini
**Business Question:** Which LEDSone FR products have Shopify orders versus Google Ads orders over 30/60/90 days?

## PostgreSQL Objects Inspected
- public.ppc_etl_performance_data — columns verified: sku, record_id, orders, date, sub_source_id, record_type
- Confirmed: `orders` column exists (DOUBLE PRECISION)
- Confirmed: sub_source_id=233 = LEDSone FR
- Confirmed: record_type='product' rows used (not campaign/adgroup level)

## Shopify Sources Inspected
- ShopifyQL: `FROM sales SHOW orders, gross_sales GROUP BY product_title` × 3 windows
  - 90d: 213 total orders, 127 distinct products
  - 60d: 136 total orders, ~98 distinct products
  - 30d: 69 total orders, 59 distinct products
- Shopify GraphQL: Product title lookup by product ID (for Ads product ID → title mapping)
- Shopify GraphQL: Product variant lookup by variant ID (for sku=0 rows)

## Matching Key Used
**Product Title** (exact string match after normalisation)
- ppc_etl record_id `shopify_zz_{product_id}_{variant_id}` → product_id → Shopify product title (via GraphQL)
- ppc_etl sku=numeric → variant ID → Shopify product title (via GraphQL)
- Variant-level Ads rows aggregated to product level before matching
- Match coverage: 36 distinct Ad-ordered products → 36 title lookups resolved

## Pre-Duplicate Check
- Searched all AIOS directories for Req 4: NO existing files found
- Checked thivajini.html panel-4: was placeholder ("Not yet defined")
- CONFIRMED: No duplicate work existed

## Data Results

### Ads Orders (PostgreSQL ppc_etl, sub_source_id=233)
| Window | Products with Orders | Total Ads Orders |
|--------|---------------------|-----------------|
| 30d | 18 | 20 |
| 60d | 27 | 31 |
| 90d | 36 | 48 |

### Shopify Orders (ShopifyQL analytics)
| Window | Products with Orders | Total Shopify Orders |
|--------|---------------------|---------------------|
| 30d | 59 | 69 |
| 60d | ~98 | 136 |
| 90d | 127 | 213 |

### Merged Dataset (128 products)
| Status | Count |
|--------|-------|
| Ads Driven (≥80% ads contribution, 30d) | 13 |
| Balanced (40–79%) | 2 |
| Organic Heavy (<40%) | 1 |
| Organic Only (Shopify>0, Ads=0, 30d) | 42 |
| No Orders (Shopify=0 in 30d window) | 70 |

### Ads Contribution (30d overall)
- Total Shopify 30d: 69
- Total Ads 30d: 20
- Overall Ads Contribution: 29%

## Dashboard Built
- Panel-4 replaced with full Order Data dashboard
- KPI cards: 6 (Products Tracked, Shopify 30d, Ads 30d, Ads Contribution%, Shopify 90d, Ads 90d)
- Legend: 5 status bands
- Filters: Search, Status, Window (30/60/90d), Sort
- Table: 11 columns (Product, Price, Shopify 90/60/30, Ads 90/60/30, Diff, Ads%, Status)
- CSV export: 11 columns
- Nav button: "Order Data / Req 4"

## AIOS Constraints Compliance
| Rule | Status |
|------|--------|
| No PostgreSQL modifications | CONFIRMED |
| No fake data | CONFIRMED |
| Only LEDSone FR (sub_source_id=233) | CONFIRMED |
| Req 1/2/3 unchanged | CONFIRMED |
| No Vercel deployment | CONFIRMED |
| No Git push (pending GPT approval) | CONFIRMED |

## PASS / FAIL: PASS (local only)

**Owner:** Thivajini | **Reviewer:** GPT / Piranav
