---
name: sales2026-uk-admin-discovery
description: Investigate the Sales 2026 — UK (Live) section in the DM Dashboard admin role. Identify frontend components, backend endpoints, attribution logic, and staff tab structure for ledsone.co.uk.
metadata:
  type: investigation
  date: 2026-09-17
---

## Prompt

Investigate the DM Dashboard codebase to fully understand the "Sales 2026 — UK (Live)" section visible to Muguntha (admin role). Specifically:

1. Which frontend file renders this section?
2. Which staff tabs exist under UK and what does each one show?
3. What backend endpoints does each tab call?
4. How does the order attribution / bucketing logic work per tab (i.e. what determines which orders belong to which person)?
5. What is the data source (Shopify GraphQL, DB, etc.) and caching behaviour?
6. How is access controlled — what role sees this section?

Files involved:
- `dm-dashboard/frontend/src/admin/pages/Sales2026.jsx` — all UK tab components
- `dm-dashboard/frontend/src/admin/AdminLayout.jsx` — nav item registration
- `dm-dashboard/backend/app/sales.py` — backend endpoint logic (to be confirmed)

Expected output: A plain-English explanation of the entire Sales 2026 — UK (Live) section, suitable for onboarding or handover.
