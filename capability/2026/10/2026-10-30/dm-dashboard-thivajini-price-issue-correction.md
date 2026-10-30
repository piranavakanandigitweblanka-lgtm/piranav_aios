# Capability: Thivajini Price Issue Correction (Req 6)

**Date Confirmed:** 2026-10-30
**Confirmed By:** Piranav
**Status:** LIVE on `piranv-work` branch — PR to main pending
**Reusable:** YES — dual-method price comparison + ECB rate integration pattern

---

## What It Does

Compares FR listing prices against expected German prices for Thivajini's feed. For each FR SKU it calculates what the price should be using two methods:

- **Method 1 — Normal:** If DE stock exists, uses DE price direct. If no DE stock, applies formula `(UK price + €1.50) × 1.19` (EUR flat conversion).
- **Method 2 — Currency Converted:** Same logic but UK price is first converted GBP→EUR via live ECB rate before applying the formula.

Flags each row as Issue YES / NO / CHECK DATA. CHECK DATA covers: missing DE inventory, ambiguous duplicate SKU prices, missing/zero prices, ECB rate unavailable.

---

## Where It Lives

| Component | Location |
|---|---|
| Backend router | `backend/app/dashboard_pages/price_issue_correction.py` |
| Frontend page | `frontend/src/dashboard_pages/PriceIssueCorrection.jsx` |
| Router registration | `backend/app/main.py` |
| Task registry entry | `frontend/src/taskRegistry.jsx` |
| UAM key | `thivajini.PriceIssueCorrection` |
| Branch | `websitetecteam-arch/dm-dashboard` → `piranv-work` commit `2ec4e79` |

---

## Key Technical Details

| Detail | Value |
|---|---|
| API endpoint | `GET /api/thivajini/req6` |
| FR scope | `sub_source = 23`, status `active + draft` |
| DE scope | `sub_source = 108`, status `active + draft` (no unlisted rows confirmed) |
| UK scope | `sub_source = 38`, status `active + draft + unlisted` (93 unlisted rows exist) |
| Duplicate disambiguation | `COUNT(DISTINCT price)` per SKU group — >1 = CHECK DATA |
| ECB rate source | `fetch_gbp_eur_rate()` — called once per request, cached per call |
| Rounding | `Decimal` arithmetic with `ROUND_HALF_UP` — float defect corrected 2026-10-30 |
| Row cap (UI) | 1,000 rows per tab with overflow message |
| CSV export | Per-tab, filename includes method + date |

---

## KPIs Exposed

| KPI | Description |
|---|---|
| Total FR Listings | All FR rows returned |
| Normal YES | Method 1 rows where Issue = YES |
| Normal CHECK DATA | Method 1 rows where result is undetermined |
| Converted YES | Method 2 rows where Issue = YES |
| Converted CHECK DATA | Method 2 rows where result is undetermined |

---

## Pending

- Access grants row for `thivajini.PriceIssueCorrection` not yet created in UAM
- PR `piranv-work` → `main` not yet opened (awaiting Piranav instruction)

---

## Evidence

- `evidence/dm-dashboard/dm-dashboard-thivajini-req6-price-issue-correction-implementation-2026-10-30.md`
- `evidence/dm-dashboard/dm-dashboard-thivajini-req6-price-issue-correction-preflight-2026-10-30.md`
- `validation/piranav/dm-dashboard-thivajini-req6-price-issue-correction-validation-2026-10-30.md`
- `prompts/dm-dashboard/dm-dashboard-thivajini-req6-price-issue-correction.md`
- Closure: `closure/README.md` — DMDASH-TV-REQ6-IMPL-2026-10-30
