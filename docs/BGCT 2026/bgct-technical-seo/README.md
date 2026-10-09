# BGCT Technical SEO Documentation Pack

**Status:** DRAFT — Pending review by Sajeesan (Technical Reviewer) and Tamil Selvan (Queryability Reviewer)
**Created:** 2026-10-09
**Owner:** Piranav (Website Tec team)
**Coordinator:** Sathees
**Technical Reviewer:** Sajeesan / assigned senior developer
**Queryability Reviewer:** Tamil Selvan / assigned reviewer
**Business Validator:** Relevant domain owner

---

## Purpose

This documentation pack translates every task in the BGCT Technical SEO workbook into four practical, self-contained resources:

1. **Best Practice** — recommended approach with rationale, trade-offs, and Shopify-specific considerations
2. **Guidelines** — decision rules, priority guidance, escalation conditions, and safe boundaries
3. **Checklist** — individual auditable checks with tool, procedure, expected result, and PASS/FAIL criteria
4. **Tutorial** — step-by-step execution instructions that can be followed without verbal explanation

---

## Source Workbook

| Field | Value |
|---|---|
| File | `_Technical SEO Tasks BGCT (1).xlsx` |
| Location | `C:\Users\PC\Downloads\` (read-only — not modified) |
| Worksheets | 4 (see below) |
| Total tasks | 29 |

---

## Worksheets and Task Count

| # | Worksheet | Tasks | Documentation Folder |
|---|---|---|---|
| 1 | Site Structure & Crawlability | 7 | `01-site-structure-crawlability/` |
| 2 | On-Page SEO | 8 | `02-on-page-seo/` |
| 3 | Performance (Core Web Vitals) | 8 | `03-performance-core-web-vitals/` |
| 4 | Shopify-Specific SEO | 6 | `04-shopify-specific-seo/` |

---

## Documentation Files

```
docs/bgct-technical-seo/
├── README.md                             ← This file (index + coverage matrix)
├── 01-site-structure-crawlability/
│   ├── best-practice.md
│   ├── guidelines.md
│   ├── checklist.md
│   └── tutorial.md
├── 02-on-page-seo/
│   ├── best-practice.md
│   ├── guidelines.md
│   ├── checklist.md
│   └── tutorial.md
├── 03-performance-core-web-vitals/
│   ├── best-practice.md
│   ├── guidelines.md
│   ├── checklist.md
│   └── tutorial.md
└── 04-shopify-specific-seo/
    ├── best-practice.md
    ├── guidelines.md
    ├── checklist.md
    └── tutorial.md
```

---

## Task-by-Task Coverage Matrix

| # | Task Name | Sheet | Best Practice | Guidelines | Checklist | Tutorial |
|---|---|---|---|---|---|---|
| SS-1 | Fix Crawl Errors | Site Structure | ✅ | ✅ | ✅ | ✅ |
| SS-2 | Broken Links (404s) | Site Structure | ✅ | ✅ | ✅ | ✅ |
| SS-3 | Redirect Chains | Site Structure | ✅ | ✅ | ✅ | ✅ |
| SS-4 | Optimize robots.txt | Site Structure | ✅ | ✅ | ✅ | ✅ |
| SS-5 | Optimize sitemap.xml | Site Structure | ✅ | ✅ | ✅ | ✅ |
| SS-6 | Canonical Tag Audits & Fixes | Site Structure | ✅ | ✅ | ✅ | ✅ |
| SS-7 | Hreflang Setup for Multilingual | Site Structure | ✅ | ✅ | ✅ | ✅ |
| OP-1 | Meta Titles Optimization | On-Page SEO | ✅ | ✅ | ✅ | ✅ |
| OP-2 | Meta Descriptions Optimization | On-Page SEO | ✅ | ✅ | ✅ | ✅ |
| OP-3 | Heading Structure (H1–H6) Cleanup | On-Page SEO | ✅ | ✅ | ✅ | ✅ |
| OP-4 | Image Alt Text Audits | On-Page SEO | ✅ | ✅ | ✅ | ✅ |
| OP-5 | Schema/Structured Data (Product) | On-Page SEO | ✅ | ✅ | ✅ | ✅ |
| OP-6 | Schema/Structured Data (Breadcrumb) | On-Page SEO | ✅ | ✅ | ✅ | ✅ |
| OP-7 | Schema/Structured Data (FAQ & Review) | On-Page SEO | ✅ | ✅ | ✅ | ✅ |
| OP-8 | Duplicate Content Fixes | On-Page SEO | ✅ | ✅ | ✅ | ✅ |
| CWV-1 | Page Speed Audits: LCP | Performance | ✅ | ✅ | ✅ | ✅ |
| CWV-2 | Page Speed Audits: CLS | Performance | ✅ | ✅ | ✅ | ✅ |
| CWV-3 | Page Speed Audits: INP | Performance | ✅ | ✅ | ✅ | ✅ |
| CWV-4 | Image Compression | Performance | ✅ | ✅ | ✅ | ✅ |
| CWV-5 | Lazy Loading | Performance | ✅ | ✅ | ✅ | ✅ |
| CWV-6 | Unused JS Removal | Performance | ✅ | ✅ | ✅ | ✅ |
| CWV-7 | Unused CSS Removal | Performance | ✅ | ✅ | ✅ | ✅ |
| CWV-8 | Third-party Scripts | Performance | ✅ | ✅ | ✅ | ✅ |
| SH-1 | Collection URL Structure | Shopify SEO | ✅ | ✅ | ✅ | ✅ |
| SH-2 | Product URL Structure | Shopify SEO | ✅ | ✅ | ✅ | ✅ |
| SH-3 | Pagination Handling | Shopify SEO | ✅ | ✅ | ✅ | ✅ |
| SH-4 | Infinite Scroll Fixes | Shopify SEO | ✅ | ✅ | ✅ | ✅ |
| SH-5 | Duplicate URLs from Faceted Navigation | Shopify SEO | ✅ | ✅ | ✅ | ✅ |
| SH-6 | Blog SEO Optimization | Shopify SEO | ✅ | ✅ | ✅ | ✅ |

**Coverage: 29/29 tasks — 100%**

---

## Technical Claims Flagged for Human Review

| Ref | Claim | Flag | Reviewer Action |
|---|---|---|---|
| OP-1 | "Keep meta title under 60 characters" | VERIFY — Google truncates at ~580px, not a fixed character count. 55–65 chars is a practical guide, not a hard rule. | Confirm acceptable range with team. |
| OP-3 | "Exactly one H1 per page" | VERIFY — Google has stated multiple H1s are not a ranking issue but are an accessibility concern. Workbook rule is defensible practice. | Confirm team standard. |
| CWV-4 | "Banner images under 300KB, product images under 150KB" | ASSUMPTION — These are reasonable targets but not official Google thresholds. Actual budget depends on image dimensions and CLS impact. | Accept as team guideline or adjust. |
| SS-4 | robots.txt typo can deindex entire site | CONFIRMED — Official Google documentation confirms this risk. |  No action needed. |
| OP-7 | "Fake reviews result in manual penalty" | CONFIRMED — Google's review snippet policies explicitly prohibit incentivised/fake reviews. | No action needed. |

---

## Known Limitations

- All documents are DRAFT status. Technical reviewer must confirm Shopify Liquid code examples before team rollout.
- Source URLs in the workbook Tutorial columns have not been live-verified (some may have changed).
- The "exactly one H1" rule from the workbook is treated as a team standard, not a Google requirement.
- Hreflang (SS-7) documentation only covers Shopify Markets approach; manual implementation is referenced as a don't.

---

## Recommended Next Action

1. Sajeesan to review Liquid code examples in all four Tutorial files.
2. Tamil Selvan to confirm each task can be identified using only the task name via this README.
3. Sathees to approve as coordinator before promoting to team use.
4. After approval: update status from DRAFT to APPROVED in each file header.
5. Add this pack to `docs/seo/INDEX.md` under a new "BGCT Task Documentation" section.

---

## Related AIOS Assets

| Asset | Path |
|---|---|
| Evidence | `evidence/piranav/bgct-technical-seo-docpack-2026-10-09.md` |
| Validation | `validation/piranav/bgct-technical-seo-docpack-validation-2026-10-09.md` |
| Prompt | `prompts/seo/bgct-technical-seo-doc-pack-prompt.md` |
| Closure | `closure/README.md` — session 2026-10-09 |
