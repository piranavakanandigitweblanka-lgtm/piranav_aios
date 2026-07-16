# Requirement 2 — Cost Fix Validation
**Date:** 2026-07-16  
**Status:** PASS

## PostgreSQL vs HTML Reconciliation

### 7D Range (2026-06-24 to 2026-06-30)
| Metric | PostgreSQL | HTML Dataset | Match |
|---|---|---|---|
| Total Impressions | 13,112 | Top 150 by cost (subset) | Subset |
| Total Clicks | 216 | Subset | Subset |
| Total Cost | £78.19 | Subset | Subset |
| Total Conv | 8.99 | Subset | Subset |
| Total CV | £149.47 | Subset | Subset |
| Cost NULL rows | 0 | 0 | PASS |
| Duplicate rows | 0 | 0 | PASS |

### 30D Range (2026-06-01 to 2026-06-30)
| Metric | PostgreSQL | HTML Dataset | Match |
|---|---|---|---|
| DB Total Impressions | 32,988 | Top 200 by cost (subset) | Subset |
| DB Total Clicks | 506 | Subset | Subset |
| DB Total Cost | £199.00 | Subset | Subset |
| DB Total Conv | 21.77 | Subset | Subset |
| DB Total CV | £705.90 | Subset | Subset |
| Cost NULL rows | 0 | 0 | PASS |
| Duplicate rows | 0 | 0 | PASS |

Note: HTML shows top N terms by cost to maintain page performance. Full DB totals documented above.

## Waste Rule Checks

| Check | Result |
|---|---|
| Rule 1 (Cost > £1 AND Conv = 0) fires | PASS — triggers on kitchen lights ideas (£4.67), bar lighting (£7.56), etc. |
| Brand terms exempted from Rule 1 | PASS — led stone, ledstone, ledsone reviews classified as Branded → Keep |
| CPA = — when Conv = 0 | PASS — classify function enforces this |
| ROAS = N/A when Cost = 0 | PASS |
| Cost sorting numeric | PASS — sort column map updated: cm.cost = index 6 |
| Cost in CSV export | PASS — already at r[6] in CSV function |

## Formula Verification

- CTR = clicks/imp × 100 ✓
- CPA = cost/conv (only when cost > 0 AND conv > 0) ✓
- ROAS = cv/cost (only when cost > 0 AND cv > 0) ✓
- Waste = cost > 1 AND conv === 0 (strict) ✓

## Old Messages Removed

| Old Message | Status |
|---|---|
| "Cost field is NULL" | REMOVED |
| "BLOCKED — cost null in source" | REMOVED |
| "Cost rules N/A" | REMOVED |
| "CPA unavailable" | REMOVED |
| "CTR rules only (cost field null)" | REMOVED |

## Requirements Integrity

| Requirement | Status |
|---|---|
| Req 1 (Campaign Overview) | UNTOUCHED |
| Req 2 (Search Term Opt) | UPDATED — cost fix only |
| Req 3 (Feed Optimisation) | UNTOUCHED |
| Req 4 (Stock Status) | UNTOUCHED |
