# Item 1: Enhanced Conversions for Web in GA4
**Account:** LEDSone UK (ledsone.co.uk)
**GA4 Property ID:** 408110563
**Deadline:** Before Friday 25 July 2026
**Requested by:** Wen (Google Account Team)

---

## Ownership
| Account | Owner |
|---------|-------|
| LEDSone UK (ledsone.co.uk) | **Piranav** |
| ledsone.de | **Kuberan** — do these steps in the ledsone.de GA4 property and GTM container |

---

## PART A — Enable in GA4 Admin
*(~5 minutes, no developer needed)*

**Step 1.** Go to analytics.google.com → confirm you are in property **LEDSone UK (408110563)**

**Step 2.** Click **Admin** (bottom left gear icon)

**Step 3.** In the Property column → click **Data Settings** → **Data Collection**

**Step 4.** Scroll down to **"User-ID and User-provided data collection"**

**Step 5.** Click **Activate** next to "User-provided data"

**Step 6.** Policy popup appears → read it → click **Activate** to accept

**Step 7.** Next popup "Automatically detect user-provided data" → leave **Email** and **Phone number** ticked → click **Apply**

**Step 8.** Confirm green tick appears: *"User-provided data collection for User-ID policy were accepted"*

---

## PART B — Configure in Google Tag Manager
*(Needs GTM access)*

### B1. Create the User-Provided Data Variable

**Step 1.** Go to tagmanager.google.com → open the **LEDSone UK container**

**Step 2.** Click **Variables** → **New** (under User-Defined Variables)

**Step 3.** Name it: `UPD - User Provided Data`

**Step 4.** Click the variable type → search **"User-Provided Data"** → select it

**Step 5.** Select **Manual configuration**

**Step 6.** For **Email** → set value to the GTM variable holding customer email. On Shopify this is typically the dataLayer variable: `checkout.email`

**Step 7.** For **Phone number** → set to dataLayer variable: `checkout.phone` (if collected at checkout)

**Step 8.** Click **Save**

---

### B2. Update the GA4 Purchase Tag

**Step 1.** Click **Tags** in the left menu

**Step 2.** Find the purchase tag — it will be named something like:
- `GA4 Event - purchase`
- `GA4 - Purchase`
- `GA4 Event Tag - purchase`

**Step 3.** Open it → scroll down to **"Include user-provided data from your website"** → tick the checkbox

**Step 4.** In the dropdown → select `UPD - User Provided Data`

**Step 5.** Click **Save**

---

### B3. Repeat for Checkout Tags (recommended)

Repeat Step B2 for these tags if they exist in the container:

| Tag to find | Event name |
|-------------|------------|
| GA4 Event - begin_checkout | `begin_checkout` |
| GA4 Event - add_payment_info | `add_payment_info` |

---

### B4. Publish the Container

**Step 1.** Click **Submit** (top right blue button)

**Step 2.** Version name: `Enhanced Conversions for Web - LEDSone UK`

**Step 3.** Click **Publish**

---

## PART C — Enable in GA4 Data Stream
*(Back in GA4 Admin)*

**Step 1.** GA4 Admin → **Data Streams** → click the web stream for ledsone.co.uk

**Step 2.** Scroll to **Google tag** section → click **Configure tag settings**

**Step 3.** Click **Allow user-provided data capabilities**

**Step 4.** Toggle **ON** → click **Save**

---

## PART D — Confirm Google Ads Link

**Step 1.** GA4 Admin → **Google Ads Links** (in Property column)

**Step 2.** Confirm the LEDSone Google Ads account is listed and linked

**Step 3.** Enhanced Conversions will automatically apply to all GA4 conversions sent to that linked Ads account — no further action needed here

---

## Verification (24–48 hours after publishing)

1. In GTM → use **Preview mode** → go through a test checkout on ledsone.co.uk → confirm the `purchase` tag fires and the UPD variable shows an email value
2. In GA4 → Admin → Data Settings → Data Collection → confirm the green tick is still active
3. **Notify Wen** once done so she can verify on Google's end before the July 27th call

---

## Next: ledsone.de

Repeat all 4 parts above for the ledsone.de GTM container and GA4 property.
Confirm the ledsone.de GA4 Property ID from GA4 Admin before starting.

---

*Prepared by AIOS · 2026-07-22 · Source: Google EC for Web Playbook (PDF from Wen) + LEDSone GA4 property evidence*
