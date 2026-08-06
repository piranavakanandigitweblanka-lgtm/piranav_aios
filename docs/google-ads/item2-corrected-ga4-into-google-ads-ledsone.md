# Item 2 (Corrected): Import Google Analytics Data into Google Ads
**Accounts:** LEDSone UK + LEDSone FR
**Deadline:** Before Friday 25 July 2026
**Requested by:** Wen (Google Account Team)
**Owner:** Piranav (both accounts)

---

## What This Actually Does
Links GA4 session and conversion data INTO Google Ads so that:
- Google Ads can see GA4 goals/conversions as conversion actions
- Campaign reporting shows full funnel data (sessions, bounce rate, pages/session)
- Smart bidding (tCPA, tROAS) can use GA4 signals to optimise

---

## Prerequisites
- Editor+ access in GA4 property
- Admin access in Google Ads account
- GA4 property must already be set up on the website (it is — Property 408110563 for UK, 479617728 for FR)

---

## PART A — Link GA4 to Google Ads (do this in GA4)

**Step 1.** Go to analytics.google.com → confirm you are in **LEDSone UK property (408110563)**

**Step 2.** Click **Admin** (bottom left gear icon)

**Step 3.** In the Property column → click **Google Ads Links**

**Step 4.** Click **Link** (top right blue button)

**Step 5.** Click **Choose Google Ads accounts** → select the **LEDSone UK Google Ads account** → click **Confirm**

**Step 6.** Enable **Personalised advertising** toggle → ON

**Step 7.** Enable **Auto-tagging** toggle → ON
> Auto-tagging adds a GCLID parameter to your ad URLs so GA4 can match sessions to ad clicks

**Step 8.** Click **Next** → Review → click **Submit**

**Step 9.** Repeat Steps 1–8 for **LEDSone FR property (479617728)** linked to the **LEDSone FR Google Ads account**

---

## PART B — Import GA4 Conversions into Google Ads

Once linked, you can import GA4 conversion events directly into Google Ads as conversion actions.

**Step 1.** Go to ads.google.com → select the **LEDSone UK** account

**Step 2.** Click the **Goals icon** (flag) → **Conversions** → **Summary**

**Step 3.** Click **+ New conversion action**

**Step 4.** Select **Import**

**Step 5.** Select **Google Analytics 4 properties** → click **Continue**

**Step 6.** You will see a list of GA4 conversion events from property 408110563 — select the ones you want to import:
- `purchase` — most important
- Any other goals set up in GA4 (add to cart, begin checkout etc.)

**Step 7.** Click **Import and continue** → click **Done**

**Step 8.** Repeat Steps 1–7 for the **LEDSone FR** Google Ads account using property 479617728

---

## PART C — Verify the Link is Working

**Step 1.** In GA4 → Admin → Google Ads Links → confirm status shows **Active**

**Step 2.** In Google Ads → Goals → Conversions → the imported GA4 conversions should appear with source listed as **Google Analytics**

**Step 3.** Wait 24–48 hours — Google Ads campaign reports will then show GA4 session metrics (Sessions, Bounce Rate, Pages/Session) as additional columns in campaign reporting

---

## What to Check if It's Not Working

| Problem | Fix |
|---------|-----|
| Google Ads account not appearing in Step 5 | Make sure you are logged into the same Google account that has access to both GA4 and Google Ads |
| GA4 conversions not showing in import list | GA4 events must be marked as conversions in GA4 first — GA4 Admin → Events → toggle the event as a conversion |
| Link shows Active but no data in Google Ads | Auto-tagging may be off — Google Ads → Admin → Account settings → confirm Auto-tagging is ON |

---

*Prepared by AIOS · 2026-07-22 · Corrected from Campaign Data Import PDF (Wen) — GA4 → Google Ads direction*
