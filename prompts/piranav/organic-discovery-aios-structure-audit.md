# Prompt: Organic Discovery AIOS Structure Audit

**Category:** documentation  
**Created:** 2026-10-06  
**Status:** ACTIVE

---

## When to Use

Use this prompt before starting any new Organic Discovery task when the AIOS structure needs to be audited, reconciled, or built from scratch for the `organic-discovery/` folder.

---

## Prompt

```
You are working on the piranav AIOS at: C:\Users\PC\Documents\piranav_aios

Objective: Audit the organic-discovery folder and ensure the AIOS documentation is fully up to date before starting any new Organic Discovery task.

Step 1 — Read the existing organic-discovery folder completely:
- organic-discovery/README.md
- organic-discovery/00_master/ (all files)
- All task folders and task.md files
- Related evidence, prompts, and validation files

Step 2 — Reconcile against the current known task list. For each task provided:
- Confirm whether a task folder exists
- Confirm whether a task.md exists
- Confirm whether the status is accurate
- Confirm whether evidence exists or is missing
- Do NOT mark tasks Complete unless real evidence confirms it

Step 3 — Check for missing folders. Create only what is genuinely missing. Reuse existing architecture.

Step 4 — Search the full AIOS for duplicates before creating anything. If an existing document covers a task, update it instead.

Step 5 — Update:
- Task register (Organic_Discovery_Task_Register.md)
- Current_Status.md
- Change_Log.md
- Individual task.md files
- closure/README.md
- PROMPT_REGISTER.md

Step 6 — Do not invent evidence. If evidence is missing, record: "Evidence Missing — Verification Required"

Step 7 — Provide a final audit report with:
1. Existing structure found
2. Missing items added
3. Updated files
4. Status reconciliation table (CC-01, CC-02, GA-xx tasks)
5. Explicit statement on any sensitive pending tasks (e.g. GA-09)
6. AIOS health check summary
```

---

## Key Constraints

- Never mark tasks Complete without actual evidence.
- Never start implementing a pending task during an audit session.
- Always reuse existing folder structure and naming conventions.
- PROMPT_REGISTER.md must be updated before ending the session.
- closure/README.md must have an entry before ending the session.
