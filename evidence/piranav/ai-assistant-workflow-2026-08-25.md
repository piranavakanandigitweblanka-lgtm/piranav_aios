# Evidence — AI Assistant System (All Staff)

**Date:** 2026-08-25
**Task:** Build AI assistants for 5 remaining staff + unify all 11 widgets + fix Kamsi

---

## Discovery: Staff Coverage Before This Session

| Staff | Had AI Before? | Notes |
|-------|---------------|-------|
| Kamsi | Yes | Widget broken — click did nothing |
| Sukirtha | Yes | Same silent crash bug as Kamsi |
| Hetheesha | Yes | Working |
| Sonya | Yes | Working |
| Sajeepan | Yes | Working — used as UI reference |
| Dilaksi | Yes | Working |
| Theekshy | No | Built this session |
| Thivajini | No | Built this session |
| Jefri | No | Built this session |
| Thasitha | No | Built this session |
| Mahima | No | Built this session |

---

## Discovery: Kamsi/Sukirtha Root Cause

Both pages had a broken `formatAiText` function. A Python code-generation script wrote `\n\n` as a **literal newline character** inside a JS regex literal:

```
.replace(/\n\n          ← literal newline here
/g,'<br><br>')
```

JavaScript regex literals cannot span multiple lines — this is a `SyntaxError` that kills the entire `<script>` block **silently**. The browser parses no JS at all, so `addEventListener('click', aiToggle)` never runs. Clicking the button does nothing.

Previous fix attempts using Python `re.sub` did not match the pattern correctly due to whitespace differences between the newline and `/g`.

**Confirmed on:**
- `pages/kamsi.html` line 2275–2276
- `pages/sukirtha.html` line 2449–2452

---

## Discovery: Pool Not Defined in requirement.js

Jefri, Thasitha, and Mahima AI handlers were added at module top level in `requirement.js`. The `Pool` variable was only declared inside nested IIFEs further down in the file — not at module scope.

Error: `HTTP 500: {"ok":false,"error":"Pool is not defined"}`

Fix: Changed line 7 of `requirement.js` from:
```js
const { Client } = require('pg');
```
to:
```js
const { Client, Pool } = require('pg');
```

---

## Discovery: Vercel 12-Function Hard Limit

Already at 12 functions on the Hobby plan:
`auth.js, members-api.js, sales.js, salesuk.js, sales25.js, salesde25.js, requirement.js, muguntha.js, assign-order.js, staff-id-performance.js, intel-api.js, generate-staff-attribution.js`

All AI handlers must go inside existing files — never a new `api/*.js` file.

---

## Discovery: Campaign IDs Per Staff

| Staff | Source | IDs |
|-------|--------|-----|
| Theekshy | Hard-coded | `[23714290257, 23684837882]` |
| Thivajini | Hard-coded | `[23103582865, 23533025729, 23405519670]` |
| Jefri | Hard-coded | `['23141810147','23411228109','22539594891','23473840779','23340277562']` |
| Thasitha | Dynamic query | `SELECT campaign_id FROM google_ads.campaigns WHERE group_name = 'Thasi'` |
| Mahima | Hard-coded | `['20763699505','23684789991','23053104908','23431543574','23926509987']` |

---

## Discovery: Thivajini FR Orders Filter

Shopify FR orders use `sub_source = 233` to distinguish from other markets. Confirmed from existing Thivajini handler pattern.

---

## Discovery: Kamsi Extra Body Fields

`kamsi.html` passes two extra fields in every AI fetch request that no other staff page sends:
- `metaSummary: window._kamsiMeta || null` — meta title/desc audit summary
- `prioritySummary: window._kamsiPriority || null` — product priority list

These are populated earlier in the page by the standard Kamsi data load.
