# Prompt: Sajeepan R4 Feed Optimization — Advanced Filter Panel

**Registered:** 2026-09-18
**Status:** ACTIVE
**Category:** implementation

## What This Builds

Add a comprehensive "Advanced Filters" collapsible panel to each section in FeedOptimization.jsx:
- Level 1, 2, 3 tables
- Optimized Products Data section

## Filter Fields Required (per Sajeepan PDF)

Date — already at global level (date range presets, keep as-is)

Per section panel:
- Campaign (dropdown — unique campaign names from data)
- Min/Max Impressions
- Min/Max Clicks
- Min/Max Cost (£)
- Min/Max Conversion Value (£)
- Min/Max CTR (%)
- Min/Max Conversions
- Min/Max Conv. Rate (conv/clk*100)
- Min/Max ROAS (%)
- Min/Max Price (£)

## Available Data Fields (from backend req4)

Each product row has: `item`, `variant_id`, `cid`, `camp_name`, `cost`, `cv` (conv value), `conv`, `imp`, `clk`, `roas`, `ctr`, `price`, `sku`, `avail`, `img`, `title`, `tracker`

Conv. rate = `p.clk > 0 ? (p.conv / p.clk * 100) : 0` — compute on frontend

## UX Pattern

- Keep existing primary threshold filters (Min Cost L1, Max ROAS L2, Min Imps + Max CTR L3)
- Add "▼ Filters" toggle button per section
- Collapsible panel shows: Campaign dropdown + numeric min/max inputs per metric
- "Clear Filters" button resets all to empty
- State: one object per section `{ camp, minCost, maxCost, minImps, ... }`
- useMemo applies all filters after existing threshold + text search + status filters

## Files

- `dm-dashboard/frontend/src/sajeepan/pages/FeedOptimization.jsx` only
- No backend changes needed

## Key Constraints

- Campaign IDs come from `cid` field; names from `camp_name`
- Unique campaigns computed from `[...level1, ...level2, ...level3]`
- Keep existing text search + status filter + threshold filter — advanced filters stack on top
- No page reset on filter clear — keep pagination where user is
