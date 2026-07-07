---
title: Hetheesa Requirement 01 — Top-Selling Products SEO Report
purpose: Capture the full execution prompt used to build Requirement 01
staff: Hetheesa
supporting_aios: Piranav
requirement_source: "What I Need to Improve SEO Performance - Hetheesa_.csv"
date: 2026-07-03
status: COMPLETE
---

# Requirement 01 — Top-Selling Products SEO Report

## Business Question
Which of ledsone.fr's top 50 revenue-generating products (last 30 days) have SEO weaknesses that could be improved to drive more organic traffic and revenue?

## Report Specification
- **Store:** ledsone.fr (Shopify, Basic plan, EUR, CEST)
- **Period:** Last 30 days from 2026-07-03 (i.e., 2026-06-03 to 2026-07-03)
- **Ranking:** Top 50 products by gross revenue, descending
- **Scoring:** Revenue × ranking gap × impression potential

## Required Output Columns
1. Product URL
2. Revenue (30d)
3. Meta Title Status
4. Meta Description Status
5. H1 Status
6. Alt Text Missing Count
7. FAQ Schema Status
8. Impressions
9. CTR
10. Low CTR Flag

## Status Logic Applied
- Meta Title: Missing | Too Short (<30) | OK (30–60) | Too Long (>60)
- Meta Desc: Missing | Too Short (<120) | OK (120–160) | Too Long (>160)
- H1: OK - matches title (assumed default Shopify theme) — limitation documented
- FAQ Schema: Missing (no FAQ schema confirmed for any product)
- Low CTR: Low CTR when CTR < 2% | OK when CTR ≥ 2% | GSC unavailable

## Data Sources Used
| Source | Tool | Notes |
|--------|------|-------|
| Revenue | Shopify ShopifyQL (run-analytics-query) | FROM sales SHOW gross_sales, net_sales, orders GROUP BY product_title, product_id ORDER BY gross_sales DESC LIMIT 50 SINCE -30d UNTIL today |
| Product SEO | Shopify Admin GraphQL (nodes query) | Fetched handle, onlineStoreUrl, seo.title, seo.description, images.altText for all 48 products in 2 batches |
| GSC Metrics | PostgreSQL google_search_console.gsc_web_page | Aggregated by page WHERE site_url = 'https://ledsone.fr/' AND date >= CURRENT_DATE - INTERVAL '30 days' AND page LIKE '%/products/%' |

## Execution Steps
1. Asset search — no existing Hetheesa assets found
2. PostgreSQL schema discovery — google_search_console schema identified with gsc_web_page table
3. Shopify ShopifyQL revenue query (with product_id dimension)
4. GSC page-level data query for ledsone.fr /products/ pages
5. Shopify GraphQL nodes batch query (2 × 24 products) for SEO + alt text data
6. SEO status computation for all 48 products
7. Dashboard HTML creation
8. AIOS evidence files written

## Output Files
- `reports/hetheesa/requirement-01-top-selling-products-seo.html`
- `evidence/hetheesa/requirement-01-existing-assets-check.md`
- `evidence/hetheesa/requirement-01-postgresql-inspection.md`
- `evidence/hetheesa/requirement-01-shopify-seo-audit.md`
- `evidence/hetheesa/requirement-01-gsc-data-check.md`
- `evidence/hetheesa/requirement-01-data-mapping.md`
- `validation/hetheesa/requirement-01-validation.md`
- `handover/hetheesa/requirement-01-handover.md`
- `vercel/hetheesa/requirement-01-vercel-notes.md`
