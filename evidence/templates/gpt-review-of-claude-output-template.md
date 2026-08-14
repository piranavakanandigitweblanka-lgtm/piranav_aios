# GPT Review of Claude Output

**Template version:** 1.0 (2026-08-14)
**Template path:** `evidence/templates/gpt-review-of-claude-output-template.md`
**Usage:** Copy this file to `evidence/[person]/[req-id]-gpt-review-[date].md` before filling in.

---

## Header

| Field | Value |
|---|---|
| Requirement ID | |
| Date | |
| Claude Session | (session link or session label if available) |
| Approved Scope | (what GPT authorised Claude to do — copy from original prompt) |
| Reviewer | GPT |
| Reviewed by | (GPT model/session used for this review) |

---

## Claude Work Summary

(Summarise what Claude claimed to have done. 3–8 bullet points. Be specific: file paths, commit hashes, business logic implemented.)

-
-
-

---

## Evidence Reviewed

| Evidence Type | Path / Reference | Present? |
|---|---|---|
| Git commit | | YES / NO |
| Capability file | | YES / NO |
| Validation file | | YES / NO |
| Test/browser screenshot | | YES / NO |
| Evidence markdown | | YES / NO |
| API response / DB query result | | YES / NO |
| Closure file | | YES / NO |

---

## Files / Git Reviewed

(List each file or commit reviewed. Note any file that Claude claimed to modify that was not confirmed.)

| File / Commit | Action | Confirmed? |
|---|---|---|
| | | YES / NO / UNVERIFIED |

---

## What Is Proven

(What is confirmed by actual evidence — git commit, file content, DB output, etc. Do not include Claude session text alone.)

-
-

---

## What Is Not Proven

(What Claude claimed or implied that cannot be confirmed by evidence. If only Claude session text exists for it: UNPROVEN.)

-
-

---

## Duplicate Truth Check

| Asset | Existing Asset | Conflict? | Action |
|---|---|---|---|
| | | YES / NO / AMBER | |

---

## Queryability Check

Can another LLM answer the following from existing AIOS files only?

| Question | Answer | Queryable? |
|---|---|---|
| What was done? | | YES / NO |
| Why was it done? | | YES / NO |
| Where is the asset? | | YES / NO |
| What source was used? | | YES / NO |
| What evidence proves it? | | YES / NO |
| What is the current status? | | YES / NO |
| What is missing? | | YES / NO |
| Who reviews it? | | YES / NO |
| What happens next? | | YES / NO |
| Is it safe to reuse? | | YES / NO |

**Overall Queryability:** PASS / FAIL

---

## Unknown Developer Check

Can another developer continue this work without asking Piranav for verbal explanation?

| Area | Can Continue? | Missing Information |
|---|---|---|
| Objective | YES / NO | |
| Asset location | YES / NO | |
| Evidence location | YES / NO | |
| Systems touched | YES / NO | |
| Systems NOT touched | YES / NO | |
| Risks | YES / NO | |
| Validation method | YES / NO | |
| Next action | YES / NO | |

**Overall Unknown Developer Test:** PASS / FAIL

---

## Safety / Scope Check

| Check | Result | Notes |
|---|---|---|
| Work stayed inside approved scope | PASS / FAIL | |
| No production changes outside scope | PASS / FAIL | |
| No destructive operations | PASS / FAIL | |
| No commits/pushes without approval | PASS / FAIL | |
| No new AIOS truth created without GPT sign-off | PASS / FAIL | |

---

## Remaining Gaps

(List anything that is still missing before this work item can be fully closed.)

| Gap | Priority | Action |
|---|---|---|
| | P0 / P1 / P2 / P3 | |

---

## Reviewer Decision

**Result:** PASS / FAIL / PARTIAL

**Rationale:**
(1–3 sentences explaining the decision.)

---

## Required Next Step

(What must happen before the next session can proceed safely on this work item.)

1.
2.
3.
