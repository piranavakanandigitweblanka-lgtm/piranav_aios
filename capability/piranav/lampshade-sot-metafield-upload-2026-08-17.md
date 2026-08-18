# Capability Record — Lampshade SOT → Shopify Metafield Bulk Upload

- **Title:** Easy Fit Lampshade SOT Data → Shopify Product Metafields (Bulk)
- **Date:** 2026-08-17
- **Member:** Piranav
- **Team:** E-commerce / Shopify Data
- **Task:** Extract product spec data from SOT v8 Excel, match to Shopify products by SKU, bulk upload as product metafields via GraphQL
- **Evidence:** evidence/piranav/lampshade-sot-metafield-upload-2026-08-17.md
- **Status:** PASS
- **PASS / FAIL:** PASS

---

## Capabilities Delivered

### 1 — SOT Excel Parsing
- Read and understood Lampshade_SOT_v8.xlsx (9 sheets, 469 SKUs, 208 columns)
- Identified relevant data sections: PHYSICAL, MATERIALS, FITTING, OPTICAL, CONTENT
- Located exact column indices for 9 required fields

### 2 — SKU Matching Logic
- Parsed tab-delimited Shopify variant CSV export
- Stripped `+RPR...` bundle suffix from Variant SKU to isolate base lampshade SKU
- Matched against MASTER sheet SKU_ID — 305/539 rows matched
- Deduped 193 duplicate rows, reduced to 346 unique rows
- Collapsed to 125 unique Parent List IDs (one row per product)

### 3 — Data Pipeline (CSV → Shopify)
- Built full Python pipeline: SOT Excel → merged CSV → parent-level CSV → GraphQL mutations
- Filtered 46 products with no SOT data (non-lampshade SKUs) to avoid blank writes
- Generated batched GraphQL mutations (10 products per batch)

### 4 — Shopify Metafield Management
- Queried all existing product metafield definitions via Admin GraphQL API
- Created 2 new metafield definitions: HEIGHT (`custom.height`), HOLE DIAMETER (`custom.hole_diameter`)
- Mapped 9 SOT fields to correct existing/new metafield keys
- Validated mapping with test upload before bulk run

### 5 — Bulk GraphQL Upload
- Uploaded 79 products across 9 batches via `productUpdate` mutation
- All batches: 0 errors, 711 total metafield writes
- Confirmed via Shopify API `userErrors: []` on every mutation

---

## Field Mapping Reference

| SOT Field | Metafield | Key |
|---|---|---|
| Fitting_Type | TYPE | core |
| Shade_Shape | SHAPES | bulb_shapes |
| Height_mm | HEIGHT | height |
| Diameter_mm | SIZE | size |
| Hole_Diameter_mm | HOLE DIAMETER | hole_diameter |
| Material_Primary | MODEL | model |
| Colour_Family | COLOUR | colour |
| Bulb_Base_Type | HOLDER TYPE | holder_ |
| Style_Category | STYLE | style |

---

## Tools Used
- Python (openpyxl, csv) — local data processing
- Shopify Admin GraphQL API — metafield definitions + product updates
- Shopify MCP (`graphql_query`, `graphql_mutation`) — API execution
