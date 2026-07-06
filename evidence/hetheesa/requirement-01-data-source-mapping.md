---
name: requirement-01-data-source-mapping
description: Final confirmed data source for each column in the Req 1 Top-Selling Products SEO Report
metadata:
  type: project
---

# Requirement 1 — Data Source Mapping

**Report:** Top-Selling Products SEO Report (ledsone.fr)
**Updated:** 2026-07-06

## Column → Data Source

| Column | Source | Detail |
|---|---|---|
| Product URL | Shopify Admin GraphQL | `product.onlineStoreUrl` / handle-based URL |
| Revenue (30d) | Shopify ShopifyQL | `sales` by product, last 30 days |
| Meta Title Status | Shopify Admin GraphQL | `product.seo.title` — raw string classified in browser (<30 Too Short, 30–60 OK, >60 Too Long, null Missing) |
| Meta Description Status | Shopify Admin GraphQL | `product.seo.description` — raw string classified in browser (<120 Too Short, 120–160 OK, >160 Too Long, null Missing) |
| H1 Status | Not available | Default Shopify theme renders `product.title` as H1; live page parse not performed. Marked **Unverified** for all 48 products. |
| Alt Text Missing (count) | Shopify Admin GraphQL | `product.images(first:10)` — count of images where `altText` is null or blank |
| FAQ Schema Status | Shopify admin inspection | No FAQ app or structured data configuration found. Marked **Missing** for all 48 products. Live page extraction would confirm definitively. |
| Impressions | PostgreSQL — `google_search_console.gsc_web_page` | Site: `https://ledsone.fr/` · Last 30 days ending 2026-06-30 (3-day pipeline lag). 14 of 48 products matched. |
| CTR | PostgreSQL — `google_search_console.gsc_web_page` | Same source as Impressions. GA4 not used — GSC is authoritative for impressions/CTR. |
| Low CTR Flag | Computed (browser) | Derived from CTR: `null` → No GSC data · `CTR < 2%` → Low CTR · `CTR ≥ 2%` → OK |

## Why Not GA4 for Impressions/CTR

GA4 tracks sessions and conversions, not search impressions or click-through rate. GSC (via PostgreSQL) is the correct source for impression and CTR data. GA4 was explicitly excluded as a primary source per data source rules.
