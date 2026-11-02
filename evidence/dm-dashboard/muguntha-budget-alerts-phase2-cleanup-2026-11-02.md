---
name: muguntha-budget-alerts-phase2-cleanup-2026-11-02
description: Evidence for Phase 2 cleanup of Muguntha Budget Alerts — Run Now button removed, Telegram removed. 2026-11-02.
metadata:
  type: evidence
---

# Evidence: Budget Alerts Phase 2 — Run Now + Telegram Removal

**Date:** 2026-11-02
**Branch:** piranv-work
**Status:** COMPLETE — 79/79 tests PASS

---

## Files Modified

| File | Change |
|---|---|
| `backend/app/dashboard_pages/muguntha_budget_alerts.py` | Removed `_send_telegram()`, `_telegram_alert_text()`, `@router.post("/run-now")`, updated `run_evaluation()` notification block |
| `frontend/src/admin/pages/BudgetAlerts.jsx` | Removed `runNow()`, `runMsg` state, Run Evaluation Now button, runMsg display div |
| `backend/tests/test_muguntha_budget_alerts.py` | Removed `_send_telegram`/`_telegram_alert_text` imports, replaced `TestNotificationIndependence` with 3 Discord-only tests |

---

## What Was Removed

### Backend

| Item | Location | Reason |
|---|---|---|
| `_send_telegram()` | Lines 331–346 (before removal) | Telegram not used — Discord only |
| `_telegram_alert_text()` | Lines 349–362 (before removal) | Telegram not used |
| `ok_tg, err_tg = _send_telegram(...)` call | In `run_evaluation()` notification block | Telegram removed |
| `notified_telegram` field in UPDATE SQL | In `run_evaluation()` | Telegram removed |
| `@router.post("/run-now")` endpoint | Lines 797–804 (before removal) | Piranav: "I don't need Run Evaluation Now" |
| "Telegram" in module docstring | Line 5 | Updated to "Discord only" |

### Frontend

| Item | Reason |
|---|---|
| `const [runMsg, setRunMsg] = useState('')` | Unused after button removed |
| `async function runNow()` | Button removed — function unused |
| `<button onClick={runNow}>Run Evaluation Now</button>` | Piranav: remove this button |
| `{runMsg && <div>...</div>}` | State removed — div unused |

---

## What Was Preserved

- All Discord notification code (`_send_discord`, `_discord_alert_text`)
- `notified_at` UPDATE — now set based on `ok_dc` (Discord) instead of `ok_tg`
- `notified_telegram` DB column — left in schema (no ALTER TABLE needed, just no longer written)
- All approval/reject/dismiss/list endpoints unchanged
- Frontend alert table, filters, decision buttons unchanged

---

## Test Results

```
79 passed, 1 warning in 3.41s
```

Same test count — 3 Telegram independence tests replaced with 3 Discord tests.

---

## Not Done (Later Phases)

- Phase 3: Early budget change monitoring via `google_ads_change_events`
- Phase 4: Monthly trigger (run on 29th–3rd of month, not every 6 hours)
- No commits or pushes made
