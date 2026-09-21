# Capability: SEMrush Organic Pages → Neon DB Pipeline

**Created:** 2026-09-21  
**Status:** PARTIAL — SEMrush fetch works; Neon write blocked by egress policy  
**Owner:** Piranav / Scheduled automation

## What This Does
Fetches the top 50 organic pages for ledsone.co.uk from SEMrush weekly and upserts them into a Neon PostgreSQL table (`semrush_pages`) for SEO trend tracking over time.

## Components

### SEMrush Fetch
- Tool: `mcp__Semrush__execute_report`
- Report: `resource_organic_unique`
- Target: `ledsone.co.uk`, UK database
- Columns: url, traffic, keywords_count, traffic_share
- Cost: 500 API units per run

### Neon DB Table: `semrush_pages`
```sql
CREATE TABLE IF NOT EXISTS semrush_pages (
  snapshot_date DATE NOT NULL,
  page_url TEXT NOT NULL,
  traffic INT,
  keywords_count INT,
  traffic_share NUMERIC,
  page_type TEXT,
  PRIMARY KEY (snapshot_date, page_url)
);
```

### URL Classification
- `homepage`: root URL exactly
- `blog`: contains `/blogs/`
- `collection`: contains `/collections/`
- `product`: contains `/products/`
- `other`: anything else (locale paths, etc.)

### Node.js Script
`Staff-requirements-02/scripts/semrush-pages-upsert.js`
- Uses `@neondatabase/serverless` driver (HTTPS-based, works through proxy when host is allowed)
- Upserts via `ON CONFLICT (snapshot_date, page_url) DO UPDATE SET ...`

## How to Reuse
1. Change `target` in SEMrush params to run for ledsone.fr or electricalsone.co.uk
2. Change `database` param (`uk`, `fr`, `de`, etc.)
3. Run `node Staff-requirements-02/scripts/semrush-pages-upsert.js` from `piranav_aios/`

## Enabling DB Write
Add `*.neon.tech` or specifically `api.c-2.eu-west-2.aws.neon.tech` to the session's network egress allowlist at https://code.claude.com/docs/en/claude-code-on-the-web

## Evidence
`evidence/piranav/semrush-organic-pages-fetch-2026-09-21.md`

## Related Capabilities
- `capability/seo-skills-tab-2026-09-14.md` — SEO dashboard tab
- `capability/gsc-live-sync-2026-09-18.md` — GSC data pipeline (similar pattern)
