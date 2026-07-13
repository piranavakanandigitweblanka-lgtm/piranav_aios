---
name: jackshan-r1-validation
description: Validation of Jackshan Requirement 1 — corrected to 50 product-level rows (Session 3)
metadata:
  type: project
---

# Jackshan Requirement 1 — Validation (Session 3 Correction)

**Title:** Validation  
**Purpose:** Prove the corrected dashboard meets the product-level grain requirement  
**Requirement Source:** GPT correction brief — Session 3  
**Staff Member:** Jackshan  
**Supporting AIOS Staff / Reviewer:** Piranav  
**Store:** ledsone.co.uk  
**Business Question:** One priority GSC keyword per allocated product, with SEO action  
**PostgreSQL Sources Checked:** google_search_console.query_page, listings.shopify_listings, listings.shopify_listing_meta  
**Other Data Sources Checked:** None  
**Files Created / Modified:** Staff-requirements/pages/jakshan.html, evidence/Jackshan/requirement-1/  
**Evidence Path:** evidence/Jackshan/requirement-1/  
**Reviewer:** Piranav  
**Status:** COMPLETE — FAIL (DATA COVERAGE)  
**Known Limitations:** Only 9 days of GSC data (2026-06-29 to 2026-07-07); 4 product URLs unresolvable from truncated CSV  
**Next Step:** Re-run when full 3-month GSC data loaded  
**PASS / FAIL:** FAIL — DATA COVERAGE

---

## Validation Check Table

| # | Validation Check | Expected | Actual | Evidence | Result |
|---|-----------------|----------|--------|----------|--------|
| 1 | Source URL count | 50 | 50 | source-product-list-validation.md | PASS |
| 2 | Final table row count | 50 | 50 | HTML RAW_DATA array; final-product-level-dataset.csv | PASS |
| 3 | Duplicate product URLs | 0 | 0 | Python assertion in build script | PASS |
| 4 | Max rows per product | 1 | 1 | ROW_NUMBER() OVER (PARTITION BY page) WHERE rn=1 applied | PASS |
| 5 | Products outside ledsone.co.uk | 0 | 0 | All URLs begin https://ledsone.co.uk/products/ | PASS |
| 6 | Query aggregation (5 products) | Correct SUM | Verified | See spot-checks | PASS |
| 7 | Priority keyword selection (5 products) | Highest clicks first | Verified | See ranking checks | PASS |
| 8 | Weighted avg position (3 products) | SUM(pos*imp)/SUM(imp) | DB returns ROUND(weighted,1) | Verified in DB query | PASS |
| 9 | Metadata source (5 products) | title_tag, desc_tag, title | Verified against DB | metadata-source-validation.md | PASS |
| 10 | KPI reconciliation | All totals = 50 | 10+4+29+7=50; 43+7=50 | Build script assertion | PASS |
| 11 | Action rules (all categories) | Correct rule | All 4 categories present | See action examples | PASS |
| 12 | No-data products in table | Appear with No GSC data | 7 products present | RAW_DATA includes all 50 | PASS |
| 13 | Date coverage | 91 days required | 9 days available | gsc-date-coverage-validation.md | FAIL |
| 14 | Null avgPosition handled | N/A displayed | avgPosition!==null check | jakshan.html JS | PASS |
| 15 | Badge = FAIL — DATA COVERAGE | Yes | Yes | badge-fail class in HTML | PASS |
| 16 | Data Status column | Yes | Yes | 10th column in table and CSV | PASS |

---

## Spot-Check: Priority Keyword Ranking

**3-light-bulb-guard-cage**: "cage pendant light edison bulb uk buy" (593 imp, 0 clicks) — highest impressions with 0 clicks

**design-beach-slipper**: "beach slipper" (1513 imp, 1 click) — only keyword with a click; rules 1/2 apply → Rewrite

**industrial-ribbed-glass-wall-lights**: "replacement wall light shades" (142 imp, 2 clicks) — highest clicks → Rewrite

**rose-gold-lamp-shade-cap**: "rose gold lamp shade" (100 imp, 0 clicks) — exactly at 100 impression threshold → Intent mismatch

**1m-white-pendant-light-holder**: "ceiling pendant light parts" (1 imp, 1 click) — 1 click beats all 0-click keywords → Rewrite

---

## Action Rule Validation

| Action | Rule | Example | Clicks | Impressions |
|--------|------|---------|--------|-------------|
| Rewrite meta tags + re-optimize keywords | clicks >= 1 | 40cm-black-metal-dome | 1 | 7 |
| Rewrite meta tags + re-optimize keywords | clicks >= 2 | industrial-ribbed-glass | 2 | 142 |
| Check intent mismatch before optimizing | clicks=0, imp>=100 | rose-gold-shade-cap | 0 | 100 |
| Check intent mismatch before optimizing | clicks=0, imp>=100 | 3-light-bulb-guard-cage | 0 | 593 |
| Do not optimize | clicks=0, imp<100 | cone-wall-light | 0 | 42 |
| Data validation required | no GSC match | dc12v-60w-ip20 | — | — |

---

## KPI Reconciliation (Post URL Recovery 2026-07-10)

| KPI | Value |
|-----|-------|
| Allocated Products | 50 |
| Products with GSC Data | 45 |
| Missing GSC Data | 5 |
| Sum check | 45 + 5 = 50 PASS |
| Rewrite / Re-optimize | 11 |
| Intent Mismatch Review | 5 |
| Do Not Optimize | 29 |
| Data Validation Required | 5 |
| Sum check | 11 + 5 + 29 + 5 = 50 PASS |
