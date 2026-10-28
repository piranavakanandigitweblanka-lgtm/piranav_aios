---
name: dm-dashboard-page-audit
description: Reusable prompt for auditing any page in the DM Dashboard — traces navigation, components, API endpoints, backend service, SQL queries, data sources, KPI calculations, and risks without modifying code.
metadata:
  type: prompt
  category: discovery
---

# DM Dashboard — Page Audit Prompt

## Purpose
Perform a read-only, evidence-based audit of any page in the DM Dashboard (React 19 + Vite frontend, Python/FastAPI backend, PostgreSQL). Trace the full stack from sidebar navigation entry to rendered UI, including all API endpoints, backend logic, SQL queries, data sources, and KPI formulas.

## Inputs Required
- Page name / sidebar label
- AIOS root path: `C:\Users\PC\Documents\piranav_aios`
- Dashboard path: `C:\Users\PC\Documents\piranav_aios\dm-dashboard`

## Steps

### Phase 1 — Existing AIOS Documentation
Search `piranav_aios/` for existing evidence, capability, and closure files related to the target page. Read before creating anything. Update existing docs instead of duplicating.

### Phase 2 — Locate the Page
1. Find the sidebar section and nav key in `AdminLayout.jsx` (`RAW_ADMIN_ITEMS` array) or `StaffLayout.jsx`.
2. Resolve `toolKey` → component via `taskRegistry.jsx` (`TOOLS` array, `load:` field).
3. Read the component file (`frontend/src/admin/pages/<Component>.jsx` or `dashboard_pages/<Component>.jsx`).
4. Document: tabs, views, KPI cards, filters, date controls, table columns, sort/export controls, pagination, modal/detail panels.

### Phase 3 — Trace Data Flow
For each API call in the component:
1. Record: HTTP method, exact URL pattern, query parameters.
2. Find the FastAPI router in `backend/app/` — check `main.py` for `include_router` and the router file.
3. Read the route handler, service function, and all SQL queries.
4. Identify data sources: `google_ads.*`, `listings.*`, `order_management.*`, `sales_cache.*`, other schemas.
5. Document auth gate: `make_task_auth` vs `make_admin_task_auth`, and which `toolKey` is checked.
6. Identify caching: `ScheduledSnapshot` — scope, table, interval, compute function, read/write flow.

### Phase 4 — KPI Calculations
For every displayed metric, document:
| Metric | Source field(s) | Formula | Date/attribution rule | File:line |

### Phase 5 — Dependencies & Risks
- Other pages using same API or component
- Snapshot table name and refresh interval
- Missing tests, data quality gaps
- Unverified live-server behaviour

### Phase 6 — Deliver Report
Output a structured audit report with all 12 sections defined in the task prompt.

## Key Files
- `frontend/src/admin/AdminLayout.jsx` — sidebar nav definition (`RAW_ADMIN_ITEMS`)
- `frontend/src/taskRegistry.jsx` — toolKey → component mapping
- `frontend/src/admin/pages/<Component>.jsx` — page component
- `frontend/src/lib/apiFetch.js` — auth fetch wrapper
- `backend/app/main.py` — router registration and snapshot startup
- `backend/app/dashboard_pages/<module>.py` — routes + SQL
- `backend/app/core/scheduled_snapshot.py` — caching framework
- `backend/app/core/task_auth.py` — auth dependency factories

## Safety Rules
- Read only — do not edit application source code
- Do not modify DB, credentials, .env, or git history
- Do not mark unverified live-server behaviour as confirmed
