# Kamsi Amazon UK ASIN Price Report — Handover

## What Was Built
A row-by-row Amazon UK price comparison report for all 1430 SKUs in the LEDSone web price duplicate listings sheet.

## Files
| File | Description |
|---|---|
| reports/kamsi/amazon_uk_asin_price_by_sheet.csv | Main output — 1430 rows |
| evidence/kamsi/amazon_uk_asin_price_by_sheet_validation.md | Evidence and PASS/FAIL audit |
| handover/kamsi/amazon_uk_asin_price_by_sheet_handover.md | This file |

## Data Sources
| Source | Detail |
|---|---|
| Input CSV | C:/Users/PC/Downloads/web price - dupicate listings .csv |
| PostgreSQL | public.listing_data — Amazon UK active listings |
| Amazon URL | Constructed: https://www.amazon.co.uk/dp/<ASIN> |

## Key Numbers
- Input rows: 1430
- Matched to Amazon UK: 721 (50.4%)
- No Amazon UK match: 709 (49.6%)
- Amazon Higher than LEDSone: 656
- Amazon Lower than LEDSone: 64
- Same Price: 1

## Logic Applied
1. SKU matched exact case-insensitive on `sku` column in public.listing_data
2. Filter: which_channel_name = 'amazon', market_place = 'UK', status = 'Active', price > 0
3. Where multiple Amazon UK records exist per SKU, lowest valid price was selected
4. Amazon Record Count shows total valid UK records found before lowest selection
5. Price Difference = Amazon UK Price minus LEDSone Current Price (GBP)

## Known Limitations
- Prices in PostgreSQL are point-in-time snapshots; live Amazon prices may differ
- Amazon listing_url is not stored in PostgreSQL — all URLs are constructed from ASIN
- SKU match is exact; variant SKUs (e.g. '12ASIP20150 D') are separate DB entries

## Verified Test Case
- SKU 12ASIP20150: LEDSone £15.99, Amazon UK lowest £16.99 (ASIN B098K71K8J)
- Price Status: Amazon Higher, Price Difference: +£1.00