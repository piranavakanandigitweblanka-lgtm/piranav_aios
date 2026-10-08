# Capability — Staff ID Performance Dashboard + Recovery Incident
**Date:** 2026-08-10 to 2026-08-14 | **Capability doc written:** 2026-09-03 | **Status:** ACTIVE

---

## Requirement ID
PIRANAV-SR01-STAFFIDPERF-2026-08-14

## What This Capability Does
A 5-tab SPA in Staff-requirements (SR-01) that allows Kamsi, Dilaksi, Jackson, Sajeepan, and Sonya to view sales and stock performance for their assigned product IDs. Each tab is scoped to that staff member's specific product ID set.

## Asset Paths (SR-01 repo)
- `Staff-requirements/pages/staff-id-performance.html` — 5-tab SPA
- `Staff-requirements/api/staff-id-performance.js` — backend API
- `Staff-requirements/scripts/check-live-deploy.js` — deployment canary (built after the recovery incident)

## Git Repo
SR-01: https://github.com/digitalmarketing69140951-sys/Staff-requirements

---

## Tab Structure

| Tab | Member | Product IDs |
|---|---|---|
| 1 | Kamsi | Initial set (varies) |
| 2 | Dilaksi | Initial set (varies) |
| 3 | Jackson | 50 IDs |
| 4 | Sajeepan | 1,337 IDs |
| 5 | Sonya | 1,750 IDs |

---

## CRITICAL INCIDENT — Work Lost from Production (2026-08-10 to 2026-08-14)

### What happened
After tabs 3–5 (Jackson, Sajeepan, Sonya) were built and deployed live, a subsequent `vercel --prod` was run from a stale local copy. Vercel re-aliased production to the stale deployment, silently overwriting the live 5-tab version with the old 2-tab version. No error was produced.

### How it was recovered
The correct 5-tab version was recovered from Vercel deployment snapshot `dgfzu7kw3`. Code was extracted and committed as `61e2beb`.

### Root cause
Work was deployed live without being committed to git first. A later `vercel --prod` from a stale local copy re-aliased production without warning.

### Permanent fix
`Staff-requirements/scripts/check-live-deploy.js` — verifies whether the live production deployment matches the latest git-tracked deploy. Run before any `vercel --prod`. Documented in commit `a97ea42`.

### Prevention rule
**COMMIT ALL CHANGES TO GIT BEFORE RUNNING `vercel --prod`.** This is now Rule 2 in `CLAUDE.md`.

---

## Key Commits (SR-01 repo)

| Commit | What |
|---|---|
| `9ebde22` | Initial build — Kamsi + Dilaksi tabs |
| `5278ab2` | Fix stock source |
| `bfb7b5a` | Jackson tab (50 IDs) |
| `cf9cbdc` | Orders column + modal |
| `bfd66c3` | Modal fix |
| `daf848d` | Return Shopify order names |
| `5b15742` | Sajeepan tab (1,337 IDs) |
| `ca5e02d` | Sonya tab (1,750 IDs) |
| `61e2beb` | RECOVERY — restored 5-tab from Vercel snapshot `dgfzu7kw3` |
| `a97ea42` | check-live-deploy.js canary + incident documentation |
| `1258fd9` | Merge conflict resolved — Piranav's version over Kuberan's snapshot |

---

## How to Add a New Member Tab
1. Add product IDs array in `staff-id-performance.js` for the new member
2. Add a new tab button and panel in `staff-id-performance.html`
3. Wire up the tab JS to call `/api/staff-id-performance?member=<name>`
4. **Commit to git before deploying** — lesson from the recovery incident

---

## Related Files
- Closure: `closure/piranav/staff-id-performance-2026-08-14.md`
- SR-01 overview: `docs/dashboards/architecture/sr01-workstream-overview.md`
