---
name: muguntha-budget-change-monitor-phase3-implementation
description: Reusable prompt for implementing Phase 3 of MUGA-BRAS — early budget change monitoring module for dm-dashboard. Outbox-pattern Discord notifications, watermark dedup, first-run baseline, ROAS alignment assessment.
metadata:
  type: prompt
---

# Prompt: Muguntha Budget Change Monitor — Phase 3 Implementation

## What to Build

Create a new Python module `backend/app/dashboard_pages/muguntha_budget_change_monitor.py` that monitors `google_ads.google_ads_change_events` for budget changes on Muguntha-scope campaigns (UK/DE/FR accounts) and sends informational Discord alerts.

## Key Files

| File | Action |
|---|---|
| `backend/app/dashboard_pages/muguntha_budget_change_monitor.py` | CREATE — new module |
| `backend/tests/test_muguntha_budget_change_monitor.py` | CREATE — test file |
| `backend/app/main.py` | MODIFY — register router, schema, and snapshot |

## Technical Constraints

### Safety
- `google_ads.google_ads_change_events` is READ-ONLY. Never modify budgets, campaigns, or any Google Ads resource.
- Alerts are informational only. No automatic approvals, rejections, or budget changes.

### Outbox pattern (Discord reliability)
1. INSERT event row with `notified_discord = FALSE` (row_hash UNIQUE prevents duplicates)
2. Send Discord notification via `_send_discord()`
3. UPDATE `notified_discord = TRUE` in a separate transaction
- If step 3 fails, `_retry_pending_notifications()` handles retry on next poll
- Duplicate alert is acceptable in extreme failure — this is informational only

### Watermark + dedup
- Poll `google_ads_change_events` with `created_at >= watermark - 10min` (overlap window)
- Load all known `row_hash` values from monitor table for the overlap window
- Skip events whose row_hash is already present (idempotent processing)
- Advance watermark to `MAX(created_at)` of fetched events after each poll

### First-run baseline
- On first poll (watermark IS NULL): set watermark to `NOW()` and return immediately
- Historical events are NOT processed — only new events after activation are alerted
- This prevents a flood of Discord messages for existing historical records

### DB separation
- `get_conn()` — dm_dashboard DB (158.220.99.127) — monitor tables, watermark
- `get_business_conn()` — ledsone DB (169.58.91.229) — google_ads tables — ONE connection per poll for all campaign lookups

### Previous budget change date
Use this query pattern (not `updated_at` — it is re-stamped on re-syncs):
```sql
SELECT MAX(change_date_time) FROM google_ads.google_ads_change_events
WHERE campaign_id = %(cid)s AND change_type = 'budget'
  AND (change_date_time < %(dt)s OR (change_date_time = %(dt)s AND id < %(eid)s))
```

### Alignment logic
Compare actual change direction (increase/decrease/no_change) against recommended direction from `apply_budget_rule()`.
- `follows_recommendation` — directions match
- `differs_from_recommendation` — directions are opposite
- `informational` — review-only recommendation or no ROAS data
- NEVER label a change a "violation" — alerts are informational

### Skip conditions (mandatory)
- `campaign_id IS NULL` — shared budgets, skip
- `old_value IS NULL` — new budget creation, not a change, skip
- `customer_id NOT IN {4503486236, 9031058245, 1266953046}` — out of Muguntha scope, skip

### Schedule
- `ScheduledSnapshot` with `interval_hours=2`

## Required Discord Alert Fields (per approval spec)
- Campaign name, account ID, changed by (user_email), via (client_type)
- Old budget, new budget, % change, changed at (timestamp)
- ROAS (30-day), conversions (30-day), prev month ROAS
- Recommendation (recommended_action, proposed_budget)
- Review window status (early/passed/first change)
- Alignment (follows/differs/informational)
- Informational footer — "no action taken automatically"

## main.py Registration Pattern
```python
from .dashboard_pages.muguntha_budget_change_monitor import router as muguntha_budget_change_monitor_router
from .dashboard_pages.muguntha_budget_change_monitor import ensure_schema as ensure_budget_change_monitor_schema
from .dashboard_pages.muguntha_budget_change_monitor import start_monitor as start_budget_change_monitor

# In _ensure_schemas():
try:
    ensure_budget_change_monitor_schema()
except Exception as e:
    print(f"WARNING: budget_change_monitor schema init failed: {e}")

# In _start_background_sync():
start_budget_change_monitor()

# Router:
app.include_router(muguntha_budget_change_monitor_router)
```

## Expected Output
- Module with ~300 lines
- Test file with ~55 tests across 11 classes
- 134/134 tests PASS (55 new + 79 existing budget_alerts regression)
- Frontend build: clean (no changes needed)
