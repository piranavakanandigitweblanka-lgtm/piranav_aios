# Prompt: Homingmbh Shopify — Complete Collection List Discovery

---

## Category
discovery / shopify

## Purpose
Fetch the complete collection inventory from a connected Shopify store via Admin GraphQL API (paginated). Covers both custom and smart collections. Produces a full collection register with product counts and smart collection rules, used as input for downstream tagging, SEO, and collection audit tasks.

## When to Use
- Task 2 on any new Shopify store project (after product discovery)
- Before any collection reorganisation, tagging, or SEO work
- When a full collection inventory snapshot is needed as a baseline

---

## Prompt (reusable for any Shopify store)

> Connect to the Shopify store via MCP.
> Fetch all collections using paginated GraphQL — both custom and smart collections.
> Use the `collections` query (returns both types). 100 per page, follow hasNextPage + endCursor until done.
> For each collection return: Collection ID, Title, Handle, collection type (custom vs smart), and product count.
> For smart collections also return: disjunctive flag + all rules (column, relation, condition).
> For each collection, separately query the first 100 assigned products (ID + title) to verify membership.
> Save results as a markdown evidence file with:
> - Total collection count
> - Full collection table (ID, title, handle, type, product count)
> - Smart collection rules table
> - Pagination log
> - Any empty collections or mismatches flagged
> Strictly read-only. Do not modify any products, tags, or collections.

---

## Key Technical Constraints
- Shopify `collections` query returns both custom and smart collections
- Use `__typename` to distinguish CustomCollection vs SmartCollection
- Product count available via `productsCount { count }` on each collection node
- Smart collection rules returned via `ruleSet { appliesDisjunctively rules { column relation condition } }`
- Max 100 collections per page; max 100 products per collection per page
- Collection ID is a GID (`gid://shopify/Collection/...`) — strip prefix for readability

## Expected Output
- Full collection table (ID, title, handle, type, productCount)
- Smart collection rules for each smart collection
- Gap report: empty collections, collections with no handle, etc.

## First Used
2026-11-26 — Homingmbh DE store, Task HOMING-2026-11-26-002
