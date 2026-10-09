# Prompt: BGCT Website UI/UX Documentation Pack

**Prompt ID:** UI-UX-BGCT-DOC-001
**Registered:** 2026-10-09
**Author:** Piranav
**Status:** ACTIVE
**Reuse:** Yes — use for any client or domain requiring a UI/UX documentation pack from an Excel task workbook

---

## Purpose

Convert a UI/UX task workbook (Excel) into a structured documentation pack that a Team Leader can use to brief, train, and quality-check developers and designers — without verbal explanation.

---

## Reusable Prompt

```
You are building a professional Website UI/UX Documentation Pack.

SOURCE WORKBOOK: [path to Excel file — read-only, do not modify]
OUTPUT LOCATION: piranav_aios/docs/[client-slug]-ui-ux/

PHASE 1 — EXISTING ASSET DISCOVERY
Before creating any file:
1. Read the workbook using openpyxl. List every worksheet and the tasks in each.
2. Search piranav_aios/ for any existing UI/UX documentation that could conflict or overlap.
3. Check PROMPT_REGISTER.md for existing equivalent prompts.
4. Report the workbook inventory, existing assets found, and duplicate-risk assessment.

PHASE 2 — BUILD THE DOCUMENTATION PACK
For every task in the workbook, create four resources:

A. BEST PRACTICE (best-practice.md per sheet/category)
   - User problem the task solves
   - Recommended approach with specific, opinionated guidance
   - Priority checks (numbered list, most important first)
   - Exceptions and trade-offs
   - Authoritative reference (tool or standard)

B. GUIDELINES (guidelines.md per sheet/category)
   - Decision rules in table format: Rule | Detail
   - Each rule is actionable and measurable
   - Include escalation conditions: when to escalate, to whom
   - Include prohibited actions (explicit DON'Ts as rules)

C. CHECKLIST (checklist.md per sheet/category)
   - Each row: Check | Tool | Procedure | Expected Result | Failure Condition | Severity | Evidence Required
   - Checks must be observable — binary PASS/FAIL
   - Specify tool (Chrome DevTools, Lighthouse, WAVE, Shopify Admin, etc.)
   - Severity: Critical / High / Medium / Low

D. TUTORIAL (tutorial.md per sheet/category)
   - Step-by-step instructions a developer or non-developer can follow
   - Include code examples (Liquid, CSS, JavaScript) where relevant
   - Include a DO's and DON'Ts table at the end

FOLDER STRUCTURE:
docs/[client-slug]-ui-ux/
  README.md (master index + task coverage matrix + existing asset check)
  01-[sheet-name]/
    best-practice.md
    guidelines.md
    checklist.md
    tutorial.md
  02-[sheet-name]/
    ...
  (repeat for each worksheet)

STATUS: All files must be marked DRAFT. Do not promote to production standards.
CODE REVIEW: All Liquid, CSS, JavaScript code examples must be flagged for Sajeesan review.

TECHNICAL CLAIMS TO FLAG FOR REVIEW:
- Conversion rate uplift claims without authoritative source
- Data retention periods for third-party tools (may change)
- Specific pixel/character count guidelines that are approximations
- Any Liquid patterns that modify theme.liquid or layout files

PHASE 3 — VALIDATE
Create a validation file at validation/piranav/[client-slug]-ui-ux-docpack-validation-[date].md with:
- Task coverage matrix: every task from the workbook, COVERED/MISSING status
- File count: expected vs actual
- Claims flagged for human review
- Duplicate-risk findings
- Outstanding actions

AIOS REQUIREMENTS (mandatory):
- Save this prompt to prompts/ui-ux/ BEFORE execution
- Update PROMPT_REGISTER.md with new prompt row
- Create evidence file at evidence/piranav/[client-slug]-ui-ux-docpack-[date].md
- Write closure entry in closure/README.md
- Run git status at end — confirm all files tracked

SAFETY CONSTRAINTS:
- Work only within piranav_aios/
- Do not modify live websites, Shopify themes, or production settings
- Do not commit or push without Piranav authorisation
- Stop and report if scope is unclear or approval is required
```

---

## Variables to Replace

| Variable | Example |
|---|---|
| `[path to Excel file]` | `C:\Users\PC\Downloads\Website UI_UX Tasks BGCT.xlsx` |
| `[client-slug]` | `bgct-ui-ux` |
| `[date]` | `2026-10-09` |

---

## Related Prompts

- SEO-BGCT-DOC-001 — Technical SEO version of this prompt pattern
