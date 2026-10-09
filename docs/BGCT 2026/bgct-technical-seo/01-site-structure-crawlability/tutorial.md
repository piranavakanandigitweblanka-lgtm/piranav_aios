# Tutorial — Site Structure & Crawlability

**Status:** DRAFT — Liquid code examples require review by Sajeesan before team rollout
**Sheet:** Site Structure & Crawlability (BGCT workbook, Sheet 1)
**Tasks covered:** SS-1 through SS-7
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx`
**Last updated:** 2026-10-09

---

## Prerequisites

- Access to Google Search Console (property verified for the target store)
- Access to Shopify Admin (staff account with Online Store permissions)
- Screaming Frog SEO Spider installed (free version covers up to 500 URLs; licence required for larger stores)
- Access to Ahrefs or Ahrefs Webmaster Tools (free)

---

## SS-1 — Fix Crawl Errors

### Steps

1. Log in to **Google Search Console** (https://search.google.com/search-console).
2. Select the correct property for your store.
3. In the left menu, go to **Indexing → Pages**.
4. Look at the "Why pages aren't indexed" section on the right.
5. Click **"Server error (5xx)"** if it appears. This opens a list of affected URLs.
6. Export the list (Download button, top right of the list).
7. Share the exported list with the developer and report the issue as **Critical**.
8. For **"Blocked by robots.txt"** on pages that should be indexed, see Tutorial SS-4.
9. For **"Submitted URL returns unauthorized request (403)"**, check which Shopify apps manage access to those paths and review their settings.
10. Mark the fix as resolved in GSC after 2–3 weeks by clicking **"Validate Fix"** on the affected group.

### How to interpret results
- "Crawl anomaly" = intermittent error; monitor but do not escalate unless it persists for 7+ days.
- "Server error (5xx)" = systematic failure; escalate immediately.
- "Discovered – currently not indexed" = Googlebot found the page but chose not to index it; this is a content quality or crawl budget issue, not a server error.

### Validate the fix
After the developer resolves the issue, return to GSC → Indexing → Pages → click the error group → click "Validate Fix".

---

## SS-2 — Broken Links (404s)

### Steps

1. In **Shopify Admin**, go to **Online Store → Navigation → URL Redirects**.
2. To add a single redirect:
   - Click **"Add URL redirect"**.
   - In "Redirect from": enter the old broken URL (e.g., `/products/old-product-handle`).
   - In "Redirect to": enter the replacement URL (e.g., `/products/new-product-handle`).
   - Click **"Save redirect"**.
3. To bulk import redirects:
   - Export the existing list (click "Export").
   - Open the CSV file.
   - Add new rows: Column A = old URL, Column B = new URL.
   - Save and re-import via the Import button.
4. After import, test 3–5 redirect URLs in a browser. Type the old URL and confirm it reaches the correct page.

### How to interpret results
- Browser shows the correct page → 301 redirect is working.
- Browser shows a 404 → redirect was not saved correctly; re-check the import.
- Browser shows the homepage → redirect is generic (not best practice); update to a more specific target.

### Validate the fix
Wait 2–4 weeks, then return to GSC → Pages → "Not found (404)" and confirm the affected URLs have dropped off the list.

---

## SS-3 — Redirect Chains

### Steps

1. Export Shopify URL Redirects: Admin → URL Redirects → Export as CSV.
2. Open the CSV in a spreadsheet (Excel or Google Sheets).
3. In a new column, use a VLOOKUP to check if any value in Column B (Redirect To) also appears in Column A (Redirect From):
   - Formula: `=IFERROR(VLOOKUP(B2, $A:$A, 1, 0), "OK")`
4. Any row where this returns a match is a redirect chain.
5. For each chain: find the **final destination** URL (the end of the chain).
6. Go to Admin → URL Redirects → find the first URL in the chain → edit "Redirect to" to point directly to the final destination.
7. Test in browser: type the first URL → confirm it reaches the final destination in one step.

### How to interpret results
- Browser resolves in one step → chain collapsed successfully.
- Browser still shows intermediate page → Shopify may have cached the redirect; clear browser cache and test again.

### Validate the fix
Run Screaming Frog after fix → filter by "Redirect chains" → should show zero.

---

## SS-4 — Optimize robots.txt

### Steps

1. In **Shopify Admin**, go to **Online Store → Themes → your live theme → Edit Code**.
2. In the Templates section, look for `robots.txt.liquid`.
3. If it does not exist: click **"Add a new template"** → select `robots.txt` from the dropdown.
4. Shopify will generate a default template. Review it — the default blocks cart, checkout, account, and internal pages automatically.
5. To add a custom rule, find the block beginning with `{%- if group.user_agent.value == '*' -%}` and add your custom `Disallow` lines:

```liquid
{%- if group.user_agent.value == '*' -%}
  {%- for rule in group.rules -%}
    {{- rule -}}
  {%- endfor -%}
  Disallow: /a/downloads/-/*
  Disallow: /blogs/news/tagged/
{%- endif -%}
```

6. Click **Save**.
7. Open a new browser tab and navigate to `https://yourdomain.com/robots.txt` to confirm the change is live.
8. In **Google Search Console**, go to **Settings → robots.txt** (or use the legacy robots.txt tester tool).
9. Test: enter `/products/` → should say "Allowed". Enter `/cart` → should say "Blocked".

### How to interpret results
- "Allowed" for product and collection URLs = correct.
- "Blocked" for cart and checkout = correct.
- "Allowed" for cart = error — check your Disallow rule syntax.

### Rollback instructions
If the change causes issues, the safest rollback is to delete the custom `robots.txt.liquid` template. Shopify will revert to the auto-generated default. Do not delete the file without first exporting a copy.

---

## SS-5 — Optimize sitemap.xml

### Steps

1. Open a browser and navigate to `https://yourdomain.com/sitemap.xml`.
2. Confirm the file loads and shows links to sub-sitemaps (products, pages, collections, blogs).
3. Log in to **Google Search Console** → **Indexing → Sitemaps**.
4. If the sitemap is not already listed:
   - Click **"Add a new sitemap"**.
   - Enter `sitemap.xml` in the field.
   - Click **Submit**.
5. Click on the submitted sitemap row to see the "Discovered URLs" vs "Indexed" breakdown.
6. If you need to exclude a page from the sitemap (e.g., a low-value internal page):
   - In Shopify Admin, go to the page/product.
   - Scroll to **"Search engine listing preview"** → click **"Edit"**.
   - Tick **"Hide this page from search engines"**.
   - Click Save.
   - This sets the `seo.hidden` metafield automatically.

### How to interpret results
- "Success" in Sitemaps report = Googlebot can fetch the file.
- High "discovered but not indexed" count = possible thin content or crawl budget issue; escalate to Sajeesan if >20% of submitted pages are not indexed after 4 weeks.

### Validate the fix
Return to GSC → Sitemaps → note the indexed count. Compare monthly to confirm the index is growing.

---

## SS-6 — Canonical Tag Audits & Fixes

### Fix 1: Verify the canonical tag is present in theme.liquid

1. In **Shopify Admin**, go to **Online Store → Themes → Edit Code**.
2. Open `layout/theme.liquid`.
3. In the `<head>` section, confirm this line exists:
   ```html
   <link rel="canonical" href="{{ canonical_url }}">
   ```
4. If missing, add it inside the `<head>` tag. Save.

### Fix 2: Fix product card links that output collection-scoped URLs

1. In **Shopify Admin → Themes → Edit Code**, find your product card template. This is usually:
   - `snippets/card-product.liquid`
   - `snippets/product-card.liquid`
   - `sections/main-collection-product-grid.liquid`
2. Search for `within: collection` in the file.
3. Find the `<a>` tag containing: `href="{{ card_product.url | within: collection }}"`
4. Change it to: `href="{{ card_product.url }}"`
5. Save. Test by hovering over a product card on a collection page — the URL in the browser status bar should not contain `/collections/`.

### Fix 3: Check canonical via browser

1. Open any product page on your store.
2. Right-click → **View Page Source** (or press Ctrl+U).
3. Use Ctrl+F to search for `canonical`.
4. Confirm there is exactly one `<link rel="canonical">` tag and the URL it contains is the root `/products/` URL.

### How to interpret results
- One canonical tag with root `/products/` URL → PASS.
- Missing tag → add via theme.liquid fix above.
- Two canonical tags → check for conflicting app scripts; escalate to developer.
- Canonical contains `/collections/` → fix product card Liquid (Fix 2 above).

### Rollback instructions
If the card-product.liquid change causes any display issues, revert the `{{ card_product.url }}` change back to `{{ card_product.url | within: collection }}` and escalate to developer.

---

## SS-7 — Hreflang Setup for Multilingual

### Steps (Using Shopify Markets — Recommended)

1. In **Shopify Admin**, go to **Settings → Markets**.
2. Confirm the relevant market exists (e.g., "United Kingdom", "France").
3. Under each market, confirm the correct language is assigned (e.g., English for UK, French for France).
4. Shopify will inject `hreflang` tags automatically into the theme. No manual code change is needed.
5. To verify: open a product page on the UK version of your store → right-click → **View Page Source** → Ctrl+F → search `hreflang`.
6. Confirm tags like these are present:
   ```html
   <link rel="alternate" hreflang="en-GB" href="https://yourdomain.co.uk/products/handle">
   <link rel="alternate" hreflang="fr-FR" href="https://yourdomain.fr/products/handle">
   <link rel="alternate" hreflang="x-default" href="https://yourdomain.com/products/handle">
   ```
7. Validate using the hreflang checker tool: https://technicalseo.com/tools/hreflang/
8. Enter the URL of each language variant and confirm all pages reference each other correctly.

### How to interpret results
- All languages reference each other + x-default present → PASS.
- Missing reciprocal links → the Markets configuration may be incomplete; check each market has the correct language assigned.
- Tags present but incorrect ISO codes → escalate to developer if Shopify Markets is generating wrong codes.

### Escalation
If the store is using a third-party translation app (Weglot, Langify, Translate & Adapt), verify the app's hreflang output separately. The app's documentation will specify whether it handles hreflang automatically.

### DO's and DON'Ts

| DO | DON'T |
|---|---|
| DO: Act immediately on 5xx errors in GSC. | DON'T: Ignore GSC alert emails about crawl capacity. |
| DO: Use a branded 404 page with a search bar and popular products. | DON'T: Let 404 errors accumulate over months without review. |
| DO: Collapse redirect chains directly to the final destination. | DON'T: Create redirect loops (A → B → A) which make pages inaccessible. |
| DO: Use the GSC robots.txt tester after every change to the file. | DON'T: Block `/collections/all` unless you have confirmed it holds no ranking value. |
| DO: Check the GSC Sitemaps coverage report after submission. | DON'T: Build a sitemap manually — let Shopify handle it dynamically. |
| DO: Use self-referencing canonical tags on all main pages. | DON'T: Point a canonical tag to a 301 redirect or 404 page. |
| DO: Use Shopify Markets or a premium translation app for hreflang. | DON'T: Hardcode hreflang tags directly into theme.liquid for dynamic pages. |
