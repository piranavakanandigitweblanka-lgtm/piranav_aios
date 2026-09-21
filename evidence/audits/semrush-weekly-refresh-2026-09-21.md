# SEMrush Weekly Refresh — Evidence
**Date:** 2026-09-21
**Scheduled agent run | ledsone.co.uk | UK database**

---

## SEMrush Data Fetched (domain_rank, uk, 2026-09-01)

| Metric | Sep 2026 | Aug 2026 | Change |
|---|---|---|---|
| Rank | 51,406 | 49,162 | -2,244 (worse) |
| Organic Keywords | 10,510 | 11,062 | -552 |
| Traffic Est | 9,555 | 9,932 | -377 |
| Traffic Cost (GBP) | 4,276 | 4,181 | +95 |
| Paid Keywords | 0 | 11 | -11 ← notable |
| Paid Traffic | 0 | 110 | -110 ← notable |
| kw_top3 | 188 | 166 | +22 |
| kw_top4_10 | 620 | 633 | -13 |
| kw_top11_20 | 1,891 | 1,834 | +57 |
| kw_top21_100 | 7,053 | 7,532 | -479 |

**kw_top21_100 breakdown (Sep 2026):**
positions_21_30: 2,533 | positions_31_40: 2,133 | positions_41_50: 1,300 | positions_51_60: 574 | positions_61_70: 317 | positions_71_80: 122 | positions_81_90: 50 | positions_91_100: 24

---

## DB Upsert Status

**BLOCKED — NEON_DATABASE_URL not available in remote cloud environment.**

- No Vercel CLI in this environment
- No `.env` or `.env.local` files in Staff-requirements-02/
- The variable is a Vercel environment variable, not exposed to scheduled cloud sessions

**Script updated:** `Staff-requirements-02/scripts/semrush-upsert.js` now contains the Sep 2026 row.

**To complete the upsert manually, run from a local terminal with access to NEON_DATABASE_URL:**
```bash
cd Staff-requirements-02
NEON_DATABASE_URL="postgresql://..." node scripts/semrush-upsert.js
```

---

## Key Observations

1. **Paid traffic dropped to zero** — paid_keywords went from 11 → 0 and paid_traffic from 110 → 0. This may indicate the paid campaign was paused or budget exhausted.
2. **Organic rank slipped** from 49,162 → 51,406 (worse = higher number).
3. **Top-3 keywords improved** — kw_top3 increased from 166 → 188.
4. **Organic keywords count fell** by 552 — possible seasonal fluctuation or content changes.

---

## Files Changed

- `Staff-requirements-02/scripts/semrush-upsert.js` — updated ROWS with Sep 2026 data

## Next Steps

- Piranav to run the upsert script locally with NEON_DATABASE_URL set
- Or: add NEON_DATABASE_URL to the remote environment's env vars so future scheduled runs can complete the DB write automatically
