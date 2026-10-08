# Capability: Clickable AI Task Items + Professional Priority Icons

**ID:** CAP-UI-2026-09-04
**Date:** 2026-09-04
**Status:** IMPLEMENTED — LIVE VALIDATION REQUIRED
**Author:** Claude Code (sinrasu mode)
**Reviewed by:** GPT (requirement defined)

---

## Requirement

1. Exact products/pages become clickable when a verified URL exists in backend data
2. Priority emojis (🔴🟡🟢) replaced with professional SVG icons
3. All existing functionality (task logging, completion, verification, history) preserved
4. Backward compatible — tasks without URL metadata render as plain text
5. Works across all staff where verified URLs exist

---

## Discovery

### URL Sources by Staff

| Staff | URL type | Source | Verified URLs available |
|---|---|---|---|
| Kamsi | GSC page URL + Shopify product URL | `kamsi_ai.py:80,93` | YES — `low_ctr_pages[].url`, `missing_meta_products[].url` |
| Sukirtha | GSC page URL + Shopify product URL | `sukirtha_ai.py:80,96` | YES — same pattern |
| Hetheesha | `product_handle`, `collection_handle` | `hetheesha_ai.py:76,101` | PARTIAL — handle only, not full URL |
| Dilaksi | GA4 `landingPage` path | `dilaksi_ai.py:70` | PATH ONLY — no base domain in data |
| Jefri, Sonya, Thasitha, Theekshy, Mahima, Thivajini, Sajeepan | Product title + spend/ROAS | DB (no URL join) | NO verified URL |

### Icon Library

No external icon library installed. Project uses `package.json` with only `react`, `react-dom`, `vite`. Existing `DailyBriefWidget.jsx` has an inline SVG icon system (`Icon.Chat`, `Icon.Close`, `Icon.Send`, `Icon.Refresh`, `Icon.Spin`). New priority icons follow the same inline SVG pattern — no new dependency introduced.

### brief_data Architecture

`kamsi_ai.py:187–228` — `_build_brief_data()` already exists. Returns structured `{ low_ctr: {...}, missing_meta: {...} }` with `label`, `total`, `columns`, `rows`. The `/brief` endpoint returns this in `brief_data` field. `DailyBriefWidget.jsx:127` already reads `d.brief_data` and stores it in state. `matchTaskDetail()` at line 166 maps task title keywords to the correct data bucket. `MyTaskLog.jsx` — `TaskDetailTable` already renders `brief_data.rows` as a table.

---

## Implementation

### Backend change — `sukirtha_ai.py`

Added `_build_brief_data(data)` function (lines 187–227). Returns `low_ctr` and `missing_meta` buckets with verified GSC + Shopify URLs. Updated `/brief` endpoint to return `brief_data` in response.

URL source: GSC page paths (`_req1_payload`) and Shopify product paths (`_req6_payload_compute`). These are read from the database — never AI-generated.

### Frontend change — `DailyBriefWidget.jsx`

Added to `Icon` object:
- `Icon.PriorityHigh` — red circle with exclamation (SVG)
- `Icon.PriorityMedium` — amber triangle with exclamation (SVG)
- `Icon.PriorityLow` — grey circle with down arrow (SVG)
- `Icon.ExternalLink` — standard external link indicator (SVG)

Added `PRIORITY_ICON_CONFIG` mapping `high|medium|low` → icon + background + colour.

Updated task quick-select buttons: emoji replaced with `<pCfg.Icon s={14} />`. Priority value (`task.priority`) drives the icon — not the AI output.

### Frontend change — `MyTaskLog.jsx`

Added:
- `PriorityIcon` — three inline SVG elements keyed by `high|medium|low`
- `ExternalLinkIcon` — inline SVG for link indicator
- `URL_COLUMNS` — Set of column names treated as URL fields: `URL`, `Page`, `url`, `page`
- `STAFF_URL_BASE` — maps staff name to their verified domain
- `BriefRenderer` — line-by-line renderer for `AiBriefPanel` that replaces emoji lines with `PriorityIcon` + styled text; `→` bullet lines get left-padded; other lines render as-is

Updated:
- `TaskDetailTable` — accepts `urlBase` prop; cells in `URL_COLUMNS` with values starting `/` render as `<a href={urlBase + val} target="_blank" rel="noopener noreferrer">`. All other cells render as plain text.
- `TaskCard` — accepts `urlBase` prop; passes to `TaskDetailTable`; adds priority icon next to priority pill
- `TodayTab` — accepts and passes `urlBase`
- `HistoryTab` — accepts and passes `urlBase`
- `MyTaskLog` — derives `urlBase` from `STAFF_URL_BASE[staffName]`, passes to tabs
- `AiBriefPanel` — replaced raw `<pre>` with `<BriefRenderer text={brief} />`

---

## Files Changed

| File | Change type | Description |
|---|---|---|
| `backend/app/sukirtha_ai.py` | Extended | Added `_build_brief_data()` + `brief_data` in `/brief` response |
| `frontend/src/components/DailyBriefWidget.jsx` | Extended | Priority icons, `PRIORITY_ICON_CONFIG`, icon task buttons |
| `frontend/src/components/MyTaskLog.jsx` | Extended | `BriefRenderer`, `PriorityIcon`, URL column linking, `STAFF_URL_BASE`, `urlBase` threading |

---

## URL Source of Truth

| Staff | URL source | Domain |
|---|---|---|
| Kamsi | GSC API (`kamsi.py`) + Shopify (`_req5_payload_compute`) | `https://www.ledsone.co.uk` |
| Sukirtha | GSC API (`sukirtha.py`) + Shopify (`_req6_payload_compute`) | `https://www.ledsone.de` |

URLs are path strings (e.g. `/products/dc24v-led-driver`). The frontend prepends the domain from `STAFF_URL_BASE`. The AI does not generate URLs. URL validation: only values starting with `/` in known URL columns are made clickable.

---

## Staff Coverage

| Staff | Clickable URLs | Priority Icons | Brief_data |
|---|---|---|---|
| Kamsi | YES (GSC pages + products) | YES | YES (existing) |
| Sukirtha | YES (GSC pages + products) | YES | YES (new) |
| Hetheesha | NO (handle only, no URL) | YES | NO |
| Dilaksi | NO (path exists but no domain mapping confirmed) | YES | NO |
| Jefri | NO | YES | NO |
| Sonya | NO | YES | NO |
| Thasitha | NO | YES | NO |
| Theekshy | NO | YES | NO |
| Mahima | NO | YES | NO |
| Thivajini | NO | YES | NO |
| Sajeepan | NO | YES | NO |

Priority icons apply to ALL staff — they are driven by the existing `priority` value in `staff_task_log`, not by AI output.

---

## Backward Compatibility

- Tasks created before this change have no `task_detail` — `TaskDetailTable` returns `null` for empty/missing detail (line 57 of MyTaskLog). No regression.
- Tasks with `task_detail` that have no URL columns — cells render as plain text. No regression.
- `parseTasks()` in `DailyBriefWidget` unchanged — emoji → priority mapping preserved. Icons use the same `task.priority` value.
- `matchTaskDetail()` unchanged — keyword-based mapping still works.
- All task completion, skip, verification, history flows unchanged.

---

## Validation

### Static checks

| Check | Result |
|---|---|
| `sukirtha_ai.py` Python syntax | PASS |
| `brief_data` returned from `sukirtha /brief` | PASS (grep confirmed) |
| Emoji display removed from task buttons | PASS (grep for `t.emoji` returns empty) |
| `PRIORITY_ICON_CONFIG` present in DailyBriefWidget | PASS |
| `PriorityIcon`, `BriefRenderer`, `STAFF_URL_BASE`, `urlBase` present in MyTaskLog | PASS |
| `URL_COLUMNS` restricts linking to known fields only | PASS |
| Only paths starting `/` become links | PASS (code: `val.startsWith('/')`) |
| `rel="noopener noreferrer"` on all external links | PASS |
| No external icon library added to `package.json` | PASS |

### Live validation

**NOT COMPLETED — requires browser testing after deployment.**

Required:
1. Open Kamsi dashboard → task buttons show icons (not emoji)
2. Kamsi task with GSC page URL → Page column is clickable
3. Kamsi task with product URL → URL column is clickable
4. Clicking link opens `ledsone.co.uk` page in new tab
5. Kamsi task without URL → renders as plain text, no broken link
6. Sukirtha dashboard → `ledsone.de` links open correctly
7. Jefri/Sonya/etc — priority icons show, no URLs linked (correct)
8. High/medium/low priority icons render correctly in task buttons and task cards
9. Existing task completion still works
10. Existing task history still renders

**FINAL STATUS: NOT VERIFIED**

---

## Regression Risk

| Area | Risk | Mitigation |
|---|---|---|
| Task buttons | Emoji removed — visual change only | `task.priority` value unchanged, icons driven by same value |
| TaskDetailTable URL cells | New `<a>` wrapping | Only for values in `URL_COLUMNS` starting with `/` — all other cells unchanged |
| AiBriefPanel `<pre>` replaced | Line-by-line renderer | Non-emoji lines render as plain `<div>` with same content |
| `sukirtha_ai.py` /brief | New `brief_data` field added | Additive only — existing `message`, `ok`, `is_daily_brief` unchanged |

---

## Limitations

1. **Live validation not done** — cannot confirm links actually open correct pages without browser test
2. **Hetheesha** — has `product_handle` and `collection_handle` but no full URL; not linked (correct per requirement — do not construct URLs from handles)
3. **Dilaksi** — has `landingPage` path from GA4 but no confirmed base domain mapping; not linked
4. **12 staff remaining** — Jefri, Sonya, Thasitha, Theekshy, Mahima, Thivajini, Sajeepan have no verified URL in their data pipeline; not linked
5. **`BriefRenderer` in `AiBriefPanel`** — renders text-only; does not embed clickable product links inside the brief text (brief text is AI-generated; links only come from `task_detail` structured data)

---

## Handover

- Deploy to Contabo server, rebuild frontend (`npm run build`)
- Test Kamsi and Sukirtha dashboards in browser
- Confirm links open correct domains in new tab
- Git commit pending Piranav instruction
- Push from `piranav_aios/dm-dashboard/` — select **websitetecteam-arch**
