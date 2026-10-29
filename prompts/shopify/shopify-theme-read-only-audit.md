# Prompt: Shopify Theme Read-Only Audit (Phase 1 Discovery)

**Category:** shopify / audit
**Registered:** 2026-10-29
**First used:** Homin GmbH homingmbh-de-homingmbh-staging theme, 2026-10-29
**Reusable for:** Any Shopify theme (Dawn-based or otherwise) requiring a Phase 1 read-only audit before implementation

---

## What This Prompt Does

Performs a complete read-only discovery and audit of a Shopify theme. Produces a prioritised issue table, a file-by-file implementation plan, and full AIOS documentation. Does NOT modify any theme files.

---

## When to Use

- Before starting any theme improvement project
- When a new Shopify theme has been pulled locally and needs assessment
- When GPT coordinator requests a "Phase 1 discovery" before implementation
- As a baseline audit to document current state before any changes

---

## Key Technical Constraints

- **Phase 1 is strictly read-only.** No theme files may be edited, created, deleted, or moved.
- Read every file in: layout/, sections/, snippets/, assets/ (CSS + JS), config/settings_data.json, locales/de.json (or primary locale)
- For files >300 lines, read in sections
- Check for: custom sections added beyond base Dawn, third-party app integrations, custom CSS patterns, inline scripts
- Identify all breakpoints: Dawn uses 750px (tablet) and 990px (desktop)
- For German-language stores: assess German text wrapping, compound word handling (`word-break: break-word`), locale completeness

## Required Checks

1. **Duplicate scripts** — search theme.liquid and settings_data.json for the same app loaded twice
2. **onclick on divs** — must be replaced with native `<a>` or `<button>` elements
3. **OG tags** — og:image must use https: not http:
4. **Inline styles in JS-rendered HTML** — bypasses theme design system
5. **Font preload duplication** — Dawn sometimes generates duplicate preload tags in theme.liquid
6. **Image lazy loading on above-fold tiles** — first tile should use `loading: 'eager'`
7. **innerHTML without sanitisation** — potential XSS risk in JS snippets

## Output Required

1. Project and Git status
2. Theme architecture overview
3. File inventory and audit coverage
4. UI/UX findings
5. CSS and JavaScript findings
6. Mobile and responsive findings
7. Performance, accessibility, and technical concerns
8. Prioritised issue table (ID, severity, file, finding, impact)
9. Proposed file-by-file modification plan (phases A–E)
10. Testing strategy
11. AIOS documents created/updated
12. Files not inspected and reasons
13. Explicit confirmation no theme files changed

## AIOS Documentation Required

After audit, create in piranav_aios only:
- `evidence/piranav/[client]-shopify-theme-audit-[date].md`
- `validation/piranav/[client]-audit-validation-[date].md`
- Update `source-map/README.md` with theme path
- Update `closure/README.md` with closure row
- Update `PROMPT_REGISTER.md` with row
- Update `docs/[client]/README.md` with audit link

---

## Customise Per Client

Replace `[client]` with the store slug (e.g., `homin-gmbh`, `ledsone-uk`).
Replace `[date]` with YYYY-MM-DD.
Adjust locale from `de.json` to the store's primary language if not German.
