# Best Practice — On-Page SEO

**Status:** DRAFT
**Sheet:** On-Page SEO (BGCT workbook, Sheet 2)
**Tasks covered:** OP-1 through OP-8
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx` · Google Search Central · Shopify Help Centre
**Last updated:** 2026-10-09

---

## OP-1 — Meta Titles Optimization

### What it is
The meta title (`<title>`) is the clickable headline displayed in Google search results and in the browser tab. It is the most influential on-page ranking signal.

### Recommended approach
Format: `[Primary Keyword] | [Secondary Keyword or Value Proposition] | [Brand Name]`

Place the primary keyword at the very beginning of the title. Keep the total length between 40 and 60 characters to avoid truncation in search results. Each title must be unique across the entire site.

### Why it matters
Google uses the title tag as a primary signal to understand what a page is about. It also drives click-through rate — a well-written title directly impacts traffic volume.

### Shopify-specific considerations
- Edit via Shopify Admin → any Product/Collection/Page → scroll to "Search engine listing preview" → Edit → "Page title" field.
- Shopify's default title format is `[Product Name] – [Store Name]`. This format places the brand before the keyword — a suboptimal default for SEO.
- Correct this by placing the keyword first: `[Keyword-Rich Product Name] | [Brand]`.

### Exceptions and trade-offs
- **Brand-driven queries:** if the primary searcher intent is brand + product (e.g., a well-known brand product), placing the brand name first may improve CTR for those queries.
- **Character limit note (flagged for review):** The 60-character guideline is widely cited but Google truncates based on pixel width (~580px), not characters. Titles with narrow characters (i, l) can fit more; titles with wide characters (W, M) fit fewer. Treat 55–60 characters as a practical safe range.

### Common failure modes
- Copying the product title verbatim with no keyword research input.
- Duplicate titles across similar products (e.g., multiple "LED Strip Light" products with identical titles).
- Keyword stuffing: "LED Strip Light, Buy LED Strip, LED Strip Light Online".

### Authoritative references
- https://developers.google.com/search/docs/appearance/title-link
- https://help.shopify.com/en/manual/promoting-marketing/seo/adding-keywords

---

## OP-2 — Meta Descriptions Optimization

### What it is
The meta description is the short paragraph displayed below the meta title in search results. It does not directly influence rankings but significantly impacts click-through rate (CTR).

### Recommended approach
Keep between 120–155 characters. Write it as ad copy: include a call-to-action (CTA), a unique selling proposition (USP), and ideally the primary keyword (Google bolds matched keywords in the snippet). Each description must be unique.

### Why it matters
While meta descriptions are not a direct ranking factor, Google may rewrite them if the provided description does not match the page content well. A well-written, unique description Google chooses to show directly improves CTR.

### Shopify-specific considerations
- Edited in the same "Search engine listing preview" area as the meta title.
- If no description is provided, Shopify/Google will pull text from the page body. For product pages this is often the beginning of the product description — ensure product descriptions open with a compelling, keyword-relevant sentence.

### Common failure modes
- Duplicating the same description across all products in a category.
- Writing a description longer than 155 characters (Google will truncate and add an ellipsis).
- Not including a CTA — descriptions that describe without prompting action lose CTR to competitors that do.

---

## OP-3 — Heading Structure (H1–H6) Cleanup

### What it is
HTML heading tags (`<h1>` through `<h6>`) create a hierarchical document structure. `<h1>` is the page's main topic. `<h2>` tags are main sections. `<h3>` tags are sub-sections within those sections.

### Recommended approach
Use exactly one `<h1>` per page. Structure `<h2>` and `<h3>` tags logically. Do not skip levels (e.g., jumping from `<h2>` to `<h4>`). Include secondary and LSI (Latent Semantic Indexing) keywords in `<h2>` tags naturally.

### Why it matters
Heading tags help both Google and accessibility screen readers understand the page structure. Correct heading hierarchy is a confirmed accessibility requirement (WCAG 2.1) and a supporting SEO signal.

### Shopify-specific considerations
- In Shopify OS 2.0 themes, `<h1>` is typically `{{ product.title }}` or `{{ collection.title }}` in the main section Liquid file.
- The homepage slider or hero section is a common place where a second `<h1>` gets accidentally introduced. Check the hero section Liquid.
- Use CSS classes (e.g., `class="h1"`) to style text like a heading without introducing additional heading tags in the HTML.

### Flag for review
The workbook states "exactly one H1 tag per page". Google has publicly stated multiple `<h1>` tags do not cause a ranking problem, but the single `<h1>` rule is standard accessibility practice and the correct team default. This is a valid and defensible team standard.

### Common failure modes
- Using `<h1>` tags to make decorative text large rather than using CSS.
- Multiple `<h1>` tags on the homepage (often from hero banner + product title + blog section headings all using `<h1>`).
- Skipping `<h2>` and going straight to `<h3>` in descriptions.

### Authoritative references
- https://developers.google.com/search/docs/appearance/page-structure
- https://help.shopify.com/en/manual/promoting-marketing/seo/seo-overview

---

## OP-4 — Image Alt Text Audits

### What it is
The `alt` attribute on `<img>` tags provides a text description of the image. It is used by screen readers for accessibility and by Google to understand image content for Google Images ranking.

### Recommended approach
Write a concise, accurate description of what is in the image — as if describing it to someone who cannot see it. 5–15 words is an appropriate length. Include the product keyword naturally where relevant, but do not repeat the keyword in every image's alt text.

### Why it matters
Alt text is a confirmed Google Images ranking signal. Missing alt text on product images also constitutes an accessibility failure (WCAG 2.1 Level A) and can create legal risk in some markets.

### Shopify-specific considerations
- Add alt text via Admin → Products → click an image thumbnail → "Add alt text" panel on the right.
- For images in theme code, use: `{{ image | image_url: width: 800 | image_tag: alt: 'descriptive text here' }}`
- For theme section images set via the Shopify customiser, alt text is often controlled by a schema setting — verify the schema includes an `alt` field.

### Exceptions and trade-offs
- Decorative images (spacers, dividers, purely aesthetic icons) should have `alt=""` (empty string) — this tells screen readers to skip the image rather than reading out a filename.
- Do not prefix with "Image of" or "Photo of" — these words are redundant and waste character space.

### Authoritative references
- https://help.shopify.com/en/manual/products/product-media/add-alt-text
- https://developers.google.com/search/docs/appearance/google-images

---

## OP-5 — Schema / Structured Data (Product)

### What it is
Product schema is JSON-LD code that provides Google with machine-readable product details (name, price, SKU, availability, brand, reviews) to generate Rich Snippets — enhanced search result formats that display price, stock, and star ratings directly in Google.

### Recommended approach
Ensure Product schema includes at minimum: `name`, `image`, `description`, `sku`, `brand`, `offers` (with `price`, `priceCurrency`, `availability`). Use the Google Rich Results Test to confirm zero errors. Ensure `price` in schema matches the price displayed on the page exactly.

### Why it matters
Rich Snippets driven by Product schema improve CTR significantly — they occupy more visual space in search results and provide buying signals (price, availability) that organic blue-link results do not.

### Shopify-specific considerations
- Most Shopify OS 2.0 themes include Product schema in `main-product.liquid` automatically.
- Verify by running the Google Rich Results Test (https://search.google.com/test/rich-results) on any product page.
- If schema is missing or incomplete, install a dedicated app such as "JSON-LD for SEO" rather than writing raw JSON-LD manually — apps handle variant price updates dynamically.
- **Do not** mark collection pages with Product schema. Collection pages should use `CollectionPage` or `ItemList` schema.

### Common failure modes
- Schema price does not update when a variant is selected (static JSON-LD).
- Including GTIN/UPC fields with placeholder or dummy values — Google may suppress rich results for inaccurate data.
- Applying Product schema to a category/collection page.

### Authoritative references
- https://developers.google.com/search/docs/appearance/structured-data/product

---

## OP-6 — Schema / Structured Data (Breadcrumb)

### What it is
BreadcrumbList schema tells Google the hierarchical path to the current page (e.g., Home > Collections > LED Strips > Red LED Strip). Google uses this to display a clean breadcrumb trail in search results instead of the raw URL.

### Recommended approach
Implement BreadcrumbList JSON-LD on all product and collection pages. The schema must match the visible breadcrumb navigation on the page. The current page should be the last item in the list and should **not** be a linked URL (it is the destination, not a link).

### Shopify-specific considerations
- Most themes have a `breadcrumbs.liquid` snippet. Wrap this snippet's output in JSON-LD BreadcrumbList markup.
- Shopify breadcrumbs are typically rendered in Liquid; the JSON-LD version can be injected as a separate `<script type="application/ld+json">` block in the same snippet or in `main-product.liquid`.

### Common failure modes
- BreadcrumbList schema present but breadcrumb navigation is not visible on the page (schema not reflecting page reality).
- Including the current page as a linked item with a `url` property.

---

## OP-7 — Schema / Structured Data (FAQ & Review)

### What it is
FAQ schema (`FAQPage`) creates expandable question-and-answer dropdowns in Google search results. AggregateRating schema displays gold star ratings. Both significantly improve CTR.

### Recommended approach
Only apply FAQ schema to questions that are **visibly present on the page** as real HTML content. Only apply AggregateRating schema if the store has real, verified reviews from a certified review app. Never fabricate review data.

### Why it matters
Google's 2023 update to review policies and rich results guidelines explicitly prohibits incentivised or fabricated reviews in schema. Violation can result in a manual action.

### Shopify-specific considerations
- For review schema: use a certified app (Judge.me, Yotpo, Loox, Okendo). These apps inject the correct AggregateRating schema automatically. Do not write this schema manually.
- For FAQ schema: generate JSON-LD using a free generator → copy → paste into the HTML view of the Shopify page editor.
- For FAQ schema on product pages: add as a JSON-LD `<script>` block in the product description HTML or in `main-product.liquid` as a conditional section.

### Common failure modes
- FAQ schema present but the questions are not visible as HTML content on the page.
- Review schema present but the review app is not actually installed — will generate Google errors.
- Promotional marketing text formatted as FAQ schema ("Is free shipping available? Yes, on all orders!") — low quality and risk of enforcement.

### Authoritative references
- https://developers.google.com/search/docs/appearance/structured-data/faqpage
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet

---

## OP-8 — Duplicate Content Fixes

### What it is
Duplicate content refers to identical or near-identical content appearing at multiple URLs. This splits Google's ranking signals across both URLs, potentially causing neither to rank well, and wastes crawl budget.

### Recommended approach
Write unique product descriptions for every product. For truly similar products, consolidate into a single product with variants rather than separate pages. Where duplication cannot be avoided, use `rel="canonical"` to designate the master URL.

### Why it matters
Google does not algorithmically penalise duplicate content in most cases, but it cannot rank two identical pages for the same query — it must choose one, and it may choose the wrong one. Unique content is a competitive advantage.

### Shopify-specific considerations
- Shopify's collection filter tags (e.g., `/collections/all/shirts` vs `/collections/shirts`) can create near-duplicate collection pages. Use canonical tags and `noindex` on low-value tag combinations.
- Variant URL parameters (`?variant=123`) are typically canonicalized by Shopify to the base product URL. Verify this in the theme.
- Manufacturer/supplier description text is used verbatim by many competing Shopify stores — rewriting even partially differentiates the page.

### Common failure modes
- Hundreds of products with the same opening sentence from the supplier's data feed.
- Multiple collection pages targeting the same keyword (e.g., `/collections/led-strips` and `/collections/led-strip-lights` with identical descriptions).
- Pagination creating apparent duplicate collection pages if canonical tags are not set per page.

### Authoritative references
- https://developers.google.com/search/docs/crawling-indexing/duplicate-content
