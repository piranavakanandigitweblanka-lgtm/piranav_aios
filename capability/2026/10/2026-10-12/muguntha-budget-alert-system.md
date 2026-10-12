# Capability: Muguntha Budget Rule Alert System (MUGA-BRAS)

**Date Confirmed:** 2026-10-12  
**Confirmed By:** Piranav  
**Status:** LIVE — 42 campaigns with pending alerts. Next cycle: 2026-11-11  
**Reusable:** YES — pattern applies to any rule-based alert system in dm-dashboard

---

## What It Does

Automatically evaluates Google Ads campaign budget performance against rule-based thresholds every 6 hours. Generates alerts for over/under-spend. Notifies via Telegram and Discord. Expires alerts after 30 days. View-only dashboard for Muguntha (admin).

---

## Where It Lives

| Component | Location |
|---|---|
| Backend module | `backend/app/admin/muguntha_budget_alerts.py` |
| Frontend dashboard | `frontend/src/admin/pages/BudgetAlerts.jsx` |
| Admin nav wiring | `frontend/src/admin/AdminLayout.jsx` (toolKey: `tools.AdminBudgetAlerts`) |
| UAM registry | `taskRegistry.js` → `tools.AdminBudgetAlerts` |
| Tests | `backend/tests/test_muguntha_budget_alerts.py` — 55/55 PASS |

---

## Rule Engine

| ROAS Band | Condition | Alert Type |
|---|---|---|
| < 1.0 | Budget gap > threshold | OVERSPEND |
| 1.0–2.0 | Budget gap > threshold | UNDERSPEND |
| 2.0–4.0 | Budget gap > threshold | REVIEW |
| > 4.0 | No action | — |
| Any | GBP cap breached | CAP_BREACH |

---

## Schedule

- Runs every **6 hours** via `ScheduledSnapshot`
- Startup run on server start
- Dedup index prevents duplicate alerts within same cycle
- Stagger prevents thundering herd

---

## Notifications

- **Telegram:** `TELEGRAM_BOT_TOKEN` + `MUGUNTHA_TELEGRAM_CHAT_ID` env vars
- **Discord:** `DISCORD_BOT_TOKEN` + `MUGUNTHA_DISCORD_CHANNEL_ID` env vars
- Both channels independent — failure in one does not block the other
- Status persisted separately: `notified_telegram`, `notified_discord`

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
- `validation/piranav/muguntha-budget-rule-alert-step2-validation-2026-10-12.md`
