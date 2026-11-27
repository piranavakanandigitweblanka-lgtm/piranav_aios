# Validation: Amazon vs Shopify US Gap Analysis — 2026-11-27

**Task:** Cross-platform listing gap analysis (Amazon US + CA + MX vs Shopify US)  
**Result:** PASS

---

## Checks

| Check | Result |
|---|---|
| Amazon US site field confirmed as `'US'` (not marketplace ID) | PASS |
| Shopify US sub_source confirmed as 245 | PASS |
| Match key confirmed as `sku` (mapped_sku returned false zero — excluded) | PASS |
| Gap query returned non-zero result (2,363) | PASS |
| Neighbour market query returned Canada + Mexico (Brazil = 0 active) | PASS |
| Full export query executed — 3,438 rows in output file | PASS |
| CSV saved to `reports/amazon-shopify-us-gap-full-export-2026-11-27.csv` | PASS |
| Product type breakdown: 18 types, totals sum correctly | PASS |

---

## File Count

| Asset | Path | Exists |
|---|---|---|
| Prompt | `prompts/discovery/amazon-shopify-us-gap-analysis.md` | YES |
| Evidence | `evidence/piranav/amazon-shopify-us-gap-analysis-2026-11-27.md` | YES |
| Report | `reports/amazon-shopify-us-gap-full-export-2026-11-27.csv` | YES |
| Validation | `validation/piranav/amazon-shopify-us-gap-validation-2026-11-27.md` | YES (this file) |
| Closure | `closure/README.md` | PENDING — to be added |

---

## Known Limitations

- Shopify US `status = 'Active'` returned 0 SKUs — sub_source=245 filter used without status gate
- Currency field NULL on many Amazon US listings — price data still valid
- Return rate flag (42%) and feedback score (1.67/5) noted but not investigated this session
