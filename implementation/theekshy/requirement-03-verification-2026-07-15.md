# Implementation — Theekshy Requirement 3 — Feed Optimisation Verification

**Staff:** Theekshy
**Verification Date:** 2026-07-15

---

## Defects Found

| ID | Severity | Defect | Location |
|---|---|---|---|
| D01 | CRITICAL | R3_DATA contained 40 rows of fabricated data — wrong product IDs (many not in real Top 40), costs inflated 10–15x, product titles were LED products instead of real vintage lighting products | `theekshy.html` → `var R3_DATA` |
| D02 | CRITICAL | KPI summary stats wrong: OOS=111 (should be 132), price_mismatch=47 (should be 229), avail_mismatch=10 (should be 107) | `theekshy.html` → `renderR3Kpis()` → `totalSummary` |
| D03 | HIGH | 4 products incorrectly labelled EUR: 44853051982074, 55121138155906, 56724614742402, 55262186242434 — all have GBP records in DB | `R3_DATA` |
| D04 | HIGH | 55219110707586 shown as gmc_avail='out of stock' — DB shows 'in stock'; condition was "Availability Mismatch", should be "Price Mismatch" (£22.30 vs £23.19) | `R3_DATA` |
| D05 | HIGH | 55219110674818 shown as gmc_avail='out of stock' — DB shows 'in stock'; condition was "Availability Mismatch", should be "Incomplete Verification" (price match ✅) | `R3_DATA` |
| D06 | MEDIUM | `r3GetConditions()` did not guard against null `shop_stock` — null could behave like 0 in some edge cases | `theekshy.html` → `r3GetConditions()` |
| D07 | MEDIUM | Insight section described wrong products and wrong issues (based on fabricated data) | `theekshy.html` → `buildR3Insights()` |
| D08 | LOW | Validation box in HTML referenced wrong counts in original build | `theekshy.html` → `.val-box` |

---

## Root Causes

- D01–D05: The initial R3 build used fabricated data instead of executing live database queries for the embedded `R3_DATA` array. Products were invented with LED-themed titles matching the company name "LEDSone" but not matching actual campaign product feed.
- D06: Missing null guard in stock condition logic.
- D07: Insights were derived from fabricated D01 data.

---

## Fixes Applied

| Fix | File | Line Range (approx) | Change |
|---|---|---|---|
| R3_DATA replaced | `theekshy.html` | ~1589–1631 | Full 40-row array replaced with verified PostgreSQL data |
| KPI stats corrected | `theekshy.html` | renderR3Kpis() | `totalSummary=[1402,132,229,107]` |
| r3GetConditions null guard | `theekshy.html` | r3GetConditions() | `if(r.shop_stock!==null)` wraps stock/avail checks |
| Insights section corrected | `theekshy.html` | buildR3Insights() | Replaced with real verified findings |
| Validation box note added | `theekshy.html` | .val-box | Added WARN note about R3_DATA correction |

---

## Regression Protection

- Panel 1 (Req 1): No changes made to panel-1 HTML or Req 1 JS
- Panel 2 (Req 2): No changes made to panel-2 HTML or r2* JS functions
- R3_DATA replacement is a data-only change; all JS logic (r3PriceMatch, r3GetConditions, renderR3Table, etc.) preserved
- `r3GetConditions` fix is additive null guard — no logic change for records where stock is known (non-null)

---

## Remaining Limitations

| Limitation | Impact | Resolution |
|---|---|---|
| GMC approval/eligibility unavailable (0 rows in asset_group_listing_group_filters) | All products show Incomplete Verification instead of Feed Healthy | Requires GMC API data sync for Theekshy campaigns |
| merchant_products has no timestamp column | GMC latest date unknown | N/A — document limitation |
| Title/Description Updated unverifiable | Fields show "Unable to Verify" | Requires Req 1 to log before-content snapshot |
| 7-day review schedule inactive | Section shows empty state | Requires optimisation events in Req 1 action log |
| Shopify parent-level products (no variant price/stock) | 10/40 products have null Shopify price/stock | Data architecture issue; parent products have no variant rows in shopify_listings |
