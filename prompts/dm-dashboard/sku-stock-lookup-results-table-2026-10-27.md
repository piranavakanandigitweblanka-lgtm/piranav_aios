# Prompt: SKU Stock Lookup — Results Table Display After Upload

## Registered
2026-10-27

## Category
dm-dashboard / implementation

## Purpose
Add an in-page results table to the existing SKU Stock Lookup page.
After upload completes, display all processed rows in a table below the
KPI cards, with pagination for large uploads. Keep existing upload,
download, UAM, and backend stock logic unchanged.

## Approach
Parse the CSV blob already in memory (no second upload, no extra DB query).
Use blob.text() on the existing blob before creating the object URL.

## Output Columns to Show
- SKU (from input)
- Quantity (if present in input)
- UK_Current_Stock
- Stock_Status (MATCHED / UNMATCHED / AMBIGUOUS)
- Other original columns (all preserved)

## Pagination
- Page size: 50 rows
- Show row count, page X of Y, prev/next buttons (jreq-pagebar pattern)

## CSS
- Reuse existing jreq-* classes (jreq-scroll, table, th, td patterns)
- No new CSS files

## Scope
- Frontend only: SkuStockLookup.jsx
- No backend changes
- No new endpoints
- No DB queries
