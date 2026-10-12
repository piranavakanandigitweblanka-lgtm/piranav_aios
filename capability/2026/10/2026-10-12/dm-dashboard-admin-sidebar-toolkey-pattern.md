# Capability: dm-dashboard Admin Sidebar — toolKey UAM Pattern

**Date Confirmed:** 2026-10-12  
**Confirmed By:** Piranav  
**Reusable:** YES — applies to every new Admin page added to dm-dashboard

---

## What It Does

Ensures a new Admin page added to dm-dashboard appears in the sidebar AND is grantable via the UAM matrix.

---

## The Rule

When adding any new Admin page to dm-dashboard, the `ADMIN_ITEMS` entry in `AdminLayout.jsx` **must include a `toolKey`** that matches the `taskRegistry.js` entry.

Without `toolKey`, the `useGrantedTasks` hook cannot link the UAM grant to the sidebar item — the page will be invisible in the sidebar even when correctly granted.

---

## Required Pattern

```js
// AdminLayout.jsx — ADMIN_ITEMS array
{
  label: 'Your Page Name',
  icon: YourIcon,
  panel: 'YourPanel',
  toolKey: 'tools.YourToolKey',   // ← REQUIRED — must match taskRegistry.js
}

// taskRegistry.js
{
  key: 'tools.YourToolKey',
  label: 'Your Page Name',
  category: 'TOOLS',
}
```

---

## Root Cause (2026-10-12 incident)

Remote refactor (192 commits) updated `AdminLayout.jsx` to use `useGrantedTasks` hook. All pre-existing items had `toolKey` added. The Budget Alerts item (added in Step 2) was missing it — sidebar item was hidden despite a correct UAM grant being saved.

**Fix:** Added `toolKey: 'tools.AdminBudgetAlerts'` to line 265 of `AdminLayout.jsx`.

---

## Where It Lives

| File | Location |
|---|---|
| Sidebar nav config | `frontend/src/admin/AdminLayout.jsx` → `ADMIN_ITEMS` array |
| Tool registry | `frontend/src/admin/taskRegistry.js` |

---

## Evidence

- `evidence/dm-dashboard/muguntha-budget-rule-alert-step2-implementation-2026-10-12.md`
- Closure: `MUGA-BRAS-2026-10-12-SIDEBAR`
