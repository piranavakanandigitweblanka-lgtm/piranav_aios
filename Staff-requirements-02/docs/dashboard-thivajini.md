# Thivajini Dashboard

**File:** `pages/thivajini.html`
**Title:** Thivajini — Requirements Dashboard · LEDSone FR · Google Ads
**Store:** ledsone-fra.myshopify.com (ledsone FR)
**Scope:** Google Ads — ledsone FR campaigns
**Last updated:** 2026-07-23

---

## Purpose

Google Ads and Shopify order attribution dashboard for ledsone FR (French store). Three-section view covering conversion tracking integrity, product-level winner/loser classification, and stock-spend tracking.

---

## Structure — 3 Sections

| Section | Requirement | Title |
|---|---|---|
| 1 | Req 1 | Conversion Tracking & Data Integrity |
| 2 | Req 2 | Product-Level Performance — Winner / Loser Classification |
| 3 | Req 3/4 | Stock-Spend Tracker — All Products |

---

## Data Architecture

**Live API — date-range filtered**

```javascript
// Section 1
fetch('/api/thivajini/dashboard?type=req1')

// Section 2
fetch(url)  // /api/thivajini/dashboard?type=req2 (or similar)

// Section 3 & 4
fetch('/api/thivajini/dashboard?type=req3')
fetch('/api/thivajini/dashboard?type=req4')
```

---

## API Route — `/api/thivajini/dashboard.js`

### Section 1 — Conversion Tracking & Data Integrity

**Purpose:** Checks if Google Ads conversions tracked in the DB match actual Shopify orders with google_ads UTM attribution.

**Method — Shopify cursor pagination:**
```javascript
// Fetches Shopify orders with Google Ads UTM tags via GraphQL
hostname: 'ledsone-fra.myshopify.com'
// Cursor-paginated through all orders in date range
// Finds last google_ads/cpc touchpoint per order
if (tp.source === 'google_ads' && tp.medium === 'cpc')
```

**Cross-reference with DB:**
```sql
SELECT DATE_TRUNC('week', date)::date AS week_start,
       SUM(conversions), SUM(conversion_value)
FROM google_ads.campaign_performance
WHERE ... (ledsone FR campaign IDs)
GROUP BY week_start
```

**Logic:** Compares weekly conversion counts from Google Ads DB vs Shopify orders tagged with google_ads UTM. Flags discrepancies — missing tracking, double-counting, or attribution gaps.

### Section 2 — Winner / Loser Classification

**Purpose:** Classifies each product as Winner, Loser, or Neutral based on ROAS and conversion rate relative to account average.

**Sources:**
```sql
-- Google Ads product performance
FROM google_ads.product_performance
WHERE campaign_id IN (ledsone FR campaign IDs)
  AND date BETWEEN $from AND $to

-- Joined with merchant product data
FROM google_ads.merchant_products
```

**Classification rules:**
- **Winner:** ROAS > account average AND conversions > threshold
- **Loser:** ROAS < benchmark AND spend > minimum spend threshold
- **Neutral:** Below minimum spend — insufficient data to classify

**KPI cards:** Total products analysed, Winners, Losers, Neutral, Overall ROAS, Total spend

### Section 3/4 — Stock-Spend Tracker

**Purpose:** Cross-references current stock levels with Google Ads spend per product. Flags products receiving spend but with zero or low stock.

**Sources:**
```sql
-- Google Ads spend per product
FROM google_ads.product_performance pp
WHERE campaign_id IN (ledsone FR campaign IDs)

-- Stock levels
FROM inventory.local_inventory_current_stock_location_wise
WHERE warehouse_location = 'France'  -- or UK if France not available
```

**Logic:**
- Products with PPC spend + zero stock = wasted spend, flag to pause
- Products with stock + zero spend + positive historical ROAS = opportunity

---

## Tables Used

| Schema | Table | Purpose |
|---|---|---|
| `google_ads` | `campaign_performance` | Weekly/daily campaign metrics for ledsone FR |
| `google_ads` | `product_performance` | Product-level spend, conversions, ROAS |
| `google_ads` | `merchant_products` | Product title, availability, price |
| `inventory` | `local_inventory_current_stock_location_wise` | Current stock levels |
| Shopify API | orders (GraphQL) | UTM attribution — find google_ads/cpc touchpoints |

---

## Key Logic

- **UTM attribution:** Shopify order touchpoint `source = 'google_ads' AND medium = 'cpc'` — last-click attribution
- **Cursor pagination:** Shopify GraphQL requires cursor-based pagination for large order sets — API iterates until all orders fetched
- **Winner/Loser threshold:** Relative to account average ROAS — not a fixed number
- **Stock-Spend cross-reference:** Requires matching `product_item_id` (Google Ads) → SKU → stock lookup
- **Data integrity check:** Week-level comparison between Shopify UTM orders and Google Ads conversion data

---

## Known Limitations

- Shopify cursor pagination can be slow for large date ranges — may timeout
- Attribution is last-click (google_ads UTM) — does not account for view-through or assisted conversions
- Stock warehouse used may be UK (if France warehouse data is not populated)
- Winner/Loser classification requires minimum spend threshold to be meaningful — new products may all show as Neutral
- Google Ads conversion tracking and Shopify UTM attribution rarely match exactly due to attribution window differences
