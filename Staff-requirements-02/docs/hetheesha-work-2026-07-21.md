# Hetheesha Dashboard — Work Log · 2026-07-21

**Dashboard**: https://staff-requirements-02.vercel.app/pages/hetheesha.html  
**Scope**: Requirement 1 — Product Fix Tracker (ledsone.fr top-50 revenue products)  
**Files changed**: `api/hetheesha/req1.js`, `pages/hetheesha.html`

---

## Features Added

### 1. Fixed Field-Type Filter Buttons (`f511deb`)
Added filter buttons under the **Fixed:** row in the Fix Tracker controls:
- ✅ Meta Title
- ✅ Meta Desc
- ✅ FAQ Schema
- ✅ Alt Text

Clicking any button filters the Fixed section to show only that field type across all products.

---

### 2. Correct CTR · Avg. Position · Custom Date Range in Before/After Panel (`66677b3`)

**CTR fix**: Was using `AVG(ctr)` — now correctly uses `SUM(clicks) / SUM(impressions) * 100`.

**Avg. Position added**: New metric in the before/after comparison table. Lower is better — shown green when it improves (decreases).

**Custom date pickers**: Each "▶ View" expand row inside the Fixed table now has:
- Before From / Before To date inputs
- After From / After To date inputs
- ↻ **Refresh** button that re-fetches `?type=ba` with the custom range

**New API endpoint**: `GET /api/hetheesha/req1?type=ba&handle=<h>&before_from=<d>&before_to=<d>&after_from=<d>&after_to=<d>`  
Returns impressions, clicks, CTR, avg position, and sales for any handle + custom date range.

---

### 3. New Issues Detection (`f8da0fc` + `8b70420`)

**API**: `buildTracker()` now detects fields that were **OK at the Jul 06 2026 baseline but are now missing** in live Shopify data. These are flagged `new_issue: true`.

**UI**: New orange-accented table section — **🆕 New Issues — OK at Jul 06, Broken Now**:
- Shows "Was OK (Jul 06)" value and "Missing now" status
- Orange **🆕 New Issues** filter button in Status row
- KPI card `🆕 New Issues` with live count
- CSV export includes `New Issue` column

*Current live count*: **2 new issues** (alt text added to products without setting alt text).

---

### 4. Tracker Covers ALL Live Top-50 Products (`cce4705`)

**Bug fixed**: Products that entered the revenue top-50 **after the Jul 06 baseline** were completely invisible to the Fix Tracker — they never appeared in Pending or anywhere else.

**Fix**: After processing the SNAPSHOT, the API now loops through the **live top-50 handles** from the DB. Any handle not in the Jul 06 snapshot gets its currently-missing fields added as Pending items.

*Example product now showing*: `applique-murale-et-plafonnier-industriel-2-en-1-m-tal-r-glable` (rank 18 — missing Meta Title, Meta Desc, FAQ Schema, Alt Text).

---

## Bugs Fixed

### Bug Fixes (`ee4dab5`)

| # | Bug | Fix |
|---|-----|-----|
| 1 | `window.R1_BA` was set **after** `trk_init()` — "▶ View" BA panels had no data on first render | Moved `R1_BA` assignment before `trk_init()`; hidden rows no longer eagerly render BA content |
| 2 | "❌ Still Missing" KPI included `new_issue` items — showed 48 when pending section showed 46 | `allPending` now filters `!i.now_fixed && !i.new_issue` — counts match |
| 3 | Fix Tracker button label mixed pending + new issues into one number | Now shows `"46 pending · 2 new"` separately |
| 4 | Pending table showed `"Jul 06 2026"` as Missing Since for products **not in the Jul 06 snapshot** | API marks `in_snapshot: false`; frontend shows `"Not in Jul 06 snapshot"` for those rows |
| 5 | Tracker items not sorted — step-5b products appended at random positions | API now sorts all tracker items by revenue rank before returning |

---

## Current Fix Tracker State (as of 2026-07-21)

| Status | Count |
|--------|-------|
| ✅ Fixed | 74 fields |
| ❌ Still Pending | 46 fields |
| 🆕 New Issues | 2 fields |
| **Total Tracked** | **122 fields** |

**Fix rate**: 60.6% (74 / 122 fields fixed)

---

## Commits Today

| Commit | Type | Summary |
|--------|------|---------|
| `ee4dab5` | fix | 5 tracker bugs (R1_BA order, KPI count, sorting, "Missing Since") |
| `cce4705` | fix | Include live top-50 handles not in Jul 06 snapshot |
| `f8da0fc` | feat | Detect new issues in `buildTracker()` (API) |
| `8b70420` | feat | New Issues section + filter button + KPI card (UI) |
| `66677b3` | feat | Correct CTR, add Avg. Position, custom date range pickers + `?type=ba` endpoint |
| `f511deb` | feat | Fixed field-type filter buttons (Meta Title, Meta Desc, FAQ, Alt Text) |

---

*Deployed to production at 15:24 IST — https://staff-requirements-02.vercel.app*
