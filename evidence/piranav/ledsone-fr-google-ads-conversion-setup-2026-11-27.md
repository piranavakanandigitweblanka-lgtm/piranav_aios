# Evidence: LEDSone FR — Google Ads Conversion Tracking Setup

**Date:** 2026-11-27
**Session:** LEDSONE-FR-2026-11-27-001
**Owner:** Piranav
**Store:** ledsone.fr
**Status:** OPEN — provisional progress, monitoring required

---

## Objective

Configure and investigate Google Ads purchase conversion tracking for ledsone.fr to ensure purchase conversions are correctly firing and attributed.

---

## Work Performed (Chronological)

### 1. Google Ads Conversion Action Review

- Reviewed all existing conversion actions in the Google Ads account
- Identified `GA4 page_view` and `GA4 view_item` as active **secondary** conversion actions
- Reviewed existing Google Shopping App conversion actions, including removed actions
- Inspected `GA4 first_visit` conversion action — reviewed primary/secondary settings
- Reviewed Purchase conversion actions and account-default Purchase goal configuration
- Investigated `Purchase(infinitePixel)29183` conversion action:
  - Initial status: **Removed**
  - Action taken: **Re-enabled**
  - Status after re-enabling: **Awaiting conversions**
- **Outstanding issue:** Account displayed a **"Needs attention"** warning about misconfigured primary conversion actions — this is NOT resolved

### 2. Tag Assistant Investigation

Connected Tag Assistant to ledsone.fr and tested the purchase event on the Shopify thank-you page.

**Tags identified on site:**
- `GT-NCTTCV3C`
- `G-G9NQ5L3Q6V`

**Hits observed on purchase event test:**

| Hit Type | Destination |
|---|---|
| Purchase | `G-G9NQ5L3Q6V` |
| Purchase | `G-80RQ0ZPTH5` |
| Purchase(infinitePixel)29183 | `AW-16922105395` |
| Conversion | `G-G9NQ5L3Q6V` |

**Conversion parameters inspected:**
- `value`
- `currency`
- `transaction_id`
- `page_location`
- `transaction_type`

**Observed InfinitePixel conversion value:** €56.79

**Important note:** Multiple hit cards appeared in Tag Assistant. Duplicate counting is **NOT confirmed** — multiple hit cards do not prove duplicate counting. Further parameter analysis required.

### 3. Shopify Order Verification

Reviewed actual sample Shopify order and thank-you page used during Tag Assistant test:

| Field | Value |
|---|---|
| Product subtotal | €56.79 |
| Shipping | €8.99 |
| Tax (included) | €10.97 |
| Order total | €65.78 |
| Payment method | Bank Deposit |
| Payment status | Payment pending |
| Paid | €0.00 |
| Outstanding balance | €65.78 |

**Key observation:** The InfinitePixel fired value (€56.79) matches the **product subtotal**, not the order total (€65.78).

**Outstanding question:** This order was unpaid at time of test. Business confirmation required: should unpaid / Bank Deposit / payment-pending orders trigger purchase conversion events?

### 4. Final Observed State

- Google Ads conversion summary was displaying conversion activity
- `Purchase(infinitePixel)29183` showing **Awaiting conversions** after re-enabling — normal expected status, not an error
- This is **provisional progress only** — NOT proof of a fresh post-change attributed conversion
- "Purchase goal — Needs attention" warning still active in account
- Google Ads displayed a **payment-method-required banner** — separate account billing issue (unrelated to tracking)

---

## Technical Findings Summary

| Finding | Status |
|---|---|
| `Purchase(infinitePixel)29183` re-enabled | Done |
| Tag firing on thank-you page confirmed via Tag Assistant | Confirmed |
| InfinitePixel value = product subtotal (€56.79), not order total (€65.78) | Observed |
| Fresh post-change attributed conversion confirmed | NOT proven — monitor 24–48h |
| Duplicate hit investigation completed | Pending |
| Purchase goal "Needs attention" warning resolved | Outstanding |
| Unpaid order conversion policy confirmed | Requires business confirmation |
| Google Ads payment method banner resolved | Separate billing issue |

---

## Evidence Files

| File | Path |
|---|---|
| Trainee Word report (screenshots + findings) | `reports/ledsone-fr/LEDSone_FR_Google_Ads_Conversion_Setup_Trainee_Report_27Nov2026.docx` |
| Original download location (preserve) | `C:\Users\PC\Downloads\LEDSone_FR_Google_Ads_Conversion_Setup_Trainee_Report_27Nov2026.docx` |

---

## Outstanding Issues

1. **Purchase goal "Needs attention" warning** — primary conversion action misconfiguration — investigate before next campaign launch
2. **Duplicate hits** — multiple Tag Assistant hit cards require parameter analysis to confirm or rule out double-counting
3. **Unpaid order policy** — confirm whether Bank Deposit / payment pending orders should trigger purchase conversion events
4. **Fresh attribution** — no confirmed post-re-enable attributed conversion yet; monitor 24–48h

---

## Next Actions

1. Wait 24–48h and check Google Ads conversion column for attributed conversions from ledsone.fr
2. Investigate "Purchase goal — Needs attention" warning in Google Ads › Goals › Conversions
3. Confirm with Piranav/business owner: unpaid order conversion policy for Bank Deposit payment method
4. Analyse duplicate hit cards in Tag Assistant — compare parameters to rule out double-counting
5. Resolve Google Ads payment method billing warning (separate from tracking setup)

---

## Queryability

YES — all findings documented here and in Word report at `reports/ledsone-fr/`.
