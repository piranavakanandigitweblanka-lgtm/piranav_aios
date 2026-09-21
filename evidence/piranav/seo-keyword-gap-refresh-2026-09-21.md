# Evidence: Weekly SEO Keyword Gap Refresh — 2026-09-21

**Date:** 2026-09-21
**Session type:** Scheduled automated run
**Status:** PARTIAL PASS — gap analysis complete, DB write blocked by egress policy

---

## What Was Built

Weekly keyword gap refresh for ledsone.co.uk vs 3 competitors using SEMrush MCP data.

---

## SEMrush Data Collected

| Source | Keywords Fetched | Method |
|---|---|---|
| ledsone.co.uk | 200 | `resource_organic`, uk DB, traffic desc |
| ledhut.co.uk | 100 | `resource_organic`, uk DB, traffic desc |
| lightingcompany.co.uk | 100 | `resource_organic`, uk DB, traffic desc |
| industville.co.uk | 100 | `resource_organic`, uk DB, traffic desc |

SEMrush API units used: ~5,000 (2,000 for ledsone + 1,000 each for competitors)

---

## Gap Analysis Results

### ledhut.co.uk — Top 5 Gaps
| Keyword | Comp Pos | Volume | Opportunity Score | Ledsone |
|---|---|---|---|---|
| light with bulb | 1 | 12,100 | 121,000 | not ranking |
| led lights | 5 | 33,100 | 66,200 | not ranking |
| light bulb | 2 | 12,100 | 60,500 | not ranking |
| led light bulbs | 1 | 5,400 | 54,000 | not ranking |
| led bulbs | 1 | 5,400 | 54,000 | not ranking |

### lightingcompany.co.uk — Top 5 Gaps
| Keyword | Comp Pos | Volume | Opportunity Score | Ledsone |
|---|---|---|---|---|
| best reading lamps | 7 | 33,100 | 47,286 | not ranking |
| light fitting | 1 | 4,400 | 44,000 | not ranking |
| light fixtures | 1 | 2,900 | 29,000 | not ranking |
| light light bulb | 5 | 12,100 | 24,200 | not ranking |
| chandeliers in the bedroom | 1 | 2,400 | 24,000 | not ranking |

### industville.co.uk — Top 5 Gaps
| Keyword | Comp Pos | Volume | Opportunity Score | Ledsone |
|---|---|---|---|---|
| pendant lights in the kitchen | 1 | 3,600 | 36,000 | not ranking |
| hall lights | 1 | 1,600 | 16,000 | not ranking |
| vintage wall lights | 1 | 1,300 | 13,000 | not ranking |
| edison bulb | 1 | 1,300 | 13,000 | not ranking |
| vintage light wall | 1 | 1,300 | 13,000 | not ranking |

---

## Total Rows: 150 (50 per competitor)

---

## Output Files

| File | Status |
|---|---|
| `Staff-requirements-02/scripts/seo-keyword-gap-refresh.js` | Created — full DB-write script |
| `Staff-requirements-02/scripts/seo-gap-export-only.js` | Created — offline JSON export |
| `Staff-requirements-02/data/seo-keyword-gap-2026-09-21.json` | Created — 150 rows exported |

---

## DB Write Status

**BLOCKED** — Neon DB host `ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech:443` is blocked by the remote session's egress policy (403 - policy denial).

**Action required by Piranav:** Run `node Staff-requirements-02/scripts/seo-keyword-gap-refresh.js` locally from the `piranav_aios/` directory to push the 150 rows to Neon.

The `seo-keyword-gap-refresh.js` script already contains all the parsed SEMrush data inline — no API calls needed to run it locally. Just `cd piranav_aios/Staff-requirements-02 && node scripts/seo-keyword-gap-refresh.js`.

---

## Commit Hash

Pending — commit to be made after evidence files are written.

---

## Validation Notes

- Gap logic verified: competitor pos 1–10, ledsone not ranking OR pos > 20
- Branded terms excluded: ledhut, led hut, lumilife, ledowe, lightingcompany variants, industville variants, ledsone variants
- `opportunity_score = volume × (10 / competitor_position)` — confirmed in script output
- Top 3 per competitor visually verified against SEMrush data
