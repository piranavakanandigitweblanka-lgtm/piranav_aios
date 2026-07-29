# Sonya Dashboard — Build Workflow & Architecture

**Last updated:** 2026-07-29  
**Status:** 5 Requirements Live  
**Live URL:** https://staff-requirements-02.vercel.app/pages/sonya.html

---

## Overview

Sonya manages **Google Ads campaigns for LEDSone UK**. Her dashboard has 5 live requirement tabs, each pulling data from PostgreSQL via separate Vercel serverless API files.

---

## Folder Structure

```
piranav_aios/                          ← Git repo root
└── Staff-requirements-02/
    ├── pages/
    │   └── sonya.html                 ← Full dashboard (all 5 tabs, ~12,500 lines)
    ├── api/
    │   └── sonya/
    │       ├── campaign-performance.js   ← Req 1
    │       ├── product-performance.js    ← Req 2
    │       ├── trend-performance.js      ← Req 3
    │       ├── opportunity.js            ← Req 4
    │       └── stop-waste-spend.js       ← Req 5
    └── package.json                   ← { "dependencies": { "pg": "^8.11.5" } }

AIOS records (in repo root):
├── evidence/sonya/          ← Data validation records per requirement
├── implementation/sonya/    ← Build notes per requirement
└── closure/sonya/           ← Sign-off records per requirement
```

---

## Git & Vercel

| Item | Value |
|---|---|
| **Local path** | `C:\Users\PC\Documents\piranav_aios\Staff-requirements-02` |
| **Git repo** | `https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios` |
| **Branch** | `main` |
| **Subfolder in repo** | `Staff-requirements-02/` |
| **Vercel project** | `staff-requirements-02` |
| **Vercel team** | `digitalmarketing69140951-sys-projects` |
| **Live URL** | `https://staff-requirements-02.vercel.app/pages/sonya.html` |

### Deploy commands
```bash
# Git push (from repo root)
cd "C:\Users\PC\Documents\piranav_aios"
git add Staff-requirements-02/
git commit -m "feat(sonya): ..."
git push

# Vercel deploy (from subfolder)
cd "C:\Users\PC\Documents\piranav_aios\Staff-requirements-02"
vercel --prod
```

> **Note:** Vercel auto-deploys on `git push` to `main` because the project is linked to the repo.

---

## Database

| Item | Value |
|---|---|
| **Host** | `207.148.78.148` |
| **Port** | `5432` |
| **Database** | `ledsone` |
| **User** | `dbhub_readonly` (read-only) |
| **SSL** | Disabled |
| **Env var** | `DATABASE_URL` (set in Vercel dashboard — never in code or Git) |

### How API files connect
```javascript
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  connectionTimeoutMillis: 15000,
  statement_timeout: 55000,
});
```

### Campaign identification
Sonya's campaigns are identified by name pattern in queries — **not a hardcoded ID array**:
```sql
WHERE (c.campaign_name ILIKE '%Sonya%' OR cp.campaign_id = 20810136438)
```
This picks up all campaigns assigned to Sonya plus one legacy campaign by ID.

---

## Requirements — What Each Tab Does

### Req 1 — Campaign Performance (`/api/sonya/campaign-performance`)
- **Source tables:** `google_ads.campaign_performance`, `google_ads.campaigns`
- **Date window:** Accepts `?from=&to=` params; defaults to last 30 days from `MAX(date)`
- **What it returns:** Per-campaign metrics (impressions, clicks, cost, conversions, ROAS, budget, status) across 4 time periods: Last 7d, 14d, 30d, 60d, 90d
- **Special rules:**
  - Only campaigns with `campaign_status = 'ENABLED'` and `serving_status = 'SERVING'` shown as active
  - Budget shown as daily budget from `google_ads.campaigns`
  - ROAS = `conversion_value / cost × 100`

### Req 2 — Product Data (`/api/sonya/product-performance`)
- **Source tables:** `google_ads.product_performance`, `google_ads.campaigns`, `google_ads.merchant_products`, `inventory.physical_product_stock`, `listings.shopify_listings`
- **Date window:** Defaults to last 60 days
- **What it returns:** Per-product metrics + stock level + feed status (availability, price, title from merchant_products)
- **Segment classification:** Hero / Green / Amber / Orange / High Priority Cut / Bleeding / Monitor Cut / Low Engagement / Zombie

### Req 3 — Trend (`/api/sonya/trend-performance`)
- **Source tables:** `google_ads.product_performance`, `google_ads.campaigns`, `google_ads.merchant_products`
- **Date window:** L (last 30d) vs BL (previous 30d baseline)
- **What it returns:** Product-level L vs BL comparison — revenue, cost, ROAS delta, segment movement
- **Special rules:** Baseline frozen as previous period; trend arrows show direction of change

### Req 4 — Opportunity (`/api/sonya/opportunity`)
- **Source tables:** `order_management.orders`, `order_management.order_item_info`, `listings.shopify_listings`, `inventory.physical_product_stock`, `google_ads.merchant_products`, `google_ads.product_performance`
- **Date window:** Last 30 days from `MAX(order_date)`
- **What it returns:** SKUs with >2 non-Google marketplace sales (Amazon/eBay) that are either not in the PMax feed or have low Google impressions — opportunity to push to Google Ads
- **Rule:** `combined non-Google marketplace sales > 2 in L30`

### Req 5 — Stop Waste Spend (`/api/sonya/stop-waste-spend`)
- **Source tables:** `google_ads.campaign_performance`, `google_ads.asset_performance`, `google_ads.pmax_campaign_search_term_data`, `google_ads.campaigns`
- **Date window:** L90d for waste detection; L30 + prev30 + prev60-90 for campaign overview
- **What it returns:**
  - Wasteful assets: `cost > 3, clicks > 2, conversions = 0` over L90
  - Negative keyword candidates: `clicks > 5, conversions = 0` over L90 from search terms
  - Campaign overview: 3-period cost/ROAS comparison (L30, prev30, prev60-90)

---

## How the HTML Page Works

### Tab structure
```html
<!-- Nav -->
<button onclick="showTab(1)">Campaign Data — Requirement 1</button>
<button onclick="showTab(2)">Product Data — Requirement 2</button>
<button onclick="showTab(3)">Trend — Requirement 3</button>
<button onclick="showTab(4)">Opportunity — Requirement 4</button>
<button onclick="showTab(5)">Stop Waste Spend — Requirement 5</button>

<!-- Panels -->
<div id="panel-1">...</div>  <!-- Req 1 -->
<div id="panel-2">...</div>  <!-- Req 2 -->
...
```

### Data loading pattern
- **Req 1** loads on page open automatically
- **Req 2, 3, 4, 5** are lazy-loaded — first `showTab(N)` click triggers `fetch()`
- Each tab has its own `fetch('/api/sonya/...')` call
- Loading spinner shown while fetching; error box shown on failure

### Fetch calls in sonya.html
| Req | Fetch URL |
|---|---|
| 1 | `/api/sonya/campaign-performance?from=&to=` |
| 2 | `/api/sonya/product-performance?from=&to=` |
| 3 | `/api/sonya/trend-performance?from=&to=` |
| 4 | `/api/sonya/opportunity?from=&to=` |
| 5 | `/api/sonya/stop-waste-spend` (no date params — fixed L90 window) |

---

## API File Pattern (all 5 files follow this)

```javascript
const { Client } = require('pg');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, error: 'DATABASE_URL not configured' });

  const client = new Client({ connectionString: connStr, ssl: false,
    connectionTimeoutMillis: 15000, statement_timeout: 55000 });
  try {
    await client.connect();
    // ... queries ...
    return res.status(200).json({ ok: true, ...data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    await client.end().catch(() => {});
  }
};
```

---

## Vercel Function Limits

- Hobby plan: **max 12 serverless functions**
- Sonya uses 5 functions (one per requirement file)
- Current total across all members: ~10 functions
- Each function is one file in `/api/sonya/`

---

## Adding a New Requirement (workflow)

1. **Create API file:** `Staff-requirements-02/api/sonya/req6-something.js`
   - CommonJS (`module.exports`), `require('pg')`, parameterized SQL only
   - Identify Sonya campaigns via `ILIKE '%Sonya%'` or add her campaign IDs
2. **Add tab to sonya.html:**
   - Add `<button onclick="showTab(6)">` in the nav
   - Add `<div id="panel-6">` panel
   - Add lazy-load fetch function triggered on first `showTab(6)` call
3. **Check function count:** `find api -name "*.js" | wc -l` — must stay ≤ 12
4. **Test locally** (open sonya.html from local file or `vercel dev`)
5. **AIOS docs:** Create evidence, implementation, closure docs in the AIOS folders
6. **Deploy:** `cd Staff-requirements-02 && vercel --prod`
7. **Git commit and push** from repo root

---

## Known Constraints

| Constraint | Detail |
|---|---|
| No GA4 data in DB | Bounce rate, ATC rate, engagement time — not available |
| No COGS/margin data | Product profitability calculations not possible |
| Campaign name pattern | Sonya's campaigns identified by `ILIKE '%Sonya%'` — if a campaign is renamed, it drops out |
| Private DB host | `10.8.0.5` (VPN) is inaccessible from Vercel; only `207.148.78.148` (public) works |
| Req 3 history | Was reverted once (2026-07-08) and rebuilt — see `closure/sonya/req3_revert_closure_2026-07-08.md` |
