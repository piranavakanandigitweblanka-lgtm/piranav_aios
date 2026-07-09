# Thivajini — Req 2 Product-Level KPI Dashboard · Evidence
## 2026-07-09

## Implementation Summary
Requirement 2 implemented inside `panel-2` of `Staff-requirements/pages/thivajini.html`.
No new HTML file created. Requirement 1 and navigation untouched.

## Data Sources (read-only PostgreSQL)
- **Ads data:** `public.ppc_etl_performance_data`
  - Filter: source=3, sub_source_id=233, record_type='product', sku!='0'
  - Period: 2026-04-10 to 2026-07-07 (89 days)
- **Product data:** `public.google_merchant_products`
  - Filter: merchant_id=5551466539, currency=EUR, target_country=FR
  - Deduplication: DISTINCT ON (product_id) ORDER BY product_id, price DESC

## Join Strategy
`ppc_etl_performance_data.sku = google_merchant_products.product_id`
CTE `gmp_dedup` used to prevent fan-out (836 raw → 728 distinct SKUs).

## KPI Calculations (all from PostgreSQL)
| KPI | Formula | Source |
|-----|---------|--------|
| CTR | clicks/impressions×100 | ppc_etl |
| CVR | orders/clicks×100 | ppc_etl |
| ROAS | sales/spend×100 | ppc_etl |
| Spend% | spend/COALESCE(sale_price,price)×100 | ppc_etl + gmp |

## Segment Distribution (728 total)
| Segment | Count | Rule |
|---------|-------|------|
| Hero | 13 | ROAS≥400% AND Clicks≥15 |
| Green | 12 | ROAS≥400% AND Clicks<15 |
| Amber | 0 | ROAS 300–399% |
| Orange | 1 | ROAS 250–299% |
| High Priority Cut | 3 | Orders>0 AND ROAS<250% |
| Bleeding | 124 | Clicks≥5, CVR<1%, Orders=0 |
| Low Engagement | 314 | Impressions>0, Clicks=0 |
| Zombie | 0 | Impressions=0 |
| Monitor Cut | 261 | All else |

## Summary KPIs
- Total Spend: €809.24 | Total Sales: €1,641.58
- Avg ROAS: 202.9% | Avg CTR: 1.55% | Avg CVR: 1.14%
- Total Orders: 34

## Features Implemented
- 9-card KPI summary header
- Segment colour-coded rows (9 segments)
- Search (by product name or ID)
- Filters: segment, availability, spend alert >25%
- Sort: by segment, ROAS, spend, sales, clicks, impressions
- Product URL links to ledsone.fr
- CSV export (16 columns)
- Decision action column per segment
- Footer: data sources, decision rules, KPI formulae

## Status
LOCAL ONLY — not deployed to Vercel
GPT approval required before any deployment.
