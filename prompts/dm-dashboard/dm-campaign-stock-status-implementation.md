---
name: dm-campaign-stock-status-implementation
description: Implementation prompt for adding In Stock / Out of Stock / Unknown status to DM Campaign Products page. Backend CTE + Python classification + frontend filter/column/CSV/modal. Reuse for any future stock status feature in DM Dashboard.
metadata:
  type: prompt
  category: dm-dashboard
---

# Prompt: DM Campaign Products — Stock Status Implementation

## Context

DM Dashboard — implement In Stock / Out of Stock / Unknown stock status on the Products page.

**Pre-requisite:** Run stock status discovery first (prompt: `dm-campaign-stock-status-discovery`).

**Authoritative source:** `inventory.local_inventory_current_stock_location_wise` (Business DB).
**DB connection:** `get_business_conn()` — same as `PRODUCT_PERF_QUERY`. No cross-DB issue.

## Backend Changes — `dm_campaign.py`

### 1. Add `_classify_stock` after `_classify_owner`:

```python
def _classify_stock(uk_stock, inventory_bool, product_matched) -> str:
    if not product_matched:   return "Unknown"
    if not inventory_bool:    return "Unknown"
    if uk_stock is None:      return "Unknown"   # missing UK row = ambiguous
    if uk_stock <= 0:         return "Out of Stock"
    return "In Stock"
```

### 2. Add `stock_lookup` CTE to `PRODUCT_PERF_QUERY` (after `owner_tags` CTE):

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

### 3. Add to final SELECT:
```sql
sk.inventory_bool AS stock_inv_bool,
sk.uk_stock,
(sk.sku IS NOT NULL) AS stock_product_matched
```

### 4. Add LEFT JOIN to final SELECT:
```sql
LEFT JOIN stock_lookup sk ON sk.sku = l.sku
```

### 5. Add to product dict:
```python
uk_stock_raw = r.get("uk_stock")
uk_stock = int(uk_stock_raw) if uk_stock_raw is not None else None  # preserves zero
stock_product_matched = bool(r.get("stock_product_matched") or False)
# in products.append({...}):
"stockStatus": _classify_stock(uk_stock, r.get("stock_inv_bool"), stock_product_matched),
"ukStock": uk_stock,
```

## Backend Tests — `test_dm_campaign.py`

Add `_classify_stock` import and `TestClassifyStock` class:
- `(138, True, True)` → `'In Stock'`
- `(0, True, True)` → `'Out of Stock'`
- `(-5, True, True)` → `'Out of Stock'`
- `(None, True, True)` → `'Unknown'`
- `(50, False, True)` → `'Unknown'`
- `(50, None, True)` → `'Unknown'`
- `(None, None, False)` → `'Unknown'`
- `(0, False, True)` → `'Unknown'` (inventory_bool overrides)
- `(100, False, True)` → `'Unknown'`
- `(50, True, False)` → `'Unknown'` (no product match overrides)

## Frontend Changes — `DmCampaign.jsx`

1. Add `STOCK_META` + `StockBadge` component after `OwnerBadge`
2. Add `const [stock, setStock] = useState('all')` in `ProductsView`
3. Add stock filter to `filtered` useMemo + add `stock` to dependency array
4. Add Stock `<select>` dropdown in toolbar (after Owner, before Flag)
5. Add `<th>Stock</th>` column header (after Owner)
6. Add `<td><StockBadge status={r.stockStatus} /></td>` in table rows
7. Update `colSpan` Products only: 9 → 10
8. Add `'Stock Status'` to CSV header, `r.stockStatus ?? 'Unknown'` to CSV values
9. Add to ProductDetailModal: Stock Status row + UK Stock (units) row

## Safety Rules

- Do NOT expose credentials or environment variables
- Do NOT modify Shopify inventory or tags
- Do NOT silently convert missing stock to zero — missing row = Unknown
- Do NOT use truthiness check on ukStock (zero would be lost)
- Do NOT change backend classification rules without Piranav approval
- Do NOT commit or push without explicit instruction
- Old snapshots have no stockStatus key — `?? 'Unknown'` fallback is mandatory
