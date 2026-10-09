# Tutorial — Shopify-Specific SEO

**Status:** DRAFT — Liquid code examples require review by Sajeesan before team rollout
**Sheet:** Shopify-Specific SEO (BGCT workbook, Sheet 4)
**Tasks covered:** SH-1 through SH-6
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx`
**Last updated:** 2026-10-09

---

## Prerequisites

- Shopify Admin access (Online Store, Products, Collections permissions)
- Google Search Console access
- Basic understanding of Shopify Liquid (for theme code changes)
- Developer contact for theme Liquid changes (required before going live)

---

## SH-1 — Collection URL Structure

### Steps to update a collection handle

1. In **Shopify Admin**, go to **Products → Collections**.
2. Click on the collection you want to update.
3. Scroll down to **"Search engine listing preview"** and click **"Edit"**.
4. In the **"URL handle"** field, update the handle to be keyword-rich and concise.
   - Example: Change `/collections/new-products-led-collection-2024` → `/collections/led-strip-lights`
5. A dialog box will appear: **"Create a URL redirect for the old URL"**. **Always tick this box.**
6. Click **Save**.
7. Verify by navigating to the old URL in a browser — it should 301 redirect to the new URL.

### How to identify poorly optimised handles
1. In Admin → Collections, review the URL preview under each collection name.
2. Handles to flag: any handle with 5+ words, containing "new", "collection", "products", years, or stop words.

---

## SH-2 — Product URL Structure

### Fix product card links in the theme

1. In **Shopify Admin → Online Store → Themes → Edit Code**.
2. Find the product card snippet. Common file names:
   - `snippets/card-product.liquid`
   - `snippets/product-card.liquid`
   - `snippets/product-grid-item.liquid`
3. In the file, search for `within: collection`.
4. Locate the `<a>` tag: `href="{{ card_product.url | within: collection }}"`
5. Change it to: `href="{{ card_product.url }}"`
6. Save.
7. Also check `sections/main-collection-product-grid.liquid` and `sections/featured-collection.liquid` for the same pattern.
8. Verify by visiting a collection page, hovering over a product card, and checking the URL in the browser status bar. It should not contain `/collections/`.

### Verify the canonical tag
1. Open `layout/theme.liquid` in Edit Code.
2. Find in `<head>`:
   ```html
   <link rel="canonical" href="{{ canonical_url }}">
   ```
3. If missing, add it. `{{ canonical_url }}` always outputs the root `/products/` URL in Shopify.

---

## SH-3 — Pagination Handling

### Verify standard pagination exists
1. Open a collection page with more than `[products_per_page]` products.
2. Scroll to the bottom — confirm numbered page links are visible.
3. Right-click → View Page Source → search `<a href` in the pagination section.
4. Confirm standard `<a href="?page=2">` links are present.

### Fix canonical for paginated pages
In `layout/theme.liquid`, if you have custom canonical logic, ensure paginated pages include the `?page=` parameter:

```liquid
{%- if current_page > 1 -%}
  <link rel="canonical" href="{{ canonical_url }}?page={{ current_page }}">
{%- else -%}
  <link rel="canonical" href="{{ canonical_url }}">
{%- endif -%}
```

**Note:** Replace any custom canonical logic with this only after confirming with a developer.

### Add "Page N" to paginated meta titles
In `layout/theme.liquid`, find the `<title>` tag and add a page suffix:

```liquid
<title>
  {%- if current_page > 1 -%}
    {{ page_title }} — Page {{ current_page }} | {{ shop.name }}
  {%- else -%}
    {{ page_title }} | {{ shop.name }}
  {%- endif -%}
</title>
```

---

## SH-4 — Infinite Scroll Fixes

### Implementation pattern: hidden pagination + JS infinite scroll

This is a developer task. The recommended pattern:

1. In your collection page template, keep the standard Shopify paginate block:
   ```liquid
   {% paginate collection.products by 24 %}
     <!-- product grid here -->
     <div class="pagination" style="display: none;">
       {{ paginate | default_pagination }}
     </div>
   {% endpaginate %}
   ```

2. The JavaScript observes the hidden "Next Page" link:
   ```javascript
   const nextPageLink = document.querySelector('.pagination a[href*="page="]');
   if (nextPageLink) {
     // IntersectionObserver watches the hidden pagination div
     // When triggered, fetch the next page URL via AJAX
     // Append returned products to the grid
     // Update URL: history.pushState({}, '', nextPageLink.href);
   }
   ```

3. Test by disabling JavaScript: Admin → Chrome DevTools → Settings → Disable JavaScript → reload collection. Confirm pagination links are visible.

### Test URL update on scroll
1. Open a collection page with infinite scroll active.
2. Scroll down past the first page of products.
3. Check the browser URL bar — it should update to `?page=2` as you scroll.
4. If URL does not update: `history.pushState()` is not implemented — escalate to developer.

---

## SH-5 — Duplicate URLs from Faceted Navigation

### Add noindex to filtered collection pages

1. In **Shopify Admin → Online Store → Themes → Edit Code**.
2. Open `layout/theme.liquid`.
3. Inside the `<head>` tag, add:

```liquid
{%- if template contains 'collection' and current_tags.size > 0 -%}
  <meta name="robots" content="noindex, follow">
{%- endif -%}
```

4. Save.
5. Verify: navigate to a collection with a tag applied (e.g., `/collections/all/shirts`) → View Page Source → search `robots` → confirm `noindex, follow` is present.

### Handle URL-parameter-based filters (Shopify's native filter system)
For stores using Shopify's native filter URLs (`?filter.p.m.product_type=LED+Strip`), add:

```liquid
{%- assign filter_active = false -%}
{%- for filter in collection.filters -%}
  {%- if filter.active_values.size > 0 -%}
    {%- assign filter_active = true -%}
  {%- endif -%}
{%- endfor -%}
{%- if filter_active -%}
  <meta name="robots" content="noindex, follow">
{%- endif -%}
```

**Note:** This requires developer review before deployment. Incorrect implementation can noindex important pages.

---

## SH-6 — Blog SEO Optimization

### Optimise a blog post meta title and description
1. Admin → Online Store → Blog Posts → open the article.
2. Scroll to **"Search engine listing preview"** → Edit.
3. Set title: `[Primary Long-tail Keyword] | [Brand]`
   - Example: `How to Install LED Strip Lights Under Kitchen Cabinets | LEDSone`
4. Set description under 155 characters, include a CTA.
5. Save.

### Add internal links to product pages
1. In the blog post editor, select a relevant phrase in the article body.
2. Click the link icon (or Ctrl+K).
3. Enter a relevant product or collection URL from your store.
4. Aim for 2–3 such links per article.

### Add Article schema via HTML view
1. In the blog post editor, click `<>` (HTML view).
2. At the bottom, paste Article schema:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Install LED Strip Lights Under Kitchen Cabinets",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "LEDSone",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yourdomain.com/logo.png"
    }
  },
  "datePublished": "2026-10-09",
  "dateModified": "2026-10-09"
}
</script>
```

3. Save. Validate with Google Rich Results Test.

---

## DO's and DON'Ts

| DO | DON'T |
|---|---|
| DO: Keep collection URL handles short and keyword-focused. | DON'T: Use stop words (and, the, of) in URL handles. |
| DO: Rely on browser history / tags for breadcrumbs after fixing product links. | DON'T: Forget to check featured product sections on the homepage for collection-scoped links. |
| DO: Add "Page N" to meta titles on paginated collection pages. | DON'T: Noindex paginated collection pages — Google stops following links on them. |
| DO: Use a "Load More" button instead of auto-infinite scroll for better accessibility. | DON'T: Implement infinite scroll without updating the browser URL via History API. |
| DO: Create dedicated collection pages for high-value filter combinations. | DON'T: Allow multi-filter URL combinations to be indexed. |
| DO: Update old blog posts annually with fresh content and new product links. | DON'T: Write blog content with no formatting, headings, or internal links. |
