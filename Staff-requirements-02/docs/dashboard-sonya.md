# Sonya Dashboard

**File:** `pages/sonya.html`
**Title:** Sonya — Google Ads Campaign Dashboard
**Scope:** Google Ads — campaign ID 20810136438 + campaigns named '%Sonya%'
**Last updated:** 2026-07-23

---

## Purpose

Full Google Ads performance dashboard for Sonya. Five-tab view covering campaign performance, product-level data, trends, opportunity SKUs, and stop-waste-spend analysis — all date-range filterable.

---

## Structure — 5 Tabs

| Tab | Requirement | Title | API endpoint |
|---|---|---|---|
| 1 | Req 1 | Campaign Data Dashboard | `/api/sonya/campaign-performance` |
| 2 | Req 2 | Product Data | `/api/sonya/product-performance` |
| 3 | Req 3 | Trend & Segment Dashboard | `/api/sonya/trend-performance` |
| 4 | Req 4 | Opportunity SKUs Dashboard | `/api/sonya/opportunity` |
| 5 | Req 5 | Stop Waste Spend | `/api/sonya/stop-waste-spend` |

---

## Data Architecture

**Live API — date-range filtered**

Each tab fetches its own endpoint with `?from=YYYY-MM-DD&to=YYYY-MM-DD`.
Tab 5 (Stop Waste Spend) also uses `fetch('/api/sonya/stop-waste-spend')`.

---

## API Routes

### `/api/sonya/campaign-performance.js` — Req 1

**Campaign filter:**
```sql
WHERE (c.campaign_name ILIKE '%Sonya%' OR cp.campaign_id = 20810136438)
```

**Tables:**
```sql
SELECT ...
FROM google_ads.campaign_performance cp
JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
WHERE ... AND cp.date BETWEEN $from AND $to
```

**Returns:** Campaign name, spend, clicks, impressions, conversions, conversion value, ROAS, CPA — aggregated per campaign.

---

### `/api/sonya/product-performance.js` — Req 2

Product-level Google Ads performance for Sonya's campaigns.

**Tables:**
```
google_ads.product_performance
```
Filtered to Sonya's campaign IDs. Returns spend, clicks, conversions per product_item_id.

---

### `/api/sonya/trend-performance.js` — Req 3

Time-series trend data for Sonya's campaigns — daily or weekly aggregated spend, conversions, ROAS.

**Tables:**
```
google_ads.campaign_performance (date-grouped)
```

CSV export: `sonya_req3_trend_{from}_to_{to}.csv`

---

### `/api/sonya/opportunity.js` — Req 4

**Purpose:** Identifies SKUs with high sales velocity but low/no Google Ads spend — opportunity to add PPC.

**Sources:**
```sql
-- Order velocity per SKU (last 30 days)
SELECT oi.item_sku, ...
  SUM(CASE WHEN s.source_name='EBAY'    THEN oi.item_quantity::numeric ELSE 0 END) AS ebay,
  SUM(CASE WHEN s.source_name='SHOPIFY' THEN oi.item_quantity::numeric ELSE 0 END) AS shopify,
FROM order_management.orders o
JOIN order_management.sub_source ss ON ss.id = o.sub_source_id
JOIN order_management.source s ON s.id = ss.source_id
JOIN order_management.order_items oi ON ...
WHERE o.order_date >= MAX(order_date) - 30 days
```

Also joins:
- `listings.shopify_listings` — SKU to Shopify product mapping
- `inventory` — current stock level
- `google_ads.merchant_products` — whether product is in feed
- `google_ads.product_performance` — current PPC spend on SKU

**Logic:** SKUs with orders but zero or low PPC spend = opportunity to advertise.

---

### `/api/sonya/stop-waste-spend.js` — Req 5

**Purpose:** Identifies wasteful Google Ads spend — low conversion / high cost assets, irrelevant search terms.

**Tables:**
```sql
google_ads.campaign_performance
google_ads.asset_performance           -- wasteful creative assets
google_ads.pmax_campaign_search_term_data  -- irrelevant search terms
google_ads.campaigns
```

**Filter:**
```sql
WHERE (c.campaign_name ILIKE '%Sonya%' OR cp.campaign_id = 20810136438)
```

CSV export: `sonya_req5_stop_waste_spend.csv`

---

## Tables Used

| Schema | Table | Purpose |
|---|---|---|
| `google_ads` | `campaign_performance` | Daily campaign metrics |
| `google_ads` | `campaigns` | Campaign name and metadata |
| `google_ads` | `product_performance` | Product-level ad metrics |
| `google_ads` | `merchant_products` | Product feed status |
| `google_ads` | `asset_performance` | Creative asset efficiency |
| `google_ads` | `pmax_campaign_search_term_data` | Search term analysis |
| `order_management` | `orders` | Order velocity per SKU |
| `order_management` | `order_items` | Item-level quantity |
| `order_management` | `sub_source` | Channel identification |
| `order_management` | `source` | Source name (EBAY/SHOPIFY etc) |
| `listings` | `shopify_listings` | SKU → Shopify product mapping |
| `inventory` | (stock tables) | Current stock per SKU |

---

## Key Logic

- **Campaign identity:** `campaign_name ILIKE '%Sonya%' OR campaign_id = 20810136438` — always use both conditions
- **Date range:** All tabs respect `?from=` and `?to=` query params
- **Opportunity logic:** High order velocity + low PPC spend = flag as opportunity
- **Stop waste:** Asset-level and search-term-level wasteful spend identification
- **Latest date:** Each API checks `MAX(date)` first to set default date range

---

## Known Limitations

- Campaign filter is name-based (`ILIKE '%Sonya%'`) — rename of campaign would break the filter
- `asset_performance` and `pmax_campaign_search_term_data` wrapped in try/catch in Req 5 — schema differences may cause those sections to silently return empty
- Opportunity score does not account for margin or product category
