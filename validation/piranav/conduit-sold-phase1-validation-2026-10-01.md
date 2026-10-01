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

## Status: PASS
