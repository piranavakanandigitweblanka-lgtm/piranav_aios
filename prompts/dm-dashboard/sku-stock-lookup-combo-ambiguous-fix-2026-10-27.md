# Prompt: Fix False AMBIGUOUS Results for Combo SKUs in SKU Stock Lookup

## Registered
2026-10-27

## Category
dm-dashboard / implementation

## Prior Investigation
`evidence/dm-dashboard/sku-stock-lookup-ambiguous-combo-investigation-2026-10-27.md`

## Root Cause (verified)
Input combo SKU `CRSF100BM+PHSH1PBRYB+LSSS300PI+ICST64E2740` matches two product
records because `_fetch_stock_map` uses dual-key query (p.sku OR p.sku_original).
Product 36517 (ENC8523) has sku_original = combo string, causing false AMBIGUOUS.

## Fix
In `_fetch_stock_map`, when the input SKU contains '+', skip indexing into
`by_sku_original`. Combo strings must only match via p.sku. Non-combo SKU
dual-key logic unchanged. Aligns with conduit_stock.py COMBO RULE.

## Files to Change
- `backend/app/dashboard_pages/sku_stock_lookup.py` — _fetch_stock_map only
- `backend/tests/test_sku_stock_lookup.py` — add combo fix tests

## Constraints
- No hardcoded product IDs or stock values
- No change to stock calculation, DB schema, UAM, CSV contract
- Preserve AMBIGUOUS for genuine non-combo conflicts
- Do not commit or push
