# Prompt: GA-08 Bulb Collection Tag Audit

**Category:** discovery  
**Saved:** 2026-10-07  
**Used in:** GA-08 Step 1 Discovery  

---

## Context

LEDSone.co.uk uses Shopify Smart collections (tag-driven). Bulb collections should contain only their matching bulb type. This prompt audits 5 collections for incorrectly included products and missing products.

---

## Prompt

You are auditing Shopify bulb collections for LEDSone.co.uk (sub_source 104).

Use `ledsone-db-mcp` (PostgreSQL, read-only). Key tables:
- `listings.shopify_collections` — collection metadata; `collection_id` = Shopify item_id
- `listings.shopify_collection_products` — join on `collection_id`
- `listings.shopify_listings` — join on `item_id = product_id::varchar`; filter `is_parent=1`, `sub_source=104`
- `listings.shopify_listing_tag` — join on `product_id = sl.id` (internal int); always `TRIM()` tag values
- `inventory.physical_product_stock` — via `shopify_listings_parent_child_mapping` → `inventory.products` → `physical_product_stock`

**For each collection to audit:**
1. Get the Shopify `collection_id` from `shopify_collections`
2. List all products in the collection with: title, product_type, status, all tags
3. Identify products that do NOT belong (wrong type, wrong base, fittings not bulbs)
4. Identify products that SHOULD be there but are missing (by tag or title pattern)
5. For specific product IDs, look them up by title suffix (e.g. `title LIKE '%~6941'`)
6. Check collection membership of specific products via `shopify_collection_products`

**For each affected product, report:**
- Internal ID, item_id, title
- Current collection(s)
- Relevant tags (base type, bulb type)
- Product type
- Status: correct / incorrect / missing
- Recommended action: ADD / REMOVE / NO CHANGE / REVIEW
- Reason

**Important:** All collections are Smart (tag-driven). Changes require tag additions or removals on the product, not manual collection edits. Identify which tag controls inclusion before recommending action.

**Do not modify any Shopify data. This is read-only discovery.**
