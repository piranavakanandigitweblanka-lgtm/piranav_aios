# Prompt — Shopify Customer Google Sign-In Setup

**Category:** implementation
**Pattern Name:** shopify-customer-google-signin
**Created:** 2026-09-24
**First used for:** Homingmbh.de (Homin GmbH)
**Status:** ACTIVE

---

## Prompt

You are configuring Google Sign-In for a Shopify store's Customer Accounts using Google Cloud OAuth 2.0.

**Scope:**
Set up the complete Google Sign-In integration for Shopify Customer Accounts including Google Cloud project creation, Google Auth Platform configuration, OAuth Web Application client setup, Shopify configuration, and storefront validation.

**Inputs required:**
- Shopify store handle (e.g. `homingmbh`)
- Shopify store ID (numeric, found in Shopify Admin URL or Partner Dashboard)
- Google Cloud project name to create
- Business/client name

**Steps to execute:**

1. Create Google Cloud project for the client
2. Enable Google Auth Platform / OAuth consent screen
   - User Type: External
   - Fill required branding fields
   - Add authorized domain: `myshopify.com`
3. Create OAuth Web Application client with:
   - JavaScript Origins: `https://shopify.com` and `https://[store-handle].account.myshopify.com`
   - Redirect URIs: `https://shopify.com/authentication/[store-id]/social/google/callback` and `https://[store-handle].account.myshopify.com/authentication/social/google/callback`
   - Revoke/deauthorize URIs as specified by Shopify documentation
4. Download OAuth credentials JSON — store securely in `private/secrets/google-oauth/` (Git-ignored)
5. Publish Google OAuth app to production (Audience → Publish App)
6. In Shopify Admin: Customers → Customer Accounts → Sign in with Google
   - Enter Client ID
   - Enter Client Secret (from secure storage only — never document it)
   - Enable Google Sign-In
7. Validate on storefront: confirm "Sign in with Google" / "Weiter mit Google" appears

**Security constraints:**
- Client Secret must NEVER be stored in documentation, evidence, closure, handover, or chat
- OAuth credential JSON must be placed at `private/secrets/google-oauth/` with Git exclusion verified before file is placed
- Trainees must access credentials via approved secure process only

**Expected output:**
- Google Sign-In button visible on storefront customer login
- Google OAuth status: In production
- Shopify Google Sign-In status: ON
- AIOS documentation updated (evidence, validation, capability, handover, closure)
- Credential secured and Git-ignored

---

## Key Technical Notes

- Shopify Store ID is the numeric ID in the store URL (not the handle)
- Redirect URI format: `https://shopify.com/authentication/[NUMERIC-STORE-ID]/social/google/callback`
- Both shopify.com and the myshopify.com subdomain must be in JavaScript Origins
- Publishing to production removes the 100 test user limit
- For German storefronts the button label will display as "Weiter mit Google"
