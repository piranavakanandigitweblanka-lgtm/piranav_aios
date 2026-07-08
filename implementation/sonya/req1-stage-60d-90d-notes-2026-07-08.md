# Implementation Notes — Sonya Req 1 Stage Section 60d & 90d

## Title
Sonya Req 1 — Stage of the Ads updated to 60-day and 90-day performance

## Date
2026-07-08

## Decision
Replace Stage section (Last 30 Days + Before Last) with 60 Days Performance + 90 Days Performance following Sonya's spreadsheet column: "Stage of the ads 60 days and 90 days".

## Why the Change Was Made
The previous Stage section showed the same 30-day window as the main table columns (Cost 30d, Conversions, Conv Value, ROAS). This was redundant — Sonya's spreadsheet specifies the Stage column should show longer-term trend data (60d and 90d), not a repeat of the 30-day summary.

## Implementation Details

### RAW Array Changes
- Added `d60` object per campaign: cost, cv, conv, roas for 2026-05-09 to 2026-07-07
- Added `d90` object per campaign: cost, cv, conv, roas for 2026-04-09 to 2026-07-07
- Kept `l30` object unchanged (used by main table Cost/Conversions/Conv Value/ROAS columns)
- Removed `bl` object (Before Last — no longer needed)

### stageHTML() Changes
- `blk('Last 30 Days ...', c.l30)` → `blk('60 Days Performance (2026-05-09 – 2026-07-07)', c.d60)`
- `blk('Before Last ...', c.bl)` → `blk('90 Days Performance (2026-04-09 – 2026-07-07)', c.d90)`
- Simplified noData condition (no longer label-dependent)

### Table Header
- "Stage of Ads — Last 30 Days / Before Last" → "Stage of Ads — 60 Days & 90 Days"

### Date Logic

**60-Day Window:**
- Reference date: 2026-07-07 (day before today, last complete day)
- Window: 2026-05-09 (60 days before 2026-07-07) to 2026-07-07
- SQL: `date >= '2026-05-09' AND date <= '2026-07-07'`

**90-Day Window:**
- Reference date: 2026-07-07
- Window: 2026-04-09 (90 days before 2026-07-07) to 2026-07-07
- SQL: `date >= '2026-04-09' AND date <= '2026-07-07'`

### What Was NOT Changed
- Main table columns: Campaign Name, Campaign ID, Budget, Cost (30d), Conversions, Conv Value, ROAS, Segment
- KPI cards (all reference l30 which is unchanged)
- Filters, search, sort, export CSV
- Navigation tabs
- Header, info note, footnotes structure
- Data source (public.ppc_etl_performance_data, record_type=campaign, source=3)

## Files Changed
- `Staff-requirements/pages/sonya.html`
