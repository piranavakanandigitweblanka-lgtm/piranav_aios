# Validation: Avasam UK Stock Update — 2026-10-07

**Date:** 2026-10-07  
**Task:** Fresh Avasam CSV with UK stock from ledsone-db-mcp  
**Status:** PASS

---

## File Checks

| Check | Result |
|-------|--------|
| Output file exists | PASS — `evidence/avasam/avasam_stock_2026-10-07.csv` |
| Header row correct | PASS — `ProductId,Current stock,2026-10-07` |
| Total data rows | 1,546 (same as source CSV) |
| Col A (Avasam SKU) unchanged | PASS |
| Col B (Avasam stock) unchanged | PASS |
| Col C (UK stock) updated | PASS — 1,523 rows updated |
| Match rate | 98.5% (vs 98.8% in July — acceptable) |
| Unmatched rows | 23 (Col C blank) |
| Encoding | UTF-8 BOM (utf-8-sig) — correct for Excel |

---

## Sample Rows Verified

```
SWGS1GBL1,0,              ← unmatched (new SKU not in DB)
SWGS1GBL,15,6             ← matched
PHUH1HETBM2PK+ICST64E272PK,350,210
LSFT220BM+RPR44WH,2853,1481
ENC3487,0,0
LSFT220RR+RPR44WH,294,507
```

---

## DB Query Verification

- Batch 1 (full scan): 44,943 rows returned from `inventory.products` + `inventory.local_inventory_current_stock_location_wise`
- Batch 2 (targeted): 638 rows for ~700 specific non-ENC CSV SKUs
- stock_map: 54,991 unique keys
- UK warehouse filter: `warehouse_location = 'UK'` confirmed
- Dual-key lookup (sku + sku_original) confirmed working (ENC codes matched via sku, combo SKUs via sku_original)

---

## Pass/Fail Summary

| Item | Status |
|------|--------|
| CSV output written | PASS |
| Match rate ≥95% | PASS (98.5%) |
| No Col A/B changes | PASS |
| Unmatched list documented | PASS |
| Evidence file created | PASS |
