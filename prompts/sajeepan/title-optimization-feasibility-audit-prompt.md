# Prompt: Sajeepan Title Optimization — Feasibility Audit

**Registered:** 2026-09-16 (retrospective)
**Status:** ACTIVE
**Category:** discovery
**Used in:** dm-dashboard · sajeepan_lens_* backend files audit

---

## What This Solves

Before building Step 9 (UK Search Validation) of the title optimization pipeline, a full audit was needed to understand what already exists vs what needs to be built.

---

## Prompt Pattern

```
Run a READ-ONLY feasibility audit of the [staff] title optimization system.

Discover:
1. All backend files matching [staff]_lens_* pattern
2. All frontend files in src/[staff]/
3. All DB tables used (grep for table names)
4. Shopify integration points (read/write scope)
5. AI components (prompts, models used)
6. AIOS assets (prompts/, evidence/, capability/ folders)
7. Which steps of the manual process are already built
8. Which steps are missing or incomplete
9. Any PROMPT_REGISTER violations (Rule 1)

Output: 16-section report with PASS/FAIL per step, scope assessment (SMALL/MEDIUM/LARGE), and specific gaps to resolve before building.

DO NOT modify any files during this audit.
```

---

## Key Findings (2026-09-16)

- Steps 1–8 of 9-step process already built (29 backend files)
- Step 9 (UK Search Validation) missing — needs new table + UI + endpoint
- SAJEEPAN_TITLE_ALT_V2 prompt not in PROMPT_REGISTER.md — Rule 1 violation
- Shopify title write step not built — scope confirmation needed
- `feed_optimization_tracker` exists — must NOT be duplicated
