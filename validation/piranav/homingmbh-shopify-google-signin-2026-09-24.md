# Validation — Homingmbh.de Shopify Customer Google Sign-In

**Date:** 2026-09-24
**Project:** Homingmbh.de
**Business:** Homin GmbH
**Task:** Set up Google Sign-In for Shopify Customer Accounts

---

## Validation Checklist

| # | Check | Status |
|---|---|---|
| 1 | Correct Google Cloud project confirmed (Homin GmbH - Google Login / thermal-origin-509611-e6) | PASS |
| 2 | Google Auth Platform configured | PASS |
| 3 | Audience = External | PASS |
| 4 | OAuth application type = Web application | PASS |
| 5 | Required Shopify JavaScript origins configured (shopify.com + homingmbh.account.myshopify.com) | PASS |
| 6 | Required Shopify redirect URIs configured (2 URIs) | PASS |
| 7 | Required revoke/deauthorize URIs configured | PASS |
| 8 | Google OAuth app = In production | PASS |
| 9 | Shopify Google Sign-In credentials configured (Client ID entered) | PASS |
| 10 | Shopify Google Sign-In = ON | PASS |
| 11 | Storefront shows "Weiter mit Google" on customer login page | PASS |
| 12 | Trainee documentation exists | PASS |
| 13 | OAuth credential stored securely at `private/secrets/google-oauth/` | PASS |
| 14 | OAuth credential is excluded from Git (private/secrets/ in .gitignore) | PASS |
| 15 | No Client Secret appears in any AIOS documentation | PASS |

---

## Result

**ALL 15 CHECKS: PASS**

---

## Security Validation

| Security Check | Result |
|---|---|
| Client Secret printed to response | NO |
| Client Secret in Markdown files | NO |
| Client Secret in DOCX documentation | N/A — not modified |
| Client Secret in evidence | NO |
| Client Secret in closure | NO |
| Client Secret in handover | NO |
| Credential JSON in public documentation folder | NO |
| Credential JSON Git-ignored | YES |
| Credential committed to Git | NO |
| Credential uploaded to GitHub | NO |

---

## Validation Result

**PASS** — All configuration validated. Google Sign-In is live on homingmbh.de. Documentation complete. Credentials secured.
