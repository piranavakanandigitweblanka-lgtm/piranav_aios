# Checklist — Theme Customization

**Status:** DRAFT
**Sheet:** Theme Customization (BGCT workbook, Sheet 4)
**Tasks covered:** TC-1 through TC-6
**Owner:** Piranav | **Reviewer:** Sajeesan | **Queryability Reviewer:** Tamil Selvan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## TC-1 — Liquid Template Edits

| # | Check | Tool | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 1.1 | Draft theme exists before any edit | Shopify Admin → Themes | Check theme list for a duplicate named with today's date | Duplicate/backup theme exists | Editing live theme directly | Critical | Screenshot of themes list |
| 1.2 | No `{% include %}` calls in edited files | Edit Code → search | Search for `include` in recently edited Liquid files | No `{% include %}` found | Any `{% include %}` in theme files | High | Code screenshot |
| 1.3 | No inline `style="..."` attributes in Liquid | Edit Code / DevTools | Open edited Liquid file — search for `style="` | No inline styles | Inline styles found | High | Code screenshot |
| 1.4 | Logic grouped at top of template | Manual code review | Read the first 20 lines of any edited template | Variables assigned at top; HTML below | Liquid conditionals interleaved with HTML | Medium | Code screenshot |
| 1.5 | Sajeesan has reviewed all Liquid changes | Sign-off record | Check review log or approval message | Written approval from Sajeesan | No review documented | Critical | Approval evidence |

---

## TC-2 — Custom Sections

| # | Check | Tool | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 2.1 | Section appears in Customizer "Add section" panel | Shopify Customizer | Open Theme Customizer → click "Add section" → search for the section name | Section is listed | Section not shown | High | Screenshot |
| 2.2 | Section content is editable without code | Shopify Customizer | Click on the custom section → attempt to change text, image, and link | All fields editable in panel | Any field requires code change | Critical | Screenshot of settings panel |
| 2.3 | Padding/margin settings exposed | Shopify Customizer | In section settings panel, look for Spacing or Padding settings | Padding controls visible | No padding settings | Medium | Screenshot |
| 2.4 | No hardcoded copy in Liquid file | Edit Code | Open the section Liquid file → check for any literal content strings not drawn from schema settings | All content from `section.settings.*` | Any hardcoded copy | High | Code screenshot |
| 2.5 | Schema has at least one preset defined | Edit Code | Open section `{% schema %}` → find `"presets"` key | Presets array contains at least one entry | No presets | High | Code screenshot |

---

## TC-3 — Custom Blocks

| # | Check | Tool | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 3.1 | `{{ block.shopify_attributes }}` present in block wrapper | Edit Code | Open section Liquid file → find block loop → check block wrapper div | `{{ block.shopify_attributes }}` present on wrapper element | Missing | Critical | Code screenshot |
| 3.2 | `max_blocks` is defined in schema | Edit Code | Open `{% schema %}` block → find `"max_blocks"` key | A numeric limit is set | No max_blocks defined | High | Code screenshot |
| 3.3 | Zero-blocks empty state exists | Shopify Customizer | Remove all blocks from the section in Customizer | Placeholder message shown (not a broken empty layout) | Broken layout or invisible | High | Screenshot |
| 3.4 | App block type available if needed | Edit Code | Check schema `"blocks"` array | Includes `"type": "@app"` if app integrations are expected | Missing when app blocks needed | Medium | Code screenshot |
| 3.5 | Blocks are editable in Customizer | Shopify Customizer | Add a block → click it in the Customizer panel | Block settings appear in side panel | Block not selectable | Critical | Screenshot |

---

## TC-4 — Navigation Menu Restructuring

| # | Check | Tool | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 4.1 | Top-level nav items ≤ 7 | Store preview + count | Count the main navigation items | 7 or fewer | More than 7 | High | Screenshot |
| 4.2 | Bestselling category in positions 1–3 | Store preview | Identify the top-revenue category from analytics → check its nav position | Position 1, 2, or 3 | Position 4 or deeper | High | Screenshot |
| 4.3 | Mobile nav uses accordions (not hover dropdowns) | Chrome DevTools 375px | Enable mobile emulation → click hamburger → tap a top-level item with a dropdown | Nested accordion opens on tap | Nothing happens on tap (hover-only) | Critical | Screenshot / video |
| 4.4 | No navigation link to dead/empty category | Store click-through | Click every top-level nav item and its dropdowns | Every link resolves to a page with products | 404 or empty collection | High | Test log |
| 4.5 | SEO team notified of high-traffic page changes | Communication record | Check if any renamed or removed items had significant organic traffic | Evidence of SEO review | No SEO review for high-traffic items | High | Email/message record |

---

## TC-5 — Footer Redesigns

| # | Check | Tool | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 5.1 | Privacy Policy link present in footer | Store browser | Scroll to footer — look for "Privacy Policy" | Link visible and functional | Missing | Critical | Screenshot |
| 5.2 | Terms of Service link present in footer | Store browser | Scroll to footer — look for "Terms of Service" | Link visible and functional | Missing | Critical | Screenshot |
| 5.3 | Refund Policy link present in footer | Store browser | Scroll to footer — look for "Refund Policy" | Link visible and functional | Missing | Critical | Screenshot |
| 5.4 | Newsletter form has compelling copy | Store browser | Read the newsletter section headline and button label | Value proposition clearly stated | "Subscribe" only, no incentive | Medium | Screenshot |
| 5.5 | Footer columns match four-column structure | Store browser (desktop) | Check footer layout at 1440px | Four columns visible: Shop / Support / About / Newsletter | Missing columns or wrong structure | Medium | Screenshot |
| 5.6 | No full duplicate of main nav in footer | Manual review | Compare footer shop links to main nav | Footer has key links only — not all nav items | Footer duplicates entire main nav | Medium | Screenshot |
| 5.7 | Social icons link to active profiles only | Click-through test | Click each social icon → verify active profile | All linked profiles have recent activity | Link leads to inactive/empty profile | Medium | Test log |

---

## TC-6 — Header Redesigns

| # | Check | Tool | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 6.1 | Header height ≤ 80px on desktop | Chrome DevTools | Inspect header element → check rendered height | ≤ 80px | Over 80px | Medium | DevTools screenshot |
| 6.2 | Search icon visible in header on mobile | Chrome DevTools 375px | View header at 375px | Search icon/input visible in header | Search only in hamburger menu | High | Screenshot |
| 6.3 | Cart badge count shows correctly | Store browser | Add an item to cart → check header cart icon | Badge count updates immediately | Badge shows 0 or wrong number | Critical | Screenshot |
| 6.4 | Logo does not overlap navigation icons on mobile | Chrome DevTools 375px | Inspect header at 375px — check logo, hamburger, and cart positions | No overlap between elements | Elements overlap or one is cut off | High | Screenshot |
| 6.5 | Header has visible border/shadow separating from content | Store browser | View a page with a white/light hero — check if header is visually separated | Clear visual boundary between header and page content | Header visually merges with content | Medium | Screenshot |
| 6.6 | Sticky header reduces height on scroll | Store browser | Scroll down the page — if sticky header is implemented, watch its height | Header becomes slimmer after 100px scroll | Header height unchanged on scroll (wastes viewport) | Low | Screenshot |
| 6.7 | Full test on 375px and 1440px viewports | Chrome DevTools | Test at both breakpoints | No layout issues at either viewport | Layout broken at one breakpoint | High | Screenshots both |
