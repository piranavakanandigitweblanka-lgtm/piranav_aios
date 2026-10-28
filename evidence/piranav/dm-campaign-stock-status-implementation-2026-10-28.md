---
name: dm-campaign-stock-status-implementation-2026-10-28
description: Evidence for DM Campaign Products Stock Status implementation — backend CTE + _classify_stock + frontend filter/column/CSV/modal. 74 tests pass, build clean.
metadata:
  type: evidence
---

# Evidence: DM Campaign — Stock Status Implementation

**Date:** 2026-10-28
**Requirement ID:** AIOS-2026-10-28-011
**Branch:** piranv-work
**Base commit:** 6ed9d52 (Owner feature, Stage 1+2)
**Follows:** Discovery task AIOS-2026-10-28-010 (source verified, mapping chain confirmed)

---

## Files Modified

| File | Change |
|---|---|
| `backend/app/dashboard_pages/dm_campaign.py` | Added `_classify_stock()`, `stock_lookup` CTE, final SELECT columns, LEFT JOIN, product dict fields |
| `backend/tests/test_dm_campaign.py` | Added `TestClassifyStock` group (11 new tests) |
| `frontend/src/admin/pages/DmCampaign.jsx` | Added `STOCK_META`, `StockBadge`, stock state, filter, column, colSpan 9→10, CSV column, modal rows |

---

## Backend: `_classify_stock` Logic

```python
def _classify_stock(uk_stock, inventory_bool, product_matched) -> str:
    if not product_matched:   return "Unknown"
    if not inventory_bool:    return "Unknown"   # tracking disabled or NULL
    if uk_stock is None:      return "Unknown"   # tracked but no UK row — ambiguous
    if uk_stock <= 0:         return "Out of Stock"
    return "In Stock"
```

**Deliberate choices:**
- `inventory_bool = None` → `Unknown` (same as False — no inventory tracking confirmation)
- Missing UK stock row (uk_stock = None) → `Unknown` (not Out of Stock — per implementation task: "missing row = Unknown unless proven otherwise")
- Negative uk_stock → `Out of Stock` (data anomaly, treated as zero)

---

## Backend: `stock_lookup` CTE

```sql
stock_lookup AS (
  SELECT DISTINCT ON (p.sku)
    p.sku,
    p.inventory_bool,
    ils.stock AS uk_stock
  FROM inventory.products p
  LEFT JOIN inventory.local_inventory_current_stock_location_wise ils
         ON ils.inventory_id = p.id AND ils.warehouse_location = 'UK'
  WHERE p.sku IN (SELECT l2.sku FROM listing l2 WHERE l2.sku IS NOT NULL)
  ORDER BY p.sku, p.id
)
```

**Cardinality safety:** `DISTINCT ON (p.sku)` prevents row multiplication from rare duplicate SKU entries in `inventory.products`. Final join `LEFT JOIN stock_lookup sk ON sk.sku = l.sku` is 1:1 because `listing` CTE has `DISTINCT ON (item_id)` and `stock_lookup` has `DISTINCT ON (sku)`.

**DB:** Business DB (`get_business_conn()`) — same instance as `google_ads`, `listings`, `inventory`. No cross-DB issue.

---

## Product Dict Additions

```python
uk_stock_raw = r.get("uk_stock")
uk_stock = int(uk_stock_raw) if uk_stock_raw is not None else None  # zero preserved explicitly
stock_product_matched = bool(r.get("stock_product_matched") or False)
# in products.append({...}):
"stockStatus": _classify_stock(uk_stock, r.get("stock_inv_bool"), stock_product_matched),
"ukStock": uk_stock,
```

---

## Frontend Changes

| Change | Detail |
|---|---|
| `STOCK_META` constant | green=In Stock, red=Out of Stock, plain=Unknown |
| `StockBadge` component | `status ?? 'Unknown'` fallback |
| `stock` state | `useState('all')` |
| Filter | `(r.stockStatus ?? 'Unknown') === stock` in filtered useMemo |
| useMemo dependency | `stock` added |
| Toolbar | Stock `<select>` after Owner dropdown |
| Table header | `<th>Stock</th>` after Owner |
| Table cell | `<StockBadge status={r.stockStatus} />` after Owner cell |
| colSpan | 9 → 10 (Products only; Campaigns unchanged at 9) |
| CSV header | `'Stock Status'` after Owner |
| CSV value | `r.stockStatus ?? 'Unknown'` |
| Modal | Stock Status row + UK Stock (units) row after Owner |
| Modal ukStock | `product.ukStock != null` preserves zero |

---

## Test Results

```
74 passed, 1 warning in 3.36s
```

- Previous 63 owner tests: all PASS
- New 11 stock tests (TestClassifyStock): all PASS

---

## Build Result

```
✓ built in 932ms
```

No TypeScript/lint errors. DmCampaign bundle included.

---

## Old Snapshot Fallback

Old snapshots (written before this deployment) will have no `stockStatus` or `ukStock` keys. Fallback:
- `r.stockStatus ?? 'Unknown'` → renders `Unknown` badge
- `product.ukStock != null` → shows "Unavailable" italic text

Same pattern as owner feature. Fix = click Refresh or use custom date range.
