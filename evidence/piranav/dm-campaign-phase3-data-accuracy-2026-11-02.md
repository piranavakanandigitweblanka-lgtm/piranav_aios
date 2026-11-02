---
name: dm-campaign-phase3-data-accuracy-2026-11-02
description: Phase 3 read-only data accuracy and API validation audit for DM Campaign Overall Performance page. Independent SQL vs API comparison across All Time and multiple date ranges. 2026-11-02.
metadata:
  type: evidence
---

# DM Campaign — Overall Performance: Phase 3 Data Accuracy & API Validation

**Date:** 2026-11-02
**Type:** Read-only data accuracy audit
**Auditor:** Claude Code (Phase 3 of 3)
**Scope:** google_ads schema, order_management.orders, listings.shopify_listings, local backend API

---

## 1. Git Safety Check

| Check | Result |
|---|---|
| Branch | piranv-work |
| Remote | websitetecteam-arch/dm-dashboard |
| Working tree | Clean — no uncommitted changes |
| READ-ONLY rule | No source code modified, no DB writes, no server changes |

---

## 2. Campaign Inventory (Google Ads)

**Query:** `SELECT campaign_id, campaign_name, account_id, budget, campaign_status, group_name FROM google_ads.campaigns WHERE group_name = 'DM' ORDER BY campaign_status, campaign_id`

| campaign_id | Name | Account | Budget | Status |
|---|---|---|---|---|
| 20810136438 | Pmax UK \| Muguntha \| Shoptimised \| GB \| DM 46 All \| MCV \| UK | 4503486236 | £400.00 | ENABLED |
| 24199938236 | Shopping UK \| Muguntha \| Klarna \| DM46_2_KL_AGU \| DM 46 2 New \| TROAS \| UK | 4503486236 | £120.00 | ENABLED |
| (5 PAUSED) | Various | 2786236184 | £3.00–£10.00 | PAUSED |

Total DM campaigns: 7. ENABLED: 2. PAUSED: 5. Backend correctly filters `campaign_status = 'ENABLED'`.

---

## 3. Date Bounds

**Query:** `SELECT MIN(date), MAX(date), COUNT(DISTINCT date), COUNT(*) FROM google_ads.campaign_performance WHERE campaign_id IN (ENABLED DM campaigns)`

| Field | Value |
|---|---|
| data_min | 2023-11-28 |
| data_max | 2026-10-21 |
| distinct_dates | 1,059 |
| total_rows | 1,110 |

Note: data stops at 2026-10-21. Requesting Oct 1–31 correctly clamps to Oct 21 (`_resolve_range()` PASS).

---

## 4. Independent SQL vs API Comparison — All Time

### SQL (direct DB)
```sql
SELECT SUM(impressions), SUM(clicks), ctr, ROUND(SUM(cost),2), SUM(conversions), SUM(conversion_value), roas
FROM google_ads.campaign_performance cp
JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
WHERE c.group_name = 'DM' AND c.campaign_status = 'ENABLED'
```

| Metric | SQL Result | API Result | Match |
|---|---|---|---|
| Impressions | 34,800,553 | 34,800,553 | ✅ |
| Clicks | 458,499 | 458,499 | ✅ |
| CTR | 1.32% | 1.32% | ✅ |
| Cost | £193,387.27 | £193,387.27 | ✅ |
| Conversions | 19,924.25 | 19,924.25 | ✅ |
| Conv. Value | £641,168.93 | £641,168.93 | ✅ |
| ROAS | 331.55% | 331.55% | ✅ |

### Per-Campaign (All Time)

| Campaign | Impressions | Clicks | CTR | Cost | Conversions | Conv. Value | ROAS |
|---|---|---|---|---|---|---|---|
| Pmax (20810136438) | 34,132,589 | 448,334 | 1.31% | £189,692.99 | 19,677.76 | £631,480.22 | 332.90% |
| Shopping Klarna (24199938236) | 667,964 | 10,165 | 1.52% | £3,694.28 | 246.49 | £9,688.71 | 262.26% |

SQL and API are in exact agreement on all per-campaign figures.

---

## 5. Date Range Validation

| Range | Impressions | Clicks | CTR | Cost | Conversions | Conv. Value | ROAS | DB=API |
|---|---|---|---|---|---|---|---|---|
| Oct 1–7, 2026 | 483,511 | 7,384 | 1.53% | £2,993.08 | 264.36 | £8,889.90 | 297.02% | ✅ |
| Oct 1–21, 2026 | 1,440,126 | 21,977 | 1.53% | £8,545.52 | 763.13 | £24,796.48 | 290.17% | ✅ |
| Oct 1–31, 2026 | 1,440,126 | 21,977 | 1.53% | £8,545.52 | 763.13 | £24,796.48 | 290.17% | ✅ |
| All Time | 34,800,553 | 458,499 | 1.32% | £193,387.27 | 19,924.25 | £641,168.93 | 331.55% | ✅ |

**Oct 1–31 correctly clamped to Oct 21** (`resolved_end=2026-10-21`) — `_resolve_range()` works as designed.

---

## 6. Single Day Spot-Check (2026-10-21)

| Campaign | Impressions | Clicks | CTR | Cost | Conversions | Conv. Value | ROAS |
|---|---|---|---|---|---|---|---|
| Pmax | 8,623 | 104 | 1.21% | £42.44 | 1.50 | £40.46 | 95.33% |
| Shopping Klarna | 526 | 4 | 0.76% | £2.44 | 0.00 | £0.00 | 0.00% |

Note: ROAS=0.00% on Shopping Klarna (no conversions that day) — `_flag_for()` would classify this as `zeroconv`. ROAS=NULL would be cleaner but the backend returns 0.00 when cost>0 and conv_value=0. This is **not a bug** — it correctly represents zero return on spend that day; however flagging logic treats it as a `zeroconv` day correctly.

---

## 7. Backend API Authentication Verification

- `make_admin_task_auth("tools.DmCampaign")` — `role='dev'` auto-bypasses (confirmed in code: "only 'dev' does")
- JWT generated with `role='dev'` successfully called all endpoints
- `GET /api/admin/dm-campaign/summary?mode=all` → 200 OK, full JSON response
- `GET /api/admin/dm-campaign/summary?mode=custom&start=2026-10-01&end=2026-10-07` → 200 OK
- All responses include correct `dateRange.dataMin`, `dateRange.dataMax`, `dateRange.mode`, and `dateRange.end` clamping

---

## 8. Constants Verification: sub_source_id=38, market_place='23'

These constants are used in `order_management.orders` (not `listings.shopify_listings`).

**Verification query result:**
```
sub_source_id=38, market_place='23': 43,887 orders, 2020-01-05 to 2026-11-01
```

**CONFIRMED VALID.** This is a real, active UK Shopify order stream (LEDSone UK).

**Important clarification:** `listings.market_place_id_mapping` table has `id=23 = United Arab Emirates`. This is a DIFFERENT table used for Amazon/eBay marketplace codes. It has NO relation to `order_management.orders.market_place`. The backend constants are correct.

**UK LEDSone listing channel filter:** `listings.shopify_listings` uses `channel='LEDSone'` (not sub_source or market_place) — `sub_source=104` for UK LEDSone listings, confirmed by distinct channel/sub_source audit.

---

## 9. ROAS Display Analysis (BUG-01 Re-verification)

Backend calculates: `(conversion_value / cost) * 100` — stored as percentage value.
- All Time: 641168.93 / 193387.27 × 100 = **331.55%** ← displayed via `pct()` as "331.55%"
- Business meaning: **3.32× return on ad spend**
- Standard industry display: "3.32×" or "332%" (i.e., 3.32× ROAS = 332% return including original spend)

The current display "331.55%" is the correct mathematical output of the formula. Whether it should show as "3.32×" is a UX/design decision, not a data accuracy issue. **Data is accurate.**

---

## 10. Backend Startup Note

- Port 8499 was already occupied by a prior uvicorn process from earlier in this session
- Health check `http://127.0.0.1:8499/api/health` → `{"status":"ok"}`
- App imports confirmed clean (no startup errors)
- All API calls succeeded with `role='dev'` JWT

---

## 11. Summary: All Verification Points

| Check | Status | Notes |
|---|---|---|
| Campaign inventory (7 DM, 2 ENABLED) | PASS | Matches code comment from 2026-09-09 |
| Date bounds (2023-11-28 to 2026-10-21) | PASS | 1,059 distinct dates, 1,110 rows |
| All Time SQL = API (all 7 metrics) | PASS | Exact match to 2dp |
| Oct 1–7 SQL = API | PASS | Exact match |
| Oct 1–21 SQL = API | PASS | Exact match |
| Oct 1–31 clamps to Oct 21 | PASS | `_resolve_range()` correct |
| sub_source_id=38, market_place='23' | PASS | 43,887 real UK Shopify orders |
| market_place_id_mapping id=23 is UAE | INFO | Different table — not a bug |
| UK listing channel='LEDSone' | PASS | sub_source=104 for UK LEDSone |
| Backend API responding | PASS | `{"status":"ok"}` on port 8499 |
| No source code modified | PASS | READ-ONLY audit |
| No DB writes | PASS | All SELECT queries only |

**Overall: PASS — all KPI calculations accurate, API matches DB, date clamping works correctly.**
