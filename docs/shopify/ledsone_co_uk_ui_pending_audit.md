# ledsone.co.uk — UI/UX Pending Improvements Audit

**Purpose:** Identify all remaining UI/UX improvements that could increase customer usability, trust, product discovery and conversion on the live Shopify store.
**Store:** https://ledsone.co.uk/
**Audit Date:** 2026-06-30
**Audit Type:** Discovery only — no theme files modified, no production changes made
**Business Question:** "What UI improvements are still pending on ledsone.co.uk that could increase usability, trust, product discovery and conversion?"
**Status:** PASS
**Reviewer — Coordinator:** Varmen
**Technical Reviewer:** Sajeesan
**Queryability Reviewer:** Tamil Selvan
**Business Validator:** Domain Owner

---

## Existing Assets Checked

| Asset | Path | Scope | Overlap with this audit? |
|-------|------|-------|--------------------------|
| AI-Agent Readiness & WebMCP Compatibility Audit | `evidence/audits/ledsone-co-uk-ai-agent-readiness-audit-2026-06-19.md` | Technical SEO + AI readiness | Partial — covers semantic HTML, filter architecture, skip links. Not UI/UX CRO. |
| LEDSone UK SEO Strategy Audit | `evidence/audits/ledsone-seo-strategy-audit-2026-06-15.md` | SEO content strategy | None — content/SEO only, no UI/UX findings |
| Electricalsone PDP UI/UX Closure | `evidence/shopify/electricalsone/pdp-uiux/2026-06-30_pdp_uiux_improvement_closure.md` | Different store (electricalsone.co.uk) | Pattern reference only — not a ledsone asset |
| Predictive Search Audit | `evidence/audits/current-work-predictive-search-audit.md` | Search UI | Partial overlap on search findings |
| Predictive Search Fix Report | `evidence/fixes/predictive-search-fix-report.md` | Search input fix | Technical fix already applied |

## Duplicate Risk Assessment

**Result: GREEN — No duplicate risk.**

No existing UI/UX CRO audit exists for ledsone.co.uk. The prior ledsone audits cover SEO strategy (2026-06-15) and AI-agent readiness (2026-06-19). This document covers UX, conversion, trust signals, product discovery and information hierarchy — a distinct scope. The predictive search fix already applied is noted below as a resolved item.

---

## Scope

Pages reviewed live on https://ledsone.co.uk/:
- Homepage
- Collection: Wall Lights & Sconces (`/collections/wall-lights`)
- Collection: Pendant Lights (`/collections/pendant-lights`)
- Collection: LED Bulbs (`/collections/led-bulbs`)
- Product Detail Page: Plug in Wall Lighting 2M Cable Dimmer (`/collections/wall-light/products/vintage-plug-in-wall-lights-2m-cable-dimmer-switch-wall-sconce-lamp`)
- Product Detail Page: Industrial Sconce Wall Lamp (`/collections/wall-light/products/wall-lighting-industrial-sconce-wall-lamp-light-holder-fixtures`)
- Search Results (`/search?q=pendant+light&type=product`)
- Cart page (`/cart`)
- About Us (`/pages/about-us`)
- Filtered collection (`/collections/pendant-lights?filter.p.m.custom.colour=Black&sort_by=best-selling`)

Areas NOT covered by this audit: SEO, GA4, tracking pixels, Core Web Vitals, Shopify Admin configuration, backend code, app configuration.

---

## Summary Table

| # | Area | Component | Issue | Priority | Customer Impact |
|---|------|-----------|-------|----------|-----------------|
| 1 | PDP | Sticky ATC | No sticky Add to Cart bar on scroll | 🔴 High | Customer loses buy button on long pages with 22+ images |
| 2 | PDP | Trust Badges | No visual CE/UKCA/RoHS/IP rating icons near ATC button | 🔴 High | Safety-conscious UK buyers cannot verify certification at point of purchase |
| 3 | PDP | Price Display | Possible price label inversion (regular/sale labels may be reversed on some PDPs) | 🔴 High | Customer sees higher price as "sale" price — undermines trust, potential lost sale |
| 4 | PDP | Scarcity Messaging | "Hurry Up! Only 107 left!" fires when stock is 100+ units — not credible scarcity | 🔴 High | Urgency message loses credibility, desensitises customers |
| 5 | Search | Filter Sidebar | No filters on search results — 1000 results with only 3 sort options | 🔴 High | Customer cannot narrow 1000 results; likely abandons search |
| 6 | Collection | Star Rating Display | Products with reviews show only count text ("36 reviews"), no star visualization on product cards in some collections | 🔴 High | Social proof impact halved — stars are the primary visual trust signal on cards |
| 7 | Collection | Price Data Integrity | One product card shows £0.00 GBP — pricing display bug | 🔴 High | Destroys price confidence; customer may think product is broken or scam |
| 8 | Homepage | Hero Value Proposition | Hero banner lacks a clear headline communicating LEDSone's USP | 🔴 High | First impression doesn't answer "why buy here?" — increases bounce |
| 9 | Homepage | Entry Popup | Discount modal fires immediately on page load before any browsing | 🔴 High | Disruptive; customers who haven't decided to buy are asked to commit immediately |
| 10 | PDP/Collection | Product Title Pollution | Internal model reference codes appended to product titles ("~5303", "~1614", "~1438") | 🔴 High | Customer-facing titles look broken/unfinished; reduces product name clarity and SEO |
| 11 | Trust | Vendor Name Inconsistency | Product cards show "LEDSone", "LEDSone UK Ltd", and "ledsone" (lowercase) interchangeably | 🔴 High | Brand inconsistency signals low quality; customers may think products are from different suppliers |
| 12 | Search | Sort Options | Search results have only 3 sort options (Relevance, Price low/high) vs 10 on collection pages | 🟠 Medium | Customers cannot sort by Best Selling or Newest on search — reduces discoverability |
| 13 | Collection | Pagination | "Load More" only — no pagination with page numbers or jump-to-page | 🟠 Medium | Customers browsing 233+ products cannot jump to later pages; must click Load More repeatedly |
| 14 | Collection | Low Stock Badges | No "low stock", "almost sold out", or "only X left" badges on collection product cards | 🟠 Medium | Missed urgency/scarcity signal at the browsing stage |
| 15 | Collection | Compare Feature | No product comparison feature | 🟠 Medium | Customers evaluating similar products must open multiple tabs |
| 16 | PDP | Multiple Discount Codes | Three discount codes shown simultaneously on PDP (B2P10, SAVESJ15, LEDCL10%) | 🟠 Medium | Decision paralysis; customers unsure which code to use; clutters the purchase page |
| 17 | PDP | Delivery Date | Delivery estimate shows duration ("1-3 days") but not an actual calendar date | 🟠 Medium | Specific dates (e.g., "Order now, receive by Thursday 3 Jul") increase purchase confidence |
| 18 | PDP | Social Proof Counter | "People are viewing this right now" displayed without an actual number | 🟠 Medium | Incomplete implementation — customers see no figure; loses urgency signal |
| 19 | PDP | Variant Consistency | Some products use color swatches, others use dropdowns for same type of selection | 🟠 Medium | Inconsistent UX; swatches are superior for visual products like lighting |
| 20 | PDP | Reviews Prominence | Customer reviews buried inside accordion tab — not visible without expanding | 🟠 Medium | Reviews are the #1 trust signal; hiding them in a tab reduces their conversion impact |
| 21 | PDP | Payment Options | No BNPL / payment plan option shown near price (e.g., Klarna, Clearpay) | 🟠 Medium | Expected by UK customers for items above ~£50; absence may block hesitant buyers |
| 22 | Homepage | Announcement Bar | Single static message ("Free Shipping for orders over £25") — no rotation | 🟠 Medium | Other key benefits (30-day returns, same-day dispatch, UK certified) not communicated at top |
| 23 | Homepage | Benefit Badge Copy | "Trustworthy services" benefit badge is generic — no specific claim | 🟠 Medium | Vague benefit is dismissed by customers; should state a specific, verifiable claim |
| 24 | Trust | About Page | No team photos, founding date, or certifications on About page — generic "10 years" claim | 🟠 Medium | High-consideration UK buyers research who they're buying from; abstract claims don't build trust |
| 25 | Cart | Free Shipping Progress | No free shipping progress bar in cart or cart drawer | 🟠 Medium | "You're £X away from free shipping" is a proven AOV lift mechanism — absent here |
| 26 | Cart | Cross-sell | No cross-sell or upsell in cart drawer or cart page | 🟠 Medium | Cart is the highest-intent moment; no product recommendations missed |
| 27 | Cart | Delivery Inconsistency | Cart page shows "Within 3-5 days" delivery; PDP shows "1-3 days" — contradictory messaging | 🟠 Medium | Trust gap; customer expects PDP promise but cart underdelivers on expectation |
| 28 | Collection | SEO Content Placement | Informational SEO copy placed after "Load More" button — effectively hidden | 🟠 Medium | Valuable editorial content (buying guides, FAQs) is unreachable for most customers |
| 29 | Navigation | Mega Menu Depth | Mega menu has 9 top-level categories with 13+ subcategories each — cognitive overload | 🟠 Medium | Customers presented with 100+ options simultaneously; navigation fatigue reduces exploration |
| 30 | Navigation | Search Suggestions | Hardcoded/generic search suggestions ("pendant, wall light, transformer...") — not personalised | 🟠 Medium | Trending or contextual suggestions would surface more relevant products |
| 31 | Search | Search Term Highlighting | Search term not highlighted in result card titles or descriptions | 🟡 Low | Minor findability aid missing; customers cannot confirm their term matched |
| 32 | Search | Related Searches | No "related searches" or "customers also searched for" on results page | 🟡 Low | Missed discovery opportunity for semantically related products |
| 33 | Search | Breadcrumb | No breadcrumb on search results page | 🟡 Low | Minor navigation gap |
| 34 | Collection | Column Width | 6-column grid option makes product images too small (~200px) on standard desktop | 🟡 Low | Ultra-narrow images make visual assessment of lighting products difficult |
| 35 | Collection | Filter Terminology | Filters use technical terms ("HOLDER TYPE: E 27, E27, Metal Holder") — inconsistent and jargon-heavy | 🟡 Low | Non-expert customers may not understand the filter labels |
| 36 | PDP | Product Video | No video demonstrating lighting products in use or installation | 🟡 Low | Lighting products benefit greatly from video — customers want to see ambience/warmth |
| 37 | PDP | Lifestyle Images | Product images are predominantly white-background only; no room scene/lifestyle images identified | 🟡 Low | Home décor buyers are heavily influenced by room context images |
| 38 | PDP | Ask a Question | No "Ask a Question" or chat widget visible on product page | 🟡 Low | Technical lighting products generate pre-purchase questions; no in-context support mechanism |
| 39 | Social | Instagram Missing | Only Facebook and Pinterest in social links — no Instagram | 🟡 Low | Instagram is the primary platform for home décor/lighting inspiration; significant gap |
| 40 | Trust | Footer Trust Logos | No UK consumer trust logos in footer (e.g., Trading Standards, Which? Trusted Trader) | 🟡 Low | UK shoppers look for familiar trust marks |
| 41 | Mobile | Sticky ATC | Mobile sticky bar existence unconfirmed (`mobile-stickybar.liquid` exists in theme but not confirmed active) | 🟡 Low | Mobile checkout convenience — needs verification |
| 42 | Accessibility | Skip Link | No skip-to-content link in theme layout (confirmed gap from AI readiness audit) | 🟡 Low | WCAG 2.4.1 violation; also reduces keyboard navigation usability |
| 43 | Homepage | Category Typo | "Hall-way" category label contains erroneous hyphen | 🟡 Low | Minor brand polish issue |
| 44 | Wishlist | Account Required | Wishlist requires login/account creation — friction reduces adoption | 🟡 Low | Guest wishlist would increase list saves and return visits |

---

## 🔴 High Priority Findings

### H1 — No Sticky Add to Cart Bar on PDP Scroll

**Page:** Product Detail Page
**Component:** Add to Cart button / sticky bar
**Current behaviour:** ATC button is visible only in the initial viewport. On products with 22+ images and long description accordions, the customer must scroll back to the top to add to cart.
**Recommended improvement:** Implement a sticky/fixed ATC bar that appears after the customer scrolls past the initial ATC button. Should show: product title (truncated), selected variant, price, and ATC button.
**Expected customer impact:** High — long-scroll PDPs without sticky ATC lose a measurable percentage of add-to-cart clicks.
**Priority:** 🔴 High
**Likely Shopify theme files:** `sections/main-product.liquid`, `sections/mobile-stickybar.liquid`, `assets/` (JS + CSS)
**Estimated complexity:** Medium — `mobile-stickybar.liquid` exists in theme, may need activation/configuration.

---

### H2 — No Visual Safety/Certification Badges Near ATC

**Page:** Product Detail Page
**Component:** Trust signal area below variant selectors / above ATC
**Current behaviour:** CE, UKCA, RoHS, IP ratings mentioned in text within the Description accordion tab only. No visual badge icons are displayed near the purchase decision area.
**Recommended improvement:** Add a trust badge strip (CE mark, UKCA, RoHS, IP54 where applicable) as icon badges rendered near the ATC button — not inside the accordion. Source data from product metafields (`custom.certifications` or similar).
**Expected customer impact:** High — UK electrical buyers expect visual safety signals at point of purchase. Absence increases hesitation.
**Priority:** 🔴 High
**Likely Shopify theme files:** `sections/main-product.liquid`, `snippets/product-highlights.liquid` (if ported from electricalsone pattern), new CSS in `assets/`
**Estimated complexity:** Low-Medium — badge HTML/CSS straightforward; data source (metafield or fixed) needs decision.

---

### H3 — Price Label Inversion on Some PDPs (Needs Verification)

**Page:** Product Detail Page
**Component:** Price block
**Current behaviour:** One product page shows "Regular Price: £22.59 (struck-through)" and "Sale Price: £28.24 (prominent)" — the struck-through price is lower than the displayed current price. This is a potential reversal of `compare_at_price` and `price` labels.
**Recommended improvement:** Audit price display logic in `sections/main-product.liquid` — verify `compare_at_price` (struck through) is always higher than `price` (displayed as current). Fix any Liquid conditional that may invert this.
**Expected customer impact:** Critical if real — customer presented with a higher "sale" price than the "regular" price would lose trust immediately.
**Priority:** 🔴 High (verify first — may be a data entry error on one product rather than a code bug)
**Likely Shopify theme files:** `sections/main-product.liquid` (price block), `snippets/price.liquid`
**Estimated complexity:** Low — one Liquid conditional to check and fix.

---

### H4 — Scarcity Messaging Fires at 100+ Units

**Page:** Product Detail Page
**Component:** Stock urgency badge
**Current behaviour:** "Hurry Up! Only 107 left in stock!" and "Only 140 left in stock!" displayed. Having 100+ units is not scarce — the urgency claim is implausible and damages credibility.
**Recommended improvement:** Set the urgency trigger threshold to ≤10 units (or ≤20 units maximum). Only show the badge when stock is genuinely low. Remove/hide badge when units exceed the threshold.
**Expected customer impact:** High — false scarcity that customers can see through actively reduces trust and future purchase intent.
**Priority:** 🔴 High
**Likely Shopify theme files:** `sections/main-product.liquid` (stock level conditional logic)
**Estimated complexity:** Low — change a Liquid threshold comparison.

---

### H5 — Search Results Have No Filter Sidebar

**Page:** Search Results (`/search?q=...`)
**Component:** Filter/facet panel
**Current behaviour:** Search returns 1000 results for "pendant light" with only 3 sort options (Relevance, Price low/high). No category, colour, price range, material, or style filters are available.
**Recommended improvement:** Apply the same Shopify native faceted filter system used on collection pages (`/search?q=...&filter.p.m.custom.colour=...`) to search results. Add a filter sidebar or drawer identical to the collection page filter.
**Expected customer impact:** High — without filters, 1000 results is unusable. Customer is likely to abandon or use a competitor site.
**Priority:** 🔴 High
**Likely Shopify theme files:** `sections/main-search.liquid`
**Estimated complexity:** Medium — Shopify native search supports filtering via `predictive_search` and `search` objects; filter UI needs adding to search template.

---

### H6 — No Star Visualization on Product Cards in Some Collections

**Page:** Collection pages (Pendant Lights confirmed)
**Component:** Product card — review rating display
**Current behaviour:** Products with reviews show only "36 reviews" text. No star icons rendered visually on some collection templates. Products with no reviews show "No reviews" text (no empty stars).
**Recommended improvement:** Render visual star icons (filled/empty) on all product cards. Show star rating + review count. For zero-review products, render empty stars or omit rating display entirely (do not show "No reviews" text — it reads as negative social proof).
**Expected customer impact:** High — star icons are the primary visual trust signal on product cards. Text alone has significantly less conversion impact.
**Priority:** 🔴 High
**Likely Shopify theme files:** `sections/main-collection-product.liquid`, `snippets/card-product.liquid` (or equivalent product card snippet)
**Estimated complexity:** Low — add star icon rendering from `product.metafields.reviews.rating.value`.

---

### H7 — £0.00 GBP Pricing Anomaly on Collection Card

**Page:** Collection pages (Pendant Lights)
**Component:** Product card — price display
**Current behaviour:** One product card in the pendant lights collection displays "£0.00 GBP" as the price.
**Recommended improvement:** Add a Liquid guard in the product card: if `product.price == 0`, either hide the price display and show "Price on request" or flag the product in Shopify Admin for price correction.
**Expected customer impact:** High — zero-price products make the store look broken or untrustworthy.
**Priority:** 🔴 High
**Likely Shopify theme files:** `sections/main-collection-product.liquid`, product card snippet
**Estimated complexity:** Low — one Liquid conditional.

---

### H8 — Hero Section Lacks Clear Value Proposition

**Page:** Homepage
**Component:** Hero banner
**Current behaviour:** Hero banner leads with imagery and "Shop our latest lighting collection" as the CTA. No headline answers "Why LEDSone? Why buy here vs Amazon or B&Q?"
**Recommended improvement:** Add a hero headline layer communicating the store's primary USP — e.g., "8,175 UK Reviews · 3-Year Warranty · Same Day Dispatch" or "The UK's #1 Independent LED Lighting Store". Pair with a primary CTA button ("Shop Wall Lights" or "Find My Light").
**Expected customer impact:** High — hero is the first thing new visitors see. A value proposition headline directly reduces bounce rate for traffic-driven visitors.
**Priority:** 🔴 High
**Likely Shopify theme files:** `sections/banner-image.liquid`, `sections/banner-with-text.liquid`, `assets/` (CSS typography)
**Estimated complexity:** Low — text + CSS overlay change.

---

### H9 — Discount Modal Fires Immediately on Page Load

**Page:** Homepage (and likely all pages)
**Component:** Discount popup modal (15% off / Buy 2 get 15% off)
**Current behaviour:** Modal appears immediately on first page load before the customer has had any chance to browse. This is the most disruptive type of popup.
**Recommended improvement:** Delay popup trigger to: (a) after 30 seconds on site, (b) on exit intent, or (c) after the customer has viewed 3+ pages. Do not show on first pageview.
**Expected customer impact:** High — early exit-intent studies consistently show immediate popups increase bounce rate by 5-15% for cold traffic.
**Priority:** 🔴 High
**Likely Shopify theme files:** `sections/newsletter-popup.liquid` or popup app configuration
**Estimated complexity:** Low — change trigger timing in JS or app settings.

---

### H10 — Product Title Model Codes Leaked to Customer Titles

**Page:** All product cards and PDP title (H1)
**Component:** Product title
**Current behaviour:** Product titles contain appended model reference codes: "~5303", "~1614", "~1438", "~1" visible in product names. These are internal codes that have been appended to customer-facing titles.
**Recommended improvement:** Remove model codes from product titles. If needed for internal reference, store in a product metafield (`custom.internal_sku` or `product.sku`). Product H1 and collection card titles should be clean customer-readable names.
**Expected customer impact:** High — polluted titles reduce click-through rates in Google Shopping, damage brand perception, and confuse customers.
**Priority:** 🔴 High
**Likely Shopify theme files:** Shopify Admin product data (data quality fix, not theme code) — however can be mitigated in theme by stripping trailing `~XXXX` patterns with Liquid `| split: '~' | first`.
**Estimated complexity:** Low theme workaround; Medium for full data cleanup.

---

### H11 — Vendor Name Brand Inconsistency

**Page:** Collection cards, PDP, search results
**Component:** Vendor/brand label
**Current behaviour:** Three different vendor strings appear across products: "LEDSone", "LEDSone UK Ltd", and "ledsone" (lowercase). Products from the same brand display different names.
**Recommended improvement:** Standardise all product vendor fields to a single canonical string — recommend "LEDSone" (no "UK Ltd" suffix for customer-facing display). Bulk update via Shopify Admin bulk editor or CSV import.
**Expected customer impact:** High — brand inconsistency signals low-quality data management; reduces trust especially for new visitors.
**Priority:** 🔴 High
**Likely Shopify theme files:** Shopify Admin bulk product update (data fix, not theme code). Theme can't fix this — must be corrected at data level.
**Estimated complexity:** Low — Shopify Admin bulk edit.

---

## 🟠 Medium Priority Findings

### M1 — Search: Sort Options Gap

Search results offer only 3 sort options (Relevance, Price low/high) vs 10 on collection pages. Missing: Best Selling, A-Z, Z-A, Date New/Old.
**Theme file:** `sections/main-search.liquid` | **Complexity:** Low

---

### M2 — Collection: Load More Only (No Pagination)

233+ products in Wall Lights, 873 in Pendant Lights — all behind repeated "Load More" clicks. No jump-to-page ability.
**Impact:** Returning customers who want to find a specific product they saw previously must click through from the beginning.
**Theme file:** `sections/main-collection-product.liquid` | **Complexity:** Low-Medium

---

### M3 — Collection: No Low Stock Indicators on Cards

Collection cards show no "low stock", "only 3 left", or "almost gone" badges even when inventory is low. This signal is only available after clicking through to PDP.
**Theme file:** Product card snippet — add `{% if product.selected_or_first_available_variant.inventory_quantity < 5 %}` badge | **Complexity:** Low

---

### M4 — Collection: No Product Compare

No ability to compare 2-3 products side by side. The theme has `sections/compare-products.liquid` and `sections/compare-products-sku-rotate.liquid` but no compare button is visible on collection cards or PDPs in live review.
**Theme file:** `sections/compare-products.liquid` (already exists — needs wiring to product cards) | **Complexity:** Medium

---

### M5 — PDP: Three Discount Codes Shown Simultaneously

B2P10 (15% off 2+ items), SAVESJ15 (15% off £500+), and LEDCL10% (bulk) all shown at once on PDP. Decision paralysis — customers unsure which code applies to them.
**Recommended fix:** Show one contextually relevant code based on page context or cart state. Consolidate into a single prominent "Best offer" message.
**Theme file:** `sections/main-product.liquid`, promo banner section | **Complexity:** Low

---

### M6 — PDP: Delivery Duration Not Converted to Calendar Date

"Estimate delivery times: 1-3 days (UK)" is accurate but abstract. Competitors show "Order now, receive by Thursday 3 July".
**Recommended fix:** Use Liquid date arithmetic to compute the estimated delivery date from today + 1-3 business days.
**Theme file:** `sections/main-product.liquid` | **Complexity:** Low (Liquid date math)

---

### M7 — PDP: Social Proof Viewer Counter Incomplete

"People are viewing this right now" shows no number. The string is incomplete — a number should precede the text.
**Recommended fix:** Ensure the viewer count variable is populated and rendered. If the app providing this is inactive, remove the incomplete string.
**Theme file:** `sections/main-product.liquid` or third-party app script | **Complexity:** Low

---

### M8 — PDP: Variant Selector Inconsistency

Some products use visual colour swatches for variant selection; others use text dropdowns for the same type of selection (colour/style). Inconsistent experience across PDPs.
**Recommended fix:** Standardise all colour/style variants to visual swatches. Use dropdowns only for variants that are not visually differentiated (e.g., wattage, cable length).
**Theme file:** `sections/main-product.liquid`, `snippets/product-variant-picker.liquid` | **Complexity:** Medium

---

### M9 — PDP: Reviews Hidden in Accordion Tab

Customer reviews are displayed inside the accordion panel alongside Description and Shipping & Returns. Reviews are the #1 conversion factor and should be visible without interaction.
**Recommended fix:** Move review summary (star rating + count + first 3 reviews) to a dedicated section below the product description, outside the accordion. Keep full reviews tab as an overflow.
**Theme file:** `sections/main-product.liquid`, `sections/main-search.liquid` | **Complexity:** Medium

---

### M10 — PDP: No BNPL / Instalment Option Displayed

No Klarna, Clearpay, or PayPal Pay in 3 messaging shown near the price block. PayPal is listed in footer payment icons but not surfaced on PDP.
**Recommended fix:** Add a BNPL messaging line below the price block (e.g., "Or 3 instalments of £X with Klarna") if Klarna is available in the store.
**Theme file:** `sections/main-product.liquid` | **Complexity:** Low (if app already installed) / Medium (if requires app install)

---

### M11 — Homepage: Static Single-Message Announcement Bar

Announcement bar shows only "Free Shipping for all orders over £25.00 GBP". No rotation to show other key benefits (30-day returns, same-day dispatch, 8,175 reviews, 3-year warranty).
**Recommended fix:** Use an announcement bar with message rotation. The `sections/announcement.liquid` file likely supports this — check configuration.
**Theme file:** `sections/announcement.liquid` | **Complexity:** Low

---

### M12 — Homepage: "Trustworthy services" Badge is Vague

One of four benefit badges reads "Trustworthy services" with no specifics. Vague claims are ignored by customers.
**Recommended fix:** Replace with a specific, verifiable claim: "8,175 ★ Trustpilot Reviews" or "3-Year Manufacturer Warranty" or "UKCA & CE Certified Products".
**Theme file:** `sections/icon-box.liquid` or homepage section | **Complexity:** Low

---

### M13 — About Page: No Team, No Certifications, No Founding Story

About page states "over 10 years of experience" without a founding year, team names, or photos. No certifications prominently displayed. No company history narrative.
**Recommended fix:** Add founding year, team photo section, and prominently display any trade certifications, accreditations, or notable milestones. Even a timeline section would significantly improve credibility.
**Theme file:** `sections/page-about.liquid`, `sections/page-timeline.liquid` (exists in theme) | **Complexity:** Low-Medium (content creation + layout)

---

### M14 — Cart: No Free Shipping Progress Bar

Cart page and cart drawer do not show a free shipping progress bar ("Add £X more for free shipping"). This is a high-ROI AOV feature that is absent despite the store offering free shipping over £25.
**Theme file:** `sections/main-cart-items.liquid`, `sections/form-mini-cart.liquid` | **Complexity:** Low-Medium

---

### M15 — Cart: No Cross-Sell / Upsell

Cart page and cart drawer show no product recommendations. The highest-intent moment in the customer journey has no discovery feature.
**Theme file:** `sections/main-cart-items.liquid`, `sections/cart-quick-edit.liquid` | **Complexity:** Medium

---

### M16 — Cart: Delivery Promise Contradiction

PDP says "1-3 days (UK)". Cart page says "Within 3-5 days". Customer is given a longer estimate after committing to purchase — damages trust and may cause hesitation at checkout.
**Recommended fix:** Align delivery messaging to a single consistent range across PDP, cart, and confirmation emails.
**Theme file:** `sections/main-cart-items.liquid`, `sections/main-product.liquid` | **Complexity:** Low

---

### M17 — Collection: SEO Content Hidden Below Load More

Informational content ("Transform Your Home with Stylish Wall Lights" on Wall Lights collection) is placed AFTER the "Load More" button. Customers never see it; it adds no content value from a customer discovery perspective.
**Recommended fix:** Move the collection SEO intro paragraph (100-150 words max) to ABOVE the product grid, below the collection title. Move full SEO article to below the grid as-is.
**Theme file:** `sections/main-collection-product.liquid`, `sections/main-collection-heading.liquid` | **Complexity:** Low

---

### M18 — Navigation: Mega Menu Depth Creates Cognitive Overload

9 top-level categories each with 13+ subcategories simultaneously visible in the mega menu. Total visible options exceed 100 choices.
**Recommended fix:** Limit mega menu second-level items to 6-8 per column. Group similar items. Use visual dividers between groups. Consider progressive disclosure (hover to show subcategory, click to go deeper).
**Theme file:** Shopify navigation configuration (Shopify Admin > Navigation) | **Complexity:** Low (navigation data edit)

---

### M19 — Navigation: Hardcoded Search Suggestions

The search bar shows hardcoded quick suggestions ("pendant, wall light, transformer, shade, power converters, LED bulbs, lights") that never change.
**Recommended fix:** Replace with trending search terms populated dynamically (from Analytics or manually updated via metaobject). Alternatively, use personalized suggestions from the customer's browse history.
**Theme file:** `snippets/top-search.liquid`, `snippets/search-canvas.liquid` | **Complexity:** Medium

---

## 🟡 Low Priority Findings

### L1 — Search: No Term Highlighting in Results

Search term not highlighted in result titles/descriptions.
**Theme file:** `sections/main-search.liquid` | **Complexity:** Low (CSS `<mark>` tag or JS highlight)

---

### L2 — Search: No Related Searches

No "customers also searched for" or related search suggestions on results page.
**Theme file:** `sections/main-search.liquid` | **Complexity:** Medium (requires search data or app)

---

### L3 — Search: No Breadcrumb

Search results page has no breadcrumb navigation.
**Theme file:** `sections/main-search.liquid`, `sections/breadcrumb.liquid` | **Complexity:** Low

---

### L4 — Collection: 6-Column Grid Too Narrow

6-column layout renders product images at ~200px wide on 1440px desktop — too small for visual assessment of lighting products.
**Recommended fix:** Cap maximum grid columns at 4 for lighting product categories.
**Theme file:** `sections/main-collection-product.liquid` | **Complexity:** Low

---

### L5 — Collection: Inconsistent Filter Labels

Filter labels use raw attribute values: "HOLDER TYPE: E 27, E27, Metal Holder" — "E 27" and "E27" are the same value with a space discrepancy causing duplication. Technical jargon without explanation.
**Recommended fix:** Normalise metafield values in Shopify Admin (deduplicate "E 27" / "E27"). Add tooltip or helper text for technical terms.
**Theme file:** Shopify Admin metafield data fix | **Complexity:** Low (data), Medium (tooltip UI)

---

### L6 — PDP: No Product Video

No product video for demonstrating lighting ambience, installation, or room integration.
**Recommended fix:** Add video embed support to product gallery (YouTube/Vimeo embed via product metafield). Even one lifestyle video per key product significantly improves conversion for visual products.
**Theme file:** `sections/main-product.liquid` (gallery section) | **Complexity:** Medium

---

### L7 — PDP: No Lifestyle / Room Scene Images

All product images observed are white-background studio shots. Lighting products depend heavily on room context images to show warmth, ambience, and scale.
**Recommended fix:** Add at least one room scene image per product (or use a "Shop the Look" section). Can be populated via product metafield for secondary image group.
**Theme file:** `sections/main-product.liquid`, `sections/lookbook.liquid` (exists in theme) | **Complexity:** Low (if images available in Admin)

---

### L8 — PDP: No Ask-a-Question Feature

No chat widget or "Ask a Question" button on PDP. Pre-purchase questions for technical lighting products (wattage, compatibility, IP rating) have no in-context mechanism.
**Recommended fix:** Add a "Have a question?" link that opens a pre-filled contact form or chat widget. Simple mailto link to sales@ledsone.co.uk as minimum viable option.
**Theme file:** `sections/main-product.liquid` | **Complexity:** Low

---

### L9 — Social: Instagram Not Linked

Social links show only Facebook and Pinterest. No Instagram account linked despite Instagram being the primary channel for home décor/lighting inspiration.
**Recommended fix:** Add Instagram link to footer social icons. Check if `sections/instagram-shop.liquid` and `sections/instagram.liquid` (both exist in theme) can be activated.
**Theme file:** `sections/footer-1.liquid`, `sections/instagram.liquid` | **Complexity:** Low

---

### L10 — Trust: No UK Consumer Trust Logos in Footer

No Trading Standards, BEIS-approved, or Which? Trusted Trader logos in footer. UK consumers familiar with these marks look for them when buying electrical products online.
**Theme file:** `sections/footer-1.liquid` or `sections/footer-2.liquid` | **Complexity:** Low (image + link assets)

---

### L11 — Mobile: Sticky ATC Bar Unconfirmed Active

Theme contains `sections/mobile-stickybar.liquid` but live review did not confirm it is active. Mobile ATC accessibility is critical.
**Recommended fix:** Verify `mobile-stickybar.liquid` is included in the product template and functioning on mobile.
**Theme file:** `sections/mobile-stickybar.liquid` | **Complexity:** Low (activation check)

---

### L12 — Accessibility: Skip-to-Content Link Missing

No skip-to-content link in `theme.liquid`. Confirmed gap from AI readiness audit (2026-06-19). WCAG 2.4.1 non-compliant.
**Theme file:** `layout/theme.liquid` (add `<a href="#MainContent" class="skip-link">Skip to content</a>` above `<main>`) | **Complexity:** Low

---

### L13 — Homepage: Category Label Typo

"Hall-way" category tile contains an erroneous hyphen. Should be "Hallway".
**Theme file:** Shopify Admin navigation / section schema | **Complexity:** Trivial

---

### L14 — Wishlist: Requires Account Login

Wishlist button is present on all product cards and PDPs but requires account creation/login. Guest wishlist would dramatically increase adoption.
**Theme file:** `sections/page-wishlist.liquid`, wishlist app settings | **Complexity:** Medium (requires app or custom development)

---

## Evidence

### Search Locations Checked

| Location | Searched For | Result |
|----------|-------------|--------|
| `docs/ui_ux/` | Any existing UI audit | Not found — directory did not exist |
| `evidence/audits/` | ledsone, ui, ux, cro, audit | 2 ledsone files found (SEO, AI readiness) — different scope |
| `evidence/fixes/` | ui, ux, pdp, collection, search | Search/predictive fix found — resolved item, different scope |
| `evidence/designs/` | ui, ux, conversion | Promo widget redesign, AI advisor design — not UI audit |
| `docs/**/*` | ui_ux, audit, cro | Only PPTX skill file and shopify sections doc found |

### Pages Reviewed Live

| Page | URL | Method |
|------|-----|--------|
| Homepage | https://ledsone.co.uk/ | WebFetch |
| Collection — Wall Lights | /collections/wall-lights | WebFetch |
| Collection — Pendant Lights | /collections/pendant-lights | WebFetch |
| Collection — LED Bulbs | /collections/led-bulbs | WebFetch |
| Collection — Pendant Lights (Filtered) | /collections/pendant-lights?filter.p.m.custom.colour=Black | WebFetch |
| PDP — Plug in Wall Lighting | /collections/wall-light/products/vintage-plug-in-wall-lights-2m-cable-dimmer-switch-wall-sconce-lamp | WebFetch |
| PDP — Industrial Sconce | /collections/wall-light/products/wall-lighting-industrial-sconce-wall-lamp-light-holder-fixtures | WebFetch |
| Search Results | /search?q=pendant+light&type=product | WebFetch |
| Cart | /cart | WebFetch |
| About Us | /pages/about-us | WebFetch |

### Files Created

| File | Path | Type |
|------|------|------|
| This audit document | `docs/ui_ux/ledsone_co_uk_ui_pending_audit.md` | UI/UX Audit — AIOS Asset |

### Resolved / Previously Fixed Items (Not Reopened)

| Item | Fix Record | Status |
|------|-----------|--------|
| Predictive search input missing | `evidence/fixes/predictive-search-fix-report.md` | ✅ Resolved — not re-reported |
| Search grid layout | `evidence/fixes/search-grid-fix-report.md` | ✅ Resolved |

---

## Known Limitations

1. **WebFetch text-only:** Visual rendering issues (font rendering, actual colour contrast, pixel-level spacing) cannot be assessed without screenshot tools. This audit is based on HTML structure and content, not visual screenshot analysis.
2. **Cart tested empty:** Cart UI for items-in-cart state (quantity controls, subtotal, cross-sell placement) could not be fully assessed from the empty cart state.
3. **Two PDPs tested:** Product detail page findings may not cover all PDP layout variants (`main-product-layout-2.liquid`, `main-product-matrix.liquid` not covered).
4. **Mobile rendering not visually confirmed:** Mobile layout is inferred from responsive HTML attributes and media query presence. Actual mobile render requires device or browser DevTools.
5. **Price display bug (H3):** Pricing inversion finding is flagged as "verify first" — may be a single data-entry error rather than a code bug.

---

## Queryability Result

| Question | Answerable from this document? |
|----------|-------------------------------|
| What UI issues exist on ledsone.co.uk? | Yes — 44 findings across all areas |
| Which issues are highest priority for CRO? | Yes — 11 High priority findings with expected customer impact |
| Which theme files are involved per issue? | Yes — every finding includes theme file reference |
| What has already been fixed? | Yes — resolved items table in Evidence section |
| What pages were reviewed? | Yes — Pages Reviewed table |
| Was any prior audit checked for duplicates? | Yes — Duplicate Risk Assessment section |
| Who reviews this? | Yes — Reviewer section in header |

**Queryability: PASS**

---

## Unknown Developer Readiness

A developer new to the ledsone.co.uk theme can use this document to:
- Identify which theme file to open for each fix
- Understand the complexity estimate before scoping
- Know which issues are data fixes (Shopify Admin) vs code fixes (theme files)
- Prioritise work using the H/M/L tier system
- Cross-reference resolved items to avoid re-opening closed work

**Developer Readiness: PASS**

---

## Final Status

| Check | Evidence | Status | Gap |
|-------|----------|--------|-----|
| Existing asset search | 5 locations searched, 2 prior ledsone audits found — different scope | ✅ PASS | None |
| Duplicate risk | No UI/UX audit previously existed | GREEN | None |
| Pages reviewed | 10 live page URLs reviewed via WebFetch | ✅ PASS | Cart with items; mobile visual render |
| UI issues found | 44 findings across 11 page/component areas | ✅ PASS | None |
| Asset created | `docs/ui_ux/ledsone_co_uk_ui_pending_audit.md` | ✅ PASS | None |
| Evidence saved | This document + source search evidence | ✅ PASS | None |
| Queryability | 7/7 questions answerable from doc | ✅ PASS | None |
| Unknown developer readiness | Theme file listed for every finding | ✅ PASS | None |
| Production changes | None made | ✅ PASS | None |

**Final Decision: GREEN — PASS**

A single, reusable, evidence-backed, queryable UI/UX audit asset exists inside the Mini-AIOS folder at `docs/ui_ux/ledsone_co_uk_ui_pending_audit.md`. It contains duplicate-risk assessment, reviewer information, 44 prioritised findings across homepage, collections, PDPs, search, cart, navigation, trust, accessibility and mobile. No production or theme changes were made.

---

## Next Action

1. **Technical Reviewer (Sajeesan):** Verify H3 pricing inversion — check `sections/main-product.liquid` price block logic to confirm if bug is code or data.
2. **Coordinator (Varmen):** Select implementation batch from H1–H11 findings. Recommend starting with H4 (scarcity threshold), H6 (star display), H7 (£0 price guard), H8 (hero headline), H9 (popup delay) — all Low-Medium complexity.
3. **Domain Owner:** Confirm which BNPL provider (M10) is available in the Shopify store account before development begins.
4. **Piranav:** Bulk fix vendor name inconsistency (H11) and product title model codes (H10) via Shopify Admin bulk editor — these are data fixes, not code.

---

## Pass / Fail Rule

PASS if: A single reusable, evidence-backed, queryable UI audit asset exists inside the Mini-AIOS folder, with duplicate-risk assessment, reviewer information, and prioritised findings.

FAIL if: The result exists only in chat, creates duplicate documentation, lacks evidence, or includes production/theme changes.

**Result: PASS**

---

*Audit Date: 2026-06-30 | Author: Claude Code (AIOS session) | Auditor: Discovery only — no code modified | Store: https://ledsone.co.uk/*
