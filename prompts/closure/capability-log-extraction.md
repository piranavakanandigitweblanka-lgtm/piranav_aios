# Prompt: Capability Log Extraction

---

## Title
Capability Log Extraction

## Purpose
Extract all reusable patterns from a completed session, assign standard pattern names, and determine whether each pattern should become a prompt template or be added to the prompt register. Prevents useful patterns from being lost at session end.

## Business Question
> "Of the work done in this session, which patterns are reusable across stores or sessions, what are they named, and which ones need a new prompt template?"

## When to Use
- At the end of any session where new code patterns, fix approaches, or audit methods were used
- When reviewing historical session logs to extract patterns not yet in the prompt library
- Before writing a new prompt template — to confirm the pattern does not already exist

## Pre-conditions
- The session's work must be complete
- The session's daily log or closure entry must already be written
- `PROMPT_REGISTER.md` must be read first — check whether the pattern is already registered

---

## Prompt Text

```
You are extracting reusable capability patterns from a completed session log.

Session log: [PATH TO closure/sessions/YYYY-MM-DD.md OR description of tasks completed]

For each task completed in this session, determine:
1. Is the approach reusable across different stores or sessions? YES / NO
2. If YES: what is the pattern name (kebab-case, descriptive)?
3. What category does it belong to: discovery / implementation / validation / closure
4. Does a prompt template already exist in prompts/[category]/? (check the folder)
5. Recommendation: CREATE NEW / EXTEND EXISTING / NO ACTION NEEDED

Output format:

| Pattern Name | Category | What It Does | Reusable? | Template Exists? | Recommendation |
|---|---|---|---|---|---|

Then for each pattern flagged CREATE NEW, generate a one-paragraph brief:
**[Pattern Name]**
Brief: [what the prompt needs to do, inputs required, expected output, evidence format]
Priority: HIGH / MEDIUM / LOW

Then for each pattern flagged EXTEND EXISTING, state:
**[Pattern Name]**
Existing template: [prompts/category/filename.md]
Extension needed: [what should be added to the existing template]

Finally, output a single PROMPT_REGISTER.md row for each reusable pattern:
| Date | Pattern Name | Category | Template | Status |
|---|---|---|---|---|
| [date] | [name] | [category] | [path or PENDING] | ACTIVE / PENDING |
```

---

## Expected Claude Output
- Reusability assessment table (one row per task/pattern)
- CREATE NEW briefs (for patterns with no existing template)
- EXTEND EXISTING notes (for patterns that should extend an existing template)
- PROMPT_REGISTER.md rows ready to paste

## Evidence Required
- `PROMPT_REGISTER.md` updated with new rows
- If CREATE NEW: new template file created in `prompts/[category]/`
- Closure entry notes which patterns were extracted

## Pass/Fail Rule
PASS: Every reusable pattern from the session has a register row. Every CREATE NEW pattern has a brief or completed template.
FAIL: A session produced a reusable pattern with no register entry and no template.

## Related Tasks
- `prompts/closure/daily-session-closure.md`
- `PROMPT_REGISTER.md`

## Status
ACTIVE

## Last Updated
2026-10-08

## Source Evidence
- All sessions 2026-06-09 through 2026-06-24 contain CAPABILITY LOG entries — 21 named patterns identified across 10 sessions
- This prompt formalises the extraction process already being done informally

---

# Part 2: Capability Document Decision

This section governs **capability document decisions** — whether a session's work should create, extend, update, or leave unchanged a capability file in `capability/2026/MM/YYYY-MM-DD/`. This is separate from prompt pattern extraction (Part 1 above).

## Business Question
> "Did this session produce work that proves a system capability — something repeatable, reusable, and evidence-backed — and if so, should that become a NEW capability file, EXTEND an existing one, UPDATE an existing one, or not require a capability file at all?"

## When GPT Must Automatically Evaluate (Trigger Conditions)

GPT must run a capability decision check after ANY of the following:

1. A new feature, integration, or system was built (any project)
2. An existing feature was fixed in a way that changed how it works
3. A new data source, API endpoint, or SQL query was confirmed working
4. A staff automation was built or modified (tracker, email trigger, form, webhook)
5. A Shopify section, snippet, or theme change was deployed and verified
6. A database schema change was made and tested
7. A new Claude Code or GPT workflow was used for the first time on a project
8. Evidence confirms a system does something it was not previously documented as doing
9. A REVIEW REQUIRED capability entry is resolved with a root cause confirmed

GPT must NOT skip this check by assuming "it was just a small fix." The check is mandatory whenever any trigger above applies to the session's work.

## 5-Way Classification

| Decision | Meaning | When to Use |
|---|---|---|
| **NEW** | Create a new capability file at `capability/2026/MM/YYYY-MM-DD/` | Session proves a capability that has no existing file |
| **EXTEND** | Add a new section or variant to an existing capability file | Session proves a new use case or edge case for an already-documented capability |
| **UPDATE** | Modify an existing capability file to correct or improve it | Session corrects a limitation, wrong step, or outdated content in an existing capability |
| **NO CAPABILITY CHANGE** | No file action needed | Session was a minor fix, investigation with no conclusion, or already fully covered by an existing capability |
| **REVIEW REQUIRED** | Flag for coordinator — do not write capability until root cause is confirmed | Session found unexpected behavior, a partial result, or a system acting outside its documented behavior |

## Decision Order (Must Follow This Sequence)

1. **REUSE** — Is there already a capability file that exactly covers this? → NO CAPABILITY CHANGE
2. **EXTEND** — Is there a file that covers 80%+ of this? → Add a new section to it
3. **UPDATE** — Is there a file that covers this but has a wrong or outdated step? → Correct it
4. **MERGE** — Do two files now describe the same thing? → Merge into one canonical file
5. **CREATE NEW** — No existing file covers this → NEW capability file at `capability/2026/MM/YYYY-MM-DD/`

Never skip to CREATE NEW without checking steps 1–4.

## Date Preservation Rule

When creating a NEW capability file:
- Use the date the capability was **first confirmed** — not today's date unless it was confirmed today
- Date priority: (1) Date First Identified in evidence, (2) Source task date, (3) Evidence date, (4) Filename date
- NEVER use the filesystem modified date or the current session date if the capability was identified earlier
- Folder path must match the date in the filename: `capability/2026/MM/YYYY-MM-DD/filename-YYYY-MM-DD.md`

## INDEX Update Rule

After ANY capability decision that results in a file action (NEW, EXTEND, UPDATE, MERGE):
- Update `capability/INDEX.md` — add or modify the row for this capability
- Update the correct monthly section (## YYYY-MM) with the new or corrected path
- Confirm Reuse Level, Status, and Last Updated fields are accurate
- If the session resolves a REVIEW REQUIRED entry → update its status in INDEX

## Evidence Rule for Capability Decisions

Every capability file must have evidence before it can be marked PASS:
- Evidence path must exist in `evidence/` or `validation/` — not a placeholder
- Evidence must confirm the capability was tested, not just built
- Git commit hash must be recorded in the capability file's Change History section
- Queryability: a new session must be able to find and reuse this capability from INDEX.md alone

## Queryability Test (Run Before Marking PASS)

Answer all 7 — all must be YES:

1. Is the capability file listed in `capability/INDEX.md`? YES / NO
2. Does the file path match the date in the filename? YES / NO
3. Does the file have a real evidence path (not a placeholder)? YES / NO
4. Does the file contain the 12 required capability fields? YES / NO
5. Can a new session find this capability by searching INDEX.md without opening the capability file first? YES / NO
6. Does the file include a Change History entry for this session? YES / NO
7. Is the file git-tracked (confirmed via `git status`)? YES / NO

Any NO → FAIL. Fix before closing the session.

## Closure Section Format

Add this block to every closure entry where a capability decision was made:

```
### Capability Update Check
Capability Decision: NEW / EXTEND / UPDATE / NO CHANGE / REVIEW REQUIRED
Capability Name: [name from INDEX or new name]
Capability Path: [capability/2026/MM/YYYY-MM-DD/filename.md or N/A]
Evidence Path: [evidence/... or N/A]
Reason: [why this decision was made — one sentence]
INDEX Updated: YES / NO / N/A
Queryability: PASS / FAIL / N/A
Reviewer: [Claude / GPT / Piranav]
Next Action: [NONE or what must happen before this capability is usable]
```

If multiple capability decisions were made this session, repeat the block for each. If NO trigger conditions were met, write:

```
### Capability Update Check
Capability Decision: NO CHANGE
Reason: [one sentence — what the session did and why no capability action was needed]
```

## Output Format for GPT Capability Decision Check

At the end of each session, GPT must produce:

| Work Done | Trigger Met? | Decision | Capability Name | Path | Evidence | INDEX Updated |
|---|---|---|---|---|---|---|

Then for each NEW or EXTEND:

**[Capability Name]**
File: [path]
Evidence: [path]
Queryability: PASS / FAIL

## Pass/Fail Rule (Part 2)

PASS: Every trigger condition met in the session has a documented capability decision. Every NEW/EXTEND/UPDATE file is git-tracked, evidence-backed, and INDEX-updated.

FAIL: A trigger condition was met but no capability decision was documented. A capability file was created but not indexed. A REVIEW REQUIRED item was left with no next action.

## Related Files
- `capability/INDEX.md` — must be updated after every NEW, EXTEND, UPDATE, or MERGE
- `prompts/closure/daily-session-closure.md` — Capability Update Check block is embedded in daily closure format
- `START_HERE.md` Step 5.3 — capability folder is a conditional mandatory asset
