# Evidence — DM Dashboard System Discovery

**Task:** Full system discovery audit (read-only)
**Date:** 2026-10-06
**Status:** PASS
**Git commit:** N/A — read-only discovery, no code changes

---

## What Was Inspected

### AIOS Files Read
- `closure/README.md` (last 100 lines)
- `source-map/README.md`
- `PROMPT_REGISTER.md` (first 30 lines + last 20 lines)
- `docs/dm-dashboard-dev-knowledge.md` (full)
- `docs/dm-dashboard/dm-dashboard-gpt-brief-2026-09-25.md` (full)
- `docs/dm-dashboard/ads-product-scope-level4c-design-2026-09-25.md` (full)
- `capability/piranav/ads-product-scope-admin-page.md` (first 30 lines)
- `docs/dm-dashboard/` folder listing
- `evidence/dm-dashboard/` folder listing
- `capability/piranav/` folder listing

### Code Files Read
- `dm-dashboard/backend/app/main.py` (full — 354 lines)
- `dm-dashboard/backend/app/admin/admin_conduit_sold.py` (full — 474 lines)
- `dm-dashboard/backend/app/admin/admin_conduit_stock.py` (full — 358 lines)
- `dm-dashboard/frontend/src/admin/pages/ConduitSold.jsx` (full — 777 lines)
- `dm-dashboard/frontend/src/admin/AdminLayout.jsx` (first 100 lines — imports + nav)

### Commands Run
- `git remote -v` (dm-dashboard) → `websitetecteam-arch/dm-dashboard`
- `git branch -a` (dm-dashboard) → `piranv-work` active
- `git log --oneline -20` (dm-dashboard) → latest commit `5e243b2`
- `git status` (dm-dashboard) → clean working tree

### Glob Searches
- `backend/app/**/*.py` → 268+ files (full backend structure mapped)
- `frontend/src/admin/**/*.jsx` → all admin page components listed
- `**/*conduit*` → found `admin_conduit_sold.py`, `admin_conduit_stock.py`, `ConduitSold.jsx`
- `docs/**/*` → full docs structure
- `capability/**/*` → full capability structure

---

## Key Findings

| Finding | Detail |
|---|---|
| Backend refactored to subdirs | `backend/app/admin/`, `core/`, `staff_pages/`, `sales/`, `ai_chat/`, `automation_task/`, `dev_tasks/` — NOT reflected in `docs/dm-dashboard-dev-knowledge.md` |
| New pages since Sep 2026 docs | Conduit Sold, Conduit Stock, Listing Issues, AdsProductScope (was design-only) |
| Global login middleware added | 2026-10-01, `main.py` — all routes require JWT except `/api/auth/login` and `/api/health` |
| apiFetch.js added | 2026-10-01 — shared auth-attaching fetch wrapper; previously only 19/106 calls had auth headers |
| Conduit Sold pattern | ScheduledSnapshot (12h), Postgres-stored, Shopify UK GraphQL scan (~1–3 min) |
| Conduit Stock pattern | In-memory 5-min cache, pure PostgreSQL, 3 queries, sub-second |
| Merge conflict in closure README | `closure/README.md` lines 1609–1661 — unresolved `<<<<<<< HEAD` / `>>>>>>>` markers |
| Stale capability file path | `capability/piranav/ads-product-scope-admin-page.md` has wrong path for backend file |
| Conduit Sold date hardcoded | `PHASE1_END = date(2026, 9, 30)` — Oct 2026+ data requires code change |

---

## File Counts

| Area | Count |
|---|---|
| Backend Python files | 268+ (including automation_task sub-files) |
| Frontend JSX files | 40+ admin pages + 11 staff modules + shared components |
| AIOS docs/dm-dashboard files | 8 existing + 1 new (this discovery) |
| Evidence/dm-dashboard files | 6 existing + 1 new (this file) |

---

## Discovery Output Files Created

| File | Purpose |
|---|---|
| `docs/dm-dashboard/system-discovery-2026-10-06.md` | Full 20-section architecture report |
| `evidence/dm-dashboard/system-discovery-2026-10-06.md` | This file |
| `validation/piranav/dm-dashboard-discovery-validation-2026-10-06.md` | Section-by-section pass/fail checklist |

---

## Blockers Found

1. **Merge conflict in `closure/README.md`** — must be resolved before next `git commit` in `piranav_aios` root
2. No code blockers — all existing code is functional, working tree is clean
