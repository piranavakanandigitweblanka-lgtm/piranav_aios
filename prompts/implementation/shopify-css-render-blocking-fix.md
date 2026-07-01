# Prompt: Shopify CSS Render-Blocking Fix

---

## Title
Shopify CSS Render-Blocking Fix

## Purpose
Identify and fix render-blocking CSS assets in a Shopify theme's `<head>` — converting blocking `<link>` tags to async loads, removing duplicate font loads, eliminating `@import` from CSS files. Improves Lighthouse Performance score and FCP.

## Business Question
> "Which CSS assets are blocking first paint on this theme, what is their combined render-blocking budget, and which can be made async without breaking the layout?"

## When to Use
- Lighthouse Performance score below 60 on mobile
- FCP above 2.0s on mobile
- After a Lighthouse audit identifies render-blocking resources
- When a font is loaded twice (once blocking, once async)
- When `@import` is found inside any `.css` or `.liquid` file

## Pre-conditions
- Theme files must be accessible locally
- Lighthouse baseline must be recorded before starting (mobile score + FCP)
- Check `evidence/fixes/` — confirm this audit has not been run on this theme version
- Do NOT push changes until local preview (`shopify theme dev`) confirms no visual regression

---

## Prompt Text

```
You are auditing and fixing render-blocking CSS in a Shopify theme.

Theme: [THEME EXPORT PATH OR NAME]
Store: [STORE URL]
Lighthouse baseline: [MOBILE SCORE] / FCP: [FCP VALUE]

Step 1 — AUDIT (read-only, no changes)
Search the following files for render-blocking CSS patterns:
- layout/theme.liquid
- layout/password.liquid
- All snippets/head-*.liquid
- Any snippet that is included inside <head>

For each `<link rel="stylesheet">` found in <head>, record:
| File | Line | Asset | Size (approx) | Can be async? | Risk |
|---|---|---|---|---|---|

Also check:
- Is any Google Font loaded twice (once blocking, once async)?
- Is @import used in any .css or .liquid file?
- Is cart.css, glightbox.css, or any page-specific CSS loaded blocking on every page?

Step 2 — FIXES
For each async-safe asset identified:
- Change `<link rel="stylesheet" href="...">` to `<link rel="stylesheet" href="..." media="print" onload="this.media='all'">`
- Or use `{{ 'file.css' | asset_url | stylesheet_tag }}` with Shopify async pattern
- Remove duplicate font <link> tags — keep the async version, remove the blocking one
- Remove any CSS @import url() — replace with a direct <link> or remove if redundant

Step 3 — EVIDENCE
After each change, record:
| File | Line Before | Line After | Change Type | Estimated Gain |
|---|---|---|---|---|

Step 4 — VERIFY
Run grep to confirm the old blocking pattern no longer exists in the modified files.

Do not modify:
- Any CSS that controls above-the-fold layout (base.css, critical styles)
- Any CSS loaded conditionally by page template (only load-on-every-page targets)
- theme.js or any JavaScript files
```

---

## Expected Claude Output
- Render-blocking asset audit table
- List of duplicate font loads found
- List of `@import` patterns found
- Change table (file, line before, line after, estimated gain)
- Grep verification output confirming old patterns removed
- Estimated post-fix Lighthouse improvement

## Evidence Required
- Evidence file: `evidence/fixes/[store]-css-render-blocking-fix-[date].md`
- Index row in `evidence/README.md`
- Closure entry in `closure/README.md`
- Lighthouse re-run after deployment (before/after score)

## Pass/Fail Rule
PASS: All identified blocking assets fixed or documented as intentionally left blocking with reason. Grep confirms changes applied. No visual regression in `shopify theme dev`.
FAIL: Any `<link rel="stylesheet">` in `<head>` left blocking without documented reason, or fix applied without grep verification.

## Related Tasks
- `prompts/discovery/shopify-liquid-section-code-review.md`
- `prompts/validation/shopify-section-post-fix-verification.md`
- Pattern: `shopify-css-render-block-fix` (from 2026-06-09 session)

## Status
ACTIVE

## Last Updated
2026-07-01

## Source Evidence
- `closure/sessions/2026-06-09.md` — 6 fixes applied; DM Sans loaded twice; cart.css blocking on all pages; @import in pendantoffpop.liquid; estimated FCP improvement 900ms–600ms
- `evidence/audits/theme-performance-audit-2026-06-09.md`
