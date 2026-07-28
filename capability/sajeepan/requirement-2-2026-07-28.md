# Sajeepan Requirement 2 — Capability Record
**Date:** 2026-07-28 | **Member:** Sajeepan | **Requirement:** 2

## Implemented Capabilities

| Capability | Source Table | Status |
|---|---|---|
| Wasteful Products (cost>£10, clicks>2, CVR<0.01%) | `google_ads.product_performance` | LIVE |
| Budget Waste Signal (cost↑, ROAS↓ vs prev) | `google_ads.campaign_performance` | LIVE |
| Negative KW Candidates (PMax search terms) | `google_ads.pmax_campaign_search_term_data` | LIVE |
| Product Classification (No One See U / Low Eng / etc.) | `google_ads.product_performance` | LIVE |
| Cross-Platform Opportunity (Amazon/eBay/Shopify) | `order_management.orders + order_item_info` | LIVE |
| Seasonal Winner (historical orders same month -1yr) | `order_management.orders` | LIVE |
| Drop-Off Products (prev sales, zero current) | `order_management.orders` | LIVE |
| Stock Safety | `inventory.physical_product_stock` | LIVE |
| Morning Priority Actions (P1/P2) | Derived from above | LIVE |
| 30/60/90 Decision Context | `google_ads.campaign_performance` | LIVE |

## Unsupported Capabilities

| Capability | Reason |
|---|---|
| Geo Exclude | No geographic perf table for Sajeepan campaigns |
| Keyword Planner | No connected API |
| Margin Safety | No product cost/margin column in DB |
| P3 Clean-Up | No persistent action log |
| Price-Based Wasteful | AMBIGUOUS spec — blocked |
| High ROAS boundary | AMBIGUOUS spec — blocked |
| Amazon→Google KW mapping | No ASIN→GMC product join path |

## CVR Definition
`conversions / clicks` (no stored conversion_rate column). Threshold: < 0.0001 (= 0.01%).
