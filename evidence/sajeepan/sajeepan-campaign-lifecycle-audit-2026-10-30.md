---
name: sajeepan-campaign-lifecycle-audit-2026-10-30
description: Full investigation of Sajeepan's Google Ads campaign inventory, lifecycle handling, 6 vs 7 discrepancy root cause, ROAS mismatch, sync architecture, and hardcoded config audit. 2026-10-30. Inspection only.
metadata:
  type: evidence
---

# Sajeepan — Campaign Lifecycle & Configuration Audit
**Date:** 2026-10-30  
**Req ID:** AIOS-2026-10-30-SAJ-CAMPAIGN-AUDIT  
**Type:** Inspection only — no code changes, no DB writes  
**Branch:** `piranv-work` at `ca09880`

---

## 1. Actual Campaign Inventory (from `google_ads.campaigns`)

All 7 campaigns in `SJ_CAMPAIGN_IDS` confirmed present in DB:

| Campaign ID | Campaign Name (from DB) | Status | Primary Status | Budget | DB ROAS (ratio) | DB ROAS % |
|---|---|---|---|---|---|---|
| 21069663519 | Pmax \| Sajeepan \| Klarna CSS \| SJ_PENDANT_KLARNA \| Zero Conv \| MCV \| UK | ENABLED | LIMITED | £183.75 | 3.00 | 300% |
| 21242723265 | Pmax \| Sajeepan \| Klarna CSS \| ALLACRSJ2 \| Accessories \| MCV \| UK | ENABLED | ELIGIBLE | £22.00 | 3.65 | 365% |
| 22079334413 | Pmax \| Sajeepan \| G CSS SJALL \| SJALL \| HERO \| MCV \| UK | ENABLED | LIMITED | £40.00 | 3.20 | 320% |
| 23110323532 | Pmax \| Sajeepan \| SHOPTIMISED CSS \| SJGB \| HIGH REVENUE PH \| MCV \| UK | ENABLED | ELIGIBLE | £105.00 | 3.00 | 300% |
| 23516313256 | Pmax \| Sajeepan \| Klarna CSS \| SJ_TOP_20 \| TOP 20% PH \| MCV \| UK | ENABLED | ELIGIBLE | £41.40 | 3.20 | 320% |
| 23590572906 | Pmax \| Sajeepan \| Shoptimised CSS \| SJGB \| zero conv2 \| MCV \| UK | ENABLED | LIMITED | £20.00 | 4.80 | 480% |
| 24092456136 | Pmax \| Sajeepan \| Klarna CSS \| SJ_Lighting_PH_KLARNA \| xml \| MCV \| UK | ENABLED | LIMITED | £27.50 | 3.00 | 300% |

All account_id = `4503486236`.

### Campaign 24092456136 detail
- **Full name:** `Pmax | Sajeepan | Klarna CSS | SJ_Lighting_PH_KLARNA | xml | MCV | UK`
- **Short label:** `SJ_Lighting_PH_KLARNA`
- **Status:** ENABLED / LIMITED
- **Budget:** £27.50/day
- **DB ROAS target:** 3.00 (300%)
- **First perf date:** 2026-08-03
- **Last perf date:** 2026-10-21
- **Total spend (lifetime):** £1,488.28
- **Total conv value (lifetime):** £4,940.32
- **Days with data:** 80
- **In SJ_CAMPAIGN_IDS:** YES (present since at least 2026-09-25 per Level 6A)
- **In SJ_TARGET_ROAS:** NO — omitted, falls back to default 300%
- **In SJ_CAMP_NAMES (backend):** NO
- **In CAMP_NAMES (ProductActionDashboard.jsx):** YES — `'SJ_Lighting_PH_KLARNA'`
- **In SJ_CAMP_NAMES (FeedOptimization.jsx):** NO

### Additional campaigns outside SJ_CAMPAIGN_IDS
31 additional Sajeepan-named campaigns found:
- 1 REMOVED (21012552372 — CPC campaign, £28.34 spend retained)
- 1 REMOVED (21881995131 — £0.00 spend retained)
- 1 ENABLED/ENDED (22961854738 — experiment)
- 2 ENABLED/LIMITED (23642703549, 23642703549 — NOT in SJ_CAMPAIGN_IDS)
- ~27 PAUSED campaigns across various formats (Shopping, PMax, Search, Display, Demand Gen)

**Notable:** Campaign `23642703549` ("Pmax UK | Sajeepan | Shoptimised | TH_NOC | High impression | MCV | UK") is ENABLED/LIMITED, budget £34.10, ROAS 3.20 — **active but NOT in SJ_CAMPAIGN_IDS**.

---

## 2. SJ_TARGET_ROAS Mismatch — Code vs DB

| Campaign ID | Code ROAS% | DB ROAS% | Match? |
|---|---|---|---|
| 21069663519 | 320% | 300% | **MISMATCH** |
| 21242723265 | 380% | 365% | **MISMATCH** |
| 22079334413 | 380% | 320% | **MISMATCH** |
| 23110323532 | 320% | 300% | **MISMATCH** |
| 23516313256 | 400% | 320% | **MISMATCH** |
| 23590572906 | 400% | 480% | **MISMATCH** |
| 24092456136 | NULL (→ 300% fallback) | 300% | NOT IN CODE |

**All 6 existing `SJ_TARGET_ROAS` entries differ from DB.** The DB `target_roas` column is live and is updated by the Google Ads sync. The code values are manually set at an earlier date and have not been updated since. The DB value is the ground truth.

---

## 3. Sync Architecture

### Data flow
```
Google Ads API
    → External sync process (running on Contabo server)
        → PostgreSQL Business DB (BUSINESS_DATABASE_URL)
            → google_ads.campaigns (metadata: name, status, budget, target_roas)
            → google_ads.campaign_performance (daily metrics)
            → google_ads.product_performance (product-level daily metrics)
            → google_ads.merchant_products (availability, price)
            → google_ads.pmax_campaign_search_term_data (search terms)
            → google_ads.google_ads_change_events (account actions log)
    ← Backend API reads Business DB on each request (no internal cache)
        ← Frontend fetches API on page load / manual refresh
```

### Sync frequency
- No `updated_at` column in `google_ads.campaigns` — sync timestamp not recorded in the table itself.
- `MAX(date)` in `campaign_performance` = **2026-10-21** (9 days behind today 2026-10-30). Confirms daily batch sync, not real-time. Typical lag: 1–2 days (Google Ads data finalization delay).
- The backend FastAPI app does **not** run the Google Ads sync — it only reads. Sync is external.
- `_start_background_sync()` in `main.py` starts the hourly sales sync — this is Shopify order data only, not Google Ads.

### New campaign auto-detection
- **NOT automatic.** New campaigns must be manually added to `SJ_CAMPAIGN_IDS` in `shared.py`.
- Once added to `SJ_CAMPAIGN_IDS`, all four backend routers will automatically include performance data — no further code changes needed for the data queries.
- Campaign name is read from DB (`google_ads.campaigns.campaign_name`) in req1 and req3. It does NOT require a `SJ_CAMP_NAMES` entry for data to appear.
- Exception: `feed_optimization.py` uses `SJ_CAMP_NAMES.get(r["campaign_id"], r["campaign_id"])` — new campaigns get their raw ID as the camp name fallback.
- Exception: `FeedOptimization.jsx` has its own hardcoded `SJ_CAMP_NAMES` — new campaigns show raw ID.

### REMOVED campaign handling
- REMOVED campaigns remain in `google_ads.campaigns` with `campaign_status = 'REMOVED'`.
- Historical `campaign_performance` rows are retained.
- The dashboard will NOT show them because `SJ_CAMPAIGN_IDS` is a fixed whitelist — removed campaigns remain in the ID list until manually removed.
- If a campaign is removed from Google Ads but stays in `SJ_CAMPAIGN_IDS`, it will show in the campaign overview with all zeros (no new performance data). Historical totals will still appear in the date range.

### PAUSED / ENABLED status handling
- `campaign_status` and `campaign_primary_status` are synced from Google Ads automatically.
- `req1` returns `"status": r["campaign_status"]` from DB — reflects latest sync value.
- `req3` returns `campaign_primary_status` for the limited-budget detection. Both are DB-driven. **PASS**.

### RENAMED campaign handling
- `campaign_name` is synced automatically — reads from `google_ads.campaigns.campaign_name` at each API call.
- `req1` (`ProductIntelligence.jsx`): derives shortName dynamically from `c.name.split('|')` — fully dynamic. **PASS**.
- `req3` (`ProductActionDashboard.jsx`): `campaign_names` dict built from DB at request time. **PASS**.
- `req4` (`FeedOptimization.jsx`): uses hardcoded `SJ_CAMP_NAMES` — rename NOT reflected. **FAIL**.
- `req4` backend (`feed_optimization.py`): uses `SJ_CAMP_NAMES.get(...)` — rename NOT reflected. **FAIL**.

---

## 4. Hardcoded vs Dynamic Configuration Inventory

| Item | Location | Type | Issue |
|---|---|---|---|
| `SJ_CAMPAIGN_IDS` | `shared.py:46` | Hardcoded list | New campaign requires manual addition |
| `SJ_TARGET_ROAS` | `shared.py:47-50` | Hardcoded dict (6 of 7 entries) | All 6 values stale vs DB; 7th missing |
| `SJ_CAMP_NAMES` (backend) | `shared.py:51-56` | Hardcoded dict (6 of 7 entries) | 7th campaign missing; renames not tracked |
| `SJ_CAMP_NAMES` (frontend) | `FeedOptimization.jsx:6-9` | Hardcoded dict (6 entries) | 7th missing; renames not tracked |
| `CAMP_NAMES` (frontend) | `ProductActionDashboard.jsx:6-10` | Hardcoded dict (7 entries) | Has 7th; renames not tracked |
| Header chip "6 PMax Campaigns" | `ProductIntelligence.jsx:221` | Hardcoded string | Wrong — should be 7 |
| Footer footnote "6 PMax campaign IDs" | `ProductIntelligence.jsx:446` | Hardcoded string | Wrong — should be 7 |
| Campaign name derivation (req1/req3) | `ProductIntelligence.jsx:277`, `product_action_dashboard.py:89-92` | **Dynamic** (from DB) | No issue |
| Campaign status | All req backends | **Dynamic** (from DB) | No issue |
| Campaign budget | All req backends | **Dynamic** (from DB) | No issue |
| `target_roas` served to frontend | `product_intelligence.py:111` | `SJ_TARGET_ROAS.get(cid, 300)` | Stale hardcoded — DB value available |

---

## 5. 6 vs 7 Discrepancy — Root Cause

**Root cause: `ProductIntelligence.jsx` line 221 has a hardcoded string `"6 PMax Campaigns"`.**

- Header chip: **hardcoded** `"6 PMax Campaigns"` → shows **6** regardless of actual count.
- Footer footnote line 446: **hardcoded** `"6 PMax campaign IDs"`.
- Campaign Overview count `({campaigns.length})`: **dynamic** → shows **7** (correct).
- Total Sales KPI sub-label `{campaigns.length} campaigns`: **dynamic** → shows **7** (correct).
- Individual campaign cards: **dynamic** → renders all 7.

The 7th campaign (`24092456136`) was added to `SJ_CAMPAIGN_IDS` at some point after the frontend label was written but the label was never updated.

---

## 6. Performance Sync Dates

| Campaign ID | First Perf Date | Last Perf Date | Days Synced |
|---|---|---|---|
| 21069663519 | 2024-03-05 | 2026-10-21 | 948 |
| 21242723265 | 2024-04-30 | 2026-10-21 | 890 |
| 22079334413 | 2024-12-31 | 2026-10-21 | 660 |
| 23110323532 | 2025-10-10 | 2026-10-21 | 377 |
| 23516313256 | 2026-01-29 | 2026-10-21 | 266 |
| 23590572906 | 2026-02-24 | 2026-10-21 | 240 |
| 24092456136 | 2026-08-03 | 2026-10-21 | 80 |

All 7 campaigns synced to same date (2026-10-21). Sync lag: ~9 days behind today.

---

## 7. Files Affected

| File | Change Required |
|---|---|
| `backend/app/dashboard_pages/shared.py` | Add `24092456136` to `SJ_TARGET_ROAS` + `SJ_CAMP_NAMES`; OR replace both dicts with DB lookup |
| `frontend/src/dashboard_pages/FeedOptimization.jsx` | Add `24092456136` to `SJ_CAMP_NAMES` |
| `frontend/src/dashboard_pages/ProductIntelligence.jsx` | Fix hardcoded "6" in chip + footnote |
| `frontend/src/dashboard_pages/ProductActionDashboard.jsx` | Already has 7th — no change needed |

---

## 8. Recommended Minimal Fix (Inspection Only — Not Yet Implemented)

### Option A — Minimal safe patch (4 targeted edits, no architecture change)

1. **`shared.py`** — Add `"24092456136": 300` to `SJ_TARGET_ROAS` (DB value confirmed = 300%).
2. **`shared.py`** — Add `"24092456136": "SJ_Lighting_PH_KLARNA"` to `SJ_CAMP_NAMES`.
3. **`FeedOptimization.jsx`** — Add `'24092456136': 'SJ_Lighting_PH_KLARNA'` to `SJ_CAMP_NAMES`.
4. **`ProductIntelligence.jsx`** — Replace `"6 PMax Campaigns"` with `"7 PMax Campaigns"` in chip (line 221) and footnote (line 446).

**Risk:** Low. All four changes are additive/corrective with no logic changes.  
**Testing needed:** Frontend build, existing backend tests (97+ currently passing), visual verification of all 4 pages.

### Option B — Read `target_roas` from DB (medium effort, eliminates stale ROAS permanently)

Replace `SJ_TARGET_ROAS.get(cid, 300)` in `product_intelligence.py` with:
```python
"target_roas": round(float(r["target_roas"]) * 100) if r["target_roas"] else 300,
```
This requires `target_roas` to be included in the `camp_rows` JOIN — it already is in the campaigns table (`c.target_roas`). One SQL change to SELECT + remove `SJ_TARGET_ROAS` import from `product_intelligence.py`.

**Risk:** Low-medium. Accurate values; removes stale constant. Requires confirming `r["target_roas"]` unit (ratio, confirmed = 3.00 = 300%).

### Option C — Dynamic campaign discovery (larger, not recommended yet)

Replace `SJ_CAMPAIGN_IDS` whitelist with a DB query on `google_ads.campaigns WHERE group_name = 'SAJEEPAN'`. Requires confirming `group_name` = 'SAJEEPAN' is reliable for all active campaigns.

**Risk:** Medium. Includes paused campaigns unless filtered. Requires `campaign_status IN ('ENABLED')` guard.

**Recommendation:** Implement Option A immediately. Option B as follow-up in same commit if approved. Option C deferred.

---

## 11. Implementation Record (2026-10-30 — Option A + B)

**Req ID:** AIOS-2026-10-30-SAJ-IMPL  
**Approved by:** Piranav  
**Type:** Code change — no DB writes, no commit, no deploy

### Files modified (4 total, `git diff --stat`)

```
backend/app/dashboard_pages/product_intelligence.py  | 8 ++++----
backend/app/dashboard_pages/shared.py                | 1 +
frontend/src/dashboard_pages/FeedOptimization.jsx    | 1 +
frontend/src/dashboard_pages/ProductIntelligence.jsx | 4 ++--
4 files changed, 8 insertions(+), 6 deletions(-)
```

### Change A — `product_intelligence.py` (Option B: DB-driven ROAS)

**Before:**
```python
from .shared import SJ_CAMPAIGN_IDS, SJ_TARGET_ROAS
# ...
SELECT cp.campaign_id, c.campaign_name, c.budget, c.campaign_status,
# ...
GROUP BY cp.campaign_id, c.campaign_name, c.budget, c.campaign_status
# ...
"target_roas": SJ_TARGET_ROAS.get(cid, 300),
```

**After:**
```python
from .shared import SJ_CAMPAIGN_IDS
# ...
SELECT cp.campaign_id, c.campaign_name, c.budget, c.campaign_status, c.target_roas,
# ...
GROUP BY cp.campaign_id, c.campaign_name, c.budget, c.campaign_status, c.target_roas
# ...
"target_roas": round(float(r["target_roas"]) * 100) if r["target_roas"] else 300,
```

3 sub-changes: (1) import removed, (2) `c.target_roas` added to SELECT and GROUP BY, (3) hardcoded lookup replaced with DB-driven conversion.

### Change B — `shared.py` (Option A: SJ_CAMP_NAMES)

Added `"24092456136": "SJ_Lighting_PH_KLARNA"` as 7th entry to `SJ_CAMP_NAMES`.  
`SJ_TARGET_ROAS` dict left in place (now unused by `product_intelligence.py`; not imported by any other file — safe to clean up in future pass if desired).

### Change C — `FeedOptimization.jsx` (Option A: frontend SJ_CAMP_NAMES)

Added `'24092456136': 'SJ_Lighting_PH_KLARNA'` as 7th entry to frontend `SJ_CAMP_NAMES` constant.

### Change D — `ProductIntelligence.jsx` (Option A: dynamic count)

Line 221 (header chip): `"6 PMax Campaigns"` → `{campaigns.length || 7} PMax Campaigns`  
Line 446 (footnote): `"6 PMax campaign IDs"` → `{campaigns.length || 7} PMax campaign IDs`  

`campaigns.length` = dynamic count from API response. Fallback `|| 7` covers the loading state before data arrives (avoids "0 PMax Campaigns" flash). Once data loads, renders actual count (7).

### Test results
- Backend: **660 passed, 27 failed** — 27 failures all pre-existing, 0 new regressions. Exit code 0.
- Frontend build: **✓ built in 1.17s** — clean.
- ROAS conversion math: all 7 campaigns verified correct by Python inline test.

### Git state after implementation
- Branch: `piranv-work` at `ca09880`
- Working tree: 4 modified files, uncommitted
- No commit made — awaiting Piranav approval

---

## 9. Linked AIOS Files

| Type | Path |
|---|---|
| Previous campaign ownership verification | `evidence/sajeepan/sajeepan-ads-scope-level6a-lifetime-verification-2026-09-25.md` |
| Existing dashboard docs | `docs/dashboards/staff-workflows/sajeepan-live-dashboard.md` |
| System workflow brief | `prompts/sajeepan-system-workflow-gpt-brief.md` |

---

## 10. ROAS Source Verification (2026-10-30 — Pre-Implementation)

**Req ID:** AIOS-2026-10-30-SAJ-ROAS-VERIFY  
**Type:** Inspection only — DB read-only, no code changes, no commits

---

### 10.1 Exact DB Source

**Table:** `google_ads.campaigns`  
**Column:** `target_roas`  
**Type:** `numeric`, nullable (`YES`)  
**Schema:** 20 columns total — no `updated_at` column on this table.  
All other campaign metadata columns (name, status, budget, bidding_strategy_type) are on the same table, already JOINed in the req1 SQL at `c.campaign_name`, `c.budget`, `c.campaign_status`.

---

### 10.2 ROAS Field Meaning — Bidding Target, Not Performance ROAS

**Confirmed: `target_roas` is the Google Ads bidding Target ROAS setting, not calculated performance ROAS.**

Evidence chain:
1. All 7 SJ campaigns have `bidding_strategy_type = 'MAXIMIZE_CONVERSION_VALUE'` — this is the PMax bidding strategy that uses `maximizeConversionValue.targetRoas` as the ROAS floor target set by the advertiser.
2. `google_ads_change_events` change history records field `maximizeConversionValue.targetRoas` as the Google Ads API field name for ROAS changes — this is the Google Ads bidding setting field.
3. All changes to `target_roas` were made by `sajeepandigitweblanka@gmail.com` via `GOOGLE_ADS_WEB_CLIENT` — a human making bidding changes in the Google Ads UI.
4. Only `MAXIMIZE_CONVERSION_VALUE` and `TARGET_ROAS` bidding strategies have `target_roas` populated (237 and 131 campaigns respectively). `MANUAL_CPC`, `MAXIMIZE_CONVERSIONS`, `TARGET_SPEND`, `TARGET_CPA`, `TARGET_CPV` all have `target_roas = NULL`. This confirms it is a strategy-specific bidding parameter, not a computed metric.
5. Performance ROAS is calculated in the backend as `round(cv / cost * 10000) / 100` on the fly — it is never stored.

**Interpretation:** `target_roas = 3.00` means Sajeepan has set a bidding target of 300% ROAS (i.e. return £3.00 per £1 spent). This is the *desired* ROAS floor — not the *achieved* ROAS.

---

### 10.3 How the External Sync Populates This Field

From `google_ads_change_events` evidence:
- The sync process writes to the DB with a ~6–8 hour lag behind real Google Ads changes (e.g. change at 2026-10-20T05:15 UTC, written to DB at 2026-10-20T12:23 UTC — lag: ~7h).
- `google_ads.campaigns.target_roas` is overwritten on each sync run with the current value from the Google Ads API — it is a snapshot, not an append log.
- The change history is preserved separately in `google_ads_change_events` with `old_value` / `new_value` / `change_date_time` / `created_at`.

---

### 10.4 Sync Freshness — The 9-Day Performance Lag Explained

| Metric | Value |
|---|---|
| `MAX(created_at)` in `google_ads_change_events` | **2026-10-30 08:31 UTC** |
| `MAX(change_date_time)` in events | **2026-10-30 08:22 UTC** |
| Current time (at query) | 2026-10-30 09:56 UTC |
| Hours since last sync write | **~2.4 hours** |
| Latest performance date in `campaign_performance` | **2026-10-21** |
| Performance lag | **9 days** |

**Key finding: the sync process IS running frequently (last write ~2h ago). The 9-day lag is in `campaign_performance` data, not in campaign metadata.**

Two separate sync cadences confirmed:
- **Campaign metadata** (`campaigns` table: name, status, budget, `target_roas`): synced frequently — last event written today, 2h ago. `target_roas` is current.
- **Daily performance data** (`campaign_performance`): lags 1–9 days. Max perf date = 2026-10-21. This is standard Google Ads reporting delay (Google finalizes conversion data ~3–7 days after the date, hence the dashboard's use of `MAX(date)` as the default to_date rather than `CURRENT_DATE`).

**Conclusion: `target_roas` in `google_ads.campaigns` is reliably fresh.** The 9-day lag belongs to performance metrics, not to campaign configuration data.

---

### 10.5 Seven-Campaign Coverage — All Valid, Zero NULLs

Query: `WHERE campaign_id IN (...7 IDs...) AND target_roas IS NULL` → **0 rows.**

All 7 campaigns have non-NULL `target_roas`:

| Campaign ID | Short Label | `target_roas` (DB) | DB → % |
|---|---|---|---|
| 21069663519 | SJ_PENDANT_KLARNA | 3.00 | 300% |
| 21242723265 | ALLACRSJ2 Access. | 3.65 | 365% |
| 22079334413 | SJALL HERO | 3.20 | 320% |
| 23110323532 | HIGH REVENUE PH | 3.00 | 300% |
| 23516313256 | SJ_TOP_20 | 3.20 | 320% |
| 23590572906 | zero conv2 | 4.80 | 480% |
| 24092456136 | SJ_Lighting_PH_KLARNA | 3.00 | 300% |

Zero NULL values. Full coverage confirmed.

Wider DB: 814 total campaigns, 446 have `target_roas = NULL` — these are all non-MCV/non-tROAS strategies (MANUAL_CPC, MAXIMIZE_CONVERSIONS, etc.) where a ROAS target is not applicable. The NULL fallback is appropriate for those campaigns.

---

### 10.6 NULL / Missing / Deleted Campaign Handling

**If `target_roas` is NULL for a new campaign added to `SJ_CAMPAIGN_IDS`:**
- Current code: `SJ_TARGET_ROAS.get(cid, 300)` — returns 300 (hardcoded fallback).
- Option B code: `round(float(r["target_roas"]) * 100) if r["target_roas"] else 300` — returns 300 if NULL.
- Behaviour is identical for the NULL case. Fallback of 300% (ratio 3.0) is the appropriate default for a MAXIMIZE_CONVERSION_VALUE campaign that has not yet had a target set.

**If a campaign is REMOVED from Google Ads:**
- Its row remains in `google_ads.campaigns` with `campaign_status = 'REMOVED'`.
- `target_roas` retains its last known value.
- The campaign will appear in the dashboard until manually removed from `SJ_CAMPAIGN_IDS`.

**If a campaign row is deleted entirely from the DB** (theoretically):
- The req1 SQL uses `JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id` — a deleted row would exclude that campaign from results entirely (INNER JOIN). No NULL propagation risk.

---

### 10.7 Safe Backend Query Pattern for Option B

The req1 SQL already JOINs `google_ads.campaigns` at line 44–62 of `product_intelligence.py`. The JOIN selects `c.campaign_name`, `c.budget`, `c.campaign_status`. Adding `c.target_roas` requires a single token change:

**Current SELECT line 46:**
```sql
SELECT cp.campaign_id, c.campaign_name, c.budget, c.campaign_status,
```

**Option B change:**
```sql
SELECT cp.campaign_id, c.campaign_name, c.budget, c.campaign_status, c.target_roas,
```

**Python line 111 — current:**
```python
"target_roas": SJ_TARGET_ROAS.get(cid, 300),
```

**Option B replacement:**
```python
"target_roas": round(float(r["target_roas"]) * 100) if r["target_roas"] else 300,
```

Unit confirmed: DB stores ratio (3.00 = 300%). Multiply by 100 → percentage for frontend display. `round()` handles 3.65 → 365 cleanly (no float drift at these values since all observed ROAS values are ≤2 decimal places).

**Impact on other calculations:** The `target_roas` field in the API response is display-only on the frontend (used to render the "Target ROAS" chip on each campaign card in `ProductIntelligence.jsx`). It does not feed into any computed metric — no revenue, cost, ROAS, or trend calculation uses it. Change is fully isolated.

**Impact on other Sajeepan pages:**
- `RevenueProtection` (req2): does not import or use `SJ_TARGET_ROAS`. No impact.
- `ProductActionDashboard` (req3): does not use `SJ_TARGET_ROAS`. No impact.
- `FeedOptimization` (req4): does not use `SJ_TARGET_ROAS`. No impact.

Change scope: **`product_intelligence.py` only** — 2 lines modified, `SJ_TARGET_ROAS` import removed from that file. `shared.py` `SJ_TARGET_ROAS` dict can be retained (it is not imported by other files) or removed — safe either way.

---

### 10.8 ROAS Change Activity — Sajeepan Actively Adjusts ROAS

From `google_ads_change_events` (last 20 ROAS changes, all by `sajeepandigitweblanka@gmail.com`):

| Date | Campaign | Old → New |
|---|---|---|
| 2026-10-20 | HIGH REVENUE PH (23110323532) | 3.6 → 3.0 |
| 2026-10-06 | SJ_PENDANT_KLARNA (21069663519) | 3.84 → 3.0 |
| 2026-10-05 | SJ_PENDANT_KLARNA | 3.2 → 3.84 |
| 2026-10-05 | SJ_TOP_20 (23516313256) | 4.0 → 3.2 |
| 2026-10-05 | SJ_Lighting_PH_KLARNA (24092456136) | 3.5 → 3.0 |
| 2026-10-05 | ALLACRSJ2 (21242723265) | 3.04 → 3.65 |
| 2026-10-05 | HIGH REVENUE PH | 3.0 → 3.6 |
| 2026-10-01 | ALLACRSJ2 | 3.8 → 3.04 |
| 2026-09-18 | SJ_PENDANT_KLARNA | 3.0 → 3.2 |
| 2026-09-03 | SJALL HERO (22079334413) | 4.0 → 3.2 |
| 2026-08-10 | zero conv2 (23590572906) | 4.0 → 4.8 |

**This confirms the critical flaw in Option A's ROAS patch:** Sajeepan adjusts ROAS values frequently (multiple times per week in active periods). Any hardcoded value in `shared.py` will be stale within days of being written. Option A patching `SJ_TARGET_ROAS` is a short-term fix that will re-accumulate drift immediately.

---

### 10.9 Recommended Safe Fallback

For any campaign in `SJ_CAMPAIGN_IDS` that has `target_roas IS NULL` in the DB:
- Use fallback **300% (ratio 3.0)** — matching the current hardcoded default.
- This is appropriate: MAXIMIZE_CONVERSION_VALUE campaigns without a ROAS target are effectively uncapped, and 300% is a conservative display default.
- The fallback will only fire for a brand-new campaign that has never had a ROAS target set in Google Ads.

---

### 10.10 Final Recommendation

| Option | Description | Verdict |
|---|---|---|
| **Option A only** | Add `"24092456136"` to `SJ_TARGET_ROAS` in `shared.py` | **NOT RECOMMENDED alone** — Sajeepan changes ROAS values frequently; any hardcoded patch re-drifts within days |
| **Option B only** | Read `c.target_roas` from DB in req1, multiply × 100, fallback 300 | **RECOMMENDED** — 2 lines changed, zero logic risk, eliminates all future drift, DB value confirmed fresh |
| **Option A + B** | Patch dict AND read from DB | **Redundant** — if Option B is implemented, `SJ_TARGET_ROAS` is no longer used by `product_intelligence.py`; patching it adds noise |
| **Option A for other fixes only** | Fix `SJ_CAMP_NAMES` + `FeedOptimization.jsx` + `ProductIntelligence.jsx` "6"→"7" | **RECOMMENDED** — these are display labels that change rarely; static dict is fine for names |

**Final recommendation:**
- **Implement Option B** for `target_roas` (read from DB — 2-line change in `product_intelligence.py`).
- **Implement Option A partial** for the 3 remaining fixes: `SJ_CAMP_NAMES` in `shared.py` + `FeedOptimization.jsx` + `ProductIntelligence.jsx` "6"→"7" labels.
- These 4 changes can go in a single commit on `piranv-work`.
- Do NOT patch `SJ_TARGET_ROAS` dict — it becomes unused after Option B and should be left as-is or cleaned up in a separate pass.
