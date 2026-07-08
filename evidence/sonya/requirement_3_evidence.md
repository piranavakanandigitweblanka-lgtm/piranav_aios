# Sonya Requirement 3 — Evidence

**Date:** 2026-07-08

## PostgreSQL Evidence

### Table 1: ppc_etl_performance_data (L30 Product Performance)
- Query: `SELECT ref_id, SUM(impressions), SUM(clicks), SUM(spend), SUM(sales), SUM(orders) ... WHERE record_type='product' AND source=3 AND date >= '2026-06-08' AND date <= '2026-07-07' AND ref_id IN (...1724 CSV IDs...)`
- Result: 1162 of 1724 CSV product IDs matched
- Date range confirmed: 2026-06-08 to 2026-07-07 (max date in table = 2026-07-08)

### Table 2: order_transaction (Seasonal Trend)
- Query: `SELECT product_id, SUM(quantity) FROM order_transaction WHERE source_name='SHOPIFY' AND EXTRACT(MONTH FROM order_date)=8 AND EXTRACT(YEAR FROM order_date) IN (2024,2025) GROUP BY product_id HAVING SUM(quantity) > 2`
- Result: 38 of 1724 CSV product IDs had August seasonal sales > 2 units

### Table 3: order_transaction (Recent Drop-off)
- Query: `SELECT product_id, SUM(CASE WHEN MONTH=5 AND YEAR=2026 THEN quantity ELSE 0 END) as may_qty, SUM(CASE WHEN MONTH=6 AND YEAR=2026 THEN quantity ELSE 0 END) as jun_qty ... HAVING may_qty > 0`
- Result: 24 of 1724 CSV product IDs qualified as recent drop-offs (May > 0, Jun = 0)

## Sample Top Products (L30 by Cost)

| Product ID | Impressions | Clicks | Cost | Conv Value | ROAS% |
|---|---|---|---|---|---|
| 15086824259970 | 30,496 | 477 | £296.61 | £1149.31 | 387% |
| 15022982594946 | 45,219 | 606 | £169.28 | £516.56 | 305% |
| 15260815720834 | 13,773 | 178 | £130.68 | £380.37 | 291% |
| 15023091188098 | 14,293 | 213 | £100.58 | £363.34 | 361% |
| 15270960234882 | 12,620 | 199 | £82.63 | £342.89 | 415% |

## CSV Evidence
- File: Sonya ID 08_07_ 2026 - products-variant.csv
- Columns: Variant ID, Parent List ID, Variant SKU
- Rows: 5778
- Unique Parent List IDs: 1724
