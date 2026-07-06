---
title: Requirement 01 — Handover to Hetheesa
purpose: Final handover summary for Top-Selling Products SEO Report
requirement_source: "What I Need to Improve SEO Performance - Hetheesa_.csv"
staff: Hetheesa
supporting_aios: Piranav
date: 2026-07-03
status: DEPLOYED — LIVE — PASS
---

# Handover — Requirement 01: Top-Selling Products SEO Report

## Summary
The Top-Selling Products SEO Report for ledsone.fr has been built and deployed live.

The dashboard covers **48 products** (top 50 by revenue — ShopifyQL returned 48 unique revenue rows) from the last 30 days, combining:
- Shopify revenue data (ShopifyQL)
- Shopify product SEO data (Admin GraphQL)
- Google Search Console page-level data (PostgreSQL)

## Live Dashboard URL

```
https://digital-marketing-member-pages.vercel.app/pages/hetheesha.html
```

Deployed via GitHub auto-deploy. Commit: `0f40919`

## Standalone Report File
```
C:\Users\PC\Documents\piranav_aios\reports\hetheesa\requirement-01-top-selling-products-seo.html
```
Open in any browser. No internet required — fully standalone HTML/CSS/JS.

## Key Findings for Hetheesa

### Urgent — Fix Immediately
| Issue | Count | Revenue at Risk |
|-------|-------|----------------|
| Missing Meta Titles | 6 products | €467 combined |
| Missing Meta Descriptions | 7 products | €483 combined |
| Both title + desc missing | 5 products | ~€400 combined |

**Top priority products (high revenue + SEO issues):**
1. **Rank 3 — ~2153 (€165)** — No meta title, no meta description, ALL 10 images missing alt text
2. **Rank 4 — ~1647 (€163)** — No meta title, no meta description
3. **Rank 9 — ~1528 (€101)** — No meta title, no meta description
4. **Rank 10 — ~3646 (€101)** — No meta title, no meta description

### Important — Fix Soon
| Issue | Count |
|-------|-------|
| Meta Title Too Long (>60 chars) | 12 products |
| Meta Description Too Long (>160 chars) | 10 products |
| Meta Description Too Short (<120 chars) | 4 products |
| Products with 5+ missing image alt texts | 21 products |

### GSC Opportunity — High Impressions / Very Low CTR
| Product | Revenue | Impressions | CTR | Opportunity |
|---------|---------|-------------|-----|-------------|
| Suspension Araignée 5 Fils ~1542 | €108 | **3,143** | **0.06%** | High — fix meta title & desc |
| Suspension Extérieure IP65 ~1545 | €15 | **883** | **0.76%** | Fix meta desc (Too Long) |
| Lustre Araignée Industriel ~1541 | €289 | 398 | 0.51% | Fix alt text (2 missing) |
| Octopus Suspension ~1507 | €108 | 244 | 0.40% | Fix alt text (all 10 missing) |

**Most impactful quick win:** Product rank 7 (`multi-shade-2m-pendant-light`) has 3,143 impressions but only 0.06% CTR. It already ranks well in Google — improving the meta title and description alone could bring 5–10x more clicks with no ranking work needed.

### FAQ Schema
All 48 products are missing FAQ schema. Adding FAQ structured data (via a Shopify FAQ app or theme customisation) could:
- Generate rich results in Google search
- Increase CTR across the board
- Improve visibility for question-based searches in French

**Recommendation:** Discuss with dev team / Piranav to evaluate FAQ schema implementation.

## How to Use the Dashboard
1. Open the live URL or the local HTML file in Chrome/Edge
2. Use **search box** to find a specific product
3. Use **filter buttons** to narrow: Missing Meta Title / Low CTR / etc.
4. Click any **column header** to sort
5. Click **Export CSV** to download filtered data for sharing or tracking

## Files Delivered

| File | Path |
|------|------|
| Live dashboard | https://digital-marketing-member-pages.vercel.app/pages/hetheesha.html |
| Standalone dashboard HTML | `reports/hetheesa/requirement-01-top-selling-products-seo.html` |
| Prompt | `prompts/hetheesa/requirement-01-top-selling-products-seo-prompt.md` |
| Evidence: Assets Check | `evidence/hetheesa/requirement-01-existing-assets-check.md` |
| Evidence: PostgreSQL | `evidence/hetheesa/requirement-01-postgresql-inspection.md` |
| Evidence: Shopify SEO | `evidence/hetheesa/requirement-01-shopify-seo-audit.md` |
| Evidence: GSC Data | `evidence/hetheesa/requirement-01-gsc-data-check.md` |
| Evidence: Data Mapping | `evidence/hetheesa/requirement-01-data-mapping.md` |
| Validation | `validation/hetheesa/requirement-01-validation.md` |
| Handover (this file) | `handover/hetheesa/requirement-01-handover.md` |
| Vercel Deployment Notes | `vercel/hetheesa/requirement-01-vercel-notes.md` |

## Known Limitations
1. H1 status assumed from product title (not verified via live HTML parse)
2. FAQ schema marked Missing for all products (assumption: no FAQ app installed)
3. 36 of 48 products have no GSC impression data — these are likely not ranking for any keywords, or have very low visibility
4. Revenue is gross sales (before discounts/returns); net sales also available in data
5. Alt text checked for first 10 images only per product

## Next Steps for Hetheesa
- [ ] Fix missing meta titles for rank 3, 4, 9, 10 products first
- [ ] Shorten too-long meta titles (12 products)
- [ ] Prioritise meta description rewrite for rank 7 (3,143 impressions — low CTR)
- [ ] Bulk alt text update for products with 10/10 missing alt texts
- [ ] Request FAQ schema implementation from dev team
- [ ] Share dashboard with GPT for Requirement 02 planning

## Deployment Record
- **Commit:** `0f40919`
- **Method:** GitHub auto-deploy (no manual Vercel CLI)
- **Verified live:** 2026-07-03
- **Live URL confirmed by:** WebFetch — page title + H1 matched expected content

## Reviewer
Piranav (AIOS worker)

## Status
DEPLOYED BY GITHUB AUTO-DEPLOY — LIVE — PASS — 2026-07-03

---

## Update — 2026-07-06: Filter System Fix + Data Source Mapping

### Changes Made
- **All JS functions scoped to `r1_` prefix** — `r1_filter()`, `r1_sort()`, `r1_render()`, `r1_exportCSV()`, `r1_getRows()`, `r1_classified()` etc. Prevents any conflicts with future Req 2–5 implementations.
- **Button IDs renamed** — `btnAll` → `r1BtnAll`, etc. to avoid cross-tab ID collisions.
- **Search input ID renamed** — `searchBox` → `r1SearchBox`.
- **`.fbtn` selector scoped** — `querySelectorAll('.fbtn')` → `querySelectorAll('#tab-panel-1 .fbtn')`. Only Req 1 buttons are toggled.
- **FAQ filter logic fixed** — Old code was `return true` (bypassed check). New: `r1_classified()` sets `faq='Missing'` as an explicit named property; filter checks `p.faq === 'Missing'`. Search now stacks correctly with FAQ filter.

### Data Source Mapping Confirmed
See `evidence/hetheesa/requirement-01-data-source-mapping.md` and `requirement-01-postgresql-shopify-gsc-check.md` for full column-by-column breakdown.

### Validation
All 12 filter tests PASS. See `validation/hetheesa/requirement-01-filter-validation.md`.
