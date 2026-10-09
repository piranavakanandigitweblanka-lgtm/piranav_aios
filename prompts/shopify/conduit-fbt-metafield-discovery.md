# Prompt — Conduit FBT Metafield Discovery

**Category:** shopify / discovery
**Date:** 2026-10-09
**Pattern name:** `conduit-fbt-metafield-discovery`
**Status:** ACTIVE

---

## Reusable Prompt

```
TASK: Frequently Bought Together — Metafield Discovery

Inspect the existing Frequently Bought Together implementation on a Shopify theme and design the minimal change required to support manually selected product recommendations via a product metafield.

## Context to provide
- Theme directory path
- Existing snippet name (e.g. frequently-bought.liquid)
- Metafield namespace and key (e.g. custom.related_products)
- Metafield type (e.g. List of products)
- Product template(s) that render the snippet

## What to discover

1. Trace the full render chain: which product template → which section → which snippet.
2. Identify the section setting that enables/disables the FBT block (e.g. bought_together checkbox).
3. Read the snippet in full. Document:
   - The collection-to-collection mapping rules (which collections map to which)
   - How matched_collection and matched_collections_array are set
   - How the single-collection vs two-collection render paths differ
   - How pagination (data-page) works and where it is set
   - The full card layout: image, product name, variant selector, price, add-to-cart button
   - The JavaScript: auto-slide (localStorage), variant change handler, AJAX add-to-cart, cart update
4. Document any other FBT or bought-together snippets (e.g. product-bought-together.liquid and its metafield: bls.bought_together).
5. Check whether the target metafield (e.g. custom.related_products) is referenced anywhere in the theme.
6. Confirm metafield type (List of products) — note what .value returns in Liquid (an array of product objects).

## Implementation design to produce

1. A minimal Liquid change to the snippet: read metafield first; fall back to existing collection rules if metafield is blank.
2. A product loop that reuses the existing card layout exactly (image, title, variant selector, price, button).
3. Pagination logic adapted for a flat product list (no col1/col2 split).
4. Fallback strategy recommendation: keep or remove collection rules per product category.
5. Risk: metafield populated on 0 products initially — FBT will use collection fallback silently.
6. Risk: `bls.bought_together` is a different metafield — do not confuse.

## Output format
1. Existing files and code paths
2. Current recommendation-selection logic (annotated)
3. Metafield access and population findings
4. Proposed minimal file changes (diff-style description, no actual code edit)
5. Risks and compatibility considerations
6. Product-by-product implementation and validation checklist
7. Clear recommendation for next approved implementation step
```

---

## Usage notes

- Discovery only. No file edits until Piranav approves the implementation plan.
- The existing card HTML/CSS/JS must not change — only the product-selection logic at the top of the snippet changes.
- `bls.bought_together` (theme app extension) and `custom.related_products` are different metafields. Do not conflate.
- Check whether the metafield is populated before designing validation steps.
