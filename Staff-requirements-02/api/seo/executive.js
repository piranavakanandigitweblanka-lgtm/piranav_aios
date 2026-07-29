// SEO Executive Dashboard API
// ?type=gsc-monthly     → GSC monthly totals (PostgreSQL pipeline)
// ?type=position-dist   → Keyword position buckets (current month)
// ?type=ads-monthly     → Google Ads monthly totals (UK account)
// ?type=data-quality    → Source coverage and freshness metadata

const { Client } = require('pg');

const ADS_ACCOUNT = 4503486236;
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

async function handleGscMonthly(client, res) {
  const { rows } = await client.query(`
    SELECT
      DATE_TRUNC('month', date)::date      AS month,
      COUNT(DISTINCT date)::int            AS days_with_data,
      SUM(clicks)::int                     AS clicks,
      SUM(impressions)::int                AS impressions,
      ROUND(AVG(position)::numeric, 2)     AS avg_position
    FROM google_search_console.overview
    WHERE sub_source = $1 AND search_type = 'web'
    GROUP BY DATE_TRUNC('month', date)
    ORDER BY month ASC
  `, [GSC_SUB_SOURCE]);
  return res.status(200).json({
    ok: true,
    data_note: 'PostgreSQL GSC pipeline — clicks are approximately 50% of Google Search Console console totals. The overview table stores device-thresholded data.',
    rows
  });
}

async function handlePositionDist(client, res) {
  const { rows } = await client.query(`
    SELECT
      CASE
        WHEN position <= 3   THEN 'pos_1_3'
        WHEN position <= 10  THEN 'pos_4_10'
        WHEN position <= 20  THEN 'pos_11_20'
        WHEN position <= 50  THEN 'pos_21_50'
        ELSE                      'pos_51_100'
      END AS bucket,
      COUNT(DISTINCT query)::int AS query_count,
      SUM(clicks)::int           AS clicks,
      SUM(impressions)::int      AS impressions
    FROM google_search_console.query
    WHERE sub_source = $1
      AND search_type = 'web'
      AND date >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY bucket
    ORDER BY MIN(position)
  `, [GSC_SUB_SOURCE]);
  return res.status(200).json({ ok: true, rows });
}

async function handleAdsMonthly(client, res) {
  const { rows } = await client.query(`
    SELECT
      DATE_TRUNC('month', cp.date)::date              AS month,
      COUNT(DISTINCT cp.campaign_id)::int              AS active_campaigns,
      SUM(cp.clicks)::int                              AS clicks,
      SUM(cp.impressions)::int                         AS impressions,
      ROUND(SUM(cp.cost)::numeric, 2)                  AS cost_gbp,
      ROUND(SUM(cp.conversion_value)::numeric, 2)      AS conv_value_gbp,
      ROUND((SUM(cp.conversion_value) / NULLIF(SUM(cp.cost), 0))::numeric, 4) AS roas
    FROM google_ads.campaign_performance cp
    JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
    WHERE c.account_id = $1
    GROUP BY DATE_TRUNC('month', cp.date)
    ORDER BY month ASC
  `, [ADS_ACCOUNT]);
  return res.status(200).json({ ok: true, rows });
}

async function handleDataQuality(client, res) {
  const [gscQ, adsQ] = await Promise.all([
    client.query(`
      SELECT
        MIN(date)                AS earliest,
        MAX(date)                AS latest,
        COUNT(DISTINCT date)::int AS total_days
      FROM google_search_console.overview
      WHERE sub_source = $1 AND search_type = 'web'
    `, [GSC_SUB_SOURCE]),
    client.query(`
      SELECT
        MIN(cp.date) AS earliest,
        MAX(cp.date) AS latest
      FROM google_ads.campaign_performance cp
      JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
      WHERE c.account_id = $1
    `, [ADS_ACCOUNT]),
  ]);
  return res.status(200).json({
    ok: true,
    sources: {
      semrush: {
        status: 'static_csv',
        coverage: 'Jul 2023 – Jun 2026',
        months: 36,
        note: 'Loaded from master dataset CSV. Updated manually when new export is available.'
      },
      gsc: {
        status: 'live',
        earliest: gscQ.rows[0].earliest,
        latest: gscQ.rows[0].latest,
        total_days: gscQ.rows[0].total_days,
        note: 'PostgreSQL GSC pipeline. Clicks ≈ 50% of true GSC console totals — use for trend analysis only.'
      },
      google_ads: {
        status: 'live',
        earliest: adsQ.rows[0].earliest,
        latest: adsQ.rows[0].latest,
        account_id: ADS_ACCOUNT,
        note: 'UK account (GBP). Cost column is already in GBP, not micros.'
      },
      ga4: {
        status: 'limited',
        coverage: 'Mar–Apr 2026 aggregate exports only',
        note: 'Not reliable for monthly KPIs. Included in CSV only.'
      },
      shopify: {
        status: 'unavailable',
        note: 'MCP connection failed. Organic revenue data not available.'
      }
    }
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const type = (req.query.type || '').trim();
  const DB_URL = process.env.DATABASE_URL;
  if (!DB_URL) return res.status(500).json({ ok: false, cause: 'no_db_url', error: 'DATABASE_URL not set' });

  const client = makeClient(DB_URL, 30000);
  try {
    await client.connect();
    switch (type) {
      case 'gsc-monthly':   return await handleGscMonthly(client, res);
      case 'position-dist': return await handlePositionDist(client, res);
      case 'ads-monthly':   return await handleAdsMonthly(client, res);
      case 'data-quality':  return await handleDataQuality(client, res);
      default: return res.status(400).json({ ok: false, error: `Unknown type: "${type}". Valid: gsc-monthly, position-dist, ads-monthly, data-quality` });
    }
  } catch (err) {
    return errResponse(res, err);
  } finally {
    try { await client.end(); } catch (_) {}
  }
};
