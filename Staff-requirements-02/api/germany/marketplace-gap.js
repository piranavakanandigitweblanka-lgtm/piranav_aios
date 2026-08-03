const { Client } = require('pg');

// Strip store-specific suffixes from listing SKUs
const STRIP = `TRIM(REGEXP_REPLACE(sku, '-(IDE|IFR|DE|UK)$', ''))`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, error: 'DATABASE_URL not configured' });

  const client = new Client({
    connectionString: connStr, ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000, statement_timeout: 55000,
  });

  try {
    await client.connect();

    // Single query: stock + all 3 channel listings matched in SQL
    const { rows } = await client.query(`
      SELECT
        p.sku                                                          AS s,
        SUM(licsl.stock)::int                                          AS st,
        MAX(CASE WHEN al.sku  IS NOT NULL THEN 1 ELSE 0 END)::int     AS a,
        MAX(CASE WHEN el.sku  IS NOT NULL THEN 1 ELSE 0 END)::int     AS e,
        MAX(CASE WHEN sl.sku  IS NOT NULL THEN 1 ELSE 0 END)::int     AS sh
      FROM inventory.products p
      JOIN inventory.local_inventory_current_stock_location_wise licsl
        ON licsl.inventory_id = p.id
       AND licsl.warehouse_location = 'Germany'
       AND licsl.stock > 0
      LEFT JOIN listings.amazon_listings al
        ON ${STRIP.replace(/sku/g, 'al.sku')} = p.sku
       AND al.site = 'Germany'
       AND al.sku IS NOT NULL AND TRIM(al.sku) != ''
      LEFT JOIN listings.ebay_listings el
        ON ${STRIP.replace(/sku/g, 'el.sku')} = p.sku
       AND el.site = 'Germany' AND el.all_list = 1
       AND el.sku IS NOT NULL AND TRIM(el.sku) != ''
      LEFT JOIN listings.shopify_listings sl
        ON ${STRIP.replace(/sku/g, 'sl.sku')} = p.sku
       AND sl.site = 'Germany'
       AND sl.sku IS NOT NULL AND TRIM(sl.sku) != ''
      GROUP BY p.sku
      ORDER BY SUM(licsl.stock) DESC
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
