---
name: dm-campaign-single-product-notag-unknown-investigation
description: Read-only investigation prompt for a specific DM Campaign product showing Owner=No Tag and Stock=Unknown. Traces product_item_id through owner tag mapping and inventory lookup.
metadata:
  type: prompt
  category: discovery
  project: dm-dashboard
---

# Prompt: DM Campaign Single-Product Owner=No Tag + Stock=Unknown Investigation

## Context

In the DM Campaign Products tab, a specific product shows Owner = No Tag and Stock Status = Unknown. This requires a read-only trace through the backend classification logic and live database to identify root causes.

## Task

Investigate why a specific DM Campaign product shows Owner = No Tag and Stock Status = Unknown.

## Inputs Required

- `product_item_id` from Google Ads (format: `shopify_gb_<product_id>_<variant_id>`)
- Raw Shopify tags as displayed in the modal
- Displayed UK Stock value

## Investigation Steps

### Owner

1. Parse `product_item_id` to extract `shopify_pid` (field 3) and `variant_id` (field 4).
2. Query `listings.shopify_listings` for the variant (`item_id = variant_id`) to confirm SKU.
3. Query `listings.shopify_listings` for the parent (`item_id = shopify_pid, sub_source=104, is_parent=1`) to confirm `has_listing`.
4. Query `listings.shopify_listing_tag` for all active tags (`product_id = parent.id, sub_source=104, is_deleted=0 or NULL`).
5. Apply `strip().lower()` normalisation and check exact set membership against `SONYA_TAGS` and `SAJEEPAN_TAGS` in `dm_campaign.py`.
6. Do NOT infer tag ownership from prefix. Only exact set membership counts.
7. Report `has_sonya`, `has_sajeepan`, and resulting classification.

### Stock

1. Parse `variant_id` from `product_item_id`.
2. Query `listings.shopify_listings WHERE item_id = variant_id` → get `sku`.
3. Query `inventory.products WHERE sku = <sku>` → get `id`, `inventory_bool`.
4. Query `inventory.local_inventory_current_stock_location_wise WHERE inventory_id = <id> AND warehouse_location = 'UK'` → get raw `stock`.
5. Trace `_classify_stock(uk_stock, inventory_bool, product_matched)` step by step.
6. Report which guard fires first and why `Unknown` is returned.
7. Check frontend `ukStock` display: `product.ukStock != null ? product.ukStock : 'Unavailable'`. Report whether `0` shown means real stock=0 or None→0 conversion.

## Constraints

- Read-only: no code edits, no tag changes, no inventory changes, no commits.
- Do not infer `SJNEW26` = Sajeepan from SJ prefix — requires authoritative documentation.
- Distinguish verified live DB data from code-based inference in the final report.

## Expected Output

- Exact root cause for Owner classification result
- Exact root cause for Stock classification result
- Whether UI display of 0 is real stock or a conversion artifact
- Minimal proposed fixes (do not implement)
- AIOS evidence and validation files updated
