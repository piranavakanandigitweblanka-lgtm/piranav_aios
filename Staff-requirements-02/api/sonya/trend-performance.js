// Sonya Req3 — Live Trend & Segment (variant-level, L vs BL comparison)
// Source: google_ads.product_performance + google_ads.campaigns + google_ads.merchant_products
// Accepts ?from=YYYY-MM-DD&to=YYYY-MM-DD (defaults to last 30 days from MAX date)

const { Client } = require('pg');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, cause: 'missing_env', error: 'DATABASE_URL not configured' });

  const client = new Client({ connectionString: connStr, ssl: false, connectionTimeoutMillis: 15000, statement_timeout: 25000 });

  try {
    await client.connect();

    let fromDate, toDate;
    if (req.query.from && req.query.to) {
      fromDate = req.query.from;
      toDate   = req.query.to;
    } else {
      const { rows } = await client.query(`SELECT MAX(date) AS latest FROM google_ads.product_performance`);
      const d = new Date(rows[0].latest);
      toDate   = d.toISOString().slice(0, 10);
      const f  = new Date(d); f.setDate(f.getDate() - 29);
      fromDate = f.toISOString().slice(0, 10);
    }

    // Before-last window: same span immediately before fromDate
    const spanMs  = new Date(toDate) - new Date(fromDate);
    const spanDays = Math.round(spanMs / 86400000);
    const blEnd   = new Date(fromDate); blEnd.setDate(blEnd.getDate() - 1);
    const blStart = new Date(blEnd);    blStart.setDate(blStart.getDate() - spanDays);
    const fmt = d => d.toISOString().slice(0, 10);
    const blFrom = fmt(blStart), blTo = fmt(blEnd);

    // Step 1 — aggregate both periods in one query
    const { rows: perfRows } = await client.query(`
      SELECT
        pp.product_item_id,
        pp.parent_id,
        -- L period
        SUM(CASE WHEN pp.date BETWEEN $1 AND $2 THEN pp.impressions  ELSE 0 END) AS l_imp,
        SUM(CASE WHEN pp.date BETWEEN $1 AND $2 THEN pp.clicks       ELSE 0 END) AS l_clk,
        ROUND(SUM(CASE WHEN pp.date BETWEEN $1 AND $2 THEN pp.cost             ELSE 0 END)::numeric,2) AS l_cost,
        ROUND(SUM(CASE WHEN pp.date BETWEEN $1 AND $2 THEN pp.conversions      ELSE 0 END)::numeric,4) AS l_conv,
        ROUND(SUM(CASE WHEN pp.date BETWEEN $1 AND $2 THEN pp.conversion_value ELSE 0 END)::numeric,2) AS l_cv,
        -- BL period
        SUM(CASE WHEN pp.date BETWEEN $3 AND $4 THEN pp.impressions  ELSE 0 END) AS bl_imp,
        SUM(CASE WHEN pp.date BETWEEN $3 AND $4 THEN pp.clicks       ELSE 0 END) AS bl_clk,
        ROUND(SUM(CASE WHEN pp.date BETWEEN $3 AND $4 THEN pp.cost             ELSE 0 END)::numeric,2) AS bl_cost,
        ROUND(SUM(CASE WHEN pp.date BETWEEN $3 AND $4 THEN pp.conversions      ELSE 0 END)::numeric,4) AS bl_conv,
        ROUND(SUM(CASE WHEN pp.date BETWEEN $3 AND $4 THEN pp.conversion_value ELSE 0 END)::numeric,2) AS bl_cv
      FROM google_ads.product_performance pp
      JOIN google_ads.campaigns c ON c.campaign_id = pp.campaign_id
      WHERE (c.campaign_name ILIKE '%Sonya%' OR pp.campaign_id = 20810136438)
        AND pp.date BETWEEN $3 AND $2
        AND pp.product_item_id != ''
      GROUP BY pp.product_item_id, pp.parent_id
      ORDER BY l_cost DESC, bl_cost DESC
      LIMIT 3000
    `, [fromDate, toDate, blFrom, blTo]);

    // Step 2 — fetch metadata
    const ids = perfRows.map(r => r.product_item_id.toLowerCase());
    const { rows: metaRows } = await client.query(`
      SELECT product_id, mpn AS sku
      FROM google_ads.merchant_products
      WHERE LOWER(product_id) = ANY($1::text[])
    `, [ids]);
    const metaMap = {};
    metaRows.forEach(m => { metaMap[m.product_id.toLowerCase()] = m; });

    const products = perfRows.map(r => {
      const meta = metaMap[r.product_item_id.toLowerCase()] || {};
      const li = (n) => Number(n) || 0;

      const l_imp = li(r.l_imp), l_clk = li(r.l_clk), l_cost = li(r.l_cost), l_conv = li(r.l_conv), l_cv = li(r.l_cv);
      const bl_cv = li(r.bl_cv);

      const l_ctr  = l_imp  > 0 ? Math.round(l_clk / l_imp  * 10000) / 100 : 0;
      const l_cvr  = l_clk  > 0 ? Math.round(l_conv / l_clk * 10000) / 100 : 0;
      const l_roas = l_cost > 0 ? Math.round(l_cv   / l_cost * 10000) / 100 : 0;

      const bl_imp = li(r.bl_imp), bl_clk = li(r.bl_clk), bl_cost = li(r.bl_cost), bl_conv = li(r.bl_conv);
      const bl_ctr  = bl_imp  > 0 ? Math.round(bl_clk / bl_imp  * 10000) / 100 : 0;
      const bl_cvr  = bl_clk  > 0 ? Math.round(bl_conv / bl_clk * 10000) / 100 : 0;
      const bl_roas = bl_cost > 0 ? Math.round(bl_cv   / bl_cost * 10000) / 100 : 0;

      let trend = 'None';
      if (bl_cv > 0) {
        if (l_cv > bl_cv * 1.1) trend = 'Seasonal';
        else if (l_cv < bl_cv * 0.7) trend = 'Drop-off';
      }

      return {
        id:        r.product_item_id,
        parent_id: r.parent_id,
        sku:       meta.sku || null,
        trend,
        l:  { imp: l_imp,  clk: l_clk,  cost: l_cost,  conv: l_conv,  cv: l_cv,  ctr: l_ctr,  cvr: l_cvr,  roas: l_roas  },
        bl: { imp: bl_imp, clk: bl_clk, cost: bl_cost, conv: bl_conv, cv: bl_cv, ctr: bl_ctr, cvr: bl_cvr, roas: bl_roas },
      };
    });

    return res.status(200).json({
      ok: true,
      meta: { from: fromDate, to: toDate, bl_from: blFrom, bl_to: blTo, total: products.length },
      products,
    });

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
