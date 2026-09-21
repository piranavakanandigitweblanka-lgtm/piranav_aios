# Prompt: SEMrush Backlinks → Neon DB Upsert

**Registered:** 2026-09-21
**Used in:** Scheduled SEO data agent session
**Status:** REUSABLE

---

## What to Build

A scheduled data pipeline that fetches backlink metrics for a target domain from SEMrush and upserts them into a Neon PostgreSQL database for historical tracking.

## Which Files

- Script: `Staff-requirements-02/scripts/semrush-backlinks-upsert.js`
- Tables: `semrush_backlinks` (overview, PRIMARY KEY snapshot_date) and `semrush_refdomains` (per-domain rows, PRIMARY KEY snapshot_date + domain)

## Endpoints / Tools

- SEMrush MCP: `mcp__Semrush__execute_report` with report `backlinks_overview` (target, target_type)
- SEMrush MCP: `mcp__Semrush__execute_report` with report `backlinks_refdomains` (target, target_type, display_limit, display_sort, export_columns)
- Neon DB: via `pg` Node client (connection string with `sslmode=verify-full`) OR Neon HTTP API (`https://<host>/sql`) if direct TCP is blocked

## Key Technical Constraints

1. SEMrush `backlinks_refdomains` returns `first_seen`/`last_seen` as **Unix timestamps** (seconds), not YYYYMMDD. Convert: `new Date(parseInt(s) * 1000).toISOString().slice(0,10)`
2. The API returns column `domain_ascore` (not `ascore`) for the authority score field
3. Use `ON CONFLICT (snapshot_date) DO UPDATE` for the overview table
4. Use DELETE + INSERT (not upsert) for refdomains — cleaner for bulk re-runs: `DELETE FROM semrush_refdomains WHERE snapshot_date = $1` then batch INSERT
5. In remote Claude Code environments, direct TCP to Neon (port 5432) is blocked by egress policy. Run the script locally or from Vercel serverless functions.
6. `pg` SSL: use `ssl: { rejectUnauthorized: false }` in Client config, and `sslmode=verify-full` in connection string (not `sslmode=require` which triggers a deprecation warning in pg v8)

## Expected Output

```
Connected to Neon DB
snapshot_date: 2026-09-21
Tables ensured.
Overview: { authority_score: 29, total_backlinks: 19737, ... }
Upserted backlinks overview row.
Deleted existing refdomains for 2026-09-21
Parsed 196 referring domains
=== UPSERT COMPLETE ===
snapshot_date: 2026-09-21
authority_score: 29
total_backlinks: 19737
referring_domains: 728
referring_ips: 806
follow_links: 17981
nofollow_links: 1786
referring domains inserted: 196
```

## Reuse Instructions

Replace `ledsone.co.uk` with any target domain. Replace connection string. The table schema is generic and supports multiple domains if you add a `target_domain` column.
