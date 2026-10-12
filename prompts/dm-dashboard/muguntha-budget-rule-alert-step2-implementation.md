---
id: muguntha-budget-rule-alert-step2-implementation
category: dm-dashboard
created: 2026-10-12
status: active
---

# Prompt: Muguntha Budget Rule Alert System — Step 2 Implementation

## Purpose
Implement the full backend + frontend of the Muguntha Google Ads Budget Rule Alert System.
Run AFTER Step 1 discovery is complete and schema discrepancies are resolved.

## Inputs Required Before Running This Prompt
- Confirmed ROAS column: `cost` and `conversion_value` in `google_ads.campaign_performance`
- Confirmed currency per account from Step 1 evidence
- Confirmed `cost` is NOT in micros (values are £/€ directly)
- Step 1 discovery evidence file path

## What to Build

### Backend: `backend/app/admin/muguntha_budget_alerts.py`
1. `apply_budget_rule(roas_pct, current_budget, currency)` — pure deterministic function, no DB, no AI
   - Returns: `{recommended_action, recommended_pct, proposed_budget, budget_cap_applied, reason}`
   - ROAS bands (all thresholds inclusive at lower bound):
     - ≥400% → increase_20 (+20%)
     - ≥350% → increase_15 (+15%)
     - ≥300% → increase_10 (+10%)
     - ≥275% → increase_5 (+5%)
     - ≥200% → no_change
     - ≥175% → decrease_5 (-5%)
     - ≥151% → decrease_10 (-10%)
     - [150%, 151%) and exactly 150% → rule_review_required (NOT pause)
     - <150% → pause
   - GBP cap: if currency=="GBP" and current_budget > 150 and rec_pct > 15 → cap to 15%, action = `{action}_capped`

2. `ensure_schema()` — creates `public.muguntha_budget_alerts` table with dedup constraint:
   `UNIQUE INDEX ON (campaign_id) WHERE status='pending'`

3. Rolling 30-day query:
   - JOINs `google_ads.campaigns` + `google_ads.campaign_performance`
   - Filters: `cp.date >= now()-30 days`, `c.status='ENABLED'`
   - HAVING `SUM(cp.cost) > 0`
   - ALL accounts (not just group_name='DM')

4. ROAS = `round(conversion_value / cost * 100, 2)` — percentage form (e.g. 287 = 287%)

5. Telegram notification via `requests.post`, env vars only: `TELEGRAM_BOT_TOKEN`, `MUGUNTHA_TELEGRAM_CHAT_ID`

6. `run_evaluation()` — dedup check before insert (skip if pending alert exists for campaign_id)

7. `ScheduledSnapshot(scope="muguntha-budget-alerts", interval_hours=6)`

8. FastAPI router `prefix="/api/admin/budget-alerts"` — all endpoints protected with `verify_admin_token`:
   - `GET /` — list alerts with status filter
   - `GET /summary` — KPI counts + last evaluation payload
   - `POST /{id}/approve` — idempotent, 409 if already decided
   - `POST /{id}/reject` — idempotent
   - `POST /{id}/dismiss`
   - `POST /run-now` — trigger background evaluation

### Backend: `backend/app/main.py`
Add 4 changes: import, router include, schema init in startup, snapshot start in background sync.

### Frontend: `frontend/src/admin/pages/BudgetAlerts.jsx`
- KPI row: pending / review_required / approved / rejected / dismissed counts
- Status filter tabs
- AlertRow with expand/collapse, action badge, propose budget display
- DecisionModal with optional reason textarea
- Safety notice banner: "Approving records intent only — no budget changes made"
- `GET /api/admin/budget-alerts/summary` + `GET /api/admin/budget-alerts/?status=X`
- `POST /api/admin/budget-alerts/{id}/approve|reject|dismiss`

### Frontend: `frontend/src/admin/AdminLayout.jsx`
- `const BudgetAlerts = lazy(() => import('./pages/BudgetAlerts'))`
- Add nav item with key `budget-alerts` in ADMIN_ITEMS (under Sales & Performance)
- Add `<LazyPanel active={active} panelKey="budget-alerts"><BudgetAlerts /></LazyPanel>`

### Tests: `backend/tests/test_muguntha_budget_alerts.py`
Unit tests for: every ROAS band, all boundary values, exactly 150%, [150%,151%) gap,
zero cost, GBP cap (budget >150 vs ≤150, GBP vs EUR), no_change returns None for pct and proposed_budget.

## Critical Safety Rules (must appear in implementation)
- NEVER write budget changes to Google Ads
- NEVER execute approved recommendations against Google Ads  
- NEVER store tokens/credentials in DB alert records
- NEVER hardcode bot tokens, chat IDs, passwords
- NEVER send notifications during unit tests
- All admin endpoints require `verify_admin_token`

## Key Technical Constraints
- Use `_business_pool` (max_size=4) for all Google Ads queries
- `cost_micros` column values are NOT in micros — identical to `cost` — use `cost` directly
- Dedup via partial unique index, not application-level check alone
- ScheduledSnapshot handles interval enforcement — do not add manual sleep loops
