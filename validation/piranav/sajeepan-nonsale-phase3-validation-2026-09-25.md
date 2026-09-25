# Sajeepan Non-Sale Phase 3 — Validation [2026-09-25]

## Validation Checklist

| # | Check | Result |
|---|---|---|
| 1 | 704 numeric IDs extracted from live DB query | PASS |
| 2 | Match method tested: direct `shopify_listings.item_id` join | PASS — 703/703 matched |
| 3 | Match method tested: `merchant_products.product_id` join | PASS — 703/703 matched |
| 4 | Authoritative existing pattern identified (Jefri pattern) | PASS — jefri.py lines 71-75 |
| 5 | compare_price distribution verified for 703 numeric IDs | PASS |
| 6 | Status breakdown verified for non-sale numeric products | PASS — all active |
| 7 | Stock breakdown verified for non-sale numeric products | PASS — 186 in-stock, 5 zero, 165 NULL |
| 8 | Combined totals (both formats) calculated via Jefri pattern | PASS |
| 9 | Phase 2 error identified and documented | PASS — Phase 2 missed 703 products |
| 10 | No production code changed | PASS |
| 11 | No Business DB data modified | PASS |
| 12 | No new tables created | PASS |
| 13 | No DB pool size increased | PASS |
| 14 | No credentials exposed | PASS |
| 15 | AIOS evidence file created | PASS |

## Corrected Figures vs Phase 2

| Metric | Phase 2 (incorrect) | Phase 3 (correct) |
|---|---|---|
| Total Ads products | 2,118 | 2,126 |
| Match rate | 1,422 / 2,118 (67%) | 2,125 / 2,126 (99.95%) |
| Total non-sale | 362 | 719 |
| Non-sale + active + in-stock | 342 | 528 |

## Phase 2 CSV Status

`sajeepan-nonsale-phase2-product-list-2026-09-25.csv` — SUPERSEDED by Phase 3 findings.
Contains only 362 shopify-prefixed non-sale products (incomplete).
Do not use Phase 2 CSV as the authoritative non-sale list.

## Business Decisions Still Open

- 165 NULL-quantity active non-sale products — classification pending GPT decision
- compare_price = 0 treatment — pending GPT confirmation
- Group B (25 OOS) — include/exclude pending GPT decision
- 1 unresolvable "other format" product — exclude or flag

## Files Created This Phase

- `evidence/sajeepan/sajeepan-nonsale-phase3-704-investigation-2026-09-25.md`
- `validation/piranav/sajeepan-nonsale-phase3-validation-2026-09-25.md`
