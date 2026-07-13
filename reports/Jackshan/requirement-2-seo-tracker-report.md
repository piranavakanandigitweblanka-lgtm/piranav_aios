# Jackshan — Requirement 2 — SEO Optimization Tracker Report

**Date:** 2026-07-13
**Status:** PASS

## Summary

| KPI | Value |
|-----|-------|
| Total Products | 50 |
| Products to Optimize | 43 |
| Do Not Optimize | 7 |
| Average Monthly CTR | 0.3% |
| Total Monthly Clicks | 38 |
| Total Monthly Impressions | 12,600 |

## Business Rules Applied

- **Optimize:** Monthly Sales ≤ 1 AND Monthly CTR < 5%
- **Do Not Optimize:** Monthly Sales > 1 OR Monthly CTR ≥ 5%

## Products — Do Not Optimize (Sales > 1 or CTR ≥ 5%)

| Product | Monthly Sales | Monthly CTR | Reason |
|---------|-------------|------------|--------|
| IP68 External Coaxial Junction Box For Electrical Cable | 6 | 0.46% | Sales > 1 |
| Edison Style E27 G95 Bulb 4W Dimmable Screw Vintage Glo | 4 | 0.0% | Sales > 1 |
| DC12V 15W LED Driver Power Supply Transformer | 0 | 5.0% | CTR ≥ 5% |
| Pipe Lighting Accessories Iron 5-Way Cross | 0 | 5.71% | CTR ≥ 5% |
| Industrial Vintage Various Colours Ceiling Light Fittin | 12 | 0.0% | Sales > 1 |
| 3 Core Round Braided Army Green Fabric Lighting Cable | 3 | 0.0% | Sales > 1 |
| E27 Black Bakelite Lamp Holder Industrial Socket Light  | 5 | 0.82% | Sales > 1 |

## Data Sources

- **GSC:** Google Search Console API (sc-domain:ledsone.co.uk), dimensions=['page'], 2026-06-11 to 2026-07-10
- **Sales:** Shopify ShopifyQL — FROM sales SHOW orders GROUP BY product_title, same period
- **URL Verification:** All 50 product URLs verified against live Shopify handles

## Files

- Dashboard: `Staff-requirements/pages/jakshan.html` (Requirement 2 tab)
- Evidence: `evidence/Jackshan/requirement-2-seo-tracker-dataset.csv`
- Validation: `validation/Jackshan/requirement-2-validation.md`
- Handover: `handover/Jackshan/requirement-2-handover.md`
