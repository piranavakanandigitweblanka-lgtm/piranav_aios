# Evidence: Admin Listing Management Issue Tracker
**Date:** 2026-10-02
**Session:** Build — Admin-only Issue Tracker for Listing Management Tool

---

## What Was Built

Full Admin-only Issue Tracker feature inside the DM Dashboard.

### Backend
- `backend/app/admin/listing_issues.py` — FastAPI router with all endpoints
- `backend/app/core/auth.py` — Added `verify_strict_admin_token` (admin-only, dev denied)
- `backend/app/main.py` — Router registered, `ensure_listing_issues_schema()` added at startup

### Frontend
- `frontend/src/admin/pages/ListingIssues.jsx` — Full page component
- `frontend/src/admin/AdminLayout.jsx` — Sidebar item + panel wired

### Database Tables Created at Startup
- `public.listing_issues`
- `public.listing_issue_attachments`
- `public.listing_issue_history`
- `public.listing_issue_comments`

---

## API Endpoints

All endpoints enforce `verify_strict_admin_token` — admin only, dev and staff get 403.

| Method | Path | Description |
|---|---|---|
| GET | /api/listing-issues/stats | KPI card counts |
| GET | /api/listing-issues/meta/options | Filter dropdown options |
| GET | /api/listing-issues/export/pdf | Filtered list PDF |
| GET | /api/listing-issues | List with search + filters + pagination |
| POST | /api/listing-issues | Create issue (auto-generates LM-NNNN code) |
| GET | /api/listing-issues/{id} | Full detail + attachments + history + comments |
| PUT | /api/listing-issues/{id} | Edit issue fields |
| POST | /api/listing-issues/{id}/status | Status transition with enforcement |
| POST | /api/listing-issues/{id}/comments | Add comment |
| POST | /api/listing-issues/{id}/attachments | Upload file(s) |
| GET | /api/listing-issues/{id}/attachments/{att_id} | Download/view attachment |
| DELETE | /api/listing-issues/{id}/attachments/{att_id} | Delete attachment |
| GET | /api/listing-issues/{id}/export/pdf | Single issue HTML PDF |

---

## Build Verification
- `venv/Scripts/python.exe -c "from app.admin.listing_issues import router, ensure_schema"` → OK
- `npm run build` → ✓ built in 3.78s (no errors, pre-existing warnings only)
- `python-multipart` installed (was missing from venv despite being in requirements.txt)

---

## Authorization Model
- `verify_strict_admin_token` — role must be exactly `"admin"`
- `verify_admin_token` (existing) allows `"admin"` and `"dev"` — NOT used for this feature
- Frontend: only visible in AdminLayout (not DevLayout, not staff layouts)
- Dev/staff cannot reach the page via UI or direct URL — role enforced at every API endpoint

---

## File Storage
- `backend/uploads/listing_issues/{issue_id}/` — created on first upload per issue
- Allowed: PNG, JPG, WebP, GIF, PDF, CSV, XLSX, XLS, DOC, DOCX, TXT, ZIP
- Max size: 20 MB per file
- Files served via authenticated endpoint (re-checks admin token on every access)

---

## PDF Export
- Backend generates HTML string → returns `HTMLResponse`
- Frontend calls `apiFetch(url)`, opens `window.open()`, writes HTML into new tab
- User uses browser print dialog (Ctrl+P → Save as PDF)
- No external Python PDF library required
