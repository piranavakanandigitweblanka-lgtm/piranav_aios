# Capability — API Consolidation: 11 Functions → 3 (Vercel Hobby Limit)
**Date:** 2026-08-10 | **Capability doc written:** 2026-09-03 | **Status:** ACTIVE

---

## Requirement ID
PIRANAV-API-CONSOLIDATION-2026-08-10

## What This Capability Does
Consolidates 11 individual serverless functions into 3 to stay within Vercel Hobby plan's 12-function limit. All member dashboards now route through a single `members-api.js`. SEO, Germany, and Organic Revenue route through `intel-api.js`.

## Asset Paths
- `Staff-requirements-02/api/members-api.js` — 2,354 lines, handles all 6 member dashboards
- `Staff-requirements-02/api/intel-api.js` — handles SEO + Germany + Organic Revenue
- `Staff-requirements-02/api/auth.js` — handles all authentication

## Git Commits
- `d12c3ee` — API consolidation (11 files deleted, 2 new files created)
- `7945500` — all SR-02 docs updated for 3-API architecture

---

## Why This Was Done
Vercel Hobby plan allows a maximum of 12 serverless functions per project. Before consolidation the project had grown to 14+ individual API files, causing deployment failures. The consolidation reduced to 3 functions, leaving 9 slots for future growth.

---

## Final 3-Function Architecture

| Function File | Route | Purpose |
|---|---|---|
| `api/auth.js` | `/api/auth` | Login for all pages |
| `api/intel-api.js` | `/api/intel-api?service=` | SEO + Germany + Organic Revenue |
| `api/members-api.js` | `/api/members-api?member=` | All 6 member dashboards |

**Total: 3 of 12 Vercel Hobby plan functions used.**

---

## members-api.js Routing Pattern

```
/api/members-api?member=hetheesha              → req1 (default)
/api/members-api?member=hetheesha&type=ba      → bundle analysis
/api/members-api?member=hetheesha&type=req2    → req2
/api/members-api?member=jakshan                → req1 (default)
/api/members-api?member=jakshan&type=req2      → req2
/api/members-api?member=sajeepan               → req1 (default)
/api/members-api?member=sajeepan&type=req2     → req2
/api/members-api?member=sajeepan&type=req3     → req3 (Revenue Protection)
/api/members-api?member=sonya&type=req1        → req1
... &type=req2 | req3 | req4 | req5 | req6
/api/members-api?member=theekshy&type=req1     → req1
... &type=req2 | req3 | req4
/api/members-api?member=thivajini&type=req1    → req1
... &type=req2 | req3 | req4 | req5
```

---

## Files Deleted in Consolidation

| Deleted File | Absorbed Into |
|---|---|
| `api/hetheesha/req1.js` | `members-api.js` |
| `api/hetheesha/req2.js` | `members-api.js` |
| `api/jackshan/dashboard.js` | `members-api.js` |
| `api/sajeepan/dashboard.js` | `members-api.js` |
| `api/sonya/daily-orders.js` | `members-api.js` |
| `api/sonya/dashboard.js` | `members-api.js` |
| `api/theekshy/dashboard.js` | `members-api.js` |
| `api/thivajini/dashboard.js` | `members-api.js` |
| `api/germany/marketplace-gap.js` | `intel-api.js` |
| `api/germany/uk-bundle-opportunity.js` | `intel-api.js` |
| `api/organic-revenue.js` | `intel-api.js` |

---

## How to Add a New Member Dashboard Safely
1. Check current function count: should be 3. Do NOT exceed 12.
2. Add the new member's handler inside `members-api.js` — do NOT create a new API file.
3. Route: `?member=<name>&type=<req>` pattern — follow existing handlers.
4. Update the HTML page to call `/api/members-api?member=<name>&type=<req>`.

---

## Known Stale Doc (RED DUPLICATE RISK)
`docs/dashboards/staff-workflows/sajeepan-live-dashboard.md` still references the deleted path `api/sajeepan/dashboard.js`. The correct path is `api/members-api?member=sajeepan`. This doc must be updated.

---

## Related Files
- Closure: `closure/piranav/api-consolidation-2026-08-10.md`
- SR-02 API doc: `Staff-requirements-02/docs/api-report.md` (current — updated 2026-08-10)
- Stale doc to fix: `docs/dashboards/staff-workflows/sajeepan-live-dashboard.md`
