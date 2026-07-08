# Implementation Notes — Sonya Req 1 Stage Accordion UI

## Date
2026-07-08

## Decision
Replace always-visible Stage blocks with a per-row accordion button.

## Why
Previous design showed 60d and 90d blocks permanently visible in every row, making the table very wide and visually heavy. The accordion keeps the table clean while still providing all 4 period comparisons on demand.

## Code Changes

### CSS — new styles added
```css
.stage-cell{min-width:160px;}   /* reduced from 340px — button is compact */
.stg-btn{border:1px solid var(--accent);border-radius:6px;padding:5px 11px;font-size:11px;font-weight:700;cursor:pointer;background:var(--accent-soft);color:var(--accent);white-space:nowrap;transition:all .15s;}
.stg-btn:hover{background:var(--accent);color:#fff;}
.stg-panel{margin-top:6px;}
```

### New function — toggleStage()
```javascript
function toggleStage(uid) {
  const panel = document.getElementById(uid);
  const btn   = panel.previousElementSibling;
  const open  = panel.style.display !== 'none';
  panel.style.display = open ? 'none' : 'block';
  btn.textContent = open ? 'View Stage Details ▼' : 'Hide Stage Details ▲';
}
```

### stageHTML() — full replacement
```javascript
function stageHTML(c) {
  const uid = 'stg-' + c.id;
  const blk = (lbl, data) => { ... };  // same inner block structure
  return `<button class="stg-btn" onclick="toggleStage('${uid}')">View Stage Details ▼</button>
    <div class="stg-panel" id="${uid}" style="display:none;">
      ${blk('1. Last 30 Days (2026-06-08 – 2026-07-07)', c.l30)}
      ${blk('2. Before Last (2026-05-09 – 2026-06-07)', c.bl)}
      ${blk('3. Last 60 Days (2026-05-09 – 2026-07-07)', c.d60)}
      ${blk('4. Last 90 Days (2026-04-09 – 2026-07-07)', c.d90)}
    </div>`;
}
```

### RAW array — bl added back
`bl` (Before Last = 2026-05-09 to 2026-06-07) re-added to all 9 campaigns.
Values from original data (verified: d60 − l30 = bl for each campaign).

### Per-row independence
Each row uses `uid = 'stg-' + campaign_id` (e.g. `stg-21435967873`) as the panel ID.
No shared state — toggle acts only on the specific row's panel.

## Files Changed
- `Staff-requirements/pages/sonya.html`
