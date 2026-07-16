# Requirement 2 — Cost Fix Implementation Notes
**Date:** 2026-07-16  
**File changed:** Staff-requirements/pages/theekshy.html

## Changes Made

### 1. Data Source
- OLD: `google_ads.campaign_search_term_data` (cost = NULL for all PMax rows)
- NEW: `google_ads.pmax_campaign_search_term_data` (cost = numeric, 100% coverage)

### 2. Date Ranges Updated
- OLD latest date: 2026-07-12 (from campaign_search_term_data)
- NEW latest date: 2026-06-30 (latest in pmax_campaign_search_term_data)

| Range | Old End | New Start | New End |
|---|---|---|---|
| 7D | 2026-07-06–12 | 2026-06-24 | 2026-06-30 |
| 30D | 2026-06-12–07-12 | 2026-06-01 | 2026-06-30 |
| 60D | 2026-05-13–07-12 | 2026-06-01 | 2026-06-30 |
| 90D | 2026-04-13–07-12 | 2026-06-01 | 2026-06-30 |

### 3. Data Arrays Replaced

| Array | Old Rows | New Rows | Cost |
|---|---|---|---|
| TERMS_7D | 28 rows, null cost | 150 rows, all with cost | PASS |
| TERMS_30D | 191 rows, mixed null | 200 rows, all with cost | PASS |
| TERMS_60D | ~300 rows, mixed null | Reference to TERMS_30D | PASS |
| TERMS_90D | ~300 rows, mixed null | Reference to TERMS_30D | PASS |

### 4. JS Fixes

| Fix | Location |
|---|---|
| Sort map: added cost at index 6 | `var cm={imp:2,clicks:3,conv:4,cv:5,cost:6}` |
| Cost column header: onclick="sortR2('cost')" | `<th ... onclick="sortR2('cost')">Cost £</th>` |
| KPI: added totalSpend and wasteTermCount | `renderR2Kpis()` function |
| Info notes: removed NULL warning, added source confirmation | HTML section 344–356 |
| Validation section: updated with new checks | HTML section 440–474 |
| Business rules: Rule 1 ACTIVE (was BLOCKED) | HTML section 462–472 |
| Footer, grain label, date meta: updated dates/source | Multiple HTML elements |

### 5. Array Format

```javascript
// Format: [term, campId, imp, clicks, conv, convValue, cost, matchType]
// Indices: [0,    1,     2,   3,      4,    5,         6,    7        ]
```

No change to array index positions — JS already reads cost at r[6].

## Files NOT Changed
- panel-1 (Req 1): untouched
- panel-3 (Req 3): untouched
- panel-4 (Req 4): untouched
- All R1_, R3_, R4_ JS functions: untouched
- Campaign-level daily cost arrays: untouched
