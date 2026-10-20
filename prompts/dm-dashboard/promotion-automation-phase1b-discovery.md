---
name: promotion-automation-phase1b-discovery
description: Phase 1B discovery for Promotion Automation — Git sync + full repository structure + UAM inspection. Follows Phase 1 read-only discovery. Safe synchronization only, no implementation.
metadata:
  type: feedback
  category: discovery
  project: dm-dashboard
  date: 2026-10-15
  status: ACTIVE
---

# Prompt: Promotion Automation Phase 1B — Git Sync + Full Repository Discovery + UAM Inspection

**Task Assigned By:** Muguntha  
**Coordinator:** Piranav  
**Project:** DM Dashboard  
**Phase:** 1B — continues from Phase 1 Discovery (2026-10-15)  
**Execution Mode:** SAFE SYNCHRONIZATION + READ-ONLY DISCOVERY

---

## Objective

Before implementing the Promotion Automation page:
1. Verify the local Git repository and branch.
2. Fetch and safely integrate `origin/main` into `piranv-work`.
3. Inspect full DM Dashboard folder structure.
4. Trace frontend routing and navigation.
5. Inspect UAM (User Access Management) from frontend to backend.
6. Identify all reusable components, APIs, DB tables, permissions, and tests.
7. Update the existing AIOS task folder.

---

## Mandatory Discovery Steps

### A. AIOS Discovery First
- Read existing Phase 1 artifacts in `evidence/dm-dashboard/`, `prompts/dm-dashboard/`, `closure/README.md`, `PROMPT_REGISTER.md`
- Do not re-document what Phase 1 already confirmed

### B. Git Pre-flight
- Run: `git rev-parse --show-toplevel`, `git branch --show-current`, `git status --short --branch`, `git log -5 --oneline --decorate`, `git remote -v`
- Run: `git fetch origin`
- Inspect divergence: `git log --oneline HEAD..origin/main`, `git log --oneline origin/main..HEAD`, `git status -sb`
- **SAFETY RULES:** Stop if dirty/wrong branch/wrong remote. Never `git reset --hard`, `git clean`, or force-push.
- If clean + correct branch: `git merge origin/main`
- After merge: verify with `git status -sb`, `git log -5 --oneline --decorate`, `git merge-base --is-ancestor origin/main HEAD`

### C. Full Repository Structure Discovery
- Frontend: entry points, router, sidebar/nav, admin pages dir, existing page patterns, API client, auth context, access guards
- Backend: `main.py`, `core/task_auth.py`, `core/scheduled_snapshot.py`, router files, DB connection files, models/schemas, existing services
- DB: schema definitions, SQL files, migrations, grep for actual table usage (shopify_listings, order_item_info, local_inventory, dm_campaign)
- Tests: patterns, commands

### D. UAM Inspection (Mandatory)
- Read `core/task_auth.py` in full
- Find permission/role definitions — grep "permission", "role", "PERMISSION" across all .py
- Find frontend permission checks — grep in .jsx/.js files
- Read `UserAccessManagement.jsx`
- Determine: where are permissions stored? what roles exist? what are the existing permission key naming conventions?
- Produce: UAM flow, how to add a new permission key, proposed access matrix for Promotion Automation

### E. Policy Document Search
- Glob for `*Nishani*`, `*promotion*policy*`, `*Promotion*` across AIOS root
- If not found: record as BLOCKER D1

### F. Data Feasibility Re-verification
- Re-verify each data source from Phase 1 with exact file + line evidence:
  - `listings.shopify_listings` — confirmed
  - `order_management.orders` + `order_item_info` — confirmed
  - `inventory.products` + location stock — confirmed
  - `dm_campaign.py` — read in full for available fields
  - Landed cost — grep `landed_cost`, `cost_price`, `cogs`, `variable_fee`
  - Reviews/return rate — grep `review`, `return_rate`, `refund_rate`

---

## Required Deliverables (16 items)

1. Repository identity and Git sync status (before/after commits)
2. Full folder structure summary
3. Frontend routing and navigation map
4. Backend/API architecture map
5. Database and integration map
6. UAM authentication and authorization flow
7. Existing roles and permission keys
8. Proposed Promotion Automation access matrix (ACTUAL role names)
9. Reusable files and components (exact paths)
10. Promotion requirements-to-data mapping
11. Verified data availability and remaining gaps
12. Policy conflicts and decisions required
13. Recommended implementation sequence
14. Acceptance criteria and testing strategy
15. Exact evidence paths
16. Outstanding decisions

---

## AIOS Auto-Update Required
- Prompt: `prompts/dm-dashboard/promotion-automation-phase1b-discovery.md`
- Evidence: `evidence/dm-dashboard/promotion-automation-phase1b-discovery-2026-10-15.md`
- Validation: `validation/piranav/promotion-automation-phase1b-validation-2026-10-15.md`
- Handover: `handover/piranav/promotion-automation-phase1b-handover-2026-10-15.md`
- Update: `PROMPT_REGISTER.md`, `closure/README.md`, `source-map/README.md`

---

## Stop Condition

Do NOT implement. Do NOT create/alter schemas, migrations, user permissions, or production workflows. Do NOT deploy, commit, or push. Finish Git + discovery, update AIOS, wait for Piranav review.
