# Prompt — AIOS Closure Documentation (Evidence File)

**Category:** documentation
**Pattern name:** `aios-closure-evidence-template`
**First used:** 2026-07-01
**Task it solved:** ELEC-PDP-GAL-001 closure

---

## When to use this prompt

Use at the end of any completed implementation task to create an AIOS-standard closure/evidence markdown file. Use after the code work is done but before pushing to git.

---

## Prompt Template

```
Create AIOS closure documentation for the completed [TASK NAME].

Task completed:
[1-2 sentence description of what was built or fixed]

Store:
[Store name] / Shopify theme

Scope:
Save documentation only inside:
C:\Users\PC\Documents\piranav_aios

Do not modify theme code now.
Do not push without permission.

Create or update a suitable evidence/closure markdown file.

Include:
- Requirement ID
- Requirement summary
- Business purpose
- Store/theme area
- Files changed in Shopify theme
- What was broken
- What was fixed
- Validation results
- Before/after screenshot paths if available
- GitHub path/commit if available
- Duplicate-risk result
- Reviewer needed
- Pass/fail result
- Next step

Validation table:
| Check | Result | Evidence |
|---|---|---|
| [CHECK 1] | PASS/FAIL | |
| [CHECK 2] | PASS/FAIL | |
| [CHECK 3] | PASS/FAIL | |
| [CHECK N] | PASS/FAIL | |

Pass rule:
PASS only if evidence is saved and a clean LLM can understand tomorrow what was done, why, where, and how it was validated.

Return:
- asset path
- evidence path
- files created/updated
- PASS/FAIL
```

---

## Output convention

| Output | Path |
|---|---|
| Evidence markdown | `evidence/shopify/[store]/[feature]/YYYY-MM-DD_[task-slug]_closure.md` |
| Evidence index row | `evidence/README.md` — append row to Evidence Index table |
| Memory update | `memory/[relevant-memory-file].md` — append section noting what was done |
| Prompt register row | `PROMPT_REGISTER.md` — add row if new pattern used |

---

## Required sections in every closure file

1. Metadata table (Requirement ID, date, store, reviewer, evidence type)
2. Requirement summary
3. Business purpose
4. Files changed
5. What was broken (if a fix) / What was built (if new)
6. How the fix/feature works (plain English for a fresh LLM)
7. Validation table with PASS/FAIL per check
8. Screenshot paths (even if PENDING)
9. Git commit reference (even if PENDING)
10. Duplicate-risk result
11. Overall PASS/FAIL
12. Next step (push command, live validation step, commit message)
