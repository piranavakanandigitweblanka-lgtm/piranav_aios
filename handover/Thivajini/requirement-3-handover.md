# Thivajini — Requirement 3 — Handover
## Date: 2026-07-09

**Title:** Req 3 Stock-Spend Tracker Handover
**Team Member:** Thivajini
**Business Question:** Which LEDSone FR products are wasting Google Ads spend due to OOS or low stock?

## What Was Built
Requirement 3 dashboard inside thivajini.html panel-3.
324 LEDSone FR products classified by stock-spend status.

## Key Findings

### Immediate Actions Required
- **14 STOP products** — These are actively spending on Google Ads but have stock=0 in Shopify feed or listing_data
  - Total wasted spend: €13.40 (last 30 days)
  - Action: Pause ad group / exclude SKU immediately
- **1 ACT SOON product** — Stock ≤5 with active spend
  - Action: Cut budget or arrange restock within days
- **3 MONITOR products** — Stock ≤5 but no active spend
  - Action: Watch — no wasted spend yet

### Spend Summary
- 306 / 324 products are OK (stock >5)
- €13.40 total wasted spend from 14 STOP products
- 78 products have missing feed mapping (no gmp record) — investigate these separately

## How to Use the Dashboard
1. Open Staff-requirements/pages/thivajini.html
2. Click "Stock-Spend Tracker / Req 3" tab
3. Default view: sorted by Flag (STOP first), then by 30d Spend desc
4. Use "STOP" filter to isolate products to pause immediately
5. Use "Missing Mapping" filter to investigate unmatched SKUs
6. Export CSV for action in Google Ads

## Campaigns
- Pmax FR | Thivajini | Klarna | Topsell | MCV (campaign 23103582865)
- Pmax FR | Thivajini | Klarna | Imp_Click | MCV (campaign 23533025729)

## Known Limitations
1. 78 products have no google_merchant_products record — stock/availability unknown
2. Stock unknown (-1) for products without listing_data.ref_id match
3. Wasted spend uses Google Ads attributed spend only (not total marketing cost)
4. Data snapshot: 2026-07-09. Refresh required for live decisions.

## Next Steps
- Thivajini to review STOP products in Google Ads and pause/exclude
- Investigate 78 missing mapping products (shopify_ZZ_ format)
- Req 4 to be defined and built in next sprint
- Vercel deployment pending GPT approval

**Owner:** Thivajini | **Reviewer:** GPT / Piranav
