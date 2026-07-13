---
name: jackshan-r1-date-range-validation
description: Date range validation for Jackshan Requirement 1
metadata:
  type: project
---

# Jackshan Requirement 1 — Date Range Validation

**Title:** Date Range Validation  
**Purpose:** Document and verify the reporting date range  
**Staff Owner:** Jackshan  
**Supporting AIOS Staff / Reviewer:** Piranav  
**Store:** ledsone.co.uk  
**PASS / FAIL:** PASS (with known limitation)

---

## Date Range Derivation

SQL used to find max date:
```sql
SELECT MIN(date) as min_date, MAX(date) as max_date 
FROM google_search_console.query_page;
```

Result:
- **Min date in table:** 2026-06-29
- **Max date in table:** 2026-07-07

## Reporting Period Calculation

Per requirement rules:
1. Maximum available GSC date: **2026-07-07**
2. Reporting end date: **2026-07-07**
3. Reporting start date (3 calendar months before end): **2026-04-07**
4. Applied to query: `WHERE date >= '2026-04-07' AND date <= '2026-07-07'`

## Known Limitation

The GSC table only contains data from 2026-06-29 to 2026-07-07 — a span of 9 days. The full 3-month window is declared but only 9 days of actual data exists within it.

This is clearly documented in the dashboard information bar.

## Data Used

All 331,510 rows in google_search_console.query_page fall within the declared date range. No future dates exist. No incomplete dates excluded.
