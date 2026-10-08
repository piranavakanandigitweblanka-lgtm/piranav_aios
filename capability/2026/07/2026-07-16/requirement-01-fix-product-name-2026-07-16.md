# Capability Extraction — Theekshy Req1 Product Name Fix
**Date:** 2026-07-16 | **Domain:** Google Ads × Shopify Product Identity

---

## Key Finding: Google Ads item_id = Shopify variant ID

`google_ads.product_performance.product_item_id` is the Shopify variant ID. It matches `listings.shopify_listings.item_id` exactly (varchar, no prefix, no type mismatch).

Do NOT join via `google_ads.merchant_products.product_id` for product title lookup — only 3/60 products have GMC records in GB. Use `listings.shopify_listings` instead.

---

## Reusable: Parent Title Join

```sql
-- Get verified product title for any Google Ads product_item_id
SELECT
  child.item_id,
  child.sku,
  child.title AS variant_option,
  parent.title AS parent_title,
  child.listing_url,
  child.is_parent,
  child.is_child
FROM listings.shopify_listings child
LEFT JOIN listings.shopify_listings parent
  ON parent.shopify_handle = child.shopify_handle
  AND parent.is_parent = 1
  AND parent.site = 'UK'
  AND parent.channel = 'LEDSone'
WHERE child.site = 'UK'
  AND child.channel = 'LEDSone'
  AND child.item_id IN (:pids)
```

Result:
- `is_parent=1`: title field = full product title, no join needed
- `is_child=1` + parent found: use parent.title + child.title (variant) for display
- `is_child=1` + parent null: derive from listing_url handle (shopify handle maps to readable title)

---

## Reusable: URL Handle to Title (JS)

```js
function r1HandleToTitle(url){
  var m = url.match(/\/products\/([^/?#]+)/);
  if (!m) return null;
  var h = m[1];
  h = h.replace(/-\d{4,}$/, ''); // strip trailing internal ref e.g. -6040
  return h.split('-').map(function(w){ return w ? w[0].toUpperCase()+w.slice(1) : ''; }).join(' ');
}
```

This derives a readable title from any Shopify product URL without an extra DB query.

---

## Reusable: Product Name Cell Pattern (JS)

```js
function nameCell(title, sku, pid, url) {
  if (title) {
    var link = url ? '<a href="'+url+'" ...>'+title+'</a>' : title;
    return link + (sku ? '<br><span class="mono muted">'+sku+'</span>' : '');
  }
  if (sku) return sku + '<br><span class="muted">ID: '+pid+'</span>';
  return '<span class="muted italic">ID: '+pid+'</span>';
}
```

Priority: title (with URL link + SKU secondary) → SKU (with ID below) → ID only.

---

## Shopify Listings Notes

| Field | Note |
|---|---|
| `item_id` | Matches Google Ads product_item_id exactly |
| `title` | Parent products: full title. Child products: variant option only ("30cm", "Yes/No") |
| `shopify_handle` | Same for all variants of a product — use for parent join |
| `is_parent` / `is_child` | 1/0 flags; parent has full title, child has variant option |
| `listing_url` | Full Shopify URL — reliable source for handle extraction |
| Filter always: | `site='UK' AND channel='LEDSone'` |
