// Combined SEO API — routes by ?module= to avoid Vercel Hobby function limit
// ?module=exec     &type=gsc-monthly|position-dist|ads-monthly|data-quality
// ?module=products &type=pages|listings
// ?module=keywords &type=top|opportunity|rising|declining
// ?module=landing  &type=pages|by-type|top-pages

const { Client } = require('pg');

const ADS_ACCOUNT   = 4503486236;
const GSC_SUB_SOURCE = 104;

function makeClient(connStr) {
  return new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    statement_timeout: 30000,
  });
}

function errResponse(res, err) {
  const msg = err.message || '';
  let cause = 'unknown';
  if (/password|authentication|SASL/i.test(msg))                 cause = 'authentication';
  else if (/timeout|ETIMEDOUT|ECONNREFUSED|ENOTFOUND/i.test(msg)) cause = 'network_timeout';
  else if (/ssl|TLS/i.test(msg))                                 cause = 'ssl';
  else if (/permission denied/i.test(msg))                       cause = 'missing_permissions';
  return res.status(500).json({ ok: false, cause, error: msg });
}

/* ─── EXEC ─────────────────────────────────────────────────── */

async function handleGscMonthly(client, res) {
  const { rows } = await client.query(`
    SELECT
      DATE_TRUNC('month', date)::date  AS month,
      COUNT(DISTINCT date)::int        AS days_with_data,
      SUM(clicks)::int                 AS clicks,
      SUM(impressions)::int            AS impressions,
      ROUND(AVG(position)::numeric, 2) AS avg_position
    FROM google_search_console.overview
    WHERE sub_source = $1 AND search_type = 'web'
    GROUP BY DATE_TRUNC('month', date)
    ORDER BY month ASC
  `, [GSC_SUB_SOURCE]);
  return res.status(200).json({
    ok: true,
    data_note: 'PostgreSQL GSC pipeline — clicks ≈ 50% of Google Search Console totals.',
    rows,
  });
}

async function handlePositionDist(client, res) {
  const { rows } = await client.query(`
    SELECT
      CASE
        WHEN position <= 3  THEN 'pos_1_3'
        WHEN position <= 10 THEN 'pos_4_10'
        WHEN position <= 20 THEN 'pos_11_20'
        WHEN position <= 50 THEN 'pos_21_50'
        ELSE                     'pos_51_100'
      END AS bucket,
      COUNT(DISTINCT query)::int AS query_count,
      SUM(clicks)::int           AS clicks,
      SUM(impressions)::int      AS impressions
    FROM google_search_console.query
    WHERE sub_source = $1 AND search_type = 'web'
      AND date >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY bucket
    ORDER BY MIN(position)
  `, [GSC_SUB_SOURCE]);
  return res.status(200).json({ ok: true, rows });
}

async function handleAdsMonthly(client, res) {
  const { rows } = await client.query(`
    SELECT
      DATE_TRUNC('month', cp.date)::date                                  AS month,
      COUNT(DISTINCT cp.campaign_id)::int                                  AS active_campaigns,
      SUM(cp.clicks)::int                                                  AS clicks,
      SUM(cp.impressions)::int                                             AS impressions,
      ROUND(SUM(cp.cost)::numeric, 2)                                      AS cost_gbp,
      ROUND(SUM(cp.conversion_value)::numeric, 2)                          AS conv_value_gbp,
      ROUND((SUM(cp.conversion_value)/NULLIF(SUM(cp.cost),0))::numeric, 4) AS roas
    FROM google_ads.campaign_performance cp
    JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
    WHERE c.account_id = $1
    GROUP BY DATE_TRUNC('month', cp.date)
    ORDER BY month ASC
  `, [ADS_ACCOUNT]);
  return res.status(200).json({ ok: true, rows });
}

async function handleDataQuality(client, res) {
  const [gscQ, adsQ] = await Promise.all([
    client.query(`SELECT MIN(date) AS earliest, MAX(date) AS latest, COUNT(DISTINCT date)::int AS total_days
                  FROM google_search_console.overview WHERE sub_source=$1 AND search_type='web'`, [GSC_SUB_SOURCE]),
    client.query(`SELECT MIN(cp.date) AS earliest, MAX(cp.date) AS latest
                  FROM google_ads.campaign_performance cp
                  JOIN google_ads.campaigns c ON c.campaign_id=cp.campaign_id
                  WHERE c.account_id=$1`, [ADS_ACCOUNT]),
  ]);
  return res.status(200).json({
    ok: true,
    sources: {
      semrush:    { status:'static_csv', coverage:'Jul 2023–Jun 2026', months:36, note:'Loaded from master dataset CSV.' },
      gsc:        { status:'live', earliest:gscQ.rows[0].earliest, latest:gscQ.rows[0].latest, total_days:gscQ.rows[0].total_days, note:'Clicks ≈ 50% of true GSC totals.' },
      google_ads: { status:'live', earliest:adsQ.rows[0].earliest, latest:adsQ.rows[0].latest, account_id:ADS_ACCOUNT, note:'UK account GBP. cost column is already GBP.' },
      ga4:        { status:'limited', coverage:'Mar–Apr 2026 aggregate only', note:'Not reliable for monthly KPIs.' },
      shopify:    { status:'unavailable', note:'MCP connection failed. Organic revenue not available.' },
    },
  });
}

/* ─── PRODUCTS ──────────────────────────────────────────────── */

async function handleProductPages(client, res, from, to) {
  const [pagesRes, kwRes] = await Promise.all([
    client.query(`
      SELECT page,
        SUM(clicks)::int                                                    AS clicks,
        SUM(impressions)::int                                               AS impressions,
        ROUND((SUM(clicks)::numeric/NULLIF(SUM(impressions),0))*100, 3)    AS ctr_pct,
        ROUND(AVG(position)::numeric, 1)                                    AS avg_position,
        COUNT(DISTINCT date)::int                                           AS days_with_data
      FROM google_search_console.page
      WHERE sub_source=$1 AND search_type='web'
        AND page ILIKE '%ledsone.co.uk/products/%'
        AND date BETWEEN $2 AND $3
      GROUP BY page ORDER BY clicks DESC LIMIT 2000
    `, [GSC_SUB_SOURCE, from, to]),
    client.query(`
      WITH ranked AS (
        SELECT qp.page, qp.query, SUM(qp.clicks)::int AS kw_clicks,
          ROW_NUMBER() OVER (PARTITION BY qp.page ORDER BY SUM(qp.clicks) DESC) AS rn
        FROM google_search_console.query_page qp
        WHERE qp.sub_source=$1 AND qp.search_type='web'
          AND qp.page ILIKE '%ledsone.co.uk/products/%'
          AND qp.date BETWEEN $2 AND $3
        GROUP BY qp.page, qp.query
      )
      SELECT page, query AS top_query, kw_clicks AS top_query_clicks FROM ranked WHERE rn=1
    `, [GSC_SUB_SOURCE, from, to]),
  ]);
  const kwMap = {};
  kwRes.rows.forEach(r => { kwMap[r.page] = { top_query:r.top_query, top_query_clicks:parseInt(r.top_query_clicks)||0 }; });
  const rows = pagesRes.rows.map(r => ({
    page:             r.page,
    clicks:           parseInt(r.clicks)||0,
    impressions:      parseInt(r.impressions)||0,
    ctr_pct:          parseFloat(r.ctr_pct)||0,
    avg_position:     parseFloat(r.avg_position)||0,
    days_with_data:   parseInt(r.days_with_data)||0,
    top_query:        kwMap[r.page]?.top_query || null,
    top_query_clicks: kwMap[r.page]?.top_query_clicks || null,
  }));
  return res.status(200).json({ ok: true, from, to, total:rows.length, data_note:'clicks ≈ 50% of true GSC totals.', rows });
}

async function handleListings(client, res) {
  const { rows } = await client.query(`
    SELECT shopify_handle AS handle, title
    FROM listings.shopify_listings
    WHERE sub_source=$1 AND is_parent=1
    ORDER BY shopify_handle
  `, [GSC_SUB_SOURCE]);
  return res.status(200).json({ ok:true, count:rows.length, rows });
}

/* ─── KEYWORDS ──────────────────────────────────────────────── */

async function getLatestDate(client) {
  const { rows } = await client.query(
    `SELECT MAX(date) AS latest FROM google_search_console.query WHERE sub_source=$1`, [GSC_SUB_SOURCE]);
  return rows[0].latest ? new Date(rows[0].latest) : new Date();
}
function addDays(d, n) { const r=new Date(d); r.setDate(r.getDate()+n); return r.toISOString().slice(0,10); }

async function handleKwTop(client, res, from, to) {
  const [kwRes, pageRes] = await Promise.all([
    client.query(`
      SELECT query,
        SUM(clicks)::int                                                 AS clicks,
        SUM(impressions)::int                                            AS impressions,
        ROUND((SUM(clicks)::numeric/NULLIF(SUM(impressions),0))*100,3)  AS ctr_pct,
        ROUND(AVG(position)::numeric,1)                                  AS avg_position
      FROM google_search_console.query
      WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
      GROUP BY query ORDER BY clicks DESC LIMIT 500
    `, [GSC_SUB_SOURCE, from, to]),
    client.query(`
      WITH top_kw AS (
        SELECT query FROM google_search_console.query
        WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
        GROUP BY query ORDER BY SUM(clicks) DESC LIMIT 500
      ), ranked AS (
        SELECT qp.query, qp.page,
          ROW_NUMBER() OVER (PARTITION BY qp.query ORDER BY SUM(qp.clicks) DESC) AS rn
        FROM google_search_console.query_page qp
        JOIN top_kw t ON t.query=qp.query
        WHERE qp.sub_source=$1 AND qp.search_type='web' AND qp.date BETWEEN $2 AND $3
        GROUP BY qp.query, qp.page
      )
      SELECT query, page AS top_page FROM ranked WHERE rn=1
    `, [GSC_SUB_SOURCE, from, to]),
  ]);
  const pageMap = {};
  pageRes.rows.forEach(r => { pageMap[r.query] = r.top_page; });
  const rows = kwRes.rows.map(r => ({
    query: r.query, clicks: parseInt(r.clicks)||0, impressions: parseInt(r.impressions)||0,
    ctr_pct: parseFloat(r.ctr_pct)||0, avg_position: parseFloat(r.avg_position)||0,
    top_page: pageMap[r.query] || null,
  }));
  return res.status(200).json({ ok:true, type:'top', from, to, total:rows.length, rows });
}

async function handleKwOpportunity(client, res, from, to) {
  const { rows: raw } = await client.query(`
    SELECT query,
      SUM(clicks)::int                                                 AS clicks,
      SUM(impressions)::int                                            AS impressions,
      ROUND((SUM(clicks)::numeric/NULLIF(SUM(impressions),0))*100,3)  AS ctr_pct,
      ROUND(AVG(position)::numeric,1)                                  AS avg_position
    FROM google_search_console.query
    WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
    GROUP BY query
    HAVING AVG(position) BETWEEN 4 AND 20 AND SUM(impressions)>=50
    ORDER BY SUM(impressions) DESC LIMIT 300
  `, [GSC_SUB_SOURCE, from, to]);
  const rows = raw.map(r => {
    const pos=parseFloat(r.avg_position)||0, imp=parseInt(r.impressions)||0, ctr=parseFloat(r.ctr_pct)||0;
    let score=0;
    if      (pos<=3)  score+=0;
    else if (pos<=10) score+=40;
    else if (pos<=20) score+=70;
    else if (pos<=50) score+=50;
    else              score+=20;
    score += Math.min(imp/100,30);
    score -= Math.min(ctr*10,20);
    score = Math.max(0,Math.min(100,Math.round(score)));
    let action='Monitor';
    if      (pos<=7  && imp>=200) action='Quick Win — Top 3 Push';
    else if (pos<=10 && imp>=200) action='CTR Boost — Title/Meta';
    else if (pos<=15 && imp>=200) action='Page 2 Rescue';
    else if (pos<=20 && imp>=200) action='Content Depth Needed';
    else if (imp>=10000)          action='High Volume Priority';
    return { query:r.query, clicks:parseInt(r.clicks)||0, impressions:imp, ctr_pct:ctr, avg_position:pos, opp_score:score, action };
  });
  rows.sort((a,b)=>b.opp_score-a.opp_score);
  return res.status(200).json({ ok:true, type:'opportunity', from, to, total:rows.length, rows });
}

async function handleKwMovers(client, res, direction) {
  const latest  = await getLatestDate(client);
  const curTo   = addDays(latest, 0);
  const curFrom = addDays(latest, -29);
  const prvTo   = addDays(latest, -30);
  const prvFrom = addDays(latest, -59);
  const dirCond = direction === 'rising' ? '> 0.5' : '< -0.5';
  const { rows } = await client.query(`
    WITH current_period AS (
      SELECT query,
        ROUND(AVG(position)::numeric,1) AS cur_pos,
        SUM(clicks)::int AS cur_clicks, SUM(impressions)::int AS cur_imp
      FROM google_search_console.query
      WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
      GROUP BY query HAVING SUM(impressions)>=10
    ), prior_period AS (
      SELECT query,
        ROUND(AVG(position)::numeric,1) AS prv_pos,
        SUM(clicks)::int AS prv_clicks, SUM(impressions)::int AS prv_imp
      FROM google_search_console.query
      WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $4 AND $5
      GROUP BY query HAVING SUM(impressions)>=10
    )
    SELECT c.query, c.cur_pos, p.prv_pos,
      ROUND((p.prv_pos-c.cur_pos)::numeric,1) AS pos_change,
      c.cur_clicks, c.cur_imp, p.prv_clicks, p.prv_imp
    FROM current_period c JOIN prior_period p ON p.query=c.query
    WHERE (p.prv_pos-c.cur_pos) ${dirCond}
    ORDER BY ABS(p.prv_pos-c.cur_pos) DESC LIMIT 200
  `, [GSC_SUB_SOURCE, curFrom, curTo, prvFrom, prvTo]);
  return res.status(200).json({
    ok:true, type:direction,
    cur_period:{from:curFrom,to:curTo}, prv_period:{from:prvFrom,to:prvTo},
    total:rows.length,
    rows:rows.map(r=>({
      query:r.query, cur_pos:parseFloat(r.cur_pos)||0, prv_pos:parseFloat(r.prv_pos)||0,
      pos_change:parseFloat(r.pos_change)||0, cur_clicks:parseInt(r.cur_clicks)||0,
      cur_imp:parseInt(r.cur_imp)||0, prv_clicks:parseInt(r.prv_clicks)||0, prv_imp:parseInt(r.prv_imp)||0,
    })),
  });
}

/* ─── LANDING PAGES ─────────────────────────────────────────── */

function classifyPage(page) {
  if (!page) return 'other';
  const p = page.replace(/^https?:\/\/[^/]+/,'').toLowerCase();
  if (p==='/'||p==='')             return 'home';
  if (p.startsWith('/products/'))  return 'product';
  if (p.startsWith('/collections/')) return 'collection';
  if (p.startsWith('/blogs/')||p.startsWith('/pages/')) return 'content';
  if (p.startsWith('/search'))     return 'search';
  return 'other';
}

async function handleLpPages(client, res, from, to) {
  const { rows: raw } = await client.query(`
    SELECT page,
      SUM(clicks)::int                                                 AS clicks,
      SUM(impressions)::int                                            AS impressions,
      ROUND((SUM(clicks)::numeric/NULLIF(SUM(impressions),0))*100,3)  AS ctr_pct,
      ROUND(AVG(position)::numeric,1)                                  AS avg_position,
      COUNT(DISTINCT date)::int                                        AS days_with_data
    FROM google_search_console.page
    WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
    GROUP BY page ORDER BY clicks DESC LIMIT 500
  `, [GSC_SUB_SOURCE, from, to]);
  const rows = raw.map(r => ({
    page:r.page, page_type:classifyPage(r.page),
    clicks:parseInt(r.clicks)||0, impressions:parseInt(r.impressions)||0,
    ctr_pct:parseFloat(r.ctr_pct)||0, avg_position:parseFloat(r.avg_position)||0,
    days_with_data:parseInt(r.days_with_data)||0,
  }));
  return res.status(200).json({ ok:true, type:'pages', from, to, total:rows.length, rows });
}

async function handleLpByType(client, res, from, to) {
  const { rows: raw } = await client.query(`
    SELECT page, SUM(clicks)::int AS clicks, SUM(impressions)::int AS impressions, AVG(position) AS avg_pos
    FROM google_search_console.page
    WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
    GROUP BY page
  `, [GSC_SUB_SOURCE, from, to]);
  const buckets = {};
  for (const r of raw) {
    const t = classifyPage(r.page);
    if (!buckets[t]) buckets[t] = { page_type:t, clicks:0, impressions:0, pos_sum:0, page_count:0 };
    buckets[t].clicks      += parseInt(r.clicks)||0;
    buckets[t].impressions += parseInt(r.impressions)||0;
    buckets[t].pos_sum     += parseFloat(r.avg_pos)||0;
    buckets[t].page_count  += 1;
  }
  const rows = Object.values(buckets).map(b => ({
    page_type:b.page_type, clicks:b.clicks, impressions:b.impressions,
    ctr_pct: b.impressions>0 ? parseFloat(((b.clicks/b.impressions)*100).toFixed(3)):0,
    avg_position: b.page_count>0 ? parseFloat((b.pos_sum/b.page_count).toFixed(1)):0,
    page_count:b.page_count,
  })).sort((a,b)=>b.clicks-a.clicks);
  return res.status(200).json({ ok:true, type:'by-type', from, to, rows });
}

async function handleLpMoM(client, res) {
  const { rows: latest } = await client.query(
    `SELECT MAX(date) AS d FROM google_search_console.page WHERE sub_source=$1`, [GSC_SUB_SOURCE]);
  const latestDate = latest[0].d ? new Date(latest[0].d) : new Date();
  const curYear=latestDate.getFullYear(), curMonth=latestDate.getMonth();
  const curFrom=`${curYear}-${String(curMonth+1).padStart(2,'0')}-01`;
  const curTo=latestDate.toISOString().slice(0,10);
  const prvDate=new Date(curYear,curMonth-1,1);
  const prvFrom=`${prvDate.getFullYear()}-${String(prvDate.getMonth()+1).padStart(2,'0')}-01`;
  const prvTo=new Date(curYear,curMonth,0).toISOString().slice(0,10);

  const [curRes,prvRes] = await Promise.all([
    client.query(`SELECT page, SUM(clicks)::int AS clicks, SUM(impressions)::int AS impressions,
                  ROUND(AVG(position)::numeric,1) AS avg_position
                  FROM google_search_console.page
                  WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
                  GROUP BY page ORDER BY clicks DESC LIMIT 20`,
      [GSC_SUB_SOURCE,curFrom,curTo]),
    client.query(`SELECT page, SUM(clicks)::int AS clicks, SUM(impressions)::int AS impressions,
                  ROUND(AVG(position)::numeric,1) AS avg_position
                  FROM google_search_console.page
                  WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
                  GROUP BY page`,
      [GSC_SUB_SOURCE,prvFrom,prvTo]),
  ]);
  const prvMap={};
  prvRes.rows.forEach(r=>{prvMap[r.page]={clicks:parseInt(r.clicks)||0,impressions:parseInt(r.impressions)||0,avg_position:parseFloat(r.avg_position)||0};});
  const rows=curRes.rows.map(r=>{
    const prv=prvMap[r.page]||null;
    return {
      page:r.page, page_type:classifyPage(r.page),
      cur_clicks:parseInt(r.clicks)||0, cur_impressions:parseInt(r.impressions)||0, cur_position:parseFloat(r.avg_position)||0,
      prv_clicks:prv?prv.clicks:null, prv_impressions:prv?prv.impressions:null, prv_position:prv?prv.avg_position:null,
    };
  });
  return res.status(200).json({
    ok:true, type:'top-pages', cur_period:{from:curFrom,to:curTo}, prv_period:{from:prvFrom,to:prvTo}, total:rows.length, rows,
  });
}

/* ─── MAIN HANDLER ──────────────────────────────────────────── */

/* ─── ACTIONS ───────────────────────────────────────────────── */

async function handleActionPriorities(client, res, from, to) {
  // Two parallel queries: opportunity keywords + declining movers
  const latest = await getLatestDate(client);
  const curTo   = addDays(latest, 0);
  const curFrom = addDays(latest, -29);
  const prvTo   = addDays(latest, -30);
  const prvFrom = addDays(latest, -59);

  const [oppRes, decRes, ctrRes] = await Promise.all([
    // Opportunity keywords: pos 4-20, >= 50 impressions
    client.query(`
      SELECT query,
        SUM(clicks)::int                                                AS clicks,
        SUM(impressions)::int                                           AS impressions,
        ROUND((SUM(clicks)::numeric/NULLIF(SUM(impressions),0))*100,3) AS ctr_pct,
        ROUND(AVG(position)::numeric,1)                                 AS avg_position
      FROM google_search_console.query
      WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
      GROUP BY query
      HAVING AVG(position) BETWEEN 4 AND 20 AND SUM(impressions) >= 100
      ORDER BY SUM(impressions) DESC LIMIT 80
    `, [GSC_SUB_SOURCE, from, to]),

    // Declining movers: largest position drops
    client.query(`
      WITH current_period AS (
        SELECT query,
          ROUND(AVG(position)::numeric,1) AS cur_pos,
          SUM(clicks)::int AS cur_clicks, SUM(impressions)::int AS cur_imp
        FROM google_search_console.query
        WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
        GROUP BY query HAVING SUM(impressions)>=20
      ), prior_period AS (
        SELECT query,
          ROUND(AVG(position)::numeric,1) AS prv_pos,
          SUM(clicks)::int AS prv_clicks
        FROM google_search_console.query
        WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $4 AND $5
        GROUP BY query HAVING SUM(impressions)>=20
      )
      SELECT c.query, c.cur_pos, p.prv_pos,
        ROUND((p.prv_pos-c.cur_pos)::numeric,1) AS pos_change,
        c.cur_clicks, c.cur_imp, p.prv_clicks
      FROM current_period c JOIN prior_period p ON p.query=c.query
      WHERE (p.prv_pos-c.cur_pos) < -2
      ORDER BY (p.prv_pos-c.cur_pos) ASC LIMIT 30
    `, [GSC_SUB_SOURCE, curFrom, curTo, prvFrom, prvTo]),

    // CTR underperformers: high impressions, CTR well below position benchmark
    client.query(`
      SELECT query,
        SUM(clicks)::int                                                AS clicks,
        SUM(impressions)::int                                           AS impressions,
        ROUND((SUM(clicks)::numeric/NULLIF(SUM(impressions),0))*100,3) AS ctr_pct,
        ROUND(AVG(position)::numeric,1)                                 AS avg_position
      FROM google_search_console.query
      WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
      GROUP BY query
      HAVING AVG(position) BETWEEN 1 AND 10
        AND SUM(impressions) >= 200
        AND (SUM(clicks)::numeric/NULLIF(SUM(impressions),0)) < 0.03
      ORDER BY SUM(impressions) DESC LIMIT 30
    `, [GSC_SUB_SOURCE, from, to]),
  ]);

  const actions = [];

  // Score and label opportunity keywords
  for (const r of oppRes.rows) {
    const pos=parseFloat(r.avg_position)||0, imp=parseInt(r.impressions)||0, ctr=parseFloat(r.ctr_pct)||0;
    let score=0;
    if      (pos<=7)  score=90;
    else if (pos<=10) score=75;
    else if (pos<=15) score=60;
    else              score=45;
    score += Math.min(imp/200, 10);
    score = Math.min(100, Math.round(score));

    let category, action_label, why;
    if (pos<=7 && imp>=200) {
      category='quick-win'; action_label='Push to Top 3';
      why=`Ranking #${pos} with ${imp} impressions — a 1-3 position improvement could 3× clicks.`;
    } else if (pos<=10) {
      category='ctr-boost'; action_label='Optimise Title/Meta';
      why=`On page 1 at #${pos} but CTR is ${ctr.toFixed(1)}% — meta description and title relevance review needed.`;
    } else if (pos<=15) {
      category='rescue'; action_label='Page 2 Rescue';
      why=`Stuck on page 2 at #${pos} with ${imp} impressions — content depth or internal links likely limiting.`;
    } else {
      category='content'; action_label='Build Content Authority';
      why=`Position ${pos} with ${imp} impressions — page authority and topical depth need strengthening.`;
    }
    actions.push({ id: `opp-${r.query}`, category, priority_score: score, query: r.query,
      cur_pos: pos, impressions: imp, clicks: parseInt(r.clicks)||0, ctr_pct: ctr,
      action_label, why, pos_change: null });
  }

  // Declining alerts
  for (const r of decRes.rows) {
    const drop = Math.abs(parseFloat(r.pos_change)||0);
    const score = Math.min(100, Math.round(55 + drop * 1.2));
    actions.push({ id: `dec-${r.query}`, category: 'decline', priority_score: score,
      query: r.query, cur_pos: parseFloat(r.cur_pos)||0, impressions: parseInt(r.cur_imp)||0,
      clicks: parseInt(r.cur_clicks)||0, ctr_pct: null,
      action_label: 'Investigate Drop',
      why: `Position fell ${drop} places (was #${r.prv_pos}, now #${r.cur_pos}) in last 30 days.`,
      pos_change: parseFloat(r.pos_change)||0 });
  }

  // CTR underperformers
  for (const r of ctrRes.rows) {
    const pos=parseFloat(r.avg_position)||0, imp=parseInt(r.impressions)||0, ctr=parseFloat(r.ctr_pct)||0;
    // Benchmark CTR for pos 1-3 is ~15-30%, 4-7 ~5-10%, 8-10 ~2-4%
    const bench = pos<=3 ? 15 : pos<=7 ? 5 : 2;
    const gap   = Math.max(0, bench - ctr);
    const score = Math.min(100, Math.round(50 + gap * 2 + Math.min(imp/500, 15)));
    // Avoid duplicates already captured by opportunity
    if (!actions.find(a => a.query === r.query)) {
      actions.push({ id: `ctr-${r.query}`, category: 'ctr-boost', priority_score: score,
        query: r.query, cur_pos: pos, impressions: imp, clicks: parseInt(r.clicks)||0,
        ctr_pct: ctr, action_label: 'Fix CTR — Title/Meta',
        why: `Ranking #${pos} with ${imp} impressions but only ${ctr.toFixed(1)}% CTR (benchmark ~${bench}%).`,
        pos_change: null });
    }
  }

  // Sort by priority_score DESC, assign P-level
  actions.sort((a,b) => b.priority_score - a.priority_score);
  const ranked = actions.map((a,i) => ({
    ...a,
    rank: i+1,
    priority: a.priority_score >= 85 ? 'P1' : a.priority_score >= 70 ? 'P2' : a.priority_score >= 55 ? 'P3' : 'P4',
  }));

  const summary = { quick_win:0, ctr_boost:0, rescue:0, content:0, decline:0 };
  ranked.forEach(a => { if (summary[a.category.replace('-','_')] !== undefined) summary[a.category.replace('-','_')]++; });

  return res.status(200).json({
    ok:true, type:'priorities', from, to,
    date_range_movers: { cur_period:{from:curFrom,to:curTo}, prv_period:{from:prvFrom,to:prvTo} },
    summary, total:ranked.length, rows:ranked,
  });
}

/* ─── TECHNICAL SEO ─────────────────────────────────────────── */

async function handleTechCoverage(client, res, from, to) {
  const [coverRes, shopifyRes, freshRes] = await Promise.all([
    // Page-type coverage breakdown
    client.query(`
      SELECT
        COUNT(DISTINCT page)                                                                       AS total_indexed,
        COUNT(DISTINCT CASE WHEN page ILIKE '%/products/%'    THEN page END)                      AS products,
        COUNT(DISTINCT CASE WHEN page ILIKE '%/collections/%' THEN page END)                      AS collections,
        COUNT(DISTINCT CASE WHEN page NOT ILIKE '%/products/%'
                             AND page NOT ILIKE '%/collections/%'
                             AND page NOT ILIKE '%ledsone.co.uk/$'
                             AND page NOT ILIKE '%ledsone.co.uk'   THEN page END)                  AS other,
        MIN(date) AS earliest, MAX(date) AS latest
      FROM google_search_console.page
      WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
    `, [GSC_SUB_SOURCE, from, to]),

    // Shopify product count for coverage ratio
    client.query(`
      SELECT COUNT(*) AS total_products
      FROM listings.shopify_listings
      WHERE sub_source=$1 AND is_parent=1
    `, [GSC_SUB_SOURCE]),

    // Pages by days_with_data bucket (freshness proxy)
    client.query(`
      SELECT
        CASE
          WHEN days_cnt <= 7   THEN 'new_7d'
          WHEN days_cnt <= 30  THEN 'active_30d'
          WHEN days_cnt <= 60  THEN 'active_60d'
          ELSE                      'established'
        END AS freshness_bucket,
        COUNT(*) AS page_count
      FROM (
        SELECT page, COUNT(DISTINCT date) AS days_cnt
        FROM google_search_console.page
        WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
        GROUP BY page
      ) sub
      GROUP BY freshness_bucket
    `, [GSC_SUB_SOURCE, from, to]),
  ]);

  const cov = coverRes.rows[0];
  const totalProducts  = parseInt(shopifyRes.rows[0].total_products) || 0;
  const indexedProducts= parseInt(cov.products) || 0;
  const coverageRatio  = totalProducts > 0 ? parseFloat(((indexedProducts/totalProducts)*100).toFixed(1)) : 0;

  const freshness = {};
  freshRes.rows.forEach(r => { freshness[r.freshness_bucket] = parseInt(r.page_count)||0; });

  return res.status(200).json({
    ok: true, type: 'coverage', from, to,
    stats: {
      total_indexed:      parseInt(cov.total_indexed)||0,
      indexed_products:   indexedProducts,
      indexed_collections:parseInt(cov.collections)||0,
      indexed_other:      parseInt(cov.other)||0,
      total_shopify_products: totalProducts,
      product_coverage_pct:   coverageRatio,
      earliest: cov.earliest,
      latest:   cov.latest,
    },
    freshness,
  });
}

async function handleTechCannib(client, res, from, to) {
  // Keywords where 2+ distinct pages appear in query_page — limited to clicked rows
  const { rows: raw } = await client.query(`
    WITH page_kw AS (
      SELECT query, page, SUM(clicks)::int AS clicks
      FROM google_search_console.query_page
      WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
      GROUP BY query, page
      HAVING SUM(clicks) >= 1
    ),
    multi_page AS (
      SELECT query, COUNT(DISTINCT page)::int AS competing_pages, SUM(clicks)::int AS total_clicks
      FROM page_kw
      GROUP BY query
      HAVING COUNT(DISTINCT page) >= 2
      ORDER BY SUM(clicks) DESC
      LIMIT 60
    )
    SELECT mp.query, mp.competing_pages, mp.total_clicks,
           pk.page, pk.clicks AS page_clicks
    FROM multi_page mp
    JOIN page_kw pk ON pk.query = mp.query
    ORDER BY mp.total_clicks DESC, mp.query, pk.clicks DESC
  `, [GSC_SUB_SOURCE, from, to]);

  // Group by keyword
  const grouped = {};
  for (const r of raw) {
    if (!grouped[r.query]) {
      grouped[r.query] = { query:r.query, competing_pages:parseInt(r.competing_pages), total_clicks:parseInt(r.total_clicks), pages:[] };
    }
    grouped[r.query].pages.push({ page:r.page, clicks:parseInt(r.page_clicks)||0 });
  }
  const rows = Object.values(grouped);

  return res.status(200).json({ ok:true, type:'cannibalization', from, to, total:rows.length, rows });
}

async function handleTechZeroClick(client, res, from, to) {
  const { rows } = await client.query(`
    SELECT
      page,
      SUM(clicks)::int                                                    AS clicks,
      SUM(impressions)::int                                               AS impressions,
      ROUND(AVG(position)::numeric,1)                                     AS avg_position,
      COUNT(DISTINCT date)::int                                           AS days_with_data
    FROM google_search_console.page
    WHERE sub_source=$1 AND search_type='web' AND date BETWEEN $2 AND $3
    GROUP BY page
    HAVING SUM(clicks) = 0 AND SUM(impressions) >= 20
    ORDER BY SUM(impressions) DESC
    LIMIT 300
  `, [GSC_SUB_SOURCE, from, to]);

  return res.status(200).json({
    ok: true, type:'zero-click', from, to, total:rows.length,
    rows: rows.map(r => ({
      page:           r.page,
      page_type:      classifyPage(r.page),
      impressions:    parseInt(r.impressions)||0,
      avg_position:   parseFloat(r.avg_position)||0,
      days_with_data: parseInt(r.days_with_data)||0,
    })),
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const module_ = (req.query.module || '').trim();
  const type    = (req.query.type   || '').trim();
  const DB_URL  = process.env.DATABASE_URL;
  if (!DB_URL) return res.status(500).json({ ok:false, cause:'no_db_url', error:'DATABASE_URL not set' });

  const from = req.query.from || '2026-03-20';
  const to   = req.query.to   || new Date().toISOString().slice(0,10);

  const client = makeClient(DB_URL);
  try {
    await client.connect();
    switch (module_) {
      case 'exec':
        switch (type) {
          case 'gsc-monthly':   return await handleGscMonthly(client, res);
          case 'position-dist': return await handlePositionDist(client, res);
          case 'ads-monthly':   return await handleAdsMonthly(client, res);
          case 'data-quality':  return await handleDataQuality(client, res);
          default: return res.status(400).json({ ok:false, error:`exec: unknown type "${type}"` });
        }
      case 'products':
        switch (type) {
          case 'pages':    return await handleProductPages(client, res, from, to);
          case 'listings': return await handleListings(client, res);
          default: return res.status(400).json({ ok:false, error:`products: unknown type "${type}"` });
        }
      case 'keywords':
        switch (type) {
          case 'top':         return await handleKwTop(client, res, from, to);
          case 'opportunity': return await handleKwOpportunity(client, res, from, to);
          case 'rising':      return await handleKwMovers(client, res, 'rising');
          case 'declining':   return await handleKwMovers(client, res, 'declining');
          default: return res.status(400).json({ ok:false, error:`keywords: unknown type "${type}"` });
        }
      case 'landing':
        switch (type) {
          case 'pages':     return await handleLpPages(client, res, from, to);
          case 'by-type':   return await handleLpByType(client, res, from, to);
          case 'top-pages': return await handleLpMoM(client, res);
          default: return res.status(400).json({ ok:false, error:`landing: unknown type "${type}"` });
        }
      case 'actions':
        switch (type) {
          case 'priorities': return await handleActionPriorities(client, res, from, to);
          default: return res.status(400).json({ ok:false, error:`actions: unknown type "${type}"` });
        }
      case 'technical':
        switch (type) {
          case 'coverage':         return await handleTechCoverage(client, res, from, to);
          case 'cannibalization':  return await handleTechCannib(client, res, from, to);
          case 'zero-click':       return await handleTechZeroClick(client, res, from, to);
          default: return res.status(400).json({ ok:false, error:`technical: unknown type "${type}"` });
        }
      case 'semrush':
        await client.end();
        return await handleSemrush(type, res);
      default:
        return res.status(400).json({ ok:false, error:`Unknown module "${module_}". Valid: exec, products, keywords, landing, actions, technical, semrush` });
    }
  } catch (err) {
    return errResponse(res, err);
  } finally {
    try { await client.end(); } catch (_) {}
  }
};

/* ─── SEMRUSH (Neon DB) ────────────────────────────────────── */

async function handleSemrush(type, res) {
  const NEON_URL = process.env.NEON_DATABASE_URL;
  if (!NEON_URL) return res.status(500).json({ ok:false, cause:'no_neon_url', error:'NEON_DATABASE_URL not set' });
  const nc = makeClient(NEON_URL);
  try {
    await nc.connect();
    if (type === 'history') {
      const { rows } = await nc.query(`
        SELECT month, rank, organic_keywords, kw_top3, kw_top4_10, kw_top11_20,
               kw_top21_100, traffic_est, traffic_cost_gbp, paid_keywords, paid_traffic
        FROM semrush_history ORDER BY month ASC`);
      return res.json({ ok:true, rows });
    }
    if (type === 'competitors') {
      const { rows } = await nc.query(`
        SELECT domain, month, rank, organic_keywords, traffic_est, traffic_cost_gbp
        FROM semrush_competitor_history
        WHERE domain IN ('lightingcompany.co.uk','ledhut.co.uk','industville.co.uk','thevintagelightbulbcompany.com','lampspares.co.uk')
        ORDER BY domain, month ASC`);
      return res.json({ ok:true, rows });
    }
    if (type === 'backlinks') {
      const { rows } = await nc.query(`
        SELECT snapshot_date, authority_score, total_backlinks, referring_domains, referring_ips, follow_links, nofollow_links
        FROM semrush_backlinks ORDER BY snapshot_date ASC`);
      return res.json({ ok:true, rows });
    }
    if (type === 'backlinks-history') {
      const { rows } = await nc.query(`
        SELECT snapshot_date, total_backlinks, referring_domains
        FROM semrush_backlinks_history ORDER BY snapshot_date ASC`);
      return res.json({ ok:true, rows });
    }
    if (type === 'keywords') {
      const { rows } = await nc.query(`
        SELECT keyword, position, prev_position, volume, cpc, url, traffic, snapshot_date
        FROM semrush_keywords
        WHERE snapshot_date = (SELECT MAX(snapshot_date) FROM semrush_keywords)
        ORDER BY traffic DESC LIMIT 100`);
      return res.json({ ok:true, rows });
    }
    return res.status(400).json({ ok:false, error:`semrush: unknown type "${type}"` });
  } catch (err) {
    return errResponse(res, err);
  } finally {
    try { await nc.end(); } catch (_) {}
  }
}
