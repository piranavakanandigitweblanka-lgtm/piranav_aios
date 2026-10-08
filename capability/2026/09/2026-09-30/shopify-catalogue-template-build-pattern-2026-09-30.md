# Capability — Shopify Catalogue Template Build Pattern

## Date First Identified
2026-09-30

## Last Updated
2026-09-30

## Status
PHASES 1–4 COMPLETE (LEDSone US). Phase 4 included AJAX debugging. Browser validation confirmed.

## Purpose
A multi-phase methodology for building a Shopify collection template with dynamic filtering, designed as a product catalogue experience. Covers theme discovery, data normalisation planning, template creation, and AJAX debugging.

## Business Problem Solved
Building a new Shopify collection template from scratch (not from an existing one) requires: understanding the theme's template/section/snippet architecture, planning any product data normalisation needed, creating the JSON template correctly, and debugging AJAX issues that arise from Shopify's dynamic section rendering. Without a structured approach, each phase creates problems for the next. This methodology sequences the work correctly.

## When To Use
- Creating a new Shopify collection template (e.g. `collection.catalogue.json`)
- The collection needs dynamic filtering (`filter_by_dynamic: true`)
- AJAX section rendering is suspected or confirmed to be used

## When NOT To Use
- Cloning an existing working template (different process — copy and adjust)
- Static collection pages without filtering

## Required Inputs
- Target Shopify theme (access via Shopify CLI or AIOS theme folder)
- Target collection handle
- Confirmed sections and snippets that should be included in the template

## Source Task / Requirement
LEDSone US Catalogue Build — Phases 1–4
shopify_projects/ledsone us/, 2026-09-30

## Phase Structure

### Phase 1 — Theme Discovery
Goal: Understand the theme's template/section/snippet architecture before writing any code.

Steps:
1. List all existing collection templates in `templates/`
2. Read each template's `sections` array to understand which sections are active
3. Read the primary collection section to understand render calls and block types
4. Identify the filtering section and confirm whether it uses `filter_by_dynamic`
5. Map the render chain: template → section → snippets → product-item

Evidence: `validation/piranav/ledsone-us-catalogue-discovery-2026-09-30.md`

### Phase 2A — Normalisation Discovery
Goal: Identify any product data that needs cleanup before the template can show correct results.

Steps:
1. Query `shopify_listings` for the target collection's products
2. Check `product_type`, tags, and `status` fields for inconsistencies
3. Produce a normalisation plan: which products need type/tag corrections, and how many

Report: `reports/ledsone-us-phase2b-shopify-change-plan-2026-09-30.md`

### Phase 2B — Shopify Change Plan
Document exactly which products need changes and what those changes are (type correction, tag addition, etc.). Get Piranav approval before making any Shopify changes.

### Phase 3 — Template Creation
Create `templates/collection.catalogue.json`:

```json
{
  "sections": {
    "collection-filter": {
      "type": "collection-meta-filters",
      "settings": {
        "filter_by_dynamic": true,
        "products_per_page": 24
      }
    }
  },
  "order": ["collection-filter"]
}
```

Key settings:
- `filter_by_dynamic: true` — enables AJAX-powered filtering
- Use the confirmed section `type` name from Phase 1 discovery
- Do not hardcode product data in the template JSON

Prompt: `prompts/shopify/ledsone-us-phase3-catalogue-template.md`

### Phase 4 — AJAX Debugging
Three common AJAX issues on new templates:

**Issue 1: `?view=catalogue` 404**
Cause: Template file exists but `view` parameter doesn't match the template filename suffix.
Fix: Confirm template is named `collection.catalogue.json` and the URL uses `?view=catalogue`.

**Issue 2: DOM attribute lost after AJAX re-render**
Cause: `renderSectionFilter()` replaces the section's outer HTML. Any DOM attributes added before AJAX fire (e.g. `data-section-id`) are overwritten.
Fix: Re-apply DOM attributes inside the AJAX success callback, after the new HTML is inserted.

**Issue 3: CSS not loaded for AJAX-injected HTML**
Cause: CSS for the filter section was preloaded via `<link rel="preload">` but not applied to the AJAX response.
Fix: Move the `<link rel="stylesheet">` into the section template rather than `<head>`, OR ensure the AJAX response includes a `<link>` tag that the browser will apply.

Prompt: `prompts/shopify/ledsone-us-catalogue-debug-fix.md`

## Evidence Required
- Phase 1: Theme architecture map (which sections are used)
- Phase 3: Template file created and visible in theme
- Phase 4: Collection URL loads correctly with AJAX filtering working

## Evidence Path
`validation/piranav/ledsone-us-catalogue-discovery-2026-09-30.md`
`validation/piranav/ledsone-us-catalogue-ajax-fix-2026-09-30.md`
`validation/piranav/ledsone-us-catalogue-ui-fix-2026-09-30.md`
`reports/ledsone-us-phase2b-shopify-change-plan-2026-09-30.md`
`prompts/shopify/ledsone-us-theme-discovery.md`
`prompts/shopify/ledsone-us-phase3-catalogue-template.md`
`prompts/shopify/ledsone-us-catalogue-debug-fix.md`

## Pass / Fail Rule
PASS: Collection template loads at the target URL. Products display. AJAX filtering works (page updates without full reload). No console errors.
FAIL: 404 on target URL, OR filtering triggers a full page reload, OR CSS missing after AJAX.

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator

## Known Limits
- `filter_by_dynamic` requires the Shopify theme to support this setting — verify in the section's schema before using
- AJAX debugging issues are theme-specific; the three listed above were confirmed for LEDSone US but other themes may have different issues
- Phase 2 normalisation changes (product type/tag corrections) must be done in Shopify Admin and require Piranav approval before execution

## Reuse Path
Follow the four-phase sequence for any new Shopify catalogue template build. Phases 1 and 2 are discovery-only (no code). Phase 3 creates the template JSON. Phase 4 debugs AJAX. Each phase produces documented evidence before the next begins.

## Related Capabilities
- `shopify-collection-card-stock-price-fix-2026-10-07.md` — also concerns collection template rendering
- `shopify-collection-specific-swatch-guard-2026-10-08.md` — also concerns collection-level Liquid behaviour

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-09-30 | Initial capability captured from LEDSone US Catalogue Phases 1–4 | `validation/piranav/ledsone-us-catalogue-discovery-2026-09-30.md`, `ledsone-us-catalogue-ajax-fix-2026-09-30.md` |
