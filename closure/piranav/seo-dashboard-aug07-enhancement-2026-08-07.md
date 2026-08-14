# Closure — SEO Dashboard Aug 7 Enhancement (Recovery Entry)
**Date:** 2026-08-07 | **Recovery closure written:** 2026-08-14 | **Status:** PARTIAL — existing capability file outdated

---

## Requirement ID
PIRANAV-SEO-AUG07-2026-08-07

## Task
Add reactive week selector and full 26-week data history table to the SEO Intelligence Dashboard. Allows management to select any two weeks for comparison rather than being locked to the latest two.

## Asset Path
- `Staff-requirements-02/pages/seo.html` — +213 lines, -108 lines (major enhancement)

## Evidence Path
- Git commit: `6e94b70`
- Existing (outdated) capability: `capability/piranav/seo-dashboard-2026-08-03.md` — does NOT include Aug 7 features
- Existing closure: `closure/piranav/seo-dashboard-closure-2026-08-03.md` — does NOT include Aug 7 features
- No GPT review evidence for Aug 7 session — GPT REVIEW EVIDENCE MISSING

## GitHub Path / Commit
Repo: https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios
Commit: https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios/commit/6e94b70

## Features Added (Aug 7)
1. **`window._renderWeekly(ci, pi)` function** — replaces static curW/prevW render with parameterised renderer
2. **Two `<select>` dropdowns** — Current Week / Compare Week, populated from all 26 available weeks
3. **Instant re-render on dropdown change** — no additional API call needed; data pre-loaded
4. **All Weeks — Full Data History table** — collapsible, shows all 26 weeks newest-first
5. **Highlighted selected weeks** — CURRENT badge (blue) and COMPARE badge (grey) in history table
6. **Partial week warning** — follows whichever week is selected as "current"
7. **Executive Insights + WoW Alerts** — remain pinned to latest two weeks (correct behaviour)

## Relationship to Existing Capability
The existing `capability/piranav/seo-dashboard-2026-08-03.md` covers the Aug 3 baseline. The Aug 7 enhancements are NOT documented there. The capability file must be EXTENDED, not replaced.

## Status
PARTIAL

### Why PARTIAL
- Code committed and live (verified by commit 6e94b70)
- Existing closure (seo-dashboard-closure-2026-08-03.md) does not cover Aug 7 features
- Existing capability (seo-dashboard-2026-08-03.md) does not cover Aug 7 features
- No GPT review evidence for Aug 7 session

## Queryability
PARTIAL — existing docs cover Aug 3 baseline; Aug 7 features cannot be queried from existing AIOS assets.

## Unknown Developer Test
PARTIAL — can understand the Aug 3 baseline; cannot understand the reactive week selector without reading the git diff.

## GPT Review Evidence
MISSING

## Blockers
- Existing capability file not extended for Aug 7 features

## Next Step
1. EXTEND: `capability/piranav/seo-dashboard-2026-08-03.md` — add Aug 7 section
2. EXTEND: `closure/piranav/seo-dashboard-closure-2026-08-03.md` — add Aug 7 deliverable entry
3. GPT to review → PASS or FAIL

## Result
PARTIAL
