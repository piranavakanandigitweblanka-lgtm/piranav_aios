# DM Dashboard — SKU DE Listings Page: Phase 2 Implementation
**Req ID:** DMDASH-SKUDE-IMPL-2026-10-29
**Date:** 29 October 2026
**Prepared by:** Claude Code
**Branch:** `piranv-work`
**Status:** IMPLEMENTED — local tests pass. Awaiting Piranav commit + push + live verification.

---

## 1. Files Created

| File | Type | Purpose |
|---|---|---|
| `backend/app/dashboard_pages/sku_de_listings.py` | New | FastAPI router — `/api/sku-de-listings/search` |
| `frontend/src/admin/pages/SkuDeListings.jsx` | New | React page component |
| `backend/tests/test_sku_de_listings.py` | New | 20 unit + integration tests |

## 2. Files Modified

| File | Change |
|---|---|
| `backend/app/main.py` | +2 lines: import router + `app.include_router(sku_de_listings_router)` |
| `frontend/src/admin/AdminLayout.jsx` | +1 line: nav entry `{ key: 'sku-de-listings', toolKey: 'tools.SkuDeListings' }` |
| `frontend/src/taskRegistry.jsx` | +11 lines: TOOLS entry for `tools.SkuDeListings` |

---

## 3. API Endpoint

| Property | Value |
|---|---|
| Method | GET |
| URL | `/api/sku-de-listings/search?sku={term}` |
| Auth | `make_task_auth("tools.SkuDeListings")` — admin/dev auto-bypass; staff needs UAM grant |
| Max SKU length | 120 characters |
| DB | `get_business_conn()` (ledsone Business DB) |

**Response shape:**
```json
{
  "sku": "LSCY290BG",
  "total": 37,
  "combo_count": 34,
  "enc_count": 3,
  "rows": [
    {
      "store": "ledsone-de",
      "item_id": "55858247729417",
      "variant_title": "Schwarzes Gold Interieur",
      "sku": "PHCH1FBRBM+LSCY290BG",
      "price_eur": "20.79",
      "stock": 0,
      "status": "active",
      "sku_type": "Combo",
      "listing_url": "https://ledsone.de/products/..."
    }
  ]
}
```

---

## 4. SQL Logic

Two-branch UNION ALL — verified live against DB before implementation:

**Branch A (Combo):** `listings.shopify_listings WHERE sub_source=108 AND sku LIKE '%{term}%' AND is_child=1`

**Branch B (ENC):** JOIN `inventory.products` ON `ip.sku = sl.sku` WHERE `sub_source=108 AND is_child=1 AND sl.sku LIKE 'ENC%' AND ip.sku_original LIKE '%{term}%'`

`sl.sku LIKE 'ENC%'` prevents combo SKUs from appearing in both branches.

**Parameterized SQL** — user input bound via `%(pattern)s` / `%(sub_source)s` — no string interpolation.

**Verified column names:**
- Stock: `quantity` (integer) — NOT `stock` or `qty`
- `is_child`: smallint — compared as `= 1` NOT `= true`
- Price: `price` (numeric) — cast to text in query
- Sub_source Germany: `108`

---

## 5. UAM Setup

**Task key:** `tools.SkuDeListings`

**Who gets access automatically:** admin role + dev role (same as all tools using `make_task_auth`).

**Who needs a UAM grant:** any staff user (non-admin, non-dev) who needs the page must be granted `tools.SkuDeListings` via User Access Management (Admin → Access & Intelligence → User Access Management).

The page will NOT appear in a staff member's sidebar until granted. No auto-grant to any staff user.

---

## 6. Test Results

**File:** `backend/tests/test_sku_de_listings.py`
**Run:** `python -m pytest tests/test_sku_de_listings.py tests/test_sku_stock_lookup.py -v`
**Result: 56/56 PASS** (20 new + 36 existing sku_stock_lookup regression)

| Test | Result |
|---|---|
| Combo-only results | PASS |
| ENC-only results | PASS |
| Combo + ENC combined | PASS |
| No matches → empty list | PASS |
| Correct LIKE pattern + sub_source=108 sent to DB | PASS |
| Response shape has all required keys | PASS |
| DB exception propagates | PASS |
| sub_source constant = 108 | PASS |
| Max SKU length is reasonable (≤200) | PASS |
| Blank SKU → 400 | PASS |
| Missing SKU → 400 | PASS |
| SKU too long → 400 | PASS |
| Valid SKU → 200 + correct counts | PASS |
| No matches → 200 + empty rows | PASS |
| DB error → 502 | PASS |
| Unauthorized → 403 | PASS |
| Unauthenticated → 401 | PASS |
| sku_stock_lookup import unaffected | PASS |
| sku_stock_lookup router prefix unchanged | PASS |
| sku_de_listings router prefix correct | PASS |

**Pre-existing test failures (unrelated):** 5 collection errors from `curl_cffi` missing module — present before this change, not caused by it.

---

## 7. Live DB Verification

Query tested live against ledsone DB with SKU `LSCY290BG` before implementation:
- Combo branch: 3 sample rows returned correctly
- ENC branch: 3 sample rows returned correctly
- Variant titles extracted correctly from `selected_variations` JSON
- `listing_url` confirmed as full URL (e.g. `https://ledsone.de/products/...?variant=...`)

---

## 8. Deployment Steps (awaiting Piranav)

1. Commit all 6 changed files on `piranv-work` branch
2. Push to `websitetecteam-arch/dm-dashboard` (select **websitetecteam-arch** in credential popup)
3. Backend server restart picks up new router automatically
4. Grant `tools.SkuDeListings` to any staff users who need it via UAM
5. Live test: search a known SKU (e.g. `LSCY290BG`) and confirm results appear

---

## 9. What Was NOT Changed

- `SkuStockLookup.jsx` — untouched
- `sku_stock_lookup.py` — untouched
- All existing tests pass — no regression
- No production data modified
- No Shopify data modified
- No permissions auto-granted
