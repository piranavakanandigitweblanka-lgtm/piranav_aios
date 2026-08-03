// Theekshy Dashboard — single endpoint for all requirements
// ?type=req1    → campaign overview + daily trend + products (Req 1)
// ?type=req2    → search terms (Req 2 — Search Term Optimisation)
// ?type=feed    → feed optimisation + stock status (Req 3 + 4)
// ?type=prodopt → product optimisation — ROAS + stock (Req 5, GA4 unavailable)
// All accept ?from=YYYY-MM-DD&to=YYYY-MM-DD (default: last 30d from MAX date)
//
// ROAS thresholds (CSV-authoritative, fixed universal thresholds):
//   Critical : ROAS < 3.0× (< 300%)
//   Monitor  : 3.0× ≤ ROAS < 4.5× (300–449%)
//   Healthy  : ROAS ≥ 4.5× (≥ 450%)

const { Client } = require('pg');

const TH_CAMPAIGNS = [23714290257, 23684837882];
const TH_LABELS    = { '23714290257': 'THEE_GEMS', '23684837882': 'THEE_MYSTERY' };

function csvCampStatus(roasPct) {
  if (roasPct < 300) return 'critical';
  if (roasPct < 450) return 'monitor';
  return 'healthy';
}

function csvProdStatus(roasPct, conv, cost, stockOut) {
  if (stockOut)              return 'paused';
  if (conv === 0 && cost > 0) return 'critical'; // High Spend / 0 Conv
  if (roasPct < 300)         return 'critical';
  if (roasPct < 450)         return 'monitor';
  return 'healthy';
}

async function handleReq1(client, fromDate, toDate, prevFrom, prevTo) {
  const spanDays = Math.round((new Date(toDate) - new Date(fromDate)) / 86400000);
  const pEnd  = new Date(fromDate); pEnd.setDate(pEnd.getDate() - 1);
  const pStart = new Date(pEnd);    pStart.setDate(pStart.getDate() - spanDays);
  const fmt = d => d.toISOString().slice(0, 10);
  prevFrom = fmt(pStart); prevTo = fmt(pEnd);

  const { rows: campRows } = await client.query(`
    SELECT cp.campaign_id, c.campaign_name, c.budget, c.campaign_status,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.cost             ELSE 0 END)::numeric,2) AS cost_l,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversions      ELSE 0 END)::numeric,4) AS conv_l,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS cv_l,
      SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.impressions ELSE 0 END) AS imp_l,
      SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.clicks      ELSE 0 END) AS clk_l,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.cost             ELSE 0 END)::numeric,2) AS cost_p,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversions      ELSE 0 END)::numeric,4) AS conv_p,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS cv_p
    FROM google_ads.campaign_performance cp
    JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
    WHERE cp.campaign_id = ANY($5::bigint[]) AND cp.date BETWEEN $3 AND $2
    GROUP BY cp.campaign_id, c.campaign_name, c.budget, c.campaign_status
  `, [fromDate, toDate, prevFrom, prevTo, TH_CAMPAIGNS]);

  const { rows: dailyRows } = await client.query(`
    SELECT date, campaign_id::text AS cid,
      ROUND(SUM(cost)::numeric,2) AS cost, SUM(clicks) AS clicks, SUM(impressions) AS imp,
      ROUND(SUM(conversions)::numeric,4) AS conv, ROUND(SUM(conversion_value)::numeric,2) AS cv
    FROM google_ads.campaign_performance
    WHERE campaign_id = ANY($1::bigint[]) AND date BETWEEN $2 AND $3
    GROUP BY date, campaign_id ORDER BY date ASC, campaign_id ASC
  `, [TH_CAMPAIGNS, fromDate, toDate]);

  const { rows: perfRows } = await client.query(`
    SELECT pp.product_item_id, pp.campaign_id::text AS cid,
      SUM(pp.impressions) AS imp, SUM(pp.clicks) AS clicks,
      ROUND(SUM(pp.cost)::numeric,2) AS cost,
      ROUND(SUM(pp.conversions)::numeric,4) AS conv,
      ROUND(SUM(pp.conversion_value)::numeric,2) AS cv
    FROM google_ads.product_performance pp
    WHERE pp.campaign_id = ANY($1::bigint[]) AND pp.date BETWEEN $2 AND $3 AND pp.product_item_id != ''
    GROUP BY pp.product_item_id, pp.campaign_id ORDER BY cost DESC LIMIT 300
  `, [TH_CAMPAIGNS, fromDate, toDate]);

  const ids = perfRows.map(r => r.product_item_id.toLowerCase());
  let metaMap = {};
  if (ids.length > 0) {
    const { rows: metaRows } = await client.query(`
      SELECT DISTINCT ON (LOWER(product_id)) product_id, title, image_link, link, price, mpn AS sku
      FROM google_ads.merchant_products WHERE LOWER(product_id) = ANY($1::text[])
      ORDER BY LOWER(product_id)
    `, [ids]);
    metaRows.forEach(m => { metaMap[m.product_id.toLowerCase()] = m; });
  }

  const n = v => Number(v) || 0;
  const campaigns = campRows.map(r => {
    const id = String(r.campaign_id);
    const [cl, vl, nl, il, kl] = [n(r.cost_l), n(r.cv_l), n(r.conv_l), n(r.imp_l), n(r.clk_l)];
    const [cp, vp, np] = [n(r.cost_p), n(r.cv_p), n(r.conv_p)];
    const roasPct = cl > 0 ? Math.round(vl/cl*10000)/100 : 0;
    return { id, name: r.campaign_name, label: TH_LABELS[id]||id, budget: r.budget ? Number(r.budget) : null,
      status: r.campaign_status, csvStatus: csvCampStatus(roasPct),
      l: { cost:cl, cv:vl, conv:nl, imp:il, clk:kl, roas: roasPct },
      prev: { cost:cp, cv:vp, conv:np, roas: cp>0 ? Math.round(vp/cp*10000)/100 : 0 } };
  });
  const daily = dailyRows.map(r => ({ d: r.date.toISOString().slice(0,10), cid: r.cid,
    cost: n(r.cost), clicks: n(r.clicks), imp: n(r.imp), conv: n(r.conv), cv: n(r.cv) }));
  const products = perfRows.map(r => {
    const m = metaMap[r.product_item_id.toLowerCase()] || {};
    return { pid: r.product_item_id, cid: r.cid, cost: n(r.cost), clicks: n(r.clicks),
      imp: n(r.imp), conv: n(r.conv), cv: n(r.cv),
      title: m.title||null, sku: m.sku||null, url: m.link||null };
  });
  return { campaigns, daily, products, meta: { from: fromDate, to: toDate, prev_from: prevFrom, prev_to: prevTo } };
}

async function handleReq2(client, fromDate, toDate) {
  const { rows } = await client.query(`
    SELECT LOWER(TRIM(search_term)) AS term, campaign_id::text AS cid,
      SUM(impressions) AS imp, SUM(clicks) AS clk,
      ROUND(SUM(conversions)::numeric,4) AS conv,
      ROUND(SUM(conversions_value)::numeric,2) AS cv,
      ROUND(SUM(cost)::numeric,2) AS cost,
      match_type
    FROM google_ads.pmax_campaign_search_term_data
    WHERE campaign_id = ANY($1::bigint[]) AND date BETWEEN $2 AND $3
    GROUP BY LOWER(TRIM(search_term)), campaign_id, match_type
    HAVING SUM(clicks) > 0 OR SUM(cost) > 0
    ORDER BY cost DESC NULLS LAST, clk DESC
    LIMIT 200
  `, [TH_CAMPAIGNS, fromDate, toDate]);
  const n = v => Number(v) || 0;
  const terms = rows.map(r => [r.term, r.cid, n(r.imp), n(r.clk), n(r.conv), n(r.cv), n(r.cost), r.match_type||'PMax']);
  return { terms, meta: { from: fromDate, to: toDate } };
}

async function handleFeed(client, fromDate, toDate) {
  const { rows: perfRows } = await client.query(`
    SELECT pp.product_item_id, pp.campaign_id::text AS cid,
      SUM(pp.impressions) AS impr, SUM(pp.clicks) AS clicks,
      ROUND(SUM(pp.cost)::numeric,2) AS cost,
      ROUND(SUM(pp.conversions)::numeric,4) AS conv,
      ROUND(SUM(pp.conversion_value)::numeric,2) AS cv
    FROM google_ads.product_performance pp
    WHERE pp.campaign_id = ANY($1::bigint[]) AND pp.date BETWEEN $2 AND $3 AND pp.product_item_id != ''
    GROUP BY pp.product_item_id, pp.campaign_id ORDER BY cost DESC LIMIT 200
  `, [TH_CAMPAIGNS, fromDate, toDate]);

  const ids = perfRows.map(r => r.product_item_id.toLowerCase());
  if (ids.length === 0) return { products: [], meta: { from: fromDate, to: toDate } };

  let gmcMap = {}, shopMap = {}, invMap = {};
  try {
    const { rows: gmcRows } = await client.query(`
      SELECT DISTINCT ON (LOWER(product_id)) product_id, title, availability, price, currency, mpn AS sku, image_link, link
      FROM google_ads.merchant_products WHERE LOWER(product_id) = ANY($1::text[])
      ORDER BY LOWER(product_id), (CASE WHEN currency='GBP' THEN 0 ELSE 1 END)
    `, [ids]);
    gmcRows.forEach(m => { gmcMap[m.product_id.toLowerCase()] = {
      title: m.title, gmc_avail: m.availability, gmc_price: m.price ? Number(m.price) : null,
      gmc_currency: m.currency||null, sku: m.sku, img: m.image_link||'', url: m.link||'' }; });
  } catch(e) {}

  try {
    const { rows: shopRows } = await client.query(`
      SELECT DISTINCT ON (sl.item_id::text)
        sl.item_id::text AS variant_id, sl.sku, sl.title AS variant_title,
        sl.price AS shop_price, sl.status AS shop_status, sl.listing_url AS url
      FROM listings.shopify_listings sl
      WHERE sl.site='UK' AND sl.item_id::text = ANY($1::text[])
      ORDER BY sl.item_id::text, (CASE WHEN sl.listing_url ILIKE '%ledsone.co.uk%' THEN 0 ELSE 1 END)
    `, [ids]);
    shopRows.forEach(r => { shopMap[r.variant_id] = { sku: r.sku, vtitle: r.variant_title,
      shop_price: r.shop_price ? Number(r.shop_price) : null, shop_status: r.shop_status, url: r.url }; });
  } catch(e) {}

  try {
    const skus = Object.values(shopMap).map(r => r.sku).filter(Boolean);
    if (skus.length > 0) {
      const { rows: invRows } = await client.query(`
        SELECT p.sku, SUM(ps.quantity::numeric)::int AS total_stock
        FROM inventory.products p
        JOIN inventory.physical_product_stock ps ON ps.inventory::varchar = p.id::varchar
        WHERE p.sku = ANY($1::text[]) GROUP BY p.sku
      `, [skus]);
      invRows.forEach(r => { invMap[r.sku] = r.total_stock; });
    }
  } catch(e) {}

  const n = v => Number(v) || 0;
  const products = perfRows.map(r => {
    const id   = r.product_item_id;
    const gmc  = gmcMap[id.toLowerCase()] || {};
    const shop = shopMap[id] || {};
    const sku  = shop.sku || gmc.sku || null;
    const inv  = sku ? (invMap[sku] !== undefined ? invMap[sku] : null) : null;
    let gmc_note = '';
    if (!gmc.gmc_avail && !gmc.gmc_price) gmc_note = 'No GMC record';
    else if (!shop.shop_price) gmc_note = 'No Shopify variant price/stock — parent product';
    else if (gmc.gmc_currency && gmc.gmc_currency !== 'GBP') gmc_note = gmc.gmc_currency + ' record only — UK GBP price unverifiable';
    return { id, cid: r.cid, cost: n(r.cost), clicks: n(r.clicks), impr: n(r.impr), conv: n(r.conv), cv: n(r.cv),
      title: gmc.title||null, sku, img: gmc.img||'', url: shop.url||gmc.url||'',
      shop_price: shop.shop_price||null, shop_stock: inv, shop_status: shop.shop_status||'active',
      gmc_avail: gmc.gmc_avail||null, gmc_price: gmc.gmc_price||null, gmc_currency: gmc.gmc_currency||null, gmc_note,
      vtitle: shop.vtitle||null, camp: r.cid==='23714290257'?'THEE_GEMS':'THEE_MYSTERY',
      inv, gmc_p: gmc.gmc_price||null, upd: toDate };
  });
  return { products, meta: { from: fromDate, to: toDate } };
}

async function handleProdOpt(client, fromDate, toDate) {
  // Product Optimisation (CSV Sheet 2)
  // Available: product ROAS, stock, merchant data
  // Unavailable: GA4 Bounce Rate, ATC Rate, Engagement Time
  const { rows: perfRows } = await client.query(`
    SELECT pp.product_item_id, pp.campaign_id::text AS cid,
      SUM(pp.impressions) AS imp, SUM(pp.clicks) AS clicks,
      ROUND(SUM(pp.cost)::numeric,2) AS cost,
      ROUND(SUM(pp.conversions)::numeric,4) AS conv,
      ROUND(SUM(pp.conversion_value)::numeric,2) AS cv
    FROM google_ads.product_performance pp
    WHERE pp.campaign_id = ANY($1::bigint[]) AND pp.date BETWEEN $2 AND $3 AND pp.product_item_id != ''
    GROUP BY pp.product_item_id, pp.campaign_id ORDER BY cost DESC LIMIT 300
  `, [TH_CAMPAIGNS, fromDate, toDate]);

  const ids = perfRows.map(r => r.product_item_id.toLowerCase());
  if (ids.length === 0) return { products: [], ga4_available: false, meta: { from: fromDate, to: toDate } };

  let gmcMap = {}, shopMap = {}, invMap = {};
  try {
    const { rows: gmcRows } = await client.query(`
      SELECT DISTINCT ON (LOWER(product_id)) product_id, title, availability, price, currency, mpn AS sku, image_link
      FROM google_ads.merchant_products WHERE LOWER(product_id) = ANY($1::text[])
      ORDER BY LOWER(product_id), (CASE WHEN currency='GBP' THEN 0 ELSE 1 END)
    `, [ids]);
    gmcRows.forEach(m => { gmcMap[m.product_id.toLowerCase()] = {
      title: m.title, avail: m.availability, price: m.price ? Number(m.price) : null,
      sku: m.sku, img: m.image_link||'' }; });
  } catch(e) {}

  try {
    const { rows: shopRows } = await client.query(`
      SELECT DISTINCT ON (sl.item_id::text) sl.item_id::text AS variant_id, sl.sku, sl.status AS shop_status
      FROM listings.shopify_listings sl
      WHERE sl.site='UK' AND sl.item_id::text = ANY($1::text[])
      ORDER BY sl.item_id::text
    `, [ids]);
    shopRows.forEach(r => { shopMap[r.variant_id] = { sku: r.sku, shop_status: r.shop_status }; });
  } catch(e) {}

  try {
    const skus = Object.values(shopMap).map(r => r.sku).filter(Boolean);
    if (skus.length > 0) {
      const { rows: invRows } = await client.query(`
        SELECT p.sku, SUM(ps.quantity::numeric)::int AS total_stock
        FROM inventory.products p
        JOIN inventory.physical_product_stock ps ON ps.inventory::varchar = p.id::varchar
        WHERE p.sku = ANY($1::text[]) GROUP BY p.sku
      `, [skus]);
      invRows.forEach(r => { invMap[r.sku] = r.total_stock; });
    }
  } catch(e) {}

  const n = v => Number(v) || 0;
  const products = perfRows.map(r => {
    const gmc  = gmcMap[r.product_item_id.toLowerCase()] || {};
    const shop = shopMap[r.product_item_id] || {};
    const sku  = shop.sku || gmc.sku || null;
    const stock = sku ? (invMap[sku] !== undefined ? invMap[sku] : null) : null;
    const cost = n(r.cost), conv = n(r.conv), cv = n(r.cv);
    const roasPct = cost > 0 ? Math.round(cv/cost*10000)/100 : 0;
    const stockOut = stock !== null && stock === 0;
    const csvStatus = csvProdStatus(roasPct, conv, cost, stockOut);
    const conditions = [];
    if (stockOut)              conditions.push('Out of Stock');
    else if (conv === 0 && cost > 0) conditions.push('High Spend / 0 Conversions');
    else if (roasPct < 300)   conditions.push('ROAS Below Target (<3.0×)');
    else if (roasPct < 450)   conditions.push('ROAS Borderline (3.0–4.5×)');
    else                      conditions.push('ROAS Healthy (≥4.5×)');
    return { pid: r.product_item_id, cid: r.cid, cost, clicks: n(r.clicks), imp: n(r.imp),
      conv, cv, roas: roasPct, title: gmc.title||null, sku, img: gmc.img||'',
      gmc_avail: gmc.avail||null, stock, csvStatus, conditions,
      camp: r.cid==='23714290257'?'THEE_GEMS':'THEE_MYSTERY' };
  });
  return { products, ga4_available: false, meta: { from: fromDate, to: toDate } };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, error: 'DATABASE_URL not configured' });
  const type = req.query.type || 'req1';

  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000, statement_timeout: 50000 });
  try {
    await client.connect();

    let fromDate, toDate;
    if (req.query.from && req.query.to) {
      fromDate = req.query.from; toDate = req.query.to;
    } else {
      const { rows } = await client.query(
        `SELECT MAX(date) AS latest FROM google_ads.campaign_performance WHERE campaign_id = ANY($1::bigint[])`,
        [TH_CAMPAIGNS]
      );
      const d = new Date(rows[0].latest);
      toDate = d.toISOString().slice(0, 10);
      const f = new Date(d); f.setDate(f.getDate() - 29);
      fromDate = f.toISOString().slice(0, 10);
    }

    let result;
    if (type === 'req1')         result = await handleReq1(client, fromDate, toDate, null, null);
    else if (type === 'req2')    result = await handleReq2(client, fromDate, toDate);
    else if (type === 'feed')    result = await handleFeed(client, fromDate, toDate);
    else if (type === 'prodopt') result = await handleProdOpt(client, fromDate, toDate);
    else return res.status(400).json({ ok: false, error: 'Unknown type: ' + type });

    return res.status(200).json({ ok: true, ...result });

  } catch (err) {
    const msg = err.message || '';
    let cause = /timeout|ETIMEDOUT|ECONNREFUSED/i.test(msg) ? 'network_timeout' : 'unknown';
    return res.status(500).json({ ok: false, cause, error: msg });
  } finally {
    await client.end().catch(() => {});
  }
};
