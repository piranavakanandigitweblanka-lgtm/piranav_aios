# Modern Product Section

---

## Metadata

| Field | Value |
|---|---|
| Section File | `sections/product-image-switch-grid.liquid` |
| Schema Name | 🎨 Product Gallery & Cart |
| Preset Category | Product |
| Theme | LEDsone UK Theme |
| Store | ledsone.myshopify.com |
| File Size | 1,862 lines |
| Architecture | Custom Web Component (vanilla JS) + Shopify Liquid + inline CSS |
| Created | 2026-06-26 |
| Documented By | Claude Code / piranav AIOS session |
| Reviewer | Varmen |

---

## Purpose

This section provides a curated, manually-configured product display that lets a merchant feature up to 12 specific product variants side by side on any page. Clicking a variant thumbnail swaps the main image, updates the price live, shows a per-product gallery, and allows direct add-to-cart — all without a page navigation.

It is designed for LEDsone UK's configurable LED lamp product lines where a customer must choose a lamp type before adding to cart. The static, schema-driven configuration means the merchant has full editorial control over which products appear, in what order, and with which images — independent of Shopify's collection or variant system.

---

## Business Question

**UX/CRO problem it solves:**

> "Customers arrive on a product page or landing page, see multiple lamp configurations, and do not know which one to pick or how to add the correct one to their cart."

**Before this section:**
- Customer had to navigate between multiple product pages to compare options
- Each product page showed only one product's images and price
- No visual switching between options without a page reload

**After this section:**
- Customer sees up to 12 product thumbnails in a horizontal strip
- Clicking any thumbnail instantly swaps the main image, price, and gallery
- The browser URL updates with `?variant=` so the selection is shareable/bookmarkable
- The Add to Cart button submits the correct variant ID for the selected product
- On success, the cart drawer opens automatically

---

## Files Modified

| Type | File | Change |
|---|---|---|
| Section | `sections/product-image-switch-grid.liquid` | New file — all code contained within |
| Snippets | None | No external snippets rendered |
| CSS | None | All styles inlined in `{% style %}` tags |
| JS | None | All JavaScript inlined in `<script>` tags |
| Assets | None | No new asset files |
| Layout | None | No layout files modified |
| Snippets Read | None | No `{% render %}` calls |

**Self-contained:** The section has zero external dependencies on other theme files.

---

## Features

### Product Card Layout

Two-column CSS Grid (`1fr 1fr` at ≥992px, stacked below). Max-width 1400px, centred.

- **Left column:** Main product image (1:1 aspect ratio, `object-fit: cover`, configurable border radius)
- **Right column (top to bottom):**
  1. Section subheading ("Choose the type of lamp to be configured" — hardcoded, see Known Limitations)
  2. Thumbnail switcher row (4–6 columns responsive)
  3. Price box (configurable label, font size, colours, border)
  4. Quantity selector
  5. Add to Cart button
  6. Cart message area
  7. Product gallery grid

### Responsive Design

| Breakpoint | Layout |
|---|---|
| `<768px` | Single column, thumbnails 4 per row, gallery 2 per row |
| `768px–991px` | Single column, thumbnails 6 per row, gallery 3 per row |
| `≥992px` | Two-column grid, thumbnails 6 per row, gallery 3–5 per row |
| `≥1200px` | Gallery 4 per row |
| `≥1400px` | Gallery 5 per row |

### Hover Effects

| Element | Effect |
|---|---|
| Thumbnail | Border colour changes to `sub_hover_border_color` |
| Active thumbnail | Border `sub_active_border_color` + `box-shadow` |
| Gallery image | `scale(1.02)` transform |
| Add to Cart button | `translateY(-2px)` lift + `box-shadow` |
| Zoom close button | `rotate(90deg)` |
| Zoom nav buttons | `scale(1.1)` |

### Product Information

Each product slot displays:
- Thumbnail image (switchable active state)
- Main hero image (swaps on selection)
- Live price (fetched from `/variants/[id].js`, fallback to manual price)
- Product description (injected into DOM on selection)
- 5-image gallery (built dynamically from `data-gallery-*` attributes)

### Buttons

**Add to Cart:**
- Submits via Shopify AJAX Cart API (`POST /cart/add.js`)
- Shows loading spinner while request is in flight
- `aria-busy="true"` on button during loading
- Success: button turns green, shows "✓ Added!", bounces, then resets
- Error: red message box displayed, auto-hides after 3 seconds
- Disabled state: grey, no hover transform

**Quantity selector:**
- Minus / Plus buttons with SVG icons
- Direct numeric input with validation (min 1)
- Resets to 1 on product switch

### Theme Customisation Settings

See the **Theme Customisation** section below for full schema documentation.

### Animations

| Animation | Trigger | CSS/JS |
|---|---|---|
| `ai-spin-[id]` | Add to Cart in progress | CSS `@keyframes`, 0.8s linear infinite |
| `ai-bounce-[id]` | Cart success | CSS `@keyframes`, 0.6s ease, button translates Y |
| `ai-cart-bounce-[id]` | Cart count update | CSS `@keyframes`, `scale(1.3)`, 0.5s |
| Zoom modal entrance | Click gallery image | `opacity 0` → `1` + `scale(0.9)` → `1`, `cubic-bezier(0.175, 0.885, 0.32, 1.275)` |
| Image opacity | Thumbnail switch | `transition: opacity 0.3s ease` on main image |
| Thumbnail border | Hover / active | `transition: all 0.3s ease` |

### Performance Considerations

| Consideration | Implementation |
|---|---|
| Scoped CSS | All selectors include the section ID — zero global style leakage |
| Custom Web Component | Registered once per section instance via `customElements.define` with guard |
| Lazy loading | Thumbnails and gallery images: `loading="lazy"` with explicit `width`/`height` |
| Main image | Also `loading="lazy"` — caution if section is above the fold (see Known Limitations) |
| Image sizing | `image_url: width: 800` for main, `width: 400` for thumbnails, `width: 1200` for zoom |
| No external libraries | Zero CDN dependencies — no jQuery, no Swiper, no Fancybox |
| Inline styles | No render-blocking CSS file requests |
| IIFE scope | All JavaScript wrapped in `(function() { 'use strict'; })()` |

---

## Theme Customisation

All settings are configurable in the Shopify Theme Editor without touching code.

### 🎯 Default Display

| Setting ID | Type | Default | Purpose |
|---|---|---|---|
| `default_image` | image_picker | — | Hero image shown before any thumbnail is clicked |
| `default_price` | text | `£0.00` | Price shown in price box before selection |
| `default_description` | text | `Select a product to view details` | Description before selection |
| `product_title` | text | `Premium Product` | Product name (used in commented-out title block) |

### 💰 Price Box

| Setting ID | Type | Default | Purpose |
|---|---|---|---|
| `price_label` | text | `Price` | Label above the price value |
| `price_font_size` | range 16–40px | `28` | Size of the price number |
| `price_bg_color` | color | `#ffffff` | Price box background |
| `price_color` | color | `#111111` | Price value text colour |
| `price_label_color` | color | `#666666` | Label text colour |
| `price_border_color` | color | `#e5e8ec` | Price box border |
| `price_border_radius` | range 0–20px | `8` | Price box corner rounding |

### 🖼️ Image Styling

| Setting ID | Type | Default | Purpose |
|---|---|---|---|
| `image_border_radius` | range 0–30px | `8` | Main hero image corner rounding |
| `sub_border_radius` | range 0–20px | `6` | Thumbnail + gallery image corner rounding |
| `sub_hover_border_color` | color | `#cccccc` | Thumbnail hover state border |
| `sub_active_border_color` | color | `#012f6d` | Thumbnail selected state border (LEDsone brand blue) |

### 🛒 Add to Cart Button

| Setting ID | Type | Default | Purpose |
|---|---|---|---|
| `button_text` | text | `Add to Cart` | Button label |
| `button_color` | color | `#012f6d` | Button background (matches LEDsone brand blue) |
| `button_hover_color` | color | `#001a3d` | Button hover background (darker shade) |

### 📦 Product Variants

| Setting ID | Type | Default | Purpose |
|---|---|---|---|
| `container_1_sub_count` | range 1–12 | `4` | How many product slots to render |

**Per product slot** (repeated for `N` = 1 to the value of `container_1_sub_count`):

Schema only defines explicit settings for products 1–4. Products 5–12 can be rendered (loop runs) but have no schema fields to configure without code edits. See Known Limitations.

| Setting ID Pattern | Type | Default | Purpose |
|---|---|---|---|
| `c1_sub_N_thumb` | image_picker | — | Small thumbnail shown in the switcher row |
| `c1_sub_N_main` | image_picker | — | Large hero image swapped on selection |
| `c1_sub_N_price` | text | `£49.99` / `£59.99` … | Manual price fallback if no variant ID |
| `c1_sub_N_variant_id` | text | — | Shopify variant ID — enables live price fetch and correct cart add |
| `c1_sub_N_handle` | text | — | Product URL handle — used for URL-based auto-selection |
| `c1_sub_N_url` | url | — | Full product URL — main image links here |
| `c1_sub_N_description` | textarea | `Premium quality product…` | Description shown on selection (currently commented out in HTML) |
| `c1_sub_N_gallery_1` | image_picker | — | Gallery image 1 |
| `c1_sub_N_gallery_2` | image_picker | — | Gallery image 2 |
| `c1_sub_N_gallery_3` | image_picker | — | Gallery image 3 |
| `c1_sub_N_gallery_4` | image_picker | — | Gallery image 4 |
| `c1_sub_N_gallery_5` | image_picker | — | Gallery image 5 |

---

## Dependencies

### Shopify APIs Used

| API | Endpoint | Purpose |
|---|---|---|
| AJAX Cart API | `POST /cart/add.js` | Add product to cart |
| AJAX Cart API | `GET /cart.js` | Fetch cart item count for header update |
| Variants API | `GET /variants/[id].js` | Fetch live price for selected variant |
| Section Rendering API | `GET ?section_id=...` | Cart drawer content refresh (theme-dependent) |

### Browser APIs Used

| API | Purpose |
|---|---|
| `customElements.define` | Register `<product-image-switch-[id]>` as a Web Component |
| `sessionStorage` | Flag to auto-open cart drawer after page reload |
| `URL` / `URLSearchParams` | Read `?variant=` from URL on load; update URL on switch |
| `window.history.replaceState` | Update browser URL without page reload |
| `fetch` | All API calls — no XMLHttpRequest |
| `requestAnimationFrame` | Deferred init inside `connectedCallback` |
| Keyboard events | `keydown` for Escape/ArrowLeft/ArrowRight in zoom modal |
| `document.dispatchEvent` | `cart:refresh` and `cart:updated` custom events |

### Cart Drawer Selectors (auto-detected)

The section attempts to open the cart drawer using these selectors (in order):
```
.header__icon--cart
[data-action="toggle-cart"]
.cart-icon
#cart-icon-bubble
```

If none match, the page reloads and the drawer does not auto-open.

### Snippets and Assets

| Type | Name | Used |
|---|---|---|
| Snippets | None | None |
| CSS files | None | All inline |
| JS files | None | All inline |
| Third-party libraries | None | Zero external dependencies |
| Metafields | None | No metafield reads |
| Shopify Liquid objects | `product`, `section.settings`, `section.id` | Standard — available in all section contexts |

---

## Evidence

### File Path

```
C:\Users\PC\Documents\piranav_aios\shopify_projects\ledsone-uk-theme\sections\product-image-switch-grid.liquid
```

### Desktop Draft (Source)

```
C:\Users\PC\Desktop\product-image-switch-grid.liquid  (1,127 lines — earlier draft)
C:\Users\PC\Desktop\my code.liquid                    (1,088 lines — earlier draft)
```

Theme version (1,862 lines) is the extended final version. Desktop copies are earlier iterations.

### Git Status

The theme folder (`shopify_projects/ledsone-uk-theme/`) is **untracked** in the AIOS git repository. The theme has no independent git history. No commit hash is available for this section file.

The section exists in the live theme as pulled by Shopify CLI 4.2.0 from `ledsone.myshopify.com`.

### Git Diff Summary

Not available — no git history for the theme folder. See risks in `evidence/2026-06-26_theme_setup_verification.md` (R-005: no standalone git repo for theme).

### Screenshots

None available in this session. Theme was verified structurally but not rendered in a browser during this documentation session.

---

## Validation

| Check | Method | Result |
|---|---|---|
| File exists in theme | `ls sections/` — confirmed present | PASS |
| File is valid Liquid syntax | Read: `{% schema %}` closes at line 1861, `{% style %}` closes at line 581, `<script>` closes at line 1425 — structure complete | PASS |
| Schema has valid JSON | Schema block parses — all settings have `type`, `id`, `label` | PASS |
| Custom element registered with guard | `if (!customElements.get(...))` check present — safe for multiple instances | PASS |
| Cart API call uses correct format | `POST /cart/add.js` with `{ items: [{ id, quantity }] }` — matches Shopify AJAX API spec | PASS |
| Price currency hardcoded | `£` symbol hardcoded in JS — will not auto-adapt to multi-currency | KNOWN ISSUE |
| Main image LCP risk | `loading="lazy"` on main image — risk if above fold | KNOWN ISSUE |
| Live push to store | NOT performed in this session — no Shopify CLI push executed | NOT TESTED |
| Visual browser test | NOT performed in this session | NOT TESTED |

**Overall validation status: STRUCTURAL PASS / LIVE UNTESTED**

A full PASS requires:
1. `shopify theme push --store ledsone.myshopify.com --development` to a development theme
2. Visual test on desktop and mobile
3. Add-to-cart test with a real variant ID
4. Cart drawer auto-open confirmation

---

## Duplicate Risk

**Assessment: GREEN**

| Existing Section | Purpose | Overlap | Verdict |
|---|---|---|---|
| `sections/products-grid.liquid` | Dynamic collection grid pulled from Shopify collection object | Displays products from a collection automatically — no image switching, no inline cart, no gallery | No overlap |
| `sections/product-collection-showcase.liquid` | Collection card layout with promo labels | Shows collection thumbnails with a "More" link — no switching, no cart | No overlap |
| `sections/custom-featured-grid.liquid` | Static featured grid with main/small product position | Layout-only — no image switching, no gallery, no add-to-cart | No overlap |
| `sections/main-product.liquid` | Standard product page | Single-product Shopify variant selector — not multi-product, different architecture | No overlap |
| `sections/product-quickview.liquid` | Quick-view modal triggered from collection | Overlay UX, not a standalone page section | No overlap |

**Why this section is unique:** No other section in the theme combines (a) manual multi-product thumbnail switching, (b) live variant price fetching, (c) per-product expandable gallery with fullscreen zoom, and (d) inline Add to Cart with drawer auto-open — all in a single self-contained custom Web Component.

---

## Known Limitations

| # | Limitation | Impact | Workaround |
|---|---|---|---|
| L-001 | Schema defines product settings for slots 1–4 only. Slots 5–12 have no schema fields. | Cannot configure products 5–12 from Theme Editor. | Edit `{% schema %}` to add `Product 5` through `Product 12` blocks following the same pattern. |
| L-002 | Price hardcodes `£` in JavaScript (`\`£${price}\``). | Will display `£` on all storefronts regardless of currency or `money_format` setting. | Replace with `Shopify.formatMoney(variant.price, window.theme.moneyFormat)` or equivalent. |
| L-003 | Cart drawer auto-open uses page reload + `sessionStorage` + 30ms timeout heuristic. | May cause a visible page reload flash. On themes with no matching cart icon selector, drawer never opens. | Use Shopify's Section Rendering API to update cart without reload. |
| L-004 | Subheading "Choose the type of lamp to be configured" is hardcoded in HTML (line 634). | Cannot change via Theme Editor — requires code edit. | Move to a schema `text` setting. |
| L-005 | Main image uses `loading="lazy"`. | If section is placed above the fold, the LCP image will be deferred — Lighthouse penalty. | Add an `eager_load` checkbox schema setting and conditionally apply `loading="eager"`. |
| L-006 | Product description is commented out in the HTML (`{% comment %}` block). | Description field per product is non-functional — schema setting exists but renders nothing. | Remove the `{% comment %}` wrapper to re-enable. |
| L-007 | No Shopify Blocks architecture. | All product slots are flat section settings. Cannot reorder, add, or remove products without knowing slot numbers. | Refactor to use `blocks` with type `product_slot`. |

---

## Future Improvements

| Priority | Improvement | Notes |
|---|---|---|
| HIGH | Extend schema to products 5–12 | Straightforward — copy the Product 1–4 pattern |
| HIGH | Replace `£` with `Shopify.formatMoney()` | Needed for multi-currency or market expansion |
| HIGH | Make subheading a schema text setting | Quick fix, improves merchant control |
| MEDIUM | Remove the description `{% comment %}` | Re-enables per-product descriptions |
| MEDIUM | Change to `loading="eager"` option for above-fold placement | Add checkbox to schema |
| MEDIUM | Refactor to Shopify Blocks | Removes the 12-product cap, enables drag-to-reorder |
| LOW | Add wishlist/compare button per thumbnail | Consistent with other LEDsone product sections |
| LOW | Keyboard focus management for thumbnails | Full ARIA compliance for accessibility |

---

## Queryability

**What is this?**

A custom Shopify section (`product-image-switch-grid.liquid`) that displays a curated set of up to 12 product variants with interactive thumbnail switching, a live price box, an expandable gallery with fullscreen zoom, and an inline Add to Cart form — all in a single self-contained file.

**Why was it created?**

To solve the LEDsone UK use case where customers must choose between multiple configurable LED lamp types before adding to cart. Standard Shopify collection grids don't allow per-product gallery expansion or inline cart submission from a multi-product view.

**Which files does it depend on?**

Only itself. No snippets, no CSS assets, no JavaScript files, no third-party libraries. It calls Shopify's own AJAX APIs (`/cart/add.js`, `/cart.js`, `/variants/[id].js`) and the browser's native Web Components API.

**How does another developer modify it?**

1. **Add more products (5–12):** In `{% schema %}`, copy the `Product 4` block (lines ~1787–1854) and repeat for products 5–12, changing the header content and all ID prefixes from `c1_sub_4_` to `c1_sub_5_`, etc.
2. **Change the subheading:** Find line 634 (`Choose the type of lamp to be configured`) and either edit the text directly or move it to a schema `text` setting.
3. **Fix currency:** In the `updatePrice()` method (~line 1046), replace the `£${price}` template literal with `Shopify.formatMoney(variant.price)`.
4. **Re-enable descriptions:** Remove the `{% comment %}` and `{% endcomment %}` tags around the `ai-cart-title` and `ai-product-description` div blocks (~lines 731–737).
5. **Style changes:** All CSS is scoped to the section via `ai_gen_id`. Edit within the `{% style %}` block (lines 3–581). Never add global selectors — always append `-{{ ai_gen_id }}`.

**What should be tested after changes?**

| Test | Method |
|---|---|
| Thumbnail selection | Click each thumbnail — confirm main image, price, and gallery update |
| Price accuracy | Compare displayed price against Shopify Admin variant price |
| Add to Cart | Add each product variant and confirm it appears in cart correctly |
| Cart drawer | Confirm drawer opens automatically after add to cart |
| URL state | Check `?variant=` updates on switch; reload page and confirm correct thumbnail auto-selects |
| Gallery zoom | Open zoom modal; use arrows and keyboard (←/→/Esc) |
| Mobile | Repeat all tests at 375px width |
| Multiple instances | Place two of these sections on the same page — confirm IDs don't collide |

---

## Output Summary

| Item | Result |
|---|---|
| Section File | `sections/product-image-switch-grid.liquid` |
| Files Changed | 1 — section file only (self-contained) |
| Duplicate Risk | GREEN — no existing section shares this feature combination |
| Validation | STRUCTURAL PASS / LIVE UNTESTED — push to dev theme required for full PASS |
| Documentation Created | YES — `docs/shopify-sections/MODERN_PRODUCT_SECTION.md` |
| Ready for Git Commit | YES — documentation file only; theme section requires live push validation first |
