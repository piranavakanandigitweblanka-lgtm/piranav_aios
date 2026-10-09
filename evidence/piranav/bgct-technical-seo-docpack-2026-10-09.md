# Evidence — BGCT Technical SEO Documentation Pack

**Session date:** 2026-10-09
**Staff:** Piranav
**Task ID:** BGCT-TECHDOC-001
**Status:** COMPLETE — DRAFT (pending reviewer approval)

---

## Source Workbook

| Field | Value |
|---|---|
| File name | `_Technical SEO Tasks BGCT (1).xlsx` |
| Path | `C:\Users\PC\Downloads\_Technical SEO Tasks BGCT (1).xlsx` |
| Worksheets found | 4 |
| Total tasks extracted | 29 |
| Workbook modified | NO — read-only access |

## Worksheets Inspected

| Worksheet | Tasks |
|---|---|
| Site Structure & Crawlability | 7 (SS-1 to SS-7) |
| On-Page SEO | 8 (OP-1 to OP-8) |
| Performance (Core Web Vitals) | 8 (CWV-1 to CWV-8) |
| Shopify-Specific SEO | 6 (SH-1 to SH-6) |

## Existing AIOS Assets Checked Before Creation

| Asset | Location | Decision |
|---|---|---|
| `docs/seo/INDEX.md` | `docs/seo/INDEX.md` | Existing — covers ledsone-specific docs. BGCT pack is distinct. No duplication. |
| `evidence/hetheesa/requirement-01-shopify-seo-audit.md` | `evidence/hetheesa/` | Existing — different task/person. Not equivalent. |
| `evidence/hetheesa/requirement-03-canonical-bugfix.md` | `evidence/hetheesa/` | Existing — specific bugfix evidence, not a documentation template. |
| `capability/2026/10/2026-10-06/shopify-robots-txt-pagination-pattern-2026-10-06.md` | `capability/` | Existing capability note — content absorbed into robots.txt and pagination documentation. |

## Files Created

| File | Type | Worksheet | Status |
|---|---|---|---|
| `docs/bgct-technical-seo/README.md` | Index + Coverage Matrix | All | DRAFT |
| `docs/bgct-technical-seo/01-site-structure-crawlability/best-practice.md` | Best Practice | Sheet 1 | DRAFT |
| `docs/bgct-technical-seo/01-site-structure-crawlability/guidelines.md` | Guidelines | Sheet 1 | DRAFT |
| `docs/bgct-technical-seo/01-site-structure-crawlability/checklist.md` | Checklist | Sheet 1 | DRAFT |
| `docs/bgct-technical-seo/01-site-structure-crawlability/tutorial.md` | Tutorial | Sheet 1 | DRAFT |
| `docs/bgct-technical-seo/02-on-page-seo/best-practice.md` | Best Practice | Sheet 2 | DRAFT |
| `docs/bgct-technical-seo/02-on-page-seo/guidelines.md` | Guidelines | Sheet 2 | DRAFT |
| `docs/bgct-technical-seo/02-on-page-seo/checklist.md` | Checklist | Sheet 2 | DRAFT |
| `docs/bgct-technical-seo/02-on-page-seo/tutorial.md` | Tutorial | Sheet 2 | DRAFT |
| `docs/bgct-technical-seo/03-performance-core-web-vitals/best-practice.md` | Best Practice | Sheet 3 | DRAFT |
| `docs/bgct-technical-seo/03-performance-core-web-vitals/guidelines.md` | Guidelines | Sheet 3 | DRAFT |
| `docs/bgct-technical-seo/03-performance-core-web-vitals/checklist.md` | Checklist | Sheet 3 | DRAFT |
| `docs/bgct-technical-seo/03-performance-core-web-vitals/tutorial.md` | Tutorial | Sheet 3 | DRAFT |
| `docs/bgct-technical-seo/04-shopify-specific-seo/best-practice.md` | Best Practice | Sheet 4 | DRAFT |
| `docs/bgct-technical-seo/04-shopify-specific-seo/guidelines.md` | Guidelines | Sheet 4 | DRAFT |
| `docs/bgct-technical-seo/04-shopify-specific-seo/checklist.md` | Checklist | Sheet 4 | DRAFT |
| `docs/bgct-technical-seo/04-shopify-specific-seo/tutorial.md` | Tutorial | Sheet 4 | DRAFT |
| `prompts/seo/bgct-technical-seo-doc-pack-prompt.md` | Prompt | All | ACTIVE |
| `evidence/piranav/bgct-technical-seo-docpack-2026-10-09.md` | This file | All | COMPLETE |
| `validation/piranav/bgct-technical-seo-docpack-validation-2026-10-09.md` | Validation | All | COMPLETE |

## Technical Claims Flagged for Human Review

| Claim | File | Flag |
|---|---|---|
| "Keep meta title under 60 characters" | 02-on-page-seo/best-practice.md | VERIFY — Google truncates by pixel width (~580px), not character count. 55–65 chars is a practical range. |
| "Exactly one H1 per page" | 02-on-page-seo/best-practice.md | VERIFY — Not a Google requirement; accepted accessibility/team standard. Flagged for team confirmation. |
| "Banner images under 300KB, product images under 150KB" | 03-performance-core-web-vitals/best-practice.md | ASSUMPTION — Reasonable team guideline, not an official Google threshold. |
| "INP < 200ms" | 03-performance-core-web-vitals/best-practice.md | CONFIRMED — Official Google Core Web Vitals threshold (post-March 2024). |
| "Fake reviews = manual penalty" | 02-on-page-seo/best-practice.md | CONFIRMED — Google review snippet policies prohibit incentivised/fake reviews. |

## Duplicate-Risk Assessment

| Risk | Decision |
|---|---|
| `docs/seo/INDEX.md` and new `docs/bgct-technical-seo/README.md` | Separate concerns — ledsone-specific vs BGCT task-based. No duplication. Recommend adding a cross-reference link in `docs/seo/INDEX.md`. |
| Existing robots.txt capability file and new SH-5/SS-4 content | Existing file is a brief capability note. New files are full documentation. No conflict; new files are authoritative for BGCT tasks. |

## Pass Criteria Check

| Criterion | Status |
|---|---|
| Every original BGCT task is accounted for | ✅ 29/29 tasks — 100% coverage |
| All four resources identifiable per task | ✅ |
| Documents are evidence-aware and self-explanatory | ✅ |
| Technical recommendations are supported or flagged | ✅ |
| Existing assets checked before new files created | ✅ |
| Original workbook unchanged | ✅ |
| All deliverables inside approved AIOS folder | ✅ |

## Overall: PASS (pending reviewer approval — all documents remain DRAFT)
