# Prompt: BGCT Technical SEO Documentation Pack

**Prompt ID:** SEO-BGCT-DOC-001
**Category:** seo
**Registered:** 2026-10-09
**Author:** Piranav
**Status:** ACTIVE
**Reusability:** High — applicable to any Technical SEO task workbook

---

## Prompt

```
ROLE
Act as a Senior Technical SEO Specialist, Shopify SEO Expert, and Technical Documentation Lead.

OBJECTIVE
Using an existing Excel workbook as the primary source, create a professional, expert-level Technical SEO documentation pack that can be handed over to a Team Leader.

SOURCE WORKBOOK
[specify path to workbook]

APPROVED WORKING FOLDER
[specify approved AIOS folder]

STAFF: [Owner name]
TECHNICAL REVIEWER: [Reviewer name]
QUERYABILITY REVIEWER: [Reviewer name]
COORDINATOR: [Coordinator name]
BUSINESS VALIDATOR: [Domain owner]

PHASE 1 — INSPECT EXISTING ASSETS
Before creating anything:
1. Read every worksheet, task, populated row, and relevant column in the source workbook.
2. Preserve the original task names, numbering, terminology, and meaning.
3. Search the approved AIOS folder for existing Technical SEO documents.
4. Identify existing documents that should be improved rather than duplicated.
5. Keep the original workbook unchanged.

PHASE 2 — BUILD THE DOCUMENTATION PACK
For every Technical SEO task in the workbook, develop four practical resources:
1. BEST PRACTICE — recommended approach, why it matters, Shopify-specific considerations, exceptions, trade-offs, authoritative references
2. GUIDELINES — decision rules, priority, severity, escalation conditions, safe implementation boundaries
3. CHECKLIST — individual auditable checks with tool, procedure, expected result, failure condition, severity, evidence
4. TUTORIAL — prerequisites, tools, numbered step-by-step instructions, how to interpret results, validate the fix, rollback/escalation

Include DO's AND DON'Ts in Tutorial files.

DOCUMENTATION STRUCTURE
Folder: docs/bgct-technical-seo/ (or equivalent for the workbook name)
One subfolder per worksheet.
Files: best-practice.md, guidelines.md, checklist.md, tutorial.md per subfolder.

TECHNICAL ACCURACY
- Treat workbook as primary source for task coverage.
- Flag questionable or ambiguous rules — do not silently accept incorrect claims.
- Use official Google Search Central and Shopify documentation for verification.
- Distinguish: verified facts, recommendations, assumptions, unresolved questions.
- Do not fabricate source references.

ASSET METADATA
Each document must state: title, worksheet/task reference, source, owner/reviewer, status (DRAFT), pass/fail rule, known limitations.

PHASE 3 — VALIDATE
1. Compare documentation against every workbook task.
2. Produce a coverage matrix.
3. Check for contradictions, duplicate guidance, missing coverage.
4. All assets remain DRAFT until reviewer approval.

OUTPUT
1. Summary of work completed
2. Workbook and worksheets inspected
3. Folder structure
4. File list
5. Coverage matrix
6. Technical claims needing human review
7. Duplicate-risk findings
8. Validation results
9. Blockers
10. Recommended next action
11. PASS / FAIL
```

---

## Usage Notes
- Substitute the bracketed placeholders with the real workbook path, staff names, and AIOS folder.
- Works with any Technical SEO workbook that follows a task/category structure.
- The four-resource structure (Best Practice, Guidelines, Checklist, Tutorial) is a reusable documentation pattern applicable beyond SEO.

---

## Evidence
- First use: BGCT Technical SEO workbook, session 2026-10-09
- Output location: `docs/bgct-technical-seo/`
- Evidence: `evidence/piranav/bgct-technical-seo-docpack-2026-10-09.md`
