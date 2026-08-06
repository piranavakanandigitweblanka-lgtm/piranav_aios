# Item 2: Import Google Analytics Campaign Data
**Accounts:** LEDSone UK (GA4: 408110563) + LEDSone FR (GA4: 479617728)
**Deadline:** Before Friday 25 July 2026
**Requested by:** Wen (Google Account Team)

---

## Ownership
| Account | Owner |
|---------|-------|
| LEDSone UK (408110563) | **Piranav** |
| LEDSone FR (479617728) | **Piranav** |

> ledsone.de is NOT in scope for Item 2 — only UK and FR per Wen's email.

---

## What This Does
Pulls non-Google ad spend (clicks, cost, impressions) from platforms like Meta, TikTok etc. 
into GA4 so you can compare all channels side-by-side — CPA, ROAS, budget performance 
in one place.

**Prerequisite:** Editor+ access in the GA4 property. UTM parameters must be set on all 
non-Google ad campaigns.

---

## Recommended Method: Automated Process
*(Easiest — direct integration inside GA4. Best for first-time setup. Pulls up to 24 months of history automatically.)*

**Step 1.** Go to analytics.google.com → make sure you are in **LEDSone UK property (408110563)**

**Step 2.** Click **Admin** (bottom left gear icon)

**Step 3.** In the Property column → click **Data Import**

**Step 4.** Click **Create data source** (top right button)

**Step 5.** Under **Data type** → select **Campaign data**

**Step 6.** In the **Import source** dropdown → select the platform you run ads on:
- **Meta** (Facebook/Instagram)
- **TikTok**
- **Snap**
- **Pinterest**
- **Reddit**

**Step 7.** Name the data source clearly, e.g. `Meta Campaign Data - LEDSone UK`

**Step 8.** Click **Connect** → you will be asked to log in to that platform (e.g. Meta Ads Manager)
- For Meta you need **"View Performance"** access to the Meta Ad Account
- For TikTok/Snap/Reddit you need **Analyst** access to Ads

**Step 9.** Map UTM parameters — set the source and medium to **exactly match** what is in your ad campaign URLs:

| Field | Example value |
|-------|---------------|
| Source (utm_source) | `facebook` |
| Medium (utm_medium) | `cpc` or `paidsocial` |

> **Important:** UTMs are case-sensitive. If your ads use `facebook` use `facebook` — not `Facebook`.

**Step 10.** Click **Next** → Review the connection details → click **Save**

**Step 11.** Data can take up to **30 minutes to import** and up to **24 hours** to appear in reports

---

## After Setup — Verify It's Working

**Step 1.** In GA4 → Admin → Data Import → open **Data Import Configs**

Check these 3 health metrics:

| Metric | What it means | Target |
|--------|--------------|--------|
| % imported | Rows successfully imported | 100% |
| Match rate | Rows joined with GA4 session data | Should be high — if low, UTMs don't match |
| Rows with errors | Failed rows | Should be 0 |

**Step 2.** In GA4 reports → go to **Lifecycle → Acquisition → Non-Google campaign**

You should see your Meta/TikTok/etc. data here alongside Google Ads.

> If you see cost/impressions but **zero sessions** — your UTMs don't match. Fix by deleting the connection and recreating with correct UTM values.

---

## Repeat for LEDSone FR

Repeat all steps above but switch to **LEDSone FR property (479617728)** in GA4 Admin.

Note: If Meta campaign currency is EUR and GA4 property is in a different currency — they must match. Either change the 3P account currency or use the Google Sheets add-on to convert manually before importing.

---

## Common Issues

| Problem | Fix |
|---------|-----|
| UTMs not matching | Delete connection → recreate with exact lowercase utm_source / utm_medium values from your ad URLs |
| 3P re-authorisation error | GA4 Admin → Data Import → select connector → Details → Re-authenticate (needed every ~60 days) |
| Configurations not editable | Delete and recreate — settings cannot be edited after saving |

---

*Prepared by AIOS · 2026-07-22 · Source: Campaign Data Import Implementation Guide (PDF from Wen)*
