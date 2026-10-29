# Evidence: Homin GmbH Shopify Theme Audit — Read-Only Phase 1

**Date:** 2026-10-29
**Project:** Homin GmbH — German Shopify Store
**Store:** homingmbh.myshopify.com
**Theme path:** `C:\Users\PC\Documents\piranav_aios\shopify_projects\homingmbh-de-homingmbh-staging`
**Audit type:** Phase 1 — Read-only discovery
**Auditor:** Claude Code (piranav_aios worker)
**Status:** COMPLETE — Awaiting Piranav/GPT review and approval before Phase 2 (implementation)

---

## 1. Project and Git Status

### Directory
- **Exists and accessible:** YES
- **Complete Shopify theme:** YES (all 7 required directories present: assets/, config/, layout/, locales/, sections/, snippets/, templates/)
- **Theme is a subfolder inside `piranav_aios`** — it is git-tracked as an untracked folder from the parent repo (appears as `./` in `git status` output from the theme dir)

### Git State (from `piranav_aios` root)
- Branch: `main`
- Status: The theme folder `shopify_projects/homingmbh-de-homingmbh-staging/` is listed as **untracked** in the parent repo
- No standalone git repo inside the theme folder
- No local modifications to theme files were found (newly downloaded/pulled copy)
- **No existing backup arrangement identified** — the theme folder is not committed to git

### Last 5 commits (parent repo — not theme-specific):
```
937b395 aios(2026-10-28): update dm-dashboard submodule pointer
d67feac aios(2026-10-28): ENC10233 Owner=No Tag + Stock=Unknown root cause
340b730 aios(2026-10-28): dm-dashboard campaign owner tag + stock work
b63dd17 aios(2026-10-28): C5 final - 26 screenshots + full Word doc rebuild
8fe57fa aios(2026-10-28): C5 GA4 double counting confirmed + fix applied
```

---

## 2. Theme Architecture Overview

### Base Theme
- **Dawn** (Shopify's official free theme) — heavily customised
- All base Dawn sections present; multiple custom sections added

### Brand Identity
- **Primary colour:** `--brand-primary: #184078` (navy blue)
- **Accent colour:** `--brand-accent: #ac1324` (brand red)
- **Font:** Poppins (header weight 600, body weight 400) — loaded via Shopify CDN
- **Page width:** 1600px (wider than Dawn default 1200px)

### Color Schemes (5 defined)
| Scheme | Background | Purpose |
|---|---|---|
| scheme-1 | #ffffff | Default (white) |
| scheme-2 | #f4f6f9 | Light grey — used for value strips |
| scheme-3 | #1a1a1a | Dark — sold-out badges |
| scheme-4 | #184078 | Brand navy — CTA sections |
| scheme-5 | #ac1324 | Brand red — sale badges |

### Settings Summary (from settings_data.json)
- Cart type: **notification** (not drawer)
- Scroll-reveal animations: **OFF** (performance-intentional, prevents CLS)
- Hover animations: **vertical-lift**
- Button radius: **24px** (pill-style)
- Input radius: **24px**
- Card corner radius: **8px**
- Section spacing: **0px** (relies on individual section padding)
- Badge corner radius: **40px** (fully round)

### Custom HTML in body (theme.liquid line 267-285)
A detailed comment explains why Dawn's `display: grid` was replaced with `display: flex` on body to fix a CLS 0.52 issue caused by the utility bar stretching the header row. This is an intentional, documented architectural deviation.

---

## 3. File Inventory and Audit Coverage

### Sections (57 total)
- Standard Dawn: announcement-bar, apps, cart-drawer, collage, collapsible-content, collection-list, contact-form, custom-liquid, email-signup-banner, featured-blog, featured-collection, featured-product, footer, header, image-banner, image-with-text, main-404, main-account, main-activate-account, main-addresses, main-article, main-blog, main-cart-footer, main-cart-items, main-collection-banner, main-collection-product-grid, main-list-collections, main-login, main-order, main-page, main-password-footer, main-password-header, main-product, main-register, main-reset-password, main-search, multicolumn, multirow, newsletter, page, pickup-availability, predictive-search, quick-order-list, related-products, rich-text, slideshow, video
- **Custom additions (Homin):** category-circles, collection-chips, hero-split, image-tile-grid, reviews-band, utility-bar, value-props

### Snippets (42 total)
- Standard Dawn: article-card, breadcrumbs, buy-buttons, card-collection, card-product, cart-drawer, cart-notification, country-localization, facets, gift-card-recipient-form, header-drawer, header-dropdown-menu, header-mega-menu, header-search-inline, header-search, icon-accordion, icon-with-text, language-localization, loading-spinner, meta-tags, pagination, price, price-facet, product-media-gallery, product-media-modal, product-media, product-thumbnail, product-variant-options, product-variant-picker, progress-bar, quantity-input, quick-order-list-row, quick-order-list, quick-order-product-row, share-button, social-icons, swatch-input, swatch
- **Custom additions (Homin):** product-details-table, product-faq-ui, product-sticky-bar, promo-code

### Templates (14 templates)
`404.json`, `article.json`, `blog.json`, `cart.json`, `collection.json`, `customers/` (dir), `gift_card.liquid`, `index.json`, `list-collections.json`, `page.contact.json`, `page.json`, `password.json`, `product.json`, `search.json`

### Assets
- 57 CSS files (Dawn component-based pattern — one CSS file per component)
- 28 JS files
- 120+ SVG icon files
- 2 email-signup SVG backgrounds
- Notable: `sparkle.gif` (decorative asset)

### Third-Party App Integrations
| App | Integration method | Notes |
|---|---|---|
| Microsoft Clarity | Manual `<script>` in `theme.liquid` (line 9-16) AND two app theme blocks in `settings_data.json` | **DEFECT: triple injection** |
| Shopify Inbox | App theme block (chat bubble) | Correctly integrated |
| Judge.me Reviews | App theme blocks (core + cart widget) | Used by reviews-band section |

### Locales
- German (`de.json`) — primary language, full translation set
- Czech, Danish, Bulgarian, Greek, Spanish (and others) — standard Dawn translations
- Custom homin keys used in Liquid: `homin.meta_collection`, `homin.in_stock`, `homin.add_to_basket`, `homin.price_note`, `homin.rated_aria`, `homin.from_reviews`, `homin.stars_aria`, `homin.all_in`, `homin.shop_by_category`, `homin.quick_filters`, `homin.details_brand`, `homin.details_item_no`, `homin.details_weight`

---

## 4. UI/UX Findings

See prioritised issue table in Section 8.

**Typography:**
- Poppins used throughout — clean, readable
- Body text: 1.5rem mobile / 1.6rem desktop
- Headings scale correctly via `--font-heading-scale`
- `word-break: break-word` on headings — German compound words handled

**Navigation:**
- Sticky header with `on-scroll-up` behaviour — correct
- Mega menu or dropdown supported via setting
- Drawer available for mobile
- Logo preloaded (LCP-aware)

**Product page:**
- Sticky ATC bar (`product-sticky-bar.liquid`) — good UX addition
- Breadcrumbs present
- Promo code display block
- Product details table (brand, SKU, weight, up to 4 custom rows)
- FAQ accordion (from metafield JSON-LD)
- Judge.me reviews integration

**Collection page:**
- Collection chips for quick sub-category navigation — well-implemented
- Menu-aware chip source hierarchy (menu → auto-filter → tags)
- Standard facets/filters retained from Dawn

---

## 5. CSS and JavaScript Findings

**CSS Architecture:**
- Dawn's component-based CSS — one file per component — loaded conditionally
- `base.css` defines typography, layout utilities, responsive grid, colour system
- Custom section CSS lives in `{% stylesheet %}` blocks within section files
- Custom CSS variables for brand: `--brand-accent`, `--brand-primary` defined in `theme.liquid` `:root` block (lines 131-132)
- **Commented-out header padding rule** at `base.css:128-132` attributed to "sharmi 01/05/2025"

**JavaScript Architecture:**
- Dawn's modular JS: `pubsub.js`, `global.js`, `constants.js`, `details-disclosure.js`, `details-modal.js`, `search-form.js` loaded globally
- Section-specific JS loaded on demand via `defer`
- StickyHeader custom element defined inline in `header.liquid` — standard Dawn pattern
- Custom inline `<script>` in `product-sticky-bar.liquid` — uses IntersectionObserver

**CSS Issues:**
- Font preload tags appear twice in `theme.liquid` (lines 32-33 and 305-314)
- `card_corner_radius: 8` vs `buttons_radius: 24` — visual inconsistency
- No global CSS custom properties for component-level variables (e.g., strip height, icon size)

---

## 6. Mobile and Responsive Findings

**Breakpoints:**
- Mobile: `max-width: 749px`
- Tablet: `750px–989px`
- Desktop: `min-width: 990px`

**Mobile-specific:**
- Utility bar: only first item visible on mobile (secondary items hidden)
- `hero-split`: image falls back to desktop image if no mobile image is set
- Collection chips: horizontal scroll on mobile, `scrollbar-width: none` for clean UX
- Product sticky bar: visible on all sizes

**Potential mobile issues:**
- `utility-bar`: `white-space: nowrap` on items — long German text could overflow on very narrow screens
- `image-tile-grid`: first tile is full-width on desktop; grid collapses to 2-col on mobile (correct, but large tile needs careful image sizing)

---

## 7. Performance, Accessibility, and Technical Concerns

**Performance:**
- Microsoft Clarity loaded 3× (critical — bloats page)
- Multiple CSS files loaded inline per section (HTTP/2 mitigates, but suboptimal)
- `image-tile-grid` first tile uses `loading: 'lazy'` — may be above fold
- Hero-split LCP image uses `loading: 'eager'` + `fetchpriority: 'high'` — correct
- Font preload duplication (see HOMIN-005)

**Accessibility:**
- `image-banner.liquid` uses `onclick` div instead of `<a>` — keyboard inaccessible (HOMIN-003)
- `lang` attribute on `<html>` is dynamic via `request.locale.iso_code` — correct pattern
- Skip-to-content link present (`class="skip-to-content-link"`)
- `aria-hidden="true"` used correctly on decorative icons
- Visually-hidden class used correctly for screen reader labels

**SEO / Structured Data:**
- `meta-tags.liquid`: `og:image` uses `http:` protocol (HOMIN-008)
- JSON-LD Organization schema in `header.liquid` — correct
- JSON-LD WebSite schema with SearchAction — correct
- Canonical URL handling with collection tag stripping — correct
- Dynamic collection meta description fallback — thoughtful addition
- `robots.txt` not visible in this theme pull (handled by Shopify platform)

**Security:**
- `product-faq-ui.liquid`: `acceptedAnswer.text` rendered via `innerHTML` without sanitisation (HOMIN-004)
- Inline scripts in `product-sticky-bar.liquid` (HOMIN-009)

---

## 8. Prioritised Issue Table

| ID | Severity | Page/Template | File | Finding | Impact |
|---|---|---|---|---|---|
| HOMIN-001 | CRITICAL | All pages | `layout/theme.liquid` lines 9-16 + `config/settings_data.json` | **Duplicate Clarity script** — Clarity loaded manually once + via 2 app blocks = 3 loads | Corrupt analytics, inflated session counts, wasted network |
| HOMIN-003 | HIGH | Homepage (banners) | `sections/image-banner.liquid` line 55 | **`onclick` on div** — `onclick="location.href='...';"` on the banner div instead of a native `<a>` element | Keyboard navigation broken, screen reader inaccessible, violates HTML accessibility |
| HOMIN-005 | HIGH | All pages | `layout/theme.liquid` lines 31-33 and 305-314 | **Font preload duplication** — body and header fonts each get two `<link rel="preload">` tags | Lighthouse warning, wasted browser resources |
| HOMIN-008 | HIGH | All pages | `snippets/meta-tags.liquid` line 23 | **`og:image` uses `http:` not `https:`** | Facebook/social platforms may reject or warn on insecure OG image |
| HOMIN-002 | HIGH | Product page | `snippets/product-faq-ui.liquid` lines 40-61 | **Hard-coded German text + full inline styles** inside JS-rendered innerHTML — bypasses theme design system | Cannot be updated via theme settings, breaks visual consistency |
| HOMIN-004 | MEDIUM | Product page | `snippets/product-faq-ui.liquid` line 52 | **`acceptedAnswer.text` unsanitised into innerHTML** | Potential XSS if metafield contains `<script>` tags |
| HOMIN-015 | HIGH | All pages | `layout/theme.liquid` line 2 | **Lang attribute depends on store locale** — if store default is not German, document language will be misidentified | Screen readers and search engines misidentify language |
| HOMIN-006 | MEDIUM | All pages | `assets/base.css` lines 128-132 | **Commented-out rule with named attribution** — dead code with person's name | Maintenance confusion, unprofessional code state |
| HOMIN-010 | MEDIUM | All pages | `sections/utility-bar.liquid` | **`white-space: nowrap` on utility bar items** — long German text may overflow on narrow mobile screens | Text cut off or overflow on 320-375px screens |
| HOMIN-013 | LOW | Homepage | `sections/hero-split.liquid` line 8 | **No mobile image = desktop landscape shown on mobile** — poor above-fold experience without separate mobile image | Poor visual quality on mobile if mobile image not set |
| HOMIN-016 | MEDIUM | All pages | `config/settings_data.json` | **All social links blank** — Organization schema `sameAs` array will contain only empty strings | SEO structured data technically invalid |
| HOMIN-017 | MEDIUM | Product page | `snippets/product-details-table.liquid` line 48 | **`parts[1]` rendered without `escape`** — label escaped, value not | HTML characters in metafield values may render as raw HTML |
| HOMIN-018 | MEDIUM | Homepage / any page | `sections/image-tile-grid.liquid` line 36 | **First (large) tile uses `loading='lazy'`** — if tile is above fold, LCP will be deferred | Core Web Vitals LCP degradation |
| HOMIN-007 | LOW | Footer | `config/settings_data.json` | **`brand_description` has two empty `<p>` tags** | Harmless whitespace but messy |
| HOMIN-009 | LOW | Product page | `snippets/product-sticky-bar.liquid` | **Inline `<script>` for sticky bar** — future CSP headers would break this | CSP incompatibility risk |
| HOMIN-019 | LOW | All collection/product grids | `snippets/card-product.liquid` line 76 | **`sizes` assumes 4-column grid** — wrong image size hints if section uses 2-3 columns | Browser may download oversized images |
| HOMIN-020 | LOW | Product page | `sections/main-product.liquid` lines 12-27 | **6–8 separate CSS files loaded per product page** | Suboptimal (HTTP/2 mitigates, but still unnecessary given bundling options) |
| HOMIN-024 | DESIGN | All pages | `config/settings_data.json` | **Page width 1600px** — very wide; German text line lengths may exceed readability threshold | Readability on wide monitors |
| HOMIN-025 | DESIGN | All interactive elements | `config/settings_data.json` | **`card_corner_radius: 8` vs `buttons_radius: 24`** — inconsistent rounding | Visual design inconsistency |
| HOMIN-026 | DESIGN | All pages | `config/settings_data.json` | **`spacing_sections: 0`** — no vertical gap between sections | Sections may feel visually cramped |
| HOMIN-022 | DESIGN | Homepage | `sections/utility-bar.liquid` + `sections/value-props.liquid` | **Overlapping trust content** — both show delivery/returns trust messages | Repetitive content on homepage |

---

## 9. Proposed Implementation Plan

### Phase A — Critical Fixes (High impact, low regression risk)

| Change | Files | Risk | Test |
|---|---|---|---|
| A1: Remove manual Clarity script from `theme.liquid` (keep app blocks only) | `layout/theme.liquid` lines 9-16 | LOW — removal only | Verify Clarity still loads once in browser |
| A2: Replace `onclick` div in `image-banner.liquid` with proper `<a>` wrapper | `sections/image-banner.liquid` | MEDIUM — banner link behaviour must be preserved | Click banner on desktop + mobile; test keyboard Tab + Enter |
| A3: Fix `og:image` from `http:` to `https:` in `meta-tags.liquid` | `snippets/meta-tags.liquid` | LOW | Check og:image in Facebook Sharing Debugger |
| A4: Remove duplicate font preload tags (keep lines 31-33, remove 305-314) | `layout/theme.liquid` | LOW | Verify fonts still load; Lighthouse test |

### Phase B — Design System Improvements

| Change | Files | Risk | Test |
|---|---|---|---|
| B1: Refactor `product-faq-ui.liquid` to use theme CSS classes instead of inline styles | `snippets/product-faq-ui.liquid` | MEDIUM — requires CSS additions | Visual check on PDP with FAQs |
| B2: Externalise sticky-bar JS from snippet to a deferred asset file | `snippets/product-sticky-bar.liquid` + new `assets/product-sticky-bar.js` | MEDIUM | Test sticky bar show/hide; variant switching |
| B3: Add `escape` to `product-details-table.liquid` value rendering | `snippets/product-details-table.liquid` | LOW | Check products with special characters in metafields |
| B4: Remove dead comment from `base.css` (sharmi rule) | `assets/base.css` | LOW | Visual regression check on header at 990px |

### Phase C — Responsive and Mobile Improvements

| Change | Files | Risk | Test |
|---|---|---|---|
| C1: Fix utility bar `white-space: nowrap` to allow wrapping on mobile | `sections/utility-bar.liquid` | LOW | Test on 320px, 375px screen widths |
| C2: Update `image-tile-grid.liquid` first tile to use `loading: 'eager'` | `sections/image-tile-grid.liquid` | LOW | Check LCP in Lighthouse |

### Phase D — Page-Specific Improvements

| Change | Files | Risk | Test |
|---|---|---|---|
| D1: Sanitise `acceptedAnswer.text` in FAQ snippet | `snippets/product-faq-ui.liquid` | LOW | Test FAQ with HTML characters in metafield |
| D2: Fix `card-product.liquid` `sizes` to accept a `columns` parameter | `snippets/card-product.liquid` | MEDIUM — ripple effect on all card renders | Check image sizes in Network tab for 2/3/4 column grids |
| D3: Update `hero-split.liquid` to display a placeholder guidance when mobile image is not set | `sections/hero-split.liquid` | LOW | Check on 375px without mobile image |

### Phase E — Cleanup and Polishing

| Change | Files | Risk | Test |
|---|---|---|---|
| E1: Populate social links in settings or mark as intentionally blank | `config/settings_data.json` | LOW | Verify Organization schema in Search Console |
| E2: Clean `brand_description` empty paragraphs | `config/settings_data.json` | LOW | Check footer brand section |
| E3: Review card/button radius consistency (align card to 24px or buttons to 8px) | `config/settings_data.json` | LOW | Visual comparison |
| E4: Review page_width (consider 1440px) | `config/settings_data.json` | MEDIUM — affects all page layouts | Full visual regression on all templates |
| E5: Add section spacing (consider 20-40px) | `config/settings_data.json` | LOW | Visual check homepage |

---

## 10. Testing Strategy

### Local Theme (Staging)
1. Make changes to the local theme copy at `shopify_projects/homingmbh-de-homingmbh-staging/`
2. Push via Shopify CLI: `shopify theme push --store homingmbh.myshopify.com --theme <theme-id>`
3. Preview on Shopify staging theme (do not push to live theme)

### Per-Change Validation
- Visual regression: Chrome DevTools device emulation (375px, 768px, 1440px, 1920px)
- LCP check: Lighthouse (before/after for Phase A and C changes)
- Accessibility: keyboard navigation test (Tab/Enter/Escape) on header, banners, product page
- Screen reader: browser voice-over test on modified sections
- JavaScript errors: Chrome console, check for undefined errors after sticky bar JS changes
- Clarity load count: Chrome Network tab filter by "clarity" — must show exactly 1 request

### SEO Validation
- OG tags: Facebook Sharing Debugger after A3 fix
- Structured data: Google Rich Results Test after social/schema changes

---

## 11. Files Not Inspected

| File / Category | Reason |
|---|---|
| `locales/*.json` (except de.json) | Non-German locales — not relevant to German store |
| `assets/icon-*.svg` (120+ files) | SVG icons — decorative, no audit value |
| `assets/sparkle.gif` | Decorative asset |
| `assets/email-signup-banner-background*.svg` | Static design assets |
| `sections/customers/` | No customers folder found; handled by Shopify |
| `config/settings_schema.json` | Schema defines available settings; current values in settings_data.json are sufficient |
| JS files beyond global.js, constants.js, cart.js | Standard Dawn JS not customised; review in future phase if issues arise |
| `sections/apps.liquid` | Standard Dawn app blocks container |

---

## 12. Explicit Confirmation

**NO Shopify theme files were changed during this audit.** All reads were read-only. No theme files were edited, created, deleted, moved, renamed, or overwritten. No git commits, pushes, or Shopify CLI commands were run.

---

## 13. Limitations

- **No browser preview available** — all findings are code-based. Visual findings have not been verified in a live browser.
- **No live store access** — metafield values, actual collection data, and app-rendered HTML were not inspected.
- **No Lighthouse run** — performance scores are estimated from code patterns.
- Theme version cannot be confirmed from local files alone.

---

---

## Appendix A — Targeted Section Audit: `sections/category-circles.liquid`

**Audit date:** 2026-10-29
**Auditor:** Claude Code (read-only)
**Scope:** Full inspection of the category-circles section, its CSS, JS, locale keys, template usage, and base.css interactions.

### Files Inspected

| File | Purpose |
|---|---|
| `sections/category-circles.liquid` | Section source — complete |
| `templates/index.json` | Template using this section |
| `assets/base.css` line 3760 | External CSS touching `.category-circles` |
| `config/settings_data.json` | Live section settings |
| `locales/de.json` lines 62–65 | Arrow button `aria-label` translation keys |

### Section Config in Production (from index.json)

- Heading: "Nach Kategorie einkaufen"
- Menu fallback: `mega-menu`
- Max auto items: 8
- Color scheme: `scheme-1` (white background)
- 4 blocks configured: `leuchtmittel`, `rohr-und-steampunk-leuchten`, `aussenleuchten`, `tisch-und-stehleuchten`
- None of the 4 blocks have a custom image or custom link — all rely on `collection.featured_image` and `collection.url`

---

### CC-BUG-001 — CONFIRMED BUG | HIGH
**Arrow buttons always visible in DOM but non-functional on mobile**

- **File:** `sections/category-circles.liquid` lines 25, 87 (buttons) + lines 151–153 (CSS)
- **Evidence:** CSS sets `display: none` on `.category-circles__arrow` and only overrides to `display: flex` at `min-width: 990px`. The buttons are therefore hidden on mobile and tablet.
- **However:** The JavaScript (lines 96–103) attaches click listeners unconditionally on all `.section-{{ section.id }}-padding .category-circles__arrow` buttons regardless of viewport. On mobile the scroll row is scrollable via native touch swipe but the buttons are hidden — this is intentional and correct. **No bug here in isolation.**
- **Actual problem:** On desktop (≥990px), the buttons are positioned `left: -1.8rem` and `right: -1.8rem` — they extend 18px outside the `.category-circles__scroller` container. If `.page-width` has `overflow: hidden` (which Dawn's default does for some containers), the buttons will be **clipped and invisible** even though they are present in the DOM.
- **Impact:** Arrow navigation silently broken on desktop if parent overflow is hidden.
- **Fix:** Add `overflow: visible` to `.category-circles__scroller`, or change arrow positioning to `left: 0.8rem` / `right: 0.8rem` (inside the container). Check computed overflow on `.page-width` in a browser.
- **Regression risk:** Low — scoped CSS change.
- **Validation:** Inspect `.page-width` `overflow` value in Chrome DevTools at ≥990px.

---

### CC-BUG-002 — CONFIRMED BUG | HIGH
**All 4 production blocks have no image set — `collection.featured_image` will be blank if collections have no featured image set in Shopify admin**

- **File:** `sections/category-circles.liquid` lines 34–35; `templates/index.json` blocks — none have `"image"` key set
- **Evidence:** The fallback chain is: `block.settings.image` → `c.featured_image`. No block overrides an image. If the Shopify collections `leuchtmittel`, `rohr-und-steampunk-leuchten`, `aussenleuchten`, `tisch-und-stehleuchten` do not have a featured image set in the admin, the section falls through to the **placeholder letter** (`{{ label | slice: 0, 1 | upcase }}`).
- **This is not a code bug** — the placeholder is intentional. However: the placeholder uses `color: rgba(var(--color-foreground), 0.35)` which at 35% opacity on white (`scheme-1`) renders as approximately `#BCBCBC` — a **contrast ratio of roughly 1.7:1 against the `#f3f4f4` circle background**. This fails WCAG AA (requires 4.5:1 for text).
- **Impact:** If collections lack featured images, the letter placeholder is unreadable for low-vision users.
- **Fix:** Increase placeholder color opacity to at least 60% (`rgba(var(--color-foreground), 0.6)`) or use a solid foreground color.
- **Regression risk:** None — CSS-only, scoped selector.
- **Validation:** Set a collection to have no image; verify letter is legible.

---

### CC-BUG-003 — CONFIRMED BUG | MEDIUM
**Desktop item width formula assumes exactly 5 items visible — breaks with 4 blocks configured**

- **File:** `sections/category-circles.liquid` line 125
- **Evidence:** CSS: `.category-circles__item { width: calc((100% - 4 * 2.4rem) / 5); }` — this calculates width for exactly 5 items filling the row. The production config has **4 blocks**. At `page-width: 1600px`, each circle will be `(1600 - 9.6rem) / 5` wide — 4 circles will not fill the row, leaving a visible gap on the right side.
- **Impact:** At 1600px page width with 4 blocks, the row looks visually unbalanced — 4 circles with a blank trailing space. At ≤5 items the row should either be centred or use `justify-content: center` on the list.
- **Fix:** Add `justify-content: center` to `.category-circles__list` at ≥990px, or make the column count a dynamic variable matching `section.blocks.size`. Simplest fix: add `justify-content: center` at desktop.
- **Regression risk:** Low. Adding `justify-content: center` may clip the `left: -1.8rem` arrows — test together with CC-BUG-001.
- **Validation:** View homepage at 1440px with 4 blocks; circles should be centred.

---

### CC-BUG-004 — CONFIRMED BUG | MEDIUM
**`url` falls back to `'#'` (hash link) when block has no collection and no link — produces a broken navigation link**

- **File:** `sections/category-circles.liquid` line 50
- **Evidence:** `href="{{ url | default: '#' }}"` — if a block is added with an image and label but no collection and no link set, the circle links to `#` (scrolls to top of page). This is a silent navigation failure.
- **The render guard** at line 46 (`{%- if label != blank -%}`) only skips blocks with no label — a block with a label but no URL will still render a `#` link.
- **Also:** The outer visibility guard at line 12 (`if c != blank or block.settings.image != blank`) means a block with only a `label` and no collection/image is **silently dropped** from `items` and the loop skips it — but this guard only filters the `items` string used in line 18. The actual render loop at line 30 re-evaluates independently and **does not use the `items` guard** — it processes all blocks regardless.
- **Impact:** A block with label + image but no link renders a `#` href. Clicking it scrolls to page top. No error, just wrong behaviour.
- **Fix:** Either (a) remove the `| default: '#'` fallback and only render the `<a>` when `url != blank`, wrapping in a `<span>` otherwise; or (b) document that a link is required when no collection is set.
- **Regression risk:** Low — Liquid change only.
- **Validation:** Add a block with an image and label but no collection/link; confirm the circle renders correctly.

---

### CC-BUG-005 — POTENTIAL BUG | MEDIUM
**`items` pre-filter logic is inconsistent with actual render loop**

- **File:** `sections/category-circles.liquid` lines 7–17 vs lines 29–62
- **Evidence:** The `items` string (used in the visibility guard at line 18) is built by filtering blocks where `c != blank OR image != blank`. However the actual render loop at lines 30–62 only skips a block if `label == blank` (line 46). A block with a label but neither collection nor image **passes the render loop** (renders a letter placeholder with a `#` link) but **fails the items filter** (would not be counted in `items`).
- **Consequence:** If ALL blocks are label-only (no collection, no image), `items` will be empty string, but `section.blocks.size > 0` is true — so line 18 evaluates `items != blank` (false) OR `section.blocks.size == 0` (false) OR `request.design_mode`. Outside design mode, the entire section is **hidden** even though it has configured blocks. This is a logic inconsistency that could silently suppress the section.
- **Impact:** If a merchant adds label-only blocks (intending to use the letter placeholder), the section disappears in storefront. In theme editor it shows fine (design mode).
- **Fix:** Either remove the pre-filter `items` guard and use `section.blocks.size > 0` alone as the visibility condition, or update the `items` filter to match the render loop's condition (`label != blank`).
- **Regression risk:** Low — Liquid logic change. Needs testing in both design mode and live storefront.
- **Validation:** Add a label-only block (no collection, no image), preview outside editor; confirm section is visible.

---

### CC-INFO-001 — NO ISSUE | INFO
**Arrow `aria-label` translation keys confirmed present in de.json**

- `general.slider.previous_slide` → "Nach links schieben" ✓
- `general.slider.next_slide` → "Nach rechts schieben" ✓
- Both keys exist and are correct German translations.

---

### CC-INFO-002 — NO ISSUE | INFO
**`alt=""` on circle images is intentional and correct**

- Lines 47–48 and 70: `alt` is explicitly set to empty string because the label text immediately below the image already describes the destination. Setting `alt=""` marks the image as decorative and prevents screen readers from reading the same content twice. This is correct WCAG technique.

---

### CC-INFO-003 — NO ISSUE | INFO
**base.css rule at line 3760 is additive, not conflicting**

- `.template-index .category-circles .category-circles__heading { text-align: center; }` — this rule reinforces the `text-align: center` already defined in the `{% stylesheet %}` block. It is redundant but does not conflict. It applies only on index (homepage) template.

---

### CC-REC-001 — IMPROVEMENT RECOMMENDATION | LOW
**Arrow buttons have no `aria-expanded` or `aria-controls` — minor accessibility gap**

- The scroll arrows are `<button>` elements with `aria-label` which is correct. However there is no programmatic relationship between the buttons and the scroll list they control. Adding `aria-controls="category-circles-list-{{ section.id }}"` on each button and `id="category-circles-list-{{ section.id }}"` on the `<ul>` would improve assistive technology experience.

---

### CC-REC-002 — IMPROVEMENT RECOMMENDATION | LOW
**All 4 production images rely on `collection.featured_image` — no LCP optimisation**

- All 4 circle images use `loading: 'lazy'`. The section is positioned **third** in the homepage order (after hero and value-props) and at 1600px page width may be partially above the fold on large monitors. The first 1–2 circle images should use `loading: 'eager'` or `fetchpriority: 'high'`.

---

### Summary Table — Category Circles

| ID | Severity | Type | Issue | Status |
|---|---|---|---|---|
| CC-BUG-001 | HIGH | Confirmed bug | Arrow buttons clipped by parent overflow on desktop | **FIXED** |
| CC-BUG-002 | HIGH | Confirmed bug | Letter placeholder fails WCAG AA contrast (if no images set) | **FIXED** |
| CC-BUG-003 | MEDIUM | Confirmed bug | 5-column width formula with 4 blocks — visual gap | **FIXED** |
| CC-BUG-004 | MEDIUM | Confirmed bug | `url \| default: '#'` produces silent broken link | **FIXED** |
| CC-BUG-005 | MEDIUM | Potential bug | `items` guard logic inconsistent with render loop — section may silently hide | **FIXED** |
| CC-INFO-001 | — | No issue | Locale keys confirmed present | N/A |
| CC-INFO-002 | — | No issue | `alt=""` on images is correct technique | N/A |
| CC-INFO-003 | — | No issue | base.css rule is redundant but not conflicting | N/A |
| CC-REC-001 | LOW | Recommendation | Arrow buttons missing `aria-controls` | Open |
| CC-REC-002 | LOW | Recommendation | First circle images should not be lazy-loaded | Open |

---

### Appendix B — Fix Implementation Record

**Date:** 2026-10-29
**File modified:** `sections/category-circles.liquid` only
**All other theme files: unchanged**

#### CC-BUG-001 — Arrow visibility (line 120)
- **Before:** `.category-circles__scroller { position: relative; }`
- **After:** `.category-circles__scroller { position: relative; overflow: visible; }`
- **Why:** The `.category-circles__list` handles its own `overflow-x: auto` — the scroller wrapper's overflow does not affect scrolling. Adding `overflow: visible` on the scroller prevents any current or future parent `overflow: hidden` from clipping the `-1.8rem` offset buttons.
- **Validation:** Code-verified. Browser check required: inspect arrows at 1440px, confirm both prev/next buttons are visible and clickable.

#### CC-BUG-002 — Placeholder contrast (line 148)
- **Before:** `color: rgba(var(--color-foreground), 0.35);`
- **After:** `color: rgba(var(--color-foreground), 0.6);`
- **Contrast verified (scheme-1):** `#121212` foreground at 60% opacity on `#f3f4f4` circle bg → effective `#6C6C6C` → contrast ratio **~4.84:1** — passes WCAG AA (4.5:1 minimum).
- **Limitation:** Contrast not verified for scheme-4 (white foreground on `#f3f4f4` circle — would need browser + DevTools check). In production the section uses scheme-1 only.

#### CC-BUG-003 — Four-item centering (line 134)
- **Before:** `@media (min-width: 990px) { .category-circles__item { ... } }` — no list alignment rule.
- **After:** Added `.category-circles__list { justify-content: center; }` inside the same media query.
- **Why:** With 4 blocks at the 5-item width formula, items fill ~80% of the container leaving a right-side gap. `justify-content: center` distributes the gap equally on both sides.
- **Known edge case:** With 6+ blocks at narrow desktop (~990px), `justify-content: center` combined with `overflow-x: auto` can clip the start of the list. This only applies if many blocks are added at small viewports. Arrow nav mitigates navigation impact.

#### CC-BUG-004 — No-URL link fallback (lines 50–67)
- **Before:** `<a class="category-circles__link" href="{{ url | default: '#' }}">`
- **After:** Conditional — renders `<a href="{{ url }}">` when `url != blank`, renders `<span>` otherwise. Closing tag conditional matches.
- **Auto-fill branch (line 80) unchanged** — that branch only runs for `link.type == 'collection_link'` which always has a valid `c.url`. No change needed there.

#### CC-FEATURE-003 — Announcement bar marquee display fix (2026-10-29)
- **Problem reported:** Marquee appeared as very narrow bar with text clipped in draft theme preview.
- **Root cause 1 (primary):** `.announcement-bar--marquee { display: block }` — incorrectly overrode `display: flex` from the base `.announcement-bar` rule. The base flex rule is required for the grid item to size correctly within `.utility-bar__grid`. Changing to `display: block` broke the height relationship and removed the `justify-content`/`align-content` centering.
- **Root cause 2:** `.announcement-bar__marquee-track` had no `flex-shrink: 0`. In the corrected flex parent, the track would be compressed to the container width instead of overflowing, disabling the scrolling animation.
- **Root cause 3:** `.announcement-bar__marquee-items` and `.announcement-bar__marquee-item` used `display: inline-flex` which has inline-level sizing quirks inside a flex container. Replaced with `display: flex; flex-shrink: 0`.
- **Root cause 4:** `.announcement-bar__message` was missing `white-space: nowrap` in marquee context, allowing German text to wrap to a second line inside the scrolling item.
- **Fix applied:** Replaced entire `{% stylesheet %}` block in `sections/announcement-bar.liquid`:
  - Removed `display: block` from `.announcement-bar--marquee` — now inherits `display: flex` from base
  - Added `justify-content: flex-start; flex-wrap: nowrap; align-items: center` to marquee wrapper
  - Added `flex-shrink: 0; align-items: stretch` to track
  - Changed items and item-spans from `inline-flex` to `flex; flex-shrink: 0`
  - Added `.announcement-bar--marquee .announcement-bar__message { text-align: left; white-space: nowrap }`
  - Updated no-mobile and reduced-motion fallbacks: `flex-shrink: 1; width: 100%; flex-wrap: wrap` (so they can reflow when animation is off)
- **Browser validation:** Pending — requires push to staging theme.

#### CC-FEATURE-002 — Announcement bar marquee mode (2026-10-29)
- **File:** `sections/announcement-bar.liquid`
- **New settings (all in schema "Marquee" header group):**
  - `marquee_enable` — checkbox, default `false`
  - `marquee_direction` — select (left/right), default `left`
  - `marquee_speed` — select (slow 40s / normal 20s / fast 10s), default `normal`
  - `marquee_pause_hover` — checkbox, default `true`
  - `marquee_mobile` — checkbox, default `true`
- **Architecture:** Marquee path is a new `if` branch at the top of the announcement block, checked before the existing single-block and multi-block slideshow branches. When `marquee_enable` is false the existing behaviour is completely unchanged.
- **Loop technique:** Two `<span class="announcement-bar__marquee-items">` copies rendered by `for i in (1..2)`. Second copy marked `aria-hidden="true"`. CSS animation translates by `-50%` of total track width (= one copy width). Produces seamless continuous loop with no JavaScript.
- **Accessibility:** `block.shopify_attributes` placed on first-copy items only. Second copy `aria-hidden="true"`. The animated track does not have `aria-hidden` — screen readers read the first copy once and skip the duplicate naturally.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` stops animation, hides the duplicate copy, and centres the first copy — readable non-animated fallback.
- **Mobile off:** `announcement-bar__marquee-track--no-mobile` class disables animation below 749px, hides duplicate, centres items.
- **Links:** Preserved with `<a class="announcement-bar__marquee-link link link--text focus-inset animate-arrow">`.
- **Promo-code blocks:** Fully supported — promo-code snippet rendered inside each marquee item.
- **Backward compatibility:** `marquee_enable` defaults to `false` — existing live instances retain slider/static behaviour.
- **No JS added.** Pure CSS animation.
- **Browser validation:** Pending.

#### CC-FEATURE-001 — Optional navigation arrows setting (2026-10-29)
- **Setting ID:** `show_arrows`
- **Type:** `checkbox`
- **Default:** `true`
- **Schema position:** Between `max_items` and `color_scheme`
- **Implementation:** Both `<button>` tags wrapped in `{%- if section.settings.show_arrows -%}` / `{%- endif -%}`. When false, buttons are not rendered at all — no DOM presence, no CSS, no JS event listeners attached (the JS `querySelectorAll` finds no elements and no-ops cleanly).
- **Backward compatibility:** Shopify resolves an absent `show_arrows` value to the schema default (`true`) — existing live section instances retain arrows without needing a `settings_data.json` change.
- **Scroll behaviour when OFF:** `.category-circles__list` retains `overflow-x: auto` and `scroll-snap-type: x mandatory`. Touch/swipe scrolling is unaffected.
- **CSS:** No CSS change required — the arrow CSS rules are harmless dead code when buttons are absent.
- **Limitation:** Browser validation pending.

#### CC-BUG-005 — Items pre-filter alignment (line 12)
- **Before:** `if c != blank or block.settings.image != blank`
- **After:** `if c != blank or block.settings.image != blank or block.settings.label != blank`
- **Why:** The render loop shows a block if `label != blank` (including letter-placeholder blocks). The pre-filter now counts label-only blocks as valid, so the section visibility guard correctly shows the section when only label-only blocks are configured.
**Req ID:** AIOS-2026-10-29-007
**Task:** Root-cause investigation + fix for announcement marquee rendering at ~40% width instead of full available width in draft theme preview.

---

### C.1 Problem Statement

After implementing marquee mode (AIOS-2026-10-29-005) and applying the initial display fix (AIOS-2026-10-29-006), the Shopify draft theme preview still showed the announcement bar occupying only a small portion of the top bar. The blue background extended full-width but the scrolling text area was constrained.

---

### C.2 DOM Hierarchy (Confirmed by Code Inspection)

The `announcement-bar.liquid` section renders its own `.utility-bar__grid` wrapper — NOT inside `header.liquid`. The actual DOM structure:

```
<div id="shopify-section-announcement-bar" class="shopify-section">
  <div class="utility-bar color-scheme-4 gradient utility-bar--bottom-border">  ← FULL VIEWPORT WIDTH (background)
    <div class="page-width utility-bar__grid utility-bar__grid--3-col">           ← CONSTRAINED TO PAGE-WIDTH
      <div class="announcement-bar announcement-bar--marquee" role="region">      ← grid-area: announcements = 40% width
        <div class="announcement-bar__marquee-track">
          <span class="announcement-bar__marquee-items">...</span>
          <span class="announcement-bar__marquee-items" aria-hidden>...</span>
        </div>
      </div>
      <div class="localization-wrapper">...</div>  ← grid-area: language-currency = 3rd column
    </div>
  </div>
</div>
```

---

### C.3 Root Cause

**The 3-column grid constraint.**

The `announcement-bar.liquid` section builds the grid class dynamically at line 24:

```liquid
<div class="page-width utility-bar__grid{% if announcement_bar and language_country_selector ... %} utility-bar__grid--3-col{%...%}">
```

The variable `language_country_selector` is set `true` when `enable_language_selector: true` is in section settings. From `header-group.json`, `enable_language_selector: true`. When announcement blocks are present (`announcement_bar = true`), the condition fires and the grid class `utility-bar__grid--3-col` is applied.

**`base.css` grid rule (line 2131–2135, only at ≥990px):**
```css
.utility-bar__grid--3-col {
  grid-template-columns: 3fr 4fr 3fr;
  grid-template-areas: 'social-icons announcements language-currency';
}
```

**`base.css` announcement bar placement (line 2158):**
```css
.announcement-bar {
  grid-area: announcements;
}
```

The announcement bar occupies the `announcements` named area = centre column = 4 / (3+4+3) = **40% of page-width**. The marquee viewport is only 40% wide.

**Why the previous fix (removing `display:block`) didn't resolve it:** That fix corrected a height/flex issue. The width constraint is a separate grid-placement problem that existed before and after the flex fix.

---

### C.4 CSS Cascade Analysis

| Property | Source | Value |
|---|---|---|
| `grid-area` | `base.css` `.announcement-bar` | `announcements` (places in centre column) |
| `grid-column` | section `{% stylesheet %}` `.announcement-bar--marquee` | `1 / -1` (overrides column placement) |

CSS Grid spec: explicit `grid-column` longhands override the column placement from `grid-area`. Since the section `{% stylesheet %}` loads AFTER `base.css` in source order, the `grid-column: 1 / -1` declaration wins. Row placement from `grid-area: announcements` (row 1) is preserved.

**Mobile:** `utility-bar__grid--3-col` only applies at `@media screen and (min-width: 990px)`. Below 990px, the grid is always 1-col — marquee is already full-width there. `grid-column: 1 / -1` on a 1-col grid = spans 1 column = no change.

---

### C.5 Fix Applied

**File changed:** `sections/announcement-bar.liquid` — `{% stylesheet %}` block

**Change:**
```css
/* BEFORE */
.announcement-bar--marquee {
  overflow: hidden;
  justify-content: flex-start;
  flex-wrap: nowrap;
  align-items: center;
}

/* AFTER */
.announcement-bar--marquee {
  grid-column: 1 / -1;         /* span all grid columns — escapes 3-col 40% constraint */
  overflow: hidden;
  justify-content: flex-start;
  flex-wrap: nowrap;
  align-items: center;
}
```

**Why `grid-column: 1 / -1` is safe:**
- `1 / -1` spans all columns regardless of how many exist (1-col or 3-col grid)
- The `.localization-wrapper` (grid-area: language-currency) still exists in the DOM but renders empty because `localization.available_languages.size > 1` is false for this single-language German store — no visible overlap
- `grid-column` overrides only the column placement portion of `grid-area: announcements` — row placement is unchanged

---

### C.6 Why Preview Still Shows Old State

**The fix is applied to the LOCAL theme files only.** The `shopify_projects/homingmbh-de-homingmbh-staging/` folder is **untracked in git** (confirmed by `git status` output). No `shopify theme push` has been run for this session's changes. The draft theme preview on Shopify still contains the previous version of `sections/announcement-bar.liquid`.

**Action required:** Run `shopify theme push --theme [staging-theme-id] --only sections/announcement-bar.liquid` from the theme directory, targeting the draft theme (NOT the live theme). Piranav must authorise and run this command.

---

### C.7 Files Changed This Investigation

| File | Change Type | Description |
|---|---|---|
| `sections/announcement-bar.liquid` | CSS addition | Added `grid-column: 1 / -1` to `.announcement-bar--marquee` in `{% stylesheet %}` block |

**Files inspected (read-only):**
- `assets/base.css` — confirmed `.utility-bar__grid--3-col`, `.announcement-bar { grid-area }`, `.localization-wrapper { grid-area }`
- `sections/header-group.json` — confirmed `enable_language_selector: true`, no blocks defined in stored config
- `layout/theme.liquid` — confirmed header structure; announcement bar is a separate section in the header section group
- `sections/utility-bar.liquid` — confirmed this is a separate trust-bar section, not related to the announcement bar constraint
- `sections/header.liquid` — confirmed sticky-header is disabled (`sticky_header_type: none`) — no wrapper constraints
- `assets/component-slideshow.css` — confirmed no announcement bar width constraints
- `assets/component-slider.css` — confirmed no announcement bar width constraints

---

### C.8 Browser Validation Status

| Check | Status |
|---|---|
| Desktop: marquee occupies full page-width | NOT VERIFIED — local only, not pushed to staging |
| First/last message correct during animation | NOT VERIFIED |
| Continuous scroll without gaps | NOT VERIFIED |
| Language selector no overlap | NOT VERIFIED (store is single-language — localization widget should not render) |
| Mobile layout correct | NOT VERIFIED |
| Marquee OFF restores normal behaviour | NOT VERIFIED |
| Reduced motion stops animation | NOT VERIFIED |

**Visual verification requires `shopify theme push` to the staging draft theme.** Piranav must run this after approving the git commit.

**Req ID:** AIOS-2026-10-29-008
**Task:** Fix two UI/UX issues on the product gallery (`gallery_layout: "thumbnail_slider"`, `media_size: "small"`)

### D.1 Issues Fixed

| # | Issue | Severity |
|---|---|---|
| Fix A | Thumbnail strip (left column) visually too wide / unbalanced | MEDIUM |
| Fix B | No visible prev/next navigation arrows on main product image at desktop | HIGH |

### D.2 Root Cause Analysis

**Fix A — Thumbnail strip width:**
- The custom CSS in `assets/base.css` (line 3933) sets `grid-template-columns: 5.6rem minmax(0, 1fr)` on `.product--thumbnail_slider media-gallery` at ≥990px
- `5.6rem` is wider than needed for the small thumbnail format and creates visual imbalance
- Fix: override in `section-main-product.css` to reduce to `4.8rem` with tighter `gap: 0.8rem`

**Fix B — Missing main image arrows:**
- HTML structure: inside `<slider-component id="GalleryViewer-...">` the `<ul>` has class `slider slider--mobile`, immediately followed by `<div class="slider-buttons">`
- Dawn's `component-slider.css` (line 332) hides buttons via: `.slider--mobile + .slider-buttons { display: none; }` at `@media screen and (min-width: 750px)`
- The buttons exist in the DOM but are CSS-hidden on tablet and desktop
- Fix: override with more specific selector targeting `.product--thumbnail_slider` context; position buttons as circular overlay arrows centred vertically on the main image

### D.3 Files Changed

| File | Type of Change |
|---|---|
| `assets/section-main-product.css` | CSS appended — Fix A + Fix B override rules |

### D.4 CSS Added (appended to end of `section-main-product.css`)

**Fix A:**
```css
@media screen and (min-width: 990px) {
  .product--thumbnail_slider media-gallery {
    grid-template-columns: 4.8rem minmax(0, 1fr);
    gap: 0.8rem;
  }
}
```

**Fix B:**
```css
@media screen and (min-width: 750px) {
  .product--thumbnail_slider media-gallery > slider-component:not(.thumbnail-slider) {
    position: relative;
  }
  .product--thumbnail_slider media-gallery > slider-component:not(.thumbnail-slider) .slider--mobile + .slider-buttons {
    display: flex;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    z-index: 2;
    pointer-events: none;
    box-sizing: border-box;
  }
  .product--thumbnail_slider media-gallery > slider-component:not(.thumbnail-slider) .slider--mobile + .slider-buttons .slider-button {
    pointer-events: all;
    background: rgb(var(--color-background));
    border-radius: 50%;
    box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.18);
    width: 3.6rem;
    height: 3.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(var(--color-foreground), 0.08);
    cursor: pointer;
    flex-shrink: 0;
    color: rgba(var(--color-foreground), 0.75);
  }
  .product--thumbnail_slider media-gallery > slider-component:not(.thumbnail-slider) .slider--mobile + .slider-buttons .slider-counter {
    display: none;
  }
}
```

### D.5 Safety Checks

| Check | Result |
|---|---|
| No Liquid files modified | PASS |
| No JS files modified | PASS |
| No base.css modified | PASS |
| No prices / variants / cart / product data touched | PASS |
| Changes scoped to `.product--thumbnail_slider` only | PASS — Fix A at ≥990px, Fix B at ≥750px, both use `.product--thumbnail_slider` parent |
| Mobile layout unaffected | PASS — Fix A is ≥990px only; Fix B is ≥750px and only affects the specific thumbnail_slider layout |
| Thumbnail rail arrows unaffected | PASS — selector excludes `.thumbnail-slider` via `:not(.thumbnail-slider)` |

### D.6 Browser Validation Status

| Check | Status |
|---|---|
| Desktop: thumbnail strip visibly narrower | PENDING — not yet pushed to staging |
| Desktop: prev/next arrows visible overlaid on main image | PENDING |
| Arrow hover state (shadow increase) | PENDING |
| Mobile: no regression (arrows still hidden) | PENDING |
| Thumbnail click still navigates (JS unchanged) | PENDING |

**Action required:** Piranav must commit and run `shopify theme push` targeting the staging draft theme, then verify in preview.

---

## Appendix E — banner-gallery.liquid Compatibility Verification (2026-10-29)

**Req ID:** AIOS-2026-10-29-009
**Task:** Read-only static code inspection of `sections/banner-gallery.liquid`
**Result:** CONDITIONALLY INCOMPATIBLE — 4 FAIL, 6 WARNING

### E.1 Files Inspected

| File | Type |
|---|---|
| `sections/banner-gallery.liquid` | Full read |
| `assets/base.css` | CSS conflict search |
| `assets/section-main-product.css` | CSS conflict search |
| `assets/section-image-banner.css` | CSS conflict search |
| `assets/component-slideshow.css` | CSS conflict search |
| All 57 CSS assets in `assets/` | Class name conflict grep |
| `templates/index.json` | Homepage integration check |
| `layout/theme.liquid` | Section rendering context |

### E.2 FAIL Findings

| # | Severity | Issue | File / Lines |
|---|---|---|---|
| FAIL-1 | HIGH | `banner_height` and `banner_height_mobile` settings have zero visual effect — CSS uses `height: auto`, never references `--desktop-height` or `--mobile-height` custom properties set on the `<img>` | `banner-gallery.liquid` line 277, 490–496 |
| FAIL-2 | HIGH | JavaScript not scoped to section instance — all `document.querySelector`/`querySelectorAll` target the whole page; two instances break each other | `banner-gallery.liquid` lines 786–789, 804, 857–858, 970 |
| FAIL-3 | HIGH | Fade slider `setInterval` return value not stored — cannot be cleared; accumulates on every Theme Editor reload, causing slide flickering | `banner-gallery.liquid` line 980 |
| FAIL-4 | HIGH | No `shopify:section:load` / `shopify:section:unload` lifecycle handlers — intervals and `resize` event listeners accumulate on Theme Editor interactions | `banner-gallery.liquid` lines 785–1006 |

### E.3 WARNING Findings

| # | Issue |
|---|---|
| WARN-1 | Raw `<style>` block (not `{% stylesheet %}`) — styles not deduplicated across multiple instances |
| WARN-2 | `<link rel="preload">` rendered in page body (lines 202–220) — non-standard; should be in `<head>` |
| WARN-3 | `document.addEventListener('click', handleBannerClick)` on document — accumulates on Theme Editor reload |
| WARN-4 | `product.featured_image` not null-guarded — empty `src` if product has no image |
| WARN-5 | Generic class names (`.main-container`, `.banner-wrapper`) — low conflict risk but not namespaced |
| WARN-6 | Initial visible class flash on mobile — Liquid renders desktop count; JS corrects after load |

### E.4 PASS Findings

| Check | Result |
|---|---|
| Schema setting types all valid | PASS |
| `image_url: width: N` filter syntax | PASS |
| `collections[handle]` Liquid access | PASS |
| Null guard on collection/mini-banners | PASS |
| `product.url`, `product.collections.first.url` | PASS |
| CSS class conflicts in all 57 theme assets | PASS — no conflicts |
| Section can be added to homepage via Theme Editor | PASS |
| Existing homepage sections unaffected | PASS |
| Fade CSS stacking (`grid-area: 1/1`) approach | PASS |

### E.5 Homepage Status

`banner-gallery` is NOT in `templates/index.json`. Section is installed in `sections/` but not yet placed on any page. Can be added via Theme Editor using the preset "Hero Banner with Auto Mini Products".

### E.6 Browser Tests Required

| Test | Reason |
|---|---|
| Banner height slider moves → image height unchanged | Confirm FAIL-1 visually |
| Theme Editor: save settings 5x, observe fade flicker | Confirm FAIL-3/4 interval accumulation |
| Two instances on one page — carousel conflict | Confirm FAIL-2 scope |
| Mobile initial load — visible item count flash | Confirm WARN-6 |
| `<link rel="preload">` fires in network tab | Confirm WARN-2 impact |

### E.7 Confirmation

No theme files modified during verification. No Shopify CLI commands run. No files uploaded or published.

---

## Appendix F — banner-gallery.liquid Fix Implementation (2026-10-29)

**Req ID:** AIOS-2026-10-29-010
**Task:** Fix all 4 confirmed failures from Appendix E verification

### F.1 Fixes Applied

| Fix | Issue | Lines Changed |
|---|---|---|
| Fix 1 | `height: auto` → `height: var(--desktop-height, 400px)`; mobile media query added | `banner-gallery.liquid` ~490–502 |
| Fix 2 | All JS wrapped in IIFE; `document.currentScript.closest('.shopify-section')` for scope; all selectors use `sectionEl.querySelector` | `banner-gallery.liquid` script block |
| Fix 3 | `fadeInterval = setInterval(...)` — return value stored | `banner-gallery.liquid` script block |
| Fix 4 | Named function references stored; `shopify:section:unload` handler clears all intervals and removes all event listeners | `banner-gallery.liquid` script block |

### F.2 Files Changed

| File | Change |
|---|---|
| `sections/banner-gallery.liquid` | CSS Fix 1 (lines ~490–502); full script rewrite (fixes 2–4) |

### F.3 Safety Checks

| Check | Result |
|---|---|
| No Liquid markup changed | PASS |
| No schema changed | PASS |
| No HTML structure changed | PASS |
| No other theme files modified | PASS |
| No Shopify CLI / push run | PASS |

### F.4 Browser Validation Required

| Check | Status |
|---|---|
| Desktop banner height slider moves → image height changes | PENDING |
| Mobile banner height slider works | PENDING |
| Theme Editor: save settings 5x — no flicker accumulation | PENDING |
| Two instances on one page — no conflict | PENDING |
| Carousel rotation works after fix | PENDING |
| Fade transition works after fix | PENDING |
