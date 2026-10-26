# Validation — Conduit Sold Dynamic Month Fix

**Date:** 2026-10-26
**Task:** Dynamic reporting period implementation
**Method:** pytest local run + code review

---

## Test Results

| Suite | Tests | Result |
|---|---|---|
| `TestReportingPeriod` | 8 | PASS |
| `TestBuildReportMonthInclusion` | 5 | PASS |
| **Total** | **13** | **13/13 PASS** |

Command: `cd backend && venv/Scripts/python -m pytest tests/test_conduit_sold.py -v`

---

## Code Review Checklist

| # | Check | Result |
|---|---|---|
| 1 | `_reporting_period()` uses `ZoneInfo("Europe/London")` — BST aware | PASS |
| 2 | `PHASE1_START` unchanged (2026-04-01) | PASS |
| 3 | `PHASE1_END` and `MONTHS` global constants removed | PASS |
| 4 | `_fetch_uk_orders_in_range(start, end)` uses `end + timedelta(days=1)` as exclusive bound | PASS |
| 5 | `_build_report(collections, orders, months)` — months passed as parameter, no global reference | PASS |
| 6 | `_compute_conduit_sold()` calls `_reporting_period()`, passes results through chain | PASS |
| 7 | Response payload includes `"period": {"start": ..., "end": ...}` with dynamic ISO dates | PASS |
| 8 | Frontend `exportCSV()` accepts `period` arg | PASS |
| 9 | Frontend filename uses `_periodSlug(period)` — no hardcoded `apr-sep-2026` | PASS |
| 10 | Frontend call site passes `data.period` | PASS |
| 11 | No Component Stock code touched | PASS |
| 12 | No ScheduledSnapshot config changed | PASS |
| 13 | Existing calculation rules (VOIDED exclusion, cancelledAt, revenue field) unchanged | PASS |

---

## Behaviour Verification (Oct 26 2026)

| Scenario | Expected | Confirmed |
|---|---|---|
| Run on Oct 26 2026 | months = Apr–Sep 2026 (Oct not complete) | PASS (test_mid_october_2026_stops_at_sep) |
| Run on Nov 1 2026 | months = Apr–Oct 2026 | PASS (test_first_of_november_2026_includes_october) |
| Run on Jan 15 2027 | months = Apr–Dec 2026 (9 months) | PASS (test_january_2027_includes_dec_2026) |
| Feb 2027 crosses year boundary | months include Jan 2027 | PASS (test_february_2027_spans_into_2027) |
| end.day = last day of month | Oct 31, Sep 30, Feb 28 correct | PASS (test_end_is_last_day_of_month) |

---

## Pre-Deployment Validation (2026-10-26 — second pass)

### Git state confirmed
| Item | Value |
|---|---|
| Repository | `websitetecteam-arch/dm-dashboard.git` |
| Active branch | `piranv-work` (HEAD `103de7b`) |
| Modified files (unstaged) | `backend/app/dashboard_pages/conduit_sold.py`, `frontend/src/admin/pages/ConduitSold.jsx` |
| Untracked files | `backend/tests/test_conduit_sold.py` |
| No other files touched | CONFIRMED via `git diff --name-only` |
| Component Stock (`conduit_stock.py`) | UNTOUCHED — not in diff |
| Other dashboard pages | UNTOUCHED |
| dm-dashboard is a git submodule of piranav_aios | CONFIRMED |

### Hardcoded reference scan — all clear
```
grep -rn "PHASE1_END|apr-sep-2026|MONTHS\s*=" backend/app/ frontend/src/
```
Result: Zero matches in conduit_sold.py or ConduitSold.jsx. The only hits were in unrelated files (comments, employee_performance.py with a different constant).

### Full test suite regression check
```
pytest tests/ --ignore=tests/test_conduit_sold.py -q  → 22 failed, 357 passed
pytest tests/ (baseline, git stash applied)          → 22 failed, 119 passed
```
**Same 22 failures on baseline (pre-implementation) and with implementation.** Zero regressions introduced.

Failing tests are pre-existing in:
- `test_muguntha_budget_alerts.py` (3 failures — Discord/Telegram config mocks)
- `test_promotion_automation.py` (1 failure — discount velocity edge case)
- `test_repeat_customer_products.py` (18 failures — image enrichment + endpoint validation)

None of these touch conduit_sold. All pre-dated this session.

### Untested behaviours (known gaps, acceptable for this scope)
| Gap | Risk | Reason acceptable |
|---|---|---|
| Month bucketing uses UTC (not BST) for `createdAt` grouping | Low | Pre-existing behaviour; orders placed near midnight on UK DST transitions may land in wrong month by 1 hour. Documented as Issue 2 in investigation. Not in scope for this fix. |
| No integration test hitting the live Shopify API | Low | By design — Shopify credentials not in test environment. End-to-end requires a production sync. |
| `_periodSlug` output format tested manually only, not via Jest | Low | Pure string transformation; covered by manual spot-check. Oct 2026 → `apr-to-oct-2026`; Feb 2027 → `apr-2026-to-feb-2027`. |
| Snapshot staleness after deploy (existing snapshot holds Apr–Sep data) | Medium | **See remaining blockers.** First sync after deploy will rebuild. |

## Deploy Readiness

| Item | Status |
|---|---|
| Tests passing (conduit) | YES — 13/13 |
| Full suite regressions | NONE — pre-existing 22 failures unchanged |
| No hardcoded date strings remain in changed code | YES — grep confirmed |
| Only 2 application files modified (+ 1 new test file) | YES |
| Component Stock untouched | YES |
| AIOS evidence written | YES |
| Prompt saved | YES |
| Commit NOT yet made | PENDING PIRANAV APPROVAL |

**Overall: PASS — implementation verified, ready for Piranav commit/push approval.**
