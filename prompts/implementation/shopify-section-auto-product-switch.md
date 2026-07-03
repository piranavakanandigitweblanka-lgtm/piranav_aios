# Prompt — Shopify Section: Auto Product Switch (Just For You)

**Category:** implementation
**Pattern name:** `shopify-section-auto-product-switch`
**First used:** 2026-07-03
**Task it solved:** ELEC-JFY-AUTO-001

---

## When to use this prompt
When a Shopify section displays a static product grid and you need to rotate visible products automatically every N seconds without changing the card design, cart logic, or collection source.

Reusable for: any Shopify 2.0 section that renders a product grid from a collection.

---

## Full Prompt (as given 2026-07-03)

```
Add an auto product switch feature to the Electricalsone Shopify "Just For You" product section so visible products rotate every 1 minute.

Context:
The current section displays a static product grid from a selected Shopify collection. The business goal is to keep the homepage/product section dynamic and help users discover more products without manual refresh.

Scope:
Allowed:
- Inspect the existing Shopify section that contains "Just For You"
- Modify only this section file if needed
- Add safe JavaScript to rotate visible product cards every 60 seconds
- Add schema settings if useful:
  - enable_auto_switch
  - switch_interval_seconds
  - visible_products_count
- Save documentation/evidence inside piranav_aios

Not allowed:
- Do not change cart, checkout, price, variant, product form, or collection logic
- Do not create duplicate section if existing section can be extended
- Do not affect other Shopify sections
- Do not push to GitHub without permission

Before implementation:
1. Find the existing section file containing `jfy-section`, `jfy-grid`, or "Just For You".
2. Check if any carousel/slider/auto-rotation logic already exists.
3. Report duplicate risk before editing.

Implementation requirement:
- Keep current product card design.
- Load products from the selected collection as now.
- Show only a fixed number of products at a time if setting is enabled.
- Every 60 seconds, switch to the next group of products.
- Loop back to the first group after the last group.
- Pause or keep stable if products are fewer than visible count.
- Add accessible behavior: do not disturb Add to Cart button.
- Add fallback: if JavaScript fails, normal product grid still shows.

Evidence required:
- File path modified
- Summary of exact changes
- Screenshot/screen recording path
- Browser test result
- Add to Cart test result
- AIOS evidence file path

Output format:
| Item | Result | Evidence Path | Risk | Next Step |

Pass/fail:
PASS if products auto-switch every 60 seconds, Add to Cart still works, no duplicate section is created, and evidence is saved.
FAIL if switch breaks product links/cart, creates duplicate truth, or no evidence is saved.

Stop conditions:
Stop and report if existing carousel logic already exists, file location is unclear, or implementation would require checkout/cart logic changes.
```

---

## What this prompt produced

| Output | Value |
|---|---|
| File modified | `shopify_projects/electricalsone-theme/sections/just-for-you.liquid` |
| Schema settings added | `enable_auto_switch`, `switch_interval_seconds`, `visible_products_count` |
| JS approach | `data-*` attributes on section → scoped `setInterval` rotation, `display:none` toggling, fade-in CSS |
| Fallback | All cards visible if JS disabled (no server-side change) |
| Cart logic | Not touched |
| Evidence file | `evidence/shopify/just-for-you-auto-switch/evidence-2026-07-03.md` |

## Reuse notes
- Replace `jfy-section` / `jfy-card` / `jfy-` prefix with the target section's class prefix
- The `data-*` → JS pattern works for any Shopify 2.0 section
- Schema header block `"type": "header"` cleanly groups auto-switch settings in theme editor
- Always check for existing carousel/slider JS before applying (Rule 5 / Stop condition)
