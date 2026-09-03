# Evidence — Req 4 Order Data Audit

**Title:** Requirement 4 — Google Ads vs Shopify Orders Product-Level Comparison Audit
**Date:** 2026-08-25
**Team member:** Thivajini · LEDSone FR · Google Ads
**Requirement:** Req 4 — Order Data
**Purpose:** Audit, verify and fix the Req 4 dashboard — date windows, data sources, product matching, status logic, and UI accuracy

---

## Authoritative Business Logic Reference

**Ads Sales authority:** `Staff-requirements/api/sales.js` — `staff=thivagini-ads` branch (line 4470)
- Operates at STORE level using Shopify GraphQL API + customerJourneySummary channel classification
- Not product-level — a different tool for a different purpose
- No overlap with Req 4's product-level matching approach

**Req 4 is product-level** — uses PostgreSQL DB for both sides, not Shopify GraphQL. This is correct and intentional.

---

## Req 4 Implementation Located

- **Frontend:** `Staff-requirements/pages/thivajini.html` — Panel 4 (tab-panel#panel-4), JS functions `r4Render()`, `r4CSV()`, `tvLoadReq4()`, data in `R4PRODUCTS`
- **Backend:** `Staff-requirements/api/members-api.js` — `handleThivajini4(client, toDate)` (line 3765) called from `handleThivajini()` (line 3829) via `?member=thivajini&type=req4`

---

## Database Sources Verified (Live Queries)

### Google Ads side
- **Table:** `google_ads.product_performance`
- **Filter:** `campaign_id = ANY([23103582865, 23533025729, 23405519670])`
- **Date range:** `date >= from90` (toDate − 89 days)
- **Metric:** `SUM(CASE WHEN date >= fromN THEN conversions ELSE 0 END)` — produces ad90, ad60, ad30
- **Product ID:** `CASE WHEN product_item_id ILIKE 'shopify_%' THEN SPLIT_PART(LOWER(product_item_id),'_',4) ELSE LOWER(product_item_id) END AS variant_id`
- **Latest date in DB:** 2026-08-22

### Shopify side
- **Tables:** `order_management.orders JOIN order_management.order_item_info ON ii.order_id=o.id`
- **Filter:** `o.sub_source_id=233` (LEDSone FR) + `ii.item_sku=ANY(skus)`
- **Date range:** `o.order_date::date >= from90`
- **Metric:** `COUNT(CASE WHEN o.order_date::date >= fromN THEN 1 END)` — produces sh90, sh60, sh30
- **Latest order in DB:** 2026-08-24

### Product matching
- `google_ads.product_performance.product_item_id` → `variant_id` (via SPLIT_PART)
- `listings.shopify_listings WHERE site='France' AND item_id::text = variant_id` → SKU, title, price
- SKU → `order_management.order_item_info.item_sku` for Shopify order counts

### toDate
- `MAX(date) FROM google_ads.campaign_performance WHERE campaign_id=ANY(TV_CAMPAIGNS)` = **2026-08-25**
- from90 = 2026-05-27
- from60 = 2026-06-26
- from30 = 2026-07-27

---

## Date Window Validation — Live DB Results

### Google Ads windows (live query result, top 5 products)
| variant_id | ad90 | ad60 | ad30 |
|---|---:|---:|---:|
| 41284169629771 | 3.00 | 3.00 | 1.00 |
| 42205877207115 | 2.98 | 1.98 | 0.98 |
| 41283860267083 | 2.50 | 1.50 | 1.00 |
| 42290563940427 | 2.26 | 2.26 | 2.26 |
| 41283063906379 | 2.00 | 1.00 | 1.00 |

Values differ across windows → **date filtering is working correctly**.

### Shopify windows (live query result, matched SKUs)
| SKU | sh90 | sh60 | sh30 |
|---|---:|---:|---:|
| CRSF100BM+WSLS155YB+LSDO210YE+ICST64E27 | 3 | 3 | 2 |
| CRSF100CO+PHSH1PBRCO+LSDM220CO | 2 | 2 | 1 |
| CRSF100GS+WSWH135BM+LSHQ150YE | 1 | 1 | 0 |
| ENC2377 | 1 | 0 | 0 |
| ENC7498 | 1 | 1 | 1 |

Values differ across windows → **Shopify date filtering is working correctly**.

**Cumulative check (30d ≤ 60d ≤ 90d):** HOLDS for all tested products.

---

## Confirmed Bugs Found

### Bug 1 — KPI card HTML uses wrong CSS classes
- **Location:** `pages/thivajini.html` Panel 4 KPI row
- **Before:** `<div class="tbox"><div class="fn" id="r4-k-total">—</div><div class="fn-label">…</div></div>`
- **Problem:** `tbox` = table-box container; `fn` = 12px muted footnote text; `fn-label` = UNDEFINED class
- **Effect:** KPI values render as small muted text with unstyled labels — visually broken
- **Fix:** Replaced with proper `kpi`/`.lbl`/`.val` structure

### Bug 2 — Footer data source note has 4 wrong claims
- **Location:** `pages/thivajini.html` Panel 4 footer
- **Before:** ShopifyQL analytics / ppc_etl_performance_data / Product Title matching / Snapshot only
- **Correct:** order_management.orders / google_ads.product_performance / variant_id→SKU matching / Live
- **Fix:** Replaced entirely with accurate source documentation

### Bug 3 — Legend descriptions don't match code logic
- **Location:** `pages/thivajini.html` Panel 4 legend
- **Before:** "≥80% ads contribution", "40–79%", "<40%"
- **Code logic:** Status based on `sh30/ad30` ratio thresholds (0.8×–1.2× = Balanced), not arbitrary percentages
- **Fix:** Updated to describe actual ratio-based classification

### Bug 4 — CSV filename is hardcoded
- **Location:** `pages/thivajini.html` `r4CSV()`
- **Before:** `'thivajini-order-data-req4-2026-07-09.csv'`
- **Fix:** `'thivajini-order-data-req4-'+new Date().toISOString().slice(0,10)+'.csv'`

### Bug 5 — Panel 4 has no header card
- **Location:** `pages/thivajini.html` Panel 4
- **Before:** Panel jumps straight to KPI boxes; no `<header class="rpt">` section; period element referenced in JS but not present in HTML
- **Fix:** Added proper `<header class="rpt">` with title, subtitle, chips, and `id="r4-period"` element; wired `tvLoadReq4()` to update it

---

## Not Bugs (Verified Correct)

| Area | Status | Evidence |
|---|---|---|
| Date window logic (90/60/30d) | CORRECT | Live DB: values differ correctly across windows |
| Google Ads table | CORRECT | `google_ads.product_performance` confirmed in backend |
| Campaign IDs | CORRECT | 23103582865, 23533025729, 23405519670 confirmed |
| Shopify table | CORRECT | `order_management.orders` + `order_item_info`, sub_source_id=233 |
| Product ID resolution | CORRECT | SPLIT_PART for shopify_ IDs, direct for others |
| SKU matching | CORRECT | `listings.shopify_listings site='France'` |
| toDate derivation | CORRECT | MAX(date) from campaign_performance |
| Backend syntax | CORRECT | `node --check` PASS |
| Fractional conversions | EXPECTED | Google Ads uses modeled fractional attribution |
