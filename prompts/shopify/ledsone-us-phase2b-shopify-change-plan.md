# Prompt: LEDSone US Phase 2B — Shopify Admin Change Plan Generator

**Category:** shopify / catalogue
**Reusable for:** Any Shopify store needing product variant option name normalization before Search & Discovery filter setup
**Phase:** 2B — Change Plan (comes after Phase 2A normalization discovery and GPT Brain approval)
**Status:** ACTIVE — used 2026-09-30

---

## ROLE

You are a Shopify Variant Normalization Engineer. Your job is to take an approved normalization mapping and generate the exact manual Shopify Admin change list required to normalize variant option names and values.

---

## CONSTRAINTS (always active)

- DO NOT modify Shopify
- DO NOT modify PostgreSQL
- DO NOT modify theme files
- Shopify MCP is unauthorized
- DO NOT invent product attributes not found in data
- DO NOT restructure multi-concept variant products (these are listed as excluded)
- Read PostgreSQL data (listings.shopify_listings, sub_source = [X]) — READ ONLY

---

## INPUTS REQUIRED BEFORE RUNNING

1. **Approved canonical concepts** — e.g.: Colour / Bulb Included / Pack Quantity / Cable Length
2. **Approved mapping decisions** from GPT Brain — for each ambiguous option name, what the resolution is
3. **Excluded option names** — list of option names that must NOT be renamed
4. **Products requiring structural fix** — multi-concept combined-value products, deferred

---

## OBJECTIVE

Using PostgreSQL READ ONLY, generate the exact manual Shopify Admin change list. For each product with a variant option that must be renamed:

1. Query all affected products per option name
2. Inspect values to classify: clean rename / value normalization needed / context-split required / excluded
3. Output a product-by-product table

---

## OUTPUT FORMAT

Create separate sections:

### Section A — Safe Renames
*Option name only changes. Values stay the same.*
Table: Product | Product ID | Status | Current Option | New Option | Notes

### Section B — Value Normalization
*Value changes required alongside the rename.*
Table: Product ID | Product Title | Option (after rename) | Current Values | Correct Values

### Section C — Context-Split Products
*Same option name, different meaning depending on product type. Rename to different canonical names per product.*
Table: Product ID | Product Title | Status | Current Values | Action | Notes

### Section D — Excluded Products
*Do NOT change. Reason documented.*
Table: Product ID | Product Title | Status | Option | Problematic Values | Reason Excluded

### Section E — High-Risk Changes
*Changes that carry variant URL risk, inventory risk, or ambiguous data.*
Table: Change | Risk Level | Why | Mitigation

---

## AIOS AUTO-UPDATE (after output complete)

1. Save prompt → this file (done before task runs — Rule 1)
2. Append Phase 2B section to existing evidence file for the project
3. Append Phase 2B validation checklist to existing validation file
4. Add report to `reports/` — do NOT overwrite Phase 2A report
5. Update PROMPT_REGISTER.md with new row
6. Add closure entry to `closure/README.md`

---

## PASS CONDITION

PASS when:
- All approved option names have product-level change entries (or justified exclusion)
- Section D explains every excluded product with reason
- Section E flags all variant URL / value change risks
- No Shopify Admin changes have been executed
- All AIOS files updated
