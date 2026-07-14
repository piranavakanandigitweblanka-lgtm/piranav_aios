# Sajeepan Capability — Requirement 1
**Date:** 2026-07-14 | **Review:** 2026-07-14

## Capability Demonstrated
- PostgreSQL read-only inspection (ledsone-db-mcp, google_ads schema)
- Campaign whitelist verification (6 PMax campaigns)
- Product count methodology: raw rows vs distinct item IDs vs normalized IDs
- Merchant join deduplication (45,647 duplicate merchant snapshots — latest record strategy)
- Missing title resolution from merchant_products (exact variant match)
- Correct profitability labelling: Ad Contribution ≠ Profit
- ROAS format standardization (percentage throughout)
- LIMITED status accuracy: no assumed cause without verified DB field
- Static HTML dashboard with embedded data (sonya.html architecture pattern)
- Chart.js trend (4-metric switchable)
- Product drawer with feed checklist and recommendation rules
- AIOS governance: 7-file evidence structure

## Business Rules (verified)
| Rule | Formula |
|---|---|
| ROAS % | Conv Value ÷ Cost × 100 |
| CTR % | Clicks ÷ Impressions × 100 |
| CVR % | Conversions ÷ Clicks × 100 |
| Ad Contribution | Conv Value − Ad Cost |

## Normalization Logic
`UPPER(REPLACE(product_item_id, '-sh', '')) = merchant_products.product_id`
Dedup: `DISTINCT ON (product_id) ORDER BY updated_at DESC`

## Tables Used
- google_ads.campaigns
- google_ads.campaign_performance
- google_ads.product_performance
- google_ads.merchant_products
