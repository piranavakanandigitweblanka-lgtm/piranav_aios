# Sajeepan Requirement 2 — Validation
**Date:** 2026-07-28 | **Member:** Sajeepan | **Requirement:** 2 | **Reviewer:** Piranav

## Latest DB Date: 2026-07-27
## L30 Window: 2026-06-27 → 2026-07-26

---

## Wasteful Products Reconciliation (cost>£10, clicks>2, conv<0.01)

| Product Item ID | Campaign | DB Cost | DB Clicks | DB Conv | CVR | API Expected | PASS |
|---|---|---|---|---|---|---|---|
| shopify_gb_14880113525122_54875583283586 | 21069663519 | £30.70 | 3 | 0 | 0% | Wasteful | ✅ |
| shopify_gb_4436070793312_44589245563130 | 21069663519 | £23.86 | 17 | 0 | 0% | Wasteful | ✅ |
| shopify_gb_15260848095618_56318107779458 | 23590572906 | £14.32 | 8 | 0 | 0% | Wasteful | ✅ |

CVR definition confirmed: `conversions / clicks` (no stored CVR column in product_performance).

## Neg KW Candidates Reconciliation (cost>£5, clicks>5, conv=0)

| Search Term | Campaign | DB Cost | DB Clicks | DB Conv | PASS |
|---|---|---|---|---|---|
| pool table lights | 21069663519 | £5.40 | 9 | 0 | ✅ |
| e27 bulb | 21069663519 | £5.40 | 12 | 0 | ✅ |
| industrial wall lights | 21069663519 | £5.11 | 10 | 0 | ✅ |

Source: `google_ads.pmax_campaign_search_term_data` — confirmed contains Sajeepan campaign data.

## Req1 Regression
- Req1 panel unmodified — existing HTML/JS untouched
- Tab switcher hides/shows panels correctly (no DOM conflicts)
- Status: ✅ PASS (code review)

## Unsupported Sections — Correctly Documented
- Geo Exclude: shown as "Data unavailable" ✅
- Margin Safety: shown as "Margin data unavailable" ✅
- Keyword Planner: shown as "Review Required" ✅
- P3 Clean-Up: shown as "Not connected" ✅
- Price-Based Wasteful: BLOCKED — not implemented ✅
- High ROAS boundary: BLOCKED — not implemented ✅

## Overall Status: **PASS** (supported features implemented correctly)
