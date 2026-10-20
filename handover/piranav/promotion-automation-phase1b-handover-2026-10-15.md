# Handover: Promotion Automation — Phase 1B

**Date:** 2026-10-15  
**From:** Claude Code (Phase 1B executor)  
**To:** Piranav (approver) + next Claude Code session (Phase 2 executor)  
**Project:** DM Dashboard — Promotion Automation page  
**Status:** PHASE 1B COMPLETE — awaiting Piranav approval before Phase 2

---

## What Was Done in Phase 1B

1. **Git synchronized:** `piranv-work` fast-forward merged from `origin/main` (87 new commits from dev-work and piranav-work merges). No conflicts. Working tree clean.
2. **Full repository mapped:** All folders, files, frontend routing, backend architecture documented.
3. **UAM fully traced:** Complete flow from JWT → middleware → make_task_auth → access_grants → frontend filter. All role types and permission key conventions confirmed.
4. **Data sources re-verified:** All Phase 1 findings confirmed with exact file + line evidence.
5. **New findings (post-merge):** `backend/app/dashboard_pages/shared.py` exists as a shared helper across pages — may be reusable. `dev_tasks/activity_overview/router.py` added in merge — new pattern reference.
6. **All AIOS files saved.**

---

## Current Git State

| Property | Value |
|---|---|
| Branch | `piranv-work` |
| HEAD | `087d807` — Merge branch 'piranv-work' via Dev Tools |
| Remote | `websitetecteam-arch/dm-dashboard` |
| Status | CLEAN — working tree has no uncommitted changes |
| Push required | YES — piranv-work is 107 commits ahead of origin/piranv-work. Push when Piranav instructs. Account: `websitetecteam-arch`. |

---

## Files to Read Before Phase 2

In this order:

1. `evidence/dm-dashboard/promotion-automation-phase1b-discovery-2026-10-15.md` — full findings
2. `backend/app/admin/admin_repeat_customer_products.py` — best reference for admin page pattern
3. `backend/app/admin/muguntha_budget_alerts.py` — rule engine + approval + Discord pattern
4. `backend/app/core/task_auth.py` — UAM auth pattern
5. `backend/app/core/scheduled_snapshot.py` — snapshot scheduling pattern
6. `backend/app/dashboard_pages/dm_campaign.py` — business DB join pattern (Google Ads + orders + listings)
7. `frontend/src/taskRegistry.js` — TOOLS array convention (add new entry here)
8. `frontend/src/admin/AdminLayout.jsx` — nav item + panel render pattern

---

## What is Needed from Piranav Before Phase 2 Can Begin

| # | Decision | Impact |
|---|---|---|
| D1 | Provide policy doc `Nishani_Promotion_Multi_Channel.docx` OR paste the 5 score sections, weights, thresholds, discount ranges, kill conditions | **BLOCKER** — no score engine can be written without this |
| D2 | Identify landed cost / variable fee data source (spreadsheet? separate DB table? manual input?) | **BLOCKER** — cannot enforce financial guardrails |
| D3 | Identify reviews / return rate source | **BLOCKER** — cannot complete 5-section score |
| D4 | Approve one discount range (conflicting values in policy) | Cannot generate promotion briefs |
| D5 | Confirm which platforms in scope for Phase 1 (Google Ads only, or also Amazon, Meta?) | Affects eligibility logic |
| D6 | Who are the approvers? What is the approval SLA? | Affects approval workflow design |
| D7 | Notification via Discord (existing pattern) or email? | Affects Phase 4 build |

---

## Proposed Phase 2 Starting Point (once D1-D4 resolved)

1. Create `promotion_automation` schema in app DB (pattern: jefri_nonmoving schema)
2. Build `ensure_promotion_automation_schema()` → register in `main.py` `_ensure_schemas()`
3. Build qualification score compute function (per confirmed policy)
4. Instantiate ScheduledSnapshot (daily, 2:00 AM Sri Lanka, off-peak)
5. Add backend router: `backend/app/admin/promotion_automation.py`
6. Register in `main.py` (import + `app.include_router()`)
7. Add frontend: `frontend/src/admin/pages/PromotionAutomation.jsx`
8. Add to `taskRegistry.js` TOOLS array: `tools.PromotionAutomation`
9. Add to `AdminLayout.jsx` nav + panel
10. Write tests (target: 40+ tests before browser test)

---

## Risk Reminders for Phase 2

- Business DB is READ-ONLY — all new tables go in the app DB (public or promotion_automation schema)
- Business DB 10-connection cap — new ScheduledSnapshot must register its startup slot
- Single-intent-per-SKU: enforce with DB unique constraint `UNIQUE(sku)` on promotion_intent table, inside a transaction
- All financial guardrails require landed cost data — cannot fake or approximate
- Push to `websitetecteam-arch` account when Piranav instructs
