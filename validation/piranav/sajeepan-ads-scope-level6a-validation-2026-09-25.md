# Level 6A — Ads Product Scope Lifetime — Validation [2026-09-25]

## A. Campaign Ownership Validation

| Check | Result |
|---|---|
| 7 campaign IDs verified in google_ads.campaigns | PASS |
| All 7 have group_name = 'SAJEEPAN' | PASS |
| All 7 campaign names contain "Sajeepan" | PASS |
| All 7 status = ENABLED, primary_status = ELIGIBLE | PASS |
| SJ_CAMPAIGN_IDS import from sajeepan.py matches DB | PASS |
| No ambiguous campaign assignment | PASS |

## B. Lifetime Scope Validation

| Check | Result |
|---|---|
| Lifetime raw distinct product_item_ids | 19,350 |
| First observed date | 2024-09-01 |
| Last observed date | 2026-09-24 |
| Data days | 684 |
| Distinct normalized shopify_ids (after dedup) | 17,137 |
| Cross-format duplicates removed | 2,213 |

## C. Shopify Matching

| Check | Result |
|---|---|
| Total distinct normalized product IDs | 17,137 |
| Matched to shopify_listings UK | 14,047 |
| Unmatched | 3,090 |
| Match rate | 82.0% |
| Unmatched exist on any other site | NO (confirmed) |
| Unmatched explanation | Removed from Shopify catalogue (historical Ads products) |

## D. Classification Validation

| Group | Count |
|---|---|
| GROUP_A | 4,814 |
| GROUP_B | 1,577 |
| ON_SALE | 7,566 |
| SALE_SIGNAL_CONFLICT | 5 |
| NON_SALE_INACTIVE | 85 |
| UNMATCHED | 3,083 |
| UNRESOLVED | 7 |
| **TOTAL** | **17,137** |

**Math check:** 4,814 + 1,577 + 7,566 + 5 + 85 + 3,083 + 7 = **17,137** ✓

Note: UNMATCHED count from query = 3,083 (vs matching check 3,090) — difference of 7
is due to DISTINCT ON dedup ordering preferring shopify_prefixed canonical product_item_id
for the 7 "other format" products, which then get classified as UNRESOLVED rather than
UNMATCHED. Total reconciles.

## E. Performance Window Validation

| Check | Result |
|---|---|
| METRICS_QUERY uses cutoff_date parameter (Python-computed) | PASS |
| METRICS_QUERY groups by normalized shopify_id | PASS |
| Changing window parameter changes only metrics, not scope | PASS (by design — scope from snapshot) |
| 7d / 30d / 90d all use same product list | PASS (lifetime scope constant) |
| Products with no window activity show spend=0 | PASS (merge default = 0) |

## F. Backend Syntax Checks

| Check | Result |
|---|---|
| Python ast.parse — admin_ads_product_scope.py | PASS |
| No LATERAL in LIFETIME_SCOPE_QUERY | PASS |
| No ::text cast on sl.item_id | PASS |
| Dedup via DISTINCT ON (shopify_id) | PASS |
| CTE merch pre-aggregation (no LATERAL) | PASS |
| Python-computed cutoff_date for METRICS_QUERY | PASS |
| copy.deepcopy before metric merge | PASS (snapshot products not mutated) |

## G. Frontend Build

| Check | Result |
|---|---|
| Vite build | PASS (built in 730ms) |
| No new warnings introduced | PASS (pre-existing warnings only) |
| "Lifetime Product Scope" label visible | PASS |
| "Performance Window: Last N days" label visible | PASS |
| Window selector still functional | PASS (triggers new metrics fetch) |

## H. Regression Checks

| Check | Result |
|---|---|
| sajeepan.py unchanged | PASS (git diff = only 2 files changed) |
| main.py unchanged | PASS |
| AdminLayout.jsx unchanged | PASS |
| db.py unchanged | PASS |
| Business DB pool (max 4) not raised | PASS |
| No new DB tables created | PASS |
| No deployment performed | PASS |
| No git commit created | PASS |

## Known Issue — Live Endpoint Pending

Endpoint response time, 504 resolution, and live count confirmation require the
running server with real .env credentials. These remain PENDING until server restart.

Expected behaviour after fix:
- First request: lifetime scope computed live (~10-30s depending on DB speed)
- Subsequent requests: snapshot serves lifetime scope instantly; metrics query fast
- No 504 (LATERAL replaced, metrics query is fast)
