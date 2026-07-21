# Jackshan — Requirement 2 — Handover

**Date:** 2026-07-13  
**Status:** PASS — superseded by live API build 2026-07-21  
**Completed by:** AIOS

> **2026-07-21 UPDATE:** The hardcoded dataset in this handover has been replaced by a live PostgreSQL API. The dashboard now fetches fresh data on every load with a selectable date range. See `evidence/Jackshan/requirement-1/live-api-closure-2026-07-21.md` for the current canonical record. JACK-R2 status remains **PASS**.

## What Was Built

Requirement 2 (SEO Optimization Tracker) added as a second tab inside `Staff-requirements/pages/jakshan.html`. No new file created.

## Dashboard Location

`Staff-requirements/pages/jakshan.html` → click **Requirement 2 — SEO Optimization Tracker** tab

## Data Sources

| Source | Tool | Period |
|--------|------|--------|
| GSC Page Metrics | Google Search Console API | 2026-06-11 to 2026-07-10 |
| Sales Data | Shopify ShopifyQL (FROM sales GROUP BY product_title) | 2026-06-11 to 2026-07-10 |

## Business Logic

| Condition | Status |
|-----------|--------|
| Monthly Sales ≤ 1 AND Monthly CTR < 5% | Optimize |
| Monthly Sales > 1 OR Monthly CTR ≥ 5% | Do Not Optimize |

## Results

- **43 products** flagged for optimization
- **7 products** — Do Not Optimize
- Average CTR: 0.3%

## Products — Do Not Optimize

| Product | Sales | CTR | Reason |
|---------|-------|-----|--------|
| IP68 External Coaxial Junction Box For Electrical  | 6 | 0.46% | Sales > 1 |
| Edison Style E27 G95 Bulb 4W Dimmable Screw Vintag | 4 | 0.0% | Sales > 1 |
| DC12V 15W LED Driver Power Supply Transformer | 0 | 5.0% | CTR ≥ 5% |
| Pipe Lighting Accessories Iron 5-Way Cross | 0 | 5.71% | CTR ≥ 5% |
| Industrial Vintage Various Colours Ceiling Light F | 12 | 0.0% | Sales > 1 |
| 3 Core Round Braided Army Green Fabric Lighting Ca | 3 | 0.0% | Sales > 1 |
| E27 Black Bakelite Lamp Holder Industrial Socket L | 5 | 0.82% | Sales > 1 |

## Re-run Instructions

1. Run `gsc_jackshan_v2.py` to refresh GSC data → updates `gsc_v2.json`
2. Run `build_jakshan_req2.py` to regenerate HTML
3. Re-query Shopify ShopifyQL for updated sales figures and update `SALES_MONTHLY` / `SALES_WEEKLY` dicts in build script

## Known Data Notes

- Products with 0 monthly sales confirmed via ShopifyQL (no row = no sale in period)
- dc12v-15w: CTR exactly 5.0% → DNO (rule: CTR < 5%, not ≤ 5%)
- pipe-lighting: CTR 5.71% → DNO (CTR ≥ 5%)
