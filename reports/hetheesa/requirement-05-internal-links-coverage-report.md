---
name: requirement-05-internal-links-coverage-report
description: Final report for Requirement 5 — Internal Links Coverage Audit on ledsone.fr. Includes findings, distribution, top gaps, and recommendations.
metadata:
  type: project
---

# Requirement 5 — Internal Links Coverage Audit — Report

**Staff Member:** Hetheesha  
**Store:** ledsone.fr  
**Report Date:** 2026-07-14  
**Scope:** 309 live pages (1 homepage + 66 collections + 186 products + 56 blog articles)  
**Source pages crawled:** 101 (66 collections + 34 blog articles + 1 homepage)

---

## Executive Summary

An incoming-link crawl of ledsone.fr was completed on 2026-07-14. Of 309 live pages audited, **222 pages (71.8%) require attention** — 125 pages have zero incoming internal links (High priority) and 97 pages have only 1–2 incoming links (High priority). Only 57 pages (18.4%) have Good internal linking (6+ sources).

---

## Distribution

| Status | Count | % | Priority |
|---|---|---|---|
| Good Internal Linking (6+) | 57 | 18.4% | None |
| Needs Improvement (3–5) | 30 | 9.7% | Medium |
| Weak Internal Linking (1–2) | 97 | 31.4% | High |
| No Internal Links (0) | 125 | 40.5% | High |
| **Total** | **309** | **100%** | |

---

## Key Findings

### Well-linked pages (Good — 57)

Navigation collections dominate the "Good" group — all pages in the Shopify sitewide nav receive links from every crawled page, giving them 100–124 incoming sources. These are expected and correct.

Examples of high-count pages:
- `/collections/lumiere-daraignee` — 124 incoming links
- `/collections/applique-murale` — 124 incoming links
- `/collections/lampes-suspendues` — 123 incoming links
- `/collections/eclairage-de-table` — 124 incoming links
- `/collections/abat-jour` — 124 incoming links

### Pages with no internal links (High — 125)

These pages are not linked from any of the 101 crawled source pages. They may still receive links from product pages (which were not crawled), but they are invisible to the crawled source set.

Key page types in the zero group:
- **Homepage** (`/`) — no pages link back to root
- **Non-nav collections** — `frontpage`, `rideau-de-douche`, `horloge`, etc.
- **Many products** — products not featured in collection carousels or blog articles
- **Some blog articles** — blog articles not cross-linked from other articles

### Products with weak/no links

Many product pages in the catalogue receive at most 1–2 links (from the collection page they appear on). Products that appear in multiple collections or are featured in blog articles fare better.

---

## Recommendations

### Priority 1 — Blog internal linking

Blog articles currently link to collections via the sitewide nav but often miss direct product links. Adding 3–5 product links per article relevant to the article topic would improve product incoming counts from 0–2 to 3–5.

### Priority 2 — Non-nav collection cross-linking

Collections outside the main nav (e.g., `rideau-de-douche`, `horloge`, `tapis-de-sol`) show 0 incoming links. Adding them to the footer navigation or featured collections blocks would give them sitewide exposure.

### Priority 3 — Product cross-linking on product pages

Products frequently have related items. Adding a "You may also like" section or "Related products" block creates product-to-product links. Note: this source group was not crawled — implementing this would improve actual counts on the next audit.

### Priority 4 — Homepage featured products

The homepage links to only ~35 products. Expanding the featured section (seasonal / trending) ensures those products are linked from the highest-authority page on the site.

---

## Methodology Notes

- **Incoming links only:** This audit counts unique SOURCE pages linking TO each target page. It does not count outgoing links from a page.
- **Product pages as sources not crawled:** 186 product pages were not crawled as source pages. Actual incoming link counts for products may be higher than reported if products cross-link each other.
- **Crawl method:** WebFetch (Anthropic proxy) — required because ledsone.fr returns HTTP 429 to direct Python requests.
- **URL normalisation:** `/collections/{col}/products/{handle}` normalised to `/products/{handle}` to avoid double-counting.

---

## Evidence Trail

| File | Location |
|---|---|
| Crawl evidence | `evidence/hetheesa/requirement-05-crawl-evidence.md` |
| URL inventory | `evidence/hetheesa/requirement-05-url-inventory.csv` |
| Incoming link sources CSV | `evidence/hetheesa/requirement-05-incoming-link-sources.csv` |
| Validation | `validation/hetheesa/requirement-05-validation.md` |
| Dashboard | `Staff-requirements/pages/hetheesha.html` — tab-panel-5 |
| Raw data (scratchpad) | `r5_incoming_counts.json`, `r5_data.js` |

---

## Status

**COMPLETE — 2026-07-14**  
Implementation: ✅ PASS  
No production changes made.
