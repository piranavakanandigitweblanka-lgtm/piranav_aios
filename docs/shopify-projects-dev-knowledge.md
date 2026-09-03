# shopify_projects — Dev Knowledge Reference

Last updated: 2026-09-03

---

## Three Active Themes

| Theme folder | Store | Domain | Base theme |
|---|---|---|---|
| `ledsone-uk-theme` | LEDSone UK | ledsone.co.uk | mczr (custom Umino-based) |
| `ledsone-fr-theme` | LEDSone FR | ledsone.fr / jedsz8-km.myshopify.com | mczr (custom Umino-based) |
| `electricalsone-theme` | Electricalsone | electricalsone.co.uk | Custom (Dawn-derived) |

All three are plain Shopify Liquid themes — no Node.js, no build step.
Deployed via **Shopify CLI** or manual upload through Shopify Admin.

---

## Git Routing

All three theme folders live inside `piranav_aios/shopify_projects/` and are tracked in the **main AIOS repo**.

```
git add shopify_projects/ledsone-uk-theme/...
git commit -m "..."
git push   ← from piranav_aios root
```

**Shopify CLI push is separate from git** — committing to git does NOT push to the live store. You must run `shopify theme push` explicitly after committing.

---

## Theme Folder Structure (same for all three)

```
<theme>/
  assets/         — CSS, JS, images (referenced via {{ 'file.css' | asset_url }})
  blocks/         — theme blocks (if any)
  config/
    settings_data.json   — live theme settings (current + presets + platform_customizations)
    settings_schema.json — schema definition for theme editor
  layout/
    theme.liquid  — root HTML shell, head tags, global scripts
    password.liquid
  locales/        — translation strings
  sections/       — section files (rendered by templates)
  snippets/       — reusable partials (rendered via {% render %})
  templates/      — JSON or liquid templates mapping pages to sections
```

---

## How Templates Work

Templates are JSON files (e.g. `product.json`, `collection.json`, `index.json`) that declare which sections appear on that page and in what order.

- `templates/index.json` → homepage sections
- `templates/product.json` → default product page sections
- `templates/product.custom-name.json` → product page variant for specific handles
- `templates/page.handle.json` or `page.handle.liquid` → specific page template

**To change what sections appear on a page** — edit the template JSON.
**To change section content/logic** — edit the section `.liquid` file.
**To change global layout** — edit `layout/theme.liquid`.

---

## Key Sections Per Theme

### ledsone-uk-theme (most complex)
| Section | Purpose |
|---|---|
| `main-product.liquid` | PDP — product detail page, gallery, variants, tabs |
| `main-article.liquid` | Blog article page |
| `main-collection-product.liquid` | Collection listing |
| `piranav-promo.liquid` | Piranav-built promo section |
| `wholesale-trendy-discovery.liquid` | Wholesale discovery section |
| `order-tracking.liquid` | Order tracking page section |
| `featured-products-2026.liquid` | 2026 featured products homepage section |
| `product-faq-metafield.liquid` | FAQ rendered from product metafield |

### ledsone-fr-theme
| Section | Purpose |
|---|---|
| `main-product.liquid` | FR PDP |
| `main-article.liquid` | FR blog article |
| `piranav-promo.liquid` | Promo section (same pattern as UK) |

### electricalsone-theme
| Section | Purpose |
|---|---|
| `main-product.liquid` | PDP |
| `main-article.liquid` | Blog article |
| `featured-products-2026.liquid` | Featured products section |
| `footer.liquid` | Footer |

---

## Key Snippets to Know

### Shared across ledsone-uk and ledsone-fr
| Snippet | Purpose |
|---|---|
| `product-faq-ui.liquid` | Reads `product.metafields.custom.faq_schema`, outputs JSON-LD schema + injects accordion UI via JS |
| `head-assets.liquid` | Global CSS/JS includes in `<head>` |
| `product-item.liquid` | Product card (used in grids, carousels) |
| `price.liquid` | Price display with compare-at |
| `product-media.liquid` | Product image/video media |
| `meta-tags.liquid` | SEO meta tags |
| `scripts-tag.liquid` | Global JS at end of body |
| `pagination.liquid` | Collection pagination |
| `breadcrumbs.liquid` | Page breadcrumbs |

### electricalsone-theme specific
| Snippet | Purpose |
|---|---|
| `product-highlights.liquid` | Product highlight bullets |
| `product-description-tab.liquid` | Description tab content |
| `Faq-UI.liquid` | FAQ accordion (different from UK version) |
| `facets.liquid` | Collection filter facets |

---

## Liquid Coding Patterns — Always Follow

### 1. Font-size inherit rule
Never hard-code font sizes in snippet CSS. Always use `font-size: inherit` so the parent section controls sizing. Hard-coded sizes break when sections are reused across different contexts.

### 2. aria-expanded correctness
Accordion toggles must set `aria-expanded="true"` when open and `aria-expanded="false"` when closed — not just add/remove a class. Screen readers depend on this attribute.

### 3. Blocks loop silencing
When looping `section.blocks` and a block type doesn't match, use `{% else %}{% comment %}{% endcomment %}` or simply `{% else %}` with no output — never leave an unmatched block rendering empty whitespace that breaks layout.

### 4. Duplicate render path prevention
If a snippet is rendered in both a section and a parent snippet, check before adding a second `{% render %}` call. Duplicate renders cause doubled output, doubled JS listeners, and doubled schema markup.

### 5. RTE table responsive fix
Any `<table>` inside a `.rte` (rich text editor) block must be wrapped:
```liquid
<div class="rte-table-wrap" style="overflow-x:auto;">
  {{ block.settings.content }}
</div>
```
Without this, wide tables overflow on mobile.

### 6. Section settings shorthand
Always assign `section.settings` to a local variable at the top:
```liquid
{%- assign st = section.settings -%}
```
Then use `st.setting_name` — avoids repetition and easier to read.

---

## metafields Used

| Namespace.key | Type | Used for | Themes |
|---|---|---|---|
| `custom.faq_schema` | JSON (string) | FAQ accordion + JSON-LD schema on PDP and collection pages | ledsone-uk, ledsone-fr |

---

## Currently Modified Files (as of 2026-09-03)

| Theme | File | Area |
|---|---|---|
| ledsone-uk | `assets/footer.css` | Footer styles |
| ledsone-uk | `layout/theme.liquid` | Global layout |
| ledsone-uk | `sections/featured-products-2026.liquid` | Homepage featured products |
| ledsone-uk | `sections/main-article.liquid` | Blog article page |
| ledsone-uk | `sections/main-product.liquid` | PDP |
| ledsone-uk | `templates/index.json` | Homepage template |
| ledsone-uk | `templates/page.LED Transformers.liquid` | LED Transformers page |
| ledsone-uk | `sections/piranav-promo.liquid` | Promo section |
| ledsone-uk | `sections/wholesale-trendy-discovery.liquid` | Wholesale section |
| ledsone-uk | `templates/collection.json` | Default collection template |
| ledsone-uk | `templates/page.laundry bags.liquid` | Laundry bags page |
| ledsone-uk | `sections/order-tracking.liquid` | Order tracking |
| ledsone-fr | `assets/product.css` | Product styles |
| ledsone-fr | `config/settings_data.json` | Theme settings |
| ledsone-fr | `snippets/product-faq-ui.liquid` | FAQ accordion snippet |
| ledsone-fr | `templates/collection.json` | Default collection template |
| ledsone-fr | `templates/index.json` | Homepage template |
| ledsone-fr | `templates/product.json` | Default product template |
| electricalsone | `assets/footer.css` | Footer styles |
| electricalsone | `layout/theme.liquid` | Global layout |
| electricalsone | `sections/featured-products-2026.liquid` | Featured products |
| electricalsone | `sections/main-article.liquid` | Blog article page |
| electricalsone | `sections/main-product.liquid` | PDP |
| electricalsone | `templates/index.json` | Homepage template |
| electricalsone | `templates/page.LED Transformers.liquid` | LED Transformers page |

**These files have uncommitted changes — commit before pushing to Shopify.**

---

## Deploy Workflow

```bash
# Step 1 — commit to git first (Rule 2)
git add shopify_projects/ledsone-uk-theme/...
git commit -m "..."
git push

# Step 2 — push to Shopify store (separate step)
cd shopify_projects/ledsone-uk-theme
shopify theme push

# Or push a specific file only
shopify theme push --only sections/main-product.liquid
```

**Never push to Shopify without committing to git first.**
**Never push to the wrong store** — check which store the CLI is connected to with `shopify theme info` before pushing.

---

## Adding a New Section

1. Create `sections/<name>.liquid`
2. Add schema block at the bottom:
```liquid
{% schema %}
{
  "name": "Section Name",
  "settings": [...],
  "blocks": [...],
  "presets": [{ "name": "Section Name" }]
}
{% endschema %}
```
3. Add to a template JSON to make it appear on a page
4. Follow snippet patterns above — no hard-coded font sizes, correct aria attributes

---

## Adding a New Page Template

1. Create `templates/page.<handle>.json` or `templates/page.<handle>.liquid`
2. JSON template format:
```json
{
  "sections": {
    "main": { "type": "main-page", "settings": {} }
  },
  "order": ["main"]
}
```
3. Assign the template to the page in Shopify Admin → Pages → Template

---

## Settings Data — config/settings_data.json

Three top-level keys:
- `current` — live active settings (what the store actually uses)
- `presets` — saved preset configurations
- `platform_customizations` — Shopify-managed overrides

**Always edit `current` when changing theme settings programmatically.** Presets are backups — don't overwrite them unintentionally.

---

## Common Gotchas

| Gotcha | What happens | Fix |
|---|---|---|
| Push Shopify without committing | Git and live store go out of sync silently | Always commit first |
| Hard-coded font-size in snippet | Breaks when section reused in different context | Use `font-size: inherit` |
| `{% render %}` called twice for same snippet | Doubled output, doubled JS listeners | Check before adding second render |
| Table in RTE without overflow wrapper | Horizontal overflow on mobile | Wrap in `overflow-x: auto` div |
| Wrong `aria-expanded` value | Accordion broken for screen readers | Set true/false not just class toggle |
| Editing `settings_data.json` presets instead of `current` | Live store unaffected | Edit under `current` key |
| `shopify theme push` to wrong store | Overwrites wrong store | Run `shopify theme info` first |
