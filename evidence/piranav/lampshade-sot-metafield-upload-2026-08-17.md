# Evidence — Lampshade SOT → Shopify Metafield Upload

**Date:** 2026-08-17
**Task:** Bulk upload Easy Fit Lampshade product data from SOT v8 as Shopify product metafields
**Prepared by:** Piranav (AIOS)

---

## Source Files

| File | Purpose |
|---|---|
| `C:\Users\PC\Downloads\Copy of Lampshade_SOT_v8.xlsx` | Master SOT — 469 SKUs, 208 columns, 24 section groups |
| `C:\Users\PC\Downloads\products-variant.csv` | Shopify variant export — Variant ID, Variant SKU, Parent List ID |
| `C:\Users\PC\Downloads\products-variant-merged.csv` | Merged file — variant export + SOT fields matched by SKU |
| `C:\Users\PC\Downloads\products-by-parent.csv` | Final — 125 rows, one per Parent List ID |

---

## Step 1 — SOT Understanding

Lampshade_SOT_v8.xlsx contains:
- **469 SKUs** across Metal (364), Glass (78), Crystal Glass (9), Fabric (13), Natural Rope (5)
- MASTER sheet: 208 columns covering Identity, Physical, Materials, Fitting, Optical, Compliance, Amazon, eBay, Website, PPC, Content
- Build Notes: v8 removed 48 SKUs, retired 6 material sub-tabs, MASTER is now single editing surface

---

## Step 2 — SKU Matching

- Variant SKU format: `LSOL180BB+RPR44WH` — stripped `+RPR...` suffix before lookup
- Matched against MASTER sheet SKU_ID column
- **305 matched** out of 539 variant rows
- After dedup: **346 unique rows**, **125 unique Parent IDs**
- **79 parents had SOT data** — uploaded
- **46 parents had no SOT match** — skipped (non-lampshade SKUs: WCB4BB, WCLC* etc.)

---

## Step 3 — Field Mapping (SOT → Shopify Metafield)

| SOT Column | Shopify Metafield | Namespace | Key |
|---|---|---|---|
| `Fitting_Type` | TYPE | custom | core |
| `Shade_Shape` | SHAPES | custom | bulb_shapes |
| `Height_mm` | HEIGHT | custom | height |
| `Diameter_mm` | SIZE | custom | size |
| `Hole_Diameter_mm` | HOLE DIAMETER | custom | hole_diameter |
| `Material_Primary` | MODEL | custom | model |
| `Colour_Family` | COLOUR | custom | colour |
| `Bulb_Base_Type` | HOLDER TYPE | custom | holder_ |
| `Style_Category` | STYLE | custom | style |

---

## Step 4 — New Metafield Definitions Created

| Metafield Name | Key | Type | Shopify ID |
|---|---|---|---|
| HEIGHT | height | list.single_line_text_field | 310141780354 |
| HOLE DIAMETER | hole_diameter | list.single_line_text_field | 310141813122 |

Both created under `custom` namespace. Validated in Shopify Admin → Settings → Custom data → Products.

---

## Step 5 — Upload Execution

- Test product uploaded first: `6842133151905` (Industrial 18cm Metal Pendant Light Shade 180mm)
- Confirmed mapping correction: TYPE = Fitting_Type (not Shade_Shape), SHAPES = Shade_Shape
- Full upload: **79 products across 9 batches of 10**
- **0 errors** across all batches

---

## Step 6 — Validation

All 9 batches returned `userErrors: []`. No failed mutations. All 79 products confirmed updated in Shopify API response.

---

## Result

| Metric | Value |
|---|---|
| Products uploaded | 79 |
| Products skipped (no SOT match) | 46 |
| Metafields per product | 9 |
| Total metafield writes | 711 |
| Errors | 0 |
| New metafield definitions created | 2 (HEIGHT, HOLE DIAMETER) |

**Status: PASS**
