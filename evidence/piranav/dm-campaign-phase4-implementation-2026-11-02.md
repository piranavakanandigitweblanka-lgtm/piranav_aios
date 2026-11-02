---
name: dm-campaign-phase4-implementation-2026-11-02
description: Evidence for Phase 4 Muguntha Budget Review Cycle implementation — continuous 30-day per-campaign review cycle with recurring auto-advance, outbox Discord delivery, atomic state transitions, and historical seeding.
metadata:
  type: evidence
  date: 2026-11-02
  project: dm-dashboard
  phase: MUGA-BRAS Phase 4
---

# Evidence: Phase 4 — Muguntha Budget Review Cycle

**Date:** 2026-11-02  
**Phase:** MUGA-BRAS Phase 4 — Per-Campaign 30-Day Review Cycle  
**Status:** IMPLEMENTED — awaiting commit approval

---

## What Was Built

### New Files

| File | Purpose |
|---|---|
| `backend/app/dashboard_pages/muguntha_budget_review_cycle.py` | Phase 4 core module — schedule table, seed, upsert, outbox review cycle, Discord, ScheduledSnapshot |
| `backend/tests/test_muguntha_budget_review_cycle.py` | 49 Phase 4 tests |

### Modified Files

| File | Change |
|---|---|
| `backend/app/dashboard_pages/muguntha_budget_alerts.py` | Added `alert_source` column to `ensure_schema()`. Added `_evaluate_single_campaign()` function. Restructured `run_evaluation()` inner loop to use `_evaluate_single_campaign()`. |
| `backend/app/dashboard_pages/muguntha_budget_change_monitor.py` | Added lazy import + `upsert_review_schedule()` call after monitor INSERT |
| `backend/app/main.py` | Added Phase 4 imports, schema registration, start function, router registration |

---

## Architecture

### Database Table

`public.muguntha_campaign_review_schedule`:
- `campaign_id` BIGINT — the campaign being reviewed
- `cycle_start_date` DATE — when this review window starts
- `review_due_date` DATE — 30 days after cycle_start_date
- `status` TEXT — `pending` / `fired` / `pre_activation`
- `review_alert_id` INT — FK to muguntha_budget_alerts (crash-safe sentinel)
- UNIQUE INDEX on `(campaign_id) WHERE status='pending'` — one pending row per campaign

### Recurring Chain

`Oct 12 → Nov 11 → Dec 11 → Jan 10 → Feb 9 → ...`

Each fired review auto-inserts the next pending row with `cycle_start = previous review_due`, `review_due = cycle_start + 30`.

### Outbox Pattern

Step 1: INSERT alert row (`alert_source='campaign_review_cycle'`, `status='review_required'`) + UPDATE `schedule.review_alert_id` — COMMIT.  
Step 2 (atomic): UPDATE alert `notified_discord=TRUE` + UPDATE schedule `status='fired'` + INSERT next PENDING row — ONE COMMIT.

### Mandatory Corrections Implemented

| Correction | Implementation |
|---|---|
| A — Stale alert expiry | `upsert_review_schedule()` expires `review_required` alert (only `alert_source='campaign_review_cycle'`) before schedule reset |
| B — Atomic auto-advance | fired + next PENDING INSERT in one transaction |
| C — Discord delivery | Existing Phase 3 outbox pattern reused; at-least-once documented in module docstring |

---

## Test Results

```
backend/tests/test_muguntha_budget_review_cycle.py    49/49 PASS
backend/tests/test_muguntha_budget_alerts.py          79/79 PASS  (regression)
backend/tests/test_muguntha_budget_change_monitor.py  55/55 PASS  (regression)
---
Total: 183/183 PASS — 7.78s
```

---

## Security Compliance

- READ-ONLY with respect to `google_ads.*` tables — verified no UPDATE/INSERT/DELETE
- No campaign budget modifications
- No campaign pause/enable
- All Discord alerts are informational only
- No automatic approvals or rejections

---

## Git Status

Pending commit approval from Piranav. No commit has been made.  
Branch: `piranv-work` (dm-dashboard repo)
