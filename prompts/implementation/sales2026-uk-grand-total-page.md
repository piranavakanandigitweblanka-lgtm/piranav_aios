---
name: sales2026-uk-grand-total-page
description: Add a 4th sub-tab "UK Total" under Sales 2026 in the DM Dashboard admin panel. Shows grouped UK sales totals live with a month range filter.
metadata:
  type: implementation
  date: 2026-09-17
---

## Prompt

Add a new "UK Total" sub-tab (4th item) under the "Sales 2026" nav group in the DM Dashboard admin panel (`AdminLayout.jsx`). The existing 3 sub-tabs are DE, UK, FR.

### Page: UK Grand Total

**File:** `dm-dashboard/frontend/src/admin/pages/Sales2026.jsx`

**Groups to display:**
- ADS TOTAL = DM-Ad + Sonya + Sajeepan + Thishoban + Theekshy + Thanishtika + CPPC
- EMAIL TOTAL = Sukirtha
- SEO TOTAL = Kamsi + Dilaksi + Organic
- META TOTAL = Meta
- DIRECT = Direct
- NOT ASSIGNED = Not Assigned
- UK GRAND TOTAL = sum of all above

**Endpoints used (existing, no new backend):**
uk-dm-ad, uk-sonya, uk-sajeepan, uk-thishoban, uk-theekshy, uk-thanishtika, uk-cppc, uk-sukirtha, uk-kamsi, uk-dilaksi, uk-organic, uk-meta, uk-direct, uk-not-assigned

**UI:**
- Month range filter: From month → To month (default: 2026-01 → current month)
- Fetch all 14 endpoints × selected month range in parallel on the frontend
- Show combinedSummary.netSales per endpoint per month, summed into groups
- Display as KPI cards (one per group) + summary table
- Live chip + Refresh button
- Currency: £ (GBP)

**Nav change:**
In `AdminLayout.jsx`, add `{ key: 'sales2026-uk-total', label: 'UK Total' }` as 4th child under sales2026.
In the router/render logic, add a case for `sales2026-uk-total` rendering `<UkGrandTotalView />`.

**Constraints:**
- No backend changes
- No attribution rule changes
- No new API endpoints
- Reuse existing `CampaignChannelPanel` pattern where possible
