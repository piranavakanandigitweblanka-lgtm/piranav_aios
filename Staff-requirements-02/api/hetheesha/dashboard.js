// Hetheesha SEO Work Tracker API — ledsone.fr
// ?type=work-tracker  → full issue list with current GSC + inventory status
// Data sources: google_search_console.page, inventory.products/physical_product_stock

const { Client } = require('pg');
const fs   = require('fs');
const path = require('path');

const BASELINE_PATH = path.join(__dirname, '..', '..', 'data', 'hetheesha', 'seo-work-baseline.json');
const CONFIG_PATH   = path.join(__dirname, '..', '..', 'data', 'hetheesha', 'work-tracker-config.json');

const SITE = 'https://ledsone.fr/';

function loadBaseline() {
  return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
}

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (_) {
    return { fixes: {} };
  }
}

// Query GSC: aggregate clicks/impressions/ctr/position for a set of URLs over a date window
async function queryGsc(client, urls, fromDate, toDate) {
  if (!urls.length) return {};
  const { rows } = await client.query(`
    SELECT
      page,
      SUM(clicks)::int                                          AS clicks,
      SUM(impressions)::int                                     AS impressions,
      ROUND(SUM(clicks)::numeric / NULLIF(SUM(impressions),0) * 100, 2) AS ctr,
      ROUND(AVG(position)::numeric, 1)                          AS position
    FROM google_search_console.page
    WHERE site_url = $1
      AND search_type = 'web'
      AND date BETWEEN $2 AND $3
      AND page = ANY($4::text[])
    GROUP BY page
  `, [SITE, fromDate, toDate, urls]);

  const map = {};
  rows.forEach(r => {
    map[r.page] = {
      clicks:      Number(r.clicks)      || 0,
      impressions: Number(r.impressions) || 0,
      ctr:         Number(r.ctr)         || 0,
      position:    Number(r.position)    || null,
      window:      `${fromDate} to ${toDate}`,
    };
  });
  return map;
}

// Determine status for a single issue given config + GSC/inventory data
function computeStatus(issue, cfgFix, gscCurrent, gscBefore, gscAfter, invStocks) {
  const manualStatus = cfgFix.status || 'Pending';
  const fixDate      = cfgFix.fix_date || null;

  if (issue.verify_method === 'manual') {
    return manualStatus;
  }

  if (issue.verify_method === 'auto_inventory') {
    // All tracked SKUs must have stock > 0 to be Verified
    const allRestocked = (issue.skus || []).every(sku => {
      const s = invStocks[sku];
      return s !== undefined && s !== null && s > 0;
    });
    if (allRestocked) return 'Verified';
    // Respect manual override (e.g. "Reopened") if set
    if (manualStatus !== 'Pending') return manualStatus;
    return 'Pending';
  }

  if (issue.verify_method === 'auto_gsc') {
    if (!fixDate) return 'Pending';

    // Needs 14 days of post-fix GSC data to evaluate
    if (!gscAfter) return 'Monitoring';

    // Compare: prefer CTR improvement; also accept position improvement (↓)
    const beforeCtr = gscBefore ? Number(gscBefore.ctr) : (issue.baseline_gsc ? Number(issue.baseline_gsc.ctr) : 0);
    const afterCtr  = Number(gscAfter.ctr) || 0;
    const beforePos = gscBefore ? Number(gscBefore.position) : (issue.baseline_gsc ? Number(issue.baseline_gsc.position) : 999);
    const afterPos  = Number(gscAfter.position) || 999;

    const ctrImproved = afterCtr > beforeCtr + 0.1;
    const posImproved = afterPos  < beforePos  - 0.5;

    if (ctrImproved || posImproved) {
      // Check for regression vs current
      if (gscCurrent) {
        const currentCtr = Number(gscCurrent.ctr) || 0;
        if (currentCtr < beforeCtr * 0.8) return 'Reopened';
      }
      return 'Improved';
    }
    return 'Declined';
  }

  return manualStatus;
}

async function handleWorkTracker(client) {
  const baseline = loadBaseline();
  const config   = loadConfig();
  const fixes    = config.fixes || {};

  // Latest GSC date
  const { rows: [latestRow] } = await client.query(`
    SELECT MAX(date)::date AS latest
    FROM google_search_console.page
    WHERE site_url = $1 AND search_type = 'web'
  `, [SITE]);
  const gscLatest = latestRow?.latest
    ? new Date(latestRow.latest).toISOString().slice(0, 10)
    : null;

  // Current 14-day GSC window (latest-13 → latest)
  let gscCurrentMap = {};
  if (gscLatest) {
    const curEnd   = gscLatest;
    const curStart = new Date(gscLatest);
    curStart.setDate(curStart.getDate() - 13);
    const autoGscUrls = baseline.issues
      .filter(i => i.verify_method === 'auto_gsc' && i.url)
      .map(i => i.url);
    if (autoGscUrls.length) {
      gscCurrentMap = await queryGsc(client, autoGscUrls, curStart.toISOString().slice(0,10), curEnd);
    }
  }

  // Before/After GSC for issues that have a fix_date
  const gscBeforeMap = {};
  const gscAfterMap  = {};

  const autoGscIssues = baseline.issues.filter(i => i.verify_method === 'auto_gsc' && i.url);
  for (const issue of autoGscIssues) {
    const fix = fixes[issue.id] || {};
    if (!fix.fix_date) continue;

    const fd        = new Date(fix.fix_date);
    const beforeEnd = new Date(fd); beforeEnd.setDate(beforeEnd.getDate() - 1);
    const beforeStart = new Date(beforeEnd); beforeStart.setDate(beforeStart.getDate() - 13);
    const afterStart  = new Date(fd); afterStart.setDate(afterStart.getDate() + 1);
    const afterEnd    = new Date(afterStart); afterEnd.setDate(afterEnd.getDate() + 13);

    const bMap = await queryGsc(client, [issue.url],
      beforeStart.toISOString().slice(0,10), beforeEnd.toISOString().slice(0,10));
    gscBeforeMap[issue.id] = bMap[issue.url] || null;

    if (gscLatest && new Date(gscLatest) >= afterEnd) {
      const aMap = await queryGsc(client, [issue.url],
        afterStart.toISOString().slice(0,10), afterEnd.toISOString().slice(0,10));
      gscAfterMap[issue.id] = aMap[issue.url] || null;
    }
  }

  // Inventory: current stock for all Req4 SKUs
  const allSkus = baseline.issues
    .filter(i => i.verify_method === 'auto_inventory' && Array.isArray(i.skus))
    .flatMap(i => i.skus);

  let invStocks = {};
  if (allSkus.length) {
    const { rows: invRows } = await client.query(`
      SELECT p.sku, SUM(ps.quantity::numeric)::int AS stock
      FROM inventory.products p
      JOIN inventory.physical_product_stock ps ON ps.inventory::varchar = p.id::varchar
      WHERE p.sku = ANY($1::text[])
      GROUP BY p.sku
    `, [allSkus]);
    invRows.forEach(r => { invStocks[r.sku] = r.stock; });
  }

  // Build full issue list
  const issues = baseline.issues.map(issue => {
    const cfgFix    = fixes[issue.id] || {};
    const gscCur    = gscCurrentMap[issue.url]  || null;
    const gscBefore = gscBeforeMap[issue.id]    || null;
    const gscAfter  = gscAfterMap[issue.id]     || null;

    const currentStocks = issue.skus
      ? Object.fromEntries(issue.skus.map(s => [s, invStocks[s] !== undefined ? invStocks[s] : null]))
      : null;

    const status = computeStatus(issue, cfgFix, gscCur, gscBefore, gscAfter, invStocks);

    // Days remaining in monitoring window (for auto_gsc with fix_date)
    let monitoring_days_remaining = null;
    if (issue.verify_method === 'auto_gsc' && cfgFix.fix_date && status === 'Monitoring') {
      const fd = new Date(cfgFix.fix_date);
      const windowEnd = new Date(fd); windowEnd.setDate(windowEnd.getDate() + 14);
      const today = new Date(gscLatest || new Date());
      monitoring_days_remaining = Math.max(0, Math.ceil((windowEnd - today) / 86400000));
    }

    return {
      id:          issue.id,
      req:         issue.req,
      priority:    issue.priority,
      type:        issue.type,
      url:         issue.url,
      description: issue.description,
      detail:      issue.detail,
      fix_type:    issue.fix_type,
      verify_method: issue.verify_method,
      // Baseline
      baseline_value:      issue.baseline_value,
      baseline_gsc:        issue.baseline_gsc,
      baseline_stock:      issue.baseline_stock  || null,
      baseline_revenue:    issue.baseline_revenue_30d || null,
      baseline_rank:       issue.baseline_rank   || null,
      // Current
      status,
      fix_date:    cfgFix.fix_date  || null,
      evidence:    cfgFix.evidence  || null,
      note:        cfgFix.note      || null,
      gsc_current: gscCur,
      gsc_before:  gscBefore,
      gsc_after:   gscAfter,
      current_stock: currentStocks,
      monitoring_days_remaining,
    };
  });

  // Summary per requirement
  const STATUSES = ['Pending','Verified','Monitoring','Improved','Declined','Reopened'];
  const summary = {};
  [1,2,3,4,5].forEach(r => {
    const ri = issues.filter(i => i.req === r);
    const counts = { total: ri.length };
    STATUSES.forEach(s => { counts[s.toLowerCase()] = ri.filter(i => i.status === s).length; });
    counts.resolved = counts.verified + counts.monitoring + counts.improved;
    summary[`req${r}`] = {
      ...counts,
      label:      baseline.meta.requirements[`req${r}`].label,
      audit_date: baseline.meta.requirements[`req${r}`].audit_date,
    };
  });

  const totalResolved = Object.values(summary).reduce((a, s) => a + s.resolved, 0);
  const totalIssues   = issues.length;

  return {
    issues,
    summary,
    overall: { total: totalIssues, resolved: totalResolved },
    baseline_date: baseline.meta.baseline_date,
    tracker_created: baseline.meta.tracker_created,
    gsc_latest: gscLatest,
    attribution_note: 'GSC performance data is shown for 14 days before and after the verified fix date. Many factors influence search performance. This comparison does not imply that the fix alone caused any observed change.',
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, error: 'DATABASE_URL not configured' });

  const type = req.query.type || 'work-tracker';

  const client = new Client({
    connectionString: connStr, ssl: false,
    connectionTimeoutMillis: 15000, statement_timeout: 55000,
  });

  try {
    await client.connect();
    let result;
    if (type === 'work-tracker') result = await handleWorkTracker(client);
    else return res.status(400).json({ ok: false, error: 'Unknown type: ' + type });
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    await client.end().catch(() => {});
  }
};
