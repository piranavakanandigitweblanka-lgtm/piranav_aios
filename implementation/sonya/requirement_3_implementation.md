# Sonya Requirement 3 — Implementation Record

**Title:** Trend & Segment Dashboard — Product Intelligence Tab
**Task:** Add Requirement 3 to the Trend tab in pages/sonya.html
**Date:** 2026-07-08
**Member:** Sonya
**Team:** Google Ads

---

## Requirement Source
- CSV: `C:/Users/PC/Downloads/Sonya ID 08_07_ 2026 - products-variant.csv`
- 5778 rows, 1724 unique Shopify Product IDs (Parent List ID column)

## PostgreSQL Sources (Read-Only)

| Table | Schema | Use |
|---|---|---|
| `ppc_etl_performance_data` | public | L30 Google Ads product performance (impressions, clicks, cost, sales, orders) |
| `order_transaction` | public | Seasonal trend (Aug 2024/2025 sales) and Recent Drop-off (May vs Jun 2026) |

Inspected but not used for this requirement:
- `public.google_product_performance` (data only to Feb 2025, not current)
- `public.listing_data` (image_url empty for most shopify products; price deferred)
- `public.inv_final_stock` (stock deferred to Phase 2)
- `staging_ai.google_variant_product_sku_bridge_v1`
- `staging_ai.cppc_google_sku_bridge_v2`

## Data Results

| Metric | Value |
|---|---|
| CSV Product IDs (total) | 1724 |
| Deduplicated | 1724 |
| Matched in ppc_etl_performance_data | 1162 |
| Data Missing | 562 |
| Seasonal Top Sellers (Aug 2024+2025 > 2 units) | 38 |
| Recent Drop-offs (May sold, Jun zero) | 24 |

## Files Changed
- `Staff-requirements/pages/sonya.html` — Trend tab (panel-3) updated with Req3 content
- `backup/sonya_req3_pre_2026-07-08.html` — Pre-edit backup created

## Implementation Details

### Segment Logic (priority order)
1. Zombie: impressions = 0
2. Low Engagement: impressions > 0 AND clicks = 0
3. Bleeding: clicks >= 7 AND CVR < 0.01%
4. Monitor Cut: clicks < 7 AND CVR < 0.01%
5. High Priority Cut: ROAS < 250% AND conversions > 0
6. Orange: ROAS >= 250% AND ROAS <= 300%
7. Amber: ROAS > 300% AND ROAS < 400%
8. Green: ROAS >= 400%
9. Data Missing: no L30 data in ppc_etl_performance_data

### Trend Logic
- **Seasonal Top Sellers:** Shopify sales > 2 in August 2024 or August 2025 (upcoming month from July 2026). Source: public.order_transaction.
- **Recent Drop-offs:** Sales in May 2026 > 0 AND June 2026 = 0. Source: public.order_transaction.

### Stage Logic
- Trend List: if seasonal OR drop-off
- Monitor: all other products

### Columns Implemented
Product ID, SKU, Impressions, Clicks, Cost, CTR%, CVR%, ROAS%, Conversions, Conv. Value, Segment, Trend, Stage

### Columns Deferred (Phase 2)
Image, Product URL, Price, Stock, SKU's Performing Keywords From Other Source

## Status: PASS
