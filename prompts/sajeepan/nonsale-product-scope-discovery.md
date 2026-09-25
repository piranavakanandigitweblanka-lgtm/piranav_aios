# Prompt — Sajeepan Non-Sale Product Scope Discovery

**Prompt ID:** SAJ-NONSALE-SCOPE-001
**Category:** sajeepan / discovery
**Created:** 2026-09-25
**Status:** ACTIVE

---

## Purpose

Run a READ-ONLY discovery to determine how Sajeepan's current Ads products are identified and which Product IDs represent his non-sale product population. This is the prerequisite step before implementing a staff-wise non-sale product filter.

---

## When To Use

- Before implementing any staff-wise product ID filter for the Ads team
- When Sajeepan's product scope needs to be re-verified (e.g. new campaigns added)
- When GPT needs to understand Sajeepan's current product population before designing a feature

---

## Prompt

```
You are running a DISCOVERY PHASE task for the DM Dashboard.

Objective: Discover and document how Sajeepan's current Ads products are identified and which Product IDs should be considered his non-sale product population.

RULES — STRICTLY ENFORCED:
- DO NOT modify any production code
- DO NOT write to the Business DB (read-only)
- DO NOT create new tables
- DO NOT change the frontend

Sajeepan's campaign IDs (hardcoded in sajeepan.py):
SJ_CAMPAIGN_IDS = [21069663519, 23110323532, 23516313256, 23590572906, 22079334413, 21242723265, 24092456136]

Sale signal to use: listings.shopify_listings.compare_price
- compare_price IS NOT NULL AND > 0 → product is on sale
- compare_price IS NULL OR = 0 → product is NON-SALE

Product ID format in Ads: shopify_GB_<product_id>_<variant_id>
Variant ID extracted as: product_item_id.rsplit('_', 1)[-1]
Shopify listing join: listings.shopify_listings WHERE item_id = <variant_id> AND site = 'UK'

Steps:
1. Search existing AIOS records for prior Sajeepan scope docs
2. Read sajeepan.py, sajeepan_ai.py, sajeepan_lens_config.py
3. Search for any sale/non-sale logic in the codebase
4. Inspect actual DB schemas (information_schema.columns)
5. Run read-only COUNT queries to establish product population
6. Create AIOS evidence, validation, prompt files

Key tables:
- google_ads.product_performance — Ads performance (campaign_id, product_item_id)
- google_ads.merchant_products — Feed data (product_id, availability, sale_price)
- listings.shopify_listings — Shopify variants (item_id, compare_price, quantity, status)

Expected output:
- Total Sajeepan Ads products (30-day window)
- Non-sale product count and query to extract IDs
- Sale/non-sale split
- Match rate between Ads items and Shopify listings
- Any ambiguities

AIOS files to create:
- evidence/sajeepan/sajeepan-nonsale-product-scope-discovery-YYYY-MM-DD.md
- validation/piranav/sajeepan-nonsale-scope-discovery-validation-YYYY-MM-DD.md
```

---

## Known Results (2026-09-25)

- Total Sajeepan Ads products (30d): **2,118**
- Non-sale: **716** (compare_price NULL/0)
- Sale: **1,402** (compare_price > 0)
- Match rate: **100%**
- Sale signal: `listings.shopify_listings.compare_price`

---

## Technical Constraints

- Business DB pool max_size = 4. Never raise it.
- merchant_products has multiple rows per product (one per feed_label) — use DISTINCT ON when joining
- sajeepan.py uses hardcoded SJ_CAMPAIGN_IDS; sajeepan_lens uses group_name='SAJEEPAN'
- compare_price column exists in shopify_listings but is NOT currently used by any Sajeepan query
