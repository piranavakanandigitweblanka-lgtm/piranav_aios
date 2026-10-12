# Evidence: Muguntha Google Ads Budget Rule Alert System — Step 1 Discovery

**Date:** 2026-10-12  
**Status:** COMPLETE  
**Implementation status:** NOT STARTED  
**Production notifications:** NOT ENABLED  
**Live Google Ads modifications:** PROHIBITED  

---

## 1. Repository Architecture

### Backend (`dm-dashboard/backend/`)
- **Entry point:** `backend/app/main.py` — FastAPI app with ~40+ routers registered
- **Stack:** FastAPI 0.115, Python, psycopg3 + connection pools, PostgreSQL
- **Key packages:** pyjwt, bcrypt, requests, google-api-python-client, cryptography, playwright
- **No Telegram SDK, no SMTP library** in `requirements.txt` — confirmed NOT INSTALLED

### Backend Module Map
| Module | Path | Notes |
|---|---|---|
| DB connections | `core/db.py` | Two pools: `_pool` (app DB) + `_business_pool` (Google Ads / orders data, max 4 connections) |
| Auth (JWT) | `core/auth.py` | Roles: admin, dev, staff. `verify_ai_token`, `verify_admin_token`, `verify_token` |
| Background jobs | `core/background_job.py` | `BackgroundJob` class — in-memory TTL cache, non-blocking compute |
| Scheduled snapshots | `core/scheduled_snapshot.py` | `ScheduledSnapshot` class — persistent JSONB in Postgres, `sales_cache.sync_history` |
| Google API (GA4/GSC) | `core/google_client.py` | Service account JWT auth for GA4 and Search Console only — **NOT Google Ads API** |
| Google Ads data | `admin/admin_dm_campaign.py` | Reads from `google_ads.*` tables in business DB — no live API call |
| Muguntha AI brief | `ai_chat/muguntha_ai.py` | Team situation report — reads market ROAS, staff activity, task log |
| Muguntha staff page | No dedicated `staff_pages/muguntha.py` found — Muguntha accesses admin pages only |

### Frontend (`dm-dashboard/frontend/src/`)
- **Entry:** `App.jsx` (React Router)
- **Admin layout:** `admin/AdminLayout.jsx`
- **Muguntha-relevant pages:** `admin/pages/DmCampaign.jsx`, `components/DailyBriefWidget.jsx`, `admin/pages/TeamTaskMonitor.jsx`
- No dedicated Muguntha budget alert page exists yet

---

## 2. Google Ads Data Flow and ROAS Calculation

### VERIFIED: Data Source
Google Ads campaign data is **stored in Postgres** (`BUSINESS_DATABASE_URL`) — data is pre-synced by an external process (not this dashboard). The dashboard is a read-only consumer.

**Tables confirmed by code inspection:**
| Table | Columns Used | Purpose |
|---|---|---|
| `google_ads.campaigns` | `campaign_id`, `campaign_name`, `account_id`, `budget`, `group_name`, `campaign_status` | Campaign metadata and daily budget |
| `google_ads.campaign_performance` | `date`, `campaign_id`, `impressions`, `clicks`, `cost`, `conversions`, `conversion_value` | Daily performance per campaign |
| `google_ads.product_performance` | `date`, `campaign_id`, `product_item_id`, `impressions`, `clicks`, `cost`, `conversions`, `conversion_value` | Product-level performance |

**Second schema variant** (used in `muguntha_ai.py`):
`google_ads.campaign_performance` also has `cost_micros` and `conversions_value` columns — **column name inconsistency detected**. The admin_dm_campaign module uses `cost` (numeric, already in £), while muguntha_ai uses `cost_micros / 1e6` and `conversions_value`. This is a **PARTIALLY VERIFIED** discrepancy — the two queries appear to reference the same table but different columns. Requires database inspection to confirm whether these are aliases, separate tables, or schema drift.

### VERIFIED: ROAS Calculation in `admin_dm_campaign.py`
```
roas = (conversion_value / cost) * 100  # expressed as a percentage
```
- Returns `None` if cost = 0
- Per-campaign and totals both calculated
- Example: cost=£100, conversion_value=£400 → ROAS = 400%

### VERIFIED: ROAS Calculation in `muguntha_ai.py`
```
roas = ROUND((SUM(conversions_value) / (SUM(cost_micros)/1e6))::numeric, 2)
```
- Returns a decimal (e.g. 4.00 for 400%) — **different scale than admin_dm_campaign.py (which returns 400 for 400%)**
- Used for the market-level summary only, not per-campaign

### PARTIALLY VERIFIED: Budget field
- `google_ads.campaigns.budget` stores the daily budget — confirmed used in `admin_dm_campaign.py`
- Currency: assumed GBP (£) based on context and UK_SUB_SOURCE_ID=38. **NOT explicitly confirmed in column metadata.**

### NOT VERIFIED: Previous-month ROAS
- No existing endpoint or query computes a previous-calendar-month ROAS. The current implementation supports `30d`, `90d`, `all`, and `custom` modes — not a calendar-month boundary query.
- Muguntha's budget rules require previous-month ROAS for one exception case — **this field would need to be added.**

### NOT VERIFIED: Google Ads API live connection
- `core/google_client.py` implements **GA4 and GSC only** — no Google Ads API (`google-ads` Python client) is installed or configured.
- No `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, or `customer_id` env vars found in any file.
- **Conclusion: There is no live Google Ads API integration. All Google Ads data flows through pre-synced Postgres tables.**

---

## 3. Existing Notification and Authentication Capabilities

### Authentication (VERIFIED)
- **JWT-based** with roles: `admin`, `dev`, `staff`
- `verify_ai_token(authorization, "muguntha")` — used in muguntha_ai.py for her AI brief
- Muguntha's role appears to be `admin` based on AI brief access patterns
- An approval endpoint can be protected with `verify_ai_token(authorization, "muguntha")` or `verify_admin_token`

### Notifications (NOT VERIFIED)
| Integration | Status | Evidence |
|---|---|---|
| Telegram | **NOT PRESENT** | No Telegram SDK in requirements.txt, no Telegram API calls found in any app code |
| Email / SMTP | **NOT PRESENT** | No smtplib, sendgrid, mailgun, or SMTP config in requirements.txt or app code |
| In-app alerts | **NOT PRESENT** | No alert history table or alert notification component exists |

**Conclusion:** There is no existing notification system. Any Telegram or email delivery must be built from scratch.

### Background Jobs (VERIFIED)
Two existing patterns available to reuse:
1. `BackgroundJob` — in-memory, non-persistent, good for per-request compute
2. `ScheduledSnapshot` — persistent JSONB in Postgres, `sales_cache.sync_history` for audit trail, `sales_cache.sync_control` for pause/resume. Runs on configurable schedule (hourly, daily, weekly). **This is the right pattern for a scheduled budget rule evaluation.**

---

## 4. Confirmed Gaps and Blockers

| # | Gap / Blocker | Type | Severity |
|---|---|---|---|
| G1 | No Telegram or email integration exists | Missing dependency | HIGH — delivery method undecided |
| G2 | `cost_micros` vs `cost` column discrepancy in `google_ads.campaign_performance` | Data inconsistency | HIGH — ROAS calculation must use correct column |
| G3 | No previous-calendar-month ROAS calculation exists | Missing query | MEDIUM — required for one rule exception |
| G4 | No alert history or approval workflow table in DB | Missing schema | MEDIUM — needed for Step 2 |
| G5 | Currency not confirmed on `budget` column (assumed £) | Unverified assumption | MEDIUM |
| G6 | No dedicated Muguntha staff page — she uses admin pages only | Architecture gap | LOW — alert page can be added to admin layout |
| G7 | `market` column in `campaign_performance` — used in muguntha_ai.py but not confirmed schema | NOT VERIFIED | MEDIUM |
| G8 | Google Ads `campaigns.group_name` = 'DM' filter — are all of Muguntha's campaigns in this group? | Business question | HIGH — scoping blocker |
| G9 | Ambiguous exception: previous-month ROAS < 275% in Muguntha's expert form | Business rule clarification | HIGH — must not guess |
| G10 | No dedup or cooldown mechanism for repeated alerts | Missing feature | MEDIUM |

---

## 5. Muguntha's Budget Optimisation Rules (Proposed — Not Implemented)

These rules are documented here for Step 2 implementation. No code has been written.

### Budget Adjustment Rules (ROAS over last 30 days)
| ROAS Range | Recommended Action |
|---|---|
| ROAS ≥ 400% | Recommend +20% budget increase |
| ROAS 350–399% | Recommend +15% budget increase |
| ROAS 300–349% | Recommend +10% budget increase |
| ROAS 275–299% | Recommend +5% budget increase |
| ROAS 200–274% | No change |
| ROAS 175–199% | Recommend -5% budget decrease |
| ROAS 151–174% | Recommend -10% budget decrease |
| ROAS < 150% | Pause recommendation — requires approval |

### Additional Constraints
- If current daily budget > £150: cap any recommended increase at 15% maximum
- Campaign creation budget requests: follow separate approval rules in Muguntha's expert form (not implemented here)
- All recommendations require Muguntha's explicit approval before any action is taken
- No automatic live campaign modifications under any circumstances

### Flagged Ambiguities (Do Not Implement Until Clarified)
1. **ROAS boundary overlap:** Rule says "ROAS 350–399%" and "ROAS 300–349%" — what happens at exactly 300% or exactly 350%? Boundaries appear inclusive at the lower end but this must be confirmed.
2. **Ambiguous exception (Muguntha's expert form):** The expert form contains an exception involving previous-month ROAS below 275%. The exact condition and override behaviour are unclear. **Do not implement this exception until Muguntha clarifies it.**
3. **ROAS calculation period:** Rules reference "ROAS" without specifying the calculation window. Assumed to be last 30 days based on existing 30d mode — must confirm.
4. **Currency assumption:** Rules reference £150 budget cap — confirms GBP, but the database currency for `budget` column must be verified.
5. **Which campaigns are in scope:** Only group_name='DM' ENABLED campaigns? All Muguntha's campaigns? Campaigns paused for budget reasons should probably still be evaluated.

---

## 6. Proposed Implementation Design (Step 2 Preview — Not Implemented)

### New files required
| File | Purpose |
|---|---|
| `backend/app/admin/muguntha_budget_alerts.py` | Rule engine + FastAPI router for alert generation and approval |
| `frontend/src/admin/pages/BudgetAlerts.jsx` | Admin page showing pending alerts with approve/dismiss actions |

### Database additions (Step 2 only — not created yet)
| Table | Purpose |
|---|---|
| `public.muguntha_budget_alerts` | Persistent alert history: campaign_id, roas_pct, recommended_action, status (pending/approved/dismissed), created_at, decided_at, decided_by |

### Notification pattern
- **Telegram:** Add `httpx` or use `requests` (already in requirements.txt) to call Telegram Bot API. Requires `TELEGRAM_BOT_TOKEN` and `MUGUNTHA_TELEGRAM_CHAT_ID` env vars.
- **Email:** `smtplib` (stdlib) or add `sendgrid` to requirements.txt. Decision deferred to Step 2.
- **Delivery trigger:** Only on new `pending` alert creation — not on every evaluation run.

### Schedule
- Reuse `ScheduledSnapshot` pattern with `interval_hours=6` or `interval_days=1`
- Evaluation queries existing `google_ads.campaign_performance` for last 30 days
- Dedup: skip alert creation if an unresolved `pending` alert already exists for the same campaign_id

### Approval workflow
- `POST /api/admin/budget-alerts/{alert_id}/approve` — requires admin token
- `POST /api/admin/budget-alerts/{alert_id}/dismiss` — requires admin token
- Records `decided_by` (JWT sub), `decided_at` — no changes to Google Ads

---

## 7. Test and Validation Strategy

### Existing test infrastructure
- `pytest` is in use (`.pytest_cache` confirmed at repo root and backend root)
- Test file: `backend/tests/test_ai_validator.py` — AI validator tests

### Step 2 test plan
1. **Rule engine unit tests** — test each ROAS boundary (at, above, below each threshold) using mock data
2. **Duplicate alert prevention** — verify no second `pending` alert for same campaign
3. **Budget cap test** — confirm £150 cap applies correctly when budget > £150
4. **Pause recommendation test** — verify ROAS < 150% generates pause recommendation
5. **Approval endpoint test** — verify only admin/dev roles can approve, status transitions correct
6. **ROAS column consistency check** — before Step 2, run a spot-check SQL query to confirm which column (`cost` vs `cost_micros`) is correct and consistent

---

## 8. Decisions Required from Muguntha Before Step 2

| # | Question | Why It Matters |
|---|---|---|
| D1 | What is the exact exception in the expert form for previous-month ROAS < 275%? | Required to implement correctly — cannot be guessed |
| D2 | Are ROAS boundaries inclusive at lower end? (e.g. exactly 300% → +10% or +5%?) | Prevents wrong recommendations |
| D3 | Which campaigns are in scope? Only group_name='DM' ENABLED? All Muguntha campaigns? | Determines query filter |
| D4 | What is the evaluation window for ROAS? Last 30 days? Calendar month? | Affects query |
| D5 | Preferred notification channel: Telegram, email, or in-dashboard only? | Required before building notification delivery |
| D6 | How often should the rule engine evaluate? Daily, every 6 hours? | Affects ScheduledSnapshot interval |
| D7 | Should paused campaigns (ROAS < 150%) re-evaluate automatically when ROAS recovers? | Affects pause reversal logic |

---

## 9. Step 2 Implementation Plan (Numbered — Not Started)

1. **Confirm column schema** — run `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='google_ads' AND table_name='campaign_performance'` to resolve cost vs cost_micros discrepancy.
2. **Create DB migration** — add `public.muguntha_budget_alerts` table (alert_id, campaign_id, campaign_name, roas_pct, current_budget, recommended_action, status, created_at, decided_at, decided_by, notified_at).
3. **Build rule engine** (`muguntha_budget_alerts.py`) — pure deterministic Python function: `evaluate_campaign(campaign_id, roas_pct, current_budget) → recommended_action`. No AI, no side effects.
4. **Add scheduled evaluation** — `ScheduledSnapshot` or background thread that queries 30-day ROAS per campaign, calls rule engine, inserts `pending` alerts (deduped).
5. **Build notification sender** — `send_telegram_alert(message)` using `requests.post` to Telegram Bot API. Trigger on new `pending` alert. Requires env vars.
6. **Add FastAPI router** — endpoints: `GET /api/admin/budget-alerts` (list), `POST /api/admin/budget-alerts/{id}/approve`, `POST /api/admin/budget-alerts/{id}/dismiss`.
7. **Register router in main.py** — same pattern as existing admin routers.
8. **Build frontend page** — `admin/pages/BudgetAlerts.jsx` — table of pending alerts, approve/dismiss buttons, decision history.
9. **Add to admin nav** — extend `admin/AdminLayout.jsx` to include Budget Alerts link.
10. **Write pytest tests** for rule engine boundaries and approval workflow.
11. **Validate** — confirm no live Google Ads changes occur, confirm dedup prevents duplicate alerts, confirm only admin role can approve.
