# Prompt: Ads Product Scope — System + Page Design
## Category: sajeepan / dm-dashboard-admin
## Registered: 2026-09-25
## Status: ACTIVE

---

## Purpose

Design the Ads Product Scope admin page for the DM Dashboard. This prompt produces a technically accurate design document grounded in the actual repository structure. It is used after Phases 1–4A have completed the data investigation and confirmed all business rules.

This prompt produces a DESIGN ONLY document. No code is written, no routes created, no components built.

---

## When to Use

Use this prompt when:
- Data investigation phases (product ID discovery, match verification, business rule evidence) are complete
- Business rules for sale/non-sale, stock classification, and group definitions are confirmed
- You need to design the frontend page + backend endpoint before beginning Level 5 implementation

---

## Prompt

```
You are designing the Ads Product Scope admin page for the DM Dashboard.
The codebase is React 19 + Vite (frontend), Python 3.13 + FastAPI (backend), psycopg3.
The project is at: dm-dashboard/

DESIGN ONLY — do not create files, modify routes, write components, or implement SQL.
Return a 16+ section design document covering the items below.

CONFIRMED DATA (from investigation phases — do not re-investigate):
- Total Sajeepan Ads products (30d): 2,126
- Product ID formats: shopify_GB_* (1,422) + numeric bare variant ID (703) + other (1)
- Product ID normalization: use Jefri pattern (split_part last segment for shopify_ prefix, else use directly)
- Non-sale total: 719 (compare_price IS NULL OR = 0)
- Group A: 693 (non-sale + active + in-stock including 165 NULL-qty with merchant IN_STOCK)
- Group B: 25 (non-sale + active + OOS)
- SALE_SIGNAL_CONFLICT: 4 (compare_price=0 but merchant sale_price>0)
- Sajeepan campaign IDs: [21069663519, 23110323532, 23516313256, 23590572906, 22079334413, 21242723265, 24092456136]
- Tables: google_ads.product_performance, google_ads.campaigns, listings.shopify_listings (item_id, site), google_ads.merchant_products (product_id, availability, sale_price)
- Auth: verify_admin_token() in auth.py — admin/dev roles only
- Business DB pool max: 4 — do not raise
- No new DB tables needed

BUSINESS RULES (confirmed, non-negotiable):
- NON-SALE: compare_price IS NULL OR compare_price = 0
- ON-SALE: compare_price > 0
- IN-STOCK: merchant IN_STOCK (primary) OR qty > 0 (fallback)
- OOS: merchant OUT_OF_STOCK (primary) OR qty=0/NULL (fallback when no merchant record)
- NULL-qty + merchant IN_STOCK = IN_STOCK (165 products confirmed)

EXISTING PATTERNS TO FOLLOW:
- Backend file pattern: admin_dm_campaign.py (ScheduledSnapshot, get_business_conn, APIRouter with prefix)
- Frontend file pattern: DmCampaign.jsx (jreq-* CSS classes, useMemo filter, client-side CSV export)
- Nav registration: ADMIN_ITEMS array in AdminLayout.jsx
- Router registration: main.py include_router + startup snapshot call

DESIGN DOCUMENT MUST COVER:
1. Purpose and scope
2. Product ID normalization (Jefri pattern with SQL)
3. Data sources and table schemas
4. Backend endpoint design (prefix, auth, query params, response shape)
5. Core SQL query design (CTE with Jefri normalization + group CASE)
6. Background snapshot decision and registration
7. Frontend component layout and state
8. CSV export design
9. Group classification logic with counts
10. Auth model
11. Snapshot vs live query decision
12. Error handling (backend 503 + frontend jreq-error/loading/empty)
13. Multi-staff extension path (Jefri/Thasitha/Thivajini/Sonya in future phases)
14. Constraints and non-goals
15. Open decisions requiring Piranav/GPT confirmation
16. File change summary (new files + existing files to modify in Level 5)

Output format: Markdown document with section headers. Save to docs/dm-dashboard/.
```

---

## Technical Constraints

| Constraint | Value |
|---|---|
| Business DB pool | max 4 — NEVER raise |
| DB access | READ-ONLY Business DB |
| Auth | verify_admin_token() only |
| No new tables | Use existing tables only |
| No implementation | Design document only |

---

## Related Evidence

- `evidence/sajeepan/sajeepan-nonsale-phase3-704-investigation-2026-09-25.md` — product ID formats, counts
- `evidence/sajeepan/sajeepan-nonsale-level4a-business-rule-evidence-2026-09-25.md` — confirmed business rules
- `docs/dm-dashboard/ads-product-scope-level4c-design-2026-09-25.md` — design output
