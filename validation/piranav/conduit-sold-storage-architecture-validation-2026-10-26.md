# Validation — Conduit Sold Storage Architecture Verification

**Date:** 2026-10-26
**Task:** Verify whether Conduit Sold serves from PostgreSQL snapshot or live Shopify
**Method:** Local code trace + live health check. No code changes, no DB modifications.

---

## Local Code Verification — PASS

| # | Check | Result | Code Location |
|---|---|---|---|
| 1 | Snapshot stored in App DB (not Business DB) | CONFIRMED | `scheduled_snapshot.py` read()/write() use `get_conn()` |
| 2 | Table: `public.admin_conduit_sold_snapshot` | CONFIRMED | `conduit_sold.py` line 433: `table_name=` |
| 3 | Singleton row: id=1, JSONB payload, updated_at | CONFIRMED | `_ensure_table()` in `scheduled_snapshot.py` lines 140-153 |
| 4 | Normal GET reads from snapshot — zero Shopify calls | CONFIRMED | `get_conduit_sold()` lines 447-465 |
| 5 | Shopify only called during background sync / Update button | CONFIRMED | `_compute_conduit_sold()` called only from `run_sync` |
| 6 | 12-hour background refresh schedule | CONFIRMED | `interval_hours=12` in conduit_sold.py line 438 |
| 7 | Startup auto-prime (if snapshot missing) | CONFIRMED | `ScheduledSnapshot.start()` — fires if `payload is None` |
| 8 | Staggered startup (60s between jobs) | CONFIRMED | `_STARTUP_RUN_SPACING_SECONDS = 60` |
| 9 | Component Stock — in-process cache only, no snapshot | CONFIRMED | `_CACHE` dict, `_CACHE_TTL = 5*60` in conduit_stock.py |
| 10 | Component Stock — Business DB source on cache miss | CONFIRMED | `_fetch_conduit_stock_data()` uses `get_business_conn()` |
| 11 | Sync history logged to sales_cache.sync_history | CONFIRMED | `_run_sync_inner()` in scheduled_snapshot.py lines 286-342 |
| 12 | Retry on transient DB errors (5 retries, ~7 min) | CONFIRMED | `_RETRY_DELAYS = (15, 30, 60, 120, 240)` |

## Live Contabo Verification

| # | Check | Result | Method |
|---|---|---|---|
| 13 | Backend process running | CONFIRMED | `curl http://158.220.99.127:8499/api/health` → `{"status":"ok"}` |
| 14 | Deployed commit matches 103de7b | NOT VERIFIED | deploy_log endpoint requires auth |
| 15 | `admin_conduit_sold_snapshot` row exists | NOT VERIFIED | Port 5432 closed; auth required |
| 16 | Snapshot updated within last 12h | NOT VERIFIED | Same — requires DB access |
| 17 | sync_history records present | NOT VERIFIED | Same |

## Overall Result

**LOCAL: PASS** — all code paths traced and confirmed.
**LIVE DATABASE: INCOMPLETE** — health confirmed, database content not verified.

See `evidence/dm-dashboard/conduit-sold-storage-architecture-2026-10-26.md` Section G for exact SQL queries Piranav should run to complete live verification.
