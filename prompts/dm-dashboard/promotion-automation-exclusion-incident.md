# Prompt: Promotion Automation — Accidental Exclusion Seeder Incident Recovery

**Date:** 2026-10-15  
**Type:** Incident recovery + prevention  
**Status:** PENDING PIRANAV APPROVAL

## Context
Piranav accidentally clicked "Seed Exclusions" on the live DM Dashboard. This triggered POST /seed-exclusions which inserted permanent exclusions for all LEDSone UK Shopify SKUs matching CO/CH/RO/FG/SN/YB/GB suffixes or PLAD prefix. Recovery requires connecting to the Contabo app database directly.

## Recovery Steps
1. Connect to app DB (DATABASE_URL on Contabo)
2. Run investigation queries from evidence file
3. Confirm accidental batch timestamp and actor
4. Review exact records to delete
5. Execute recovery SQL in transaction
6. COMMIT only if remaining count matches expected

## Prevention (implement after recovery approved)
- Add GET /seed-exclusions/preview endpoint
- Replace seed button with confirmation modal
- Add seed_batch_id UUID column to promotion_sku_exclusions

## Evidence
`evidence/dm-dashboard/promotion-automation-exclusion-incident-2026-10-15.md`
