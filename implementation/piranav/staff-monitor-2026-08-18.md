# Implementation — Staff Monitor Dashboard

**Date:** 2026-08-18
**Task:** Build staff work monitor page

---

## Files Created

| File | Purpose |
|---|---|
| `Staff-requirements/pages/monitor.html` | New manager monitor page |

## Files Modified

| File | Change |
|---|---|
| `Staff-requirements/api/members-api.js` | Added 4 monitor API handlers + router entry |
| `Staff-requirements/pages/piranav.html` | Added Staff Monitor sidebar link |
| `Staff-requirements/pages/muguntha.html` | Added Staff Monitor sidebar link |

---

## API Endpoints Added (inside members-api.js)

| Endpoint | DB | Returns |
|---|---|---|
| `GET /api/members-api?member=monitor&type=summary` | AUTH_DATABASE_URL | Count summaries for all tracker tables |
| `GET /api/members-api?member=monitor&type=hetheesha-all-r1` | AUTH_DATABASE_URL | All rows from `hetheesha_fix_tracker` |
| `GET /api/members-api?member=monitor&type=hetheesha-all-r2` | AUTH_DATABASE_URL | All rows from `hetheesha_fix_tracker_r2` |
| `GET /api/members-api?member=monitor&type=sajeepan-all` | AUTH_DATABASE_URL | All rows from `feed_optimization_tracker` |

---

## monitor.html Architecture

**Auth guard pattern:**
```
<head> — async fetch session
  → sets window.__dmUser, window.__dmIsAdmin
  → calls window.__dmStart() if defined, else sets window.__dmPending = true

<body script> — defines window.__dmStart = init
  → if window.__dmPending → calls init() immediately
  → else waits for auth guard to call it
```

**Tab visibility logic:**
- `isAdmin = role === 'admin' || staff_key in ['piranav', 'kuberan', 'muguntha']`
- Admin → `visibleStaff = ALL_STAFF` (12 members)
- Regular staff → `visibleStaff = ALL_STAFF.filter(s => s.key === user.staff_key)`

**Staff list (12 members, Jefri + Jakshan excluded):**
Hetheesha, Sajeepan, Sonya, Dilaksi, Kamsi, Muguntha, Thasitha, Theekshy, Thivajini, Sukirtha, Mahima, Kuberan

**Tracker staff views:**
- Monitor view: progress bars + stat chips from summary API
- All Data view: full table from DB with filters + Export CSV
  - Hetheesha: Req1/Req2 switcher, status filter (Fixed/Started/Pending), handle search
  - Sajeepan: Level filter (1/2/3), status filter (Started/Not Started/Sale/No Sale), item ID search

**Non-tracker staff:**
- Info card with role + Open Dashboard link only
