---
name: promotion-automation-phase2a-foundation
description: Phase 2A implementation prompt — safe foundation for Promotion Automation page in DM Dashboard
metadata:
  type: implementation
  project: dm-dashboard
  date: 2026-10-15
  phase: 2A
  status: COMPLETE
---

# Promotion Automation — Phase 2A: Safe Foundation

## Context
Implement the Promotion Automation page foundation after 5 discovery phases (1A–1E).
Financial eligibility gates must remain FAIL-CLOSED (score_is_executable=False, financial_eligibility_status=BLOCKED_MISSING_DATA on all rows).
No promotion execution, price changes, or external writes permitted.

## Pre-requisites
- Read Phase 1A–1E AIOS handover files before touching code
- Re-read policy document Nishani_Promotion_Multi_Channel.docx
- Verify architecture files still exist and match discovery reports

## Files to Create
- `backend/app/dashboard_pages/promotion_automation_db.py` — schema: 5 tables, 4 pre-seeded policy flags
- `backend/app/dashboard_pages/promotion_automation.py` — FastAPI router, 13 endpoints
- `frontend/src/admin/pages/PromotionAutomation.jsx` — React page with 3 tabs

## Files to Modify
- `backend/app/main.py` — import + app.include_router + ensure_promotion_automation_schema in _ensure_schemas
- `frontend/src/taskRegistry.js` — add tools.PromotionAutomation entry to TOOLS array
- `frontend/src/admin/AdminLayout.jsx` — lazy import + ADMIN_ITEMS entry + LazyPanel

## Auth Pattern
- `make_admin_task_auth("tools.PromotionAutomation")` — on APIRouter constructor
- admin role does NOT bypass (only dev does) — per Phase 1C finding
- approve/reject/kill endpoints also check `user.role in ('admin', 'dev')` inside the endpoint

## Financial Safety Rules
- financial_eligibility_status = 'BLOCKED_MISSING_DATA' always on creation
- score_is_executable = False always on creation
- Never compute Section A metrics until Q1-Q7 resolved and code explicitly updated
- Never allow score to override hard financial rejection

## Policy Flags Pre-Seeded
- fast_mover_5_8_mos_discount — CONFLICT_UNRESOLVED
- fast_mover_8plus_mos_discount — CONFLICT_UNRESOLVED
- non_amazon_section_d_points — BLOCKED_PENDING_DECISION
- section_a_financial_gate — BLOCKED_PENDING_DECISION

## Run After Implementation
```bash
python -m py_compile app/dashboard_pages/promotion_automation_db.py
python -m py_compile app/dashboard_pages/promotion_automation.py
python -m py_compile app/main.py
cd frontend && npm run build
```
