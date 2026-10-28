---
name: dm-campaign-stock-status-discovery
description: Discovery prompt for DM Campaign product stock status feature. Verified source, mapping chain, coverage, and implementation plan. Reuse for any future stock status addition to DM Campaign.
metadata:
  type: prompt
  category: discovery
---

# Prompt: DM Campaign Products — Stock Status Discovery

## Context

DM Dashboard — add In Stock / Out of Stock / Unknown status to the DM Campaign Products table.

**Authoritative stock source:** `inventory.local_inventory_current_stock_location_wise`
**Database:** Business DB — same instance as `google_ads`, `listings`, `order_management`. No cross-DB issue.
**Established precedent:** `sku_stock_lookup.py` uses this exact table (2026-10-27).

## Verified Mapping Chain

```
product_item_id = 'shopify_gb_<PRODUCT_ID>_<VARIANT_ID>'

1. variant_id = regexp_replace(product_item_id, '^shopify_gb_[0-9]+_', '')
2. sku = listings.shopify_listings WHERE item_id = variant_id AND sub_source = 104  [existing 'listing' CTE]
3. product = inventory.products WHERE sku = l.sku
4. uk_stock = inventory.local_inventory_current_stock_location_wise
              WHERE inventory_id = p.id AND warehouse_location = 'UK'
```

CRITICAL: Parent listing (is_parent=1) has sku=NULL. Always use variant-level SKU.

## Classification Rules

```python
def _classify_stock(uk_stock, inventory_bool, product_matched):
    if not product_matched:   return "Unknown"
    if not inventory_bool:    return "Unknown"   # tracking disabled
    if uk_stock is None:      return "Out of Stock"  # tracked, no UK row = zero
    if uk_stock == 0:         return "Out of Stock"
    return "In Stock"
```

## Coverage (live, 2026-10-28, last 30 days DM)

- 8,791 total product_item_ids
- 99.9% have SKU, 97.7% have UK stock row
- 90.9% In Stock, 6.8% Out of Stock, 2.3% Unknown

## SQL Addition

Add two LEFT JOINs to PRODUCT_PERF_QUERY final SELECT (after existing listing/sales joins):
```sql
LEFT JOIN inventory.products ip ON ip.sku = l.sku
LEFT JOIN inventory.local_inventory_current_stock_location_wise ils
       ON ils.inventory_id = ip.id AND ils.warehouse_location = 'UK'
```

Add to final SELECT:
```sql
ip.inventory_bool, ils.stock AS uk_stock, (ip.id IS NOT NULL) AS stock_product_matched
```

Add to product dict in Python:
```python
"stockStatus": _classify_stock(r.get("uk_stock"), r.get("inventory_bool"), r.get("stock_product_matched")),
"ukStock": int(r["uk_stock"]) if r.get("uk_stock") is not None else None,
```

## Frontend Changes

- Stock Status filter (All / In Stock / Out of Stock / Unknown)
- Stock Status column after Owner; colSpan 9→10
- CSV: add Stock Status after Owner
- Modal: Stock Status row + UK Stock (units) row
- Fallback: `r.stockStatus ?? 'Unknown'`
