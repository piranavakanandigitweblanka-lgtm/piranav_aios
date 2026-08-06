# Item 3: Enhanced Conversions for Leads
**Accounts:** All 3 — LEDSone UK, ledsone.de, LEDSone FR
**GA4 Property IDs:** UK = 408110563 · FR = 479617728 · DE = Kuberan to confirm in GA4 Admin
**Deadline:** Before Friday 25 July 2026
**Requested by:** Wen (Google Account Team)

---

## Ownership
| Account | Owner |
|---------|-------|
| LEDSone UK (ledsone.co.uk) — GA4: 408110563 | **Piranav** |
| LEDSone FR — GA4: 479617728 | **Piranav** |
| ledsone.de — GA4: confirm property ID | **Kuberan** |

---

## What This Does
Tracks contact form / quote request submissions and sends hashed customer data (email, phone) 
to Google Ads — so lead conversions are measured even when cookies are blocked. Different 
from Item 1 (which tracks purchases). This tracks lead forms.

---

## PART A — Create a Conversion Action in Google Ads
*(Google Ads Admin access needed)*

**Step 1.** Go to ads.google.com → select the **LEDSone UK** account

**Step 2.** Click the **Goals icon** (flag) → **Conversions** → **Summary**

**Step 3.** Click **+ New conversion action**

**Step 4.** Select **Import** as the conversion type

**Step 5.** Select **"Track conversions from clicks"** as the source

**Step 6.** Name the conversion action clearly, e.g. `EC Leads - Contact Form - LEDSone UK`

**Step 7.** In the settings → **uncheck "Include in Conversions"** for now
> Google recommends leaving this off for the first 3 weeks to collect data before optimising campaigns

**Step 8.** Save the conversion action

**Step 9.** Accept the **Customer Data Terms** popup that appears after saving — this is required before ECL will work

**Step 10.** Repeat Steps 1–9 for **ledsone.de** and **LEDSone FR** accounts

---

## PART B — Set Up the Tag in Google Tag Manager
*(GTM access needed — developer or marketing tech)*

### B1. Add a Conversion Linker Tag (if not already present)

**Step 1.** Go to tagmanager.google.com → open the **LEDSone UK container**

**Step 2.** Click **Tags** → **New**

**Step 3.** Click Tag Configuration → search for **Conversion Linker** → select it

**Step 4.** Click **Triggering** → select **All Pages**

**Step 5.** Name it: `Conversion Linker` → **Save**

---

### B2. Create a User-Provided Data Variable

**Step 1.** Click **Variables** → **New** (under User-Defined Variables)

**Step 2.** Name it: `UPD - Lead Form Data`

**Step 3.** Click variable type → search **"User-Provided Data"** → select it

**Step 4.** Select **Manual configuration**

**Step 5.** For **Email** → map to the GTM variable that captures the form email field
- If LEDSone uses a contact form, this is typically a DOM element variable pointing to the email input field
- Example variable name: `{{DOM - Contact Form Email}}`

**Step 6.** For **Phone** → map to phone field variable if collected on the form

**Step 7.** Click **Save**

---

### B3. Create the Google Ads User Data Event Tag

**Step 1.** Click **Tags** → **New**

**Step 2.** Click Tag Configuration → search **"Google Ads User Data Event"** → select it

**Step 3.** Enter the **Conversion ID** from the Google Ads conversion action you created in Part A
(Find it in Google Ads → Goals → Conversions → click the conversion action → Tag setup)

**Step 4.** In **User-provided Data** → select the variable `UPD - Lead Form Data`

**Step 5.** Click **Triggering** → select or create a **Form Submission** trigger:
- Trigger type: **Form Submission**
- Fire on: **All Forms** (or specify the contact form page URL if needed)

**Step 6.** Name the tag: `Google Ads ECL - Contact Form - LEDSone UK`

**Step 7.** Click **Save**

---

### B4. Publish the Container

**Step 1.** Click **Submit** (top right)

**Step 2.** Version name: `Enhanced Conversions for Leads - LEDSone UK`

**Step 3.** Click **Publish**

**Step 4.** Repeat Parts B1–B4 for the **ledsone.de** and **LEDSone FR** GTM containers

---

## PART C — Verify the Setup

**Step 1.** In GTM → click **Preview** → go to the contact form on ledsone.co.uk

**Step 2.** Fill in and submit a test form

**Step 3.** In GTM Preview → confirm the tag **"Google Ads User Data Event - Succeeded"** appears in the Tags Fired list

**Step 4.** In Google Ads → Goals → Conversions → Summary → **Diagnostics tab**
- Filter to **Import** to see ECL-specific status
- Look for status: **Excellent** (green)
- If it shows **Needs Attention** → follow the action column guidance

---

## PART D — Turn On "Include in Conversions" After 3 Weeks

**Do NOT do this immediately.** Wait 2–3 weeks after setup, then:

**Step 1.** Google Ads → Goals → Conversions → click the ECL conversion action

**Step 2.** Edit settings → tick **"Include in Conversions"**

**Step 3.** Save — campaigns will now optimise toward lead conversions

---

## Data Hashing Rules (Important)
Google automatically hashes the data via GTM — you do not need to hash manually when using GTM.
If you ever manually upload lead data, follow these rules before hashing:
- Lowercase all email addresses
- Remove spaces before/after emails
- Format phone numbers to E164 standard (e.g. +447700900000)
- Remove periods before domain in gmail.com addresses

---

## Common Errors

| Error message | Fix |
|--------------|-----|
| "In column 'Email', the value is not hashed" | Data was uploaded unhashed — ensure GTM is doing the hashing or lowercase emails before upload |
| Tag not firing after form submission | Check GTM trigger — confirm Form Submission trigger is set to All Forms and the tag is published |
| ECL Diagnostics shows "No attempted imports" | GTM tag is set up correctly but no leads have come through yet — wait for a real or test submission |

---

*Prepared by AIOS · 2026-07-22 · Source: Enhanced Conversions for Leads Implementation Handbook (PDF from Wen)*
