// Sonya Dashboard — unified handler
// ?type=campaign-performance  → Req1
// ?type=product-performance   → Req2
// ?type=trend-performance     → Req3
// ?type=opportunity           → Req4
// ?type=stop-waste-spend      → Req5

const { Client } = require('pg');

function makeClient(connStr, timeout) {
  return new Client({
    connectionString: connStr,
    ssl: false,
    connectionTimeoutMillis: 15000,
    statement_timeout: timeout || 30000,
  });
}

function errResponse(res, err) {
  const msg = err.message || '';
  let cause = 'unknown';
  if (/password|authentication|SASL/i.test(msg))               cause = 'authentication';
  else if (/timeout|ETIMEDOUT|ECONNREFUSED|ENOTFOUND/i.test(msg)) cause = 'network_timeout';
  else if (/ssl|TLS/i.test(msg))                               cause = 'ssl';
  else if (/permission denied/i.test(msg))                     cause = 'missing_permissions';
  return res.status(500).json({ ok: false, cause, error: msg });
}

// ── Req1 — Campaign Performance ────────────────────────────────────────────────
async function handleCampaignPerformance(client, req, res) {
  let fromDate, toDate;
  if (req.query.from && req.query.to) {
    fromDate = req.query.from;
    toDate   = req.query.to;
  } else {
    const { rows } = await client.query(`SELECT MAX(date) AS latest FROM google_ads.campaign_performance`);
    const latest = rows[0].latest;
    if (!latest) throw new Error('No data in google_ads.campaign_performance');
    const d = new Date(latest);
    toDate   = d.toISOString().slice(0, 10);
    const f  = new Date(d); f.setDate(f.getDate() - 29);
    fromDate = f.toISOString().slice(0, 10);
  }

  const span    = (new Date(toDate) - new Date(fromDate)) / 86400000;
  const blEnd   = new Date(fromDate); blEnd.setDate(blEnd.getDate() - 1);
  const blStart = new Date(blEnd);    blStart.setDate(blStart.getDate() - span);
  const d60Start = new Date(toDate);  d60Start.setDate(d60Start.getDate() - 59);
  const d90Start = new Date(toDate);  d90Start.setDate(d90Start.getDate() - 89);
  const fmt = d => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);

  const w = {
    l_from: fromDate, l_to: toDate,
    bl_from: fmt(blStart), bl_to: fmt(blEnd),
    d60_from: fmt(d60Start), d60_to: toDate,
    d90_from: fmt(d90Start), d90_to: toDate,
  };

  const { rows: campaigns } = await client.query(`
    SELECT
      cp.campaign_id, c.campaign_name, c.budget, c.campaign_status,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.cost             ELSE 0 END)::numeric,2) AS l_cost,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversions      ELSE 0 END)::numeric,4) AS l_conv,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS l_cv,
      COUNT(DISTINCT CASE WHEN cp.date BETWEEN $1 AND $2 AND cp.cost > 0 THEN cp.date END)           AS l_days,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.cost             ELSE 0 END)::numeric,2) AS bl_cost,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversions      ELSE 0 END)::numeric,4) AS bl_conv,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS bl_cv,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.cost             ELSE 0 END)::numeric,2) AS d60_cost,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.conversions      ELSE 0 END)::numeric,4) AS d60_conv,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS d60_cv,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $7 AND $8 THEN cp.cost             ELSE 0 END)::numeric,2) AS d90_cost,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $7 AND $8 THEN cp.conversions      ELSE 0 END)::numeric,4) AS d90_conv,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $7 AND $8 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS d90_cv
    FROM google_ads.campaign_performance cp
    JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
    WHERE (c.campaign_name ILIKE '%Sonya%' OR cp.campaign_id = 20810136438)
      AND cp.date BETWEEN $7 AND $8
    GROUP BY cp.campaign_id, c.campaign_name, c.budget, c.campaign_status
    ORDER BY l_cost DESC NULLS LAST
  `, [w.l_from, w.l_to, w.bl_from, w.bl_to, w.d60_from, w.d60_to, w.d90_from, w.d90_to]);

  const roas = (cost, cv) => Number(cost) > 0 ? Math.round((Number(cv) / Number(cost)) * 10000) / 100 : 0;

  const result = campaigns.map(r => ({
    id: String(r.campaign_id), name: r.campaign_name,
    budget: r.budget ? Number(r.budget) : null, status: r.campaign_status,
    days: Number(r.l_days),
    l:   { cost: Number(r.l_cost),   conv: Number(r.l_conv),   cv: Number(r.l_cv),   roas: roas(r.l_cost,   r.l_cv)   },
    bl:  { cost: Number(r.bl_cost),  conv: Number(r.bl_conv),  cv: Number(r.bl_cv),  roas: roas(r.bl_cost,  r.bl_cv)  },
    d60: { cost: Number(r.d60_cost), conv: Number(r.d60_conv), cv: Number(r.d60_cv), roas: roas(r.d60_cost, r.d60_cv) },
    d90: { cost: Number(r.d90_cost), conv: Number(r.d90_conv), cv: Number(r.d90_cv), roas: roas(r.d90_cost, r.d90_cv) },
  }));

  return res.status(200).json({
    ok: true,
    meta: { ...w, total: result.length, active: result.filter(c => c.l.cost > 0).length },
    campaigns: result,
  });
}

// ── Req2 — Product Performance ─────────────────────────────────────────────────
async function handleProductPerformance(client, req, res) {
  let fromDate, toDate;
  if (req.query.from && req.query.to) {
    fromDate = req.query.from;
    toDate   = req.query.to;
  } else {
    const { rows } = await client.query(`SELECT MAX(date) AS latest FROM google_ads.product_performance`);
    const d = new Date(rows[0].latest);
    toDate   = d.toISOString().slice(0, 10);
    const f  = new Date(d); f.setDate(f.getDate() - 59);
    fromDate = f.toISOString().slice(0, 10);
  }

  const { rows: perfRows } = await client.query(`
    SELECT pp.product_item_id, pp.parent_id,
      SUM(pp.impressions)                         AS impressions,
      SUM(pp.clicks)                              AS clicks,
      ROUND(SUM(pp.cost)::numeric,2)              AS cost,
      ROUND(SUM(pp.conversions)::numeric,4)       AS conversions,
      ROUND(SUM(pp.conversion_value)::numeric,2)  AS conversion_value
    FROM google_ads.product_performance pp
    JOIN google_ads.campaigns c ON c.campaign_id = pp.campaign_id
    WHERE (c.campaign_name ILIKE '%Sonya%' OR pp.campaign_id = 20810136438)
      AND pp.date BETWEEN $1 AND $2
      AND pp.product_item_id != ''
    GROUP BY pp.product_item_id, pp.parent_id
    ORDER BY cost DESC
    LIMIT 3000
  `, [fromDate, toDate]);

  const ids = perfRows.map(r => r.product_item_id.toLowerCase());
  const { rows: metaRows } = await client.query(`
    SELECT product_id, title, image_link, link, price, availability, mpn AS sku
    FROM google_ads.merchant_products
    WHERE LOWER(product_id) = ANY($1::text[])
  `, [ids]);
  const metaMap = {};
  metaRows.forEach(m => { metaMap[m.product_id.toLowerCase()] = m; });

  const products = perfRows.map(r => {
    const meta = metaMap[r.product_item_id.toLowerCase()] || {};
    return {
      id: r.product_item_id, parent_id: r.parent_id,
      title: meta.title || null, img: meta.image_link || null,
      url: meta.link || null, price: meta.price ? Number(meta.price) : null,
      availability: meta.availability || null, sku: meta.sku || null,
      imp: Number(r.impressions), clk: Number(r.clicks),
      cost: Number(r.cost), conv: Number(r.conversions), cv: Number(r.conversion_value),
    };
  });

  return res.status(200).json({ ok: true, meta: { from: fromDate, to: toDate, total: products.length }, products });
}

// ── Req3 — Trend Performance ───────────────────────────────────────────────────
async function handleTrendPerformance(client, req, res) {
  let fromDate, toDate;
  if (req.query.from && req.query.to) {
    fromDate = req.query.from;
    toDate   = req.query.to;
  } else {
    const { rows } = await client.query(`SELECT MAX(date) AS latest FROM google_ads.product_performance`);
    const d = new Date(rows[0].latest);
    toDate   = d.toISOString().slice(0, 10);
    const f  = new Date(d); f.setDate(f.getDate() - 29);
    fromDate = f.toISOString().slice(0, 10);
  }

  const spanDays = Math.round((new Date(toDate) - new Date(fromDate)) / 86400000);
  const blEnd    = new Date(fromDate); blEnd.setDate(blEnd.getDate() - 1);
  const blStart  = new Date(blEnd);    blStart.setDate(blStart.getDate() - spanDays);
  const fmt = d => d.toISOString().slice(0, 10);
  const blFrom = fmt(blStart), blTo = fmt(blEnd);

  const { rows: perfRows } = await client.query(`
    SELECT pp.product_item_id, pp.parent_id,
      SUM(CASE WHEN pp.date BETWEEN $1 AND $2 THEN pp.impressions  ELSE 0 END) AS l_imp,
      SUM(CASE WHEN pp.date BETWEEN $1 AND $2 THEN pp.clicks       ELSE 0 END) AS l_clk,
      ROUND(SUM(CASE WHEN pp.date BETWEEN $1 AND $2 THEN pp.cost             ELSE 0 END)::numeric,2) AS l_cost,
      ROUND(SUM(CASE WHEN pp.date BETWEEN $1 AND $2 THEN pp.conversions      ELSE 0 END)::numeric,4) AS l_conv,
      ROUND(SUM(CASE WHEN pp.date BETWEEN $1 AND $2 THEN pp.conversion_value ELSE 0 END)::numeric,2) AS l_cv,
      SUM(CASE WHEN pp.date BETWEEN $3 AND $4 THEN pp.impressions  ELSE 0 END) AS bl_imp,
      SUM(CASE WHEN pp.date BETWEEN $3 AND $4 THEN pp.clicks       ELSE 0 END) AS bl_clk,
      ROUND(SUM(CASE WHEN pp.date BETWEEN $3 AND $4 THEN pp.cost             ELSE 0 END)::numeric,2) AS bl_cost,
      ROUND(SUM(CASE WHEN pp.date BETWEEN $3 AND $4 THEN pp.conversions      ELSE 0 END)::numeric,4) AS bl_conv,
      ROUND(SUM(CASE WHEN pp.date BETWEEN $3 AND $4 THEN pp.conversion_value ELSE 0 END)::numeric,2) AS bl_cv
    FROM google_ads.product_performance pp
    JOIN google_ads.campaigns c ON c.campaign_id = pp.campaign_id
    WHERE (c.campaign_name ILIKE '%Sonya%' OR pp.campaign_id = 20810136438)
      AND pp.date BETWEEN $3 AND $2
      AND pp.product_item_id != ''
    GROUP BY pp.product_item_id, pp.parent_id
    ORDER BY l_cost DESC, bl_cost DESC
    LIMIT 3000
  `, [fromDate, toDate, blFrom, blTo]);

  const ids = perfRows.map(r => r.product_item_id.toLowerCase());
  const { rows: metaRows } = await client.query(`
    SELECT product_id, mpn AS sku FROM google_ads.merchant_products
    WHERE LOWER(product_id) = ANY($1::text[])
  `, [ids]);
  const metaMap = {};
  metaRows.forEach(m => { metaMap[m.product_id.toLowerCase()] = m; });

  const li = n => Number(n) || 0;
  const products = perfRows.map(r => {
    const meta = metaMap[r.product_item_id.toLowerCase()] || {};
    const l_imp = li(r.l_imp), l_clk = li(r.l_clk), l_cost = li(r.l_cost), l_conv = li(r.l_conv), l_cv = li(r.l_cv);
    const bl_imp = li(r.bl_imp), bl_clk = li(r.bl_clk), bl_cost = li(r.bl_cost), bl_conv = li(r.bl_conv), bl_cv = li(r.bl_cv);
    let trend = 'None';
    if (bl_cv > 0) {
      if (l_cv > bl_cv * 1.1) trend = 'Seasonal';
      else if (l_cv < bl_cv * 0.7) trend = 'Drop-off';
    }
    return {
      id: r.product_item_id, parent_id: r.parent_id, sku: meta.sku || null, trend,
      l:  { imp: l_imp,  clk: l_clk,  cost: l_cost,  conv: l_conv,  cv: l_cv,
            ctr: l_imp  > 0 ? Math.round(l_clk  / l_imp  * 10000) / 100 : 0,
            cvr: l_clk  > 0 ? Math.round(l_conv  / l_clk  * 10000) / 100 : 0,
            roas: l_cost > 0 ? Math.round(l_cv   / l_cost * 10000) / 100 : 0 },
      bl: { imp: bl_imp, clk: bl_clk, cost: bl_cost, conv: bl_conv, cv: bl_cv,
            ctr: bl_imp > 0 ? Math.round(bl_clk / bl_imp * 10000) / 100 : 0,
            cvr: bl_clk > 0 ? Math.round(bl_conv / bl_clk * 10000) / 100 : 0,
            roas: bl_cost > 0 ? Math.round(bl_cv / bl_cost * 10000) / 100 : 0 },
    };
  });

  return res.status(200).json({ ok: true, meta: { from: fromDate, to: toDate, bl_from: blFrom, bl_to: blTo, total: products.length }, products });
}

// ── Req4 — Opportunity SKUs ────────────────────────────────────────────────────
async function handleOpportunity(client, req, res) {
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

  const [listingRes, stockRes, mpRes] = await Promise.all([
    client.query(`
      SELECT DISTINCT ON (sku) sku, title, main_image_url, listing_url, price::numeric AS price
      FROM listings.shopify_listings
      WHERE sku = ANY($1::text[]) AND site = 'UK'
      ORDER BY sku, (listing_url ILIKE '%ledsone.co.uk%') DESC
    `, [skus]),
    client.query(`
      SELECT p.sku, SUM(ps.quantity) AS stock
      FROM inventory.products p
      JOIN inventory.physical_product_stock ps ON ps.inventory::varchar = p.id::varchar
      WHERE p.sku = ANY($1::text[])
      GROUP BY p.sku
    `, [skus]),
    client.query(`SELECT mpn AS sku, product_id FROM google_ads.merchant_products WHERE mpn = ANY($1::text[])`, [skus]),
  ]);

  const listingMap = {}, stockMap = {}, sku2ids = {};
  listingRes.rows.forEach(l => { listingMap[l.sku] = l; });
  stockRes.rows.forEach(s => { stockMap[s.sku] = Number(s.stock) || 0; });
  mpRes.rows.forEach(m => {
    if (!sku2ids[m.sku]) sku2ids[m.sku] = [];
    sku2ids[m.sku].push(m.product_id.toLowerCase());
  });

  const allProductIds = [...new Set(mpRes.rows.map(m => m.product_id.toLowerCase()))];
  let adsMap = {};
  if (allProductIds.length > 0) {
    const { rows: adsRows } = await client.query(`
      SELECT pp.product_item_id,
        SUM(pp.impressions) AS imp, SUM(pp.clicks) AS clk,
        ROUND(SUM(pp.cost)::numeric,2) AS cost,
        ROUND(SUM(pp.conversions)::numeric,4) AS conv,
        ROUND(SUM(pp.conversion_value)::numeric,2) AS cv
      FROM google_ads.product_performance pp
      JOIN google_ads.campaigns c ON c.campaign_id = pp.campaign_id
      WHERE (c.campaign_name ILIKE '%Sonya%' OR pp.campaign_id = 20810136438)
        AND pp.date BETWEEN $1 AND $2
        AND LOWER(pp.product_item_id) = ANY($3::text[])
      GROUP BY pp.product_item_id
    `, [fromDate, toDate, allProductIds]);
    adsRows.forEach(a => {
      const pid = a.product_item_id.toLowerCase();
      mpRes.rows.forEach(m => {
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
      sku: r.sku, amz: Number(r.amz)||0, ebay: Number(r.ebay)||0,
      bq: Number(r.bq)||0, shopify: Number(r.shopify)||0, manual: Number(r.manual)||0,
      combined: Number(r.combined)||0,
      imp: ads.imp, clk: ads.clk,
      cost: Math.round(ads.cost*100)/100, conv: Math.round(ads.conv*10000)/10000,
      cv: Math.round(ads.cv*100)/100,
      img: listing.main_image_url||null, url: listing.listing_url||null,
      title: listing.title||null, price: listing.price ? Number(listing.price) : null,
      stock: stockMap[r.sku]||0,
    };
  });

  return res.status(200).json({ ok: true, meta: { from: fromDate, to: toDate, total: products.length }, products });
}

// ── Req5 — Stop Waste Spend ────────────────────────────────────────────────────
async function handleStopWasteSpend(client, req, res) {
  const { rows: dateRows } = await client.query(`SELECT MAX(date) AS latest FROM google_ads.campaign_performance`);
  const latest = new Date(dateRows[0].latest);
  const toDate = latest.toISOString().slice(0, 10);
  const fmt = d => d.toISOString().slice(0, 10);

  const l30Start = new Date(latest); l30Start.setDate(l30Start.getDate() - 29);
  const p30End   = new Date(l30Start); p30End.setDate(p30End.getDate() - 1);
  const p30Start = new Date(p30End);   p30Start.setDate(p30Start.getDate() - 29);
  const p60Start = new Date(p30End);   p60Start.setDate(p60Start.getDate() - 30);
  const d90Start = new Date(latest);   d90Start.setDate(d90Start.getDate() - 89);

  const w = {
    l30_from: fmt(l30Start), l30_to: toDate,
    p30_from: fmt(p30Start), p30_to: fmt(p30End),
    p60_from: fmt(p60Start), p60_to: fmt(p30End),
    d90_from: fmt(d90Start), d90_to: toDate,
  };

  const { rows: campRows } = await client.query(`
    SELECT cp.campaign_id, c.campaign_name, c.budget, c.campaign_status,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.cost             ELSE 0 END)::numeric,2) AS cost30,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversions      ELSE 0 END)::numeric,2) AS conv30,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS cv30,
      SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.impressions ELSE 0 END) AS imp30,
      SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.clicks      ELSE 0 END) AS clk30,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.cost             ELSE 0 END)::numeric,2) AS cost60,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversions      ELSE 0 END)::numeric,2) AS conv60,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS cv60,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.cost             ELSE 0 END)::numeric,2) AS cost90,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.conversions      ELSE 0 END)::numeric,2) AS conv90,
      ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS cv90
    FROM google_ads.campaign_performance cp
    JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
    WHERE (c.campaign_name ILIKE '%Sonya%' OR cp.campaign_id = 20810136438)
      AND cp.date BETWEEN $7 AND $2
    GROUP BY cp.campaign_id, c.campaign_name, c.budget, c.campaign_status
    ORDER BY cost30 DESC NULLS LAST
  `, [w.l30_from, w.l30_to, w.p30_from, w.p30_to, w.p60_from, w.p60_to, w.d90_from]);

  let assetsByCamp = {};
  try {
    const { rows: assetRows } = await client.query(`
      SELECT ap.campaign_id::text AS campaign_id, ap.asset_id::text AS asset_id,
        ROUND(SUM(ap.cost)::numeric,2) AS cost, SUM(ap.clicks) AS clicks
      FROM google_ads.asset_performance ap
      JOIN google_ads.campaigns c ON c.campaign_id::text = ap.campaign_id::text
      WHERE (c.campaign_name ILIKE '%Sonya%' OR c.campaign_id = 20810136438)
        AND ap.date BETWEEN $1 AND $2
        AND ap.conversions < 0.001
      GROUP BY ap.campaign_id, ap.asset_id
      HAVING SUM(ap.cost) > 3 AND SUM(ap.clicks) > 2
      ORDER BY SUM(ap.cost) DESC
    `, [w.d90_from, w.d90_to]);
    assetRows.forEach(a => {
      if (!assetsByCamp[a.campaign_id]) assetsByCamp[a.campaign_id] = [];
      assetsByCamp[a.campaign_id].push({ asset_id: a.asset_id, cost: Number(a.cost), clicks: Number(a.clicks) });
    });
  } catch (e) { console.error('asset_performance query failed:', e.message); }

  let kwByCamp = {};
  try {
    const { rows: kwRows } = await client.query(`
      SELECT st.campaign_id::text AS campaign_id, st.search_term,
        SUM(st.clicks) AS clicks, ROUND(SUM(st.cost)::numeric,2) AS cost
      FROM google_ads.pmax_campaign_search_term_data st
      JOIN google_ads.campaigns c ON c.campaign_id::text = st.campaign_id::text
      WHERE (c.campaign_name ILIKE '%Sonya%' OR c.campaign_id = 20810136438)
        AND st.date BETWEEN $1 AND $2
        AND st.conversions < 0.001
      GROUP BY st.campaign_id, st.search_term
      HAVING SUM(st.clicks) > 5
      ORDER BY SUM(st.clicks) DESC
    `, [w.d90_from, w.d90_to]);
    kwRows.forEach(k => {
      if (!kwByCamp[k.campaign_id]) kwByCamp[k.campaign_id] = [];
      kwByCamp[k.campaign_id].push(k.search_term);
    });
  } catch (e) { console.error('pmax_campaign_search_term_data query failed:', e.message); }

  const campaigns = campRows.map(r => ({
    name: r.campaign_name, id: String(r.campaign_id),
    budget: r.budget ? Number(r.budget) : null, status: r.campaign_status,
    cost30: Number(r.cost30), conv30: Number(r.conv30), cv30: Number(r.cv30),
    imp30: Number(r.imp30), clk30: Number(r.clk30),
    cost60: Number(r.cost60), conv60: Number(r.conv60), cv60: Number(r.cv60),
    cost90: Number(r.cost90), conv90: Number(r.conv90), cv90: Number(r.cv90),
    wasteful_assets: assetsByCamp[String(r.campaign_id)] || [],
    neg_keywords:    kwByCamp[String(r.campaign_id)] || [],
    geo_excludes:    [],
  }));

  return res.status(200).json({ ok: true, meta: w, campaigns });
}

// ── Main handler ───────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const type = req.query.type || '';
  const timeouts = {
    'campaign-performance': 12000,
    'product-performance':  20000,
    'trend-performance':    25000,
    'opportunity':          25000,
    'stop-waste-spend':     30000,
  };

  if (!timeouts[type]) {
    return res.status(400).json({ ok: false, error: `Unknown type "${type}". Valid: ${Object.keys(timeouts).join(', ')}` });
  }

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, cause: 'missing_env', error: 'DATABASE_URL not configured' });

  const client = makeClient(connStr, timeouts[type]);
  try {
    await client.connect();
    if (type === 'campaign-performance') return await handleCampaignPerformance(client, req, res);
    if (type === 'product-performance')  return await handleProductPerformance(client, req, res);
    if (type === 'trend-performance')    return await handleTrendPerformance(client, req, res);
    if (type === 'opportunity')          return await handleOpportunity(client, req, res);
    if (type === 'stop-waste-spend')     return await handleStopWasteSpend(client, req, res);
  } catch (err) {
    return errResponse(res, err);
  } finally {
    await client.end().catch(() => {});
  }
};
