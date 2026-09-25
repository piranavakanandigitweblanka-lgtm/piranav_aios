# Sajeepan Non-Sale Level 4A — Validation [2026-09-25]

## Checklist

| # | Check | Result |
|---|---|---|
| 1 | Phase 3 evidence read before starting | PASS |
| 2 | Q1: NULL-qty merchant availability queried (165 products) | PASS — all 165 = IN_STOCK |
| 3 | Q1: listing_max_platform_stock inspected | PASS — all NULL |
| 4 | Q1: Existing sajeepan.py OOS detection logic read (lines 623–627) | PASS — merchant priority confirmed |
| 5 | Q2: compare_price=0 count confirmed (230 products) | PASS |
| 6 | Q2: merchant_products.sale_price cross-checked for compare_price=0 set | PASS — 4 anomalies found |
| 7 | Q2: No existing code uses compare_price for sale filtering | PASS — confirmed via grep |
| 8 | Q3: 25 OOS products full list extracted | PASS — CSV created |
| 9 | Q3: merchant_products.availability checked for all 25 OOS | PASS — 9 IN_STOCK conflict found |
| 10 | Jefri normalization pattern confirmed as authoritative | PASS — 4 locations in jefri.py |
| 11 | Other staff patterns checked (sonya, sukirtha, jefri) | PASS |
| 12 | No production code modified | PASS |
| 13 | No Business DB data modified | PASS |
| 14 | No tables created | PASS |
| 15 | No DB pool size increased | PASS |
| 16 | No credentials exposed | PASS |
| 17 | Phase 1–3 evidence preserved | PASS |

## Scope Summary

| Group | Count | Classification |
|---|---|---|
| Non-sale + active + qty > 0 | 528 | CONFIRMED in-scope |
| Non-sale + active + qty NULL + merch IN_STOCK | 165 | CONFIRMED in-scope (merchant primary) |
| Non-sale + active + qty = 0 + merch OUT_OF_STOCK | 14 | BUSINESS DECISION |
| Non-sale + active + qty = 0 + merch IN_STOCK | 9 | BUSINESS DECISION |
| Non-sale + active + qty = 0 + no merch record | 2 | BUSINESS DECISION |
| compare_price=0 + merch sale_price>0 anomalies | 4 | BUSINESS DECISION |
| Unmatched (1 other-format product_item_id) | 1 | EXCLUDE |

## Files Created This Phase

- `evidence/sajeepan/sajeepan-nonsale-level4a-business-rule-evidence-2026-09-25.md`
- `evidence/sajeepan/sajeepan-null-quantity-investigation-2026-09-25.csv` (241 rows / 165 distinct variants)
- `evidence/sajeepan/sajeepan-oos-nonsale-investigation-2026-09-25.csv` (25 rows)
- `validation/piranav/sajeepan-nonsale-level4a-validation-2026-09-25.md`
