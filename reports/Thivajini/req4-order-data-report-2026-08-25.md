# Final Report — Req 4 Order Data Audit & Fix

**Date:** 2026-08-25
**Team member:** Thivajini · Google Ads · LEDSone FR
**Requirement:** Req 4 — Order Data (Google Ads vs Shopify product-level comparison)

---

## A. Requirement

Requirement 4 — Order Data — Google Ads vs Shopify Orders cross-check at product level across 90-day, 60-day and 30-day windows.

---

## B. Existing Ads Sales Authority

**File:** `Staff-requirements/api/sales.js` — `staff=thivagini-ads` branch (line 4470)

The Ads Sales check operates at **store level** using Shopify GraphQL + customerJourneySummary channel classification. It is not product-scoped. Req 4 is product-level using PostgreSQL for both sides. These are different tools for different purposes — no logic contradiction exists.

---

## C. Current Req 4 Implementation

- **Frontend:** `pages/thivajini.html` — Panel 4, functions `r4Render()`, `r4CSV()`, `tvLoadReq4()`
- **Backend:** `api/members-api.js` — `handleThivajini4(client, toDate)` line 3765
- **API route:** `GET /api/members-api?member=thivajini&type=req4`

---

## D. Root Cause Analysis

The backend calculation logic was **correct** — date windows, tables, campaign IDs, and product matching all verified against live database. The problems were entirely in the frontend:

1. **KPI cards used wrong HTML/CSS classes** — no functional impact but visually broken
2. **Footer data source note had 4 incorrect claims** — wrong tables, wrong matching, wrong live/snapshot status
3. **Legend descriptions referenced wrong percentages** — didn't match actual ratio-based classification logic in code
4. **CSV filename was hardcoded** — would always download as "2026-07-09"
5. **No panel header card** — period element referenced in JS but not present in HTML, causing silent failure

---

## E. Correct Logic (Backend — Unchanged)

| Area | Implementation |
|---|---|
| Google Ads source | `google_ads.product_performance` |
| Google Ads metric | `SUM(conversions)` — fractional (Google modeled attribution) |
| Campaign filter | `campaign_id IN (23103582865, 23533025729, 23405519670)` |
| Product matching | `SPLIT_PART(product_item_id,'_',4)` for shopify_ IDs → `listings.shopify_listings site='France'` → `item_sku` |
| Shopify source | `order_management.orders JOIN order_item_info` sub_source_id=233 |
| Shopify metric | `COUNT(line items)` by SKU per window |
| toDate | `MAX(date)` from `google_ads.campaign_performance` for TV_CAMPAIGNS |
| 90d window | toDate − 89 days |
| 60d window | toDate − 59 days |
| 30d window | toDate − 29 days |
| Status classification | `sh30/ad30` ratio: <0.8×=Ads Driven, 0.8–1.2×=Balanced, >1.2×=Organic Heavy |

---

## F. Database Evidence

| Schema | Table | Columns | Purpose |
|---|---|---|---|
| google_ads | product_performance | campaign_id, date, product_item_id, conversions | Ads order counts |
| google_ads | campaign_performance | campaign_id, date | toDate derivation (MAX date) |
| listings | shopify_listings | item_id, sku, title, price, site | Product title + SKU lookup |
| order_management | orders | id, order_date, sub_source_id | Shopify order dates |
| order_management | order_item_info | order_id, item_sku | SKU per order line |

Latest data dates:
- `campaign_performance`: 2026-08-25
- `product_performance`: 2026-08-22
- `order_management.orders`: 2026-08-24

---

## G. Files Modified

| File | Change | Reason |
|---|---|---|
| `pages/thivajini.html` | Panel 4 KPI cards: tbox/fn/fn-label → kpi/lbl/val | CSS classes were wrong/undefined |
| `pages/thivajini.html` | Added `<header class="rpt">` to Panel 4 | Structural consistency; adds r4-period element |
| `pages/thivajini.html` | Footer data source note: complete rewrite | 4 incorrect claims |
| `pages/thivajini.html` | Legend descriptions: ratio-accurate | Didn't match actual code logic |
| `pages/thivajini.html` | CSV filename: dynamic date | Was hardcoded to 2026-07-09 |
| `pages/thivajini.html` | `tvLoadReq4()`: period update via getElementById | Was using querySelector('.sub') which returned null |

**Backend not modified.** `api/members-api.js` — handleThivajini4 was correct.

---

## H. Before / After

| Test | Before | After |
|---|---|---|
| Ads 90d (variant 41284169629771) | 3.00 (live correct) | 3.00 ✓ |
| Ads 60d (same variant) | 3.00 (live correct) | 3.00 ✓ |
| Ads 30d (same variant) | 1.00 (live correct) | 1.00 ✓ |
| Shopify 90d (ENC2377) | 1 (live correct) | 1 ✓ |
| Shopify 60d (ENC2377) | 0 (live correct) | 0 ✓ |
| Shopify 30d (ENC2377) | 0 (live correct) | 0 ✓ |
| KPI card layout | Visually broken | Styled kpi cards ✓ |
| Footer source note | 4 incorrect claims | Accurate ✓ |
| Legend descriptions | Wrong percentages | Correct ratio logic ✓ |
| CSV filename | Hardcoded 2026-07-09 | Dynamic ✓ |
| Period element | Silent JS failure | Updates correctly ✓ |

---

## I. Validation

All 20 validation checks: **PASS** — see `validation/Thivajini/req4-order-data-validation-2026-08-25.md`

---

## J. AIOS Evidence

- `evidence/Thivajini/req4-order-data-audit-2026-08-25.md`
- `validation/Thivajini/req4-order-data-validation-2026-08-25.md`
- `reports/Thivajini/req4-order-data-report-2026-08-25.md`

---

## K. Scope Confirmation

**Requirement 5 was not implemented or modified.**

---

## L. FINAL RESULT

**PASS**

Req 4 backend calculation logic verified correct against live database. All 5 frontend bugs fixed. No production data modified. Authoritative logic confirmed.
