---
name: jackshan-r1-r2-live-api-closure-2026-07-21
description: AIOS closure evidence for JACK-R1 and JACK-R2 live API wiring and date-range filter — 2026-07-21
metadata:
  type: project
---

# Jackshan — JACK-R1 and JACK-R2 — Live API Closure

**Requirement IDs:** JACK-R1, JACK-R2  
**Staff Owner:** Jackshan  
**Supporting Staff / Reviewer:** Piranav  
**Store:** ledsone.co.uk  
**Dashboard:** https://staff-requirements-02.vercel.app (Jackshan tab)  
**Completion Date:** 2026-07-21  
**Status:** COMPLETED  
**JACK-R1:** PASS  
**JACK-R2:** PASS  

---

## Business Question

Can Jackshan use the dashboard to view current Req 1 and Req 2 data from the live PostgreSQL-backed API for a selected rolling or custom date range, instead of relying on the hardcoded July 2026 snapshot?

**Answer:** YES — as of 2026-07-21 both requirements fetch live data on every page load. The date range is selectable via dropdown or custom from/to date picker. The info-bar Start Date, End Date, and Reporting Period all update from the API response.

---

## Existing Asset Search — Pre-Change

| Location Checked | Matching Asset Found | Decision |
|-----------------|---------------------|----------|
| `evidence/Jackshan/requirement-1/existing-assets-discovery.md` | YES — prior asset search for R1 | EXTEND |
| `evidence/Jackshan/requirement-1/date-range-validation.md` | YES — prior date range doc for R1 | EXTEND (new epoch) |
| `handover/Jackshan/requirement-1-handover.md` | YES — R1 handover from 2026-07-13 | EXTEND |
| `handover/Jackshan/requirement-2-handover.md` | YES — R2 handover from 2026-07-13 | EXTEND |
| `docs/jackshan-dashboard-workflow.md` | YES — workflow created same session | CANONICAL DOC |
| `Staff-requirements-02/pages/jakshan.html` | YES — active dashboard file | CODE ONLY (not docs) |
| `Staff-requirements-02/api/jackshan/dashboard.js` | YES — active API file | CODE ONLY (not docs) |
| `evidence/Jackshan/requirement-1/backups/` | YES — 6 HTML backups | NO ACTION (historical) |
| Daily log for 2026-07-21 | NOT FOUND — no prior entry | CREATE |
| Capability file for live dashboard pattern | NOT FOUND in Jackshan folder | CANDIDATE ONLY |

**Duplicate-Risk Result: GREEN** — No two files claim to be the canonical JACK-R1/JACK-R2 requirement record. The prior handover files cover the 2026-07-13 hardcoded build. This file covers the 2026-07-21 live API extension. No conflict.

---

## Commits — Verified from Local Git History

| Commit | Date | Author | Files Changed | Status |
|--------|------|--------|---------------|--------|
| `5247101` | 2026-07-21 09:12 +0530 | Piranav | `Staff-requirements-02/pages/jakshan.html` (+103 lines) | **VERIFIED** |
| `aec6361` | 2026-07-21 09:15 +0530 | Piranav | `Staff-requirements-02/pages/jakshan.html` (+18 lines) | **VERIFIED** |
| `b1f43f9` | 2026-07-21 09:23 +0530 | Piranav | `Staff-requirements-02/pages/jakshan.html` (+75), `Staff-requirements-02/api/jackshan/dashboard.js` (+281) | **VERIFIED** |

All three commits exist in `git log`. File changes match supplied completion report.

---

## Code Inspection — Verified Claims

| Claim | Verification Method | Result |
|-------|-------------------|--------|
| Hardcoded `RAW_DATA` array removed as active source | `grep "let RAW_DATA = \[\]"` → line 267 of jakshan.html | **VERIFIED** |
| Hardcoded `REQ2_DATA` array removed as active source | `grep "let REQ2_DATA = \[\]"` → line 554 of jakshan.html | **VERIFIED** |
| `loadLive()` fetches both req1 and req2 | `grep "fetch.*req1\|fetch.*req2"` → lines 450-451 | **VERIFIED** |
| Req 1 default 90 days | `buildApiUrl` returns `&days=90` from `r1-days-filter` default `value="90"` (line 189) | **VERIFIED** |
| Req 2 default 30 days | `buildApiUrl` returns `&days=30` from `r2-days-filter` default `value="30"` (line 750) | **VERIFIED** |
| Custom from/to overrides days | `buildApiUrl()` returns `?from=&to=` when `days==='custom'` — lines 426-430 | **VERIFIED** |
| Info-bar dates updated from API meta | Lines 491-493, 525-527 set `r1-period-start`, `r1-period-end`, `r2-period-start`, `r2-period-end` | **VERIFIED** |
| Req 1 and Req 2 mapping functions exist | `res1.products.map(r=>({...}))` line ~460; `res2.products.map(r=>{...})` line ~505 | **VERIFIED** |
| Loading states exist | `showBanner('live-banner-r1','⏳ Loading...')` called before fetch | **VERIFIED** |
| Error handling exists | `catch(e)` block + API error banners on lines 498, 532, 534 | **VERIFIED** |
| API `fromOverride`/`toOverride` added | `dashboard.js` lines 81-88, 167-176 | **VERIFIED** |
| SQL uses `BETWEEN` not `>=` | `dashboard.js` lines 102, 117, 194, 209 | **VERIFIED** |
| `vercel.json` `maxDuration: 60` | Read `Staff-requirements-02/vercel.json` — `"maxDuration": 60` confirmed | **VERIFIED** |

---

## Architecture Summary

```
Browser (jakshan.html)
  │
  └── loadLive() — on page load + on date filter change
        │
        ├── buildApiUrl('req1', ...) → /api/jackshan/dashboard?type=req1&days=90
        │     OR ?from=YYYY-MM-DD&to=YYYY-MM-DD (custom)
        │
        └── buildApiUrl('req2', ...) → /api/jackshan/dashboard?type=req2&days=30
              OR ?from=YYYY-MM-DD&to=YYYY-MM-DD (custom)

API (Staff-requirements-02/api/jackshan/dashboard.js)
  │
  ├── handleReq1(client, days, fromOverride, toOverride)
  │     ├── google_search_console.page  (BETWEEN from AND to)
  │     ├── google_search_console.query_page  (BETWEEN from AND to)
  │     └── listings.shopify_listings + shopify_listing_meta
  │
  └── handleReq2(client, days, fromOverride, toOverride)
        ├── google_search_console.page  (BETWEEN from AND to)
        ├── order_management.orders + order_item_info  (BETWEEN from AND to)
        └── listings.shopify_listings
```

---

## Source-to-Output Mapping — JACK-R1

| Dashboard Output | DB Table | Filter |
|-----------------|----------|--------|
| Page Impressions / Clicks / CTR / Position | `google_search_console.page` | `sub_source=104`, `search_type='web'`, `BETWEEN from AND to` |
| Priority Keyword | `google_search_console.query_page` | same + top by clicks then impressions |
| Meta Title | `listings.shopify_listing_meta` | `sub_source=104`, `is_parent=1` |
| Meta Description | `listings.shopify_listing_meta` | same |
| H1 | `listings.shopify_listings` (`title` column) | same |
| Recommended Action | Computed client-side from clicks + impressions | see Business Rules |

## Source-to-Output Mapping — JACK-R2

| Dashboard Output | DB Table | Filter |
|-----------------|----------|--------|
| GSC Clicks / Impressions / CTR / Position | `google_search_console.page` | `sub_source=104`, `search_type='web'`, `BETWEEN from AND to` |
| Weekly Sales | `order_management.orders` + `order_item_info` | `sub_source_id=104`, last 7 days before `to` date |
| Monthly Sales | `order_management.orders` + `order_item_info` | `sub_source_id=104`, `BETWEEN from AND to` |
| Product Title | `listings.shopify_listings` | `sub_source=104`, `is_parent=1` |
| Optimize Status | Computed client-side from monthly sales + CTR | see Business Rules |

---

## Business Rules — DO NOT CHANGE

### JACK-R1 Action Classification

| Condition | Action |
|-----------|--------|
| Page clicks ≥ 1 | Rewrite meta tags + re-optimize keywords |
| Page clicks = 0 AND impressions ≥ 100 | Check intent mismatch before optimizing |
| Page clicks = 0 AND impressions < 100 | Do not optimize |
| No GSC data | Data validation required |

### JACK-R2 Optimization Status

| Condition | Status |
|-----------|--------|
| Monthly sales ≤ 1 AND CTR < 5% | Optimize |
| Monthly sales > 1 OR CTR ≥ 5% | Do Not Optimize |

---

## API Parameters

| Param | Type | Description |
|-------|------|-------------|
| `type` | `req1` or `req2` | Which requirement |
| `days` | integer | Rolling window (default: 90 for req1, 30 for req2) |
| `from` | `YYYY-MM-DD` | Custom range start — overrides `days` when both present |
| `to` | `YYYY-MM-DD` | Custom range end — overrides `days` when both present |

---

## Files Changed (2026-07-21)

| File | Change Summary |
|------|---------------|
| `Staff-requirements-02/pages/jakshan.html` | Removed hardcoded arrays; added `loadLive()`, `buildApiUrl()`, `onR1RangeChange()`, `onR2RangeChange()`; date filter dropdowns; custom date pickers; live info-bar span IDs; loading/error/success banners |
| `Staff-requirements-02/api/jackshan/dashboard.js` | Added `fromOverride`/`toOverride` to `handleReq1` and `handleReq2`; SQL changed to `BETWEEN`; handler reads `?from` and `?to` query params |
| `docs/jackshan-dashboard-workflow.md` | New workflow reference doc created same session |

---

## Known Limitations

| # | Limitation | Classification |
|---|-----------|---------------|
| 1 | `listings.shopify_listing_meta` is ~14% populated for ledsone.co.uk — products without rows show empty meta fields | ASSUMPTION (supplied figure, not independently queried this session) |
| 2 | Weekly sales = last 7 days before selected `to` date — not separately configurable | VERIFIED (code confirmed) |
| 3 | DB connection is read-only (`dbhub_readonly`) | VERIFIED (prior evidence + code pattern) |
| 4 | Vercel function timeout is 60 seconds | VERIFIED (`vercel.json` read confirms `"maxDuration": 60`) |
| 5 | A successful deployment URL alone does not prove every date option and business rule was exercised end-to-end | UNPROVEN — no automated test run recorded |

---

## Claim-Evidence Table

| Claim | Evidence | Status | Gap |
|-------|----------|--------|-----|
| Hardcoded data removed | `let RAW_DATA = [];` line 267; `let REQ2_DATA = [];` line 554 | VERIFIED | None |
| Live API called for req1 | `fetch(url1)` where `url1` includes `?type=req1` — lines 450, 462 | VERIFIED | None |
| Live API called for req2 | `fetch(url2)` where `url2` includes `?type=req2` — lines 451, 462 | VERIFIED | None |
| Date dropdown triggers re-fetch | `onR1RangeChange()` / `onR2RangeChange()` call `loadLive()` | VERIFIED | None |
| Custom from/to sent to API | `buildApiUrl()` returns `?from=&to=` when value=custom — line 429 | VERIFIED | None |
| SQL uses bounded date range | `BETWEEN $3 AND $4` in dashboard.js lines 102, 117, 194 | VERIFIED | None |
| Info-bar dates updated live | Lines 491-493, 525-527 set period spans from `res.meta` | VERIFIED | None |
| Loading banner shown | `showBanner(...'⏳ Loading...')` before await | VERIFIED | None |
| Error banner shown on failure | `showBanner(...'err')` in catch block + on `res.ok===false` | VERIFIED | None |
| KPI cards update from live data | `document.getElementById('kpi-*').textContent=...` lines ~480-488 | VERIFIED | None |
| Commits exist and match | `git show --stat` on all three hashes | VERIFIED | None |
| Deployed to production | Vercel response `"readyState":"READY"`, aliased to `staff-requirements-02.vercel.app` | VERIFIED | No smoke test recorded |
| maxDuration 60s | `vercel.json` confirmed `"maxDuration": 60` | VERIFIED | None |
| ~14% shopify_listing_meta coverage | Supplied claim — not re-queried this session | ASSUMPTION | Independent query needed to confirm |
| All date filter options work end-to-end | No test run recorded | UNPROVEN | Manual verification by Jackshan or Piranav needed |

---

## Reusable Capability Candidate

**Candidate Title:** Live PostgreSQL-backed staff dashboard with rolling and custom date-range filters  
**Source Subfolder:** `Staff-requirements-02/api/jackshan/` + `Staff-requirements-02/pages/jakshan.html`  
**Problem Solved:** Staff dashboards built with hardcoded snapshots become stale. This pattern replaces snapshots with live DB calls controllable by a date filter, with graceful loading and error states.  
**Evidence Path:** `evidence/Jackshan/requirement-1/live-api-closure-2026-07-21.md`  
**Reuse Reason:** Pattern is identical to Hetheesha live dashboard (HETH-R1/R2). Applicable to any staff dashboard where data source is PostgreSQL and date range is a business variable.  
**KPI Proxy:** Dashboard shows live data within ~5–15s of page load; date change triggers immediate re-fetch.  
**Owner / Reviewer:** Piranav  
**Duplicate-Risk Result:** `docs/capability-candidates/` folder exists (`live-seo-fix-tracker-candidate.md` already present for Hetheesha pattern). This candidate is related but distinct (adds custom date picker). Do not auto-promote — add as second candidate entry.  
**Recommended Next Action:** Add entry to `docs/capability-candidates/` if GPT approves promotion.

---

## Unknown Developer Test

| Area | Result | Evidence |
|------|--------|----------|
| Objective | PASS | Business question answered at top of this file |
| Current status | PASS | COMPLETED / JACK-R1 PASS / JACK-R2 PASS at top |
| Dashboard location | PASS | `https://staff-requirements-02.vercel.app` + file path stated |
| API location | PASS | `Staff-requirements-02/api/jackshan/dashboard.js` stated with routes |
| Database sources | PASS | Source-to-output tables for both R1 and R2 |
| Business rules | PASS | Thresholds documented verbatim — do not change note included |
| Evidence | PASS | Claim-evidence table with VERIFIED/ASSUMPTION/UNPROVEN |
| Limitations | PASS | 5 limitations with classification |
| Next action | PASS | Manual end-to-end test by Jackshan or Piranav |
| Systems not to touch | PASS | See section below |

**Queryability Result: PASS** — A clean LLM can answer: what changed, why, where, which tables, what the rules are, what is proven, and what is not.

---

## Systems Not Changed

| System / File | Confirmed Untouched |
|--------------|-------------------|
| `Staff-requirements-02/pages/jakshan.html` — SQL logic, business rule thresholds | Not touched by this doc task |
| `Staff-requirements-02/api/jackshan/dashboard.js` — API behavior | Not touched by this doc task |
| Other staff dashboards (hetheesha, sonya, sajeepan, etc.) | Not touched |
| `vercel.json` | Not touched |
| PostgreSQL database contents or schema | Not touched (read-only) |
| Environment variables | Not touched |
| Parent AIOS truth | Not touched |
| Production systems | Not touched |

---

## Next Action

**ONE NEXT ACTION:** Jackshan or Piranav to open `https://staff-requirements-02.vercel.app`, select "Custom range…" on both Req 1 and Req 2, enter a specific date range, and confirm the info-bar dates and table data update correctly. Record result to close the UNPROVEN gap in the evidence table.
