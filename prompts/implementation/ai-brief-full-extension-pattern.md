# Prompt: AI Brief Full Extension — All Data Sources Pattern

**Registered:** 2026-09-16 (retrospective)
**Status:** ACTIVE
**Category:** implementation
**Used in:** dm-dashboard · mahima_ai.py, hetheesha_ai.py

---

## What This Solves

AI brief was only reading partial data. Staff was getting incomplete task assignments because the AI didn't know about OOS spending, poor ROAS products, feed gaps, etc.

---

## Prompt Pattern

```
Extend [staff]_ai.py to cover ALL requirement data sources in _gather_data().

For each missing data source:
1. Add DB query to _gather_data()
2. Add section to _build_system_prompt() with:
   - Clear label (e.g. "POOR ROAS PRODUCTS:")
   - Key counts and thresholds
   - Action instruction for the AI
3. Add table to _build_brief_data() for task log display
   - Only add if count > 0
   - Columns: relevant fields + Action column

Also add:
- _last_regeneration_ts global + regenerated_at on /history
- _get_done_candidate_ids() — exclude tasks done in last 7 days
- exclude_ids passed to validated_brief_call
- POST /admin/regenerate-brief endpoint (admin/dev role only)

P1/P2/P3 urgency structure in system prompt:
- P1: Immediate action needed (OOS spending, critical drops)
- P2: Today's focus (optimisation opportunities)
- P3: Monitor (positive signals, scale opportunities)
```

---

## Mahima-Specific Data Sources Added (2026-09-15)

- `poor_roas_products` — ROAS <2.5x, cost ≥€10, conv >0
- `top_roas_products` — ROAS ≥4.0x (Scale signal)
- `low_stock_products` — qty 1–10 via listings.shopify_listings
- `feed_gap_products` — in feed but not spending
- `top_converting_terms` — UNION of pmax + campaign ST tables

Commits: d8f50a4 (backend), 1de342e (frontend)
