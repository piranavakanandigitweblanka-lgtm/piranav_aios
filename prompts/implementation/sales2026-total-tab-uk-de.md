---
name: sales2026-total-tab-uk-de
description: Rename UK Total nav tab to Total and add UK/DE switcher inside — DE grouped as Organic/Ads/Email, UK as existing 6 groups
metadata:
  type: implementation
---

## Task

Refactor the Sales 2026 "UK Total" admin tab into a unified "Total" tab that supports both UK and DE region views via an internal switcher toggle.

## Files to Edit

- `dm-dashboard/frontend/src/admin/pages/Sales2026.jsx`
- `dm-dashboard/frontend/src/admin/AdminLayout.jsx`

## What to Build

### Nav change (AdminLayout.jsx)
- Rename nav child label: `UK Total` → `Total`
- Key stays the same: `sales2026-uk-total`

### Sales2026.jsx changes

**1. Rename export `UkGrandTotalView` → `GrandTotalView`**
- Add a `region` state defaulting to `'uk'`
- Add a UK | DE toggle (same style as Jeffri's channel tabs: `.jreq-channel-tabs`)
- When `region === 'uk'` → render existing UK groups view (unchanged)
- When `region === 'de'` → render new DE groups view

**2. DE Groups config (`DE_GROUPS`):**

| Group | Key | Color | Endpoints |
|---|---|---|---|
| ADS | ads | #1a56db | mahima-ads, jeffri-ads, jeffri-meta, thasitha-ads |
| ORGANIC | organic | #057a55 | mahima-organic, sukirtha-organic |
| EMAIL | email | #d97706 | sukirtha-email |

Currency for DE: € (Euro)

**3. DE data fetching:**
- Same pattern as UK: `Promise.all` across all DE endpoints for selected month
- Use `combinedSummary.netSales` from each endpoint response
- Single month picker (same as UK view)

**4. DE UI:**
- Same layout as UK view: header + LIVE badge + month picker + Refresh
- KPI cards: DE Grand Total (large) + 3 colour-coded group cards with icons + % of total
- CSS bar chart + SVG donut chart + breakdown table with expand/collapse
- Currency symbol: € throughout

## Key Constraints
- UK view must remain exactly as built — no regression
- UK currency £, DE currency €
- Each region fetches independently — no mixing of £ and €
- Month picker state is shared between UK and DE (same selected month applies to both views)
- `CURRENT_MONTH` auto-clock already handles month list — no manual edits needed
- Backend endpoints for DE already exist: `/api/sales/mahima-ads`, `/api/sales/mahima-organic`, `/api/sales/jeffri-ads`, `/api/sales/jeffri-meta`, `/api/sales/thasitha-ads`, `/api/sales/sukirtha-email`, `/api/sales/sukirtha-organic`

## Expected Output
- One "Total" nav tab
- Inside: UK | DE toggle
- UK view: unchanged (6 groups, £)
- DE view: 3 groups (ADS/ORGANIC/EMAIL, €), same visual layout
