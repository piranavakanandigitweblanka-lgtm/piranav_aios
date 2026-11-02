---
name: dm-campaign-phase4-browser-test-handover-2026-11-02
description: Handover note for Phase 4 browser visual testing of DM Campaign Overall Performance. Muguntha or Piranav (after UAM grant) must complete this before Phase 5 implementation.
metadata:
  type: handover
---

# Handover: DM Campaign Phase 4 — Browser Visual Test

**Date:** 2026-11-02
**From:** Claude Code (Phase 4 audit)
**To:** Muguntha (primary) or Piranav after UAM grant
**Context:** Phase 4 code + API validation is PASS. Browser visual confirmation is BLOCKED — requires a real login session.

---

## What Needs to Be Done

Open the DM Campaign Overall Performance page in a real browser, check visual rendering, and confirm the following before approving Phase 5.

---

## Setup Steps (one-time)

### 1. Start backend (if not already running)

```
cd C:\Users\PC\Documents\piranav_aios\dm-dashboard\backend
venv\Scripts\python.exe -m uvicorn app.main:app --port 8499
```

Verify: `curl http://localhost:8499/api/health` → `{"status":"ok"}`

### 2. Start frontend on correct port (IMPORTANT: must be port 5199)

```
cd C:\Users\PC\Documents\piranav_aios\dm-dashboard\frontend
npm run dev -- --port 5199
```

URL: http://localhost:5199

### 3. Log in as Muguntha (or Piranav after UAM grant)

Use your real login credentials at http://localhost:5199.

If credentials are unavailable, a temporary 8-hour test token can be injected via browser console:

```js
localStorage.setItem('dm_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtdWd1bnRoYSIsInJvbGUiOiJhZG1pbiIsInN0YWZmX2tleSI6Im11Z3VudGhhIiwiZXhwIjoxNzkzNjM1NTc3fQ.N6k_DkEqI4et0L4Eoansg9u1jTtPH2pcIK-H1OmkVTI')
location.reload()
```

Then navigate to: Admin → DM Campaign → Overall Performance

---

## What to Verify

### KPI Cards (All Time expected values)

| KPI Card | Expected Value |
|---|---|
| Campaigns | 2 |
| Impressions | 34,800,553 |
| Clicks | 458,499 |
| Cost | £193,387.27 |
| Conv. Value | £641,168.93 |
| ROAS | 331.55% |

### Campaign Table (All Time, Sorted by Spend High→Low)

| Campaign | Budget | Cost | ROAS |
|---|---|---|---|
| Pmax UK \| Muguntha \| ... | £400.00/day | £189,692.99 | 332.90% |
| Shopping UK \| Muguntha \| Klarna \| ... | £120.00/day | £3,694.28 | 262.26% |

### Date Range Bar

- "Showing: All Time · Data available: 2023-11-28 to 2026-10-21"
- Set Start: 2026-10-01, End: 2026-10-07 → click Apply
- Expected: imp=483,511, cost=£2,993.08, roas=297.02%
- Set Start: 2026-10-01, End: 2026-10-31 → click Apply
- Expected: end clamps to 2026-10-21, same values as Oct 1–21

### Bugs to Observe

| Bug | What to Look For |
|---|---|
| BUG-01 (ROAS) | ROAS shows "331.55%" — note if this is confusing vs "3.32×" |
| BUG-03 (refresh) | In Products view, click Refresh. If it takes >10s, note that there is no timeout message |
| BUG-06 (partial date) | Set Start only, click Apply. Confirm page falls to All Time (no error message) |

### Console Errors

Open browser DevTools (F12 → Console). Report any red errors.

---

## Current Access Status

| User | Can Open Page |
|---|---|
| muguntha | ✅ Yes |
| dev (Kuberan) | ✅ Yes |
| piranav | ❌ No (needs UAM grant for tools.DmCampaign) |

To add Piranav's access: UAM page → tools.DmCampaign → grant to piranav.

---

## Next Step After Browser Test

Return findings to Piranav/Claude Code to complete Phase 4 closure and begin Phase 5 implementation:
- Evidence: `evidence/piranav/dm-campaign-phase4-frontend-validation-2026-11-02.md`
- Validation: `validation/piranav/dm-campaign-phase4-frontend-validation-2026-11-02.md`
- Phase 5 plan: Section 12 of evidence file above
