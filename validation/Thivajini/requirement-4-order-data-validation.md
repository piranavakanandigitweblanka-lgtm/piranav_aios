# Thivajini — Requirement 4 — Order Data — Validation
## Date: 2026-07-09

**Title:** Req 4 Order Data Validation
**Team Member:** Thivajini
**Status:** PASS (LOCAL ONLY — not pushed)

## Source Totals vs Dashboard Totals

| Metric | Source | Dashboard | Match |
|--------|--------|-----------|-------|
| Shopify orders 30d | 69 (ShopifyQL) | 69 | PASS |
| Shopify orders 60d | 136 (ShopifyQL) | 136 | PASS (subset shown per filter) |
| Shopify orders 90d | 213 (ShopifyQL) | 213 | PASS |
| Ads orders 30d | 20 (ppc_etl) | 20 | PASS |
| Ads orders 60d | 31 (ppc_etl) | 31 | PASS |
| Ads orders 90d | 48 (ppc_etl) | 48 | PASS |
| Total products | 128 | 128 | PASS |
| Ads Driven | 13 | 13 | PASS |
| Balanced | 2 | 2 | PASS |
| Organic Heavy | 1 | 1 | PASS |
| Organic Only | 42 | 42 | PASS |
| No Orders | 70 | 70 | PASS |

## Matching Key Validation
- Matching key: Product Title (normalised string match)
- 36 unique Ads products resolved to Shopify titles via GraphQL
- All 36 Ads product titles found in Shopify product list
- Unmatched Shopify products (Shopify orders, no Ads): 42 (Organic Only status)
- Unmatched Ads products (Ads orders, no Shopify): 0 (all Ads products also appear in Shopify)

## HTML Injection Checks
| Check | Result |
|-------|--------|
| panel-4 placeholder replaced | PASS |
| R4PRODUCTS array embedded (128 products) | PASS |
| r4Render() function present | PASS |
| r4CSV() function present | PASS |
| KPI cards (6) present | PASS |
| Status filter (r4-status) | PASS |
| Window filter (r4-win, 30/60/90) | PASS |
| Sort filter (r4-sort) | PASS |
| Status badges (5 types) | PASS |
| Table 11 columns | PASS |
| CSV export | PASS |
| Nav button "Order Data / Req 4" | PASS |
| panel-1 (Req1) unchanged | PASS |
| panel-2 (Req2) unchanged | PASS |
| panel-3 (Req3) unchanged | PASS |
| No fake data | PASS |
| No PostgreSQL writes | PASS |
| No cross-store data | PASS |
| Not deployed | PASS |
| Not pushed (awaiting GPT) | PASS |

**VALIDATION: PASS (LOCAL ONLY)**

**Owner:** Thivajini | **Reviewer:** GPT / Piranav
