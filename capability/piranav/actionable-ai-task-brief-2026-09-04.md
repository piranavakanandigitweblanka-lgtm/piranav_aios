---
name: actionable-ai-task-brief-2026-09-04
description: AI Daily Brief captures full multi-line task blocks (title + action steps) in staff_task_log and displays them with proper formatting in MyTaskLog. All 11 staff covered.
metadata:
  type: capability
  owner: piranav
  date: 2026-09-04
---

# Capability — Actionable AI Task Brief (Item-Level Detail in Task Log)

## Purpose

Convert existing staff requirement data into actionable, prioritized staff tasks where the task stored in `staff_task_log` contains:
1. The exact affected item (page URL, product title, SKU, campaign name, search term)
2. The metric/value causing the issue
3. Concrete action steps (→ bullet points)

## Application

DM Dashboard — Staff Dashboard (dm-dashboard), all 11 staff members.

## Data Sources (verified from code)

| Staff | Data injected into AI prompt |
|---|---|
| Kamsi | Exact page URLs + CTR + impressions (GSC), exact product titles + missing meta status (Shopify) |
| Jefri | Campaign names + ROAS, exact product titles (wasteful: 0 conv, spend >€5), OOS products still spending, wasteful search terms |
| Sajeepan | Campaign ROAS + waste spend data (business DB) |
| Sonya | Campaign ROAS, waste campaigns (0 conv, cost > threshold), 0-conv product list |
| Thasitha | Business DB campaign + product data |
| Mahima | Business DB campaign + product data |
| Theekshy | Business DB campaign + product data |
| Hetheesha | Shopify background snapshot data |
| Thivajini | Background snapshot data |
| Sukirtha | Background snapshot data |
| Dilaksi | Shopify Admin GraphQL data |

## Architecture (existing — not changed)

```
{staff}_ai.py
  └── _gather_data()       — item-level data from requirement pages
  └── _build_system_prompt() — injects exact items into AI prompt
  └── POST /api/{staff}/ai/brief  — AI returns numbered task list with exact items
  └── POST /api/{staff}/ai/chat   — follow-up on selected task
  └── GET  /api/{staff}/ai/history — today's chat (for daily reset logic)

DailyBriefWidget.jsx
  └── Calls /brief on first open each day
  └── parseTasks() — extracts task blocks from AI text
  └── Quick-select buttons → logs to staff_task_log via /api/task-log/{staff}/select
  └── Done/Skip → /api/task-log/{staff}/update

MyTaskLog.jsx
  └── Reads staff_task_log for today + history
  └── TaskCard renders task_text

staff_task_log (PostgreSQL table)
  └── staff, session_date, task_number, task_text, priority, status,
      completion_note, verification_status, change_count, muguntha_note
```

## What Changed (2026-09-04)

### Problem before fix

`parseTasks()` in `DailyBriefWidget.jsx` used a single-line regex that captured only the task TITLE line:

```
🔴 1. Fix low-CTR page: /collections/led-strips (CTR: 1.4%)    ← captured
   → Rewrite meta title to match high-volume keyword            ← DROPPED
   → Target: "LED Strip Lights | Buy Flexible LED Strips UK"   ← DROPPED
```

The `→` action steps were lost. `task_text` in the DB was only the title line. `TaskCard` in MyTaskLog showed only the title.

### Fix applied — 2 files only

**File 1: `frontend/src/components/DailyBriefWidget.jsx`**

`parseTasks()` now captures the full multi-line task block from each emoji header to the next:
- `task.title` — title line only (used for compact quick-select button display)
- `task.text` — full block including `→` action steps (sent to `staff_task_log` as `task_text`)

Quick-select button now displays `t.title` (short) instead of `t.text` (was the full block).

**File 2: `frontend/src/components/MyTaskLog.jsx`**

`TaskCard` now renders `task.task_text` with `whiteSpace: 'pre-wrap'` so line breaks and `→` bullets display correctly.

### No backend changes

All 11 `{staff}_ai.py` files already gather item-level data and inject exact items into AI prompts. No changes were needed to:
- `task_log.py` — task_text TEXT column accepts multi-line strings natively
- Any `_ai.py` file — prompts already correct
- `main.py` — no new routes
- Database schema — no ALTER TABLE needed

## Known Thresholds (confirmed from code)

| Staff | Threshold | Source |
|---|---|---|
| Kamsi | CTR < 2% | `kamsi.py:CTR_THRESHOLD = 0.02` |
| Jefri | Waste product: 0 conversions AND cost > €5 | `jefri_ai.py` SQL |
| Jefri | Wasteful search term: 0 conversions AND cost > €2 | `jefri_ai.py` SQL |
| Sonya | Waste campaign: cost > 5 AND conversions == 0 | `sonya_ai.py` |
| Others | Threshold: Not currently available as hard-coded values | Uses AI judgment |

## Item-Level Data Availability

| Staff | Exact items available to AI |
|---|---|
| Kamsi | YES — exact page URLs (GSC), exact product titles (Shopify) |
| Jefri | YES — exact product titles, campaign names, search terms |
| Sonya | PARTIAL — campaign names, product names (top N only) |
| Sajeepan | PARTIAL — campaign summaries + business DB data |
| Thasitha | PARTIAL — business DB, needs confirmation on item depth |
| Mahima | PARTIAL — business DB, needs confirmation on item depth |
| Theekshy | PARTIAL — business DB, needs confirmation on item depth |
| Hetheesha | PARTIAL — background snapshot, item depth needs confirmation |
| Thivajini | PARTIAL — background snapshot, item depth needs confirmation |
| Sukirtha | PARTIAL — background snapshot, item depth needs confirmation |
| Dilaksi | PARTIAL — Shopify GraphQL, item depth needs confirmation |

## Regression Risk

Low. Changes are frontend-only and additive:
- Existing tasks in staff_task_log (with title-only text) still render correctly — `pre-wrap` on a single line is identical to the previous rendering
- The DailyBriefWidget chat display is unchanged
- The task selection, completion, verification, and Muguntha review workflows are unchanged
- All requirement pages are unchanged
- All backend APIs are unchanged
