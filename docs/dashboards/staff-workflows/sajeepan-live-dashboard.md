# Sajeepan Live Dashboard — Staff Requirements 02

**Staff:** Sajeepan  
**Deployed:** https://staff-requirements-02.vercel.app/pages/sajeepan.html  
**Repo:** https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios  
**Last Updated:** 2026-07-17  
**Commit:** 9b4cfdd

---

## Campaign Filter

6 Sajeepan PMax campaign IDs (hardcoded in API — not a name filter):

| Short Name | Campaign ID |
|------------|-------------|
| SJ_PENDANT_KLARNA | 21069663519 |
| HIGH REVENUE PH | 23110323532 |
| SJ_TOP_20 | 23516313256 |
| zero conv2 | 23590572906 |
| SJALL HERO | 22079334413 |
| ALLACRSJ2 Accessories | 21242723265 |

Target ROAS per campaign (not in DB — hardcoded in `dashboard.js`):

| Campaign ID | Target ROAS |
|-------------|-------------|
| 21069663519 | 320% |
| 23110323532 | 320% |
| 23516313256 | 400% |
| 23590572906 | 400% |
| 22079334413 | 380% |
| 21242723265 | 380% |

---

## API Endpoint

**File:** `api/sajeepan/dashboard.js`  
**URL:** `/api/sajeepan/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD`  
**Default:** Last 30 days from MAX(date) in campaign_performance  

**Returns:**
```json
{
  "ok": true,
  "meta": { "from", "to", "prev_from", "prev_to", "total_products" },
  "campaigns": [...],
  "trend": [...],
  "products": [...]
}
```

### campaigns[]
- `id`, `name`, `status`, `budget`, `target_roas`
- `l: { cost, cv, conv, imp, clk, roas }` — selected period
- `prev: { cost, cv, conv, roas }` — same span before selected period

### trend[]
Daily aggregates across all 6 campaigns:
- `d` (MM/DD), `cost`, `cv`, `conv`, `roas`

### products[] (top 500 by revenue)
- `item` (product_item_id), `cid` (campaign_id)
- `cost`, `cv`, `conv`, `imps`, `clicks`, `roas`
- `title`, `img`, `url`, `price`, `avail`, `brand`, `sku`

---

## Tables Used

| Table | Purpose |
|-------|---------|
| `google_ads.campaign_performance` | L + prev period aggregates, daily trend |
| `google_ads.campaigns` | campaign_name, budget, campaign_status |
| `google_ads.product_performance` | product-level metrics (filtered by campaign_id IN list) |
| `google_ads.merchant_products` | title, image_link, link, price, availability, brand, mpn |

**Known missing columns in merchant_products:** `product_type`, `updated_at` — do not add to query.

---

## Prev Period Logic

Same span immediately before `fromDate`:
```
spanDays = toDate - fromDate
prevEnd   = fromDate - 1 day
prevStart = prevEnd - spanDays
```

---

## Frontend — `pages/sajeepan.html`

### State variables
```javascript
var CAMPAIGNS = [], TREND = [], PRODUCTS = [], sjMeta = {};
const CAMP_MAP = {};   // rebuilt on each load
```

### Key functions
| Function | Purpose |
|----------|---------|
| `sjSetPreset(days)` | Set date range and trigger load |
| `sjApplyCustomDates()` | Load custom date range from inputs |
| `sjRefresh()` | Re-fetch current date range |
| `sjLoadData(from, to)` | Fetch API, populate all state, render everything |
| `renderKpis()` | Update 8 KPI cards from CAMPAIGNS totals |
| `renderCampaigns()` | Campaign cards with ROAS bar |
| `buildActions()` | Generate action items dynamically from live data |
| `renderActions()` | Render action centre (calls buildActions) |
| `buildChart(metric)` | Chart.js trend line from TREND array |
| `renderTopPanels()` | Top 5 by revenue / ROAS / conversions |
| `renderAttn()` | Needs Attention counts |
| `applyFilters()` | Filter PRODUCTS into filteredProds + re-render table |
| `openDrawer(idx)` | Product detail drawer from PRODUCTS[idx] |

### Date picker IDs
- `sj-preset-7/30/60/90` — preset buttons
- `sjDateFrom`, `sjDateTo` — custom date inputs
- `sjLoading`, `sjError` — loading/error state divs

### Init
On DOMContentLoaded → `sjSetPreset(30)` → loads last 30 days automatically.

---

## Action Centre Logic (dynamic)

Actions are generated from live data in `buildActions()`:
1. **Red** — Campaign ROAS < 70% of target
2. **Amber** — Campaign ROAS declined >20% vs prev period (but still above 70% target)
3. **Red** — Products with spend > £10 and 0 conversions (up to 5)
4. **Green** — Products with ROAS ≥ 500% and spend > £5 (scale opportunities)
5. **Amber** — Out-of-stock products that had conversions (wasted budget risk)

---

## Deployment

- **Vercel project:** staff-requirements-02
- **Deploy cmd:** `vercel deploy --prod --yes` from `Staff-requirements-02/`
- **Function timeout:** 60s (set in `vercel.json`)
- **Cache:** `s-maxage=300, stale-while-revalidate=60`
