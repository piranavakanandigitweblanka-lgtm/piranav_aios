# Prompt: Promotion Automation — Phase 1 Discovery

**Category:** discovery  
**Pattern Name:** `promotion-automation-phase1-discovery`  
**Date Created:** 2026-10-15  
**Status:** ACTIVE

---

## Purpose

Read-only discovery to plan a Promotion Automation page inside the DM Dashboard. Verifies existing data sources, architecture patterns, and policy requirements before any implementation begins.

---

## Reusable Prompt

```
Perform READ-ONLY Phase 1 discovery for a new Promotion Automation feature inside the DM Dashboard.

Context:
- DM Dashboard: FastAPI (Python) backend + React 19 / Vite frontend
- Backend DB: two Postgres pools — app DB (public schema) and business DB (listings.*, inventory.*, order_management.*, sales_cache.*)
- Auth: make_task_auth("tools.<ToolKey>") pattern from core/task_auth.py
- ScheduledSnapshot pattern for compute-once, serve-instantly pages
- UAM: toolKey grants in UserAccessManagement.jsx

Discovery targets:
1. Inspect existing AIOS assets: closure, prompts, capability, evidence folders
2. Map DM Dashboard repo: branch, git status, backend modules, frontend pages, DB schemas
3. Read policy document: [policy doc path or name]
4. Extract: qualification scoring sections, hard rejection rules, promotion intents, financial guardrails, platform eligibility, exclusions, discount ranges, kill conditions
5. Build data availability table: Required data | Existing source | Verified? | Gap
6. Identify n8n integration status
7. Produce 10-deliverable report (see task brief)
8. Save all AIOS assets: evidence, validation, prompt, closure, PROMPT_REGISTER

Safety rules:
- READ-ONLY — no file edits, no schema changes, no git commits
- Do not expose secrets
- Mark each finding as: VERIFIED FACT / ASSUMPTION / BLOCKER / RECOMMENDATION
```

---

## Files Produced

| Asset | Path |
|---|---|
| Evidence | `evidence/dm-dashboard/promotion-automation-phase1-discovery-2026-10-15.md` |
| Validation | `validation/piranav/promotion-automation-phase1-validation-2026-10-15.md` |
| Prompt | this file |

---

## Key Findings (2026-10-15 run)

- Policy doc `Nishani_Promotion_Multi_Channel.docx` **NOT FOUND** in AIOS root — BLOCKER
- DM Dashboard branch: `piranv-work`, working tree clean
- n8n: previously removed — only a comment remains in main.py
- Business DB schemas confirmed: `listings.*`, `inventory.*`, `order_management.*`
- No landed cost, variable fee, review rate, or return rate data found in business DB
- No existing promotion tables found
