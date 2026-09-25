# Handover: Ads Product Scope — Level 5 Implementation [2026-09-25]

## What Was Built

Admin page in the DM Dashboard showing Sajeepan's Google Ads product population classified by sale/non-sale status and stock state.

## Why It Was Built

Sajeepan's 7 campaigns show 2,126 products. 719 are non-sale (compare_price IS NULL or = 0). Of those, 693 are active and in-stock (Group A — the eligible set for further action). The existing Sajeepan staff dashboard did not surface this classification. This admin page makes the scope visible, filterable, and exportable.

## Files

| File | Role |
|---|---|
| `dm-dashboard/backend/app/admin_ads_product_scope.py` | Router, SQL, snapshot |
| `dm-dashboard/frontend/src/admin/pages/AdsProductScope.jsx` | Page UI |
| `dm-dashboard/backend/app/main.py` | Import + registration (modified) |
| `dm-dashboard/frontend/src/admin/AdminLayout.jsx` | Nav + panel (modified) |

## How to Start the Server (dm-dashboard)

1. `cd dm-dashboard`
2. Start backend: `uvicorn app.main:app --port 8199` (from backend/)
3. Start frontend: `npm run dev` (from frontend/)
4. Navigate to Admin → Sales & Performance → Ads Product Scope

## What to Verify After Server Restart

1. Page loads under Admin → Sales & Performance → Ads Product Scope
2. Summary cards show: ~2,126 total, ~693 Group A, ~25 Group B
3. Group filter works (e.g. select "Group B" → 25 rows)
4. Search works (type SKU like "COY9ABM")
5. CSV export reflects the current filter (not all products)
6. Existing Sajeepan staff dashboard still works
7. Snapshot table `public.admin_ads_product_scope_snapshot` created in app DB

## Known Issue — Live Counts May Differ Slightly

The investigation was done on 2026-09-25 with a 30-day window. Daily Ads data changes mean live counts shift naturally. If Group A shows 685 instead of 693, that is normal (products entering/leaving campaigns daily). If there is a large unexplained difference (e.g. Group A = 100), investigate the SQL join.

## Next Phase Options

1. **Server-side data validation** — restart server, hit endpoint, confirm counts
2. **Multi-staff extension** — add Thasitha (DE), Thivajini (FR) to STAFF_CONFIG
3. **Sajeepan integration** — surface Group A/B badges inside the existing Sajeepan staff dashboard

## Architecture Reference

See `docs/dm-dashboard/ads-product-scope-level4c-design-2026-09-25.md` for full design rationale.
