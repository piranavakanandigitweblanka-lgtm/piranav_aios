# Closure — Germany Sales Decline Dashboard

## Title
Piranav — Germany Sales Decline Stock Impact Dashboard (Warehouse Owner Review)

## Date
2026-07-23

## Member
Piranav

## Team
Warehouse / Operations Intelligence

## Requirement
Germany Sales Decline Analysis — static dashboard for warehouse-owner review showing products losing German sales due to zero centralized DE warehouse stock.

## Requirement Source
Warehouse owner verbal brief — German market stock impact analysis

---

## Requirement ID Map

| ID | Report | Status |
|---|---|---|
| PIRANAV-DE-2026-07-23-1A | Amazon DE Best Sellers OOS | ✅ COMPLETE |
| PIRANAV-DE-2026-07-23-1B | eBay DE Best Sellers OOS | ✅ COMPLETE |
| PIRANAV-DE-2026-07-23-1C | Shopify DE Best Sellers OOS | ✅ COMPLETE |
| PIRANAV-DE-2026-07-23-02 | Channel-Wise Stock Impact | ✅ COMPLETE |
| PIRANAV-DE-2026-07-23-03 | Slow Restocking / Lost Revenue | ✅ COMPLETE |
| PIRANAV-DE-2026-07-23-04 | Fast-Moving / Never OOS | ✅ COMPLETE |
| PIRANAV-DE-2026-07-23-X1 | Google Ads DE — High Demand No Stock | ⛔ DEFERRED — SKU match coverage 0.3% |

---

## PostgreSQL Sources

| Schema | Tables Used |
|---|---|
| `order_management` | `orders`, `order_line_items` |
| `inventory` | `local_inventory_current_stock_location_wise` |
| `listings` | `shopify_listings`, `ebay_listings` |
| `amazon_campaigns` | `performance_data` |
| `ebay_campaigns` | `performance_data`, `ads` |
| `google_ads` | `product_performance` |
| `suppliers` | `orders`, `order_items` |

**Germany filter:** `order_management.market_place = 10`  
**DE stock filter:** `inventory.local_inventory_current_stock_location_wise WHERE warehouse_location = 'Germany'`

---

## Files Changed

| File | Description |
|---|---|
| `Staff-requirements-02/germany-sales-decline-dashboard/index.html` | Hub page — 10 active accounts, 4 live reports, Wayfair removed, Google Ads deferred card removed |
| `Staff-requirements-02/germany-sales-decline-dashboard/pages/report-1a-amazon-de.html` | Amazon DE OOS — 329 products, 2 accounts, PPC tab |
| `Staff-requirements-02/germany-sales-decline-dashboard/pages/report-1b-ebay-de.html` | eBay DE OOS — 288 products, 6 accounts, PPC tab |
| `Staff-requirements-02/germany-sales-decline-dashboard/pages/report-1c-shopify-de.html` | Shopify DE OOS — 52 products, Google Ads PPC tab |
| `Staff-requirements-02/germany-sales-decline-dashboard/pages/report-3-channel-wise.html` | Channel-Wise — 634 OOS SKUs |
| `Staff-requirements-02/germany-sales-decline-dashboard/pages/report-4-slow-restock.html` | Slow Restock — 634 OOS SKUs, supplier pipeline |
| `Staff-requirements-02/germany-sales-decline-dashboard/pages/report-5-never-oos.html` | Never OOS — 1,381 in-stock DE SKUs |
| `Staff-requirements-02/germany-sales-decline-dashboard/DASHBOARD-DOCUMENTATION.md` | Full technical documentation |

---

## Evidence

| Evidence | Path |
|---|---|
| Discovery evidence (pre-build) | `evidence/germany-marketplace-stock-sales-decline-discovery-2026-07-23.md` |
| Amazon DE OOS raw data | `evidence/report-1a-amazon-de-best-sellers-oos-with-images-2026-07-23.csv` |
| Execution recovery report | `closure/piranav/germany-dashboard-execution-recovery-2026-07-23.md` |
| Duplicate risk review | `closure/piranav/germany-dashboard-duplicate-risk-2026-07-23.md` |
| Technical documentation | `Staff-requirements-02/germany-sales-decline-dashboard/DASHBOARD-DOCUMENTATION.md` |

---

## Asset Path

`Staff-requirements-02/germany-sales-decline-dashboard/`

## Evidence Path

`evidence/germany-marketplace-stock-sales-decline-discovery-2026-07-23.md`

## GitHub Path / Commit

Not committed — dashboard folder is untracked (`??` git status). Commit required before next session.

## Vercel Deployment

**Production:** https://staff-requirements-02.vercel.app/germany-sales-decline-dashboard/  
**Vercel Project:** `staff-requirements-02`  
**Deploy Method:** `vercel --prod --yes` from `Staff-requirements-02/` directory

---

## Queryability Result

**YES** — This closure note, the discovery evidence, and the technical documentation together allow a new session to fully understand:
- What was built and why
- Which data sources and schemas were used
- Which formulas were applied
- Which reports are live and which were deferred
- Where the live URL is
- What risks exist
- What needs to happen next

---

## Reviewer Needed

| Role | Name | Action Required |
|---|---|---|
| Business / Warehouse Owner | — | Confirm lost sales estimates are acceptable proxies before sharing externally |
| Coordinator / Varmen | Varmen | Review and approve closure; confirm git commit scope |

---

## Known Risks

| Risk | Detail |
|---|---|
| Formula approvals undocumented | OOS proxy, lost sales formula, min stock formula were approved verbally — not written to evidence |
| Discovery evidence status stale | Still reads "CONDITIONAL PASS — no reports built" — needs updating to reflect completed build |
| No git commit | All HTML files are untracked. If repo is reset, the build is lost. |
| Estimates are proxies | Lost sales figures are estimates based on last order date × daily sales rate. Not confirmed actuals. Business-owner validation required before external sharing. |

---

## Next Action

| Priority | Action |
|---|---|
| 1 | Git commit `Staff-requirements-02/germany-sales-decline-dashboard/` folder |
| 2 | Update `evidence/germany-marketplace-stock-sales-decline-discovery-2026-07-23.md` — change status to PASS, note build completed |
| 3 | Write formula approval note to evidence folder |
| 4 | Warehouse owner to review and validate figures before external distribution |

---

## Summary

Six static HTML report pages built and deployed to Vercel for Germany warehouse-owner review. Dashboard covers Amazon DE (329 OOS products, €36,718 est. lost), eBay DE (288 OOS products, €59,657 est. lost), Shopify DE (52 OOS products, €3,074 est. lost), channel-wise cross-channel comparison (634 OOS SKUs, €51,494 combined), slow restock pipeline (577 SKUs with no supplier order), and fast-moving stock health (1,381 in-stock SKUs, 7 below minimum). Google Ads report deferred due to 0.3% SKU match coverage. Wayfair removed — dormant since 2025-01-07. All data embedded in HTML as static JS arrays. No backend. OOS date proxy = last order date (no stock history table exists in DB). Formula: lost sales = daily rate × days OOS. Build was clean but AIOS closure was not written at session end — this set of closure documents recovers the gap.

---

## PASS / FAIL

**⚠️ CONDITIONAL PASS**

Build complete and live. Evidence partially exists. Documentation gap now filled by this recovery session. Full PASS requires: git commit + discovery evidence status update + formula approval note.
