---
name: dm-campaign-phase4-frontend-validation
description: Reusable prompt for Phase 4 frontend integration and functional validation of any DM Dashboard page. Covers local env startup, CORS, KPI formatter trace, auth flow, bug re-verification.
metadata:
  type: prompt
  category: dashboard
---

# Prompt: DM Dashboard — Phase 4 Frontend Integration & Functional Validation

## Purpose
After Phase 3 DB/API verification, validate that the frontend correctly consumes and displays the verified API data. Prove Database → Backend API → Frontend → Dashboard is consistent.

## What to Check

### Local Environment
1. Confirm backend is running (or start: `venv/Scripts/python.exe -m uvicorn app.main:app --port PORT`)
2. Check `CORS_ORIGIN` in backend `.env` — start Vite on matching port (e.g., `npm run dev -- --port 5199`)
3. Run `npm run build` to verify clean compilation (0 errors, 0 warnings)
4. Test CORS preflight: `curl -X OPTIONS -H "Origin: http://localhost:PORT" -I http://127.0.0.1:BACKPORT/api/...`

### Auth Flow
- Understand the JWT payload format: `{sub, role, staff_key}`
- Check `access_grants` table: `SELECT * FROM access_grants WHERE task_key='tools.TASKNAME'`
- Test: admin with access_grants → 200; admin without → 403; role=dev → 200 (auto-bypass)
- Generate test token: `jwt.encode({sub, role, staff_key, exp}, JWT_SECRET, 'HS256')`

### API Integration
- Read `apiFetch` helper — confirms token from `localStorage.get('dm_token')`
- Trace `API_URL` resolution (env var vs fallback port)
- Trace request parameters for each mode (all/custom/partial)
- Call all date ranges with valid token, confirm responses match Phase 3 SQL

### KPI Formatter Trace
- `eur(v)` = `£` + toLocaleString 2dp
- `num(v)` = toLocaleString (locale-dependent)
- `pct(v)` = toFixed(2) + `%`
- Trace every KPI card and table column expected display value

### Functional Logic Trace
- Initial load → `useEffect(() => load(), [])` → mode=all
- Apply button → `load(start, end)` → mode=custom if both set, else all
- Reset → `load('', '')` → mode=all
- Sort logic: verify all sort options
- Filter: client-side or server-side?
- CSV headers and export format
- Pagination logic

## Which Files
- `frontend/src/admin/pages/[PageName].jsx` — main component
- `frontend/src/lib/apiFetch.js` — auth helper
- `frontend/vite.config.js` — check for proxy or port settings
- `backend/.env` — CORS_ORIGIN
- `backend/app/core/task_auth.py` — auth logic

## Expected Output
- Environment startup status (backend + frontend + CORS)
- KPI-by-KPI formatter trace table
- Date range comparison table
- Auth status per user
- Environment issues found
- Bug verification table
- Phase N+1 implementation plan
- Handover note for browser visual testing

## Strict READ-ONLY Rules
No source-code modifications. No database writes. No server modifications. No deployment. No commits or pushes. If browser testing is blocked, report the exact blocker and provide a handover note.
