# Validation — Staff Monitor Dashboard

**Date:** 2026-08-18
**Task:** Build staff work monitor page

---

## Bugs Found & Fixed

### Bug 1 — Login redirect on page load
**Symptom:** Clicking "Staff Monitor" from piranav.html sidebar immediately redirected to login.html
**Root cause:** `init()` was an IIFE (immediately-invoked) at bottom of `<body>`. It ran synchronously during page parse before the async `fetch('/api/auth?action=session')` in `<head>` had resolved. `window.__dmUser` was `undefined` → `!user` was `true` → redirected to login.
**Fix:** Removed IIFE. Auth guard now calls `window.__dmStart()` after session confirmed. Main script registers `window.__dmStart = init` and checks `window.__dmPending` in case auth fires first.
**Commit:** `aa1179d`

### Bug 2 — Wrong database connection for tracker tables
**Symptom:** `Failed to load summary: relation "public.hetheesha_fix_tracker" does not exist`
**Root cause:** `handleMonitorSummary()` used `DATABASE_URL` (business DB). Both tracker tables live in `AUTH_DATABASE_URL` (auth/tracker DB).
**Fix:** Replaced `monitorClient()` and `monitorAuthClient()` with single `monitorTrackerClient()` using `FEED_TRACKER_DB_URL || AUTH_DATABASE_URL` — matching the pattern used by `handleHetheeshaFixLoadAll()`.
**Commit:** `e9d05c4`

---

## Validation Checks Passed

- [x] Piranav login → monitor page loads, all 12 tabs visible
- [x] Muguntha login → monitor page loads, all 12 tabs visible
- [x] Regular staff login → only own tab visible
- [x] Hetheesha tab Monitor view → Req1 and Req2 progress bars render from DB
- [x] Sajeepan tab Monitor view → Req4 progress bar + chips render from DB
- [x] All Data view → table loads from correct auth DB
- [x] Filters work (status, level, search)
- [x] Export CSV downloads correct data
- [x] Non-tracker staff tabs → info card + Open Dashboard link
- [x] Muguntha sidebar → Staff Monitor link present
- [x] Piranav sidebar → Staff Monitor link present
