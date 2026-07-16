# Capability Extraction — Theekshy Req4
**Date:** 2026-07-16 | **Domain:** Stock Monitoring + Google Ads Integration

---

## Reusable Patterns

### 1. Inventory Join Chain (PostgreSQL — read-only)

```sql
-- Authoritative sellable stock for Shopify product variants in Google Ads campaigns
SELECT
  p.product_item_id,
  sl.sku,
  SUM(l.quantity) AS inv_stock
FROM google_ads.product_performance p
LEFT JOIN listings.shopify_listings sl
  ON sl.item_id = p.product_item_id
  AND sl.site = 'UK'
  AND sl.channel = 'LEDSone'
LEFT JOIN inventory.products ip ON ip.sku = sl.sku
LEFT JOIN inventory.local_inventory_current_stock_location_wise l
  ON l.inventory_id = ip.id
WHERE p.campaign_id IN ('23714290257','23684837882')
  AND p.date BETWEEN '2026-06-15' AND '2026-07-14'
GROUP BY p.product_item_id, sl.sku
ORDER BY SUM(p.cost) DESC
```

**Key facts:**
- SUM across all warehouse locations = authoritative sellable stock
- Parent-level Shopify item_ids return null SKU → classify as Unknown, never zero
- Column is `cost` (numeric), NOT `cost_micros` in google_ads.product_performance

---

### 2. Stock Status Classification (JS)

```js
function r4StockStatus(inv){
  if(inv===null)return'Unknown';       // null = join failed — NEVER treat as zero
  if(inv===0)return'Out of Stock';
  if(inv>=1&&inv<=10)return'Going to Finish';
  return'In Stock';
  // Coming Soon: checked separately — requires verified date in DB
}
```

Priority: Coming Soon > Out of Stock > Going to Finish > In Stock > Unknown

---

### 3. GMC Comparison Logic (JS)

```js
function r4GmcComp(status, gmc_avail){
  if(!gmc_avail)return'GMC Data Unavailable';  // missing record ≠ mismatch
  if(status==='Unknown')return'Data Review Required';
  var gmcIn = gmc_avail==='in stock';
  if(status==='Out of Stock' && gmcIn)return'Critical Mismatch';
  if((status==='In Stock'||status==='Going to Finish') && !gmcIn)return'Warning Mismatch';
  return'GMC Match';
}
```

---

### 4. Recommended Action Strings (aligned to CSV spec)

```js
// Going to Finish
'Send Restock Alert; Consider Budget Trim; Do Not Pause Yet'

// Out of Stock
'Pause Ads Immediately; Set GMC to Out of Stock; Exclude from PMax Listing Group'

// Coming Soon
'Set GMC to Preorder; Prepare Asset Group + PDP; Hold Spend Until Launch'

// In Stock
'Keep Ads Running'  // or 'GMC Update Required' if mismatch
```

---

### 5. Snapshot Dashboard Pattern

- No live DB connection — R4_DATA array populated from verified SQL at build time
- Data freshness panel shows: latest source data date + page-load generated-at timestamp
- localStorage for user action decisions (no DB writes, key: `r4_decisions_{owner}`)
- Manual refresh: update R4_DATA array from fresh SQL query, save file

---

### 6. AIOS Schema Notes (google_ads)

| Table | Column Note |
|---|---|
| `google_ads.product_performance` | `cost` is numeric (not `cost_micros`) |
| `google_ads.merchant_products` | filter `country = 'GB'` for UK GMC records |
| `listings.shopify_listings` | filter `site='UK'`, `channel='LEDSone'` for correct join |
| `inventory.local_inventory_current_stock_location_wise` | SUM all rows per inventory_id for total stock |
