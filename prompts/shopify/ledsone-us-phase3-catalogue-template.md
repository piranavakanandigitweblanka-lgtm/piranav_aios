# Prompt: LEDSone US Phase 3 — Shopify Catalogue Template Implementation

**Category:** shopify / catalogue / implementation
**Reusable for:** Any Umino v2.x Shopify store needing a clean, reusable collection catalogue template
**Phase:** 3 — Template Implementation (comes after Phase 2B change plan execution)
**Status:** ACTIVE — used 2026-09-30

---

## ROLE

You are a Shopify Theme Implementation Engineer. Your job is to build a reusable collection catalogue template using the store's existing section and snippet architecture.

---

## CONSTRAINTS (always active)

- DO NOT modify existing collection templates
- DO NOT modify products, variants, collections, metafields
- DO NOT modify PostgreSQL
- DO NOT hard-code product IDs or collection handles
- DO NOT create new Liquid sections or snippets — reuse existing
- DO NOT add new JavaScript or CSS dependencies
- Shopify MCP is unauthorized — file-based implementation only
- PRIMARY FILE: `templates/collection.catalogue.json` only

---

## PRE-IMPLEMENTATION CHECKLIST

Before creating the file:
1. Read all existing collection templates (collection.json, collection.*.json)
2. Identify the canonical product grid section name and type
3. Confirm `filter_by_dynamic` block is active in existing templates
4. Identify which sections are disabled demo content (safe to exclude)
5. Note the colour scheme ID used in the existing heading section
6. Search AIOS for any previous catalogue template work

---

## IMPLEMENTATION APPROACH

Create `templates/collection.catalogue.json` using Shopify JSON template format:

```json
{
  "sections": { ... },
  "order": [ ... ]
}
```

**Required sections (enabled):**
1. `main-collection-heading` — dynamic collection title. No banner, no hardcoded text.
2. `main-collection-product` — canonical product grid with `filter_by_dynamic` block
3. `custom-liquid` — renders `collection.description` if present (SEO value)
4. `custom-html` — review buttons (brand consistency)
5. `subscribe-form` — email signup

**Optional sections (disabled: true — merchant can enable):**
6. `sub-collection` — child collection carousel

**Do NOT include:**
- `lookbook` (requires hardcoded product handles)
- `collection-list` with hardcoded collection slugs
- `spacing` decorative sections (not needed in clean catalogue)

**Product grid settings (for catalogue use case):**
- `products_column: 4` — better density with filter sidebar visible
- `number_products_grid: 24`
- `pagination: infinit_scrolling`
- `sidebar_position: dropdonw_sidebar`
- `enable_sidebar: true`
- `product_sort_options: true`
- `product_page_count: true`
- `progress_bar: true`
- `show_count: true`

**Section key naming convention:** prefix all with `catalogue-` to avoid collisions with other templates.

---

## VALIDATION (static — before CLI push)

1. JSON parses without errors (`python -c "import json; json.load(open(f))"`)
2. All sections in `order` array exist in `sections` object
3. No hardcoded product handles or collection handles
4. `filter_by_dynamic` block present and active
5. No existing template files modified
6. Section types match existing templates

---

## VALIDATION (live — after CLI push)

1. Assign template to a test collection in Shopify Admin
2. Visit the collection URL — products load correctly
3. Apply the same template to a second collection — that collection's products load
4. Filter sidebar appears (if S&D app is configured)
5. Sort dropdown works
6. Infinite scroll loads next page
7. Product links work (go to correct product pages)
8. Mobile breakpoints render correctly
9. No console errors

---

## AIOS AUTO-UPDATE

After implementation:
1. Save prompt → this file (Rule 1 — before task executes)
2. Append Phase 3 section to existing evidence file
3. Append Phase 3 checklist to existing validation file
4. Add new row to PROMPT_REGISTER.md
5. Add closure entry to closure/README.md

---

## PASS CONDITION

PASS when:
- `templates/collection.catalogue.json` exists and is valid JSON
- No existing templates modified
- `filter_by_dynamic` block active in product grid section
- No hardcoded products or collections
- Static validation checks all pass
- AIOS files updated
