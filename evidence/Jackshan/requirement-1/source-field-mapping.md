---
name: jackshan-r1-source-field-mapping
description: Source-to-field mapping for Jackshan Requirement 1
metadata:
  type: project
---

# Jackshan Requirement 1 — Source Field Mapping

**Title:** Source Field Mapping  
**Purpose:** Document exactly which PostgreSQL field maps to each output column  
**Staff Owner:** Jackshan  
**Supporting AIOS Staff / Reviewer:** Piranav  
**PASS / FAIL:** PASS

---

| Output Column | PostgreSQL Source | Table | Field | Notes |
|---|---|---|---|---|
| Product URL | google_search_console | query_page | page | Canonical product URL from GSC |
| GSC Priority Keyword | google_search_console | query_page | query | Exact search query text, preserved |
| Query Impressions | google_search_console | query_page | SUM(impressions) | Aggregated over date range |
| Query Average Position | google_search_console | query_page | SUM(position*impressions)/SUM(impressions) | Impression-weighted avg |
| Query Clicks | google_search_console | query_page | SUM(clicks) | Aggregated over date range |
| Meta Title | listings | shopify_listing_meta | title_tag | Joined via shopify_listings.item_id = shopify_listing_meta.product_id |
| Meta Description | listings | shopify_listing_meta | description_tag | Same join as Meta Title |
| H1 | listings | shopify_listings | title | Product title, suffix ~XXXX stripped |
| Recommended Action | Computed | — | — | From clicks/impressions rules |

## Aggregation SQL

```sql
SELECT 
  page,
  query,
  SUM(clicks) as total_clicks,
  SUM(impressions) as total_impressions,
  SUM(position * impressions) / NULLIF(SUM(impressions), 0) as weighted_avg_position
FROM google_search_console.query_page
WHERE site_url = 'sc-domain:ledsone.co.uk'
  AND search_type = 'web'
  AND date >= '2026-04-07'
  AND date <= '2026-07-07'
  AND page IN (/* Jackshan allocated product URLs */)
GROUP BY page, query
```

## Join Strategy

1. Extract handle from GSC page URL
2. Look up shopify_listings WHERE shopify_handle = handle AND channel = 'LEDSone' AND site = 'UK' AND is_parent = 1
3. Join shopify_listing_meta ON product_id = shopify_listings.item_id::bigint
4. Use shopify_listings.title as H1 (suffix stripped)
