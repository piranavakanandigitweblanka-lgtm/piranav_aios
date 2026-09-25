# Evidence — Sajeepan Non-Sale Product ID Scope Discovery — 2026-09-25

**Session date:** 2026-09-25
**Type:** READ-ONLY discovery — no code changed, no DB written
**Status:** PASS

---

## A. Existing Sajeepan Product Scope

Sajeepan's product population is defined in **two ways** depending on which module is used:

### A1. sajeepan.py (main dashboard — Req1 through Req4)

Products are selected by hardcoded campaign ID list:

```python
SJ_CAMPAIGN_IDS = [21069663519, 23110323532, 23516313256, 23590572906, 22079334413, 21242723265, 24092456136]
```

Every product that appears in `google_ads.product_performance` with `campaign_id = ANY(SJ_CAMPAIGN_IDS)` is considered Sajeepan's product. There is **no static product ID list** — the population is dynamic, derived from whichever products served an ad in those 7 campaigns within the requested date window.

Products are then enriched by joining `listings.shopify_listings` on:
- `sl.item_id = split_part(product_item_id, '_', -1)` (variant ID extracted from the Ads item format `shopify_GB_<product_id>_<variant_id>`)
- `sl.site = 'UK'`

**No explicit non-sale filter exists in any of these queries.**

### A2. sajeepan_lens_*.py (Automation Keyword Finder — Req5)

Products are scoped by:
```sql
WHERE c.group_name = 'SAJEEPAN'   -- google_ads.campaigns column
  AND sl.status = 'active'          -- listings.shopify_listings column
  AND sl.site = 'UK'
```

This uses `campaigns.group_name = 'SAJEEPAN'` instead of hardcoded IDs, and additionally filters `status = 'active'` in Shopify listings. Also confirmed constants: `ACCOUNT_ID = '4503486236'`, `SHOPIFY_SITE = 'UK'`, `SHOPIFY_SUB_SOURCE = 104`.

**No explicit non-sale filter exists here either.**

---

## B. Existing Sale/Non-Sale Rule

> **No existing authoritative sale/non-sale rule was found in the Sajeepan codebase or AIOS records.**

Searched across:
- `sajeepan.py` — no `compare_price`, `compare_at`, `sale`, `is_sale` references
- `sajeepan_lens_*.py` (all 26 files) — no sale/non-sale logic
- `sajeepan_ai.py` — no sale/non-sale logic
- Full backend grep for `compare_at`, `non.sale`, `nonsale`, `sale_price`, `is_sale`, `compare_at_price` — zero matches in Sajeepan files

**What was found elsewhere (not Sajeepan):**
- `kamsi.py` and `sukirtha.py` both use `compareAtPrice` from Shopify GraphQL API (for duplicate price checking — not a sale/non-sale gate)
- `dev_tasks/` use `compareAtPrice` for competitor analysis only
- `jefri_nonmoving_db.py` has `compare_price_min/max` columns in a table schema — unrelated to Sajeepan

**Conclusion:** The project has no shared, authoritative "this product is on sale" rule. The closest signal is `listings.shopify_listings.compare_price` (the Shopify compareAtPrice equivalent in the DB) and `google_ads.merchant_products.sale_price`.

---

## C. Source Tables — Actual Schema

### google_ads.merchant_products (Business DB, read-only)

| Column | Type | Sale Relevance |
|---|---|---|
| `product_id` | text | Format: `shopify_GB_<product_id>_<variant_id>` |
| `title` | text | |
| `availability` | text | "in stock" / "out of stock" |
| `price` | numeric | Regular price |
| **`sale_price`** | **numeric** | **Populated when product is on sale — non-NULL and > 0** |
| `feed_label` | character varying | Feed identifier |
| `item_level_issues` | text | JSON — disapprovals |
| `last_update_date` | timestamp | |
| `custom_label0–4` | text | Custom labels — not sale-specific |

Total rows in `shopify_GB_` scope: **408,994**
Rows with `sale_price > 0`: **172,655** (42% of all GB merchant products are on sale)

**Note:** merchant_products has multiple rows per product_id (one per feed_label). Joining on product_id without DISTINCT ON multiplies row counts.

### listings.shopify_listings (Business DB, read-only)

| Column | Type | Sale Relevance |
|---|---|---|
| `item_id` | character varying | Variant ID (matches split_part of Ads product_item_id) |
| `sku` | character varying | |
| `mapped_sku` | character varying | |
| `parent_sku` | character varying | |
| `price` | numeric | Current selling price |
| **`compare_price`** | **numeric** | **Shopify compareAtPrice — populated when product is on sale** |
| `title` | text | |
| `quantity` | integer | Stock quantity |
| `status` | character varying | 'active' / 'draft' / 'archived' |
| `site` | character varying | 'UK' / 'DE' / 'FR' etc |
| `is_parent` | smallint | 1 = parent product row, 0 = variant |
| `sub_source` | integer | 104 = ledsone.co.uk |
| `product_type` | character varying | |

Active UK variant count: **32,709**
Active UK variants with `compare_price > 0`: **11,811** (36% of all active UK variants are on sale)

---

## D. Product ID Matching

**Matching method in current code:** Variant ID extracted from Ads `product_item_id`.

The Ads system stores products in the format `shopify_GB_<product_id>_<variant_id>`. The code uses:
```python
variant_id = r["product_item_id"].rsplit("_", 1)[-1]
```
Then joins: `listings.shopify_listings WHERE item_id = <variant_id> AND site = 'UK'`

For product-level lookups (parent titles), `product_id` is extracted as `parts[-2]` (second-to-last segment) and joined on `is_parent = 1`.

**Match rate for Sajeepan's 30-day population:** 2,118 / 2,118 = **100%** — every Ads item has a corresponding Shopify listing entry.

**No unmatched Ads products.** No duplicate/ambiguous match issues detected.

---

## E. Product Counts (from read-only queries, 30-day window)

| Metric | Count | Source |
|---|---|---|
| Total distinct Sajeepan Ads product_item_ids (last 30 days) | **2,118** | `google_ads.product_performance` WHERE campaign_id = ANY(SJ_CAMPAIGN_IDS) |
| Matched to `listings.shopify_listings` (site=UK) | **2,118** (100%) | JOIN on variant_id |
| Unmatched | **0** | |
| **Non-sale** (compare_price NULL or 0) | **716** | `shopify_listings.compare_price` |
| **Sale** (compare_price > 0) | **1,402** | `shopify_listings.compare_price` |
| With `merchant_products.sale_price > 0` (alt signal) | See note below | |

**Note on merchant_products sale_price counts:** The merchant_products join returned 38,841 rows for Sajeepan's items (24,169 sale + 14,672 non-sale). This is inflated because merchant_products has multiple rows per product (one per feed_label). The `shopify_listings.compare_price` figure (2,118 rows total, no duplication) is the cleaner and more reliable signal.

**Active UK Shopify listing context:**
- All 32,709 active UK variants available in DB
- 11,811 (36%) have compare_price > 0
- Sajeepan's 2,118 items represent 6.5% of the active UK variant catalogue

---

## F. Candidate Sajeepan Non-Sale Product IDs

**Non-sale count: 716 products** (compare_price IS NULL or 0 in shopify_listings).

A full ID list requires an additional query to extract the Shopify product_ids for those 716 variant items. This was not run in this discovery phase to keep the scope bounded. The query pattern to obtain the list is:

```sql
WITH sj_items AS (
  SELECT DISTINCT product_item_id
  FROM google_ads.product_performance
  WHERE campaign_id = ANY(ARRAY[21069663519, 23110323532, 23516313256,
    23590572906, 22079334413, 21242723265, 24092456136])
    AND product_item_id != ''
    AND date >= NOW() - INTERVAL '30 days'
),
variant_ids AS (
  SELECT product_item_id,
    split_part(product_item_id, '_', -1) AS variant_id,
    split_part(product_item_id, '_', 3) AS product_id
  FROM sj_items
)
SELECT
  v.product_id,
  v.variant_id,
  v.product_item_id AS ads_item_id,
  sl.sku,
  sl.title,
  sl.price,
  sl.compare_price,
  sl.quantity,
  sl.status,
  CASE WHEN sl.quantity > 0 THEN 'in_stock' ELSE 'out_of_stock' END AS stock_status,
  CASE WHEN sl.compare_price IS NOT NULL AND sl.compare_price > 0 THEN 'sale' ELSE 'non_sale' END AS sale_status
FROM variant_ids v
JOIN listings.shopify_listings sl ON sl.item_id = v.variant_id AND sl.site = 'UK'
WHERE (sl.compare_price IS NULL OR sl.compare_price = 0)
ORDER BY sl.title;
```

**To obtain the actual list:** run the above query and export to CSV. This is the recommended next step before implementation.

---

## G. Ambiguities

| # | Ambiguity | Detail |
|---|---|---|
| 1 | **Date window for product population** | The 2,118 count is for the last 30 days. The population changes daily as products enter/leave campaigns. A "non-sale filter" needs to define which window to use. |
| 2 | **merchant_products.sale_price vs shopify_listings.compare_price** | Both can signal "sale". They don't always agree (different update cadence). `shopify_listings.compare_price` is recommended as primary signal — it's already used by kamsi/sukirtha and has no row-duplication issue. |
| 3 | **compare_price = 0 vs NULL** | Some rows have compare_price = 0 rather than NULL. Treated as non-sale in this analysis. Needs confirmation. |
| 4 | **Static vs dynamic population** | The hardcoded `SJ_CAMPAIGN_IDS` list (7 IDs) is different from the lens module's `group_name = 'SAJEEPAN'` approach. A staff-wise filter must decide which scoping method to use. |
| 5 | **New campaign 24092456136** | This ID is in `SJ_CAMPAIGN_IDS` but not in `SJ_TARGET_ROAS` — it may be a newer campaign added after the original setup. Products from this campaign may not have been part of prior analysis. |
| 6 | **Product ID vs Variant ID** | The "non-sale product population" could be defined at Shopify product level (parent ID) or variant level. For Google Ads targeting, variant-level is more precise. |
| 7 | **sajeepan.py never reads compare_price** | The `compare_price` column exists in `shopify_listings` and was confirmed via schema inspection, but none of the current Sajeepan queries select it. It is available but unused. |

---

## Summary

- **Sajeepan has 2,118 active Ads products (30-day window)**
- **716 are non-sale (compare_price NULL/0 in shopify_listings)**
- **1,402 are on sale (compare_price > 0)**
- **No existing non-sale filter or rule exists in the codebase**
- **The sale signal to use is `listings.shopify_listings.compare_price`**
- **100% match rate between Ads items and Shopify listings**
- **Implementation not started — this is a discovery record only**
