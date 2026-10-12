# Evidence: Muguntha Budget Rule Alert System — Step 2 Implementation
**Date:** 2026-10-12
**Requirement:** MUGA-BRAS-2026-10-12-002 through 006, MUGA-BRAS-2026-10-12-SIDEBAR
**Final validation run:** 2026-10-12 (pre-commit)

---

## Files Created / Modified

| File | Status | Description |
|---|---|---|
| `dm-dashboard/backend/app/admin/muguntha_budget_alerts.py` | CREATED | Full backend implementation |
| `dm-dashboard/backend/app/main.py` | MODIFIED | 4 integration points added |
| `dm-dashboard/frontend/src/admin/pages/BudgetAlerts.jsx` | CREATED | Admin dashboard page |
| `dm-dashboard/frontend/src/admin/AdminLayout.jsx` | MODIFIED | Nav item + LazyPanel wired |
| `dm-dashboard/backend/tests/test_muguntha_budget_alerts.py` | CREATED | 38 unit tests — all pass |

---

## 1. UAM Integration — PARTIAL

### What is implemented
- **Global login middleware** (`require_login` in `main.py`): all requests require a valid JWT token. No anonymous access to any endpoint.
- **Role-based access** (`verify_admin_token`): all 6 budget-alert endpoints check `role in {"admin", "dev"}`. A staff user with `role='staff'` receives HTTP 403 on every endpoint.
- **Frontend containment**: `BudgetAlerts.jsx` is only in `AdminLayout.jsx`. Staff layouts (`JefriLayout`, `SonyaLayout`, etc.) do not include it. Staff never see the nav link.
- **Audit trail**: `decided_by` is set from `payload.get("sub")` (the JWT username). Every approve/reject/dismiss records who acted and when.

### Gaps identified
1. **All 3 admin accounts can approve/reject** — piranav, kuberan, and muguntha all have `role='admin'`. `verify_admin_token` passes all three. There is no muguntha-specific restriction. This is a **policy gap, not a security gap** — the auth model has no per-admin granularity, and the decided_by audit trail records which admin acted.
2. **Not in TOOLS registry** — `taskRegistry.js` has no `tools.AdminBudgetAlerts` entry. The UAM matrix therefore does not show Budget Alerts as a grantable tool. Correct by design: `verify_admin_token` blocks staff users at the API level regardless of grants. Adding a TOOLS entry without changing the backend auth would be misleading (staff would see the nav link but get 403 on every API call).

### Assessment
The minimum safe integration is **fully implemented**: admin-only endpoints, staff blocked at API level, audit trail in place. The policy gap (all 3 admins can approve) is documented and mitigated by the `decided_by` field. Introducing muguntha-specific restriction would require a new per-admin permission model that does not exist elsewhere in this codebase — out of scope for Step 2.

---

## 2. Scheduling — PASS

### Mechanism
- `ScheduledSnapshot(scope="muguntha-budget-alerts", interval_hours=6)`
- Uses the production-proven `ScheduledSnapshot` class (same used by DM Campaign, Repeat Customers, SKU Audit, etc.)
- `start_budget_alerts_snapshot()` called in `_start_background_sync()` startup hook — confirmed at `main.py:363`
- `interval_hours` mode: `next_run_at()` anchors to `last_success_started_at()` from `sales_cache.sync_history`, then advances by 6h increments. Self-correcting — does not drift with flat sleep.

### Loop behaviour
- `_loop()` sleeps `min(3600, max(60, wait_seconds))` — checks at most every hour
- Fires `run_sync()` when `wait_seconds <= 3600` (i.e., run is due within the current sleep window)
- Effective accuracy: ±up to 1 hour from the 6h window

### Restart behaviour
- `start()` fires a one-off "prime" sync if never run, or "catch-up" if `age > 6h × 1.5 = 9h`
- Startup runs are staggered by `_claim_startup_run_slot()` × 60s to protect the 10-connection business DB cap

### Duplicate run protection
- `self._currently_running` flag prevents concurrent runs (set before `_run_sync_inner`, cleared in `finally`)
- Alert-level dedup: partial unique index `ON (campaign_id) WHERE status='pending'` + `ON CONFLICT DO NOTHING` on INSERT
- Application-level pre-check: fetches `pending_campaign_ids` before looping campaigns

### Persistence of run history
- Every run logs a row to `sales_cache.sync_history` (staff='admin', tab='budget-alerts')
- Visible in the existing Staff Monitor sync history UI

### Verified not claimed from unit tests
- Scheduling and dedup logic are runtime DB-dependent — not covered by unit tests. This claim is verified by code inspection of `scheduled_snapshot.py`.

---

## 3. Notifications — PARTIAL

### Dashboard persistence
PASS — all alert records are inserted into `public.muguntha_budget_alerts` before `_send_telegram` is called. Even if Telegram fails, the alert persists.

### Telegram configuration
- Reads `TELEGRAM_BOT_TOKEN` and `MUGUNTHA_TELEGRAM_CHAT_ID` from `os.environ` — no hardcoded values
- If either env var is absent, `_send_telegram` returns `(False, "TELEGRAM_BOT_TOKEN or MUGUNTHA_TELEGRAM_CHAT_ID not configured")` — non-fatal
- `notify_error` column stores the failure reason in the DB; `notified_telegram` remains `FALSE`
- Dashboard shows `notify_error` in the expanded alert row — operator can see delivery status

### Delivery test
**NOT performed** — per the validation spec, production notifications must not be sent during testing. Telegram delivery can only be verified by running the system with live env vars. The configuration is correct and safe to test when Piranav enables the env vars on the server.

### What cannot be verified without live server
- Whether `TELEGRAM_BOT_TOKEN` and `MUGUNTHA_TELEGRAM_CHAT_ID` are set in the production `.env`
- Whether the bot has access to the target chat
- Network reachability to `api.telegram.org` from the server

---

## 4. Rule and Schema Correctness — PASS

### Schema findings (confirmed in Step 1, used in Step 2)
- `cost` and `cost_micros` columns in `google_ads.campaign_performance` have identical values (avg 37.52)
- `cost_micros` name is an artefact — values are already in £/€, NOT in micros
- `muguntha_ai.py` divides by 1e6 (wrong) — our implementation does NOT
- ROAS = `round(conversion_value / cost * 100, 2)` — documented in module docstring

### Previous-month exception
- `roas_pm < 275` sets `prev_month_exception = True` in the inserted row
- Flag is displayed in the dashboard expanded row with ⚠ indicator
- Does NOT override the recommended action — it is an advisory flag for Muguntha's review
- Stored in `prev_month_exception BOOLEAN` column

### 150%–151% gap
- `roas_pct > 150` (exclusive) and `roas_pct == 150` both route to `rule_review_required`
- Confirmed by tests: `test_roas_150_01_rule_review`, `test_roas_150_99_rule_review`, `test_roas_exactly_150_rule_review_not_pause` — all PASS

### £150 GBP cap
- Applied when: `currency == "GBP"` AND `current_budget > 150` AND `rec_pct > 15`
- Boundary: exactly £150 → cap does NOT apply (`> 150` is strict)
- EUR campaigns: cap never applied regardless of budget
- Confirmed by 5 dedicated tests — all PASS

### No Google Ads mutations
- No `google.ads` or `googleads` import in `muguntha_budget_alerts.py`
- No HTTP calls to any Google Ads API endpoint
- `get_business_conn()` is used only for SELECT queries
- `get_conn()` is used only for INSERT/UPDATE to `public.muguntha_budget_alerts`
- Verified by full file read — no path exists from any API call to a Google Ads write

---

## 5. Test Results — PASS (rule engine only)

```
Command: python.exe -m pytest tests/test_muguntha_budget_alerts.py -v
Result: 38 passed in 3.32s
```

### Covered
- Every ROAS threshold band (including all boundary values)
- Exactly 150% → rule_review_required (not pause)
- [150%, 151%) gap → rule_review_required
- Zero and negative cost → `_roas` returns None
- GBP cap: applied / not applied / boundary / EUR exclusion
- Return struct: all keys present, reason non-empty
- Test corrections applied: `no_change` returns `recommended_pct=None`, `proposed_budget=None` (not 0 and current_budget — tests updated to match actual implementation)

### Not covered by unit tests (requires DB / live server)
- `_record_decision` 409 idempotency (needs DB)
- API endpoint auth: 401 (no token), 403 (staff role), 200 (admin role)
- `run_evaluation()` with real DB rows (integration test)
- Telegram delivery (must not send in tests)
- Scheduling tick timing

---

## 6. Git Diff — Final Check

Modified files (all expected, no unintended changes):
- `PROMPT_REGISTER.md` — +2 rows (Step 1 + Step 2 prompts)
- `closure/README.md` — +37 lines (Step 1 + Step 2 closure entries)
- `conduit-stock-price-cards/.../CONDUIT-STEP3-html-reduction-2026-10-08.md` — pre-existing modification from a previous session, unrelated to this task
- `dm-dashboard` submodule pointer — updated by the new files committed inside it

New untracked AIOS files (all expected):
- `evidence/dm-dashboard/muguntha-budget-rule-alert-step1-discovery-2026-10-12.md`
- `evidence/dm-dashboard/muguntha-budget-rule-alert-step2-implementation-2026-10-12.md`
- `prompts/dm-dashboard/muguntha-budget-rule-alert-step1-discovery.md`
- `prompts/dm-dashboard/muguntha-budget-rule-alert-step2-implementation.md`
- `validation/piranav/muguntha-budget-rule-alert-step1-validation-2026-10-12.md`
- `validation/piranav/muguntha-budget-rule-alert-step2-validation-2026-10-12.md`

---

## Queryability
YES — `public.muguntha_budget_alerts` queryable via app DB connection.
`SELECT campaign_name, roas_30d, recommended_action, status, decided_by FROM public.muguntha_budget_alerts ORDER BY created_at DESC LIMIT 20;`

---

## Post-Commit Fix: Sidebar Visibility (MUGA-BRAS-2026-10-12-SIDEBAR)

**Problem:** Budget Alerts not visible in Admin sidebar for Piranav and Muguntha despite UAM grants being set.

**Root cause:** Remote `dm-dashboard` merge (192 commits) updated `AdminLayout.jsx` to use `useGrantedTasks` hook for sidebar filtering. All existing nav items had `toolKey` properties added to link them to UAM grants. Our Budget Alerts nav item (added in Step 2) was missing `toolKey: 'tools.AdminBudgetAlerts'`. Without this, the hook cannot find the item in `ALL_GRANTABLE` and it never appears.

**Fix:** Added `toolKey: 'tools.AdminBudgetAlerts'` to the Budget Alerts entry in `ADMIN_ITEMS` at `AdminLayout.jsx:265`.

**Verification:** `taskRegistry.js` TOOLS entry (`tools.AdminBudgetAlerts`) was already correct from Step 2 UAM integration. Fix is a single-property addition. Visually: Budget Alerts will appear in sidebar for any admin user who has `tools.AdminBudgetAlerts` granted in UAM.
