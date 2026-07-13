---
name: jackshan-r1-product-allocation-audit
description: CSV product allocation audit for Jackshan Requirement 1
metadata:
  type: project
---

# Jackshan Requirement 1 — Product Allocation Audit

**Title:** Product Allocation Audit  
**Purpose:** Verify the integrity of the Jackshan Product Allocation CSV  
**Requirement Source:** GPT-approved business rules; Jackshan Product Allocation CSV  
**Staff Owner:** Jackshan  
**Supporting AIOS Staff / Reviewer:** Piranav  
**Store:** ledsone.co.uk  
**Product Scope:** C:\Users\PC\Downloads\Jackshan Product Allocation - Sheet1.csv  
**Reporting Date Range:** 2026-04-07 to 2026-07-07  
**PostgreSQL Sources Checked:** listings.shopify_listings  
**PostgreSQL Sources Used:** listings.shopify_listings  
**External Sources Checked:** None  
**Files Created:** This file  
**Files Modified:** None  
**Evidence Location:** evidence/Jackshan/requirement-1/  
**Validation Performed:** Yes  
**Duplicate Risk:** None  
**Existing Asset Decision:** N/A  
**Known Limitations:** 21 of 50 URLs are truncated (ending in ellipsis) in the CSV  
**Next Steps:** N/A  
**Status:** COMPLETE  
**PASS / FAIL:** PASS

---

## CSV Summary

- **File:** C:\Users\PC\Downloads\Jackshan Product Allocation - Sheet1.csv
- **Encoding:** UTF-8
- **Column:** `URLs` (single column)
- **Raw rows:** 50
- **Blank rows:** 0
- **Duplicate rows:** 0
- **Header row:** 1

## URL Analysis

- **Complete URLs (no truncation):** 29
- **Truncated URLs (ending with …):** 21
- **All URLs use host:** ledsone.co.uk
- **All URLs use path prefix:** /products/
- **Non-product URLs:** 0
- **Collection URLs:** 0
- **URLs with query strings:** 0

## Truncation Issue

21 of 50 URLs were truncated in Google Sheets export with `…` appended. Full handles resolved by:
1. Extracting the handle prefix (before `…`)
2. Querying `listings.shopify_listings` with LIKE match on handle prefix
3. Querying `google_search_console.query_page` for actual page URLs matching those prefixes

## Ambiguous Prefix Matches

The prefix `pendant-light-fitting-ceiling-rose-e27-suspension-set-fabric-corded-` matched 4 handles in shopify_listings:
- `...corded-black`
- `...corded-green-brass`  
- `...corded-rose-gold`
- `...corded-yellow-brass`

Decision: Include all variants that appear in GSC data. GSC showed 2 variants (rose-gold, yellow-brass).

The prefix `tiffany-style-ceiling-pendant-hanging-mediterranean-style-lamp-light` matched 2 handles. GSC showed only the `-decorative-home-4541` variant.

## Products Not Found in Shopify Listings

- `ip68-waterproof-junction-box-case-for-electrical-cable-wire-connecto…` — handle in DB is `ip68-waterproof-junction-box-outdoor-for-electrical-cable-wire-connector-5599` (different word: "case" vs "outdoor"). No GSC data matched the CSV prefix.
- `ledsone-industrial-vintage-32cm-orange-pendant-retro-metal-lamp-shad…` — no "orange" variant found in DB. Available colours: black, cyan-blue, green, light-blue, white, yellow.
- `fisherman-caged-conduit-pipe-light-shade-3-4-entry-wall-lantern-with…` — no matching handle in DB.

## Products With No GSC Data (15 total)

15 CSV-allocated products had no matching GSC query data in the specified date range. These are documented as "Missing GSC Data" (KPI = 15). They are not displayed in the main table.
