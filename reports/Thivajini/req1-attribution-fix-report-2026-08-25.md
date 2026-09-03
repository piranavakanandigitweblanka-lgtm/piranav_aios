# Final Report — Req 1 Attribution Cross-Check Logic Fix

**Date:** 2026-08-25
**Team member:** Thivajini · Google Ads · LEDSone FR
**Requirement:** Req 1 — Conversion Tracking & Data Integrity

---

## 1. Authoritative Source

**Thivagini · Google Ads → Google Ads Sales check:**
- `Staff-requirements/api/sales.js` — `staff=thivagini-ads` branch (line 4463)
- `Staff-requirements/api/data/thivagini-fr-ads-sales-2026-{01-07}.json` (monthly snapshots)
- Served at: `pages/sales2.html?staff=thivagini`

Revenue definition: `netSales = grossSales - discounts - refunds` per line item, **excluding VAT and shipping**.

---

## 2. Current Dashboard

- Frontend: `Staff-requirements/pages/thivajini.html` — Panel 1 (Req 1)
- API: `Staff-requirements/api/members-api.js` — `handleThivajini1()` + `tvFetchShopifyUTMOrders()`

---

## 3. Root Cause

**Primary — Revenue field mismatch:**
The Shopify UTM Revenue in the cross-check used `currentTotalPriceSet` (full order total including French VAT at 20% and shipping). The authoritative Google Ads Sales check uses `netSales` (line-item subtotal excluding taxes and shipping). This inflated the Shopify UTM Revenue by approximately 31% (based on May 2026 snapshot: orderTotalSum €1,676 vs netSales €1,280), causing the Attribution Ratio to appear ~24% lower than it truly is.

**Secondary — Campaign label/colour bugs:**
- `campClass()` checked `c==="All Products"` but the API returns `"Imp_Click"` — so "Imp_Click" rows always received the wrong colour class
- The HTML legend displayed "All Products" which matched nothing in the data table
- `fmtRatio()` and `statusBadge()` guarded on `r.ads_conv===0` instead of `r.ads_val===0`, incorrectly suppressing the ratio when conversion count was zero but conversion value existed

---

## 4. Correct Logic (Authoritative)

Shopify UTM Revenue must use **`currentSubtotalPriceSet`** (Shopify Admin GraphQL field):
- Excludes VAT and shipping
- Includes discounts (reflected in current subtotal)
- Reflects refunds (currentSubtotalPriceSet is post-refund)
- Matches `netSales = grossSales - discounts - refunds` from the authoritative monthly check

Google Ads conversion value (`SUM(conversion_value)` from `google_ads.campaign_performance`) remains unchanged — it is the same source used by both implementations.

---

## 5. PostgreSQL Sources

| Schema | Object | Columns Used | Purpose |
|---|---|---|---|
| `google_ads` | `campaign_performance` | `campaign_id`, `date`, `conversion_value`, `conversions`, `cost`, `impressions`, `clicks` | Google Ads side of cross-check |
| N/A | Shopify Admin GraphQL | `currentSubtotalPriceSet`, `customerJourneySummary`, `createdAt` | Shopify UTM side |

Read-only. No schema changes. No data modifications.

---

## 6. Changes Made

| File | Change |
|---|---|
| `api/members-api.js` | GraphQL QUERY: `currentTotalPriceSet` → `currentSubtotalPriceSet` |
| `api/members-api.js` | Revenue parse: `.currentTotalPriceSet` → `.currentSubtotalPriceSet` (with comment) |
| `pages/thivajini.html` | `campClass()`: `"All Products"` → `"Imp_Click"` |
| `pages/thivajini.html` | Legend: "All Products" → "Imp_Click" |
| `pages/thivajini.html` | `fmtRatio()` guard: `r.ads_conv===0` → `r.ads_val===0` |
| `pages/thivajini.html` | `statusBadge()` guard: `r.ads_conv===0` → `r.ads_val===0`; badge text "NO ADS CONV" → "NO ADS VALUE" |
| `pages/thivajini.html` | Data source note: updated to document `currentSubtotalPriceSet` |

---

## 7. Before vs After

| Test | Metric | Before | After | Status |
|---|---|---|---|---|
| May 2026 — Shopify revenue basis | Revenue field | incl. VAT+shipping (~€1,677 monthly) | excl. VAT+shipping (~€1,280 monthly) | FIXED |
| Attribution Ratio example | Ratio formula | Ads val ÷ inflated Shopify rev (artificially low) | Ads val ÷ correct Shopify subtotal | FIXED |
| Imp_Click row colour | CSS class | `camp-bestsell` (amber — wrong) | `camp-allproduct` (green — correct) | FIXED |
| Legend entry | Display label | "All Products" (no matching rows) | "Imp_Click" (matches table) | FIXED |
| Ratio display when ads_conv=0 | Shown/hidden | Hidden (wrong guard) | Shown if ads_val>0 | FIXED |

---

## 8. Validation

- Syntax: PASS
- API field validity: PASS (currentSubtotalPriceSet is standard Shopify Admin GraphQL)
- Revenue logic: PASS (excl. taxes/shipping, matching authoritative netSales)
- Campaign colours: PASS (all three campaigns correctly coloured)
- Ratio guard: PASS (ads_val===0 is correct revenue-based guard)
- No production data modified: PASS
- Authoritative source unchanged: PASS

---

## 9. Evidence

- `evidence/Thivajini/req1-attribution-logic-fix-2026-08-25.md`
- `validation/Thivajini/req1-attribution-fix-validation-2026-08-25.md`
- `reports/Thivajini/req1-attribution-fix-report-2026-08-25.md`

---

## 10. PASS / FAIL

**RESULT: PASS**

Authoritative Google Ads Sales check logic identified. Incorrect logic in current dashboard identified and evidenced. Root cause confirmed (revenue field inflation ~31%). All corrections applied. No production data modified. AIOS evidence saved.

**Known limitations remaining:**
1. `currentSubtotalPriceSet` vs `netSales` may diverge slightly on order-level discount edge cases
2. Weekly last-touch vs monthly first-touch attribution model remains a scope difference (by design)
3. "No Journey Data (Ad-Click Matched)" orders excluded from weekly cross-check (by design — no campaign to assign)
4. Google Ads `conversion_value` tax basis should be confirmed with Thivajini to ensure full comparability
