# prompts/ — Claude Prompt Templates

---

## STANDING RULE — GPT Prompt Capture (effective 2026-07-01)

**Every reusable GPT-generated prompt must be saved here before it is executed.**

Full rule: `prompts/GPT_CAPTURE_RULE.md`
Session protocol: `START_HERE.md` → Standing Rules section

---

## What This Is

This folder holds reusable Claude Code prompt templates for recurring tasks inside piranav's Mini-AIOS workspace. Each template is a structured prompt that produces consistent, evidence-backed, queryable output.

---

## Why This Exists

Without standard prompts:
- Each session reinvents the task format
- Output quality is inconsistent
- Evidence format varies, making it unqueryable
- Duplicate truth is more likely (same task prompted differently produces parallel outputs)

Standard prompts ensure every session produces output in the same format, with the same evidence fields, ready for Varmen review.

---

## Business / Operational Question Supported

> "Can any authorised person re-run a past task type and get output in the same format, with the same evidence fields, without re-designing the prompt?"

---

## Prompt Index

### discovery/

| Prompt File | Task Type | Status |
|---|---|---|
| `discovery/shopify-liquid-section-code-review.md` | Full code review of a Liquid section or snippet | ACTIVE |
| `discovery/shopify-seo-strategy-audit.md` | 13-strategy SEO discovery audit for any Shopify store | ACTIVE |
| `discovery/shopify-layout-audit-three-page.md` | Layout audit across homepage, collection, product pages with benchmark comparison | ACTIVE |
| `discovery/shopify-configurator-page-sales-investigation.md` | Investigate whether a specific Shopify page (e.g. configurator) is generating sales | ACTIVE |
| `discovery/shopify-unlisted-products-sales-report.md` | Check whether any UNLISTED Shopify products have made sales in a date range | ACTIVE |

### implementation/

| Prompt File | Task Type | Status |
|---|---|---|
| `implementation/shopify-css-render-blocking-fix.md` | Identify and fix render-blocking CSS in `<head>` | ACTIVE |
| `implementation/shopify-lighthouse-accessibility-fix.md` | Resolve a named Lighthouse accessibility failure | ACTIVE |
| `implementation/shopify-predictive-search-field-fix.md` | Fix predictive search dropdown vs. full results mismatch | ACTIVE |
| `implementation/shopify-promo-banner-config-add.md` | Add a new collection entry to a promo banner CONFIG object | ACTIVE |
| `implementation/shopify-pdp-gallery-nav-add.md` | Add previous/next navigation buttons to a PDP image gallery | ACTIVE |
| `implementation/shopify-pdp-gallery-nav-fix.md` | Fix broken previous/next navigation in a PDP image gallery | ACTIVE |
| `implementation/shopify-section-auto-product-switch.md` | Add auto-rotating product groups to a static product grid section | ACTIVE |

### validation/

| Prompt File | Task Type | Status |
|---|---|---|
| `validation/shopify-section-post-fix-verification.md` | Verify a fix produced the expected result before deployment | ACTIVE |

### closure/

| Prompt File | Task Type | Status |
|---|---|---|
| `closure/daily-session-closure.md` | Write the end-of-session closure entry for closure/README.md | ACTIVE |
| `closure/capability-log-extraction.md` | Extract reusable patterns from a session and update the prompt register | ACTIVE |

### documentation/

| Prompt File | Task Type | Status |
|---|---|---|
| _(none yet)_ | — | PENDING — see documentation/README.md |

### reusable/

| Prompt File | Task Type | Status |
|---|---|---|
| _(none yet)_ | — | PENDING — see reusable/README.md |

### Root level

| Prompt File | Task Type | Status |
|---|---|---|
| `GPT_CAPTURE_RULE.md` | Standing rule — GPT prompt capture workflow | PERMANENT RULE |
| `shopify-cli-theme-workflow.md` | Shopify CLI auth, pull, dev, push workflow reference | ACTIVE — procedural guide; pending migration to documentation/ |

---

## Template Format

Every prompt file in this folder must follow this structure:

```
# Prompt: [Task Type Name]

## Title
## Purpose
## Business Question
## When to Use
## Pre-conditions
## Prompt Text
---
[Exact prompt text to paste into Claude Code]
---
## Expected Claude Output
## Evidence Required
## Pass/Fail Rule
## Related Tasks
## Status
## Last Updated
## Source Evidence
```

---

## Prompt Register

All prompts are also indexed in `PROMPT_REGISTER.md` at the root of `piranav_aios/`.

---

## Source / Evidence Used to Build This File

- 2026-06-25 discovery scan — identified recurring task types from existing session logs
- 2026-07-01 prompt recovery session — 10 sessions (2026-06-09 to 2026-06-24) audited; 21 capability patterns identified; 10 prompt templates created
- Varmen coordinator instruction for Mini-AIOS build

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Assigned Staff | piranav |
| Coordinator / Reviewer | Varmen |
| Last Updated | 2026-07-01 |

---

## Status

ACTIVE — 10 templates created (2026-07-01). Recovered from session CAPABILITY LOG entries. All templates based on real work performed 2026-06-09 to 2026-06-24.

---

## Pass / Fail Rule

Prompts PASS review if: a template exists for every recurring task type piranav performs, and every template includes all required fields and a source evidence trail.
Prompts FAIL review if: a recurring task was run without an existing template AND no template was created as a result.

---

## Known Limits

- Templates were reverse-engineered from session outputs — not from actual ChatGPT conversation history (not accessible)
- `shopify-cli-theme-workflow.md` is a procedural guide, not a full template — needs a `## Prompt Text` block added to meet the format standard
- Prompt templates have not yet been formally reviewed by Varmen — status is ACTIVE but Varmen review is pending
