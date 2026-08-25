# Evidence — Muguntha AI Assistant

**Date:** 2026-08-25
**Requirement:** Build AI assistant for Muguntha (full admin, team manager)

---

## Bugs Fixed During Build

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Widget not opening | `onclick` + `addEventListener` both bound — double-click, panel open then immediately closed | Removed `onclick` attribute, kept `addEventListener` only |
| AI not responding (initial) | Debug error catch block showing network errors | Fixed handler SQL, reverted catch to fun message |
| EOD "I don't have yesterday's data" | Only fetched today's EOD — no historical data | Extended to 7-day range (98 parallel GitHub calls) |
| Multi-browser: question shows, no response | `prefetchHistory` + AI brief ran in parallel — brief `.finally` reset `isLoading=false` mid-send | Rewrote `aiLoadBrief` as async/await, history-first sequential |

---

## Data Source Verification

| Source | Confirmed By |
|--------|-------------|
| `sub_source_id = 233` = LEDSone UK | Grep of members-api.js — consistent with Thivajini/Sajeepan revenue queries |
| `sub_source_id = 108` = ledsone.de | `SUKIRTHA_DE_SUB = 108` constant in members-api.js:3245 |
| `account_id = 9031058245` = ledsone.de Google Ads | Found in members-api.js:3394 |
| `account_id = 4503486236` = LEDSone UK | `MG_LEDSONE_ACCOUNT_ID` constant already in muguntha.js |
| `public.jefri_req6_tracker` | Confirmed in requirement.js:6146 CREATE TABLE |
| Staff product IDs | `data/staff-ids.js` — keys: kamsi, dilaksi, sajeepan, jackson, sonya, mahima |
| EOD GitHub path | `eods/{Name}/{YYYY-MM-DD}.md` in `digitalmarketing69140951-sys/eod-reports` |

---

## System Prompt Data Block (live example shape)

```
EOD SUBMISSIONS — LAST 7 DAYS (newest first):
TODAY (2026-08-25): ✓ 2/14 submitted [Hetheesha, Sukirtha] | ✗ Missing: Kuberan, Piranav, ...
YESTERDAY (2026-08-24): ✓ 11/14 submitted [...] | ✗ Missing: Kamsi, Dilaksi, Jakshan
2026-08-23: ✓ 14/14 submitted [...] | ✗ Missing: None
...

REQUIREMENT PROGRESS:
Hetheesha Req1: 45/200 fixed (22%) — 155 remaining
Hetheesha Req2: 12/80 fixed (15%) — 68 remaining
Sajeepan Req4: 22/50 started, 8 sales received
Jefri Req6: 30/120 updated (25%) — 90 remaining

BUSINESS INTELLIGENCE:
UK Revenue — Today: £1,240 (18 orders) ▼8% vs 30d avg | Yesterday: £2,100...
DE Revenue — Today: €890 (12 orders) | ...
2026 New Listings: 340 listed (310 active)

STAFF ID PERFORMANCE — LAST 30 DAYS:
Kamsi: £4,200 rev | 89 orders | 180/620 products sold | 440 dead stock
...
```
