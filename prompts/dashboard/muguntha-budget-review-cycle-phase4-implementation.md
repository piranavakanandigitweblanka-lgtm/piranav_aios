---
name: muguntha-budget-review-cycle-phase4-implementation
description: Implement Phase 4 of Muguntha Budget Alerts — continuous per-campaign 30-day review cycle with recurring auto-advance, outbox Discord delivery, atomic state transitions, and historical seeding.
metadata:
  type: prompt
  category: dashboard
  project: dm-dashboard
  date: 2026-11-02
---

# Prompt: Muguntha Budget Review Cycle — Phase 4 Implementation

## What to Build

Implement `backend/app/dashboard_pages/muguntha_budget_review_cycle.py` as a new module that adds a continuous per-campaign 30-day budget review cycle to the existing Muguntha Budget Alert System (MUGA-BRAS).

## Prerequisites

- Phase 1+2: `muguntha_budget_alerts.py` (79 tests PASS)
- Phase 3: `muguntha_budget_change_monitor.py` (55 tests PASS)
- Phase 1 must expose: `_evaluate_single_campaign()`, `_send_discord()`, `_roas()`, `_prev_month_bounds()`, `_ACCOUNT_CURRENCY`, `apply_budget_rule()`

## Core Business Rules

1. Every in-scope campaign has its own continuous 30-day review cycle.
2. First review due date = latest budget modification date + 30 days.
3. After each successful review, auto-create next pending cycle (cycle_start = previous review_due, next_due = cycle_start + 30). Self-perpetuating.
4. A new budget change resets only that campaign's pending cycle from the new change date.
5. Early budget-change alerts (Phase 3) and 30-day review alerts are SEPARATE Discord notifications.
6. Reuse Muguntha ROAS, conversions, prev-month and budget recommendation rules.
7. Never modify Google Ads budgets, pause campaigns, or auto-approve/reject.

## Files to Create / Modify

### Create: `muguntha_budget_review_cycle.py`

Functions required (in order):
1. `ensure_schema()` — CREATE TABLE `muguntha_campaign_review_schedule` + 3 indexes + call `_seed_historical_schedule()`
2. `_seed_historical_schedule()` — query `google_ads_change_events` for latest change per in-scope campaign; INSERT `pre_activation` (review_due < today) or `pending` (review_due >= today). Idempotent via ON CONFLICT DO NOTHING.
3. `upsert_review_schedule(conn, campaign_id, budget_change_event_id, monitor_row_id, change_dt)` — called by Phase 3 after budget change INSERT. Handles Mandatory Correction A.
4. `_get_campaigns_for_review(bconn, campaign_ids, eval_start, eval_end, pm_start, pm_end)` — includes campaign_name, days_with_data, last_data_date.
5. `_build_review_discord_message(...)` — `📊 **30-day Budget Review — {campaign_name}**` prefix. Distinct from Phase 3's `🔔` prefix.
6. `_retry_review_notifications()` — outbox retry for notified_discord=FALSE rows within 25h.
7. `run_campaign_review_cycle()` — main compute_fn.
8. `_advance_schedule(sched_id, campaign_id, review_due, alert_id)` — atomic fired + next PENDING in one transaction.
9. `ScheduledSnapshot(scope="muguntha-budget-review-cycle", interval_days=1, run_hour=8)`
10. `start_review_cycle()` + `router` with GET `/` and GET `/summary` endpoints.

### Database Table

```sql
CREATE TABLE IF NOT EXISTS public.muguntha_campaign_review_schedule (
    id                      SERIAL PRIMARY KEY,
    campaign_id             BIGINT NOT NULL,
    budget_change_event_id  BIGINT,
    monitor_row_id          INT,
    cycle_start_date        DATE NOT NULL,
    review_due_date         DATE NOT NULL,
    status                  TEXT NOT NULL DEFAULT 'pending',
    review_alert_id         INT,
    review_fired_at         TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT mcrs_status_check CHECK (status IN ('pending', 'fired', 'pre_activation'))
);
-- Indexes: mcrs_campaign_pending_unique (WHERE status='pending'), mcrs_due_unfired_idx (WHERE status='pending'), mcrs_campaign_history_idx
```

### Mandatory Corrections

**A — Stale alert expiry**: In `upsert_review_schedule()`, if existing pending row has `review_alert_id IS NOT NULL`, expire that alert (`UPDATE muguntha_budget_alerts SET status='expired' WHERE id=%s AND alert_source='campaign_review_cycle' AND status='review_required'`) before updating the schedule.

**B — Atomic auto-advance**: In Step 2 commit, UPDATE alert notified_discord + UPDATE schedule status='fired' + INSERT next PENDING row — all in ONE transaction.

**C — Outbox reliability**: Use two-step outbox. Step 1: INSERT alert + UPDATE schedule.review_alert_id (COMMIT). Step 2: Send Discord + atomic commit (B). If Step 2 Discord sends but DB fails, next retry will resend Discord (acceptable; alert row not duplicated). Document this in module docstring.

### `run_campaign_review_cycle()` Flow

1. Expire stale `review_required` alerts older than 30 days.
2. Query `WHERE status='pending' AND review_due_date <= CURRENT_DATE`.
3. For each due campaign:
   a. If `review_alert_id IS NULL`: call `_evaluate_single_campaign(..., status='review_required', alert_source='campaign_review_cycle', pending_campaign_ids=set())`. Step 1 commit: `UPDATE schedule SET review_alert_id = alert_id`.
   b. If `review_alert_id IS NOT NULL`: resume from crashed attempt, fetch alert row.
   c. Build Phase 4 Discord message. Send Discord.
   d. Step 2 atomic: UPDATE alert + UPDATE schedule fired + INSERT next PENDING.
4. If no perf data for campaign: `_advance_schedule()` anyway (chain must not block). Log clearly.
5. Call `_retry_review_notifications()`.

### Phase 3 Amendment (`muguntha_budget_change_monitor.py`)

After the monitor INSERT commit (after `inserted_id = inserted["id"]`), add:
```python
try:
    from .muguntha_budget_review_cycle import upsert_review_schedule as _upsert_rs
    with get_conn() as sched_conn:
        _upsert_rs(sched_conn, cid, int(evt["id"]), inserted_id, change_dt)
        sched_conn.commit()
except ImportError:
    pass
except Exception as sched_err:
    print(f"[budget-change-monitor] schedule upsert failed for campaign {cid}: {sched_err}", flush=True)
```

### `main.py` Changes

Add imports, register `ensure_budget_review_cycle_schema()` in `_ensure_schemas()`, add `start_review_cycle()` in `_start_background_sync()`, and `app.include_router(muguntha_budget_review_cycle_router)`.

### Alert Source Field

Phase 1's `ensure_schema()` must add `alert_source TEXT DEFAULT 'global_cycle'` column to `muguntha_budget_alerts`. Phase 4 inserts with `alert_source='campaign_review_cycle'`.

### Phase 1 Collision

Phase 4 uses `status='review_required'` which bypasses `mba_campaign_pending_uniq UNIQUE WHERE status='pending'`. Both Phase 1 and Phase 4 alerts coexist per campaign simultaneously.

## Test File

Create `backend/tests/test_muguntha_budget_review_cycle.py` with ~49 tests across:
- TestCycleStartDateCalculation (5)
- TestDateChain (4)
- TestScheduleSeedHistorical (5)
- TestScheduleUpsert (5)
- TestAutoAdvanceOnFired (4)
- TestOutboxReviewAlert (6)
- TestRunCampaignReviewCycle (6)
- TestReviewDiscordMessage (8)
- TestRetryReviewNotifications (3)
- TestPhase3ScheduleIntegration (3)

## Validation

- 49 Phase 4 tests PASS
- 79 Phase 1+2 regression tests PASS
- 55 Phase 3 regression tests PASS
- Total: 183/183 PASS

## Security Constraints

- READ-ONLY with respect to Google Ads — no UPDATE/INSERT/DELETE to `google_ads.*` tables
- Never modify campaign budgets
- Never pause or enable campaigns
- All alerts are informational only
