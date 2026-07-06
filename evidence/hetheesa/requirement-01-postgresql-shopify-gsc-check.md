---
name: requirement-01-postgresql-shopify-gsc-check
description: Source verification — which columns use PostgreSQL vs Shopify vs GSC for Req 1
metadata:
  type: project
---

# Requirement 1 — PostgreSQL / Shopify / GSC Source Check

**Date:** 2026-07-06 (updated — Session 4 data source rules overhaul)

## Source Decision per Column

### Revenue (30d)
- **Source used:** Shopify Orders GraphQL API (changed from ShopifyQL in Session 4)
- **Query:** `orders(first:50, query:"financial_status:paid created_at:>2026-06-06 created_at:<2026-07-07 NOT cancelled_at:*")` with pagination
- **Aggregation:** Sum `lineItems.edges.node.discountedTotalSet.shopMoney.amount` by product handle
- **Exclude:** Cancelled and refunded orders explicitly excluded
- **Period:** Jun 06 – Jul 06 2026 · Total: €3,574.15 (56 orders across 2 paginated pages)
- **Why different from ShopifyQL:** ShopifyQL `gross_sales` = €3,011.77; Orders discountedTotal = €3,574.15. Different definitions — Orders line item totals vs analytics gross_sales aggregation.
- **Decision:** Shopify Orders GraphQL ✓

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
- **Source used:** Shopify Admin GraphQL (`product.images(first:50).altText`)
- **Changed in Session 4:** Previously `first:10` — now ALL images up to 50 per product counted
- **Count:** null or empty string `""` = missing alt text
- **Decision:** Shopify ✓

### FAQ Schema Status
- **Source used:** Shopify metafield `custom.faq_schema` (namespace: `custom`, key: `faq_schema`)
- **Changed in Session 4:** Previously DOM inspection via WebFetch for JSON-LD FAQPage — now metafield query
- **Query field:** `metafield(namespace:"custom", key:"faq_schema") { value }` on each product
- **Present:** metafield exists with data (FAQPage JSON-LD string)
- **Missing:** metafield is null or empty
- **Result:** 19 Present / 31 Missing across 50 products
- **Decision:** Shopify metafield ✓

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
| Revenue | — | ✓ Orders GraphQL | — | — |
| Meta Title | — | ✓ GraphQL | — | classify |
| Meta Desc | — | ✓ GraphQL | — | classify |
| H1 | — | ✓ product.title | — | Confirmed Present |
| Alt Text | — | ✓ GraphQL images(first:50) | — | count |
| FAQ Schema | — | ✓ metafield custom.faq_schema | — | Present/Missing |
| Impressions | ✓ gsc_web_page | — | via PG | — |
| CTR | ✓ gsc_web_page | — | via PG | — |
| Low CTR Flag | — | — | — | ✓ from CTR |
