---
name: jackshan-r1-handover
description: Handover document for Jackshan Requirement 1 — 30-day GSC rebuild 2026-07-13
metadata:
  type: project
---

# Jackshan Requirement 1 — Handover

**Title:** Handover  
**Purpose:** Handover to Jackshan and Piranav (reviewer)  
**Requirement Source:** Authoritative 50-product list from GPT brief 2026-07-13  
**Business Question:** GSC search queries for Jackshan's 50 allocated products + SEO action recommendations, latest 30-day period  
**Staff Owner:** Jackshan  
**Supporting AIOS Staff / Reviewer:** Piranav  
**Store:** ledsone.co.uk  
**Product Scope:** 50 allocated products (authoritative list)  
**Reporting Date Range:** 2026-06-11 to 2026-07-10 (latest 30 days)  
**PostgreSQL Sources Checked:** google_search_console.query_page, listings.shopify_listings, listings.shopify_listing_meta  
**PostgreSQL Sources Used:** All three  
**External Sources Checked:** None  
**Files Created:** jakshan.html rebuilt; 6 evidence files  
**Files Modified:** Staff-requirements/pages/jakshan.html  
**Evidence Location:** evidence/Jackshan/  
**Validation Performed:** Yes — 20 checks, all PASS  
**Duplicate Risk:** None  
**Known Limitations:** 13 products have no GSC data in the 30-day window; IP68 product data ends 2026-05-15  
**Next Steps:** Re-run when additional GSC data imports extend coverage past 2026-07-10  
**Status:** COMPLETE — FAIL (DATA COVERAGE) — superseded by live API build 2026-07-21  
**PASS / FAIL:** FAIL — DATA COVERAGE (13 of 50 products have no GSC data in the 30-day window)

> **2026-07-21 UPDATE:** The hardcoded dataset in this handover has been replaced by a live PostgreSQL API. The dashboard now fetches fresh data on every load with a selectable date range. See `evidence/Jackshan/requirement-1/live-api-closure-2026-07-21.md` for the current canonical record. JACK-R1 status is now **PASS**.

---

## Key Findings (30-Day Rebuild 2026-07-13)

- Dashboard rebuilt from scratch using authoritative 50-product URL list
- Reporting period: latest 30 days (2026-06-11 to 2026-07-10)
- 14-column output: page metrics and keyword metrics separated
- 37 of 50 products have GSC data in the 30-day window
- 13 products have no matched GSC data (0 impressions)
- 1 product qualifies for Rewrite (modern-vintage-pendant: 1 click)
- 10 products qualify for Intent mismatch review (0 clicks, ≥100 impressions)
- 26 products qualify as Do not optimize
- 13 products require Data validation (no GSC data in window)
- Old IP68 outdoor URL completely removed; correct case URL confirmed
- All 3-month/9-day language removed

## What Was Built

File: `Staff-requirements/pages/jakshan.html`

14-column dashboard with:
- 7 KPI cards
- Data coverage FAIL warning banner
- Full data table (50 rows — one per product)
- 14 columns: Product URL, Priority Keyword, Page Impressions, Page Clicks, Page CTR, Page Avg Position, KW Impressions, KW Clicks, KW Avg Position, Meta Title, Meta Description, H1, Recommended Action, Data Status
- Search + filters + sorting + pagination + CSV export

## KPI Summary

| KPI | Value |
|-----|-------|
| Allocated Products | 50 |
| Products with GSC Data | 37 |
| Missing GSC Data | 13 |
| GSC sum | 37 + 13 = 50 PASS |
| Rewrite / Re-optimize | 1 |
| Intent Mismatch Review | 10 |
| Do Not Optimize | 26 |
| Data Validation Required | 13 |
| Action sum | 1 + 10 + 26 + 13 = 50 PASS |

## IP68 Investigation

The IP68 product (`ip68-waterproof-junction-box-case-for-electrical-cable-wire-connector-5599`) has data in PostgreSQL only to 2026-05-15 — outside the 30-day window. The GSC screenshot (2 clicks, 351 impressions, 0.6% CTR, 7.8 avg position) could not be reproduced from PostgreSQL for the 30-day window. The old incorrect "outdoor" handle has been replaced throughout. See `evidence/Jackshan/requirement-1-ip68-gsc-validation.md`.

## File Locations

| File | Path |
|------|------|
| Dashboard | Staff-requirements/pages/jakshan.html |
| Backup | evidence/Jackshan/requirement-1/backups/jakshan-before-30day-redo-20260713.html |
| Authoritative Products | evidence/Jackshan/requirement-1-authoritative-50-products.csv |
| Final Dataset | evidence/Jackshan/requirement-1-30day-final-dataset.csv |
| IP68 Validation | evidence/Jackshan/requirement-1-ip68-gsc-validation.md |
| PostgreSQL Source | evidence/Jackshan/requirement-1-postgresql-source-validation.md |
| Validation | validation/Jackshan/requirement-1-final-validation.md |
| Report | reports/Jackshan/requirement-1-final-report.md |
