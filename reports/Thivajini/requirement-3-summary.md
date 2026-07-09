# Thivajini — Requirement 3 — Summary Report
## Date: 2026-07-09

**Title:** Req 3 Stock-Spend Tracker Summary
**Team Member:** Thivajini
**Store:** ledsone.fr (EUR) | sub_source_id=233 | merchant_id=5551466539
**Period:** Last 30 days (to 2026-07-09)
**Status:** COMPLETE — LOCAL ONLY

## KPI Snapshot

| Metric | Value |
|--------|-------|
| Total Products Tracked | 324 |
| STOP — Out of Stock | 14 |
| ACT SOON — Low Stock | 1 |
| MONITOR | 3 |
| OK | 306 |
| Total Wasted Spend | €13.40 |
| Low Stock Threshold | 5 units |
| Campaigns | 2 (Topsell, Imp_Click) |

## Match Coverage

| Method | Count | % |
|--------|-------|---|
| Product ID match (direct) | 144 | 44.4% |
| Record ID match (fallback) | 102 | 31.5% |
| Missing mapping | 78 | 24.1% |
| **Total** | **324** | **100%** |

## Immediate Action Items

| Priority | Action | Products | Wasted Spend |
|----------|--------|----------|-------------|
| CRITICAL | Pause ad groups / exclude SKUs (STOP) | 14 | €13.40 |
| HIGH | Cut budget / arrange restock (ACT SOON) | 1 | Preventive |
| MEDIUM | Investigate missing mapping products | 78 | Unknown |
| LOW | Monitor low-stock zero-spend products | 3 | €0 |

## Data Quality Notes
- 78 products with active spend have no google_merchant_products record
- Stock unknown for products without listing_data.ref_id bridge
- Wasted spend is conservative (Google Ads only, 30 days)

## Files
- Staff-requirements/pages/thivajini.html — dashboard (panel-3)
- evidence/Thivajini/requirement-3-data-mapping.md
- evidence/Thivajini/requirement-3-build-evidence.md
- validation/Thivajini/requirement-3-validation.md
- handover/Thivajini/requirement-3-handover.md

## PASS / FAIL: PASS

**Owner:** Thivajini | **Reviewer:** GPT / Piranav
