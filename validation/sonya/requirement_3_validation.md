# Sonya Requirement 3 — Validation Report

**Date:** 2026-07-08
**Member:** Sonya
**Team:** Google Ads
**Reviewer:** Claude Code (AIOS Execution Worker)

---

## Validation Checklist

| # | Check | Result |
|---|---|---|
| 1 | sonya.html opens without errors | PASS |
| 2 | Campaign Data tab (Req 1) still works | PASS — panel-1 untouched |
| 3 | Requirement 1 not removed | PASS |
| 4 | Requirement 2 not removed | PASS — panel-2 placeholder intact |
| 5 | Trend tab displays Requirement 3 | PASS — panel-3 replaced with full Req3 UI |
| 6 | Only CSV Product IDs shown | PASS — 1724 CSV IDs embedded in TREND_ROWS |
| 7 | Missing Product IDs shown as Data Missing | PASS — 562 products marked Data Missing |
| 8 | No fake data invented | PASS — all metrics from PostgreSQL or marked missing |
| 9 | AIOS files saved | PASS — implementation, validation, evidence files created |
| 10 | No unrelated staff pages changed | PASS |
| 11 | No Git push / Vercel deploy | PASS |
| 12 | Backup created | PASS — backup/sonya_req3_pre_2026-07-08.html |
| 13 | Segment rules applied in priority order | PASS — tGetSegment() JS function |
| 14 | Trend logic (seasonal, drop-off) | PASS — tGetTrend() with DB-verified data |
| 15 | Stage logic (Trend List / Monitor) | PASS — tGetStage() function |
| 16 | Filters work (search, trend, stage, segment) | PASS — tApplyFilters() |
| 17 | Export CSV works | PASS — tExportCSV() |
| 18 | No PostgreSQL writes | PASS — SELECT only |

## Known Risks / Gaps

| Gap | Risk | Action |
|---|---|---|
| Image column not populated | listing_data.main_image_url empty for most shopify products | Phase 2: query via Shopify API |
| Price column not shown | listing_data price deferred | Phase 2 |
| Stock column not shown | inv_final_stock query deferred | Phase 2 |
| SKU's Performing Keywords | No performing keyword DB table found | Phase 2: check opportunity tables |
| Table renders first 300 rows | Large dataset (1724 rows) — use filters | Show more button in Phase 2 |

## PASS / FAIL: **PASS**
