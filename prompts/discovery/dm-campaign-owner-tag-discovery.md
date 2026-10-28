---
name: dm-campaign-owner-tag-discovery
description: Reusable prompt for discovering the actual Shopify product owner tag dictionary for DM Campaign products by querying the production ledsone DB. Produces a frequency table, candidate tag lists, conflict rate, and questions for human confirmation. Read-only. No implementation.
metadata:
  type: prompt
  category: discovery
---

# DM Campaign — Owner Tag Discovery Prompt

## Purpose
Query the production ledsone PostgreSQL DB to discover the actual Shopify product owner tags
for products in the DM Performance Max and DM Shopping campaigns.
Produce a frequency table of tag values, identify candidate owner tags for each staff member,
measure conflict rate, and quantify untagged coverage.
Do NOT assign ownership. Return a candidate list for human confirmation.

## Safety Rules (must follow — never relax)
- Read-only: no UPDATE/INSERT/DELETE on any table
- Do not expose env-var values, credentials, or connection strings
- Do not assume tag examples are exhaustive — all examples need confirmation
- Do not assign a staff owner based on a tag name without supporting evidence from Piranav

## Campaign IDs (confirmed)
- DM Performance Max: `20810136438`
- DM Shopping (DM46_2_KL_AGU): `24199938236`

## Tag Join Chain (verified live — use this exact chain)
```sql
-- Step 1: distinct Shopify product IDs from DM campaigns
SELECT DISTINCT split_part(product_item_id, '_', 3) AS product_id
FROM google_ads.product_performance
WHERE campaign_id IN ('20810136438', '24199938236')
  AND product_item_id ~* '^shopify_[a-z]+_[0-9]+_[0-9]+$'
  AND product_item_id <> ''

-- Step 2: join to parent listing to get internal ID
JOIN listings.shopify_listings sl
  ON sl.item_id = dp.product_id AND sl.sub_source = 104 AND sl.is_parent = 1

-- Step 3: join to tags
LEFT JOIN listings.shopify_listing_tag slt
  ON slt.product_id = sl.id AND slt.sub_source = 104 AND (slt.is_deleted = 0 OR slt.is_deleted IS NULL)
```

## Key DB Facts
- MCP connects to `DATABASE_URL` (ledsone production DB) — has `google_ads`, `listings`, `order_management` schemas
- `sales_cache` schema (in `BUSINESS_DATABASE_URL`) is NOT accessible via MCP — use `listings.shopify_listing_tag` instead
- `listings.shopify_listing_tag` columns: `id`, `product_id` (int = shopify_listings.id), `tag` (varchar), `sub_source` (int), `is_deleted` (smallint)
- UK sub_source for shopify_listings: 104
- Many tags have a leading space (` Sonya`, ` SJ`, ` Dracarys`) — always TRIM() in SQL, strip() in Python

## Queries to Run
1. **Coverage check**: total distinct products → has parent listing → has tags → no tags
2. **Tag frequency table**: `GROUP BY tag ORDER BY COUNT(DISTINCT product_id) DESC LIMIT 100`
3. **Targeted search**: tags containing owner name keywords (ILIKE '%sonya%', '%sj%', '%agu%', etc.)
4. **Conflict check**: products with BOTH Sonya-family and SJ-family tags

## Output Required
- Coverage numbers (total, matched, unmatched, tagged, untagged)
- Tag frequency table with: tag value, product count, in_pmax count, in_shopping count
- Candidate Sonya tag list (frequency-ranked, trimmed) — label as CANDIDATE, not confirmed
- Candidate Sajeepan/SJ tag list (frequency-ranked, trimmed) — label as CANDIDATE, not confirmed
- Other staff tag families identified (do not assign to Sonya/SJ without evidence)
- Conflict rate if both families applied
- Data quality findings (leading spaces, case variations, etc.)
- Questions for Piranav to confirm before implementation proceeds

## Important Notes
- Tags returned here are CANDIDATES — only Piranav/GPT can confirm the authoritative owner tag list
- The `_classify_owner()` function in the feasibility audit must use `t.strip().lower()` not just `t.lower()` — leading space tags will NOT match otherwise
- The conflict rate depends entirely on which tags are included — a broader set = more conflicts
