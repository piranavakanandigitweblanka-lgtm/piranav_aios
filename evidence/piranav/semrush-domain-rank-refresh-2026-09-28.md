# Evidence — SEMrush Domain Rank Refresh 2026-09-28

**Task:** Weekly scheduled SEMrush domain_rank fetch for ledsone.co.uk → Neon semrush_history upsert  
**Date:** 2026-09-28  
**Agent:** Scheduled Claude Code (automated)

---

## SEMrush Data Fetched

**Source:** SEMrush MCP `domain_rank` report, database: `uk`, target: `ledsone.co.uk`  
**Fetch time:** 2026-09-28 (automated scheduled run)  
**Month key:** `2026-09-01`

| Field | Value |
|---|---|
| Rank (Semrush Rank) | 48,334 |
| Organic Keywords | 10,252 |
| Positions 1–3 (kw_top3) | 210 |
| Positions 4–10 (kw_top4_10) | 639 |
| Positions 11–20 (kw_top11_20) | 1,877 |
| Positions 21–100 (kw_top21_100) | 6,772 |
| Organic Traffic (traffic_est) | 10,249 |
| Organic Cost GBP (traffic_cost_gbp) | 5,111 |
| Paid Keywords | 0 |
| Paid Traffic | 0 |

**kw_top21_100 calculation:** 2455 + 2060 + 1222 + 544 + 299 + 119 + 50 + 23 = 6,772

---

## vs. Prior Week (2026-09-21 snapshot)

| Metric | 2026-09-21 | 2026-09-28 | Change |
|---|---|---|---|
| Rank | 51,406 | 48,334 | **+3,072 improvement** |
| Organic Keywords | 10,510 | 10,252 | -258 |
| kw_top3 | 188 | 210 | +22 |
| kw_top4_10 | 620 | 639 | +19 |
| traffic_est | 9,555 | 10,249 | +694 |
| traffic_cost_gbp | 4,276 | 5,111 | +835 |

**Notable:** Semrush Rank improved by ~3,000 positions week-over-week. Traffic up +7%. Cost value up +20%.

---

## Script Updated

File: `Staff-requirements-02/scripts/semrush-upsert.js`  
- Updated `ROWS[0]` with 2026-09-28 data (month `2026-09-01`)
- Header comment updated: `Data last fetched by scheduled agent: 2026-09-28`

---

## DB Upsert Status

**BLOCKED — same egress policy restriction as prior 3 sessions.**

Neon host `ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech` and `api.c-2.eu-west-2.aws.neon.tech` are not reachable from this remote Claude Code environment (org egress policy denies outbound connections to Neon).

**NEON_DATABASE_URL** is not set in the container environment.

### To complete the upsert — Piranav must run locally:
```bash
cd piranav_aios/Staff-requirements-02
NEON_DATABASE_URL="<your-connection-string>" node scripts/semrush-upsert.js
```

Or fix the root cause permanently: add `*.neon.tech` to the remote session egress allowlist at:  
https://code.claude.com → Environments → [environment name] → Network settings

---

## Queryability

YES — evidence file exists, script updated with fresh data, closure entry written.
