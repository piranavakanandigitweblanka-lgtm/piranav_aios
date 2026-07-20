// Thivajini Dashboard — LEDSone FR · Google Ads
// ?type=req1  → weekly campaign vs Shopify UTM cross-check (Ads side live; Shopify UTM not in DB)
// ?type=req2  → product-level performance + segment classification (last 90d default)
// ?type=req3  → stock-spend tracker (last 30d default)
// All accept ?from=YYYY-MM-DD&to=YYYY-MM-DD

const { Client } = require('pg');

const TV_CAMPAIGNS = [23103582865, 23533025729, 23405519670];
const CAMP_LABELS  = {
  '23103582865': 'Topsell',
  '23533025729': 'All Products',
  '23405519670': 'Best Sellers',
};

const LOW_STOCK_THRESHOLD = 5;
const HERO_CLICKS = 15;

// Segment classification matching HTML legend
function classify(imp, clicks, conv, cost, cv) {
  if (imp === 0)    return 'Zombie';
  if (clicks === 0) return 'Low Engagement';
  const roas = cost > 0 ? (cv / cost) * 100 : 0;
  if (conv > 0) {
    if (roas >= 400 && clicks >= HERO_CLICKS) return 'Hero';
    if (roas >= 400)  return 'Green';
    if (roas >= 300)  return 'Amber';
    if (roas >= 250)  return 'Orange';
    return 'High Priority Cut';
  }
  if (clicks >= 5) return 'Bleeding';
  return 'Monitor Cut';
}

async function handleReq1(client, fromDate, toDate) {
  const { rows } = await client.query(`
    SELECT DATE_TRUNC('week', date)::date AS week_start,
      campaign_id::text AS cid,
      ROUND(SUM(cost)::numeric,2) AS cost,
      ROUND(SUM(conversions)::numeric,2) AS conv,
      ROUND(SUM(conversion_value)::numeric,2) AS cv,
      SUM(impressions) AS imp,
      SUM(clicks) AS clicks
    FROM google_ads.campaign_performance
    WHERE campaign_id = ANY($1::bigint[]) AND date BETWEEN $2 AND $3
    GROUP BY week_start, campaign_id
    ORDER BY week_start DESC, campaign_id
  `, [TV_CAMPAIGNS, fromDate, toDate]);

  const n = v => Number(v) || 0;
  const weeks = rows.map(r => ({
    week:     r.week_start.toISOString().slice(0, 10),
    camp:     CAMP_LABELS[r.cid] || r.cid,
    cid:      r.cid,
    ads_conv: n(r.conv),
    ads_val:  n(r.cv),
    cost:     n(r.cost),
    imp:      n(r.imp),
    clicks:   n(r.clicks),
    shop_ord: 0,  // Shopify UTM not in DB — attribution cross-check unavailable
    shop_rev: 0,
  }));
  return { weeks, meta: { from: fromDate, to: toDate } };
}

async function handleReq2(client, fromDate, toDate) {
  const { rows: perfRows } = await client.query(`
    SELECT
      product_item_id,
      CASE WHEN product_item_id ILIKE 'shopify_%'
        THEN SPLIT_PART(LOWER(product_item_id), '_', 4)
        ELSE LOWER(product_item_id)
      END AS variant_id,
      SUM(impressions) AS imp, SUM(clicks) AS clicks,
      ROUND(SUM(cost)::numeric,2) AS cost,
      ROUND(SUM(conversions)::numeric,4) AS conv,
      ROUND(SUM(conversion_value)::numeric,2) AS cv
    FROM google_ads.product_performance
    WHERE campaign_id = ANY($1::bigint[]) AND date BETWEEN $2 AND $3 AND product_item_id != ''
    GROUP BY product_item_id
    ORDER BY cost DESC LIMIT 800
  `, [TV_CAMPAIGNS, fromDate, toDate]);

  const variantIds = perfRows.map(r => r.variant_id);
  let metaMap = {};
  if (variantIds.length > 0) {
    const { rows: metaRows } = await client.query(`
      SELECT DISTINCT ON (LOWER(product_id))
        LOWER(product_id) AS pid, title, availability, price::numeric AS pr, link AS url
      FROM google_ads.merchant_products
      WHERE currency='EUR' AND LOWER(product_id) = ANY($1::text[])
      ORDER BY LOWER(product_id)
    `, [variantIds]);
    metaRows.forEach(m => { metaMap[m.pid] = m; });
  }

  const n = v => Number(v) || 0;
  const products = perfRows.map(r => {
    const m   = metaMap[r.variant_id] || {};
    const imp = n(r.imp), clicks = n(r.clicks);
    const cost = n(r.cost), conv = n(r.conv), cv = n(r.cv);
    const price = m.pr ? Number(m.pr) : 0;
    const ctr  = imp    > 0 ? Math.round(clicks/imp  * 10000) / 100 : 0;
    const cvr  = clicks > 0 ? Math.round(conv/clicks * 10000) / 100 : 0;
    const roas = cost   > 0 ? Math.round(cv/cost     * 10000) / 100 : 0;
    const spp  = price  > 0 ? Math.round(cost/price  * 1000)  / 10  : 0;
    return {
      id: r.product_item_id,
      t:  m.title || 'Unknown',
      url: m.url  || '',
      av:  m.availability || 'unknown',
      pr:  price,
      im: imp, cl: clicks, sp: cost, or: conv, sa: cv,
      ctr, cvr, roas, spp,
      seg: classify(imp, clicks, conv, cost, cv),
    };
  });
  return { products, meta: { from: fromDate, to: toDate } };
}

async function handleReq3(client, fromDate, toDate) {
  const { rows: perfRows } = await client.query(`
    SELECT
      product_item_id,
      CASE WHEN product_item_id ILIKE 'shopify_%'
        THEN SPLIT_PART(LOWER(product_item_id), '_', 4)
        ELSE LOWER(product_item_id)
      END AS variant_id,
      MIN(campaign_id::text) AS cid,
      SUM(impressions) AS imp, SUM(clicks) AS clicks,
      ROUND(SUM(cost)::numeric,2) AS cost,
      ROUND(SUM(conversions)::numeric,4) AS conv,
      ROUND(SUM(conversion_value)::numeric,2) AS cv
    FROM google_ads.product_performance
    WHERE campaign_id = ANY($1::bigint[]) AND date BETWEEN $2 AND $3 AND product_item_id != ''
    GROUP BY product_item_id
    ORDER BY cost DESC LIMIT 400
  `, [TV_CAMPAIGNS, fromDate, toDate]);

  const variantIds = perfRows.map(r => r.variant_id);
  let shopMap = {}, invMap = {}, gmcMap = {};

  if (variantIds.length > 0) {
    // FR Shopify listings → SKU
    try {
      const { rows: shopRows } = await client.query(`
        SELECT DISTINCT ON (item_id::text)
          item_id::text AS vid, sku, title, status, listing_url AS url
        FROM listings.shopify_listings
        WHERE site='France' AND item_id::text = ANY($1::text[])
        ORDER BY item_id::text
      `, [variantIds]);
      shopRows.forEach(r => { shopMap[r.vid] = r; });
    } catch(e) {}

    // Inventory via SKU
    try {
      const skus = Object.values(shopMap).map(r => r.sku).filter(Boolean);
      if (skus.length > 0) {
        const { rows: invRows } = await client.query(`
          SELECT p.sku, SUM(ps.quantity::numeric)::int AS stock
          FROM inventory.products p
          JOIN inventory.physical_product_stock ps ON ps.inventory::varchar = p.id::varchar
          WHERE p.sku = ANY($1::text[]) GROUP BY p.sku
        `, [skus]);
        invRows.forEach(r => { invMap[r.sku] = r.stock; });
      }
    } catch(e) {}

    // GMC availability
    try {
      const { rows: gmcRows } = await client.query(`
        SELECT DISTINCT ON (LOWER(product_id))
          LOWER(product_id) AS pid, title, availability, price::numeric AS pr, link AS url
        FROM google_ads.merchant_products
        WHERE currency='EUR' AND LOWER(product_id) = ANY($1::text[])
        ORDER BY LOWER(product_id)
      `, [variantIds]);
      gmcRows.forEach(m => { gmcMap[m.pid] = m; });
    } catch(e) {}
  }

  const n = v => Number(v) || 0;
  const products = perfRows.map(r => {
    const shop  = shopMap[r.variant_id] || {};
    const gmc   = gmcMap[r.variant_id]  || {};
    const sku   = shop.sku || null;
    const stock = (sku && invMap[sku] !== undefined) ? invMap[sku] : null;
    const spend = n(r.cost);

    let flag = 'OK', ws = 0;
    if (stock === 0 && spend > 0)                          { flag = 'STOP';     ws = spend; }
    else if (stock !== null && stock <= LOW_STOCK_THRESHOLD) { flag = 'ACT SOON'; }
    else if (stock === null || stock === undefined)          { flag = 'MONITOR';  }

    return {
      id:   r.product_item_id,
      sku:  sku  || '',
      t:    shop.title || gmc.title || '',
      camp: CAMP_LABELS[r.cid] || r.cid,
      av:   gmc.availability || (shop.status === 'active' ? 'in stock' : '') || '',
      url:  shop.url || gmc.url || '',
      pr:   gmc.pr ? Number(gmc.pr) : 0,
      st:   stock,
      sp:   spend,
      cl:   n(r.clicks),
      or:   n(r.conv),
      cv:   n(r.cv),
      im:   n(r.imp),
      fl:   flag,
      ws,
    };
  });
  return { products, meta: { from: fromDate, to: toDate } };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, error: 'DATABASE_URL not configured' });
  const type = req.query.type || 'req1';

  const client = new Client({
    connectionString: connStr, ssl: false,
    connectionTimeoutMillis: 15000, statement_timeout: 55000,
  });
  try {
    await client.connect();

    let fromDate, toDate;
    if (req.query.from && req.query.to) {
      fromDate = req.query.from; toDate = req.query.to;
    } else {
      const { rows } = await client.query(
        `SELECT MAX(date) AS latest FROM google_ads.campaign_performance WHERE campaign_id = ANY($1::bigint[])`,
        [TV_CAMPAIGNS]
      );
      const d = new Date(rows[0].latest);
      toDate = d.toISOString().slice(0, 10);
      const f = new Date(d);
      if (type === 'req1') f.setDate(f.getDate() - 97);       // ~14 weeks
      else if (type === 'req3') f.setDate(f.getDate() - 29);  // 30 days
      else f.setDate(f.getDate() - 89);                        // 90 days (req2)
      fromDate = f.toISOString().slice(0, 10);
    }

    let result;
    if      (type === 'req1') result = await handleReq1(client, fromDate, toDate);
    else if (type === 'req2') result = await handleReq2(client, fromDate, toDate);
    else if (type === 'req3') result = await handleReq3(client, fromDate, toDate);
    else return res.status(400).json({ ok: false, error: 'Unknown type: ' + type });

    return res.status(200).json({ ok: true, ...result });

  } catch (err) {
    const msg   = err.message || '';
    const cause = /timeout|ETIMEDOUT|ECONNREFUSED/i.test(msg) ? 'network_timeout' : 'unknown';
    return res.status(500).json({ ok: false, cause, error: msg });
  } finally {
    await client.end().catch(() => {});
  }
};
