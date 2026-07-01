# Prompt: Shopify Predictive Search Field Fix

---

## Title
Shopify Predictive Search Field Fix

## Purpose
Diagnose and fix a specific mismatch or missing behaviour in Shopify's predictive search — including availability filter guards, missing search fields (body_html, tag), and dropdown vs. full-results inconsistency. Produces a targeted Liquid edit with evidence.

## Business Question
> "Why does the predictive search dropdown show different results from the full search page, and what is the minimum Liquid change required to make them consistent?"

## When to Use
- Customers report fewer products in the dropdown than on the /search page
- Out-of-stock products are hidden from the dropdown but visible on the full results page
- Certain product types are not findable via the search bar (suggests missing `options[fields]`)
- After a theme update that touched `search-predictive-*.liquid`

## Pre-conditions
- Theme files must be accessible locally
- A specific mismatch or missing behaviour must be confirmed (test query + expected vs. actual result)
- `evidence/fixes/` must be checked — confirm this search issue has not been previously fixed

---

## Prompt Text

```
You are diagnosing and fixing a predictive search issue in a Shopify theme.

Theme: [THEME EXPORT PATH OR NAME]
Store: [STORE URL]
Reported issue: [DESCRIBE THE MISMATCH — e.g. "dropdown hides out-of-stock products; full search page shows them"]
Test query: [SEARCH TERM THAT REPRODUCES THE ISSUE]

Step 1 — AUDIT PREDICTIVE SEARCH FILES
Read these files:
- sections/search-predictive-grid.liquid (or search-predictive-list.liquid if present)
- snippets/product-popular-list-item.liquid (or equivalent product card)
- Any JS file that builds the fetch URL for /search/suggest

Look for:
(a) AVAILABILITY FILTER — any `{% if product.available %}` or `product.available == true` guard inside the product loop
(b) MISSING FIELDS — does the fetch URL include `options[fields]=title,product_type,variants.title,variants.sku`? Are `body_html` and `tag` missing?
(c) LOOP DUPLICATION — are there two loops (search_suggest + search mode) that both need the same fix?
(d) SECTION-BASED vs JSON-API — does this theme use `section_id` in the fetch URL (section rendering) or plain JSON?

Step 2 — FULL SEARCH PAGE COMPARISON
Read: sections/main-search.liquid
Do the same availability filter checks.
Is the full search page showing products the dropdown hides?

Step 3 — FIX
Apply the minimum change:
- If availability filter found: remove `{%- if product.available -%}` guard from dropdown loop(s) only. Do not touch full search page.
- If fields missing: add missing fields to `options[fields]` parameter in the fetch URL construction
- If both loops affected: apply fix to both loops in the predictive file

For each change:
| File | Line | Before | After | Reason |
|---|---|---|---|---|

Step 4 — VERIFY
Run grep to confirm:
(a) `product.available` guard is absent from the predictive section loops
(b) The fix did not accidentally remove availability logic from the full search page

Do not change:
- The full search page's product card logic
- Any JS search controller (theme.js or equivalent)
- Collection page product cards
```

---

## Expected Claude Output
- Availability filter audit (present / absent per file and loop)
- Fields audit (which fields are in the fetch URL)
- Change table (before/after per file and line)
- Grep verification
- Risk level (GREEN / AMBER / RED)
- Confirmation that full search page is unaffected

## Evidence Required
- Evidence file: `evidence/fixes/predictive-search-[slug]-fix-[date].md`
- Index row in `evidence/README.md`
- Closure entry in `closure/README.md`

## Pass/Fail Rule
PASS: Identified guard/field issue fixed in all affected loops. Grep confirms change. Full search page unchanged. Test query produces consistent results in dropdown.
FAIL: Fix applied to one loop but not both; or full search page accidentally modified.

## Related Tasks
- `prompts/discovery/shopify-liquid-section-code-review.md`
- `prompts/validation/shopify-section-post-fix-verification.md`
- Pattern: `predictive-search-availability-filter-fix` (from 2026-06-24 session)

## Status
ACTIVE

## Last Updated
2026-07-01

## Source Evidence
- `closure/sessions/2026-06-24.md` — `product.available` guard removed from both loops in `search-predictive-grid.liquid`; dropdown now shows same products as full search page
- `evidence/fixes/predictive-search-fix-report.md`
- `evidence/fixes/predictive-search-mismatch-report.md`
