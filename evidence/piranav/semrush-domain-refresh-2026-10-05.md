# SEMrush Domain Refresh — 2026-10-05 (BLOCKED)

**Date:** 2026-10-05 03:13 UTC  
**Task:** Weekly SEMrush domain overview fetch + upsert into semrush_history (ledsone.co.uk, 2026-10-01)  
**Session type:** Scheduled / automated  
**Status:** BLOCKED — two independent blockers, both previously documented

---

## Blockers

### Blocker 1 — SEMrush API Units Exhausted (PRIMARY)
- **Error:** `no_api_units` — "The user has an active Semrush subscription, but does not have enough API units to complete this request."
- **Tool called:** `mcp__Semrush__domain_overview`
- **Retryable:** No — requires top-up at https://www.semrush.com/mcp-access
- **Trace ID:** `58a637541de6abad3b2d412cedd89e1e`
- **Previously documented:** 2026-09-14 closure entry

### Blocker 2 — Neon DB Not Reachable (SECONDARY)
- **NEON_DATABASE_URL:** Not set in remote container environment
- **No .env / .env.local:** Confirmed absent in `Staff-requirements-02/`
- **Vercel CLI:** Not installed in remote container
- **Postgres MCP (`mcp__Postgras`):** Connected to a different database (no `semrush_history` table present)
- **Known egress block:** `ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech` blocked by remote container network policy
- **Previously documented:** 2026-09-21 closure entries (multiple sessions)

---

## What Was Attempted

1. `git status` — clean working tree  
2. `mcp__Semrush__domain_overview` — returned `no_api_units` error  
3. `mcp__Postgras__list_table_definitions` — confirmed different DB (no semrush_history)  
4. `mcp__Postgras__execute_sql` for semrush_history columns — returned empty (table not in this DB)  
5. Searched for `.env*` files — none found  
6. Checked environment variable NEON_DATABASE_URL — not set  
7. Checked Vercel CLI — not installed  

---

## Data Not Written

- Month: `2026-10-01` — **not upserted** (both blockers prevent it)

---

## Resolution Required (Piranav)

1. **SEMrush API units** — Top up at https://www.semrush.com/mcp-access  
   This is the single biggest blocker — without it no data can be fetched regardless of DB connectivity.

2. **Neon egress allowlist** — Add `*.neon.tech` to remote session network allowlist  
   Instructions: https://code.claude.com/docs/en/claude-code-on-the-web (network settings)  
   Specific host: `ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech`

3. **NEON_DATABASE_URL in trigger environment** — Set this in the scheduled trigger config  
   Once egress is open, the script will need the connection string injected.

Once both blockers are resolved, the next scheduled run will succeed automatically.  
All scripts are ready (`Staff-requirements-02/scripts/semrush-upsert.js`).
