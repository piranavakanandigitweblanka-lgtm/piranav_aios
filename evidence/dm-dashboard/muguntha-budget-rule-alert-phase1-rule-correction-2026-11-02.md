---
name: muguntha-budget-rule-alert-phase1-rule-correction-2026-11-02
description: Evidence for Phase 1 rule engine correction of Muguntha Budget Alerts. ROAS bands corrected, below-150% pause removed, conversions gate added. 2026-11-02.
metadata:
  type: evidence
---

# Evidence: Budget Alerts Phase 1 — ROAS Rule Engine Correction

**Date:** 2026-11-02
**Branch:** piranv-work
**Status:** COMPLETE — 79/79 tests PASS

---

## Files Modified

| File | Change |
|---|---|
| `backend/app/dashboard_pages/muguntha_budget_alerts.py` | Rule engine corrected, conversions added to query and Discord message |
| `backend/tests/test_muguntha_budget_alerts.py` | Tests updated and expanded (55 → 79) |

---

## Rule Changes Applied

| ROAS Band | Was | Now | Correct? |
|---|---|---|---|
| 400%+ | increase_20 | increase_20 | ✅ Unchanged |
| 350–399% | increase_15 | **increase_10** | ✅ Fixed |
| 300–349% | increase_10 | **increase_5** | ✅ Fixed |
| 275–299% | increase_5 (always) | **increase_5 only if conversions ≥ 15; else low_conversions_review** | ✅ Fixed |
| 200–274% | no_change | no_change | ✅ Unchanged |
| 175–199% | decrease_5 | decrease_5 | ✅ Unchanged |
| 151–174% | decrease_10 | decrease_10 | ✅ Unchanged |
| Below 150% | **pause** | **decrease_15** | ✅ Fixed |
| Below 150% + prev month ROAS < 275% | not implemented | **decrease_10** | ✅ Added |
| Budget >£150 cap | 15% max on GBP | 15% max on GBP | ✅ Unchanged |

---

## Function Signature Change

```python
# Before
apply_budget_rule(roas_pct, current_budget, currency)

# After
apply_budget_rule(roas_pct, current_budget, currency, conversions_30d=None, prev_month_roas=None)
```

Backward compatible — new args are optional with safe defaults.

---

## Query Change

Added `SUM(cp.conversions) AS conversions_30d` to `_ROLLING_30D_QUERY`.

`conversions` column confirmed present in `google_ads.campaign_performance` (float8).

---

## Schema Change

Added column to `muguntha_budget_alerts` via `ensure_schema()` (backward-compatible `ALTER TABLE ADD COLUMN IF NOT EXISTS`):

```sql
ADD COLUMN IF NOT EXISTS conversions_30d NUMERIC
```

No new tables created.

---

## Discord Message Change

Added to Discord alert:
- Conversions (30d) count
- Previous Month ROAS
- Rule action label

```
📊 **Budget Alert — {campaign_name}**
Group: {group} | Account: {account_id}
ROAS (30d): {roas} | Conversions (30d): {conv} | Prev Month ROAS: {pm_roas}
Budget: {current} → Proposed: {proposed}
Rule: {recommended_action}
{reason}
⏳ Awaiting Muguntha approval — no changes made automatically.
```

---

## Test Results

```
79 passed, 1 warning in 3.92s
```

| Test Class | Tests | Result |
|---|---|---|
| TestRoasHelper | 6 | PASS |
| TestApplyBudgetRule | 38 | PASS |
| TestSendDiscord | 6 | PASS |
| TestDiscordAlertText | 11 | PASS |
| TestNotificationIndependence | 3 | PASS |
| TestAccountCountryMapping | 6 | PASS |
| TestBuildCampaignStatusMap | 9 | PASS |

Pre-existing mock path bug also fixed (`app.admin.muguntha_budget_alerts` → `app.dashboard_pages.muguntha_budget_alerts`).

---

## API Compatibility

- All existing endpoints unchanged: `GET /`, `GET /summary`, `GET /campaign-statuses`, `POST /{id}/approve`, `POST /{id}/reject`, `POST /{id}/dismiss`, `POST /run-now`
- `GET /` response now includes `conversions_30d` field per alert row
- No breaking changes

---

## Not Done (Phase 1 Scope)

- Run Evaluation Now button NOT removed (Phase 2)
- Telegram NOT removed (Phase 2)
- Early budget change monitoring NOT built (Phase 3)
- Scheduler NOT changed (Phase 4)
- No commits or pushes made
