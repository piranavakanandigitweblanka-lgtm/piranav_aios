const { Client } = require('pg');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, error: 'DATABASE_URL not configured' });

  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    statement_timeout: 55000,
  });

  try {
    await client.connect();

    const { rows } = await client.query(`
      WITH stock AS (
        SELECT p.sku, SUM(licsl.stock)::int AS st
        FROM inventory.products p
        JOIN inventory.local_inventory_current_stock_location_wise licsl
          ON licsl.inventory_id = p.id
        WHERE licsl.warehouse_location = 'Germany' AND licsl.stock > 0
        GROUP BY p.sku
      ),
      raw_amz AS (
        SELECT DISTINCT
          CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END AS base
        FROM listings.amazon_listings
        WHERE site = 'Germany' AND sku IS NOT NULL AND sku != ''
      ),
      amz_coverage AS (
        SELECT DISTINCT array_to_string(parts[1:n], '+') AS covered_sku
        FROM (
          SELECT base, string_to_array(base, '+') AS parts,
                 generate_series(1, array_length(string_to_array(base, '+'), 1)) AS n
          FROM raw_amz
        ) x
      ),
      raw_ebay AS (
        SELECT DISTINCT
          CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END AS base
        FROM listings.ebay_listings
        WHERE site = 'Germany' AND all_list = 1 AND sku IS NOT NULL AND sku != ''
      ),
      ebay_coverage AS (
        SELECT DISTINCT array_to_string(parts[1:n], '+') AS covered_sku
        FROM (
          SELECT base, string_to_array(base, '+') AS parts,
                 generate_series(1, array_length(string_to_array(base, '+'), 1)) AS n
          FROM raw_ebay
        ) x
      ),
      raw_shop AS (
        SELECT DISTINCT
          CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END AS base
        FROM listings.shopify_listings
        WHERE site = 'Germany' AND all_list = 1 AND sku IS NOT NULL AND sku != ''
      ),
      shop_coverage AS (
        SELECT DISTINCT array_to_string(parts[1:n], '+') AS covered_sku
        FROM (
          SELECT base, string_to_array(base, '+') AS parts,
                 generate_series(1, array_length(string_to_array(base, '+'), 1)) AS n
          FROM raw_shop
        ) x
      )
      SELECT
        s.sku AS s, s.st,
        MAX(CASE WHEN ac.covered_sku IS NOT NULL THEN 1 ELSE 0 END)::int AS a,
        MAX(CASE WHEN ec.covered_sku IS NOT NULL THEN 1 ELSE 0 END)::int AS e,
        MAX(CASE WHEN sc.covered_sku IS NOT NULL THEN 1 ELSE 0 END)::int AS sh
      FROM stock s
      LEFT JOIN amz_coverage  ac ON ac.covered_sku = s.sku
      LEFT JOIN ebay_coverage ec ON ec.covered_sku = s.sku
      LEFT JOIN shop_coverage sc ON sc.covered_sku = s.sku
      GROUP BY s.sku, s.st
      ORDER BY s.st DESC
    `);

    const total          = rows.length;
    const notAnywhere    = rows.filter(r => !r.a && !r.e && !r.sh).length;
    const missingAmazon  = rows.filter(r => !r.a).length;
    const missingEbay    = rows.filter(r => !r.e).length;
    const missingShopify = rows.filter(r => !r.sh).length;
    const allThree       = rows.filter(r => r.a && r.e && r.sh).length;

    if (req.query.debug) {
      const dsku = req.query.debug;
      const drow = rows.find(r => r.s === dsku);
      return res.status(200).json({ ok: true, debug_sku: dsku, result: drow || null });
    }

    return res.status(200).json({
      ok: true,
      refreshed_at: new Date().toISOString(),
      summary: { total, notAnywhere, missingAmazon, missingEbay, missingShopify, allThree },
      rows,
    });

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    await client.end().catch(() => {});
  }
};
