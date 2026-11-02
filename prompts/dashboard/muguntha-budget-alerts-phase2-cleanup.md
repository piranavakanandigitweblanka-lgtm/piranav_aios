---
name: muguntha-budget-alerts-phase2-cleanup
description: Phase 2 cleanup prompt for Muguntha Budget Alerts — remove Run Evaluation Now button, backend run-now endpoint, and all Telegram notification code.
metadata:
  type: prompt
---

# Prompt: Budget Alerts Phase 2 — Run Now + Telegram Removal

## Context

DM Dashboard — `backend/app/dashboard_pages/muguntha_budget_alerts.py` and `frontend/src/admin/pages/BudgetAlerts.jsx`.

Phase 1 (ROAS rule correction) is already complete. This is Phase 2 cleanup.

## What to Build

Remove the following from the Budget Alerts system:

### 1. Backend: Remove `run-now` endpoint
- Delete `@router.post("/run-now")` and the `run_now()` function (bottom of file)

### 2. Backend: Remove Telegram code
- Delete `_send_telegram()` function
- Delete `_telegram_alert_text()` function
- Remove `ok_tg, err_tg = _send_telegram(...)` call in `run_evaluation()`
- Update the UPDATE SQL in `run_evaluation()` to remove `notified_telegram` and related fields — keep only Discord fields
- Update `notified_at` in UPDATE to use `%(ok_dc)s` instead of `%(ok_tg)s`
- Update module docstring to remove "Telegram" reference

### 3. Frontend: Remove Run Evaluation Now
- Delete `const [runMsg, setRunMsg] = useState('')` state
- Delete `async function runNow()` function
- Delete the `<button onClick={runNow}>Run Evaluation Now</button>` from JSX
- Delete the `{runMsg && ...}` message div below the header

### 4. Tests: Remove Telegram imports and test class
- Remove `_send_telegram` and `_telegram_alert_text` from imports
- Replace `TestNotificationIndependence` class with Discord-only tests (3 tests: ok, missing config, HTTP failure)

## Files to Modify

| File | Change |
|---|---|
| `backend/app/dashboard_pages/muguntha_budget_alerts.py` | Remove Telegram functions + run-now endpoint |
| `frontend/src/admin/pages/BudgetAlerts.jsx` | Remove runNow function, runMsg state, button, message div |
| `backend/tests/test_muguntha_budget_alerts.py` | Remove Telegram imports, replace TestNotificationIndependence |

## Key Constraints

- DB schema: keep `notified_telegram` column in DB (ALTER TABLE not needed — just stop writing to it)
- All existing Discord code, approval/reject/dismiss endpoints, and alert display logic must remain untouched
- 79/79 tests must still pass after change
- No commits or pushes — leave as unstaged working tree changes

## Expected Output

- Test suite: 79 passed (same count — 3 Telegram tests replaced by 3 Discord tests)
- `run-now` POST endpoint no longer exists
- `Run Evaluation Now` button no longer visible in frontend
- Telegram functions no longer exist in module
