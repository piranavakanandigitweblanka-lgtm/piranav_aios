// Germany Marketplace Gap — DE In-Stock SKUs
// Returns all SKUs with Germany warehouse stock > 0, with listing flags for
// Amazon DE, eBay DE, and Shopify DE.
// Matching: suffix stripped in SQL (no JS encoding issues) + bundle prefix expansion in JS
// Cache: no-store

const { Client } = require('pg');

// Expand a (already-suffix-stripped) listing SKU into all bundle-prefix variants
// e.g. "A+B+C" → Set{"A+B+C","A+B","A"}
function expandPrefixes(baseSku) {
  const set = new Set();
  set.add(baseSku);
  const parts = baseSku.split('+');
  for (let i = 1; i < parts.length; i++) {
    set.add(parts.slice(0, i).join('+'));
  }
  return set;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, error: 'DATABASE_URL not configured' });

  const client = new Client({
    connectionString: connStr,
    ssl: false,
    connectionTimeoutMillis: 15000,
    statement_timeout: 55000,
  });

  try {
    await client.connect();

    // ── Step 1: All DE in-stock SKUs ─────────────────────────────────────────
    const { rows: stockRows } = await client.query(`
      SELECT p.sku, SUM(licsl.stock)::int AS de_stock
      FROM inventory.products p
      JOIN inventory.local_inventory_current_stock_location_wise licsl
        ON licsl.inventory_id = p.id
      WHERE licsl.warehouse_location = 'Germany'
        AND licsl.stock > 0
      GROUP BY p.sku
      ORDER BY SUM(licsl.stock) DESC
    `);

    if (!stockRows.length) {
      return res.status(200).json({ ok: true, refreshed_at: new Date().toISOString(), rows: [] });
    }

    // ── Step 2: Fetch listing SKUs — strip store suffixes IN SQL ─────────────
    // REGEXP_REPLACE removes trailing -IDE / -IFR / -DE / -UK at the DB level
    // so the JS side receives clean base SKUs with no encoding surprises
    const SUFFIX_REGEX = '-(IDE|IFR|DE|UK)$';

    const [amzRes, ebayRes, shopRes] = await Promise.all([
      client.query(`
        SELECT DISTINCT TRIM(REGEXP_REPLACE(sku, $1, '')) AS sku
        FROM listings.amazon_listings
        WHERE site = 'Germany' AND sku IS NOT NULL AND TRIM(sku) != ''
      `, [SUFFIX_REGEX]),
      client.query(`
        SELECT DISTINCT TRIM(REGEXP_REPLACE(sku, $1, '')) AS sku
        FROM listings.ebay_listings
        WHERE site = 'Germany' AND all_list = 1 AND sku IS NOT NULL AND TRIM(sku) != ''
      `, [SUFFIX_REGEX]),
      client.query(`
        SELECT DISTINCT TRIM(REGEXP_REPLACE(sku, $1, '')) AS sku
        FROM listings.shopify_listings
        WHERE site = 'Germany' AND all_list = 1 AND sku IS NOT NULL AND TRIM(sku) != ''
      `, [SUFFIX_REGEX]),
    ]);

    // ── Step 3: Build listed sets with bundle-prefix expansion ───────────────
    function buildListedSet(rows) {
      const listed = new Set();
      for (const row of rows) {
        for (const prefix of expandPrefixes(row.sku)) {
          listed.add(prefix);
        }
      }
      return listed;
    }

    const amzListed  = buildListedSet(amzRes.rows);
    const ebayListed = buildListedSet(ebayRes.rows);
    const shopListed = buildListedSet(shopRes.rows);

    // ── Step 4: Build output rows ─────────────────────────────────────────────
    const rows = stockRows.map(r => ({
      s:  r.sku,
      st: r.de_stock,
      a:  amzListed.has(r.sku)  ? 1 : 0,
      e:  ebayListed.has(r.sku) ? 1 : 0,
      sh: shopListed.has(r.sku) ? 1 : 0,
    }));

    // ── Step 5: Summary counts ────────────────────────────────────────────────
    const total          = rows.length;
    const notAnywhere    = rows.filter(r => r.a === 0 && r.e === 0 && r.sh === 0).length;
    const missingAmazon  = rows.filter(r => r.a === 0).length;
    const missingEbay    = rows.filter(r => r.e === 0).length;
    const missingShopify = rows.filter(r => r.sh === 0).length;
    const allThree       = rows.filter(r => r.a === 1 && r.e === 1 && r.sh === 1).length;

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
