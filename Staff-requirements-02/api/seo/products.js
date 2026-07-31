// SEO Product Intelligence API
// ?type=pages    → GSC product pages with top keyword merged
// ?type=listings → Shopify listings handle→title map

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

function defaultDateRange() {
  const to = new Date();
  to.setDate(to.getDate() - 1);
  const from = new Date('2026-03-01');
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

async function handlePages(client, res, from, to) {
  const [pagesRes, kwRes] = await Promise.all([
    client.query(`
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
        AND page ILIKE '%ledsone.co.uk/products/%'
        AND date BETWEEN $2 AND $3
      GROUP BY page
      ORDER BY clicks DESC
      LIMIT 2000
    `, [GSC_SUB_SOURCE, from, to]),

    client.query(`
      WITH ranked AS (
        SELECT
          qp.page,
          qp.query,
          SUM(qp.clicks)::int AS kw_clicks,
          ROW_NUMBER() OVER (PARTITION BY qp.page ORDER BY SUM(qp.clicks) DESC) AS rn
        FROM google_search_console.query_page qp
        WHERE qp.sub_source = $1
          AND qp.search_type = 'web'
          AND qp.page ILIKE '%ledsone.co.uk/products/%'
          AND qp.date BETWEEN $2 AND $3
        GROUP BY qp.page, qp.query
      )
      SELECT page, query AS top_query, kw_clicks AS top_query_clicks
      FROM ranked
      WHERE rn = 1
    `, [GSC_SUB_SOURCE, from, to]),
  ]);

  const kwMap = {};
  kwRes.rows.forEach(r => {
    kwMap[r.page] = { top_query: r.top_query, top_query_clicks: parseInt(r.top_query_clicks) || 0 };
  });

  const rows = pagesRes.rows.map(r => ({
    page:              r.page,
    clicks:            parseInt(r.clicks) || 0,
    impressions:       parseInt(r.impressions) || 0,
    ctr_pct:           parseFloat(r.ctr_pct) || 0,
    avg_position:      parseFloat(r.avg_position) || 0,
    days_with_data:    parseInt(r.days_with_data) || 0,
    top_query:         kwMap[r.page] ? kwMap[r.page].top_query : null,
    top_query_clicks:  kwMap[r.page] ? kwMap[r.page].top_query_clicks : null,
  }));

  return res.status(200).json({
    ok: true,
    from,
    to,
    total: rows.length,
    data_note: 'GSC pipeline — clicks ≈ 50% of Google Search Console console totals. top_query from query_page table (privacy-thresholded — many pages return no matched keyword).',
    rows,
  });
}

async function handleListings(client, res) {
  const { rows } = await client.query(`
    SELECT shopify_handle AS handle, title
    FROM listings.shopify_listings
    WHERE sub_source = $1 AND is_parent = 1
    ORDER BY shopify_handle
  `, [GSC_SUB_SOURCE]);
  return res.status(200).json({ ok: true, count: rows.length, rows });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const type   = (req.query.type || '').trim();
  const DB_URL = process.env.DATABASE_URL;
  if (!DB_URL) return res.status(500).json({ ok: false, cause: 'no_db_url', error: 'DATABASE_URL not set' });

  const { from: defFrom, to: defTo } = defaultDateRange();
  const from = req.query.from || defFrom;
  const to   = req.query.to   || defTo;

  const client = makeClient(DB_URL, 30000);
  try {
    await client.connect();
    switch (type) {
      case 'pages':    return await handlePages(client, res, from, to);
      case 'listings': return await handleListings(client, res);
      default: return res.status(400).json({ ok: false, error: `Unknown type: "${type}". Valid: pages, listings` });
    }
  } catch (err) {
    return errResponse(res, err);
  } finally {
    try { await client.end(); } catch (_) {}
  }
};
