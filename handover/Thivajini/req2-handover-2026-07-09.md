# Thivajini Req 2 — Handover
## Weekly Attribution Cross-Check Dashboard · LEDSone FR

**Date:** 2026-07-09  
**Status:** Dashboard built locally — awaiting GPT approval for Vercel deployment

---

## What Was Done

1. Req 2 KPI Discovery: confirmed all metric sources in `ppc_etl_performance_data` (see req2-kpi-discovery-evidence-2026-07-09.md)
2. Pulled 14 weeks of Google Ads campaign-level data (3 campaigns) from PostgreSQL
3. Confirmed 3 Thivajini campaigns from `cppc_workbook_product_performance_v1`
4. Pulled 200 Shopify orders (4 API calls, Apr 6 – Jul 8 2026) via customerJourney UTM fields
5. Attributed 66 orders to google_ads campaigns using any-touchpoint / last google_ads touch rule
6. Aggregated Shopify UTM orders by week + campaign
7. Computed attribution ratio = Google Ads Conversion Value ÷ Shopify UTM Revenue per week+campaign
8. Built `Staff-requirements/pages/thivajini.html` with summary cards, full 28-row table, campaign filters, CSV export, known limitations, "DO NOT DEPLOY" banner

## Files Created

| File | Path | Status |
|------|------|--------|
| Dashboard | Staff-requirements/pages/thivajini.html | ✅ Built (local) |
| Attribution evidence | evidence/Thivajini/req2-attribution-dashboard-evidence-2026-07-09.md | ✅ Created |
| KPI discovery evidence | evidence/Thivajini/req2-kpi-discovery-evidence-2026-07-09.md | ✅ Created |
| Handover | handover/Thivajini/req2-handover-2026-07-09.md | ✅ This file |
| Validation | validation/Thivajini/req2-attribution-dashboard-validation-2026-07-09.md | ✅ Created |
| Report | reports/Thivajini/req2-attribution-dashboard-report-2026-07-09.md | ✅ Created |

## Campaign Mapping (from PostgreSQL)

| Campaign ID | Name | UTM |
|-------------|------|-----|
| 23103582865 | Pmax FR \| Thivajini \| Klarna \| Topsell \| MCV | tr-pmax-topsell |
| 23405519670 | Pmax FR \| Thivajini \| Klarna \| Best Sellers \| MCV | pmax_bestselling_tr |
| 23533025729 | Pmax FR \| Thivajini \| Klarna \| Imp_Click \| MCV | pmax_allproduct (inferred) |

## Next Session Resume

1. GPT reviews dashboard and evidence file
2. If approved: deploy thivajini.html to Vercel
3. Update index.html to point to live URL
4. Confirm thresholds with Thivajini (0.95x–1.05x PASS proposed)
5. Optional next: product-level KPI dashboard (separate req)

**Owner:** Thivajini  
**Reviewer:** GPT / Piranav
