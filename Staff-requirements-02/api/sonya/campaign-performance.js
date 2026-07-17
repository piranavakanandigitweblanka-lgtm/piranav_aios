// Sonya Req1 — Live Google Ads Campaign Performance
// Source: google_ads.campaign_performance + google_ads.campaigns
// Read-only. Accepts ?from=YYYY-MM-DD&to=YYYY-MM-DD
// Defaults to last 30 days from MAX(date) in DB if no params given.

const { Client } = require('pg');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) {
    return res.status(500).json({ ok: false, cause: 'missing_env', error: 'DATABASE_URL not configured' });
  }

  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    statement_timeout: 12000,
  });

  try {
    await client.connect();

    // Resolve date window — use query params if provided, else roll from MAX(date)
    let fromDate, toDate;
    if (req.query.from && req.query.to) {
      fromDate = req.query.from;
      toDate   = req.query.to;
    } else {
      const { rows } = await client.query(
        `SELECT MAX(date) AS latest FROM google_ads.campaign_performance`
      );
      const latest = rows[0].latest;
      if (!latest) throw new Error('No data in google_ads.campaign_performance');
      const d = new Date(latest);
      toDate   = d.toISOString().slice(0, 10);
      const f  = new Date(d); f.setDate(f.getDate() - 29);
      fromDate = f.toISOString().slice(0, 10);
    }

    // Before-last window: same span immediately before fromDate
    const span   = (new Date(toDate) - new Date(fromDate)) / 86400000; // days
    const blEnd  = new Date(fromDate); blEnd.setDate(blEnd.getDate() - 1);
    const blStart= new Date(blEnd);    blStart.setDate(blStart.getDate() - span);

    // Extended windows always from toDate backwards
    const d60Start = new Date(toDate); d60Start.setDate(d60Start.getDate() - 59);
    const d90Start = new Date(toDate); d90Start.setDate(d90Start.getDate() - 89);

    const fmt = d => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);

    const w = {
      l_from:   fromDate,
      l_to:     toDate,
      bl_from:  fmt(blStart),
      bl_to:    fmt(blEnd),
      d60_from: fmt(d60Start),
      d60_to:   toDate,
      d90_from: fmt(d90Start),
      d90_to:   toDate,
    };

    const { rows: campaigns } = await client.query(`
      SELECT
        cp.campaign_id,
        c.campaign_name,
        c.budget,
        c.campaign_status,

        -- Main window (L)
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.cost             ELSE 0 END)::numeric, 2) AS l_cost,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversions      ELSE 0 END)::numeric, 4) AS l_conv,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversion_value ELSE 0 END)::numeric, 2) AS l_cv,
        COUNT(DISTINCT CASE WHEN cp.date BETWEEN $1 AND $2 AND cp.cost > 0 THEN cp.date END)            AS l_days,

        -- Before Last (BL)
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.cost             ELSE 0 END)::numeric, 2) AS bl_cost,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversions      ELSE 0 END)::numeric, 4) AS bl_conv,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversion_value ELSE 0 END)::numeric, 2) AS bl_cv,

        -- Last 60 Days (D60)
        ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.cost             ELSE 0 END)::numeric, 2) AS d60_cost,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.conversions      ELSE 0 END)::numeric, 4) AS d60_conv,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.conversion_value ELSE 0 END)::numeric, 2) AS d60_cv,

        -- Last 90 Days (D90)
        ROUND(SUM(CASE WHEN cp.date BETWEEN $7 AND $8 THEN cp.cost             ELSE 0 END)::numeric, 2) AS d90_cost,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $7 AND $8 THEN cp.conversions      ELSE 0 END)::numeric, 4) AS d90_conv,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $7 AND $8 THEN cp.conversion_value ELSE 0 END)::numeric, 2) AS d90_cv

      FROM google_ads.campaign_performance cp
      JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
      WHERE (c.campaign_name ILIKE '%Sonya%' OR cp.campaign_id = 20810136438)
        AND cp.date BETWEEN $7 AND $8
      GROUP BY cp.campaign_id, c.campaign_name, c.budget, c.campaign_status
      ORDER BY l_cost DESC NULLS LAST
    `, [w.l_from, w.l_to, w.bl_from, w.bl_to, w.d60_from, w.d60_to, w.d90_from, w.d90_to]);

    const roas = (cost, cv) => Number(cost) > 0
      ? Math.round((Number(cv) / Number(cost)) * 10000) / 100
      : 0;

    const result = campaigns.map(r => ({
      id:     String(r.campaign_id),
      name:   r.campaign_name,
      budget: r.budget ? Number(r.budget) : null,
      status: r.campaign_status,
      days:   Number(r.l_days),
      l:   { cost: Number(r.l_cost),   conv: Number(r.l_conv),   cv: Number(r.l_cv),   roas: roas(r.l_cost,   r.l_cv)   },
      bl:  { cost: Number(r.bl_cost),  conv: Number(r.bl_conv),  cv: Number(r.bl_cv),  roas: roas(r.bl_cost,  r.bl_cv)  },
      d60: { cost: Number(r.d60_cost), conv: Number(r.d60_conv), cv: Number(r.d60_cv), roas: roas(r.d60_cost, r.d60_cv) },
      d90: { cost: Number(r.d90_cost), conv: Number(r.d90_conv), cv: Number(r.d90_cv), roas: roas(r.d90_cost, r.d90_cv) },
    }));

    return res.status(200).json({
      ok: true,
      meta: { ...w, total: result.length, active: result.filter(c => c.l.cost > 0).length },
      campaigns: result,
    });

  } catch (err) {
    const msg = err.message || '';
    let cause = 'unknown';
    if (/password|authentication|SASL/i.test(msg))               cause = 'authentication';
    else if (/timeout|ETIMEDOUT|ECONNREFUSED|ENOTFOUND/i.test(msg)) cause = 'network_timeout';
    else if (/ssl|TLS/i.test(msg))                               cause = 'ssl';
    else if (/permission denied/i.test(msg))                     cause = 'missing_permissions';
    return res.status(500).json({ ok: false, cause, error: msg });
  } finally {
    await client.end().catch(() => {});
  }
};
