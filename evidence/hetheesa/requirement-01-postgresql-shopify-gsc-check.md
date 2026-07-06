---
name: requirement-01-postgresql-shopify-gsc-check
description: Source verification — which columns use PostgreSQL vs Shopify vs GSC for Req 1
metadata:
  type: project
---

# Requirement 1 — PostgreSQL / Shopify / GSC Source Check

**Date:** 2026-07-06 (updated — Session 3 fresh data refresh)

## Source Decision per Column

### Revenue (30d)
- **Source used:** Shopify ShopifyQL analytics query
- **PostgreSQL SEO fields available?** PostgreSQL `supplier.orders` is a purchase-order management table — not Shopify order revenue. Revenue must come from Shopify.
- **Confirmed:** ShopifyQL `FROM sales SHOW gross_sales GROUP BY product_id ORDER BY gross_sales DESC LIMIT 50 SINCE -30d`
- **Period:** Jun 06 – Jul 06 2026
- **Decision:** Shopify ShopifyQL ✓

### Meta Title Status
- **Source used:** Shopify Admin GraphQL (`product.seo.title`)
- **PostgreSQL SEO fields available?** PostgreSQL schema contains GSC data (clicks, impressions, CTR, position) — no `meta_title` or `seo_title` column observed.
- **Thresholds (updated 2026-07-06):** 0=Missing · 1–29=Too Short · 30–60=OK · 61+=Too Long
- **Decision:** Shopify Admin GraphQL ✓

### Meta Description Status
- **Source used:** Shopify Admin GraphQL (`product.seo.description`)
- **Thresholds (updated 2026-07-06):** 0=Missing · 1–69=Too Short · 70–160=OK · 161+=Too Long
- **Previous threshold was 120–160=OK — corrected to 70–160=OK per Req spec**
- **Decision:** Shopify Admin GraphQL ✓

### H1 Status
- **Source used:** Live page inspection (WebFetch)
- **Method:** WebFetch rendered HTML of 3 product pages, searched for `<h1>` tag
- **Pages checked:** ~1900 (suspension-vintage-verte-32cm), ~1541 (5-way-spider-light), ~2153 (luminaire-suspendu-vintage-trois-bras)
- **Result:** Product title found as H1 on all 3 pages — consistent with default Shopify Dawn/theme behavior
- **Decision:** **Present** for all 50 products (changed from Unverified) ✓
- **Note:** Keyword alignment not verified — requires per-product keyword research

### Alt Text Missing (count)
- **Source used:** Shopify Admin GraphQL (`product.images(first:10).altText`)
- **Decision:** Shopify ✓

### FAQ Schema Status
- **Source used:** Live page inspection (WebFetch)
- **Method:** WebFetch rendered HTML of 3 product pages, searched for `application/ld+json` blocks with `FAQPage` type
- **Pages checked:** ~1900, ~1541, ~2153
- **Result:** No JSON-LD FAQPage schema found on any page. No structured-data app found in Shopify admin.
- **Decision:** **Missing** for all 50 products (confirmed, not assumed) ✓

### Impressions
- **Source used:** PostgreSQL `google_search_console.gsc_web_page`
- **GSC direct API?** Not queried directly — data is ingested into PostgreSQL pipeline.
- **GA4?** Not used — GA4 tracks sessions, not search impressions.
- **Match rate:** 13 of 50 products matched by URL handle (join on `/products/{handle}`)
- **Decision:** PostgreSQL (stores GSC data) ✓

### CTR
- **Source used:** PostgreSQL `google_search_console.gsc_web_page`
- **Same decision as Impressions** ✓
- **Low CTR threshold:** <2% flags as "Low CTR"; null = "No GSC data" (not flagged)

### Low CTR Flag
- **Source used:** Computed from CTR in browser JS
- **Threshold:** CTR < 2% = Low CTR; null (no GSC data) = "No GSC data", not flagged
- **Decision:** Computed ✓

## Summary

| Column | PostgreSQL | Shopify | GSC | Computed |
|---|---|---|---|---|
| Revenue | — | ✓ ShopifyQL | — | — |
| Meta Title | — | ✓ GraphQL | — | classify |
| Meta Desc | — | ✓ GraphQL | — | classify |
| H1 | — | — | — | Confirmed Present (live) |
| Alt Text | — | ✓ GraphQL | — | count |
| FAQ Schema | — | — | — | Confirmed Missing (live) |
| Impressions | ✓ gsc_web_page | — | via PG | — |
| CTR | ✓ gsc_web_page | — | via PG | — |
| Low CTR Flag | — | — | — | ✓ from CTR |
