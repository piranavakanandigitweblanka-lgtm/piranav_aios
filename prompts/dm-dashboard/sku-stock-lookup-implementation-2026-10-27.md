# Prompt: SKU Stock Lookup — DM Dashboard Implementation

## Registered
2026-10-27

## Category
dm-dashboard / implementation

## Owner
Piranav

## Coordinator
Varmen

## Purpose
Build a common DM Dashboard page "SKU Stock Lookup" that accepts any CSV containing SKUs,
retrieves current UK warehouse stock, and returns a downloadable CSV with original data
plus stock status columns appended.

## Approved Files
- `backend/app/dashboard_pages/sku_stock_lookup.py` — NEW
- `frontend/src/admin/pages/SkuStockLookup.jsx` — NEW
- `backend/app/main.py` — MODIFY (register router)
- `frontend/src/taskRegistry.jsx` — MODIFY (add tools.SkuStockLookup)
- `frontend/src/admin/AdminLayout.jsx` — MODIFY (add nav item)

## Stock Retrieval
- Product table: `inventory.products` (id, sku, sku_original)
- Stock table: `inventory.local_inventory_current_stock_location_wise`
- Warehouse filter: `warehouse_location = 'UK'`
- Stock column: `stock`
- DB connection: `get_business_conn()` (existing)
- SQL: LEFT JOIN, dual-key match (sku + sku_original)

## CSV Behavior
- Preserve all original columns and values
- Append: UK_Current_Stock, Matched_Product_ID, Matched_By, Stock_Status
- MATCHED / UNMATCHED / AMBIGUOUS statuses
- Never convert unmatched to zero
- Stream output — never write to disk

## Auth
- Use `make_task_auth("tools.SkuStockLookup")`
- UAM-grantable (not admin-only hardcode)

## Scope Boundaries
- No DB writes
- No Shopify/Avasam inventory writes
- No commits or pushes
- No scope expansion without handover approval

## Related Prompts
- `prompts/dm-dashboard/avasam-uk-stock-csv-tool-phase1-discovery-2026-10-27.md`
- `prompts/reusable/avasam-uk-stock-retrieve-extended-output-2026-10-27.md`
- `prompts/reusable/avasam-uk-stock-update-workflow.md`
