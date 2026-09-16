# Evidence — Hetheesha Dashboard UX Overhaul — 2026-09-16

**Session date:** 2026-09-16
**Staff:** Hetheesha (SEO Specialist, ledsone.fr)
**Repo:** websitetecteam-arch/dm-dashboard · branch: piranv-work
**Status:** PASS

---

## What Was Built

### Req 1 — ProductSeoReport.jsx (previous session, carried forward)
- Action List at top (priority-sorted: Missing=1, Duplicate=2, Too Long/Short=3, Low CTR=4, FAQ=5, Alt=6)
- Fix Tracker always visible — two-column Pending / Fixed by You
- One-click Done: `markDone(handle, fieldKey)` → POST `/fix-save` → optimistic state update
- `isFixed(handle, fieldKey)` — checks `fixEntries[handle|fieldKey]?.fix_date`
- `trkFixedGrouped` useMemo — groups Fixed by URL (all fixed fields in one row)
- `InlineImpact` — inline GSC Before/After, 7d/14d/30d toggle, calls `/fix-detail`
- Fix key separator: `|`

### Req 2 — CollectionPerformance.jsx
**Commit:** 8401b78
- Same 3 UX fixes as Req 1
- Fix key separator: `::`
- API: `/r2-fix-save`, `/r2-fix-load`, `/r2-fix-detail`
- `InlineImpactR2` — r2-fix-detail takes `fix_date` as direct query param (not from DB)
- Fields: `seo_title`, `seo_desc`, `has_faq`
- Ranking: by GSC clicks (not revenue)

### Req 3 — DuplicatePageAnalysis.jsx
**Commit:** bdb582a
- Action List only (no fix tracker — no backend endpoints for Req 3)
- Priority: Missing title (1) → Missing desc (1) → Dup title (2) → Dup desc (2) → Dup prod desc (3)
- Products before Collections within each priority
- Direct "Fix on Shopify →" admin link per row

### Req 4 — HighTrafficStockAlert.jsx
**Commit:** 399185a
- Action List only
- Priority 1 (red): Out of Stock + GSC clicks > 0 → "Redirect / Update Links"
- Priority 2 (amber): Low Stock + GSC clicks > 0 → "Monitor Closely"
- Sorted by GSC clicks desc within each priority
- Two count badges: red (OOS count) + amber (low stock count)

### Req 5 — InternalLinkAudit.jsx
**Commit:** 853c5e6
- Action List only
- Priority 1 (red): No Internal Links (count = 0)
- Priority 2 (amber): Weak Internal Linking (count 1–2)
- Products before Collections within each priority, then alpha URL
- "Add Link →" button → Shopify admin for that product/collection

### AI Brief — hetheesha_ai.py
**Commit:** 696c3ac
- `_gather_data()`: reads req3/4/5 from `sales_cache.hetheesha_req3/4/5_snapshot`
- `_build_system_prompt()`: added DUPLICATE PAGE ANALYSIS, HIGH-TRAFFIC STOCK ALERT, INTERNAL LINKS COVERAGE sections
- New urgency order: overdue → OOS+clicks → due today → missing meta → no internal links → progress
- `_build_brief_data()`: adds `duplicate_audit`, `stock_alert`, `internal_links` tables for task log display

---

## Commit Log

| Commit | File | Change |
|---|---|---|
| 8401b78 | CollectionPerformance.jsx | Req 2 full UX rewrite |
| bdb582a | DuplicatePageAnalysis.jsx | Req 3 Action List |
| 399185a | HighTrafficStockAlert.jsx | Req 4 Action List |
| 853c5e6 | InternalLinkAudit.jsx | Req 5 Action List |
| 696c3ac | hetheesha_ai.py | All 5 reqs in AI brief |

All commits on: `websitetecteam-arch/dm-dashboard` · branch `piranv-work`

---

## Validation Notes

- No backend changes for Req 1–5 frontend work — all existing endpoints confirmed compatible
- Fix key separators confirmed: `|` for Req 1, `::` for Req 2
- `r2-fix-detail` confirmed to take `fix_date` as direct query param (not DB lookup)
- Snapshot tables confirmed: `sales_cache.hetheesha_req3/4/5_snapshot`, `payload` column, `id = 1`
- AI brief try/except wrapping added — safe if snapshots don't exist yet

---

## Deploy Command

```bash
cd /var/www/dashboard-dm && git pull origin piranv-work && systemctl restart dm-dashboard
```

After deploy: Hetheesha must click "↻ Refresh Brief" to regenerate brief with all 5 requirements.
