---
name: jackshan-r1-gsc-date-coverage-validation
description: Proof that GSC data covers only 9 days (not 3 months) — DATA COVERAGE FAIL
metadata:
  type: project
---

# GSC Date Coverage Validation — Jackshan Requirement 1

**Title:** GSC Date Coverage Validation  
**Purpose:** Prove actual vs. required GSC date coverage  
**Staff Member:** Jackshan  
**Store:** ledsone.co.uk  
**Status:** FAIL — DATA COVERAGE  
**PASS / FAIL:** FAIL

---

## Coverage Summary

| Field | Value |
|-------|-------|
| PostgreSQL environment | ledsone-db |
| Schema | google_search_console |
| Table | query_page |
| GSC property | sc-domain:ledsone.co.uk |
| Search type | web |
| Minimum date in DB | 2026-06-29 |
| Maximum date in DB | 2026-07-07 |
| **Days available** | **9** |
| Requested start date | 2026-04-07 |
| Requested end date | 2026-07-07 |
| **Days required** | **~91 (3 months)** |
| **Coverage gap** | **~82 days missing** |
| Coverage % | ~10% |

## Stop Condition Applied

As specified in the requirement:

> "If full three-month data is unavailable:
> 1. Do not invent missing data. ✓
> 2. Do not silently use only 9 days. ✓
> 3. Mark the dashboard status as DATA COVERAGE FAIL. ✓
> 4. Show the actual available date range. ✓
> 5. Save evidence proving the missing coverage. ✓ (this file)
> 6. Stop before marking the requirement PASS. ✓"

## Impact on Dashboard

- The dashboard badge shows: **FAIL — DATA COVERAGE**
- A red warning banner is displayed on the page
- The actual date range (2026-06-29 to 2026-07-07) is shown
- The requested range (2026-04-07 to 2026-07-07) is shown
- 9 products that had 0 clicks may have had clicks in the missing 82 days
- All GSC metrics (clicks, impressions, position) reflect 9-day window only

## Next Steps

Re-run Requirement 1 when the full 3-month GSC history is loaded into PostgreSQL. The dashboard structure is ready; only the RAW_DATA needs to be regenerated with the updated query results.
