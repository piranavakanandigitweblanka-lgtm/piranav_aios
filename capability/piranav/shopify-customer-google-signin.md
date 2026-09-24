# Capability — Shopify Customer Google Sign-In

**Created:** 2026-09-24
**First implemented for:** Homingmbh.de (Homin GmbH)
**Status:** CONFIRMED — Live in production

---

## What This Capability Is

Configuring Google Sign-In for Shopify Customer Accounts using Google Cloud OAuth 2.0. Customers can sign in to a Shopify storefront using their Google account.

---

## Prerequisites

- Shopify store with Customer Accounts enabled
- Google account (for Google Cloud Console access)
- Access to Shopify Admin → Customers → Customer Accounts → Sign in with Google

---

## Setup Steps

### 1. Google Cloud — Create Project
- Go to Google Cloud Console
- Create a new project (e.g. "Homin GmbH - Google Login")
- Note the Project ID

### 2. Google Auth Platform — Configure
- Navigate to APIs & Services → OAuth consent screen (or Google Auth Platform)
- Set User Type: **External**
- Fill in App Name, Support Email, Developer Contact
- Add authorized domain: `myshopify.com`

### 3. Branding
- Upload logo if required
- Set App Homepage URL (store URL)

### 4. Audience
- User Type: External
- Add test users if testing before production

### 5. OAuth Web Application Client
- Navigate to APIs & Services → Credentials → Create Credentials → OAuth Client ID
- Application type: **Web application**
- Add JavaScript Origins:
  - `https://shopify.com`
  - `https://[store-handle].account.myshopify.com`
- Add Redirect URIs:
  - `https://shopify.com/authentication/[store-id]/social/google/callback`
  - `https://[store-handle].account.myshopify.com/authentication/social/google/callback`
- Add Revoke/Deauthorize URIs as required by Shopify
- Download the client secret JSON — store in `private/secrets/google-oauth/` (Git-ignored)

### 6. Google OAuth — Publish to Production
- Return to Google Auth Platform → Audience
- Click "Publish App" → confirm In production
- This enables all Google accounts (not just test users)

### 7. Shopify — Configure Google Sign-In
- Shopify Admin → Customers → Customer Accounts → Sign in with Google
- Enter Client ID from the downloaded JSON
- Enter Client Secret (never store this in documentation)
- Save

### 8. Shopify — Activate
- Toggle Google Sign-In: **ON**
- Save settings

### 9. Storefront Validation
- Open the store's customer login URL
- Confirm "Sign in with Google" / "Weiter mit Google" button is visible
- Perform a controlled test login
- Record evidence

---

## Security Requirements

- Client Secret must NEVER appear in documentation, evidence, closure, or handover files
- Credential JSON must be stored at `private/secrets/google-oauth/` (Git-ignored path)
- Trainees must access credentials through an approved secure process — not via documentation
- `.gitignore` must include `private/secrets/` before the credential file is placed

---

## Reuse Notes

This capability can be applied to any Shopify store requiring Google Sign-In:
1. Create a new Google Cloud Project per client
2. Configure Google Auth Platform per client
3. Create a new OAuth Web Application client per store
4. Use the correct Shopify store-specific redirect URIs
5. Store credentials securely per client in `private/secrets/google-oauth/[client-name]/`

---

## Implementations

| Date | Client | Store | Status |
|---|---|---|---|
| 2026-09-24 | Homin GmbH | homingmbh.de | LIVE — In production |
