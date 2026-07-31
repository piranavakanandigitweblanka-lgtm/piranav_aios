// SEO Keyword Intelligence API
// ?type=top         → Top 500 keywords by clicks (all available data)
// ?type=opportunity → Keywords pos 4-20 with ≥50 impressions, ranked by impressions
// ?type=rising      → Keywords gaining position (last 30 days vs prior 30 days)
// ?type=declining   → Keywords losing position (last 30 days vs prior 30 days)

const { Client } = require('pg');

const GSC_SUB_SOURCE = 104;

function makeClient(connStr, timeout) {
  return new Client({
    connectionString: connStr,
    ssl: false,
    connectionTimeoutMillis: 15000,
    statement_timeout: timeout || 30000,
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

async function getLatestDate(client) {
  const { rows } = await client.query(
    `SELECT MAX(date) AS latest FROM google_search_console.query WHERE sub_source = $1`,
    [GSC_SUB_SOURCE]
  );
  return rows[0].latest ? new Date(rows[0].latest) : new Date();
}

function addDays(d, n) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r.toISOString().slice(0, 10);
}

async function handleTop(client, res, from, to) {
  const [kwRes, pageRes] = await Promise.all([
    client.query(`
      SELECT
        query,
        SUM(clicks)::int                                                    AS clicks,
        SUM(impressions)::int                                               AS impressions,
        ROUND((SUM(clicks)::numeric / NULLIF(SUM(impressions),0)) * 100, 3) AS ctr_pct,
        ROUND(AVG(position)::numeric, 1)                                    AS avg_position
      FROM google_search_console.query
      WHERE sub_source = $1 AND search_type = 'web' AND date BETWEEN $2 AND $3
      GROUP BY query
      ORDER BY clicks DESC
      LIMIT 500
    `, [GSC_SUB_SOURCE, from, to]),

    client.query(`
      WITH top_kw AS (
        SELECT query FROM google_search_console.query
        WHERE sub_source = $1 AND search_type = 'web' AND date BETWEEN $2 AND $3
        GROUP BY query ORDER BY SUM(clicks) DESC LIMIT 500
      ),
      ranked AS (
        SELECT qp.query, qp.page,
          ROW_NUMBER() OVER (PARTITION BY qp.query ORDER BY SUM(qp.clicks) DESC) AS rn
        FROM google_search_console.query_page qp
        JOIN top_kw t ON t.query = qp.query
        WHERE qp.sub_source = $1 AND qp.search_type = 'web' AND qp.date BETWEEN $2 AND $3
        GROUP BY qp.query, qp.page
      )
      SELECT query, page AS top_page FROM ranked WHERE rn = 1
    `, [GSC_SUB_SOURCE, from, to]),
  ]);

  const pageMap = {};
  pageRes.rows.forEach(r => { pageMap[r.query] = r.top_page; });

  const rows = kwRes.rows.map(r => ({
    query:          r.query,
    clicks:         parseInt(r.clicks) || 0,
    impressions:    parseInt(r.impressions) || 0,
    ctr_pct:        parseFloat(r.ctr_pct) || 0,
    avg_position:   parseFloat(r.avg_position) || 0,
    top_page:       pageMap[r.query] || null,
  }));

  return res.status(200).json({ ok: true, type: 'top', from, to, total: rows.length, rows });
}

async function handleOpportunity(client, res, from, to) {
  const { rows: raw } = await client.query(`
    SELECT
      query,
      SUM(clicks)::int                                                    AS clicks,
      SUM(impressions)::int                                               AS impressions,
      ROUND((SUM(clicks)::numeric / NULLIF(SUM(impressions),0)) * 100, 3) AS ctr_pct,
      ROUND(AVG(position)::numeric, 1)                                    AS avg_position
    FROM google_search_console.query
    WHERE sub_source = $1 AND search_type = 'web' AND date BETWEEN $2 AND $3
    GROUP BY query
    HAVING AVG(position) BETWEEN 4 AND 20 AND SUM(impressions) >= 50
    ORDER BY SUM(impressions) DESC
    LIMIT 300
  `, [GSC_SUB_SOURCE, from, to]);

  const rows = raw.map(r => {
    const pos = parseFloat(r.avg_position) || 0;
    const imp = parseInt(r.impressions) || 0;
    const ctr = parseFloat(r.ctr_pct) || 0;

    let score = 0;
    if      (pos <= 3)  score += 0;
    else if (pos <= 10) score += 40;
    else if (pos <= 20) score += 70;
    else if (pos <= 50) score += 50;
    else                score += 20;
    score += Math.min(imp / 100, 30);
    score -= Math.min(ctr * 10, 20);
    score = Math.max(0, Math.min(100, Math.round(score)));

    let action = '';
    if (pos <= 7 && imp >= 200)       action = 'Quick Win — Top 3 Push';
    else if (pos <= 10 && imp >= 200) action = 'CTR Boost — Title/Meta';
    else if (pos <= 15 && imp >= 200) action = 'Page 2 Rescue';
    else if (pos <= 20 && imp >= 200) action = 'Content Depth Needed';
    else if (imp >= 10000)            action = 'High Volume Priority';
    else                              action = 'Monitor';

    return {
      query:        r.query,
      clicks:       parseInt(r.clicks) || 0,
      impressions:  imp,
      ctr_pct:      ctr,
      avg_position: pos,
      opp_score:    score,
      action,
    };
  });

  rows.sort((a, b) => b.opp_score - a.opp_score);

  return res.status(200).json({ ok: true, type: 'opportunity', from, to, total: rows.length, rows });
}

async function handleMovers(client, res, direction) {
  const latest     = await getLatestDate(client);
  const curTo      = addDays(latest, 0);
  const curFrom    = addDays(latest, -29);
  const prvTo      = addDays(latest, -30);
  const prvFrom    = addDays(latest, -59);

  const dirCondition = direction === 'rising' ? '> 0.5' : '< -0.5';

  const { rows } = await client.query(`
    WITH current_period AS (
      SELECT
        query,
        ROUND(AVG(position)::numeric, 1) AS cur_pos,
        SUM(clicks)::int                 AS cur_clicks,
        SUM(impressions)::int            AS cur_imp
      FROM google_search_console.query
      WHERE sub_source = $1 AND search_type = 'web'
        AND date BETWEEN $2 AND $3
      GROUP BY query
      HAVING SUM(impressions) >= 10
    ),
    prior_period AS (
      SELECT
        query,
        ROUND(AVG(position)::numeric, 1) AS prv_pos,
        SUM(clicks)::int                 AS prv_clicks,
        SUM(impressions)::int            AS prv_imp
      FROM google_search_console.query
      WHERE sub_source = $1 AND search_type = 'web'
        AND date BETWEEN $4 AND $5
      GROUP BY query
      HAVING SUM(impressions) >= 10
    )
    SELECT
      c.query,
      c.cur_pos,
      p.prv_pos,
      ROUND((p.prv_pos - c.cur_pos)::numeric, 1) AS pos_change,
      c.cur_clicks,
      c.cur_imp,
      p.prv_clicks,
      p.prv_imp
    FROM current_period c
    JOIN prior_period p ON p.query = c.query
    WHERE (p.prv_pos - c.cur_pos) ${dirCondition}
    ORDER BY ABS(p.prv_pos - c.cur_pos) DESC
    LIMIT 200
  `, [GSC_SUB_SOURCE, curFrom, curTo, prvFrom, prvTo]);

  return res.status(200).json({
    ok: true,
    type: direction,
    cur_period:  { from: curFrom, to: curTo },
    prv_period:  { from: prvFrom, to: prvTo },
    total: rows.length,
    rows: rows.map(r => ({
      query:       r.query,
      cur_pos:     parseFloat(r.cur_pos) || 0,
      prv_pos:     parseFloat(r.prv_pos) || 0,
      pos_change:  parseFloat(r.pos_change) || 0,
      cur_clicks:  parseInt(r.cur_clicks) || 0,
      cur_imp:     parseInt(r.cur_imp) || 0,
      prv_clicks:  parseInt(r.prv_clicks) || 0,
      prv_imp:     parseInt(r.prv_imp) || 0,
    })),
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

  const client = makeClient(DB_URL, 30000);
  try {
    await client.connect();
    switch (type) {
      case 'top':         return await handleTop(client, res, from, to);
      case 'opportunity': return await handleOpportunity(client, res, from, to);
      case 'rising':      return await handleMovers(client, res, 'rising');
      case 'declining':   return await handleMovers(client, res, 'declining');
      default: return res.status(400).json({ ok: false, error: `Unknown type: "${type}". Valid: top, opportunity, rising, declining` });
    }
  } catch (err) {
    return errResponse(res, err);
  } finally {
    try { await client.end(); } catch (_) {}
  }
};
