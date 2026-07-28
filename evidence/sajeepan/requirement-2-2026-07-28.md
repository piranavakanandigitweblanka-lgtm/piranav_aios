# Sajeepan Requirement 2 — Evidence
**Title:** Stop Waste & Intelligence Dashboard
**Task:** Sajeepan R2 implementation
**Date:** 2026-07-28
**Member:** Sajeepan
**Team:** Google Ads
**Requirement:** 2
**Requirement Source:** GPT prompt spec (CSV `What_I_Need_To_Improve_ADS_Performance - Sajeepan R2(1).csv` NOT found in AIOS)
**Objective:** Stop Waste Spend, Search Term Intelligence, Cross-Platform Opportunities, Trend, Product Safety, Morning Actions, 30/60/90 Context
**Dashboard Tab/Area:** "Requirement 2 — Stop Waste & Intel" (new tab in sajeepan.html)
**Store/Country:** UK (GB) · Currency: GBP (£)
**Date Range:** Rolling 30 days from MAX(date) in DB. Latest date: **2026-07-27**. L30: 2026-06-27 → 2026-07-26.

---

## PostgreSQL Sources Inspected

| Table | Available | Used for R2 |
|---|---|---|
| `google_ads.campaign_performance` | ✅ | Budget waste, 30/60/90 context |
| `google_ads.product_performance` | ✅ | Wasteful products, classification |
| `google_ads.merchant_products` | ✅ | Price, availability, title |
| `google_ads.pmax_campaign_search_term_data` | ✅ | Neg KW candidates |
| `google_ads.asset_performance` | ✅ | Asset perf (asset_group level) |
| `google_ads.asset_group_assets` | ✅ | Asset metadata |
| `order_management.orders` | ✅ | Cross-platform, seasonal, drop-off |
| `order_management.order_item_info` | ✅ | SKU-level order data |
| `order_management.source` | ✅ | Platform names |
| `listings.shopify_listings` | ✅ | SKU → item_id join |
| `listings.amazon_listings` | ✅ | Amazon SKU |
| `inventory.physical_product_stock` | ✅ | Stock safety |
| `inventory.products` | ✅ | SKU master |

---

## Blocked / Unsupported

| Feature | Reason |
|---|---|
| Geo Exclude | No geographic performance table found for Sajeepan campaigns |
| Keyword Planner integration | No connected live Keyword Planner API source |
| Product margin / profit | No cost/margin column in any verified table |
| Price-Based Wasteful rule | AMBIGUOUS: spec says "Cost > Product Price" but example shows "price £4, Cost=£1" — contradiction |
| High ROAS boundary | AMBIGUOUS: spec says "<= 400%" — logically inconsistent with preceding bands |
| P3 Clean-Up | No persistent action-log source connected |
| Amazon→Google KW mapping | Amazon search_term_performance_data not joinable to Sajeepan GMC product IDs without ASIN→SKU mapping |

---

## Validation Reconciliation

### Wasteful Products (L30: 2026-06-27 → 2026-07-26, cost>£10, clicks>2, conv<0.01)

| Product Item ID | Campaign | DB Cost | DB Clicks | DB Conv | CVR | Status |
|---|---|---|---|---|---|---|
| shopify_gb_14880113525122_54875583283586 | 21069663519 | £30.70 | 3 | 0 | 0% | Wasteful ✅ |
| shopify_gb_4436070793312_44589245563130 | 21069663519 | £23.86 | 17 | 0 | 0% | Wasteful ✅ |
| shopify_gb_15260848095618_56318107779458 | 23590572906 | £14.32 | 8 | 0 | 0% | Wasteful ✅ |

### Negative KW Candidates (L30, cost>£5, clicks>5, conv=0)

| Search Term | Campaign | DB Cost | DB Clicks | DB Conv | Status |
|---|---|---|---|---|---|
| pool table lights | 21069663519 | £5.40 | 9 | 0 | Candidate ✅ |
| e27 bulb | 21069663519 | £5.40 | 12 | 0 | Candidate ✅ |
| industrial wall lights | 21069663519 | £5.11 | 10 | 0 | Candidate ✅ |

CVR Definition used: `conversions / clicks` (no stored conversion_rate column in product_performance).

---

## Status: PASS (supported features)
