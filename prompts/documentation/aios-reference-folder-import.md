# Prompt — AIOS Reference Folder Import

**Category:** documentation
**Pattern Name:** aios-reference-folder-import
**Date First Used:** 2026-09-23
**Status:** ACTIVE

---

## When to Use

When a reference folder (PDFs, DOCX guides, reports, screenshots) exists outside the AIOS directory (e.g. in Downloads or Desktop) and needs to be moved into the correct AIOS location with full documentation registration.

---

## Prompt Template

```
TASK: Move [FOLDER NAME] into Piranav AIOS

SOURCE: [full path to source folder]
PIRANAV AIOS ROOT: C:\Users\PC\Documents\piranav_aios

OBJECTIVE:
Move the complete "[FOLDER NAME]" folder into the correct existing location inside Piranav AIOS and register it properly in the AIOS documentation/evidence structure.

STEP 1 — INSPECT FIRST
Inspect the existing structure of: C:\Users\PC\Documents\piranav_aios
Look for existing: [relevant topic folders — e.g. SEO, GSC, evidence, reports]
Also inspect: [SOURCE PATH]
Do not move anything yet.

STEP 2 — FIND THE CORRECT LOCATION
Determine where the folder should logically be stored based on existing AIOS structure.
Prefer an existing appropriate location. Do NOT create unnecessary duplicate folders.
Report: current AIOS structure, source contents, existing related folders, proposed destination, any duplicates.

STEP 3 — MOVE
Move the complete folder into the selected AIOS location.
Preserve: all file types, subfolders, filenames, file contents.
Do not rename files unless required. Do not overwrite existing files silently.

STEP 4 — AIOS UPDATE
After moving, update relevant AIOS records:
- evidence/[topic]/[folder]/README.md — source, destination, purpose, topics covered
- capability/piranav/[topic-slug].md — what this resource enables
- closure/README.md — closure row for this session
- PROMPT_REGISTER.md — add row
- source-map/README.md — add data source row
- validation/piranav/[slug]-validation.md — file count before/after
- docs/[topic]/ — update index if one exists

STEP 5 — VALIDATE
- Confirm source folder is removed
- Compare file/folder counts before and after
- Confirm no files lost
- Confirm no unrelated files modified

STEP 6 — FINAL REPORT
Return: SOURCE / DESTINATION / FILES MOVED / AIOS RECORDS UPDATED / DUPLICATES / VALIDATION: PASS or FAIL
```

---

## Key Constraints

- Always inspect before moving — never move blindly
- Always check for existing equivalent folder before creating new destination
- All 7 AIOS asset types must be completed (prompt, evidence, capability, closure, PROMPT_REGISTER, source-map, validation)
- Never modify application code or production data during import
