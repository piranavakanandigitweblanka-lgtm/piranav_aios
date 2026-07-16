# Theekshy — Requirement 4: Stock Status Snapshot and Action Queue
**Date:** 2026-07-16
**Owner:** Theekshy
**Delivered by:** Piranav (AIOS)
**Priority:** High

---

## GPT Prompt (verbatim capture)

ROLE: You are an AIOS implementation agent.

OBJECTIVE: Implement Requirement 4 — Stock Status Snapshot and Action Queue — inside
Staff-requirements/pages/theekshy.html (existing 4-tab SPA dashboard). Extend Panel 4
without breaking Requirements 1–3.

TARGET FILE: Staff-requirements/pages/theekshy.html

OWNER: Theekshy

SUPPORTED CAMPAIGNS (exact names, verified in PostgreSQL):
1. Pmax UK | Theekshy | Shoptimised | THEE_GEMS | ORDERS>1 | MCV | UK (ID: 23714290257)
2. Pmax | Theekshy | Shoptimised | THEE_MYSTERY| Non-Converting | MCV | UK (ID: 23684837882)

REQUIREMENT:
Build a manually refreshed snapshot dashboard (NOT live) monitoring stock levels for
products in Theekshy's two Google Ads campaigns. Flag products moving into Going to
Finish (1–10 units), Out of Stock (0 units), or Coming Soon (verified launch date)
status. Provide advisory recommended actions only — no automatic pausing, budget
changes, GMC updates, or alerts.

STOCK-STATUS RULES (priority order):
1. Coming Soon — verified restock/launch date exists in PostgreSQL
2. Out of Stock — inv = 0
3. Going to Finish — inv 1–10 (inclusive)
4. In Stock — inv > 10
5. Unknown — inv is null (inventory join failed — never treat null as zero)

GMC COMPARISON RULES:
- Critical Mismatch: calculated status = Out of Stock AND GMC shows "in stock"
- Warning Mismatch: calculated status = In Stock AND GMC shows "out of stock"
- GMC Data Unavailable: no GMC record exists (NOT a mismatch)
- Data Review Required: status = Unknown AND GMC record exists
- GMC Match: all other cases where data aligns

REQUIRED ACTIONS (from CSV spec):
- In Stock: No action needed; keep ads live as normal
- Going to Finish: Send restock alert to Sonya/Dilaksi; consider trimming budget on
  high-spend campaigns; do not pause yet
- Out of Stock: Pause ads immediately; set GMC availability to Out of Stock; exclude
  from PMax listing group until restocked
- Coming Soon: Set GMC availability to Preorder; prepare asset group + PDP ahead of
  the date; hold spend until launch

FORBIDDEN SCOPE (verbatim — permanent constraints):
- Do NOT modify PostgreSQL
- Do NOT write to Shopify
- Do NOT change Google Ads campaigns or budgets
- Do NOT update GMC
- Do NOT send alerts
- Do NOT create a scheduler
- Do NOT use fake or demonstration data
- Do NOT hardcode business data
- Do NOT create a duplicate dashboard
- Do NOT remove existing requirements
- Do NOT modify unrelated staff pages
- Do NOT change repository or Vercel configuration
- Do NOT commit or push Git
- Do NOT deploy to Vercel
