# Theekshy Req4 — Implementation Record
**Date:** 2026-07-16 | **File:** Staff-requirements/pages/theekshy.html | **Status:** COMPLETE

---

## Changes Made

### 1. CSS — added before `</style>`
New classes scoped to Panel 4 only:
- `.snapshot-banner` — orange alert bar (role="alert", "Snapshot – Not Live")
- `.badge-in-stock`, `.badge-oos`, `.badge-gtf`, `.badge-upcoming`, `.badge-unk` — stock status badges
- `.badge-gmc-match`, `.badge-gmc-crit`, `.badge-gmc-warn`, `.badge-gmc-na` — GMC comparison badges
- `.freshness-panel`, `.fp-item` — data freshness metadata panel
- `.local-note` — localStorage action decisions disclaimer

### 2. Panel 4 HTML — replaced placeholder `<div class="placeholder">`
Full dashboard structure:
- Snapshot banner (orange, role="alert")
- Header with req-tag, title, sub-heading, status chips
- Data freshness panel (5 fields: Mode, Latest Source Date, Generated At, Refresh Method, Data Sources)
- 2 `.info-note` blocks (source chain info + data limitation warning)
- `#r4KpiCards` — 8 KPI summary cards
- 4 filter `<select>` elements: r4CampFilter, r4StockFilter, r4GmcFilter, r4ActFilter
- `#r4Search` search input
- Reset filters + Export CSV buttons
- 14-column `<table>` with `#r4Tbody`
- localStorage action decisions notice
- Validation box (19 items: 17 PASS, 2 WARN)
- Business rules footnote

### 3. JavaScript — inserted before `// INIT`

**R4_DATA[] — 60 product rows**
- 30 THEE_MYSTERY (23684837882) + 30 THEE_GEMS (23714290257)
- Fields: `{pid, cid, camp, sku, vtitle, url, inv, gmc_avail, gmc_p, cost, upd}`
- `inv`: integer from SUM(local_inventory_current_stock_location_wise), null for 20 parent products
- `gmc_avail`: string from merchant_products.availability, null for 57/60 products
- Source data date: 2026-07-15

**Functions:**
| Function | Purpose |
|---|---|
| `r4StockStatus(inv)` | Priority-order stock classification (5 outcomes) |
| `r4GmcComp(status, gmc_avail)` | GMC comparison (5 outcomes) |
| `r4RecommendedAction(status, gmc)` | Advisory action string matching CSV spec |
| `r4StockBadge(s)` | Stock status badge HTML |
| `r4GmcBadge(g)` | GMC comparison badge HTML |
| `r4GetDecision(pid)` | Read action decision from localStorage |
| `r4SetDecision(pid, val)` | Write action decision to localStorage + re-render |
| `applyR4Filters()` | Filter table by camp / stock / gmc / action / search |
| `resetR4Filters()` | Clear all filters |
| `r4Notes(r, status)` | Contextual advisory note per row |
| `renderR4Table()` | Full table render with filter state |
| `renderR4Kpis()` | 8 KPI card render |
| `r4ExportCsv()` | 14-column CSV download (filename: theekshy-stock-status-snapshot-2026-07-16.csv) |
| `initR4()` | Bootstrap: set r4Filtered, render table + KPIs, set generated-at timestamp |

### 4. showTab(n) updated
Added `if(n===4){...}` block — lazy re-init and re-render when Stock Status tab activated.

### 5. INIT section updated
Added `initR4()` inside try/catch after R3 init block.

---

## Post-CSV Fix (2026-07-16)

After reading Theekshy's CSV spec, 3 action texts corrected in `r4RecommendedAction()`:

| Status | Before Fix | After Fix |
|---|---|---|
| Going to Finish | Restock Alert Required | Send Restock Alert; Consider Budget Trim; Do Not Pause Yet |
| Out of Stock | Pause Required; GMC Update Required | Pause Ads Immediately; Set GMC to Out of Stock; Exclude from PMax Listing Group |
| Coming Soon | Prepare Assets; Hold Spend Until Launch | Set GMC to Preorder; Prepare Asset Group + PDP; Hold Spend Until Launch |

Also updated `r4Notes()` text for Out of Stock and Going to Finish rows to match CSV language.
