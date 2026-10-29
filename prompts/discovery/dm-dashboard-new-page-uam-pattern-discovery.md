# Prompt: DM Dashboard — New Page UAM/Auth Pattern Discovery
**Category:** discovery
**First used:** 2026-10-29 (SKU DE Listings page planning)
**Status:** ACTIVE

---

## Purpose

Trace the full implementation pattern of an existing dm-dashboard page so that a new page can be built following the exact same structure. Covers frontend component, navigation registration, backend router, UAM authorization, and DB connection patterns. Discovery only — no code is written.

---

## Prompt Template

```
You are Claude Code working on the dm-dashboard project (React 19 + Vite frontend, Python FastAPI backend). This is a DISCOVERY-ONLY task. You must STOP after discovery and reporting. Do not create the new page, edit application code, change permissions or deploy anything.

**Objective:**
Trace the full implementation pattern of the existing [REFERENCE_PAGE] page so I can build a new page called [NEW_PAGE] following the same structure.

**Reference page to trace:**
- Frontend component: [path to reference .jsx file]
- Task key: [tools.TaskKey]

**New page planned:**
- Name: [New Page Name]
- Purpose: [what it does in one sentence]
- Data source: [DB table / API]
- Expected output: [table / cards / download]

**Discover and document:**
1. Frontend component structure — imports, API calls, state management, auth handling
2. Navigation registration — how the page is added to AdminLayout.jsx and taskRegistry.jsx
3. Backend router file — location, prefix, endpoint(s), UAM gate used
4. Auth factory — which make_task_auth variant is used and why
5. DB connection — which get_*_conn() is used
6. Router registration in main.py — import line and include_router line
7. Blueprint for the new page — exact file paths, toolKey, nav key, SQL pattern, endpoint URL

**Security constraints:**
- Never reveal secrets, API tokens, passwords or environment variable values
- Do not change production data or settings
- STOP after discovery and reporting. Do not create the new page, edit application code, change permissions or deploy anything.

**Output:** Write an AIOS evidence document at evidence/dm-dashboard/[slug]-phase1-discovery-[date].md with all findings structured as a blueprint.
```

---

## Key variables

| Variable | Description | Example |
|---|---|---|
| `REFERENCE_PAGE` | The existing page to trace | SKU Stock Lookup |
| Reference `.jsx` | Frontend component path | `frontend/src/admin/pages/SkuStockLookup.jsx` |
| `NEW_PAGE` | The page being planned | SKU DE Listings |
| DB table | Postgres table(s) to query | `listings.shopify_listings`, `inventory.products` |

---

## Files to read (in order)

1. Reference `.jsx` component
2. `frontend/src/admin/AdminLayout.jsx` — nav registration
3. `frontend/src/taskRegistry.jsx` — toolKey → Component mapping
4. `backend/app/dashboard_pages/[reference_router].py` — backend router
5. `backend/app/core/task_auth.py` — auth factory
6. `backend/app/main.py` — router import + include_router
