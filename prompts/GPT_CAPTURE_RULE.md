# GPT Prompt Capture Rule — PERMANENT AIOS STANDING RULE

**Effective:** 2026-07-01
**Authority:** Varmen (coordinator instruction)
**Applies to:** Every Claude Code session inside `piranav_aios` from 2026-07-01 onwards

---

## Rule Statement

Every important GPT-generated prompt must become a reusable AIOS asset **before it is executed**.

A session that executes a GPT prompt without first saving it to the prompt library is a **FAIL**.

---

## Scope

This rule applies to GPT prompts received for:

| Task Type | Save Required |
|---|---|
| Discovery (audits, investigations, scans) | YES |
| Implementation (fixes, builds, configs) | YES |
| Validation (post-fix checks, verification) | YES |
| Documentation (guides, reports, summaries) | YES |
| Closure (session close, handover) | YES |
| Reusable investigations (research, root-cause) | YES |
| Greetings / casual conversation | NO |
| One-off explanations / Q&A | NO |
| General brainstorming with no output | NO |

**Decision rule for borderline cases:** If the prompt could be re-used in a future session to produce the same type of output — save it. If it is pure conversation with no repeatable output — skip it.

---

## Workflow — Follow Every Time

```
Step 1 — Receive GPT prompt
         ↓
Step 2 — Search existing prompt library
         prompts/README.md
         PROMPT_REGISTER.md
         prompts/[category]/
         ↓
Step 3a — Equivalent exists?
           YES → Update or extend existing file
                 Do NOT create a duplicate
         ↓
Step 3b — No equivalent?
           → Create new prompt asset in correct category folder
         ↓
Step 4 — Save prompt file BEFORE executing the task
         ↓
Step 5 — Execute the task using the saved prompt
         ↓
Step 6 — Save evidence
         evidence/fixes/ or evidence/audits/ or validation/
         ↓
Step 7 — Update PROMPT_REGISTER.md
         Add or update the row for this pattern
         ↓
Step 8 — Include prompt file path in closure report
         closure/README.md row → Asset Path or Evidence Path field
```

---

## Prompt Storage Structure

```
prompts/
├── GPT_CAPTURE_RULE.md       ← This file (standing rule)
├── README.md                 ← Prompt index
├── discovery/                ← Audits, scans, investigations
├── implementation/           ← Fixes, builds, config changes
├── validation/               ← Post-fix verification
├── documentation/            ← Guides, reports, summaries
├── closure/                  ← Session close, handover entries
└── reusable/                 ← Cross-domain patterns used in multiple categories
```

---

## Required Fields — Every Prompt Asset

Every file saved under `prompts/` must contain all of these fields:

```markdown
## Title
## Purpose
## Business Question
## GPT Prompt
[exact prompt text — copy from ChatGPT without editing]
## Expected Claude Output
## Evidence Required
## Pass / Fail Rule
## Related Assets
## Status
## Created Date
## Last Updated
```

The `## GPT Prompt` block must contain the **exact text received from ChatGPT**, unedited. Do not paraphrase. Do not clean it up. Future sessions must be able to re-run it exactly.

---

## Evidence Required for Each Capture Event

After saving a prompt and executing the task, record in `PROMPT_REGISTER.md`:

| Column | What to Record |
|---|---|
| Prompt File Path | `prompts/[category]/[filename].md` |
| Existing Asset Search | "Searched — no match found" or "Found at [path] — extended" |
| Duplicate Risk | NONE / LOW / RISK IDENTIFIED (describe) |
| Task Evidence Link | `evidence/fixes/[file].md` or `evidence/audits/[file].md` |
| Git Status | Committed hash or "Not committed" |

---

## Pass / Fail Rule

| Condition | Result |
|---|---|
| GPT prompt saved to `prompts/` before execution AND linked in `PROMPT_REGISTER.md` AND included in closure report | **PASS** |
| GPT prompt executed without being saved first | **FAIL** |
| GPT prompt saved after execution (same session) with explanation | **AMBER — acceptable once; repeat = FAIL** |
| Prompt is purely conversational (greeting, Q&A) and not saved | **PASS — out of scope** |

---

## Relationship to Existing Rules

This rule extends the existing workflow in `START_HERE.md`:

| START_HERE Step | This Rule's Addition |
|---|---|
| Step 1 — Search existing assets first | Step 2 of this rule: search `prompts/` and `PROMPT_REGISTER.md` before saving a new one |
| Step 3 — Evidence first | Step 6: prompt file path is now a required piece of evidence |
| Step 4 — Do the work | Step 5: execute only after prompt is saved |
| Step 6 — Daily closure | Step 8: closure entry must include prompt file path |

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Assigned Staff | piranav |
| Coordinator / Reviewer | Varmen |
| Rule Established | 2026-07-01 |
| Review Cycle | Every 30 days or on Varmen instruction |
