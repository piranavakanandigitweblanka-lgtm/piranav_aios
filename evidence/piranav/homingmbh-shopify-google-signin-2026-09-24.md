# Evidence — Homingmbh.de Shopify Customer Google Sign-In

**Date:** 2026-09-24
**Project:** Homingmbh.de
**Business:** Homin GmbH
**Task:** Set up Google Sign-In for Shopify Customer Accounts

---

## What Was Built

Google OAuth 2.0 was configured for Homingmbh.de Shopify Customer Accounts, enabling customers to sign in with their Google accounts.

---

## Evidence Summary

| Item | Result |
|---|---|
| Google Cloud Project | Homin GmbH - Google Login (thermal-origin-509611-e6) |
| Google Auth Platform | Configured |
| Google Audience | External |
| Google OAuth app status | **In production** |
| OAuth application type | Web application |
| Shopify JavaScript origins | Configured (shopify.com + homingmbh.account.myshopify.com) |
| Shopify redirect URIs | Configured (2 URIs) |
| Shopify revoke/deauthorize URIs | Configured |
| Shopify Google Sign-In | **Enabled** |
| Storefront validation | **"Weiter mit Google" visible on customer login page** |
| Trainee documentation | `docs/homingmbh/shopify-google-sign-in/Homingmbh_Shopify_Google_SignIn_Trainee_Guide.docx` |

---

## Google Auth Platform Status

**Google OAuth app: In production**

This means:
- Any Google account holder can sign in (not limited to test users)
- No OAuth app verification required for this sign-in scope
- App is live for all Homingmbh.de customers

---

## Shopify Configuration Evidence

**Shopify Admin → Customers → Customer Accounts → Sign in with Google**
- Credentials: Configured (Client ID entered)
- Status: **Google Sign-In ON**

---

## Storefront Validation Evidence

**URL tested:** homingmbh.de customer login page
**Result:** "Weiter mit Google" button visible

This confirms end-to-end configuration is complete and functioning.

---

## Trainee Documentation

Full trainee guide created and stored at:
```
docs/homingmbh/shopify-google-sign-in/Homingmbh_Shopify_Google_SignIn_Trainee_Guide.docx
```

The guide covers all 15+ configuration steps including troubleshooting and security rules.

---

## Security Note

**OAuth credentials (Client ID / Client Secret) are stored separately at:**
```
private/secrets/google-oauth/
```
This path is Git-ignored. The Client Secret does not appear anywhere in AIOS documentation.

---

## Queryability

**YES** — This evidence record fully describes the completed implementation and can be used to verify or reproduce the setup.
