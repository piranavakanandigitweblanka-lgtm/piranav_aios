# Prompt — Contabo VPS Setup for DM Dashboard

**Date:** 2026-09-01
**Type:** Implementation / DevOps
**Outcome:** PASS — dashboard live at http://158.220.99.127

---

## Context

Deploy the dm-dashboard (React + FastAPI + PostgreSQL) from local Windows dev environment to a Contabo Cloud VPS Plus 4 running Ubuntu 24.04. Engineer has no prior Linux server experience.

---

## Prompt Used

```
I have a React + FastAPI + PostgreSQL dashboard running locally at 
C:\Users\PC\Documents\piranav_aios\dm-dashboard.

I have purchased a Contabo Cloud VPS Plus 4 (Ubuntu 24.04, IP: 158.220.99.127).
I am new to Linux servers. Teach me step by step how to deploy this dashboard 
to the server using PuTTY and FileZilla.

Stack:
- Frontend: React + Vite (port 5199 local)
- Backend: FastAPI + uvicorn (port 8499 local)  
- Database: PostgreSQL (local dm_dashboard DB + remote Neon business DB)
- Tools available: PuTTY (SSH), FileZilla (SFTP)
```

---

## Key Steps in This Session

1. Reinstall Ubuntu 24.04 via Contabo control panel
2. SSH via PuTTY as root
3. Install Python, Node.js 20, PostgreSQL, Nginx via apt
4. Upload project files via FileZilla to `/var/www/dashboard-dm/`
5. Create PostgreSQL user `dm_user` and database `dm_dashboard`
6. Fix `.env` — DATABASE_URL format and CORS_ORIGIN
7. Create Python venv and install requirements
8. Export local DB with pg_dump, upload via FileZilla, restore via psql
9. Fix schema permissions for dm_user
10. Create systemd service for uvicorn auto-restart
11. Build React frontend with `npm run build`
12. Configure Nginx — serve frontend + proxy /api to FastAPI

---

## Errors Encountered (for reuse)

```
postgresql+psycopg:// → use postgresql:// for psycopg_pool
permission denied for schema public → ALTER SCHEMA public OWNER TO dm_user
address already in use → pkill -f uvicorn before systemctl start
Failed to fetch → rm -rf dist && npm run build after .env change
pg_dump not found → "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe"
```

---

## Reusable For

Any FastAPI + React app deployment to a Linux VPS. Pattern is identical regardless of provider (Contabo, Hetzner, DigitalOcean, Hostinger VPS).
