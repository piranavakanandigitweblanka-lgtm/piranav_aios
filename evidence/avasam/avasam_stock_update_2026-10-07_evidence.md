# Evidence: Avasam UK Stock Update — 2026-10-07

**Task:** Generate fresh Avasam stock CSV with UK stock (Col C) from live ledsone-db-mcp data  
**Date:** 2026-10-07  
**Status:** PASS

---

## Output File

`evidence/avasam/avasam_stock_2026-10-07.csv`

- Total rows: 1,546
- Matched (Col C updated): 1,523
- Unmatched (Col C blank): 23
- Match rate: **98.5%**

---

## Method

Two SQL batches run against `ledsone-db-mcp`:

**Batch 1** — full DB scan (all products):
```sql
SELECT p.sku, p.sku_original, COALESCE(uk.stock, 0) AS uk_stock
FROM inventory.products p
LEFT JOIN inventory.local_inventory_current_stock_location_wise uk
  ON uk.inventory_id = p.id AND uk.warehouse_location = 'UK'
```
→ 44,943 rows returned. Covered all ENC codes via `sku` match.

**Batch 2** — targeted non-ENC SKUs from CSV (IN clause with ~700 SKUs):
→ 638 rows returned. Covered remaining combo and individual SKUs.

Combined stock_map: 54,991 unique keys (sku + sku_original dual-key lookup).

---

## Unmatched SKUs (23)

These SKUs from the Avasam CSV were not found in the DB and have blank Col C:

| SKU |
|-----|
| SWGS1GBL1 |
| ENC3548 |
| CRSF1202CH+WSIW70CH2PK+WCBNCH2PK+ICST64E272PK |
| CRSF100HBM+WSLS155BM+SCRN70BM+LSFT220BM+PSDS2BPB |
| CRSF100HBM+WSLS155BM+SCRN70BM+LSFT220BM+PSDS2BPB+ICST64E27 |
| CRSF100BM+LHNSE27BM+SCRN70YB+LSLT360BL |
| PHSF1PWR20WH+LSWE315BD+ICST64E27 |
| CRSF1205BM+PHSH2PBRYB5PK+SPUPBM5PK+SCRN70BM+SCRN70FG2PK+LSCY210BM+LSTF40YB+LSUL220BC+LSDO300CO+WCSLBM+ICST64E275PK |
| CRSF100BM+LHNSE27BM+SCRN70YB+LSLT360BL+ICST64E27 |
| PHSF1PWR20WH+LSWE315BD |
| CRSF2003WH+PHCH1PWRSBD3PK+LSDO210BD3PK |
| CRSF100BB+PLOTBB+ICST64E2760 |
| CRSF100SE+WSSM40BM+LSOL180SE |
| CRSF100CH+PHCHPCRCH+LSMS320BD+LDCWE275 |
| CRSF100SE+WSSM40BM+LSOL180SE+LDMST64E274 |
| CRSF100WH+PHCH1PWRSBD+LSDO210BD |
| PHSF1PWR40WH+LSBS160BD |
| CRSF100CH+PHCHPCRCH+LSMS320BD |
| CRSF100WH2PK+PHCH1PWRSBD2PK+LSDO210BD2PK |
| LSDO400BL+RPR44WH |
| CRFF140+WSNW170+WCDC-Wall light |
| CRFF500WH+PHCH1PWRSBD3PK+LSDO210BD3PK |
| CRSF100WH+LHNSE27WH+LSMS320BD+ICST64E27 |

Note: `LSDO400BL+RPR44WH` and `PHSF1PWR20WH+LSWE315BD` were unmatched in July 2026 as well (consistent).

---

## Key Stock Changes (vs July 2026)

| SKU | July 2026 | Oct 2026 |
|-----|-----------|----------|
| LSFT220BM+RPR44WH | 2,474 | 1,481 |
| LSFT220BC+RPR44WH | 1,186 | 305 |
| LSFT220RR+RPR44WH | 507 | 507 |
| LSMS320WH+RPR44WH | 843 | 0 |
| LSMS320BI+RPR44WH | 1,387 | 1,280 |
| WCB2BB | 0 | 118 |
| 12BO48 | 354 | 1,694 |
| 12BO28 | 523 | 2,363 |
| 12BO18 | 159 | 1,479 |

---

## Commit

Pending — see closure for commit hash once pushed.
