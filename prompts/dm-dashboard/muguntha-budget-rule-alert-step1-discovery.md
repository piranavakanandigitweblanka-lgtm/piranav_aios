# Prompt: Muguntha Google Ads Budget Rule Alert System — Step 1 Discovery

**Category:** discovery  
**Project:** dm-dashboard  
**Created:** 2026-10-12  
**Status:** ACTIVE  

---

## Prompt

You are a senior full-stack engineer conducting a Step 1 discovery for the Muguntha Google Ads Budget Rule Alert System in the DM Dashboard.

**Project paths:**
- DM Dashboard: `C:\Users\PC\Documents\piranav_aios\dm-dashboard`
- AIOS root: `C:\Users\PC\Documents\piranav_aios`

**Objective:** Discover how the existing dashboard retrieves Google Ads campaign performance, calculates ROAS, handles authentication, stores data, and sends notifications. Muguntha wants her documented budget optimisation rules applied to campaign data, with alerts delivered through the dashboard plus Telegram or email. Every budget change or pause must require Muguntha's approval. No automatic live campaign modifications are permitted.

**Safety rules (non-negotiable):**
1. Preserve the existing React 19 + Vite frontend, React Router, FastAPI/Python backend, and PostgreSQL architecture.
2. Reuse existing API clients, authentication, database utilities, dashboard layouts, and notification integrations.
3. Do not create a separate application or duplicate existing functionality.
4. Do not modify Google Ads budgets, pause campaigns, or send production notifications.
5. Do not expose, print, or copy API keys, OAuth tokens, passwords, or secrets.
6. Do not assume Google Ads API access is operational — verify and report the actual state.
7. Do not change database schemas, install packages, deploy, push Git changes, or modify production configuration.
8. Do not mark any integration as working unless supported by actual evidence.

**Discovery tasks:**
- A: Inspect the repository (frontend entry points, routes, backend entry point, Google Ads pages/services/endpoints/models, PostgreSQL patterns, auth/role mechanisms, notification/alert/background-job implementations, tests).
- B: Trace campaign data (campaign ID, name, customer/account ID, daily budget, cost, conversion value, conversions, dates, ROAS calculation, last 30 days, previous-month ROAS, missing fields, stale data risks).
- C: Document Muguntha's budget optimisation rules as proposed rules (not implemented): ROAS thresholds 400%/350-399%/300-349%/275-299%/200-274%/175-199%/151-174%/<150%, £150 budget cap on increases, campaign creation rules in expert form, flag ambiguous exception about previous-month ROAS <275%.
- D: Recommend smallest safe integration design (rule engine, alert page, persistent history, Telegram/email, scheduled evaluation, dedup, approval workflow).

**Required output:** Discovery report with: (1) architecture and file paths, (2) current Google Ads data flow and ROAS calculation, (3) existing notification and auth capabilities, (4) gaps and blockers, (5) proposed files and DB changes for later, (6) test strategy, (7) decisions required from Muguntha, (8) numbered Step 2 plan.

**AIOS auto-update:** Save all outputs under the appropriate existing AIOS task structure. Do not store secrets or claim implementation is complete.

---

## When to Reuse This Prompt

Use this prompt when starting a new feature discovery for the DM Dashboard that requires understanding the Google Ads data pipeline, ROAS calculations, the alert/notification layer, and the approval workflow pattern.
