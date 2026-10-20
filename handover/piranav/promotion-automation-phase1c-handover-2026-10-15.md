# Handover: Promotion Automation Phase 1C

**Date:** 2026-10-15
**From:** Claude Code (Phase 1C executor)
**To:** Piranav (approver) + next Claude Code session (Phase 2 executor)
**Project:** DM Dashboard — Promotion Automation page
**Status:** PHASE 1C COMPLETE — awaiting Piranav approval + D1–D4 resolution before Phase 2

---

## What Was Done in Phase 1C

1. Verified the exact `dashboard_pages/` directory and all router modules inside it
2. Read `shared.py` in full — documented purpose and what Promotion Automation will/won't need from it
3. Traced two full worked examples: `dm_campaign.py` (primary reference) and `muguntha_budget_alerts.py` (approval pattern reference)
4. Verified the complete page registration mechanism in `main.py` (import block + `app.include_router()` + startup handler)
5. Verified the frontend: `taskRegistry.js` TOOLS array, `AdminLayout.jsx` ADMIN_ITEMS array and `filterAdminItems()` function, lazy imports, panel renders
6. Read `task_auth.py` in full — confirmed `make_admin_task_auth` is the correct helper and documented exact 403 behavior
7. Read `useGrantedTasks.js` in full — confirmed UAM grant fetch endpoint and resolution logic
8. Confirmed permission key convention: `tools.PromotionAutomation`
9. Produced complete proposed file list and 7-step UAM registration sequence
10. Recommended single-key permission model with role-based endpoint protection

---

## Current Git State

| Property | Value |
|---|---|
| Branch | `piranv-work` |
| HEAD | `087d807` — Merge branch 'piranv-work' via Dev Tools |
| Status | CLEAN — no uncommitted changes |
| Push | Not pushed — 107 commits ahead of `origin/piranv-work` |
| Push when | Piranav instructs — account: `websitetecteam-arch` |

---

## Proposed File List for Phase 2

Read these files FIRST before implementing:

| Priority | File | Why |
|---|---|---|
| 1 | `backend/app/dashboard_pages/dm_campaign.py` | PRIMARY reference — copy this pattern exactly |
| 2 | `backend/app/admin/muguntha_budget_alerts.py` | Approval workflow pattern (pending/approved/rejected) |
| 3 | `backend/app/core/task_auth.py` | Auth helper — `make_admin_task_auth` |
| 4 | `backend/app/core/scheduled_snapshot.py` | Snapshot scheduling — for Day 7/14/30 monitoring |
| 5 | `backend/app/main.py` lines 120–165 | Import pattern to follow exactly |
| 6 | `frontend/src/taskRegistry.js` | Add TOOLS entry here |
| 7 | `frontend/src/admin/AdminLayout.jsx` | Add lazy import + ADMIN_ITEMS entry + panel div |
| 8 | `automation_task/jefri_nonmoving_db.py` | Schema creation pattern (`ensure_schema`) |

## Files to Create

| File | Based on |
|---|---|
| `backend/app/dashboard_pages/promotion_automation.py` | `dm_campaign.py` pattern |
| `backend/app/dashboard_pages/promotion_automation_db.py` | `jefri_nonmoving_db.py` pattern |
| `frontend/src/admin/pages/PromotionAutomation.jsx` | `BudgetAlerts.jsx` pattern (has approval workflow) |

## Existing Files to Modify

| File | Change |
|---|---|
| `backend/app/main.py` | Add import + `app.include_router()` + schema ensure + snapshot start |
| `frontend/src/taskRegistry.js` | Add `tools.PromotionAutomation` to TOOLS array |
| `frontend/src/admin/AdminLayout.jsx` | Add lazy import + ADMIN_ITEMS entry + panel div |

---

## UAM Registration — Exact Steps for Phase 2

1. In `promotion_automation.py`: `router = APIRouter(prefix="/api/admin/promotion-automation", dependencies=[Depends(make_admin_task_auth("tools.PromotionAutomation"))])`
2. In `main.py`: import + `app.include_router(promotion_automation_router)`
3. In `taskRegistry.js` TOOLS: `{ taskKey: 'tools.PromotionAutomation', label: 'Promotion Automation', kind: 'tool', load: () => import('./admin/pages/PromotionAutomation') }`
4. In `AdminLayout.jsx`: lazy import + ADMIN_ITEMS entry (section: 'Sales & Performance' or new section) + panel div
5. Post-deploy: Admin visits UAM → grant `tools.PromotionAutomation` to Piranav and Muguntha rows

---

## Decisions Required Before Phase 2 (All Unchanged)

| # | Decision | Impact |
|---|---|---|
| D1 | Provide `Nishani_Promotion_Multi_Channel.docx` | **BLOCKER** — no score engine without policy |
| D2 | Landed cost / variable fee data source | **BLOCKER** — financial guardrails impossible |
| D3 | Reviews / return rate source | **BLOCKER** — 5-section score incomplete |
| D4 | Approve one discount range | Cannot generate promotion briefs |
| D5 | Platforms in scope for Phase 1 (Google Ads only?) | Scope of eligibility logic |
| D6 | Who are approvers? What is SLA? | Approval workflow design |
| D7 | Notification channel: Discord (existing) or email? | Phase 4 build |

---

## What Phase 2 Can Begin With (Once D1–D4 Resolved)

Phase 2 starting point (from Phase 1B handover, still valid):
1. Create `promotion_automation` schema in app DB
2. Build `ensure_promotion_automation_schema()` → register in `_ensure_schemas()`
3. Build qualification score compute function (per confirmed policy)
4. Instantiate ScheduledSnapshot (daily, off-peak)
5. Add backend router with `make_admin_task_auth("tools.PromotionAutomation")`
6. Register in `main.py`
7. Add frontend: `PromotionAutomation.jsx`
8. Add to `taskRegistry.js` TOOLS + `AdminLayout.jsx` ADMIN_ITEMS
9. Write tests (target 40+ before browser test)
