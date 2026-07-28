# My Working Platform & Live Data System — GPT Context Prompt

Paste this entire document at the start of a GPT conversation before asking for help.

---

## Who I Am

I run a digital marketing reporting system for **LEDSone** — a lighting e-commerce business with stores in the UK, France, and Germany. I manage a team of staff members and build live data dashboards to track their SEO and Google Ads work.

My role: building and maintaining the reporting infrastructure, verifying staff work, and tracking performance.

---

## The Business

| Store | Domain | Market |
|---|---|---|
| LEDSone UK | ledsone.co.uk | United Kingdom |
| LEDSone FR | ledsone.fr | France |
| LEDSone DE | ledsone.de | Germany |

Platform: **Shopify** (all three stores)  
Ads: **Google Ads** (Shopping campaigns)  
SEO tracking: **Google Search Console (GSC)**  
Analytics: **GA4**

---

## My Tech Stack

### Database
- **PostgreSQL** at `207.148.78.148:5432`
- Database name: `ledsone`
- Read-only user: `dbhub_readonly`
- SSL: disabled
- Password stored as `DATABASE_URL` environment variable in Vercel — never written in code
- Contains: Google Ads data, GSC data, Shopify listings, inventory stock levels, merchant feed data

### Hosting & API
- **Vercel** (Hobby plan, max 12 serverless functions)
- Active repo: `Staff-requirements-02` — 6 members, all live PostgreSQL data
- API files live in `/api/member/dashboard.js`
- All APIs use **Node.js + `pg` library** (CommonJS `module.exports`)
- No Express, no framework — plain Vercel serverless handlers

### Frontend
- Plain **HTML + vanilla JavaScript** (no React, no Vue, no build step)
- Pages live in `/pages/member.html`
- Data is fetched by the page via `fetch()` calls to the API
- Pages start empty — all data is loaded after page open

---

## Key Database Tables

### Google Ads
| Table | What it contains |
|---|---|
| `google_ads.campaign_performance` | Daily: campaign_id, date, impressions, clicks, cost, conversions, conversion_value |
| `google_ads.product_performance` | Daily: campaign_id, product_item_id, date, impressions, clicks, cost, conversions, conversion_value |
| `google_ads.merchant_products` | GMC feed: product_id, title, price, currency, availability, link |

### GSC (Google Search Console)
| Table | What it contains |
|---|---|
| `gsc.search_performance` | Daily: site, date, query, page, clicks, impressions, ctr, position |

*(Exact table/schema names may vary — always verify with a query before assuming)*

### Shopify & Inventory
| Table | What it contains |
|---|---|
| `listings.shopify_listings` | item_id (variant), sku, title, site (France/UK/Germany), status, listing_url |
| `inventory.products` | sku, id (inventory ID) |
| `inventory.physical_product_stock` | inventory (FK to products.id), quantity |

### Product ID Format in Google Ads
Product IDs in `product_performance` come in two formats:
```
Format A: shopify_zz_PRODUCTID_VARIANTID   → extract: SPLIT_PART(LOWER(id), '_', 4)
Format B: 42152340324427                   → use directly
```
The extracted value joins to `shopify_listings.item_id` and `merchant_products.product_id`.

---

## Active Working Repo — Staff-requirements-02

This is the **current active repo** for new development. Use this for all new work unless told otherwise.

| Item | Value |
|---|---|
| **Local folder** | `C:\Users\PC\Documents\piranav_aios\Staff-requirements-02` |
| **Git repo** | `https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios` (branch: `main`) |
| **Subfolder in repo** | `Staff-requirements-02/` |
| **Vercel project** | `staff-requirements-02` |
| **Live URL** | `https://staff-requirements-02.vercel.app` |
| **Vercel team** | `digitalmarketing69140951-sys-projects` |
| **Database** | PostgreSQL · host `207.148.78.148` · port `5432` · db `ledsone` |
| **DB user** | `dbhub_readonly` (read-only) |
| **DB env var** | `DATABASE_URL` (set in Vercel — never in code or Git) |

### Folder structure
```
Staff-requirements-02/
├── index.html              ← member directory (6 members)
├── package.json            ← { "dependencies": { "pg": "^8.11.5" } }
├── pages/
│   ├── sajeepan.html
│   ├── sonya.html
│   ├── hetheesha.html
│   ├── jakshan.html
│   ├── theekshy.html
│   └── thivajini.html
├── api/
│   └── sonya/
│       └── campaign-performance.js   ← CommonJS, module.exports
└── assets/ scripts/
```

### Deploy command
```bash
cd "C:\Users\PC\Documents\piranav_aios\Staff-requirements-02"
vercel --prod
```

### Git push
```bash
cd "C:\Users\PC\Documents\piranav_aios"
git add Staff-requirements-02/
git commit -m "..."
git push
```

---

## My Staff Members & Their Dashboards

Each staff member has:
- A dashboard page: `pages/membername.html`
- An API file: `api/membername/dashboard.js`
- Requirements (Req 1, 2, 3 etc.) shown as tabs

| Member | Focus | Store | Live Reqs |
|---|---|---|---|
| Hetheesha | SEO & Digital Marketing | ledsone.fr | 4 |
| Jakshan | SEO & Digital Marketing | ledsone.co.uk | 2 |
| Sajeepan | Google Ads | ledsone.de | 1 |
| Sonya | Google Ads | UK | 5 |
| Theekshy | Digital Marketing | (mixed) | 4 |
| Thivajini | Digital Marketing · Google Ads FR | ledsone.fr | 4 |

---

## How Live Data Works (The 3-Layer System)

### Layer 1 — Database (PostgreSQL)
Raw data synced daily from Google Ads, GSC, Shopify, inventory systems.

### Layer 2 — API Function (Vercel Serverless)
A Node.js file in `/api/` that:
1. Reads `DATABASE_URL` from environment variables
2. Connects to PostgreSQL using the `pg` library
3. Runs SQL queries with parameterized inputs (`$1`, `$2` etc.)
4. Calculates derived values in JavaScript (ROAS, segments, stock flags)
5. Returns clean JSON: `{ ok: true, data: [...] }`

Cache headers on every response: `Cache-Control: s-maxage=300, stale-while-revalidate=60`

### Layer 3 — HTML Dashboard (Browser)
The HTML page:
1. Starts with empty data arrays (`var ROWS = [];`)
2. On load, calls `fetch('/api/member/dashboard?type=req1')`
3. Shows a loading spinner while waiting
4. On response, fills in tables/charts
5. Uses lazy loading — tabs only fetch data when clicked

---

## Standard API File Pattern

Every API file follows this exact structure:

```javascript
const { Client } = require('pg');

const CAMPAIGNS = [23103582865, 23533025729]; // campaign IDs for this member

async function handleReq1(client, fromDate, toDate) {
  const { rows } = await client.query(`
    SELECT ... FROM google_ads.campaign_performance
    WHERE campaign_id = ANY($1::bigint[]) AND date BETWEEN $2 AND $3
    ...
  `, [CAMPAIGNS, fromDate, toDate]);

  return { weeks: rows.map(r => ({ ... })) };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, error: 'DATABASE_URL not configured' });

  const client = new Client({ connectionString: connStr, ssl: false,
    connectionTimeoutMillis: 15000, statement_timeout: 55000 });
  try {
    await client.connect();

    // Auto date range: find latest data date, count back from there
    const { rows } = await client.query(
      `SELECT MAX(date) AS latest FROM google_ads.campaign_performance WHERE campaign_id = ANY($1::bigint[])`,
      [CAMPAIGNS]
    );
    const d = new Date(rows[0].latest);
    const toDate = d.toISOString().slice(0, 10);
    const f = new Date(d);
    f.setDate(f.getDate() - 89); // 90 days default
    const fromDate = f.toISOString().slice(0, 10);

    const type = req.query.type || 'req1';
    let result;
    if (type === 'req1') result = await handleReq1(client, fromDate, toDate);
    else return res.status(400).json({ ok: false, error: 'Unknown type' });

    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    await client.end().catch(() => {});
  }
};
```

---

## Standard Segment Classification (Google Ads Products)

Used across multiple dashboards to classify product performance:

| Segment | Condition |
|---|---|
| Zombie | impressions = 0 |
| Low Engagement | clicks = 0 |
| Hero | conv > 0, ROAS ≥ 400%, clicks ≥ 15 |
| Green | conv > 0, ROAS ≥ 400%, clicks < 15 |
| Amber | conv > 0, ROAS 300–399% |
| Orange | conv > 0, ROAS 250–299% |
| High Priority Cut | conv > 0, ROAS < 250% |
| Bleeding | conv = 0, clicks ≥ 5 |
| Monitor Cut | conv = 0, clicks < 5 |

ROAS = (conversion_value / cost) × 100

---

## Standard Stock Flags (Inventory Tracker)

| Flag | Condition |
|---|---|
| STOP | stock = 0 AND spend > 0 (spending money on out-of-stock product) |
| ACT SOON | stock ≤ 5 AND stock > 0 |
| MONITOR | stock = null (no inventory data found) |
| OK | stock > 5 |

---

## Vercel Constraints

- Hobby plan: **max 12 serverless functions** (currently using 10)
- Functions must be CommonJS (`module.exports`, not `export default`)
- No persistent connections — every request creates and closes a DB connection
- `DATABASE_URL` is the only environment variable for DB access
- Auto-deploys on `git push` to `main`
- Function timeout: up to 55 seconds (set via `statement_timeout` in DB query)

---

## Hetheesha's Work Tracker (New — In Planning)

A new dashboard is being built: `pages/hetheesha-work-tracker.html`

Purpose: Track Hetheesha's SEO fix progress across Requirements 1–5.

Key rules:
- **14-day** before/after comparison window (not 28)
- Baseline = original audit values, frozen as a snapshot (never changes)
- Fix detection via Shopify API (meta/page state) and live URL fetch
- Status states: `Pending → Verified → Monitoring → Improved / Declined / Reopened`
- Performance data (GSC clicks, impressions, position) shown after fix — but the dashboard **must not claim the fix caused the change** (attribution disclaimer required)
- `Monitoring` state shown until 14 days of post-fix GSC data has accumulated
- Progress bars per requirement showing % of issues resolved

---

## What I Need From GPT

When I ask for help, please:

1. **Write code in the exact patterns above** — CommonJS, `pg` library, parameterized queries, no framework
2. **Never put credentials in code** — always `process.env.DATABASE_URL`
3. **Keep HTML in vanilla JS** — no React, no build tools, no npm for the frontend
4. **Respect the 12-function Vercel limit** — combine multiple requirements into one file using `?type=` routing
5. **Always use parameterized SQL** (`$1`, `$2`) — never string interpolation in queries
6. **Match the JSON shape** the HTML already expects — if I share the HTML's render function, match what it reads
7. **Be specific about which table/column** — don't assume schema, ask if unsure
8. If I share a SQL query, **test the logic before wrapping in API code**
