# Live Dashboard Architecture
## How Data Flows from PostgreSQL → API → Browser

**Project:** Staff Requirements Dashboard (LEDSone)  
**Repo:** `Staff-requirements-02` (active — 6 members, live PostgreSQL data)  
**Date:** 2026-07-28

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Layer 1 — The Database](#2-layer-1--the-database)
3. [Layer 2 — The API Function](#3-layer-2--the-api-function)
4. [Layer 3 — The HTML Dashboard](#4-layer-3--the-html-dashboard)
5. [Full Request Lifecycle](#5-full-request-lifecycle)
6. [How an API File Is Built](#6-how-an-api-file-is-built)
7. [How the Dashboard Updates Itself](#7-how-the-dashboard-updates-itself)
8. [Caching Strategy](#8-caching-strategy)
9. [Lazy Tab Loading](#9-lazy-tab-loading)
10. [Error Handling](#10-error-handling)
11. [Adding a New Member Dashboard](#11-adding-a-new-member-dashboard)
12. [File Reference Map](#12-file-reference-map)

---

## 1. System Overview

The dashboard is a **three-layer system**. Each layer has one job:

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3 — Browser (HTML + JavaScript)                      │
│  pages/thivajini.html                                       │
│  • Draws the UI (tables, tabs, KPI cards)                   │
│  • Calls the API when a tab is opened                       │
│  • Fills in data when the API responds                      │
└────────────────────────┬────────────────────────────────────┘
                         │  HTTP GET /api/thivajini/dashboard?type=req2
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2 — Vercel API Function (Node.js / JavaScript)       │
│  api/thivajini/dashboard.js                                 │
│  • Receives the request                                     │
│  • Connects to PostgreSQL                                   │
│  • Runs SQL queries                                         │
│  • Calculates segments, flags, ROAS                         │
│  • Returns clean JSON to the browser                        │
└────────────────────────┬────────────────────────────────────┘
                         │  SQL query over TCP
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1 — PostgreSQL Database (207.148.78.148:5432)        │
│  database: ledsone  |  user: dbhub_readonly                 │
│  • google_ads.campaign_performance                          │
│  • google_ads.product_performance                           │
│  • google_ads.merchant_products                             │
│  • listings.shopify_listings                                │
│  • inventory.products / physical_product_stock              │
└─────────────────────────────────────────────────────────────┘
```

**Key rule:** The browser never talks to the database directly. All database access goes through the API layer. The browser only ever sees JSON.

---

## 2. Layer 1 — The Database

### Connection Details

| Field | Value |
|---|---|
| Host | `207.148.78.148` |
| Port | `5432` |
| Database | `ledsone` |
| User | `dbhub_readonly` |
| SSL | disabled (`ssl: false`) |
| Password | stored as `DATABASE_URL` environment variable in Vercel (never in code) |

The connection string format is:
```
postgresql://dbhub_readonly:PASSWORD@207.148.78.148:5432/ledsone
```

### Key Tables

#### `google_ads.campaign_performance`
One row per campaign per day. Used for Req 1 (weekly campaign trends).

| Column | Type | Example |
|---|---|---|
| `date` | date | `2026-07-13` |
| `campaign_id` | bigint | `23103582865` |
| `impressions` | int | `9503` |
| `clicks` | int | `165` |
| `cost` | float | `55.62` |
| `conversions` | float | `2.0` |
| `conversion_value` | float | `68.31` |

#### `google_ads.product_performance`
One row per product per campaign per day. Used for Req 2 and Req 3.

| Column | Type | Example |
|---|---|---|
| `date` | date | `2026-07-13` |
| `campaign_id` | bigint | `23103582865` |
| `product_item_id` | text | `shopify_zz_7594635558987_42152340324427` |
| `impressions` | int | `500` |
| `clicks` | int | `12` |
| `cost` | float | `6.85` |
| `conversions` | float | `2.0` |
| `conversion_value` | float | `99.96` |

#### `google_ads.merchant_products`
Google Merchant Centre feed — titles, prices, URLs, availability. Used to show product names and prices.

| Column | Type | Example |
|---|---|---|
| `product_id` | text | `42152340324427` |
| `currency` | text | `EUR` |
| `title` | text | `LEDSone Lustre Araignée...` |
| `price` | float | `121.83` |
| `availability` | text | `in stock` |
| `link` | text | `https://ledsone.fr/...` |

#### `listings.shopify_listings`
Shopify variant data per store. Used to get SKU from a variant ID.

| Column | Type | Example |
|---|---|---|
| `item_id` | bigint | `42152340324427` |
| `site` | text | `France` |
| `sku` | text | `ENC2002` |
| `title` | text | `Default Title` |
| `status` | text | `active` |

#### `inventory.products` + `inventory.physical_product_stock`
Warehouse stock levels. Joined via SKU.

```sql
SELECT p.sku, SUM(ps.quantity) AS stock
FROM inventory.products p
JOIN inventory.physical_product_stock ps
  ON ps.inventory::varchar = p.id::varchar
WHERE p.sku = 'ENC2002'
GROUP BY p.sku
-- Returns: stock = 45
```

### Product ID Format

Product IDs in `product_performance` come in two formats:

```
Format A (Shopify):  shopify_zz_PRODUCTID_VARIANTID
Example:             shopify_zz_7594635558987_42152340324427
Extract variant:     SPLIT_PART(LOWER(id), '_', 4)  →  42152340324427

Format B (plain):    42152340324427
Use directly as variant ID
```

This extracted variant ID is what joins to `shopify_listings.item_id` and `merchant_products.product_id`.

---

## 3. Layer 2 — The API Function

### What is a Vercel API Function?

A file placed in the `/api/` folder is automatically turned into an HTTP endpoint by Vercel. No server setup needed.

```
File:     api/thivajini/dashboard.js
URL:      https://your-project.vercel.app/api/thivajini/dashboard
Method:   GET
```

### Structure of Every API File

Every API file follows the same pattern:

```javascript
// 1. Import the PostgreSQL client
const { Client } = require('pg');

// 2. Define constants (campaign IDs, thresholds)
const TV_CAMPAIGNS = [23103582865, 23533025729, 23405519670];

// 3. Define helper functions (classification logic, calculations)
function classify(imp, clicks, conv, cost, cv) { ... }

// 4. Define handler functions per requirement
async function handleReq1(client, fromDate, toDate) { ... }
async function handleReq2(client, fromDate, toDate) { ... }
async function handleReq3(client, fromDate, toDate) { ... }

// 5. Export the main handler — Vercel calls this on each request
module.exports = async function handler(req, res) {

  // 5a. Set response headers
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  // 5b. Read DATABASE_URL from environment variables
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: false });

  try {
    // 5c. Connect to database
    await client.connect();

    // 5d. Determine date range
    // (uses ?from=&to= query params, or auto-detects from latest data)

    // 5e. Route to correct handler based on ?type= param
    const type = req.query.type || 'req1';
    if (type === 'req1') result = await handleReq1(client, fromDate, toDate);
    if (type === 'req2') result = await handleReq2(client, fromDate, toDate);

    // 5f. Return JSON
    return res.status(200).json({ ok: true, ...result });

  } catch (err) {
    // 5g. Return error JSON (never crash silently)
    return res.status(500).json({ ok: false, error: err.message });

  } finally {
    // 5h. Always close the DB connection
    await client.end().catch(() => {});
  }
};
```

### How Date Range is Determined

The API first finds the latest date that exists in the table for these campaigns. Then it counts backwards from that date:

```javascript
// Find the most recent day of data
const { rows } = await client.query(
  `SELECT MAX(date) AS latest FROM google_ads.campaign_performance
   WHERE campaign_id = ANY($1::bigint[])`,
  [TV_CAMPAIGNS]
);
const d = new Date(rows[0].latest);   // e.g. 2026-07-19
toDate = d.toISOString().slice(0, 10); // "2026-07-19"

// Count backwards based on requirement type
if (type === 'req1') f.setDate(f.getDate() - 97);   // ~14 weeks back
if (type === 'req3') f.setDate(f.getDate() - 29);   // 30 days back
else                 f.setDate(f.getDate() - 89);   // 90 days back (req2)

fromDate = f.toISOString().slice(0, 10); // "2026-04-13"
```

This means the dashboard always shows the most recent available data — even if the Google Ads sync is a day or two behind.

### How Req 2 Works (Product Performance + Segment)

```
Step 1: Query product_performance
        → Get all products for these campaigns in the date range
        → SUM impressions, clicks, cost, conversions, conversion_value
        → GROUP BY product_item_id
        → ORDER BY cost DESC LIMIT 800

Step 2: Extract variant IDs from product_item_id
        shopify_zz_7594635558987_42152340324427 → 42152340324427

Step 3: Query merchant_products with those variant IDs
        → Get title, price, availability, URL
        → Store in a lookup map: { variantId: { title, price, ... } }

Step 4: For each product row, combine ad stats + merchant data
        → Calculate CTR, CVR, ROAS, Spend/Price ratio
        → Run classify() to assign segment label
        → Return as product object
```

### Segment Classification Logic

```
Zombie          → impressions = 0
Low Engagement  → clicks = 0
Hero            → conv > 0, ROAS ≥ 400%, clicks ≥ 15
Green           → conv > 0, ROAS ≥ 400%, clicks < 15
Amber           → conv > 0, ROAS 300–399%
Orange          → conv > 0, ROAS 250–299%
High Priority   → conv > 0, ROAS < 250%
Bleeding        → conv = 0, clicks ≥ 5
Monitor Cut     → conv = 0, clicks < 5
```

```javascript
function classify(imp, clicks, conv, cost, cv) {
  if (imp === 0)    return 'Zombie';
  if (clicks === 0) return 'Low Engagement';
  const roas = cost > 0 ? (cv / cost) * 100 : 0;
  if (conv > 0) {
    if (roas >= 400 && clicks >= 15) return 'Hero';
    if (roas >= 400)  return 'Green';
    if (roas >= 300)  return 'Amber';
    if (roas >= 250)  return 'Orange';
    return 'High Priority Cut';
  }
  if (clicks >= 5) return 'Bleeding';
  return 'Monitor Cut';
}
```

### How Req 3 Works (Stock-Spend Tracker)

This is the most complex query — it joins 4 tables:

```
product_performance
    ↓ extract variant_id from product_item_id
listings.shopify_listings (WHERE site='France')
    ↓ get SKU
inventory.products
    ↓ join on SKU → get inventory ID
inventory.physical_product_stock
    ↓ SUM quantity → get stock count
```

Then stock flags are applied in JavaScript (not SQL):

```javascript
let flag = 'OK';
if (stock === 0 && spend > 0)              flag = 'STOP';      // Spending money on OOS product
else if (stock !== null && stock <= 5)     flag = 'ACT SOON';  // Almost out of stock
else if (stock === null)                   flag = 'MONITOR';   // No inventory data found
// else stock > 5                          flag = 'OK'
```

### What the API Returns (JSON Shape)

**Req 1 response:**
```json
{
  "ok": true,
  "weeks": [
    {
      "week": "2026-07-13",
      "camp": "Topsell",
      "cid": "23103582865",
      "ads_conv": 2,
      "ads_val": 68.31,
      "cost": 55.62,
      "imp": 9503,
      "clicks": 165,
      "shop_ord": 0,
      "shop_rev": 0
    }
  ],
  "meta": { "from": "2026-04-13", "to": "2026-07-19" }
}
```

**Req 2 response:**
```json
{
  "ok": true,
  "products": [
    {
      "id": "shopify_zz_7594635558987_42152340324427",
      "t": "LEDSone Lustre Araignée...",
      "av": "in stock",
      "pr": 121.83,
      "im": 7573, "cl": 133, "sp": 27.20, "or": 2, "sa": 140.83,
      "ctr": 1.76, "cvr": 1.5, "roas": 517.76, "spp": 22.4,
      "seg": "Hero"
    }
  ]
}
```

**Req 3 response:**
```json
{
  "ok": true,
  "products": [
    {
      "id": "shopify_zz_7594635558987_42152340324427",
      "sku": "ENC2002",
      "t": "Default Title",
      "st": null,
      "sp": 6.85,
      "fl": "MONITOR",
      "ws": 0
    }
  ]
}
```

---

## 4. Layer 3 — The HTML Dashboard

### Page Structure

```html
<head>
  <!-- CSS styling only — no data -->
</head>
<body>
  <!-- Tab navigation buttons -->
  <nav>
    <button onclick="showTab(1)">Req 1</button>
    <button onclick="showTab(2)">Req 2</button>
    <button onclick="showTab(3)">Req 3</button>
  </nav>

  <!-- Tab panels — empty on page load -->
  <div id="panel-1">
    <table id="r1-table"><!-- filled by JS after fetch --></table>
  </div>
  <div id="panel-2">
    <table id="r2-table"><!-- filled by JS after fetch --></table>
  </div>

  <script>
    // All data variables start empty
    var ROWS = [];       // Req 1 data
    var PRODUCTS = [];   // Req 2 data
    var R3PRODUCTS = []; // Req 3 data

    // Render functions (draw tables from data arrays)
    function renderTable(filter) { ... }  // Req 1
    function r2Render() { ... }           // Req 2
    function r3Render() { ... }           // Req 3

    // Fetch functions (call API, then render)
    function tvLoadReq1() { ... }
    function tvLoadReq2() { ... }
    function tvLoadReq3() { ... }

    // On page load: only fetch Req 1
    document.addEventListener('DOMContentLoaded', function() {
      tvLoadReq1();
      r4Render(); // Req 4 stays hardcoded (no DB source)
    });
  </script>
</body>
```

---

## 5. Full Request Lifecycle

Here is exactly what happens from the moment a user opens the dashboard to when they see data:

```
[0ms]    User opens pages/thivajini.html in browser

[0–50ms] Browser downloads HTML file from Vercel CDN
         → Page structure appears (tabs, empty tables, spinners)
         → CSS styles apply

[50ms]   DOMContentLoaded fires
         → tvLoadReq1() is called
         → TV_LOADED.r1 = true (prevents double-fetch)
         → "Loading weekly campaign data…" appears in panel-1

[50ms]   Browser sends: GET /api/thivajini/dashboard?type=req1
         → Vercel receives the request
         → Checks edge cache → MISS (first load)
         → Spins up dashboard.js function

[50–500ms] dashboard.js runs:
         → Creates PostgreSQL client
         → Connects to 207.148.78.148:5432 (~50ms)
         → Queries MAX(date) to find latest data date
         → Calculates fromDate = latest - 97 days
         → Runs campaign_performance GROUP BY week query
         → Maps rows to { week, camp, cid, ads_conv, ... } objects
         → Closes DB connection

[500ms]  Vercel sends JSON response
         → Sets Cache-Control: s-maxage=300
         → Response cached at edge for 5 minutes

[500–510ms] Browser receives JSON
         → tvHide('panel-1') removes loading spinner
         → ROWS = d.weeks (assigns data to variable)
         → renderTable(null) draws the full weekly table
         → User sees live data

[User clicks "Req 2" tab]

[0ms]    showTab(2) is called
         → Hides panel-1, shows panel-2
         → Calls tvLoadReq2()

[0ms]    tvLoadReq2() runs
         → TV_LOADED.r2 = true
         → "Loading product performance data…" appears
         → Browser sends: GET /api/thivajini/dashboard?type=req2

[0–500ms] Same API lifecycle as above
         → Returns up to 800 products with segment labels

[500ms]  Browser receives JSON
         → PRODUCTS = d.products
         → r2Render() draws the product table
         → User sees Req 2 data
```

---

## 6. How an API File Is Built

### Step-by-Step: Building a New Requirement Handler

**Scenario:** You need to add a new requirement — "Top 20 products by clicks in last 7 days."

#### Step 1 — Write the SQL query first (test in DB tool)

```sql
SELECT
  product_item_id,
  SUM(clicks) AS clicks,
  SUM(cost) AS cost
FROM google_ads.product_performance
WHERE campaign_id IN (23103582865, 23533025729)
  AND date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY product_item_id
ORDER BY clicks DESC
LIMIT 20;
```

Test this in the DB first to confirm it returns the right data.

#### Step 2 — Wrap it in a handler function

```javascript
async function handleReq4(client, fromDate, toDate) {
  const { rows } = await client.query(`
    SELECT
      product_item_id,
      SUM(clicks) AS clicks,
      ROUND(SUM(cost)::numeric, 2) AS cost
    FROM google_ads.product_performance
    WHERE campaign_id = ANY($1::bigint[])
      AND date BETWEEN $2 AND $3
    GROUP BY product_item_id
    ORDER BY clicks DESC LIMIT 20
  `, [TV_CAMPAIGNS, fromDate, toDate]);

  const n = v => Number(v) || 0;
  const products = rows.map(r => ({
    id:     r.product_item_id,
    clicks: n(r.clicks),
    cost:   n(r.cost),
  }));

  return { products };
}
```

**Why parameterized queries ($1, $2, $3)?**  
Never interpolate values directly into SQL strings. This prevents SQL injection and handles type conversion automatically.

#### Step 3 — Add routing in the main handler

```javascript
else if (type === 'req4') result = await handleReq4(client, fromDate, toDate);
```

#### Step 4 — Return and test

The function returns `{ products: [...] }` and the main handler wraps it:
```json
{ "ok": true, "products": [...] }
```

Visit: `https://your-project.vercel.app/api/thivajini/dashboard?type=req4`  
You should see the JSON in your browser.

---

## 7. How the Dashboard Updates Itself

### The Fetch + Render Pattern

Every requirement follows the same three-step pattern in the HTML:

```javascript
// STEP 1: Guard — prevent fetching twice
var TV_LOADED = { r1: false, r2: false, r3: false };

function tvLoadReq2() {
  if (TV_LOADED.r2) return;   // ← already loaded, do nothing
  TV_LOADED.r2 = true;

  // STEP 2: Show loading state
  tvState('panel-2', 'load', 'Loading product performance data…');

  // STEP 3: Fetch from API
  fetch('/api/thivajini/dashboard?type=req2')
    .then(function(r) { return r.json(); })

    // STEP 4: On success — put data in variable, render table
    .then(function(d) {
      tvHide('panel-2');           // remove spinner
      if (!d.ok) {
        tvState('panel-2', 'error', 'Error: ' + d.error);
        return;
      }
      PRODUCTS = d.products;       // store data globally
      r2Render();                  // draw the table

    })
    // STEP 5: On network failure — show error message
    .catch(function(e) {
      tvState('panel-2', 'error', 'Fetch failed: ' + e.message);
    });
}
```

### The Render Function Pattern

The render function reads from the global variable and builds HTML:

```javascript
function r2Render() {
  var tbody = document.querySelector('#r2-table tbody');
  tbody.innerHTML = '';  // clear previous rows

  PRODUCTS.forEach(function(p) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + p.t + '</td>' +
      '<td>' + p.sp.toFixed(2) + '</td>' +
      '<td class="seg-' + p.seg.toLowerCase().replace(/ /g,'-') + '">' + p.seg + '</td>';
    tbody.appendChild(tr);
  });

  // Update KPI totals
  document.querySelector('#r2-total-products').textContent = PRODUCTS.length;
}
```

### Why Separate Fetch and Render?

Because filters work on already-fetched data without re-calling the API:

```javascript
// User clicks a filter button
document.querySelector('#filter-hero').addEventListener('click', function() {
  activeFilter = 'Hero';

  // No fetch needed — data is already in PRODUCTS[]
  // Just re-render with filter applied
  r2Render();
});

function r2Render() {
  var data = activeFilter
    ? PRODUCTS.filter(function(p) { return p.seg === activeFilter; })
    : PRODUCTS;

  // draw table from filtered data...
}
```

---

## 8. Caching Strategy

Every API response includes this header:

```
Cache-Control: s-maxage=300, stale-while-revalidate=60
```

| Term | Meaning |
|---|---|
| `s-maxage=300` | Vercel edge caches the response for 300 seconds (5 minutes) |
| `stale-while-revalidate=60` | After 5 min, serve old cache instantly while fetching fresh data in background |

**What this means in practice:**

```
Request 1 (00:00) → Cache MISS → DB query runs → response cached
Request 2 (00:01) → Cache HIT  → instant response, no DB query
Request 3 (00:04) → Cache HIT  → instant response, no DB query
Request 4 (00:06) → Cache STALE → serve old data instantly + refresh in background
Request 5 (00:07) → Cache HIT  → new fresh data served
```

If 50 people open the dashboard at the same time, the database only gets hit **once**.

The `status.js` endpoint uses a shorter cache:
```
Cache-Control: s-maxage=60, stale-while-revalidate=300
```
Because it's lightweight and changes more often (when new requirements go live).

---

## 9. Lazy Tab Loading

Without lazy loading, opening any dashboard would trigger 3 API calls immediately — even for tabs the user never opens. Lazy loading fixes this.

### How It Works

```javascript
function showTab(n) {
  // Standard tab switching (hide all, show selected)
  document.querySelectorAll('.tab-panel').forEach(function(p) {
    p.classList.remove('active');
  });
  var p = document.getElementById('panel-' + n);
  if (p) p.classList.add('active');

  // Lazy load — only fetch if this tab hasn't been loaded yet
  if (n === 2) tvLoadReq2();   // ← triggered on first click of Req 2 tab
  if (n === 3) tvLoadReq3();   // ← triggered on first click of Req 3 tab
}
```

The `TV_LOADED` guard inside each function ensures it only fetches once, even if the user clicks the tab multiple times.

### Load Sequence

```
Page opens        → tvLoadReq1() fires automatically (Req 1 always needed)
User clicks Req 2 → tvLoadReq2() fires for the first time
User clicks Req 1 → nothing fetched (already loaded)
User clicks Req 2 → nothing fetched (already loaded, TV_LOADED.r2 = true)
User clicks Req 3 → tvLoadReq3() fires for the first time
```

---

## 10. Error Handling

### API-Side Errors

The API wraps everything in try/catch and always returns a JSON response:

```javascript
try {
  await client.connect();
  // ... queries ...
  return res.status(200).json({ ok: true, ...result });

} catch (err) {
  // Classify the error type
  const cause = /timeout|ETIMEDOUT|ECONNREFUSED/i.test(err.message)
    ? 'network_timeout'
    : 'unknown';

  return res.status(500).json({
    ok: false,
    cause: cause,
    error: err.message
  });

} finally {
  await client.end().catch(() => {}); // always close connection
}
```

### Browser-Side Errors

The fetch function handles both network failures and API errors:

```javascript
fetch('/api/thivajini/dashboard?type=req2')
  .then(function(r) { return r.json(); })
  .then(function(d) {
    if (!d.ok) {
      // API returned { ok: false, error: "..." }
      tvState('panel-2', 'error', 'Error loading data: ' + d.error);
      return;
    }
    // success path...
  })
  .catch(function(e) {
    // Network failure — no internet, Vercel down, etc.
    tvState('panel-2', 'error', 'Fetch failed: ' + e.message);
  });
```

The `tvState()` helper shows a styled message box:

```javascript
function tvState(panelId, state, msg) {
  // 'load' → blue info box with loading message
  // 'error' → red error box with error message
}

function tvHide(panelId) {
  // hides both loading and error boxes
}
```

---

## 11. Adding a New Member Dashboard

To add a live dashboard for a new member (e.g., "Dilaksi"):

### Step 1 — Create the API file

```
api/dilaksi/dashboard.js
```

Copy the structure from `api/thivajini/dashboard.js` and update:
- Campaign IDs (get from Google Ads)
- Campaign labels
- SQL queries per requirement
- Segment/flag logic if different

### Step 2 — Add to index badge system

In `api/status.js`:
```javascript
const STATUS = [
  // ... existing members ...
  { id: 'dilaksi', name: 'Dilaksi', reqs: 3 },  // ← add this line
];
```

In `index.html`, add `data-member` and `id="badge-dilaksi"` to her card:
```html
<a class="row" href="pages/dilaksi.html" data-name="dilaksi" data-member="dilaksi">
  <span class="avatar live">D</span>
  <span class="who">...</span>
  <span class="status live" id="badge-dilaksi">3 Reports Live</span>
</a>
```

### Step 3 — Update the HTML page

In `pages/dilaksi.html`:
- Replace hardcoded data arrays with `var ROWS = [];` etc.
- Add `tvLoadReq1()` on DOMContentLoaded
- Add lazy-load hooks in `showTab()`
- Add `tvLoadReq2()`, `tvLoadReq3()` fetch functions pointing to `/api/dilaksi/dashboard`

### Step 4 — Deploy

```bash
git add api/dilaksi/ pages/dilaksi.html api/status.js index.html
git commit -m "feat: Dilaksi live dashboard"
git push
```

Vercel auto-deploys on push to `main`.

---

## 12. File Reference Map

```
Staff-requirements-02/
│
├── index.html                        ← Member directory with live badge counts
│
├── api/
│   ├── status.js                     ← Returns {members: [{id, reqs}]} for index badges
│   │
│   ├── thivajini/
│   │   └── dashboard.js              ← Req1/2/3 data for Thivajini (FR campaigns)
│   │
│   ├── theekshy/
│   │   └── dashboard.js              ← Req1/2/3/4 data for Theekshy
│   │
│   ├── sonya/
│   │   ├── req1.js                   ← Individual req files (older pattern)
│   │   ├── req2.js
│   │   └── ...
│   │
│   └── sajeepan/
│       └── dashboard.js
│
└── pages/
    ├── thivajini.html                ← Dashboard UI (empty on load, filled by JS)
    ├── theekshy.html
    ├── sonya.html
    └── ...
```

### Environment Variables (Vercel Dashboard)

| Variable | Used by | Value |
|---|---|---|
| `DATABASE_URL` | All API files | `postgresql://dbhub_readonly:PASSWORD@207.148.78.148:5432/ledsone` |

Set in: Vercel Dashboard → Project → Settings → Environment Variables

**Never put the password in code or commit it to git.**

---

## Summary

| What | Where | Technology |
|---|---|---|
| Data lives | PostgreSQL at 207.148.78.148 | SQL |
| Data is fetched | `/api/member/dashboard.js` | Node.js + `pg` library |
| Data is displayed | `pages/member.html` | Vanilla JavaScript |
| Deployment | Vercel (auto on git push) | Serverless functions |
| Caching | Vercel edge cache | Cache-Control headers |
| Secrets | Vercel env vars | `DATABASE_URL` |
| DB access | Read-only | `dbhub_readonly` user |
