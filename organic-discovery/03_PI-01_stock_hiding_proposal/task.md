# PI-01 — Find Stock-Hiding Rule, Write Proposal → Send to Muguntha

**Task code:** PI-01  
**Owner:** Piranav  
**Approver:** Muguntha  
**Deadline:** Mon 5 Oct 2026, 18:00 SL (past due)  
**Status:** BLOCKED — proposal sent, awaiting Muguntha's decision  
**Source:** LEDSone Organic Discovery: Rules, Recommendations and Results Log — Task list #30  
**Backfilled into AIOS:** 2026-10-05  

---

## Objective

Find the Shopify setting or rule that causes certain product variants to show as unavailable despite having physical stock in the warehouse. Write a clear proposal for Muguntha identifying the issue and asking for a decision on root cause before any fix is implemented.

---

## Listing Investigated

**Listing:** ~5543 — Terminal Box Conduit Fittings  
**URL:** ledsone.co.uk/products/[terminal box slug]

---

## Investigation Findings (from PI-01.docx)

### Inventory Table

| SKU | Inventory System (UK Unit3) | Shopify Shows | Status |
|---|---|---|---|
| PCGZ20MO (2-Way) | 3 units | 0 — unavailable | ❌ |
| PCGZ20MY (3-Way) | 3 units | 0 — unavailable | ❌ |
| PCGZ20ML (L 2-Way) | 0 units | 0 — unavailable | Expected |
| PCGZ20MT (1-Way) | 6 units | 6 — available | ✓ |

### Key Finding

PCGZ20MT (1-Way) proves UK Unit3 is syncing to Shopify correctly. The issue is specific to PCGZ20MO and PCGZ20MY.

### Likely Causes (from document)

1. Reserved/committed stock — units allocated to a pending order
2. Minimum stock buffer — rule holding back SKUs with 3 or fewer units
3. Channel-specific app rule blocking those variants

---

## Proposal Status

**Proposal written and sent to Muguntha.**  
**No website changes were made.**

Questions asked of Muguntha:
- Are PCGZ20MO and PCGZ20MY units reserved against any orders?
- Is there a stock buffer or safety stock rule applied to these SKUs?

Arudchelvi also notified — same rule may affect eBay and Amazon visibility.

---

## Additional Requirement Captured

Piranav's note from document:

> "At my listing show only stock product and when other variation will re stock out show in the listing agin"

Meaning: show only in-stock variants; reappear automatically when restocked.

---

## Evidence

| File | Description |
|---|---|
| `evidence/source/PI-01.docx` | Original completion document from Piranav |
| `evidence/evidence_01.png` to `evidence_06.png` + `evidence_05.jpg` | Screenshots from the PI-01 document |
| `evidence/PI-01_evidence.md` | Extracted evidence notes |

See also: `piranav_aios/evidence/piranav/pi-01-stock-hiding-proposal-2026-10-05.md` (main AIOS evidence record)

---

## Screenshots

**Before:** Not applicable — no before state (investigation only, no website change)  
**After:** Not applicable — no website changes made  
**Evidence screenshots:** 6 images extracted from PI-01.docx → `evidence/`

---

## Current Blockers

| Blocker | Who resolves |
|---|---|
| Muguntha has not yet confirmed root cause (reserved stock vs. buffer rule) | Muguntha |
| Fix cannot be implemented until root cause is confirmed | N/A until Muguntha responds |

---

## Next Step

When Muguntha responds:
1. Confirm root cause
2. Implement the fix (hide out-of-stock variants; reappear on restock)
3. Verify live
4. Update this task to COMPLETED

---

## 14-Day Check

Not applicable until fix is implemented and live.
