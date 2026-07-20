// Hetheesha SEO Work Tracker API — ledsone.fr
// ?type=work-tracker  → full issue list with live GSC before/after and status

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
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); }
  catch (_) { return { fixes: {} }; }
}

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

// Query GSC aggregate for a set of URLs over a date window
async function queryGsc(client, urls, from, to) {
  if (!urls || !urls.length) return {};
  const { rows } = await client.query(`
    SELECT page,
      SUM(clicks)::int                                                          AS clicks,
      SUM(impressions)::int                                                     AS impressions,
      ROUND(SUM(clicks)::numeric / NULLIF(SUM(impressions),0) * 100, 2)        AS ctr,
      ROUND(AVG(position)::numeric, 1)                                         AS position
    FROM google_search_console.page
    WHERE site_url=$1 AND search_type='web' AND date BETWEEN $2 AND $3
      AND page = ANY($4::text[])
    GROUP BY page
  `, [SITE, from, to, urls]);
  const map = {};
  rows.forEach(r => {
    map[r.page] = {
      clicks:      Number(r.clicks)      || 0,
      impressions: Number(r.impressions) || 0,
      ctr:         Number(r.ctr)         || 0,
      position:    r.position !== null ? Number(r.position) : null,
      window:      `${from} to ${to}`,
    };
  });
  return map;
}

// Status determination per issue
function computeStatus(issue, cfgFix, gscBefore, gscAfter, gscCurrent) {
  const fixDate      = cfgFix.fix_date || null;
  const manualStatus = cfgFix.status   || 'Pending';

  // manual issues: always use config status
  if (issue.verify_method === 'manual') return manualStatus;

  // auto_gsc issues
  if (issue.verify_method === 'auto_gsc') {
    if (!fixDate) return 'Pending';
    // Wait for full 14-day after window
    if (!gscAfter) return 'Monitoring';

    const bCtr = gscBefore ? Number(gscBefore.ctr) : (issue.baseline_gsc ? Number(issue.baseline_gsc.ctr) : 0);
    const aCtr = Number(gscAfter.ctr) || 0;
    const bPos = gscBefore ? Number(gscBefore.position) : (issue.baseline_gsc ? Number(issue.baseline_gsc.position) : null);
    const aPos = gscAfter.position !== null ? Number(gscAfter.position) : null;

    const ctrDelta = aCtr - bCtr;
    const posDelta = (bPos !== null && aPos !== null) ? aPos - bPos : 0; // positive = worse rank

    const ctrImproved = ctrDelta >= 0.3;
    const ctrDeclined = ctrDelta <= -0.3;
    const posImproved = posDelta <= -1.0;
    const posDeclined = posDelta >= 1.0;

    let result;
    if (ctrImproved || posImproved)           result = 'Improved';
    else if (ctrDeclined || posDeclined)      result = 'Declined';
    else                                      result = 'No Clear Change';

    // Check for regression on something that was Improved
    if (result === 'Improved' && gscCurrent) {
      const curCtr = Number(gscCurrent.ctr) || 0;
      if (curCtr < bCtr - 0.3 && curCtr < aCtr * 0.8) result = 'Reopened';
    }
    return result;
  }

  return manualStatus;
}

async function handleWorkTracker(client) {
  const baseline = loadBaseline();
  const config   = loadConfig();
  const fixes    = config.fixes || {};

  // Latest GSC date
  const { rows: [lr] } = await client.query(`
    SELECT MAX(date)::date AS latest FROM google_search_console.page
    WHERE site_url=$1 AND search_type='web'
  `, [SITE]);
  const gscLatest = lr && lr.latest ? new Date(lr.latest).toISOString().slice(0, 10) : null;

  // Current 14-day snapshot for all auto_gsc URLs
  const autoGscIssues = baseline.issues.filter(i => i.verify_method === 'auto_gsc' && i.url);
  const autoGscUrls   = autoGscIssues.map(i => i.url);

  let gscCurrentMap = {};
  if (gscLatest && autoGscUrls.length) {
    const curFrom = addDays(gscLatest, -13);
    gscCurrentMap = await queryGsc(client, autoGscUrls, curFrom, gscLatest);
  }

  // Per-issue before/after windows for those with a fix_date
  const gscBeforeMap = {};
  const gscAfterMap  = {};

  for (const issue of autoGscIssues) {
    const fix = fixes[issue.id] || {};
    if (!fix.fix_date) continue;

    const beforeEnd   = addDays(fix.fix_date, -1);
    const beforeStart = addDays(fix.fix_date, -14);
    const afterStart  = addDays(fix.fix_date,  1);
    const afterEnd    = addDays(fix.fix_date, 14);

    const bMap = await queryGsc(client, [issue.url], beforeStart, beforeEnd);
    gscBeforeMap[issue.id] = bMap[issue.url] || null;

    // Only compute after when full 14 days have elapsed
    if (gscLatest && gscLatest >= afterEnd) {
      const aMap = await queryGsc(client, [issue.url], afterStart, afterEnd);
      gscAfterMap[issue.id] = aMap[issue.url] || null;
    }
  }

  // Build output
  const issues = baseline.issues.map(issue => {
    const fix        = fixes[issue.id] || {};
    const gscCurrent = gscCurrentMap[issue.url]  || null;
    const gscBefore  = gscBeforeMap[issue.id]    || null;
    const gscAfter   = gscAfterMap[issue.id]     || null;
    const status     = computeStatus(issue, fix, gscBefore, gscAfter, gscCurrent);

    // Monitoring days remaining
    let monitoringDaysLeft = null;
    if (issue.verify_method === 'auto_gsc' && fix.fix_date && status === 'Monitoring' && gscLatest) {
      const windowEnd = addDays(fix.fix_date, 14);
      monitoringDaysLeft = Math.max(0, Math.ceil(
        (new Date(windowEnd) - new Date(gscLatest)) / 86400000
      ));
    }

    return {
      id:             issue.id,
      req:            issue.req,
      priority:       issue.priority,
      issue_type:     issue.issue_type,
      issue_found_date: issue.issue_found_date,
      url:            issue.url,
      handle:         issue.handle,
      description:    issue.description,
      detail:         issue.detail,
      baseline_value: issue.baseline_value,
      baseline_gsc:   issue.baseline_gsc,
      verify_method:  issue.verify_method,
      // Live
      status,
      fix_date:    fix.fix_date  || null,
      evidence:    fix.evidence  || null,
      note:        fix.note      || null,
      gsc_current: gscCurrent,
      gsc_before:  gscBefore,
      gsc_after:   gscAfter,
      monitoring_days_left: monitoringDaysLeft,
    };
  });

  // Summary per requirement
  const RESOLVED = new Set(['Verified','Monitoring','Improved','No Clear Change']);
  const summary  = {};
  [1,2,3,4,5].forEach(r => {
    const ri = issues.filter(i => i.req === r);
    const counts = {};
    ['Pending','Verified','Monitoring','Improved','Declined','No Clear Change','Reopened'].forEach(s => {
      counts[s.toLowerCase().replace(/ /g,'_')] = ri.filter(i => i.status === s).length;
    });
    counts.total    = ri.length;
    counts.resolved = ri.filter(i => RESOLVED.has(i.status)).length;
    const req = baseline.meta.requirements[`req${r}`];
    summary[`req${r}`] = { ...counts, label: req.label, audit_date: req.audit_date };
  });

  const totalResolved = Object.values(summary).reduce((a, s) => a + s.resolved, 0);

  return {
    issues,
    summary,
    overall: { total: issues.length, resolved: totalResolved },
    baseline_date:   baseline.meta.baseline_date,
    tracker_created: baseline.meta.tracker_created,
    gsc_latest:      gscLatest,
    attribution_note: 'GSC data is shown for 14 days before and after the verified fix date. Many factors affect search performance. This does not imply that the fix alone caused any observed change.',
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, error: 'DATABASE_URL not configured' });

  const type   = req.query.type || 'work-tracker';
  const client = new Client({
    connectionString: connStr, ssl: false,
    connectionTimeoutMillis: 15000, statement_timeout: 55000,
  });

  try {
    await client.connect();
    if (type === 'work-tracker') {
      const result = await handleWorkTracker(client);
      return res.status(200).json({ ok: true, ...result });
    }
    return res.status(400).json({ ok: false, error: 'Unknown type: ' + type });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    await client.end().catch(() => {});
  }
};
