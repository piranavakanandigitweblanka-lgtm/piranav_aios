# Homingmbh.de — Shopify Customer Google Sign-In

**Project:** Homingmbh.de
**Business:** Homin GmbH
**Integration:** Shopify Customer Accounts — Google Sign-In
**Status:** LIVE — In Production
**Date completed:** 2026-09-24

---

## Overview

Shopify Customer Accounts for Homingmbh.de has been configured with Google Sign-In ("Weiter mit Google") using Google Cloud OAuth 2.0.

Customers can sign in to homingmbh.de using their Google account. The sign-in button is visible on the customer login interface.

---

## What Was Set Up

| Component | Detail |
|---|---|
| Google Cloud Project | Homin GmbH - Google Login |
| Google Cloud Project ID | thermal-origin-509611-e6 |
| Google OAuth Application Type | Web application |
| Google User Type | External |
| Google Publishing Status | In production |
| Shopify Store | homingmbh.myshopify.com |
| Shopify Customer Accounts | Enabled |
| Shopify Google Sign-In | Enabled |
| Storefront result | "Weiter mit Google" visible on customer login |

---

## OAuth Configuration (Non-Sensitive)

The following URIs were configured in the Google OAuth Web Application client.

**JavaScript Origins:**
- `https://shopify.com`
- `https://homingmbh.account.myshopify.com`

**Redirect URIs:**
- `https://shopify.com/authentication/108408963409/social/google/callback`
- `https://homingmbh.account.myshopify.com/authentication/social/google/callback`

---

## Credential Security

Google OAuth credentials (Client ID / Client Secret) are stored at:

```
private/secrets/google-oauth/
```

This path is excluded from Git via `.gitignore`.

**The Client Secret is never stored in AIOS documentation.**

---

## Trainee Guide

Full step-by-step setup guide for trainees:

```
docs/homingmbh/shopify-google-sign-in/Homingmbh_Shopify_Google_SignIn_Trainee_Guide.docx
```

---

## Related AIOS Files

| Type | Path |
|---|---|
| Evidence | `evidence/piranav/homingmbh-shopify-google-signin-2026-09-24.md` |
| Validation | `validation/piranav/homingmbh-shopify-google-signin-2026-09-24.md` |
| Capability | `capability/piranav/shopify-customer-google-signin.md` |
| Handover | `handover/piranav/homingmbh-shopify-google-signin-2026-09-24.md` |
| Closure | `closure/README.md` — row HOMINGMBH-GOOGLE-SIGNIN-2026-09-24 |
| Prompt | `prompts/implementation/shopify-customer-google-signin.md` |
