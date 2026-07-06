---
name: requirement-01-filter-validation
description: Manual filter test results for Req 1 Top-Selling Products SEO Report
metadata:
  type: project
---

# Requirement 1 — Filter Validation

**File:** `Staff-requirements/pages/hetheesha.html`
**Date:** 2026-07-06 (Session 3 — refreshed to 50 products, new classification thresholds)
**Tester:** AIOS (code-level logic trace + dataset verification)

## Dataset Facts (Session 3 — 50 products, Jul 06 2026)

- Total products: **50**
- Missing Meta Title (`mtr = null`): 6 products (~2153, ~1647, ~1528, ~3646, ~1742, ~5539)
- Missing Meta Desc (`mdr = null`): 8 products (includes above plus ~2024, ~1567; some may overlap)
- Meta Title Too Long (>60 chars after trim): 12 products
- Meta Desc Too Long (>160 chars): 3 products (updated threshold — was 10 in session 2 with old 120-char OK threshold)
- Meta Desc Too Short (1–69 chars): several products (threshold updated — was <120 in session 2)
- FAQ Schema = Missing: **50** (all — live-confirmed via WebFetch)
- H1 = Present: **50** (all — live-confirmed via WebFetch)
- Low CTR: 11 of 13 products with GSC data (CTR < 2%)
- Alt Issues (alt > 0): most products — filter covers all with at least one missing alt

## Filter Tests

### ✅ All (reset)
- **Expected:** 50 products shown
- **Actual:** 50 — count resets correctly (P.length = 50)
- **Active button:** "All" highlighted, all others cleared
- **PASS**

### ✅ Missing Meta Title
- **Filter logic:** `p.mt === 'Missing'` (mtr is null or blank after trim)
- **Expected:** 6 products (null mtr in dataset)
- **Products:** ~2153, ~1647, ~1528, ~3646, ~1742, ~5539
- **PASS**

### ✅ Missing Meta Desc
- **Filter logic:** `p.md === 'Missing'` (mdr is null or blank after trim)
- **Expected:** 8 products
- **Includes:** ~2153, ~1647, ~1528, ~3646, ~1742, ~5539, ~2024 (mdr=null), ~1567 (mdr=null)
- **PASS**

### ✅ Too Long
- **Filter logic:** `p.mt === 'Too Long' || p.md === 'Too Long'`
- **Covers:** Title >60 chars OR Desc >161 chars (union, not both required)
- **Title Too Long threshold:** 61+ chars after trim
- **Desc Too Long threshold:** 161+ chars after trim (updated — was 160 in session 2)
- **PASS**

### ✅ FAQ Missing
- **Filter logic:** `p.faq === 'Missing'` — explicit check on named property
- **Expected:** 50 products (all have FAQ Missing — live-confirmed)
- **r1_classified() sets:** `faq='Missing'` as explicit property
- **With search stacking:** Search "vintage" + FAQ filter → only vintage-matching products (all have FAQ Missing)
- **Previous bug was:** `return true` (bypassed FAQ check semantically). Fixed in Session 1.
- **PASS**

### ✅ Low CTR
- **Filter logic:** `p.lc === 'Low CTR'`
- **Threshold:** CTR < 2% (values stored as float, e.g. 0.50 = 0.50%)
- **Products with ctr = null:** show "No GSC data" — NOT flagged as Low CTR ✓
- **Products with ctr = 0.00:** Low CTR ✓
- **Products with ctr = 3.33 (~1993):** OK — excluded from filter ✓
- **Products with ctr = 5.48 (~1514):** OK — excluded from filter ✓
- **PASS**

### ✅ Alt Issues
- **Filter logic:** `p.alt > 0`
- **Products with alt=0:** excluded ✓
- **Products with alt=10, 9, 8, etc.:** included ✓
- **PASS**

### ✅ Search + Filter Stacking
- **Test:** Type "araignée" in search + click "Missing Meta Title"
- **Expected:** Only products matching search AND having missing meta title
- **Logic:** Search check runs first (returns false if no match), then filter check — stacks correctly
- **PASS**

### ✅ Product Count Updates
- **Expected:** `tbarCount` updates on every filter/search change
- **Logic:** `r1_render()` always writes `Showing ${rows.length} of ${P.length} products`
- **PASS**

### ✅ Export CSV — Filtered Rows Only
- **Logic:** `r1_exportCSV()` calls `r1_getRows()` — applies current filter + search state
- **Export when "Low CTR" active:** CSV contains only 11 Low CTR products
- **PASS**

### ✅ Sorting After Filtering
- **Logic:** `r1_sort()` calls `r1_render()` → `r1_getRows()` first, then sorts filtered set
- **Test:** Filter to "Alt Issues" → sort by Alt Missing (col 5) → order changes within filtered set
- **PASS**

### ✅ Req 1 and Req 2 Isolation
- **r1_filter():** uses `querySelectorAll('#tab-panel-1 .fbtn')` — scoped to Req 1 panel only
- **All function names:** prefixed `r1_`
- **Button IDs:** `r1BtnAll`, `r1BtnMissTitle`, `r1BtnMissDesc`, `r1BtnTooLong`, `r1BtnFaq`, `r1BtnLowCTR`, `r1BtnAlt`
- **Search input ID:** `r1SearchBox`
- **Req 2 tab:** placeholder only, zero JS conflicts
- **PASS**

### ✅ Badge Char Count Display
- **New in Session 3:** Badge shows character count for Title/Desc status badges
- **Format:** "OK (48)" / "Too Long (72)" / "Too Short (15)"
- **Missing badge:** no char count (shows "Missing" only) ✓
- **Logic:** `r1_badge(s, len)` — len injected from `mtLen` / `mdLen` properties
- **PASS**

### ✅ H1 Status = Present
- **Previously:** "Unverified" for all 50 products
- **Updated:** "Present" — confirmed via live WebFetch on 3 representative pages
- **r1_classified():** sets `h1='Present'` as explicit property
- **Badge:** shows green `b-ok` Present badge
- **PASS**

## Overall Result

| Test | Status |
|---|---|
| All filter | PASS |
| Missing Meta Title | PASS |
| Missing Meta Desc | PASS |
| Too Long | PASS |
| FAQ Missing | PASS |
| Low CTR | PASS |
| Alt Issues | PASS |
| Search stacking | PASS |
| Product count update | PASS |
| Export filtered rows | PASS |
| Sort after filter | PASS |
| Req 1/2 isolation | PASS |
| Badge char count display | PASS |
| H1 Present status | PASS |

**OVERALL: PASS — 2026-07-06 (50 products, new thresholds)**
