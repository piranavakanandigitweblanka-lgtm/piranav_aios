---
name: dm-campaign-phase4-frontend-validation-2026-11-02
description: Phase 4 frontend integration and functional validation audit for DM Campaign Overall Performance. Local environment startup, KPI display trace, API integration verification, bug re-verification. 2026-11-02.
metadata:
  type: evidence
---

# DM Campaign — Overall Performance: Phase 4 Frontend Integration & Functional Validation

**Date:** 2026-11-02
**Type:** Read-only frontend integration validation
**Auditor:** Claude Code (Phase 4 of 4)
**Scope:** DmCampaign.jsx, Vite dev server, FastAPI backend, CORS, auth flow, KPI display trace

---

## 1. Git Safety Check

| Check | Result |
|---|---|
| Branch | piranv-work |
| Remote | websitetecteam-arch/dm-dashboard |
| Working tree | Untracked AIOS docs only (evidence/validation/prompts) — no code changes |
| READ-ONLY rule | No source code modified, no DB writes, no server changes |

---

## 2. Local Environment Startup

### Backend

| Check | Result |
|---|---|
| Port 8499 | LIVE — was already running from Phase 3 |
| Health check | `curl http://127.0.0.1:8499/api/health` → `{"status":"ok"}` |
| Startup method | `backend/venv/Scripts/python.exe -m uvicorn app.main:app --port 8499` |
| App import | Clean — no startup errors |

### Frontend

| Check | Result |
|---|---|
| Vite dev server | Running on port 5199 (`npm run dev -- --port 5199`) |
| Local URL | http://localhost:5199/ |
| Startup time | 586ms |
| Build check | ✅ CLEAN — `npm run build` → 510 modules, 0 errors, 0 warnings |
| DmCampaign bundle | `dist/assets/DmCampaign--LTLugxA.js` (23.61 kB, gzip 5.79 kB) |

### CORS Configuration

| Check | Result |
|---|---|
| Backend `CORS_ORIGIN` env var | `http://localhost:5199` |
| Vite dev server port | 5199 (matches CORS_ORIGIN ✅) |
| CORS fallback in code | `http://localhost:5173` (default if env not set) |
| Preflight test (OPTIONS) | `access-control-allow-origin: http://localhost:5199` ✅ |
| GET with Origin header | 200 OK, full JSON response ✅ |

**Note:** Starting Vite on port 5173 (default) would cause CORS failures in browser. Must use port 5199.

---

## 3. Frontend API Integration Trace

**File:** `frontend/src/admin/pages/DmCampaign.jsx`

### API URL Resolution

```js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8199'
```

`frontend/.env` contains `VITE_API_URL=http://localhost:8499`.
- `.env` is loaded → `API_URL = 'http://localhost:8499'` ✅
- **If `.env` missing:** falls back to port 8199 (wrong port) — this would silently break the page

### Endpoint Called

```
GET http://localhost:8499/api/admin/dm-campaign/summary?mode=all
GET http://localhost:8499/api/admin/dm-campaign/summary?mode=custom&start=YYYY-MM-DD&end=YYYY-MM-DD
```

### Request Parameter Logic

```js
const params = new URLSearchParams({ mode: start && end ? 'custom' : 'all' })
if (start) params.set('start', start)
if (end) params.set('end', end)
```

| Scenario | Parameters Sent | Result |
|---|---|---|
| Initial load (no dates) | `?mode=all` | All Time ✅ |
| Both dates set | `?mode=custom&start=X&end=Y` | Custom range ✅ |
| Only start set | `?mode=all` (start ignored) | Silently falls to All Time (BUG-06 related) |
| Only end set | `?mode=all` (end ignored) | Silently falls to All Time (BUG-06 related) |
| Both cleared (Reset) | `?mode=all` | All Time ✅ |

### Auth (apiFetch)

`apiFetch` reads `localStorage.getItem('dm_token')` and attaches as `Bearer`.
- muguntha (access_grants for DmCampaign) → 200 OK ✅
- piranav (admin but NO access_grants) → **403 FORBIDDEN** ⚠️
- No token → 401 → `dm:session-expired` event → login screen

**Access Grant Status for DmCampaign:**
| User | Role | access_grants | Can Access Page |
|---|---|---|---|
| muguntha | admin | YES (id=349) | ✅ Yes |
| piranav | admin | NO | ❌ 403 |
| dev (Kuberan) | dev | N/A (auto-bypass) | ✅ Yes |

---

## 4. KPI Display Validation — All Time

### Phase 3 Verified API Values

| Field | API Value | Type |
|---|---|---|
| campaignCount | 2 | integer |
| impressions | 34,800,553 | integer |
| clicks | 458,499 | integer |
| ctr | 1.32 | float (2dp) |
| cost | 193387.27 | float (2dp) |
| conversions | 19924.25 | float (2dp) |
| conversionValue | 641168.93 | float (2dp) |
| roas | 331.55 | float (2dp) |

### KPI Card Display Trace (what browser renders)

Formatters:
- `eur(v)` → `'£' + Number(v).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})`
- `num(v)` → `Number(v).toLocaleString()` (locale-dependent thousands separator)
- `pct(v)` → `Number(v).toFixed(2) + '%'`

| KPI Card | API Value | Expected Display | In Cards? |
|---|---|---|---|
| Campaigns | 2 | "2" | ✅ Yes |
| Impressions | 34,800,553 | "34,800,553" | ✅ Yes |
| Clicks | 458,499 | "458,499" | ✅ Yes |
| Cost | 193387.27 | "£193,387.27" | ✅ Yes |
| Conv. Value | 641168.93 | "£641,168.93" | ✅ Yes (hero card) |
| ROAS | 331.55 | "331.55%" | ✅ Yes (hero card) |
| CTR | 1.32 | "1.32%" | ❌ NOT in cards — table only |
| Conversions | 19924.25 | "19,924.25" | ❌ NOT in cards — table only |

### Campaign Table Row Trace — Pmax (20810136438)

| Column | API Value | Expected Display |
|---|---|---|
| Campaign | "Pmax  UK \| Muguntha \| ..." | Text (full name) |
| Budget | 400.0 | "£400.00/day" |
| Impressions | 34,132,589 | "34,132,589" |
| Clicks | 448,334 | "448,334" |
| CTR | 1.31 | "1.31%" |
| Cost | 189,692.99 | "£189,692.99" |
| Conversions | 19,677.76 | "19,677.76" |
| Conv. Value | 631,480.22 | "£631,480.22" |
| ROAS | 332.9 | "332.90%" |

### Campaign Table Row Trace — Shopping Klarna (24199938236)

| Column | API Value | Expected Display |
|---|---|---|
| Budget | 120.0 | "£120.00/day" |
| Impressions | 667,964 | "667,964" |
| Clicks | 10,165 | "10,165" |
| CTR | 1.52 | "1.52%" |
| Cost | 3,694.28 | "£3,694.28" |
| Conversions | 246.49 | "246.49" |
| Conv. Value | 9,688.71 | "£9,688.71" |
| ROAS | 262.26 | "262.26%" |

---

## 5. Date Range Validation (API + Code Trace)

### DateRangeBar Display Logic

```jsx
{dateRange.mode === 'all' ? 'All Time' : `${dateRange.start} to ${dateRange.end}`}
Data available: {dateRange.dataMin} to {dateRange.dataMax}
```

| Range Tested | API dateRange.mode | dateRange.start | dateRange.end | Display Text |
|---|---|---|---|---|
| All Time (default) | all | 2023-11-28 | 2026-10-21 | "All Time \| Data available: 2023-11-28 to 2026-10-21" |
| Oct 1–7 custom | custom | 2026-10-01 | 2026-10-07 | "2026-10-01 to 2026-10-07" |
| Oct 1–21 custom | custom | 2026-10-01 | 2026-10-21 | "2026-10-01 to 2026-10-21" |
| Oct 1–31 custom | custom | 2026-10-01 | **2026-10-21** | "2026-10-01 to 2026-10-21" (clamped ✅) |

**Oct 1–31 clamping:** Backend `_resolve_range()` returns `end=2026-10-21` (data_max). Frontend displays this clamped date correctly. User requesting Oct 1–31 sees "2026-10-01 to 2026-10-21" in the UI — correct behaviour, no misrepresentation.

### Date Input Constraints

`DateRangeBar` applies `min={dateRange?.dataMin}` and `max={dateRange?.dataMax}` to both date inputs.
- Browser enforces: cannot pick before 2023-11-28 or after 2026-10-21
- This partially mitigates BUG-06 (partial date) — user can't pick out-of-range dates

---

## 6. Functional Testing (Code Trace)

### Initial Page Load
- `CampaignsView` renders with `loading=true`, campaign table shows "Loading campaign performance…"
- `useEffect(() => load(), [])` fires immediately on mount
- `apiFetch` attaches `dm_token` from localStorage → API call to `/summary?mode=all`
- On success: `setData(json)` → React re-render with full data
- **Expected state:** KPI cards + campaign table populated ✅

### Apply Button (Date Range)
```jsx
<button onClick={() => onApply(customStart, customEnd)} disabled={loading}>Apply</button>
```
- Both dates set → `load('2026-10-01', '2026-10-07')` → `?mode=custom&start=...&end=...`
- `loading` state disables button during fetch — prevents double-submit ✅

### Reset to All Time Button
- Only visible when `customStart || customEnd` is truthy
- Clears both inputs and calls `onApply('', '')` → back to All Time ✅

### Campaign Search Filter
```js
out = out.filter((r) => r.campaignName.toLowerCase().includes(qq))
```
- Client-side filtering — no API re-call ✅
- Case-insensitive match against campaignName

### Campaign Sort Options
| Sort Value | Logic |
|---|---|
| spend_desc (default) | `b.cost - a.cost` (descending) |
| spend_asc | `a.cost - b.cost` (ascending) |
| roas_desc | `(b.roas ?? -1) - (a.roas ?? -1)` (null ROAS = -1, sorts last) |

### Export CSV
- Headers: `['Campaign', 'Account ID', 'Budget', 'Impressions', 'Clicks', 'CTR %', 'Cost', 'Conversions', 'Conv. Value', 'ROAS %']`
- Exports RAW API values (not formatted strings) — ROAS column will contain "331.55", not "331.55%"
- CSV downloads as `dm-campaign-summary-YYYY-MM-DD.csv`

### Product View Navigation
- Tab button switches `view` state to `'products'` → renders `ProductsView`
- `ProductsView` fires `load()` immediately on mount → `GET /api/admin/dm-campaign/products?mode=all`
- Products view uses **snapshot** data for All Time (6-hour refresh interval)
- Custom range: computed live

### Refresh Button (ProductsView)
```js
await apiFetch(`${API_URL}/api/admin/dm-campaign/products/sync/run-now`, { method: 'POST' })
// Then polls every 2s for up to 300s waiting for syncedAt to change
```
- **BUG-03 confirmed:** 300s (150 × 2s) timeout with no user message if it never updates
- Polling loop uses `break` on `json.syncedAt !== before` — correct early exit
- If refresh hangs, user sees spinner indefinitely until page reload

### Pagination (ProductsView)
- `pageSize` default: 100 rows per page
- Options: 50/100/250/500
- `pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)` — correct ✅

---

## 7. Null and Zero Handling

| Scenario | Code | Expected Output |
|---|---|---|
| ROAS = null | `pct(null)` | "—" |
| ROAS = 0.0 | `pct(0.0)` | "0.00%" |
| ROAS = null in sort | `(b.roas ?? -1) - (a.roas ?? -1)` | null treated as -1 (sorts last) |
| budget = null | `eur(null)` | "—" |
| budget = null display | `r.budget == null ? '—' : eur(r.budget) + '/day'` | "—" (no "/day" suffix) |
| impressions = 0 | `num(0)` | "0" |
| conversionValue = 0 | `eur(0)` | "£0.00" |

---

## 8. Phase 1 Bug Re-Verification (via code + live API)

### BUG-01: ROAS Display Convention
- **Verified:** API returns `roas=331.55`, frontend displays `pct(331.55)` = "331.55%"
- "331.55%" means 3.32× return — mathematically correct as a percentage
- Standard industry display: "3.32×" (multiplicative) is more intuitive
- **Status:** CONFIRMED — Design decision pending. Both interpretations are valid; the label "ROAS" without a unit note is ambiguous.
- **Code:** `{pct(t?.roas)}` in KPI card, `{pct(r.roas)}` in table

### BUG-02: Double Connection (_bounds + _compute)
- **Phase 2 re-assessed:** Sequential, not concurrent connections. `_bounds()` opens Connection 1, closes it, then `_compute_campaign_summary` opens Connection 2.
- Both within business pool max_size=4 — no capacity risk for campaign summary
- **Status:** LOW RISK — not a functional bug. Merge is a code quality improvement only.

### BUG-03: Refresh Timeout Feedback (ProductsView)
- **Verified in code:** `for (let i = 0; i < 150; i++) { await new Promise(r => setTimeout(r, 2000)); ... if (syncedAt changed) break }`
- Maximum wait: 300 seconds
- No timeout message, no `break` on iteration count exhaust
- `refreshing` stays `true` until the loop exits → button spinner runs indefinitely
- **Status:** CONFIRMED BUG — user has no way to know the refresh is stuck.

### BUG-04: Negative days_live
- **Verified in code:** `_flag_for(days_live, imp, clk, cv)` — `days_live >= 0` not guarded
- `days_live = (today - first_seen_date).days` — only possible if system clock is wrong or first_seen is in the future
- Extremely unlikely in production
- **Status:** CONFIRMED EDGE CASE — low risk, one-line fix

### BUG-05: _round2 Epsilon
- **Re-classified in Phase 2:** Intentional banker's rounding workaround
- `round(float(n or 0) + 1e-9, 2)` — forces 0.5 to round up instead of to-even
- **Status:** INTENTIONAL — no fix needed, comment recommended

### BUG-06: Partial Date Input Validation
- **Verified in code:** 
  ```jsx
  <button onClick={() => onApply(customStart, customEnd)} disabled={loading}>Apply</button>
  ```
  No validation: if only start is set, `mode = start && end ? 'custom' : 'all'` → silently falls to All Time
- `min/max` attributes on inputs limit date range (partial mitigation)
- **Status:** CONFIRMED — Confusing UX. Start only → user expects custom range, gets All Time. No error message.

---

## 9. Environment Issues Found

### Issue-1: Frontend port must be 5199 (not 5173 default)
- **Severity:** HIGH — using `npm run dev` without `--port 5199` causes CORS failures
- **Evidence:** `CORS_ORIGIN=http://localhost:5199` in backend `.env`; Vite default is 5173
- **Workaround:** Always start with `npm run dev -- --port 5199`
- **Recommendation:** Add `"dev": "vite --port 5199"` to `package.json` scripts or create `.env.local` with port setting

### Issue-2: Piranav has no access_grants for DmCampaign
- **Severity:** MEDIUM — Piranav cannot open the page in browser
- **Evidence:** `SELECT * FROM access_grants WHERE task_key='tools.DmCampaign'` → only muguntha (id=349)
- **Access:** Only muguntha and dev (Kuberan) can open the DmCampaign page
- **Recommendation:** Add Piranav's access grant via UAM before final delivery

### Issue-3: API_URL fallback port is 8199 (wrong)
- **Severity:** LOW (only triggers if `.env` is missing)
- **Code:** `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8199'`
- Backend runs on 8499, not 8199 — fallback would silently fail all API calls
- **Mitigation:** `.env` is present and correctly sets port 8499

---

## 10. Verification Status Summary

| Verification Method | Items Covered | Status |
|---|---|---|
| Build (npm run build) | All 510 modules incl. DmCampaign | ✅ CLEAN |
| Backend health | Port 8499 | ✅ LIVE |
| Frontend health | Port 5199 | ✅ LIVE |
| CORS preflight | OPTIONS + GET with Origin header | ✅ PASS |
| API calls (muguntha token) | All Time + 4 date ranges | ✅ PASS |
| API auth (piranav token) | 403 expected, 403 received | ✅ PASS |
| KPI formatter trace | All 8 KPIs mathematically traced | ✅ VERIFIED |
| Date clamping | Oct 1–31 → Oct 1–21 | ✅ VERIFIED |
| DateRangeBar display | All Time / custom display text | ✅ VERIFIED |
| Null handling | null/zero for ROAS, budget, etc. | ✅ VERIFIED |
| CSV export headers | Verified in code | ✅ VERIFIED |
| Bug-01 (ROAS display) | 331.55% confirmed | ✅ CONFIRMED |
| Bug-02 (double conn) | Sequential, low risk | ✅ CONFIRMED DOWNGRADED |
| Bug-03 (refresh timeout) | 300s, no user message | ✅ CONFIRMED |
| Bug-04 (negative days) | Edge case in code | ✅ CONFIRMED |
| Bug-05 (epsilon) | Intentional design | ✅ CONFIRMED INTENTIONAL |
| Bug-06 (partial date) | Silently falls to All Time | ✅ CONFIRMED |

---

## 11. Requires Manual Browser Verification by Piranav/Muguntha

The following cannot be verified without a running browser session:

| Item | Reason |
|---|---|
| Actual screenshot of rendered UI | No browser automation available |
| Login flow (token in localStorage) | Requires real user credentials |
| Visual KPI card layout | Requires browser rendering |
| Date picker interaction | Requires browser |
| Sort click behaviour | Requires browser |
| Product view rendering | Snapshot endpoint not tested via browser |
| Product detail modal | Requires browser click |
| Console errors in real session | Requires browser devtools |
| Mobile responsiveness | Requires device/devtools |
| Refresh button in ProductsView | Must not trigger without approval |

**Who can test:** Muguntha (has access_grants) or Piranav after being granted access via UAM.

---

## 12. Phase 5 Implementation Plan

### Recommended Fix Order (lowest risk to highest risk)

| Priority | Bug | File | Change | Risk |
|---|---|---|---|---|
| 1 | BUG-05 | `dm_campaign.py:76` | Add comment explaining banker's rounding | Trivial |
| 2 | BUG-06 | `DmCampaign.jsx:98` | Add validation: disable Apply if only one date set + show hint text | Low |
| 3 | BUG-04 | `dm_campaign.py:_flag_for()` | Add `max(0, days_live)` guard | Low |
| 4 | BUG-03 | `DmCampaign.jsx:404-410` | Add timeout message after 5 failed polls (10s) | Medium |
| 5 | BUG-02 | `dm_campaign.py:86-148` | Merge `_bounds()` into `_compute_campaign_summary` connection block | Medium |
| 6 | BUG-01 | `DmCampaign.jsx` + `dm_campaign.py` | Decision required first: change ROAS storage (÷100) or change display (pct→×) | High |
| ENV | Port | `frontend/package.json` | Add `--port 5199` to dev script | Trivial |
| UAM | Access | Database | Add Piranav's access_grants for tools.DmCampaign | Operational |

### Pre-Phase 5 Checklist
- [ ] Piranav reviews this Phase 4 report
- [ ] GPT approves implementation sequence
- [ ] Muguntha (or dev) confirms browser visual check at http://localhost:5199
- [ ] Decision on BUG-01: × multiplier vs % display convention
- [ ] Piranav access grant added to UAM before delivery
