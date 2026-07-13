# Jackshan — Requirement 2 — Validation

**Date:** 2026-07-13
**Status:** PASS

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | 50 products processed | PASS | All 50 handles present |
| 2 | All products have GSC data | PASS | 50/50 with live API data |
| 3 | Sales data from Shopify ShopifyQL | PASS | Monthly + weekly retrieved |
| 4 | Optimize rule applied correctly | PASS | Sales ≤ 1 AND CTR < 5% |
| 5 | DNO rule applied correctly | PASS | Sales > 1 OR CTR ≥ 5% |
| 6 | Optimize count = 43 | PASS | 43/50 products |
| 7 | DNO count = 7 | PASS | 7/50 products |
| 8 | Total = 50 | PASS | 43+7=50 |
| 9 | Sort by Monthly CTR (default) | PASS | Descending CTR default |
| 10 | Search filter functional | PASS | JS search across URL+title |
| 11 | Status filter functional | PASS | Optimize / DNO dropdown |
| 12 | Sales filter functional | PASS | 0 / ≤1 / ≥2 dropdown |
| 13 | Export CSV functional | PASS | Downloads filtered rows |
| 14 | KPI cards correct | PASS | All 6 KPIs verified |
| 15 | Tab navigation | PASS | Req1 ↔ Req2 tabs functional |
| 16 | Recommended actions populated | PASS | 5-point list for Optimize |
| 17 | Average CTR = 0.3% | PASS | Derived from 38/12,600 |
| 18 | Total clicks = 38 | PASS | Sum across all 50 |
| 19 | Total impressions = 12,600 | PASS | Sum across all 50 |
| 20 | Revert rule documented | PASS | In prompt + business rules |

**Overall: PASS — 20/20 checks passed**
