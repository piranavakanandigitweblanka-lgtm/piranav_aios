// Thivajini Dashboard — LEDSone FR · Google Ads
// ?type=req1  → weekly campaign vs Shopify UTM cross-check (Ads side live; Shopify UTM not in DB)
// ?type=req2  → product-level performance + segment classification (last 90d default)
// ?type=req3  → stock-spend tracker (last 30d default)
// All accept ?from=YYYY-MM-DD&to=YYYY-MM-DD

const { Client } = require('pg');

const TV_CAMPAIGNS = [23103582865, 23533025729, 23405519670];
const CAMP_LABELS  = {
  '23103582865': 'Topsell',
  '23533025729': 'Imp_Click',
  '23405519670': 'Best Sellers',
};

const LOW_STOCK_THRESHOLD = 5;
const HERO_CLICKS = 6;

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

  // Four lookup strategies for merchant_products:
  // 1. Exact full product_item_id string match
  // 2. Exact variant suffix match (SPLIT_PART position 4)
  // 3. Suffix match: bare numeric IDs stored as shopify_XX_PARENT_NUMERIC
  // 4. Parent ID fallback: same parent product, different variant (sibling colour/size)
  const fullIds    = perfRows.map(r => r.product_item_id.toLowerCase());
  const variantIds = perfRows.map(r => r.variant_id);
  // Extract parent IDs from shopify_XX_PARENT_VARIANT format (position 3)
  const allLookups = [...new Set([...fullIds, ...variantIds])];

  // JS helper (mirrors SQL SPLIT_PART, 1-based)
  function SPLIT_PART(str, sep, n) { return str.split(sep)[n - 1] || ''; }

  const parentIdsJs = [...new Set(perfRows
    .filter(r => r.product_item_id.toLowerCase().startsWith('shopify_'))
    .map(r => SPLIT_PART(r.product_item_id.toLowerCase(), '_', 3))
  )];

  let metaMap = {};    // keyed by variant suffix (numeric)
  let parentMap = {};  // keyed by parent ID — fallback for sibling variants

  if (allLookups.length > 0) {
    // Strategy 1, 2, 3: exact variant match
    // Use CASE for DISTINCT ON key: shopify_ products → variant suffix; bare numeric → full id
    const { rows: metaRows } = await client.query(`
      SELECT DISTINCT ON (lookup_key)
        lookup_key,
        LOWER(product_id) AS pid,
        title, availability, price::numeric AS pr, link AS url
      FROM (
        SELECT product_id, feed_label, title, availability, price, link,
          CASE WHEN product_id ILIKE 'shopify_%'
            THEN SPLIT_PART(LOWER(product_id),'_',4)
            ELSE LOWER(product_id)
          END AS lookup_key
        FROM google_ads.merchant_products
        WHERE merchant_id='5551466539' AND currency='EUR'
          AND (LOWER(product_id) = ANY($1::text[])
            OR SPLIT_PART(LOWER(product_id),'_',4) = ANY($2::text[]))
      ) sub
      ORDER BY lookup_key,
        CASE feed_label WHEN 'FR' THEN 0 WHEN 'EUR_16475062347' THEN 1 ELSE 2 END
    `, [allLookups, variantIds]);
    metaRows.forEach(m => {
      if (!metaMap[m.lookup_key]) metaMap[m.lookup_key] = m;
      if (!metaMap[m.pid]) metaMap[m.pid] = m;
    });
  }

  // Strategy 4: parent ID fallback — pick any sibling variant title for unresolved products
  if (parentIdsJs.length > 0) {
    const { rows: parentRows } = await client.query(`
      SELECT DISTINCT ON (SPLIT_PART(LOWER(product_id),'_',3))
        SPLIT_PART(LOWER(product_id),'_',3) AS parent_key,
        title, availability, price::numeric AS pr, link AS url
      FROM google_ads.merchant_products
      WHERE merchant_id='5551466539' AND currency='EUR'
        AND SPLIT_PART(LOWER(product_id),'_',3) = ANY($1::text[])
      ORDER BY SPLIT_PART(LOWER(product_id),'_',3),
        CASE feed_label WHEN 'FR' THEN 0 WHEN 'EUR_16475062347' THEN 1 ELSE 2 END
    `, [parentIdsJs]);
    parentRows.forEach(m => { if (!parentMap[m.parent_key]) parentMap[m.parent_key] = m; });
  }

  const n = v => Number(v) || 0;
  const products = perfRows.map(r => {
    const lookupKey = r.product_item_id.toLowerCase().startsWith('shopify_')
      ? SPLIT_PART(r.product_item_id.toLowerCase(), '_', 4)
      : r.product_item_id.toLowerCase();
    const parentKey = SPLIT_PART(r.product_item_id.toLowerCase(), '_', 3);
    // Resolve: exact lookup_key → full pid → parent sibling fallback
    const m = metaMap[lookupKey] || metaMap[r.product_item_id.toLowerCase()] || parentMap[parentKey] || {};
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

  const fullIds3    = perfRows.map(r => r.product_item_id.toLowerCase());
  const variantIds  = perfRows.map(r => r.variant_id);
  const allLookups3 = [...new Set([...fullIds3, ...variantIds])];
  let shopMap = {}, invMap = {}, gmcMap = {};

  if (allLookups3.length > 0) {
    // FR Shopify listings → SKU (keyed by variant numeric id)
    try {
      const { rows: shopRows } = await client.query(`
        SELECT DISTINCT ON (item_id::text)
          item_id::text AS vid, sku, title, status, listing_url AS url, price::numeric AS shop_price
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

    // GMC availability — try full product_item_id first, then numeric variant_id
    try {
      const { rows: gmcRows } = await client.query(`
        SELECT DISTINCT ON (LOWER(product_id))
          LOWER(product_id) AS pid, title, availability, price::numeric AS pr, link AS url
        FROM google_ads.merchant_products
        WHERE currency='EUR' AND LOWER(product_id) = ANY($1::text[])
        ORDER BY LOWER(product_id)
      `, [allLookups3]);
      gmcRows.forEach(m => { gmcMap[m.pid] = m; });
    } catch(e) {}
  }

  const n = v => Number(v) || 0;
  const products = perfRows.map(r => {
    const shop  = shopMap[r.variant_id] || {};
    const gmc   = gmcMap[r.product_item_id.toLowerCase()] || gmcMap[r.variant_id] || {};
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
      pr:   gmc.pr ? Number(gmc.pr) : (shop.shop_price ? Number(shop.shop_price) : 0),
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

async function handleReq4(client, toDate) {
  const from90 = addDays(toDate, -89);
  const from60 = addDays(toDate, -59);
  const from30 = addDays(toDate, -29);

  // Ads conversions by variant for all 3 windows
  const { rows: adsRows } = await client.query(`
    SELECT
      CASE WHEN product_item_id ILIKE 'shopify_%'
        THEN SPLIT_PART(LOWER(product_item_id), '_', 4)
        ELSE LOWER(product_item_id)
      END AS variant_id,
      ROUND(SUM(CASE WHEN date >= $2 THEN conversions ELSE 0 END)::numeric,2) AS ad90,
      ROUND(SUM(CASE WHEN date >= $3 THEN conversions ELSE 0 END)::numeric,2) AS ad60,
      ROUND(SUM(CASE WHEN date >= $4 THEN conversions ELSE 0 END)::numeric,2) AS ad30
    FROM google_ads.product_performance
    WHERE campaign_id = ANY($1::bigint[]) AND date >= $2 AND product_item_id != ''
    GROUP BY variant_id
    HAVING SUM(conversions) > 0
    ORDER BY ad90 DESC LIMIT 300
  `, [TV_CAMPAIGNS, from90, from60, from30]);

  // Map variant_id → SKU + title + price via France Shopify listings
  const variantIds = adsRows.map(r => r.variant_id);
  let varToShop = {};
  if (variantIds.length > 0) {
    const { rows: shopRows } = await client.query(`
      SELECT DISTINCT ON (item_id::text)
        item_id::text AS vid, sku, title, price::numeric AS pr
      FROM listings.shopify_listings
      WHERE site='France' AND item_id::text = ANY($1::text[])
      ORDER BY item_id::text
    `, [variantIds]);
    shopRows.forEach(r => { varToShop[r.vid] = r; });
  }

  // Shopify FR orders by SKU (sub_source 233 = jedsz8-km = ledsone.fr)
  const skus = [...new Set(Object.values(varToShop).map(r => r.sku).filter(Boolean))];
  let shopOrdMap = {};
  if (skus.length > 0) {
    const { rows: ordRows } = await client.query(`
      SELECT ii.item_sku AS sku,
        COUNT(CASE WHEN o.order_date::date >= $2 THEN 1 END)::int AS sh90,
        COUNT(CASE WHEN o.order_date::date >= $3 THEN 1 END)::int AS sh60,
        COUNT(CASE WHEN o.order_date::date >= $4 THEN 1 END)::int AS sh30
      FROM order_management.orders o
      JOIN order_management.order_item_info ii ON ii.order_id = o.id
      WHERE o.sub_source_id = 233 AND o.order_date::date >= $1
        AND ii.item_sku = ANY($5::text[])
      GROUP BY ii.item_sku
    `, [from90, from90, from60, from30, skus]);
    ordRows.forEach(r => { shopOrdMap[r.sku] = r; });
  }

  const n = v => Number(v) || 0;
  const products = adsRows.map(r => {
    const shop  = varToShop[r.variant_id] || {};
    const sku   = shop.sku || '';
    const ord   = shopOrdMap[sku] || {};
    const ad90  = n(r.ad90), ad60 = n(r.ad60), ad30 = n(r.ad30);
    const sh90  = n(ord.sh90), sh60 = n(ord.sh60), sh30 = n(ord.sh30);
    const diff  = sh30 - ad30;
    const pct   = ad30 > 0 ? Math.round(sh30 / ad30 * 100) : 0;
    let st = 'No Orders';
    if (sh30 > 0 || ad30 > 0) {
      if (sh30 > 0 && ad30 === 0) st = 'Organic Only';
      else if (ad30 > 0 && sh30 === 0) st = 'Ads Driven';
      else {
        const ratio = sh30 / ad30;
        if (ratio >= 0.8 && ratio <= 1.2) st = 'Balanced';
        else if (sh30 > ad30) st = 'Organic Heavy';
        else st = 'Ads Driven';
      }
    }
    return { id: r.variant_id, sku, t: shop.title || '', pr: shop.pr ? Number(shop.pr) : 0, sh90, sh60, sh30, ad90, ad60, ad30, diff, pct, st };
  }).filter(p => p.sh90 > 0 || p.ad90 > 0);

  return { products, meta: { from: from90, to: toDate } };
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
      else f.setDate(f.getDate() - 89);                        // 90 days (req2/req4)
      fromDate = f.toISOString().slice(0, 10);
    }

    let result;
    if      (type === 'req1') result = await handleReq1(client, fromDate, toDate);
    else if (type === 'req2') result = await handleReq2(client, fromDate, toDate);
    else if (type === 'req3') result = await handleReq3(client, fromDate, toDate);
    else if (type === 'req4') result = await handleReq4(client, toDate);
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
