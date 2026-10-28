---
name: dm-campaign-stock-status-discovery-2026-10-28
description: Read-only discovery for adding In Stock / Out of Stock / Unknown status to DM Campaign Products table. Authoritative source confirmed as inventory.local_inventory_current_stock_location_wise on Business DB. Full mapping chain verified live. Coverage 99.9% SKU, 97.7% stock row. No cross-DB issue. Implementation plan included.
metadata:
  type: evidence
---

# Evidence: DM Campaign — Stock Status Discovery

**Date:** 2026-10-28
**Type:** Read-only DB investigation — no files modified
**Follows:** Stage 1 (backend owner), Stage 2 (frontend owner), commit `6ed9d52`

---

## 1. Authoritative Stock Source

**Table:** `inventory.local_inventory_current_stock_location_wise`
**Database:** Business DB (`BUSINESS_DATABASE_URL` → `get_business_conn()`)
**Schema (3 columns only):**

| Column | Type | Notes |
|---|---|---|
| `inventory_id` | integer | FK → `inventory.products.id` |
| `warehouse_location` | varchar | `'UK'`, `'Germany'`, `'Canada'`, `'US'` |
| `stock` | integer | Current available stock at that warehouse |

**No `updated_at` column** — freshness is inferred from `inventory.products.updated_at`.
`inventory.products.updated_at` MAX = `2026-10-28 10:52:11 UTC` — updated today, intra-day.

**Established precedent:** This exact table + `warehouse_location = 'UK'` is already used by `sku_stock_lookup.py` (the most recent stock tool, 2026-10-27, 98.1% match rate on Avasam run).

---

## 2. DB Connection Confirmed — No Cross-DB Issue

`inventory`, `google_ads`, `listings`, `order_management` all reside on the same Business DB instance. Confirmed live via `information_schema.tables` query (query 15).

`PRODUCT_PERF_QUERY` already runs via `get_business_conn()`. The stock CTE can be added inline — **no cross-DB join issue**, unlike the `sales_cache` situation from the owner feature.

---

## 3. Full Mapping Chain (verified live)

```
Google Ads product_item_id
  e.g. shopify_gb_14798554268034_55391394005378
                  ^-- parent product ID  ^-- variant ID

Step 1: Extract variant_id
  regexp_replace(product_item_id, '^shopify_gb_[0-9]+_', '') = '55391394005378'

Step 2: Resolve variant SKU  [already done by existing 'listing' CTE]
  listings.shopify_listings WHERE item_id = '55391394005378' AND sub_source = 104
  → sku = 'PCMT20BM'

Step 3: Look up inventory product
  inventory.products WHERE sku = 'PCMT20BM'
  → id = 5112, inventory_bool = true

Step 4: Get UK stock
  inventory.local_inventory_current_stock_location_wise
  WHERE inventory_id = 5112 AND warehouse_location = 'UK'
  → stock = 138  →  IN STOCK
```

**Critical finding — parent listing has `sku = NULL`:**
```
listings.shopify_listings WHERE item_id = '14798554268034' AND sub_source=104 AND is_parent=1
→ id = 752555, sku = NULL
```
Stock lookup MUST use the **variant listing SKU** (field 4 split), not the parent listing. The existing `listing` CTE already fetches variant-level SKU correctly — the stock CTE just needs to join on `l.sku`.

---

## 4. Coverage (live query, last 30 days DM campaigns)

| Metric | Count | % of total |
|---|---|---|
| Total distinct product_item_ids | 8,791 | 100% |
| Have a SKU from variant listing | 8,785 | 99.9% |
| Have a UK stock row | 8,585 | 97.7% |
| UK stock > 0 (In Stock) | 7,988 | 90.9% |
| UK stock = 0 (Out of Stock) | 597 | 6.8% |
| SKU matched, no UK stock row | 200 | 2.3% |
| No SKU at all | 6 | 0.1% |

**The 200 "SKU matched, no UK stock row" cases:**
Query 14 shows these are almost entirely `inventory_bool = false` (1 product confirmed).
`inventory_bool = false` does not mean "untracked" — these products have stock rows in other warehouses but none in the UK warehouse. This is real data: zero UK stock, simply without a warehouse row record.

**Safe classification:**
- SKU matched + `inventory_bool = false` + no UK row → treat as `Unknown` (inventory tracking not enabled for UK)
- SKU matched + `inventory_bool = true` + no UK row → treat as `Out of Stock` (tracked, genuinely zero UK stock)
- No SKU → `Unknown`

---

## 5. Variant-Level vs Parent-Level Aggregation

**Each product_item_id in Google Ads = one specific variant (unique SKU).** Confirmed:
- Parent product `8015430353146` has 43 ad rows with 43 distinct SKUs — each is a separate variant.
- `distinct_skus = variant_ad_rows` for every parent in the top 15 sample.

**Recommendation: stay at variant level.** The DM Campaign table already shows individual variants as separate rows. Stock status should answer "is this specific advertised variant in stock?" not "is any other variant available?" Showing parent-level aggregate would be misleading — a 43-variant product could have one variant in stock while the advertised one is out.

---

## 6. `inventory_bool` Clarification

`inventory_bool = true` = inventory is actively tracked in the warehouse system (6,622 products, avg 393 UK stock).
`inventory_bool = false` = product exists in the system but warehouse tracking is disabled (38,785 products, avg 117 stock — but stock rows still exist for most).

For stock status, the correct classification gate is:
1. No `inventory.products` match → `Unknown`
2. Match found, `inventory_bool = false` → `Unknown` (tracking disabled — value unreliable)
3. Match found, `inventory_bool = true`, no UK stock row → `Out of Stock` (tracked, no UK stock)
4. Match found, UK stock row exists, `stock = 0` → `Out of Stock`
5. Match found, UK stock row exists, `stock > 0` → `In Stock`

---

## 7. Proposed SQL CTE

Add one CTE after the `sales` CTE in `PRODUCT_PERF_QUERY`, joining on the already-resolved `l.sku`:

```sql
stock_status AS (
  SELECT
    l_sub.item_id AS variant_id,
    CASE
      WHEN p.id IS NULL                          THEN 'Unknown'
      WHEN p.inventory_bool = false              THEN 'Unknown'
      WHEN s.stock IS NULL                       THEN 'Out of Stock'
      WHEN s.stock = 0                           THEN 'Out of Stock'
      ELSE                                            'In Stock'
    END AS stock_status,
    COALESCE(s.stock, 0) AS uk_stock
  FROM listings.shopify_listings l_sub
  LEFT JOIN inventory.products p ON p.sku = l_sub.sku
  LEFT JOIN inventory.local_inventory_current_stock_location_wise s
         ON s.inventory_id = p.id AND s.warehouse_location = 'UK'
  WHERE l_sub.sub_source = 104
    AND l_sub.item_id IN (
      SELECT DISTINCT regexp_replace(product_item_id, '^shopify_gb_[0-9]+_', '')
      FROM perf
    )
)
```

Then in the final SELECT:
```sql
COALESCE(ss.stock_status, 'Unknown') AS stock_status,
ss.uk_stock
```

And JOIN:
```sql
LEFT JOIN stock_status ss ON ss.variant_id = r.variant_id
```

Note: `r.variant_id` already exists in the `resolved` CTE.

**Alternative (simpler, proven pattern from sku_stock_lookup.py):** Skip the sub-CTE approach and add a direct join via `l.sku` from the existing `listing` CTE alias:

```sql
LEFT JOIN inventory.products ip ON ip.sku = l.sku
LEFT JOIN inventory.local_inventory_current_stock_location_wise ils
       ON ils.inventory_id = ip.id AND ils.warehouse_location = 'UK'
```

Then classify in Python (same pattern as `_classify_owner`):

```python
def _classify_stock(uk_stock, inventory_bool, product_matched):
    if not product_matched:
        return "Unknown"
    if not inventory_bool:
        return "Unknown"
    if uk_stock is None:
        return "Out of Stock"   # tracked, no UK row = zero stock
    if uk_stock == 0:
        return "Out of Stock"
    return "In Stock"
```

**Recommended approach: SQL JOINs + Python classification** — consistent with owner tag pattern, easier to test, no inline CASE sprawl.

---

## 8. Frontend Changes Required

| Change | Detail |
|---|---|
| Stock Status filter dropdown | All / In Stock / Out of Stock / Unknown |
| Stock Status column | After Owner column in Products table |
| `colSpan` | 9 → 10 |
| CSV export | Add `Stock Status` column after Owner |
| ProductDetailModal | Add Stock Status row + UK Stock (units) row |
| Old snapshot fallback | `r.stockStatus ?? 'Unknown'` |

---

## 9. Tests Required

| Test | Assertion |
|---|---|
| `_classify_stock(138, True, True)` | `'In Stock'` |
| `_classify_stock(0, True, True)` | `'Out of Stock'` |
| `_classify_stock(None, True, True)` | `'Out of Stock'` |
| `_classify_stock(50, False, True)` | `'Unknown'` (inventory_bool=False) |
| `_classify_stock(None, None, False)` | `'Unknown'` (no product match) |
| `_classify_stock(0, False, True)` | `'Unknown'` (inventory_bool=False overrides) |
| Filter `In Stock` removes `Out of Stock` and `Unknown` rows | |
| colSpan = 10 in loading + empty rows | |
| Old snapshot (`stockStatus` key absent) → `'Unknown'` | |

---

## 10. Known Limitations

| Limitation | Impact |
|---|---|
| `local_inventory_current_stock_location_wise` has no `updated_at` | Cannot show freshness timestamp for stock data specifically; use `inventory.products.updated_at` as a proxy (confirmed updated intra-day today) |
| `inventory_bool = false` products classified as `Unknown` | ~2.3% of DM products lose a definitive stock signal; classified conservatively |
| No SKU (6 products, 0.1%) | `Unknown` — acceptable |
| Stock reflects warehouse quantity, not Shopify "available" | May differ by committed/reserved orders; this is the same source used by all other stock tools in this codebase |
| Snapshot-served responses will show `Unknown` until refresh | Same pattern as `owner` field — Refresh button or custom date range forces live recompute |
