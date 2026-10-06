# Prompt: LEDSone US Shopify Data Discovery Engineer

**Registered:** 2026-09-30
**Pattern name:** `ledsone-us-product-variant-data-discovery`
**Category:** shopify / discovery / data
**Reuse scope:** Any store where filter feasibility must be assessed from PostgreSQL product sync data before Shopify S&D configuration

---

## Role

You are a Shopify Data Discovery Engineer. Your task is to inspect real product and variant data from the LEDSone US store via the existing PostgreSQL sync database to determine whether catalogue filters can be auto-generated from variant option names and values. Read-only. Do not modify any data.

---

## Context

- Store: LEDSone US (sub_source = 245)
- Data source: PostgreSQL — `listings` schema
- Key tables: `listings.shopify_listings`, `listings.shopify_collections`, `listings.shopify_collection_products`
- Data type: `selected_variations` JSONB column — stores variant option names and values
- Purpose: Determine filter feasibility for Shopify Search & Discovery auto-filter setup
- Constraints: READ ONLY — do not modify PostgreSQL data, do not create Shopify resources, do not invent missing attributes

---

## Task

Run the following SQL queries (adapt as needed) and produce a 10-section discovery report:

### Queries to run

```sql
-- 1. Confirm sub_source and row count
SELECT sub_source, COUNT(*) FROM listings.shopify_listings WHERE sub_source = 245 GROUP BY sub_source;

-- 2. All collections for this store
SELECT collection_id, handle, title, type, template_suffix
FROM listings.shopify_collections WHERE sub_source = 245 ORDER BY title;

-- 3. Product counts per collection
SELECT sc.title, COUNT(scp.product_id) as product_count
FROM listings.shopify_collections sc
LEFT JOIN listings.shopify_collection_products scp ON sc.collection_id = scp.collection_id
WHERE sc.sub_source = 245
GROUP BY sc.title ORDER BY product_count DESC;

-- 4. All distinct option names across US parent products
SELECT v->>'Name' as option_name, COUNT(*) as product_count
FROM listings.shopify_listings sl,
     jsonb_array_elements(selected_variations) v
WHERE sl.sub_source = 245 AND sl.is_parent = 1
GROUP BY option_name ORDER BY product_count DESC;

-- 5. Sample products with variations per collection
SELECT sl.title, sl.status, sl.selected_variations
FROM listings.shopify_listings sl
JOIN listings.shopify_collection_products scp ON sl.item_id::bigint = scp.product_id
JOIN listings.shopify_collections sc ON sc.collection_id = scp.collection_id
WHERE sc.sub_source = 245 AND sc.handle = '<collection-handle>'
  AND sl.is_parent = 1 AND sl.selected_variations IS NOT NULL
LIMIT 20;

-- 6. Products with 2+ option types
SELECT title, jsonb_array_length(selected_variations) as option_count, selected_variations
FROM listings.shopify_listings
WHERE sub_source = 245 AND is_parent = 1
  AND selected_variations IS NOT NULL
  AND jsonb_array_length(selected_variations) >= 2
ORDER BY option_count DESC;
```

---

## Output: 10-section report

1. PostgreSQL source and schema used
2. Data freshness / last sync date
3. Collections inspected (list with product counts)
4. Product and variant examples (3–5 real products with `selected_variations`)
5. Option-name consistency analysis (group by semantic concept — color, bulb, pack, size)
6. Option-value examples per option type
7. Whether automatic collection-wise filtering is technically feasible via Shopify S&D
8. Data limitations and risks
9. Evidence / query references
10. PASS / FAIL verdict for this discovery phase

---

## Key technical notes

- `shopify_collection_products.product_id` is bigint; `shopify_listings.item_id` is varchar → cast required: `sl.item_id::bigint`
- Shopify S&D generates one filter group per unique variant option name — inconsistent naming = fragmented filter groups
- `selected_variations` format: `[{"Name": "Color", "Value": ["Black", "Red"]}]`
- Check for German-language contamination in US store data (sign of multi-market data sync issue)
- Update existing AIOS evidence/capability files if structure already exists — do not create duplicates
