# Validation — Theekshy Requirement 3 — Feed Optimisation

**Staff:** Theekshy
**Requirement:** 3 — Feed Optimisation
**Date:** 2026-07-15

---

## Validation Checklist

| # | Check | Result | Notes |
|---|---|---|---|
| 1 | Both campaigns verified in product_performance | PASS | THEE_GEMS 23714290257, THEE_MYSTERY 23684837882 |
| 2 | CSV Req 3 section inspected | PASS | 7 conditions, 17 columns, feed review = date optimised + 7 days |
| 3 | Date serial 46211 converted | PASS | = 2026-07-08; not displayed raw |
| 4 | Req 1 action log checked | PASS | 0 events; empty state shown |
| 5 | Req 1 regression check | PASS | Panel 1 and all Req 1 JS untouched |
| 6 | Req 2 regression check | PASS | Panel 2 and all r2* functions untouched |
| 7 | Shopify join (site=UK, channel=LEDSone) | PASS | Confirmed variant-level rows |
| 8 | GMC join (GB preferred via ROW_NUMBER) | PASS | Price/availability/currency confirmed |
| 9 | Price match formula | PASS | round(gmc,2) = round(shopify,2) AND currency=GBP |
| 10 | Condition precedence (11 levels) | PASS | Missing Product Mapping → Feed Healthy |
| 11 | CSV sample data excluded | PASS | SKU-001/004/006 absent from R3_DATA |
| 12 | SELECT only — no PostgreSQL writes | PASS | No INSERT/UPDATE/DELETE/ALTER executed |
| 13 | No git commit/push | PASS | Awaiting coordinator approval |
| 14 | No Vercel deployment | PASS | Awaiting coordinator approval |
| 15 | GMC eligibility gap documented | PASS (WARN) | asset_group_listing_group_filters = 0 rows; limitation banner shown |

## Data Quality Notes

- 47 price mismatches in full feed (GBP) — 5 confirmed in Top 40 (plus 4 EUR blocking comparison)
- 111 OOS in full feed — 1 found in Top 40 actively spending
- 10 availability mismatches in full feed — 4 found in Top 40
- GMC dedup: ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY CASE WHEN country='GB' THEN 0 ELSE 1 END)

## Limitation Disclosures

All 4 known data gaps disclosed in warning banner at top of Panel 3. No data shown as more verified than it actually is. "Incomplete Verification" used wherever verification cannot be completed from available sources.
