// Sonya Req5 — Stop Waste Spend
// Sources: google_ads.campaign_performance + asset_performance + pmax_campaign_search_term_data + campaigns
// Wasteful assets: L90d, cost>3, clicks>2, conversions=0 (Sonya campaigns)
// Neg keywords: L90d, clicks>5, conversions=0 (Sonya campaigns)
// Campaign overview: L30 / prev30 / prev60-90

const { Client } = require('pg');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, cause: 'missing_env', error: 'DATABASE_URL not configured' });

  const client = new Client({ connectionString: connStr, ssl: false, connectionTimeoutMillis: 15000, statement_timeout: 30000 });

  try {
    await client.connect();

    // Resolve date window from MAX(date)
    const { rows: dateRows } = await client.query(`SELECT MAX(date) AS latest FROM google_ads.campaign_performance`);
    const latest = new Date(dateRows[0].latest);
    const toDate = latest.toISOString().slice(0, 10);
    const fmt = d => d.toISOString().slice(0, 10);

    const l30End   = new Date(latest);
    const l30Start = new Date(latest); l30Start.setDate(l30Start.getDate() - 29);
    const p30End   = new Date(l30Start); p30End.setDate(p30End.getDate() - 1);
    const p30Start = new Date(p30End);   p30Start.setDate(p30Start.getDate() - 29);
    const p60Start = new Date(p30End);   p60Start.setDate(p60Start.getDate() - 30);
    const d90Start = new Date(latest);   d90Start.setDate(d90Start.getDate() - 89);

    const w = {
      l30_from: fmt(l30Start), l30_to: toDate,
      p30_from: fmt(p30Start), p30_to: fmt(p30End),
      p60_from: fmt(p60Start), p60_to: fmt(p30End),
      d90_from: fmt(d90Start), d90_to: toDate,
    };

    // Campaign overview (3 periods)
    const { rows: campRows } = await client.query(`
      SELECT
        cp.campaign_id,
        c.campaign_name,
        c.budget,
        c.campaign_status,
        -- L30
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.cost             ELSE 0 END)::numeric,2) AS cost30,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversions      ELSE 0 END)::numeric,2) AS conv30,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS cv30,
        SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.impressions ELSE 0 END)                        AS imp30,
        SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.clicks      ELSE 0 END)                        AS clk30,
        -- Prev 30
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.cost             ELSE 0 END)::numeric,2) AS cost60,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversions      ELSE 0 END)::numeric,2) AS conv60,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS cv60,
        -- Prev 60-90
        ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.cost             ELSE 0 END)::numeric,2) AS cost90,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.conversions      ELSE 0 END)::numeric,2) AS conv90,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS cv90
      FROM google_ads.campaign_performance cp
      JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
      WHERE (c.campaign_name ILIKE '%Sonya%' OR cp.campaign_id = 20810136438)
        AND cp.date BETWEEN $7 AND $2
      GROUP BY cp.campaign_id, c.campaign_name, c.budget, c.campaign_status
      ORDER BY cost30 DESC NULLS LAST
    `, [w.l30_from, w.l30_to, w.p30_from, w.p30_to, w.p60_from, w.p60_to, w.d90_from]);

    // Wasteful assets — wrapped in try/catch so schema differences don't kill the whole response
    let assetsByCamp = {};
    try {
      const { rows: assetRows } = await client.query(`
        SELECT
          ap.campaign_id::text AS campaign_id,
          ap.asset_id::text AS asset_id,
          ROUND(SUM(ap.cost)::numeric,2) AS cost,
          SUM(ap.clicks) AS clicks
        FROM google_ads.asset_performance ap
        JOIN google_ads.campaigns c ON c.campaign_id::text = ap.campaign_id::text
        WHERE (c.campaign_name ILIKE '%Sonya%' OR c.campaign_id = 20810136438)
          AND ap.date BETWEEN $1 AND $2
          AND ap.conversions < 0.001
        GROUP BY ap.campaign_id, ap.asset_id
        HAVING SUM(ap.cost) > 3 AND SUM(ap.clicks) > 2
        ORDER BY SUM(ap.cost) DESC
      `, [w.d90_from, w.d90_to]);
      assetRows.forEach(a => {
        if (!assetsByCamp[a.campaign_id]) assetsByCamp[a.campaign_id] = [];
        assetsByCamp[a.campaign_id].push({ asset_id: a.asset_id, cost: Number(a.cost), clicks: Number(a.clicks) });
      });
    } catch (assetErr) {
      console.error('asset_performance query failed:', assetErr.message);
    }

    // Neg keyword candidates — wrapped in try/catch
    let kwByCamp = {};
    try {
      const { rows: kwRows } = await client.query(`
        SELECT
          st.campaign_id::text AS campaign_id,
          st.search_term,
          SUM(st.clicks) AS clicks,
          ROUND(SUM(st.cost)::numeric,2) AS cost
        FROM google_ads.pmax_campaign_search_term_data st
        JOIN google_ads.campaigns c ON c.campaign_id::text = st.campaign_id::text
        WHERE (c.campaign_name ILIKE '%Sonya%' OR c.campaign_id = 20810136438)
          AND st.date BETWEEN $1 AND $2
          AND st.conversions < 0.001
        GROUP BY st.campaign_id, st.search_term
        HAVING SUM(st.clicks) > 5
        ORDER BY SUM(st.clicks) DESC
      `, [w.d90_from, w.d90_to]);
      kwRows.forEach(k => {
        if (!kwByCamp[k.campaign_id]) kwByCamp[k.campaign_id] = [];
        kwByCamp[k.campaign_id].push(k.search_term);
      });
    } catch (kwErr) {
      console.error('pmax_campaign_search_term_data query failed:', kwErr.message);
    }

    const campaigns = campRows.map(r => ({
      name:   r.campaign_name,
      id:     String(r.campaign_id),
      budget: r.budget ? Number(r.budget) : null,
      status: r.campaign_status,
      cost30: Number(r.cost30), conv30: Number(r.conv30), cv30: Number(r.cv30),
      imp30:  Number(r.imp30),  clk30:  Number(r.clk30),
      cost60: Number(r.cost60), conv60: Number(r.conv60), cv60: Number(r.cv60),
      cost90: Number(r.cost90), conv90: Number(r.conv90), cv90: Number(r.cv90),
      wasteful_assets: assetsByCamp[String(r.campaign_id)] || [],
      neg_keywords:    kwByCamp[String(r.campaign_id)] || [],
      geo_excludes:    [],
    }));

    return res.status(200).json({ ok: true, meta: w, campaigns });

  } catch (err) {
    const msg = err.message || '';
    let cause = 'unknown';
    if (/timeout|ETIMEDOUT|ECONNREFUSED/i.test(msg)) cause = 'network_timeout';
    else if (/password|authentication/i.test(msg)) cause = 'authentication';
    return res.status(500).json({ ok: false, cause, error: msg });
  } finally {
    await client.end().catch(() => {});
  }
};
