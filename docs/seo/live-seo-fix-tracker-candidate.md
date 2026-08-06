# Capability Candidate — Live SEO Fix Tracker

**Status:** CANDIDATE — requires Piranav review before promotion to parent AIOS
**Candidate title:** Live SEO Fix Tracker — Historical Baseline + Current Shopify Values
**Source:** HETH-R1 (Hetheesha Requirement 1, ledsone.fr)
**Date raised:** 2026-07-20
**Last updated:** 2026-07-21

---

## Problem Solved

Track which SEO fields (meta title, meta description, alt text, FAQ schema) were missing on a specific baseline date and whether they have since been fixed — without requiring database write access. Fix dates are stored per-browser in localStorage; fix status is always accurate from live Shopify.

## Evidence

- `evidence/hetheesa/req1/HETH-R1-evidence-2026-07-20.md` — initial live API implementation
- `evidence/hetheesa/req1/HETH-R1-evidence-2026-07-21.md` — expanded capabilities (2026-07-21)

## Reuse Reason

Pattern is store-agnostic. Any Shopify store with a read-only PostgreSQL DB can adopt this approach:
1. Take a snapshot baseline of missing SEO fields
2. Fetch current live values from Shopify Admin GraphQL at each dashboard load
3. Compare to detect: Fixed (was missing, now present), Pending (still missing), New Issues (was OK, now missing)
4. Also include live top-N handles not in the snapshot to catch products that entered ranking after baseline
5. Store first-detection fix date in browser localStorage
6. Provide selectable before/after GSC + sales comparison per URL via parameterized DB endpoint

Revenue ranking can be swapped for any ordering metric available in the DB.

## KPI Proxies (updated 2026-07-21)

- Percentage of current top-50 products represented in the tracker
- Fixed-field rate (currently 60.66% as of 2026-07-21 snapshot — point-in-time only)
- Number of newly regressed fields detected (New Issues count)
- Number of tracker/API discrepancies found during validation (0 on 2026-07-21)

## Owner / Reviewer

Piranav

## Duplicate Risk

LOW — no existing capability file in this repository covers this pattern.

## Recommended Action

Piranav to review and promote to parent AIOS documentation if this pattern is validated across 2 or more stores (e.g. ledsone.fr + ledsone.co.uk or another store using the same DB structure).

Do not promote based on a single store implementation alone.

## Existing Match

No existing parent AIOS capability covers baseline-vs-live SEO regression tracking with three-state classification (Fixed / Pending / New Issue). This remains a CANDIDATE.

## Duplicate-Risk Result

LOW — single capability file covers this pattern. No parallel candidate exists.
