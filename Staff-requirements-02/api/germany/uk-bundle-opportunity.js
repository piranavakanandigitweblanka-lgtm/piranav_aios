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
      WITH uk_bundles AS (
        SELECT DISTINCT
          CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END AS bundle_sku
        FROM listings.ebay_listings
        WHERE site = 'UK' AND sku LIKE '%+%' AND all_list = 1 AND sku IS NOT NULL AND sku != ''
        UNION
        SELECT DISTINCT
          CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END
        FROM listings.amazon_listings
        WHERE site = 'UK' AND sku LIKE '%+%' AND sku IS NOT NULL AND sku != ''
        UNION
        SELECT DISTINCT
          CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END
        FROM listings.shopify_listings
        WHERE site = 'UK' AND sku LIKE '%+%' AND all_list = 1 AND sku IS NOT NULL AND sku != ''
      ),
      de_bundles AS (
        SELECT DISTINCT
          CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END AS bundle_sku
        FROM listings.ebay_listings
        WHERE site = 'Germany' AND sku LIKE '%+%' AND all_list = 1 AND sku IS NOT NULL AND sku != ''
        UNION
        SELECT DISTINCT
          CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END
        FROM listings.amazon_listings
        WHERE site = 'Germany' AND sku LIKE '%+%' AND sku IS NOT NULL AND sku != ''
        UNION
        SELECT DISTINCT
          CASE WHEN sku LIKE '%-IDE' THEN LEFT(sku, LENGTH(sku)-4) ELSE sku END
        FROM listings.shopify_listings
        WHERE site = 'Germany' AND sku LIKE '%+%' AND all_list = 1 AND sku IS NOT NULL AND sku != ''
      ),
      de_stock AS (
        SELECT p.sku, SUM(licsl.stock)::int AS de_qty
        FROM inventory.products p
        JOIN inventory.local_inventory_current_stock_location_wise licsl ON licsl.inventory_id = p.id
        WHERE licsl.warehouse_location = 'Germany' AND licsl.stock > 0
        GROUP BY p.sku
      ),
      uk_components AS (
        SELECT ub.bundle_sku, unnest(string_to_array(ub.bundle_sku, '+')) AS component_sku
        FROM uk_bundles ub
      ),
      bundle_check AS (
        SELECT
          uc.bundle_sku,
          COUNT(uc.component_sku)::int                                                        AS tc,
          COUNT(ds.sku)::int                                                                  AS fc,
          (COUNT(uc.component_sku) - COUNT(ds.sku))::int                                     AS mc,
          bool_and(ds.sku IS NOT NULL)                                                        AS ready,
          array_agg(DISTINCT uc.component_sku ORDER BY uc.component_sku)                     AS components,
          array_remove(array_agg(CASE WHEN ds.sku IS NOT NULL THEN uc.component_sku END ORDER BY uc.component_sku), NULL) AS found,
          array_remove(array_agg(CASE WHEN ds.sku IS NULL THEN uc.component_sku END ORDER BY uc.component_sku), NULL)     AS missing
        FROM uk_components uc
        LEFT JOIN de_stock ds ON ds.sku = uc.component_sku
        GROUP BY uc.bundle_sku
      )
      SELECT
        bc.bundle_sku AS b,
        bc.tc,
        bc.fc,
        bc.mc,
        bc.ready,
        CASE WHEN db.bundle_sku IS NOT NULL THEN 1 ELSE 0 END AS de_exists,
        bc.components,
        bc.found,
        bc.missing
      FROM bundle_check bc
      LEFT JOIN de_bundles db ON db.bundle_sku = bc.bundle_sku
      ORDER BY bc.ready DESC, bc.tc DESC, bc.bundle_sku
    `);

    const totalUK        = rows.length;
    const alreadyInDE    = rows.filter(r => r.de_exists === 1).length;
    const notInDE        = rows.filter(r => r.de_exists === 0).length;
    const readyForReview = rows.filter(r => r.de_exists === 0 && r.ready).length;
    const missingComps   = rows.filter(r => r.de_exists === 0 && !r.ready).length;

    // Only send not-in-DE rows to keep payload manageable
    const outputRows = rows
      .filter(r => r.de_exists === 0)
      .map(r => ({
        b:          r.b,
        tc:         r.tc,
        fc:         r.fc,
        mc:         r.mc,
        ready:      r.ready,
        components: r.components || [],
        found:      r.found     || [],
        missing:    r.missing   || [],
      }));

    return res.status(200).json({
      ok: true,
      refreshed_at: new Date().toISOString(),
      summary: { totalUK, alreadyInDE, notInDE, readyForReview, missingComps },
      rows: outputRows,
    });

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    await client.end().catch(() => {});
  }
};
