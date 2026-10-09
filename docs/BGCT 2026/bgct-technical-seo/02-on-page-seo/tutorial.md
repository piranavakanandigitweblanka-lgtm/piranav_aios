# Tutorial — On-Page SEO

**Status:** DRAFT — Liquid code examples require review by Sajeesan before team rollout
**Sheet:** On-Page SEO (BGCT workbook, Sheet 2)
**Tasks covered:** OP-1 through OP-8
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx`
**Last updated:** 2026-10-09

---

## Prerequisites

- Access to Shopify Admin (staff account with Online Store and Products permissions)
- Access to Google Search Console
- Google Rich Results Test (no login required): https://search.google.com/test/rich-results
- Screaming Frog SEO Spider (optional but recommended for bulk audits)

---

## OP-1 — Meta Titles Optimization

### Steps

1. In **Shopify Admin**, open any **Product**, **Collection**, or **Page**.
2. Scroll to the bottom of the page to find the **"Search engine listing preview"** section.
3. Click **"Edit"**.
4. In the **"Page title"** field, enter your optimised title. Format: `[Primary Keyword] | [Value Prop] | [Brand]`
   - Example: `LED Strip Lights — Flexible 12V RGB | Free UK Delivery | LEDSone`
5. Check the character counter shown below the field. Aim for 40–60 characters.
6. Click **"Save"**.

### Bulk-editing titles
For large stores, use a CSV export/import:
1. Admin → Products → Export → Export products (all).
2. Open CSV in Google Sheets.
3. Find the column `SEO Title`.
4. Edit values in that column.
5. Import the updated CSV via Admin → Products → Import.

### How to validate
Open an incognito browser window. Search Google for `site:yourdomain.com product-name`. Confirm the title shown matches your updated title (may take 1–14 days to update in Google).

---

## OP-2 — Meta Descriptions Optimization

### Steps

1. Same as OP-1: Admin → Product/Collection/Page → "Search engine listing preview" → Edit.
2. Fill in the **"Description"** field.
3. Example: `Shop professional-grade LED strip lights. 12V RGB, flexible, cut-to-size. Free next-day UK delivery on orders over £50. Buy direct from LEDSone.`
4. Keep under 155 characters. Check the counter.
5. Click **Save**.

---

## OP-3 — Heading Structure (H1–H6) Cleanup

### Inspect via View Page Source
1. Open a product page in your browser.
2. Right-click → **View Page Source** (Ctrl+U).
3. Ctrl+F → search `<h1`.
4. Count the number of `<h1` occurrences. There should be exactly one.
5. Check that the H1 content matches the product title.

### Fix via Shopify Theme Code
1. Admin → Online Store → Themes → Edit Code.
2. Open `sections/main-product.liquid` (or equivalent in your theme).
3. Find the `<h1>` tag (usually: `<h1 class="product__title">{{ product.title }}</h1>`).
4. If a second `<h1>` appears elsewhere in the file, change it to `<h2>` or use a CSS class like `class="h1"` for visual styling only.
5. Save. Re-test via View Page Source.

### CSS class approach (for visual headings that are not true headings)
```html
<!-- Wrong: using <h1> just to make text large -->
<h1>Free Delivery on All Orders</h1>

<!-- Correct: using a CSS class for visual styling, not a heading tag -->
<p class="h1">Free Delivery on All Orders</p>
```

---

## OP-4 — Image Alt Text Audits

### Add alt text to a single product image
1. Admin → Products → click on the product.
2. In the Media section, click on an image thumbnail.
3. A panel appears on the right: click **"Add alt text"**.
4. Type a description: `Warm white LED strip light installed under kitchen cabinets`.
5. Click **"Apply changes"**.

### Add alt text via CSV bulk export
1. Admin → Products → Export.
2. Open the CSV.
3. Find the `Image Alt Text` column.
4. Add descriptions for rows where this is empty.
5. Import updated CSV.

### Fix alt text in theme Liquid (for section images)
```liquid
{{ section.settings.image | image_url: width: 1200 | image_tag: alt: section.settings.image_alt, loading: 'lazy' }}
```
Ensure the schema for the section includes an `image_alt` text field.

---

## OP-5 — Schema / Structured Data (Product)

### Check existing Product schema
1. Open any product page on your store.
2. Go to https://search.google.com/test/rich-results
3. Enter the product page URL and click "Test URL".
4. Under "Detected structured data", look for "Product".
5. Expand it to see detected fields and any errors.

### If schema is missing — use JSON-LD for SEO app
1. In Shopify Admin → Apps → App Store → search "JSON-LD for SEO".
2. Install the app.
3. It automatically injects Product schema on all product pages.
4. Re-test with the Rich Results Test.

### If schema is present but has errors
1. In Admin → Themes → Edit Code → open `main-product.liquid` or `product.json.liquid`.
2. Find the `<script type="application/ld+json">` block.
3. Copy it into https://validator.schema.org/ to identify the specific error.
4. Fix the field causing the error (e.g., missing `priceCurrency`, incorrect `@type`).
5. Re-test with Rich Results Test.

---

## OP-6 — Schema / Structured Data (Breadcrumb)

### Add BreadcrumbList JSON-LD to the breadcrumbs snippet
1. Admin → Themes → Edit Code → find `snippets/breadcrumbs.liquid`.
2. Add this JSON-LD block below the visible breadcrumb HTML:

```liquid
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "{{ shop.url }}"
    }
    {%- if collection -%}
    ,{
      "@type": "ListItem",
      "position": 2,
      "name": {{ collection.title | json }},
      "item": "{{ shop.url }}{{ collection.url }}"
    }
    {%- endif -%}
    {%- if product -%}
    ,{
      "@type": "ListItem",
      "position": 3,
      "name": {{ product.title | json }}
    }
    {%- endif -%}
  ]
}
</script>
```

3. Save. Test with the Google Rich Results Test.

---

## OP-7 — Schema / Structured Data (FAQ & Review)

### Add FAQ schema to a Shopify Page
1. Admin → Online Store → Pages → open the FAQ page.
2. In the content editor, click the `<>` (HTML) button.
3. At the end of the content, paste the JSON-LD:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What voltage do LED strips use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most LED strips use 12V DC. Always check the product specifications before purchase."
      }
    }
  ]
}
</script>
```

4. Save. Test with Rich Results Test.

### Verify review app schema
1. Admin → Apps → confirm review app is installed.
2. Open a product page with existing reviews.
3. View Page Source → search `AggregateRating`.
4. Confirm it is present with a real `ratingValue` and `ratingCount`.

---

## OP-8 — Duplicate Content Fixes

### Check for duplicate content with Siteliner
1. Go to https://www.siteliner.com/
2. Enter your store's domain and run a free scan.
3. Review the "Duplicate Content" report.
4. Any page with >80% duplicate content is a candidate for rewriting.

### Fix: rewrite a product description
1. Admin → Products → open the product.
2. In the Description field, rewrite the text to be unique to this product.
3. Focus on specific features, dimensions, applications, and benefits of this particular product.
4. Save.

### Fix: noindex collection filter tag pages (Shopify Liquid)
Add this to `theme.liquid` inside the `<head>` tag:
```liquid
{%- if template contains 'collection' and current_tags.size > 0 -%}
  <meta name="robots" content="noindex, follow">
{%- endif -%}
```
This noindexes collection pages filtered by tags (e.g., `/collections/all/shirts`) without noindexing the base collection.

### Fix: canonical for sort-by parameters
Shopify's `{{ canonical_url }}` automatically strips `?sort_by=` parameters. Verify this is working by viewing source on a sorted collection page and confirming the canonical does not include the `?sort_by=` parameter.

---

## DO's and DON'Ts

| DO | DON'T |
|---|---|
| DO: Include modifiers like "Buy", "Best", current year in titles for better CTR. | DON'T: Keyword stuff titles ("Red Shoes, Buy Red Shoes, Red Shoes Online"). |
| DO: Include the primary keyword in the meta description (Google bolds it). | DON'T: Use the same description across hundreds of product pages. |
| DO: Use H2 tags for main content sections with secondary keywords. | DON'T: Use heading tags to make text bold or larger — use CSS. |
| DO: Keep alt text concise (under 125 characters). | DON'T: Use "Image of" or "Photo of" as alt text prefixes. |
| DO: Include GTIN/UPC in Product schema if you have them. | DON'T: Apply Product schema to collection pages. |
| DO: Match BreadcrumbList schema to visible breadcrumbs on the page. | DON'T: Include the current page as a linked item in breadcrumb schema. |
| DO: Keep FAQ answers concise so they display well in Google. | DON'T: Write FAQ schema for promotional marketing content. |
| DO: Consolidate similar products into one product with variants. | DON'T: Create landing pages that are clones of the homepage with one word changed. |
