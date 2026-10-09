# Best Practice — Shopify-Specific SEO

**Status:** DRAFT
**Sheet:** Shopify-Specific SEO (BGCT workbook, Sheet 4)
**Tasks covered:** SH-1 through SH-6
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx` · Shopify Blog · Google Search Central
**Last updated:** 2026-10-09

---

## SH-1 — Collection URL Structure

### What it is
Shopify collection URLs follow the pattern `/collections/[handle]`. The handle is the URL-safe version of the collection name. A clean, keyword-rich handle helps Google understand what the collection page is about.

### Recommended approach
Use `/collections/[target-keyword]` format. Keep handles short and keyword-focused. Do not use stop words (and, the, of, for). Avoid generic or numbered handles like `/collections/collection-1-final`.

Examples:
- Good: `/collections/mens-leather-jackets`
- Bad: `/collections/the-best-mens-and-womens-leather-jackets-2024`

### Why it matters
The URL handle is a minor but real ranking signal. More importantly, it affects CTR — a clean URL in the search result snippet looks more trustworthy and relevant to users.

### Shopify-specific considerations
- Edit via Admin → Products → Collections → click collection → scroll to "Search engine listing preview" → Edit → update "URL handle".
- When you change a handle, Shopify prompts you to create a 301 redirect from the old URL. Always accept.
- **Do not change collection handles on pages that already rank in Google.** Changing a ranked URL — even with a redirect — causes a temporary ranking drop. Only change unranked URLs or perform a redirect and accept the short-term risk.

### Common failure modes
- Using the default, auto-generated handle from the collection title (often redundant or non-keyword-rich).
- Changing handles on top-ranking collection pages without setting up redirects.

### Authoritative references
- https://www.shopify.com/blog/seo-url

---

## SH-2 — Product URL Structure

### What it is
Every Shopify product has two valid URLs:
1. **Root URL:** `/products/[handle]` — the canonical URL.
2. **Collection-scoped URL:** `/collections/[collection]/products/[handle]` — generated when users navigate from a collection.

Both URLs serve the same content. Without intervention, Shopify theme code often outputs the collection-scoped URL in links throughout the site. This creates internal link signals pointing to the non-canonical URL.

### Recommended approach
Force the theme to output only the root `/products/[handle]` URL everywhere. Edit the product card Liquid to change `{{ product.url | within: collection }}` to `{{ product.url }}`. Confirm the canonical tag in `theme.liquid` uses `{{ canonical_url }}` — this always outputs the root URL.

### Why it matters
Internal links passing authority to the collection-scoped URL instead of the canonical URL dilute SEO signals. Google must work harder to identify the correct canonical, and it may occasionally index the wrong URL.

### Shopify-specific considerations
- This is one of the most commonly overlooked technical SEO issues specific to Shopify.
- The fix is in the product card snippet (usually `card-product.liquid` or `product-grid-item.liquid`).
- After fixing, breadcrumb navigation may need to be updated to use browser history rather than the URL path to infer the current collection (since the URL path no longer includes the collection).

---

## SH-3 — Pagination Handling

### What it is
Collection pages with more than `[products_per_page]` items generate paginated pages: `?page=2`, `?page=3`, etc. Search engines need to be able to crawl these pages to discover the full product catalog.

### Recommended approach
Use Shopify's native `{% paginate collection.products by N %}` tag with standard `<a href>` links. Ensure each paginated page has a self-referencing canonical tag. Include `Page [N]` in the meta title to ensure uniqueness. Never noindex paginated pages.

### Why it matters
If paginated pages cannot be crawled (no standard `<a>` links, or JS-only pagination), Googlebot cannot discover products beyond page 1. Entire sections of a large catalog may be unindexed.

### Shopify-specific considerations
- Shopify's `{{ paginate.pages | default_pagination }}` outputs standard HTML pagination links.
- When customising canonical logic in `theme.liquid`, allow the `?page=` parameter to append to the canonical URL if `current_page > 1`.
- Never set a blanket canonical from all paginated pages back to page 1 — this causes Google to ignore deeper pages.

### Authoritative references
- https://www.shopify.com/blog/pagination-seo
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

---

## SH-4 — Infinite Scroll Fixes

### What it is
Infinite scroll loads additional products via JavaScript as the user scrolls down. If not implemented correctly, Googlebot (which does not scroll) only sees the first batch of products — effectively hiding all deeper products from the index.

### Recommended approach
Retain the traditional Shopify pagination `<div class="pagination">` block in the Liquid file but visually hide it (CSS: `display: none`). The JavaScript observes the hidden "Next Page" link, fetches its URL via AJAX, appends products, and updates the browser URL via the History API. This gives crawlers standard pagination links while providing users a smooth infinite scroll experience.

### Why it matters
An infinite scroll implementation without a crawler-accessible fallback can cause entire pages of a catalog to be invisible to Google, resulting in a significant loss of indexable product pages.

### Shopify-specific considerations
- Update the browser URL using `history.pushState()` as the user scrolls so each scroll position has a shareable URL.
- "Load More" buttons (explicit user-triggered pagination) are preferable to auto-infinite scroll from an SEO and accessibility standpoint.
- Test by disabling JavaScript in Chrome DevTools → confirm that standard pagination links are still visible.

---

## SH-5 — Duplicate URLs from Faceted Navigation (Filters)

### What it is
Shopify's storefront filter system creates URL permutations when users apply filters (e.g., `?filter.p.m.product_type=LED+Strip&filter.v.option.color=Red`). Each unique filter combination is a different URL that may serve near-identical or identical content. This creates thousands of low-value URLs that dilute crawl budget and create duplicate content.

### Recommended approach
Prevent filter URL combinations from being indexed using `<meta name="robots" content="noindex, follow">` applied conditionally when `current_tags.size > 0` or when filter parameters are present in the URL. Allow single high-value filter parameters (e.g., Brand filter pages) to be indexed only where there is genuine search demand.

### Shopify-specific considerations
- The Liquid condition for tag-based filters: `{% if template contains 'collection' and current_tags.size > 0 %}`
- For URL-parameter-based filters (Shopify's native filter system), check if the theme template conditionally applies noindex. If not, add it.
- High-value filter combinations (e.g., "Red LED Strips" with real search demand) should be converted to dedicated collection pages, not filter URLs.

### Common failure modes
- Allowing all filter URL combinations to be indexed, flooding GSC with thousands of low-quality URLs.
- Noindexing filter pages but also removing the internal links to them — this is correct for crawl budget but confirm it is intentional.

---

## SH-6 — Blog SEO Optimization

### What it is
Shopify includes a built-in blog feature. When used correctly, the blog captures informational search queries (top-of-funnel traffic) and funnels visitors toward product and collection pages via internal links.

### Recommended approach
Structure articles with clear H2/H3 headings targeting secondary keywords. Include at least 2–3 internal links per article pointing to relevant collection or product pages. Add Article schema (JSON-LD). Include an author bio (an E-E-A-T signal). Update older articles annually with fresh information and new product links.

### Why it matters
Informational content captures searchers at the "research" stage — before they are ready to buy. A well-structured blog that converts readers to product page visitors is a measurable source of incremental organic revenue.

### Shopify-specific considerations
- Blog post URLs follow the pattern `/blogs/[blog-handle]/[article-handle]`.
- Meta titles and descriptions for blog posts are set the same way as products (Search engine listing preview section in the admin).
- Use the `{% schema %}` tag in `article.liquid` to allow adding a "Featured Products" block to post layouts — this enables linking product cards directly within the article.

### Common failure modes
- Blog posts with no internal links to products (wasted bottom-of-funnel opportunity).
- Articles written without a clear target keyword — capturing irrelevant or zero-volume traffic.
- No author bio — a missed E-E-A-T signal.
