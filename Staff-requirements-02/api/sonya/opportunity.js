// Sonya Req4 — Live Opportunity SKUs
// Rule: combined non-Google marketplace sales > 2 in L30
// Sources: order_management + listings.shopify_listings + inventory + google_ads.merchant_products + product_performance
// Accepts ?from=YYYY-MM-DD&to=YYYY-MM-DD (defaults to last 30 days from MAX order_date)

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
      const { rows } = await client.query(`SELECT MAX(order_date)::date AS latest FROM order_management.orders`);
      const d = new Date(rows[0].latest);
      toDate   = d.toISOString().slice(0, 10);
      const f  = new Date(d); f.setDate(f.getDate() - 29);
      fromDate = f.toISOString().slice(0, 10);
    }

    // Step 1 — opportunity SKUs: combined non-Google sales > 2 in L30
    const { rows: salesRows } = await client.query(`
      SELECT
        oi.real_sku AS sku,
        SUM(CASE WHEN s.source_name='AMAZON'                       THEN oi.item_quantity::numeric ELSE 0 END) AS amz,
        SUM(CASE WHEN s.source_name='EBAY'                         THEN oi.item_quantity::numeric ELSE 0 END) AS ebay,
        SUM(CASE WHEN s.source_name='B&Q'                          THEN oi.item_quantity::numeric ELSE 0 END) AS bq,
        SUM(CASE WHEN s.source_name='SHOPIFY'                      THEN oi.item_quantity::numeric ELSE 0 END) AS shopify,
        SUM(CASE WHEN s.source_name IN ('MANUAL OM','MANUALORDER') THEN oi.item_quantity::numeric ELSE 0 END) AS manual,
        SUM(oi.item_quantity::numeric) AS combined
      FROM order_management.orders o
      JOIN order_management.sub_source ss ON ss.id = o.sub_source_id
      JOIN order_management.source s ON s.id = ss.source_id
      JOIN order_management.order_item_info oi ON oi.order_id = o.id
      WHERE o.order_date::date BETWEEN $1 AND $2
        AND o.status NOT IN ('Canceled','Cancelled','Refunded','Deleted')
        AND s.source_name IN ('AMAZON','EBAY','B&Q','SHOPIFY','MANUAL OM','MANUALORDER')
        AND oi.real_sku IS NOT NULL AND oi.real_sku != ''
      GROUP BY oi.real_sku
      HAVING SUM(oi.item_quantity::numeric) > 2
      ORDER BY combined DESC
      LIMIT 500
    `, [fromDate, toDate]);

    if (!salesRows.length) {
      return res.status(200).json({ ok: true, meta: { from: fromDate, to: toDate, total: 0 }, products: [] });
    }

    const skus = salesRows.map(r => r.sku);

    // Step 2 — listing metadata from shopify_listings (prefer ledsone.co.uk, fallback to any UK)
    const { rows: listingRows } = await client.query(`
      SELECT DISTINCT ON (sku)
        sku, title, main_image_url, listing_url, price::numeric AS price
      FROM listings.shopify_listings
      WHERE sku = ANY($1::text[])
        AND site = 'UK'
      ORDER BY sku, (listing_url ILIKE '%ledsone.co.uk%') DESC
    `, [skus]);
    const listingMap = {};
    listingRows.forEach(l => { listingMap[l.sku] = l; });

    // Step 3 — stock from inventory.products + physical_product_stock
    const { rows: stockRows } = await client.query(`
      SELECT p.sku, SUM(ps.quantity) AS stock
      FROM inventory.products p
      JOIN inventory.physical_product_stock ps ON ps.inventory::varchar = p.id::varchar
      WHERE p.sku = ANY($1::text[])
      GROUP BY p.sku
    `, [skus]);
    const stockMap = {};
    stockRows.forEach(s => { stockMap[s.sku] = Number(s.stock) || 0; });

    // Step 4 — Google Ads metrics via merchant_products.mpn → product_performance
    const { rows: mpRows } = await client.query(`
      SELECT mpn AS sku, product_id
      FROM google_ads.merchant_products
      WHERE mpn = ANY($1::text[])
    `, [skus]);
    const sku2ids = {};
    mpRows.forEach(m => {
      if (!sku2ids[m.sku]) sku2ids[m.sku] = [];
      sku2ids[m.sku].push(m.product_id.toLowerCase());
    });
    const allProductIds = [...new Set(mpRows.map(m => m.product_id.toLowerCase()))];

    let adsMap = {};
    if (allProductIds.length > 0) {
      const { rows: adsRows } = await client.query(`
        SELECT
          pp.product_item_id,
          SUM(pp.impressions)                         AS imp,
          SUM(pp.clicks)                              AS clk,
          ROUND(SUM(pp.cost)::numeric,2)              AS cost,
          ROUND(SUM(pp.conversions)::numeric,4)       AS conv,
          ROUND(SUM(pp.conversion_value)::numeric,2)  AS cv
        FROM google_ads.product_performance pp
        JOIN google_ads.campaigns c ON c.campaign_id = pp.campaign_id
        WHERE (c.campaign_name ILIKE '%Sonya%' OR pp.campaign_id = 20810136438)
          AND pp.date BETWEEN $1 AND $2
          AND LOWER(pp.product_item_id) = ANY($3::text[])
        GROUP BY pp.product_item_id
      `, [fromDate, toDate, allProductIds]);

      // Roll up by SKU (multiple product_item_ids may map to same SKU)
      adsRows.forEach(a => {
        const pid = a.product_item_id.toLowerCase();
        mpRows.forEach(m => {
          if (m.product_id.toLowerCase() === pid) {
            const sku = m.sku;
            if (!adsMap[sku]) adsMap[sku] = { imp: 0, clk: 0, cost: 0, conv: 0, cv: 0 };
            adsMap[sku].imp  += Number(a.imp)  || 0;
            adsMap[sku].clk  += Number(a.clk)  || 0;
            adsMap[sku].cost += Number(a.cost)  || 0;
            adsMap[sku].conv += Number(a.conv)  || 0;
            adsMap[sku].cv   += Number(a.cv)    || 0;
          }
        });
      });
    }

    const products = salesRows.map(r => {
      const listing = listingMap[r.sku] || {};
      const ads = adsMap[r.sku] || { imp: 0, clk: 0, cost: 0, conv: 0, cv: 0 };
      return {
        sku:      r.sku,
        amz:      Number(r.amz)     || 0,
        ebay:     Number(r.ebay)    || 0,
        bq:       Number(r.bq)      || 0,
        shopify:  Number(r.shopify) || 0,
        manual:   Number(r.manual)  || 0,
        combined: Number(r.combined)|| 0,
        imp:      ads.imp,
        clk:      ads.clk,
        cost:     Math.round(ads.cost * 100) / 100,
        conv:     Math.round(ads.conv * 10000) / 10000,
        cv:       Math.round(ads.cv  * 100)   / 100,
        img:      listing.main_image_url || null,
        url:      listing.listing_url    || null,
        title:    listing.title          || null,
        price:    listing.price ? Number(listing.price) : null,
        stock:    stockMap[r.sku] || 0,
      };
    });

    return res.status(200).json({
      ok: true,
      meta: { from: fromDate, to: toDate, total: products.length },
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
