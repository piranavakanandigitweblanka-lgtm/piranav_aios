# Avasam Stock Update — 2026-07-13

## Summary

Live UK stock pulled from the Ledsone PostgreSQL inventory database and written into the Avasam Stock CSV. Column C (`2026-07-13`) added with current UK available stock per SKU.

---

## Source MCPs Used

| MCP | Purpose |
|---|---|
| `ledsone-db-mcp` | Live SQL queries on `inventory.local_inventory_current_stock_location_wise` (UK stock) and `inventory.products` (SKU/ENC mappings) |
| `ledsone-aios-knowledge-base` | SKU format rules, bundle logic, warehouse restriction rules |

---

## Stock Extraction Details

- **Extraction date:** 2026-07-13
- **Stock source table:** `inventory.local_inventory_current_stock_location_wise` (warehouse_location = 'UK')
- **ENC resolution:** via `inventory.products.sku_original`
- **Pack quantity decode:** via `inventory.product_pk` table
- **Excluded warehouses/locations:** Canada, Netherlands1, Duisburg (per `business/rules/warehouse-restrictions.md`)
- **Bundle logic:** split on `+`, strip `<char>PK` suffix, take `floor(stock / pack_qty)` per component, return minimum

---

## Processing Statistics

| Metric | Value |
|---|---|
| Total rows processed | 1,546 |
| Matched SKUs (Column C populated) | 1,528 |
| Unmatched SKUs (Column C blank) | 18 |
| Zero stock SKUs (of matched) | ~680 |
| Match rate | 98.8% |

---

## Output File

```
evidence/avasam/avasam_stock_2026-07-13.csv
```

Columns:
- **A — ProductId:** original Avasam SKU (unchanged)
- **B — Current stock:** original Avasam stock value (unchanged)
- **C — 2026-07-13:** live UK available stock from inventory DB

---

## Unmatched SKUs (55)

These SKUs were left blank in Column C. Root causes:

### Invalid/Non-existent SKU
- `SWGS1GBL1` — does not exist (correct SKU is `SWGS1GBL`)
- `CRFF140+WSNW170+WCDC-Wall light` — invalid SKU format (contains spaces/hyphens)

### Missing colour variants (not in `inventory.products`)
Components `LSDO210BD`, `LSMS320BD`, `LSOL180SE`, `LSWE315BD`, `LSLT360BL`, `LSDO400BL`, `LSBS160BD` do not exist in the inventory system — all bundles containing them are unresolvable:
- `CRSF100BM+LHNSE27BM+SCRN70YB+LSLT360BL`
- `CRSF100BM+LHNSE27BM+SCRN70YB+LSLT360BL+ICST64E27`
- `PHSF1PWR20WH+LSWE315BD`
- `PHSF1PWR20WH+LSWE315BD+ICST64E27`
- `CRSF2003WH+PHCH1PWRSBD3PK+LSDO210BD3PK`
- `CRSF100SE+WSSM40BM+LSOL180SE`
- `CRSF100SE+WSSM40BM+LSOL180SE+LDMST64E274`
- `CRSF100CH+PHCHPCRCH+LSMS320BD+LDCWE275`
- `CRSF100CH+PHCHPCRCH+LSMS320BD`
- `CRSF100WH+PHCH1PWRSBD+LSDO210BD`
- `CRSF100WH2PK+PHCH1PWRSBD2PK+LSDO210BD2PK`
- `PHSF1PWR40WH+LSBS160BD`
- `LSDO400BL+RPR44WH`
- `CRFF500WH+PHCH1PWRSBD3PK+LSDO210BD3PK`
- `CRSF100WH+LHNSE27WH+LSMS320BD+ICST64E27`

### ENC SKUs resolved in patch run (36 ENCs)
All remaining ENC SKUs were resolved by querying their `sku_original` from `inventory.products` and calculating bundle stock. Results ranged from 0 (out-of-stock components) to 354. Notable: `ENC4344`=354, `ENC3492`/`ENC3493`=89, `ENC3549`=68, `ENC4734`=152, `ENC4736`=101, `ENC4738`=72, `ENC4741`=60, `ENC4646`=52, `ENC4689`=44, `ENC3580`=17, `ENC5022`=18, `ENC4156`/`ENC4157`=3.

ENC3487 was previously patched to 0 (PCBITC/PCBITB/PCPTPH/PCBIHN all out of stock). ENC3548 does not exist in `inventory.products` and remains blank.

---

## Validation Status

**PASS**

- CSV structure preserved (Columns A & B untouched)
- Original row order preserved
- No rows deleted or duplicated
- Bundle stock correctly calculated as minimum of component quantities / pack qty
- UK warehouse restriction applied (Canada, Netherlands1, Duisburg excluded)
- ENC SKUs resolved via `sku_original` before stock lookup
- Pack quantity suffixes decoded via `inventory.product_pk`
