# Validation — Conduit Task 7 Structured Data Implementation

**Date:** 2026-10-09
**Task:** CONDUIT-TASK7-2026-10-09
**Type:** Implementation validation
**Status:** PARTIAL — static PASS, Schema Markup Validator not run (pending Piranav instruction)

---

## Amendment — 2026-10-09 (template correction)

`schema_breadcrumb` removed from `collection.collection-pipe.json` locally. Piranav manually added the section via Shopify theme editor. Static validation re-run below reflects final state.

---

## Static Validation — PASS (14/14)

| # | Check | Result |
|---|---|---|
| 1 | ItemList JSON syntax (simulated) | PASS |
| 2 | BreadcrumbList JSON syntax (simulated) | PASS |
| 3 | ItemList: absolute URLs via request.origin | PASS |
| 4 | BreadcrumbList: absolute URLs via request.origin + shop.url | PASS |
| 5 | No relative-only URL risk in either snippet | PASS |
| 6 | product-grid (main-collection-product) still disabled in collection-pipe | PASS |
| 7 | schema_itemlist section present in template | PASS |
| 8 | schema_breadcrumb REMOVED from local template (per Piranav instruction) | PASS |
| 9 | FAQ Schema (custom_liquid_3pi7zt) still last in section order | PASS |
| 10 | schema_itemlist positioned before FAQ in order | PASS |
| 11 | schema_breadcrumb NOT in local order (removed) | PASS |
| 12 | forloop.last trailing comma guard present | PASS |
| 13 | ItemList @type value correct | PASS |
| 14 | BreadcrumbList @type value correct | PASS |

---

## Browser / Live Validation — 2026-10-09

All checks performed on draft theme: "Promotion Week 4.2 Mega Digital" — page: `https://ledsone.co.uk/collections/conduit-lighting`

### Block count and schema types

| Check | Status | Evidence |
|---|---|---|
| 5 JSON-LD blocks on page | **CONFIRMED** | Screenshot: `2026-10-09-task7-devtools-block-count-final.png` |
| 16 unique schema types | **CONFIRMED** | Screenshot: `2026-10-09-task7-devtools-block-count-final.png` + `2026-10-09-task7-devtools-schema-scan.png` |
| 0 invalid JSON-LD blocks | **CONFIRMED** | Screenshot: `2026-10-09-task7-devtools-block-count-final.png` |

### BreadcrumbList

| Check | Status | Evidence |
|---|---|---|
| BreadcrumbList present on page | **CONFIRMED** | Screenshot: `2026-10-09-task7-tinyseo-schema-detection.png` + `2026-10-09-task7-devtools-schema-scan.png` |
| BreadcrumbList: exactly 1 instance (no duplicate) | **CONFIRMED** | Screenshot: `2026-10-09-task7-breadcrumb-no-duplicate.png` — length=1 |
| BreadcrumbList: 2 entries (Home + Collection) | **CONFIRMED** | Screenshot: `2026-10-09-task7-breadcrumb-no-duplicate.png` — itemListElement=Array(2) |
| Position 1: name=Home, item=`https://ledsone.co.uk` | **CONFIRMED** | Screenshot: `2026-10-09-task7-breadcrumb-url-validation.png` |
| Position 2: name=Conduit Lighting, item=`https://ledsone.co.uk/collections/conduit-lighting` | **CONFIRMED** | Screenshot: `2026-10-09-task7-breadcrumb-url-validation.png` |
| Absolute URLs (no relative paths) | **CONFIRMED** | Screenshot: `2026-10-09-task7-breadcrumb-url-validation.png` |

### ItemList

| Check | Status | Evidence |
|---|---|---|
| ItemList present on page | **CONFIRMED** | TinySEO: Screenshot `2026-10-09-task7-tinyseo-schema-detection.png` |
| ItemList no duplicate (main-collection-product disabled) | **CONFIRMED** | Template: product-grid disabled=true, unchanged |
| Product URL spot-check (absolute URLs) | **NOT RUN** | Requires manual DevTools inspection of ItemList entries |

### FAQPage

| Check | Status | Evidence |
|---|---|---|
| FAQPage present on page | **CONFIRMED** | TinySEO: Screenshot `2026-10-09-task7-tinyseo-schema-detection.png` |
| `collection.metafields.custom.faq_schema` populated | **CONFIRMED** | FAQs rendering — 5 questions live |
| FAQ count: 5 questions | **CONFIRMED** | Piranav confirmation + theme preview |

### TinySEO detection

| Check | Status | Evidence |
|---|---|---|
| Website detected | **CONFIRMED** | Screenshot: `2026-10-09-task7-tinyseo-schema-detection.png` |
| Organization/LocalBusiness detected | **CONFIRMED** | Screenshot: `2026-10-09-task7-tinyseo-schema-detection.png` |
| FAQPage detected | **CONFIRMED** | Screenshot: `2026-10-09-task7-tinyseo-schema-detection.png` |
| ItemList detected | **CONFIRMED** | Screenshot: `2026-10-09-task7-tinyseo-schema-detection.png` |
| BreadcrumbList detected | **CONFIRMED** | Screenshot: `2026-10-09-task7-tinyseo-schema-detection.png` |

### Google Rich Results Test

| Check | Status | Evidence |
|---|---|---|
| Test run | **CONFIRMED** | Screenshot: `2026-10-09-task7-google-rich-results-test.png` |
| Crawled | **CONFIRMED** — 2026-10-09 09:29:23 | Screenshot: `2026-10-09-task7-google-rich-results-test.png` |
| Valid items detected | **2 valid items** — LocalBusiness × 1, Organisation × 1 | Screenshot: `2026-10-09-task7-google-rich-results-test.png` |
| BreadcrumbList as rich result | NOT SURFACED — expected, not eligible for rich result type | |
| ItemList as rich result | NOT SURFACED — expected, not eligible for rich result type | |
| FAQPage as rich result | NOT SURFACED — expected (collection context) | |

### Schema Markup Validator

| Check | Status | Notes |
|---|---|---|
| validator.schema.org run | **NOT RUN** | Awaiting Piranav instruction — not blocking |

---

## Pre-existing Issue — Not In Scope

`layout/theme.liquid` outputs 2 × `WebSite` schema blocks (lines 148 + 222). Both fire on every page. Present before Task 7. Not fixed in Task 7 scope.

---

## Architecture Discrepancy — Recorded

Shopify draft theme contains: `sections/collection-breadcrumb-schema.liquid`
Local file: `snippets/collection-breadcrumb-schema.liquid`

Must be reconciled before any push. See implementation record for full sync-risk warning.

---

## Files Changed This Implementation

| File | Change | Tracked |
|---|---|---|
| `snippets/collection-itemlist-schema.liquid` | CREATED | Untracked — pending commit |
| `snippets/collection-breadcrumb-schema.liquid` | CREATED | Untracked — pending commit |
| `templates/collection.collection-pipe.json` | MODIFIED — schema_itemlist added | Uncommitted |

---

## Overall Result

| Phase | Result |
|---|---|
| Static validation | PASS — 14/14 |
| Browser validation (BreadcrumbList) | PASS — all key checks confirmed |
| Browser validation (ItemList) | PARTIAL — present confirmed, product URL spot-check not run |
| Browser validation (FAQPage) | PASS — confirmed live, 5 FAQs |
| Google Rich Results Test | PASS — 2 valid items, no errors |
| Schema Markup Validator | NOT RUN — not blocking for PARTIAL status |

**Task 7 status: PARTIAL** — all major implementation goals confirmed live. Schema Markup Validator and ItemList URL spot-check remain open but are not blocking.
