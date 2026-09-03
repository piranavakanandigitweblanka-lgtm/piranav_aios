# Validation — DM Dashboard Local Setup

**Date:** 2026-09-01
**Task:** Set up dm-dashboard locally on Piranav's PC

---

## Validation Checks

| Check | Result |
|---|---|
| PostgreSQL 18 running | PASS — `psql (PostgreSQL) 18.6` confirmed |
| `dm_dashboard` database exists | PASS — created and owned by `dm_dashboard_app` |
| Dump restored | PASS — 15 users in `public.users`, no data errors |
| Backend starts | PASS — `Application startup complete` on port 8499 |
| Health check | PASS — `http://localhost:8499/api/health` returns `{"status":"ok"}` |
| Frontend starts | PASS — Vite running on port 5199 |
| Login works | PASS — `piranav` / `piranav123` logs in as admin |
| Backend connected | PASS — `POST /api/auth/login 200 OK` in uvicorn logs |
| Business DB reachable | PASS — backend started without BUSINESS_DATABASE_URL errors |

## Known Gaps

| Item | Status |
|---|---|
| `credentials.md` | Not received — staff passwords unknown |
| Other staff logins | Cannot verify until credentials.md received |
| `.dump` ownership warnings | 4 harmless `OWNER TO postgres` warnings — no data impact |
