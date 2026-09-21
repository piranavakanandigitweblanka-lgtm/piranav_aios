# Evidence: SEMrush Organic Keyword Snapshot — 2026-09-21

**Task:** Daily scheduled task — fetch top 100 organic keywords for ledsone.co.uk from SEMrush and upsert into Neon DB  
**Date:** 2026-09-21  
**Status:** BLOCKED — network egress policy blocks Neon HTTP endpoint

---

## What was done

1. **SEMrush fetch** — SUCCEEDED  
   Called `execute_report` with `resource_organic`, `target=ledsone.co.uk`, `database=uk`, `display_limit=100`, `display_sort=traffic_desc`.  
   Retrieved 100 keyword rows. API units used: 1000.

2. **npm install** in `Staff-requirements-02` — SUCCEEDED  
   Dependencies installed including `pg`, `@neondatabase/serverless`, `https-proxy-agent`.

3. **First attempt — `pg` TCP driver** — FAILED (hung, exit 144)  
   Direct TCP connection to `ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech:5432` hung indefinitely. Port 5432 is blocked in this remote execution environment — only HTTPS egress is supported via the proxy.

4. **Second attempt — `@neondatabase/serverless` HTTP mode** — FAILED (403 from egress proxy)  
   Error: `Server error (HTTP status 403): Host not in allowlist: api.c-2.eu-west-2.aws.neon.tech. Add this host to your network egress settings to allow access.`

---

## SEMrush Data — Top 20 keywords fetched (full 100 in script)

| Keyword | Position | Volume | Traffic |
|---|---|---|---|
| ledsone | 1 | 590 | 472 |
| connector with wire | 1 | 3600 | 295 |
| wire connectors | 1 | 4400 | 286 |
| wiring and connectors | 1 | 3600 | 126 |
| ledsone lighting | 1 | 140 | 112 |
| bayonet bulb | 5 | 3600 | 86 |
| plug in pendant light | 3 | 1300 | 84 |
| plug in hanging pendant lamp | 2 | 1300 | 84 |
| lamparade | 2 | 1000 | 82 |
| connectors for wiring | 2 | 3600 | 79 |
| white blackboard | 7 | 3600 | 68 |
| retro light shades | 2 | 480 | 63 |
| e27 light bulb | 7 | 2900 | 63 |
| ceiling light bracket | 2 | 480 | 63 |
| plug in hanging light fixtures | 2 | 720 | 59 |
| b22 bulb | 8 | 4400 | 57 |
| spider light fitting | 1 | 390 | 51 |
| spider lights | 2 | 590 | 48 |
| bulb receptacle | 2 | 1000 | 44 |
| what is an e27 bulb | 1 | 320 | 42 |

---

## Root Cause

The Claude Code remote environment's network egress policy blocks connections to `api.c-2.eu-west-2.aws.neon.tech` (Neon's HTTP SQL API endpoint used by the serverless driver). The environment has an allowlist of permitted outbound hosts.

---

## Blocker resolution

Piranav needs to add these hosts to the environment's egress allowlist:

- `api.c-2.eu-west-2.aws.neon.tech` (Neon HTTP SQL endpoint)
- `ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech` (Neon connection endpoint)

**How:** Claude Code web → Environments → select the environment running this scheduled task → Network settings → add the hosts above.

Docs: https://code.claude.com/docs/en/claude-code-on-the-web

---

## Files created this session

- `prompts/implementation/semrush-organic-snapshot-neon-daily.md` — reusable prompt
- `Staff-requirements-02/scripts/semrush-upsert.mjs` — ready-to-run ESM script (will succeed once egress is fixed)
- `Staff-requirements-02/scripts/semrush-upsert.js` — CJS version (kept for reference, requires TCP port 5432)

---

## Queryability: NO (data not stored — blocked before DB write)
