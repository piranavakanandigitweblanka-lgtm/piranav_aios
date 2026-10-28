---
name: dm-campaign-stage2-frontend-owner
description: Stage 2 frontend prompt for DM Campaign Owner UI. OwnerBadge component, Owner filter dropdown, Owner table column, colSpan fix, CSV column, ProductDetailModal Owner + Shopify Tags rows. No backend changes.
metadata:
  type: prompt
  category: dm-dashboard
---

# Prompt: DM Campaign Products — Stage 2 Frontend Owner UI

## Context

DM Dashboard — `frontend/src/admin/pages/DmCampaign.jsx`.
Stage 1 backend already added `owner` and `shopifyTags` keys to every product dict item.

**Owner values (from backend):** `Sonya`, `Sajeepan`, `No Tag`, `Conflict`, `Unresolved`
**Old snapshot fallback:** products from snapshots before Stage 1 may have no `owner` key — always use `r.owner ?? 'Unresolved'` (never `'No Tag'`).

---

## Task

Add Owner UI to `ProductsView` and `ProductDetailModal` in `DmCampaign.jsx`. No backend changes.

---

## Components to Add

### `OWNER_META` constant (after `FLAG_META`)
```js
const OWNER_META = {
  Sonya:      { cls: 'jreq-pill jreq-pill-solid-blue' },
  Sajeepan:   { cls: 'jreq-pill jreq-pill-solid-green' },
  'No Tag':   { cls: 'jreq-pill' },
  Conflict:   { cls: 'jreq-pill jreq-pill-solid-amber' },
  Unresolved: { cls: 'jreq-pill jreq-pill-solid-red' },
}
```

### `OwnerBadge` component (after `FlagPill`)
```jsx
function OwnerBadge({ owner }) {
  const label = owner ?? 'Unresolved'
  const meta = OWNER_META[label]
  return <span className={meta ? meta.cls : 'jreq-pill'}>{label}</span>
}
```

---

## Changes to `ProductsView`

1. Add `const [owner, setOwner] = useState('all')`
2. Add `if (owner !== 'all') out = out.filter((r) => (r.owner ?? 'Unresolved') === owner)` in `filtered` useMemo; add `owner` to dependency array
3. Add Owner `<select>` in toolbar (between Campaign and Flag):
   - Options: All Owners / Sonya / Sajeepan / No Tag / Conflict / Unresolved
   - Resets page to 1 on change
4. Add `<th>Owner</th>` in table header (after Campaign `<th>`)
5. Add `<td><OwnerBadge owner={r.owner} /></td>` in table rows (after Campaign cell)
6. Fix both `colSpan={8}` → `colSpan={9}` (loading state and empty state)
7. Update CSV header: add `'Owner'` after `'Campaign'`
8. Update CSV values: add `r.owner ?? 'Unresolved'` after `r.campaignName`

---

## Changes to `ProductDetailModal`

1. Add Owner row after Campaign row:
```jsx
<tr>
  <td>Owner</td>
  <td className="num"><OwnerBadge owner={product.owner} /></td>
</tr>
```

2. Add Shopify Tags row after Sales Gap row:
```jsx
<tr>
  <td style={{ paddingTop: 10, verticalAlign: 'top' }}>Shopify Tags</td>
  <td className="num">
    {product.shopifyTags && product.shopifyTags.length > 0
      ? product.shopifyTags.map((t, i) => (
          <span key={i} className="jreq-pill" style={{ marginRight: 4, marginBottom: 4 }}>{t.trim()}</span>
        ))
      : <span style={{ color: 'var(--j-muted)', fontStyle: 'italic' }}>No tags</span>}
  </td>
</tr>
```

---

## Constraints

- Do NOT modify backend classification rules
- Do NOT add unapproved tags to SONYA_TAGS or SAJEEPAN_TAGS
- Do NOT change CampaignsView CSV
- Use `r.owner ?? 'Unresolved'` everywhere (not `?? 'No Tag'`)
- Do NOT commit or push
- Run `npm run build` and confirm 0 errors before reporting done
- Re-run `python -m pytest tests/test_dm_campaign.py -v` and confirm 63/63 PASS
