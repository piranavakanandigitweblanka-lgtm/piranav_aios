# Capability — Avasam UK Stock Update Workflow

## Date First Identified
2026-10-07 (updated method — earlier run: 2026-07-13)

## Last Updated
2026-10-07

## Status
ACTIVE — Workflow proven. Latest run: 2026-10-07, 1,546 SKUs, 1,523 matched (98.5%).

## Purpose
Generate a fresh UK stock CSV for all Avasam SKUs, pulling live UK warehouse stock from the Ledsone PostgreSQL DB mirror, ready for upload to the Avasam platform.

## Business Problem Solved
Avasam requires up-to-date UK stock quantities to accurately list products. The stock data lives in the LEDSone inventory DB and must be periodically exported as a CSV with the correct format (Col C = UK stock). Without this workflow, stock would need to be updated manually product by product, or via a separate system.

## When To Use
- Piranav requests a fresh Avasam stock update
- Stock figures in Avasam are suspected to be stale
- After a major inventory movement at UK warehouses

## When NOT To Use
- For non-UK warehouses (workflow targets `warehouse_location = 'UK'` only)
- For non-Avasam listings (this is specific to the Avasam CSV format with Col C = stock)

## Required Inputs
- Source CSV: Avasam export file with SKUs in Col A and/or Col B (typically `sample_listing_id_file.csv` or equivalent)
- Access to `ledsone-db-mcp` (read-only PostgreSQL)
- Knowledge of the SKU matching strategy (see Execution Steps)

## Source Task / Requirement
Avasam UK Stock Update — 2026-10-07
Evidence: `evidence/avasam/avasam_stock_update_2026-10-07_evidence.md`

## Execution Steps

### Step 1 — Batch 1: Full DB scan
Run a full scan of all products against the UK warehouse:
```sql
SELECT p.sku, p.sku_original, COALESCE(uk.stock, 0) AS uk_stock
FROM inventory.products p
LEFT JOIN inventory.local_inventory_current_stock_location_wise uk
  ON uk.inventory_id = p.id AND uk.warehouse_location = 'UK'
```
This returns all inventory products (including ENC-prefixed combo codes). Build a dual-key lookup map keyed by both `sku` and `sku_original`.

### Step 2 — Batch 2: Targeted IN clause for non-ENC SKUs
For unmatched rows after Batch 1, collect the remaining SKUs from the CSV and run a targeted query:
```sql
SELECT p.sku, p.sku_original, COALESCE(uk.stock, 0) AS uk_stock
FROM inventory.products p
LEFT JOIN inventory.local_inventory_current_stock_location_wise uk
  ON uk.inventory_id = p.id AND uk.warehouse_location = 'UK'
WHERE p.sku IN ('SKU1', 'SKU2', ...) OR p.sku_original IN ('SKU1', 'SKU2', ...)
```

### Step 3 — Match and update CSV
For each row in the source CSV:
1. Try `sku` field match → get `uk_stock`
2. If no match, try `sku_original` → get `uk_stock`
3. Write `uk_stock` to Col C. If still no match, leave blank and record as unmatched.

### Step 4 — Record unmatched SKUs
List all unmatched SKUs. Investigate whether they are discontinued, renamed, or have a known DB absence.

### Step 5 — Save output
Save as `evidence/avasam/avasam_stock_[YYYY-MM-DD].csv`

## Verified Match Rate (2026-10-07 run)
| Metric | Value |
|---|---|
| Total SKUs in source | 1,546 |
| Matched (Col C updated) | 1,523 |
| Unmatched | 23 |
| Match rate | 98.5% |

Source: `evidence/avasam/avasam_stock_update_2026-10-07_evidence.md`

## Evidence Required
- Row count from SQL Batch 1 and Batch 2
- Match count and unmatched count
- Output CSV saved to `evidence/avasam/`

## Evidence Path
`evidence/avasam/avasam_stock_update_2026-10-07_evidence.md`
`evidence/avasam/avasam_stock_2026-10-07.csv`

Also see earlier run: `evidence/avasam/avasam_stock_update_2026-07-13.md`

## Pass / Fail Rule
PASS: Match rate ≥95%. Output CSV saved to `evidence/avasam/`. Unmatched SKUs documented.
FAIL: Match rate <95% without investigation of cause. Output not saved. Unmatched SKUs not listed.

## Owner / Reviewer
Owner: Piranav
Reviewer: Piranav (manual check of unmatched SKUs)

## Known Limits
- Only captures UK warehouse stock. Netherlands or other warehouse stock is not included.
- `warehouse_location = 'UK'` is the join condition — verify this label is current in the DB
- Negative stock values are returned by `COALESCE(uk.stock, 0)` as 0 — this is intentional
- ENC-prefixed combo codes match via `sku` field; standard SKUs match via `sku_original`

## Reuse Path
Run this workflow on any cadence Piranav instructs. The SQL queries are reusable across runs — only the source CSV filename and output date change.

## Related Capabilities
None directly. Related to `shopify-collection-tag-audit-method-2026-10-07.md` (same DB source, different use case).

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-07-13 | First recorded Avasam stock run | `evidence/avasam/avasam_stock_update_2026-07-13.md` |
| 2026-10-07 | Updated two-batch method documented, 1,523/1,546 matched | `evidence/avasam/avasam_stock_update_2026-10-07_evidence.md` |
