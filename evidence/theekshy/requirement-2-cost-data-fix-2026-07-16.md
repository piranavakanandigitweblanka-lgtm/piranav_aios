# Requirement 2 — Cost Data Fix Evidence
**Date:** 2026-07-16  
**Staff:** Theekshy  
**Status:** PASS

## Root Cause

`google_ads.campaign_search_term_data` — cost is NULL for all 19,534 rows for campaigns 23714290257 and 23684837882. Confirmed via:
```sql
SELECT COUNT(*) as total, COUNT(cost) as cost_not_null
FROM google_ads.campaign_search_term_data
WHERE campaign_id IN (23714290257, 23684837882);
-- Result: total=19534, cost_not_null=0
```

## Approved Source

`google_ads.pmax_campaign_search_term_data`

| Field | Type | Notes |
|---|---|---|
| date | date | Daily grain |
| campaign_id | bigint | Join key |
| search_term | text | Normalize: LOWER(TRIM()) |
| match_type | varchar | PERFORMANCE_MAX |
| impressions | integer | |
| clicks | integer | |
| cost | numeric | GBP — NOT micros |
| conversions | numeric | |
| conversions_value | numeric | |

Cost coverage: 20,127 / 20,127 rows = **100%**  
Date range: 2026-06-01 to **2026-06-30** (latest available)

## DB Validation Totals

| Range | Terms | Impressions | Clicks | Cost £ | Conv | CV £ |
|---|---|---|---|---|---|---|
| 7D (2026-06-24–30) | 5,928 combos (150 shown) | 13,112 | 216 | 78.19 | 8.99 | 149.47 |
| 30D (2026-06-01–30) | 12,947 combos (200 shown) | 32,988 | 506 | 199.00 | 21.77 | 705.90 |
| 60D | Same as 30D (data limited to June) | — | — | — | — | — |
| 90D | Same as 30D (data limited to June) | — | — | — | — | — |

## Sample Term Verification

| Term | Campaign | Imp | Clicks | Cost £ | Conv | Source Confirmed |
|---|---|---|---|---|---|---|
| e27 ceiling light fitting | 23714290257 | 186 | 3 | 0.37 | 1.50 | Yes |
| pendant light | 23714290257 | 18 | 2 | 0.47 | 0.50 | Yes |
| e27 lamp holder | 23714290257 | 146 | 3 | 0.36 | 1.50 | Yes |
| kitchen lights ideas | 23684837882 | 22 | 2 | 4.67 | 1.00 | Yes |

## Waste Rule Validation (7D)

Rule 1 active: Cost > £1 AND Conv = 0 → Remove

Example waste terms in 7D (after brand filter):
- kitchen lights ideas — £4.02 — REMOVE (Rule 1)
- hanging ceiling lights — £2.67 — REMOVE (Rule 1)
- black pendant holder — £2.38 — REMOVE (Rule 1)
- bedside hanging lights for bedroom — £2.37 — REMOVE (Rule 1)
- led modules for signage — £2.04 — REMOVE (Rule 1)

Brand terms exempted from Rule 1 (Keep):
- led stone, ledstone, ledsone reviews (in R2_BRAND list)
