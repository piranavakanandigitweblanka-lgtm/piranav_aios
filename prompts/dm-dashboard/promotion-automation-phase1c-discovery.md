---
name: promotion-automation-phase1c-discovery
description: Phase 1C — Verified dashboard_pages location, page registration mechanism, UAM flow, and exact implementation file list for Promotion Automation page in DM Dashboard
metadata:
  type: reusable
  category: discovery
  date: 2026-10-15
  status: ACTIVE
  project: dm-dashboard
  linked_phases: [phase1a, phase1b]
---

# Prompt: Promotion Automation Phase 1C — Dashboard Page Location and UAM Registration Discovery

## Context
- DM Dashboard: `C:\Users\PC\Documents\piranav_aios\dm-dashboard`
- Branch: `piranv-work`
- Purpose: Determine the exact location and registration pattern for a new Promotion Automation admin page

## Directive
Before implementing the Promotion Automation page, verify:
1. The exact `dashboard_pages/` directory and all files inside it
2. The page-registration mechanism (imports + `app.include_router()` in `main.py`)
3. The frontend routing: `ADMIN_ITEMS`, `TOOLS` array in `taskRegistry.js`, `filterAdminItems()` in `AdminLayout.jsx`
4. UAM end-to-end: `make_task_auth` vs `make_admin_task_auth`, `access_grants` table, `useGrantedTasks` hook
5. The correct permission key convention (verified from existing keys, not assumed)
6. Two worked page examples (dm_campaign.py + a simpler page)
7. Exact proposed file paths for backend module, frontend component, TOOLS entry, nav item

## Safety
READ-ONLY. Do not create files, modify schemas, commit, or deploy.

## Evidence Required
Exact file paths + line numbers for every finding. Never mark a source verified without code evidence.
