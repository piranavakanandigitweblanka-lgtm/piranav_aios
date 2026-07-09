# Thivajini — Requirement 3 — Data Mapping
## Date: 2026-07-09

**Title:** Req 3 Data Mapping — Stock-Spend Tracker
**Purpose:** Documents exact field-to-source mapping for Req 3 dashboard
**Team Member:** Thivajini
**Business Question:** Which LEDSone FR products are wasting Google Ads spend due to OOS or low stock?

## Join Architecture

### PATH A — Product ID match (144 products)
```
ppc_etl_performance_data.sku = google_merchant_products.product_id
WHERE merchant_id = 5551466539
```

### PATH B — Record ID match (102 products)
```
LOWER(ppc_etl_performance_data.record_id) = LOWER(google_merchant_products.product_id)
WHERE merchant_id = 5551466539
```

### Stock bridge (listing_data → variant ID)
```
listing_data.ref_id = ppc_etl_performance_data.sku
WHERE sub_source = 233
```
Key discovery: listing_data.ref_id = Shopify variant ID (e.g. '41306760183883')

### Campaign names
```
public.ppc WHERE sub_source_id = 233 AND child_id = '0'
JOIN ON ppc.parent_id = ppc_etl.parent_id
```
Campaigns found:
- 23103582865: Pmax FR | Thivajini | Klarna | Topsell | MCV
- 23533025729: Pmax FR | Thivajini | Klarna | Imp_Click | MCV

## Field Mapping

| Dashboard Column | Source Table | Source Column | Notes |
|-----------------|-------------|---------------|-------|
| Variant ID | ppc_etl_performance_data | sku | Shopify variant ID |
| Internal SKU | listing_data | sku | Via ref_id bridge |
| Product Title | google_merchant_products | title | DISTINCT ON product_id |
| Category | google_merchant_products | product_types | Fallback: 'Unknown' |
| Campaign | public.ppc | record_name | Via parent_id |
| Feed Availability | google_merchant_products | availability | 'in stock'/'out of stock' |
| Product URL | google_merchant_products | link | ledsone.fr URL |
| Price | google_merchant_products | price | EUR |
| Current Stock | listing_data | SUM(quantity) | Via ref_id=variant_id |
| 30d Spend | ppc_etl_performance_data | SUM(spend) | Last 30 days |
| 30d Clicks | ppc_etl_performance_data | SUM(clicks) | Last 30 days |
| 30d Orders | ppc_etl_performance_data | SUM(orders) | Google Ads attributed |
| CVR% | ppc_etl | orders/clicks×100 | Calculated |
| Avg Daily Sales | ppc_etl | orders/30 | Calculated |
| Days of Stock Left | listing_data + ppc_etl | stock / avg_daily_sales | Calculated |
| Wasted Spend | ppc_etl | spend_30d (STOP only) | Stock=0 AND spend>0 |
| Flag | All sources | Business rule | STOP/ACT SOON/MONITOR/OK |
| Match Method | All paths | Path used | product_id/record_id/missing |

## Known Limitations
1. listing_data.shopify_handle = NULL for all FR rows (confirmed from prior work)
2. 78 products (spending) have no gmp match — feed data unavailable
3. Days of stock left NULL when avg_daily_sales = 0
4. Stock unknown (-1) when no listing_data.ref_id match
5. GMC diagnostics not available for FR merchant (0 rows)

## PASS / FAIL
PASS — All required fields mapped and confirmed via PostgreSQL queries

**Owner:** Thivajini | **Reviewer:** GPT / Piranav
