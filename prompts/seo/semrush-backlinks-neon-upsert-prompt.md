# Prompt: SEMrush Backlinks Daily Upsert — ledsone.co.uk → Neon DB

**Category:** seo / data-pipeline
**Created:** 2026-10-26
**Status:** ACTIVE

---

## What to Build

A scheduled data pipeline that fetches the latest backlinks overview and top referring domains for `ledsone.co.uk` from SEMrush, then upserts the results into a Neon PostgreSQL database for queryable historical tracking.

---

## Inputs

- **Domain:** `ledsone.co.uk`
- **SEMrush reports:**
  - `backlinks_overview` (target_type: root_domain) — authority score, total backlinks, referring domains, IPs, follow/nofollow
  - `backlinks_refdomains` (target_type: root_domain, display_limit: 200, sort: backlinks_num_desc) — domain, authority score, backlinks count, first/last seen
- **Neon DB:** connection string in environment / task config
- **Snapshot date:** `new Date().toISOString().slice(0, 10)` (today's date)

---

## Which Files

| File | Purpose |
|---|---|
| `Staff-requirements-02/scripts/semrush-backlinks-upsert.js` | Main upsert script |
| `Staff-requirements-02/node_modules/pg` | Already installed — use `require('../node_modules/pg')` |

---

## Database Tables

```sql
CREATE TABLE IF NOT EXISTS semrush_backlinks (
  snapshot_date      DATE PRIMARY KEY,
  authority_score    INT,
  total_backlinks    INT,
  referring_domains  INT,
  referring_ips      INT,
  follow_links       INT,
  nofollow_links     INT
);

CREATE TABLE IF NOT EXISTS semrush_refdomains (
  id              SERIAL,
  snapshot_date   DATE    NOT NULL,
  domain          TEXT    NOT NULL,
  authority_score INT,
  backlinks_count INT,
  first_seen      DATE,
  last_seen       DATE,
  PRIMARY KEY (snapshot_date, domain)
);
```

---

## Key Technical Constraints

- Use `pg` Client with `ssl: { rejectUnauthorized: false }` OR use `@neondatabase/serverless` for HTTP-only environments
- SEMrush refdomains API returns `domain_ascore` (not `ascore`) as the column header even when `domain_authority_score` is requested
- The `first_seen` / `last_seen` columns are Unix timestamps (seconds since epoch), NOT YYYYMMDD — convert with: `new Date(parseInt(s) * 1000).toISOString().slice(0, 10)`
- Delete existing rows for today before inserting (clean re-run): `DELETE FROM semrush_refdomains WHERE snapshot_date = $1`
- Upsert overview with `ON CONFLICT (snapshot_date) DO UPDATE`

---

## Expected Output

```
Connected to Neon DB
Tables ready
Upserted backlinks overview for YYYY-MM-DD
=== SEMrush Backlinks Upsert Complete ===
snapshot_date:     YYYY-MM-DD
authority_score:   30
total_backlinks:   20078
referring_domains: 834
referring_ips:     871
follow_links:      18293
nofollow_links:    1784
refdomains inserted: 170
```

---

## Network Note (Remote Container / Cloud Sessions)

Standard `pg` uses TCP port 5432 — **blocked by the remote container proxy policy** (403 CONNECT tunnel failed). If running from a Claude Code cloud session:
- Use `@neondatabase/serverless` with HTTP mode (`neon` tagged template function)
- OR run the script from a local machine / VS Code Dev Tunnel where port 5432 is not blocked

---

## Reuse

This prompt pattern works for any domain. Replace `ledsone.co.uk` with the target domain and update the connection string. The script structure (CSV temp file → parse → upsert) is reusable across any SEMrush report type.
