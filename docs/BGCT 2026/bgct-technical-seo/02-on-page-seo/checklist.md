# Checklist — On-Page SEO

**Status:** DRAFT
**Sheet:** On-Page SEO (BGCT workbook, Sheet 2)
**Tasks covered:** OP-1 through OP-8
**Owner:** Piranav | **Reviewer:** Sajeesan | **Queryability Reviewer:** Tamil Selvan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx`
**Last updated:** 2026-10-09

---

## OP-1 — Meta Titles Optimization

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 1.1 | Title length is 40–60 characters | Screaming Frog / GSC | Export all page titles; measure character length | All 40–60 chars | Any title <30 or >65 chars | High | Export CSV |
| 1.2 | Primary keyword in first 60 characters | Manual review / Screaming Frog | Check first 60 chars of each title contains target keyword | Keyword present at start | Keyword absent or appearing after char 60 | High | Export CSV |
| 1.3 | All titles are unique | Screaming Frog → Page Titles tab → sort by duplicate | Zero duplicate titles | Any two pages share the same title | High | Screaming Frog screenshot |
| 1.4 | No keyword stuffing | Manual review | Read title aloud — does it read naturally? | Natural, human-readable title | Repetitive keyword phrases | Medium | N/A |
| 1.5 | No blank titles | Screaming Frog → filter "Missing" | Zero pages with empty title tag | None missing | Any missing | Critical | Export CSV |

---

## OP-2 — Meta Descriptions Optimization

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 2.1 | Description length is 120–155 characters | Screaming Frog → Meta Description tab | Export and filter by length | All 120–155 chars | Any >160 or <100 chars | Medium | Export CSV |
| 2.2 | Contains a CTA | Manual review | Read each description — does it contain a CTA verb? | CTA present | No CTA | Medium | Spot-check screenshot |
| 2.3 | All descriptions are unique | Screaming Frog → Meta Description tab → sort duplicates | Zero duplicates | Duplicates found | High | Export CSV |
| 2.4 | No blank descriptions | Screaming Frog → filter "Missing" | Zero missing | Any missing | Medium | Export CSV |

---

## OP-3 — Heading Structure (H1–H6) Cleanup

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 3.1 | Exactly one H1 per page | Screaming Frog → H1 tab / View Page Source | Export H1 report; filter for "Multiple H1" | Exactly one H1 | More than one H1 | High | Screaming Frog screenshot |
| 3.2 | No missing H1 | Screaming Frog → H1 tab → filter "Missing" | Zero missing H1 | Any page with no H1 | High | Export CSV |
| 3.3 | H2 tags used for main sections | View Page Source on product page | Ctrl+F for `<h2` — confirm main description sections use H2 | H2 present and meaningful | H2 missing or used for decorative text | Medium | Screenshot |
| 3.4 | No heading level skipping | Manual Screaming Frog review | Check heading order H1 → H2 → H3 | Sequential | H1 → H3 (skips H2) or similar | Medium | Screenshot |
| 3.5 | Homepage hero text is not a duplicate H1 | View Page Source on homepage | Ctrl+F `<h1` — count instances | One H1 | Two or more H1 on homepage | High | Screenshot |

---

## OP-4 — Image Alt Text Audits

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 4.1 | All product images have alt text | Screaming Frog → Images tab → filter "Missing Alt Text" | Zero missing alt text on product images | None missing | Any missing on product images | Critical | Export CSV |
| 4.2 | Alt text is not the image filename | Manual spot-check | Inspect 10–20 product image alt attributes in Screaming Frog | Descriptive text, not filename | Alt = "DSC_0047.jpg" or similar | High | Screenshot |
| 4.3 | No "image of" or "photo of" prefix | Manual review | Check alt text content in export | Clean descriptive text | "Image of LED strip" | Medium | Export spot-check |
| 4.4 | Alt text under 125 characters | Screaming Frog | Filter alt text length | Under 125 chars | Over 125 chars | Low | Export |
| 4.5 | Banner/lifestyle images have descriptive alt text | Screaming Frog / Manual | Check images in homepage and collection hero sections | Descriptive scene text | Empty alt on non-decorative images | Medium | Screenshot |

---

## OP-5 — Schema / Structured Data (Product)

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 5.1 | Product schema present on product pages | Google Rich Results Test (https://search.google.com/test/rich-results) | Enter product page URL → run test | "Product" eligible rich result detected | No schema detected | High | Screenshot |
| 5.2 | Zero errors in Rich Results Test | Google Rich Results Test | Check "Errors" tab | Zero errors | Any errors | Critical | Screenshot |
| 5.3 | Schema includes required fields | View Page Source → search `application/ld+json` | Verify presence of: name, image, sku, brand, offers | All required fields present | Any required field missing | High | Source screenshot |
| 5.4 | Schema price matches displayed price | Manual comparison | Compare `price` in JSON-LD against price shown on page | Exact match | Any discrepancy | Critical | Screenshot of both |
| 5.5 | No Product schema on collection pages | Rich Results Test / Screaming Frog | Test a collection page URL | No Product schema | Product schema on collection page | Medium | Screenshot |

---

## OP-6 — Schema / Structured Data (Breadcrumb)

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 6.1 | BreadcrumbList schema present on product pages | Rich Results Test | Enter product page URL | "Breadcrumb" eligible result | No breadcrumb detected | High | Screenshot |
| 6.2 | BreadcrumbList schema present on collection pages | Rich Results Test | Enter collection page URL | "Breadcrumb" eligible result | No breadcrumb detected | Medium | Screenshot |
| 6.3 | Schema matches visible breadcrumb on page | Manual comparison | Compare JSON-LD breadcrumb path with on-page breadcrumb | Exact match | Mismatch | High | Screenshot of both |
| 6.4 | Current page is not a linked URL in schema | View Page Source | Check final item in BreadcrumbList — no `url` property | No URL on last item | URL present on last item | Medium | Source screenshot |

---

## OP-7 — Schema / Structured Data (FAQ & Review)

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 7.1 | FAQ schema only present on pages with visible FAQ content | Rich Results Test + Manual | Test pages with FAQ schema; confirm questions are visible in HTML | Questions visible on page | Schema present but no visible FAQ | Critical | Screenshot |
| 7.2 | Review app correctly installed | Shopify Admin → Apps | Confirm review app (Judge.me/Yotpo/Loox) is installed and active | App listed and active | Not installed | High | Screenshot |
| 7.3 | AggregateRating schema present on products with reviews | Rich Results Test | Test product page with reviews | Rating schema detected | Missing despite having reviews | Medium | Screenshot |
| 7.4 | Zero errors in FAQ or Review Rich Results Test | Rich Results Test | Check Errors tab | Zero errors | Any errors | High | Screenshot |
| 7.5 | No review schema on products with zero reviews | View Page Source | Check JSON-LD on new products with no reviews | No AggregateRating | AggregateRating with ratingCount: 0 | High | Source screenshot |

---

## OP-8 — Duplicate Content Fixes

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 8.1 | Product descriptions are unique | Siteliner (siteliner.com) or Copyscape | Scan domain for duplicate content | <10% internal duplicate content | >30% duplicate content | High | Siteliner screenshot |
| 8.2 | Variant URLs canonicalize to base product URL | View Page Source on `?variant=xxx` URL | Check canonical tag on variant URL | Canonical = base `/products/handle` | Canonical missing or points to variant URL | High | Screenshot |
| 8.3 | Collection filter tag pages are noindexed | View Page Source on `/collections/all/shirts` | Check `<meta name="robots">` tag | `noindex, follow` | `index, follow` or missing | High | Screenshot |
| 8.4 | Sort-by parameter URLs are canonicalized | View Page Source on `?sort_by=price-ascending` | Check canonical tag | Canonical = base collection URL without parameter | Canonical includes `?sort_by=` | Medium | Screenshot |
| 8.5 | No two collection pages have near-identical descriptions | Manual review of top 10 collection pages | Read each collection description | All unique | Any two collections share >80% of description text | High | Notes document |
