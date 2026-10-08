# Capability Extraction — Theekshy Requirement 3 (Feed Optimisation Action Log)
**Date:** 2026-07-16 | **Domain:** Manual Dashboard · localStorage · Business Rule Engine

---

## Reusable: Manual Action Log Pattern (localStorage)

```js
var STORE_KEY = 'theekshy_r3_feed_reviews';
var records = [];

function load() {
  try { var raw = localStorage.getItem(STORE_KEY); records = raw ? JSON.parse(raw) : []; }
  catch(e) { records = []; }
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(records)); }
  catch(e) { console.error('localStorage save failed', e); }
}
function genId() { return 'prefix_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); }
```

Use for any manual log feature that must survive browser refresh without a backend.

---

## Reusable: Date Arithmetic (no moment.js)

```js
function addDays(d, n) {
  var dt = new Date(d + 'T00:00:00');
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}
function today() { return new Date().toISOString().slice(0, 10); }
```

Always pass date as 'YYYY-MM-DD' + 'T00:00:00' to avoid timezone offset issues.

---

## Reusable: Price Match (numeric, 2 d.p.)

```js
function priceMatch(a, b) {
  if (a === null || a === '' || b === null || b === '') return 'Not Checked';
  var ga = parseFloat(a), gb = parseFloat(b);
  if (isNaN(ga) || isNaN(gb)) return 'Not Checked';
  return Math.round(ga * 100) === Math.round(gb * 100) ? 'Match' : 'Mismatch';
}
```

Never compare formatted currency strings. Always parse to float first.

---

## Reusable: Priority-Based Condition Engine

```js
function condition(rec) {
  if (rec.field1 === 'BadValue1') return 'HighPriorityCondition';
  if (rec.field2 === 0) return 'MedCondition';
  // ... more priority checks ...
  if (allGoodConditionsMet(rec)) return 'Healthy';
  return 'Incomplete';
}
```

Always check in strict priority order — first match wins. Never evaluate all conditions and merge; highest priority overrides.

---

## Reusable: Review State (date-relative)

```js
function reviewState(rec) {
  var frd = feedReviewDate(rec.dateOptimised);
  if (!frd) return 'Not Due';
  if (status(condition(rec)) === 'Healthy') return 'Reviewed';
  var td = today();
  if (td < frd) return 'Not Due';
  if (td === frd) return 'Due Today';
  return 'Overdue';
}
```

Check Healthy/Reviewed BEFORE date comparison — a record completed late is still Reviewed, not Overdue.

---

## Warning Present Detection

```js
function hasWarning(w) {
  if (!w) return false;
  var t = w.trim().toLowerCase();
  return t !== '' && t !== 'none' && t !== 'no warning' && t !== 'n/a' && t !== 'no warnings';
}
```

Do not check for empty string only — users may type "None" or "N/A" to mean no warning.

---

## Modal Pattern (position:fixed, outside tab panels)

Modal must be placed OUTSIDE all `display:none` tab panels to remain visible across tabs. Use `position:fixed` and `z-index:9000`. Close on Escape key and on Cancel button. Focus first input on open.

---

## localStorage Namespace Rule

Always namespace localStorage keys per staff member and requirement:
- `theekshy_r3_feed_reviews` — Theekshy Req 3
- `theekshy_r1_decisions` — (hypothetical Req 1 decisions)
- Never use generic keys like `feed_reviews` which could conflict across staff pages
