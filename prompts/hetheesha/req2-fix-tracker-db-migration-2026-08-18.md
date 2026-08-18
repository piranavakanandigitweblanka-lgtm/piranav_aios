# Prompt Capture — Hetheesha Req 2 Fix Tracker — DB Migration & Date Correction
**Rule 12 compliance — permanent GPT prompt capture**
**Date:** 2026-08-18
**Staff:** Hetheesha
**Store:** ledsone.fr (Collections)
**Dashboard:** Staff-requirements / dm-dashboard.vintageinterior.co.uk

---

## Prompt Summary

Migrate Req 2 Fix Tracker from localStorage to Neon DB, add a drawer UI for manually setting fix dates per collection, bulk-set correct historical fix dates, and fix tab persistence on page refresh.

---

## Context

Req 2 Fix Tracker (Collection SEO Dashboard) previously stored "Fixed On" dates in browser localStorage under key `heth_fix_dates_r2_v1`. This caused:
- Data loss on browser cache clear
- No cross-device persistence
- Inability to bulk-set historical dates via script

Req 1 (Product Fix Tracker) already uses Neon DB — Req 2 must match.

---

## Tasks Implemented

### 1 — DB Table
Created `public.hetheesha_fix_tracker_r2` on Neon DB (FEED_TRACKER_DB_URL):
- Primary key: `(collection_handle, field_key)`
- Columns: `fix_date DATE`, `notes TEXT`, `updated_at TIMESTAMPTZ`
- Table auto-created on first API call (CREATE TABLE IF NOT EXISTS)

### 2 — API Endpoints (members-api.js)
- `r2-fix-save` (POST): upsert fix date for a collection+field_key
- `r2-fix-load` (GET): return all fix dates as flat object `{ "handle::field_key": { fix_date, notes } }`
- Routing added: `if (type === 'r2-fix-save')` / `if (type === 'r2-fix-load')`

### 3 — Frontend Migration (hetheesha.html)
- `trk2_init()` now async — loads from DB via `r2-fix-load` before building `TRK2_DATA`
- Added `_r2FxDBCache` in-memory cache (mirrors Req 1's `_hFxDBCache`)
- Row HTML updated: "📅 Set Date" / "✏ Edit" button per row
- Drawer HTML added: `#r2FxOverlay`, `#r2FxDrawer` (slide-in panel, position:fixed)
- Drawer JS: `r2FxOpen()`, `r2FxClose()`, `r2FxSave()`
- CSS fixed: `#r2FxOverlay` and `#r2FxDrawer` share same fixed positioning rules as Req 1 (`#hFxOverlay`, `#hFxDrawer`)

### 4 — Tab Persistence Fix
- Bug: hash restoration IIFE ran before `showTab()` was defined (different `<script>` block)
- Fix: moved IIFE to after `showTab()` definition so it can call it directly
- URL hash `#t2` now correctly restores tab 2 on page refresh

### 5 — Bulk Date Setting
- 109 tracker entries (64 collection handles × 3 fields: seo_title, seo_desc, has_faq)
- `has_faq` (53 entries) → fix_date: 2026-08-13
- `seo_title` + `seo_desc` (43 entries) → fix_date: 2026-08-17
- Pending entries (13) → fix_date: null
- All via live API POST in batches of 10

---

## Execution Notes

- **Existing asset:** Req 1 fix tracker pattern reused (DB, cache, drawer pattern)
- **DB:** FEED_TRACKER_DB_URL (Neon) — same connection as hetheesha_fix_tracker table
- **localStorage key `heth_fix_dates_r2_v1`:** still present in browser but no longer used
- **96 now_fixed entries confirmed** at time of bulk set
- **13 pending entries** correctly have null fix_date

**Status:** PASS
