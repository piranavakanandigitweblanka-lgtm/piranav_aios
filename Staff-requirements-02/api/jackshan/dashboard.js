// Jackshan Dashboard — LEDSone UK · GSC + Sales
// ?type=req1  → GSC priority keyword per product (90d) + meta title/desc + H1 + action
// ?type=req2  → Product sales (weekly/monthly) + GSC page stats (30d) + optimize flag
// sub_source 104 = ledsone (ledsone.co.uk)

const { Client } = require('pg');

const SUB_SOURCE = 104;
const BASE_URL   = 'https://ledsone.co.uk/products/';

// Jackshan's allocated product handles
const HANDLES = [
  'ip68-waterproof-junction-box-outdoor-for-electrical-cable-wire-connector-5599',
  'rose-gold-lamp-shade-cap-for-pendant-light-socket-holder-fitting',
  '40cm-black-metal-dome-pendant-light',
  'modern-vintage-pendant-light-fitting-retro-industrial-style-e27-lamp-holder',
  'pendant-light-fitting-ceiling-rose-e27-suspension-set-fabric-corded-rose-gold',
  'tiffany-style-ceiling-pendant-hanging-mediterranean-style-lamp-light-decorative-home-4541',
  'brushed-silver-metal-industrial-hanging-pendant-lighting-adjustable-hanging-barn-light',
  'industrial-pendant-lighting-with-32cm-orange-lampshade-over-the-kitchen-island',
  'lamp-shade-spring-clip-retainer-for-lamp-part-shades-5963',
  'french-gold-pendant-lights-gold-ceiling-lights-metal-industrial-light-shade',
  'e27-g95-40w-dimmable-antique-globe-industrial-retro-bulb',
  'dc12v-60w-ip20-mini-universal-regulated-switching-led-transformer',
  'industrial-vintage-style-wall-or-ceiling-light-b22-bar-conduits-light',
  '3-light-bulb-guard-cage-cluster-pendant-lights',
  'conduit-pipe-table-lamp-with-dimmer-switch-industrial-steampunk-light-5651',
  '28w-compact-led-driver-ac-230v-to-dc12v-power-supply-transformer',
  '3-light-ceiling-pendant-light-with-pulley-system',
  'light-fixing-strap-brace-ceiling-rose-155mm-bracket-plate-with-accessories',
  'ceramic-porcelain-type-6-es-e27-edison-screw-heat-bulb-lamp-holder',
  '2pcs-bath-pedestal-rug-set-soft-non-slip-water-absorbent-mat-sets-5393',
  'cone-wall-light',
  'copper-lamp-shade-cap-for-pendant-light-socket-holder-fitting',
  'dc12v-15w-led-driver-power-supply-transformer',
  'warm-white-12v-led-waterproof-modules-ip67-outdoor-5677',
  '5-x-vintage-pendant-cord-grip-strain-relief-metal-cable-lock-10mm-nut-6048',
  'pipe-lighting-accessories-iron-5way-cross',
  'industrial-vintage-various-colours-ceiling-light-fitting-e27-pendant-holder',
  '3-core-army-green-round-vintage-italian-braided-fabric-cable-flex-0-75mm-uk',
  'dc24v-ip67-30w-waterproof-led-driver-power-supply-transformer',
  'screw-e27-white-plain-holder-bakelite-lamp-holder',
  'vintage-e27-edison-screw-3w-filament-bulb-warm-white-2000k-amber-glass-5073',
  '3-outlet-500mm-black-metal-ceiling-rose-square',
  'red-wicker-rattan-lampshade-ceiling-pendant-light',
  'black-finished-industrial-adjustable-pendant-light-fixture',
  'plug-in-wall-light-kit-dimmer-uk-plug-flex-wire',
  'orange-painted-metal-shade-lighting-vintage-pendant-light',
  'vintage-edison-led-filament-bulb-g80-b22-4w-dimmable',
  'fabric-hemp-flex-cable-kit-black-plug-in-pendant-lamp-light-e27-fitting-vintage-lamp',
  'industrial-style-ceiling-light-three-b22-bar-conduits-light',
  'black-bakelite-lamp-holder-industrial-socket-light-bulb-holder-5735',
  '1m-white-pendant-light-holder',
  'hemp-rope-metal-pendant-light-spider-light-hanging-light',
  'conduit-light-shade-5570',
  'retro-vintage-1cm-hole-barrel-cage-design-rattan-style-lamp-light-shades-4219',
  '105mm-bracket-strap-brace-plate-with-accessories-ceiling-rose-light-fixing',
  'linear-cage-pendant-light-fixture',
  'b22-t185-60w-dimmable-vintage-light-filament-bulb',
  'design-women-toe-post-flip-flop-beach-slipper-for-sea',
  'industrial-ribbed-glass-wall-lights-replacement-lampshades-for-wall-lights',
  '3-way-modern-black-ceiling-pendant-cluster-light-fitting-industrial-pendant-lampshade',
];

const PAGES = HANDLES.map(h => BASE_URL + h);

// Action logic from Jackshan's CSV spec
function calcAction(clicks, impressions) {
  if (clicks >= 2)  return 'Rewrite meta tags + re-optimize keywords';
  if (clicks === 1) return 'Rewrite meta tags + re-optimize keywords';
  if (impressions >= 50) return 'Check intent mismatch before optimizing';
  return 'Do not optimize';
}

// Optimize status for Req 2
function calcOptimize(monthlySales, ctr) {
  if (monthlySales >= 1 && ctr >= 5) return 'Do Not Optimize';
  return 'Optimize';
}

async function handleReq1(client, days, fromOverride, toOverride) {
  let fromStr, toStr;
  if (fromOverride && toOverride) {
    fromStr = fromOverride;
    toStr   = toOverride;
  } else {
    const d = days > 0 ? days - 1 : 89;
    const from = new Date(); from.setDate(from.getDate() - d);
    fromStr = from.toISOString().slice(0, 10);
    toStr   = new Date().toISOString().slice(0, 10);
  }

  // 1. Page-level GSC stats (90d)
  const { rows: pageRows } = await client.query(`
    SELECT page,
      SUM(clicks)::int       AS page_clicks,
      SUM(impressions)::int  AS page_imp,
      ROUND(AVG(ctr)::numeric * 100, 2) AS avg_ctr,
      ROUND(AVG(position)::numeric, 1)  AS avg_pos
    FROM google_search_console.page
    WHERE sub_source = $1 AND search_type = 'web'
      AND page = ANY($2::text[]) AND date BETWEEN $3 AND $4
    GROUP BY page
  `, [SUB_SOURCE, PAGES, fromStr, toStr]);

  const pageMap = {};
  pageRows.forEach(r => { pageMap[r.page] = r; });

  // 2. Top keyword per page by clicks — use query_page
  const { rows: kwRows } = await client.query(`
    SELECT DISTINCT ON (page) page, query,
      SUM(clicks) OVER (PARTITION BY page, query)::int       AS kw_clicks,
      SUM(impressions) OVER (PARTITION BY page, query)::int  AS kw_imp,
      ROUND(AVG(position) OVER (PARTITION BY page, query)::numeric, 1) AS kw_pos
    FROM google_search_console.query_page
    WHERE sub_source = $1 AND search_type = 'web'
      AND page = ANY($2::text[]) AND date BETWEEN $3 AND $4
    ORDER BY page, SUM(clicks) OVER (PARTITION BY page, query) DESC,
             SUM(impressions) OVER (PARTITION BY page, query) DESC
  `, [SUB_SOURCE, PAGES, fromStr, toStr]);

  const kwMap = {};
  kwRows.forEach(r => { kwMap[r.page] = r; });

  // 3. Meta title + desc via handle → shopify_listings → listing_meta
  const { rows: metaRows } = await client.query(`
    SELECT sl.shopify_handle, m.title_tag, m.description_tag, sl.title AS h1
    FROM listings.shopify_listings sl
    LEFT JOIN listings.shopify_listing_meta m ON m.product_id = sl.item_id::bigint
    WHERE sl.sub_source = $1 AND sl.is_parent = 1
      AND sl.shopify_handle = ANY($2::text[])
  `, [SUB_SOURCE, HANDLES]);

  const metaMap = {};
  metaRows.forEach(r => { metaMap[r.shopify_handle] = r; });

  const n = v => Number(v) || 0;
  const products = HANDLES.map(handle => {
    const url  = BASE_URL + handle;
    const pg   = pageMap[url] || {};
    const kw   = kwMap[url]   || {};
    const meta = metaMap[handle] || {};
    const clicks = n(pg.page_clicks);
    const imp    = n(pg.page_imp);
    return {
      url,
      handle,
      keyword:     kw.query || 'No keyword data',
      pageClicks:  clicks,
      pageImp:     imp,
      pageCtr:     n(pg.avg_ctr),
      pagePos:     n(pg.avg_pos),
      kwClicks:    n(kw.kw_clicks),
      kwImp:       n(kw.kw_imp),
      kwPos:       n(kw.kw_pos),
      metaTitle:   meta.title_tag  || '',
      metaDesc:    meta.description_tag || '',
      h1:          meta.h1 || '',
      action:      calcAction(clicks, imp),
      hasGsc:      !!pg.page_imp,
    };
  });

  return { products, meta: { from: fromStr, to: toStr } };
}

async function handleReq2(client, days, fromOverride, toOverride) {
  const now = new Date();
  let from30Str, from7Str, toStr;
  if (fromOverride && toOverride) {
    from30Str = fromOverride;
    toStr     = toOverride;
    const to  = new Date(toOverride);
    const f7  = new Date(to); f7.setDate(f7.getDate() - 6);
    from7Str  = f7.toISOString().slice(0, 10);
  } else {
    const d = days > 0 ? days - 1 : 29;
    const fromMain = new Date(now); fromMain.setDate(fromMain.getDate() - d);
    const from7    = new Date(now); from7.setDate(from7.getDate() - 6);
    from30Str = fromMain.toISOString().slice(0, 10);
    from7Str  = from7.toISOString().slice(0, 10);
    toStr     = now.toISOString().slice(0, 10);
  }

  // 1. Page GSC stats 30d
  const { rows: pageRows } = await client.query(`
    SELECT page,
      SUM(clicks)::int       AS clicks,
      SUM(impressions)::int  AS imp,
      ROUND(AVG(ctr)::numeric * 100, 2) AS ctr,
      ROUND(AVG(position)::numeric, 1)  AS pos
    FROM google_search_console.page
    WHERE sub_source = $1 AND search_type = 'web'
      AND page = ANY($2::text[]) AND date BETWEEN $3 AND $4
    GROUP BY page
  `, [SUB_SOURCE, PAGES, from30Str, toStr]);

  const pageMap = {};
  pageRows.forEach(r => { pageMap[r.page] = r; });

  // 2. Orders by handle (weekly + monthly) via order_item_info.handle
  const { rows: ordRows } = await client.query(`
    SELECT oi.handle,
      COUNT(DISTINCT CASE WHEN o.order_date::date >= $3 THEN o.id END)::int AS weekly_sales,
      COUNT(DISTINCT CASE WHEN o.order_date::date >= $2 THEN o.id END)::int AS monthly_sales
    FROM order_management.orders o
    JOIN order_management.order_item_info oi ON oi.order_id = o.id
    WHERE o.sub_source_id = $1
      AND o.order_date::date BETWEEN $2 AND $5
      AND oi.handle = ANY($4::text[])
    GROUP BY oi.handle
  `, [SUB_SOURCE, from30Str, from7Str, HANDLES, toStr]);

  const ordMap = {};
  ordRows.forEach(r => { ordMap[r.handle] = r; });

  // 3. Product titles
  const { rows: titleRows } = await client.query(`
    SELECT shopify_handle, title
    FROM listings.shopify_listings
    WHERE sub_source = $1 AND is_parent = 1 AND shopify_handle = ANY($2::text[])
  `, [SUB_SOURCE, HANDLES]);

  const titleMap = {};
  titleRows.forEach(r => { titleMap[r.shopify_handle] = r.title; });

  const n = v => Number(v) || 0;
  const products = HANDLES.map(handle => {
    const url  = BASE_URL + handle;
    const pg   = pageMap[url] || {};
    const ord  = ordMap[handle] || {};
    const ctr  = n(pg.ctr);
    const ms   = n(ord.monthly_sales);
    return {
      url,
      handle,
      title:         titleMap[handle] || handle,
      weeklySales:   n(ord.weekly_sales),
      monthlySales:  ms,
      clicks:        n(pg.clicks),
      imp:           n(pg.imp),
      ctr,
      pos:           n(pg.pos),
      status:        calcOptimize(ms, ctr),
    };
  });

  return { products, meta: { from: from30Str, to: toStr } };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=120');

  const connStr = process.env.DATABASE_URL;
  if (!connStr) return res.status(500).json({ ok: false, error: 'DATABASE_URL not configured' });

  const type = req.query.type || 'req1';
  const client = new Client({
    connectionString: connStr, ssl: false,
    connectionTimeoutMillis: 15000, statement_timeout: 55000,
  });

  try {
    await client.connect();
    let result;
    const days = parseInt(req.query.days, 10) || 0;
    const fromP = req.query.from || null;
    const toP   = req.query.to   || null;
    if      (type === 'req1') result = await handleReq1(client, days || 90, fromP, toP);
    else if (type === 'req2') result = await handleReq2(client, days || 30, fromP, toP);
    else return res.status(400).json({ ok: false, error: 'Unknown type: ' + type });
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    const msg = err.message || '';
    const cause = /timeout|ETIMEDOUT|ECONNREFUSED/i.test(msg) ? 'network_timeout' : 'unknown';
    return res.status(500).json({ ok: false, cause, error: msg });
  } finally {
    await client.end().catch(() => {});
  }
};
