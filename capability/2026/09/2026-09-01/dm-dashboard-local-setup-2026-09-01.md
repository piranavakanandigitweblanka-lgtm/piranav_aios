# Capability — DM Dashboard Local Setup

**Date:** 2026-09-01
**Task:** Set up dm-dashboard locally on Piranav's PC

---

## Capabilities Demonstrated

| Capability | Detail |
|---|---|
| PostgreSQL administration | Reset forgotten superuser password via pg_hba.conf trust bypass, create roles/databases |
| Database restore | `pg_restore` from `.dump` file, verified row counts |
| Python environment management | Install Python 3.13 alongside 3.14, create venv, install packages |
| FastAPI backend setup | Configure `.env`, start uvicorn, verify health endpoint |
| React/Vite frontend setup | `npm install`, fix env vars, start dev server |
| Git repo management | Clone from GitHub, verify structure |
| Bcrypt password management | Generate hashes via Python, update directly in DB |
| Windows service management | `Restart-Service postgresql-x64-18` as Administrator |

## Project Knowledge Gained

- DM Dashboard architecture: React + FastAPI + 2 Postgres connections (local app DB + remote business DB)
- Business DB has hard 10-connection cap — never raise pool size
- Sidebar panels never unmount (CSS toggle, not React mount/unmount)
- Backend must NOT use `--reload` — causes stale responses on this machine
- `jefri.css` is the shared stylesheet for ALL staff modules despite the name
- `taskRegistry.js` is the single source of truth for the grant system
- Port history: 8199 → 8299 → 8499 (zombie socket issues on Windows)
