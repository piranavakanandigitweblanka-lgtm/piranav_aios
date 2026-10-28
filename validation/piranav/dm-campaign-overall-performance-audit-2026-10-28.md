---
name: dm-campaign-overall-performance-audit-validation-2026-10-28
description: Validation checklist for the DM Campaign Overall Performance page audit (2026-10-28). Read-only code inspection — no live server verification.
metadata:
  type: validation
---

# Validation: DM Campaign — Overall Performance Audit

**Date:** 2026-10-28
**Type:** Code-only audit (no live server access)

---

## Checklist

| Check | Result | Evidence |
|---|---|---|
| Navigation entry found in AdminLayout.jsx | PASS | Line 150, key='dm-campaign', toolKey='tools.DmCampaign' |
| Section confirmed as "Sales & Performance" | PASS | Line 149 AdminLayout.jsx |
| toolKey resolved in taskRegistry.jsx | PASS | Lines 343–353, lazy import DmCampaign.jsx |
| Component file located | PASS | `frontend/src/admin/pages/DmCampaign.jsx` |
| Both tabs documented (Campaigns + Products) | PASS | DmCampaign.jsx lines 563–588 |
| All API endpoints documented | PASS | 3 endpoints: GET summary, GET products, POST sync/run-now |
| Backend router file located | PASS | `backend/app/dashboard_pages/dm_campaign.py` |
| Router registration confirmed in main.py | PASS | Lines 123–124 (import), 347 (include_router), 492 (start_snapshots) |
| Auth gate documented | PASS | `make_admin_task_auth("tools.DmCampaign")` — admin does NOT auto-bypass |
| All SQL queries documented | PASS | 5 queries: _bounds, CAMPAIGNS_QUERY, CAMPAIGN_PERF_QUERY, CAMPAIGN_DAILY_QUERY, PRODUCT_PERF_QUERY |
| Data sources identified | PASS | google_ads.*, listings.shopify_listings, order_management.*, public.admin_dm_campaign_products_snapshot |
| KPI formulas documented | PASS | All metrics in table with source fields and formulas |
| Flag logic documented | PASS | `_flag_for()` function — 5 flag states |
| Caching/snapshot behaviour documented | PASS | ScheduledSnapshot, 6-hour interval, table name confirmed |
| Date handling documented | PASS | All Time default, custom range, `days_live` all-time caveat |
| Known issues logged | PASS | 8 issues listed in evidence |
| No source code modified | PASS | Read-only audit |
| No DB records modified | PASS | Read-only audit |

---

## Unverified (Live Server Required)

| Item | Reason |
|---|---|
| `public.admin_dm_campaign_products_snapshot` table is populated | Would need Postgres query to confirm |
| `sub_source_id=38` / `market_place='23'` maps to Shopify UK | Would need DB lookup or Kuberan confirmation |
| 73% product_item_id resolution rate is current | Stated in code comment — not re-queried |
| `daily` array usage by any unreleased feature | Code search only, not runtime-verified |
| Actual page render (browser check) | Dashboard not running in this session |

---

## Overall Status: PASS (code audit complete; live verification pending)
