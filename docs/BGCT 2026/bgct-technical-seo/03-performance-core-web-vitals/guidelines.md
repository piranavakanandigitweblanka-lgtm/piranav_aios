# Guidelines — Performance (Core Web Vitals)

**Status:** DRAFT
**Sheet:** Performance (Core Web Vitals) (BGCT workbook, Sheet 3)
**Tasks covered:** CWV-1 through CWV-8
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx`
**Last updated:** 2026-10-09

---

## CWV-1 — LCP (Largest Contentful Paint)

| Rule | Detail |
|---|---|
| **Target** | LCP < 2.5 seconds = Good. 2.5–4s = Needs Improvement. >4s = Poor. |
| **Never lazy-load the LCP image** | Apply `loading="eager"` and `fetchpriority="high"` to the LCP element. |
| **No JS sliders as hero element** | JavaScript carousels as the first visible element always cause LCP failures. |
| **Escalation: Developer** | LCP improvements beyond image optimisation (server-side rendering, preloading, CDN config) require developer involvement. |
| **Safe boundary** | Always test on a duplicate theme before pushing hero section changes live. |

---

## CWV-2 — CLS (Cumulative Layout Shift)

| Rule | Detail |
|---|---|
| **Target** | CLS < 0.1 = Good. 0.1–0.25 = Needs Improvement. >0.25 = Poor. |
| **Always define width and height on img tags** | Required for every `<img>` tag without exception. |
| **Reserve space for app-injected content** | Use `min-height` CSS on containers for chat widgets, review carousels, promo bars. |
| **Escalation: Developer** | CLS caused by web fonts (FOUT/FOIT) or app-level rendering issues requires developer fix. |
| **Prohibited** | Injecting content at the top of the DOM after page load (promo banners that shift content down). |

---

## CWV-3 — INP (Interaction to Next Paint)

| Rule | Detail |
|---|---|
| **Target** | INP < 200ms = Good. 200–500ms = Needs Improvement. >500ms = Poor. |
| **Defer non-critical JS** | All non-essential scripts must be deferred until after page is interactive. |
| **No synchronous scripts in `<head>`** | Multiple inline `<script>` tags in `<head>` block rendering. |
| **Escalation: Developer** | INP issues caused by main-thread blocking JS from apps require developer and app vendor involvement. |

---

## CWV-4 — Image Compression

| Rule | Detail |
|---|---|
| **Upload limit (team guideline)** | Banner images: max 300KB. Product images: max 150KB. |
| **Format rule** | Photographs → JPEG. Flat graphics/logos → SVG or PNG. |
| **Compress before upload** | Never upload raw, uncompressed files directly to Shopify. |
| **Escalation: Team Lead** | If product photography workflow is uploading raw files, escalate to team lead for process change. |

---

## CWV-5 — Lazy Loading

| Rule | Detail |
|---|---|
| **LCP image: never lazy-load** | Hero/main product images must be `loading="eager"`. |
| **Below-fold images: always lazy-load** | Product grid row 2+, footer images, lower section images → `loading="lazy"`. |
| **Use native browser lazy loading** | HTML attribute `loading="lazy"` only. Do not use JavaScript lazy loading libraries. |
| **Escalation: Developer** | Identifying which images are "above the fold" on mobile vs desktop may require developer help with conditional Liquid rendering. |

---

## CWV-6 — Unused JS Removal

| Rule | Detail |
|---|---|
| **After every app uninstall** | Developer must inspect `theme.liquid` for leftover script tags. |
| **Prohibited deletions** | Never delete `global.js`, `theme.js`, `pubsub.js`, or any core Shopify theme file. |
| **Escalation: Developer** | JS removal in theme files requires developer review. Do not remove unfamiliar script tags without developer confirmation. |
| **Safe boundary** | Always duplicate the theme before making JS removals. |

---

## CWV-7 — Unused CSS Removal

| Rule | Detail |
|---|---|
| **OS 2.0 standard** | Load CSS per-section using `{{ 'component.css' | asset_url | stylesheet_tag }}` in the section Liquid file. |
| **Minify custom CSS** | All custom CSS additions must be minified before deployment. |
| **Prohibited** | Excessive `!important` usage. Loading full `theme.css` globally when section-level loading is feasible. |
| **Escalation: Developer** | Large-scale CSS refactoring requires developer involvement. |

---

## CWV-8 — Third-party Scripts

| Rule | Detail |
|---|---|
| **Audit all active scripts quarterly** | List every script, its purpose, and its estimated load cost. |
| **Revenue justification rule** | Every non-essential third-party script must justify its performance cost with measurable revenue or operational value. |
| **GTM trigger: Window Loaded** | All marketing and analytics scripts must fire on "Window Loaded", not "Page View". |
| **Escalation: Business Validator** | Removing a third-party script (e.g., Hotjar, Klaviyo) requires business validator confirmation that the tool is no longer needed. |
| **Safe boundary** | Do not remove scripts from the theme directly — route through GTM or Shopify Web Pixels where possible. |
