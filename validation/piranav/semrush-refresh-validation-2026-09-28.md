# Validation — SEMrush Weekly Refresh 2026-09-28

**Task:** Scheduled SEMrush domain_rank fetch + Neon upsert  
**Date:** 2026-09-28

---

## Checklist

| Check | Result |
|---|---|
| SEMrush MCP available | PASS |
| domain_rank report fetched for ledsone.co.uk (uk) | PASS |
| Full position breakdown fetched (kw_top3, kw_top4_10, kw_top11_20, kw_top21_100) | PASS |
| Data values non-zero and plausible | PASS |
| semrush-upsert.js ROWS array updated with 2026-09-28 data | PASS |
| Evidence file created | PASS |
| NEON_DATABASE_URL available in env | FAIL — not set |
| Neon host reachable | FAIL — egress policy blocks *.neon.tech |
| DB upsert executed | FAIL — blocked |
| DB verify query run | FAIL — blocked |

---

## Overall: PARTIAL PASS

SEMrush fetch complete. Script updated. DB write blocked by environment egress policy (same blocker as 2026-09-21, 2026-09-14 sessions). Piranav action required to either:
1. Run script locally, OR
2. Add `*.neon.tech` to egress allowlist at https://code.claude.com

---

## Raw Data Snapshot

```
ledsone.co.uk | rank:48334 | kw:10252 | traffic:10249 | cost:5111 | paid_kw:0 | paid_traffic:0
positions_1_3:210 | 4_10:639 | 11_20:1877 | 21_100:6772
```
