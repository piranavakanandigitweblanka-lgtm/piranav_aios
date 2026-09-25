# Sajeepan Non-Sale Scope — Phase 3: 704 Unmatched Investigation [2026-09-25]

## Summary

Phase 2 reported 704 unmatched numeric product_item_ids. This phase resolves them.

**Result:** 703/703 numeric IDs matched successfully via Jefri pattern (direct item_id join).
1 record uses an "other" format (not shopify-prefixed, not pure numeric) — confirmed unresolvable.

---

## Why the Numeric IDs Exist

The numeric IDs are **bare Shopify variant IDs** — the same identifier that the `shopify_GB_<product_id>_<variant_id>` format encodes as its last segment.

Some products in the Google Ads feed are submitted with the variant ID only (no `shopify_GB_` prefix). This is a known Google Merchant Center feed format variation — both formats are valid and refer to the same Shopify variants.

**Evidence:** All 703 numeric IDs match directly to `listings.shopify_listings.item_id` WHERE `site = 'UK'`, with 703/703 also matching `google_ads.merchant_products.product_id`. No alternate store. No alternate market.

---

## Authoritative Matching Pattern (from Jefri)

`jefri.py` lines 71–75 already handles this correctly:

```sql
CASE WHEN product_item_id LIKE 'shopify_%'
     THEN split_part(product_item_id, '_', array_length(string_to_array(product_item_id, '_'), 1))
     ELSE product_item_id END AS shopify_id
```

When the ID is NOT shopify-prefixed, it is used **directly** as the Shopify item_id.

This pattern must be adopted for Sajeepan's non-sale filter. Phase 2's query was incorrect — it only joined shopify-prefixed IDs.

---

## Format Breakdown (30-day window, all Sajeepan campaigns)

| Format | Count |
|---|---|
| shopify_GB_prefixed | 1,422 |
| pure numeric (bare variant IDs) | 703 |
| other format | 1 |
| **Total distinct product_item_ids** | **2,126** |

---

## Match Results for 703 Numeric IDs

| Method | Matched |
|---|---|
| `shopify_listings.item_id` direct (site='UK') | **703 / 703** |
| `merchant_products.product_id` direct | **703 / 703** |
| Any other site | 0 |

**Match rate: 100% (703/703)**

---

## compare_price Distribution — 703 Numeric IDs

| Bucket | Count |
|---|---|
| > 0 (on sale) | 347 |
| NULL (candidate non-sale) | 272 |
| = 0 (candidate non-sale) | 84 |
| Unexpected | 0 |
| **Non-sale total** | **356** |

---

## Status Breakdown — Non-Sale Numeric IDs (356 products)

| Status | Count |
|---|---|
| active | **356** |
| inactive | 0 |

All 356 non-sale numeric products are active. Status filter is redundant here as well.

---

## Stock Breakdown — Non-Sale Numeric IDs (356 products)

| Stock bucket | Count |
|---|---|
| in_stock (quantity > 0) | 186 |
| zero_qty (quantity = 0) | 5 |
| unknown (quantity NULL) | 165 |

Note: 165 "unknown" quantity rows exist. These are active Shopify listings where quantity is NULL in the listings table. This may indicate a tracking gap in the listings sync rather than truly unknown stock. Needs business decision — see Section G (Ambiguities).

---

## Combined Totals — Both Formats (Corrected)

Using the Jefri pattern (CASE WHEN shopify-prefixed THEN split_part ELSE use_directly):

| Metric | Count |
|---|---|
| **Total distinct Sajeepan Ads products** | **2,126** |
| Matched to Shopify UK | 2,125 |
| Unmatched (1 "other" format ID) | 1 |
| **Total non-sale (compare_price NULL or = 0)** | **719** |
| Total on-sale (compare_price > 0) | 1,407 |
| **Group A: non-sale + active + in-stock** | **528** |
| **Group B: non-sale + active + OOS (qty = 0)** | **25** |
| Group C: non-sale + inactive | 0 |
| Unmatched | 1 |

---

## Group Definitions

### Group A — Non-sale + Active + In-stock: 528 products
Full eligible candidate population for a non-sale, in-stock filter.

### Group B — Non-sale + Active + Out-of-stock: 25 products
Non-sale but currently showing zero inventory. Still active listings. 
Business decision: include or exclude from scope?

### Group C — Non-sale + Inactive: 0 products
No inactive non-sale products in the 30-day Ads window.

### Group D — Unknown quantity (NULL): 165 products (from numeric format)
Active, non-sale, but quantity = NULL in shopify_listings.
Could be in-stock or OOS — the listings sync does not record quantity for these variants.
Business decision needed before classifying.

### Group E — Anomalies
- 1 product_item_id with "other" format (not shopify-prefixed, not pure numeric) — unresolvable
- No duplicate variant IDs detected

---

## Phase 2 Correction

Phase 2 reported:
- non-sale: 362 (INCORRECT — only counted shopify-prefixed format)
- match rate: 1,422 / 2,118 (INCORRECT — 703 numeric IDs were missed)

Corrected figures (Phase 3):
- non-sale: **719** (both formats combined via Jefri pattern)
- match rate: **2,125 / 2,126 (99.95%)**

Phase 2 CSV (`sajeepan-nonsale-phase2-product-list-2026-09-25.csv`) contains only the 362 shopify-prefixed non-sale products and is **superseded** by Phase 3.

---

## Business Questions Remaining (for GPT decision)

1. **165 NULL-quantity active products** — treat as in-stock, OOS, or separate category?
2. **compare_price = 0** — confirmed as non-sale? 84 products from shopify-prefixed + numeric formats combined.
3. **Group B (25 OOS products)** — include or exclude from non-sale scope?
4. **Live rolling query vs daily snapshot** — population shifts daily.
5. **The 1 unresolvable product** — exclude silently or flag?

---

## Source Tables Confirmed

| Table | Role | Key field used |
|---|---|---|
| `google_ads.product_performance` | Ads source | `product_item_id`, `campaign_id`, `cost`, `clicks`, `conversions`, `conversion_value` |
| `listings.shopify_listings` | Shopify match | `item_id` (joined via resolved shopify_id), `compare_price`, `status`, `quantity`, `price`, `sku`, `title` |
| `google_ads.merchant_products` | Secondary verification | `product_id` (confirmed matching) |

---

## Queries Run (Read-Only)

All queries were SELECT only. No writes, inserts, updates, creates, or drops.

```sql
-- Format breakdown
SELECT CASE WHEN product_item_id ILIKE 'shopify_%' THEN 'shopify_prefixed'
             WHEN product_item_id ~ '^[0-9]+$' THEN 'pure_numeric'
             ELSE 'other' END AS fmt, COUNT(DISTINCT product_item_id)
FROM google_ads.product_performance
WHERE campaign_id = ANY([SJ_IDS]) AND date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY fmt;

-- Combined non-sale count using Jefri pattern
WITH resolved AS (
    SELECT product_item_id,
        CASE WHEN product_item_id ILIKE 'shopify_%'
             THEN split_part(product_item_id, '_', array_length(string_to_array(product_item_id, '_'), 1))
             ELSE product_item_id END AS shopify_id
    FROM google_ads.product_performance
    WHERE campaign_id = ANY([SJ_IDS]) AND date >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT non_sale, on_sale, group_a, group_b, ...
FROM resolved r
LEFT JOIN listings.shopify_listings sl ON sl.item_id::text = r.shopify_id AND sl.site = 'UK';
```
