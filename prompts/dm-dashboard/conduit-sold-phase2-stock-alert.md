---
name: conduit-sold-phase2-stock-alert
category: dm-dashboard
created: 2026-10-01
status: DISCOVERY COMPLETE — IMPLEMENTATION NOT STARTED
---

# Conduit Sold Phase 2 — Stock Alert Sub-Tab

## Purpose
Add a stock alert sub-tab to the existing Conduit Sold Admin page. Shows current UK stock for conduit collection SKUs (single components and combos), identifying which components are causing stock-outs.

## Discovery Status (2026-10-01)
Discovery complete. See `evidence/dm-dashboard/conduit-sold-phase2-discovery-2026-10-01.md` for full verified findings.

## SKU Structure (Verified)
- **Single**: `inventory_bool = true`, alphanumeric SKU, e.g. `CRSF100BM`, `LHTTAGU10WH`
- **Pack variant**: `inventory_bool = false`, `<base>+<char>PK` suffix (e.g. `PCBI100TP2PK`). Pack chars decoded via `inventory.product_pk`.
- **Combo**: `inventory_bool = false`, components joined with `+` (e.g. `CRSF10025BM+PHHC1BMRBM`). 2–6 components.
- **ENC code**: `inventory_bool = false`, `sku` = `ENC{n}`, `sku_original` = full `+`-separated combo.

## Authoritative Stock Source (Verified)
```
inventory.local_inventory_current_stock_location_wise
  inventory_id → inventory.products.id
  warehouse_location = 'UK'  (for Shopify UK conduit)
  stock = pre-calculated available stock (integer, ≥ 0)
```
Contains BOTH single product and pre-calculated combo stock. Use directly — do not re-derive combo stock from components at query time.

## Combo Stock Formula (Verified, from GetInvStock)
```
For each component:
  effectiveStock = primaryStock if > 5, else alternativeStock (fallback to primary)
  adjustedStock = floor(effectiveStock / packSize)
Combo stock = min(adjustedStock across all non-bulb components)
```
Stored in `local_inventory_current_stock_location_wise`. Updated by scheduled sync.

## Out-of-Stock Thresholds (Verified)
- `stock = 0` → CRITICAL (channel shows 0)
- `stock` 1–3 → WARNING (channel shows 0 due to platform threshold rule)
- `stock` 4–10 → LOW
- `stock > 10` → OK

## Component Bottleneck Display
For combos, show which component is the bottleneck:
1. Parse `sku_original` (for ENC) or `sku` on `+`
2. Strip `<char>PK` → base SKU + pack_qty from `inventory.product_pk`
3. Fetch each component's stock from `local_inventory_current_stock_location_wise`
4. `floor(stock / pack_qty)` per component → min = bottleneck
5. Display bottleneck component SKU and its stock

## Known Gap — PCBSF Prefix
`PCBSF` prefix SKUs (e.g. `PCBSF2MCH3PK`, appeared in Phase 1 order data) not found in `inventory.products` PostgreSQL mirror.
Must verify via MySQL vultr1 (`order_management.inv_products`) or Shopify API before implementing stock display for this SKU family.

## Files to Create
- `backend/app/admin_conduit_stock.py` — new FastAPI router `/api/admin/conduit-stock`
- `frontend/src/admin/pages/ConduitStock.jsx` — stock alert sub-tab

## Files to Modify
- `frontend/src/admin/pages/ConduitSold.jsx` — add sub-tab navigation to ConduitStock
- `frontend/src/admin/AdminLayout.jsx` — add lazy import for ConduitStock (or render inside ConduitSold)
- `backend/app/main.py` — register admin_conduit_stock_router

## Constraints
- Use existing `get_business_conn()` for business/inventory DB
- Use existing `verify_admin_token()` for admin-only protection
- Do NOT create a second Shopify client
- Do NOT re-paginate Shopify orders for stock — use `inventory` schema directly
- Sidebar panels must NOT unmount (CSS visibility pattern)
- 15-min cache per pattern established in Phase 1
