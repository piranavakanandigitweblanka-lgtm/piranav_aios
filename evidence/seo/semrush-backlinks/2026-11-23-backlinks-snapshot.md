# SEMrush Backlinks Snapshot — ledsone.co.uk
**Date:** 2026-11-23
**Fetched by:** Scheduled SEO agent (automated)
**Status:** DATA FETCHED — DB WRITE BLOCKED (network policy 403)

---

## Backlinks Overview

| Metric | Value |
|---|---|
| Authority Score | 30 |
| Total Backlinks | 20,231 |
| Referring Domains | 842 |
| Referring IPs | 803 |
| Follow Links | 18,626 |
| Nofollow Links | 1,604 |

---

## Failure: Neon DB Write Blocked

The scheduled agent successfully fetched all SEMrush data but could NOT write to Neon DB.

**Error:** Proxy returned `403 Forbidden — no rule or network setting allows this host`  
**Host blocked:** `ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech:443`  
**Cause:** The cloud execution environment's network policy does not allow outbound connections to the Neon database endpoint. Raw TCP database connections and HTTPS to this host are both blocked.

**Action required by Piranav:**
- Either run the upsert script locally (from the Windows machine) where Neon is reachable
- Or add the Neon endpoint to the allowed hosts in the cloud environment network policy

The upsert script is saved at: `piranav_aios/evidence/seo/semrush-backlinks/semrush_upsert.js` (copy from scratchpad)

---

## Top Referring Domains (200 rows fetched — not yet in DB)

```
domain;authority_score;backlinks_count;first_seen_unix;last_seen_unix
ledsone.nl;9;6038;1763204426;1795376430
directory9.biz;5;5101;1699893010;1795380939
syncee.com;35;1602;1745313622;1795395024
coles-directory.com;17;1227;1710461253;1795372453
prolink-directory.com;5;1141;1699938142;1795348193
secretsearchenginelabs.com;16;470;1713428580;1795157062
fennax.com;1;395;1781933790;1786716830
postfreedirectory.com;6;199;1717630165;1791440898
perfect-garden.co.uk;7;185;1753814491;1795330747
celestialdirectory.com;7;157;1736384169;1795377876
snipesocial.co.uk;29;152;1701038561;1784943134
lidsone.com;2;127;1789250582;1795394435
blogfaspec.com.br;11;124;1783176361;1795374179
nichey.net;5;113;1758238519;1795387067
addirectory.org;6;98;1704156187;1794030082
yell.com;71;88;1715994721;1795372450
interesting-dir.com;6;83;1702305009;1794064018
ladsone.com;0;77;1793773116;1795396616
menagerie.media;6;70;1701298161;1795398356
openbadania.pl;29;65;1702369961;1794047250
... (200 rows total — see upsert script for full dataset)
```

---

## API Units Used
- backlinks_overview: 40 units
- backlinks_refdomains (200 rows): 8,000 units
- **Total this run: 8,040 units | Remaining: ~31,850 units**
