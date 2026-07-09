# Thivajini Req 2 — Attribution Dashboard Evidence
## Weekly Google Ads vs Shopify UTM Cross-Check · LEDSone FR

**Date:** 2026-07-09  
**Team member:** Thivajini  
**Store:** LEDSone FR (ledsone.fr)  
**Status:** BUILT — local only, not deployed

---

## CAMPAIGN MAPPING (Confirmed from PostgreSQL + Shopify API)

| PostgreSQL Campaign ID | Campaign Name | Shopify UTM Campaign | Confidence |
|------------------------|---------------|---------------------|------------|
| 23103582865 | Pmax FR \| Thivajini \| Klarna \| Topsell \| MCV | tr-pmax-topsell | HIGH — "Topsell" in both |
| 23405519670 | Pmax FR \| Thivajini \| Klarna \| Best Sellers \| MCV | pmax_bestselling_tr | HIGH — "Best Sellers / bestselling" |
| 23533025729 | Pmax FR \| Thivajini \| Klarna \| Imp_Click \| MCV | pmax_allproduct | INFERRED — only campaign left |

Source: `staging_ai.cppc_workbook_product_performance_v1` (canonical_owner='Thivajini')

## FR ACCOUNT CONFIRMATION

- sub_source_id=233, marketplace_id=9, source=3 = LEDSone FR
- Confirmed by: campaign names "Pmax FR | Thivajini…", EUR currency, Shopify order prefix LSFR
- google_merchant_products merchant_id=5551466539 = France, FR, EUR

## DATA COLLECTION

**Google Ads (PostgreSQL):**
- Table: `public.ppc_etl_performance_data`
- Filter: source=3, sub_source_id=233, record_type='campaign', campaign_id IN (3 Thivajini campaigns)
- Aggregation: DATE_TRUNC('week', date) Monday-start
- 14 weeks: 2026-04-06 → 2026-07-07

**Shopify UTM (Shopify Admin GraphQL API):**
- 200 orders inspected (LSFR1303 – LSFR1488, 2026-04-06 → 2026-07-08)
- 4 API calls (50 orders each) with pagination cursor
- UTM field: customerJourney.{firstVisit,lastVisit,moments}.utmParameters
- Attribution: any-touchpoint (order counted if ANY moment has utm_source="google_ads" AND utm_medium="cpc")
- Campaign assignment: lastVisit UTM campaign if google_ads, else last moment with google_ads UTM
- 66 google_ads attributed orders out of 200 total (~33%)

## RAW WEEKLY DATA (28 rows)

| Week | Campaign | Ads Conv | Ads Val (€) | Shop Ord | Shop Rev (€) | Ratio | Status |
|------|----------|----------|-------------|----------|--------------|-------|--------|
| 2026-07-06 | Topsell | 1 | 47.52 | 2 | 97.52 | 0.49x | FAIL |
| 2026-07-06 | All Products | 2 | 20.11 | 1 | 17.11 | 1.18x | REVIEW |
| 2026-06-29 | Topsell | 3 | 80.56 | 2 | 79.40 | 1.01x | PASS |
| 2026-06-29 | All Products | 3 | 58.89 | 3 | 85.86 | 0.69x | FAIL |
| 2026-06-22 | Topsell | 3 | 144.35 | 2 | 71.05 | 2.03x | FAIL |
| 2026-06-22 | All Products | 4 | 242.76 | 6 | 423.75 | 0.57x | FAIL |
| 2026-06-15 | Topsell | 2 | 40.38 | 2 | 58.36 | 0.69x | FAIL |
| 2026-06-15 | All Products | 1 | 81.96 | 1 | 248.55 | 0.33x | FAIL |
| 2026-06-08 | All Products | 3 | 179.84 | 4 | 223.67 | 0.80x | REVIEW |
| 2026-06-01 | Topsell | 4 | 675.30 | 2 | 277.52 | 2.43x | FAIL |
| 2026-06-01 | All Products | 2 | 124.96 | 2 | 143.94 | 0.87x | REVIEW |
| 2026-05-25 | All Products | 0 | 0.00 | 1 | 111.41 | N/A | NO ADS CONV |
| 2026-05-18 | Topsell | 1 | 83.53 | 0 | 0.00 | N/A | NO SHOPIFY UTM |
| 2026-05-18 | All Products | 3 | 135.26 | 2 | 49.82 | 2.71x | FAIL |
| 2026-05-18 | Best Sellers | 0 | 0.00 | 1 | 27.25 | N/A | NO ADS CONV |
| 2026-05-11 | Topsell | 5 | 240.84 | 5 | 280.79 | 0.86x | REVIEW |
| 2026-05-11 | All Products | 4 | 170.33 | 3 | 175.04 | 0.97x | PASS |
| 2026-05-04 | Topsell | 3 | 375.39 | 3 | 399.36 | 0.94x | REVIEW |
| 2026-05-04 | Best Sellers | 1 | 16.48 | 1 | 24.47 | 0.67x | FAIL |
| 2026-05-04 | All Products | 3 | 87.01 | 3 | 110.98 | 0.78x | FAIL |
| 2026-04-27 | Topsell | 4 | 878.11 | 4 | 910.07 | 0.97x | PASS |
| 2026-04-27 | All Products | 4 | 292.38 | 4 | 324.34 | 0.90x | REVIEW |
| 2026-04-20 | Topsell | 1 | 103.55 | 2 | 432.01 | 0.24x | FAIL |
| 2026-04-13 | Topsell | 1 | 61.26 | 0 | 0.00 | N/A | NO SHOPIFY UTM |
| 2026-04-13 | All Products | 2 | 112.30 | 2 | 128.28 | 0.88x | REVIEW |
| 2026-04-06 | Topsell | 2 | 31.56 | 3 | 97.51 | 0.32x | FAIL |
| 2026-04-06 | Best Sellers | 0 | 0.00 | 1 | 62.86 | N/A | NO ADS CONV |
| 2026-04-06 | All Products | 5 | 207.68 | 4 | 197.66 | 1.05x | PASS |

## KNOWN LIMITATIONS

1. All Products (pmax_allproduct) ↔ campaign 23533025729 mapping is inferred — no direct join confirmed
2. Google Ads conversion window (30-day click default) may pull in orders from prior weeks
3. Multi-touch orders assigned to last google_ads touchpoint only — revenue may appear in wrong campaign
4. Google Ads can count >1 conversion per order; Shopify counts orders
5. 5 rows have incomplete data on one side (no Shopify UTM or no Ads conversions)
6. Thresholds (0.95x–1.05x / 0.80x–1.20x) are proposed, not confirmed by Thivajini

**Owner:** Thivajini  
**Reviewer:** GPT / Piranav  
**Status:** LOCAL — ready for GPT validation
