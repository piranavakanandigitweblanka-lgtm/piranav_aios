---
name: sajeepan-ai-item-id-fix-2026-09-02
description: Capability — Sajeepan AI brief now includes variant item_id in wasteful and OOS product data so AI gives exact IDs for exclusion
metadata:
  type: capability
---

# Capability — Sajeepan AI Item ID Fix

**Date:** 2026-09-02
**Engineer:** Piranav

---

## Problem

Sajeepan's AI brief correctly identified wasteful and OOS products but gave only product titles in follow-up analysis. No variant `item_id` was provided, so Sajeepan could not exclude products directly in Google Ads Listing Groups or Merchant Center without manually looking up the ID.

## Root Cause

`_gather_data()` in `sajeepan_ai.py` built `waste_products` and `oos_spending` dicts with only `title` and `cost` — the `item_id` (variant ID) was extracted from the raw Google Ads product_item_id but discarded before being passed to the system prompt.

## Fix

Added `item_id` to both `waste_products` and `oos_spending` dicts. Updated `_build_system_prompt()` to include the ID inline:

```
WASTEFUL PRODUCTS (0 conversions, spending > £5):
  Brushed Copper / With Bulb (item_id:44821903671234) | £22 wasted
  T Connecter (item_id:44821903671235) | £16 wasted
```

```
OOS BESTSELLERS still spending budget:
  Plug-In Pendant Light Kit (item_id:44821903671100) | spending:£98 | prev revenue:£312
```

## Result

AI follow-up now gives exact variant IDs. Sajeepan can go directly to:
- **Google Ads** → Campaign → Listing Groups → subdivide by Item ID → exclude
- **Merchant Center** → Products → filter by ID → set excluded destination

## Files Modified

| File | Change |
|---|---|
| `backend/app/sajeepan_ai.py` | Added `item_id` to waste_products + oos_spending dicts and system prompt lines |

## Reusable Pattern

All other staff AI files (`jefri_ai.py`, `kamsi_ai.py`, etc.) have the same gap if they include product exclusion data. Apply same fix: store `item_id` in the data dict, surface it in the system prompt line.
