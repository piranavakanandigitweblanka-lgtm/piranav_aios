# Prompt: Sajeepan R3 OOS Section — Item ID Filter + Pagination + Data Fix

**Registered:** 2026-09-18
**Status:** ACTIVE
**Category:** implementation

## What This Fixes

3 corrections to the Morning Revenue Risk — Best-Selling Products Out of Stock section in ProductActionDashboard.jsx / sajeepan.py req3.

## Fix 1 — Item ID Filter

**Problem:** OOS table shows full `shopify_GB_PRODUCTID_VARIANTID` string. No clean variant ID field.

**Fix:**
- Backend: add `variant_id` field (last numeric segment of `product_item_id`) to each OOS row
- Frontend: show short variant ID in Item ID column. Filter searches `p.variant_id` as well as full item string, title, SKU.

## Fix 2 — Pagination (1–50, next pages)

**Problem:** Backend caps `oos_bestsellers[:50]`, frontend `OOS_PG = 50`. Always 1 page — Next button never activates.

**Fix:**
- Backend: increase cap from `[:50]` to `[:200]`
- Frontend: keep `OOS_PG = 50` — pagination already works, just needs more data from backend

## Fix 3 — OOS Data Incorrect

**Problem:** Query uses `HAVING SUM(conversion_value) > 0` — excludes products spending/getting clicks but with zero revenue. These are the most urgent OOS products (burning budget, no return).

**Fix:**
- Change `HAVING SUM(conversion_value) > 0` → `HAVING (SUM(cost) > 0 OR SUM(clicks) > 0 OR SUM(impressions) > 0)`
- Add `merchant_products` batch lookup for OOS products — use `availability = 'out of stock'` as primary OOS signal, fallback to `shopify_listings.quantity = 0`

## Files

- `dm-dashboard/backend/app/sajeepan.py` — req3 OOS query + detection logic + limit
- `dm-dashboard/frontend/src/sajeepan/pages/ProductActionDashboard.jsx` — Item ID column + filter

## Key Constraints

- `product_item_id` format: `shopify_GB_{product_id}_{variant_id}` — variant_id is `rsplit('_', 1)[-1]`
- `merchant_products` availability lookup: `LOWER(product_id) = ANY(...)` with `DISTINCT ON` + `last_update_date DESC`
- Backend limit: 200, frontend page: 50
