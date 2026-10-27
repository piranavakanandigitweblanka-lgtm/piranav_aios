# Prompt: SEO URL Intelligence Page UI/UX Improvement

**Category:** ui-ux
**Date:** 2026-10-27
**Task key:** SEO-UIUX-001
**File:** `prompts/ui-ux/seo-url-intelligence-ui-ux-improvement-2026-10-27.md`

---

## Prompt

You are a React developer working on the DM Dashboard (React 19 + Vite).
The primary file to improve is: `frontend/src/admin/pages/SeoUrlIntelligence.jsx`

The shared design system CSS is at: `frontend/src/styles/dashboard.css`
CSS variables: `--j-accent` (indigo #4f46e5), `--j-card`, `--j-line`, `--j-ink`, `--j-muted`, `--j-bad` (red), `--j-good` (green)

**Shared CSS class inventory (existing, do not create duplicates):**
- `.jreq-header` — card wrapper for page header (border, bg, padding, radius)
- `.jreq-eyebrow` — uppercase accent label above h1
- `.jreq-header h1` — styled by CSS selector (22px, bold, ink color)
- `.jreq-sub` — subtitle text (muted, 0.86rem)
- `.jreq-chip`, `.jreq-chip.live` — status badge/chip (live = green dot)
- `.jreq-cards` — responsive grid for KPI summary cards
- `.jreq-card` — single KPI card (bg, border, radius, shadow)
- `.jreq-card-label`, `.jreq-card-value`, `.jreq-card-note` — card anatomy
- `.jreq-card.villain` — red value variant, `.jreq-card.hero` — amber value variant
- `.jreq-tbar` — toolbar row (auto-styles inputs, selects, buttons inside it)
- `.jreq-tbar button` — auto-styled (height 34px, border, bg, hover accent)
- `.jreq-tbar input[type='text']` — auto-styled (padding, border, accent focus)
- `.jreq-tbar select` — same as `.jreq-select`
- `.jreq-refresh` — green primary button class (inside tbar)
- `.jreq-tablebox` — card wrapper for table area
- `.jreq-scroll` — scrollable table container (max-height 640px, overflow auto)
- `.jreq-scroll thead th` — sticky, uppercase, muted
- `.jreq-scroll tbody td` — padded, nowrap, border-bottom, hover
- `.jreq-loading`, `.jreq-empty` — centered state messages
- `.jreq-pagination` — pagination row (auto-styles buttons inside it)
- `.jreq-inset-box` — inset background box for detail panels
- `.jreq-footnotes` — bottom footnote card (muted, small font)
- `.jreq-error` — red error block (for inline data errors)
- `.jreq-btn` — standalone button (base style, defined in CSS as of this task)
- `.jreq-btn-primary` — filled indigo modifier (requires jreq-btn base)
- `.jreq-error-banner` — full-width red banner (defined in CSS as of this task)
- `.jreq-info-banner` — full-width indigo-soft banner (defined in CSS as of this task)
- `.jreq-row-active` — highlighted table row (defined in CSS as of this task)
- `.jreq-row-detail td` — expanded detail sub-row (defined in CSS as of this task)

**What to build:**
1. Fix page header: add `jreq-eyebrow` label, use `jreq-sub` for subtitle, `jreq-chip live` for syncing state, `jreq-chip` for last sync timestamp
2. Add KPI summary cards using `jreq-cards`/`jreq-card`: Total Products, Ranking Drop, Improved, Potential Mismatch, No GSC Data — sourced from existing `summary` state (no new API calls)
3. Wrap all filters (search, 4 selects, Clear, Export CSV) in a `jreq-tbar` inside a `jreq-tablebox` — auto-styling applies
4. Fix table: inner `div.jreq-scroll` inside outer `div.jreq-tablebox`, remove `className="jreq-table"` (use bare `<table>`)
5. Improve expandable detail row: use `jreq-inset-box` for detail sections
6. Move data note (mismatch/ranking methodology) to `jreq-footnotes` card at page bottom
7. Fix all error/info states to use `jreq-error-banner` / `jreq-info-banner`
8. Pagination already correct (`jreq-pagination`) — no change needed

**Constraints (do NOT change):**
- All SEO calculation logic (ranking/mismatch/priority)
- All API calls and contracts (`apiFetch`, `BASE`, `store`, all params)
- All state and useEffect hooks
- All filter/sort/pagination logic
- All Pill maps and pill rendering
- All posChange / clicksPct / num / DescCell / RulesDetail helper functions
- CSV export handler
- Database schemas or Shopify data

**Technical context:**
- `summary` API returns `{ ok, total, rankingCounts, mismatchCounts }` where rankingCounts has keys like 'Ranking Drop', 'Improved', 'Stable', 'No GSC Data', 'Insufficient Data'
- `syncStatus` has `.status` ('idle'|'computing'|'done'|'error'), `.lastSync`, `.productsUpserted`, `.analysisRows`, `.gscCurrentPeriod`, `.gscPreviousPeriod`
- All filters (search, rankingFilter, mismatchFilter, listingFilter, inventoryFilter) must stay wired to the fetch effect and page reset

**Expected output:**
Improved `SeoUrlIntelligence.jsx` with proper jreq-* design system classes, KPI cards, and clean filter area. No changes to API, logic, or backend.
Also add missing CSS class definitions to `frontend/src/styles/dashboard.css` (append at end): `jreq-btn`, `jreq-error-banner`, `jreq-info-banner`, `jreq-row-active`, `.jreq-row-detail td`.
