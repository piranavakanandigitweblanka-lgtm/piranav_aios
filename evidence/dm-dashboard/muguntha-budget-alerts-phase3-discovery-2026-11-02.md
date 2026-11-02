---
name: muguntha-budget-alerts-phase3-discovery-2026-11-02
description: Phase 3 discovery for Muguntha Budget Alerts early budget change monitoring. Full schema, sync frequency, dedup strategy, ROAS data source, implementation plan. 2026-11-02.
metadata:
  type: evidence
---

# Evidence: Budget Alerts Phase 3 — Early Budget Change Monitoring Discovery

**Date:** 2026-11-02
**Type:** Read-only inspection
**Status:** COMPLETE — awaiting implementation approval

---

## 1. Git Safety Report

### DM Dashboard (`piranav_aios/dm-dashboard`)

| Field | Value |
|---|---|
| Branch | `piranv-work` |
| Remote | `https://github.com/websitetecteam-arch/dm-dashboard.git` |
| Unstaged changes | `muguntha_budget_alerts.py`, `test_muguntha_budget_alerts.py`, `BudgetAlerts.jsx` (Phase 1 + 2 work) |
| Commits ahead of origin/piranv-work | 5 (pre-existing, unrelated to budget alerts) |
| New commits on origin/main | `ba64c81` — merged `dev-work` to main (unrelated feature) |
| Conflict risk | **NONE** — we are on `piranv-work`, not `main`. New origin/main commits do not affect our branch. |
| Phase 1+2 committed? | **NO — working tree only. Safe to continue.** |

**Action required before Phase 3 implementation:** None. Existing unstaged work is preserved. Phase 3 adds a new file, it does not modify existing Phase 1/2 files.

---

## 2. Existing Architecture

### Two databases, two connections

| Connection | DB Host | DB Name | Used For |
|---|---|---|---|
| `get_conn()` | 158.220.99.127 | dm_dashboard | `muguntha_budget_alerts` table, snapshots |
| `get_business_conn()` | 169.58.91.229 | ledsone | `google_ads.campaigns`, `google_ads.campaign_performance`, `google_ads.google_ads_change_events` |

**Important:** `muguntha_budget_alerts` is in dm_dashboard DB (not accessible via MCP tools). `google_ads_change_events` is in ledsone DB (accessible via `mcp__ledsone-db-mcp__execute_sql_ledsone`).

### Scheduler

`ScheduledSnapshot` class (`backend/app/core/scheduled_snapshot.py`) — runs `compute_fn()` on a background thread, with retry logic, sync history logging, and pause/resume support.

Current budget alerts evaluation: `interval_hours=6` — runs every 6 hours.

Phase 3 will use the same `ScheduledSnapshot` pattern with its own `interval_hours` (recommended: 2 hours — see Section 4 for reasoning).

### Muguntha scope — 3 accounts only

| customer_id | Currency | Market |
|---|---|---|
| 4503486236 | GBP | UK |
| 9031058245 | EUR | DE |
| 1266953046 | EUR | FR |

Accounts outside scope (not alerted): 1391711507 (USA), 5031344372 (Besbet), 6875441845 (unknown), 2786236184 (unknown).

---

## 3. Actual `google_ads_change_events` Schema

**Confirmed 2026-11-02 against live ledsone DB.**

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | bigint | NO | PK, auto-increment |
| `customer_id` | varchar | NO | Google Ads account ID |
| `sub_source` | integer | YES | Internal DM tracking |
| `campaign_id` | bigint | YES | **NULLABLE** — 12 rows NULL (shared budgets / new campaigns) |
| `campaign_name` | varchar | YES | Nullable when campaign_id is NULL |
| `change_date_time` | timestamp (no tz) | YES | When change happened in Google Ads |
| `user_email` | varchar | YES | Who made the change |
| `client_type` | varchar | YES | e.g. `GOOGLE_ADS_WEB_CLIENT`, `GOOGLE_ADS_RECOMMENDATIONS` |
| `change_resource_type` | varchar | YES | Always `CAMPAIGN_BUDGET` for budget changes |
| `change_resource_name` | varchar | YES | `customers/{cid}/campaignBudgets/{bid}` |
| `resource_change_operation` | varchar | YES | Always `UPDATE` for budget changes |
| `changed_fields` | text | YES | Always `amountMicros` for budget changes |
| `change_type` | varchar | YES | `budget`, `tROAS`, `status`, `other`, `bid_strategy` |
| `old_value` | varchar | YES | Budget in **micros** — divide by 1,000,000 for currency |
| `new_value` | varchar | YES | Budget in **micros** — divide by 1,000,000 for currency |
| `old_resource` | jsonb | YES | `{"campaignBudget": {"amountMicros": "..."}}` |
| `new_resource` | jsonb | YES | `{"campaignBudget": {"amountMicros": "..."}}` |
| `row_hash` | char | NO | **UNIQUE index** — confirmed primary dedup key |
| `created_at` | timestamp | YES | When synced to DB |
| `updated_at` | timestamp | YES | Re-stamped on each sync run for some rows |

**Indexes confirmed:**
- `google_ads_change_events_pkey` — UNIQUE on `id`
- `google_ads_google_ads_change_events_row_hash_unique` — UNIQUE on `row_hash`
- Indexes on `campaign_id`, `change_date_time`, `change_type`, `customer_id`

**Value conversion:**
`old_value = "7000000"` → `7000000 / 1000000 = £7.00` (or €7.00)

**IMPORTANT:** `cost` and `conversion_value` in `campaign_performance` are NOT in micros — they are already in local currency. Only `old_value`/`new_value` in `change_events` are micros.

---

## 4. Event Sync Frequency

**Budget changes: 106 total. Sync lag analysis:**

| Metric | Value |
|---|---|
| Min lag (change → created_at) | 0 hours |
| Median lag | **8.1 hours** |
| Average lag | 124 hours (skewed by old backfill from May 2026) |
| Max lag | 685 hours (old backfill) |
| Synced in last 24h | 0 |
| Synced in last 48h | 0 |
| Synced in last 7 days | 3 |
| Latest sync | 2026-10-30 13:05 UTC |

**Sync pattern:** Events arrive in batches, typically once per day per account, clustered around early morning UTC (06:00–10:00 UTC). Not a continuous stream.

**`updated_at` behaviour:** Some rows have `updated_at > created_at` by hours (e.g. id 150983: +66h, id 143015: +23h). This means the sync pipeline re-touches existing rows on subsequent runs. **Do not use `updated_at` as a trigger for new events** — it fires for already-processed rows.

**Recommended polling interval: 2 hours.** Rationale:
- Median sync lag is 8h, so a 2h poll will detect changes on the same day they are synced
- More frequent than every 6h (existing budget evaluation) — appropriate for an alerting system
- No harm in polling and finding nothing new

---

## 5. Deduplication Strategy

**Primary dedup key: `row_hash` (UNIQUE, confirmed)**

Each `google_ads_change_events` row has a unique `row_hash`. 106 budget rows = 106 distinct hashes. No duplicates exist.

**Phase 3 dedup approach:**

Create a new table `public.muguntha_budget_change_monitor` in dm_dashboard DB with:
- `change_event_id` — the `google_ads_change_events.id` of the processed event
- `row_hash` — the `google_ads_change_events.row_hash` of the processed event
- UNIQUE constraint on `row_hash` — prevents re-processing the same event if polling overlaps

**Watermark approach (alternative):**
Store `last_processed_created_at` and query `WHERE created_at > last_processed_created_at AND change_type = 'budget'`. Combined with `row_hash` UNIQUE constraint as a safety net.

**Chosen approach: `row_hash` UNIQUE + `created_at` watermark combined.**
- Watermark prevents full-table scans on every poll
- `row_hash` UNIQUE prevents double-notification if watermark has a race condition

---

## 6. ROAS and Conversion Data Source

**Same queries as existing `muguntha_budget_alerts.py` — reuse directly.**

### 30-day ROAS

```sql
SELECT
    c.campaign_id, c.campaign_name, c.account_id, c.group_name, c.budget, c.campaign_status,
    SUM(cp.cost)             AS cost_30d,
    SUM(cp.conversion_value) AS conv_value_30d,
    SUM(cp.conversions)      AS conversions_30d
FROM google_ads.campaigns c
JOIN google_ads.campaign_performance cp
    ON cp.campaign_id = c.campaign_id
    AND cp.date >= (CURRENT_DATE - INTERVAL '30 days')
    AND cp.date <= CURRENT_DATE - 1
WHERE c.campaign_id = %(campaign_id)s
GROUP BY c.campaign_id, c.campaign_name, c.account_id, c.group_name, c.budget, c.campaign_status
```

- `ROAS = (conv_value_30d / cost_30d) * 100` — percentage (300% = 3× return)
- Currency: `_ACCOUNT_CURRENCY` mapping (existing dict in `muguntha_budget_alerts.py`)

### Previous-month ROAS

Same `_PREV_MONTH_QUERY` from existing module — reuse `_prev_month_bounds()`.

### Rule application

Reuse existing `apply_budget_rule(roas_pct, current_budget, currency, conversions_30d, prev_month_roas)`.

---

## 7. Proposed Alert Logic

### Algorithm

```
POLL every 2 hours:

1. Query ledsone DB for new budget change events:
   SELECT * FROM google_ads.google_ads_change_events
   WHERE change_type = 'budget'
     AND customer_id IN ('4503486236', '9031058245', '1266953046')
     AND campaign_id IS NOT NULL
     AND created_at > {last_processed_created_at}
   ORDER BY created_at ASC

2. For each new event (by row_hash not already in monitor table):

   a. Convert old_value / new_value from micros to currency
      actual_old_budget = int(old_value) / 1_000_000
      actual_new_budget = int(new_value) / 1_000_000
      actual_pct_change = (new - old) / old * 100

   b. Look up previous budget change for this campaign (to determine review date):
      SELECT MAX(change_date_time) FROM google_ads.google_ads_change_events
      WHERE campaign_id = {campaign_id}
        AND change_type = 'budget'
        AND id != {current_event_id}  ← exclude the current event
        AND change_date_time < {current change_date_time}

   c. Determine if change is "early":
      review_date = prev_change_date + 30 days
      is_early = current change_date_time < review_date
      (if no prev change: is_early = False — this is campaign's first budget change)

   d. Get 30d ROAS and conversions for campaign from campaign_performance

   e. Apply apply_budget_rule() → get recommendation

   f. Determine alignment:
      direction_match:
        - increase: actual_pct_change > 0
        - decrease: actual_pct_change < 0
        - no_change: actual_pct_change == 0
      alignment = "follows recommendation" if direction matches rec action
                  "differs from recommendation" if direction is opposite
                  "informational" if recommendation is no_change or low_conversions_review

   g. Build Discord message

   h. Send Discord notification

   i. INSERT into public.muguntha_budget_change_monitor

3. Update last_processed_created_at watermark
```

### Discord Message Format

```
🔔 **Budget Change Detected — {campaign_name}**
Account: {account_id}  |  Changed by: {user_email}
Change: {sym}{old_budget:.2f} → {sym}{new_budget:.2f}  ({actual_pct:+.1f}%)
Changed at: {change_date_time} (synced: {created_at})

ROAS (30d): {roas_30d}%  |  Conversions (30d): {conversions_30d}
Muguntha Rule: {recommended_action}  (Recommended: {sym}{proposed_budget:.2f})

{"⚠ Early change — review window ends {review_date}" if is_early else "✅ Within review cycle"}
{"✅ Follows recommendation" if follows else "⚠ Differs from recommendation — {reason}"}

ℹ This is informational only. No action has been taken automatically.
```

---

## 8. Potential Risks

### Duplicate / missed alert risks

| Risk | Description | Mitigation |
|---|---|---|
| Double notification on re-poll | `updated_at` is re-stamped on existing rows by sync pipeline | Use `row_hash` UNIQUE in monitor table — prevents re-processing |
| NULL campaign_id rows | 12 rows have no campaign_id — cannot look up ROAS | Skip rows where `campaign_id IS NULL`; log count |
| Sync delay | Median lag is 8h — alert fires ~8h after actual budget change | Accepted. Note in Discord message: "synced at {created_at}" |
| Massive backfill catch-up | On first run, monitor starts from `last_processed_created_at = NULL` → would process all 93 historical events | Solution: on first run, seed watermark to `NOW() - 48 hours` to avoid backfilling old events |
| ROAS not available | Campaign has no spend in last 30 days (zero cost) | Send alert without ROAS; note "No spend in last 30 days" |
| `old_value` IS NULL | 4 rows have NULL `old_value` (new budget creations, not updates) | Skip rows where `old_value IS NULL` — these are CREATE operations, not changes |
| Multiple changes same campaign same day | Possible (e.g. Thasi changed same campaign twice within 6 days) | Each event generates its own alert — both are sent. This is correct behaviour |
| Non-Muguntha account events | USA, Besbet, etc. | Filter by `customer_id IN (...)` before processing |
| updated_at race on event id 150983 | updated_at = created_at + 66h — sync pipeline touched it again | Row was already in DB from created_at; `row_hash` UNIQUE prevents re-processing |

---

## 9. Exact Files Requiring Modification

### New file (Phase 3 only)

| File | Description |
|---|---|
| `backend/app/dashboard_pages/muguntha_budget_change_monitor.py` | New module: schema, poll function, Discord formatter, ScheduledSnapshot wiring, API router |

### Modified files

| File | Change |
|---|---|
| `backend/app/main.py` or router wiring file | Register new `muguntha_budget_change_monitor` router and call `start_snapshot()` |
| `backend/tests/test_muguntha_budget_change_monitor.py` | New test file — NOT modifying existing test file |

### Files NOT modified

| File | Reason |
|---|---|
| `backend/app/dashboard_pages/muguntha_budget_alerts.py` | Phase 1+2 changes already made; Phase 3 is independent |
| `frontend/src/admin/pages/BudgetAlerts.jsx` | Phase 3 is backend + Discord only — no frontend changes needed |
| `google_ads.google_ads_change_events` | READ-ONLY — never written to |

---

## 10. Implementation Plan

### Phase 3A — New table schema

```sql
-- In dm_dashboard DB (via ensure_schema())
CREATE TABLE IF NOT EXISTS public.muguntha_budget_change_monitor (
    id               SERIAL PRIMARY KEY,
    change_event_id  BIGINT NOT NULL,
    row_hash         CHAR(32) NOT NULL,
    campaign_id      BIGINT,
    campaign_name    TEXT,
    account_id       BIGINT,
    customer_id      TEXT,
    currency         TEXT,
    old_budget       NUMERIC,
    new_budget       NUMERIC,
    actual_pct_change NUMERIC,
    change_date_time TIMESTAMPTZ,
    user_email       TEXT,
    client_type      TEXT,
    roas_30d         NUMERIC,
    conversions_30d  NUMERIC,
    recommended_action TEXT,
    proposed_budget  NUMERIC,
    is_early_change  BOOLEAN NOT NULL DEFAULT FALSE,
    days_since_last_change NUMERIC,
    review_window_end DATE,
    alignment        TEXT,
    notified_discord BOOLEAN NOT NULL DEFAULT FALSE,
    notify_discord_error TEXT,
    notified_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT mbcm_row_hash_unique UNIQUE (row_hash)
);
-- Watermark table (single-row)
CREATE TABLE IF NOT EXISTS public.muguntha_budget_change_monitor_watermark (
    id        SMALLINT PRIMARY KEY DEFAULT 1,
    last_processed_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() - INTERVAL '48 hours',
    CONSTRAINT mbcm_watermark_singleton CHECK (id = 1)
);
```

### Phase 3B — Poll function (`poll_budget_changes()`)

1. Read watermark from `muguntha_budget_change_monitor_watermark`
2. Query ledsone DB for new events since watermark (scope: 3 accounts, change_type='budget', campaign_id NOT NULL, old_value NOT NULL)
3. For each event not already in monitor (by row_hash):
   - Convert micros to currency
   - Look up previous change date for campaign
   - Compute is_early, days_since_last_change, review_window_end
   - Get 30d ROAS + conversions from campaign_performance (single-campaign query)
   - Apply apply_budget_rule()
   - Determine alignment
   - Build Discord message
   - Send Discord
   - INSERT into monitor table
4. Update watermark to MAX(created_at) of processed events

### Phase 3C — ScheduledSnapshot wiring

```python
monitor_snapshot = ScheduledSnapshot(
    scope="muguntha-budget-change-monitor",
    staff="admin",
    tab="budget-change-monitor",
    table_name="public.muguntha_budget_change_monitor_snapshot",
    compute_fn=poll_budget_changes,
    interval_hours=2,
    metrics_fn=lambda p: (p.get("events_processed", 0), p.get("alerts_sent", 0)),
)
```

### Phase 3D — Test plan

| Test Class | Tests |
|---|---|
| `TestMicroConversion` | old_value/new_value micros → currency conversion |
| `TestAlignmentLogic` | increase/decrease/no_change direction matching |
| `TestEarlyChangeDetection` | is_early True/False, first-ever change (no prev date) |
| `TestBuildDiscordMessage` | message contains all required fields |
| `TestSkipNullCampaignId` | NULL campaign_id rows are skipped |
| `TestSkipNullOldValue` | NULL old_value rows are skipped |
| `TestSkipOutOfScope` | Non-Muguntha customer_ids filtered out |
| `TestDedup` | Same row_hash not processed twice |

Estimated: ~25–30 tests.

---

## Key Constraints Confirmed

- `google_ads_change_events` is READ-ONLY — no writes ever
- `old_value`/`new_value` are in micros — must divide by 1,000,000
- `cost`, `conversion_value` in `campaign_performance` are NOT in micros
- NULL `campaign_id` rows (12 total) must be skipped
- NULL `old_value` rows (4 total) must be skipped — these are budget creations, not changes
- Phase 3 does not modify Phase 1/2 files
- No frontend changes required for Phase 3
