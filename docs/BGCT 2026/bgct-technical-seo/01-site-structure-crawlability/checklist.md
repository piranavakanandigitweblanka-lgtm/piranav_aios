# Checklist — Site Structure & Crawlability

**Status:** DRAFT
**Sheet:** Site Structure & Crawlability (BGCT workbook, Sheet 1)
**Tasks covered:** SS-1 through SS-7
**Owner:** Piranav | **Reviewer:** Sajeesan | **Queryability Reviewer:** Tamil Selvan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx`
**Last updated:** 2026-10-09

---

## How to Use This Checklist

- Complete each check item by item in order.
- Record PASS, FAIL, or N/A against each item.
- For any FAIL, record the issue found and the recommended next action.
- Save a screenshot or export as evidence before closing the audit.
- A section is PASS only when all applicable items are PASS.

---

## SS-1 — Fix Crawl Errors

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence to Save |
|---|---|---|---|---|---|---|---|
| 1.1 | Review GSC "Not Indexed" report for server errors | Google Search Console → Indexing → Pages | Filter by "Server error (5xx)" | Zero 5xx errors | Any active 5xx errors | Critical | Screenshot of Pages report |
| 1.2 | Review GSC for DNS errors | Google Search Console → Indexing → Pages | Filter by "DNS error" | Zero DNS errors | Any active DNS errors | Critical | Screenshot |
| 1.3 | Review GSC for access errors (403) | Google Search Console → Indexing → Pages | Filter by "Submitted URL blocked" | Zero 403 access errors on indexable pages | Any 403 on a page that should be indexed | High | Screenshot |
| 1.4 | Confirm domain DNS points to Shopify | DNS lookup tool (e.g., whatsmydns.net) | Look up A record for domain | Points to Shopify's IP (23.227.38.x) | Points to an unexpected server | Critical | Screenshot |

---

## SS-2 — Broken Links (404s)

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence to Save |
|---|---|---|---|---|---|---|---|
| 2.1 | Run full site crawl for 404s | Screaming Frog or Ahrefs Site Audit | Crawl the domain → filter by 4xx response codes | Zero 404s on pages with inbound links | Any 404 with external inbound links | High | Crawl export CSV |
| 2.2 | Check GSC "Not Found (404)" errors | Google Search Console → Indexing → Pages | Filter by "Not found (404)" | Zero or fewer than 10 isolated 404s | More than 10 404s, or 404s on product/collection URLs | High | Screenshot |
| 2.3 | Map 404 URLs to redirect targets | Shopify Admin → URL Redirects | Export redirects list; compare 404 URLs against existing redirects | All significant 404s have a 301 redirect | Any significant 404 with no redirect | High | Export file |
| 2.4 | Verify deleted product URLs redirect correctly | Browser | Type old URL → confirm browser reaches a relevant live page with 301 in response headers | 301 redirect to live page | 404 or wrong destination | Medium | Screenshot |

---

## SS-3 — Redirect Chains

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence to Save |
|---|---|---|---|---|---|---|---|
| 3.1 | Identify redirect chains in Shopify | Screaming Frog → Mode: List / Ahrefs Site Audit | Run crawl → filter by "Redirect chains" | Zero redirect chains (all redirects resolve in one hop) | Any URL with 2+ hops | Medium | Crawl report / export |
| 3.2 | Check for redirect loops | Screaming Frog / Ahrefs | Filter by "Redirect loops" | Zero redirect loops | Any redirect loop | Critical | Export |
| 3.3 | Export Shopify URL Redirects and check cross-references | Shopify Admin → URL Redirects → Export | In spreadsheet: check if any "Redirect to" URL also appears as a "Redirect from" URL | No such cross-references | Any cross-reference found | Medium | Export CSV |

---

## SS-4 — Optimize robots.txt

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence to Save |
|---|---|---|---|---|---|---|---|
| 4.1 | View live robots.txt | Browser | Navigate to `yourdomain.com/robots.txt` | File loads with Disallow rules for cart, checkout, account | Missing Disallow rules or file returns 404 | High | Screenshot |
| 4.2 | Confirm cart is disallowed | robots.txt text | Check for `Disallow: /cart` | Present | Missing | High | Screenshot |
| 4.3 | Confirm checkout is disallowed | robots.txt text | Check for `Disallow: /checkout` | Present | Missing | High | Screenshot |
| 4.4 | Confirm account is disallowed | robots.txt text | Check for `Disallow: /account` | Present | Missing | Medium | Screenshot |
| 4.5 | Confirm sitemap URL is declared | robots.txt text | Check for `Sitemap: https://yourdomain.com/sitemap.xml` at end of file | Present | Missing | Medium | Screenshot |
| 4.6 | Test robots.txt in GSC | GSC → Settings → robots.txt tester | Enter `/products/` — confirm "Allowed". Enter `/cart` — confirm "Blocked". | Correct allow/block results | Incorrect results | Critical | Screenshot of tester |
| 4.7 | Confirm no CSS or JS files are disallowed | robots.txt text | Search for `Disallow: *.css` or `Disallow: *.js` | Not present | Present | High | Screenshot |

---

## SS-5 — Optimize sitemap.xml

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence to Save |
|---|---|---|---|---|---|---|---|
| 5.1 | Verify sitemap is accessible | Browser | Navigate to `yourdomain.com/sitemap.xml` | XML file loads with index of sub-sitemaps | 404 or blank page | Critical | Screenshot |
| 5.2 | Confirm sitemap submitted in GSC | GSC → Indexing → Sitemaps | Check for submitted sitemap URL | Sitemap listed as "Success" | Not submitted, or "Couldn't fetch" status | High | Screenshot |
| 5.3 | Check submitted vs indexed count | GSC → Sitemaps → click the sitemap URL | Note "Discovered URLs" vs "Indexed" count | Index rate >80% of submitted (as a guide) | Large gap between submitted and indexed | Medium | Screenshot |
| 5.4 | Check sitemap for noindex pages | Screaming Frog → Spider → Directives report | Crawl site → cross-reference sitemap URLs against noindex list | Zero noindex URLs in sitemap | Any noindex URL present in sitemap | Medium | Crawl export |
| 5.5 | Confirm Bing submission | Bing Webmaster Tools → Sitemaps | Check sitemap is listed | Listed and processed | Not submitted | Low | Screenshot |

---

## SS-6 — Canonical Tag Audits & Fixes

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence to Save |
|---|---|---|---|---|---|---|---|
| 6.1 | Check canonical tag exists on a product page | Browser View Page Source | Open product page → Ctrl+U → search `canonical` | One `<link rel="canonical">` tag in `<head>` | Missing or more than one canonical tag | High | Screenshot |
| 6.2 | Verify canonical URL is the root /products/ URL | View Page Source | Check the canonical URL does not contain `/collections/` | URL format: `https://domain.com/products/product-handle` | URL contains `/collections/` path | High | Screenshot |
| 6.3 | Verify canonical URL resolves to 200 | Browser / curl | Paste canonical URL into browser | HTTP 200 response | 301, 302, 404, or error | Critical | Screenshot |
| 6.4 | Check canonical on collection page | View Page Source | Open collection → View Source → search `canonical` | Self-referencing canonical | Missing or pointing to another URL | High | Screenshot |
| 6.5 | Check product card links do not contain collection path | Browser | Hover over product card link on a collection page; check URL shown in browser status bar | URL format: `https://domain.com/products/handle` | URL contains `/collections/...` | Medium | Screenshot |
| 6.6 | Check canonical on paginated pages | View Page Source on page 2 (?page=2) | Verify canonical is self-referencing (not pointing to page 1) | Canonical = `https://domain.com/collections/slug?page=2` | Canonical points to page 1 | Medium | Screenshot |
| 6.7 | Run canonical audit via Screaming Frog | Screaming Frog → Canonicals tab | Export → check for non-self-referencing or missing canonicals | All pages have correct self-referencing canonical | Any missing or incorrect canonical | High | Export CSV |

---

## SS-7 — Hreflang Setup for Multilingual

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence to Save |
|---|---|---|---|---|---|---|---|
| 7.1 | Verify hreflang tags exist in `<head>` | View Page Source | Open any product page on each language variant → search `hreflang` | hreflang tags present for all language variants + x-default | Missing hreflang tags | High | Screenshot |
| 7.2 | Check reciprocal links | hreflang validator (https://technicalseo.com/tools/hreflang/) | Enter URLs of all language variants | All pages reference each other | One-way reference or missing page | High | Screenshot of validator |
| 7.3 | Verify x-default tag is present | View Page Source | Search `x-default` | `<link rel="alternate" hreflang="x-default" href="...">` present | Missing | Medium | Screenshot |
| 7.4 | Check ISO format correctness | View Page Source | Inspect each hreflang attribute value | Correct ISO format (e.g., `en-GB`, `fr-FR`) | Using `en` or `fr` without country code (if targeting a specific country) | Medium | Screenshot |
| 7.5 | Confirm Shopify Markets is active | Shopify Admin → Settings → Markets | Verify target regions are configured | Active market for each hreflang tag | Hreflang tags present but Markets not configured (source mismatch) | High | Screenshot |
