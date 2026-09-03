# Capability — DB-Backed Auth System (Staff-requirements-02)
**Date:** 2026-08-10 | **Capability doc written:** 2026-09-03 | **Status:** ACTIVE

---

## Requirement ID
PIRANAV-AUTH-2026-08-10

## What This Capability Does
Replaces hardcoded SHA-256 password hashes with a Neon Postgres–backed authentication system across all 14 dashboards in Staff-requirements-02. Adds an admin session that auto-unlocks all pages. Adds auth overlay and logout button to every page.

## Asset Paths
- `Staff-requirements-02/api/auth.js` — unified login + admin list-users + update-password API
- All 14 HTML pages — auth overlay added (login form shown over page until authenticated)

## Git Commits
- `d1fc7c9` — DB-backed auth across 14 dashboards
- `18888cb` — admin session auto-unlocks all pages

---

## Neon DB Table: `dashboard_credentials`

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL | Primary key |
| `username` | VARCHAR | Staff member username |
| `password_hash` | VARCHAR | bcrypt hash of password |
| `page_key` | VARCHAR | Which page this credential unlocks (e.g. `sajeepan`, `sonya`, `admin`) |
| `role` | VARCHAR | `staff` or `admin` |

---

## Auth API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `POST /api/auth` | POST | Validates username + password for a given `page_key`. Returns `{ success: true }` or error. |
| `GET /api/auth?action=list-users` | GET | Admin only — returns all users |
| `POST /api/auth?action=update-password` | POST | Admin only — updates password for a user |

---

## Page Key Model
Each page has a unique `page_key` that matches credentials in the DB. The login form posts `{ page_key, username, password }` to `/api/auth`. If valid, the page stores an auth token in `sessionStorage`.

**Example page keys:** `sajeepan`, `sonya`, `theekshy`, `thivajini`, `hetheesha`, `jakshan`, `eod`, `eod-ads`, `eod-seo`, `eod-tec`, `organic-revenue`, `seo`, `admin`, `germany`

---

## Admin Session Model
- Admin login page: `Staff-requirements-02/index.html` (`page_key: admin`)
- On successful admin login: sets `sessionStorage.setItem('auth_admin', '1')`
- Every other page checks: `if (sessionStorage.getItem('auth_admin') === '1')` — skips auth overlay and goes directly to the dashboard

---

## How to Add Auth to a New Page
1. Add a `page_key` for the new page in the `dashboard_credentials` Neon table
2. Copy the auth overlay HTML block from any existing page (e.g. `sajeepan.html`)
3. Set the `page_key` value in the overlay's hidden input to match the DB entry
4. Add the auth check JS block from an existing page — it POSTs to `/api/auth` and stores the token on success

---

## How to Add or Change a User Password
- Admin can use the update-password endpoint: `POST /api/auth?action=update-password` with `{ username, new_password, page_key }`
- Changes take effect instantly — no redeploy needed
- New user: INSERT row into `dashboard_credentials` with correct `page_key` and bcrypt hash

---

## Pages with Auth Overlay (as of 2026-08-10)
`eod-ads.html`, `eod-seo.html`, `eod-tec.html`, `eod.html`, `jakshan.html`, `organic-revenue.html`, `sajeepan.html`, `seo.html`, `sonya.html`, `theekshy.html`, `thivajini.html`, `hetheesha.html`, `germany-sales-decline-dashboard/index.html`, `index.html` (admin)

---

## Related Files
- Closure: `closure/piranav/auth-system-2026-08-10.md`
- API source: `Staff-requirements-02/api/auth.js`
