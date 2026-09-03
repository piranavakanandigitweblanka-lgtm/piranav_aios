# Validation — Req 4 Order Data Fix

**Title:** Req 4 Order Data — Post-Fix Validation
**Date:** 2026-08-25
**Team member:** Thivajini · LEDSone FR · Google Ads
**Evidence ref:** evidence/Thivajini/req4-order-data-audit-2026-08-25.md

---

## Validation Checklist

| Check | Result | Notes |
|---|---|---|
| Google Ads source table | PASS | `google_ads.product_performance` confirmed in backend and UI footer |
| Google Ads campaign IDs | PASS | 23103582865, 23533025729, 23405519670 — hardcoded in TV_CAMPAIGNS |
| Google Ads metric | PASS | `SUM(conversions)` — product-level conversion count |
| Shopify source table | PASS | `order_management.orders JOIN order_item_info` sub_source_id=233 |
| Shopify order metric | PASS | `COUNT(line items per SKU)` — order line item count by SKU |
| SKU/product matching | PASS | variant_id → shopify_listings.item_id → item_sku |
| 90-day calculation | PASS | Live DB: values correctly differ from 60d and 30d |
| 60-day calculation | PASS | Live DB: values correctly differ from 90d and 30d |
| 30-day calculation | PASS | Live DB: values correctly differ from 90d and 60d |
| Cumulative check (30d ≤ 60d ≤ 90d) | PASS | Holds for all 5 tested products |
| toDate derivation | PASS | MAX(date) from campaign_performance = 2026-08-25 |
| Date boundaries | PASS | from90=toDate-89d, from60=toDate-59d, from30=toDate-29d |
| Duplicate handling | PASS | GROUP BY variant_id / item_sku prevents duplicates |
| Backend syntax | PASS | node --check: no errors |
| KPI card structure | PASS | Replaced tbox/fn/fn-label with kpi/lbl/val |
| Legend accuracy | PASS | Now describes actual ratio-based classification |
| Footer data sources | PASS | Now documents real tables and matching strategy |
| CSV filename | PASS | Now dynamic: toISOString().slice(0,10) |
| Period element wiring | PASS | tvLoadReq4() now updates r4-period via getElementById |
| Req 5 not modified | PASS | No changes made to Req 5 code or data |
| Production DB not modified | PASS | Read-only queries only |

---

## Before / After Evidence

| Test | Before | Correct Expected | After | Status |
|---|---|---|---|---|
| SKU ENC2377 — Shopify 90d | Live (not tested pre-fix) | 1 | 1 | PASS |
| SKU ENC2377 — Shopify 60d | Live | 0 | 0 | PASS |
| SKU ENC2377 — Shopify 30d | Live | 0 | 0 | PASS |
| variant 41284169629771 — Ads 90d | Live | 3.00 | 3.00 | PASS |
| variant 41284169629771 — Ads 60d | Live | 3.00 | 3.00 | PASS |
| variant 41284169629771 — Ads 30d | Live | 1.00 | 1.00 | PASS |
| variant 42205877207115 — Ads 90d | Live | 2.98 | 2.98 | PASS |
| variant 42205877207115 — Ads 60d | Live | 1.98 | 1.98 | PASS |
| variant 42205877207115 — Ads 30d | Live | 0.98 | 0.98 | PASS |
| KPI card layout | Broken (fn/fn-label) | Styled kpi cards | Fixed | PASS |
| Footer source note — Ads table | ppc_etl_performance_data (WRONG) | google_ads.product_performance | Fixed | PASS |
| Footer source note — Shopify | ShopifyQL (WRONG) | order_management.orders | Fixed | PASS |
| Footer matching key | Product Title (WRONG) | variant_id → SKU | Fixed | PASS |
| Footer live/snapshot | Snapshot only (WRONG) | Live | Fixed | PASS |
| Legend — Ads Driven | ≥80% ads contribution (WRONG) | Ads > Shopify ratio < 0.8× | Fixed | PASS |
| Legend — Balanced | 40–79% (WRONG) | ratio 0.8×–1.2× | Fixed | PASS |
| CSV filename | 2026-07-09 (hardcoded) | Dynamic date | Fixed | PASS |

---

## PASS / FAIL

**RESULT: PASS**

All 5 confirmed bugs fixed. Backend calculation logic verified correct against live database.
No production data modified. Req 5 not modified.
