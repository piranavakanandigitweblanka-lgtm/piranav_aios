# Evidence — DM Dashboard Local Setup

**Date:** 2026-09-01
**Task:** Set up dm-dashboard locally on Piranav's PC (covering for Kuberan on leave)

---

## Discovery: Repo

- Repo: `https://github.com/websitetecteam-arch/dm-dashboard`
- Cloned to: `C:\Users\PC\Documents\piranav_aios\dm-dashboard`
- Stack: React + Vite (frontend) + FastAPI + Python 3.13 (backend) + PostgreSQL 18 (local app DB)

## Discovery: PostgreSQL

- PostgreSQL 18 was already installed (pgAdmin 4 present)
- `postgres` password was forgotten — reset via `pg_hba.conf` trust method
- New postgres password set: `postgres123`
- Role created: `dm_dashboard_app` with password from `DATABASE_URL` in `.env`
- Database created: `dm_dashboard` owned by `dm_dashboard_app`

## Discovery: .env File

- Teammate sent `.env` as a handoff document with instructions mixed into the file
- File had to be rewritten — only the actual env vars kept, header text removed
- All keys present: `DATABASE_URL`, `BUSINESS_DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, Shopify tokens (DE/UK/FR), GA4 + GSC service account, `EOD_GITHUB_TOKEN`, `GEMINI_API_KEY`

## Discovery: Python

- Python 3.14 was installed but docs require Python 3.13 (3.14 breaks psycopg/pydantic-core)
- Python 3.13 installed at `C:\Program Files\Python313\`
- venv created and `requirements.txt` installed successfully

## Discovery: Database Restore

- Dump file received: `dm_dashboard_backup_2026-09-01.dump`
- Restored via `pg_restore` using Claude (PGPASSWORD env var method — avoids interactive prompt issue)
- 4 minor ownership warnings (`OWNER TO postgres`) — harmless, data fully restored
- Verified: 15 users in `public.users`

## Discovery: Login

- `piranav` account exists with role `admin`
- Password from dump was unknown (credentials.md not received)
- Password reset via bcrypt hash generated from Python venv: set to `piranav123`
- Login confirmed working at `http://localhost:5199`
