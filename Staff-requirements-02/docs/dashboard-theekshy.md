# Theekshy Dashboard

**File:** `pages/theekshy.html`
**Title:** Theekshy — Google Ads Campaign Optimisation Dashboard
**Scope:** Google Ads — Theekshy's campaign IDs (hardcoded in API)
**Last updated:** 2026-07-23

---

## Purpose

Google Ads optimisation dashboard for Theekshy. Four-section view covering campaign performance, search term analysis, product feed optimisation, and stock status — date-range filterable.

---

## Structure — 4 Sections

| Section | Title |
|---|---|
| 1 | Campaign Optimisation Dashboard |
| 2 | Search Term Optimisation Dashboard |
| 3 | Feed Optimisation Dashboard |
| 4 | Stock Status Snapshot & Action Queue |

All four sections load from a single API endpoint with a `type` parameter.

---

## Data Architecture

**Live API — date-range filtered**

```javascript
fetch(`/api/theekshy/dashboard?type=req2&from=${from}&to=${to}`)
```

Single API route handles all section types via `?type=` switch.

---

## API Route — `/api/theekshy/dashboard.js`

### Section 1 — Campaign Optimisation

```sql
SELECT cp.campaign_id, c.campaign_name, c.budget, c.campaign_status,
       SUM(cp.cost), SUM(cp.clicks), SUM(cp.impressions),
       SUM(cp.conversions), SUM(cp.conversion_value), ...
FROM google_ads.campaign_performance cp
JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
WHERE cp.campaign_id = ANY($5::bigint[])
  AND cp.date BETWEEN $3 AND $2
```

**Also:** Daily trend series:
```sql
SELECT date, campaign_id::text AS cid, SUM(cost), SUM(conversions)...
FROM google_ads.campaign_performance
WHERE campaign_id = ANY($1::bigint[]) AND date BETWEEN $2 AND $3
GROUP BY date, campaign_id
```

### Section 2 — Search Term Optimisation

```sql
SELECT pp.product_item_id, pp.campaign_id::text AS cid,
       SUM(pp.cost), SUM(pp.clicks), SUM(pp.conversions)...
FROM google_ads.product_performance pp
WHERE pp.campaign_id = ANY(...) AND pp.date BETWEEN ...
```
Likely also queries `google_ads.pmax_campaign_search_term_data` or `search_term_performance_data` for keyword-level analysis.

### Section 3 — Feed Optimisation

Joins product feed data:
- `google_ads.merchant_products` — product status, disapprovals, price issues
- `google_ads.product_performance` — performance per product_item_id

Flags products with: feed disapprovals, missing attributes, low impressions despite being in feed.

### Section 4 — Stock Status Snapshot & Action Queue

Cross-references Google Ads product feed with current inventory:
- Products in feed with zero stock = wasted spend risk
- Products with stock but not in feed = missed opportunity

**Likely tables:** `inventory.local_inventory_current_stock_location_wise` + `google_ads.merchant_products`

---

## Tables Used

| Schema | Table | Purpose |
|---|---|---|
| `google_ads` | `campaign_performance` | Daily campaign metrics + trend series |
| `google_ads` | `campaigns` | Campaign name, budget, status |
| `google_ads` | `product_performance` | Product-level ad metrics |
| `google_ads` | `merchant_products` | Product feed status and attributes |
| `google_ads` | `pmax_campaign_search_term_data` | Search term performance |
| `inventory` | `local_inventory_current_stock_location_wise` | Current stock levels |

---

## Key Logic

- **Campaign filter:** Theekshy's campaign IDs hardcoded in `api/theekshy/dashboard.js`
- **Single API, multiple types:** `?type=req1/req2/req3/req4` switch in the API handler
- **Date range:** User controls `from` / `to` — passed as query params
- **Stock × Feed cross-reference:** Section 4 compares inventory stock to feed status to generate action queue
- **Action queue:** Prioritised list — zero-stock-in-feed items flagged for immediate PPC pause

---

## Known Limitations

- Campaign IDs hardcoded — must update API if campaigns change
- Feed optimisation data depends on Merchant Center sync schedule
- Stock status is point-in-time — does not account for in-transit stock
- Search term analysis only available for campaigns that expose search term data (PMax has limited visibility)
