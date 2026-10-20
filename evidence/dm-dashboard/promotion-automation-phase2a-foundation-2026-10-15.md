# Evidence: Promotion Automation Phase 2A Foundation

**Date:** 2026-10-15
**Phase:** 2A — Safe Foundation Implementation
**Branch:** piranv-work
**HEAD before:** 087d807
**Commit:** 957c79badb9ce66c3d8ccf20a9bc24d839fa88a4
**Status:** COMMITTED — awaiting UAM grant and browser verification

---

## Git Preflight

| Check | Result |
|---|---|
| Branch | piranv-work ✓ |
| Working tree before | CLEAN ✓ |
| 107-commit-ahead condition | CONFIRMED — unchanged from Phase 1B |
| Merge needed | NO — already merged origin/main in Phase 1B |

---

## Files Created

### `backend/app/dashboard_pages/promotion_automation_db.py`
- `ensure_promotion_automation_schema()` function — called from main.py `_ensure_schemas`
- Creates 5 tables: `promotion_briefs`, `promotion_approvals`, `promotion_monitoring`, `promotion_sku_exclusions`, `promotion_policy_flags`
- Partial unique index on `promotion_briefs (sku, channel)` WHERE approval_status NOT IN ('rejected','killed','expired') — enforces one active intent per SKU per channel
- Pre-seeds 4 policy flags with INSERT ... ON CONFLICT DO NOTHING (safe on every restart)
- Exports `VALID_INTENTS` (5 policy intents) and `VALID_CHANNELS` (5 channels) for use by router

### `backend/app/dashboard_pages/promotion_automation.py`
- FastAPI router: prefix `/api/admin/promotion-automation`, auth `make_admin_task_auth("tools.PromotionAutomation")`
- 13 endpoints: GET /status, GET/POST /briefs, GET /briefs/{id}, POST /briefs/{id}/{submit|approve|reject|kill}, GET/POST /exclusions, GET /policy-flags, GET/POST /monitoring/{brief_id}, GET /intents
- Approve/reject/kill: additional role check `user.role in ('admin', 'dev')` inside endpoint — backend enforces regardless of frontend visibility
- financial_eligibility_status hardcoded to 'BLOCKED_MISSING_DATA' on every POST /briefs
- score_is_executable hardcoded to False on every POST /briefs
- No promotion execution, price changes, or external writes

### `frontend/src/admin/pages/PromotionAutomation.jsx`
- Financial blocker banner always visible (calls GET /status on load)
- Policy flags panel — shows CONFLICT_UNRESOLVED and BLOCKED_PENDING_DECISION flags
- Briefs table with columns: SKU, Channel, Intent, Status, Financial Gate, Score, Owner, Created
- BriefForm — creates draft briefs with all required fields
- BriefDetail — inline expand with approval history + monitoring records
- Action buttons: Submit (any), Approve/Reject (admin/dev only), Kill (admin/dev only) — role-gated in UI
- SKU Exclusions tab
- Policy Flags tab
- Uses `apiFetch` from existing `../../lib/apiFetch` (matches existing pattern)

---

## Files Modified

### `backend/app/main.py`
Added at existing import block (after muguntha_budget_alerts imports):
```python
from .dashboard_pages.promotion_automation import router as promotion_automation_router
from .dashboard_pages.promotion_automation_db import ensure_promotion_automation_schema
```
Added in `include_router` section (after muguntha_budget_alerts_router):
```python
app.include_router(promotion_automation_router)
```
Added in `_ensure_schemas` (before seo_skills):
```python
try:
    ensure_promotion_automation_schema()
except Exception as e:
    print(f"WARNING: promotion_automation schema init failed...")
```

### `frontend/src/taskRegistry.js`
Added to TOOLS array after `tools.AdminBudgetAlerts`:
```js
{ taskKey: 'tools.PromotionAutomation', label: 'Promotion Automation', kind: 'tool', load: () => import('./admin/pages/PromotionAutomation') }
```

### `frontend/src/admin/AdminLayout.jsx`
- Added lazy import: `const PromotionAutomation = lazy(() => import('./pages/PromotionAutomation'))`
- Added ADMIN_ITEMS entry after budget-alerts (key: 'promotion-automation', toolKey: 'tools.PromotionAutomation')
- Added LazyPanel after BudgetAlerts panel: `<LazyPanel active={active} panelKey="promotion-automation"><PromotionAutomation role={user?.role} staffKey={user?.staff_key} /></LazyPanel>`

---

## DB Tables

| Table | Purpose |
|---|---|
| promotion_briefs | Core brief record — SKU, channel, intent, justification, status, financial gate |
| promotion_approvals | Audit log of every approval action |
| promotion_monitoring | Day 7/14/30 check records |
| promotion_sku_exclusions | Permanent and temporary SKU exclusions |
| promotion_policy_flags | Unresolved policy conflicts pre-seeded |

---

## Policy Rules Implemented (Non-Financial)

- One active intent per SKU per channel (DB partial unique index + Python pre-check for clear error)
- 5 valid intents enforced at creation (Pydantic validator)
- 5 valid channels enforced at creation
- Draft → submitted → approved/rejected workflow
- active → killed with 30-day cool-off timestamp
- Admin/dev only for approve, reject, kill (endpoint-level role check)
- Day 7/14/30 monitoring structure
- SKU exclusion check on brief creation
- Policy flags pre-seeded and visible in UI

## Policy Rules Blocked (Financial)

| Rule | Blocked By |
|---|---|
| A1: post-promo net contribution ≥£2 | Q1/Q2/Q3 — landed cost source unconfirmed |
| A2: gross margin ≥25% | Q1/Q2/Q3 |
| A3: cost stability ±5% | Q1/Q2/Q3 |
| A4: return rate ≤ category avg | Q5/Q7 — Amazon refund_rate acceptability unconfirmed |
| C2: review base | Q4 — review source not identified |
| Fast mover discounts (5-8 MOS) | D4a — conflict: 0-8% vs 0% |
| Fast mover discounts (>8 MOS) | D4b — conflict: 5-12% vs 5-8% |
| Non-Amazon Section D points | D5 — not in policy document |

---

## Syntax Checks

```
python -m py_compile app/dashboard_pages/promotion_automation_db.py → OK
python -m py_compile app/dashboard_pages/promotion_automation.py → OK
python -m py_compile app/main.py → OK
npm run build → ✓ built in 3.79s (no errors, no warnings)
```

Build output included PromotionAutomation as a lazy-loaded chunk (separate .js file, not bundled into main).

---

## Financial Gate Confirmation

- Every POST /briefs sets `financial_eligibility_status='BLOCKED_MISSING_DATA'` — hardcoded, no code path bypasses this
- Every POST /briefs sets `score_is_executable=False` — hardcoded
- GET /status always returns `financialEligibilityBlocked: true` and `scoreIsExecutable: false`
- Frontend always shows financial blocker banner when page loads
- No Section A score calculation exists in this codebase — the columns exist in the schema to receive future values only

---

## Next Steps for Piranav

1. **Grant UAM access:** Insert `access_grants` row for `tools.PromotionAutomation` for Piranav and Muguntha staff keys
2. **Commit:** `git add` the 6 files (3 new + 3 modified) and commit on `piranv-work`
3. **Push when ready:** select account `websitetecteam-arch`
4. **Answer Q1–Q7** (financial data source decisions) — then Phase 2B can implement Section A scoring
