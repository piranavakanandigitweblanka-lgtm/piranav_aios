# Handover — Homingmbh.de Shopify Customer Google Sign-In

**Date:** 2026-09-24
**Project:** Homingmbh.de
**Business:** Homin GmbH
**Status:** COMPLETED — Live in production
**Prepared by:** Piranav (via AIOS)

---

## Current State

Google Sign-In for Shopify Customer Accounts is live on homingmbh.de.

- Google OAuth app: **In production**
- Shopify Google Sign-In: **ON**
- Storefront: "Weiter mit Google" visible on customer login page

---

## Trainee Workflow

If a trainee needs to verify, maintain, or reproduce this setup:

1. Open the trainee guide:
   `docs/homingmbh/shopify-google-sign-in/Homingmbh_Shopify_Google_SignIn_Trainee_Guide.docx`

2. Open Shopify Admin for homingmbh.myshopify.com

3. Navigate to: Customers → Customer Accounts → Sign in with Google

4. Verify the Google Sign-In credentials are configured

5. Open Google Cloud Console → Project: Homin GmbH - Google Login (thermal-origin-509611-e6)

6. Navigate to APIs & Services → Google Auth Platform

7. Confirm:
   - Branding is set up
   - Audience = External
   - Publishing status = In production

8. Navigate to APIs & Services → Credentials → OAuth Web Application client

9. Confirm:
   - JavaScript Origins include `shopify.com` and `homingmbh.account.myshopify.com`
   - Redirect URIs include both Shopify callback URIs

10. **To access credentials:** Follow the approved secure credential process.
    Credentials are at: `private/secrets/google-oauth/`
    **Do NOT copy or share the Client Secret through documentation or chat.**

11. Open homingmbh.de customer login

12. Confirm "Weiter mit Google" is visible

13. Perform a controlled login test if required

14. Record validation evidence in `validation/piranav/`

---

## Credential Access

OAuth credentials (Client ID / Client Secret) are stored at:
```
private/secrets/google-oauth/
```

This path is Git-ignored and must not be committed or shared.

**The Client Secret must NEVER be sent via email, chat, documentation, or shared drives.**

---

## Known Configuration Details (Non-Sensitive)

| Item | Value |
|---|---|
| Google Cloud Project | Homin GmbH - Google Login |
| Google Cloud Project ID | thermal-origin-509611-e6 |
| Google OAuth Client ID prefix | 476115395229-... |
| Shopify Store ID | 108408963409 |
| Shopify Store Handle | homingmbh |

---

## Next Steps / Ongoing

- No ongoing maintenance required unless Google OAuth credentials are rotated
- If Shopify store URL changes, redirect URIs must be updated in Google Cloud Console
- If OAuth credentials are rotated, update `private/secrets/google-oauth/` and Shopify Admin

---

## Related AIOS Files

| File | Purpose |
|---|---|
| `docs/homingmbh/shopify-google-sign-in/README.md` | Setup overview |
| `docs/homingmbh/shopify-google-sign-in/Homingmbh_Shopify_Google_SignIn_Trainee_Guide.docx` | Full trainee guide |
| `evidence/piranav/homingmbh-shopify-google-signin-2026-09-24.md` | Implementation evidence |
| `validation/piranav/homingmbh-shopify-google-signin-2026-09-24.md` | Validation checklist |
| `capability/piranav/shopify-customer-google-signin.md` | Reusable capability record |
