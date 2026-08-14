# Closure — API Consolidation (11→3 Functions) (Recovery Entry)
**Date:** 2026-08-10 | **Recovery closure written:** 2026-08-14 | **Status:** PARTIAL — GPT REVIEW EVIDENCE MISSING

---

## Requirement ID
PIRANAV-API-CONSOLIDATION-2026-08-10

## Task
Consolidate 11 individual member serverless functions into a single `members-api.js` to stay within Vercel Hobby plan's 12-function limit. Also merge `seo.js` and `organic-revenue.js` into `intel-api.js`. Final state: 3 functions (auth.js + intel-api.js + members-api.js).

## Asset Paths
**Created:**
- `Staff-requirements-02/api/members-api.js` — 2,354 lines merging all 6 member APIs
- `Staff-requirements-02/api/intel-api.js` — renamed/expanded from `seo.js`, absorbing `organic-revenue.js` and Germany APIs

**Deleted (11 files):**
- `api/hetheesha/req1.js`, `api/hetheesha/req2.js`
- `api/jackshan/dashboard.js`
- `api/sajeepan/dashboard.js`
- `api/sonya/daily-orders.js`, `api/sonya/dashboard.js`
- `api/theekshy/dashboard.js`
- `api/thivajini/dashboard.js`
- `api/germany/marketplace-gap.js`, `api/germany/uk-bundle-opportunity.js`
- `api/organic-revenue.js`

**Updated (6 HTML pages):**
- All 6 member pages updated to `?member=X&type=Y` routing pattern

**Updated (9 doc files):**
- `Staff-requirements-02/docs/api-report.md` — fully rewritten for 3-API architecture
- `Staff-requirements-02/docs/dashboard-*.md` — all 7 updated to new API paths

## Evidence Path
- Git commit: `d12c3ee` — API consolidation
- Git commit: `7945500` — docs updated for 3-API architecture
- SR-02 docs: `Staff-requirements-02/docs/api-report.md` — CURRENT (updated 2026-08-10)
- No main AIOS capability file — CREATE REQUIRED: `capability/piranav/api-consolidation-2026-08-10.md`
- No GPT review evidence — GPT REVIEW EVIDENCE MISSING

## GitHub Path / Commit
Repo: https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios
Consolidation: https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios/commit/d12c3ee
Docs update: https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios/commit/7945500

## Vercel Function Count (Post-Consolidation)
| Function | Route | Purpose |
|---|---|---|
| `api/auth.js` | `/api/auth` | Login for all pages |
| `api/intel-api.js` | `/api/intel-api?service=` | SEO + Germany + Organic |
| `api/members-api.js` | `/api/members-api?member=` | All 6 member dashboards |

**Total: 3 of 12 Vercel Hobby plan functions used.**

## Routing Pattern (members-api.js)
```
?member=hetheesha  → &type=req1 | req1&type=ba | req2
?member=jakshan    → &type=req1 | req2
?member=sajeepan   → (default req1) | &type=req2 | &type=req3
?member=sonya      → &type=req1 | req2 | req3 | req4 | req5 | req6
?member=theekshy   → &type=req1 | req2 | req3 | req4
?member=thivajini  → &type=req1 | req2 | req3 | req4 | req5
```

## Stale AIOS Asset (RED DUPLICATE RISK)
`docs/dashboards/staff-workflows/sajeepan-live-dashboard.md` still references the old API path `api/sajeepan/dashboard.js` — this file was deleted in commit d12c3ee. The doc must be updated.

## Status
PARTIAL

### Why PARTIAL
- Code and SR-02 docs are current and verified
- Main AIOS has no capability file explaining the 3-function architecture or the Vercel limit constraint
- The stale sajeepan workflow doc creates conflicting truth (RED duplicate risk)
- No GPT review evidence

## Queryability
FAIL at main AIOS level — SR-02 docs are queryable, main AIOS is not.
Specific gap: No document at main AIOS level explains why 3 functions, what the Vercel limit is, or how to add a new member safely.

## Unknown Developer Test
FAIL — Cannot safely add a new member dashboard without knowing:
- Vercel Hobby plan function limit is 12
- The `?member=` routing pattern
- That adding a new API file would exceed the limit

## GPT Review Evidence
MISSING

## Blockers
- No main AIOS capability file
- Stale `docs/dashboards/staff-workflows/sajeepan-live-dashboard.md` — references deleted file

## Next Step
1. CREATE: `capability/piranav/api-consolidation-2026-08-10.md`
2. UPDATE: `docs/dashboards/staff-workflows/sajeepan-live-dashboard.md` — correct API path
3. GPT to review → PASS or FAIL

## Result
PARTIAL
