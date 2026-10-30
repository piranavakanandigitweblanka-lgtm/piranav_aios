---
name: ledsone-de-theme-architecture
description: Technical architecture reference for the LEDSone Germany (ledsone_de) Shopify theme — file structure, rendering pipeline, custom components, active modifications
metadata:
  type: docs
  project: ledsone_de
  created: 2026-10-30
  updated: 2026-10-30
---

# LEDSone DE — Shopify Theme Architecture Reference

**Store:** ledsone.de (Germany)
**Theme base:** Umino / Bluesky theme (heavily customised)
**Local path:** `shopify_projects/ledsone_de/`
**Git repo:** `piranavakanandigitweblanka-lgtm/piranav_aios` (main branch)
**Deploy method:** Shopify CLI — NOT via git push

---

## Directory Structure

| Folder | Contents | Notes |
|---|---|---|
| `layout/` | `theme.liquid`, `password.liquid` | Master layout wraps every page |
| `templates/` | 100+ JSON + Liquid templates | JSON templates are theme-editor configurable |
| `sections/` | ~110 section files | Core page building blocks |
| `snippets/` | ~80 snippet files | Reusable components rendered via `{% render %}` |
| `assets/` | CSS, JS, fonts, images | No bundler — direct Shopify CDN delivery |
| `config/` | `settings_data.json`, `settings_schema.json` | Theme settings |
| `locales/` | Translation files | German primary |

---

## Rendering Pipeline

```
HTTP Request
  → layout/theme.liquid
      ├── <head>
      │    ├── snippets/head-assets.liquid    (fonts, CSS variables, theme CSS)
      │    ├── swiper-bundle.min.js (defer)   (global carousel)
      │    ├── easydlg.min.js (defer)         (global dialog library)
      │    ├── GTM (GTM-NN322MJD)
      │    ├── Google Ads (AW-553096373)
      │    └── Clarity (py88ky947l)
      └── <body>
           ├── snippets/header.liquid          (global nav, search, cart)
           ├── {{ content_for_layout }}        (template sections)
           │    → e.g. templates/product.json
           │         → sections/main-product.liquid
           │              → snippets/energy-label.liquid
           │              → snippets/product-faq-ui.liquid
           │              → snippets/product-item.liquid
           │              → (etc.)
           └── snippets/scripts-tag.liquid     (deferred JS)
```

---

## Template Architecture

**JSON templates** (e.g. `product.json`, `collection.json`, `index.json`):
- Fully configurable via Shopify theme editor
- Declare sections and their order
- Block settings stored as JSON

**Liquid templates** (e.g. `page.modernelichtwelten.liquid`):
- Hardcoded section render calls
- Not configurable via theme editor
- Used for campaign/landing pages

---

## CSS Loading Architecture

| File | Type | Loading | Scope |
|---|---|---|---|
| `critical.css` | Inline styles | render-blocking | Global |
| `base.css` | External link | head-assets.liquid | Global |
| `reset.css` | External link | head-assets.liquid | Global |
| `bootstrap-grid.css` | External link | head-assets.liquid | Grid system |
| `product.css` | External link | main-product.liquid:1 | Product pages |
| `product-details.css` | External link | main-product.liquid:2 | Product pages |
| `collection.css` | External link | collection sections | Collection pages |
| `[feature].css` | External link | Per-section | Scoped to section |
| `energy-label styles` | Inline `<style>` | energy-label.liquid | Scoped `.el-*` |

---

## JavaScript Architecture

| File | Role |
|---|---|
| `pubsub.js` | Central event bus (cart, variants) |
| `main-product.js` | Variant selection, gallery sync, add-to-cart |
| `product.js` | Extended PDP interactions |
| `product_action.js` | Product action helpers |
| `cart.js` | Cart drawer/page operations |
| `collection.js` | Filtering, infinite scroll, sort |
| `swiper-bundle.min.js` | Global carousel (Swiper.js) — defer, all pages |
| `easydlg.min.js` | Dialog library — defer, all pages |
| `constants.js` | Global constants |

---

## Custom Components (Active)

| Component | File | Description |
|---|---|---|
| EU Energy Label (PDP) | `snippets/energy-label.liquid` | EU colour-coded energy class badge + modal. Metafields: `custom.energy_class`, `custom.energy_label_data_sheet`. Rendered at main-product.liquid:873. |
| Product FAQ Drawer | `snippets/product-faq-ui.liquid` | Slide-in right drawer. Reads `custom.faq_schema` (FAQPage JSON-LD). Also contains Feedback Modal and Description Drawer. |
| Customer Feedback Modal | `snippets/product-faq-ui.liquid` | "Warum kein Interesse?" modal — collects email + reason. Posts to `listings.vintageinterior.co.uk/api/get-feedback-from-shopify`. |
| Description Drawer | product.json custom_liquid_bDxwGB (active) | Slide-in product description drawer. Falls back to `product.description` if `custom.description` metafield absent. |
| Product Group | `snippets/product-group.liquid` | Related product grouping display. Metafield: `bls.product_grouped`. |
| Bulk Buy Widget | `snippets/bulk-buy-widget.liquid` | Tiered quantity pricing. |
| Shopify Inbox LCP Fix | `layout/theme.liquid:22–41` | Delays chat widget until user interaction or 5s timeout. Added Kuberan 23-06-2026. |
| Country/Language Switcher | `snippets/country-switcher.liquid`, `language-switcher.liquid` | Shopify Markets support. |
| Conduit Pro / Lamp Pro / etc. | `snippets/*-pro.liquid` | Specialised product type display templates. |

---

## Currently Modified Files (Local — Not Committed)

| File | Change | Notes |
|---|---|---|
| `config/settings_data.json` | 1 line | Theme settings toggle — content TBC |
| `sections/faq.liquid` | 4 lines | Minor modification |
| `sections/main-product.liquid` | 2 lines deleted | Purpose TBC — needs confirmation |
| `snippets/energy-label.liquid` | Full rewrite (Sep 2026) | Stacking context + responsive fix applied |
| `snippets/product-faq-ui.liquid` | +48/-9 lines | FAQ drawer + feedback modal update |
| `templates/collection.json` | 1 line | Collection template setting |
| `templates/index.json` | 1 line | Homepage setting |
| `templates/product.json` | 1 line | Product template setting |
| `templates/page.modernelichtwelten.liquid` | NEW — untracked | New page template, purpose TBC |

---

## Analytics Tags in theme.liquid

| Tag | ID | Purpose |
|---|---|---|
| Google Tag Manager | GTM-NN322MJD | All events |
| Google Ads | AW-553096373 | Conversion tracking |
| Microsoft Clarity | py88ky947l | Heatmaps / session recording |

---

## Disabled / Commented Code

| Location | What | Reason |
|---|---|---|
| `theme.liquid:87–108` | `/de-pl/` → `/` locale redirect | Disabled by Piranav 2025-07-11 |
| `templates/product.json` blocks: `custom_liquid_eNHEMU`, `custom_liquid_jQWqj3` | Old button/drawer variants | Superseded by `custom_liquid_bDxwGB` (current) |
| `templates/product.json` block: `custom_liquid_XycCf8` | `{% render 'energy-label' %}` custom_liquid block | Energy label rendered directly in main-product.liquid:873 instead |

---

## Collection Page Rendering Chain

```
templates/collection.json
  → sections/main-collection-product.liquid  (section: "product-grid")
      → for product in collection.products
          → render 'product-item', product: product   (line 175, grid view)
          → render 'product-list-item', product: product  (list view)
```

`product-item.liquid` is called from **9 section files** total (search, wishlist, recommendations, etc.). Only `product` is passed — `collection` is available as a global Liquid object in all render contexts.

### AJAX Patterns in collection.js

| Pattern | Mechanism | Script execution |
|---|---|---|
| Filter update | `DOMParser` → `replaceWith(newSection)` | Inline `<script>` tags DO NOT execute |
| Load-more / infinite scroll | `DOMParser` → `appendChild(prodNode)` | Inline `<script>` tags DO NOT execute |

**Critical implication:** Any snippet with `<script>` blocks rendered inside product cards will not work for AJAX-loaded products. Card snippets must be JS-free.

---

## AIOS Documentation Map

| Asset | Path |
|---|---|
| Architecture (this file) | `docs/shopify/ledsone-de-theme-architecture.md` |
| Energy label audit | `evidence/shopify/ledsone_de/energy-label-snippet-audit-2026-10-30.md` |
| Energy label phase 2 fixes | `evidence/shopify/ledsone_de/energy-label-phase2-fixes-2026-10-30.md` |
| Energy label collection card discovery | `evidence/shopify/ledsone_de/energy-label-collection-card-discovery-2026-10-30.md` |
| Energy label prior fix | `evidence/shopify/ledsone-de-energy-label-modal-responsive-fix-2026-09-28.md` |
| Energy label prompt | `prompts/shopify/ledsone-de-energy-label-snippet-audit.md` |
| Collection card energy label discovery prompt | `prompts/shopify/ledsone-de-collection-card-energy-label-discovery.md` |
| Collection card energy label implementation evidence (historical — rolled back) | `evidence/shopify/ledsone_de/energy-label-collection-card-implementation-2026-10-30.md` |
| Energy label responsive fix prompt | `prompts/shopify/energy-label-modal-responsive-fix.md` |
| Phase 0 discovery | Delivered in session 2026-10-30 (not yet filed as separate doc) |

---

## Source Map Entry

See: `source-map/README.md` — ledsone_de section
