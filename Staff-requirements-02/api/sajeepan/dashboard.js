// Sajeepan Dashboard API
// Req1: campaigns, daily trend, top products
// Req2: waste spend, search term intelligence, cross-platform, 30/60/90 context
// Source: google_ads.campaign_performance + product_performance + merchant_products + order_management
// Filter: 6 Sajeepan PMax campaign IDs

const { Client } = require('pg');

const SJ_CAMPAIGN_IDS = [21069663519, 23110323532, 23516313256, 23590572906, 22079334413, 21242723265];

// Target ROAS per campaign (not stored in DB)
const TARGET_ROAS = {
  '21069663519': 320,
  '23110323532': 320,
  '23516313256': 400,
  '23590572906': 400,
  '22079334413': 380,
  '21242723265': 380,
};

async function handleProdDetail(client, itemId, fromDate, toDate, prevFrom, prevTo) {
  const n = v => Number(v) || 0;

  // Daily trend for this specific product
  const { rows: trendRows } = await client.query(`
    SELECT date,
      SUM(impressions) AS imp, SUM(clicks) AS clk,
      ROUND(SUM(cost)::numeric,2) AS cost,
      ROUND(SUM(conversion_value)::numeric,2) AS cv,
      ROUND(SUM(conversions)::numeric,4) AS conv
    FROM google_ads.product_performance
    WHERE campaign_id = ANY($1::bigint[])
      AND LOWER(product_item_id) = LOWER($2)
      AND date BETWEEN $3 AND $4
    GROUP BY date ORDER BY date ASC
  `, [SJ_CAMPAIGN_IDS, itemId, fromDate, toDate]);

  // Previous period aggregate for this product
  const { rows: prevRows } = await client.query(`
    SELECT
      SUM(impressions) AS imp, SUM(clicks) AS clk,
      ROUND(SUM(cost)::numeric,2) AS cost,
      ROUND(SUM(conversion_value)::numeric,2) AS cv,
      ROUND(SUM(conversions)::numeric,4) AS conv
    FROM google_ads.product_performance
    WHERE campaign_id = ANY($1::bigint[])
      AND LOWER(product_item_id) = LOWER($2)
      AND date BETWEEN $3 AND $4
  `, [SJ_CAMPAIGN_IDS, itemId, prevFrom, prevTo]);

  // Extended merchant_products fields
  const { rows: metaRows } = await client.query(`
    SELECT DISTINCT ON (LOWER(product_id))
      product_id, description, feed_label,
      product_category AS category,
      product_types AS ptype,
      custom_label3 AS label3
    FROM google_ads.merchant_products
    WHERE LOWER(product_id) = LOWER($1)
    ORDER BY LOWER(product_id)
  `, [itemId]);

  const p = prevRows[0] || {};
  const prev = { imp: n(p.imp), clk: n(p.clk), cost: n(p.cost), cv: n(p.cv), conv: n(p.conv) };
  prev.roas = prev.cost > 0 ? Math.round(prev.cv / prev.cost * 10000) / 100 : 0;

  const trend = trendRows.map(r => {
    const cost = n(r.cost), cv = n(r.cv), imp = n(r.imp), clk = n(r.clk);
    return {
      d: r.date.toISOString().slice(0, 10),
      imp, clk, cost, cv, conv: n(r.conv),
      ctr:  imp  > 0 ? Math.round(clk / imp * 10000) / 100 : 0,
      roas: cost > 0 ? Math.round(cv / cost * 10000) / 100 : 0,
    };
  });

  const m = metaRows[0] || {};
  const extra = {
    description: m.description || null,
    feed_label:  m.feed_label  || null,
    category:    m.category    || null,
    ptype:       m.ptype       || null,
    label3:      m.label3      || null,
  };

  return { prev, trend, extra };
}

async function handleReq2(client, toDate, fromDate, prevFrom, prevTo) {
  const n = v => Number(v) || 0;

  // ── 1. Wasteful products: L30, conv=0, cost>5, clicks>0 ──────────────────
  const { rows: wasteRows } = await client.query(`
    SELECT product_item_id, campaign_id::text,
      SUM(clicks) AS clicks, ROUND(SUM(cost)::numeric,2) AS cost,
      SUM(impressions) AS imps
    FROM google_ads.product_performance
    WHERE campaign_id = ANY($1::bigint[])
      AND date BETWEEN $2 AND $3
      AND product_item_id != ''
    GROUP BY product_item_id, campaign_id
    HAVING SUM(conversions)=0 AND SUM(cost)>5 AND SUM(clicks)>0
    ORDER BY cost DESC LIMIT 30
  `, [SJ_CAMPAIGN_IDS, fromDate, toDate]);

  // Metadata for waste products
  const wasteIds = wasteRows.map(r => r.product_item_id.toLowerCase());
  let wasteMeta = {};
  if (wasteIds.length > 0) {
    const { rows: wm } = await client.query(`
      SELECT DISTINCT ON (LOWER(product_id))
        product_id, title, image_link, link, price, availability
      FROM google_ads.merchant_products
      WHERE LOWER(product_id) = ANY($1::text[])
      ORDER BY LOWER(product_id), (CASE WHEN country='GB' THEN 0 ELSE 1 END)
    `, [wasteIds]);
    wm.forEach(r => { wasteMeta[r.product_id.toLowerCase()] = r; });
  }

  const waste_products = wasteRows.map(r => {
    const m = wasteMeta[r.product_item_id.toLowerCase()] || {};
    return {
      item:   r.product_item_id,
      cid:    r.campaign_id,
      clicks: n(r.clicks),
      cost:   n(r.cost),
      imps:   n(r.imps),
      title:  m.title || `Product #${r.product_item_id.split('_').pop()}`,
      img:    m.image_link || '',
      url:    m.link || '',
      price:  m.price ? Number(m.price) : null,
      avail:  m.availability || 'unknown',
    };
  });

  // ── 2. Search term intelligence: L30, conv=0, cost>2 ─────────────────────
  const { rows: kwRows } = await client.query(`
    SELECT search_term, campaign_id::text,
      ROUND(SUM(cost)::numeric,2) AS cost, SUM(clicks) AS clicks, SUM(impressions) AS imps
    FROM google_ads.pmax_campaign_search_term_data
    WHERE campaign_id = ANY($1::bigint[])
      AND date BETWEEN $2 AND $3
      AND conversions = 0
    GROUP BY search_term, campaign_id
    HAVING SUM(cost) > 2
    ORDER BY cost DESC LIMIT 25
  `, [SJ_CAMPAIGN_IDS, fromDate, toDate]);

  const neg_kw = kwRows.map(r => ({
    term:   r.search_term,
    cid:    r.campaign_id,
    cost:   n(r.cost),
    clicks: n(r.clicks),
    imps:   n(r.imps),
    ctr:    n(r.imps) > 0 ? Math.round(n(r.clicks) / n(r.imps) * 10000) / 100 : 0,
  }));

  // ── 3. Campaign budget waste: L vs prev ───────────────────────────────────
  const { rows: bwRows } = await client.query(`
    SELECT campaign_id::text,
      ROUND(SUM(CASE WHEN date BETWEEN $1 AND $2 THEN cost             ELSE 0 END)::numeric,2) AS cost_l,
      ROUND(SUM(CASE WHEN date BETWEEN $1 AND $2 THEN conversion_value ELSE 0 END)::numeric,2) AS cv_l,
      ROUND(SUM(CASE WHEN date BETWEEN $3 AND $4 THEN cost             ELSE 0 END)::numeric,2) AS cost_p,
      ROUND(SUM(CASE WHEN date BETWEEN $3 AND $4 THEN conversion_value ELSE 0 END)::numeric,2) AS cv_p
    FROM google_ads.campaign_performance
    WHERE campaign_id = ANY($5::bigint[])
      AND date BETWEEN $3 AND $2
    GROUP BY campaign_id
  `, [fromDate, toDate, prevFrom, prevTo, SJ_CAMPAIGN_IDS]);

  const budget_waste = bwRows.map(r => {
    const cl = n(r.cost_l), cvl = n(r.cv_l), cp = n(r.cost_p), cvp = n(r.cv_p);
    const roas_l = cl > 0 ? Math.round(cvl / cl * 10000) / 100 : 0;
    const roas_p = cp > 0 ? Math.round(cvp / cp * 10000) / 100 : 0;
    const cost_chg = cp > 0 ? Math.round((cl - cp) / cp * 100) : null;
    const is_waste = cl > cp && roas_l < roas_p;
    return { cid: r.campaign_id, cost_l: cl, cv_l: cvl, roas_l, cost_p: cp, cv_p: cvp, roas_p, cost_chg, is_waste };
  });

  // ── 4. Cross-platform: Amazon/eBay SKUs L30 ───────────────────────────────
  const l30Start = fromDate;
  const { rows: cpRows } = await client.query(`
    SELECT s.source_name, oii.item_sku,
      COUNT(DISTINCT o.id) AS orders_30d,
      SUM(CAST(oii.item_quantity AS int)) AS qty_30d,
      (SELECT mp.title FROM google_ads.merchant_products mp
       WHERE LOWER(mp.mpn) = LOWER(oii.item_sku) AND mp.country = 'GB' LIMIT 1) AS product_title
    FROM order_management.orders o
    JOIN order_management.sub_source ss ON ss.id = o.sub_source_id
    JOIN order_management.source s ON s.id = ss.source_id
    JOIN order_management.order_item_info oii ON oii.order_id = o.id
    WHERE o.order_date >= $1
      AND s.source_name IN ('AMAZON','EBAY')
      AND oii.item_sku IS NOT NULL AND oii.item_sku != ''
    GROUP BY s.source_name, oii.item_sku
    HAVING COUNT(DISTINCT o.id) >= 3
    ORDER BY orders_30d DESC LIMIT 15
  `, [l30Start]);

  // Top search terms by clicks+imps for SJ campaigns in period
  const { rows: stTopRows } = await client.query(`
    SELECT search_term, SUM(clicks) AS clicks, SUM(impressions) AS imps, ROUND(SUM(cost)::numeric,2) AS cost
    FROM google_ads.pmax_campaign_search_term_data
    WHERE campaign_id = ANY($1::bigint[]) AND date BETWEEN $2 AND $3
    GROUP BY search_term
    ORDER BY (SUM(clicks) + SUM(impressions)) DESC
    LIMIT 300
  `, [SJ_CAMPAIGN_IDS, fromDate, toDate]);

  // Match each SKU's product title words against top search terms
  const STOP = new Set(['the','and','for','with','led','light','watt','pack','set','new','uk','in','a','of','to','cm','mm']);
  function matchTermsForTitle(title) {
    if (!title) return [];
    const words = title.toLowerCase().split(/[\s\-\/]+/)
      .filter(w => w.length > 3 && !STOP.has(w));
    if (!words.length) return [];
    return stTopRows
      .filter(st => words.some(w => st.search_term.toLowerCase().includes(w)))
      .slice(0, 5)
      .map(st => ({ term: st.search_term, clicks: n(st.clicks), imps: n(st.imps), cost: n(st.cost) }));
  }

  const cross_platform = cpRows.map(r => ({
    source:        r.source_name,
    sku:           r.item_sku,
    title:         r.product_title || null,
    orders_30d:    n(r.orders_30d),
    qty_30d:       n(r.qty_30d),
    search_terms:  matchTermsForTitle(r.product_title),
  }));

  // ── 5. Rolling 30/60/90 windows ──────────────────────────────────────────
  const d = new Date(toDate);
  const d30 = new Date(d); d30.setDate(d30.getDate() - 29);
  const d60 = new Date(d); d60.setDate(d60.getDate() - 59);
  const d90 = new Date(d); d90.setDate(d90.getDate() - 89);
  const fmt = x => x.toISOString().slice(0, 10);

  const { rows: windowRows } = await client.query(`
    SELECT
      ROUND(SUM(CASE WHEN date >= $1 THEN cost             ELSE 0 END)::numeric,2) AS cost_30,
      ROUND(SUM(CASE WHEN date >= $1 THEN conversion_value ELSE 0 END)::numeric,2) AS cv_30,
      ROUND(SUM(CASE WHEN date >= $1 THEN conversions      ELSE 0 END)::numeric,2) AS conv_30,
      ROUND(SUM(CASE WHEN date >= $2 THEN cost             ELSE 0 END)::numeric,2) AS cost_60,
      ROUND(SUM(CASE WHEN date >= $2 THEN conversion_value ELSE 0 END)::numeric,2) AS cv_60,
      ROUND(SUM(CASE WHEN date >= $2 THEN conversions      ELSE 0 END)::numeric,2) AS conv_60,
      ROUND(SUM(CASE WHEN date >= $3 THEN cost             ELSE 0 END)::numeric,2) AS cost_90,
      ROUND(SUM(CASE WHEN date >= $3 THEN conversion_value ELSE 0 END)::numeric,2) AS cv_90,
      ROUND(SUM(CASE WHEN date >= $3 THEN conversions      ELSE 0 END)::numeric,2) AS conv_90
    FROM google_ads.campaign_performance
    WHERE campaign_id = ANY($4::bigint[]) AND date >= $3
  `, [fmt(d30), fmt(d60), fmt(d90), SJ_CAMPAIGN_IDS]);

  const w = windowRows[0] || {};
  const windows = {
    d30: { cost: n(w.cost_30), cv: n(w.cv_30), conv: n(w.conv_30), roas: n(w.cost_30) > 0 ? Math.round(n(w.cv_30) / n(w.cost_30) * 10000) / 100 : 0 },
    d60: { cost: n(w.cost_60), cv: n(w.cv_60), conv: n(w.conv_60), roas: n(w.cost_60) > 0 ? Math.round(n(w.cv_60) / n(w.cost_60) * 10000) / 100 : 0 },
    d90: { cost: n(w.cost_90), cv: n(w.cv_90), conv: n(w.conv_90), roas: n(w.cost_90) > 0 ? Math.round(n(w.cv_90) / n(w.cost_90) * 10000) / 100 : 0 },
  };

  return { waste_products, neg_kw, budget_waste, cross_platform, windows };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, error: 'DATABASE_URL not configured' });

  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000, statement_timeout: 30000 });

  try {
    await client.connect();

    // Resolve date window
    let fromDate, toDate;
    if (req.query.from && req.query.to) {
      fromDate = req.query.from;
      toDate   = req.query.to;
    } else {
      const { rows } = await client.query(`SELECT MAX(date) AS latest FROM google_ads.campaign_performance WHERE campaign_id = ANY($1::bigint[])`, [SJ_CAMPAIGN_IDS]);
      const d = new Date(rows[0].latest);
      toDate   = d.toISOString().slice(0, 10);
      const f  = new Date(d); f.setDate(f.getDate() - 29);
      fromDate = f.toISOString().slice(0, 10);
    }

    // Prev period: same span immediately before fromDate
    const spanDays = Math.round((new Date(toDate) - new Date(fromDate)) / 86400000);
    const prevEnd  = new Date(fromDate); prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd); prevStart.setDate(prevStart.getDate() - spanDays);
    const fmt = d => d.toISOString().slice(0, 10);
    const prevFrom = fmt(prevStart), prevTo = fmt(prevEnd);

    // Route by ?type=
    const type = req.query.type || 'req1';
    if (type === 'req2') {
      const r2 = await handleReq2(client, toDate, fromDate, prevFrom, prevTo);
      return res.status(200).json({ ok: true, meta: { from: fromDate, to: toDate, prev_from: prevFrom, prev_to: prevTo }, ...r2 });
    }

    if (type === 'proddetail') {
      const item = (req.query.item || '').trim();
      if (!item) return res.status(400).json({ ok: false, error: 'item param required' });
      const detail = await handleProdDetail(client, item, fromDate, toDate, prevFrom, prevTo);
      return res.status(200).json({ ok: true, meta: { from: fromDate, to: toDate, prev_from: prevFrom, prev_to: prevTo }, ...detail });
    }

    // ── 1. Campaign overview (L + prev) ──────────────────────────────────
    const { rows: campRows } = await client.query(`
      SELECT
        cp.campaign_id,
        c.campaign_name,
        c.budget,
        c.campaign_status,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.cost             ELSE 0 END)::numeric,2) AS cost_l,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversions      ELSE 0 END)::numeric,2) AS conv_l,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS cv_l,
        SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.impressions ELSE 0 END) AS imp_l,
        SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.clicks      ELSE 0 END) AS clk_l,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.cost             ELSE 0 END)::numeric,2) AS cost_p,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversions      ELSE 0 END)::numeric,2) AS conv_p,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversion_value ELSE 0 END)::numeric,2) AS cv_p,
        SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.impressions ELSE 0 END) AS imp_p,
        SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.clicks      ELSE 0 END) AS clk_p
      FROM google_ads.campaign_performance cp
      JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
      WHERE cp.campaign_id = ANY($5::bigint[])
        AND cp.date BETWEEN $3 AND $2
      GROUP BY cp.campaign_id, c.campaign_name, c.budget, c.campaign_status
      ORDER BY cost_l DESC NULLS LAST
    `, [fromDate, toDate, prevFrom, prevTo, SJ_CAMPAIGN_IDS]);

    // ── 2. Daily trend ────────────────────────────────────────────────────
    const { rows: trendRows } = await client.query(`
      SELECT
        date,
        ROUND(SUM(cost)::numeric,2)              AS cost,
        ROUND(SUM(conversion_value)::numeric,2)  AS cv,
        ROUND(SUM(conversions)::numeric,2)       AS conv
      FROM google_ads.campaign_performance
      WHERE campaign_id = ANY($1::bigint[])
        AND date BETWEEN $2 AND $3
      GROUP BY date
      ORDER BY date ASC
    `, [SJ_CAMPAIGN_IDS, fromDate, toDate]);

    // ── 3. Product performance (two-step) ─────────────────────────────────
    const { rows: perfRows } = await client.query(`
      SELECT
        pp.product_item_id,
        pp.campaign_id::text AS campaign_id,
        SUM(pp.impressions)                          AS imp,
        SUM(pp.clicks)                               AS clk,
        ROUND(SUM(pp.cost)::numeric,2)               AS cost,
        ROUND(SUM(pp.conversions)::numeric,4)        AS conv,
        ROUND(SUM(pp.conversion_value)::numeric,2)   AS cv
      FROM google_ads.product_performance pp
      WHERE pp.campaign_id = ANY($1::bigint[])
        AND pp.date BETWEEN $2 AND $3
        AND pp.product_item_id != ''
      GROUP BY pp.product_item_id, pp.campaign_id
      ORDER BY cv DESC
      LIMIT 500
    `, [SJ_CAMPAIGN_IDS, fromDate, toDate]);

    // Step 2 — metadata lookup
    const ids = perfRows.map(r => r.product_item_id.toLowerCase());
    let metaMap = {};
    if (ids.length > 0) {
      const { rows: metaRows } = await client.query(`
        SELECT DISTINCT ON (LOWER(product_id))
          product_id, title, image_link, link, price, availability, brand, mpn AS sku,
          feed_label, product_category AS category, product_types AS ptype,
          custom_label3 AS label3
        FROM google_ads.merchant_products
        WHERE LOWER(product_id) = ANY($1::text[])
        ORDER BY LOWER(product_id)
      `, [ids]);
      metaRows.forEach(m => { metaMap[m.product_id.toLowerCase()] = m; });
    }

    // Build response
    const n = v => Number(v) || 0;

    const campaigns = campRows.map(r => {
      const cost_l = n(r.cost_l), cv_l = n(r.cv_l), conv_l = n(r.conv_l);
      const imp_l  = n(r.imp_l),  clk_l = n(r.clk_l);
      const cost_p = n(r.cost_p), cv_p  = n(r.cv_p),  conv_p = n(r.conv_p);
      const roas_l = cost_l > 0 ? Math.round(cv_l / cost_l * 10000) / 100 : 0;
      const roas_p = cost_p > 0 ? Math.round(cv_p / cost_p * 10000) / 100 : 0;
      const id = String(r.campaign_id);
      return {
        id,
        name:       r.campaign_name,
        status:     r.campaign_status,
        budget:     r.budget ? Number(r.budget) : null,
        target_roas: TARGET_ROAS[id] || 300,
        l:   { cost: cost_l, cv: cv_l, conv: conv_l, imp: imp_l, clk: clk_l, roas: roas_l },
        prev:{ cost: cost_p, cv: cv_p,  conv: conv_p, roas: roas_p },
      };
    });

    const trend = trendRows.map(r => ({
      d:    r.date.toISOString().slice(5, 10).replace('-', '/'),  // MM/DD
      cost: n(r.cost),
      cv:   n(r.cv),
      conv: n(r.conv),
      roas: n(r.cost) > 0 ? Math.round(n(r.cv) / n(r.cost) * 10000) / 100 : 0,
    }));

    const products = perfRows.map(r => {
      const meta = metaMap[r.product_item_id.toLowerCase()] || {};
      const cost = n(r.cost), cv = n(r.cv), conv = n(r.conv), imp = n(r.imp), clk = n(r.clk);
      const roas = cost > 0 ? Math.round(cv / cost * 10000) / 100 : 0;
      return {
        item:  r.product_item_id,
        cid:   r.campaign_id,
        cost, cv, conv,
        imps:  imp,
        clicks: clk,
        roas,
        title:  meta.title       || `Product #${r.product_item_id.split('_').pop()}`,
        img:    meta.image_link  || '',
        url:    meta.link        || '',
        price:  meta.price       ? Number(meta.price) : null,
        avail:  meta.availability|| 'unknown',
        brand:      meta.brand       || 'LEDSone',
        type:       meta.ptype       || 'Lighting',
        sku:        meta.sku         || null,
        feed_label: meta.feed_label  || null,
        cat:        meta.category    || null,
        label3:     meta.label3      || null,
      };
    });

    return res.status(200).json({
      ok: true,
      meta: { from: fromDate, to: toDate, prev_from: prevFrom, prev_to: prevTo, total_products: products.length },
      campaigns,
      trend,
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
