---
name: sajeepan-campaign-config-audit
description: Prompt for full inspection-only audit of Sajeepan campaign configuration, lifecycle handling, sync architecture, and hardcoded vs dynamic config inventory in the DM Dashboard. Covers all 13 report sections.
category: discovery
status: ACTIVE
created: 2026-10-30
---

# DM Dashboard — Sajeepan Campaign Configuration & Lifecycle Audit

## What to build
Perform a full read-only audit of all Sajeepan campaign configuration in the DM Dashboard. Produce a structured report covering all sections below. Do NOT make any code changes, DB writes, or commits.

## Which files
- `backend/app/dashboard_pages/shared.py` — SJ_CAMPAIGN_IDS, SJ_TARGET_ROAS, SJ_CAMP_NAMES
- `backend/app/dashboard_pages/product_intelligence.py` — req1 backend
- `backend/app/dashboard_pages/revenue_protection.py` — req2 backend
- `backend/app/dashboard_pages/product_action_dashboard.py` — req3 backend
- `backend/app/dashboard_pages/feed_optimization.py` — req4 backend
- `frontend/src/dashboard_pages/ProductIntelligence.jsx`
- `frontend/src/dashboard_pages/FeedOptimization.jsx`
- `frontend/src/dashboard_pages/ProductActionDashboard.jsx`
- DB: `google_ads.campaigns` — campaign_name, campaign_status, campaign_primary_status, target_roas, account_id
- DB: `google_ads.campaign_performance` — MIN/MAX date, spend, conv_value per campaign_id

## Which endpoints / DB queries
- Query `google_ads.campaigns` for all campaigns with campaign_id IN (SJ_CAMPAIGN_IDS list)
- Query `google_ads.campaigns` for campaigns with Sajeepan name pattern NOT in SJ_CAMPAIGN_IDS list
- Query `google_ads.campaign_performance` for first/last perf date, total spend, total conv_value per SJ campaign

## Key technical constraints
- Inspection only. No code modifications. No database writes. No production changes. No commits or pushes.
- All campaign names must come from DB — never guess or invent names.
- All ROAS values must come from DB — never guess values.

## Expected output (13 sections)
1. Actual campaign inventory — all SJ_CAMPAIGN_IDS entries confirmed in DB with status, budget, DB ROAS
2. Campaign 24092456136 (or any undocumented ID) details — name, spend, dates, status
3. New campaign auto-detection result — is it automatic or manual SJ_CAMPAIGN_IDS change required?
4. Removed campaign handling — what happens if a campaign is removed from Google Ads?
5. Paused/enabled status handling — is it DB-driven or hardcoded?
6. Campaign rename handling — does the dashboard reflect Google Ads renames automatically?
7. Target ROAS source — hardcoded SJ_TARGET_ROAS or DB? Are values current?
8. 6 vs 7 discrepancy root cause — where is the hardcoded count and which line?
9. Sync architecture — full data flow from Google Ads to frontend, sync frequency, lag
10. Hardcoded vs dynamic config inventory table — every constant, location, issue
11. Files affected — which files need changes and why
12. Recommended minimal fix plan — Option A (patch), Option B (DB-driven ROAS), Option C (dynamic discovery)
13. Risks and testing requirements for each option
