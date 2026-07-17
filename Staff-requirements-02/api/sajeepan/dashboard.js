// Sajeepan Req1 — Live Google Ads PMax Dashboard
// Returns: campaigns (L + prev period), daily trend, top products
// Source: google_ads.campaign_performance + product_performance + merchant_products
// Filter: 6 Sajeepan campaign IDs
// Accepts: ?from=YYYY-MM-DD&to=YYYY-MM-DD (defaults to last 30 days from MAX date)

const { Client } = require('pg');

const SJ_CAMPAIGN_IDS = [21069663519, 23110323532, 23516313256, 23590572906, 22079334413, 21242723265];

// Target ROAS per campaign (not stored in DB)
const TARGET_ROAS = {
  '21069663519': 320,
  '23110323532': 320,
  '23516313256': 400,
  '23590572906': 400,
  '22079334413': 380,
  '21242723265': 380,
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, error: 'DATABASE_URL not configured' });

  const client = new Client({ connectionString: connStr, ssl: false, connectionTimeoutMillis: 15000, statement_timeout: 30000 });

  try {
    await client.connect();

    // Resolve date window
    let fromDate, toDate;
    if (req.query.from && req.query.to) {
      fromDate = req.query.from;
      toDate   = req.query.to;
    } else {
      const { rows } = await client.query(`SELECT MAX(date) AS latest FROM google_ads.campaign_performance WHERE campaign_id = ANY($1::bigint[])`, [SJ_CAMPAIGN_IDS]);
      const d = new Date(rows[0].latest);
      toDate   = d.toISOString().slice(0, 10);
      const f  = new Date(d); f.setDate(f.getDate() - 29);
      fromDate = f.toISOString().slice(0, 10);
    }

    // Prev period: same span immediately before fromDate
    const spanDays = Math.round((new Date(toDate) - new Date(fromDate)) / 86400000);
    const prevEnd  = new Date(fromDate); prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd); prevStart.setDate(prevStart.getDate() - spanDays);
    const fmt = d => d.toISOString().slice(0, 10);
    const prevFrom = fmt(prevStart), prevTo = fmt(prevEnd);

    // ── 1. Campaign overview (L + prev) ──────────────────────────────────
    const { rows: campRows } = await client.query(`
      SELECT
        cp.campaign_id,
        c.campaign_name,
        c.budget,
        c.campaign_status,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.cost             ELSE 0 END)::numeric,2) AS cost_l,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversions      ELSE 0 END)::numeric,2) AS conv_l,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS cv_l,
        SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.impressions ELSE 0 END) AS imp_l,
        SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.clicks      ELSE 0 END) AS clk_l,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.cost             ELSE 0 END)::numeric,2) AS cost_p,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversions      ELSE 0 END)::numeric,2) AS conv_p,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS cv_p,
        SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.impressions ELSE 0 END) AS imp_p,
        SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.clicks      ELSE 0 END) AS clk_p
      FROM google_ads.campaign_performance cp
      JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
      WHERE cp.campaign_id = ANY($5::bigint[])
        AND cp.date BETWEEN $3 AND $2
      GROUP BY cp.campaign_id, c.campaign_name, c.budget, c.campaign_status
      ORDER BY cost_l DESC NULLS LAST
    `, [fromDate, toDate, prevFrom, prevTo, SJ_CAMPAIGN_IDS]);

    // ── 2. Daily trend ────────────────────────────────────────────────────
    const { rows: trendRows } = await client.query(`
      SELECT
        date,
        ROUND(SUM(cost)::numeric,2)              AS cost,
        ROUND(SUM(conversion_value)::numeric,2)  AS cv,
        ROUND(SUM(conversions)::numeric,2)       AS conv
      FROM google_ads.campaign_performance
      WHERE campaign_id = ANY($1::bigint[])
        AND date BETWEEN $2 AND $3
      GROUP BY date
      ORDER BY date ASC
    `, [SJ_CAMPAIGN_IDS, fromDate, toDate]);

    // ── 3. Product performance (two-step) ─────────────────────────────────
    const { rows: perfRows } = await client.query(`
      SELECT
        pp.product_item_id,
        pp.campaign_id::text AS campaign_id,
        SUM(pp.impressions)                          AS imp,
        SUM(pp.clicks)                               AS clk,
        ROUND(SUM(pp.cost)::numeric,2)               AS cost,
        ROUND(SUM(pp.conversions)::numeric,4)        AS conv,
        ROUND(SUM(pp.conversion_value)::numeric,2)   AS cv
      FROM google_ads.product_performance pp
      WHERE pp.campaign_id = ANY($1::bigint[])
        AND pp.date BETWEEN $2 AND $3
        AND pp.product_item_id != ''
      GROUP BY pp.product_item_id, pp.campaign_id
      ORDER BY cv DESC
      LIMIT 500
    `, [SJ_CAMPAIGN_IDS, fromDate, toDate]);

    // Step 2 — metadata lookup
    const ids = perfRows.map(r => r.product_item_id.toLowerCase());
    let metaMap = {};
    if (ids.length > 0) {
      const { rows: metaRows } = await client.query(`
        SELECT DISTINCT ON (LOWER(product_id))
          product_id, title, image_link, link, price, availability, brand, mpn AS sku
        FROM google_ads.merchant_products
        WHERE LOWER(product_id) = ANY($1::text[])
        ORDER BY LOWER(product_id)
      `, [ids]);
      metaRows.forEach(m => { metaMap[m.product_id.toLowerCase()] = m; });
    }

    // Build response
    const n = v => Number(v) || 0;

    const campaigns = campRows.map(r => {
      const cost_l = n(r.cost_l), cv_l = n(r.cv_l), conv_l = n(r.conv_l);
      const imp_l  = n(r.imp_l),  clk_l = n(r.clk_l);
      const cost_p = n(r.cost_p), cv_p  = n(r.cv_p),  conv_p = n(r.conv_p);
      const roas_l = cost_l > 0 ? Math.round(cv_l / cost_l * 10000) / 100 : 0;
      const roas_p = cost_p > 0 ? Math.round(cv_p / cost_p * 10000) / 100 : 0;
      const id = String(r.campaign_id);
      return {
        id,
        name:       r.campaign_name,
        status:     r.campaign_status,
        budget:     r.budget ? Number(r.budget) : null,
        target_roas: TARGET_ROAS[id] || 300,
        l:   { cost: cost_l, cv: cv_l, conv: conv_l, imp: imp_l, clk: clk_l, roas: roas_l },
        prev:{ cost: cost_p, cv: cv_p,  conv: conv_p, roas: roas_p },
      };
    });

    const trend = trendRows.map(r => ({
      d:    r.date.toISOString().slice(5, 10).replace('-', '/'),  // MM/DD
      cost: n(r.cost),
      cv:   n(r.cv),
      conv: n(r.conv),
      roas: n(r.cost) > 0 ? Math.round(n(r.cv) / n(r.cost) * 10000) / 100 : 0,
    }));

    const products = perfRows.map(r => {
      const meta = metaMap[r.product_item_id.toLowerCase()] || {};
      const cost = n(r.cost), cv = n(r.cv), conv = n(r.conv), imp = n(r.imp), clk = n(r.clk);
      const roas = cost > 0 ? Math.round(cv / cost * 10000) / 100 : 0;
      return {
        item:  r.product_item_id,
        cid:   r.campaign_id,
        cost, cv, conv,
        imps:  imp,
        clicks: clk,
        roas,
        title: meta.title        || `Product #${r.product_item_id.split('_').pop()}`,
        img:   meta.image_link   || '',
        url:   meta.link         || '',
        price: meta.price        ? Number(meta.price) : null,
        avail: meta.availability || 'unknown',
        brand: meta.brand        || 'LEDSone',
        type:  'Lighting',
        sku:   meta.sku          || null,
      };
    });

    return res.status(200).json({
      ok: true,
      meta: { from: fromDate, to: toDate, prev_from: prevFrom, prev_to: prevTo, total_products: products.length },
      campaigns,
      trend,
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
