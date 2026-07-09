# Thivajini — Requirement 4 — Order Data — Summary Report
## Date: 2026-07-09

**Title:** Req 4 Order Data Summary
**Team Member:** Thivajini
**Store:** ledsone.fr (EUR) | sub_source_id=233
**Period:** 30/60/90 days to 2026-07-09
**Status:** COMPLETE — LOCAL ONLY (NOT PUSHED)

## Order Comparison Summary

| Window | Shopify Orders | Ads Orders | Ads Contribution % |
|--------|---------------|-----------|-------------------|
| 30 days | 69 | 20 | 29% |
| 60 days | 136 | 31 | 23% |
| 90 days | 213 | 48 | 23% |

## Product Attribution Status (based on 30d window)

| Status | Count | Description |
|--------|-------|-------------|
| Ads Driven | 13 | ≥80% of Shopify orders attributed to Ads |
| Balanced | 2 | 40–79% Ads attribution |
| Organic Heavy | 1 | <40% Ads attribution |
| Organic Only | 42 | Shopify orders, zero Ads orders (30d) |
| No Orders | 70 | Zero Shopify orders in 30d window |
| **Total** | **128** | |

## Data Sources
- Shopify: ShopifyQL analytics (product-level, all paid Shopify orders)
- Ads: public.ppc_etl_performance_data (sub_source_id=233, record_type=product)
- Matching: Product Title via Shopify Product ID lookup from ppc_etl.record_id

## Files Modified/Created
- Staff-requirements/pages/thivajini.html — panel-4 injected (430,267 bytes)
- prompts/Thivajini/requirement-4-order-data-build.md
- evidence/Thivajini/requirement-4-order-data-evidence.md
- validation/Thivajini/requirement-4-order-data-validation.md
- handover/Thivajini/requirement-4-order-data-handover.md
- reports/Thivajini/requirement-4-order-data-report.md (this file)
- vercel/Thivajini/requirement-4-deployment-notes.md

## PASS / FAIL: PASS (LOCAL ONLY — not pushed)

**Owner:** Thivajini | **Reviewer:** GPT / Piranav
