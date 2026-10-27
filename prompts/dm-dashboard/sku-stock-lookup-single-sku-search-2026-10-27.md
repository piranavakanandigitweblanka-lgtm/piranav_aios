# Prompt: SKU Stock Lookup — Add Single SKU Search Tab

## Registered
2026-10-27

## Category
dm-dashboard / implementation

## Purpose
Extend the existing SKU Stock Lookup page to support both:
1. Single SKU manual entry — type a SKU, press Enter or click Search, see result inline.
2. CSV Bulk Upload — existing flow unchanged (upload, results table, paginated, downloadable).

## Files to Change
- `frontend/src/admin/pages/SkuStockLookup.jsx` — add tab/segmented selector, Single SKU tab UI
- `backend/app/dashboard_pages/sku_stock_lookup.py` — add GET `/api/sku-stock-lookup/single` endpoint
- `backend/tests/test_sku_stock_lookup.py` — extend with single-SKU tests

## Backend Spec
- New endpoint: `GET /api/sku-stock-lookup/single?sku=<value>`
- Reuse `_fetch_stock_map([sku])` — no new SQL, no new DB pool
- Auth: same `make_task_auth("tools.SkuStockLookup")` policy
- Return JSON: `{ sku, status, product_id, stock, matched_by }`
- MATCHED: product_id + stock (may be 0 confirmed)
- UNMATCHED: stock = null (never zero)
- AMBIGUOUS: stock = null (never zero)
- DB error: 502 opaque message
- 400 on blank or missing sku param

## Frontend Spec
- Segmented selector or two tabs: "Single SKU" | "CSV Bulk Upload"
- Single SKU tab: input + Search button, Enter key triggers search
- States: idle → loading → result | error | no-match
- Result display: SKU, Matched_Product_ID, UK_Current_Stock, Matched_By, Stock_Status (pill)
- Zero stock displayed as 0 (not blank — it is a confirmed value)
- UNMATCHED/AMBIGUOUS: blank stock shown as —
- CSV tab: existing upload/table/download flow unchanged

## Security
- Parameterized queries only — no string interpolation in SQL
- No DB credentials or internal details in error responses
- Same UAM auth as existing endpoint

## Tests Required
- Single SKU: match by sku, match by sku_original, confirmed zero stock
- Single SKU: UNMATCHED, AMBIGUOUS, DB failure
- Unauthorized request (missing token)
- CSV workflow: existing tests must still pass

## Constraints
- No new DB pool or env vars
- No writes to Shopify, Avasam, or source DB
- Do not commit or push
