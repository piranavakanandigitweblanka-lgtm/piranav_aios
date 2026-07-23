# Hetheesha Dashboard

**File:** `pages/hetheesha.html`
**Title:** Hetheesha — SEO Requirements | ledsone.fr
**Store:** ledsone.fr (Shopify: jedsz8-km.myshopify.com)
**Last updated:** 2026-07-23

---

## Purpose

SEO and content audit dashboard for ledsone.fr (French store). Covers top-selling product meta descriptions, collection page performance, duplicate page detection, and high-traffic stock alerts — all in one tabbed interface.

---

## Structure — 5 Tabs

| Tab | Requirement | Title |
|---|---|---|
| 1 | Req 1 | Top-Selling Products SEO Report |
| 2 | Req 2 | Collection Performance Dashboard |
| 3 | Req 3 | Duplicate Page Analysis |
| 4 | Req 4 | High-Traffic Stock Alert — Variant Level |
| 5 | Req 5 | SEO Tracking (fixes + new issues) |

---

## Data Architecture

**Mixed: static embedded + live API**

| Tab | Data source | Method |
|---|---|---|
| Tab 1 (Products SEO) | Static JS array in HTML + Shopify GQL live call | `fetch('/api/hetheesha/req1')` |
| Tab 2 (Collections) | Static JS array in HTML + GSC from DB | `fetch('/api/hetheesha/req2')` |
| Tab 3 (Duplicates) | Static JS array in HTML | Embedded |
| Tab 4 (Stock Alert) | Static JS array in HTML | Embedded |
| Tab 5 (SEO Tracker) | Static JS array in HTML | Embedded |

---

## API Routes

### `/api/hetheesha/req1.js`

**Purpose:** Enriches static product list with live Shopify metafield data (FAQ schema) and GSC impressions/CTR.

**Shopify call:**
```
Store: jedsz8-km.myshopify.com
GraphQL: metafield(namespace: "custom", key: "faq_schema") { value }
```

**DB query:**
```sql
-- GSC impressions and CTR per product handle (rolling 30 days)
FROM google_search_console.gsc_web_page  -- or similar table
WHERE handle = $1
```

**Returns per product:** handle, revenue, meta_title, meta_description, alt_text count, impressions, CTR, FAQ status (Present / Missing)

---

### `/api/hetheesha/req2.js`

**Purpose:** Enriches collection list with live GSC data.

**DB query:**
```sql
SELECT page, clicks, impressions, ctr, position
FROM google_search_console.page  -- or gsc_web_page
WHERE sub_source = $1 AND search_type = 'web'
```

**Returns per collection:** handle, clicks, impressions, CTR, position, FAQ status

---

## Tables Used

| Schema | Table | Purpose |
|---|---|---|
| `google_search_console` | `gsc_web_page` / `page` | Impressions, CTR, position per URL |
| Shopify API | metafields | FAQ schema presence check |

---

## Static Data Source

Product revenue and meta content are hardcoded in the HTML as a JS array — sourced from a one-time Shopify export or manual audit. The API layer adds live GSC metrics on top.

---

## Key Logic

- **FAQ check:** Shopify metafield `custom.faq_schema` — Present if value exists, Missing if null
- **Meta description audit:** Compares current meta description against recommended text
- **Alt text count:** Number of images with alt text on the product
- **SEO Tracker (Tab 5):** Manual fix tracking — fixed issues vs new issues detected since last audit date

---

## Known Limitations

- GSC data in DB may not cover ledsone.fr (noted in tbar: "GA4 N/A for ledsone.fr in DB")
- Product revenue is static — not recalculated from live orders
- Duplicate detection is based on static crawl data, not real-time
