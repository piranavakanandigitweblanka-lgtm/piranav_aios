# Capability: SEMrush Backlinks Pipeline — ledsone.co.uk

**Created:** 2026-09-21
**Status:** PARTIAL — Fetch works; DB write blocked in remote environment

---

## What It Does

Fetches daily backlink metrics for `ledsone.co.uk` from SEMrush and upserts them into Neon PostgreSQL for historical tracking and trend analysis.

## Where

- SEMrush data source: MCP tools `mcp__Semrush__backlinks_research` + `mcp__Semrush__execute_report`
- Script: `Staff-requirements-02/scripts/semrush-backlinks-upsert.js`
- Database: Neon (`ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech`)
- Tables: `semrush_backlinks` (daily overview), `semrush_refdomains` (top 200 domains per day)

## How to Reuse

1. Run `node Staff-requirements-02/scripts/semrush-backlinks-upsert.js` from Piranav's local machine (not from remote Claude Code — Neon is blocked by egress policy)
2. OR deploy as a Vercel cron function inside `Staff-requirements-02/` — Vercel has native connectivity to Neon

## Current DB Schema

```sql
CREATE TABLE semrush_backlinks (
  snapshot_date DATE PRIMARY KEY,
  authority_score INT,
  total_backlinks INT,
  referring_domains INT,
  referring_ips INT,
  follow_links INT,
  nofollow_links INT
);

CREATE TABLE semrush_refdomains (
  id SERIAL,
  snapshot_date DATE NOT NULL,
  domain TEXT NOT NULL,
  authority_score INT,
  backlinks_count INT,
  first_seen DATE,
  last_seen DATE,
  PRIMARY KEY (snapshot_date, domain)
);
```

## Data as of 2026-09-21

- Authority Score: 29
- Total Backlinks: 19,737
- Referring Domains: 728
- Top referring domain: ledsone.nl (5,801 links)
- Notable high-AS referrers: bing.com (AS 96), alibaba.com (AS 79), yell.com (AS 67)

## Known Issues

- Remote Claude Code environments block outbound TCP/HTTPS to Neon (org egress policy)
- Script must be run locally or via Vercel serverless for DB writes to succeed
