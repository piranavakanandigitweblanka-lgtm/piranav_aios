# Kamsi Amazon UK ASIN Price Report — Evidence File

## Run Details
- **Run date:** 2026-07-08
- **Input CSV:** C:/Users/PC/Downloads/web price - dupicate listings .csv
- **PostgreSQL source table:** public.listing_data
- **Filter:** which_channel_name = 'amazon', market_place = 'UK', status = 'Active', price > 0
- **SKU match:** Exact, case-insensitive on sku column

## Row Counts
| Metric | Count |
|---|---|
| Total input rows | 1430 |
| Output row count | 1430 |
| Input = Output | PASS |
| Matched SKU count | 721 (50.4%) |
| No Match SKU count | 709 (49.6%) |
| Amazon Lower | 64 |
| Amazon Higher | 656 |
| Same Price | 1 |
| Duplicate Amazon UK records (extras before lowest selection) | 406 |

## Sample Proof — SKU 12ASIP20150
- All Amazon UK records found: [{'asin': 'B098K71K8J', 'price': 16.99}, {'asin': 'B08QFSP7YD', 'price': 18.99}]
- Lowest selected: ASIN B098K71K8J @ £16.99
- LEDSone price: £15.99
- Price Difference: £1.0
- Price Status: Amazon Higher
- Match Status: Match

## Amazon URL Construction Note
Amazon UK listing URLs are **constructed** from ASIN using the template:
`https://www.amazon.co.uk/dp/<ASIN>`
The `public.listing_data` table does **NOT** store a listing URL.
The `ref_id` column stores the ASIN only. All URLs in the output are constructed, not sourced from PostgreSQL.

## 10 Sample Matched Rows
| SKU | LEDSone Price | Amazon ASIN | Amazon Price | Price Status | Record Count |
|---|---|---|---|---|---|
| 12ASIP20150 | 15.99 | B098K71K8J | 16.99 | Amazon Higher | 2 |
| 12ASIP20300 | 18.99 | B098K5HVDT | 19.99 | Amazon Higher | 3 |
| 12IP20150 | 13.29 | B07D5GF4YR | 16.99 | Amazon Higher | 1 |
| 12IP20180 | 8.15 | B07CKSGWTH | 15.48 | Amazon Higher | 2 |
| 12IP20480 | 15.19 | B07CN7GBMR | 32.99 | Amazon Higher | 2 |
| 12IP2080 | 5.99 | B08CBKX956 | 14.29 | Amazon Higher | 2 |
| 12IP6715 | 4.19 | B07B4TRJRF | 5.79 | Amazon Higher | 2 |
| 12IP6730 | 6.35 | B081H6T5TF | 13.89 | Amazon Higher | 2 |
| 12RPIP45100 | 13.99 | B085Y76163 | 15.99 | Amazon Higher | 3 |
| 12RPIP45200 | 16.89 | B085Y72B9D | 18.99 | Amazon Higher | 2 |

## 10 Sample No-Match Rows
| SKU | LEDSone Price | Price Status | Amazon Record Count |
|---|---|---|---|
| 12IP20240 | 10.45 | No Amazon Match | 0 |
| 12IP20360 | 13.69 | No Amazon Match | 0 |
| 12IP20720 | 35.19 | No Amazon Match | 0 |
| 12IP6724 | 5.19 | No Amazon Match | 0 |
| 12IP6736 | 7.38 | No Amazon Match | 0 |
| 12MIP20100 | 11.49 | No Amazon Match | 0 |
| 12MIP20120 | 12.89 | No Amazon Match | 0 |
| 12MIP20150 | 13.89 | No Amazon Match | 0 |
| 12MIP20180 | 15.49 | No Amazon Match | 0 |
| 12MIP20200 | 18.49 | No Amazon Match | 0 |

## PASS/FAIL Checklist
| Check | Result |
|---|---|
| Output row count = input row count | PASS |
| Original CSV columns preserved | PASS |
| One row per input row | PASS |
| UK marketplace only | PASS |
| Lowest valid active Amazon UK price selected | PASS |
| Amazon URLs constructed from ASIN (not claimed as stored) | PASS |
| No web scraping or web search used | PASS |
| LEDSone prices unchanged | PASS |