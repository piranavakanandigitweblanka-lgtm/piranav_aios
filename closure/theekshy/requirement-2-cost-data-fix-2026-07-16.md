# Requirement 2 — Cost Fix Closure
**Date:** 2026-07-16  
**Staff:** Theekshy  
**Status:** CLOSED — PASS

## Deliverables Completed

| Item | Status |
|---|---|
| HTML dashboard updated (cost data live) | DONE |
| Old blocked/null messages removed | DONE |
| Rule 1 (Waste: Cost > £1, Conv = 0) active | DONE |
| KPIs: Total Spend, Waste Spend, Waste Term Count added | DONE |
| Cost column sortable | DONE |
| Date ranges corrected to pmax data availability | DONE |
| 7D: 150 terms by cost embedded | DONE |
| 30D: 200 terms by cost embedded | DONE |
| 60D/90D: reference to 30D (same dataset) | DONE |
| Requirements 1, 3, 4 untouched | CONFIRMED |
| No Git push | CONFIRMED |
| No Vercel deployment | CONFIRMED |

## AIOS Files Written

| File | Status |
|---|---|
| prompts/theekshy/requirement-2-cost-data-fix-2026-07-16.md | DONE |
| evidence/theekshy/requirement-2-cost-data-fix-2026-07-16.md | DONE |
| validation/theekshy/requirement-2-cost-data-fix-2026-07-16.md | DONE |
| implementation/theekshy/requirement-2-cost-data-fix-2026-07-16.md | DONE |
| closure/theekshy/requirement-2-cost-data-fix-2026-07-16.md | DONE |
| capability/theekshy/requirement-2-cost-data-fix-2026-07-16.md | DONE |

## Coordinator Notes

- pmax data available from 2026-06-01 only — all 60D/90D ranges show same data as 30D
- When pmax table is refreshed beyond 2026-06-30, update R2_LATEST_DATE and recalculate date ranges
- Next monthly review: re-run SQL queries and update TERMS_7D and TERMS_30D arrays

## Sign-off

| Check | Result |
|---|---|
| Root cause identified | google_ads.campaign_search_term_data — cost NULL for all PMax rows |
| Approved source used | google_ads.pmax_campaign_search_term_data |
| No fake or estimated cost | CONFIRMED |
| No other requirements changed | CONFIRMED |
| Restrictions observed | CONFIRMED |
