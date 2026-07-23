# Handover Note — Germany Sales Decline Dashboard — 2026-07-23

## Session Summary

Germany Sales Decline dashboard was built across two Claude Code sessions (context ran out mid-first session, resumed in second). Discovery phase was completed and documented correctly. Build phase was completed but AIOS closure was not written at session end. A third recovery session (this one) was run to fill the documentation gap. No production logic was changed in the recovery session — only AIOS documentation was created.

Dashboard is live at: https://staff-requirements-02.vercel.app/germany-sales-decline-dashboard/

## Completed Tasks

| ID | Task | Result |
|---|---|---|
| PIRANAV-DE-2026-07-23-1A | Amazon DE OOS report — 329 products, 2 accounts, PPC tab | PASS |
| PIRANAV-DE-2026-07-23-1B | eBay DE OOS report — 288 products, 6 accounts, PPC tab | PASS |
| PIRANAV-DE-2026-07-23-1C | Shopify DE OOS report — 52 products, Google Ads PPC tab | PASS |
| PIRANAV-DE-2026-07-23-02 | Channel-Wise Stock Impact — 634 SKUs, per-channel breakdown | PASS |
| PIRANAV-DE-2026-07-23-03 | Slow Restock / Lost Revenue — 634 SKUs, supplier pipeline | PASS |
| PIRANAV-DE-2026-07-23-04 | Fast-Moving / Never OOS — 1,381 in-stock SKUs, stock health | PASS |
| AIOS-RECOVERY | Closure + handover + duplicate risk + execution recovery docs | PASS |

## In-Progress (Not Closed)

| ID | What Remains | Next Step |
|---|---|---|
| PIRANAV-DE-2026-07-23-X1 | Google Ads DE report — deferred, SKU match 0.3% | Awaiting mpn data population or alternative join route approval |
| GIT-COMMIT | Dashboard folder untracked in git | Commit `Staff-requirements-02/germany-sales-decline-dashboard/` |
| EVIDENCE-UPDATE | Discovery evidence status stale | Update `evidence/germany-marketplace-stock-sales-decline-discovery-2026-07-23.md` |
| FORMULA-APPROVAL | OOS proxy and lost sales formulas approved verbally only | Write approval note to `evidence/piranav/` |

## Blocking Issues

- None blocking the live dashboard — it is fully deployed and functional
- Git commit unblocked — can be done by next session
- Formula approval documentation requires warehouse owner to confirm in writing

## State at Handover

- Git status: `germany-sales-decline-dashboard/` folder is **untracked** (`??`) — no commit exists
- Committed: NO
- Pushed: NO (Vercel was deployed directly via CLI, not via git push)

## Key Facts for Next Session

| Fact | Detail |
|---|---|
| Germany marketplace ID | `order_management.market_place = 10` |
| DE stock source | `inventory.local_inventory_current_stock_location_wise WHERE warehouse_location = 'Germany'` |
| OOS proxy | `MAX(order_date)` = last order date per SKU |
| Lost sales formula | `(annual_revenue / 365) × days_oos` |
| Min stock formula | `(annual_qty / 12) × 1.5` |
| Shopify DE sub_source | `108` |
| Amazon DE sub_sources | `8` (LEDSone), `6` (DC Voltage) |
| eBay DE sub_sources | `1, 28, 27, 22, 4, 222` |
| Google Ads DE account_id | `9031058245` |
| Vercel project | `staff-requirements-02` |
| Deploy command | `vercel --prod --yes` from `Staff-requirements-02/` |

## Files Created This Recovery Session

```
closure/piranav/germany-dashboard-execution-recovery-2026-07-23.md
closure/piranav/germany-dashboard-duplicate-risk-2026-07-23.md
closure/piranav/germany-dashboard-closure-2026-07-23.md
handover/piranav/germany-dashboard-handover-2026-07-23.md   ← this file
Staff-requirements-02/germany-sales-decline-dashboard/DASHBOARD-DOCUMENTATION.md
```

## Next Session Must

1. Read this handover note first
2. Git commit `Staff-requirements-02/germany-sales-decline-dashboard/` — include all 7 HTML files and DASHBOARD-DOCUMENTATION.md
3. Update `evidence/germany-marketplace-stock-sales-decline-discovery-2026-07-23.md` — change status from CONDITIONAL PASS to PASS, note build completed 2026-07-23
4. Add formula approval note to `evidence/piranav/germany-formula-approvals-2026-07-23.md`
5. If warehouse owner wants Google Ads report: investigate mpn population or product_id → Shopify variant ID → SKU join route

## Handed Over By

Piranav / Claude Code — 2026-07-23

## Received By

PENDING — next session
