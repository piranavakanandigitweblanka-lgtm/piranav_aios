# Closure — Contabo VPS Deployment

**Date:** 2026-09-01
**Task:** Deploy dm-dashboard to Contabo VPS
**Status:** CLOSED — LIVE

---

## Outcome

DM Dashboard is live at **http://158.220.99.127**

All 15 staff accounts are active. Database is an exact copy of local dev. Backend runs 24/7 via systemd. Nginx serves the frontend and proxies API requests.

---

## What Was Delivered

- Production server running on Contabo VPS Plus 4
- Exact database restore from local dev (pg_dump → FileZilla → psql)
- systemd service for backend auto-restart on reboot
- Nginx config for frontend + API proxy
- All staff can login and use their dashboards

---

## Pending (Not Blocking)

| Item | Priority | Notes |
|---|---|---|
| Domain name + SSL (HTTPS) | Medium | Currently HTTP + IP only |
| pgAdmin external access | Low | Port 5432 not open yet |
| AI assistants for Kamsi, Sonya, Dilaksi, Theekshy | Medium | Skill profile files not received yet |
| Staff passwords — some reset needed | Low | Admin can reset from admin panel |

## Additional Completed (same session)

- GitHub deploy key set up — server authenticates to GitHub via SSH
- Repo cloned from `git@github.com:websitetecteam-arch/dm-dashboard.git`
- Auto-deploy script created at `/var/www/dashboard-dm/deploy.sh`
- Deploy tested and confirmed — "Deploy complete!" in ~30 seconds
- Kuberan onboarded — accessing dashboard live (confirmed via server logs)

---

## Cost

| Item | Cost |
|---|---|
| Contabo Cloud VPS Plus 4 | £12.48/month |
| Railway (cancelled) | £0 |
| Hostinger (cancelled) | £0 |

---

## Lessons Learned

- `pg_dump` on Windows requires full path: `"C:\Program Files\PostgreSQL\18\bin\pg_dump.exe"`
- psycopg_pool uses `postgresql://` not `postgresql+psycopg://` (SQLAlchemy format)
- Always restore backup as postgres superuser — not as app user — to avoid permission errors
- Frontend `.env` must be rebuilt after change: `rm -rf dist && npm run build`
- FileZilla is the easiest way to transfer files from Windows to Linux VPS
