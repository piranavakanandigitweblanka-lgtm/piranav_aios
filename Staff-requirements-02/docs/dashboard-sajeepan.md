# Sajeepan Dashboard

**File:** `pages/sajeepan.html`
**Title:** Sajeepan — Google Ads Product Intelligence Dashboard
**Scope:** Google Ads PMax campaigns — 6 campaigns
**Last updated:** 2026-07-28

---

## Purpose

Google Ads PMax performance dashboard for Sajeepan. Two-tab layout:
- **Req 1** — Campaign-level KPIs, product-level performance, merchant product data (date-range filterable)
- **Req 2** — Stop Waste & Intel: wasteful products, search term negatives, budget waste signals, cross-platform (Amazon/eBay) opportunities, 30/60/90-day decision windows

---

## Structure — 2 Tabs

| Tab | Requirement | Title |
|---|---|---|
| Tab 1 | Req 1 | Google Ads PMax Performance Dashboard |
| Tab 2 | Req 2 | Stop Waste & Intel |

Req 2 loads lazily — data only fetched when the tab is first clicked.

---

## Data Architecture

**Live API — date-range filtered**

```javascript
// Req 1
fetch(`/api/sajeepan/dashboard?from=${from}&to=${to}`)

// Req 2
fetch(`/api/sajeepan/dashboard?type=req2&from=${from}&to=${to}`)
```

Both share the same API file with `?type=` routing.

---

## API Route — `/api/sajeepan/dashboard.js`

### Req 1 Queries

**Step 1 — Latest data date**
```sql
SELECT MAX(date) AS latest FROM google_ads.campaign_performance
WHERE campaign_id = ANY($1::bigint[])
```

**Step 2 — Campaign-level performance (L + prev period)**
```sql
SELECT cp.campaign_id, SUM(cost), SUM(clicks), SUM(impressions),
       SUM(conversions), SUM(conversion_value)
FROM google_ads.campaign_performance cp
WHERE cp.campaign_id = ANY($5::bigint[]) AND cp.date BETWEEN $3 AND $2
GROUP BY cp.campaign_id
```

**Step 3 — Product-level performance**
```sql
SELECT product_item_id, SUM(cost), SUM(clicks), SUM(conversions), SUM(conversion_value)
FROM google_ads.product_performance
WHERE campaign_id = ANY($1::bigint[]) AND date BETWEEN $2 AND $3
GROUP BY product_item_id
```

**Step 4 — Merchant product metadata**
```sql
-- google_ads.merchant_products → title, price, availability per product_id
```

---

### Req 2 Queries (`?type=req2`)

**Q1 — Wasteful products** (conv=0, cost>£5, clicks>0, L period)
```sql
SELECT product_item_id, campaign_id::text,
  SUM(clicks), ROUND(SUM(cost)::numeric,2), SUM(impressions)
FROM google_ads.product_performance
WHERE campaign_id = ANY($1::bigint[]) AND date BETWEEN $2 AND $3
GROUP BY product_item_id, campaign_id
HAVING SUM(conversions)=0 AND SUM(cost)>5 AND SUM(clicks)>0
ORDER BY cost DESC LIMIT 30
```

**Q2 — Search term intelligence** (conv=0, cost>£2, L period)
```sql
SELECT search_term, campaign_id::text,
  ROUND(SUM(cost)::numeric,2), SUM(clicks), SUM(impressions)
FROM google_ads.pmax_campaign_search_term_data
WHERE campaign_id = ANY($1::bigint[]) AND date BETWEEN $2 AND $3
  AND conversions = 0
GROUP BY search_term, campaign_id
HAVING SUM(cost) > 2
ORDER BY cost DESC LIMIT 25
```

**Q3 — Campaign budget waste** (L vs prev period)
```sql
SELECT campaign_id::text,
  SUM(CASE WHEN date BETWEEN $1 AND $2 THEN cost ELSE 0 END) AS cost_l,
  SUM(CASE WHEN date BETWEEN $1 AND $2 THEN conversion_value ELSE 0 END) AS cv_l,
  SUM(CASE WHEN date BETWEEN $3 AND $4 THEN cost ELSE 0 END) AS cost_p,
  SUM(CASE WHEN date BETWEEN $3 AND $4 THEN conversion_value ELSE 0 END) AS cv_p
FROM google_ads.campaign_performance
WHERE campaign_id = ANY($5::bigint[]) AND date BETWEEN $3 AND $2
GROUP BY campaign_id
```
Waste signal fires when: `cost_l > cost_p AND roas_l < roas_p`

**Q4 — Cross-platform (Amazon / eBay SKUs L30)**
```sql
SELECT s.source_name, oii.item_sku,
  COUNT(DISTINCT o.id) AS orders_30d, SUM(CAST(oii.item_quantity AS int)) AS qty_30d
FROM order_management.orders o
JOIN order_management.sub_source ss ON ss.id = o.sub_source_id
JOIN order_management.source s ON s.id = ss.source_id
JOIN order_management.order_item_info oii ON oii.order_id = o.id
WHERE o.order_date >= $1 AND s.source_name IN ('AMAZON','EBAY')
GROUP BY s.source_name, oii.item_sku
HAVING COUNT(DISTINCT o.id) >= 3
ORDER BY orders_30d DESC LIMIT 15
```

**Q5 — 30/60/90-day rolling windows**
```sql
SELECT
  SUM(CASE WHEN date >= $1 THEN cost ELSE 0 END) AS cost_30, ...
  SUM(CASE WHEN date >= $2 THEN cost ELSE 0 END) AS cost_60, ...
  SUM(CASE WHEN date >= $3 THEN cost ELSE 0 END) AS cost_90, ...
FROM google_ads.campaign_performance
WHERE campaign_id = ANY($4::bigint[]) AND date >= $3
```

---

## Tables Used

| Schema | Table | Purpose |
|---|---|---|
| `google_ads` | `campaign_performance` | Daily spend, clicks, impressions, conversions per campaign |
| `google_ads` | `campaigns` | Campaign name, budget, status |
| `google_ads` | `product_performance` | Daily metrics per product item_id |
| `google_ads` | `merchant_products` | Product title, price, availability |
| `google_ads` | `pmax_campaign_search_term_data` | Search terms with cost/clicks/conversions per day |
| `order_management` | `orders` | Order-level data with date and sub_source_id |
| `order_management` | `sub_source` | Maps to source (Amazon, eBay, etc.) |
| `order_management` | `source` | Source name (AMAZON, EBAY, SHOPIFY…) |
| `order_management` | `order_item_info` | SKU and quantity per order line |

---

## Unsupported Features (Req 2)

| Feature | Reason |
|---|---|
| Geo Exclude Recommendations | No geo performance table in google_ads schema |
| Margin Safety | No product cost/COGS column in DB |
| Google Keyword Planner | Not connected to this system |
| P3 Clean-Up Tracker | No action log table |
| Amazon → Google Ads join | No automated link between Amazon order SKUs and PMax product IDs |

---

## Known Limitations

- Campaign IDs hardcoded in API — add new ones to `SJ_CAMPAIGN_IDS` array
- `merchant_products` freshness depends on Merchant Center sync schedule
- PMax does not support keyword-level reporting — product_item_id is lowest grain
- Req 2 cross-platform data requires manual verification against PMax product feed
