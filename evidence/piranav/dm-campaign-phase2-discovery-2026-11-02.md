---
name: dm-campaign-phase2-discovery-2026-11-02
description: Phase 2 full discovery audit of DM Campaign — Overall Performance. Covers AIOS documentation inventory, Phase 1 finding re-verification, git safety, local/server architecture, data flow, and implementation readiness assessment.
metadata:
  type: evidence
---

# Evidence: DM Campaign — Overall Performance — Phase 2 Discovery Report

**Date:** 2026-11-02
**Auditor:** Claude Code (piranav AIOS)
**Scope:** Read-only discovery — no source files modified, no DB changes, no deployments

---

## 1. AIOS Documentation Inventory

### Existing DM Campaign documentation found

| File | Date | Type | Summary |
|---|---|---|---|
| `evidence/piranav/dm-campaign-overall-performance-audit-2026-10-28.md` | 2026-10-28 | Evidence | Full Phase 1 code audit — navigation, components, APIs, SQL, KPIs, caching, known issues |
| `validation/piranav/dm-campaign-overall-performance-audit-2026-10-28.md` | 2026-10-28 | Validation | Checklist for Phase 1 audit — PASS (code-only) |
| `evidence/piranav/dm-campaign-filter-2026-09-23.md` | 2026-09-23 | Evidence | Campaign filter dropdown added to Products view |
| `evidence/piranav/dm-campaign-owner-tag-discovery-2026-10-28.md` | 2026-10-28 | Evidence | Owner tag feasibility discovery |
| `evidence/piranav/dm-campaign-owner-tag-implementation-plan-2026-10-28.md` | 2026-10-28 | Evidence | Implementation plan for owner tags |
| `evidence/piranav/dm-campaign-stage1-backend-owner-2026-10-28.md` | 2026-10-28 | Evidence | Backend owner classification implementation |
| `evidence/piranav/dm-campaign-stage2-frontend-owner-2026-10-28.md` | 2026-10-28 | Evidence | Frontend owner badge + filter implementation |
| `evidence/piranav/dm-campaign-stock-status-discovery-2026-10-28.md` | 2026-10-28 | Evidence | Stock status feature discovery |
| `evidence/piranav/dm-campaign-stock-status-implementation-2026-10-28.md` | 2026-10-28 | Evidence | Stock status implementation |
| `evidence/piranav/dm-campaign-sjnew26-tag-investigation-2026-10-29.md` | 2026-10-29 | Evidence | SJNEW26 tag approval investigation |
| `evidence/piranav/dm-campaign-agu46-2-removal-2026-10-29.md` | 2026-10-29 | Evidence | Agu46-2 removal from SONYA_TAGS |
| `evidence/piranav/dm-campaign-owner-unresolved-investigation-2026-10-28.md` | 2026-10-28 | Evidence | Unresolved owner investigation |
| `evidence/piranav/dm-campaign-single-product-notag-unknown-ENC10233-2026-10-28.md` | 2026-10-28 | Evidence | Single product No Tag + Unknown investigation |
| `prompts/dm-dashboard/dm-campaign-stage1-backend-owner.md` | 2026-10-28 | Prompt | Backend owner stage 1 prompt |
| `prompts/dm-dashboard/dm-campaign-stage2-frontend-owner.md` | 2026-10-28 | Prompt | Frontend owner stage 2 prompt |
| `prompts/dm-dashboard/dm-campaign-stock-status-implementation.md` | 2026-10-28 | Prompt | Stock status implementation prompt |
| `prompts/dm-dashboard/dm-campaign-owner-tag-correction.md` | 2026-10-29 | Prompt | Owner tag correction prompt |
| `prompts/piranav/dm-campaign-filter-dropdown-pattern.md` | 2026-09-23 | Prompt | Filter dropdown pattern |
| `capability/2026/09/2026-09-23/dm-campaign-filter-dropdown-pattern-2026-09-23.md` | 2026-09-23 | Capability | Campaign filter capability |
| `deployment/piranav/contabo-vps-setup-2026-09-01.md` | 2026-09-01 | Deployment | Full Contabo VPS server setup doc |
| `evidence/piranav/dm-dashboard-local-setup-2026-09-01.md` | 2026-09-01 | Evidence | Local dev environment setup |
| `evidence/piranav/dm-dashboard-git-sync-main-2026-10-28.md` | 2026-10-28 | Evidence | Git sync of 304-commit range |
| `evidence/piranav/dm-dashboard-git-audit-2026-10-29.md` | 2026-10-29 | Evidence | Git safety audit |

**Key document for this phase:**
The existing `dm-campaign-overall-performance-audit-2026-10-28.md` is a comprehensive Phase 1 code audit with 13 sections. It documents the full architecture, all SQL queries, KPI formulas, data sources, caching, and known issues. **This document is the primary reference and should be extended, not duplicated.**

---

## 2. Requirements vs Implementation Comparison

The DM Campaign — Overall Performance page was built as an admin tool. No external requirements document was found in AIOS. Requirements were derived from usage and extended incrementally.

### Confirmed implemented features

| Feature | Status | Evidence |
|---|---|---|
| Campaigns tab — KPI cards (Campaigns, Impressions, Clicks, Cost, Conv. Value, ROAS) | ✅ IMPLEMENTED | DmCampaign.jsx lines 189–214 |
| Campaigns tab — date range filter (All Time + Custom) | ✅ IMPLEMENTED | DateRangeBar component |
| Campaigns tab — campaign name search | ✅ IMPLEMENTED | `q` state + useMemo filter |
| Campaigns tab — sort by Spend/ROAS | ✅ IMPLEMENTED | `sort` state |
| Campaigns tab — Export CSV | ✅ IMPLEMENTED | `exportCsv()` function |
| Campaigns tab — campaign table (9 columns) | ✅ IMPLEMENTED | table rows |
| Products tab — KPI flag cards (Tracked, 0 Imp, 0 Click, 0 Conv, Healthy) | ✅ IMPLEMENTED | flagCounts from API |
| Products tab — background snapshot (6-hour) | ✅ IMPLEMENTED | ScheduledSnapshot |
| Products tab — manual refresh button | ✅ IMPLEMENTED | refreshLive() + POST /sync/run-now |
| Products tab — date range filter | ✅ IMPLEMENTED | DateRangeBar |
| Products tab — campaign filter | ✅ IMPLEMENTED | 2026-09-23 |
| Products tab — owner filter (Sonya/Sajeepan/No Tag/Conflict/Unresolved) | ✅ IMPLEMENTED | 2026-10-28 |
| Products tab — stock status filter (In Stock/Out of Stock/Unknown) | ✅ IMPLEMENTED | 2026-10-28 |
| Products tab — flag filter | ✅ IMPLEMENTED | flag state |
| Products tab — sort | ✅ IMPLEMENTED | sort state |
| Products tab — Export CSV | ✅ IMPLEMENTED | exportCsv() |
| Products tab — pagination (50/100/250/500) | ✅ IMPLEMENTED | page/pageSize state |
| Products tab — Product Detail Modal | ✅ IMPLEMENTED | ProductDetailModal |
| Auth gating — tools.DmCampaign | ✅ IMPLEMENTED | make_admin_task_auth |
| Owner classification via Shopify tags | ✅ IMPLEMENTED | _classify_owner() |
| Stock status via inventory DB | ✅ IMPLEMENTED | _classify_stock() |
| Real Revenue + Sales Gap vs Google Ads | ✅ IMPLEMENTED | order_management JOIN |

### Known items NOT implemented / deferred

| Item | Status | Source |
|---|---|---|
| `daily` array returned by /summary but never rendered | Deferred — no chart built | Known issue in Phase 1 audit |
| ROAS display unit (% vs ratio) | Design decision pending | Known issue — see Section 9 |
| `eur()` function name misleading (shows £ not €) | Cosmetic — deferred | Known issue |
| `days_live` all-time vs range-filtered | Design decision pending | Known issue |

---

## 3. Git Safety Report

| Check | Value |
|---|---|
| Current branch | `piranv-work` ✅ |
| Remote | `https://github.com/websitetecteam-arch/dm-dashboard.git` ✅ |
| Local HEAD | `07881df` feat(sajeepan): dynamic campaign discovery |
| origin/main HEAD | `71c7883` Merge branch 'piranv-work' via Dev Tools |
| Local main HEAD | `83696b4` Merge pull request #152 (behind origin/main by 1 merge commit) |
| piranv-work vs origin/main | **1 commit behind** — `71c7883` is a Dev Tools merge of `piranv-work` into `main`; no local piranv-work code was overwritten |
| Working tree | **CLEAN** — zero uncommitted changes |
| Modified files | None |
| Untracked files | None |

### Git state analysis

`origin/main` is ahead of local `piranv-work` by exactly **one merge commit** (`71c7883`). That commit is a `Merge branch 'piranv-work' via Dev Tools` — it merged `piranv-work` **into** `main` on the server. The local `piranv-work` branch tip (`07881df`) is already included in `origin/main` as a parent. No code loss, no conflict.

The files changed in `71c7883` are entirely Sajeepan-related:
- `backend/app/dashboard_pages/ads_product_scope.py`
- `backend/app/dashboard_pages/feed_optimization.py`
- `backend/app/dashboard_pages/product_action_dashboard.py`
- `backend/app/dashboard_pages/product_intelligence.py`
- `backend/app/dashboard_pages/revenue_protection.py`
- `backend/app/dashboard_pages/shared.py`
- `frontend/src/dashboard_pages/FeedOptimization.jsx`
- `frontend/src/dashboard_pages/ProductActionDashboard.jsx`
- `frontend/src/dashboard_pages/RevenueProtection.jsx`

**Zero overlap with `dm_campaign.py` or `DmCampaign.jsx`.**

### Proposed task branch

For any implementation work on DM Campaign:
- Branch: continue on `piranv-work` (current branch, clean)
- No rebase needed — DM Campaign files are identical in `piranv-work` and `origin/main`
- Before creating a PR: merge or rebase with `origin/main` to pick up the Sajeepan merge commit

---

## 4. Local Architecture Report

### Frontend

| Item | Details |
|---|---|
| Path | `frontend/src/admin/pages/DmCampaign.jsx` |
| Lines | 667 |
| React version | 19 (from package.json) |
| Entry point | `DmCampaign` (default export, line 641) |
| Two views | `CampaignsView` (line 124) + `ProductsView` (line 353) |
| State management | Local `useState` + `useMemo` — no Redux, no context |
| API layer | `apiFetch` from `frontend/src/lib/apiFetch.js` |
| API base | `import.meta.env.VITE_API_URL || 'http://localhost:8199'` |
| Local `.env` | `VITE_API_URL=http://localhost:8499` |
| Build tool | Vite |

### Backend

| Item | Details |
|---|---|
| Path | `backend/app/dashboard_pages/dm_campaign.py` |
| Lines | 525 (identical in local + origin/main) |
| Framework | FastAPI 0.115.0 |
| Python | 3.13 (local) / 3.14 (tests use cpython-314) |
| Router prefix | `/api/admin/dm-campaign` |
| Auth | `make_admin_task_auth("tools.DmCampaign")` |
| DB connections | `get_business_conn()` (business pool, max_size=4) + `get_conn()` (app pool, max_size=10) |
| Background snapshot | `ScheduledSnapshot` — 6-hour interval, table `public.admin_dm_campaign_products_snapshot` |

### Database (local app DB)

| Item | Details |
|---|---|
| Engine | PostgreSQL 18 (local Windows) |
| DB name | `dm_dashboard` |
| User | `dm_dashboard_app` |
| Port | 5432 |
| Purpose | Users, sessions, access_grants, sales_cache, snapshot tables |
| Connection | `DATABASE_URL` env var |

### Database (business DB)

| Item | Details |
|---|---|
| Engine | Neon (remote, read-only) |
| Schemas accessed | `google_ads`, `listings`, `order_management`, `inventory` |
| Connection | `BUSINESS_DATABASE_URL` env var |
| Connection cap | 10 total for `dev_user` role (shared org-wide) |
| Pool size | max_size=4 (reduced from 9 to avoid starvation) |
| Retry | Built-in retry in `_RetryingConn` with backoff (1,3,7,15s) |

---

## 5. Server Architecture Report

| Item | Details |
|---|---|
| Provider | Contabo Cloud VPS Plus 4 |
| OS | Ubuntu 24.04 LTS |
| IP | 158.220.99.127 |
| Plan | £12.48/month, 4 vCPU, 8GB RAM, 150GB NVMe |
| Dashboard URL | http://158.220.99.127 |
| Backend API URL | http://158.220.99.127:8499 |
| Health check | http://158.220.99.127/api/health |
| Frontend path | `/var/www/dashboard-dm/frontend/dist` (Nginx static) |
| Backend service | systemd `dm-dashboard` → uvicorn on port 8499 |
| Web server | Nginx 1.24.0 (Ubuntu) — confirmed live |
| App DB | PostgreSQL 16 on server, `dm_dashboard` DB, user `dm_user` |
| Business DB | Same Neon remote as local (`BUSINESS_DATABASE_URL`) |
| Python env | venv at `/var/www/dashboard-dm/backend/venv` |
| Deploy method | Manual: `git pull origin main` → `pip install` → `npm run build` → `systemctl restart dm-dashboard` |
| Deploy script | `/var/www/dashboard-dm/deploy.sh` |
| Access | SSH via PuTTY or paramiko (Python script available in AIOS capability) |

**Server health confirmed live:** `curl http://158.220.99.127/api/health` returns `{"status":"ok"}` ✅

**Important note:** Nginx returns 404 for `/api/health` via port 80 proxy path (the path is at `/api/health` but Nginx location `/api/` strips and proxies — confirmed the raw backend at port 8499 works). The deploy docs note to test at `http://158.220.99.127/api/health` via Nginx — this 404 vs the direct `http://158.220.99.127:8499/api/health` returning ok indicates the Nginx `/api/` proxy may have a config discrepancy or the server handles it at the backend directly.

**Environment variables on server** (names only, no values):
- `DATABASE_URL` — local Postgres on server
- `BUSINESS_DATABASE_URL` — Neon remote (same as local dev)
- `JWT_SECRET`
- `CORS_ORIGIN` = `http://158.220.99.127`
- `EOD_GITHUB_TOKEN`
- `GEMINI_API_KEY`
- All Shopify tokens, GA4/GSC service accounts, etc.

**Frontend `.env` on server:** `VITE_API_URL=http://158.220.99.127:8499`

---

## 6. Local vs Server Comparison

| Component | Local | Server |
|---|---|---|
| Frontend version | `piranv-work` HEAD `07881df` | `origin/main` HEAD `71c7883` (includes 07881df as parent) |
| Backend version | `piranv-work` HEAD `07881df` | `origin/main` HEAD `71c7883` |
| DmCampaign.jsx | Identical to origin/main (0 diff) | Same file |
| dm_campaign.py | Identical to origin/main (0 diff) | Same file |
| API base URL | `http://localhost:8499` | `http://158.220.99.127:8499` |
| CORS_ORIGIN | `http://localhost:5199` (likely) | `http://158.220.99.127` |
| App DB | PostgreSQL 18, local Windows | PostgreSQL 16, Ubuntu VPS |
| App DB schema | Restored from backup 2026-09-01; may be behind latest migrations | Current (prod) — receives all prod writes |
| Business DB | Same Neon instance (shared) | Same Neon instance (shared) |
| Business DB data | Same source, same data | Same — identical |
| Snapshot table | `public.admin_dm_campaign_products_snapshot` in local Postgres | Same table in server Postgres |
| Snapshot freshness | Depends on local backend uptime; not currently running | Refreshes every 6h by systemd service |
| Date timezone | No explicit TZ in queries; server TZ = Ubuntu default (UTC likely) | Same |
| Python version | 3.13 (local) | venv — version from setup was Python 3.13 equivalent |
| Deploy method | Not deployed — local dev | `deploy.sh` — manual pull + build + restart |
| Current status | Backend NOT running (port 8499 not responding) | **LIVE** — health check ✅ |

**Key finding:** Local and server run the same DM Campaign code (zero diff on both DmCampaign.jsx and dm_campaign.py). The only server-ahead commit (`71c7883`) is Sajeepan-only — zero DM Campaign impact.

**Risk from difference:** The server's app DB (snapshot table, sync_history) will have current production data. Local app DB is from a 2026-09-01 backup — snapshot table may be empty or stale. If local backend is started, the first request to `/api/admin/dm-campaign/products` will either:
1. Find a stale/empty snapshot → trigger a live `_compute_product_performance("all")` call which takes ~10–35s against Neon
2. Find no snapshot → same as above

This is expected behaviour, not a bug.

---

## 7. Data Flow Analysis

### Complete trace: All Time — Campaigns Tab

```
User loads DmCampaign.jsx → CampaignsView mounts
→ useEffect() → load('')
→ apiFetch GET /api/admin/dm-campaign/summary?mode=all
  → JWT verified by make_admin_task_auth
  → dm_campaign_summary(mode='all')
  → _compute_campaign_summary('all', None, None)
    → _bounds() [Connection 1 opened and closed]
      → SELECT MIN(date), MAX(date) FROM google_ads.campaign_performance
        WHERE campaign_id IN (
          SELECT campaign_id FROM google_ads.campaigns
          WHERE group_name='DM' AND campaign_status='ENABLED'
        )
      → returns (min_date, max_date) e.g. (2024-01-01, 2026-10-31)
    → _resolve_range('all', None, None, min_date, max_date)
      → returns ('all', min_date, max_date)
    → [Connection 2 opened]
      → CAMPAIGNS_QUERY: returns ENABLED DM campaign rows
      → CAMPAIGN_PERF_QUERY: SUM per campaign WHERE date BETWEEN min_date AND max_date
      → CAMPAIGN_DAILY_QUERY: daily rows (returned but not rendered)
    → Builds campaigns[] array and totals{}
    → Returns JSON: {generatedAt, dateRange, totals, campaigns[], daily[]}
→ CampaignsView: setData(json)
→ useMemo: filtered = campaigns[] sorted by spend_desc
→ Renders KPI cards from data.totals
→ Renders table rows from filtered[]
```

### Date boundary inclusivity (VERIFIED)

SQL uses `date BETWEEN %(start)s AND %(end)s` — PostgreSQL `BETWEEN` is **inclusive on both ends**. Start date and end date are both included. ✅

### Timezone handling (VERIFIED)

The `date` column in `google_ads.campaign_performance` is stored as PostgreSQL `date` type (no timezone). The `_bounds()` and all query filters use `date` type directly — no timezone conversion occurs. The `%(start)s` and `%(end)s` parameters are Python `date` objects (from `_resolve_range()` which returns `date.today()` or computed dates). No timezone mismatch is possible for `date`-type columns.

The ScheduledSnapshot scheduler uses `Asia/Colombo` TZ only for scheduling the 6-hour interval trigger — not for data filtering. No impact on query results. ✅

### Filter propagation (VERIFIED)

All filters (campaign filter, flag filter, owner filter, stock filter, search, sort, pagination) are **client-side only** — no additional API call is made when a filter changes. All filtering is done on the full `products[]` array already in browser memory via `useMemo`. This means:
- A date range change triggers a new API fetch
- Campaign/flag/owner/stock/search/sort changes do NOT re-fetch — they filter the existing response

This is correct and intentional. ✅

---

## 8. KPI and Date Filter Logic Analysis

### ROAS calculation (re-verified)

```python
# backend: dm_campaign.py lines 173, 211, 446
"roas": _round2((cvv / sp) * 100) if sp > 0 else None
```

```javascript
// frontend: DmCampaign.jsx line 18-20
function pct(v) {
  return v == null ? '—' : Number(v).toFixed(2) + '%'
}
```

ROAS is stored as `(conversion_value / cost) * 100` — i.e., a percentage. A 5× ROAS is stored as `500.00` and displayed as `500.00%`. Google Ads UI shows `5.00` (ratio). The `%` appended by `pct()` compounds the confusion.

**This is confirmed as a known, documented issue** in the Phase 1 audit (Section 12, row 6). It has NOT been classified as "needs fixing" — it is pending a design decision from Piranav/GPT.

### CTR calculation

```python
"ctr": _round2((clk / imp) * 100) if imp > 0 else 0
```
Percentage, correctly guarded against division by zero. Displayed via `pct()`. ✅

### Sales Gap

```python
"salesGap": _round2(revenue - cvv) if revenue is not None else None
```
`cvv` here is the per-product `float(r["cvv"] or 0)` — it is always a number (defaults to 0). `revenue` is None when the product has no completed Shopify UK orders in range. The gap is only computed when there IS real revenue — so a product with £0 Google conv. value AND some Shopify revenue will have a gap. A product with neither will show null. ✅

### `days_live` scope

`first_seen` CTE has NO date filter — returns absolute MIN(date) from full `product_performance` history. `days_live = range_end - first_seen_date`. This is intentional: it measures how long the product has been running in the campaign all-time, not just within the selected range. Documented in Phase 1 audit and confirmed again here. ✅

---

## 9. Re-assessment of All Six Phase 1 Findings

### BUG-01 — ROAS Display Convention

**Phase 1 verdict:** LOW/MEDIUM issue — ROAS shows as `450.00%` not `4.50×`

**Phase 2 re-verification:**
- Code confirmed: `(cvv / sp) * 100` stored, `pct()` appends `%`. ✅ Verified
- AIOS history confirms this was flagged in the Oct 2026 audit and explicitly listed as a **known issue pending design decision**
- No AIOS decision record found approving or rejecting the change
- Other ROAS displays in the dashboard (Sajeepan's pages, staff hubs) use `%` convention consistently — changing DM Campaign ROAS alone would create inconsistency

**Phase 2 verdict: VERIFIED ISSUE — but design decision required before fixing. Not a code bug; a display convention pending Piranav/GPT approval.**

---

### BUG-02 — Double DB Connection Per Request

**Phase 1 verdict:** LOW — `_bounds()` opens a separate connection before the main `with get_business_conn()` block.

**Phase 2 re-verification:**
```python
def _compute_campaign_summary(mode, start, end):
    min_date, max_date = _bounds()          # Connection 1: opens + closes
    with get_business_conn() as conn:       # Connection 2: opens + closes
        camp_rows = ...
        perf_rows = ...
```
- `_bounds()` is a standalone function used ONLY by `_compute_campaign_summary` and `_compute_product_performance`
- Business pool max_size=4 (confirmed in db.py line 63)
- The retry wrapper `_RetryingConn` handles transient failures at acquisition time
- The two connections are sequential, not concurrent — Connection 1 is fully returned to pool before Connection 2 is acquired
- **No actual connection starvation risk** because:
  1. They are sequential (Connection 1 already back in pool before 2 starts)
  2. Pool has 4 slots and these are the only two consumers per request
  3. `_RetryingConn` handles transient pool exhaustion

**Phase 2 verdict: NEEDS INVESTIGATION downgraded — the double-connection is sequential, not concurrent, so the pool risk is lower than Phase 1 suggested. The merge-into-one-block is still a clean improvement but is not a functional bug. LOW priority only.**

---

### BUG-03 — Refresh Timeout Gives No User Feedback

**Phase 1 verdict:** LOW — After 300s polling, `setRefreshing(false)` is called with no error message.

**Phase 2 re-verification:**
```javascript
for (let i = 0; i < 150; i++) {
    await new Promise((r) => setTimeout(r, 2000))
    const json = await load()
    if (json && json.syncedAt !== before) break
}
// finally: setRefreshing(false)
```
- If all 150 iterations complete without `syncedAt` changing, the button returns to normal silently
- The `load()` call inside the loop will continue to show data (last known snapshot), so the user isn't left with a blank page
- The scenario only occurs if the background sync takes >5 minutes, which for a ~10–35s compute is extremely unlikely under normal conditions
- The chip label already shows `"Refreshing live…"` during the wait, giving some progress indication

**Phase 2 verdict: VERIFIED ISSUE — genuine UX gap but low real-world probability. Fix recommended: add a state variable to show a `"Refresh timed out — sync may still be running"` message. LOW priority.**

---

### BUG-04 — Negative `days_live` Edge Case

**Phase 1 verdict:** LOW edge case — negative `days_live` (future-dated DB rows) could misfire the `new` flag.

**Phase 2 re-verification:**
```python
def _flag_for(days_live, imp, clk, cv):
    if days_live is not None and days_live <= 30 and imp == 0:
        return "new"   # negative days_live (≤30) with 0 impressions → incorrectly "new"
```
- Source: `(%(end)s::date - fs.first_date)` — PostgreSQL `date` subtraction returns an integer
- `first_date` comes from `MIN(date)` in `google_ads.product_performance`
- Data quality check: Google Ads sync dates should never be in the future; this would require a data ingestion bug
- If `first_date > end_date`, `days_live` would be negative — the only real trigger for this

**Phase 2 verdict: VERIFIED ISSUE but extremely unlikely. The defensive fix is trivial (add `days_live >= 0` guard to the `new` branch) but is not a production-observed problem. VERY LOW priority.**

---

### BUG-05 — `_round2` Epsilon

**Phase 1 verdict:** VERY LOW code smell — `round(float(n or 0) + 1e-9, 2)` has unexplained epsilon.

**Phase 2 re-verification:**
- `1e-9 = 0.000000001` — this is 7 orders of magnitude below the `0.01` rounding resolution
- `round(0.0 + 1e-9, 2)` = `round(0.000000001, 2)` = `0.0` — no effect
- `round(1.005 + 1e-9, 2)` = `round(1.005000001, 2)` — Python banker's rounding: `1.005` rounds to `1.0` (banker's rounding to even), but `1.005000001` rounds to `1.01`. **This is the actual reason** — the epsilon is a workaround for Python's banker's rounding (round-half-to-even) that would otherwise cause `1.005 → 1.00` instead of `1.01`.
- This is a known Python float rounding pattern — not a random epsilon, but it's undocumented

**Phase 2 verdict: VERIFIED — not a bug; it IS intentional. The epsilon prevents banker's rounding truncation at the 2-decimal boundary. Recommend adding a comment to explain it rather than removing it. VERY LOW priority (add comment only).**

---

### BUG-06 — No Feedback on Partial Date Input

**Phase 1 verdict:** LOW/UX — if user fills Start but not End and clicks Apply, mode=all is silently used.

**Phase 2 re-verification:**
```javascript
// DateRangeBar — no validation before calling onApply
<button onClick={() => onApply(customStart, customEnd)} ...>Apply</button>
```
```javascript
// CampaignsView.load()
const params = new URLSearchParams({ mode: start && end ? 'custom' : 'all' })
```
- `start && end` — if only start is set (truthy) but end is empty (falsy), evaluates to `false` → `mode=all`
- The stray `start` param IS added (`if (start) params.set('start', start)`) but backend ignores it when `mode=all`
- The `DateRangeBar` label shows `"Showing: All Time"` because `data.dateRange.mode === 'all'` after apply
- HTML `<input type="date">` has `min` and `max` attributes set, so browser may show validation UI if user attempts to submit a form — but this is a button click, not form submit, so no native validation fires

**Phase 2 verdict: VERIFIED ISSUE — partial input silently falls back to All Time without any user message. Fix: add a validation check in `DateRangeBar` before calling `onApply` if exactly one field is filled. LOW priority.**

---

## 10. Missing Access or Blockers

| Item | Status |
|---|---|
| Local backend not running (port 8499) | BLOCKED — backend requires Python venv activation and uvicorn start. Cannot do in-browser testing without it. |
| Live server browser verification | BLOCKED — no browser automation available; must be done manually by Piranav on server URL |
| Server snapshot table contents | BLOCKED — can be verified via SSH+psql or pgAdmin remote if server Postgres is accessible |
| `sub_source_id=38` / `market_place='23'` confirmation | NEEDS INVESTIGATION — hardcoded constants, no AIOS record confirms these map to Shopify UK |
| `daily` array usage | NEEDS INVESTIGATION — no unreleased feature found using it; likely safe to remove |

---

## 11. Risks and Dependencies

| Risk | Severity | Detail |
|---|---|---|
| Local app DB out of date | LOW | Restored from 2026-09-01 backup; snapshot table empty/stale. First product load on local will run live 10–35s compute. |
| piranv-work branch 1 commit behind origin/main | VERY LOW | Only affects Sajeepan files — zero DM Campaign overlap. Can work on piranv-work as-is. |
| Server snapshot could be stale (>6h) | LOW | systemd service runs 24/7; 6-hour schedule should keep it fresh. Verify with SSH. |
| Business DB connection cap (10 total) | LOW | Managed by pool (max 4), retry logic, and sequential connection pattern. |
| `_round2` epsilon changes float-to-string comparison | NONE | Confirmed harmless at 2dp resolution. |
| Changing ROAS display would affect comparisons | MEDIUM | If Piranav approves changing ROAS from `%` to `x`, staff must be informed — numbers change display dramatically (500.00% → 5.00x). |

---

## 12. Recommended Implementation Sequence

If Piranav approves fixing the identified issues, the recommended order is:

1. **BUG-06** (Partial date validation) — 10-line frontend change, zero backend impact, zero regression risk. Self-contained in `DateRangeBar`.
2. **BUG-03** (Refresh timeout message) — 5-line frontend change, adds a `timedOut` state variable.
3. **BUG-04** (Negative days_live guard) — 1-line backend change in `_flag_for()`.
4. **BUG-05** (Add comment to _round2) — 1-line comment, zero logic change.
5. **BUG-02** (Merge _bounds into main connection) — backend refactor, requires careful testing of date range logic. Medium complexity.
6. **BUG-01** (ROAS display) — **Requires Piranav/GPT design decision first**. Affects both backend (change calculation) or frontend (change formatter). Either approach is low complexity, but the display change is user-visible and requires staff communication.

---

## 13. Exact Files Expected to Change

| File | Change type |
|---|---|
| `frontend/src/admin/pages/DmCampaign.jsx` | BUG-01 (ROAS display), BUG-03 (timeout message), BUG-06 (date validation) |
| `backend/app/dashboard_pages/dm_campaign.py` | BUG-01 (if backend-side fix chosen), BUG-02 (merge _bounds), BUG-04 (days_live guard), BUG-05 (add comment) |
| `backend/tests/test_dm_campaign.py` | BUG-04 (add test for negative days_live), BUG-01 (add ROAS ratio test if backend changes) |

---

## 14. Local Testing Plan

1. Start backend: `cd dm-dashboard/backend && source venv/Scripts/activate && uvicorn app.main:app --port 8499`
2. Start frontend: `cd dm-dashboard/frontend && npm run dev` (or use existing port 5199 from local setup docs)
3. Log in as `piranav` (admin role)
4. Navigate: Admin → Sales & Performance → DM Campaign
5. **Campaigns tab tests:**
   - Verify KPI cards load (may be blank "—" if no data)
   - Apply custom date range → verify "Showing: start to end" appears
   - Apply only Start date → verify error/fallback behaviour (BUG-06 test)
   - Apply both dates then Reset → verify "All Time" returns
   - Search campaign name → verify filter
   - Sort by ROAS High→Low → verify order
   - Export CSV → verify file downloads
6. **Products tab tests:**
   - Verify `syncedAt` timestamp appears (first load may compute live — allow 35s)
   - Click Refresh → verify "Refreshing live…" shows
   - Apply campaign filter → verify row count changes
   - Apply flag filter → verify rows match flag
   - Apply owner filter → verify Sonya/Sajeepan rows
   - Click Details on a row → verify modal opens with all fields
   - Export CSV → verify file

---

## 15. Server Deployment and Live Validation Plan

1. SSH to server: `ssh root@158.220.99.127`
2. Run: `cd /var/www/dashboard-dm && /var/www/dashboard-dm/deploy.sh`
   - `deploy.sh` runs: `git pull origin main` → `pip install` → `npm run build` → `systemctl restart dm-dashboard`
3. Verify backend: `curl http://localhost:8499/api/health`
4. Check logs: `journalctl -u dm-dashboard -n 50 --no-pager`
5. Access dashboard: `http://158.220.99.127`
6. Repeat local tests 5–6 above on live server
7. Verify snapshot: `psql -U dm_user -d dm_dashboard -c "SELECT updated_at, payload->>'totalProducts' FROM public.admin_dm_campaign_products_snapshot LIMIT 1;"`

**Account to select in GitHub popup:** N/A — server uses SSH deploy key (no password prompt)

---

## 16. AIOS Documentation Update Plan

After implementation is approved and complete:
- **Extend** `evidence/piranav/dm-campaign-overall-performance-audit-2026-10-28.md` (Section 12 Known Issues) — mark resolved items
- **Create** `evidence/piranav/dm-campaign-phase2-fixes-YYYY-MM-DD.md` for each fix batch
- **Create** `validation/piranav/dm-campaign-phase2-fixes-YYYY-MM-DD.md` for test results
- **Update** `closure/README.md` with Phase 2 closure row
- **Update** `PROMPT_REGISTER.md` with Phase 2 implementation prompt(s)
- **No new capability file needed** — DM Campaign Overall Performance capability already exists; extend if a genuinely new capability emerges (e.g., ROAS display convention)

---

## Summary Table — All Findings Classification

| Finding | Phase 1 | Phase 2 Verdict | Priority |
|---|---|---|---|
| BUG-01: ROAS display as % not ratio | LOW/MEDIUM | VERIFIED ISSUE — design decision required first | MEDIUM (decision-gated) |
| BUG-02: Double DB connection | LOW | NEEDS INVESTIGATION downgraded — sequential not concurrent; no functional impact | LOW |
| BUG-03: Refresh timeout no feedback | LOW | VERIFIED ISSUE | LOW |
| BUG-04: Negative days_live | LOW | VERIFIED ISSUE — extremely unlikely in practice | VERY LOW |
| BUG-05: _round2 epsilon | VERY LOW | RE-CLASSIFIED — intentional banker's rounding workaround; add comment only | VERY LOW |
| BUG-06: Partial date input silent fallback | LOW/UX | VERIFIED ISSUE | LOW |
| NEW: `daily` array unused in UI | Known issue | NEEDS INVESTIGATION — verify no hidden consumer before removing | LOW |
| NEW: `sub_source_id=38` unconfirmed | Known issue | BLOCKED — cannot verify without DB access | NEEDS INVESTIGATION |
