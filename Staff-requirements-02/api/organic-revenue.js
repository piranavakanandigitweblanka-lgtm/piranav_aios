// Organic Revenue API — google_analytics.organic_landing_page_revenue
// ?type=overview    — KPI totals + top 10 pages (latest snapshot)
// ?type=by-page     — per-URL rows (latest snapshot)
// ?type=trend       — monthly revenue aggregation
// ?type=by-type     — grouped by page type bucket (latest snapshot)

const { Client } = require('pg');

function makeClient() {
  return new Client({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    statement_timeout: 30000,
  });
}

function errResponse(res, err) {
  const msg = err.message || '';
  let cause = 'unknown';
  if (/password|authentication|SASL/i.test(msg))                  cause = 'authentication';
  else if (/timeout|ETIMEDOUT|ECONNREFUSED|ENOTFOUND/i.test(msg)) cause = 'network_timeout';
  else if (/ssl|TLS/i.test(msg))                                  cause = 'ssl';
  else if (/permission denied/i.test(msg))                        cause = 'missing_permissions';
  return res.status(500).json({ ok: false, cause, error: msg });
}

const PAGE_TYPE_SQL = `
  CASE
    WHEN landing_page = '/'                    THEN 'Home'
    WHEN landing_page LIKE '/products/%'       THEN 'Product'
    WHEN landing_page LIKE '/collections/%'    THEN 'Collection'
    WHEN landing_page LIKE '/blogs/%'          THEN 'Content'
    WHEN landing_page LIKE '/pages/%'          THEN 'Content'
    ELSE 'Other'
  END
`;

async function handleOverview(client, res) {
  const [totals, top10, latest] = await Promise.all([
    client.query(`
      SELECT
        SUM(sessions)::bigint             AS total_sessions,
        SUM(ecommerce_purchases)::bigint  AS total_orders,
        ROUND(SUM(purchase_revenue)::numeric, 2) AS total_revenue,
        COUNT(DISTINCT landing_page)::int AS total_pages,
        COUNT(DISTINCT CASE WHEN purchase_revenue > 0 THEN landing_page END)::int AS revenue_pages
      FROM google_analytics.organic_landing_page_revenue
      WHERE run_date = (SELECT MAX(run_date) FROM google_analytics.organic_landing_page_revenue)
        AND session_default_channel_group = 'Organic Search'
    `),
    client.query(`
      SELECT
        landing_page,
        ${PAGE_TYPE_SQL} AS page_type,
        SUM(sessions)::int                      AS sessions,
        SUM(ecommerce_purchases)::int           AS orders,
        ROUND(SUM(purchase_revenue)::numeric,2) AS revenue,
        ROUND(
          SUM(purchase_revenue) / NULLIF(SUM(sessions),0)::numeric, 4
        ) AS rev_per_session,
        ROUND(
          SUM(purchase_revenue) / NULLIF(SUM(ecommerce_purchases),0)::numeric, 2
        ) AS avg_order_value
      FROM google_analytics.organic_landing_page_revenue
      WHERE run_date = (SELECT MAX(run_date) FROM google_analytics.organic_landing_page_revenue)
        AND session_default_channel_group = 'Organic Search'
        AND purchase_revenue > 0
      GROUP BY landing_page
      ORDER BY SUM(purchase_revenue) DESC
      LIMIT 10
    `),
    client.query(`
      SELECT
        MAX(run_date)::date   AS last_updated,
        MAX(date_end)::date   AS data_through,
        MIN(date_start)::date AS data_from
      FROM google_analytics.organic_landing_page_revenue
    `),
  ]);

  const t = totals.rows[0] || {};
  const meta = latest.rows[0] || {};
  return res.status(200).json({
    ok: true,
    meta: {
      last_updated: meta.last_updated,
      data_through: meta.data_through,
      data_from: meta.data_from,
    },
    totals: {
      total_sessions:  t.total_sessions,
      total_orders:    t.total_orders,
      total_revenue:   t.total_revenue,
      total_pages:     t.total_pages,
      revenue_pages:   t.revenue_pages,
      rev_per_session: t.total_sessions > 0
        ? (parseFloat(t.total_revenue) / parseInt(t.total_sessions)).toFixed(4)
        : '0',
      avg_order_value: t.total_orders > 0
        ? (parseFloat(t.total_revenue) / parseInt(t.total_orders)).toFixed(2)
        : '0',
    },
    top10: top10.rows,
  });
}

async function handleByPage(client, res) {
  const { rows } = await client.query(`
    SELECT
      landing_page,
      ${PAGE_TYPE_SQL} AS page_type,
      SUM(sessions)::int                      AS sessions,
      SUM(active_users)::int                  AS active_users,
      SUM(ecommerce_purchases)::int           AS orders,
      ROUND(SUM(purchase_revenue)::numeric,2) AS revenue,
      ROUND(
        SUM(purchase_revenue) / NULLIF(SUM(sessions),0)::numeric, 4
      ) AS rev_per_session,
      ROUND(
        SUM(purchase_revenue) / NULLIF(SUM(ecommerce_purchases),0)::numeric, 2
      ) AS avg_order_value,
      MAX(run_date)::date AS last_seen
    FROM google_analytics.organic_landing_page_revenue
    WHERE run_date = (SELECT MAX(run_date) FROM google_analytics.organic_landing_page_revenue)
      AND session_default_channel_group = 'Organic Search'
    GROUP BY landing_page
    ORDER BY SUM(purchase_revenue) DESC
    LIMIT 1000
  `);

  return res.status(200).json({ ok: true, rows });
}

async function handleTrend(client, res) {
  const { rows } = await client.query(`
    SELECT
      DATE_TRUNC('month', run_date)::date      AS month,
      MAX(run_date)::date                      AS run_date,
      SUM(sessions)::int                       AS sessions,
      SUM(ecommerce_purchases)::int            AS orders,
      ROUND(SUM(purchase_revenue)::numeric, 2) AS revenue,
      COUNT(DISTINCT landing_page)::int        AS pages,
      COUNT(DISTINCT CASE WHEN purchase_revenue > 0 THEN landing_page END)::int AS revenue_pages
    FROM google_analytics.organic_landing_page_revenue
    WHERE session_default_channel_group = 'Organic Search'
    GROUP BY DATE_TRUNC('month', run_date)
    ORDER BY month ASC
  `);
  return res.status(200).json({ ok: true, rows });
}

async function handleByType(client, res) {
  const { rows } = await client.query(`
    SELECT
      ${PAGE_TYPE_SQL} AS page_type,
      SUM(sessions)::int                       AS sessions,
      SUM(ecommerce_purchases)::int            AS orders,
      ROUND(SUM(purchase_revenue)::numeric, 2) AS revenue,
      COUNT(DISTINCT landing_page)::int        AS pages,
      COUNT(DISTINCT CASE WHEN purchase_revenue > 0 THEN landing_page END)::int AS revenue_pages,
      ROUND(
        SUM(purchase_revenue) / NULLIF(SUM(sessions),0)::numeric, 4
      ) AS rev_per_session,
      ROUND(
        SUM(purchase_revenue) / NULLIF(SUM(ecommerce_purchases),0)::numeric, 2
      ) AS avg_order_value
    FROM google_analytics.organic_landing_page_revenue
    WHERE run_date = (SELECT MAX(run_date) FROM google_analytics.organic_landing_page_revenue)
      AND session_default_channel_group = 'Organic Search'
    GROUP BY page_type
    ORDER BY SUM(purchase_revenue) DESC
  `);
  return res.status(200).json({ ok: true, rows });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const type = req.query.type || 'overview';
  const client = makeClient();
  try {
    await client.connect();
    switch (type) {
      case 'overview': return await handleOverview(client, res);
      case 'by-page':  return await handleByPage(client, res);
      case 'trend':    return await handleTrend(client, res);
      case 'by-type':  return await handleByType(client, res);
      default:
        return res.status(400).json({ ok: false, error: `Unknown type "${type}". Valid: overview, by-page, trend, by-type` });
    }
  } catch (err) {
    return errResponse(res, err);
  } finally {
    try { await client.end(); } catch (_) {}
  }
};
