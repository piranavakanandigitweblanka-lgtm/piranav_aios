# Sajeepan Non-Sale Phase 2 — Validation Record

**Date:** 2026-09-25
**Task:** Phase 2 verification of Sajeepan non-sale product population
**Evidence file:** `evidence/sajeepan/sajeepan-nonsale-phase2-verification-2026-09-25.md`
**Product CSV:** `evidence/sajeepan/sajeepan-nonsale-phase2-product-list-2026-09-25.csv`

---

## Validation Checklist

| # | Check | Result |
|---|---|---|
| 1 | Sajeepan current product scope traced from actual code (sajeepan.py SJ_CAMPAIGN_IDS) | PASS |
| 2 | Actual Business DB schema inspected — `google_ads.merchant_products` columns verified | PASS |
| 3 | Actual Business DB schema inspected — `listings.shopify_listings` columns verified | PASS |
| 4 | Google Ads source table confirmed: `google_ads.product_performance` | PASS |
| 5 | Shopify listing source confirmed: `listings.shopify_listings` | PASS |
| 6 | compare_price distribution verified (NULL/ZERO/GT_ZERO — no unexpected values) | PASS |
| 7 | Status breakdown verified (all non-sale products = active) | PASS |
| 8 | Stock breakdown verified (in_stock=342, zero_qty=20, unknown=0) | PASS |
| 9 | Full 362-row product list saved as CSV | PASS |
| 10 | Phase 1 discrepancy identified and documented (704 unmatched raw-numeric IDs) | PASS |
| 11 | Multi-row anomaly investigated and resolved (query artifact, not real data issue) | PASS |
| 12 | No production code changed | PASS |
| 13 | No Business DB data modified (read-only queries only) | PASS |
| 14 | No new database tables created | PASS |
| 15 | No frontend changes made | PASS |
| 16 | Implementation not started (discovery only) | PASS |

---

## Query Validation

All queries were:
- SELECT / COUNT only
- No INSERT, UPDATE, DELETE, CREATE, ALTER, DROP
- Connected via existing `BUSINESS_DATABASE_URL` env var
- Used `psycopg` (same driver as production backend)
- Pool not modified

---

## Data Quality Notes

- 704 products (33% of Sajeepan's 30-day Ads population) are raw-numeric format and cannot be matched to Shopify listings — documented as Group D (unclassifiable)
- compare_price = 0 (146 products) treated same as NULL — flagged as open business decision
- 20 products are non-sale but OOS (qty=0) — flagged as Group B, included in 362 total

---

## Result

**Phase 2 Validation: PASS** — All queries read-only. All counts verified. Product CSV saved. Phase 1 discrepancy identified and documented. No production changes made.
