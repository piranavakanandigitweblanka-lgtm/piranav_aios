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
