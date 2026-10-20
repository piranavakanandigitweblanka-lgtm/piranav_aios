# Validation: Promotion Automation Step 1 Audit

**Date:** 2026-10-15
**Status:** PASS — audit complete, all queries executed, findings verified

## SQL Queries Executed (all read-only)

| Query | Result |
|---|---|
| promotion% tables in ledsone DB | 0 rows — correct (live in app DB) |
| listings.shopify_listings columns | 32 columns confirmed |
| orders sub_source 8+38 | 186,363 + 43,790 orders, current to 2026-10-15 |
| 4,906 distinct SKUs with 90d sales | CONFIRMED |
| inventory.physical_product_stock columns | quantity, reserved_quantity confirmed |
| physical_product_stock JOIN inventory.products.id → sku | Sample data verified |
| business_reports.amz_sales_and_traffic_by_sku | 1,653 rows, Jan 2026 only — 0 rows in last 90 days |
| google_ads.ad_group_products | product_item_id (not sku) confirmed |
| amazon_listing_search_engine_keywords | product_id + keyword columns confirmed |
| order_item_info sample | real_qty = VARCHAR, real_price = VARCHAR confirmed |

## Requirement Matrix Counts
- IMPLEMENTED: 15
- PARTIAL: 5
- MISSING (buildable): 19
- BLOCKED BY DATA: 9
- NEEDS BUSINESS DECISION: 1 (D4 fast mover discounts)

## Key New Finding (not in Phase 1E)
Amazon refund_rate data (amz_sales_and_traffic_by_sku) confirmed at only 1,653 rows covering Jan 2026 only.
90-day query returned 0 rows. **Q7 blocker is CONFIRMED CRITICAL — Piranav must trigger SP-API reload before A4 is buildable.**

## Files Inspected
- promotion_automation_db.py: 195 lines — 5 tables, 4 policy flags, correct
- promotion_automation.py: 528 lines — 13 endpoints + /intents, make_admin_task_auth confirmed
- PromotionAutomation.jsx: 621 lines — financial blocker banner unconditional confirmed

## No tests run (audit-only phase)
