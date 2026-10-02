# Validation — Conduit Sold Phase 1

**Date**: 2026-10-01
**Feature**: Conduit Sold (Admin page, dm-dashboard)

---

## Access Control
| Check | Result |
|---|---|
| Backend enforces admin JWT via `verify_admin_token()` | ✅ PASS |
| Frontend sends `Authorization: Bearer {dm_token}` | ✅ PASS |
| Shopify token NOT in frontend code | ✅ PASS |
| Shopify token NOT in API response | ✅ PASS |
| Credentials NOT committed to git | ✅ PASS |
| Dev role → 403 (not in `_PRIVILEGED_ROLES` = `{admin, dev}`) | NOTE: dev role IS in _PRIVILEGED_ROLES (see auth.py line 17). Dev can access this page same as other admin-only pages. This is existing app behavior, not introduced here. |

## Data Correctness
| Check | Result |
|---|---|
| Conduit collections from business DB | ✅ PASS (4 collections, 58 unique products) |
| Shopify UK order query returns results | ✅ PASS (44 conduit line items in 500-order sample) |
| Product IDs from DB match Shopify API product IDs | ✅ PASS (legacyResourceId matches bigint product_id) |
| SKU at line-item level captured correctly | ✅ PASS |
| Quantity from Shopify line items | ✅ PASS |
| VOIDED orders excluded | ✅ PASS (code: `if financial_status in EXCLUDED_FINANCIAL_STATUSES: continue`) |
| qty <= 0 line items excluded | ✅ PASS |

## Date Boundaries
| Check | Result |
|---|---|
| Query: `created_at:>='2026-04-01' created_at:<'2026-10-01'` | ✅ PASS (Oct excluded) |
| Month bucket uses order `createdAt` datetime | ✅ PASS |
| Sep 30 last valid date | ✅ PASS |

## Architecture Compliance
| Check | Result |
|---|---|
| No new Shopify client created | ✅ PASS |
| No new DB models | ✅ PASS |
| Sidebar panel uses CSS visibility (no unmount) | ✅ PASS (tabPanelClass) |
| Backend NOT started with --reload | ✅ N/A (note in README) |
| In-memory cache with 15-min TTL | ✅ PASS |
| ?refresh=1 param bypasses cache | ✅ PASS |

## File Count
- Created: 2 new files
- Modified: 2 existing files
- Total change footprint: minimal

---

## Phase 1.1 — Revenue + CSV (2026-10-01)

### Revenue Checks (pending live data test — requires backend restart + ?refresh=1)
| Check | Result |
|---|---|
| `originalTotalSet.shopMoney.amount` field added to ORDERS_QUERY | ✅ Code verified |
| Revenue parsed per line item in `_fetch_uk_orders_in_range()` | ✅ Code verified |
| `_build_report()` aggregates revenue alongside qty | ✅ Code verified |
| Per-SKU `monthly_rev` + `total_rev` in API response | ✅ Code verified |
| Per-product `monthly_rev_totals` + `total_rev` in API response | ✅ Code verified |
| Per-collection `grand_revenue` in API response | ✅ Code verified |
| Cache version bumped to v2 — v1 (units-only) cache auto-invalidated | ✅ Code verified |
| Revenue definition matches `admin_sku_audit.py` convention | ✅ Same field: `originalTotalSet.shopMoney.amount` |

### CSV Export Checks (pending live data test)
| Check | Result |
|---|---|
| Export CSV button renders in header area | ✅ Code verified |
| Exports currently selected collection only | ✅ Uses `coll` (activeTab) |
| Columns: Collection, Product ID, SKU, Title, Row Type, [6×Units+Rev], Total Units, Total Rev | ✅ Code verified |
| SKU rows (row_type=sku) | ✅ Code verified |
| Product total rows (row_type=product_total) | ✅ Code verified |
| Revenue as numeric GBP decimal | ✅ `.toFixed(2)` |
| UTF-8 BOM for Excel | ✅ `'﻿'` prepended |
| Filename: `{handle}-sold-apr-sep-2026.csv` | ✅ Code verified |
| No credentials in CSV | ✅ Only order aggregates, no tokens |

### UI Checks (pending live data test)
| Check | Result |
|---|---|
| MonthCell shows units + revenue (two lines) | ✅ Code verified |
| Table header shows "Units / Rev" sub-label | ✅ Code verified |
| Product TOTAL row shows monthly_rev_totals + total_rev | ✅ Code verified |
| Total Revenue summary card added (4th card) | ✅ Code verified |
| Collection tab label shows units + revenue | ✅ Code verified |
| Existing cards (Total Products, Products with Sales, Total Units) unchanged | ✅ Verified |

### Live Data Test Required
- Requires backend restart (to load new ORDERS_QUERY with revenue field)
- First load after restart will fetch fresh data with ?refresh=1 or wait for cache expiry
- Verify: SKU monthly_rev values are non-zero for known Conduit SKUs
- Verify: product total_rev = sum of SKU total_revs
- Verify: collection grand_revenue = sum of product total_revs

## Status: PASS (code) — PENDING live data confirmation

---

## Phase 2A — Data Gap Verification (2026-10-02)

### Gap Resolution Checks
| Gap | Check | Result |
|---|---|---|
| Gap 1 — PCBSF SKUs | `PCBSF2MCH3PK` found in `inventory.products` (id=34680) | ✅ RESOLVED — UK stock=303 |
| Gap 1 — PCBSF SKUs | `PCBSF2MCH` (id=34679) found | ✅ UK stock=911 |
| Gap 1 — PCBSF SKUs | `PCBSF2MCH2PK` (id=35129) found | ✅ UK stock=455 |
| Gap 2 — Join path | `product_id → shopify_listings.item_id (is_parent=1) → parent_child_mapping → sku` | ✅ CONFIRMED via product 8009880633594 → SKUs PCGZ20MX, PCGZ20MX2PK etc. |
| Gap 3 — Complete SKU list | 288 unique SKUs across 4 collections via confirmed join path | ✅ CONFIRMED (158+22+253+125 per-collection, 288 unique) |
| Gap 4 — Alt warehouse | `inventory.product_mapping.alternative_inventory_id=344` for CRSF10025BM | ✅ CONFIRMED |
| Gap 4 — Alt warehouse | Alt = CRSF100BM, UK stock=2316 | ✅ CONFIRMED |
| Gap 4 — Alt warehouse | Combo stock pre-calculated in `local_inventory_current_stock_location_wise` | ✅ DO NOT RE-DERIVE |

### End-to-End Chain Validation (5 SKUs)
| SKU | DB Record | UK Stock | Chain Verified |
|---|---|---|---|
| CRSF100BM | inv_id=344, inventory_bool=true | 2316 | ✅ |
| CRSF10025BM | inv_id=2559, inventory_bool=true | 0 (alt=2316) | ✅ |
| PCBSF2MCH3PK | inv_id=34680, inventory_bool=false | 303 | ✅ |
| CRSF10025BM+PHHC1BMRBM | inv_id=36078, inventory_bool=false | 92 | ✅ |
| ENC8047 | inv_id=33552, sku_original=PCFT90LBM+PCBSM2FYB+LHNSE27YB+SCRN70BM+LSFT220BM | 110 | ✅ |

### Status: PASS — ALL 4 GAPS RESOLVED — PHASE 2 IMPLEMENTATION MAY BEGIN
