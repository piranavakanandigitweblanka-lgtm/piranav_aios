// Sonya Req6 — Daily Orders Dashboard
// Sources: order_management.orders, order_item_info, sub_source, market_place
//          inventory.products, inventory.physical_product_stock
//          listings.shopify_listings
// Date: yesterday by default (or ?date=YYYY-MM-DD)
// UK market_place id = 23
// LEDsone UK listing: site='UK' AND listing_url ILIKE '%ledsone.co.uk%'

const { Client } = require('pg');

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

    // Resolve target date: use ?date param or yesterday from MAX(order_date)
    let targetDate;
    if (req.query.date) {
      targetDate = req.query.date;
    } else {
      const { rows: maxRows } = await client.query(
        `SELECT DATE(MAX(order_date)) - INTERVAL '1 day' AS d FROM order_management.orders`
      );
      targetDate = maxRows[0].d.toISOString().slice(0, 10);
    }

    const l7Start = new Date(targetDate);
    l7Start.setDate(l7Start.getDate() - 6);
    const l7From = l7Start.toISOString().slice(0, 10);

    // ── Summary counts ──────────────────────────────────────────────────────
    const { rows: summaryRows } = await client.query(`
      SELECT
        COUNT(DISTINCT o.id)                                      AS total_uk_orders,
        COUNT(DISTINCT o.id) FILTER (WHERE ss.source_id = 3)     AS ledsone_uk_orders
      FROM order_management.orders o
      LEFT JOIN order_management.sub_source ss ON ss.id = o.sub_source_id
      WHERE DATE(o.order_date) = $1
        AND o.market_place = '23'
    `, [targetDate]);

    const summary = {
      total_uk_orders:   Number(summaryRows[0].total_uk_orders),
      ledsone_uk_orders: Number(summaryRows[0].ledsone_uk_orders),
      date: targetDate,
      refreshed_at: new Date().toISOString(),
    };

    // ── Yesterday's orders (deduplicated per SKU + sub_source) ──────────────
    const { rows: orderRows } = await client.query(`
      SELECT
        oi.real_sku                               AS sku,
        ss.name                                   AS sub_source,
        ss.source_id                              AS source_id,
        SUM(oi.item_quantity::int)                AS qty,
        MAX(oi.item_price::numeric)               AS sold_price,
        MAX(oi.item_img)                          AS image,
        MAX(oi.item_title)                        AS title
      FROM order_management.orders o
      JOIN order_management.order_item_info oi ON oi.order_id = o.id
      LEFT JOIN order_management.sub_source ss   ON ss.id = o.sub_source_id
      WHERE DATE(o.order_date) = $1
        AND o.market_place = '23'
        AND oi.real_sku IS NOT NULL
        AND oi.real_sku <> ''
      GROUP BY oi.real_sku, ss.name, ss.source_id
      ORDER BY SUM(oi.item_quantity::int) DESC
    `, [targetDate]);

    if (!orderRows.length) {
      return res.status(200).json({ ok: true, summary, rows: [] });
    }

    const skus = [...new Set(orderRows.map(r => r.sku))];

    // ── Stock (sum all warehouse quantities per SKU) ─────────────────────────
    const { rows: stockRows } = await client.query(`
      SELECT ip.sku, SUM(pps.quantity) AS total_stock
      FROM inventory.products ip
      JOIN inventory.physical_product_stock pps ON pps.inventory = ip.id
      WHERE ip.sku = ANY($1::text[])
      GROUP BY ip.sku
    `, [skus]);
    const stockMap = {};
    stockRows.forEach(r => { stockMap[r.sku] = Number(r.total_stock); });

    // ── LEDsone UK listing: one row per SKU ──────────────────────────────────
    const { rows: listingRows } = await client.query(`
      SELECT DISTINCT ON (sku)
        sku,
        price::numeric AS ledsone_uk_price,
        listing_url    AS ledsone_url
      FROM listings.shopify_listings
      WHERE sku = ANY($1::text[])
        AND site = 'UK'
        AND listing_url ILIKE '%ledsone.co.uk%'
        AND is_parent = 0
      ORDER BY sku, price::numeric ASC
    `, [skus]);
    const listingMap = {};
    listingRows.forEach(r => {
      listingMap[r.sku] = {
        ledsone_uk_price: r.ledsone_uk_price !== null ? Number(r.ledsone_uk_price) : null,
        ledsone_url: r.ledsone_url || null,
      };
    });

    // ── Last 7 days Shopify UK sales (source_id = 3)
    const { rows: l7Rows } = await client.query(`
      SELECT oi.real_sku, SUM(oi.item_quantity::int) AS l7_qty
      FROM order_management.orders o
      JOIN order_management.order_item_info oi ON oi.order_id = o.id
      JOIN order_management.sub_source ss ON ss.id = o.sub_source_id
      WHERE DATE(o.order_date) BETWEEN $1 AND $2
        AND o.market_place = '23'
        AND oi.real_sku = ANY($3::text[])
        AND ss.source_id = 3
      GROUP BY oi.real_sku
    `, [l7From, targetDate, skus]);
    const l7Map = {};
    l7Rows.forEach(r => { l7Map[r.real_sku] = Number(r.l7_qty); });

    // ── Merge all data ───────────────────────────────────────────────────────
    const rows = orderRows.map(r => {
      const listing = listingMap[r.sku] || {};
      return {
        sku:               r.sku,
        sub_source:        r.sub_source || '—',
        source_id:         Number(r.source_id),
        qty:               r.qty !== null ? Number(r.qty) : null,
        sold_price:        r.sold_price !== null ? Number(r.sold_price) : null,
        image:             r.image || null,
        title:             r.title || '—',
        stock:             stockMap[r.sku] !== undefined ? stockMap[r.sku] : null,
        ledsone_uk_price:  listing.ledsone_uk_price !== undefined ? listing.ledsone_uk_price : null,
        ledsone_url:       listing.ledsone_url || null,
        l7_shopify_uk:     l7Map[r.sku] || 0,
      };
    });

    return res.status(200).json({ ok: true, summary, rows });

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    await client.end().catch(() => {});
  }
};
