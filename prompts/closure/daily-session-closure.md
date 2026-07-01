# Prompt: Daily Session Closure

---

## Title
Daily Session Closure

## Purpose
Generate a complete, formatted closure entry for the current session that meets the PASS standard — listing every task completed, its evidence path, queryability result, and next step. No task may be closed without this entry.

## Business Question
> "Did every task completed in this session produce a queryable, evidence-backed closure entry that Varmen can review without asking piranav for context?"

## When to Use
- At the end of every working session, without exception
- If a session was interrupted, write a PARTIAL closure entry marking incomplete tasks as OPEN
- If a session produced no completable tasks, write a closure entry stating OPEN with blockers

## Pre-conditions
- All work for the session must be done before closure is written
- Every evidence file referenced must already exist in `evidence/` or `validation/`
- `closure/README.md` must be read before writing — find the correct session date section or create a new one
- Git status must be checked before closure is written

---

## Prompt Text

```
You are writing a daily session closure entry for piranav's AIOS workspace.

Session date: [YYYY-MM-DD]
Session label: [SHORT LABEL — e.g. "LEDSone Accessibility Sprint Day 3"]

Tasks completed this session:
[LIST EACH TASK WITH ONE LINE DESCRIPTION AND FILE MODIFIED/CREATED]

Write a closure entry for `closure/README.md` in this exact format:

### [YYYY-MM-DD] — [Session Label]

| Req ID | Task | Asset Path | Evidence Path | GitHub / Commit | Queryable | Blockers | Next Step | Result |
|---|---|---|---|---|---|---|---|---|

Rules:
- Req ID format: AIOS-[YYYY-MM-DD]-[001, 002, ...]
- Asset Path: the file created or changed (relative to piranav_aios root, or theme path)
- Evidence Path: git commit hash, OR `evidence/fixes/[file].md`, OR `validation/[file].md`
- GitHub / Commit: commit hash if committed; "Not committed — pending push" if not
- Queryable: YES only if a new session reading only piranav_aios files can understand this entry
- Blockers: NONE or one-line description
- Next Step: NONE or what the next session must do first
- Result: PASS / FAIL / OPEN

After the table, add:
**Session Result: PASS / FAIL** — [one-line reason]

Then write a CAPABILITY LOG entry for any reusable pattern produced:

### Capability Log — [YYYY-MM-DD]
| Pattern Name | What Was Built | Reusable | Where It Applies |
|---|---|---|---|

Then state git status:
### Git Status — [YYYY-MM-DD]
- Staged files: [list or NONE]
- Untracked: [list or NONE]
- Committed this session: YES / NO
- Pushed: YES / NO
```

---

## Expected Claude Output
- Formatted closure table (one row per task)
- Session result: PASS or FAIL
- Capability log table (one row per reusable pattern)
- Git status summary
- Any OPEN items with blockers noted

## Evidence Required
- Closure entry written to `closure/README.md`
- All evidence paths in the table must point to files that already exist
- No evidence path may be a placeholder

## Pass/Fail Rule
PASS: Every task has a row. Every PASS row has a real evidence path. Queryable is YES for all rows. Session result stated.
FAIL: Any task missing a row. Any evidence path pointing to a non-existent file. Session ends without closure written.

## Related Tasks
- `prompts/closure/capability-log-extraction.md`
- `prompts/validation/shopify-section-post-fix-verification.md`

## Status
ACTIVE

## Last Updated
2026-07-01

## Source Evidence
- `closure/README.md` — closure format established 2026-06-25; all sessions from 2026-06-09 have CAPABILITY LOG entries
- `START_HERE.md` — Step 6: "Every session must end with a closure entry in closure/README.md"
