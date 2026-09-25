# Level 5 — Ads Product Scope — Validation [2026-09-25]

## Pre-Implementation Checks

| Check | Result |
|---|---|
| Level 4C design document found | PASS |
| Repository structure matches design | PASS |
| ScheduledSnapshot pattern verified (admin_dm_campaign.py) | PASS |
| Admin auth pattern verified (existing admin pages have no endpoint-level auth) | PASS |
| DB pool constraints verified (max 4, not raised) | PASS |
| Existing UI pattern verified (DmCampaign.jsx, jreq-* CSS) | PASS |
| AdminLayout.jsx ADMIN_ITEMS structure verified | PASS |
| SJ_CAMPAIGN_IDS imported from sajeepan.py (not duplicated) | PASS |

## Implementation Checks

| Check | Result |
|---|---|
| backend/app/admin_ads_product_scope.py created | PASS |
| frontend/src/admin/pages/AdsProductScope.jsx created | PASS |
| main.py modified (import + router + snapshot startup) | PASS |
| AdminLayout.jsx modified (import + nav item + panel) | PASS |
| Jefri normalization pattern used in SQL | PASS |
| Group classification in SQL (backend-authoritative) | PASS |
| Merchant availability as primary stock signal | PASS |
| NULL-qty + merchant IN_STOCK → GROUP_A | PASS |
| GROUP_B (25 OOS) visible, not silently removed | PASS |
| SALE_SIGNAL_CONFLICT (4 products) visible | PASS |
| UNRESOLVED (1 product) visible | PASS |
| CSV exports filtered view, not all products | PASS |
| Snapshot uses existing ScheduledSnapshot, 1-hour interval | PASS |

## Build / Syntax Checks

| Check | Result |
|---|---|
| Python syntax (ast.parse) — admin_ads_product_scope.py | PASS |
| Python syntax (ast.parse) — main.py | PASS |
| Frontend Vite build | PASS (2.15s) |
| Pre-existing build warnings only (not caused by this change) | CONFIRMED |

## Safety Checks

| Check | Result |
|---|---|
| sajeepan.py unchanged | PASS (git diff empty) |
| auth.py unchanged | PASS |
| db.py unchanged | PASS |
| Business DB pool (max 4) not raised | PASS |
| No new DB tables in business DB | PASS |
| No writes to business DB | PASS |
| No deployment performed | PASS |
| No git commit made | PASS |

## Live Data Validation (requires running server)

| Check | Status |
|---|---|
| Endpoint returns 200 with JSON | PENDING — requires server restart + real .env |
| Summary totals match Phase 3/4A investigation | PENDING — requires live query |
| Group A ≈ 693 | PENDING |
| Group B ≈ 25 | PENDING |

These checks must be completed after server restart with real credentials.

## Files Created This Phase

- `dm-dashboard/backend/app/admin_ads_product_scope.py`
- `dm-dashboard/frontend/src/admin/pages/AdsProductScope.jsx`
- `evidence/sajeepan/sajeepan-ads-scope-level5-implementation-2026-09-25.md`
- `validation/piranav/sajeepan-ads-scope-level5-validation-2026-09-25.md`
