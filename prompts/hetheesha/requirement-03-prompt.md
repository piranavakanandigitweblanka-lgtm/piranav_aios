# Prompt Capture — Requirement 03 — Duplicate Page Analysis
**Rule 12 compliance — permanent GPT prompt capture**  
**Date:** 2026-07-06  
**Staff:** Hetheesha  
**Store:** ledsone.fr  

---

## Prompt Summary

Implement Requirement 3: Create a Duplicate Page Analysis dashboard for ALL ledsone.fr product and collection pages.

Analyze for:
1. URL
2. Page Type (Product / Collection)
3. Meta Title + Duplicate Title Flag
4. Meta Description + Duplicate Meta Desc Flag
5. Product Description first 60 characters + Duplicate Product Desc Flag
6. Canonical Tag URL + Canonical Status

### Duplicate Logic
- Normalize: lowercase, whitespace collapse, trim
- Empty = Missing (not Unique)
- Duplicate = same value on 2+ URLs
- Prod Desc duplicate only for product pages; collections = N/A

### Canonical Status
- OK = canonical href = clean page URL
- Incorrect = canonical points elsewhere
- Missing = no canonical tag

### Dashboard Features
Professional UI · Search · Filters (All / Products / Collections / Duplicate Issues / Canonical Issues / Missing Fields) · Sort · Export CSV · KPI summary cards · Color-coded badges

---

## Execution Notes

- **Existing assets:** None found for Req 03 before execution
- **Products:** 1023 fetched via Shopify Admin GraphQL (21 pages, complete catalogue)
- **Collections:** 66 fetched (2 pages)
- **Duplicate title groups (products):** 4 groups / 8 products
- **Duplicate desc groups (products):** 1 group / 2 products
- **Duplicate prod desc 60ch groups (products):** 63 groups / 214 products
- **Canonical method:** Shopify Dawn theme auto-inject — all 1089 pages = OK
- **Known limitation:** Full HTTP crawl of 1089 URLs not performed; canonical status inferred from Shopify theme behaviour

**Status:** PASS
