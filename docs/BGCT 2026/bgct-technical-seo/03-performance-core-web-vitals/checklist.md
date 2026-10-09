# Checklist — Performance (Core Web Vitals)

**Status:** DRAFT
**Sheet:** Performance (Core Web Vitals) (BGCT workbook, Sheet 3)
**Tasks covered:** CWV-1 through CWV-8
**Owner:** Piranav | **Reviewer:** Sajeesan | **Queryability Reviewer:** Tamil Selvan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx`
**Last updated:** 2026-10-09

---

## CWV-1 — LCP (Largest Contentful Paint)

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 1.1 | LCP score on homepage | PageSpeed Insights (https://pagespeed.web.dev) | Enter homepage URL → run test → note LCP value | LCP < 2.5s | LCP > 4s | Critical | Screenshot |
| 1.2 | LCP score on key product page | PageSpeed Insights | Enter top product page URL → run test | LCP < 2.5s | LCP > 4s | Critical | Screenshot |
| 1.3 | Identify LCP element | PageSpeed Insights → "Diagnostics" → "Largest Contentful Paint element" | Note the element type | Image or text element identified | Unknown / cannot identify | High | Screenshot |
| 1.4 | LCP image has `fetchpriority="high"` | View Page Source / Chrome DevTools Elements | Find the LCP image tag and check attributes | `fetchpriority="high"` and `loading="eager"` present | Missing or `loading="lazy"` on LCP image | Critical | Source screenshot |
| 1.5 | LCP image served in WebP | Chrome DevTools → Network → filter Images | Click on LCP image request → check Content-Type | `image/webp` | `image/jpeg` or `image/png` | Medium | DevTools screenshot |

---

## CWV-2 — CLS (Cumulative Layout Shift)

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 2.1 | CLS score on homepage | PageSpeed Insights | Run test → note CLS value | CLS < 0.1 | CLS > 0.25 | Critical | Screenshot |
| 2.2 | CLS score on product page | PageSpeed Insights | Run test on product page | CLS < 0.1 | CLS > 0.25 | Critical | Screenshot |
| 2.3 | All img tags have width and height attributes | Screaming Frog / Chrome DevTools | Inspect product and banner image tags | All have `width` and `height` | Any missing | High | Spot-check screenshot |
| 2.4 | Web fonts are preloaded | View Page Source → search `<link rel="preload"` with font | Check for font preload links in `<head>` | Font preload present | Fonts not preloaded | Medium | Source screenshot |
| 2.5 | No content injected at top of DOM after load | Chrome DevTools → Performance recording | Record page load; look for layout shifts caused by elements appearing | No significant shifts | Large shifts caused by app-injected content | High | DevTools screenshot |

---

## CWV-3 — INP (Interaction to Next Paint)

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 3.1 | INP score in CrUX field data | Google Search Console → Core Web Vitals report | Check INP values for mobile and desktop | INP < 200ms | INP > 500ms | Critical | GSC screenshot |
| 3.2 | INP lab score in PageSpeed Insights | PageSpeed Insights → Diagnostics | Note "Total Blocking Time" as an INP proxy | TBT < 200ms | TBT > 600ms | High | Screenshot |
| 3.3 | No synchronous `<script>` tags in `<head>` | View Page Source | Count inline script tags in `<head>` section | Zero non-essential synchronous scripts | Multiple blocking scripts | High | Source screenshot |
| 3.4 | Third-party scripts deferred | View Page Source | Check script tags for `defer` or `async` attributes | All non-critical scripts have `defer` or loaded via GTM | Scripts without `defer`/`async` | Medium | Source screenshot |

---

## CWV-4 — Image Compression

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 4.1 | Banner images under 300KB | Chrome DevTools → Network → Images | Filter by Images; check file sizes of banner/hero images | All banners < 300KB | Any banner > 500KB | High | DevTools screenshot |
| 4.2 | Product images under 150KB | Chrome DevTools / Screaming Frog | Check product image download sizes | All product images < 150KB | Any > 300KB | High | DevTools screenshot |
| 4.3 | No PNG used for photographic images | Screaming Frog → Images → filter .png | Check if large PNG files exist that should be JPEG | No large PNGs for photographs | Large PNG photographs found | Medium | Export |
| 4.4 | No raw/uncompressed uploads (check dimensions) | Shopify Admin → Products → Media | View image dimensions; confirm reasonable display-appropriate dimensions | Images ≤ 2000px on longest side | Images > 4000px | High | Spot-check screenshot |

---

## CWV-5 — Lazy Loading

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 5.1 | LCP hero image is NOT lazy-loaded | View Page Source | Find hero image tag; confirm no `loading="lazy"` | No lazy loading on hero | `loading="lazy"` on hero image | Critical | Source screenshot |
| 5.2 | Product grid row 2+ images are lazy-loaded | View Page Source | Find product card image tags in Liquid output; confirm `loading="lazy"` | `loading="lazy"` present | Missing on below-fold product images | Medium | Source screenshot |
| 5.3 | Footer images are lazy-loaded | View Page Source | Check footer section images | `loading="lazy"` present | Missing | Low | Source screenshot |
| 5.4 | No JS lazy loading library (use native) | View Page Source | Search for `lazysizes`, `lozad`, `lazyload` JS libraries | None found | JS library present | Low | Source screenshot |

---

## CWV-6 — Unused JS Removal

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 6.1 | No leftover app script tags in theme.liquid | Shopify Admin → Edit Code → theme.liquid | Search for `{% render` tags and `<script>` tags referencing apps no longer installed | Only active app scripts present | Orphaned app scripts found | High | Screenshot of code section |
| 6.2 | Chrome DevTools Coverage — unused JS | Chrome DevTools → Coverage tab | Load homepage; run coverage; note JS files shown in red | <30% unused JS | >60% unused JS on first-party files | High | DevTools screenshot |
| 6.3 | PageSpeed Insights "Reduce unused JavaScript" | PageSpeed Insights → Opportunities | Check if "Reduce unused JavaScript" appears with significant savings | Opportunity < 100KB savings | > 500KB savings flagged | High | Screenshot |

---

## CWV-7 — Unused CSS Removal

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 7.1 | PageSpeed Insights "Reduce unused CSS" | PageSpeed Insights → Opportunities | Check for "Reduce unused CSS" opportunity | Opportunity < 50KB savings | > 200KB savings flagged | High | Screenshot |
| 7.2 | Per-section CSS loading in theme | Shopify Admin → Edit Code → any section.liquid | Confirm CSS is loaded at section level, not only globally in theme.liquid | Section-level CSS loading found | All CSS loaded globally | Medium | Code screenshot |
| 7.3 | Chrome DevTools Coverage — unused CSS | Chrome DevTools → Coverage tab | Load homepage; run coverage; note CSS files in red | <40% unused CSS | >70% unused CSS on theme files | Medium | DevTools screenshot |

---

## CWV-8 — Third-party Scripts

| # | Check | Tool / Source | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 8.1 | List all active third-party scripts | GTmetrix or Chrome DevTools → Network → Third-party | Filter requests to external domains | Full list documented | Unknown scripts loading | High | GTmetrix report screenshot |
| 8.2 | All non-critical scripts fire after page interactive | GTM → check trigger for each tag | Confirm marketing/analytics tags use "Window Loaded" trigger | Window Loaded trigger | "Page View" trigger for heavy scripts | High | GTM screenshot |
| 8.3 | PageSpeed Insights "Reduce the impact of third-party code" | PageSpeed Insights → Opportunities | Check for third-party flagged as blocking | < 250ms third-party blocking time | > 500ms | High | Screenshot |
| 8.4 | Chat widget deferred until interaction | View Page Source / DevTools | Confirm chat widget JS is not loaded synchronously in `<head>` | Deferred or interaction-triggered | Synchronous in `<head>` | Medium | Source screenshot |
