# Evidence — Staff Monitor Dashboard

**Date:** 2026-08-18
**Task:** Build staff work monitor page

---

## Discovery: Staff with Fix Trackers

Scanned all pages in `Staff-requirements/pages/` and `api/members-api.js`.

| Staff | Tracker | DB Table | What It Tracks |
|---|---|---|---|
| Hetheesha | Fix Tracker Req 1 | `public.hetheesha_fix_tracker` | product_handle, issue_type, fix_started, fix_date, notes |
| Hetheesha | Fix Tracker Req 2 | `public.hetheesha_fix_tracker_r2` | collection_handle, field_key, fix_started, fix_date, notes |
| Sajeepan | Feed Optimisation Tracker Req 4 | `public.feed_optimization_tracker` | product_item_id, campaign_id, level, optimization_started, start_date, notes, sale_received |
| Jefri | Image Update Tracker Req 6 | `public.jefri_req6_tracker` | Manual DE listing tracker (excluded per requirement) |

## Discovery: DB Connection Mapping

Both tracker tables live in `AUTH_DATABASE_URL` (or `FEED_TRACKER_DB_URL`), **not** `DATABASE_URL`.
- Confirmed via `handleHetheeshaFixLoadAll()` at line 1579 — uses `FEED_TRACKER_DB_URL || AUTH_DATABASE_URL`
- Confirmed via Sajeepan req4 load at line 1280 — uses `authConnStr`

## Discovery: Vercel Function Limit

Already at **12 functions** (Hobby plan hard limit):
`auth.js, members-api.js, sales.js, salesuk.js, sales25.js, salesde25.js, requirement.js, muguntha.js, assign-order.js, staff-id-performance.js, intel-api.js, generate-staff-attribution.js`

Solution: add monitor endpoints inside existing `members-api.js`.

## Discovery: Auth Pattern

- Auth guard in `<head>` sets `window.__dmUser` asynchronously via fetch
- Main page scripts at bottom of `<body>` cannot safely read `window.__dmUser` synchronously
- Race condition: init() running before auth fetch completes → `window.__dmUser` undefined → redirect to login

## Discovery: Admin Users

- Piranav: `staff_key === 'piranav'`
- Kuberan: `role === 'admin'`
- Muguntha: `staff_key === 'muguntha'` (confirmed by user in session)
