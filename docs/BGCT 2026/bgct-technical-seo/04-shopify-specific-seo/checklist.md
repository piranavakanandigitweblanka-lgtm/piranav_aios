# Checklist — Shopify-Specific SEO

**Status:** DRAFT
**Sheet:** Shopify-Specific SEO (BGCT workbook, Sheet 4)
**Tasks covered:** SH-1 through SH-6
**Owner:** Piranav | **Reviewer:** Sajeesan | **Queryability Reviewer:** Tamil Selvan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx`
**Last updated:** 2026-10-09

---

## SH-1 — Collection URL Structure

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 1.1 | All collection handles are keyword-rich | Shopify Admin → Collections → review each collection URL | Check each collection "Search engine listing preview" URL | Keywords present, no stop words, no generic names | Handles like `/collections/collection-1`, `/collections/new-arrival-products-for-women-and-men` | High | Screenshot |
| 1.2 | No stop words in URL handles | Manual review | Check for: and, the, of, for, a, an, in, with | Clean, concise handles | Stop words present | Low | Screenshot |
| 1.3 | Changing a handle creates a redirect | Test by reviewing URL Redirects after a recent handle change | Admin → URL Redirects — confirm old handle has an entry | Redirect entry exists | No redirect for changed handle | High | Screenshot |
| 1.4 | GSC: no ranking collections have changed handles recently | GSC → Performance → Pages | Filter last 90 days; check if top-ranking collections are accessible | All ranking URLs accessible | GSC showing drops for collection URLs | Medium | GSC screenshot |

---

## SH-2 — Product URL Structure

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 2.1 | Product card links use root `/products/` URL | Browser hover on collection page | On a collection page, hover over product card links — check URL in browser status bar | Format: `https://domain.com/products/handle` | URL contains `/collections/...` | High | Screenshot |
| 2.2 | Homepage featured products use root URL | Browser hover on homepage | Hover over each featured product link | Root `/products/` URL | Collection-scoped URL | High | Screenshot |
| 2.3 | Canonical on product page is root URL | View Page Source | Open product via collection navigation → View Source → check canonical | `https://domain.com/products/handle` | URL contains `/collections/` | Critical | Source screenshot |
| 2.4 | No `/collections/` paths in Screaming Frog internal links | Screaming Frog → Internal → filter by URL containing `/collections/.*/products/` | Bulk check for collection-scoped product links | Zero collection-scoped product links in Screaming Frog | Any such links found | High | Screaming Frog export |

---

## SH-3 — Pagination Handling

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 3.1 | Page 2 has a canonical pointing to `?page=2` | View Page Source on `?page=2` | Search `canonical` in source | Canonical includes `?page=2` | Canonical points to page 1 (without ?page=2) | High | Source screenshot |
| 3.2 | Pagination links are standard `<a href>` elements | View Page Source | Search for `<a` tags in the `<nav>` pagination area | Standard anchor links present | JS-only pagination with no href links | Critical | Source screenshot |
| 3.3 | Page 2 meta title includes "Page 2" | View Page Source on `?page=2` | Search `<title>` tag | "Page 2" or "– Page 2" in title | Identical to page 1 title | Medium | Source screenshot |
| 3.4 | Googlebot can access page 2 | GSC → URL Inspection | Enter the `?page=2` URL and request indexing | "URL is on Google" or "Discovered" | "Blocked by robots.txt" or not found | High | GSC screenshot |

---

## SH-4 — Infinite Scroll Fixes

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 4.1 | Pagination HTML exists in DOM (JS disabled test) | Chrome DevTools → Settings → Disable JavaScript | Reload a collection page with JS disabled; check for pagination links | Standard pagination visible | No pagination visible with JS disabled | Critical | Screenshot with JS disabled |
| 4.2 | Browser URL updates as user scrolls | Manual browser test | Scroll down on a collection with infinite scroll; observe URL bar | URL changes to `?page=2`, `?page=3` | URL remains unchanged | High | Screenshot of URL bar |
| 4.3 | "Load More" button present as alternative | Manual browser test | Check if a "Load More" button exists on the collection page | Button visible and functional | No Load More button, only auto-scroll | Medium | Screenshot |

---

## SH-5 — Duplicate URLs from Faceted Navigation

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 5.1 | Filter combination URLs are noindexed | View Page Source on a filtered collection URL | Apply 2+ filters → View Source → check `<meta name="robots">` | `noindex, follow` | `index, follow` or missing | Critical | Source screenshot |
| 5.2 | Sort-by URLs have correct canonical | View Page Source on `?sort_by=price-ascending` | Check canonical tag | Canonical = base collection URL without sort parameter | Canonical includes `?sort_by=` | Medium | Source screenshot |
| 5.3 | GSC does not have thousands of collection filter URLs indexed | GSC → Performance → Pages → filter by `/collections/` URLs with parameters | Export pages report, check for `?filter.` parameter URLs in index | Zero or minimal filter URLs indexed | Large volume of filter URLs indexed | High | GSC export |
| 5.4 | High-value filter combinations have dedicated collection pages | Manual review with Coordinator | Check if top Brand or Type filter pages have been converted to collections | Dedicated pages exist for high-value filters | Only filter URLs exist for high-traffic filter terms | Medium | Coordinator review |

---

## SH-6 — Blog SEO Optimization

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 6.1 | Blog posts have optimised meta titles | Screaming Frog / Admin → Blog Posts | Check title length and keyword presence for each article | 40–60 chars, keyword present | Missing, too short, or no keyword | High | Export |
| 6.2 | Blog posts have unique meta descriptions | Screaming Frog → Meta Description | Check for missing or duplicate descriptions | Unique descriptions 120–155 chars | Missing or duplicate | Medium | Export |
| 6.3 | Blog posts have H2/H3 heading structure | View Page Source on each article | Check for H2 and H3 tags in article body | Multiple H2 and H3 headings | No subheadings, only H1 and paragraph text | High | Source screenshot |
| 6.4 | Blog posts contain internal links to products/collections | Manual review of top 5 articles | Check article body for `<a>` links to `/products/` or `/collections/` | At least 2–3 internal links per article | No internal links | High | Manual review note |
| 6.5 | Author bio is present | Manual review | Check each published article for an author bio section | Author name and bio visible | No author bio | Medium | Screenshot |
| 6.6 | Article schema is present | Rich Results Test | Test top 3 articles | "Article" schema detected | No schema | Medium | Screenshot |
