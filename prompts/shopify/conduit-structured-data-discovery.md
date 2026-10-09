# Prompt: Conduit Lighting Collection — Structured Data Discovery

**Category:** shopify / seo / schema
**Created:** 2026-10-09
**Reusable for:** Any Shopify collection page where JSON-LD structured data needs to be audited or added

---

## Prompt

```
You are performing a structured data (JSON-LD) discovery for a Shopify collection page.

Target URL: [COLLECTION_URL]
Reference URL (duplicate or comparison): [DUPLICATE_URL]
Theme directory: [THEME_PATH]
Active template for this collection: [TEMPLATE_FILENAME]

## Discovery tasks

1. AIOS duplicate check — search existing docs for prior schema work on this collection
2. Inspect theme.liquid for global JSON-LD blocks (WebSite, Organization, etc.)
3. Identify the active template JSON for the target collection — list all section types and their disabled state
4. For each section in the template, check whether it outputs JSON-LD schema (application/ld+json)
5. Inspect any snippets called from sections that may output JSON-LD (e.g. product-faq-ui.liquid)
6. Check the sections/breadcrumb.liquid, sections/main-collection-product.liquid for schema output
7. Compare the main and duplicate templates — identify which sections are enabled vs disabled
8. Fetch both live pages — extract canonical tags and visible product list
9. Confirm FAQPage: is it conditional on a metafield? If so, is the metafield populated?

## Output required

A. Schemas currently present on main page
B. Schemas currently present on duplicate page
C. Theme files responsible for each schema
D. Schemas that are MISSING from main page
E. Why differences exist between main and duplicate
F. Recommended minimal implementation — which files to create, which to modify
G. Risks: duplicate schemas, section conflicts, Liquid product limits
H. Validation plan: Google Rich Results Test, Schema Markup Validator, DevTools inspection
I. FAQPage status: live or pending

## Constraints

- DISCOVERY ONLY — do not modify any files
- Do not fabricate schema content — use actual collection data
- Do not add FAQs unless they are already live in a metafield
- Note: Google Rich Results eligibility ≠ schema syntax validity. Do not promise rich result display.
```

---

## Usage notes

- Applied to Conduit Lighting collection (conduit-lighting vs conduit-lightings) 2026-10-09
- Key finding: ItemList exists in `main-collection-product` but disabled in collection-pipe template — extract as snippet instead of enabling the section
- Key finding: BreadcrumbList section exists but adds visual breadcrumb too — use schema-only snippet instead
- FAQPage is already wired via `product-faq-ui.liquid` → metafield `collection.metafields.custom.faq_schema`
