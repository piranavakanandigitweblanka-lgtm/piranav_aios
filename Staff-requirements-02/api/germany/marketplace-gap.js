// Germany Marketplace Gap — DE In-Stock SKUs
// Returns all SKUs with Germany warehouse stock > 0, with listing flags for
// Amazon DE, eBay DE, and Shopify DE.
// Three-way SKU matching: exact | store-suffix strip (-IDE, -IFR, -DE, etc.) | bundle prefix
// Cache: no-store (data changes daily; avoids stale CDN edge responses)

const { Client } = require('pg');

// Known store-specific suffixes appended to Germany/international listing SKUs
const STORE_SUFFIXES = ['-IDE', '-IFR', '-DE', '-UK'];

// Strip any known store suffix from a listing SKU and return the base
function stripStoreSuffix(sku) {
  for (const suffix of STORE_SUFFIXES) {
    if (sku.endsWith(suffix)) return sku.slice(0, -suffix.length);
  }
  return sku;
}

// Generate all base SKU variants from a listing SKU
// e.g. "LSLT360BC+RPR44WH-IDE" → ["LSLT360BC+RPR44WH","LSLT360BC"]
function getBaseSkus(listingSku) {
  const bases = new Set();
  const s = stripStoreSuffix(listingSku);
  bases.add(s);
  const parts = s.split('+');
  for (let i = 1; i <= parts.length; i++) {
    bases.add(parts.slice(0, i).join('+'));
  }
  return bases;
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

    // ── Step 1: All DE in-stock SKUs with stock quantity ─────────────────────
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

    // ── Step 2: All DE listing SKUs per channel (raw — no join) ──────────────
    const [amzRes, ebayRes, shopRes] = await Promise.all([
      client.query(`
        SELECT DISTINCT sku FROM listings.amazon_listings
        WHERE site = 'Germany' AND sku IS NOT NULL AND sku != ''
      `),
      client.query(`
        SELECT DISTINCT sku FROM listings.ebay_listings
        WHERE site = 'Germany' AND all_list = 1 AND sku IS NOT NULL AND sku != ''
      `),
      client.query(`
        SELECT DISTINCT sku FROM listings.shopify_listings
        WHERE site = 'Germany' AND all_list = 1 AND sku IS NOT NULL AND sku != ''
      `),
    ]);

    // ── Step 3: Build reverse maps: base_sku → listed (JS matching) ──────────
    // For each listing SKU, expand all base variants and mark them as listed
    function buildListedSet(rows) {
      const listed = new Set();
      for (const row of rows) {
        for (const base of getBaseSkus(row.sku)) {
          listed.add(base);
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
