---
name: jackshan-r1-correction-evidence
description: Evidence file for the Session 3 correction of Jackshan Requirement 1 — fixing 316-row query grain to 50-row product grain
metadata:
  type: project
---

# Requirement 1 Correction Evidence — Jackshan

**Title:** Requirement 1 Correction Evidence  
**Purpose:** Document what was wrong, what was corrected, and proof of the corrected result  
**Requirement Source:** GPT-approved correction brief (Session 3)  
**Staff Member:** Jackshan  
**Supporting AIOS Staff / Reviewer:** Piranav  
**Store:** ledsone.co.uk  
**Business Question:** GSC search queries for Jackshan's allocated products + SEO action recommendations  
**PostgreSQL Sources Checked:** google_search_console.query_page, listings.shopify_listings, listings.shopify_listing_meta  
**Other Data Sources Checked:** None  
**Files Created / Modified:** Staff-requirements/pages/jakshan.html (corrected in place)  
**Evidence Path:** evidence/Jackshan/requirement-1/  
**Validation Result:** See validation section below  
**Reviewer:** Piranav  
**Status:** COMPLETE — FAIL (DATA COVERAGE — awaiting full 3-month GSC data)  
**Known Limitations:** Only 9 days of GSC data available (2026-06-29 to 2026-07-07)  
**Next Step:** Re-run when full 3-month GSC history is loaded  
**PASS / FAIL:** FAIL — DATA COVERAGE

---

## Root Cause of Previous Incorrect Dashboard

| Error | Description |
|-------|-------------|
| Wrong data grain | Previous dashboard embedded 316 query-level rows instead of 50 product-level rows |
| No priority keyword selection | All GSC queries per product were included, not just the #1 ranked keyword |
| Incorrect badge | Badge showed PASS despite incomplete date coverage |
| KPI mismatch | KPI totals calculated from 316 query rows, not 50 product rows |
| Missing products not shown | Products with no GSC data were absent from the table |
| Incorrectly labelled period | 9-day data was framed as "3-month window" |

---

## What Was Corrected

### Data Grain
- **Before:** 316 rows (one per product × query combination)
- **After:** 50 rows (one per product, one priority keyword selected)

### Priority Keyword Selection Logic Applied
```sql
ROW_NUMBER() OVER (
  PARTITION BY page
  ORDER BY
    total_clicks DESC,
    total_impressions DESC,
    weighted_avg_position ASC,
    query ASC
)
-- Keep only rn = 1
```

### Products with No GSC Data
LEFT JOIN logic applied: all 50 allocated products appear, even those with no GSC matches.
- 7 products show keyword="No GSC data", impressions=0, clicks=0, avgPosition=N/A
- Action = "Data validation required"

### Badge
- **Before:** `PASS`
- **After:** `FAIL — DATA COVERAGE`

### New Column Added
- "Data Status" column added to the table (10th column)

---

## Final Dataset Summary

| Category | Count |
|----------|-------|
| Allocated Products | 50 |
| Products with GSC Data | 43 |
| No GSC Data (resolved URL, no GSC rows) | 3 |
| No GSC Data (unresolvable URL) | 4 |
| **Total rows** | **50** |

### Action Distribution

| Action | Count |
|--------|-------|
| Rewrite meta tags + re-optimize keywords | 10 |
| Check intent mismatch before optimizing | 4 |
| Do not optimize | 29 |
| Data validation required | 7 |
| **Total** | **50** |

**Reconciliation:** 10 + 4 + 29 + 7 = 50 ✓  
**GSC check:** 43 + 7 = 50 ✓

### Top 5 Products by Impressions (Selected Keyword)

| Product URL | Priority Keyword | Impressions | Clicks | Action |
|-------------|-----------------|-------------|--------|--------|
| design-women-toe-post-flip-flop-beach-slipper-for-sea | beach slipper | 1513 | 1 | Rewrite |
| 3-light-bulb-guard-cage-cluster-pendant-lights | cage pendant light edison bulb uk buy | 593 | 0 | Intent mismatch |
| conduit-pipe-table-lamp-with-dimmer-switch-industrial-steampunk-light-5651 | lamp with dimmer | 224 | 0 | Intent mismatch |
| e27-g95-40w-dimmable-antique-globe-industrial-retro-bulb | g95 globe | 171 | 0 | Intent mismatch |
| industrial-ribbed-glass-wall-lights-replacement-lampshades-for-wall-lights | replacement wall light shades | 142 | 2 | Rewrite |

---

## Validation Checks

| Check | Expected | Actual | Result |
|-------|----------|--------|--------|
| Source URL count | 50 | 50 | PASS |
| Final table row count | 50 | 50 | PASS |
| Duplicate product URLs | 0 | 0 | PASS |
| Max rows per product | 1 | 1 | PASS |
| Products outside ledsone.co.uk | 0 | 0 | PASS |
| KPI action total | 50 | 50 | PASS |
| KPI GSC total | 50 | 50 | PASS |
| Badge = FAIL — DATA COVERAGE | Yes | Yes | PASS |
| Null avgPosition handled (N/A display) | Yes | Yes | PASS |
| Data Status column present | Yes | Yes | PASS |
| Full 3-month GSC coverage | 91 days | 9 days | FAIL |

---

## Files Saved This Session

| File | Path |
|------|------|
| Corrected dashboard | Staff-requirements/pages/jakshan.html |
| Backup (before correction) | evidence/Jackshan/requirement-1/backups/jakshan-before-correction-20260710-164435.html |
| Source list validation | evidence/Jackshan/requirement-1/source-product-list-validation.md |
| GSC date coverage | evidence/Jackshan/requirement-1/gsc-date-coverage-validation.md |
| This correction evidence | evidence/Jackshan/requirement-1/requirement-1-correction-evidence.md |
| Final dataset CSV | evidence/Jackshan/requirement-1/final-product-level-dataset.csv |
| Validation update | validation/Jackshan/requirement-1-validation.md |
