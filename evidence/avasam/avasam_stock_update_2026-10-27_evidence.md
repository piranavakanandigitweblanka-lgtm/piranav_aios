# Evidence — Avasam UK Stock Retrieval 2026-10-27

## Task
Retrieve current UK warehouse stock for all 2,656 Avasam SKUs from `ledsone-db-mcp`.
Append to input CSV as extended output format (UK_Current_Stock, Matched_Product_ID, Matched_By, Stock_Status).

## Input File
`C:\Users\PC\Downloads\Avasam Products Stock Update - stock update - 27_10.csv`
- Columns: SKU, Quantity
- Total data rows: 2,656
- Unique SKUs: 2,656

## Output File
`evidence/avasam/avasam_uk_current_stock_2026-10-27.csv`
- Total data rows: 2,656 (matches input exactly)
- Columns: SKU, Quantity, UK_Current_Stock, Matched_Product_ID, Matched_By, Stock_Status

## Database Source
- MCP: `ledsone-db-mcp`
- Products table: `inventory.products` (45,314 rows returned)
- Stock table: `inventory.local_inventory_current_stock_location_wise`
- Warehouse filter: `warehouse_location = 'UK'`
- SQL approach: Two-batch (full scan Batch 1; targeted IN clause Batch 2 not needed — all resolved in Batch 1)

## Validation Counts

| Metric | Count |
|---|---|
| Total input rows | 2,656 |
| Unique input SKUs | 2,656 |
| Matched rows | 2,605 |
| Unmatched rows | 26 |
| Ambiguous rows | 25 |
| Confirmed zero-stock rows | 812 |
| Positive-stock rows | 1,793 |
| Rows with unavailable stock | 51 (26 unmatched + 25 ambiguous) |

Match rate: **2,605 / 2,656 = 98.1%** — PASS (threshold ≥ 95%)

## Unmatched SKUs (26)
All are complex bundle/combo SKUs not present in inventory.products:
- CRSF100WH+LHNSE27WH+LSMS320BD+ICST64E27
- CRFF500WH+PHCH1PWRSBD3PK+LSDO210BD3PK
- CRFF140+WSNW170+WCDC-Wall light
- LSDO400BL+RPR44WH
- CRSF100WH2PK+PHCH1PWRSBD2PK+LSDO210BD2PK
- CRSF100CH+PHCHPCRCH+LSMS320BD
- PHSF1PWR40WH+LSBS160BD
- CRSF100WH+PHCH1PWRSBD+LSDO210BD
- CRSF100SE+WSSM40BM+LSOL180SE+LDMST64E274
- CRSF100CH+PHCHPCRCH+LSMS320BD+LDCWE275
- CRSF100SE+WSSM40BM+LSOL180SE
- CRSF100BB+PLOTBB+ICST64E2760
- CRSF2003WH+PHCH1PWRSBD3PK+LSDO210BD3PK
- PHSF1PWR20WH+LSWE315BD
- CRSF100BM+LHNSE27BM+SCRN70YB+LSLT360BL+ICST64E27
- CRSF1205BM+PHSH2PBRYB5PK+SPUPBM5PK+SCRN70BM+SCRN70FG2PK+LSCY210BM+LSTF40YB+LSUL220BC+LSDO300CO+WCSLBM+ICST64E275PK
- PHSF1PWR20WH+LSWE315BD+ICST64E27
- CRSF100BM+LHNSE27BM+SCRN70YB+LSLT360BL
- CRSF100HBM+WSLS155BM+SCRN70BM+LSFT220BM+PSDS2BPB+ICST64E27
- CRSF100HBM+WSLS155BM+SCRN70BM+LSFT220BM+PSDS2BPB
- CRSF1202CH+WSIW70CH2PK+WCBNCH2PK+ICST64E272PK
- ENC3548
- SWGS1GBL1
- PHSF1PWR40WH???
- CRSF195WO+WSAT105BM+RWFG+CBSF70+LDMG95E274
- WSHLBM2PK+LDMST64E2742PK

**Note:** ENC3548, SWGS1GBL1, PHSF1PWR40WH??? are single SKUs not found in DB — worth investigating separately.

## Ambiguous SKUs (25)
SKUs that matched to different product IDs via `sku` vs `sku_original` — flagged in output as AMBIGUOUS, UK_Current_Stock left blank.

## Sample Verification (First 5 rows)
| SKU | Input Qty | UK_Stock | Product_ID | Matched_By | Status |
|---|---|---|---|---|---|
| ENC3581 | 0 | 0 | 22131 | sku | MATCHED |
| ENC3547 | 64 | 64 | 22073 | sku | MATCHED |
| CRSF100BM+PHHT2PBRBM+SPUPBM+WCVCBM | 1059 | 940 | 8041 | sku | MATCHED |
| ENC3493 | -1 | 0 | 21989 | sku | MATCHED |
| LDWWB2275PK | 0 | 0 | 8636 | sku | MATCHED |

## Result
**PASS** — 98.1% match rate. Output CSV saved. All 2,656 rows accounted for.

## Prompt Used
`prompts/reusable/avasam-uk-stock-retrieve-extended-output-2026-10-27.md`

## Related Files
- Capability: `capability/2026/10/2026-10-07/avasam-uk-stock-update-workflow-2026-10-07.md`
- Previous run: `evidence/avasam/avasam_stock_update_2026-10-07_evidence.md`
- Validation: `validation/piranav/avasam-stock-update-2026-10-27-validation.md`
