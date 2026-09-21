# Evidence: SEMrush Organic Pages Fetch — ledsone.co.uk
**Date:** 2026-09-21  
**Session Type:** Scheduled automated task  
**Requirement ID:** SEO-PAGES-REFRESH-2026-09-21

## What Was Accomplished

### Step 1 — SEMrush Data Fetch: SUCCESS
- Called `mcp__Semrush__execute_report` with `resource_organic_unique` report
- Target: `ledsone.co.uk`, database: `uk`, limit: 50, sort: `traffic_desc`
- **Result: 50 rows returned successfully**
- API units consumed: 500
- Data format: semicolon-delimited CSV

### Step 2 — Neon DB Upsert: BLOCKED (Network Egress Policy)
- Attempted with `pg` driver (port 5432 TCP) — timed out (port blocked)
- Attempted with `@neondatabase/serverless` driver (HTTPS to Neon API) — 403 blocked
- **Error:** `Host not in allowlist: api.c-2.eu-west-2.aws.neon.tech`
- Root cause: Claude Code remote container network egress policy does not allow outbound connections to Neon's EU West 2 serverless endpoint

## SEMrush Data Captured (50 rows, snapshot 2026-09-21)

| Rank | URL | Traffic | Keywords | Traffic % |
|---|---|---|---|---|
| 1 | /collections/wire-connectors | 942 | 87 | 9.85% |
| 2 | / (homepage) | 892 | 163 | 9.33% |
| 3 | /collections/plugin-lighting | 585 | 108 | 6.12% |
| 4 | /blogs/new/b22-bayonet-bulbs-explained... | 404 | 114 | 4.22% |
| 5 | /blogs/new/e27-bulb-guide | 362 | 94 | 3.78% |
| 6 | /collections/e27-base-bulb | 255 | 230 | 2.66% |
| 7 | /collections/spider-light | 244 | 18 | 2.55% |
| 8 | /collections/dc-12v-transformer | 202 | 32 | 2.11% |
| 9 | /collections/ceiling-rose-brackets | 186 | 17 | 1.94% |
| 10 | /collections/white-board | 154 | 193 | 1.61% |
| 11 | /collections/vintage-bulbs | 132 | 113 | 1.38% |
| 12 | /products/12w-modern-led-adjustable-tilt-angle-downlight... | 123 | 16 | 1.28% |
| 13 | /collections/metal-holders | 111 | 53 | 1.16% |
| 14 | /products/3-light-black-industrial-hanging-ceiling-pendant-lights | 102 | 19 | 1.06% |
| 15 | /products/tiffany-style-table-lamp-for-home-decor | 101 | 26 | 1.05% |
| 16 | /collections/dc-24v-transformer | 97 | 16 | 1.01% |
| 17 | /collections/lampshades | 94 | 99 | 0.98% |
| 18 | /collections/wall-light | 92 | 327 | 0.96% |
| 19 | /products/vintage-industrial-loft-style-metal-ceiling-light... | 87 | 16 | 0.91% |
| 20 | /collections/led-bulbs | 87 | 117 | 0.91% |
| 21-50 | (see script data) | ... | ... | ... |

**Top page type breakdown:**
- Collections: ~27 pages
- Products: ~13 pages  
- Blogs: ~7 pages
- Homepage: 1
- Other (ES locale): 1 (`/es/collections/table-lamps`)

## Script Written
`Staff-requirements-02/scripts/semrush-pages-upsert.js` — ready to run when Neon egress is allowed

## Blocker Resolution Required
**Piranav must add Neon host to network egress allowlist:**
1. Go to https://code.claude.com/docs/en/claude-code-on-the-web
2. Find Network Policy / Egress settings for the remote execution environment
3. Add host: `api.c-2.eu-west-2.aws.neon.tech` (or `*.neon.tech`)
4. Once added, re-run the scheduled task — the script and data are ready

## Previous Blockers (Resolved)
- 2026-09-14: SEMrush API units exhausted (3 sessions blocked) — **now resolved**
- 2026-09-21: Neon DB host blocked by egress policy — **NEW blocker**

## Queryable
NO — data not written to DB. Data preserved in script at `Staff-requirements-02/scripts/semrush-pages-upsert.js`.
