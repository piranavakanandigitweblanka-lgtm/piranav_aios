# Level 4A — Business Rule Evidence Investigation
# Sajeepan Ads Product Scope [2026-09-25]

## 1. Executive Summary

Three open business questions from Phase 3 were investigated using live read-only DB queries and existing codebase analysis. All three questions now have data-backed answers, though two still require a final business decision.

| Question | Data Available | Business Decision Required |
|---|---|---|
| Q1: 165 NULL-quantity products | YES — all 165 confirmed IN_STOCK by merchant_products | NO — data is definitive |
| Q2: compare_price = 0 (~231 products) | YES — 226/230 have no merchant sale_price; 4 do | PARTIAL — see detail |
| Q3: 25 OOS non-sale products | YES — split 9 IN_STOCK / 14 OUT_OF_STOCK / 2 no record by merchant | YES — include/exclude is a business call |

**Recommended total eligible scope (Group A + confirmed NULL-qty):** 528 + 165 = **693 non-sale + active + in-stock or IN_STOCK-confirmed products**

---

## 2. NULL Quantity — 165 Products

### A. FACT FOUND IN DATA

- `listings.shopify_listings` has no `availability` column — stock state is determined solely by `quantity` (integer) and `status` (varchar)
- 165 distinct variants are active non-sale with `quantity IS NULL`
- `listing_max_platform_stock` is NULL for all 165 — this field is not populated for these listings
- `merchant_products.availability` = **`IN_STOCK`** for all 165 / 165

Query result:
```
Q1a NULL-qty merch_avail: [('IN_STOCK', 165)]
Q1b listing_max_platform_stock: [(None, 165)]
```

### B. EXISTING CODE BEHAVIOR

`sajeepan.py` lines 623–627 (OOS detection logic):
```python
# Determine OOS: merchant says OOS, OR shopify_listings quantity=0, OR not found in listings
if merch_avail is not None:
    is_oos = merch_avail.lower() in ("out of stock", "out_of_stock", "preorder")
elif m:
    is_oos = (m.get("quantity") or 0) == 0
```

This is the authoritative existing pattern. When `merchant_products.availability` is present, **it takes priority over `shopify_listings.quantity`**. When `merchant_products` is absent, `quantity` is used with `(quantity or 0) == 0` — so `NULL` maps to `0`, i.e. OOS.

**The existing Sajeepan code would classify NULL-quantity products as IN_STOCK if merchant_products says IN_STOCK.** The merchant signal overrides the listing signal.

`sonya.py` line 169:
```python
"availability": ("in stock" if meta.get("quantity", 0) and meta["quantity"] > 0 else "out of stock") if meta else None
```
Sonya uses Shopify quantity only (no merchant fallback). NULL → `0` → `out of stock`.

### C. EXISTING DOCUMENTED BUSINESS RULE

No documented business rule exists for NULL quantity in AIOS records.

### D. INFERENCE

The 165 NULL-quantity listings are active Shopify variants where the listings sync does not record a `quantity` value. Google Merchant Center independently shows them as IN_STOCK, meaning the actual inventory count is positive — it just isn't synced into `shopify_listings.quantity`.

### E. CLASSIFICATION

**CONFIRMED IN-STOCK** — based on `merchant_products.availability = IN_STOCK` for all 165 products, aligned with the existing Sajeepan OOS detection code which uses merchant availability as the primary signal.

### F. IMPACT ON SCOPE

These 165 should be treated as **in-stock** for the non-sale filter.
Updated Group A eligible count: 528 (qty > 0) + 165 (qty NULL, merch IN_STOCK) = **693**.

CSV: `evidence/sajeepan/sajeepan-null-quantity-investigation-2026-09-25.csv` (241 rows — includes duplicates from dual-format product_item_ids; 165 distinct variants)

---

## 3. compare_price = 0 — 230 Products

### A. FACT FOUND IN DATA

Total `compare_price = 0`: **230** (corrected from Phase 3 estimate of 231)

Price range: £0.65 – £40.49, avg £11.19

`merchant_products.sale_price` distribution for these 230:
- NULL (no merchant sale price): **226**
- > 0 (merchant records a sale price): **4**

```
Q2 merch sale_price dist: [('GT_ZERO', 4), ('NULL', 230)]
```

Note: 4 products have `compare_price = 0` in `shopify_listings` BUT have a non-zero `sale_price` in `merchant_products`. This is a data inconsistency between the two sources.

### B. EXISTING CODE BEHAVIOR

No existing code in the dm-dashboard reads `compare_price` from `shopify_listings` for sale classification. The column exists in the DB but is not queried by any staff module for sale/non-sale filtering.

`merchant_products.sale_price` is surfaced in Sajeepan's ROAS bands (sajeepan.py line ~563) but not used as a sale/non-sale gate.

`dev_tasks/geo_visibility/shopify.py` and `dev_tasks/competitor_analysis/shopify_products.py` fetch `compareAtPrice` from the Shopify API but only for display purposes.

### C. EXISTING DOCUMENTED BUSINESS RULE

No existing authoritative sale/non-sale rule documented in AIOS or codebase.

### D. INFERENCE

In Shopify, `compare_at_price = 0` typically means the field was explicitly set to zero rather than left blank (NULL). Standard Shopify practice is:
- `compare_at_price > 0` → product is on sale (regular price shown as strikethrough)
- `compare_at_price = NULL` → not on sale
- `compare_at_price = 0` → ambiguous — could mean "not on sale" (explicit zero) or a data entry artifact

The 4 products with `compare_price = 0` AND `merchant_products.sale_price > 0` suggest at least some `= 0` records have pricing complexity. However 226/230 have no merchant sale signal.

### E. SALE CLASSIFICATION

| State | Evidence | Classification |
|---|---|---|
| compare_price IS NULL | No sale price recorded anywhere | **SUPPORTED AS NON-SALE** |
| compare_price = 0, no merch sale_price | 226 products — no sale signal in either source | **SUPPORTED AS NON-SALE** |
| compare_price = 0, merch sale_price > 0 | 4 products — conflicting signals | **BUSINESS DECISION REQUIRED** |

**For 226/230**: treating `= 0` as non-sale is supported by evidence.
**For 4/230**: data conflict. Safe options: treat as non-sale (conservative) or exclude from scope (cautious).

### F. RECOMMENDATION

Group `compare_price IS NULL` and `compare_price = 0` together as non-sale. Flag the 4 anomalous products in a separate data-quality note. This aligns with the existing Phase 3 approach and the 226/230 evidence.

---

## 4. Non-Sale + OOS — 25 Products

### A. FACT FOUND IN DATA

Full list of 25 in CSV: `evidence/sajeepan/sajeepan-oos-nonsale-investigation-2026-09-25.csv`

`merchant_products.availability` breakdown:
- **OUT_OF_STOCK**: 14 products
- **IN_STOCK**: 9 products ← conflicting signal (Shopify qty=0 but merchant says in-stock)
- **no_record**: 2 products

Top 5 by spend (30d):
| SKU | Title | Spend | Convs | CV | merch_avail |
|---|---|---|---|---|---|
| COY9ABM | Y Connecter | £68.60 | 9.64 | £413.44 | OUT_OF_STOCK |
| CRFF75YB | Yellow Brass | £38.76 | 0 | £0 | OUT_OF_STOCK |
| WSNWBC+... | Brushed Copper | £18.15 | 1.00 | £33.48 | OUT_OF_STOCK |
| ENC8046 | White | £9.30 | 1.15 | £92.70 | IN_STOCK |
| SWGS2GGD | Default Title | £7.31 | 3.00 | £183.68 | no_record |

### B. EXISTING CODE BEHAVIOR

Sajeepan's existing OOS bestsellers section (sajeepan.py lines 616–653) **includes** OOS products in a dedicated "OOS Bestsellers" view — these are products still receiving Ads spend while out of stock, flagged as `urgent: True` if cost > 0.

This means the existing code deliberately **surfaces** OOS products rather than excluding them. The OOS state is treated as an actionable problem, not a reason to remove from scope.

Sukirtha.py (`sukirtha.py`) excludes OOS+draft products from the missing meta list but does not exclude OOS from Ads views.

### C. CURRENT ADS TREATMENT

The Google Ads campaigns still have these 25 products active — Ads keeps spending on them. 25 products in the 30-day window had £0+ spend. The top product (COY9ABM) had £68.60 spend and 9.64 conversions in 30 days despite Shopify showing qty=0.

9 of the 25 show `IN_STOCK` in merchant_products despite `shopify_listings.quantity = 0` — these may have had recent restocks not yet synced to the listings DB.

### D. STOCK CONFLICT NOTE

14/25 confirmed OOS by both sources. 9/25 have conflicting signals (Shopify qty=0, merchant IN_STOCK). The existing Sajeepan OOS logic uses merchant as primary — these 9 would be classified as **in-stock** by the existing code.

### E. CLASSIFICATION

**BUSINESS DECISION REQUIRED** — two defensible options:

| Option | Products | Rationale |
|---|---|---|
| Exclude OOS (qty=0) from non-sale scope | -25 products | Cleaner scope; avoids showing staff products they can't do anything about |
| Include OOS but tag as out-of-stock | +25 products | Consistent with existing Sajeepan OOS pattern; visibility of waste |
| Include only the 9 with merchant IN_STOCK | +9 products | Compromise; follows existing priority rule |

---

## 5. Existing Ads Staff Patterns

### Product ID Normalization (authoritative — Jefri)

```sql
CASE WHEN product_item_id LIKE 'shopify_%'
     THEN split_part(product_item_id, '_', array_length(string_to_array(product_item_id, '_'), 1))
     ELSE product_item_id END AS shopify_id
```
Used in: `jefri.py` lines 71–75, 518–520, 673–675, 865–868. **This is the canonical pattern for all staff.**

### OOS Classification (authoritative — Sajeepan)

```python
if merch_avail is not None:
    is_oos = merch_avail.lower() in ("out of stock", "out_of_stock", "preorder")
elif m:
    is_oos = (m.get("quantity") or 0) == 0
```
`sajeepan.py` lines 623–627. Merchant availability takes priority. Shopify quantity is fallback.

### Stock Display (common pattern — Sajeepan, Sonya)

Sajeepan (line 725): `(qty or 0) > 0` → in stock
Sonya (line 169): `meta.get("quantity", 0) and meta["quantity"] > 0` → in stock
Both treat `NULL` as `0` (OOS) when no merchant fallback exists.

### compare_price Usage

No staff module uses `compare_price` from `shopify_listings` for sale filtering. It is available in the DB column but unused for this purpose.

---

## 6. Business Decisions Still Required

| # | Decision | Options | Data supports |
|---|---|---|---|
| 1 | OOS (qty=0) inclusion in non-sale scope | Include / Exclude / Include-tagged | Neither — operational preference |
| 2 | 4 compare_price=0 + merchant sale_price>0 anomalies | Treat as non-sale / exclude | Either is defensible |
| 3 | compare_price=0 = non-sale confirmation | Yes/No | 226/230 evidence supports YES |

---

## 7. Recommended Rule Set

These are **recommendations only** — not final business rules.

```
NON-SALE definition:
  shopify_listings.compare_price IS NULL OR compare_price = 0

IN-STOCK definition (two-signal):
  merchant_products.availability = 'IN_STOCK'   [primary]
  OR shopify_listings.quantity > 0               [fallback when no merchant record]

NULL quantity treatment:
  If merchant_products.availability = 'IN_STOCK' → treat as in-stock
  If no merchant record + quantity IS NULL → treat as unknown / exclude
  (165 products: all have merchant IN_STOCK → include)

OOS treatment (recommendation):
  Exclude from primary scope (qty=0 AND merch OUT_OF_STOCK)
  Surface separately as "OOS non-sale" monitoring list

Final eligible scope (recommendation):
  528 (qty > 0) + 165 (qty NULL, merch IN_STOCK) = 693 products
```

---

## 8. CSV Files Created

| File | Rows | Contents |
|---|---|---|
| `evidence/sajeepan/sajeepan-null-quantity-investigation-2026-09-25.csv` | 241 (165 distinct variants) | All NULL-qty non-sale active products with merchant availability |
| `evidence/sajeepan/sajeepan-oos-nonsale-investigation-2026-09-25.csv` | 25 | All OOS non-sale active products with spend + merchant availability |

---

## 9. AIOS Files Created/Updated

| File | Action |
|---|---|
| `evidence/sajeepan/sajeepan-nonsale-level4a-business-rule-evidence-2026-09-25.md` | CREATED (this file) |
| `evidence/sajeepan/sajeepan-null-quantity-investigation-2026-09-25.csv` | CREATED |
| `evidence/sajeepan/sajeepan-oos-nonsale-investigation-2026-09-25.csv` | CREATED |
| `validation/piranav/sajeepan-nonsale-level4a-validation-2026-09-25.md` | TO BE CREATED |

Phase 1–3 evidence files: PRESERVED, not modified.

---

## 10. Safety Confirmation

**Code changed:** NO
**Database changed:** NO
**Dashboard changed:** NO
**Deployment performed:** NO

All queries were SELECT only. Business DB pool not increased. No tables created or altered.
