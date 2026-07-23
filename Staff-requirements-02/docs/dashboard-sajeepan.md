# Sajeepan Dashboard

**File:** `pages/sajeepan.html`
**Title:** Sajeepan — Google Ads Product Intelligence Dashboard
**Scope:** Google Ads PMax campaigns — 6 campaigns
**Last updated:** 2026-07-23

---

## Purpose

Google Ads PMax performance dashboard for Sajeepan. Single-page view covering campaign-level KPIs, product-level performance, and merchant product data — date-range filterable.

---

## Structure — 1 Section

| Section | Requirement | Title |
|---|---|---|
| Main | Req 1 | Google Ads PMax Performance Dashboard |

Chips shown: `6 PMax Campaigns` · `Source: google_ads.campaign_performance + product_performance + merchant_products`

---

## Data Architecture

**Live API — date-range filtered**

```javascript
fetch(`/api/sajeepan/dashboard?from=${from}&to=${to}`)
```

Date range picker on page controls the `from` / `to` parameters.

---

## API Route — `/api/sajeepan/dashboard.js`

### Step 1 — Latest data date

```sql
SELECT MAX(date) AS latest
FROM google_ads.campaign_performance
WHERE campaign_id = ANY($1::bigint[])
```
Used to show the data freshness date and set default date range.

### Step 2 — Campaign-level performance

```sql
SELECT cp.campaign_id, c.campaign_name, c.budget, c.campaign_status,
       SUM(cp.cost), SUM(cp.clicks), SUM(cp.impressions),
       SUM(cp.conversions), SUM(cp.conversion_value), ...
FROM google_ads.campaign_performance cp
JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
WHERE cp.campaign_id = ANY($5::bigint[])
  AND cp.date BETWEEN $3 AND $2
GROUP BY cp.campaign_id, c.campaign_name, c.budget, c.campaign_status
```

**Campaign IDs:** Hardcoded list of Sajeepan's 6 PMax campaign IDs in the API file — `SJ_CAMPAIGN_IDS`.

### Step 3 — Product-level performance

```sql
SELECT pp.product_item_id, ...
       SUM(pp.cost), SUM(pp.clicks), SUM(pp.conversions), SUM(pp.conversion_value)
FROM google_ads.product_performance pp
WHERE pp.campaign_id = ANY($1::bigint[])
  AND pp.date BETWEEN $2 AND $3
GROUP BY pp.product_item_id
```

### Step 4 — Merchant product data

```sql
-- google_ads.merchant_products
-- Provides product title, price, availability, stock status per item_id
```

**Join path:**
```
google_ads.product_performance.product_item_id
  → google_ads.merchant_products.item_id
    → product title, price, availability
```

---

## Tables Used

| Schema | Table | Purpose |
|---|---|---|
| `google_ads` | `campaign_performance` | Daily spend, clicks, impressions, conversions per campaign |
| `google_ads` | `campaigns` | Campaign name, budget, status |
| `google_ads` | `product_performance` | Daily metrics per product item_id |
| `google_ads` | `merchant_products` | Product title, price, availability from Google Merchant Center |

---

## Key Logic

- **Campaign filter:** `campaign_id = ANY(SJ_CAMPAIGN_IDS)` — only Sajeepan's 6 PMax campaigns
- **Date range:** User-controlled — defaults to last available date range
- **KPI cards:** Conv Value, Total Spend (across all 6 campaigns), ROAS, CPA
- **Product table:** Ranked by conversion value descending — shows best/worst performing products
- **Merchant data join:** Enriches product_item_id with human-readable title and stock status

---

## Known Limitations

- Campaign IDs are hardcoded — if new campaigns are added they must be added to `SJ_CAMPAIGN_IDS` in the API
- `merchant_products` data freshness depends on Merchant Center sync schedule
- PMax does not support keyword-level reporting — product_item_id is the lowest grain available
