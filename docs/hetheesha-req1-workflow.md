# Hetheesha — Requirement 1: Live SEO Dashboard & Fix Tracker

**Requirement ID:** HETH-R1
**Staff owner:** Hetheesha
**Supporting staff:** Piranav
**Store:** ledsone.fr
**Dashboard:** https://staff-requirements-02.vercel.app (Fix Tracker tab)
**Status:** COMPLETED — Validated 2026-07-20
**Last updated:** 2026-07-20

---

## Business Question

Which top 50 revenue-generating products on ledsone.fr currently have missing SEO fields, and which previously missing fields has Hetheesha fixed?

## Purpose

Provide Hetheesha with a live, ranked view of ledsone.fr's top 50 products (by rolling 30-day revenue), showing current SEO health (meta title, meta description, alt text, FAQ schema) and a Fix Tracker comparing the Jul 06 2026 baseline to live Shopify values so that fixed fields are acknowledged date-wise.

---

## Architecture

```
Browser (hetheesha.html)
  │
  └── fetch /api/hetheesha/req1  (Vercel serverless function, maxDuration: 60s)
          │
          ├── PostgreSQL DB (read-only, dbhub_readonly)
          │     ├── order_management.orders + order_item_info
          │     │     → Top 50 products by rolling 30-day revenue (sub_source_id=233)
          │     └── google_search_console.page
          │           → Impressions + CTR (rolling 30-day, sub_source=233)
          │
          └── Shopify Admin GraphQL (live, API 2025-01)
                Store: jedsz8-km.myshopify.com (ledsone.fr)
                Token: SHOPIFY_FR_TOKEN (Vercel env var — never hardcoded)
                Batches of 10 handles per call (5 calls for 50 products)
                Fields: seo.title, seo.description, images(first:50).altText,
                        metafield(namespace:"custom", key:"faq_schema")
```

---

## Files Involved

| File | Role |
|------|------|
| `Staff-requirements-02/api/hetheesha/req1.js` | Vercel serverless API — DB + Shopify queries, tracker builder |
| `Staff-requirements-02/pages/hetheesha.html` | Dashboard UI — main SEO table + Fix Tracker tab |
| `Staff-requirements-02/vercel.json` | maxDuration: 60s for all API functions |

---

## Environment Variables (names only — no values)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (passed to pg Client explicitly) |
| `SHOPIFY_FR_TOKEN` | Shopify Admin GraphQL token for ledsone.fr (jedsz8-km) |

---

## Source-to-Target Data Map

| Dashboard Field | Canonical Source | Transformation / Rule |
|----------------|-----------------|----------------------|
| Product / revenue ranking | `order_management.orders` + `order_item_info` | Top 50 by SUM(item_price × item_quantity), completed orders, rolling 30d, sub_source_id=233 |
| Impressions | `google_search_console.page` | SUM(impressions), rolling 30d, sub_source=233, page LIKE '%/products/%' |
| CTR | `google_search_console.page` | ROUND(AVG(ctr) × 100, 2), same filter |
| Meta Title | Shopify `product.seo.title` | Current live value via GraphQL |
| Meta Description | Shopify `product.seo.description` | Current live value via GraphQL |
| Alt Text Missing | Shopify `product.images(first:50)` | Count of images where altText is null or empty string |
| FAQ Schema | Shopify `metafield(namespace:"custom", key:"faq_schema")` | Present when metafield.value is non-null/non-empty |
| Fixed / Pending | Jul 06 2026 SNAPSHOT array vs live Shopify | now_fixed = field was missing in snapshot AND live value is now present |
| Fix Date | Browser `localStorage` key `heth_fix_dates_v1` | First detection date per browser — not stored in DB |

---

## PostgreSQL Sources

- Schema: `order_management` — tables: `orders`, `order_item_info`
- Schema: `google_search_console` — table: `page`
- DB user: `dbhub_readonly` (READ ONLY — cannot CREATE TABLE, INSERT, or UPDATE)
- ledsone.fr identifier: `sub_source_id = 233`
- Connection pattern: `new Client({ connectionString: process.env.DATABASE_URL })`
- Note: `new Client()` with no args defaults to localhost → causes ECONNREFUSED. Must pass DATABASE_URL explicitly.

---

## Shopify Source

- Store: `jedsz8-km.myshopify.com` (ledsone.fr)
- API version: `2025-01`
- Auth: environment variable `SHOPIFY_FR_TOKEN`
- Query pattern: `products(first: N, query: "handle:A OR handle:B")`
- Batch size: 10 handles per request → 50 products = 5 API calls
- Fields fetched per product: `seo.title`, `seo.description`, `images(first:50).altText`, `metafield(namespace:"custom", key:"faq_schema")`
- **Critical note:** `product(handle:)` does NOT exist in API 2025-01. Must use `products(query:)`.

---

## Rolling Date Logic

Revenue and GSC queries use:

```sql
BETWEEN CURRENT_DATE - INTERVAL '30 days' AND CURRENT_DATE
```

This rolls forward automatically every day. No manual update needed. The `period` field in the API response reflects the rolling window at time of call.

---

## Top-50 Ranking Logic

Revenue query groups by product handle, computes `SUM(CAST(item_price AS NUMERIC) * CAST(item_quantity AS INTEGER))` for `status = 'Completed'` orders within the rolling window, orders `DESC`, `LIMIT 50`. Rank is the row position (1 = highest revenue).

---

## Fix Tracker Baseline

- Hardcoded as `SNAPSHOT` array in `Staff-requirements-02/api/hetheesha/req1.js` (lines 13–64)
- Baseline date: **Jul 06 2026**
- Contains 50 products with their Jul 06 values for: meta title (`mtr`), meta desc (`mdr`), alt count (`alt`), FAQ (`faq`)
- Only fields that were MISSING in this baseline enter the Fix Tracker. Fields already OK on Jul 06 are not tracked.

---

## Fix Detection Logic

`buildTracker()` in `req1.js` (lines 138–172):

For each of the 50 snapshot products, for each of 4 fields:
1. Check if snapshot value was missing (null for meta title/desc, >0 for alt, 'Missing' for FAQ)
2. If not missing → skip (not tracked)
3. If missing → compare against current live Shopify value
4. `now_fixed = true` if live value is now present

Result: `tracker` array with `{ rank, handle, field, field_key, before, after, was_missing, now_fixed, live_value }`

---

## Fix-Date Storage

- Storage: Browser `localStorage`, key: `heth_fix_dates_v1`
- Format: `{ "handle|field_key": "ISO date string" }`
- Written: First time dashboard detects `now_fixed: true` for a given field
- Persists across page loads in the same browser
- **Limitation:** Per-browser only. A different browser or device will not show recorded fix dates — but fixed/pending status remains accurate because it comes live from Shopify, not localStorage.

---

## Auto-Update Schedule

| Data | Refresh trigger |
|------|----------------|
| Revenue ranking (top 50) | Every page load — rolling 30d window shifts daily |
| GSC impressions / CTR | Every page load — rolling 30d window shifts daily |
| Meta title / desc / alt / FAQ | Every page load — live Shopify GraphQL |
| Fix Tracker status (fixed/pending) | Every page load — live Shopify vs Jul 06 baseline |
| Fix dates | Browser localStorage — recorded once on first detection |

---

## Known Limitations

1. Fix dates are browser-specific (localStorage) — DB is read-only, cannot store fix dates server-side
2. `shopify_listing_meta` DB table is ~14% populated for ledsone.fr — **not used, not an approved SEO source for this requirement**
3. Shopify API makes 5 batched calls for 50 products — total load time ~5–10s
4. Vercel function timeout: 60s (configured in `vercel.json`)
5. `DATABASE_URL` must be explicitly passed to pg Client — `new Client()` with no args causes `ECONNREFUSED 127.0.0.1:5432`
6. Revenue data limited to `status = 'Completed'` orders only
7. API response is cached by Vercel for 300s (`s-maxage=300`) with stale-while-revalidate of 600s

---

## Validation Performed

Validated 2026-07-20 by Piranav / Claude Code.
Evidence: `evidence/hetheesa/req1/HETH-R1-evidence-2026-07-20.md`

---

## Pass/Fail Rule

PASS when all of the following are true:
- Live endpoint returns `ok: true`
- `row_count = 50`
- `tracker_count > 0`
- No secrets hardcoded in tracked files
- Rolling date (`CURRENT_DATE - INTERVAL '30 days'`) confirmed in `req1.js`
- `maxDuration: 60` confirmed in `vercel.json`

---

## Systems Touched

- Vercel (serverless function deployment)
- PostgreSQL (`dbhub_readonly` — read only)
- Shopify Admin GraphQL (`jedsz8-km.myshopify.com`, API 2025-01)
- Browser localStorage (`heth_fix_dates_v1`)

## Systems NOT Touched

- PostgreSQL write operations (none — read-only)
- `shopify_listing_meta` table (not used)
- Any other staff member's dashboard or files
- Shopify storefront / theme files
- GA4 / Google Ads data sources
