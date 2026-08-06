const { Client } = require('pg');

const EBAY_ACCOUNTS = [
  { id: 1,   name: 'led_sone' },
  { id: 4,   name: 'sunsone' },
  { id: 22,  name: 'electricalsone' },
  { id: 27,  name: 'ledsonede' },
  { id: 28,  name: 'huettenlampen' },
  { id: 222, name: 'homin_gmbh' },
];

function ebayAccountCTEs(id) {
  return `
  raw_ebay_${id} AS (
    SELECT DISTINCT CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END AS base
    FROM listings.ebay_listings
    WHERE site = 'Germany' AND all_list = 1 AND sub_source = ${id} AND sku IS NOT NULL AND sku != ''
  ),
  ecov_${id} AS (
    SELECT DISTINCT unnest(string_to_array(base, '+')) AS covered_sku FROM raw_ebay_${id}
    UNION
    SELECT DISTINCT array_to_string(parts[1:n], '+') AS covered_sku
    FROM (SELECT base, string_to_array(base,'+') AS parts, generate_series(1,array_length(string_to_array(base,'+'),1)) AS n FROM raw_ebay_${id}) x
  )`;
}

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
        JOIN inventory.local_inventory_current_stock_location_wise licsl ON licsl.inventory_id = p.id
        WHERE licsl.warehouse_location = 'Germany' AND licsl.stock > 0
        GROUP BY p.sku
      ),
      raw_amz AS (
        SELECT DISTINCT CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END AS base
        FROM listings.amazon_listings WHERE site = 'Germany' AND sku IS NOT NULL AND sku != ''
      ),
      amz_coverage AS (
        SELECT DISTINCT unnest(string_to_array(base, '+')) AS covered_sku FROM raw_amz
        UNION
        SELECT DISTINCT array_to_string(parts[1:n], '+') AS covered_sku
        FROM (SELECT base, string_to_array(base,'+') AS parts, generate_series(1,array_length(string_to_array(base,'+'),1)) AS n FROM raw_amz) x
      ),
      raw_ebay AS (
        SELECT DISTINCT CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END AS base
        FROM listings.ebay_listings WHERE site = 'Germany' AND all_list = 1 AND sku IS NOT NULL AND sku != ''
      ),
      ebay_coverage AS (
        SELECT DISTINCT unnest(string_to_array(base, '+')) AS covered_sku FROM raw_ebay
        UNION
        SELECT DISTINCT array_to_string(parts[1:n], '+') AS covered_sku
        FROM (SELECT base, string_to_array(base,'+') AS parts, generate_series(1,array_length(string_to_array(base,'+'),1)) AS n FROM raw_ebay) x
      ),
      raw_shop AS (
        SELECT DISTINCT CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END AS base
        FROM listings.shopify_listings WHERE site = 'Germany' AND all_list = 1 AND sku IS NOT NULL AND sku != ''
      ),
      shop_coverage AS (
        SELECT DISTINCT unnest(string_to_array(base, '+')) AS covered_sku FROM raw_shop
        UNION
        SELECT DISTINCT array_to_string(parts[1:n], '+') AS covered_sku
        FROM (SELECT base, string_to_array(base,'+') AS parts, generate_series(1,array_length(string_to_array(base,'+'),1)) AS n FROM raw_shop) x
      ),
      ${EBAY_ACCOUNTS.map(acc => ebayAccountCTEs(acc.id)).join(',')}
      SELECT
        s.sku AS s, s.st,
        MAX(CASE WHEN ac.covered_sku IS NOT NULL THEN 1 ELSE 0 END)::int AS a,
        MAX(CASE WHEN ec.covered_sku IS NOT NULL THEN 1 ELSE 0 END)::int AS e,
        MAX(CASE WHEN sc.covered_sku IS NOT NULL THEN 1 ELSE 0 END)::int AS sh,
        MAX(CASE WHEN e1.covered_sku  IS NOT NULL THEN 1 ELSE 0 END)::int AS e1,
        MAX(CASE WHEN e4.covered_sku  IS NOT NULL THEN 1 ELSE 0 END)::int AS e4,
        MAX(CASE WHEN e22.covered_sku IS NOT NULL THEN 1 ELSE 0 END)::int AS e22,
        MAX(CASE WHEN e27.covered_sku IS NOT NULL THEN 1 ELSE 0 END)::int AS e27,
        MAX(CASE WHEN e28.covered_sku IS NOT NULL THEN 1 ELSE 0 END)::int AS e28,
        MAX(CASE WHEN e222.covered_sku IS NOT NULL THEN 1 ELSE 0 END)::int AS e222
      FROM stock s
      LEFT JOIN amz_coverage   ac  ON ac.covered_sku  = s.sku
      LEFT JOIN ebay_coverage  ec  ON ec.covered_sku  = s.sku
      LEFT JOIN shop_coverage  sc  ON sc.covered_sku  = s.sku
      LEFT JOIN ecov_1         e1  ON e1.covered_sku  = s.sku
      LEFT JOIN ecov_4         e4  ON e4.covered_sku  = s.sku
      LEFT JOIN ecov_22        e22 ON e22.covered_sku = s.sku
      LEFT JOIN ecov_27        e27 ON e27.covered_sku = s.sku
      LEFT JOIN ecov_28        e28 ON e28.covered_sku = s.sku
      LEFT JOIN ecov_222       e222 ON e222.covered_sku = s.sku
      GROUP BY s.sku, s.st ORDER BY s.st DESC
    `);

    const total          = rows.length;
    const notAnywhere    = rows.filter(r => !r.a && !r.e && !r.sh).length;
    const missingAmazon  = rows.filter(r => !r.a).length;
    const missingEbay    = rows.filter(r => !r.e).length;
    const missingShopify = rows.filter(r => !r.sh).length;
    const allThree       = rows.filter(r => r.a && r.e && r.sh).length;

    const ebayAccounts = EBAY_ACCOUNTS.map(acc => {
      const col = 'e' + acc.id;
      return {
        id:      acc.id,
        name:    acc.name,
        listed:  rows.filter(r => r[col] === 1).length,
        missing: rows.filter(r => r[col] === 0).length,
      };
    });

    if (req.query.debug) {
      const dsku = req.query.debug;
      const drow = rows.find(r => r.s === dsku);
      return res.status(200).json({ ok: true, debug_sku: dsku, result: drow || null });
    }

    return res.status(200).json({
      ok: true,
      refreshed_at: new Date().toISOString(),
      summary: { total, notAnywhere, missingAmazon, missingEbay, missingShopify, allThree },
      ebayAccounts,
      rows,
    });

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    await client.end().catch(() => {});
  }
};
