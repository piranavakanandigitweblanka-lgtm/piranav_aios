# Hetheesha — Requirement 1: Live SEO Dashboard Workflow

**Store:** ledsone.fr  
**Built:** 2026-07-20  
**Dashboard:** https://staff-requirements-02.vercel.app (Fix Tracker tab)

---

## What Requirement 1 Does

Shows the **top 50 revenue-generating products** on ledsone.fr with live SEO health status — meta title, meta description, alt text, FAQ schema — and a Fix Tracker that records when Hetheesha fixes missing fields.

---

## Architecture

```
Browser (hetheesha.html)
  │
  └── fetch /api/hetheesha/req1  (Vercel serverless function)
          │
          ├── PostgreSQL DB (read-only)
          │     ├── order_management.orders + order_item_info
          │     │     → Top 50 products by revenue (rolling last 30 days)
          │     └── google_search_console.page
          │           → Impressions + CTR (rolling last 30 days)
          │
          └── Shopify Admin GraphQL (live)
                Store: jedsz8-km.myshopify.com (ledsone.fr)
                Token: SHOPIFY_FR_TOKEN (Vercel env var)
                Fetches per product:
                  • seo.title        → meta title
                  • seo.description  → meta description
                  • images(first:50) → count images with no alt text
                  • metafield(namespace:"custom", key:"faq_schema") → FAQ
```

---

## Data Flow Step by Step

### 1. Revenue + GSC (PostgreSQL)
- DB user: `dbhub_readonly` (read-only — cannot write)
- Schema: `order_management`, `google_search_console`
- ledsone.fr identifier: `sub_source_id = 233`
- Date range: **rolling** — `CURRENT_DATE - 30 days` to `CURRENT_DATE`
- Returns top 50 product handles ranked by revenue

### 2. Shopify SEO Data (GraphQL)
- API version: `2025-01`
- Query pattern: `products(first: N, query: "handle:A OR handle:B")` — batches of 10
- Note: `product(handle:)` does NOT exist in API 2025-01 — must use `products(query:)`
- Returns live meta title, description, alt missing count, FAQ status

### 3. Merge & Return
API returns:
```json
{
  "ok": true,
  "fetched_at": "2026-07-20T...",
  "period": "2026-06-20 to 2026-07-20 (rolling 30d)",
  "rows": [ ...50 products... ],
  "tracker": [ ...missing fields with live status... ]
}
```

---

## Fix Tracker

### Baseline
- Snapshot: **Jul 06 2026** — hardcoded in `req1.js` as `SNAPSHOT` array
- Only fields that were **missing on Jul 06** are tracked
- Fields: Meta Title, Meta Desc, FAQ Schema, Alt Text

### How Fix Detection Works
1. API compares Jul 06 snapshot value vs current live Shopify value
2. If field was missing then and is now present → `now_fixed: true`
3. Browser saves fix date to `localStorage` key `heth_fix_dates_v1`
4. Fix date = first time the dashboard detected the fix (browser-stored)

### Why localStorage (not DB)
DB user is `dbhub_readonly` — cannot CREATE TABLE or INSERT.  
localStorage is per-browser. Fix status (fixed/pending) is always accurate from live Shopify — only the fix *date* requires localStorage.

---

## Files

| File | Purpose |
|------|---------|
| `Staff-requirements-02/api/hetheesha/req1.js` | Vercel serverless API — DB + Shopify queries |
| `Staff-requirements-02/pages/hetheesha.html` | Dashboard UI — main table + Fix Tracker tab |
| `Staff-requirements-02/vercel.json` | `maxDuration: 60s` for all API functions |

---

## Environment Variables (Vercel)

| Variable | Value | Used For |
|----------|-------|----------|
| `DATABASE_URL` | postgres://dbhub_readonly@... | PostgreSQL connection |
| `SHOPIFY_FR_TOKEN` | shpat_... | Shopify Admin GraphQL for ledsone.fr |

**Important:** Token must be passed as `new Client({ connectionString: process.env.DATABASE_URL })` — not `new Client()` which defaults to localhost and causes `ECONNREFUSED 127.0.0.1:5432`.

---

## Auto-Update Schedule

| Data | Updates When |
|------|-------------|
| Revenue ranking (top 50) | Every page load — rolling 30-day window shifts daily |
| GSC impressions/CTR | Every page load — rolling 30-day window shifts daily |
| Meta title/desc/alt/FAQ | Every page load — live Shopify GraphQL |
| Fix Tracker status | Every page load — live Shopify vs Jul 06 baseline |
| Fix dates | Browser localStorage — recorded once, persists per browser |

---

## Known Constraints

- `shopify_listing_meta` DB table is only 14% populated for ledsone.fr — **not reliable**, must use Shopify API
- DB is read-only — no writing fix dates to DB
- Shopify query batched at 10 handles per call (50 products = 5 API calls, ~5–10s total)
- Vercel function timeout: 60s (set in vercel.json)
