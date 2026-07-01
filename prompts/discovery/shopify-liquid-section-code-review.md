# Prompt: Shopify Liquid Section Code Review

---

## Title
Shopify Liquid Section Code Review

## Purpose
Full code review of a single Shopify Liquid section or snippet — covering feature validation, security audit, schema review, and risk register. Produces a structured report that can be filed as evidence.

## Business Question
> "Does this Liquid section behave as designed, contain no security vulnerabilities, and have a complete schema — and can Varmen verify this without re-reading the file?"

## When to Use
- Any time a new or modified `.liquid` file is handed over for review
- Before deploying a custom section to a live theme
- When a bug is suspected inside a section but the root cause is unknown
- After any AI-generated block is introduced into the theme

## Pre-conditions
- The `.liquid` file to review must be readable locally
- The section's intended feature list must be known (ask piranav if unclear)
- `evidence/README.md` must be checked — confirm this section has not already been reviewed

---

## Prompt Text

```
You are performing a structured code review of a Shopify Liquid section.

File: [FILE PATH]
Theme: [THEME NAME]
Section purpose: [ONE-LINE DESCRIPTION]
Expected features: [LIST FEATURES FROM SCHEMA OR BRIEF]

Review this file for:
1. FEATURE VALIDATION — Does each stated feature work as described? Mark each: PASS / FAIL / PARTIAL
2. SECURITY — Check for XSS (innerHTML, raw output without escape), eval(), unguarded user input
3. SCHEMA — Are all schema settings used in the template? Are any orphaned?
4. JS — Any eval(), unthrottled event listeners, or render-blocking inline scripts?
5. ACCESSIBILITY — Missing aria-labels, focus states, non-descriptive link text
6. DEAD CODE — Any unreachable branches, commented-out blocks, unused variables?

Output format:

## Feature Validation
| Feature | Status | Finding |
|---|---|---|

## Security Findings
| Finding | Severity | File:Line | Fix |
|---|---|---|---|

## Schema Issues
| Setting | Used in Template | Issue |
|---|---|---|

## JS Issues
| Pattern | File:Line | Risk |
|---|---|---|

## Accessibility Issues
| Element | Issue | Fix |
|---|---|---|

## Dead Code
| Item | File:Line | Action |
|---|---|---|

## Verdict
PASS / AMBER / FAIL — one paragraph summary

## Risk Register
| Risk | Severity | Recommended Action |
|---|---|---|
```

---

## Expected Claude Output
- Feature validation table (PASS / FAIL / PARTIAL per feature)
- Security findings with file:line references
- Schema orphan list
- JS risk list
- Accessibility issues
- Verdict: PASS / AMBER / FAIL
- Risk register

## Evidence Required
- Evidence file: `evidence/fixes/[section-slug]-code-review-[date].md`
- Index row in `evidence/README.md`
- Closure entry in `closure/README.md`

## Pass/Fail Rule
PASS: All features verified, no CRITICAL security findings, schema complete, verdict documented.
FAIL: Any unguarded XSS, missing feature with no explanation, or verdict absent.

## Related Tasks
- `prompts/validation/shopify-section-post-fix-verification.md`
- `prompts/implementation/shopify-lighthouse-accessibility-fix.md`
- Pattern: `shopify-section-code-review` (from 2026-06-09 session)

## Status
ACTIVE

## Last Updated
2026-07-01

## Source Evidence
- `closure/sessions/2026-06-09.md` — `product-reviews.liquid` code review; XSS found in `addReviewToUI`
- `closure/sessions/2026-06-22.md` — `blocks/ai_gen_block_f74df67.liquid` review; 6 AMBER/RED findings resolved
