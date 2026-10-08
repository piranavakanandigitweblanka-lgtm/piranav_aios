# Capability — Sajeepan Requirement 3: Revenue Protection & PPC Actions
**Date:** 2026-08-11 | **Capability doc written:** 2026-09-03 | **Status:** ACTIVE

---

## Requirement ID
SAJEEPAN-R3-2026-08-11

## What This Capability Does
Adds a third tab "Revenue Protection & PPC Actions" to the Sajeepan Google Ads PMax dashboard. Runs 8 DB queries to surface OOS products in active ads, ROAS drops, budget-limited campaigns, cross-platform winners, duplicate entries, and ROAS band classifications.

## Asset Paths
- `Staff-requirements-02/api/members-api.js` — `handleSajeepanReq3` function (+185 lines)
- `Staff-requirements-02/pages/sajeepan.html` — R3 tab button + sections A–D HTML + JS (+149 lines, -0 lines)

## Git Commit
`717f3d8` — https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios/commit/717f3d8

---

## Sections & Queries

| Section | Label | Query Description | DB Tables |
|---|---|---|---|
| A1 | OOS Best-Sellers in Ads | Products currently in active ads but out of stock | `google_ads.product_performance`, `inventory` |
| A2 | Budget-Limited Campaigns | Active campaigns with budget available but impression share loss | `google_ads.campaigns` |
| A3 | ROAS Drops >30% WoW | Campaigns with week-over-week ROAS decline > 30% | `google_ads.campaign_performance` |
| A4 | Cross-Platform Winners | Products selling well on Amazon/eBay but absent from Google Ads | `order_management` |
| B1 | ROAS Band Classification | All active campaigns classified into 5 ROAS bands | `google_ads.campaign_performance` |
| C1 | Duplicate Campaigns | Same product appearing in 2+ campaigns | `google_ads.product_performance` |
| C2 | Duplicate Titles | Same product title appearing multiple times in merchant feed | `google_ads.merchant_products` |
| C3 | Duplicate Merchant Items | Duplicate product_id in merchant feed | `google_ads.merchant_products` |

---

## ROAS Bands (Editable in UI)

| Band | Label | Threshold | Action |
|---|---|---|---|
| 1 | Scale | ≥ target ROAS × 1.0 (default ≥ 400%) | Increase budget |
| 2 | Keep | ≥ 300% | Maintain |
| 3 | Monitor | ≥ 250% | Watch closely |
| 4 | Reduce | ≥ 100% | Reduce spend |
| 5 | Exclude | < 100% | Remove from campaigns |

**OOS Override Rule:** If a product is out of stock, it is flagged OOS regardless of ROAS band. Stock protection takes priority over ROAS classification.

---

## Business Intent
R3 is a revenue protection tool, not a pure PPC optimisation tab. It catches:
- Money being spent on products that cannot be sold (OOS in active ads)
- Revenue being left on the table (cross-platform winners not in ads)
- Campaign structure problems (duplicates, ROAS band mismatches)

---

## How to Add a New Query
1. Add a handler in `handleSajeepanReq3` in `members-api.js` — follow the existing `?member=sajeepan&type=req3&section=X` routing pattern
2. Add a corresponding HTML section in `sajeepan.html` under the R3 tab panel
3. Add the JS fetch call in the R3 tab's JS block

---

## Related Files
- Closure: `closure/sajeepan/requirement-3-2026-08-11.md`
- API: `Staff-requirements-02/api/members-api.js` (search: `handleSajeepanReq3`)
- Dashboard: `Staff-requirements-02/pages/sajeepan.html`
