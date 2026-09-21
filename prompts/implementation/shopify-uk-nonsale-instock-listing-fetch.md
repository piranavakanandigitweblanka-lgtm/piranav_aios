# Prompt: Ledsone UK — Never-Sold In-Stock Active Lighting Products (Product Level)

**Registered:** 2026-09-21 (v3 — product-level, lighting filter, sorted)
**Type:** Shopify Admin API — order history cross-filter + product-level aggregation
**Reusable by:** Any session needing never-sold, in-stock, active lighting product lists from Ledsone UK

---

## Task

Using `shopify_client.graphql(store="ledsone_uk", ...)`, fetch active Ledsone UK products where:

1. **Product level** — ALL variants on the product have zero lifetime net units sold
2. Product status = ACTIVE
3. At least one variant in stock (inventoryQuantity > 0)
4. **Lighting only** — exclude non-lighting categories (sandpaper, cabinet handles, junction boxes, and similar non-lighting products). Use productType and title keyword matching.
5. SKU rules (applied per variant, skip product if any variant violates):
   - Exclude SKUs containing `+` UNLESS `+RPM` is in the SKU
   - Exclude SKUs containing `ENC`

## Output

Per product:
- `product_title`
- `product_type`
- `total_stock` (sum of all variant inventoryQuantity)
- `skus` (comma-separated list of all variant SKUs)

Sorted by `total_stock` descending.

Also report: total active products checked vs total returned.

## Technical Steps

1. Paginate ALL orders → collect set of sold SKUs (all time)
2. Paginate ALL active products → for each product:
   - Collect all variant SKUs + inventory
   - Skip if any variant SKU is in sold_skus
   - Skip if product_type or title matches non-lighting keywords
   - Skip if any variant SKU contains ENC
   - Skip if any variant SKU contains + (unless +RPM)
3. Aggregate total stock per product
4. Sort descending by total_stock
5. Save to CSV

## Non-lighting exclusion keywords (title/type)
sandpaper, cabinet, handle, junction, box, connector (non-electrical), furniture, hook, screw, bracket (generic hardware)
Note: ceiling rose bracket IS lighting — do not exclude.
