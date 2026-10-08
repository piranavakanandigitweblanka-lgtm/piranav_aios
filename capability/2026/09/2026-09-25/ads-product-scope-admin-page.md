---
name: ads-product-scope-admin-page
description: Admin page classifying Google Ads products by sale/non-sale + stock status. Phase 1 = Sajeepan. Reusable for all Ads staff.
metadata:
  type: capability
---

# Capability: Ads Product Scope Admin Page

## What It Does

An admin-only page in the DM Dashboard that shows all products **ever** in a staff
member's Google Ads campaigns (lifetime scope), classified into:
- **GROUP_A**: non-sale + active + in-stock (primary eligible set)
- **GROUP_B**: non-sale + active + out-of-stock (monitoring list)
- **ON_SALE**: compare_price > 0
- **SALE_SIGNAL_CONFLICT**: compare_price=0 but merchant sale_price>0 (data quality flag)
- **UNRESOLVED**: unrecognised product_item_id format

## Where It Lives

| Component | Path |
|---|---|
| Backend | `dm-dashboard/backend/app/admin_ads_product_scope.py` |
| Frontend | `dm-dashboard/frontend/src/admin/pages/AdsProductScope.jsx` |
| API endpoint | `GET /api/admin/ads-product-scope/sajeepan?days=30` |
| Nav | AdminLayout.jsx → Sales & Performance → Ads Product Scope |
| Snapshot scope | `admin-ads-product-scope-sajeepan` (1-hour refresh, stores lifetime classification) |
| Metrics query | Fast windowed aggregation — always fetched fresh per request |

## How to Reuse for Another Staff Member

1. Add a row to `STAFF_CONFIG` in `admin_ads_product_scope.py`
2. Add a new endpoint (`/api/admin/ads-product-scope/<staff_key>`) following the Sajeepan pattern
3. Add a new snapshot with a unique `scope` and `table_name`
4. Add a `staff_key` prop to `AdsProductScope.jsx` or create a staff selector

## Business Rules (Confirmed 2026-09-25)

- NON-SALE: `compare_price IS NULL OR compare_price = 0`
- IN-STOCK: merchant `IN_STOCK` (primary) OR `quantity > 0` (fallback)
- OOS: merchant `out_of_stock/preorder` (primary) OR `qty=0/NULL` (fallback)
- Product ID normalization: Jefri pattern (split last segment for `shopify_*`, else use directly)

## Lifetime Scope Counts (Sajeepan, verified 2026-09-25)

| Group | Count |
|---|---|
| GROUP_A | 4,814 |
| GROUP_B | 1,577 |
| ON_SALE | 7,566 |
| SALE_SIGNAL_CONFLICT | 5 |
| NON_SALE_INACTIVE | 85 |
| UNMATCHED (removed from Shopify) | 3,083 |
| UNRESOLVED | 7 |
| **TOTAL** | **17,137** |

Data range: 2024-09-01 → 2026-09-24

---

## Non-Sale Discovery Method (Extension, 2026-09-25)

The GROUP_A / ON_SALE classification above depends on the business rule that `compare_price IS NULL OR compare_price = 0` = non-sale. This rule was confirmed by the Non-Sale Product Scope Discovery session on 2026-09-25.

**Signal confirmed:** `listings.shopify_listings.compare_price` is the primary non-sale signal. If `compare_price > 0`, the product is considered ON_SALE.

**Discovery outputs (Sajeepan, 2026-09-25 verified run):**
- Total Ads products (lifetime): 2,118
- Non-sale (GROUP_A + GROUP_B combined): 716
- On sale: 1,402

**Evidence:** `evidence/sajeepan/sajeepan-nonsale-product-scope-discovery-2026-09-25.md`

The non-sale discovery method does NOT require a separate capability file — it is documented here as an extension of the scope classification capability.

---

## Last Updated
2026-10-08

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-09-25 | Initial capability created from Level 6A lifetime scope verification | `evidence/sajeepan/sajeepan-ads-scope-level6a-lifetime-verification-2026-09-25.md` |
| 2026-10-08 | Non-sale discovery method documented as extension | `evidence/sajeepan/sajeepan-nonsale-product-scope-discovery-2026-09-25.md` |

## Related Evidence

- `evidence/sajeepan/sajeepan-ads-scope-level6a-lifetime-verification-2026-09-25.md` ← Level 6A (current)
- `evidence/sajeepan/sajeepan-ads-scope-level5-implementation-2026-09-25.md` ← Level 5 (superseded counts)
- `docs/dm-dashboard/ads-product-scope-level4c-design-2026-09-25.md`
- `evidence/sajeepan/sajeepan-nonsale-level4a-business-rule-evidence-2026-09-25.md`
