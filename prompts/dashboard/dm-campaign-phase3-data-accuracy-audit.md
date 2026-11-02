---
name: dm-campaign-phase3-data-accuracy-audit
description: Reusable prompt for Phase 3 read-only data accuracy and API validation audit on the DM Campaign Overall Performance dashboard.
metadata:
  type: prompt
  category: dashboard
---

# Prompt: DM Campaign — Phase 3 Data Accuracy & API Validation

## Purpose
Independently verify that the DM Campaign Overall Performance dashboard KPIs are calculated correctly by comparing direct SQL results against the local backend API response. No code changes, no DB writes.

## What to Build / Verify
1. **Campaign inventory** — query `google_ads.campaigns` for `group_name='DM'`, confirm ENABLED vs PAUSED split
2. **Date bounds** — query MIN/MAX date from `campaign_performance` for ENABLED campaigns (mirrors `_bounds()`)
3. **Independent SQL** — aggregate impressions, clicks, CTR, cost, conversions, conv_value, ROAS for All Time and test date ranges
4. **Start local backend** — `cd dm-dashboard/backend && venv/Scripts/python.exe -m uvicorn app.main:app --port 8499` (check port not already in use first)
5. **Generate test JWT** — `role='dev'` auto-bypasses `make_admin_task_auth`; use `jwt.encode({'sub':'1','role':'dev','exp':...}, JWT_SECRET)`
6. **Call API** — `GET /api/admin/dm-campaign/summary?mode=all` and custom date ranges; extract totals
7. **Compare** — SQL results vs API response to 2dp

## Which Files
- `backend/app/dashboard_pages/dm_campaign.py` — backend logic
- `backend/app/core/db.py` — connection pool (business pool max_size=4)
- `frontend/src/admin/pages/DmCampaign.jsx` — frontend display

## Key Technical Constraints
- `group_name='DM'`, `campaign_status='ENABLED'` filter (currently 2 campaigns)
- ROAS = `(conversion_value / cost) * 100` stored as percentage (e.g., 331.55 = 3.32× return)
- `_resolve_range()` clamps custom end date to `data_max` — Oct 1–31 becomes Oct 1–21 when data_max=Oct 21
- `sub_source_id=38, market_place='23'` is for `order_management.orders` (UK Shopify) — NOT related to `listings.market_place_id_mapping`
- `listings.shopify_listings` uses `channel='LEDSone'` for UK product matching (sub_source=104)
- PostgreSQL `date` BETWEEN is inclusive both ends, no timezone conversion needed

## Expected Output
- Evidence file comparing SQL vs API for each date range
- Validation checklist with PASS/FAIL per check
- Any discrepancies between DB and API flagged as bugs
- Constants (sub_source_id, market_place, channel) verified against actual DB data

## READ-ONLY Rules
No source code modifications. No database writes. No migrations. No server modifications. No deployment. No commits or pushes. Never claim PASS without actual evidence.
