# Evidence — Conduit Sold Dynamic Reporting Month Fix

**Date:** 2026-10-26
**Task:** Replace hardcoded Apr–Sep 2026 date range with dynamic generation based on last completed month in Europe/London timezone
**Status:** COMPLETE — local implementation only. Awaiting Piranav approval to deploy.

---

## A. What Was Changed

### Backend — `backend/app/dashboard_pages/conduit_sold.py`

| Change | Detail |
|---|---|
| Module docstring | Updated to reflect dynamic end date |
| New imports | `import calendar`, `timedelta` added to datetime import, `from zoneinfo import ZoneInfo` |
| Removed constants | `PHASE1_END = date(2026, 9, 30)` and `MONTHS = [...]` removed |
| Added constants | `LONDON_TZ = ZoneInfo("Europe/London")`, `_MONTH_LABELS` list |
| New function `_reporting_period()` | Returns `(start, end, months)` — last completed month in Europe/London TZ |
| Updated `_fetch_uk_orders_in_range()` | New signature `(start: date, end: date)`. Shopify query uses `end + timedelta(days=1)` as exclusive upper bound |
| Updated `_build_report()` | New signature `(collections, orders, months)` — accepts months as parameter instead of reading from global constant |
| Updated `_compute_conduit_sold()` | Calls `_reporting_period()` first; passes `start`, `end`, `months` to the sub-functions; includes `"period"` key in response with dynamic `start`/`end` ISO dates |

### Frontend — `frontend/src/admin/pages/ConduitSold.jsx`

| Change | Detail |
|---|---|
| New helper `_periodSlug(period)` | Converts `{start, end}` ISO date strings into filename slug: same-year → `apr-to-oct-2026`, cross-year → `apr-2026-to-feb-2027` |
| Updated `exportCSV()` | Signature `(collection, months, period)`. Filename is now `${handle}-sold-${slug}.csv` |
| Updated Export CSV call site | `onClick={() => exportCSV(coll, data.months, data.period)}` |
| Sub-header text | `Apr–Sep 2026` → `Apr 2026 – present` |
| Loading spinner text | `Apr–Sep 2026` → `Apr 2026 – last completed month` |
| Footnote source line | Dynamic description replacing hardcoded date |
| Footnote "Phase 1 scope" line | Replaced with "Reporting window: Apr 2026 – last completed calendar month in Europe/London time" |

### New test file — `backend/tests/test_conduit_sold.py`

13 tests in 2 test classes:
- `TestReportingPeriod` (8 tests) — verifies `_reporting_period()` returns correct `(start, end, months)` for:
  - Oct 26 2026 → Sep 2026 end
  - Nov 1 2026 → Oct 2026 end
  - Nov 15 2026 → Oct 2026 end
  - Jan 15 2027 → Dec 2026 end (9 months)
  - Feb 1 2027 → Jan 2027 end (cross-year)
  - Mar 10 2027 → Feb 2027 end (correct label sequence)
  - `start` always equals `PHASE1_START`
  - `end.day` always equals the last calendar day of the month
- `TestBuildReportMonthInclusion` (5 tests) — verifies `_build_report()`:
  - Sep order included when months through Sep
  - Oct order excluded when months stop at Sep
  - Oct order included when months extend through Oct
  - Multi-month orders accumulate in correct columns
  - Products not in any collection are ignored

---

## B. Test Run Results

```
============================= test session starts =============================
platform win32 -- Python 3.13.0, pytest-9.1.1
collected 13 items

tests/test_conduit_sold.py::TestReportingPeriod::test_mid_october_2026_stops_at_sep PASSED
tests/test_conduit_sold.py::TestReportingPeriod::test_first_of_november_2026_includes_october PASSED
tests/test_conduit_sold.py::TestReportingPeriod::test_mid_november_2026_includes_october PASSED
tests/test_conduit_sold.py::TestReportingPeriod::test_january_2027_includes_dec_2026 PASSED
tests/test_conduit_sold.py::TestReportingPeriod::test_february_2027_spans_into_2027 PASSED
tests/test_conduit_sold.py::TestReportingPeriod::test_march_2027_period_labels PASSED
tests/test_conduit_sold.py::TestReportingPeriod::test_start_always_phase1_start PASSED
tests/test_conduit_sold.py::TestReportingPeriod::test_end_is_last_day_of_month PASSED
tests/test_conduit_sold.py::TestBuildReportMonthInclusion::test_sep_order_included_when_months_through_sep PASSED
tests/test_conduit_sold.py::TestBuildReportMonthInclusion::test_oct_order_excluded_when_months_through_sep PASSED
tests/test_conduit_sold.py::TestBuildReportMonthInclusion::test_oct_order_included_when_months_through_oct PASSED
tests/test_conduit_sold.py::TestBuildReportMonthInclusion::test_multi_month_accumulation PASSED
tests/test_conduit_sold.py::TestBuildReportMonthInclusion::test_product_not_in_collection_ignored PASSED

13 passed, 1 warning in 3.77s
```

---

## C. Design Decisions

| Decision | Rationale |
|---|---|
| Use `Europe/London` TZ (not UTC) for period boundary | Reporting months are business months — October ends at midnight London time, not UTC midnight |
| Keep `PHASE1_START` as a fixed constant | Start date is a business decision; only the end expands automatically |
| `end + timedelta(days=1)` for Shopify query | Consistent with original hardcoded `'2026-10-01'` boundary — exclusive upper bound in Shopify's `created_at:<` filter |
| Month bucket assignment stays UTC | No change to existing behavior — Shopify returns `createdAt` in UTC; bucketing by UTC month is consistent with the existing page (identified as low-severity Issue 2 in investigation) |
| `data.period` passed to `exportCSV()` | Cleanest API: filename derives from what the server actually returned, not from local JS month list |
| `_periodSlug` handles same-year vs cross-year | Avoids year duplication in same-year filenames (`apr-to-oct-2026` cleaner than `apr-2026-to-oct-2026`) |

---

## D. Files Changed

| File | Type | Change |
|---|---|---|
| `backend/app/dashboard_pages/conduit_sold.py` | Modified | Dynamic period logic, updated function signatures |
| `frontend/src/admin/pages/ConduitSold.jsx` | Modified | Dynamic CSV filename, updated text strings |
| `backend/tests/test_conduit_sold.py` | New | 13 pytest tests |

---

## E. What Happens After Next Deploy

1. The next background sync (12-hour schedule OR manual Update button) will call `_compute_conduit_sold()` which now calls `_reporting_period()`.
2. As of 2026-10-26 in London, `_reporting_period()` returns months = Apr–Sep 2026 (same as before — Oct is not yet complete).
3. On Nov 1 2026 or later, the next sync will automatically pick up Oct 2026 and write an updated snapshot.
4. No manual code change needed to add future months — the period grows automatically on the first sync after each month ends.

---

## F. Not Changed (Preserved by Design)

- `PHASE1_START = date(2026, 4, 1)` — fixed; no data before Apr 2026
- All calculation rules: gross units, VOIDED exclusion, cancelledAt exclusion, revenue = `originalTotalSet.shopMoney.amount`
- Component Stock tab — not touched
- `ScheduledSnapshot` pattern, `interval_hours=12`, auth, all API routes
- Month bucketing timezone (UTC) — existing behavior preserved
