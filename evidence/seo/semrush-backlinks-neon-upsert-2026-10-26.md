# Evidence: SEMrush Backlinks Neon Upsert — ledsone.co.uk — 2026-10-26

**Task ID:** SEO-BACKLINKS-UPSERT-20261026
**Date:** 2026-10-26
**Session:** Scheduled automated run (no live user)
**Status:** PARTIAL — SEMrush data fetched successfully; DB upsert BLOCKED (network policy)

---

## What Was Done

### Step 1 — SEMrush Backlinks Overview: SUCCESS

Fetched via `mcp__Semrush__execute_report` (report: `backlinks_overview`, target: `ledsone.co.uk`, target_type: `root_domain`)

| Metric | Value |
|---|---|
| Authority Score | 30 |
| Total Backlinks | 20,078 |
| Referring Domains | 834 |
| Referring IPs | 871 |
| Follow Links | 18,293 |
| Nofollow Links | 1,784 |

API units consumed: 40

### Step 2 — SEMrush Referring Domains: SUCCESS

Fetched via `mcp__Semrush__execute_report` (report: `backlinks_refdomains`, display_limit: 200, sort: backlinks_num_desc)

- **Rows returned:** 170 domains (all with ≥3 backlinks)
- **Top referring domains by backlinks:**

| Domain | Auth Score | Backlinks | First Seen |
|---|---|---|---|
| ledsone.nl | 8 | 5,921 | ~2025-11 |
| directory9.biz | 5 | 4,985 | ~2023-11 |
| syncee.com | 35 | 1,609 | ~2025-04 |
| coles-directory.com | 17 | 1,232 | ~2024-03 |
| prolink-directory.com | 5 | 1,092 | ~2023-11 |
| yell.com | 69 | 84 | ~2024-02 |
| planner5d.com | 60 | 10 | ~2025-04 |
| alibaba.com | 79 | 7 | ~2025-11 |
| bing.com | 96 | 7 | ~2024-08 |

- API units consumed: 8,000
- **Note:** `first_seen`/`last_seen` are Unix timestamps (not YYYYMMDD as originally expected)
- **Column name correction:** `domain_authority_score` parameter returns as `domain_ascore` in CSV header

### Step 3 — Node.js Upsert Script: WRITTEN, NOT RUN (DB BLOCKED)

Script written to: `Staff-requirements-02/scripts/semrush-backlinks-upsert.js`
CSV data written to scratchpad temp file for testing.

**Blocker:** The Neon PostgreSQL endpoint `ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech` is blocked by the remote container's outbound network proxy policy.

- TCP port 5432 (standard pg): `ENOTFOUND` (DNS not resolving through proxy)
- HTTPS/443 via proxy (`@neondatabase/serverless` HTTP mode): `CONNECT tunnel failed, response 403`
- `curl --proxy http://127.0.0.1:35589 https://ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/` → 403

The proxy README states: *"403 from the proxy: Most often the destination host is not allowed for this session. Do not retry or route around it — report the blocked host."*

---

## Files Created This Session

| File | Status |
|---|---|
| `Staff-requirements-02/scripts/semrush-backlinks-upsert.js` | Created — ready to run locally |
| `prompts/seo/semrush-backlinks-neon-upsert-prompt.md` | Created |
| `evidence/seo/semrush-backlinks-neon-upsert-2026-10-26.md` | This file |
| `validation/piranav/semrush-backlinks-upsert-validation-2026-10-26.md` | Created |

---

## SEMrush Data (Raw Overview CSV)

```
total;domains_num;ips_num;follows_num;nofollows_num;score;trust_score;urls_num;ipclassc_num;texts_num;forms_num;frames_num;images_num
20078;834;871;18293;1784;30;30;13538;431;19234;0;0;820
```

---

## Blocker — Action Required

**Piranav must run the upsert script locally** (from VS Code or local Node.js) since the Neon DB is blocked from the remote container.

**Command to run locally:**
```bash
cd piranav_aios/Staff-requirements-02
npm install
node scripts/semrush-backlinks-upsert.js /path/to/refdomains.csv
```

The refdomains CSV is embedded in the script as hardcoded data for today's snapshot — no separate CSV file needed when running the script as written (the CSV path is for the external-data version; the script can be simplified to use inline constants).

**Alternative:** Add `neon.tech` to the allowed outbound hosts in the remote container network policy.

---

## Queryability

- SEMrush data: YES (values documented above)
- DB tables: PENDING (upsert not completed)
- Script: YES (file tracked in git)
