# Prompt: MUGA-BRAS — Campaign Status Verification and Dashboard Filters

**Category:** dm-dashboard / implementation  
**Registered:** 2026-10-12  
**Author:** Piranav  
**Status:** ACTIVE

---

## Objective

Extend the existing MUGA-BRAS Budget Alerts page to:
1. Verify campaign status (ACTIVE / PAUSED / REMOVED / UNKNOWN) for all pending alerts
2. Add country (UK/DE/FR) and responsible-person filters to BudgetAlerts.jsx
3. Add campaign-status filter
4. Add tests for all new behaviour

---

## Phases

### Phase 1 — Audit
- Trace how 42 pending alerts are stored and displayed
- Inspect PostgreSQL campaign tables: campaign ID mapping, status field, country/account mapping, owner mapping, last sync timestamp
- Do NOT invent country or staff ownership mappings
- Inspect UAM, API routes, frontend filters, existing tests

### Phase 2 — Campaign Status Verification
- Match each pending alert to current campaign record via campaign ID
- Read latest status from synced DB (not live Google Ads API)
- Display: ACTIVE / PAUSED / REMOVED / UNKNOWN
- Show last sync timestamp
- Report unmatched campaigns separately
- Do NOT delete/expire alerts based on campaign status
- Do NOT mark active merely because alert exists

### Phase 3 — Dashboard Filters
- Country filter: All / UK / DE / FR (from authoritative account mapping only)
- Responsible-person filter: All / dynamic from existing ownership mapping / Unassigned
- Campaign-status filter: All / Active / Paused / Removed / Unknown
- Filters work together
- Clear/reset-filters action
- Show count of matching alerts
- Preserve existing table, responsive layout, admin-only access, UAM

### Phase 4 — Validation
Tests for: status matching, all status types, country filtering, owner filtering, combined filters, reset, stale data, UAM access, notification safety

---

## Safety Rules

- Do NOT send Telegram or Discord messages during tests
- Do NOT modify Google Ads campaigns, budgets, or status
- Do NOT trigger production alert evaluation unless explicitly authorized
- Do NOT add live Google Ads API integration without authorization
- Do NOT hardcode staff assignments or infer country from campaign names

---

## Files

| File | Action |
|---|---|
| `backend/app/admin/muguntha_budget_alerts.py` | Extend — add campaign status lookup |
| `frontend/src/admin/pages/BudgetAlerts.jsx` | Extend — add filters |
| `backend/tests/test_muguntha_budget_alerts.py` | Extend — new test cases |

---

## AIOS Requirements

- Update existing evidence + validation docs (do not create duplicates)
- Update `closure/README.md` and `PROMPT_REGISTER.md`
- Record: campaigns checked, status counts, country/owner mapping sources, test results, limitations
