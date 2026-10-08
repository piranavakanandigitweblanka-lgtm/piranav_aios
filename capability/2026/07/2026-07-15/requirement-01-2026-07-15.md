# Capability Record — Theekshy Requirement 1

- **Title:** Google Ads Campaign/Product Optimisation Before-vs-After Analysis
- **Task:** Capability documentation for Req 1
- **Date:** 2026-07-15
- **Member:** Theekshy
- **Team:** Google Ads
- **Requirement:** 1 — Campaign Optimisation
- **Source:** What_I_Need_To_Improve_ADS_Performance - Copy of Theekshy (1).csv
- **Objective:** Document reusable capability for 14-day before/after optimisation analysis
- **Dashboard Tab:** Campaign Optimisation (Requirement 1)
- **Campaign Scope:** THEE_GEMS (23714290257), THEE_MYSTERY (23684837882)
- **Store and Country:** LEDSone UK / United Kingdom
- **Date Range:** Rolling 30-day window
- **Latest Data Date:** 2026-07-14
- **PostgreSQL Environment:** ledsone-db-mcp
- **PostgreSQL Sources:** google_ads.campaign_performance, google_ads.product_performance
- **Tables or Views:** campaign_performance (daily grain), product_performance (product_item_id grain)
- **Join Keys:** campaign_id, product_item_id
- **Files Changed:** Staff-requirements/pages/theekshy.html
- **Business Rules:** 6 rules (see below)
- **Evidence:** evidence/theekshy/requirement-01-2026-07-15.md
- **Validation:** validation/theekshy/requirement-01-2026-07-15.md
- **Reviewer:** GPT / Piranav
- **Status:** PASS
- **Risks:** Requires action-log data source to activate before/after comparison
- **Next Action:** Deploy + begin action log
- **PASS / FAIL:** PASS

---

## Capability Description

Google Ads campaign/product optimisation before-vs-after analysis using a 14-day review window and Theekshy-specific campaign scoping.

## Inputs

- `google_ads.campaign_performance` — daily grain: campaign_id, date, cost, clicks, impressions, conversions, conversion_value, roas, ctr
- `google_ads.product_performance` — product grain: campaign_id, product_item_id, date, cost, clicks, impressions, conversions, conversion_value, ctr, avg_cpc
- `google_ads.merchant_products` — title lookup: product_id, title, country
- Action log source (future): Date Optimised, Campaign, Product ID, Optimisation Applied, Condition Triggered

## Outputs

- Campaign status cards (Critical / Monitor / Healthy per 30-day ROAS)
- Product performance table with Rule 1–4 status flags
- Before/After comparison table (when action log available)
- ROAS trend chart (daily line)
- Conversion Value chart (daily bar)
- KPI cards: total cost, conv value, ROAS per campaign, critical products count

## Formulas

- ROAS = Conversion Value / Cost (N/A when Cost = 0)
- CTR = Clicks / Impressions × 100 (N/A when Impressions = 0)
- ROAS Change = After ROAS − Before ROAS
- Conv Value Change = After Conv Value − Before Conv Value
- Next Review Date = Date Optimised + 14 days

## Business Rules (all 6 from CSV)

1. High Spend / 0 Conversions → Critical → Exclude from listing group
2. ROAS < 3.0 → Critical → Lower tROAS
3. 3.0 ≤ ROAS < 4.5 → Monitor → Hold budget
4. ROAS ≥ 4.5 → Healthy → Scale budget 10–20%
5. After ROAS > Before AND After CV > Before → Healthy (post-opt improved)
6. After ROAS ≤ Before after 14 complete days → Monitor (post-opt no improvement)

## Date Window Logic

- Before Period: 14 calendar days immediately before Date Optimised (exclusive of opt date)
- After Period: 14 calendar days beginning on Date Optimised
- After period labelled "Pending Review" until all 14 days have source data
- Comparison only made on complete after periods

## Dependencies

- Chart.js 4.4.0 (CDN: cdn.jsdelivr.net)
- google_ads schema in ledsone-db-mcp (read-only)
- Action log source (DB table or CSV feed) required for before/after table activation

## Limitations

- Product titles: partial match via merchant_products (large Shopify variant IDs don't match)
- Action log: no live DB source currently; empty state displayed
- Product data: top 30 by cost per campaign embedded (not full product list)
- Data is embedded as JS constants (static per build); page requires rebuild when data refreshes

## Reuse Guidance

This capability pattern (14-day before/after with ROAS-based status rules) can be adapted for other Google Ads team members (Sajeepan, Sonya, Thivajini) with different campaign_id scoping. The JS functions (getProductStatus, getProductCondition, getProductAction, safeRoas, safeCtr) are generic and portable. Campaign-specific data must be replaced; business rules may vary per member's requirement CSV.
