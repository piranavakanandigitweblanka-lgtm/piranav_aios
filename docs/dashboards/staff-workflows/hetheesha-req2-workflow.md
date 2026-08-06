# Hetheesha — Requirement 2: Live Collection SEO Dashboard & Fix Tracker

**Requirement ID:** HETH-R2
**Staff owner:** Hetheesha
**Supporting staff:** Piranav
**Store:** ledsone.fr
**Dashboard:** https://staff-requirements-02.vercel.app (Requirement 2 tab)
**Status:** COMPLETED — Validated 2026-07-20
**Last updated:** 2026-07-20

---

## Business Question

Which of ledsone.fr's Shopify collections are missing SEO fields (meta title, meta description, FAQ schema), and which previously missing fields has Hetheesha fixed?

## Purpose

Provide Hetheesha with a live view of all ledsone.fr collections showing current SEO health (meta title, meta description, word count, internal links, FAQ schema, GSC traffic) and a Collection Fix Tracker comparing the Jul 06 2026 baseline to live Shopify values so fixed fields are acknowledged date-wise.

---

## Architecture

```
Browser (hetheesha.html — Req 2 tab)
  │
  └── fetch /api/hetheesha/req2  (Vercel serverless, maxDuration: 60s)
          │
          ├── PostgreSQL DB (read-only, dbhub_readonly)
          │     └── google_search_console.page
          │           → Clicks, impressions, CTR, avg position
          │             (rolling 30d, sub_source=233, page LIKE '%/collections/%')
          │
          └── Shopify Admin GraphQL (live, API 2025-01)
                Store: jedsz8-km.myshopify.com (ledsone.fr)
                Token: SHOPIFY_FR_TOKEN (Vercel env var — never hardcoded)
                Paginated: collections(first:100, after:cursor)
                Fields: handle, title, seo{title description},
                        descriptionHtml, metafield(namespace:"custom", key:"faq_schema")
```

---

## Files Involved

| File | Role |
|------|------|
| `Staff-requirements-02/api/hetheesha/req2.js` | Vercel serverless API — GSC DB query + Shopify collections fetch, tracker builder |
| `Staff-requirements-02/pages/hetheesha.html` | Dashboard UI — collection SEO table + Collection Fix Tracker (toggle button near H1) |
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
| Collection handle / title | Shopify Admin GraphQL `collections` | Paginated, all collections |
| Word Count | Shopify `collection.descriptionHtml` | HTML stripped → split on whitespace → count |
| Meta Title (length) | Shopify `collection.seo.title` | `seo.title.length`; 0 = missing |
| Meta Description (length) | Shopify `collection.seo.description` | `seo.description.length`; 0 = missing |
| FAQ Schema | Shopify `metafield(namespace:"custom", key:"faq_schema")` | 1 = present, 0 = missing |
| Internal Links | Shopify `collection.descriptionHtml` | Count of `href=` occurrences in raw HTML |
| GSC Clicks | `google_search_console.page` | SUM(clicks), rolling 30d, sub_source=233 |
| GSC Impressions | `google_search_console.page` | SUM(impressions), rolling 30d |
| GSC CTR | `google_search_console.page` | ROUND(AVG(ctr) × 100, 2) |
| GSC Position | `google_search_console.page` | ROUND(AVG(position), 1) |
| Fixed / Pending | Jul 06 2026 SNAPSHOT2 vs live Shopify | now_fixed = field was missing in snapshot AND live value now present |
| Fix Date | Browser `localStorage` key `heth_fix_dates_r2_v1` | First detection date per browser |

---

## PostgreSQL Sources

- Schema: `google_search_console` — table: `page`
- DB user: `dbhub_readonly` (READ ONLY — cannot CREATE TABLE, INSERT, or UPDATE)
- ledsone.fr identifier: `sub_source = 233`
- Filter: `page LIKE '%/collections/%'`
- Connection pattern: `new Client({ connectionString: process.env.DATABASE_URL })`
- **Note:** `google_search_console.gsc_web_page` does NOT exist. Correct table is `google_search_console.page` with `sub_source = 233`.

---

## Shopify Source

- Store: `jedsz8-km.myshopify.com` (ledsone.fr)
- API version: `2025-01`
- Auth: environment variable `SHOPIFY_FR_TOKEN`
- Query pattern: `collections(first: 100, after: cursor)` — paginated cursor loop
- Fields per collection: `handle`, `title`, `seo { title description }`, `descriptionHtml`, `metafield(namespace: "custom", key: "faq_schema")`
- Pagination: follows `pageInfo.hasNextPage` + `pageInfo.endCursor` until exhausted
- Result: all 65 collections (as of 2026-07-20)

---

## Rolling Date Logic

GSC query uses rolling 30-day window:

```sql
AND p.date BETWEEN CURRENT_DATE - INTERVAL '30 days' AND CURRENT_DATE
```

This rolls forward automatically every day. No manual update needed.

---

## Fix Tracker Baseline — SNAPSHOT2

- Hardcoded as `SNAPSHOT2` array in `Staff-requirements-02/api/hetheesha/req2.js` (lines 12–80)
- Baseline date: **Jul 06 2026**
- Contains 66 collections with their Jul 06 values for: seoTitleLen (`stl`), seoDescLen (`sdl`), hasFAQ (`faq`)
- Only fields that were MISSING in this baseline (value = 0) enter the Fix Tracker
- Fields already present (non-zero) on Jul 06 are not tracked

---

## Fix Detection Logic

`buildTracker2()` in `req2.js`:

For each of the 66 snapshot collections, for each of 3 fields (meta title, meta desc, FAQ):
1. Check if snapshot value was 0 (missing)
2. If not 0 → skip (not tracked)
3. If 0 → compare against current live Shopify value
4. `now_fixed = true` if live value is now present (non-zero / non-null)

Result: `tracker` array with `{ rank, handle, field, field_key, before, now_fixed, live_value }`

---

## Fix-Date Storage

- Storage: Browser `localStorage`, key: `heth_fix_dates_r2_v1`
- Format: `{ "handle::field_key": "YYYY-MM-DD" }`
- Written: First time dashboard detects `now_fixed: true` for a given collection + field
- Persists across page loads in the same browser
- **Limitation:** Per-browser only. Fixed/pending status is always accurate (from live Shopify), only the recorded date is browser-specific.

---

## UI — Toggle Button Pattern

The Collection Fix Tracker is hidden by default inside the Req 2 tab. A **"📋 Fix Tracker"** button sits next to the "Collection Performance Dashboard" H1.

- After live load, the button label updates to show pending count: `"📋 Fix Tracker (N pending)"`
- Clicking opens the tracker panel inline and scrolls to it
- Clicking again collapses it
- The button turns green (inverted) when the tracker is open

Fix Tracker sections inside the panel:
- Progress bar (fixed / total)
- KPI tiles: Fixed · Pending · Total Issues
- Filter buttons: All / Fixed / Pending + Pending Meta Title / Pending Meta Desc / Pending FAQ Schema
- Fixed table (green rows) + Pending table with "Fix on Shopify →" collection admin links
- CSV export

---

## Auto-Update Schedule

| Data | Refresh trigger |
|------|----------------|
| Collection list (handles, titles, word count) | Every page load — live Shopify GraphQL |
| Meta title / desc / FAQ | Every page load — live Shopify GraphQL |
| GSC clicks / impressions / CTR / position | Every page load — rolling 30d window |
| Fix Tracker status (fixed/pending) | Every page load — live Shopify vs Jul 06 baseline |
| Fix dates | Browser localStorage — recorded once on first detection |

---

## Known Limitations

1. GA4 organic sessions / CVR / revenue: NOT available for ledsone.fr in connected DB (GA4 property is ledsone.co.uk only). Columns show `—`.
2. Fix dates are browser-specific (localStorage) — DB is read-only
3. Shopify `collections` API fetches all collections in pages of 100 — fast (1–2 calls total for 65 collections)
4. Vercel function timeout: 60s (configured in `vercel.json`)
5. `google_search_console.gsc_web_page` does NOT exist — correct table is `google_search_console.page` (bug discovered and fixed 2026-07-20)
6. Word count is approximate (strips HTML tags, splits on whitespace)

---

## Validation Performed

Validated 2026-07-20 by Piranav / Claude Code.
Evidence: `evidence/hetheesa/req2/HETH-R2-evidence-2026-07-20.md`

---

## Pass/Fail Rule

PASS when all of the following are true:
- Live endpoint `GET /api/hetheesha/req2` returns `ok: true`
- `collection_count ≥ 60`
- `tracker.length > 0`
- No secrets hardcoded in tracked files
- Rolling date (`CURRENT_DATE - INTERVAL '30 days'`) in `req2.js`
- Correct GSC table: `google_search_console.page` with `sub_source = 233`
- `maxDuration: 60` confirmed in `vercel.json`

---

## Systems Touched

- Vercel (serverless function deployment)
- PostgreSQL (`dbhub_readonly` — read only)
- Shopify Admin GraphQL (`jedsz8-km.myshopify.com`, API 2025-01)
- Browser localStorage (`heth_fix_dates_r2_v1`)

## Systems NOT Touched

- PostgreSQL write operations (none — read-only)
- `order_management` schema (not needed — no revenue data for collections)
- GA4 data (not available for ledsone.fr)
- Any other staff member's dashboard or files
- Shopify storefront / theme files
