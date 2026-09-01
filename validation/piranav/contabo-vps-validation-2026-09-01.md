# Validation — Contabo VPS Deployment

**Date:** 2026-09-01
**Task:** Validate dm-dashboard is working correctly on Contabo VPS
**Result:** PASS

---

## Validation Checklist

### Infrastructure
- [x] Server running Ubuntu 24.04 LTS
- [x] PostgreSQL 16 installed and running
- [x] Nginx installed and running
- [x] Node.js 20 installed
- [x] Python 3.12 + venv installed

### Backend
- [x] `GET /api/health` returns `{"status":"ok"}`
- [x] Nginx proxies `/api/` correctly to port 8499
- [x] systemd service `dm-dashboard` starts on boot
- [x] `.env` has correct DATABASE_URL, BUSINESS_DATABASE_URL, GEMINI_API_KEY, CORS_ORIGIN

### Frontend
- [x] React app builds successfully (`npm run build`)
- [x] Nginx serves `index.html` from `/var/www/dashboard-dm/frontend/dist`
- [x] `VITE_API_URL` points to `http://158.220.99.127:8499` (not localhost)
- [x] Login page loads at `http://158.220.99.127`

### Database
- [x] `dm_dashboard` database created
- [x] `dm_user` has full privileges on public schema
- [x] Backup restored — all 27 tables present
- [x] 15 staff users restored correctly
- [x] Access grants restored

### Login Test
- [x] piranav / piranav123 — login successful
- [x] sajeepan — login successful after password reset via admin panel
- [x] Admin panel shows all 15 users

---

## Not Yet Validated
- [ ] pgAdmin external access (port 5432 not open)
- [ ] Domain name / SSL (HTTP only, no HTTPS yet)
- [ ] AI assistant for all staff (Gemini API — assumed working, not tested per staff)
- [ ] Google Search Console data for Sukirtha
