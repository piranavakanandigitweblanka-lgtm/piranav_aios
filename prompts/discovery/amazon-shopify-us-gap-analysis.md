# Prompt: Amazon vs Shopify US Gap Analysis

**Category:** discovery  
**Pattern Name:** `amazon-shopify-us-gap-analysis`  
**First Used:** 2026-11-27  
**Status:** ACTIVE

---

## Purpose

Identify all products active on Amazon (US + North America neighbour markets) that do not exist on a Shopify US store — to quantify the listing gap and produce a full export for action.

---

## Prompt Template

```
Using the ledsone DB (listings schema):

1. Confirm Amazon USA marketplace data — check amazon_marketplaces for site = 'US', list all amz_token_id values.
2. Identify North America neighbour markets (CA, MX, BR) sharing the same token group.
3. Pull Shopify US account detail: sub_source = [X], count active listings, price range, top product types, collections.
4. Pull Amazon US account detail: active/buyable/discoverable SKU count, price range, order revenue, CS metrics.
5. GAP QUERY: Count distinct SKUs on Amazon US (site='US', status IN ('Active','Buyable','Discoverable')) NOT matched by SKU in Shopify US (sub_source=[X]).
6. Extend gap to neighbour markets: repeat for site IN ('Canada','Mexico','Brazil'), show which SKUs are unique to each neighbour (not on Amazon US either).
7. Export full gap list: sku, title, price, product_type, amazon_markets, status, total_stock — ordered by product_type then price DESC.
8. Summarise by product_type: count, avg_price, total_stock.
```

---

## Key Technical Notes

- `listings.amazon_listings.site` uses country name strings: `'US'`, `'Canada'`, `'Mexico'`, `'Brazil'` (NOT marketplace IDs)
- `listings.shopify_listings.sub_source` is the Shopify account identifier — LEDSone US = **245**
- Match key between platforms: `sku` column (not `mapped_sku` — mapped_sku returned false zero in this session)
- Amazon status values in use: `Active`, `Buyable`, `Discoverable`, `Inactive`
- Shopify US `status = 'Active'` returns 0 SKUs — use sub_source filter only, or check status values before filtering
- North America Unified Account: US, Canada, Mexico share `amz_token_id`; Brazil is separate token

---

## Results — First Run (2026-11-27)

| Metric | Value |
|---|---|
| Amazon US active SKUs | 2,844 |
| Shopify US active SKUs (matched) | 481 |
| Amazon US → Shopify gap | **2,363** |
| Canada-only gap (not on Amazon US or Shopify US) | **984** |
| Mexico-only gap | **71** |
| **Total gap** | **3,438** |

Top gap categories: LIGHT_FIXTURE (1,502), LAMPSHADE (1,073), ELECTRONIC_WIRE (282)  
Total stock in gap: 146,783 units

---

## Output File

`reports/amazon-shopify-us-gap-full-export-2026-11-27.csv`
