# Evidence — S1-PIR-02 Conduit Accessories: Filters + JSON-LD + Stock

**Date:** 2026-10-19  
**Task:** S1-PIR-02 Steps 3 (filters), 5 (CollectionPage JSON-LD), 6 (stock message)  
**Session type:** Implementation

---

## What Was Built

### Step 5 — CollectionPage JSON-LD (DONE)
- Added CollectionPage schema block to `shopify_projects/ledsone-uk-theme/sections/breadcrumb.liquid`
- Block fires automatically on every collection page (template contains 'collection')
- Outputs `@type: CollectionPage` with url, name, description, isPartOf (website), breadcrumb, and optional mainEntity (ItemList reference)
- Single edit covers conduit-accessories, conduit-lighting, and all other collections

### Step 6 — Stock Message (DONE — existing block used)
- Investigated via theme editor. The theme already has a built-in "Stock countdown" block in the product section.
- No new code was needed. Built-in block handles: "Only N left" when stock ≤ threshold, configurable via theme settings.
- File `snippets/stock-message.liquid` was created earlier but is redundant — should be deleted.

### Step 3 (Filters) — F4/F5/F6 added to collection-meta-filters.liquid (DONE)
- Added 3 new optional filter slots (Filter 4, 5, 6) to `sections/collection-meta-filters.liquid`
- Same pattern as existing F1/F2/F3: label + metafield setting in schema, Liquid parsing at top, card data attribute, button generation
- Filter 5 has additional `filter_5_option_name` setting — allows reading from a variant option instead of a product metafield

### Pack Filter Fix (F5 variant option mode)
- Root cause: `custom.package` is a product-level metafield. All variants of a product get the same value → selecting Pack=10 shows all variants.
- Fix: added `filter_5_option_name` schema field. When set, F5 reads from variant options per-variant (e.g. option name "Type", values "1 PACK", "2 PACK" etc.)
- Variant card renders `data-f5="{{ variant.options[f5_option_index] | downcase | strip }}"` — unique per variant
- Button values collected from product.options_with_values in option mode

### Metafields confirmed present
- `custom.size` — 16 products missing (Arudchelvi to fill manually)
- `custom.thread` — added manually in Shopify admin
- `custom.package` — added manually in Shopify admin (product-level, not used for F5 filter)

---

## Files Changed

| File | Change |
|---|---|
| `sections/breadcrumb.liquid` | Added CollectionPage JSON-LD block |
| `sections/collection-meta-filters.liquid` | Added F4/F5/F6 filter slots + F5 option mode + pack filter fix |
| `snippets/stock-message.liquid` | Created but redundant — to be deleted |

---

## Errors Fixed This Session

| Error | Cause | Fix |
|---|---|---|
| `setting default can't be blank` | Shopify rejects `"default": ""` on text settings | Removed all blank default values |
| Liquid syntax error line 529 | Shopify Liquid does not allow `and` + `or` mixed in one condition | Split into two nested `if` statements |
| Pack filter shows all packs | Variant option stored at product level via metafield | Switched to per-variant option reading |

---

## Upload Status

- `collection-meta-filters.liquid` — user confirmed uploaded to Shopify on 2026-10-19
- `breadcrumb.liquid` — uploaded to Shopify (CollectionPage JSON-LD active)
- Theme editor settings required: Filter 5 Label = `Pack`, Filter 5 Variant Option Name = `Type`, Filter 5 Metafield = blank

---

## Pending (Next Session)

- Delete `snippets/stock-message.liquid` (redundant)
- Create 7 sub-collections (Part A of Step 3)
- Add six-tile block (Part B of Step 3)
- Fill `custom.size` on 16 missing products (Arudchelvi)
- Fill `custom.thread` and `custom.package` on all 37 products
- Send screenshots to Muguntha for approval
- Commit all local changes to git
