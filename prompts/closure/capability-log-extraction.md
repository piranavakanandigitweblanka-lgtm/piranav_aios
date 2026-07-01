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
2026-07-01

## Source Evidence
- All sessions 2026-06-09 through 2026-06-24 contain CAPABILITY LOG entries — 21 named patterns identified across 10 sessions
- This prompt formalises the extraction process already being done informally
