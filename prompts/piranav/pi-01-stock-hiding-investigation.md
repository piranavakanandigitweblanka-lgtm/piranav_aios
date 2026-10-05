# PI-01: Investigate Stock-Hiding Rule and Write Proposal

**Category:** Shopify / Inventory  
**Registered:** 2026-10-05  
**Task code:** PI-01  
**Project:** ledsone.co.uk

## Prompt

You are investigating why certain product variants show as unavailable in Shopify despite having stock in the warehouse. A specific listing has been flagged where one variant syncs correctly but others do not.

**What to build:**
1. Compare warehouse inventory (UK Unit3 or equivalent location) against Shopify availability for each variant SKU on the flagged listing
2. Identify which specific SKUs are affected and which are not
3. Determine the likely root cause from these options: (a) reserved/committed stock against a pending order, (b) minimum stock buffer / safety stock rule applied to the SKU, (c) a channel-specific app rule blocking those variants
4. Write a clear proposal to the approver (Muguntha) stating the findings, the likely causes, and the question they need to answer — without making any changes

**Files / endpoints to check:**
- Shopify Admin > Products > [listing] > Inventory per location
- Any installed inventory sync or buffer apps (e.g. Avasam, ShipBob, custom)
- robots.txt / channel listing settings are out of scope for this task

**Key constraints:**
- Do NOT change any inventory, prices, or settings — investigation only
- Write UNKNOWN if a fact cannot be confirmed
- Notify the product holder (e.g. Arudchelvi) if the same rule may affect eBay/Amazon visibility
- The proposal must state: what was found, what the likely cause is, and what decision is needed from Muguntha

**Expected output:**
A written proposal (email or doc format) addressed to Muguntha with: problem summary, per-SKU inventory table, likely causes, and a clear question for their decision. No changes made.
