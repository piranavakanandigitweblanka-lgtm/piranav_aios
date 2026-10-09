# Screenshot Manifest — Conduit Task 7 Structured Data

**Date:** 2026-10-09
**Task:** CONDUIT-TASK7-2026-10-09
**Evidence folder:** `evidence/shopify/conduit-task7-structured-data/`
**Originals location:** `C:\Users\PC\OneDrive\Pictures\Screenshots` (untouched)

---

## Files

| Destination filename | Source timestamp | What it proves |
|---|---|---|
| `2026-10-09-task7-tinyseo-baseline-no-breadcrumb.png` | 083139 | TinySEO baseline scan before breadcrumb fix. Shows Website, Organization/LocalBusiness, FAQPage, ItemList detected. BreadcrumbList absent. Confirms pre-fix state. |
| `2026-10-09-task7-devtools-block-types-baseline.png` | 085017 | Chrome DevTools baseline: 5 JSON-LD blocks present. BLOCK 3 type=WebSite visible. BreadcrumbList not in block list. |
| `2026-10-09-task7-devtools-schema-scan-baseline.png` | 085130 | Chrome DevTools recursive schema type scan: 16 schema types listed, BreadcrumbList absent. Confirms pre-fix schema inventory. |
| `2026-10-09-task7-vscode-section-file-implementation.png` | 091118 | VS Code showing `sections/collection-breadcrumb-schema.liquid` — confirms Piranav's manual Shopify theme editor section creation (sections/ folder, not snippets/). Reveals architecture discrepancy. |
| `2026-10-09-task7-tinyseo-schema-detection.png` | 091308 | TinySEO FINAL scan: Website, Organization/LocalBusiness, FAQPage, ItemList, BreadcrumbList all confirmed present. BreadcrumbList addition verified. |
| `2026-10-09-task7-google-rich-results-test.png` | 093248 | Google Rich Results Test result: 2 valid items detected (LocalBusiness × 1, Organisation × 1). Crawled 2026-10-09 09:29:23. BreadcrumbList/ItemList/FAQPage not surfaced as rich result types (expected — not eligible). |
| `2026-10-09-task7-devtools-schema-scan.png` | 093719 | Chrome DevTools schema scan WITH BreadcrumbList: 5 blocks, 16 schema types, BreadcrumbList confirmed in full schema table. Post-fix state. |
| `2026-10-09-task7-devtools-block-count-final.png` | 093804 | Chrome DevTools console: blockCount=5, schemaTypes=16, invalidBlocks=0. All values confirmed final state. |
| `2026-10-09-task7-breadcrumb-no-duplicate.png` | 093834 | Chrome DevTools: BreadcrumbList array length=1 (no duplicate), itemListElement=Array(2). Confirms single instance, correct entry count. |
| `2026-10-09-task7-breadcrumb-url-validation.png` | 093918 | Chrome DevTools BreadcrumbList table: position 1 = Home → `https://ledsone.co.uk`, position 2 = Conduit Lighting → `https://ledsone.co.uk/collections/conduit-lighting`. Absolute URLs confirmed correct. |

---

## Evidence Summary

| Finding | Verified by |
|---|---|
| 5 JSON-LD blocks on page | 093804 screenshot |
| 16 unique schema types | 093719 + 093804 screenshots |
| 0 invalid JSON-LD blocks | 093804 screenshot |
| BreadcrumbList present (1 instance) | 091308 + 093719 + 093804 + 093834 screenshots |
| BreadcrumbList entries: 2 (Home + Conduit Lighting) | 093834 + 093918 screenshots |
| Breadcrumb URLs correct and absolute | 093918 screenshot |
| ItemList present | TinySEO 091308 screenshot |
| FAQPage present (5 questions) | TinySEO 091308 + theme confirmation |
| Google Rich Results: 2 valid (LocalBusiness, Organisation) | 093248 screenshot |
| Sections/ vs snippets/ architecture discrepancy | 091118 screenshot |

---

## Architecture Discrepancy — Recorded

Shopify draft theme contains: `sections/collection-breadcrumb-schema.liquid` (created manually by Piranav via theme editor)
Local file: `snippets/collection-breadcrumb-schema.liquid`

These are architecturally different. Must be reconciled before any push of snippet or template files.
See implementation record for sync-risk warning.
