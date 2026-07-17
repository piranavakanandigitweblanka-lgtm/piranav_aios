// Sonya Req2 — Live Product-Level Google Ads Performance
// Source: google_ads.product_performance + google_ads.campaigns + google_ads.merchant_products
// Read-only. Accepts ?from=YYYY-MM-DD&to=YYYY-MM-DD (defaults to last 60 days)

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
    ssl: false,
    connectionTimeoutMillis: 15000,
    statement_timeout: 20000,
  });

  try {
    await client.connect();

    // Resolve date window
    let fromDate, toDate;
    if (req.query.from && req.query.to) {
      fromDate = req.query.from;
      toDate   = req.query.to;
    } else {
      const { rows } = await client.query(
        `SELECT MAX(date) AS latest FROM google_ads.product_performance`
      );
      const d = new Date(rows[0].latest);
      toDate   = d.toISOString().slice(0, 10);
      const f  = new Date(d); f.setDate(f.getDate() - 59);
      fromDate = f.toISOString().slice(0, 10);
    }

    const { rows } = await client.query(`
      SELECT
        pp.product_item_id,
        pp.parent_id,
        mp.title,
        mp.image_link,
        mp.link,
        mp.price,
        mp.availability,
        mp.mpn AS sku,
        SUM(pp.impressions)                          AS impressions,
        SUM(pp.clicks)                               AS clicks,
        ROUND(SUM(pp.cost)::numeric, 2)              AS cost,
        ROUND(SUM(pp.conversions)::numeric, 4)       AS conversions,
        ROUND(SUM(pp.conversion_value)::numeric, 2)  AS conversion_value
      FROM google_ads.product_performance pp
      JOIN google_ads.campaigns c ON c.campaign_id = pp.campaign_id
      LEFT JOIN google_ads.merchant_products mp
        ON LOWER(mp.product_id) = LOWER(pp.product_item_id)
      WHERE (c.campaign_name ILIKE '%Sonya%' OR pp.campaign_id = 20810136438)
        AND pp.date BETWEEN $1 AND $2
        AND pp.product_item_id != ''
      GROUP BY
        pp.product_item_id, pp.parent_id,
        mp.title, mp.image_link, mp.link, mp.price, mp.availability, mp.mpn
      ORDER BY cost DESC
    `, [fromDate, toDate]);

    const products = rows.map(r => ({
      id:           r.product_item_id,
      parent_id:    r.parent_id,
      title:        r.title   || null,
      img:          r.image_link || null,
      url:          r.link    || null,
      price:        r.price   ? Number(r.price) : null,
      availability: r.availability || null,
      sku:          r.sku     || null,
      imp:          Number(r.impressions),
      clk:          Number(r.clicks),
      cost:         Number(r.cost),
      conv:         Number(r.conversions),
      cv:           Number(r.conversion_value),
    }));

    return res.status(200).json({
      ok: true,
      meta: { from: fromDate, to: toDate, total: products.length },
      products,
    });

  } catch (err) {
    const msg = err.message || '';
    let cause = 'unknown';
    if (/timeout|ETIMEDOUT|ECONNREFUSED/i.test(msg)) cause = 'network_timeout';
    else if (/password|authentication/i.test(msg))   cause = 'authentication';
    return res.status(500).json({ ok: false, cause, error: msg });
  } finally {
    await client.end().catch(() => {});
  }
};
