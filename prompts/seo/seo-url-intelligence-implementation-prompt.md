---
name: seo-url-intelligence-implementation
description: Implementation prompt for the SEO URL Intelligence dashboard page — LEDSone UK Phase 1. Reusable for adding additional stores.
metadata:
  type: prompt
  category: seo
  created: 2026-10-26
---

# SEO URL Intelligence — Implementation Prompt

## Purpose
Build a new SEO URL Intelligence page inside the existing DM Dashboard.
Phase 1: LEDSone UK only. Extensible to additional stores later without rebuilding.

## What to Build
A single page (`dashboard_pages/seo_url_intelligence.py` backend,
`admin/pages/SeoUrlIntelligence.jsx` frontend) that:

1. Fetches all live Shopify UK products via `graphql("ledsone_uk", ...)` — read-only, no writes.
2. Reads existing GSC page-level data from `public.blog_optimization_gsc_page`
   (already synced weekly by `gsc_sync.py` — no new GSC API call needed).
3. Computes two independent statuses per product:
   - **Mismatch Status**: regex comparison of URL handle tokens vs product title tokens.
     Results: `Matched`, `Potential Mismatch`, or `Unverified`.
   - **Ranking Status**: 28-day vs previous-28-day GSC position/clicks comparison.
     Results: `Ranking Drop`, `Improved`, `Stable`, `Insufficient Data`, `No GSC Data`.
4. Persists results in two new PostgreSQL tables (app DB via `get_conn()`):
   - `public.seo_url_product` — Shopify product cache, idempotent upsert on sync
   - `public.seo_url_analysis` — computed analysis results, replaced on every sync
5. Displays a filterable table with: Handle, Title, Description, Mismatch Status,
   Prev Position, Current Position, Position Change, Clicks Change, Ranking Status,
   Priority, Last Synced.
6. CSV export of current filtered view.
7. UAM task key: `tools.SeoUrlIntelligence`. Uses `make_task_auth()` on write endpoints,
   `require_any_login()` on read endpoints — same pattern as every other dashboard_pages file.

## Files to Create/Modify
- NEW: `backend/app/dashboard_pages/seo_url_intelligence.py`
- NEW: `frontend/src/admin/pages/SeoUrlIntelligence.jsx`
- MODIFY: `backend/app/main.py` — 2-line addition (import + include_router)
- MODIFY: `frontend/src/taskRegistry.jsx` — 1 TOOLS entry
- MODIFY: `frontend/src/admin/pages/taskAddedDates.json` — 1 date entry

## Ranking Drop Rules (documented before implementation)
- Minimum data: both current and previous period must have ≥ 10 impressions
- `Ranking Drop`: position worsened by ≥ 3.0 points OR clicks dropped ≥ 30% (prev_clicks ≥ 5)
- `Improved`: position improved by ≥ 3.0 points OR clicks increased ≥ 30% (prev_clicks ≥ 5)
- `Stable`: sufficient data, neither drop nor improvement threshold met
- `Insufficient Data`: either period has < 10 impressions
- `No GSC Data`: no rows found in blog_optimization_gsc_page for this URL
- Products with Insufficient Data must never be labelled Ranking Drop

## Mismatch Rules (documented before implementation)
- Handle/title regex comparison only → `Potential Mismatch` (never `Verified Mismatch`)
- Rules: wattage, colour/temp, pack size, voltage, fitting/base, length/size
- No spec sheet evidence available → status is `Potential Mismatch` only
- Match on all rules → `Matched`
- Handle too short or title missing → `Unverified`

## GSC Site URL
- ledsone.co.uk: `sc-domain:ledsone.co.uk`
- Canonical product URL: `https://www.ledsone.co.uk/products/{handle}`

## Constraints
- Read-only Shopify access — no product writes, no redirects
- No automatic Google indexing requests
- No production deployment without Piranav approval
- Never expose tokens/credentials in API responses or logs
- Reuse `graphql()`, `get_conn()`, `period_bounds()`, `make_task_auth()`, `require_any_login()`
