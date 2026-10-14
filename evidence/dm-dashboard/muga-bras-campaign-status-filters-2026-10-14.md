# Evidence: MUGA-BRAS Campaign Status Verification and Filters

**Date:** 2026-10-14  
**Task:** MUGA-BRAS extension — Phase 1–4 (campaign status, country/owner/status filters, tests)  
**Status:** PASS  
**Commit:** pending

---

## What Was Built

### Phase 1 — Audit Findings

| Item | Finding |
|---|---|
| Campaign status field | `campaign_status` (ENABLED/PAUSED/REMOVED) in `google_ads.campaigns` |
| Secondary status | `campaign_primary_status` (ELIGIBLE/LIMITED/LEARNING/ENDED/PAUSED/REMOVED) |
| Country mapping | Authoritative: 4503486236=UK, 9031058245=DE, 1266953046=FR (from backend `_ACCOUNT_CURRENCY`) |
| Responsible person | `group_name` column — already stored in every alert row |
| Alerts table location | Local SQLite — NOT in cloud Postgres. Campaign status fetched separately |
| Last data sync | `MAX(date)` from `campaign_performance` = 2026-10-14 |
| Known unmapped accounts | 6875441845, 1391711507 → UNKNOWN country |

### Phase 2 — Campaign Status Verification

New endpoint: `GET /api/admin/budget-alerts/campaign-statuses?campaign_ids=1,2,3`

- Accepts comma-separated campaign_ids
- Queries `google_ads.campaigns` (cloud Postgres via `get_business_conn`)
- Returns `{campaign_id: {campaign_status, campaign_primary_status}}`
- Campaigns not found → `UNKNOWN`
- Also returns `last_data_date` from `MAX(campaign_performance.date)` as sync proxy
- Pure helper `_build_campaign_status_map(rows, ids)` extracted for testability

### Phase 3 — Dashboard Filters (BudgetAlerts.jsx)

Three new client-side filters added:

| Filter | Source | Values |
|---|---|---|
| Country | `account_id` → `ACCOUNT_COUNTRY` map | UK / DE / FR / UNKNOWN |
| Owner | `group_name` from alert row | Dynamic from loaded alerts + Unassigned |
| Campaign Status | `/campaign-statuses` API response | ACTIVE / PAUSED / REMOVED / UNKNOWN |

- Filters combine (AND logic)
- "Clear filters" button shown when any filter active
- Alert count: "Showing X of Y alerts (filtered)"
- Campaign status displayed per row (ENABLED shown as ACTIVE)
- Country shown in row subline and expanded detail
- `last_data_date` shown in evaluation info bar

### Phase 4 — Tests

**Before:** 55/55 PASS  
**After:** 70/70 PASS (+15 new tests)

New test classes:
- `TestAccountCountryMapping` (6 tests): UK/DE/FR mappings, unknown accounts not in map, map size, valid codes
- `TestBuildCampaignStatusMap` (9 tests): matched, unmatched (UNKNOWN), paused, removed, mixed, string keys, empty, multiple, key structure

---

## Files Changed

| File | Change |
|---|---|
| `backend/app/admin/muguntha_budget_alerts.py` | Added `_ACCOUNT_COUNTRY`, `_build_campaign_status_map()`, `GET /campaign-statuses` endpoint |
| `frontend/src/admin/pages/BudgetAlerts.jsx` | Added campaign status display, country/owner/campaignStatus filters, clear button, count display |
| `backend/tests/test_muguntha_budget_alerts.py` | Added 15 new tests (70 total) |
| `prompts/dm-dashboard/muga-bras-campaign-status-verification-and-filters.md` | Prompt saved before implementation |

---

## Safety Constraints Verified

- No Telegram/Discord messages sent during tests
- No Google Ads modification
- No live API calls added
- No hardcoded staff or country inference from campaign names
- Campaigns not deleted/expired based on status
- UNKNOWN returned for campaigns not in DB — never assumed active
