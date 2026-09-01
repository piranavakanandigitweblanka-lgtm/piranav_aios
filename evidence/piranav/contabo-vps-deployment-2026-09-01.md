# Evidence — Contabo VPS Deployment

**Date:** 2026-09-01
**Task:** Deploy dm-dashboard to production Contabo VPS
**Result:** PASS

---

## Evidence of Completion

| Check | Result |
|---|---|
| Dashboard accessible at http://158.220.99.127 | PASS |
| Login works (piranav / piranav123) | PASS |
| All 15 staff users restored from backup | PASS |
| Backend health check: `{"status":"ok"}` | PASS |
| Nginx proxying `/api/` to FastAPI | PASS |
| systemd service auto-starts on reboot | PASS |
| Database restored — 27 tables, 5082+ rows | PASS |
| Staff dashboards loading data | PASS |

---

## Database Row Counts (post-restore)

| Table | Rows |
|---|---|
| sales_cache.staff_order_attribution | 5082 |
| sales_cache.sync_history | 559 |
| sales_cache.historical_snapshots | 360 |
| public.hetheesha_fix_tracker | 200 |
| sales_cache.employee_performance_snapshots | 157 |
| public.hetheesha_fix_tracker_r2 | 109 |
| public.requirement_usage | 62 |
| public.users | 15 |
| public.access_grants | 6 |

---

## Staff Users Confirmed on Server

piranav (admin), muguntha (admin), kuberan (admin), sajeepan, hetheesha, thivajini, thasitha, mahima, sukirtha, jefri, kamsi, sonya, dilaksi, theekshy, dev

---

## Issues Encountered and Resolved

| Issue | Fix |
|---|---|
| `postgresql+psycopg://` URL format rejected by psycopg_pool | Changed to `postgresql://` |
| Port 8499 already in use when starting systemd service | `pkill -f uvicorn` before starting service |
| `permission denied for schema public` | `ALTER SCHEMA public OWNER TO dm_user` |
| pg_dump backup had no INSERT data for users | Restored via `sudo -u postgres psql` (superuser) |
| Frontend still calling localhost after `.env` change | `rm -rf dist && npm run build` |
| scp command not found on Windows | Used FileZilla SFTP to upload backup |
