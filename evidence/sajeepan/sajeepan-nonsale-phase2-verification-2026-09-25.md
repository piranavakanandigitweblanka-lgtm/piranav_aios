# Sajeepan Non-Sale Product Scope — Phase 2 Verification Report

**Date:** 2026-09-25
**Phase:** 2 — Verification (Discovery only, no code changes)
**Preceding phase:** `sajeepan-nonsale-product-scope-discovery-2026-09-25.md`

---

## Phase 1 Discrepancy Note

Phase 1 reported 2,118 products with a 100% Shopify match and 716 non-sale candidates.
Phase 2 verification found different numbers. The discrepancy is documented below and supersedes Phase 1 counts.

| Metric | Phase 1 Reported | Phase 2 Verified |
|---|---|---|
| Total distinct product_item_ids (30d) | 2,118 | **2,126** |
| Matched to Shopify UK | 2,118 (100%) | **1,422 (67%)** |
| Unmatched | 0 | **704** |
| Non-sale (compare_price NULL or 0) | 716 | **362** |

**Root cause of Phase 1 error:** Phase 1 used `rsplit('_',1)[-1]` in Python but the SQL SPLIT_PART logic silently returned empty strings for the 704 raw-numeric-format product_item_ids. Phase 1's COUNT may have used a different join or no join at all.

---

## A. Product ID Format Analysis

Two distinct formats exist in `google_ads.product_performance` for Sajeepan campaigns:

| Format | Example | Count | Matchable |
|---|---|---|---|
| `shopify_gb_<product_id>_<variant_id>` | `shopify_gb_14823229260162_53390663549314` | 1,422 | YES (via SPLIT_PART pos 4 → shopify_listings.item_id) |
| Raw numeric | `14875084423554` | 704 | NO (0 matches to shopify_listings.item_id) |

The 704 raw-numeric IDs cannot be matched to `listings.shopify_listings` via item_id or any other tried method. Their sale/non-sale status **cannot be determined** from Shopify data.

---

## B. compare_price Distribution (all 1,422 matched products)

| Value | Count | % |
|---|---|---|
| > 0 (on sale) | 1,060 | 74.5% |
| NULL (no compare price) | 216 | 15.2% |
| = 0 (zero compare price) | 146 | 10.3% |
| Unexpected/negative | 0 | 0% |
| **Total matched** | **1,422** | 100% |

**Non-sale candidates (NULL + ZERO): 362 distinct variants**

Note: `compare_price = 0` and `compare_price IS NULL` are both treated as non-sale in this analysis. See Section G for the open business decision on whether these are truly equivalent.

---

## C. Status Breakdown — Non-Sale Products (362 variants)

| Status | Count |
|---|---|
| active | 362 |
| inactive / other | 0 |

**All 362 non-sale products have `status = 'active'` in shopify_listings.** No inactive non-sale products found.

---

## D. Stock Breakdown — Non-Sale Products (362 variants)

| Stock State | Count |
|---|---|
| In stock (quantity > 0) | 342 |
| Out of stock (quantity = 0) | 20 |
| Unknown (quantity NULL) | 0 |
| Negative | 0 |

---

## E. Verification Groups

### Group A — Non-sale + Active + In-stock ✅ Eligible
**342 products**
Full list: `evidence/sajeepan/sajeepan-nonsale-phase2-product-list-2026-09-25.csv` (rows where `status=active AND quantity>0`)

### Group B — Non-sale + Active + Out of Stock ⚠️ Active but OOS
**20 products**
These have `status=active` and `quantity=0`. Ads may still be running on them.
See CSV rows where `quantity=0 AND compare_price_bucket IN ('NULL','ZERO')`.

### Group C — Non-sale + Inactive
**0 products** — none found.

### Group D — Unmatched / Unknown (cannot classify)
**704 products** — raw numeric product_item_ids with no Shopify match. Sale status unknown. These represent ~33% of Sajeepan's 30-day Ads product population.

### Group E — Data Anomalies
**None found.** The "57-90 rows per variant" observed during investigation was a query artifact from joining before GROUP BY. Actual shopify_listings has exactly 1 UK row per variant for all checked cases.

---

## F. Business Question Answers

> If we define Sajeepan's future product scope as "Sajeepan Ads products that are non-sale", how many products are currently eligible?

| Definition | Count |
|---|---|
| 1. Non-sale regardless of stock/status (among matched) | **362** |
| 2. Non-sale + active | **362** (same — all non-sale are active) |
| 3. Non-sale + active + in-stock | **342** |

---

## G. Source Table Summary

| Source | Table | Key join field | Site filter | Sale field |
|---|---|---|---|---|
| Ads | `google_ads.product_performance` | `SPLIT_PART(product_item_id,'_',4)` | implicit (shopify_gb format) | none |
| Shopify | `listings.shopify_listings` | `item_id` | `site = 'UK'` | `compare_price` (numeric) |

---

## H. Product ID CSV

**File:** `evidence/sajeepan/sajeepan-nonsale-phase2-product-list-2026-09-25.csv`
**Rows:** 362 (one per distinct variant, deduplicated by highest spend campaign)
**Columns:** product_item_id, product_id, variant_id, sku, product_title, campaign_id, site, status, quantity, compare_price, current_price, total_clicks, total_spend, total_conversions, total_conversion_value, compare_price_bucket

Top 5 non-sale products by 30-day Ads spend:

| product_id | variant_id | SKU | qty | spend | compare_price |
|---|---|---|---|---|---|
| 7977115615482 | 44687446769914 | LDMST64E2746PK | 1,687 | £356.71 | NULL |
| 14874202472834 | 54859132699010 | ENC7860 | 119 | £112.30 | NULL |
| 5334385819809 | 34865736220833 | PLPYBC+ICST64E2740 | 145 | £82.73 | NULL |
| 7630664532218 | 42832272556282 | CRFF140CO+... | 156 | £20.81 | NULL |
| 15069349151106 | 55576282431874 | WSNWBC+... | 0 | £18.15 | 0.00 |

Total 30-day Ads spend across 362 non-sale products: **£1,094.16**

---

## I. Ambiguities / Open Business Decisions

1. **`compare_price = 0` vs `NULL`** — Both treated as non-sale. Is a product with `compare_price = 0` genuinely non-sale, or is it a data entry issue? The 5th highest-spend product (£18.15 spend, qty=0) has `compare_price = 0`. Needs business confirmation before implementing.

2. **704 unmatched raw-numeric product_item_ids** — These cannot be classified as sale/non-sale via Shopify data. They represent ~33% of the Ads population. Business decision needed: exclude them from scope or find an alternative matching path (e.g. via `google_ads.merchant_products.product_id`).

3. **Rolling window vs snapshot** — The 362 count is based on last 30 days. Products enter/leave daily. Implementation will need a decision: live rolling query or daily snapshot.

4. **Group B (20 OOS non-sale)** — These are active in Shopify but have qty=0. Ads may still be serving. Include or exclude from the filter?

---

## J. Recommendation Input for Next Phase

**What the data proves:**
- `compare_price` in `listings.shopify_listings` is populated and technically supports a sale filter
- All non-sale products in the matched set are `status=active`
- `quantity` is populated and technically supports a stock filter
- Match key `SPLIT_PART(product_item_id,'_',4) → shopify_listings.item_id` works for 1,422/2,126 products (67%)
- The remaining 704 raw-numeric IDs have no Shopify match path and cannot be classified

**What remains a business decision:**
- Whether `compare_price = 0` counts as non-sale (same as NULL) — currently assumed YES
- Whether to include/exclude the 704 unmatched products from Sajeepan's scope
- Whether to filter on in-stock only (342) or all non-sale active (362)
- Whether the filter uses a live query or a daily snapshot

**Can `compare_price` technically support the filter:** YES — column exists, is numeric, has clean distribution (NULL/0/positive only, no unexpected values)

**Can `status` technically support the filter:** YES — but adds no practical value since all non-sale products are already `status=active`

**Can `quantity` technically support the filter:** YES — column exists, is integer, cleanly populated (no NULLs in the non-sale set)

---

## K. Changes

**Code changed:** NO
**Database changed:** NO
**New tables created:** NO
