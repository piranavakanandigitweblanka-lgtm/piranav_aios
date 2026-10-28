---
name: dm-campaign-single-product-notag-unknown-ENC10233-2026-10-28
description: Read-only root cause investigation for product shopify_gb_15388397830530_56874289561986 (SKU ENC10233) showing Owner=No Tag and Stock=Unknown in DM Campaign Products tab.
metadata:
  type: evidence
---

# Evidence: DM Campaign — Owner=No Tag + Stock=Unknown Root Cause (ENC10233)

**Date:** 2026-10-28
**Product Item ID:** `shopify_gb_15388397830530_56874289561986`
**SKU:** ENC10233
**Investigator:** Claude Code (read-only — no code or data changes made)
**Status:** COMPLETE — root causes confirmed

---

## Product Identity

| Field | Value |
|---|---|
| Google Ads product_item_id | `shopify_gb_15388397830530_56874289561986` |
| Shopify Parent Product ID | `15388397830530` |
| Shopify Variant ID | `56874289561986` |
| Resolved SKU | `ENC10233` |
| Title | 3 Light Glass Pendant Ceiling Light ~6922 |
| Variant | Default Title |

---

## Owner Investigation

### DB Evidence — Variant listing

```sql
SELECT id, item_id, sku, sub_source, is_parent FROM listings.shopify_listings
WHERE item_id = '56874289561986';
```
Result: `id=1018958, sku=ENC10233, sub_source=104, is_parent=0` — variant found, SKU confirmed.

### DB Evidence — Parent listing

```sql
SELECT id, item_id, sub_source, is_parent FROM listings.shopify_listings
WHERE item_id = '15388397830530' AND sub_source = 104 AND is_parent = 1;
```
Result: `id=1018957, sub_source=104, is_parent=1` — UK parent listing EXISTS → `has_listing = TRUE`

### DB Evidence — Active tags on parent (product_id=1018957)

```sql
SELECT id, tag, sub_source, is_deleted FROM listings.shopify_listing_tag
WHERE product_id = 1018957 AND sub_source = 104;
```

| id | tag (raw) | tag (strip+lower) | is_deleted |
|---|---|---|---|
| 176994 | `2026New` | `2026new` | 0 |
| 176995 | ` LMS` | `lms` | 0 |
| 176996 | ` Pendant Lights` | `pendant lights` | 0 |
| 178360 | ` SJNEW26` | `sjnew26` | 0 |

All 4 active. Matches screenshot exactly.

### Classification trace

Backend approved tag sets (`dm_campaign.py` lines 62–69):
```python
SONYA_TAGS    = {"agu", "agu46-2", "agu 46-2", "agu2026", "dracarys", "dracarys vermax", "sonyam&a"}
SAJEEPAN_TAGS = {"sj", "sjrat", "sj_c", "sjk", "sj_t_ads", "old sj na", "sajeepan", "sajjepan"}
```

Normalised product tags: `{"2026new", "lms", "pendant lights", "sjnew26"}`

- `"sjnew26"` ∩ `SONYA_TAGS` → **empty** — no Sonya tag
- `"sjnew26"` ∩ `SAJEEPAN_TAGS` → **empty** — `"sj"` is in the set but `"sjnew26" != "sj"` (exact membership, not prefix match)
- `"2026new"`, `"lms"`, `"pendant lights"` — category/campaign tags, not in either owner set

`has_sonya=False`, `has_sajeepan=False` → `_classify_owner()` falls through to `return "No Tag"` (line 355)

### Owner Root Cause

> **`SJNEW26` is not a registered owner tag. It is absent from both `SONYA_TAGS` and `SAJEEPAN_TAGS`. The backend correctly returns `No Tag`.**
>
> `SJNEW26` begins with `SJ` but the classification uses exact set membership after `strip().lower()`. `"sjnew26" != "sj"`. No authoritative documentation in the codebase maps `SJNEW26` to Sajeepan. It is treated as an unapproved candidate tag.

---

## Stock Investigation

### DB Evidence — inventory.products

```sql
SELECT id, sku, inventory_bool FROM inventory.products WHERE sku = 'ENC10233';
```
Result: `id=43674, inventory_bool=false`

### DB Evidence — UK stock row

```sql
SELECT inventory_id, warehouse_location, stock
FROM inventory.local_inventory_current_stock_location_wise
WHERE inventory_id = 43674 AND warehouse_location = 'UK';
```
Result: `inventory_id=43674, warehouse_location=UK, stock=0`

UK row EXISTS. Raw stock value = **0**.

All warehouses: Canada=0, Germany=0, UK=0, US=0.

### Classification trace

```python
def _classify_stock(uk_stock, inventory_bool, product_matched):
    if not product_matched:   # True  → skip
        return "Unknown"
    if not inventory_bool:    # False → FIRES HERE → returns "Unknown"
        return "Unknown"
    if uk_stock is None:      # never reached
        return "Unknown"
    if uk_stock <= 0:         # never reached
        return "Out of Stock"
    return "In Stock"
```

`inventory_bool = False` → second guard fires immediately. The real UK stock value (0) is never evaluated.

### Stock Root Cause

> **`inventory_bool = False` on `inventory.products` for ENC10233 (id=43674). The `_classify_stock()` function interprets this as "product not actively inventoried" and returns `"Unknown"` before checking the actual stock figure.**

### UI display — UK Stock shows 0

Frontend (DmCampaign.jsx):
```jsx
{product.ukStock != null ? product.ukStock : <span ...>Unavailable</span>}
```

Backend: `uk_stock = int(uk_stock_raw) if uk_stock_raw is not None else None`

The UK row exists with `stock=0`, so `uk_stock_raw=0` → `uk_stock=0` (not None).
The modal displays `0` — **this is the real raw stock value, not a None→0 conversion**.

**No UI ambiguity for this product.** The `0` is correct. If the UK row were missing entirely, the modal would display `Unavailable`.

---

## Summary

| Issue | Root Cause | Verified |
|---|---|---|
| Owner = No Tag | `SJNEW26` not in `SAJEEPAN_TAGS` or `SONYA_TAGS` (exact match fails) | Live DB + code |
| Stock = Unknown | `inventory_bool=false` on ENC10233 fires second guard before stock is checked | Live DB + code |
| UK Stock displays 0 | Real raw stock is 0 — correct, not a conversion artifact | Live DB + frontend code |

---

## Proposed Fixes (not implemented — pending approval)

### Fix 1 — Owner
**Condition:** Piranav/coordinator confirms `SJNEW26` is an approved Sajeepan tag.  
**Action:** Add `"sjnew26"` to `SAJEEPAN_TAGS` in `dm_campaign.py` line ~67.  
**Do not implement without explicit approval.**

### Fix 2 — Stock
**Option A:** If `inventory_bool=False` is intentional (product disabled/inactive), consider returning `"Inactive"` instead of `"Unknown"` to distinguish from "no DB match".  
**Option B:** If `inventory_bool=False` for ENC10233 is a data error, fix is in `inventory.products` data — not in code.  
**Confirm intent with Piranav before any action.**

---

## Next Actions

1. Piranav: Is `SJNEW26` an approved Sajeepan tag? → If yes, add to `SAJEEPAN_TAGS`
2. Piranav: Is `inventory_bool=False` for ENC10233 intentional or a data entry error?
3. After decisions: raise a separate implementation task
