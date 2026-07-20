// Hetheesha — Requirement 2 API
// Collections SEO: Shopify Admin GraphQL (live, all collections paginated)
// GSC: PostgreSQL google_search_console.gsc_web_page (rolling 30 days)
// Fix Tracker baseline: Jul 06 2026 (SNAPSHOT2 hardcoded)

const { Client } = require('pg');
const https      = require('https');

const SHOP  = 'jedsz8-km.myshopify.com';
const TOKEN = process.env.SHOPIFY_FR_TOKEN;

// ─── BASELINE SNAPSHOT — Jul 06 2026 — 66 collections ────────────────────
// Fields tracked: seoTitleLen (0=missing), seoDescLen (0=missing), hasFAQ (0=missing)
const SNAPSHOT2 = [
 {h:'frontpage',stl:0,sdl:0,faq:0},
 {h:'lumiere-daraignee',stl:63,sdl:157,faq:1},
 {h:'lampes-suspendues',stl:67,sdl:153,faq:0},
 {h:'applique-murale',stl:53,sdl:157,faq:0},
 {h:'eclairage-de-table',stl:68,sdl:152,faq:0},
 {h:'abat-jour',stl:48,sdl:152,faq:0},
 {h:'eclairage-de-tuyaux',stl:58,sdl:148,faq:0},
 {h:'plafonniers',stl:56,sdl:146,faq:0},
 {h:'cage-metallique',stl:52,sdl:157,faq:0},
 {h:'support-de-lampe',stl:58,sdl:139,faq:0},
 {h:'transformateurs-led',stl:40,sdl:143,faq:0},
 {h:'5v-transformateurs-led',stl:58,sdl:152,faq:0},
 {h:'ip20-transformateurs-led',stl:43,sdl:141,faq:0},
 {h:'12-v-transformateur',stl:54,sdl:150,faq:0},
 {h:'ip67-transformateur-led',stl:0,sdl:146,faq:0},
 {h:'ip45transformateur-led',stl:0,sdl:0,faq:0},
 {h:'24v-transformateurs-led',stl:0,sdl:157,faq:0},
 {h:'ampoule-led',stl:48,sdl:135,faq:0},
 {h:'ampoules-e27',stl:60,sdl:150,faq:0},
 {h:'ampoules-b22',stl:57,sdl:139,faq:0},
 {h:'decor-led',stl:69,sdl:130,faq:1},
 {h:'ampoules-e14',stl:52,sdl:156,faq:0},
 {h:'transformateur-de-courant-constant',stl:51,sdl:155,faq:0},
 {h:'cables',stl:59,sdl:123,faq:0},
 {h:'cable-rond-a-2-conducteurs',stl:52,sdl:167,faq:0},
 {h:'cable-rond-a-3-conducteurs',stl:60,sdl:136,faq:0},
 {h:'cable-torsade-a-2-conducteurs',stl:0,sdl:0,faq:0},
 {h:'cable-torsade-a-3-conducteurs',stl:0,sdl:149,faq:0},
 {h:'luminaires-tendance',stl:53,sdl:144,faq:0},
 {h:'lumieres-led-dinterieur',stl:44,sdl:142,faq:0},
 {h:'ajustement-facile',stl:0,sdl:0,faq:0},
 {h:'meilleure-vente',stl:0,sdl:0,faq:0},
 {h:'rideau-de-douche',stl:26,sdl:143,faq:0},
 {h:'panneaux-led',stl:70,sdl:144,faq:0},
 {h:'eclairage-de-cuisine',stl:63,sdl:115,faq:0},
 {h:'rosaces-de-plafond',stl:55,sdl:138,faq:0},
 {h:'horloge',stl:44,sdl:147,faq:0},
 {h:'anneau-dombrage',stl:55,sdl:144,faq:0},
 {h:'eclairage-de-plug-in',stl:0,sdl:0,faq:0},
 {h:'livraison-gratuite',stl:0,sdl:144,faq:0},
 {h:'tapis-de-sol',stl:0,sdl:0,faq:0},
 {h:'eclairage-des-conduits',stl:0,sdl:0,faq:0},
 {h:'interrupteurs-et-prises',stl:0,sdl:0,faq:0},
 {h:'crochets-et-anneaux',stl:61,sdl:142,faq:0},
 {h:'connecteurs-de-fils-boite-de-jonction',stl:48,sdl:158,faq:0},
 {h:'duree-limitee-jusqua-50-de-reduction',stl:0,sdl:0,faq:0},
 {h:'produits-tendance',stl:0,sdl:0,faq:0},
 {h:'lumieres-de-conduit-metal',stl:46,sdl:158,faq:0},
 {h:'clients-achetent',stl:0,sdl:0,faq:0},
 {h:'eclairage-dombre-a-motif',stl:0,sdl:0,faq:0},
 {h:'conduit-metallique',stl:49,sdl:155,faq:0},
 {h:'tous-les-produits',stl:70,sdl:113,faq:0},
 {h:'eclairage-de-la-chambre',stl:0,sdl:0,faq:0},
 {h:'suspension-rotin',stl:16,sdl:158,faq:0},
 {h:'luminaire-salon',stl:0,sdl:133,faq:0},
 {h:'produits-les-plus-vendus',stl:41,sdl:158,faq:0},
 {h:'offres-du-nouvel-an-2026',stl:0,sdl:0,faq:0},
 {h:'promotion-hebdomadaire',stl:52,sdl:159,faq:0},
 {h:'nouveautes-derniers-produits-arrives',stl:47,sdl:140,faq:0},
 {h:'eclairage-led',stl:56,sdl:146,faq:0},
 {h:'vente-en-liquidation',stl:0,sdl:0,faq:0},
 {h:'supports-de-rosace-de-plafond',stl:49,sdl:147,faq:0},
 {h:'offres-speciales',stl:0,sdl:0,faq:0},
 {h:'modules-led',stl:0,sdl:0,faq:0},
 {h:'appliques-murales-dexterieur',stl:0,sdl:0,faq:0},
 {h:'illuminez-votre-interieur',stl:0,sdl:0,faq:0},
];

// ─── SHOPIFY GRAPHQL ──────────────────────────────────────────────────────
function shopifyGQL(query) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query });
    const options = {
      hostname: SHOP,
      path: '/admin/api/2025-01/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': TOKEN,
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Shopify parse error: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fetchAllCollections() {
  const collections = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const afterArg = cursor ? `, after: "${cursor}"` : '';
    const gql = `{
      collections(first: 100${afterArg}) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            handle
            title
            seo { title description }
            descriptionHtml
            metafield(namespace: "custom", key: "faq_schema") { value }
          }
        }
      }
    }`;
    const resp = await shopifyGQL(gql);
    const page = resp.data?.collections;
    if (!page) break;

    page.edges.forEach(({ node: c }) => {
      const plain      = stripHtml(c.descriptionHtml);
      const wordCount  = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
      const intLinks   = ((c.descriptionHtml || '').match(/href=/gi) || []).length;
      const seoTitle   = c.seo?.title       || '';
      const seoDesc    = c.seo?.description || '';
      collections.push({
        handle        : c.handle,
        title         : c.title,
        word_count    : wordCount,
        seo_title     : seoTitle || null,
        seo_title_len : seoTitle.length,
        seo_desc      : seoDesc || null,
        seo_desc_len  : seoDesc.length,
        has_faq       : c.metafield?.value ? 1 : 0,
        int_links     : intLinks,
      });
    });

    hasNextPage = page.pageInfo.hasNextPage;
    cursor      = page.pageInfo.endCursor;
  }
  return collections;
}

// ─── BUILD TRACKER ────────────────────────────────────────────────────────
function buildTracker2(snapshot, collectionMap) {
  const items = [];
  const FIELDS = [
    { key: 'seo_title', snapKey: 'stl', label: 'Meta Title',   isMissing: v => v === 0 },
    { key: 'seo_desc',  snapKey: 'sdl', label: 'Meta Desc',    isMissing: v => v === 0 },
    { key: 'has_faq',   snapKey: 'faq', label: 'FAQ Schema',   isMissing: v => v === 0 },
  ];

  snapshot.forEach((s, idx) => {
    const live = collectionMap[s.h];
    FIELDS.forEach(f => {
      const snapVal    = s[f.snapKey];
      const wasMissing = f.isMissing(snapVal);
      if (!wasMissing) return;

      const liveVal  = live ? live[f.key] : null;
      const nowFixed = live && !f.isMissing(
        f.key === 'has_faq'  ? (liveVal || 0) :
        f.key === 'seo_title'? (live.seo_title_len || 0) :
                               (live.seo_desc_len  || 0)
      );

      items.push({
        rank      : idx + 1,
        handle    : s.h,
        field     : f.label,
        field_key : f.key,
        before    : snapVal,
        now_fixed : nowFixed,
        live_value: f.key === 'seo_title' ? liveVal :
                    f.key === 'seo_desc'  ? liveVal :
                    (liveVal === 1 ? 'Present' : null),
      });
    });
  });
  return items;
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  if (!TOKEN) {
    return res.status(500).json({ ok: false, error: 'SHOPIFY_FR_TOKEN env var not set' });
  }

  const db = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await db.connect();

    // 1. GSC — collection pages, rolling 30 days
    const gscRes = await db.query(`
      SELECT
        regexp_replace(
          split_part(regexp_replace(p.page, '^https?://[^/]+', ''), '?', 1),
          '^/collections/', ''
        ) AS handle,
        SUM(p.clicks)              AS clicks,
        SUM(p.impressions)         AS impressions,
        ROUND(AVG(p.ctr) * 100, 2) AS ctr_pct,
        ROUND(AVG(p.position), 1)  AS avg_pos
      FROM google_search_console.gsc_web_page p
      WHERE p.site_url    = 'https://ledsone.fr/'
        AND p.search_type = 'web'
        AND p.page LIKE '%/collections/%'
        AND p.date BETWEEN CURRENT_DATE - INTERVAL '30 days' AND CURRENT_DATE
      GROUP BY handle
    `);

    await db.end();

    const gscMap = {};
    gscRes.rows.forEach(r => {
      gscMap[r.handle] = {
        clicks: parseInt(r.clicks)   || 0,
        imp   : parseInt(r.impressions) || 0,
        ctr   : parseFloat(r.ctr_pct)  || 0,
        pos   : parseFloat(r.avg_pos)  || 0,
      };
    });

    // 2. Shopify — all collections live
    const collections   = await fetchAllCollections();
    const collectionMap = {};
    collections.forEach(c => { collectionMap[c.handle] = c; });

    // 3. Merge rows → same array format as hardcoded R2
    // [handle, title, wordCount, seoTitleLen, seoDescLen, hasFAQ, intLinks, clicks, imp, ctr, pos, h1ok]
    const rows = collections.map(c => {
      const gsc = gscMap[c.handle] || { clicks: 0, imp: 0, ctr: 0, pos: 0 };
      return [
        c.handle, c.title, c.word_count,
        c.seo_title_len, c.seo_desc_len,
        c.has_faq, c.int_links,
        gsc.clicks, gsc.imp, gsc.ctr, gsc.pos,
        1, // h1ok: Shopify Dawn renders collection.title as H1 by default
      ];
    });

    // 4. Fix tracker — also check SNAPSHOT handles not in live collections
    const allSnapHandles = SNAPSHOT2.map(s => s.h);
    const missingFromShopify = allSnapHandles.filter(h => !collectionMap[h]);
    // (deleted/archived collections — can't be fixed, but still show as pending)

    const tracker = buildTracker2(SNAPSHOT2, collectionMap);

    return res.status(200).json({
      ok            : true,
      fetched_at    : new Date().toISOString(),
      period_gsc    : `${new Date(Date.now()-30*864e5).toISOString().slice(0,10)} to ${new Date().toISOString().slice(0,10)} (rolling 30d)`,
      collection_count: rows.length,
      rows,
      tracker,
    });

  } catch (err) {
    await db.end().catch(() => {});
    console.error('[hetheesha/req2]', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
