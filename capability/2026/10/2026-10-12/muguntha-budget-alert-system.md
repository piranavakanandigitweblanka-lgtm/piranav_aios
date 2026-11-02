# Capability: Muguntha Budget Rule Alert System (MUGA-BRAS)

**Date Confirmed:** 2026-10-12  
**Last Updated:** 2026-11-02 — Phase 4: Per-Campaign 30-Day Review Cycle added  
**Confirmed By:** Piranav  
**Status:** LIVE — rules corrected (Phase 1), Run Now + Telegram removed (Phase 2), Phase 3 budget change monitor implemented (pending commit), Phase 4 recurring review cycle implemented (pending commit). 183/183 tests PASS.  
**Reusable:** YES — pattern applies to any rule-based alert system in dm-dashboard

---

## What It Does

Automatically evaluates Google Ads campaign budget performance against rule-based thresholds every 6 hours. Generates alerts for over/under-spend. Notifies via Telegram and Discord. Expires alerts after 30 days. View-only dashboard for Muguntha (admin).

---

## Where It Lives

| Component | Location |
|---|---|
| Backend module | `backend/app/dashboard_pages/muguntha_budget_alerts.py` |
| Frontend dashboard | `frontend/src/admin/pages/BudgetAlerts.jsx` |
| Admin nav wiring | `frontend/src/admin/AdminLayout.jsx` (toolKey: `tools.AdminBudgetAlerts`) |
| UAM registry | `taskRegistry.js` → `tools.AdminBudgetAlerts` |
| Tests | `backend/tests/test_muguntha_budget_alerts.py` — 79/79 PASS |

---

## Rule Engine (corrected 2026-11-02)

| ROAS Band | Action | Notes |
|---|---|---|
| 400%+ | increase_20 | GBP cap: max 15% if budget > £150 |
| 350–399% | increase_10 | |
| 300–349% | increase_5 | |
| 275–299% | increase_5 | Only if conversions ≥ 15; else low_conversions_review |
| 200–274% | no_change | |
| 175–199% | decrease_5 | |
| 151–174% | decrease_10 | |
| Below 150% | decrease_15 | If prev month ROAS < 275% → decrease_10 instead. Never pause immediately. |

---

## Schedule

- Runs every **6 hours** via `ScheduledSnapshot`
- Startup run on server start
- Dedup index prevents duplicate alerts within same cycle
- Stagger prevents thundering herd

---

## Notifications

- **Discord only:** `DISCORD_BOT_TOKEN` + `MUGUNTHA_DISCORD_CHANNEL_ID` env vars
- Telegram removed (Phase 2, 2026-11-02)
- Status persisted: `notified_discord`

---

## Alert Lifecycle

1. Alert created → `pending`
2. Auto-expires after **30 days** → `expired`
3. Dashboard: view-only (no approve/reject/dismiss buttons)

---

## UAM

- Grantable to staff via UAM matrix as `tools.AdminBudgetAlerts`
- Admin-only API + frontend (staff blocked at both layers)
- Policy note: all 3 admins can currently approve — no role separation

---

## Evidence

- `evidence/dm-dashboard/muguntha-budget-rule-alert-step2-implementation-2026-10-12.md`
- `evidence/piranav/dm-campaign-phase3-implementation-2026-11-02.md`
- `validation/piranav/muguntha-budget-rule-alert-step2-validation-2026-10-12.md`
- `validation/piranav/dm-campaign-phase3-implementation-validation-2026-11-02.md`

---

## Phase 4: Per-Campaign 30-Day Review Cycle (2026-11-02)

New module: `backend/app/dashboard_pages/muguntha_budget_review_cycle.py`

| Component | Location |
|---|---|
| Review cycle module | `backend/app/dashboard_pages/muguntha_budget_review_cycle.py` |
| Review cycle tests | `backend/tests/test_muguntha_budget_review_cycle.py` — 49 tests |
| DB table | `muguntha_campaign_review_schedule` (dm_dashboard) |
| Schedule | Every 1 day via `ScheduledSnapshot`, run_hour=8 |
| Source | `google_ads.google_ads_change_events` (READ-ONLY) for seeding |

**What Phase 4 does:**
- Each in-scope campaign gets a continuous 30-day review cycle
- First review = latest budget change date + 30 days
- After each review fires, auto-inserts next PENDING row (cycle_start = previous review_due)
- Uses two-step outbox: INSERT alert + UPDATE schedule.review_alert_id (Step 1 COMMIT), then Discord + atomic fired + next PENDING (Step 2 COMMIT)
- Budget change (Phase 3) resets pending cycle from new change date; expires stale reserved alert (Mandatory Correction A)
- Phase 4 alerts use status='review_required' and alert_source='campaign_review_cycle' — coexist with Phase 1 'pending' alerts
- Historical seeding: pre_activation (review already passed) vs pending (review in future)
- Discord message format: `📊 **30-day Budget Review — {campaign_name}**`

---

## Phase 3: Budget Change Monitor (2026-11-02)

New module: `backend/app/dashboard_pages/muguntha_budget_change_monitor.py`

| Component | Location |
|---|---|
| Monitor module | `backend/app/dashboard_pages/muguntha_budget_change_monitor.py` |
| Monitor tests | `backend/tests/test_muguntha_budget_change_monitor.py` — 55 tests |
| DB tables | `muguntha_budget_change_monitor` + `muguntha_budget_change_monitor_watermark` (dm_dashboard) |
| Schedule | Every 2 hours via `ScheduledSnapshot` |
| Source | `google_ads.google_ads_change_events` (READ-ONLY, ledsone DB) |

**What Phase 3 does:**
- Polls `google_ads_change_events` every 2h for budget changes on UK/DE/FR accounts
- Converts old_value/new_value from micros, looks up ROAS and conversions (30-day)
- Applies `apply_budget_rule()` to get Muguntha's recommendation
- Assesses alignment (follows/differs/informational) — never labels as violation
- Sends informational Discord alert with all required fields
- Outbox pattern: INSERT → Discord → UPDATE flag; retry on failure
- First-run baseline: seeds watermark to NOW(), no historical events processed
