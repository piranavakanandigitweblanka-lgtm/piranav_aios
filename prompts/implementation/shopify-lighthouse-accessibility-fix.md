# Prompt: Shopify Lighthouse Accessibility Fix

---

## Title
Shopify Lighthouse Accessibility Fix

## Purpose
Resolve a specific Lighthouse accessibility failure in a Shopify theme — covering contrast, touch targets, aria-labels, link text, viewport zoom, and focus states. One prompt run = one Lighthouse audit item. Produces a targeted fix with evidence.

## Business Question
> "Which exact lines in which files caused this Lighthouse accessibility failure, what is the minimum change required to fix it, and can Varmen verify the fix without re-running Lighthouse?"

## When to Use
- Lighthouse Accessibility score below 100
- A specific Lighthouse accessibility audit item is failing
- PageSpeed Insights shows a named accessibility check with a failing element
- After a code review identifies an accessibility issue

## Pre-conditions
- The Lighthouse failing audit name and failing element (CSS selector or screenshot) must be known
- Theme files must be accessible locally
- `evidence/fixes/` must be checked — confirm this fix has not already been applied
- Changes are additive only (aria attributes, CSS) unless the root cause requires a structural change

---

## Prompt Text

```
You are fixing a specific Lighthouse accessibility failure in a Shopify theme.

Failing audit: [LIGHTHOUSE AUDIT NAME — e.g. "Links must have discernible text"]
Failing element: [CSS SELECTOR OR ELEMENT DESCRIPTION from Lighthouse]
Theme: [THEME EXPORT PATH OR NAME]
Store: [STORE URL]

Step 1 — ROOT CAUSE
Search the theme for the failing element. Read the relevant file(s).
Identify:
- The exact file and line number producing the failing element
- Why Lighthouse flags it (what is technically absent or incorrect)
- Whether the failure is in Liquid, CSS, or JS

Step 2 — SCOPE CHECK
Are there other instances of the same pattern in the theme that would also fail the same audit?
List all instances:
| File | Line | Pattern | Same Fix Applies? |
|---|---|---|---|

Step 3 — FIX
Apply the minimum change required.
Rules:
- Additive attributes (aria-label, aria-hidden, alt) preferred over structural changes
- CSS-only changes (contrast, touch target size) preferred over HTML changes
- No refactoring of surrounding code
- No changes to JS logic

For each change:
| File | Line | Before | After | Change Type |
|---|---|---|---|---|

Step 4 — VERIFY
Run grep to confirm:
(a) The old failing pattern no longer exists in the modified lines
(b) The new pattern is syntactically correct Liquid

Step 5 — CONTRAST VALUES (if contrast fix)
Report the before/after contrast ratio for each changed colour pair.
Minimum required: 4.5:1 for normal text, 3:1 for large text (WCAG AA).

Do not change:
- Visual appearance beyond what the fix requires
- JS event handlers
- Schema settings
- Unrelated lines in the same file
```

---

## Expected Claude Output
- Root cause explanation (file + line)
- All-instances table
- Change table (before/after per file and line)
- Grep verification
- Contrast ratios if applicable
- Risk level (GREEN / AMBER / RED)

## Evidence Required
- Evidence file: `evidence/fixes/[audit-name-slug]-fix-[date].md`
- Index row in `evidence/README.md`
- Closure entry in `closure/README.md`

## Pass/Fail Rule
PASS: Failing element fixed at root, all instances addressed, grep confirms change, no visual regression introduced.
FAIL: Fix applied to symptom only (not root cause), any instance of the same pattern left unfixed without documented reason.

## Related Tasks
- `prompts/discovery/shopify-liquid-section-code-review.md`
- `prompts/validation/shopify-section-post-fix-verification.md`
- Pattern: `lighthouse-menu-banner-link-discernible-text-fix`, `liquid-aria-label-strip-guard`, `visually-hidden-link-context-span` (2026-06-16, 2026-06-17, 2026-06-23 sessions)

## Status
ACTIVE

## Last Updated
2026-07-01

## Source Evidence
- `closure/sessions/2026-06-16.md` — contrast, touch target, viewport zoom, descriptive links, Shopify undefined guard fixes
- `closure/sessions/2026-06-17.md` — megamenu discernible text fix; PageSpeed Agentic Browsing 2/3 → 3/3
- `closure/sessions/2026-06-23.md` — aria-label strip guard; visually-hidden span for blog link SEO
- Evidence files: `category-nav-accessibility-fix-2026-06-16.md`, `descriptive-links-fix-2026-06-16.md`, `touch-target-viewport-fix-2026-06-16.md`, `vendor-stock-contrast-fix-2026-06-16.md`
