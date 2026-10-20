# Incident Report: Accidental SKU Exclusion Seeding

**Date:** 2026-10-15  
**Severity:** Medium — production exclusion table polluted, no financial or pricing data changed  
**Reporter:** Piranav  
**Status:** PENDING APPROVAL FOR RECOVERY  

---

## 1. What Happened

Piranav accidentally clicked the "Seed Exclusions (CO/CH/RO/FG/SN/YB/GB + PLAD)" button on the live DM Dashboard Promotion Automation page. This triggered `POST /api/admin/promotion-automation/seed-exclusions`, which inserted permanent SKU exclusions for every LEDSone UK Shopify SKU ending in CO, CH, RO, FG, SN, YB, or GB, and every SKU starting with PLAD.

---

## 2. Seeder Implementation — Verified from Code

**File:** `backend/app/dashboard_pages/promotion_automation.py` lines 1356–1424

| Property | Value |
|---|---|
| SQL operation | `INSERT ... ON CONFLICT (sku) DO NOTHING` |
| Idempotent | YES — existing records are silently skipped |
| Actor recorded | YES — `excluded_by` = `user.staff_key` or `user.username` or `"system"` |
| Timestamp recorded | YES — `excluded_at` DEFAULT NOW() |
| Batch ID | NO — no `seed_batch_id` field exists |
| Source | Queries `listings.shopify_listings` filtered by `sub_source = 104` (LEDSone UK only) |
| Suffix rule | SKU ends with CO, CH, RO, FG, SN, YB, or GB |
| Prefix rule | SKU starts with PLAD |
| Reason text | `"Permanent exclusion — colour variant suffix (X) per promotion policy (electroplated colour LS SKUs)"` |
| Auth | Requires admin or dev role (`_require_admin_role(user)`) |

**Table schema** (`promotion_sku_exclusions`):
```
id               SERIAL PRIMARY KEY
sku              VARCHAR(100) NOT NULL UNIQUE  ← unique constraint used by ON CONFLICT
exclusion_reason VARCHAR(200) NOT NULL
is_permanent     BOOLEAN      NOT NULL DEFAULT FALSE
excluded_by      VARCHAR(100) NOT NULL
excluded_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
```

---

## 3. Database Investigation Result

**BLOCKER:** `promotion_sku_exclusions` lives in the **app database** (`DATABASE_URL` — Contabo Postgres). This database is NOT accessible via the `ledsone-db-mcp` MCP tools, which only reach the `ledsone` business DB and `ph_dashboard`. Direct DB queries could not be run.

**What this means for recovery:**
- Record counts, timestamps, and actor cannot be confirmed remotely
- Piranav must run the investigation queries directly (psql, DBeaver, or Adminer on Contabo)
- The recovery SQL below is structurally correct but timestamps/actor must be substituted from actual query results

---

## 4. Investigation Queries — Run These on Contabo App DB

Connect to the app DB (DATABASE_URL) and run:

```sql
-- Q1: Total records and time range
SELECT 
  COUNT(*) as total_records,
  MIN(excluded_at) as earliest,
  MAX(excluded_at) as latest,
  COUNT(DISTINCT excluded_by) as distinct_actors
FROM promotion_sku_exclusions;

-- Q2: Batches by minute — identify the accidental run
SELECT 
  DATE_TRUNC('minute', excluded_at) as insert_minute,
  excluded_by,
  COUNT(*) as records_inserted
FROM promotion_sku_exclusions
GROUP BY DATE_TRUNC('minute', excluded_at), excluded_by
ORDER BY insert_minute DESC
LIMIT 10;

-- Q3: Pre-existing records (older than 1 hour before the latest batch)
SELECT COUNT(*) as pre_existing
FROM promotion_sku_exclusions
WHERE excluded_at < (SELECT MAX(excluded_at) - INTERVAL '1 hour' FROM promotion_sku_exclusions);

-- Q4: All records — full list for review
SELECT sku, exclusion_reason, is_permanent, excluded_by, excluded_at
FROM promotion_sku_exclusions
ORDER BY excluded_at ASC;

-- Q5: Count of active Shopify SKUs that would be freed after removal
SELECT COUNT(DISTINCT sl.sku) as affected_skus
FROM listings.shopify_listings sl
JOIN promotion_sku_exclusions pe ON pe.sku = sl.sku
WHERE sl.status = 'active';
```

---

## 5. Record Classification (fill in from Q1–Q4 results)

| Category | Count | Evidence |
|---|---|---|
| Accidental (seeder batch) | TBD | Timestamp cluster from Q2, actor = Piranav's staff_key |
| Pre-existing legitimate | TBD | Earlier timestamp or different actor (from Q3/Q4) |
| Uncertain | TBD | Cannot distinguish without Q4 review |

---

## 6. Recovery SQL — DO NOT EXECUTE WITHOUT APPROVAL

Run Q1–Q4 first. Fill in `<accidental_start>`, `<accidental_end>`, `<actor>` from results.

```sql
-- RECOVERY SCRIPT — REQUIRES PIRANAV APPROVAL BEFORE EXECUTION
-- Generated: 2026-10-15
-- Incident: Accidental exclusion seeder run on production DM Dashboard
-- Purpose: Remove only records inserted by the accidental click

BEGIN;

-- Step 1: Backup — review this output before proceeding
SELECT * FROM promotion_sku_exclusions
WHERE excluded_at BETWEEN '<accidental_start>' AND '<accidental_end>'
  AND excluded_by = '<actor>'
  AND exclusion_reason LIKE '%per promotion policy%';

-- Step 2: Count to verify scope
SELECT COUNT(*) as rows_to_delete FROM promotion_sku_exclusions
WHERE excluded_at BETWEEN '<accidental_start>' AND '<accidental_end>'
  AND excluded_by = '<actor>'
  AND exclusion_reason LIKE '%per promotion policy%';

-- Step 3: Delete only the accidental batch
DELETE FROM promotion_sku_exclusions
WHERE excluded_at BETWEEN '<accidental_start>' AND '<accidental_end>'
  AND excluded_by = '<actor>'
  AND exclusion_reason LIKE '%per promotion policy%';

-- Step 4: Verify remaining count equals pre-existing count from Q3
SELECT COUNT(*) as remaining FROM promotion_sku_exclusions;

-- Step 5: COMMIT only if remaining count matches expected pre-existing count
-- COMMIT;
-- If uncertain: ROLLBACK;
```

**Safety:** The `exclusion_reason LIKE '%per promotion policy%'` clause is seeder-specific — manual exclusions use different reason text, so they are protected.

---

## 7. Expected Impact After Recovery

After removing accidental records, eligible-skus scan will:
- Return LEDSone UK SKUs with CO/CH/RO/FG/SN/YB/GB suffixes again (they are valid products, just incorrectly excluded)
- PLAD-prefix SKUs will also return if they were incorrectly seeded
- Hard reject counts will decrease
- Eligible SKU counts will increase

The actual count depends on Q5 result.

---

## 8. Prevention Recommendations (require approval before implementation)

| Change | Files | What it does |
|---|---|---|
| Add `GET /seed-exclusions/preview` | `promotion_automation.py` | Returns count of would-be-inserted without inserting |
| Replace button with confirmation modal | `PromotionAutomation.jsx` | Shows preview count, requires explicit confirm click |
| Add `seed_batch_id UUID` to table | `promotion_automation_db.py` | Makes future rollbacks trivial — DELETE WHERE seed_batch_id = X |
| Verify `excluded_by` always set to staff_key | `promotion_automation.py` | Already works — confirmed in code (line 1402) |
| Rate limit to admin/dev only | `promotion_automation.py` | Already enforced — `_require_admin_role(user)` on line 1366 |

---

## 9. Approval Status

**PENDING** — Piranav must:
1. Run Q1–Q4 on the Contabo app DB
2. Confirm accidental batch timestamp and actor
3. Review the exact records to be deleted
4. Approve the recovery SQL
5. Execute in a transaction, verify count, then COMMIT

---

## 10. Confirmation

No production records were deleted. No seeder was re-run. No Shopify products, prices, orders, or inventory were modified. No code changes were made. No commits were made.
