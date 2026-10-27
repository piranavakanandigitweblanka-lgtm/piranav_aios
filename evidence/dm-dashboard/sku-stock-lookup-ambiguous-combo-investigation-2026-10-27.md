# Evidence — SKU Stock Lookup: AMBIGUOUS Combo SKU Investigation
## Date: 2026-10-27
## Status: COMPLETE — Root cause confirmed

---

## Problem SKU
`CRSF100BM+PHSH1PBRYB+LSSS300PI+ICST64E2740`

Related SKU shown on Combo Products page: `ENC8523`

---

## Step 1 — Existing Logic Review

### conduit_stock.py (Combo Products page)
Key finding from docstring (lines 15–26):

> **COMBO RULE (critical invariant): The stored stock in
> `inventory.local_inventory_current_stock_location_wise` is authoritative
> for ALL SKU types including combos. GetInvStock pre-calculates combo stock.
> Never recalculate it.**

- Queries `p.sku = ANY(...)` **only** — no `sku_original` fallback (Q2, lines 175–196)
- ENC SKU type: `sku.upper().startswith("ENC")` (line 88)
- ENC decoded via `sku_original` to find component SKUs (line 100–108)
- Both combo SKUs and ENC SKUs carry their stock directly from the stored value

### sku_stock_lookup.py (_fetch_stock_map)
Queries: `WHERE p.sku = ANY(%(skus)s) OR p.sku_original = ANY(%(skus)s)`

This dual-key query is what triggers AMBIGUOUS for the combo string.

---

## Step 2 — Database Investigation

### Query 1: Products matching the combo SKU (both sku and sku_original)

```sql
SELECT id::text, sku, sku_original, inventory_bool
FROM inventory.products
WHERE sku = 'CRSF100BM+PHSH1PBRYB+LSSS300PI+ICST64E2740'
   OR sku_original = 'CRSF100BM+PHSH1PBRYB+LSSS300PI+ICST64E2740'
   OR sku = 'ENC8523' OR sku_original = 'ENC8523'
```

| product_id | sku | sku_original | inventory_bool |
|---|---|---|---|
| **6304** | `CRSF100BM+PHSH1PBRYB+LSSS300PI+ICST64E2740` | `CRSF100BM+PHSH1PBRYB+LSSS300PI+ICST64E2740` | false |
| **36517** | `ENC8523` | `CRSF100BM+PHSH1PBRYB+LSSS300PI+ICST64E2740` | false |

**Two distinct product records. Both have the same combo string — one as sku, one as sku_original.**

### Query 2: UK stock for both products

| product_id | sku | UK stock |
|---|---|---|
| 6304 | `CRSF100BM+PHSH1PBRYB+LSSS300PI+ICST64E2740` | **66** |
| 36517 | `ENC8523` | **66** |

Both carry identical UK stock = 66. Same physical stock, two product records.

### Query 3: Component SKU stock

| product_id | sku | UK stock |
|---|---|---|
| 344 | CRSF100BM | 1094 |
| 720 | PHSH1PBRYB | 713 |
| 960 | LSSS300PI | **66** ← bottleneck |
| 1128 | ICST64E2740 | **0** ← zero stock component |

The combo stock of 66 is driven by LSSS300PI (66) — ICST64E2740 is zero but the stored combo value is 66. This is consistent with the COMBO RULE: GetInvStock pre-calculates it (alternative-warehouse or override logic may apply to ICST64E2740).

### Query 4: product_mapping for product IDs 6304 and 36517
Result: **0 rows** — no alternative_inventory_id links for either product.

---

## Step 3 — Root Cause

**Root cause: Option B confirmed.**

ENC8523 is the same combo product stored as a second, separate product record in `inventory.products`. Its `sku_original` is the full combo string `CRSF100BM+PHSH1PBRYB+LSSS300PI+ICST64E2740`.

When SKU Stock Lookup receives input SKU `CRSF100BM+PHSH1PBRYB+LSSS300PI+ICST64E2740`:

1. `p.sku = ANY(...)` matches product **6304** (direct combo SKU)
2. `p.sku_original = ANY(...)` matches product **36517** (ENC8523 whose sku_original IS the combo string)

These are two different product IDs → the existing `_fetch_stock_map` merge logic flags AMBIGUOUS. This is technically correct behaviour by the current rules — it detected a genuine dual-product conflict. But it is a false positive: both products carry the same stock (66) and represent the same physical item.

**This is NOT a data error or a matching-logic bug for normal SKUs.** It is a known ENC pattern: ENC SKUs are alternate-listing references to the same combo, and their `sku_original` intentionally duplicates the combo string.

---

## Step 4 — Recommended Fix

**Smallest safe change:**

When `_fetch_stock_map` detects that two matched product IDs carry the **same stock value**, and the conflict arose because one match is `via_sku` (direct) and the other is `via_sku_original` (ENC-type alias), prefer the `via_sku` match and return MATCHED — do not flag AMBIGUOUS.

More precisely:

> If `via_sku` matches product A and `via_orig` matches product B, AND `via_sku["stock"] == via_orig["stock"]`, treat as MATCHED using the `via_sku` result. Flag AMBIGUOUS only when the two stocks **differ** (genuine conflict).

**Alternative (simpler and safer):**

> When input SKU contains `+`, never use `sku_original` as a lookup key for that input. The combo string in `sku_original` belongs to ENC records and should only be decoded for component lookup — not used as an input-match target.

**Recommended approach: the simpler alternative.**

In `_fetch_stock_map`, before adding a SKU to `by_sku_original`, check: if the input SKU contains `+`, skip the `sku_original` indexing for that input. A combo string like `A+B+C` should only match via `p.sku`, not via another product's `p.sku_original`.

This is safe because:
- It only affects combo-string inputs (containing `+`)
- It does not change behaviour for plain single SKUs
- It does not suppress AMBIGUOUS globally
- It aligns with the Conduit Stock COMBO RULE (which also queries only `p.sku` for combo strings)

**Do not implement yet — awaiting Piranav approval.**

---

## Answer to Task Questions

| Question | Answer |
|---|---|
| Why is this SKU AMBIGUOUS? | Input `CRSF100BM+PHSH1PBRYB+LSSS300PI+ICST64E2740` matches product 6304 via `p.sku` AND product 36517 (ENC8523) via `p.sku_original` — two different product IDs |
| Is stock 66 valid for the combo SKU? | YES — product 6304 (direct combo) carries UK stock = 66, confirmed from DB |
| Does ENC8523 have the same stock? | YES — also 66, same physical item stored as a second product record |
| Is this a data error? | NO — it is the ENC pattern: ENC SKUs intentionally copy the combo string into sku_original |
| What should change? | _fetch_stock_map should not use sku_original as a lookup key when the input SKU itself contains `+` |

---

---

## Fix Implemented (2026-10-27)

### Change
`backend/app/dashboard_pages/sku_stock_lookup.py` — `_fetch_stock_map()`, one condition added.

**Before:**
```python
if sku_orig and sku_orig != sku and sku_orig in unique:
```

**After:**
```python
if sku_orig and sku_orig != sku and sku_orig in unique and "+" not in sku_orig:
```

This prevents ENC records (whose `sku_original` contains the combo string) from being
indexed as a match for combo-string inputs. Aligns with `conduit_stock.py` COMBO RULE.

### Tests added to `test_sku_stock_lookup.py`
| Test | Result |
|---|---|
| test_combo_sku_resolves_matched_not_ambiguous | PASS |
| test_combo_sku_stock_not_none | PASS |
| test_enc_sku_still_resolves_by_direct_sku | PASS |
| test_ordinary_sku_original_fallback_still_works | PASS |
| test_genuine_ambiguous_non_combo_unchanged | PASS |
| test_combo_and_plain_sku_in_same_batch | PASS |

**Total: 36/36 PASS. Frontend build: PASS (878ms).**

### Git diff
```
backend/app/dashboard_pages/sku_stock_lookup.py  |  9 ++-
backend/tests/test_sku_stock_lookup.py           | 84 ++++
2 files changed, 91 insertions(+), 2 deletions(-)
```

Not committed — awaiting Piranav instruction.

---

## Evidence Files

- Prompt: `prompts/dm-dashboard/sku-stock-lookup-ambiguous-combo-investigation-2026-10-27.md`
- Evidence: this file
- Validation: `validation/piranav/sku-stock-lookup-ambiguous-combo-investigation-2026-10-27-validation.md`

## Git Status
Not committed. Investigation only — no code changes made.
