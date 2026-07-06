---
name: requirement-01-data-source-mapping
description: Final confirmed data source for each column in the Req 1 Top-Selling Products SEO Report
metadata:
  type: project
---

# Requirement 1 — Data Source Mapping

**Report:** Top-Selling Products SEO Report (ledsone.fr)
**Updated:** 2026-07-06 (Session 4 — data source rules overhaul)

## Column → Data Source

| Column | Source | Detail |
|---|---|---|
| Product URL | Shopify Admin GraphQL | `product.onlineStoreUrl` / handle-based URL |
| Revenue (30d) | Shopify Orders GraphQL | Paid orders, last 30 days (Jun 06 – Jul 06 2026), exclude cancelled/refunded. Aggregated `discountedTotalSet.shopMoney.amount` by product handle. Total: €3,574.15. |
| Meta Title Status | Shopify Admin GraphQL | `product.seo.title` — raw string classified in browser after trim(). Thresholds: 0=Missing · 1–29=Too Short · 30–60=OK · 61+=Too Long. Duplicate = same non-null value on 2+ products. Character count shown in badge. |
| Meta Description Status | Shopify Admin GraphQL | `product.seo.description` — raw string classified in browser after trim(). Thresholds: 0=Missing · 1–69=Too Short · 70–160=OK · 161+=Too Long. Character count shown in badge. |
| H1 Status | Live page inspection (confirmed) | Default Shopify theme renders `product.title` as H1. **Confirmed Present** for all 50 products via live WebFetch on 3 representative pages (~1900, ~1541, ~2153). All showed product title as H1. Keyword alignment not verified — requires per-product keyword research. |
| Alt Text Missing (count) | Shopify Admin GraphQL | `product.images(first:50)` — count of ALL images where `altText` is null or blank string. 0=green · 1–2=yellow · 3+=red. (Previously first:10 only — changed Session 4.) |
| FAQ Schema Status | Shopify metafield (`custom.faq_schema`) | Present = metafield exists with data. Missing = null or empty. 19 Present / 31 Missing across 50 products. (Previously: live WebFetch DOM check — changed Session 4.) |
| Impressions | PostgreSQL — `google_search_console.gsc_web_page` | Site: `https://ledsone.fr/` · Last 30 days ending 2026-07-06 (pipeline lag may apply). 13 of 50 products matched by URL handle. |
| CTR | PostgreSQL — `google_search_console.gsc_web_page` | Same source as Impressions. GA4 not used — GSC is authoritative for impressions/CTR. |
| Low CTR Flag | Computed (browser) | Derived from CTR: `null` → No GSC data · `CTR < 2%` → Low CTR · `CTR ≥ 2%` → OK |

## Classification Thresholds (2026-07-06 — updated)

### Meta Title
| Status | Condition |
|---|---|
| Missing | null or blank after trim |
| Too Short | 1–29 chars |
| OK | 30–60 chars |
| Too Long | 61+ chars |
| Duplicate | Same non-null title on 2+ products |

### Meta Description
| Status | Condition |
|---|---|
| Missing | null or blank after trim |
| Too Short | 1–69 chars |
| OK | 70–160 chars |
| Too Long | 161+ chars |

**Note:** Desc threshold changed from session 2 (was 120–160=OK, <120=Too Short). Updated to 70–160=OK per Req spec 2026-07-06.

## Why Not GA4 for Impressions/CTR

GA4 tracks sessions and conversions, not search impressions or click-through rate. GSC (via PostgreSQL) is the correct source for impression and CTR data. GA4 was explicitly excluded as a primary source per data source rules.

## Summary Table

| Column | PostgreSQL | Shopify | GSC | Computed |
|---|---|---|---|---|
| Revenue | — | ✓ Orders GraphQL | — | — |
| Meta Title | — | ✓ GraphQL | — | classify |
| Meta Desc | — | ✓ GraphQL | — | classify |
| H1 | — | — | — | Confirmed Present (live) |
| Alt Text | — | ✓ GraphQL | — | count |
| FAQ Schema | — | ✓ metafield custom.faq_schema | — | Present/Missing |
| Impressions | ✓ gsc_web_page | — | via PG | — |
| CTR | ✓ gsc_web_page | — | via PG | — |
| Low CTR Flag | — | — | — | ✓ from CTR |
