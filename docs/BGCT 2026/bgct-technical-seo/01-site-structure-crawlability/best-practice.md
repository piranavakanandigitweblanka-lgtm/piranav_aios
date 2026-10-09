# Best Practice — Site Structure & Crawlability

**Status:** DRAFT
**Sheet:** Site Structure & Crawlability (BGCT workbook, Sheet 1)
**Tasks covered:** SS-1 through SS-7
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx` · Google Search Central · Shopify Help Centre
**Last updated:** 2026-10-09

---

## SS-1 — Fix Crawl Errors

### What it is
A crawl error occurs when a search engine attempts to access a page and fails — either due to a server error (5xx), DNS resolution failure, or access restriction (403). Pages that cannot be crawled cannot be indexed, meaning they will not appear in search results regardless of their content quality.

### Recommended approach
Use Google Search Console (GSC) → Indexing → Pages to monitor crawl status continuously. Prioritise errors in this order: 5xx server errors (developer action required), 403 access errors (check Shopify app permissions), DNS errors (check domain propagation).

### Why it matters
Googlebot has a crawl budget — a finite number of pages it will crawl per day on your site. Persistent errors waste that budget and prevent new or updated content from being discovered.

### Shopify-specific considerations
- Shopify-hosted stores are generally stable; 5xx errors are usually caused by overloaded third-party app endpoints, not Shopify's infrastructure.
- If 5xx errors appear in GSC on Shopify, check whether a recently installed app is making synchronous API calls during page render.
- Shopify redirects deleted product URLs automatically if a redirect was set at deletion time. Verify via Admin → Online Store → Navigation → URL Redirects.

### Exceptions and trade-offs
- 404 errors on pages that were intentionally removed and have no replacement do not require a redirect — only redirect to pages of equivalent value.
- A small number of 404s is normal and not harmful. Systematic 404s (hundreds or thousands) are the concern.

### Common failure modes
- Ignoring GSC alert emails about increased crawl errors.
- Failing to spot that a 5xx error is only occurring for Googlebot (not real users), masking app-level blocking.

### Authoritative references
- https://developers.google.com/search/docs/crawling-indexing/fix-search-issues
- https://support.google.com/webmasters/answer/35120

---

## SS-2 — Broken Links (404s)

### What it is
A 404 error means the requested page does not exist. It occurs when pages are deleted or URLs are changed without setting up a redirect. If external sites link to a deleted page, the ranking authority (link equity) of that inbound link is permanently lost.

### Recommended approach
Set up a 301 (permanent) redirect from the old URL to the nearest equivalent page **before** deleting any product, collection, or page. If no equivalent exists, redirect to the parent category. Never redirect to the homepage as a blanket default unless there is no alternative.

### Why it matters
Each broken inbound link represents lost ranking authority. If users encounter broken links from navigation, ads, or email campaigns, they bounce — increasing the bounce rate and reducing conversion.

### Shopify-specific considerations
- When editing a product or collection handle in Shopify, the admin prompts you to create a redirect automatically. Always accept this prompt.
- Shopify stores keep the old URL active as a redirect if the checkbox was accepted at handle change time.
- Shopify does not automatically create redirects when products are deleted — only when handles are changed. You must create deletion redirects manually.

### Exceptions and trade-offs
- Redirecting every 404 to the homepage is a common shortcut but dilutes user experience and sends a weaker signal to Google than a contextually relevant redirect.
- Redirect chains (A → B → C) negate some of the benefit. Redirect directly to the final destination.

### Common failure modes
- Seasonal product pages deleted at the end of season without redirects — external links and bookmarks break.
- Bulk importing products via CSV without verifying that old handles are still active.

### Authoritative references
- https://developers.google.com/search/docs/crawling-indexing/301-redirects

---

## SS-3 — Redirect Chains

### What it is
A redirect chain occurs when URL A redirects to URL B, which then redirects to URL C. Every additional hop adds HTTP request latency and slightly dilutes the link equity passed along the chain.

### Recommended approach
Every redirect should be a single hop — URL A points directly to the final destination. Audit redirects annually and collapse any chains discovered. The maximum acceptable chain length is one hop.

### Why it matters
- Each extra redirect adds ~50–150ms of latency per hop, directly impacting page load time and Time to First Byte (TTFB).
- Link equity is not fully passed through redirect chains. The exact loss is not publicly quantified by Google, but it is measurable.
- Redirect loops (A → B → A) make the page completely inaccessible.

### Shopify-specific considerations
- Shopify's URL Redirects list is the single source of truth. Export it via Admin → Online Store → Navigation → URL Redirects → Export, and inspect for chains in a spreadsheet.
- Shopify applies redirects sequentially, so a chain in the admin list will resolve as a chain in the browser.

### Exceptions and trade-offs
- Two-hop chains that were created during a domain migration may be temporarily acceptable while the old domain is still receiving traffic, but should be collapsed within 90 days.

### Common failure modes
- Re-using an old product URL for a new product without clearing the old redirect first.
- Importing a redirect list from a previous platform without checking for cross-references.

### Authoritative references
- https://developers.google.com/search/docs/crawling-indexing/301-redirects

---

## SS-4 — Optimize robots.txt

### What it is
`robots.txt` is a plain-text file at the root of your domain that instructs search engine crawlers which URLs they should not request. It saves crawl budget by preventing Googlebot from crawling pages with no ranking value.

### Recommended approach
On Shopify, use the `robots.txt.liquid` template to customise the default file. Always disallow: `/cart`, `/checkout`, `/account`, `/orders`, `/search` (with parameters), and `/collections/all` (unless it has editorial value). Always include the sitemap URL at the end of the file.

### Why it matters
Every Googlebot request to a cart or checkout page wastes crawl budget that could have been spent on indexable content. Low-value pages in the index can dilute overall site quality signals.

### Shopify-specific considerations
- Shopify auto-generates a `robots.txt` with sensible defaults. You do not need to create one from scratch.
- To customise, go to Admin → Online Store → Themes → Edit Code → Add new template → `robots.txt`.
- Use `{%- if group.user_agent.value == '*' -%}` blocks in Liquid to append custom `Disallow` rules.
- **Critical warning:** A single typo (`Disallow: /` instead of `Disallow: /cart`) can deindex the entire site. Always test in GSC's robots.txt tester after any change.

### Exceptions and trade-offs
- `robots.txt` blocks crawling only — it does not prevent indexing. If a page is linked to externally, Google may still index it even if `robots.txt` disallows crawling. Use `noindex` meta tags for pages you need to keep out of the index.
- Never block CSS or JS files — Google needs them to render the page correctly.

### Common failure modes
- Adding a wildcard `Disallow: /` by accident.
- Blocking `/collections/all` when it ranks for head terms.
- Not declaring the sitemap URL at the bottom of the file.

### Authoritative references
- https://developers.google.com/search/docs/crawling-indexing/robots/intro
- https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt

---

## SS-5 — Optimize sitemap.xml

### What it is
A sitemap is an XML file listing all important URLs so search engines can discover them efficiently. It does not guarantee indexing but gives Googlebot a reliable map of your site's canonical URLs.

### Recommended approach
Submit `yourdomain.com/sitemap.xml` to both Google Search Console and Bing Webmaster Tools. Ensure the sitemap contains only canonical, indexable URLs — no 404 pages, no redirect destinations that are themselves redirects, no `noindex` pages.

### Why it matters
Sites with large catalogs (1,000+ products) depend on the sitemap for Googlebot to discover new or updated pages within a reasonable time frame. Without a submitted sitemap, new products may take weeks to be indexed.

### Shopify-specific considerations
- Shopify auto-generates a dynamic `sitemap.xml` and updates it automatically. You do not need to manually maintain it.
- To exclude a page from the sitemap: add a `seo.hidden` metafield with value `1` to the product, page, or collection. This also applies a `noindex` meta tag automatically.
- Shopify's sitemap index file links to sub-sitemaps: `sitemap_products_1.xml`, `sitemap_pages_1.xml`, `sitemap_collections_1.xml`, `sitemap_blogs_1.xml`.

### Exceptions and trade-offs
- Password-protected development stores cannot be crawled; sitemap submission before launch is low value.
- Collection filter URLs (`?sort_by=`, `?page=2`) are not in the Shopify sitemap by default. This is correct behaviour — do not add them.

### Common failure modes
- Submitting the sitemap once and not rechecking GSC's "Pages submitted but not indexed" report.
- Including pages with `noindex` in the sitemap (a contradictory signal).
- Not checking that low-value blog pages or internal search results pages are excluded.

### Authoritative references
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- https://support.google.com/webmasters/answer/156184

---

## SS-6 — Canonical Tag Audits & Fixes

### What it is
The `rel="canonical"` HTML tag tells search engines which URL is the authoritative (master) version of a page when duplicate or near-duplicate versions exist at different URLs.

### Recommended approach
Every indexed page must have a self-referencing canonical tag in the `<head>`. Product pages accessed via collection paths (e.g., `/collections/shirts/products/red-shirt`) must canonicalize to the root product URL (`/products/red-shirt`). All canonical tags must point to live, 200-status URLs — never to redirects or 404s.

### Why it matters
Shopify generates two valid URLs for every product: the root URL and the collection-scoped URL. Without the correct canonical, Google may split ranking signals between both, or choose the wrong one as the master.

### Shopify-specific considerations
- Shopify themes include `{{ canonical_url }}` in `theme.liquid`. Verify it is present in `<head>` and rendering correctly.
- When a user navigates to a product via a collection, `{{ canonical_url }}` still outputs the root `/products/` URL — this is correct Shopify behaviour.
- The issue arises when internal links use `{{ product.url | within: collection }}` — this generates the collection-scoped URL in anchor tags, not in canonical tags. Fix internal links to use `{{ product.url }}` alone.

### Exceptions and trade-offs
- Pagination: page 2 (`?page=2`) of a collection should have its own self-referencing canonical, not point to page 1. The workbook's instruction to ensure "every indexed page has a canonical tag" is correct here.
- Variants: Shopify variant URLs (`?variant=123`) are typically canonicalized to the base product URL. Verify this is the case in the theme.

### Common failure modes
- A canonical pointing to a 301 redirect destination that itself redirects — creating a canonical chain.
- Multiple `<link rel="canonical">` tags in the `<head>` (only the first is respected by Google).
- App-injected content adding a second canonical tag.

### Authoritative references
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://help.shopify.com/en/manual/promoting-marketing/seo

---

## SS-7 — Hreflang Setup for Multilingual

### What it is
`hreflang` attributes in the `<head>` tell search engines the language and geographic target of each page and link to equivalent pages in other languages or regions. They prevent multilingual pages from competing with each other in search results.

### Recommended approach
Use **Shopify Markets** for all multilingual implementations. Shopify Markets automatically injects correct, bidirectional `hreflang` tags based on your Markets configuration. Always include an `x-default` fallback tag pointing to the primary language version.

### Why it matters
Without `hreflang`, Google may serve the wrong language version of a page to users in a target market, or the pages may compete against each other and suppress rankings for both.

### Shopify-specific considerations
- Go to Admin → Settings → Markets to set up regions and languages.
- Shopify injects `hreflang` tags automatically based on Markets — do not duplicate them manually in `theme.liquid`.
- Use ISO format exactly: `en-GB` (UK English), `en-US` (US English), `fr-FR` (France French), `de-DE` (Germany German).
- If using a third-party translation app (Langify, Weglot, Translate & Adapt), verify the app handles `hreflang` — do not rely on theme.liquid.

### Exceptions and trade-offs
- If the store serves multiple English-speaking markets (UK + US + AU) with identical content, `hreflang` implementation may not resolve thin content issues — unique content per market is the cleaner solution.
- Manual `hreflang` hardcoded into `theme.liquid` breaks on dynamically generated collection and product pages and is not recommended unless supported by a developer.

### Common failure modes
- Missing reciprocal tags (Page A references Page B but Page B does not reference Page A).
- Using `en` instead of `en-GB` or `en-US` (imprecise targeting).
- Missing `x-default` tag.
- App-generated and manually hardcoded tags coexisting and conflicting.

### Authoritative references
- https://developers.google.com/search/docs/specialty/international/localization-vs-internationalization
- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
