---
title: Requirement 01 — PostgreSQL Read-Only Inspection
purpose: Document PostgreSQL schema and table discovery for revenue and GSC data
requirement_source: "What I Need to Improve SEO Performance - Hetheesa_.csv"
staff: Hetheesa
supporting_aios: Piranav
date: 2026-07-03
status: PASS — GSC data found; Revenue sourced from Shopify ShopifyQL
---

# PostgreSQL Inspection — Requirement 01

## Scope
READ ONLY inspection. No data was modified, inserted, deleted, updated, or migrated.

## Schemas Discovered
Total user schemas found: 20+

Key schemas relevant to this requirement:
| Schema | Relevance |
|--------|-----------|
| `google_search_console` | GSC web page impressions, CTR, position — USED |
| `raw_data` | gsc_page_daily table — checked but empty for period |
| `analytics` | General analytics — not needed for this requirement |
| `business_intelligence` | BI views — not inspected (not needed) |

## GSC Schema — Tables Found
`google_search_console` schema contains 27 tables including:
- `gsc_web_page` — **USED** — web search performance by page
- `gsc_web_query` — query-level data
- `gsc_web_query_page` — query × page
- `gsc_image_page`, `gsc_news_page`, `gsc_video_page` — other search types
- `ga4_organic_landing_page_revenue` — GA4 organic revenue by landing page
- `ga4_ai_referral_revenue` — AI referral data

## Target Table: google_search_console.gsc_web_page

### Columns
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| site_url | text | Domain identifier |
| date | date | Daily date |
| page | text | Full page URL |
| row_hash | text | Dedup key |
| clicks | bigint | Click count |
| impressions | bigint | Impression count |
| ctr | double precision | Click-through rate (decimal) |
| position | double precision | Average position |

### Data Coverage for ledsone.fr
| site_url | min_date | max_date | rows |
|----------|----------|----------|------|
| https://ledsone.fr/ | 2026-03-20 | 2026-06-30 | 24,378 |

**Note:** GSC data available from 2026-03-20 to 2026-06-30 (most recent: 2026-06-30). The last 30 days from 2026-07-03 would be 2026-06-03 to 2026-07-03, but GSC data ends at 2026-06-30 (3 days lag is normal for GSC). Data used for the period covers approximately 27 of the 30 days.

### Query Used (Read-Only)
```sql
SELECT page, SUM(clicks) as clicks, SUM(impressions) as impressions,
  ROUND(AVG(ctr)::numeric, 4) as avg_ctr,
  ROUND(AVG(position)::numeric, 2) as avg_position
FROM google_search_console.gsc_web_page
WHERE site_url = 'https://ledsone.fr/'
  AND date >= CURRENT_DATE - INTERVAL '30 days'
  AND page LIKE '%/products/%'
GROUP BY page
ORDER BY impressions DESC
LIMIT 100;
```

### Results
100 product pages returned ordered by impressions DESC.  
Top impression page: `multi-shade-2m-pendant-light` (3,143 impressions, 0.06% CTR)

### raw_data.gsc_page_daily
Checked — table exists but returned 0 rows. Data appears to be stored in `google_search_console.gsc_web_page` instead.

## Revenue Data
Revenue was sourced from **Shopify ShopifyQL** (not PostgreSQL) using `run-analytics-query`.  
No order/revenue tables were found in PostgreSQL that could be confirmed as matching Shopify order data. Shopify ShopifyQL was the authoritative source as it directly reflects Shopify order data.

**ShopifyQL query used:**
```
FROM sales SHOW gross_sales, net_sales, orders GROUP BY product_title, product_id
ORDER BY gross_sales DESC LIMIT 50 SINCE -30d UNTIL today
```

## Evidence Path
`C:\Users\PC\Documents\piranav_aios\evidence\hetheesa\requirement-01-postgresql-inspection.md`

## PostgreSQL Source Checked
YES — read-only. No modifications made.

## Validation Result
PASS

## Known Limitations
- Revenue sourced from Shopify (not PostgreSQL) — PostgreSQL has no confirmed order tables linked to Shopify product IDs
- GSC data ends 2026-06-30 (3-day normal lag from GSC pipeline)
- Only top 100 product pages by impression returned; products outside top 100 may have very low/zero impressions in the period

## Reviewer
Piranav (AIOS worker)

## Status
PASS
