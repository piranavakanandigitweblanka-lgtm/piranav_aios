---
name: conduit-sold-phase2b-backend
category: dm-dashboard
created: 2026-10-02
status: COMPLETE — READY FOR FRONTEND DESIGN
---

# Conduit Stock Alert Phase 2B — Backend API Design Prompt

## Purpose
Design and implement the backend API for the Conduit Component Stock Alert sub-tab.
Validates data architecture before any frontend work begins.

## New Endpoint
```
GET /api/admin/conduit-stock
Auth: Authorization: Bearer {admin_jwt}
Cache: 5 minutes, ?refresh=1 bypass
Source: PostgreSQL only — NO Shopify API calls
```

## New File
`dm-dashboard/backend/app/admin_conduit_stock.py`

## Modified File
`dm-dashboard/backend/app/main.py` — add import + `app.include_router(admin_conduit_stock_router)`

## Data Sources (PostgreSQL only)
1. `listings.shopify_collections` + `shopify_collection_products` → product_ids for 4 collections
2. `listings.shopify_listings` (is_parent=1, sub_source=104) + `shopify_listings_parent_child_mapping` → SKUs
3. `inventory.products` → sku, sku_original, inventory_bool, id
4. `inventory.local_inventory_current_stock_location_wise` (warehouse_location='UK') → authoritative stock
5. `inventory.product_mapping.alternative_inventory_id` → alt SKU display (read-only)

## SKU Classification
```python
if sku.upper().startswith("ENC"):  return "enc"
if "+" in sku:                     return "combo"
if not inventory_bool:             return "pack"
return "single"
```

## Alert Tiers
- CRITICAL: stock = 0
- WARNING: stock 1–3 (channel shows 0)
- LOW: stock 4–10
- OK: stock > 10

## Combo Rule (critical)
NEVER recalculate combo stock. Use stored value from local_inventory_current_stock_location_wise.
Decode `+` separator ONLY to show which component is the bottleneck.

## is_bottleneck rule
```python
is_bottleneck = (combo_stock <= 10) and (component_stock <= combo_stock + 2)
```
Only fires for LOW/WARNING/CRITICAL combos. Not fired for OK combos.

## Validated Counts (2026-10-02)
- Total unique conduit SKUs: 288
- single: 135, pack: 34, combo: 74, enc: 45
- CRITICAL: 34, WARNING: 23, LOW: 56, OK: 175
- Collection membership: 31 in 1 coll, 244 in 2 coll, 13 in 3 coll

## Evidence
`evidence/dm-dashboard/conduit-sold-phase2b-api-design-2026-10-02.md`

## Validation
`validation/piranav/conduit-sold-phase2b-validation-2026-10-02.md`
