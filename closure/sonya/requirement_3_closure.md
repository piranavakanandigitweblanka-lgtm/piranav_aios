# Sonya Requirement 3 — Closure

**Date:** 2026-07-08
**Status:** PASS
**Member:** Sonya / Team: Google Ads

## Summary
Requirement 3 (Trend & Segment Dashboard) has been implemented in the Trend tab (panel-3) of Staff-requirements/pages/sonya.html.

## Deliverables
- Trend tab fully replaced with Req3 UI
- 1724 CSV product IDs embedded
- 1162 products with L30 Google Ads performance data
- 562 products marked "Data Missing"
- 38 seasonal top sellers identified (August 2024/2025)
- 24 recent drop-offs identified (May sold, June zero)
- Segment logic: 8 rules, priority order
- Trend logic: Seasonal / Drop-off from order_transaction
- Stage logic: Trend List / Monitor
- Summary cards, filters, table, export CSV, validation box
- Backup: backup/sonya_req3_pre_2026-07-08.html

## Phase 2 Backlog
- Image column (Shopify CDN URLs via API)
- Price column (listing_data with updated data)
- Stock column (inv_final_stock by SKU)
- SKU's Performing Keywords From Other Source
- Show More button for table pagination beyond 300 rows
- Product URL column (Shopify product handle lookup)

## Next Action
GPT to validate output and approve git commit + deployment.
