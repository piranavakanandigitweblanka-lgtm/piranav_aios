# SEO URL Intelligence — Phase 1 Validation Record
## Date: 2026-10-26 | Validator: Claude Code | Status: PARTIAL PASS — sidebar bug fixed, runtime pending

## Validation Checklist

| # | Test | Method | Status | Result |
|---|---|---|---|---|
| 1 | Backend file parses without syntax errors | `python -c "import ast; ast.parse(...)"` | **PASS** | `PASS — no syntax errors` |
| 2 | import line + include_router present in main.py | grep main.py | **PASS** | Both lines confirmed |
| 3 | GET /sync/status returns {"status":"idle"} before first sync | curl with auth token | PENDING — requires running backend | — |
| 4 | POST /sync/start returns 403 without task grant | curl without auth | PENDING — requires running backend | — |
| 5 | POST /sync/start returns {"status":"computing"} with valid token | curl with dev token | PENDING — requires running backend | — |
| 6 | Sync completes — seo_url_product table populated with real product count | DB query after sync | PENDING — requires running backend | — |
| 7 | Sync idempotent — run twice, row counts unchanged | DB query before/after second sync | PENDING — requires running backend | — |
| 8 | GET /products returns rows with handle, title, description, mismatch_status, ranking_status | API response | PENDING — requires running backend | — |
| 9 | ranking_status filter returns only Ranking Drop rows when filter=Ranking Drop | API with filter | PENDING — requires running backend | — |
| 10 | mismatch_status filter works independently from ranking_status filter | API with both filters | PENDING — requires running backend | — |
| 11 | Products with < 10 impressions show Insufficient Data, not Ranking Drop | DB check on analysis table | PENDING — requires running backend | — |
| 12 | CSV export downloads with correct columns | Browser download | PENDING — requires running backend | — |
| 13 | tools.SeoUrlIntelligence appears in UAM task list | taskRegistry.jsx grep | **PASS** | Line 514 confirmed, `lazy: true, kind: 'tool'` |
| 14 | Staff without grant gets 403 on POST /sync/start | Static code audit: `_REQUIRE_ACCESS = make_task_auth(...)` | **PASS (static)** | Route decorator confirmed, runtime test pending |
| 15 | Frontend builds without error | `npm run build` | **PASS** | 501 modules, `SeoUrlIntelligence-DmL4xJUs.js` emitted, 0 errors |
| 16 | Sidebar fix — entry added to RAW_ADMIN_ITEMS in AdminLayout.jsx | grep AdminLayout.jsx | **PASS** | Line 198: `{ key: 'seo-url-intelligence', toolKey: 'tools.SeoUrlIntelligence', enabled: true }` |
| 17 | Sidebar fix — build passes after AdminLayout.jsx change | `npm run build` | **PASS** | `SeoUrlIntelligence-Cj5iUot1.js` emitted, 0 errors, 788ms |
| 18 | Sidebar grant-filter — entry not in ALWAYS_VISIBLE_KEYS, uses `grantedAtByKey.has(item.toolKey)` | static code audit AdminLayout.jsx line 297 | **PASS** | Users without grant: hidden. Users with grant: visible. Dev role: always visible. |
| 19 | Sidebar visible in running dashboard after grant | Browser test | PENDING — manual check required after deploy |

## Routes Confirmed (static)

| Route | Auth | Line |
|---|---|---|
| GET /stores | `_REQUIRE_LOGIN` | 664 |
| POST /sync/start | `_REQUIRE_ACCESS` (task grant) | 669 |
| GET /sync/status | `_REQUIRE_LOGIN` | 676 |
| GET /summary | `_REQUIRE_LOGIN` | 683 |
| GET /products | `_REQUIRE_LOGIN` | 730 |
| GET /products/csv | `_REQUIRE_LOGIN` | 758 |

## Static Analysis (can run now without running environment)

### Python syntax check
```bash
python -c "
import ast, sys
with open('backend/app/dashboard_pages/seo_url_intelligence.py') as f:
    src = f.read()
try:
    ast.parse(src)
    print('OK — no syntax errors')
except SyntaxError as e:
    print(f'FAIL: {e}')
    sys.exit(1)
"
```

### main.py import check (grep)
Both lines added to main.py:
- `from .dashboard_pages.seo_url_intelligence import router as seo_url_intelligence_router`
- `app.include_router(seo_url_intelligence_router)`

### taskRegistry.jsx check (grep)
Entry added: `taskKey: 'tools.SeoUrlIntelligence'`

### taskAddedDates.json check (grep)
Entry added: `"tools.SeoUrlIntelligence": "2026-10-26"`

## Sidebar Bug — Root Cause and Fix (2026-10-26)

**Root cause:** `tools.SeoUrlIntelligence` was registered in `taskRegistry.jsx` (makes it grantable in UAM) but was missing from `RAW_ADMIN_ITEMS` in `AdminLayout.jsx` (the hardcoded sidebar list). UAM reads from taskRegistry — sidebar reads from RAW_ADMIN_ITEMS. They are independent. Both must be updated for a new tool.

**Fix applied:** One line added to `AdminLayout.jsx` line 198, immediately after `tools.SeoIntelligence`:
```javascript
{ key: 'seo-url-intelligence', toolKey: 'tools.SeoUrlIntelligence', enabled: true },
```

**File changed:** `frontend/src/admin/AdminLayout.jsx`
**Build after fix:** PASS — `SeoUrlIntelligence-Cj5iUot1.js` emitted, 0 errors

## Production Database Inspection — Full Results (2026-10-26)

### Table existence and schema
Both tables exist in `public` schema of `dm_dashboard` (Contabo). Schema matches implementation exactly.

| Table | Rows | Size |
|---|---|---|
| `seo_url_product` | 5,335 | ~10.3 MB |
| `seo_url_analysis` | 5,335 | ~1.3 MB |

All 6 indexes confirmed: PK, `(store, shopify_id)` UNIQUE, `store` index on both tables.

### Store and sync timestamps
- Only store present: `ledsone_uk` ✅ (Phase 1 correct)
- First sync: `2026-10-26 09:43:19 +01:00`
- Latest sync: `2026-10-26 09:43:19 +01:00` (one sync run so far)
- Analysis computed: `2026-10-26 09:43:21 +01:00`

### Data integrity
- Duplicate `(store, shopify_id)`: **0** ✅
- Orphan analysis rows: **0** ✅
- Product/analysis row count match: **5,335 / 5,335** ✅

### Ranking status breakdown
| Status | Count |
|---|---|
| No GSC Data | 5,332 |
| Insufficient Data | 3 |
| (no Ranking Drop / Improved / Stable rows) | — |

### Mismatch status breakdown
| Status | Count |
|---|---|
| Matched | 5,054 |
| Potential Mismatch | 281 |

### Priority breakdown
| Priority | Count |
|---|---|
| N/A (no ranking issue) | 5,054 |
| Medium (mismatch only) | 281 |

### GSC date periods used
- Current period: `2026-09-27` to `2026-10-24` (28 days)
- Previous period: `2026-08-30` to `2026-09-26` (28 days)
- `blog_optimization_gsc_page` rows for `sc-domain:ledsone.co.uk`: **292,502** (table is populated)
- Latest date in GSC table: `2026-10-17`

### ROOT CAUSE — Why 5,332 products show "No GSC Data"

**URL format mismatch between `seo_url_product.canonical_url` and `blog_optimization_gsc_page.page`:**

| Source | URL format |
|---|---|
| `seo_url_product.canonical_url` | `https://www.ledsone.co.uk/products/{handle}` |
| `blog_optimization_gsc_page.page` | `https://ledsone.co.uk/products/{handle}` |

The `canonical_base` in `STORE_CONFIG` is `https://www.ledsone.co.uk/products/` but GSC stores pages without `www.`. Direct JOIN on `canonical_url = page` finds only **1 match** out of 5,335.

**Required fix:** Strip `www.` when matching, or use `REPLACE(p.canonical_url, 'www.', '')` in the JOIN — OR change the `canonical_base` constant to `https://ledsone.co.uk/products/`.

### Dashboard data source
**PostgreSQL only** — `/products` endpoint queries `seo_url_product` LEFT JOIN `seo_url_analysis`. No Shopify calls at read time.

## Database Access Verification (2026-10-26)

| DB | Env Var | Host (masked) | Database | PostgreSQL | SELECT 1 | Confirmed Provider |
|---|---|---|---|---|---|---|
| App DB | `DATABASE_URL` | `158.220.99.***` | `dm_dashboard` | 16.15 (Ubuntu) | PASS | **Contabo** (`vmi3548238.contaboserver.net`) |
| Business DB | `BUSINESS_DATABASE_URL` | `169.58.91.***` | `ledsone` | 18.4 (Ubuntu) | PASS | UNVERIFIED (remote, not Contabo rDNS) |
| Business DB 2 | `BUSINESS_DATABASE_2_URL` | NOT SET | — | — | N/A | N/A |

- App DB (`dm_dashboard`): **PASS — confirmed Contabo**. Reverse DNS resolves to `vmi3548238.contaboserver.net`. This is the database used by `get_conn()` — where `seo_url_product` and `seo_url_analysis` will be created on first sync.
- Business DB (`ledsone`): PASS — connection live, SELECT 1 succeeded. Used by `get_business_conn()`. Remote IP, not Contabo rDNS — provider unverified but accessible.
- Claude Code can connect to both databases from the local environment via project venv + `.env`.

## Notes
- Tables (seo_url_product, seo_url_analysis) created on first sync via _ensure_schema()
- GSC data source: public.blog_optimization_gsc_page — must be populated by gsc_sync.py
- If blog_optimization_gsc_page has no data for ledsone.co.uk products, all ranking_status will be "No GSC Data"
- All mismatch detection is regex-only — no spec sheet data, no verified mismatches
