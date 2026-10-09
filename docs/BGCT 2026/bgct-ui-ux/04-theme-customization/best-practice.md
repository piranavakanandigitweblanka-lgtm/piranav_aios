# Best Practice — Theme Customization

**Status:** DRAFT — Liquid code examples require review by Sajeesan before team rollout
**Sheet:** Theme Customization (BGCT workbook, Sheet 4)
**Tasks covered:** TC-1 through TC-6
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## TC-1 — Liquid Template Edits

### User problem
Developers editing Liquid templates mix business logic with HTML layout, add inline CSS, and edit live themes directly. This causes hard-to-maintain code, broken layouts, and production outages.

### Recommended approach
**Separate logic from HTML.** Business logic (conditionals, variable assignment, loops) should be handled at the top of a template or in a dedicated snippet, not scattered inline inside the HTML structure.

**Always duplicate the live theme before making any edits.** Admin → Online Store → Themes → Actions → Duplicate. Name the duplicate clearly (e.g., `[date]-edit-[task]`). Edit the duplicate, test, then publish.

**Use `{% render 'snippet' %}` not `{% include 'snippet' %}`** — `include` is deprecated in Shopify 2.0 and will be removed. `render` provides a clean variable scope.

**Never hardcode CSS inline in Liquid templates.** Use class names and move styling to asset CSS files.

### Priority checks
1. No inline `style="..."` attributes added in Liquid files
2. No `{% include %}` — all snippet calls use `{% render %}`
3. Draft theme used for all edits — not the live theme
4. Logic sections grouped at top of template, not interleaved with HTML

### Authoritative reference
- https://shopify.dev/docs/api/liquid/tags/render
- https://shopify.dev/docs/storefronts/themes/best-practices/performance

---

## TC-2 — Custom Sections

### User problem
Custom sections built by developers require code changes to update content. This wastes developer time on copy edits, blocks non-technical team members, and slows content workflows.

### Recommended approach
Build every custom section so that **non-technical staff can update all content via the Theme Customizer** — no code changes needed. This is achieved by exposing all editable content as schema settings.

Use `{% schema %}` blocks with `type: "section"` and define appropriate input types for every variable content field: `type: "text"`, `type: "richtext"`, `type: "image_picker"`, `type: "url"`.

**Add presets** to every custom section so it appears in the "Add section" menu in the Customizer.

**Include padding and margin schema settings.** This allows team members to adjust spacing between sections without developer involvement.

Use the **Section Rendering API** when updating section content via AJAX (e.g., filtering) to avoid full page reloads.

### Key rules
- No hardcoded copy text inside the Liquid template — everything editable must be a schema setting
- No hardcoded image URLs — use `image_picker` schema settings
- Every section must have at least one named preset

### Authoritative reference
- https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema

---

## TC-3 — Custom Blocks

### User problem
Section blocks used without structure lead to unlimited repeating content, no graceful empty state, and app blocks that cannot be added by merchants through the Customizer.

### Recommended approach
Loop blocks using `{% for block in section.blocks %}`. Include `{{ block.shopify_attributes }}` inside each block wrapper — this is required for the block to be selectable and editable in the Customizer.

**Limit maximum blocks** using `"max_blocks"` in the section schema. Set a sensible limit (e.g., 5 for testimonial cards, 10 for feature icons). Unlimited blocks cause layout breaks.

**Handle the zero-blocks empty state.** Wrap the block loop in `{% if section.blocks.size > 0 %}`. Add an `{% else %}` message that shows only in the Customizer, not on the live store:
```liquid
{% if section.blocks.size == 0 %}
  <div class="placeholder-noblocks">{{ 'sections.no_blocks' | t }}</div>
{% endif %}
```

**Use `type: "@app"` for app blocks** to allow Shopify app integrations (reviews, badges, etc.) to be positioned within a section through the Customizer.

### Authoritative reference
- https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema#blocks

---

## TC-4 — Navigation Menu Restructuring

### User problem
Navigation menus with too many items, poor category grouping, or a buried bestselling category cause user confusion, increased bounce rate, and missed revenue from shoppers who cannot find key products.

### Recommended approach
**Maximum 7 top-level navigation items.** Beyond 7, cognitive load increases and users disengage. Consolidate related categories.

**Organise by user intent, not by internal product taxonomy.** Top-level categories should reflect how shoppers think and search, not how the warehouse categorises stock.

**Most important and bestselling categories go in positions 1–3 (left side)**. Eye-tracking research consistently shows that left-positioned nav items receive the most attention on desktop.

**On mobile, use nested accordions** — not a flat list or a deep multi-level hover dropdown (hover does not work on touchscreens).

**Do not bury bestselling categories in deep dropdown menus.** If a category drives 20%+ of revenue, it belongs at the top level or one click from the homepage.

### Authoritative reference
- https://baymard.com/blog/main-navigation-design (navigation UX research)

---

## TC-5 — Footer Redesigns

### User problem
Footers that duplicate the main navigation, omit legal links, or have no useful secondary content waste a high-impression real estate area and create compliance risk.

### Recommended approach
The footer should be organised into **four columns**:
1. **Shop** — product categories and collections (not a duplicate of the full main nav)
2. **Support** — Contact Us, FAQs, Shipping Info, Returns/Refund Policy
3. **About** — About Us, Blog, Careers (if applicable)
4. **Newsletter** — email signup with compelling copy (e.g., "Get 10% off your first order") not just "Subscribe"

**Legal links are mandatory:** Privacy Policy, Terms of Service, Refund Policy. These are not optional — they protect the business legally.

**Social media icons** (link to active channels only) and **accepted payment icons** (Visa, Mastercard, PayPal, Klarna, etc.) are standard footer elements.

**Do not repeat the entire main navigation** in the footer — it adds no value and dilutes navigation hierarchy.

---

## TC-6 — Header Redesigns

### User problem
Headers with oversized logos, missing or hidden search, or inaccurate cart counts impair user experience, reduce findability, and erode trust.

### Recommended approach
**Logo:** Slim and proportionate. The logo should establish brand identity without dominating the header. A header height of 60–80px is the standard range.

**Search:** Must be **immediately visible on mobile** — not hidden behind a hamburger menu. Use a search icon in the header that expands inline or opens an overlay. Users who use search convert at higher rates.

**Cart icon:** Must show an **accurate badge count** at all times. The count must update dynamically via JavaScript when items are added (AJAX cart update). An inaccurate count (showing 0 when items exist) destroys trust.

**On mobile:** Logo must scale to fit alongside the hamburger icon and cart icon without overlapping. A wordmark logo should switch to an icon-only version on mobile if the full wordmark is too wide.

**Visual separation:** A subtle border-bottom or box-shadow on the header clearly separates it from the page content. Without this, the header can visually merge with the hero.

**Sticky header consideration:** Sticky (fixed-position) headers keep navigation accessible on long pages. If implementing sticky, reduce header height on scroll to minimise viewport real estate loss.
