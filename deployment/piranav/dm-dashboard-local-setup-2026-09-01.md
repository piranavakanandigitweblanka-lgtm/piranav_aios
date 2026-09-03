# Deployment — DM Dashboard Local Setup

**Date:** 2026-09-01
**Task:** Set up dm-dashboard locally on Piranav's PC
**Environment:** Local dev only (no Vercel/VPS deployment yet)

---

## Runtime

| Service | Command | URL |
|---|---|---|
| Backend | `venv\Scripts\python.exe -m uvicorn app.main:app --port 8499` | http://localhost:8499 |
| Frontend | `npm run dev -- --port 5199` | http://localhost:5199 |

## Working Directory

| Service | Path |
|---|---|
| Backend | `C:\Users\PC\Documents\piranav_aios\dm-dashboard\backend` |
| Frontend | `C:\Users\PC\Documents\piranav_aios\dm-dashboard\frontend` |

## Notes

- Do NOT use `--reload` on backend — causes stale response issues on this project
- Kill and restart backend fully after any `.env` or `.py` change
- If port 8499 is busy: `Get-NetTCPConnection -LocalPort 8499` then `Stop-Process -Force`
- Vite does NOT hot-reload `.env` changes — restart `npm run dev` after editing it
- Production deployment (Contabo VPS) not yet started — see `docs/DEPLOYMENT.md`
