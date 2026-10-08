# Capability — Shopify Collection Tag Audit Method

## Date First Identified
2026-10-07

## Last Updated
2026-10-07

## Status
PARTIAL — Discovery complete (Steps 1–5). Implementation partially executed (low-wattage-bulbs rule changed). Remaining collections (dimmable, E14, E27) open pending Piranav/Thuwaraga confirmation.

## Purpose
A structured read-only audit method for verifying whether Shopify Smart Collection rules and product tags correctly reflect business intent. Applicable when a Smart Collection is suspected to contain the wrong products, or when product tags need to be added/removed at scale.

## Business Problem Solved
Shopify Smart Collections use rules (tag-based, product-type-based, etc.) to automatically populate products. Over time these rules can be misconfigured or remain from a development/migration phase. Without a structured audit method, identifying incorrect products and planning tag corrections requires manual Shopify admin browsing — slow, incomplete, and not queryable. This method uses PostgreSQL (the Shopify DB mirror) for fast, evidence-backed analysis.

## When To Use
- Investigating why a Smart Collection contains unexpected products
- Preparing a bulk tag correction plan across multiple collections
- Before-and-after evidence is needed for any tag change

## When NOT To Use
- Manual Collections (products are manually added — different audit method)
- When the Shopify DB mirror is not available or out of sync (check `shopify_collections` table first)

## Required Inputs
- Collection handles (e.g. `low-wattage-bulbs`, `incandescent-bulbs`)
- Access to PostgreSQL via `ledsone-db-mcp` (read-only)
- `sub_source` value for the target store (LEDSone UK = 104)
- Confirmed tag vocabulary (WATT4W, WATT40W, etc.) from existing products

## Source Task / Requirement
GA-08 — Bulb Collection Tag Fixes
LEDSone UK, 2026-10-07

## Execution Steps

### Step 1 — Confirm collections exist in the DB mirror
```sql
SELECT id, collection_id, handle, title, type
FROM listings.shopify_collections
WHERE handle IN ('collection-handle-1', 'collection-handle-2', ...)
  AND sub_source = [SUB_SOURCE];
```
Record `collection_id` for each confirmed collection.

### Step 2 — Audit current collection membership
For each collection, list all products currently in it with their tags:
```sql
SELECT sl.id, sl.item_id, sl.title, sl.product_type, sl.status,
       STRING_AGG(TRIM(slt.tag), ', ') AS tags
FROM listings.shopify_collection_products cp
JOIN listings.shopify_listings sl
  ON sl.item_id = cp.product_id::varchar AND sl.sub_source = [SUB_SOURCE] AND sl.is_parent = 1
LEFT JOIN listings.shopify_listing_tag slt ON slt.product_id = sl.id
WHERE cp.collection_id = '[COLLECTION_ID]'
GROUP BY sl.id, sl.item_id, sl.title, sl.product_type, sl.status
ORDER BY sl.title;
```
Flag any products that do not match the intended collection type.

### Step 3 — Find products that SHOULD be in the collection but are not
Query all active products with the relevant tag that are NOT in the collection:
```sql
SELECT sl.id, sl.item_id, sl.title, sl.product_type,
       STRING_AGG(TRIM(slt.tag), ', ') AS tags
FROM listings.shopify_listings sl
JOIN listings.shopify_listing_tag slt ON slt.product_id = sl.id
  AND TRIM(slt.tag) = '[TARGET_TAG]'
WHERE sl.sub_source = [SUB_SOURCE] AND sl.is_parent = 1
  AND sl.id NOT IN (
    SELECT sl2.id FROM listings.shopify_collection_products cp2
    JOIN listings.shopify_listings sl2
      ON sl2.item_id = cp2.product_id::varchar AND sl2.sub_source = [SUB_SOURCE]
    WHERE cp2.collection_id = '[COLLECTION_ID]'
  )
GROUP BY sl.id, sl.item_id, sl.title, sl.product_type;
```

### Step 4 — Stock verification (optional, for inventory-gated collections)
For collections that only show in-stock products, verify stock at the correct warehouse:
```sql
SELECT p.sku, COALESCE(uk.stock, 0) AS uk_stock
FROM inventory.products p
LEFT JOIN inventory.local_inventory_current_stock_location_wise uk
  ON uk.inventory_id = p.id AND uk.warehouse_location = 'UK'
WHERE p.sku IN ([LIST_OF_SKUS]);
```

### Step 5 — Before screenshot
Take a Shopify admin screenshot of the collection (product count + rule) before any change.

### Step 6 — Document planned changes
Create a table: Products to ADD tag / Products to REMOVE tag / Smart Collection rule to change.

### Step 7 — After screenshot
After implementation, take a screenshot confirming the collection now shows the correct products.

## Evidence Required
- SQL query outputs confirming incorrect products found
- Before screenshot of Smart Collection (product count + rule)
- After screenshot showing corrected membership

## Evidence Path
`organic-discovery/06_GA-08_bulb_collection_tags/evidence/` — GA-08_step1_discovery, GA-08_low-wattage-threshold-discovery, GA-08_incandescent-bulbs-discovery, GA-08_incandescent-stock-verification

## Pass / Fail Rule
PASS: Discovery — SQL outputs confirm the product mismatch and quantify it. Implementation — after screenshot matches expected product count and type.
FAIL: Collection still contains wrong products after tag correction, OR mismatch count cannot be confirmed from the DB mirror.

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator + Thuwaraga (for product definition confirmation)

## Known Limits
- Smart Collection rules are not directly visible in the DB mirror — the rule must be read from Shopify Admin (not queryable via PostgreSQL)
- `shopify_collection_products` reflects the mirror state at last sync — for recent changes, verify with a live Shopify Admin check
- Tag corrections require Shopify Admin access or Shopify API — they cannot be applied via PostgreSQL
- Product definition ambiguities (e.g. what qualifies as "Low Wattage Bulb") must be confirmed with the product team before applying tags

## Reuse Path
This method works for any Shopify store with a PostgreSQL DB mirror (`listings.shopify_collections`, `listings.shopify_collection_products`, `listings.shopify_listing_tag`). Adjust `sub_source` and table names to match the target store's schema.

## Related Capabilities
- `shopify-collection-card-stock-price-fix-2026-10-07.md` — related collection-level fix work

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-10-07 | Initial capability captured from GA-08 Step 1–5 discovery | `organic-discovery/06_GA-08_bulb_collection_tags/evidence/GA-08_step1_discovery_2026-10-07.md` |
