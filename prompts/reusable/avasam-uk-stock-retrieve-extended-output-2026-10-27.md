# Prompt: Avasam CSV — Retrieve Current UK Stock for All SKUs (Extended Output Format)

## Registered
2026-10-27

## Category
reusable — avasam / stock-update

## Related Prompt
`prompts/reusable/avasam-uk-stock-update-workflow.md` — earlier version (col-C update pattern)

## When To Use
When a new Avasam CSV is provided with columns `SKU` and `Quantity` and the goal is to append
current UK warehouse stock alongside the original data for comparison — NOT to overwrite the
existing Quantity column.

## Differences From Earlier Workflow
The earlier workflow (`avasam-uk-stock-update-workflow.md`) wrote UK stock into Col C of a
3-column CSV. This prompt uses an extended output format: original columns preserved, new columns
appended (`UK_Current_Stock`, `Matched_Product_ID`, `Matched_By`, `Stock_Status`).

---

## Task Description

Given:
- Input CSV: Avasam stock export with columns `SKU`, `Quantity` (~2,656 rows)
- Database: `ledsone-db-mcp` → `inventory.products` + `inventory.local_inventory_current_stock_location_wise`
- Warehouse filter: `warehouse_location = 'UK'` only

Produce an output CSV with:
- All original columns and values preserved unchanged
- `UK_Current_Stock` — live UK stock from DB (blank if unmatched, not fabricated zero)
- `Matched_Product_ID` — `inventory.products.id` of the matched product
- `Matched_By` — `sku`, `sku_original`, or blank
- `Stock_Status` — `MATCHED`, `UNMATCHED`, `AMBIGUOUS`

---

## SQL (Two-Batch Approach — from existing capability)

### Batch 1 — Full DB scan
```sql
SELECT p.id, p.sku, p.sku_original, COALESCE(uk.stock, 0) AS uk_stock
FROM inventory.products p
LEFT JOIN inventory.local_inventory_current_stock_location_wise uk
  ON uk.inventory_id = p.id AND uk.warehouse_location = 'UK';
```

### Batch 2 — Targeted IN clause for unmatched SKUs after Batch 1
```sql
SELECT p.id, p.sku, p.sku_original, COALESCE(uk.stock, 0) AS uk_stock
FROM inventory.products p
LEFT JOIN inventory.local_inventory_current_stock_location_wise uk
  ON uk.inventory_id = p.id AND uk.warehouse_location = 'UK'
WHERE p.sku IN (...) OR p.sku_original IN (...);
```

---

## SKU Matching Rules
1. Try `p.sku` match first
2. If no match, try `p.sku_original`
3. If conflict (same SKU matches via both with different product IDs), flag as `AMBIGUOUS`
4. Never substitute zero for unmatched — leave blank with `UNMATCHED`

---

## Output Location
`evidence/avasam/avasam_uk_current_stock_YYYY-MM-DD.csv`

---

## Validation Counts Required
1. Total input rows
2. Unique input SKUs
3. Matched rows
4. Unmatched rows
5. Ambiguous rows
6. Confirmed zero-stock rows
7. Positive-stock rows
8. Rows with unavailable/unverified stock

## Pass Criteria
- Match rate ≥ 95%
- Output row count = input row count
- No original SKU or Quantity value changed
- Evidence + closure + validation files saved
