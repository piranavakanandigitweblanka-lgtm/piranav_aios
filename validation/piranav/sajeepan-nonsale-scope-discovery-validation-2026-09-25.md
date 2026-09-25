# Validation — Sajeepan Non-Sale Product Scope Discovery — 2026-09-25

**Session date:** 2026-09-25
**Task:** Read-only discovery of Sajeepan's product scope and sale/non-sale signals
**Result:** PASS

---

## Validation Checklist

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Sajeepan's current product scope was traced from code | ✅ PASS | `sajeepan.py` line 23: SJ_CAMPAIGN_IDS hardcoded; `sajeepan_lens_config.py` line 28: group_name='SAJEEPAN' |
| 2 | Actual Business DB schema was inspected (not assumed) | ✅ PASS | Schema query run via psycopg. `google_ads.merchant_products` 33 columns confirmed. `listings.shopify_listings` 31 columns confirmed. |
| 3 | Google Ads source was identified | ✅ PASS | `google_ads.product_performance` + `google_ads.merchant_products` |
| 4 | Shopify listing source was identified | ✅ PASS | `listings.shopify_listings` — joined via variant_id (split_part of product_item_id), site='UK' |
| 5 | Existing sale/non-sale logic was searched for | ✅ PASS | Full grep across backend and frontend. Zero sale/non-sale logic in Sajeepan files. compare_price column exists in DB but is never queried by Sajeepan. |
| 6 | Product matching logic was documented | ✅ PASS | Variant ID extracted as `rsplit('_',1)[-1]` from Ads product_item_id |
| 7 | Product counts come from actual read-only queries | ✅ PASS | 2,118 total, 716 non-sale, 1,402 sale — from live DB queries |
| 8 | No production code was changed | ✅ PASS | Only file reads and SELECT queries run |
| 9 | No Business DB data was changed | ✅ PASS | Only SELECT and information_schema queries run |
| 10 | No new database table was created | ✅ PASS | No CREATE, INSERT, UPDATE, DELETE executed |

---

## Query Evidence

Queries run (all SELECT-only):

1. `information_schema.columns` — schema inspection for `google_ads.merchant_products` and `listings.shopify_listings`
2. `COUNT(DISTINCT product_item_id)` from `google_ads.product_performance` WHERE campaign_id = ANY(SJ_CAMPAIGN_IDS), last 30 days → **2,118**
3. `COUNT(*)` from `google_ads.merchant_products` WHERE product_id LIKE 'shopify_GB_%' → **408,994**
4. `COUNT(*)` with sale_price > 0 → **172,655**
5. `COUNT(*)` from `listings.shopify_listings` WHERE site='UK', status='active', is_parent=0 → **32,709**
6. `COUNT(*)` with compare_price > 0 → **11,811**
7. LEFT JOIN Sajeepan items to shopify_listings — match rate **2,118/2,118 (100%)**
8. Sale vs non-sale split by compare_price → **sale: 1,402 / non-sale: 716**
9. Sale vs non-sale split by merchant_products.sale_price → inflated (38,841 rows due to feed_label duplication)

## Recommendation

Use `listings.shopify_listings.compare_price` as the sale signal, not `merchant_products.sale_price`, because:
- shopify_listings has one row per variant (no duplication)
- compare_price directly reflects Shopify's compareAtPrice field
- Already used by kamsi.py and sukirtha.py for duplicate price checking (confirmed via grep)

---

## Files Created This Session

- `evidence/sajeepan/sajeepan-nonsale-product-scope-discovery-2026-09-25.md`
- `validation/piranav/sajeepan-nonsale-scope-discovery-validation-2026-09-25.md`
- `prompts/sajeepan/nonsale-product-scope-discovery.md`
- `PROMPT_REGISTER.md` — updated
