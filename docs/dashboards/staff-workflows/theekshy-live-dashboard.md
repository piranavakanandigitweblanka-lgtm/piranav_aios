# Theekshy Live Dashboard — Staff Requirements 02

**Staff:** Theekshy  
**Deployed:** https://staff-requirements-02.vercel.app/pages/theekshy.html  
**Repo:** https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios  
**Last Updated:** 2026-07-17  
**Commit:** 9ad60bd

---

## Campaigns

| Label | Campaign ID | Budget | Target ROAS |
|-------|-------------|--------|-------------|
| THEE_GEMS | 23714290257 | £20/day | 4.00x |
| THEE_MYSTERY | 23684837882 | £10/day | 2.50x |

---

## API Endpoint

**File:** `api/theekshy/dashboard.js`  
**Single endpoint with `?type=` selector:**

| Type | URL | Purpose |
|------|-----|---------|
| req1 | `/api/theekshy/dashboard?type=req1&from=&to=` | Req 1 — campaign + daily + products |
| req2 | `/api/theekshy/dashboard?type=req2&from=&to=` | Req 2 — search terms |
| feed | `/api/theekshy/dashboard?type=feed&from=&to=` | Req 3+4 — feed + stock data |

All default to last 30 days from MAX(date) in campaign_performance.

---

## Tables Used

| Table | Purpose |
|-------|---------|
| `google_ads.campaign_performance` | Campaign daily metrics, L + prev period |
| `google_ads.campaigns` | Campaign name, budget, status |
| `google_ads.product_performance` | Product-level cost/conv/cv |
| `google_ads.merchant_products` | GMC availability, price, title, image |
| `google_ads.pmax_campaign_search_term_data` | Search terms (Req 2) |
| `listings.shopify_listings` | Shopify price, status, SKU (site='UK') |
| `inventory.products` + `inventory.physical_product_stock` | Stock quantities |

**Known column quirk:** `pmax_campaign_search_term_data` uses `conversions_value` (not `conversion_value`).

---

## Requirement Tabs

| Tab | Panel | Load Function | Data Source |
|-----|-------|---------------|-------------|
| 1 Campaign Optimisation | panel-1 | `thLoadReq1(from,to)` | `?type=req1` |
| 2 Search Term Optimisation | panel-2 | `r2SetRangeLive(key)` | `?type=req2` |
| 3 Feed Optimisation | panel-3 | `thLoadFeed(3)` | `?type=feed` |
| 4 Stock Status | panel-4 | `thLoadFeed(4)` | `?type=feed` (shared with R3) |

**Lazy loading:** Tab 1 loads on page open. Tabs 2/3/4 load on first click. Feed (Req3+4) also pre-loads 800ms after page open.

---

## Frontend — `pages/theekshy.html`

### State variables
```javascript
var DAILY = [];      // populated by thLoadReq1 → [{d, cid, cost, clicks, imp, conv, cv, ctr}]
var PRODUCTS = [];   // populated by thLoadReq1 → [{cid, pid, title, cost, clicks, imp, conv, cv}]
var PROD_META = {};  // populated by thLoadReq1 → {pid: {ptitle, sku, url, variant}}
var R3_DATA = [];    // populated by thLoadFeed → [{id, cid, cost, ..., gmc_avail, shop_price, ...}]
var R4_DATA = [];    // populated by thLoadFeed → [{pid, cid, camp, inv, gmc_avail, gmc_p, ...}]
var TH_FROM = '', TH_TO = '';
var TH_LOADED = {r1:false, r2:false, r3:false, r4:false};
```

### Key functions
| Function | Purpose |
|----------|---------|
| `thLoadReq1(from, to)` | Fetch Req 1 data, populate DAILY+PRODUCTS+PROD_META, render all |
| `thSetPreset(days)` | Date preset (7/30/60/90d) → calls thLoadReq1 |
| `thApplyCustomDates()` | Custom date range → calls thLoadReq1 |
| `thLoadFeed(reqNum)` | Fetch feed API, populate R3_DATA + R4_DATA, render Req 3 or 4 |
| `r2SetRangeLive(key)` | Fetch search terms for selected range, cache in R2_RANGES[key].data |

### Date picker IDs (Req 1)
- `thDateFrom`, `thDateTo` — custom date inputs
- `th-loading-r1`, `th-error-r1` — loading/error state divs

### Init
On page load → `thLoadReq1()` (last 30 days default)  
After 800ms → `thLoadFeed(3)` (pre-loads feed data for Req 3 + 4)

---

## Data Removed from HTML

| What | Lines removed |
|------|--------------|
| `DAILY` array | 63 rows (30 days × 2 campaigns) |
| `PRODUCTS` array | 60 rows (top 30 per campaign) |
| `PROD_META` object | ~65 entries |
| `TERMS_7D` array | ~150 rows |
| `TERMS_30D` array | ~200 rows |
| `R3_DATA` array | ~40 rows |
| `R4_DATA` array | ~60 rows |

**Total:** 1,085 lines removed — 2,666 → 1,581 lines

---

## Vercel Limit Note

Vercel Hobby plan: **12 serverless functions max**. Three separate theekshy files (req1/req2/feed) were consolidated into one `dashboard.js` with `?type=` routing. `check-urls.js` (unused) was also removed to stay within limit.

---

## Deployment

- **Vercel project:** staff-requirements-02
- **Deploy cmd:** `vercel deploy --prod --yes` from `Staff-requirements-02/`
- **Function timeout:** 60s (`vercel.json`)
- **Cache:** `s-maxage=300, stale-while-revalidate=60`
