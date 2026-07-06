---
name: requirement-01-postgresql-shopify-gsc-check
description: Source verification — which columns use PostgreSQL vs Shopify vs GSC for Req 1
metadata:
  type: project
---

# Requirement 1 — PostgreSQL / Shopify / GSC Source Check

**Date:** 2026-07-06

## Source Decision per Column

### Revenue (30d)
- **Source used:** Shopify ShopifyQL analytics query
- **PostgreSQL SEO fields available?** PostgreSQL contains `google_search_console.gsc_web_page` (search data), not order revenue. Revenue must come from Shopify.
- **Decision:** Shopify ShopifyQL ✓

### Meta Title Status
- **Source used:** Shopify Admin GraphQL (`product.seo.title`)
- **PostgreSQL SEO fields available?** PostgreSQL schema contains GSC data (clicks, impressions, CTR, position) — no `meta_title` or `seo_title` column observed.
- **Decision:** Shopify Admin GraphQL ✓

### Meta Description Status
- **Source used:** Shopify Admin GraphQL (`product.seo.description`)
- **PostgreSQL SEO fields available?** Same as above — no meta description column in PostgreSQL.
- **Decision:** Shopify Admin GraphQL ✓

### H1 Status
- **Source used:** N/A — marked Unverified
- **PostgreSQL available?** No H1 field in PostgreSQL or Shopify admin.
- **Shopify page inspection?** Not performed (48 live page fetches required).
- **Decision:** Unverified — requires live page parse or Shopify theme template review ✓

### Alt Text Missing (count)
- **Source used:** Shopify Admin GraphQL (`product.images(first:10).altText`)
- **Decision:** Shopify ✓

### FAQ Schema Status
- **Source used:** Shopify admin inspection (no FAQ app found)
- **Decision:** Missing for all — confirmed via Shopify admin, no structured data app installed ✓

### Impressions
- **Source used:** PostgreSQL `google_search_console.gsc_web_page`
- **GSC direct API?** Not queried directly — data is ingested into PostgreSQL pipeline.
- **GA4?** Not used — GA4 tracks sessions, not search impressions.
- **Decision:** PostgreSQL (stores GSC data) ✓

### CTR
- **Source used:** PostgreSQL `google_search_console.gsc_web_page`
- **Same decision as Impressions** ✓

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
| H1 | — | — | — | Unverified |
| Alt Text | — | ✓ GraphQL | — | count |
| FAQ Schema | — | ✓ admin | — | — |
| Impressions | ✓ gsc_web_page | — | via PG | — |
| CTR | ✓ gsc_web_page | — | via PG | — |
| Low CTR Flag | — | — | — | ✓ from CTR |
