# Capability Record — Hetheesha Req 2 Fix Tracker DB Migration

- **Title:** Hetheesha Fix Tracker — Req 2 DB Migration + Req 1 Bulk Load Fix
- **Date:** 2026-08-18
- **Member:** Piranav
- **Team:** Digital Marketing Dashboard
- **Task:** Migrate fix date storage from browser localStorage to Neon DB, add edit drawer, bulk-set historical dates, fix tab persistence bug, fix Req 1 "Not set" dates caused by 200 simultaneous API requests
- **Evidence:** evidence/piranav/hetheesha-req2-fix-tracker-db-2026-08-18.md
- **Prompt:** prompts/hetheesha/req2-fix-tracker-db-migration-2026-08-18.md
- **Status:** PASS

---

## Capabilities Delivered

### 1 — DB Table Auto-Creation Pattern
- Used `CREATE TABLE IF NOT EXISTS` inside the API handler so the table is created on first call without a separate migration step
- Pattern reusable for any new tracker that needs a Neon DB table without manual DB setup

### 2 — Bulk-Load API Endpoint (flat object return)
- `r2-fix-load` returns all entries as `{ "handle::field_key": { fix_date, notes } }` in one GET call
- Frontend builds in-memory cache from this — no per-row API calls on render
- Pattern reusable for any multi-row tracker that needs fast page load

### 3 — Async trk_init with DB Fallback
- `trk2_init()` made async — awaits `r2-fix-load` before building display data
- If DB load fails, `_r2FxDBCache = {}` so tracker still renders (graceful degradation)
- Pattern reusable for any tracker migrating from localStorage to DB

### 4 — Slide-in Drawer for Fix Date Entry
- Overlay + drawer HTML injected at body level (outside tab panels)
- `position:fixed` CSS — not affected by parent scroll/overflow
- `r2FxOpen(handle, field_key)` → populates from `TRK2_DATA` cache → saves to DB → updates cache + re-renders
- Pattern reusable for any tracker that needs a manual date-entry UI

### 5 — CSS ID Specificity Rule
- Shared CSS classes (`hFxOverlay`, `hFxDrawer`) do nothing — only ID selectors apply `position:fixed`
- New drawers must always have their own `#idName` CSS rules alongside the shared class
- Lesson: never rely on class-level CSS for positioned overlays when ID-based CSS is the pattern

### 6 — Tab Hash Restoration Timing Fix
- Bug: IIFE that reads `location.hash` and calls `showTab()` must run AFTER `showTab()` is defined
- If they're in separate `<script>` blocks, put IIFE after the function — not before
- Pattern: always define functions before IIFEs that call them in multi-script-block pages

### 8 — Single Bulk-Load Endpoint vs 200 Individual Requests
- `trk_fetchAllDB()` was firing `Promise.all` on 200 simultaneous fetch calls — no batching, no retry
- Many requests timed out silently → rows showed "Not set" in UI despite dates being in DB
- Fix: added `fix-load-all` endpoint (1 DB query, returns all entries as flat object)
- Frontend: `trk_fetchAllDB()` rewritten to 1 fetch call
- Pattern: **any tracker with >20 rows must use a bulk-load endpoint — never individual per-row fetches**

### 7 — Bulk API Script for Fix Date Correction
- Node.js `fetch` script: GET tracker entries → POST fix dates in batches of 10 with 300ms delay
- Handles fixed vs pending split, different dates per field_key
- Pattern: reuse for any future bulk date correction on Hetheesha's trackers

---

## Reusable: YES

Applies to:
- Any new fix tracker on Hetheesha dashboard needing DB-backed dates
- Any other team member tracker using localStorage that needs DB migration
- Tab-based SPA pages needing hash-based tab restoration

---

## Tools Used
- Neon DB (FEED_TRACKER_DB_URL) — PostgreSQL via `pg` Pool
- Vercel CLI (`vercel --prod`) — 4 production deployments
- Node.js fetch — bulk API script
