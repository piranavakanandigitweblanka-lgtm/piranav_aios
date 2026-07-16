# Thivajini Req 2 — Availability & Title Fix · GPT Prompt Capture
**Date:** 2026-07-16  
**Requirement:** Requirement 2 — Product-Level KPI & Decision Table

---

## GPT Instruction Summary

Fix missing Product Titles and 453 `unknown` Availability values in the Req 2 dashboard inside `Staff-requirements/pages/thivajini.html`.

Key requirements:
- Resolve availability using live Shopify FR inventory data from approved PostgreSQL sources
- Use `in stock` / `out of stock` / `unavailable` / `not found` / `unknown` (only if genuinely no data)
- Product titles must come from Shopify, not be invented
- Do not modify Req 1, 3, or 4 tabs
- Save all AIOS evidence, validation, handover, reports, prompts files

## What Was Done

1. **Database exploration** — Identified `listings.shopify_listings` (sub_source=233) + `listings.shopify_listings_parent_child_mapping` as the correct source for Shopify FR variant titles and inventory
2. **SQL query** — Ran bulk lookup of all 453 unknown variant IDs against the listings table
3. **Python script** — Parsed DB results, applied availability logic, escaped JS strings, updated HTML in-place
4. **Results** — 441/453 resolved from DB; 12 marked "not found"
5. **HTML updates** — Titles, availability, URLs, filter dropdown, avBadge() function
6. **AIOS files** — Evidence, validation, handover, report, prompt saved

## ID Type Confirmed

`ppc_etl_performance_data.sku` = Shopify variant ID, matching `listings.shopify_listings.item_id`

## Stop Conditions Encountered

None. All 453 IDs were investigated. 12 not found in any approved source — marked accordingly with documented reason.

## PASS / FAIL

**PASS**
