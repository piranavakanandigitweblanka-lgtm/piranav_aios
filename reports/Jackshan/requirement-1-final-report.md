---
name: jackshan-r1-final-report
description: Final implementation report for Jackshan Requirement 1 — 30-day GSC rebuild
metadata:
  type: project
---

# Jackshan Requirement 1 — Final Implementation Report

**Title:** Final Implementation Report  
**Purpose:** Document the 30-day rebuild of the GSC Priority Keyword dashboard  
**Requirement Source:** GPT brief 2026-07-13  
**Staff Member:** Jackshan  
**Supporting AIOS Staff / Reviewer:** Piranav  
**Store:** ledsone.co.uk  
**Business Question:** For Jackshan's 50 allocated products, what is the priority GSC keyword and page-level performance for the latest 30-day period, and what SEO action should be taken?  
**PostgreSQL Sources Checked:** google_search_console.query_page, listings.shopify_listings, listings.shopify_listing_meta  
**Other Data Sources Checked:** Authoritative 50-product list (provided in brief)  
**Files Created / Modified:** Staff-requirements/pages/jakshan.html  
**Evidence Path:** evidence/Jackshan/  
**Validation Result:** 20/20 checks PASS  
**Reviewer:** Piranav  
**Status:** COMPLETE — FAIL (DATA COVERAGE)  
**Known Limitations:** 13 products have no GSC data in the 30-day window; IP68 product has no data after 2026-05-15  
**Next Step:** Re-run when additional GSC imports are loaded  
**PASS / FAIL:** FAIL — DATA COVERAGE

---

## What Was Built

14-column dashboard, one row per product (50 rows), with:

1. Product URL — complete canonical URL
2. GSC Priority Keyword — top query by clicks → impressions → position → alphabetical
3. Page Impressions (30d) — sum across all queries
4. Page Clicks (30d) — sum across all queries
5. Page CTR (30d) — page clicks / page impressions × 100
6. Page Avg Position (30d) — impression-weighted across all queries
7. KW Impressions (30d) — priority keyword impressions
8. KW Clicks (30d) — priority keyword clicks
9. KW Avg Position (30d) — priority keyword impression-weighted position
10. Meta Title — from listings.shopify_listing_meta
11. Meta Description — from listings.shopify_listing_meta
12. H1 — from listings.shopify_listings.title
13. Recommended Action — based on page-level clicks and impressions
14. Data Status — GSC available vs. no match

## Reporting Period

- **Period:** Latest 30 days
- **Start Date:** 2026-06-11
- **End Date:** 2026-07-10
- **GSC Max Date:** 2026-07-10
- **Source:** sc-domain:ledsone.co.uk, search_type=web

## Action Rule Applied

| Rule | Condition | Action |
|------|-----------|--------|
| 1 | Page Clicks ≥ 2 | Rewrite meta tags + re-optimize keywords |
| 2 | Page Clicks = 1 | Rewrite meta tags + re-optimize keywords |
| 3 | Page Clicks = 0 AND Page Impressions ≥ 100 | Check intent mismatch before optimizing |
| 4 | Page Clicks = 0 AND Page Impressions < 100 | Do not optimize |
| 5 | No GSC match | Data validation required |

## KPI Results

| KPI | Count |
|-----|-------|
| Allocated Products | 50 |
| Products with GSC Data | 37 |
| Missing GSC Data | 13 |
| Rewrite / Re-optimize | 1 |
| Intent Mismatch Review | 10 |
| Do Not Optimize | 26 |
| Data Validation Required | 13 |

## IP68 Investigation

The IP68 product (`ip68-waterproof-junction-box-case-...-5599`) has GSC data in PostgreSQL only up to 2026-05-15. The 30-day window starts 2026-06-11. No impressions or clicks in the window. Assigned Data validation required. The old incorrect handle (containing "outdoor") has been replaced with the authoritative "case" handle throughout.

## Evidence Files

| File | Description |
|------|-------------|
| evidence/Jackshan/requirement-1-authoritative-50-products.csv | All 50 canonical URLs |
| evidence/Jackshan/requirement-1-30day-final-dataset.csv | Complete 50-row dataset |
| evidence/Jackshan/requirement-1-ip68-gsc-validation.md | IP68 screenshot vs PostgreSQL investigation |
| evidence/Jackshan/requirement-1-postgresql-source-validation.md | Source table and query documentation |
| validation/Jackshan/requirement-1-final-validation.md | 20-check validation table |
| handover/Jackshan/requirement-1-handover.md | Handover document |
| prompts/Jackshan/requirement-1-underperforming-product-gsc-keywords.md | Prompt copy |
| evidence/Jackshan/requirement-1/backups/jakshan-before-30day-redo-20260713.html | Pre-rebuild backup |
