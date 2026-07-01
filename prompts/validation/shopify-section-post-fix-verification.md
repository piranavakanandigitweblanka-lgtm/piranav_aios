# Prompt: Shopify Section Post-Fix Verification

---

## Title
Shopify Section Post-Fix Verification

## Purpose
Verify that a fix applied to a Shopify Liquid section or snippet produced the expected result, introduced no regressions, and is safe to deploy. Produces a PASS or FAIL validation report that must exist before the closure entry can be marked PASS.

## Business Question
> "Did the change produce the expected output, are the surrounding elements unaffected, and is this safe to push to a live or development theme?"

## When to Use
- After any Liquid, CSS, or JS change has been applied to a theme file
- Before any `shopify theme push` to a development theme
- When closing a fix task in `closure/README.md`
- After an AI-generated block has been remediated

## Pre-conditions
- The fix must already be applied to the local theme files
- The original issue (before state) must be documented
- `shopify theme dev` must be running or available for visual check
- The fix evidence file must already exist in `evidence/fixes/`

---

## Prompt Text

```
You are verifying a fix applied to a Shopify theme file.

Theme: [THEME EXPORT PATH OR NAME]
Store: [STORE URL]
Fix applied: [ONE-LINE DESCRIPTION — e.g. "Removed product.available guard from predictive search loop"]
Files changed: [LIST OF FILES]
Expected result: [WHAT SHOULD NOW BE TRUE — e.g. "OOS products appear in the dropdown"]
Original issue: [WHAT WAS WRONG BEFORE]

Step 1 — READ THE CHANGED FILES
Read each changed file.
Confirm the fix is present:
| File | Expected Change | Present? |
|---|---|---|

Step 2 — REGRESSION CHECK
For each changed file, check:
(a) Are there other elements on the same page/section that could be affected?
(b) Did the change alter any logic paths beyond what was intended?
(c) Are there any syntax errors introduced (unclosed tags, missing commas, broken Liquid)?

Step 3 — PATTERN VERIFICATION
Run grep to confirm:
(a) The old failing pattern is no longer present in the changed file(s)
(b) The new pattern appears exactly where expected

Step 4 — ADJACENT FILES CHECK
Are there other files that reference the changed section or snippet?
If yes, check whether those files are affected by the change.
| Adjacent File | References Changed File? | Impact |
|---|---|---|

Step 5 — DEPLOYMENT READINESS
| Check | Status |
|---|---|
| Syntax valid | YES / NO |
| Logic unchanged beyond scope of fix | YES / NO |
| Adjacent files unaffected | YES / NO |
| Visual regression risk | GREEN / AMBER / RED |
| Safe to push to dev theme | YES / NO — if NO, state reason |

## Verdict
PASS: [reason]
or
FAIL: [reason — list what must be addressed before this can be re-verified]
```

---

## Expected Claude Output
- Change presence confirmation table
- Regression check results
- Grep verification (old pattern absent, new pattern present)
- Adjacent file impact table
- Deployment readiness checklist
- PASS / FAIL verdict with reason

## Evidence Required
- Validation report: `validation/[date]-[task-slug].md`
- Linked in `evidence/README.md` validation row
- Closure entry updated with validation result

## Pass/Fail Rule
PASS: All changes confirmed present, no syntax errors, no regression risk identified, deployment readiness GREEN or AMBER with documented risk.
FAIL: Change not found in file, syntax error introduced, or deployment readiness RED.

## Related Tasks
- `prompts/implementation/shopify-lighthouse-accessibility-fix.md`
- `prompts/implementation/shopify-css-render-blocking-fix.md`
- `prompts/closure/daily-session-closure.md`

## Status
ACTIVE

## Last Updated
2026-07-01

## Source Evidence
- `closure/sessions/2026-06-22.md` — hero block verification report; AMBER → PASS after all 6 findings fixed
- `validation/hero-section-verification-report.md`
- Pattern: `theme-block-verification-audit` (2026-06-22 session)
