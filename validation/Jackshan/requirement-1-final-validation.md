---
name: jackshan-r1-final-validation
description: Final validation for Jackshan Requirement 1 — 30-day rebuild with authoritative 50 product URLs
metadata:
  type: project
---

# Jackshan Requirement 1 — Final Validation

**Title:** Final Validation  
**Purpose:** Confirm the 30-day rebuild meets all PASS requirements  
**Requirement Source:** GPT brief 2026-07-13 — 30-day redo with authoritative 50 URLs  
**Staff Member:** Jackshan  
**Store:** ledsone.co.uk  
**Business Question:** GSC priority keyword + page-level metrics for each allocated product, latest 30 days  
**PostgreSQL Sources Checked:** google_search_console.query_page, listings.shopify_listings, listings.shopify_listing_meta  
**Other Data Sources Checked:** Authoritative product list (provided in brief)  
**Files Created / Modified:** Staff-requirements/pages/jakshan.html  
**Evidence Path:** evidence/Jackshan/  
**Reviewer:** Piranav  
**Status:** COMPLETE — FAIL (DATA COVERAGE — 13 of 50 products have no GSC data in 30-day window)  
**Known Limitations:** IP68 product has GSC data only to 2026-05-15; 13 products have 0 impressions in the 30-day window  
**Next Step:** Re-run when additional GSC imports extend coverage  
**PASS / FAIL:** FAIL — DATA COVERAGE

---

## Validation Check Table

| # | Check | Expected | Actual | Result |
|---|-------|----------|--------|--------|
| 1 | Product list count | 50 | 50 | PASS |
| 2 | Unique URLs | 50 | 50 | PASS |
| 3 | Duplicate URLs | 0 | 0 | PASS |
| 4 | Truncated URLs (ellipsis) | 0 | 0 | PASS |
| 5 | URLs outside ledsone.co.uk | 0 | 0 | PASS |
| 6 | Final table row count | 50 | 50 | PASS |
| 7 | Max rows per product | 1 | 1 | PASS |
| 8 | Old IP68 outdoor URL present | 0 | 0 | PASS |
| 9 | Correct IP68 case URL present | Yes | Yes | PASS |
| 10 | Three-month wording removed | 0 occurrences | 0 | PASS |
| 11 | 9-day coverage warning removed | 0 occurrences | 0 | PASS |
| 12 | 2026-04-07 date reference removed | 0 occurrences | 0 | PASS |
| 13 | Latest 30-day period shown | Yes | 2026-06-11 to 2026-07-10 | PASS |
| 14 | Page metrics separate from KW metrics | Yes | Yes | PASS |
| 15 | Action rules use page-level clicks/impressions | Yes | Yes | PASS |
| 16 | KPI action sum = 50 | 50 | 1+10+26+13=50 | PASS |
| 17 | KPI GSC sum = 50 | 50 | 37+13=50 | PASS |
| 18 | Badge = FAIL — DATA COVERAGE | Yes | Yes | PASS |
| 19 | Metadata checked for all 50 | Yes | Yes | PASS |
| 20 | Evidence files saved | Yes | Yes | PASS |

---

## KPI Reconciliation

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

---

## Action Rule Spot-Checks

| Product | Page Clicks | Page Imp | Action | Correct |
|---------|-------------|----------|--------|---------|
| modern-vintage-pendant (copper bulb holder) | 1 | 45 | Rewrite | PASS |
| 3-way-modern-black | 0 | 1208 | Intent mismatch | PASS |
| vintage-edison-led-filament-g80 | 0 | 707 | Intent mismatch | PASS |
| design-beach-slipper | 0 | 1347 | Intent mismatch | PASS |
| rose-gold-lamp-shade-cap | 0 | 93 | DNO (< 100 imp) | PASS |
| cone-wall-light | 0 | 64 | DNO | PASS |
| ip68-case-5599 | 0 | 0 | Data validation | PASS |
| ceramic-porcelain | 0 | 0 | Data validation | PASS |
