# Guidelines — Theme Customization

**Status:** DRAFT
**Sheet:** Theme Customization (BGCT workbook, Sheet 4)
**Tasks covered:** TC-1 through TC-6
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## TC-1 — Liquid Template Edits

| Rule | Detail |
|---|---|
| **Duplicate theme before any edit** | Always create a backup duplicate of the live theme before touching any file. Name it `[YYYY-MM-DD]-[task-description]`. |
| **Use `{% render %}` not `{% include %}`** | `include` is deprecated in Shopify 2.0. All new and edited snippet calls must use `render`. |
| **No inline CSS in Liquid** | CSS must live in asset files. If adding a style for a Liquid element, add a CSS class and write the CSS in the asset file. |
| **Separate logic from HTML** | Assign variables and run conditionals at the top of a template section — not interleaved between HTML tags. |
| **No edits to live theme** | All edits are made on a duplicate/staging theme. Live theme is only updated by publishing the tested duplicate. |
| **Escalation: Developer** | All Liquid code changes require developer (Sajeesan) review before publishing. |
| **Escalation: Coordinator** | Any change to layout files (`theme.liquid`, `base.css`, `header.liquid`, `footer.liquid`) requires Sathees coordinator awareness before merge. |

---

## TC-2 — Custom Sections

| Rule | Detail |
|---|---|
| **All content must be editable in Customizer** | No hardcoded copy or images in the Liquid template. Every editable element must be a schema setting. |
| **Every section must have a preset** | Sections without presets do not appear in the "Add section" panel. Include at least one `"presets"` block. |
| **Expose padding/margin settings** | Add `padding_top`, `padding_bottom` schema settings (type: `range`) to every section so spacing can be adjusted without code changes. |
| **Section Rendering API for AJAX** | When section content must refresh without full reload (e.g., on filter change), use the Section Rendering API instead of custom fetch/render logic. |
| **Prohibited** | Hardcoded image URLs, hardcoded prices, hardcoded category names in Liquid files — all must be schema settings. |
| **Escalation: Developer** | Custom section builds and schema design require developer review. |

---

## TC-3 — Custom Blocks

| Rule | Detail |
|---|---|
| **Always include `{{ block.shopify_attributes }}`** | Without this, blocks cannot be selected, moved, or edited in the Customizer. This is mandatory on every block wrapper element. |
| **Set `max_blocks` in schema** | Every section schema with blocks must define a maximum block count. If no limit applies, document the reason. |
| **Empty state must be handled** | If `section.blocks.size == 0`, show a Customizer-only placeholder, not a broken layout or empty space. |
| **Use `type: "@app"` to enable app blocks** | If the section should allow Shopify app integrations, include an `@app` block type in the schema. |
| **Prohibited** | Looping blocks without `{{ block.shopify_attributes }}`. Sections with unlimited blocks and no empty state handling. |
| **Escalation: Developer** | Block schema design and JavaScript interactions require developer review. |

---

## TC-4 — Navigation Menu Restructuring

| Rule | Detail |
|---|---|
| **Maximum 7 top-level items** | If current navigation exceeds 7 top-level items, consolidate categories before publishing changes. |
| **Organise by user intent** | Category names must reflect how shoppers search (e.g., "LED Strip Lights" not "Category: LED-STR-V2"). |
| **Bestselling category must be positions 1–3** | The top revenue-driving categories must be in the first three positions (left side on desktop). |
| **No hover-only dropdowns on mobile** | Mobile navigation must use touch-based accordions, not hover-dependent CSS dropdowns. |
| **Do not bury bestselling categories** | A category driving ≥10% of revenue may not be placed deeper than one level from the top navigation. |
| **Prohibited** | Removing or renaming navigation items that have existing backlinks or significant organic traffic — coordinate with SEO team first. |
| **Escalation: Business Validator** | Navigation restructuring affects search rankings and user familiarity — requires business validator approval before publishing. |
| **Escalation: SEO** | Any change to high-traffic navigation items must be reviewed for SEO impact (internal linking, crawl depth). |

---

## TC-5 — Footer Redesigns

| Rule | Detail |
|---|---|
| **Four-column structure required** | Shop / Support / About / Newsletter. Deviations must be documented with a reason. |
| **Legal links are mandatory** | Privacy Policy, Terms of Service, Refund Policy. If any are missing from the footer, they must be added before the redesign is published. |
| **Newsletter copy must be compelling** | "Subscribe" alone is insufficient. Use a value proposition: "Get 10% off your first order" or "Join 10,000+ customers." |
| **Social icons: active channels only** | Never include a link to a social profile that has zero posts or is not actively managed. |
| **No duplicate main nav** | The footer may include key category links — it must not be a copy of the entire main navigation. |
| **Prohibited** | Footer without Privacy Policy link. Footer newsletter form with no consent language. |
| **Escalation: Legal/Compliance** | Confirming that Privacy Policy, Terms, and Refund Policy are present and up to date. |

---

## TC-6 — Header Redesigns

| Rule | Detail |
|---|---|
| **Logo must be proportionate** | Header height 60–80px standard. Logo must not push the header past this. Test at 375px mobile width. |
| **Search must be visible on mobile without navigation** | Search icon must be directly in the header — not inside a hamburger menu click. |
| **Cart badge must show accurate real-time count** | If the count does not update via AJAX on add-to-cart, this is a developer bug that must be resolved before publishing. |
| **Sticky header: reduce height on scroll** | If a sticky header is used, add a CSS class on scroll (`is-scrolled`) that reduces height and logo size. |
| **Visual separator required** | All headers must have a border-bottom or box-shadow to visually separate from page content. |
| **Mobile logo must not overlap nav icons** | At 375px, logo width + hamburger icon + cart icon must all fit within the viewport with no overlap or overflow. |
| **Prohibited** | Removing the cart icon from the header. Removing the cart badge count. Publishing without testing on both 375px and 1440px viewports. |
| **Escalation: Developer** | Sticky header implementation, AJAX cart badge count updates, and mobile responsive fixes require developer review. |
