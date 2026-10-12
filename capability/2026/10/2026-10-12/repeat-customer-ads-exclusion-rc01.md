# Capability: Repeat Customer Google Ads Exclusion (RC-01)

**Date Confirmed:** 2026-10-12  
**Confirmed By:** Piranav  
**Status:** PARTIAL — implementation complete, browser UAM test pending  
**Reusable:** YES — ScheduledSnapshot + Shopify order analysis pattern

---

## What It Does

Syncs repeat customers from Shopify UK orders into a snapshot, then feeds that data to Google Ads audience exclusions — preventing ads from targeting customers who have already bought 3+ or 4+ times.

---

## Where It Lives

| Component | Location |
|---|---|
| Backend module | `backend/app/admin/admin_repeat_customer.py` |
| Frontend page | `frontend/src/admin/pages/RepeatCustomers.jsx` |
| UAM key | `tools.AdminRepeatCustomers` |

---

## Real Data (2026-10-12 first sync)

| Metric | Value |
|---|---|
| Orders scanned | 66,975 (all-time Shopify UK) |
| Customers at 3+ orders | 1,245 |
| Customers at 4+ orders | 470 |
| Spot-check accuracy | 5/5 match Shopify Admin exactly |
| Privacy | No raw emails in snapshot — hashed only |

---

## Schedule

- Runs via `ScheduledSnapshot` (interval TBC)
- First sync completed 2026-10-12

---

## Pending

- Browser UAM test: Piranav must confirm "Repeat Customers" row in UAM matrix and test Save/Discard
- Commit to dm-dashboard repo pending Piranav instruction

---

## Evidence

- `evidence/dm-dashboard/repeat-customer-ads-exclusion-step2-2026-10-12.md`
- `validation/piranav/repeat-customer-ads-exclusion-step2-validation-2026-10-12.md`
