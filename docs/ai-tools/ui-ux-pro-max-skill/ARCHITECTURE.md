# ARCHITECTURE — UI UX Pro Max Skill

---

## Purpose of This File

This document maps the full structure of the UI UX Pro Max Skill — its data sources, search domains, capability counts, tech stack coverage, and how the two knowledge layers (upstream skill + local Shopify SEO reference) relate to each other.

---

## Two Knowledge Layers

This AIOS integration combines two distinct sources. Do not confuse them:

| Layer | Source | Type | Queryable By |
|---|---|---|---|
| **Layer 1 — Upstream Skill** | `src/ui-ux-pro-max/` (installed via `npx ui-ux-pro-max-cli init`) | AI design intelligence: styles, palettes, fonts, UX rules | Python search engine |
| **Layer 2 — Shopify SEO Reference** | `C:\Users\PC\Desktop\shopify_seo_ui_ux_guide.md` | Shopify-specific SEO & UI/UX checklists (28 scored tasks) | Direct file read |

Layer 1 generates design systems. Layer 2 validates Shopify implementation quality.

---

## Layer 1 — Upstream Skill Architecture

### Capability Summary

| Capability | Count | CSV Source |
|---|---|---|
| UI Styles | 84 | `data/styles.csv`, `data/app-interface.csv`, `data/design.csv` |
| Colour Palettes | 161 | `data/colors.csv` |
| Font Pairings | 73 | `data/typography.csv`, `data/google-fonts.csv` |
| Chart Types | 25 | `data/charts.csv` |
| UX Guidelines | 99 | `data/ux-guidelines.csv`, `data/react-performance.csv` |
| Product Categories | 161 | `data/products.csv`, `data/ui-reasoning.csv` |
| Tech Stacks | 17 | `data/stacks/` |

### Data File Map

```
src/ui-ux-pro-max/
├── data/
│   ├── products.csv          ← 161 product category → design pattern mappings
│   ├── styles.csv            ← 84 UI style definitions (Glassmorphism, Brutalism, etc.)
│   ├── colors.csv            ← 161 colour palettes with hex values and industry tags
│   ├── typography.csv        ← Font pairing data (heading + body combinations)
│   ├── google-fonts.csv      ← Google Fonts specific pairings
│   ├── charts.csv            ← 25 chart types with use-case guidance
│   ├── ux-guidelines.csv     ← 99 UX best practices and anti-patterns
│   ├── landing.csv           ← Landing page section patterns
│   ├── app-interface.csv     ← App UI interface patterns
│   ├── design.csv            ← General design patterns
│   ├── ui-reasoning.csv      ← 161 industry-specific reasoning rules
│   ├── react-performance.csv ← React performance patterns
│   ├── icons.csv             ← Icon library references
│   ├── draft.csv             ← Draft pattern templates
│   ├── _sync_all.py          ← Asset sync utility
│   └── stacks/               ← 17 tech-stack-specific data files
├── scripts/
│   └── search.py             ← BM25 + regex search engine (no external deps)
└── templates/                ← Output templates for design system generation
```

### Search Domains

The Python search engine supports 7 queryable domains:

| Domain Flag | Searches In | Example Query |
|---|---|---|
| `--domain product` | `products.csv`, `ui-reasoning.csv` | `"beauty spa"`, `"SaaS dashboard"` |
| `--domain style` | `styles.csv`, `app-interface.csv`, `design.csv` | `"glassmorphism"`, `"dark mode"` |
| `--domain color` | `colors.csv` | `"warm neutrals"`, `"electric blue tech"` |
| `--domain typography` | `typography.csv`, `google-fonts.csv` | `"luxury serif"`, `"modern sans"` |
| `--domain landing` | `landing.csv` | `"SaaS hero section"`, `"e-commerce above fold"` |
| `--domain chart` | `charts.csv` | `"revenue comparison"`, `"funnel analysis"` |
| `--domain ux` | `ux-guidelines.csv`, `react-performance.csv` | `"checkout flow"`, `"form validation"` |

### Search Command Format

```bash
python3 src/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>
```

Examples:

```bash
# For a Shopify lighting store (LEDsone):
python3 src/ui-ux-pro-max/scripts/search.py "LED lighting e-commerce UK" --domain product
python3 src/ui-ux-pro-max/scripts/search.py "industrial tech" --domain color
python3 src/ui-ux-pro-max/scripts/search.py "dark mode grid" --domain style

# For a general landing page:
python3 src/ui-ux-pro-max/scripts/search.py "product hero section" --domain landing
```

### Tech Stack Coverage

The 17 supported stacks (in `data/stacks/`):

| Category | Stacks |
|---|---|
| Web — React ecosystem | React, Next.js, shadcn/ui |
| Web — Vue ecosystem | Vue, Nuxt |
| Web — Other | Svelte, HTML + Tailwind |
| Mobile — Native | SwiftUI, React Native, Flutter |
| Component libraries | shadcn/ui, and stack-specific variants |

### UI Styles Covered (Examples from 84 total)

Glassmorphism · Claymorphism · Neumorphism · Brutalism · Minimalism · Maximalism · Bento Grid · Dark Mode · AI-Native UI · Retro/Y2K · Organic/Blob · Corporate Flat · Material Design · Fluent Design · Skeuomorphism · Memphis Design · Swiss/International · Cyberpunk · Vaporwave · and more.

---

## Layer 2 — Shopify SEO Reference Architecture

The `shopify_seo_ui_ux_guide.md` file provides scored implementation checklists across 8 domains. This is NOT part of the upstream skill — it is used after the design system is generated to validate Shopify-specific implementation quality.

| Domain | Task Areas | When to Use |
|---|---|---|
| 1. Technical SEO | Crawl, robots.txt, canonicals, hreflang | After any Shopify theme change |
| 2. On-Page SEO | Meta, headings, alt text, schema, duplicates | After content or template changes |
| 3. Performance | LCP, CLS, INP, images, JS/CSS, third-party | After adding sections or apps |
| 4. Shopify-Specific SEO | URLs, pagination, filters, blog | After collection/product template changes |
| 5. Design & Layout | Homepage, mobile, CTA, typography | After applying a design system |
| 6. CRO | Cart, trust signals, upsell, sticky header | After conversion-affecting changes |
| 7. Theme Customisation | Liquid, sections, navigation, footer | After Liquid code edits |
| 8. Accessibility | Contrast, keyboard nav, ARIA | After any UI change |

Importance scoring: 25/25 = Critical → 18/25 = Normal. Tasks scored 25/25 must be fixed before all others.

---

## How the Two Layers Work Together

```
1. Identify project / product category
        ↓
2. Query Layer 1 (upstream skill) → get design system:
   style + colour palette + font pairing + UX rules
        ↓
3. Apply design system to Shopify theme (Liquid / CSS)
        ↓
4. Validate with Layer 2 (Shopify SEO reference):
   run the 8-domain checklist on the changed templates
        ↓
5. Evidence + closure
```

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Authored | piranav |
| Reviewer | Varmen |
| Upstream Version Tracked | 2.8.8 |
| Last Updated | 2026-06-26 |
