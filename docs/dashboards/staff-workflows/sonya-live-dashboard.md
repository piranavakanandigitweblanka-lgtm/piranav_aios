# Sonya Live Dashboard — Staff Requirements 02

**Staff:** Sonya  
**Deployed:** https://staff-requirements-02.vercel.app  
**Repo:** https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios  
**Last Updated:** 2026-07-17  
**Commit:** f420e78

---

## Database

| Key | Value |
|-----|-------|
| Host | 207.148.78.148:5432 |
| Database | ledsone |
| User | dbhub_readonly |
| Env Var | `DATABASE_URL` (set in Vercel) |
| SSL | false |

**Sonya campaign filter:**
```sql
c.campaign_name ILIKE '%Sonya%' OR campaign_id = 20810136438
```

---

## API Endpoints

### Req 1 — Campaign Performance
**File:** `api/sonya/campaign-performance.js`  
**URL:** `/api/sonya/campaign-performance?from=YYYY-MM-DD&to=YYYY-MM-DD`  
**Tables:** `google_ads.campaign_performance`, `google_ads.campaigns`  
**Returns:** campaigns[] with L30/BL/60d/90d cost, conv, cv, imp, clk

---

### Req 2 — Product Performance
**File:** `api/sonya/product-performance.js`  
**URL:** `/api/sonya/product-performance?from=YYYY-MM-DD&to=YYYY-MM-DD`  
**Tables:** `google_ads.product_performance`, `google_ads.campaigns`, `google_ads.merchant_products`  
**Pattern:** Two-step — aggregate first, then metadata lookup (avoids JOIN timeout)  
**Returns:** products[] with imp, clk, cost, conv, cv + title, img, url, sku, price

---

### Req 3 — Trend & Segment
**File:** `api/sonya/trend-performance.js`  
**URL:** `/api/sonya/trend-performance?from=YYYY-MM-DD&to=YYYY-MM-DD`  
**Tables:** `google_ads.product_performance`, `google_ads.campaigns`, `google_ads.merchant_products`  
**Returns:** products[] with `l:{}`, `bl:{}` period metrics + trend flag

**Trend logic:**
```
if bl_cv > 0:
  l_cv > bl_cv * 1.1  → Seasonal
  l_cv < bl_cv * 0.7  → Drop-off
else → None
```
**BL window:** same span immediately before `fromDate`

---

### Req 4 — Opportunity
**File:** `api/sonya/opportunity.js`  
**URL:** `/api/sonya/opportunity?from=YYYY-MM-DD&to=YYYY-MM-DD`  
**Rule:** Combined non-Google sales > 2 in period = Opportunity  
**Sources:** AMAZON, EBAY, B&Q, SHOPIFY, MANUAL OM, MANUALORDER  
**Exclude statuses:** Canceled, Cancelled, Refunded, Deleted

**Tables:**
- `order_management.orders` → `sub_source` → `source` → `order_item_info`
- `listings.shopify_listings` (site=`'UK'`, prefer ledsone.co.uk URL)
- `inventory.products` + `inventory.physical_product_stock`
- `google_ads.merchant_products` + `google_ads.product_performance`

**Key notes:**
- `item_quantity` is varchar → cast `::numeric`
- Inventory join: `ps.inventory::varchar = p.id::varchar`
- `shopify_listings` site value is `'UK'` not the domain name

**Returns:** `{ sku, amz, ebay, bq, shopify, manual, combined, imp, clk, cost, conv, cv, img, url, title, price, stock }`

---

### Req 5 — Stop Waste Spend
**File:** `api/sonya/stop-waste-spend.js`  
**URL:** `/api/sonya/stop-waste-spend` (no date params — auto-derives from MAX date)

**Tables:**
- `google_ads.campaign_performance` + `google_ads.campaigns`
- `google_ads.asset_performance`
- `google_ads.pmax_campaign_search_term_data`

**Date windows (auto-computed):**

| Window | Description |
|--------|-------------|
| l30 | Last 30 days from MAX(date) |
| prev30 | 30 days before l30 |
| prev60-90 | 30 days before prev30 |
| d90 | Last 90 days (assets + keywords) |

**Wasteful assets:** cost > 3, clicks > 2, conversions < 0.001 (L90d)  
**Neg keywords:** clicks > 5, conversions < 0.001 (L90d)  
**Returns:** `campaigns[]` each with wasteful_assets `[{asset_id, cost, clicks}]`, neg_keywords `[]`, geo_excludes `[]`

**Resilience:** asset + keyword queries wrapped in `try/catch` — campaign data still returns if sub-queries fail.

---

## Frontend — `pages/sonya.html`

| Tab | Panel | Load Function | Date Picker |
|-----|-------|---------------|-------------|
| 1 Campaign Data | panel-1 | `loadData(from, to)` | ✅ 7/30/60/90d |
| 2 Product Data | panel-2 | `pLoadData(from, to)` | ✅ 7/30/60/90d |
| 3 Trend | panel-3 | `tLoadData(from, to)` | ✅ 7/30/60/90d |
| 4 Opportunity | panel-4 | `oLoadData(from, to)` | ✅ 7/30/60/90d |
| 5 Stop Waste Spend | panel-5 | `swsLoadData()` | ❌ auto |

**Lazy loading:** Each tab fetches on first click, not on page open.

**Global Refresh button:** Top-right of nav bar. Calls correct load function for active tab (`_activeTab` var tracks current tab).

---

## Vercel Config

| Key | Value |
|-----|-------|
| Project ID | prj_5dGSos7ZXDK3knlASnFNgXHCMFpf |
| Team ID | team_3yn5bmAF7peUPYM7LJcj07PF |
| Project Name | staff-requirements-02 |
| Function timeout | 60s (`vercel.json`) |
| Cache | `s-maxage=300, stale-while-revalidate=60` |
| Deploy cmd | `vercel deploy --prod --yes` |

---

## Key Patterns

### Two-step query
Direct JOIN on `product_performance + merchant_products` causes timeout on large tables. Fix: aggregate `product_performance` first (no join), then lookup `merchant_products` by product_id array.

### Defensive sub-queries
`asset_performance` and `pmax_campaign_search_term_data` wrapped in separate `try/catch`. If they fail (type mismatch, missing table), campaign overview still returns with empty arrays.

### Hardcoded data removed
| What | Lines removed |
|------|--------------|
| `TREND_ROWS` | 5,778 rows |
| `OPP_DATA` | 300 rows |
| `SWS_CAMPAIGNS` | static array |

Total: 6,257 lines removed from `sonya.html`, replaced with live fetch JS.
