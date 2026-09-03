# Validation — Req 1 Attribution Cross-Check Fix

**Title:** Logic Fix Validation — Weekly Google Ads vs Shopify UTM Attribution Cross-Check
**Team member:** Thivajini · LEDSone FR · Google Ads
**Date:** 2026-08-25
**Evidence ref:** evidence/Thivajini/req1-attribution-logic-fix-2026-08-25.md

---

## Validation Checklist

| Check | Result | Notes |
|---|---|---|
| Syntax — members-api.js | PASS | Field rename only; no structural change |
| Syntax — thivajini.html | PASS | String literal changes; no JS logic errors |
| Shopify GraphQL field validity | PASS | `currentSubtotalPriceSet` is a standard Shopify Admin GraphQL field |
| Revenue calculation logic | PASS | `currentSubtotalPriceSet` = subtotal after discounts, before taxes/shipping ≈ authoritative `netSales` |
| Campaign colour (Imp_Click) | PASS | `campClass("Imp_Click")` now returns `"camp-allproduct"` (green) |
| Campaign colour (Best Sellers) | PASS | `campClass("Best Sellers")` still returns `"camp-bestsell"` (amber) |
| Campaign colour (Topsell) | PASS | `campClass("Topsell")` still returns `"camp-topsell"` (blue) |
| Legend label | PASS | "Imp_Click" displayed in legend; matches table rows |
| fmtRatio guard | PASS | Now `r.ads_val===0\|\|r.shop_rev===0` — correct revenue-based guard |
| statusBadge guard | PASS | Now `r.ads_val===0` — consistent with fmtRatio |
| statusBadge badge text | PASS | "NO ADS CONV" → "NO ADS VALUE" — more accurate label |
| No production DB changes | PASS | Read-only PostgreSQL access only |
| Authoritative source unchanged | PASS | sales.js not modified; snapshots not modified |
| Duplicate dashboard created | PASS (none) | No second dashboard created |

---

## Revenue Field Validation

May 2026 authoritative snapshot comparison:

| Measure | Value | Source |
|---|---|---|
| orderTotalSum (incl. VAT+shipping) | €1,676.60 | thivagini-fr-ads-sales-2026-05.json |
| netSales (excl. VAT+shipping) | €1,279.93 | thivagini-fr-ads-sales-2026-05.json |
| Inflation factor | ×1.31 | orderTotalSum / netSales |
| Previous Shopify UTM Revenue basis | orderTotal (~×1.31 inflated) | members-api.js before fix |
| Fixed Shopify UTM Revenue basis | currentSubtotalPriceSet (~= netSales) | members-api.js after fix |

**Attribution Ratio impact (example — May week 2026-05-18 Topsell):**
- Before: `ads_val / orderTotal` → ratio artificially suppressed by ~31%
- After: `ads_val / subtotal` → ratio reflects correct revenue comparison

---

## PASS / FAIL

**RESULT: PASS**

All four confirmed logic errors corrected:
1. ✅ Revenue field: `currentTotalPriceSet` → `currentSubtotalPriceSet`
2. ✅ Campaign class: `"All Products"` → `"Imp_Click"`
3. ✅ Legend label: "All Products" → "Imp_Click"
4. ✅ Ratio/badge guard: `ads_conv===0` → `ads_val===0`

No production data modified. Authoritative source not modified. Evidence saved.
