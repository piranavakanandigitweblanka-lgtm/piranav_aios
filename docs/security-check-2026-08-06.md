# Repository Security Check Report

**Date:** 2026-08-06
**Repo:** github.com/piranavakanandigitweblanka-lgtm/piranav_aios
**Checked by:** Claude Code (Sonnet 4.6)

---

## Result: SAFE

No credentials, API secrets, or private keys found on GitHub.

---

## Checks Performed

| Check | Result |
|-------|--------|
| `shopify_tokens/` on GitHub | Not present |
| `source-map/*.json` (Google service account key) | Not present |
| `.env` files | None found |
| Shopify secret patterns (`shpss_`, `shpat_`) | None found |
| `private_key` / `CLIENT_SECRET` strings | None found |
| Suspicious `.pem`, `.key`, `.json` files | None found |

---

## Local Secrets (gitignored — never pushed)

| File | Contains | Protected by |
|------|----------|--------------|
| `shopify_tokens/server.js` | Shopify OAuth CLIENT_ID + CLIENT_SECRET for ledsone-fra.myshopify.com | `.gitignore` |
| `source-map/ledsone-ga4-mcp-ba2b3b1db2dd.json` | Google service account private key for GA4 MCP reader | `.gitignore` |

---

## GitHub Push Protection Note

During the push on 2026-08-06, GitHub flagged:

- `shopify_projects/ledsone-uk-theme/assets/page-store-location.js` line 6
- `shopify_projects/ledsone-fr-theme/assets/page-store-location.js` line 6

**Token:** `pk.eyJ1Ijoia2hpZW1waGFtIi...` (Mapbox)
**Verdict:** FALSE POSITIVE — `pk.` prefix = Mapbox **public** access token, designed to be in browser-side JS. Not a secret. Bypassed via GitHub secret scanning allow.

---

## .gitignore Protection

The following are blocked from ever being committed:

```
shopify_tokens/
source-map/
*.json.key
*.pem
.env
.env.*
node_modules/
```
