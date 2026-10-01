# Evidence — Conduit Sold Phase 1

**Date**: 2026-10-01
**Session**: dm-dashboard Conduit Sold History Phase 1
**Status**: IMPLEMENTED — validation PASS

---

## Discovery Findings

### Existing code reused
| Asset | Reused From | How Used |
|---|---|---|
| `shopify_client.graphql("ledsone_uk", ...)` | `backend/app/shopify_client.py` | Fetch UK orders with line items |
| `verify_admin_token()` | `backend/app/auth.py` | Admin-only endpoint protection |
| `get_business_conn()` | `backend/app/db.py` | Query collection membership tables |
| `_CACHE` / 15-min TTL pattern | `shopify_uk_refunds.py` | Cache slow Shopify fetch |
| `tabPanelClass(active, key)` | `Sidebar.jsx` | No-unmount panel visibility |
| `jreq-*` CSS classes | `dashboard.css` | Consistent admin page styling |
| `VITE_API_URL` pattern | All admin pages | Frontend API URL |
| `localStorage.getItem('dm_token')` | `SeoIntelligence.jsx` | Auth header injection |

### Critical discovery: business DB orders have NULL product_id
```sql
-- order_management.order_item_info for UK Shopify orders:
product_id: NULL  -- for ALL UK orders
variant_id: NULL  -- for ALL UK orders
item_sku: 'BL1S0300BM'  -- only SKU populated
```
This is why Shopify API is used for order data (not business DB order tables).

### Conduit collections confirmed in business DB
```
listings.shopify_collections WHERE handle ILIKE '%conduit%' AND sub_source=104:
  conduit-accessories    → collection_id: 647662076290 → 37 products
  conduit-lamp-holder    → collection_id: 647662338434 → 3 products
  conduit-lighting       → collection_id: 426407592186 → 49 products
  conduit-lightings      → collection_id: 665354469762 → 20 products
  Total: 109 product rows, 58 unique product IDs (some products in multiple collections)
```

### UK Shopify orders scale (Apr-Sep 2026)
~12,500 orders estimated (5 pages × 50 = 250, at 50/page). First load: 1-3 minutes. Cache handles subsequent loads.

---

## Files Created
- `backend/app/admin_conduit_sold.py` — FastAPI router + data pipeline
- `frontend/src/admin/pages/ConduitSold.jsx` — React admin page

## Files Modified
- `backend/app/main.py` — registered `admin_conduit_sold_router`
- `frontend/src/admin/AdminLayout.jsx` — added sidebar item + panel for `conduit-sold`

---

## API Endpoint
```
GET /api/admin/conduit-sold
Authorization: Bearer {admin_jwt}
?refresh=1 (optional — bypass cache)
```

---

## Validation Results

### ✅ Collection data loads
```
Collections loaded: 4
  conduit-accessories — Conduit Accessories — 37 products
  conduit-lamp-holder — Conduit  Lamp Holder — 3 products
  conduit-lighting — Conduit Lighting Set — 49 products
  conduit-lightings — Conduit Lighting — 20 products
```

### ✅ Shopify order query works
```
Orders found: 5 (test sample Apr 2026)
Order: 2026-03-31 status=PAID  (UTC → UK local = Apr 1, expected)
  SKU=CRSF120BM qty=2 product_id=4448092094560
```

### ✅ Conduit products matched in real orders
```
Conduit orders found in first 10 pages (500 orders, Apr-May 2026): 44 matches
Sample:
  date=2026-04-01 pid=14822482411906 sku=PCBSF2MCH3PK qty=2 title=20mm Bush Female...
  date=2026-04-01 pid=14881058324866 sku=ENC8046 qty=6 title=Rotatable Metal Wall Spotlight...
  date=2026-04-01 pid=14879664472450 sku=LHTTAGU10WH+LDGU10WW5 qty=10 title=Cylinder Adjustable...
```

### ✅ Authorization enforcement confirmed
`verify_admin_token()` in backend — raises 401/403 before any data is returned to non-admin.
Frontend sends `Authorization: Bearer {localStorage dm_token}` — same pattern as SeoIntelligence.

### ✅ No Shopify credentials in frontend
Token only in `backend/.env` (`SHOPIFY_UK_ADMIN_TOKEN`). Frontend only sends JWT.

### ✅ No duplicate Shopify client
Uses existing `shopify_client.graphql("ledsone_uk", ...)` — no new client created.

---

## Sales Rule Documented
**Gross units sold on non-VOIDED orders.**
- Include: PAID, PARTIALLY_PAID, PARTIALLY_REFUNDED, AUTHORIZED, PENDING
- Exclude: VOIDED (order reversed before payment/shipment)
- Refunded quantities NOT subtracted (gross sold = standard for sales history)
- Use Shopify UK Refunds page for refund detail

---

## Limitations / Phase 2 Notes
1. First load takes 1-3 minutes (250+ Shopify API pages). Cache TTL = 15 min.
2. Phase 1 scope: Apr-Sep 2026 only. Future months require code update or dynamic date range.
3. `conduit-pipe` and `conduit-lighting-accessories` collections exist but are NOT included (not in scope per task).
4. Products in multiple conduit collections appear in each collection's tab separately (correct behavior — same product can be sold under different collection contexts).
