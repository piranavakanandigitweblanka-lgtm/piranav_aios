# Prompt: Homingmbh Shopify — Unmatched Product Analysis

---

## Category
discovery / shopify

## Purpose
Investigate products that are not assigned to any existing collection. For each unmatched product, fetch full details, analyse against all collection conditions, identify the root cause of exclusion, and produce a safe recommended correction. Read-only — no changes made.

## When to Use
- After product discovery + collection discovery are complete
- When products are found to be excluded from all collections
- Before any productType correction or collection rule change is approved

---

## Prompt (reusable)

> From previous discovery tasks, identify the list of products assigned to no collection.
> For each product, fetch: id, title, handle, status, vendor, productType, descriptionHtml, tags.
> Then analyse each product against all existing collection conditions (productType-based rules).
> For each product report:
> 1. Which collection is the most appropriate match?
> 2. Why is it currently excluded? (productType mismatch, wrong vendor, no tags, collection rule gap)
> 3. What is the safest recommended correction? (rename productType vs add new collection rule)
> 4. What would be the expected result after the fix?
> Save results as a markdown evidence file. Read-only — no product, tag, or collection changes.

## Key Technical Constraints
- Collection membership for all 17 Homingmbh collections is determined solely by productType EQUALS rules
- No tag-based, vendor-based, or title-based collection rules exist
- The only way to fix exclusion is either: (a) correct the product's productType, or (b) add the productType to a collection rule
- DRAFT products should not be published as part of this investigation

## Expected Output
- 7-product detail table (ID, title, status, vendor, type, tags, recommended collection, root cause, fix)
- Recommendation table with safety rating per fix
- Awaits Piranav approval before implementation

## First Used
2026-11-26 — Homingmbh DE store, Task HOMING-2026-11-26-003
