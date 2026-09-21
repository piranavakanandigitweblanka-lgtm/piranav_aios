# Prompt: Ledsone UK — Dormant Lighting Products (Sold Before, Not in Last 6 Months)

**Registered:** 2026-09-21
**Type:** Shopify Admin API — order history cross-filter, dormant detection
**Reusable by:** Any session needing dead-stock / reactivation candidate lists from Ledsone UK

---

## Task

Fetch active Ledsone UK lighting products that:
1. Have sold at least once in their lifetime (appear in any order)
2. Have NOT sold in the last 6 months (no order line item since 2026-03-21)
3. Are currently active and in stock
4. Pass all SKU rules (no ENC, no + except +RPM)
5. Are lighting products (exclude non-lighting product types)

These are "dormant" products — dead stock / reactivation candidates.

## Logic

- `ever_sold_skus` = all SKUs from all-time orders
- `recent_sold_skus` = SKUs from orders created >= 6 months ago (2026-03-21)
- `dormant_skus` = ever_sold_skus - recent_sold_skus
- Product qualifies if: at least one variant in dormant_skus AND no variant in recent_sold_skus

## Output

Per product: product_title, product_type, skus, total_stock
Sorted by total_stock descending.
Report: total active products checked, dormant count found.

## Steps

1. Paginate ALL orders → collect ever_sold_skus
2. Paginate orders with filter `created_at:>2026-03-21` → collect recent_sold_skus
3. dormant_skus = ever_sold_skus - recent_sold_skus
4. Paginate active products → apply all filters
5. Sort + save CSV
