---
name: jackshan-r1-postgresql-source-validation
description: PostgreSQL source validation for Jackshan Requirement 1 — 30-day GSC rebuild
metadata:
  type: project
---

# Jackshan Requirement 1 — PostgreSQL Source Validation

**Date:** 2026-07-13  
**Reporting Period:** 2026-06-11 to 2026-07-10 (latest 30 days)  
**Reviewer:** Piranav

---

## PostgreSQL Environments Checked

| Environment | Checked | Used |
|-------------|---------|------|
| ledsone-db | Yes | Yes |
| ledsone-aios-knowledge-base | Yes (metadata) | Yes |

---

## GSC Source

| Field | Value |
|-------|-------|
| Schema | google_search_console |
| Table | query_page |
| Property | sc-domain:ledsone.co.uk |
| Search Type | web |
| Date Range | 2026-06-11 to 2026-07-10 |
| Max Date in DB | 2026-07-10 |
| Min Date in DB | 2026-03-20 |
| Total Distinct Days | 113 |

## Metadata Source

| Field | Value |
|-------|-------|
| Schema | listings |
| Table (products) | shopify_listings |
| Table (meta) | shopify_listing_meta |
| Join | shopify_listing_meta.product_id = shopify_listings.item_id::bigint |
| Filter | is_parent = 1 |
| Match field | shopify_handle = '{handle}' |

---

## Page-Level Metric Calculation

```sql
-- Page totals (all queries for this page in 30-day window)
SELECT
  page,
  SUM(clicks) AS page_clicks,
  SUM(impressions) AS page_impressions,
  ROUND(SUM(clicks)::numeric / NULLIF(SUM(impressions),0) * 100, 2) AS page_ctr,
  ROUND(SUM(position * impressions)::numeric / NULLIF(SUM(impressions),0), 1) AS page_avg_position
FROM google_search_console.query_page
WHERE site_url = 'sc-domain:ledsone.co.uk'
  AND search_type = 'web'
  AND date BETWEEN '2026-06-11' AND '2026-07-10'
  AND page = '{canonical_url}'
GROUP BY page;
```

## Priority Keyword Selection

```sql
-- ROW_NUMBER ranking per page
ROW_NUMBER() OVER (
  PARTITION BY page
  ORDER BY q_clicks DESC, q_impressions DESC, q_avg_position ASC, query ASC
) AS rn
-- Keep rn = 1 only
```

---

## Validation Results

| Check | Expected | Result |
|-------|----------|--------|
| Total products queried | 50 | 50 |
| Products with GSC data (30-day) | — | 37 |
| Products with 0 impressions in 30-day | — | 13 |
| Priority keywords per product | 1 | 1 |
| Page metrics include ALL queries | Yes | Yes |
| Keyword metrics from priority keyword only | Yes | Yes |
| Metadata source: listings.shopify_listings | Exact handle match | Applied |
| Metadata source: listings.shopify_listing_meta | Joined by product_id | Applied |
| IP68 canonical URL used | case-...-5599 | Confirmed |
| Old IP68 outdoor URL | 0 occurrences | Confirmed |
