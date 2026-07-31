// SEO Landing Pages API
// ?type=pages      → Top 500 landing pages by clicks, all page types, with classified page_type
// ?type=by-type    → Aggregated clicks/impressions/avg_position by page type
// ?type=top-pages  → Top 10 pages MoM: current month vs prior month

const { Client } = require('pg');

const GSC_SUB_SOURCE = 104;

function makeClient(connStr) {
  return new Client({
    connectionString: connStr,
    ssl: false,
    connectionTimeoutMillis: 15000,
    statement_timeout: 30000,
  });
}

function errResponse(res, err) {
  const msg = err.message || '';
  let cause = 'unknown';
  if (/password|authentication|SASL/i.test(msg))                 cause = 'authentication';
  else if (/timeout|ETIMEDOUT|ECONNREFUSED|ENOTFOUND/i.test(msg)) cause = 'network_timeout';
  else if (/ssl|TLS/i.test(msg))                                 cause = 'ssl';
  else if (/permission denied/i.test(msg))                       cause = 'missing_permissions';
  return res.status(500).json({ ok: false, cause, error: msg });
}

function classifyPage(page) {
  if (!page) return 'other';
  const p = page.replace(/^https?:\/\/[^/]+/, '').toLowerCase();
  if (p === '/' || p === '')               return 'home';
  if (p.startsWith('/products/'))          return 'product';
  if (p.startsWith('/collections/'))       return 'collection';
  if (p.startsWith('/blogs/') || p.startsWith('/pages/')) return 'content';
  if (p.startsWith('/search'))             return 'search';
  return 'other';
}

async function handlePages(client, res, from, to) {
  const { rows: raw } = await client.query(`
    SELECT
      page,
      SUM(clicks)::int                                                    AS clicks,
      SUM(impressions)::int                                               AS impressions,
      ROUND((SUM(clicks)::numeric / NULLIF(SUM(impressions),0)) * 100, 3) AS ctr_pct,
      ROUND(AVG(position)::numeric, 1)                                    AS avg_position,
      COUNT(DISTINCT date)::int                                           AS days_with_data
    FROM google_search_console.page
    WHERE sub_source = $1
      AND search_type = 'web'
      AND date BETWEEN $2 AND $3
    GROUP BY page
    ORDER BY clicks DESC
    LIMIT 500
  `, [GSC_SUB_SOURCE, from, to]);

  const rows = raw.map(r => ({
    page:           r.page,
    page_type:      classifyPage(r.page),
    clicks:         parseInt(r.clicks) || 0,
    impressions:    parseInt(r.impressions) || 0,
    ctr_pct:        parseFloat(r.ctr_pct) || 0,
    avg_position:   parseFloat(r.avg_position) || 0,
    days_with_data: parseInt(r.days_with_data) || 0,
  }));

  return res.status(200).json({ ok: true, type: 'pages', from, to, total: rows.length, rows });
}

async function handleByType(client, res, from, to) {
  const { rows: raw } = await client.query(`
    SELECT
      page,
      SUM(clicks)::int       AS clicks,
      SUM(impressions)::int  AS impressions,
      AVG(position)          AS avg_pos
    FROM google_search_console.page
    WHERE sub_source = $1
      AND search_type = 'web'
      AND date BETWEEN $2 AND $3
    GROUP BY page
  `, [GSC_SUB_SOURCE, from, to]);

  const buckets = {};
  for (const r of raw) {
    const t = classifyPage(r.page);
    if (!buckets[t]) buckets[t] = { page_type: t, clicks: 0, impressions: 0, pos_sum: 0, page_count: 0 };
    buckets[t].clicks      += parseInt(r.clicks) || 0;
    buckets[t].impressions += parseInt(r.impressions) || 0;
    buckets[t].pos_sum     += parseFloat(r.avg_pos) || 0;
    buckets[t].page_count  += 1;
  }

  const rows = Object.values(buckets).map(b => ({
    page_type:    b.page_type,
    clicks:       b.clicks,
    impressions:  b.impressions,
    ctr_pct:      b.impressions > 0 ? parseFloat(((b.clicks / b.impressions) * 100).toFixed(3)) : 0,
    avg_position: b.page_count > 0  ? parseFloat((b.pos_sum / b.page_count).toFixed(1)) : 0,
    page_count:   b.page_count,
  })).sort((a, b) => b.clicks - a.clicks);

  return res.status(200).json({ ok: true, type: 'by-type', from, to, rows });
}

async function handleTopPagesMoM(client, res) {
  // Current month = most recent full or partial calendar month in DB
  const { rows: latest } = await client.query(
    `SELECT MAX(date) AS d FROM google_search_console.page WHERE sub_source = $1`,
    [GSC_SUB_SOURCE]
  );
  const latestDate = latest[0].d ? new Date(latest[0].d) : new Date();
  const curYear  = latestDate.getFullYear();
  const curMonth = latestDate.getMonth(); // 0-based

  const curFrom = `${curYear}-${String(curMonth + 1).padStart(2,'0')}-01`;
  const curTo   = latestDate.toISOString().slice(0, 10);

  const prvDate  = new Date(curYear, curMonth - 1, 1);
  const prvFrom  = `${prvDate.getFullYear()}-${String(prvDate.getMonth() + 1).padStart(2,'0')}-01`;
  const prvTo    = new Date(curYear, curMonth, 0).toISOString().slice(0, 10); // last day of prior month

  const [curRes, prvRes] = await Promise.all([
    client.query(`
      SELECT page, SUM(clicks)::int AS clicks, SUM(impressions)::int AS impressions,
             ROUND(AVG(position)::numeric,1) AS avg_position
      FROM google_search_console.page
      WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
      GROUP BY page ORDER BY clicks DESC LIMIT 20
    `, [GSC_SUB_SOURCE, curFrom, curTo]),
    client.query(`
      SELECT page, SUM(clicks)::int AS clicks, SUM(impressions)::int AS impressions,
             ROUND(AVG(position)::numeric,1) AS avg_position
      FROM google_search_console.page
      WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
      GROUP BY page
    `, [GSC_SUB_SOURCE, prvFrom, prvTo]),
  ]);

  const prvMap = {};
  prvRes.rows.forEach(r => {
    prvMap[r.page] = { clicks: parseInt(r.clicks)||0, impressions: parseInt(r.impressions)||0, avg_position: parseFloat(r.avg_position)||0 };
  });

  const rows = curRes.rows.map(r => {
    const prv = prvMap[r.page] || null;
    return {
      page:           r.page,
      page_type:      classifyPage(r.page),
      cur_clicks:     parseInt(r.clicks) || 0,
      cur_impressions:parseInt(r.impressions) || 0,
      cur_position:   parseFloat(r.avg_position) || 0,
      prv_clicks:     prv ? prv.clicks : null,
      prv_impressions:prv ? prv.impressions : null,
      prv_position:   prv ? prv.avg_position : null,
    };
  });

  return res.status(200).json({
    ok: true, type: 'top-pages',
    cur_period: { from: curFrom, to: curTo },
    prv_period: { from: prvFrom, to: prvTo },
    total: rows.length, rows,
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const type   = (req.query.type || '').trim();
  const DB_URL = process.env.DATABASE_URL;
  if (!DB_URL) return res.status(500).json({ ok: false, cause: 'no_db_url', error: 'DATABASE_URL not set' });

  const from = req.query.from || '2026-03-20';
  const to   = req.query.to   || new Date().toISOString().slice(0, 10);

  const client = makeClient(DB_URL);
  try {
    await client.connect();
    switch (type) {
      case 'pages':     return await handlePages(client, res, from, to);
      case 'by-type':   return await handleByType(client, res, from, to);
      case 'top-pages': return await handleTopPagesMoM(client, res);
      default: return res.status(400).json({ ok: false, error: `Unknown type: "${type}". Valid: pages, by-type, top-pages` });
    }
  } catch (err) {
    return errResponse(res, err);
  } finally {
    try { await client.end(); } catch (_) {}
  }
};
