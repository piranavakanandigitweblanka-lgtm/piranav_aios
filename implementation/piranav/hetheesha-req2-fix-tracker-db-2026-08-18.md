# Implementation — Hetheesha Req 2 Fix Tracker DB Migration

**Date:** 2026-08-18
**Staff:** Hetheesha
**Store:** ledsone.fr
**Dashboard:** dm-dashboard.vintageinterior.co.uk → Requirement 2 (Collection SEO Dashboard)

---

## What Was Built

### Problem
Req 2 Fix Tracker stored "Fixed On" dates in browser localStorage. This meant:
- Dates wiped on browser cache clear
- Dates not visible across devices or logins
- No way to bulk-set historical dates via script
- Inconsistent with Req 1 (which uses Neon DB)

### Solution
Migrated to Neon DB storage using the same pattern as Req 1, plus:
- Added slide-in drawer UI for setting/editing fix dates
- Bulk-set all 96 fixed collection entries with correct historical dates
- Fixed tab refresh bug (page always defaulting to tab 1)
- Fixed drawer overlay CSS (showing inline instead of fixed)

---

## Code Changes

### `api/members-api.js`

**Added:** `handleHetheeshaR2FixSave(req, res)`
```js
// POST: upsert fix date for a collection + field_key
// Creates table hetheesha_fix_tracker_r2 if not exists
// Primary key: (collection_handle, field_key)
```

**Added:** `handleHetheeshaR2FixLoad(req, res)`
```js
// GET: returns all entries as { "handle::field_key": { fix_date, notes } }
// Single DB call — no pagination needed
```

**Added routing:**
```js
if (type === 'r2-fix-save') return handleHetheeshaR2FixSave(req, res);
if (type === 'r2-fix-load') return handleHetheeshaR2FixLoad(req, res);
```

### `pages/hetheesha.html`

**`trk2_init()` — rewritten async:**
```js
async function trk2_init(tracker, fetched_at) {
  const resp = await fetch('/api/members-api?member=hetheesha&type=r2-fix-load');
  const data = await resp.json();
  if (data.ok) _r2FxDBCache = data.entries || {};
  TRK2_DATA = tracker.map(item => {
    const k = item.handle + '::' + item.field_key;
    const dbEntry = _r2FxDBCache[k];
    return { ...item, fix_date: dbEntry ? dbEntry.fix_date : null };
  });
  trk2_render();
}
```

**Drawer HTML:** `#r2FxOverlay` + `#r2FxDrawer` added after tab-panel-2 close

**Drawer JS:** `r2FxOpen(handle, field_key)`, `r2FxClose()`, `r2FxSave()`

**Row HTML updated:** Each row now has "📅 Set Date" or "✏ Edit" button

**CSS added:**
```css
#r2FxOverlay,#r2FxDrawer → position:fixed (same as #hFxOverlay, #hFxDrawer)
```

**Tab restore fix:**
```js
// Moved IIFE after showTab() definition
function showTab(n){ ... }
(function(){
  var m = (location.hash || '').match(/^#t([0-9]+)$/);
  if (m && m[1] !== '1') showTab(Number(m[1]));
})();
```

---

## DB Schema

```sql
CREATE TABLE IF NOT EXISTS public.hetheesha_fix_tracker_r2 (
  collection_handle TEXT NOT NULL,
  field_key TEXT NOT NULL,
  fix_date DATE,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_handle, field_key)
);
```

---

## Req 1 Bulk Load Fix

### Problem
`trk_fetchAllDB()` fired `Promise.all` on 200 simultaneous individual API requests. Many timed out silently → "Not set" shown in Fixed tab despite dates being in DB.

### Fix — API (`members-api.js`)
Added `handleHetheeshaFixLoadAll()` routed as `fix-load-all`:
```js
// Single DB query — returns all hetheesha_fix_tracker rows as flat object
// { "product_handle|issue_type": { fix_started, fix_date, notes } }
```

### Fix — Frontend (`hetheesha.html`)
```js
// BEFORE: 200 simultaneous requests
await Promise.all(toFetch.map(async ({h,iss}) => { fetch(...) }));

// AFTER: 1 request
const r = await fetch('/api/members-api?member=hetheesha&type=fix-load-all');
const d = await r.json();
if (d.ok && d.entries) Object.assign(results, d.entries);
```

---

## Bulk Date Script

```js
// 109 entries total
// has_faq (53)     → fix_date: 2026-08-13
// seo_title (24)   → fix_date: 2026-08-17
// seo_desc (19)    → fix_date: 2026-08-17
// pending (13)     → fix_date: null
// Batches of 10, 300ms delay between batches
// Result: OK:109 FAIL:0
```
