# Prompt: Investigate AMBIGUOUS Combo SKU in SKU Stock Lookup

## Registered
2026-10-27

## Category
dm-dashboard / investigation

## Purpose
Determine why combo SKU CRSF100BM+PHSH1PBRYB+LSSS300PI+ICST64E2740 is flagged
AMBIGUOUS by SKU Stock Lookup, and establish the correct stock-matching rule
without guessing. Related SKU: ENC8523 (Combo Products page shows UK stock 66).

## Investigation Steps
1. Read existing combo products backend + sku_stock_lookup.py
2. DB queries: check inventory.products (sku + sku_original) for combo SKU,
   ENC8523, and all 4 component SKUs
3. Check inventory.local_inventory_current_stock_location_wise for UK stock
4. Determine root cause: multi-product mapping, parent/original SKU, or logic mismatch
5. Recommend smallest safe fix — no global suppression of AMBIGUOUS

## Constraints
- Read-only DB investigation
- No writes to DB, Shopify, Avasam
- Do not expose credentials in output
- Stop before implementing any fix
