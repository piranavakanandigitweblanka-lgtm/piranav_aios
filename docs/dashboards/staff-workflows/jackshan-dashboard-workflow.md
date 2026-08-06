# Jackshan — Dashboard Live API & Date Range Filter

**Requirement ID:** JACK-R1, JACK-R2  
**Staff owner:** Jackshan  
**Supporting staff:** Piranav  
**Store:** ledsone.co.uk  
**Dashboard:** https://staff-requirements-02.vercel.app (Jackshan tab)  
**Status:** COMPLETED — Live API wired + Date range filter deployed 2026-07-21  
**Last updated:** 2026-07-21

---

## What Was Done

### 1. Live API Wiring (Req 1 + Req 2)

`jakshan.html` was previously showing **hardcoded snapshot data** from ~Jul 14 2026 — never updated automatically.

We replaced `const RAW_DATA = [...]` and `const REQ2_DATA = [...]` (50 hardcoded product rows each) with live API calls that fetch fresh data from the database on every page load.

**Before:**
```js
const RAW_DATA = [ /* 50 hardcoded rows from Jul 14 2026 */ ];
```

**After:**
```js
let RAW_DATA = [];
// populated by loadLive() on page load
```

---

### 2. loadLive() Function

Added `loadLive()` to `jakshan.html` that:
- Fetches `/api/jackshan/dashboard?type=req1` and `?type=req2` in parallel
- Maps API response fields to the format expected by `renderTable()` and `r2Render()`
- Updates all KPI cards dynamically
- Updates info-bar Start Date / End Date / Reporting Period from API `meta`
- Shows a green success banner or red error banner

---

### 3. Date Range Filter

Added date range dropdowns to both tabs:

| Tab | Options | Default |
|-----|---------|---------|
| Req 1 — GSC Keyword Analysis | Last 7 / 14 / 30 / 60 / 90 days + Custom | 90 days |
| Req 2 — SEO Optimization Tracker | Last 7 / 14 / 30 days + Custom | 30 days |

**Custom range:** Selecting "Custom range…" reveals two date pickers (From / To). When both dates are filled, the dashboard re-fetches automatically with the exact custom range.

---

### 4. Info-Bar Live Updates

Previously the info-bar showed hardcoded dates (`2026-06-13` to `2026-07-12`).

Now all date fields update live from the API response:

| Span ID | Content |
|---------|---------|
| `r1-period-label` | `from → to` (e.g. `2026-04-22 → 2026-07-21`) |
| `r1-period-start` | Start date from API meta |
| `r1-period-end` | End date from API meta |
| `r2-period-label` | `from → to` |
| `r2-period-start` | Start date from API meta |
| `r2-period-end` | End date from API meta |

---

## Architecture

```
Browser (jakshan.html)
  │
  └── loadLive()  — called on page load + on date filter change
        │
        ├── fetch /api/jackshan/dashboard?type=req1&days=90
        │         (or &from=YYYY-MM-DD&to=YYYY-MM-DD for custom)
        │
        └── fetch /api/jackshan/dashboard?type=req2&days=30
                  (or &from=YYYY-MM-DD&to=YYYY-MM-DD for custom)

API (Staff-requirements-02/api/jackshan/dashboard.js)
  │
  ├── Req 1 — handleReq1(client, days, fromOverride, toOverride)
  │     ├── google_search_console.page  → page clicks/impressions/CTR/position
  │     ├── google_search_console.query_page → top keyword per product
  │     └── listings.shopify_listings + shopify_listing_meta → meta title/desc/H1
  │
  └── Req 2 — handleReq2(client, days, fromOverride, toOverride)
        ├── google_search_console.page  → page GSC stats (30d)
        ├── order_management.orders + order_item_info → weekly + monthly sales
        └── listings.shopify_listings → product titles
```

---

## Files Changed

| File | Change |
|------|--------|
| `Staff-requirements-02/pages/jakshan.html` | Replaced hardcoded arrays → live API; added loadLive(), date filter dropdowns, custom date pickers, live info-bar span IDs, loading/error banners |
| `Staff-requirements-02/api/jackshan/dashboard.js` | Added `fromOverride`/`toOverride` params; SQL changed from `>= $date` to `BETWEEN $from AND $to`; handler reads `?from` and `?to` query params |

---

## API Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `type` | `req1` or `req2` | Which requirement data to return |
| `days` | integer | Rolling window in days (default: 90 for req1, 30 for req2) |
| `from` | `YYYY-MM-DD` | Custom range start date (overrides `days`) |
| `to` | `YYYY-MM-DD` | Custom range end date (overrides `days`) |

**Priority:** If `from` and `to` are both present, they override `days`.

---

## Database Sources

| Data | Table | Filter |
|------|-------|--------|
| GSC page stats | `google_search_console.page` | `sub_source=104`, `search_type='web'`, `BETWEEN from AND to` |
| GSC keywords | `google_search_console.query_page` | same |
| Meta title / desc / H1 | `listings.shopify_listings` + `listings.shopify_listing_meta` | `sub_source=104`, `is_parent=1` |
| Weekly / monthly sales | `order_management.orders` + `order_item_info` | `sub_source_id=104`, `BETWEEN from AND to` |
| Product titles | `listings.shopify_listings` | `sub_source=104`, `is_parent=1` |

- `sub_source = 104` = ledsone.co.uk
- DB user: `dbhub_readonly` (READ ONLY)
- Connection: `new Client({ connectionString: process.env.DATABASE_URL })`

---

## Business Rules

### Req 1 — Action Classification

| Rule | Action |
|------|--------|
| Page clicks ≥ 1 | Rewrite meta tags + re-optimize keywords |
| 0 clicks AND impressions ≥ 100 | Check intent mismatch before optimizing |
| 0 clicks AND impressions < 100 | Do not optimize |
| No GSC data | Data validation required |

### Req 2 — Optimize Status

| Rule | Status |
|------|--------|
| Monthly sales ≤ 1 AND CTR < 5% | Optimize |
| Monthly sales > 1 OR CTR ≥ 5% | Do Not Optimize |

---

## Commits

| Commit | Description |
|--------|-------------|
| `5247101` | feat: Jackshan dashboard — wire live API (Req 1 + Req 2) |
| `aec6361` | feat: Jackshan dashboard — date range filter (Req 1 + Req 2) |
| `b1f43f9` | feat: Jackshan dashboard — date range filter with custom from/to |

---

## Known Limitations

1. Meta title / desc / H1 comes from `listings.shopify_listing_meta` — this table is ~14% populated for ledsone.co.uk. Products with no row will show empty values.
2. Weekly sales in Req 2 is always "last 7 days before the `to` date" — not configurable separately.
3. DB user is `dbhub_readonly` — no writes possible.
4. Vercel function timeout: 60s (configured in `vercel.json`).
