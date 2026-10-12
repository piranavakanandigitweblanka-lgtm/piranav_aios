# Capability: Shopify Parent Product ID Lookup via ledsone-db-mcp

**Date Confirmed:** 2026-10-12  
**Confirmed By:** Piranav (live query session)  
**Reusable:** YES

---

## What It Does

Queries `ledsone-db-mcp` to retrieve the correct Shopify **parent product ID** for any batch of SKUs, filtered to ledsone.co.uk listings only.

---

## Where It Lives

| Component | Location |
|---|---|
| MCP Tool | `ledsone-db-mcp` → `execute_sql_ledsone` |
| Key Table | `listings.shopify_listings` |
| Mapping Table | `listings.shopify_listings_parent_child_mapping` |
| Prompt | `prompts/shopify/ledsone-uk-shopify-parent-id-lookup-via-db.md` |

---

## How to Reuse

1. Load `ledsone-db-mcp` tool via ToolSearch
2. Use query pattern from prompt file above
3. Filter: `listing_url LIKE '%ledsone.co.uk%'` + `status = 'active'`
4. Join via `shopify_listings_parent_child_mapping` to get parent `item_id`
5. Export result as CSV

---

## Key Facts Learned

- `item_id` on child rows = Shopify **variant** ID (not product ID)
- Parent row `item_id` = Shopify **product** ID
- `site` column = `UK`/`France` etc., NOT store domain — do not use for store filtering
- `is_parent` is `smallint` — use `= 1` not `= true`
- DB stores listings for multiple stores in same table — always filter by `listing_url`
