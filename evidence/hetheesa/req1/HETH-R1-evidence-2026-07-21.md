# HETH-R1 — Validation Evidence Update

**Evidence ID:** HETH-R1-EV-20260721
**Captured date:** 2026-07-21
**Captured by:** Piranav / Claude Code execution
**Requirement ID:** HETH-R1
**Requirement title:** Hetheesha — Requirement 1: Live SEO Dashboard & Fix Tracker
**Store:** ledsone.fr
**Dashboard:** https://staff-requirements-02.vercel.app/pages/hetheesha.html
**Previous evidence record:** `evidence/hetheesa/req1/HETH-R1-evidence-2026-07-20.md`
**Duplicate-risk result:** GREEN — this file is a dated update record; no new canonical truth created

---

## Existing Asset Search — Completed

| Location Checked | Matching Asset | Decision |
|------------------|---------------|----------|
| `evidence/hetheesa/req1/` | `HETH-R1-evidence-2026-07-20.md` | Extend — new dated record in same folder |
| `evidence/hetheesa/requirement-01-*.md` (9 files) | Static dashboard phase, 2026-07-03–07-06 | No conflict — different implementation phase |
| `handover/hetheesa/requirement-01-handover.md` | Jul 06 session updates | No conflict — predates live API phase |
| `validation/hetheesa/requirement-01-validation.md` | Jul 03 static validation | No conflict — different implementation phase |
| `docs/capability-candidates/live-seo-fix-tracker-candidate.md` | Live SEO Fix Tracker candidate (2026-07-20) | Extend — new capabilities added |
| `daily_logs/2026-07-21.md` | Does not exist | Create |
| `Staff-requirements-02/docs/hetheesha-work-2026-07-21.md` | Work summary created in session | Noted — not canonical AIOS record |

**Duplicate-risk result: GREEN** — no parallel Requirement 1 truth exists. Chronological evidence chain: `requirement-01-*.md` (static phase, Jul 03–06) → `HETH-R1-evidence-2026-07-20.md` (live API phase) → this file (2026-07-21 improvements).

---

## Commits Verified — 2026-07-21

All six commits confirmed to exist in the repository with correct timestamps and file changes.

| Commit | Timestamp (IST) | Expected Purpose | Files Changed | Status |
|--------|----------------|-----------------|---------------|--------|
| `f511deb` | 2026-07-21 14:26:49 | Fixed field-type filter buttons | `hetheesha.html` (+17 lines) | **VERIFIED** |
| `66677b3` | 2026-07-21 14:32:54 | Correct CTR, avg position, custom date range | `req1.js` (+83), `hetheesha.html` (+106) | **VERIFIED** |
| `8b70420` | 2026-07-21 14:40:40 | New Issues UI section and filter | `hetheesha.html` (+50) | **VERIFIED** |
| `f8da0fc` | 2026-07-21 14:42:32 | New Issues detection in buildTracker API | `req1.js` (+34/-17) | **VERIFIED** |
| `cce4705` | 2026-07-21 14:51:55 | Live top-50 handles outside snapshot | `req1.js` (+25) | **VERIFIED** |
| `ee4dab5` | 2026-07-21 15:06:57 | 5 bug fixes (R1_BA order, counts, sort, labels) | `req1.js` (+6), `hetheesha.html` (+11/-9) | **VERIFIED** |

---

## Business Question

Can Hetheesha reliably track SEO-field fixes across the current ledsone.fr top-50 revenue products, distinguish existing missing fields from newly broken fields, and compare GSC and sales performance across selectable before/after periods?

**Answer as of 2026-07-21:** Yes, with the limitations documented in this record.

---

## Implementation Claims — Code Verification

All 22 implementation claims verified by automated code inspection against final deployed files.

| # | Claim | Code Evidence | Status |
|---|-------|---------------|--------|
| 1 | Fixed field-type filter buttons exist (Meta Title, Meta Desc, FAQ, Alt Text) | `trk_filter('fixed_meta_title')` etc. in `hetheesha.html` | **VERIFIED** |
| 2 | CTR formula: `SUM(clicks) / SUM(impressions) * 100` | `req1.js`: `SUM(clicks)::numeric / NULLIF(SUM(impressions),0) * 100` | **VERIFIED** |
| 3 | Division-by-zero handled | `NULLIF(SUM(impressions),0)` | **VERIFIED** |
| 4 | Average Position exists in API | `ROUND(AVG(position)::numeric, 1) AS avg_pos` | **VERIFIED** |
| 5 | Lower Average Position treated as improvement | `hetheesha.html`: `lower:true` on Avg. Position metric | **VERIFIED** |
| 6 | Custom before/after parameters accepted | `?type=ba` handler in `req1.js`; all 6 params required | **VERIFIED** |
| 7 | Custom params validated before use | `if (!handle \|\| !before_from \|\| ...)` | **VERIFIED** |
| 8 | SQL queries are parameterized | `$1` through `$5` used; no string interpolation in WHERE clauses | **VERIFIED** |
| 9 | `new_issue: true` set for fields OK at baseline now missing live | `new_issue: true` in `buildTracker()` `else if (nowMissing)` branch | **VERIFIED** |
| 10 | Normal Pending excludes New Issues | `allPending = all.filter(i => !i.now_fixed && !i.new_issue)` | **VERIFIED** |
| 11 | Live top-50 handles outside snapshot included | `snapshotHandleSet.has(h)` check; non-snapshot handles pushed to tracker | **VERIFIED** |
| 12 | `in_snapshot: false` returned for non-baseline items | `in_snapshot: false` in step-5b push | **VERIFIED** |
| 13 | `window.R1_BA` assigned before `trk_init()` | `html.indexOf('window.R1_BA = data.before_after') < html.indexOf('trk_init(data.tracker')` | **VERIFIED** |
| 14 | Hidden tracker rows do not eagerly render BA content | Hidden expand rows contain empty `<td>`; content populated on click | **VERIFIED** |
| 15 | Tracker items sorted by revenue rank | `tracker.sort((a, b) => a.rank - b.rank)` | **VERIFIED** |
| 16 | CSV export includes New Issue column | `new_issue?'Yes':''` in CSV export | **VERIFIED** |
| 17 | New Issues KPI card exists | `id="trkNewIssue"` | **VERIFIED** |
| 18 | New Issues table section exists | `id="trkSectionNewIssue"` | **VERIFIED** |
| 19 | `?type=ba` endpoint wired in frontend refresh | `?type=ba&handle=` in `trkBaRefresh` | **VERIFIED** |
| 20 | `?type=ba` endpoint exists in API | `type === 'ba'` handler in `req1.js` | **VERIFIED** |
| 21 | Avg Position and Sales returned by `?type=ba` | `avg_pos` and `sales` in `handleBA()` response | **VERIFIED** |
| 22 | `in_snapshot: true` applied to all snapshot items | `tracker.forEach(i => { i.in_snapshot = true; })` post-buildTracker | **VERIFIED** |

**Code verification result: 22 / 22 PASS**

---

## Tracker Classification Rules (as implemented)

| State | Condition | `was_missing` | `now_fixed` | `new_issue` | `in_snapshot` | UI Section |
|-------|-----------|--------------|------------|------------|--------------|------------|
| Fixed | Was missing at baseline; live value now present | `true` | `true` | `false` | `true` | ✅ Fixed |
| Pending | Was missing at baseline; still missing live | `true` | `false` | `false` | `true` | ❌ Still Missing |
| New Issue | Was OK at baseline; now missing live | `false` | `false` | `true` | `true` | 🆕 New Issues |
| Pending (non-baseline) | Not in Jul 06 snapshot; currently missing live | `true` | `false` | `false` | `false` | ❌ Still Missing — shows "Not in Jul 06 snapshot" |

**Fields tracked:** Meta Title (`meta_title`), Meta Desc (`meta_desc`), FAQ Schema (`faq`), Alt Text (`alt_missing`)

**Missing definitions (as coded):**
- Meta Title: `!v` (null or empty string)
- Meta Desc: `!v` (null or empty string)
- FAQ Schema: `v === 'Missing' || !v`
- Alt Text: `v > 0` (count of images without alt text is greater than zero)

---

## Before/After Endpoint

**Endpoint:** `GET /api/hetheesha/req1?type=ba&handle=<handle>&before_from=<YYYY-MM-DD>&before_to=<YYYY-MM-DD>&after_from=<YYYY-MM-DD>&after_to=<YYYY-MM-DD>`

**All 5 params required.** Returns 400 if any are missing.

**Data sources:**
- GSC: `google_search_console.page` WHERE `sub_source=233 AND search_type='web'`
- Sales: `order_management.orders` JOIN `order_management.order_item_info` WHERE `sub_source_id=233 AND status='Completed'`

**Response metrics:**
- `imp` — SUM of impressions
- `clicks` — SUM of clicks
- `ctr` — `ROUND(SUM(clicks) / NULLIF(SUM(impressions),0) * 100, 2)`
- `avg_pos` — `ROUND(AVG(position), 1)` (lower = better)
- `sales` — `ROUND(SUM(item_price * item_quantity), 2)`

**Default periods (loaded from API on page load):**
- Before: 2026-06-22 → 2026-07-06
- After: 2026-07-07 → 2026-07-18

User can override any period using the date pickers in each expand row and click ↻ Refresh.

---

## Dated Tracker Snapshot — 2026-07-21

> **These counts are point-in-time observations, not permanent values. Revenue rank and Shopify field status change continuously. Do not treat these as fixed truth.**

API response captured from deployed endpoint at approximately 09:28 UTC on 2026-07-21 (before `ee4dab5` deployed; post-deployment counts may differ slightly due to live data).

| Status | Count |
|--------|-------|
| ✅ Fixed | 74 |
| ❌ Still Pending | 46 |
| 🆕 New Issues | 2 |
| **Total Tracked** | **122** |

**Fix rate:** 74 / 122 = 60.66% (displayed as 60.6%)

**Status of specific claim:** PARTIAL — counts come from a cached API response (`h_req1.json`) captured at 09:28 UTC 2026-07-21. The response was captured before the final `ee4dab5` fix commit (deployed 09:36 UTC). A post-deployment API response or production screenshot would be required to mark this VERIFIED. The code logic is VERIFIED; the exact counts are PARTIAL.

**Verified example handle claim:**
- Handle: `applique-murale-et-plafonnier-industriel-2-en-1-m-tal-r-glable`
- Rank in API response: **18** (matches supplied claim)
- Tracker items: `meta_title`, `meta_desc`, `faq`, `alt_missing` — all `now_fixed: false` (matches supplied claim: all 4 fields missing)
- Status: **VERIFIED from cached API response**

**New Issue detail:**
- 2 items, both `field_key: alt_missing`
- Item 1: handle `applique-murale-vintage-led-eclairage-retro-ajustable` — `before: 0` (0 images missing alt at Jul 06) → `live_value: 2` (2 images now missing alt)
- Item 2: handle `abat-jour-m-tal-pluton-plafonnier-suspension-luminaire-abat-jour` — `before: 0` (0 images missing alt at Jul 06) → `live_value: 11` (11 images now missing alt)
- Cause (from data): images existed with alt text at Jul 06 baseline; subsequent images added to these products have no alt text set. The exact cause (whether existing alt text was removed, or new images were added without alt text) cannot be determined from the tracker data alone — would require Shopify product edit history.
- Status: **PARTIAL** — classification is code-verified; causal attribution requires Shopify edit history inspection

---

## Production Deployment Claim

**Reported URL:** https://staff-requirements-02.vercel.app
**Reported deployment time:** 2026-07-21 approximately 15:24 IST (09:54 UTC)
**Final commit deployed:** `ee4dab5` (2026-07-21 15:06:57 IST)
**Vercel build log evidence:** Vercel CLI output captured in session showed `"readyState": "READY"` and `"target": "production"` for final deployment
**Status:** PARTIAL — Vercel CLI output was captured in session chat but not saved as a standalone repository asset. No production screenshot or saved deployment log in repository. A saved `vercel inspect` output or screenshot would be required to mark VERIFIED.

---

## Evidence Register

| Claim | Evidence | Status | Gap |
|-------|----------|--------|-----|
| All 6 commits exist in repository | `git show --stat` for each SHA | **VERIFIED** | None |
| Fixed field-type filters in HTML | Code grep — `trk_filter('fixed_meta_title')` etc. | **VERIFIED** | None |
| CTR uses aggregate formula | Code grep — `SUM(clicks)::numeric / NULLIF(SUM(impressions),0) * 100` | **VERIFIED** | None |
| Division-by-zero safe | `NULLIF(SUM(impressions),0)` | **VERIFIED** | None |
| Avg Position in API and UI | Code grep — `AVG(position)`, `lower:true` | **VERIFIED** | None |
| Custom date params accepted and validated | `?type=ba` handler, param check | **VERIFIED** | None |
| SQL is parameterized | `$1`–`$5` present; no string concat in WHERE | **VERIFIED** | None |
| `new_issue: true` in buildTracker | Code grep | **VERIFIED** | None |
| Normal Pending excludes New Issues | `!i.now_fixed && !i.new_issue` | **VERIFIED** | None |
| Live top-50 outside snapshot included | `snapshotHandleSet.has(h)` logic | **VERIFIED** | None |
| `in_snapshot: false` for non-baseline | Code grep | **VERIFIED** | None |
| `R1_BA` assigned before `trk_init` | Position check in HTML source | **VERIFIED** | None |
| Hidden rows do not eagerly render BA | Empty `<td>` confirmed | **VERIFIED** | None |
| Tracker sorted by rank | `tracker.sort((a, b) => a.rank - b.rank)` | **VERIFIED** | None |
| CSV includes New Issue column | `new_issue?'Yes':''` | **VERIFIED** | None |
| Example handle rank 18 | Cached API response | **VERIFIED** | Cached pre-final-deploy |
| Example handle 4 fields missing | Cached API response | **VERIFIED** | Cached pre-final-deploy |
| Tracker counts (74/46/2/122) | Cached API response | **PARTIAL** | Captured before `ee4dab5` deployed; post-deploy snapshot not saved |
| Fix rate 60.66% | Computed from cached counts | **PARTIAL** | Depends on partial snapshot |
| New Issue cause (alt text) | API data: `before=0`, `live_value>0`; causal attribution | **PARTIAL** | Shopify edit history not inspected |
| Production deployment READY | Vercel CLI output in session | **PARTIAL** | Not saved as standalone repository asset |
| Deployment time 15:24 IST | Session record | **ASSUMPTION** | Not in repository evidence |

---

## Limitations

1. **Fix dates are browser-specific** — stored in `localStorage` key `heth_fix_dates_v1`; clearing browser data loses fix history
2. **Jul 06 baseline is hardcoded** — `const SNAPSHOT = [...]` in `req1.js`; does not auto-update as the top-50 changes
3. **Non-snapshot products have no baseline comparison** — fields for handles not in SNAPSHOT have `before: null`; we cannot determine when those fields became missing
4. **Before/after GSC data may be sparse** — GSC page data is available to 2026-07-18; many products have no impressions data in either period
5. **New Issue cause is not deterministic from tracker alone** — tracker shows `before=0, live_value>0` for alt_missing new issues but cannot confirm whether existing images lost alt text or new images were added without it
6. **Tracker counts are live-shifting** — rank, field status, and product set change as revenue data rolls and Hetheesha makes Shopify edits
7. **5 batched Shopify API calls** — load time 5–10s on cold start; Vercel `maxDuration: 60`
8. **No write access to database** — fix dates cannot be centralised; each browser maintains its own state
9. **`in_snapshot` flag for new_issue items** — new_issue items returned by `buildTracker` are marked `in_snapshot: true` (because the post-buildTracker loop marks all tracker items), though conceptually they represent a regression from an OK-at-baseline state. This distinction is correctly handled by the `new_issue: true` flag; `in_snapshot` is redundant for new_issue rows.

---

## Queryability Test

| Area | Result | Evidence | Gap |
|------|--------|----------|-----|
| What was completed | PASS | This record + commit list | None |
| Why it was completed | PASS | Business question stated; handle example shows tracker gap closed | None |
| Asset locations | PASS | `req1.js`, `hetheesha.html`, this file | None |
| Data sources | PASS | GSC table, orders tables, Shopify Admin GraphQL all named with parameters | None |
| Baseline date | PASS | Jul 06 2026 — hardcoded SNAPSHOT in `req1.js` | None |
| Classification rules | PASS | Table of states with conditions | None |
| Metric formulas | PASS | CTR, position, sales all documented | None |
| Evidence | PASS | 22-point code check; commit verification; API response | None |
| Known gaps | PASS | 9 limitations listed | None |
| Reviewers | PASS | Piranav named | None |
| Next action | PASS | Stated below | None |
| Safe reuse boundaries | PASS | Capability candidate updated with new scope | None |

**Queryability result: PASS**

---

## Unknown Developer Test

| Area | Result | Evidence | Gap |
|------|--------|----------|-----|
| Objective | PASS | Business question + requirement ID clear | None |
| Current status | PASS | PASS with limitations; 60.6% fix rate | None |
| Dashboard and API files | PASS | `Staff-requirements-02/pages/hetheesha.html`, `api/hetheesha/req1.js` | None |
| Key tracker states | PASS | Classification table with field conditions | None |
| Before/after endpoint | PASS | Full URL pattern and response fields documented | None |
| Implementation commits | PASS | All 6 commits with purpose and files changed | None |
| Evidence path | PASS | `evidence/hetheesa/req1/` | None |
| Known risks | PASS | Limitations section covers browser storage, snapshot staleness, GSC gaps | None |
| Systems not to change | PASS | Listed below | None |
| Next action | PASS | Stated below | None |

**Unknown Developer Test: PASS**

---

## Systems Not Changed — Confirmed

The following were confirmed untouched during this task:

- `Staff-requirements-02/api/hetheesha/req1.js` — read-only during documentation phase
- `Staff-requirements-02/pages/hetheesha.html` — read-only during documentation phase
- SQL queries in `req1.js` — not modified
- Jul 06 baseline SNAPSHOT array — not modified
- Tracker classification rules — not modified
- Shopify production data — not accessed
- PostgreSQL schema or data — not modified
- Environment variables — not modified
- Vercel project configuration — not modified
- Other staff dashboards (Thivajini, Jackshan, Sonya, Sajeepan, Theekshy) — not accessed
- Parent AIOS truth files — not accessed

---

## Reviewer Required

**Piranav** — confirm the following before promoting to closed status:
1. Post-deployment API snapshot to replace PARTIAL counts with VERIFIED counts
2. Hetheesha confirms the "Not in Jul 06 snapshot" label is clear in the dashboard
3. New Issue cause (alt text regression) confirmed via Shopify product edit history or Hetheesha's direct knowledge

---

## Next Action

Hetheesha opens https://staff-requirements-02.vercel.app → Fix Tracker → clicks "🆕 New Issues" filter → confirms the two alt-text regression products and investigates whether images were added recently without alt text.

Piranav: capture a post-deployment API response or screenshot to upgrade tracker snapshot from PARTIAL to VERIFIED.

---

## Final Decision

**Hetheesha Requirement 1: PASS with documented limitations**
**AIOS update: PASS**
**Queryability: PASS**
**Unknown Developer Test: PASS**
**Overall risk: GREEN**

All 6 commits verified. All 22 code claims verified. Business question answered. Known gaps documented. No duplicate truth created. No implementation or production data modified. Evidence stored in repository. A clean LLM and an unknown developer can both continue from this record.
