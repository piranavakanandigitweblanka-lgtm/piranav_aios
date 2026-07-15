# Validation — Theekshy Requirement 3 — Feed Optimisation Verification

**Staff:** Theekshy
**Requirement:** 3 — Feed Optimisation
**Verification Date:** 2026-07-15

---

## Verification Test Results

| # | Test | Result | Notes |
|---|---|---|---|
| V01 | Campaign scope — only THEE_GEMS and THEE_MYSTERY | PASS | Verified via google_ads.campaigns query |
| V02 | Campaign names exact match (trim + case) | PASS | Both match authoritative names exactly |
| V03 | No unrelated campaigns included | PASS | Only IDs 23714290257 and 23684837882 used |
| V04 | Requirement 1 dependency — no optimisation events | PASS | Empty state shown correctly |
| V05 | Feed Review Date = Date Last Optimised + 7 days | PASS | Architecture correct; not triggered (no events) |
| V06 | No optimisation dates invented | PASS | Date fields not shown; empty state only |
| V07 | Total products = 1,402 | PASS | Verified: COUNT(DISTINCT product_item_id) = 1402 |
| V08 | OOS count = 132 (initial 111 was wrong) | PASS (FIXED) | Was 111 — corrected to 132 after DB verification |
| V09 | Price mismatch count = 229 (initial 47 was wrong) | PASS (FIXED) | Was 47 — corrected to 229 after DB verification |
| V10 | Availability mismatch count = 107 (initial 10 was wrong) | PASS (FIXED) | Was 10 — corrected to 107 after DB verification |
| V11 | R3_DATA replaced with real PostgreSQL data | PASS (FIXED) | All 40 rows verified from DB queries |
| V12 | Product titles are real (not fabricated LED products) | PASS (FIXED) | Real titles: vintage pendant lights, ceiling fittings, fabric cable |
| V13 | Cost values are correct | PASS (FIXED) | e.g., 55794513674626 was £182.34, real is £11.07 |
| V14 | GMC currencies are correct | PASS (FIXED) | 44853051982074, 55121138155906, 56724614742402, 55262186242434 were incorrectly shown as EUR — all are GBP in DB |
| V15 | Only 1 EUR product in Top 40 (54855777878402 — ES/EUR record only) | PASS | Verified |
| V16 | GMC availability correct for 55219110707586 | PASS (FIXED) | Was 'out of stock' — real is 'in stock'; condition is Price Mismatch (£22.30 vs £23.19) |
| V17 | GMC availability correct for 55219110674818 | PASS (FIXED) | Was 'out of stock' — real is 'in stock'; price match ✅; condition: Incomplete Verification |
| V18 | Shopify join verified (site=UK, channel=LEDSone) | PASS | item_id = product_item_id confirmed |
| V19 | GMC join verified (GB preferred) | PASS | DISTINCT ON + CASE WHEN country='GB' THEN 0 ELSE 1 END |
| V20 | Null shopify_stock handled in conditions | PASS (FIXED) | r3GetConditions() updated: null stock skips OOS/avail checks |
| V21 | Price match formula: round(gmc,2) = round(shopify,2) AND currency=GBP | PASS | Verified test cases |
| V22 | £0.01 price diff correctly shows Mismatch | PASS | 55262186242434: £47.60 vs £47.59 → Price Mismatch |
| V23 | Missing GMC records correctly identified | PASS | 55054387478914, 14934484713858, 55054387511682 |
| V24 | Availability mismatches correctly identified | PASS | 15145639412098 (stock=0, GMC in stock), 15141041439106 (stock=0, GMC in stock) |
| V25 | Out of Stock condition correct | PASS | 55116252905858 (stock=0, GMC out of stock) |
| V26 | Currency mismatch correctly shown for EUR product | PASS | 54855777878402 — EUR/ES record only |
| V27 | Condition precedence: 11 levels | PASS | Missing GMC Record > OOS > Avail Mismatch > Price Mismatch > Currency Mismatch > Incomplete Verification |
| V28 | Incomplete Verification shown when no conditions triggered | PASS | Default fallback when all checks pass but eligibility unknown |
| V29 | No products marked Healthy (GMC eligibility unavailable) | PASS | asset_group_listing_group_filters = 0 rows → no product can reach Healthy |
| V30 | GMC eligibility/disapproval gap disclosed | PASS | Limitation banner shown |
| V31 | Title/Description status shown as "Unable to Verify" | PASS | Documented; no before-snapshot available |
| V32 | Review status logic documented (Not Due/Due Today/Overdue/Reviewed) | PASS | In empty state text |
| V33 | Latest data dates shown in header | PASS | "Latest: 2026-07-15" in header + data source note |
| V34 | CSV sample rows (SKU-001/004/006) not in dashboard | PASS | Absent from R3_DATA |
| V35 | No SELECT from staging_ai schema | PASS | Schema does not exist; not queried |
| V36 | No PostgreSQL writes | PASS | SELECT only |
| V37 | Requirement 1 regression — tab 1 functional | PASS | Panel 1 HTML and Req 1 JS untouched |
| V38 | Requirement 2 regression — tab 2 functional | PASS | Panel 2 HTML and all r2* functions untouched |
| V39 | Tab navigation works for all 4 tabs | PASS | showTab() handles n=1,2,3,4 |
| V40 | R3 charts lazy-init on first Tab 3 click | PASS | r3ChartsBuilt flag in showTab() |
| V41 | Filters affect only Req 3 (r3* scope) | PASS | All filter IDs prefixed r3; no cross-panel interference |
| V42 | KPI cards render with real data | PASS | renderR3Kpis() uses verified totalSummary=[1402,132,229,107] |
| V43 | No git commit or push | PASS | Not performed |
| V44 | No Vercel deployment | PASS | Not performed |
| V45 | AIOS verification files created | PASS | evidence, validation, implementation, closure files created |

---

## Tests NOT APPLICABLE

| Test | Reason |
|---|---|
| Verified Reviewed status | No Req 1 review completion log exists |
| GMC approval status | asset_group_listing_group_filters = 0 rows for Theekshy |
| Title/Description Updated field | No before-snapshot; shown as "Unable to Verify" |
| Next Review Date (Reviewed + 30 days) | No completed reviews logged |

---

## BLOCKED Tests

| Test | Reason |
|---|---|
| GMC last feed update date | merchant_products table has no date/timestamp column available |
| Shopify variant-level GMC offer exact match (Offer ID = Shopify Variant ID) | No Offer ID column in merchant_products; join done on product_id |
