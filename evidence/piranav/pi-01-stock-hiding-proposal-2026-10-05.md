# PI-01: Stock-Hiding Rule Investigation — Evidence

**Task code:** PI-01  
**Date:** 2026-10-05  
**Owner:** Piranav  
**Approver:** Muguntha  
**Listing:** ~5543 — Terminal Box Conduit Fittings (ledsone.co.uk)  
**Status:** Proposal sent to Muguntha — awaiting decision  

---

## Problem

Three variants of listing ~5543 show as unavailable on the website despite having stock recorded in UK Unit3 (warehouse).

| SKU | UK Unit3 (Warehouse) | Shopify Shows | Status |
|---|---|---|---|
| PCGZ20MO (2-Way) | 3 units | 0 — unavailable | ❌ |
| PCGZ20MY (3-Way) | 3 units | 0 — unavailable | ❌ |
| PCGZ20ML (L 2-Way) | 0 units | 0 — unavailable | Expected |
| PCGZ20MT (1-Way) | 6 units | 6 — available | ✓ |

---

## Key Finding

PCGZ20MT (1-Way) proves UK Unit3 is syncing correctly to Shopify — 6 units on both sides. The issue is **specific to PCGZ20MO and PCGZ20MY** only.

---

## Likely Causes

1. **Reserved / committed stock** — the 3 units may be allocated to a pending order or pre-existing reservation, leaving 0 available to sell
2. **Minimum stock buffer** — a safety stock rule may be holding back SKUs with 3 or fewer units
3. **Channel-specific app rule** — an app or setting blocking those variants from showing as available on the website

---

## Proposal Sent to Muguntha

> Could you check with the warehouse or the inventory sync team whether:
> - Units of PCGZ20MO and PCGZ20MY in UK Unit3 are reserved against any orders
> - There is a stock buffer or safety stock rule applied to these SKUs
>
> No changes have been made. Please advise on the next step and I will act on your decision.

**Additional note:** Arudchelvi has been notified separately — the same rule may be affecting stock visibility on eBay and Amazon.

---

## Piranav's Additional Requirement

Show only in-stock variants on the listing. When out-of-stock variants are restocked, they should reappear automatically.

---

## Changes Made

None. Investigation only.

---

## Next Step

Awaiting Muguntha's decision on root cause (reserved stock vs. buffer rule). Once confirmed, Piranav will implement the fix.
