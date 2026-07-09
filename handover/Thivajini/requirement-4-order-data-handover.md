# Thivajini — Requirement 4 — Order Data — Handover
## Date: 2026-07-09

**Title:** Req 4 Order Data Handover
**Team Member:** Thivajini
**Business Question:** Which LEDSone FR products have Shopify orders vs Google Ads orders over 30/60/90 days?

## Key Findings

### Overall Attribution (30 days)
- Shopify orders: 69 total
- Ads orders: 20 total
- Ads Contribution: **29%** overall
- 42 products have Shopify orders with ZERO Ads orders (Organic Only)
- 13 products are Ads Driven (≥80% Ads contribution)

### Top Ads-Driven Products (30d)
These products generate ≥80% of their Shopify orders through Google Ads:
- LEDSone Suspension Extérieure IP65 E27 ~1545: Ads=1, Shopify=3
- Câble Plafonnier Industriel Rétro 2 Voies ~1567: Ads=2, Shopify=2 (100%)
- LEDSone Lustre araignée 8 bras vintage ~1916: Ads=2, Shopify=1 (check — Ads may exceed Shopify due to attribution lag)
- LEDSone Éclairage mural de salon ~1749: Ads=1, Shopify=1 (100%)
- LEDSone Abat-jour suspendu ~1774: Ads=1, Shopify=2 (50%)
- Full list available in dashboard CSV

### Attribution Pattern
- 70 products had NO Shopify orders in last 30 days (but had orders in 90d window)
- 42 products are purely organic (Shopify orders, zero Ads attribution)
- Organic dominates: 71% of total orders are organic

## How to Use Dashboard
1. Open Staff-requirements/pages/thivajini.html
2. Click "Order Data / Req 4" tab
3. Use window selector (30/60/90 days) to compare attribution trends
4. Filter "Ads Driven" to see products where Ads is critical
5. Filter "Organic Only" to see organic opportunities
6. Export CSV for further analysis

## Known Limitations
1. Shopify analytics uses product_title — variant-level Shopify order split not available
2. Ads orders = Google Ads attributed conversions (last-click model from ppc_etl)
3. Ads contribution can exceed 100% due to attribution model differences (view-through, cross-device)
4. "No Orders" (70 products) had orders earlier in 90d window — they are not permanently dead
5. Matching key is product title — any title changes would break matching on refresh

## Next Steps
- Review 13 Ads Driven products — ensure adequate stock (cross with Req 3 STOP list)
- Review 42 Organic Only products — consider activating Google Ads for best performers
- Req 5 to be defined
- Vercel deployment pending GPT approval

**Owner:** Thivajini | **Reviewer:** GPT / Piranav
