# Prompt — Conduit Sold Dynamic Reporting Month Fix

**Category:** implementation / dm-dashboard
**Date:** 2026-10-26
**Status:** ACTIVE

---

## When to Use

When the Conduit Sold page has a hardcoded date range and needs to be extended to cover new months automatically, or when resuming/verifying this implementation.

---

## Prompt

> You are a Senior FastAPI and React engineer. Implement a dynamic reporting period for the Conduit Sold admin page in the DM Dashboard.
>
> **Context:**
> - File: `backend/app/dashboard_pages/conduit_sold.py`
> - File: `frontend/src/admin/pages/ConduitSold.jsx`
> - The page currently has hardcoded constants `PHASE1_END = date(2026, 9, 30)` and `MONTHS = [...]` fixed to Apr–Sep 2026.
> - The CSV export filename is hardcoded to `{handle}-sold-apr-sep-2026.csv`.
>
> **Requirements:**
> 1. Keep `PHASE1_START = date(2026, 4, 1)` fixed — no data before Apr 2026.
> 2. Add `_reporting_period() -> tuple[date, date, list]` that returns `(start, end, months)`:
>    - Uses `ZoneInfo("Europe/London")` for the current date
>    - `end` = last day of the last fully completed calendar month in London TZ
>    - `months` = list of `(year, month, label)` tuples from PHASE1_START to end
>    - Current incomplete month is always excluded
> 3. Update `_fetch_uk_orders_in_range(start, end)` — accept parameters, use `end + timedelta(days=1)` as exclusive Shopify query bound.
> 4. Update `_build_report(collections, orders, months)` — accept months as parameter, remove global reference.
> 5. Update `_compute_conduit_sold()` to call `_reporting_period()` and pass `start`, `end`, `months` through.
> 6. Response payload must include `"period": {"start": iso, "end": iso}` with dynamic dates.
> 7. Frontend: update `exportCSV(collection, months, period)` with a `_periodSlug(period)` helper for dynamic filenames. Update call site to pass `data.period`.
> 8. Do NOT change Component Stock, ScheduledSnapshot config, calculation rules, or auth.
>
> **Tests to write:** `backend/tests/test_conduit_sold.py`
> - Mock `datetime.now` inside the module using `unittest.mock.patch`
> - Test `_reporting_period()` for: Oct 2026 (→ Sep end), Nov 2026 (→ Oct end), Jan 2027 (→ Dec end), cross-year cases
> - Test `_build_report()` for: order in Sep included, order in Oct excluded when Sep is last, order in Oct included when Oct is last
>
> **Stop after local implementation. Do not commit, push, or deploy without Piranav approval.**

---

## Implementation Reference (2026-10-26)

| Item | Detail |
|---|---|
| New imports | `import calendar`, `timedelta`, `from zoneinfo import ZoneInfo` |
| New constant | `LONDON_TZ = ZoneInfo("Europe/London")`, `_MONTH_LABELS` list |
| _reporting_period | Computes `today = datetime.now(LONDON_TZ).date()`, then last_month = today.month - 1 (or Dec of prev year), then iterates from PHASE1_START to last_month |
| Shopify end boundary | `end + timedelta(days=1)` — consistent with original `'2026-10-01'` hardcode |
| Frontend slug | Same-year: `apr-to-oct-2026`. Cross-year: `apr-2026-to-feb-2027` |
| Tests | 13 tests, all PASS — run: `venv/Scripts/python -m pytest tests/test_conduit_sold.py -v` |
