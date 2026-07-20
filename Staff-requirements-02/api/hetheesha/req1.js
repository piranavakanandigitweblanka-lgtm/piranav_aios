// Hetheesha — Requirement 1 API
// Revenue + GSC: PostgreSQL DB (sub_source_id=233, Jun 06–Jul 06 2026)
// Meta title/desc, alt text, FAQ: Shopify Admin GraphQL (live)
// Snapshot baseline: Jul 06 2026 (hardcoded for before/after comparison)

const { Client } = require('pg');
const https      = require('https');

const SHOP  = 'jedsz8-km.myshopify.com';
const TOKEN = process.env.SHOPIFY_FR_TOKEN;

// ─── BASELINE SNAPSHOT — Jul 06 2026 ─────────────────────────────────────
const SNAPSHOT = [
 {k:1, h:"ledsone-industrial-vintage-32cm-green-pendant-retro-metal-lamp-shade-e27-uk-holder",rev:369.20,mtr:"Suspension Vintage Verte 32cm E27 – Abat-jour M\xe9tal Cuisine",mdr:"Suspension abat-jour en m\xe9tal vert 32 cm, style industriel vintage. Douille E27. Parfaite au-dessus d'une table de cuisine ou d'un \xeelot. -10% actuellement.",alt:0,imp:null,ctr:null,faq:"Present"},
 {k:2, h:"5-way-spider-light-fixture-3399",rev:248.70,mtr:"Lustre Araign\xe9e 5 Ampoules R\xe9glable E27 | LEDsone",mdr:"Suspension araign\xe9e 5 ampoules E27, hauteur r\xe9glable, finition m\xe9tal noir. Design industriel pour salle \xe0 manger. Livraison France rapide.",alt:3,imp:404,ctr:0.50,faq:"Missing"},
 {k:3, h:"ledsone-luminaire-suspendu-vintage-trois-bras-avec-abat-jour-conique-plat",rev:198.00,mtr:null,mdr:null,alt:13,imp:null,ctr:null,faq:"Missing"},
 {k:4, h:"galvanised-conduit-metal-pipe-light-fittings-accessories-4646",rev:195.73,mtr:null,mdr:null,alt:0,imp:null,ctr:null,faq:"Missing"},
 {k:5, h:"adjustable-height-metal-spider-led-suspension",rev:182.22,mtr:"Lustre Suspension Vintage 5 T\xeates R\xe9glable en Hauteur",mdr:"Apportez style et fonctionnalit\xe9 \xe0 votre int\xe9rieur avec ce lustre araign\xe9e LED 5 t\xeates.Hauteur r\xe9glable, E27 compatible, id\xe9al salon, chambre ou salle \xe0 manger.",alt:11,imp:142,ctr:0.70,faq:"Missing"},
 {k:6, h:"20mm-galvanized-steel-conduit-lighting-box-fitting",rev:165.75,mtr:"Raccord Conduit 20mm Galvanis\xe9 | Bornes – LEDsone",mdr:"Raccord bo\xeete \xe0 bornes pour conduit 20mm en acier galvanis\xe9. Compatible \xe9clairage industriel DIY, style steampunk. Certifi\xe9. Livraison France 5-7j. D\xe8s 2,25€.",alt:0,imp:null,ctr:null,faq:"Present"},
 {k:7, h:"industrial-vintage-ratio-2-head-hemp-spider-chandelier-e27-uk-holder",rev:129.66,mtr:"Lustre Suspension Chanvre 2 T\xeates Industriel Vintage E27",mdr:"Lustre suspension chanvre 2 t\xeates industriel vintage E27. Chandelier r\xe9tro en corde de chanvre naturel, fer noir \xd840cm. Salon, salle \xe0 manger, loft. C\xe2ble 2m.",alt:21,imp:261,ctr:0.00,faq:"Present"},
 {k:8, h:"vintage-ceiling-pendant-light-lamp-shade-industrial-chandelier-spider-lamp",rev:121.60,mtr:null,mdr:null,alt:2,imp:null,ctr:null,faq:"Present"},
 {k:9, h:"1m-twisted-cable-e27-base-holder",rev:121.01,mtr:null,mdr:null,alt:11,imp:null,ctr:null,faq:"Missing"},
 {k:10,h:"applique-murale-led-reglable-e27-industrielle",rev:110.76,mtr:"Applique murale LED r\xe9glable E27 industrielle",mdr:"D\xe9couvrez l'applique murale vintage LEDSone avec bras pivotant E27. \xc9clairage industriel r\xe9glable \xe0 180 degr\xe9s pour une ambiance chaleureuse.",alt:0,imp:null,ctr:null,faq:"Missing"},
 {k:11,h:"bottle-shaped-led-pendant-light",rev:101.42,mtr:"Lustre salon 5 t\xeates – Suspension bouteille de vin en verre | LEDSone",mdr:"Suspension design \xe0 5 t\xeates avec abat-jour en verre bouteille de vin. Lustre id\xe9al pour salon, cuisine ou restaurant. Style r\xe9tro, livraison rapide en France.",alt:0,imp:null,ctr:null,faq:"Present"},
 {k:12,h:"industrial-style-led-ceiling-light-fixtures",rev:94.00,mtr:"Luminaires Vintage Industriels - Suspensions Design pour",mdr:"\xc9clairage int\xe9rieur vintage pour cuisine, salon, chambre ou salle \xe0 manger. Style industriel, design \xe9l\xe9gant.",alt:8,imp:null,ctr:null,faq:"Missing"},
 {k:13,h:"suspension-ledsone-8-voies-forme-araignee-e27-reglable",rev:89.16,mtr:"Lustre araign\xe9e 8 bras vintage – Suspension laiton & cuivre E27",mdr:"Suspension araign\xe9e 8 bras en laiton & cuivre. Style vintage r\xe9tro, id\xe9ale pour salon ou salle \xe0 manger. Compatible E27, livraison rapide en France.",alt:0,imp:64,ctr:0.00,faq:"Missing"},
 {k:14,h:"vintage-industrial-metal-retro-ceiling-pendant-light-copper-shade",rev:85.56,mtr:"Suspension Vintage Cuivre E27 – Plafonnier M\xe9tal R\xe9tro 1m",mdr:"Suspension vintage finition cuivre, abat-jour m\xe9tal r\xe9tro. C\xe2ble r\xe9glable 1m, douille E27.Id\xe9al salon, chambre ou cuisine. -10% en ce moment. Livraison rapide.",alt:12,imp:null,ctr:null,faq:"Missing"},
 {k:15,h:"applique-murale-en-metal-avec-abat-jour-facile-a-installer",rev:81.96,mtr:"Applique Murale Industrielle et R\xe9tro en M\xe9tal",mdr:"Sublimez votre int\xe9rieur avec l'applique murale industrielle LEDSone en m\xe9tal noir. Style vintage Edison parfait pour chambre, bar ou loft. Livraison Rapide !",alt:9,imp:null,ctr:null,faq:"Missing"},
 {k:16,h:"vintage-e27-bulb-holder-suspension-light-fitting-ceiling-hanging-pendant-light",rev:79.35,mtr:"Suspension Ext\xe9rieure IP65 E27 – Luminaire Noir \xc9tanche 1m",mdr:"Suspension ext\xe9rieure \xe9tanche IP65, m\xe9tal noir, c\xe2ble 1m. Compatible E27.Id\xe9ale terrasse, pergola, jardin. R\xe9sistante aux intemp\xe9ries. Livraison rapide France.",alt:0,imp:799,ctr:0.88,faq:"Present"},
 {k:17,h:"ledsone-suspension-industrielle-lustre-retro-plafonnier-metal",rev:77.72,mtr:"Suspension industrielle vintage en m\xe9tal Lustre r\xe9tro plafonnier E27",mdr:"Luminaire suspendu industriel vintage en m\xe9tal E27. Id\xe9al pour salle \xe0 manger, loft ou cuisine. Style r\xe9tro tendance, livraison rapide en France.",alt:5,imp:60,ctr:0.00,faq:"Present"},
 {k:18,h:"industrial-vintage-retro-adjustable-ceiling-various-colours-pendant-light-with-e27-uk-holder",rev:57.27,mtr:"LEDSone Suspension Luminaire Industrielle E27 en M\xe9tal 15 cm",mdr:"D\xe9couvrez notre suspension luminaire industrielle LEDSone. Abat-jour m\xe9tal 15cm, c\xe2ble r\xe9glable et culot E27. Id\xe9al pour \xeelot de cuisine et salon. Livraison rapide !",alt:42,imp:null,ctr:null,faq:"Missing"},
 {k:19,h:"vintage-e27-bulb-holder-suspension-light-fitting-ceiling-2m-hanging-pendant-light-4907",rev:55.34,mtr:"Suspension plafonnier 2m support ampoule E27 vintage",mdr:"D\xe9couvrez notre suspension plafonnier de 2m avec support ampoule E27 au style vintage. Parfaite pour illuminer votre int\xe9rieur avec \xe9l\xe9gance.",alt:12,imp:101,ctr:0.99,faq:"Missing"},
 {k:20,h:"modern-blue-ceiling-light-shade-hanging-pendant-lamp-metal-dome-shade",rev:52.72,mtr:"Abat-jour D\xf4me M\xe9tal 30cm E27 – Industriel Vintage",mdr:"Abat-jour suspendu industriel en m\xe9tal 30 cm. Compatible E27, installation facile avec plaque r\xe9ductrice gratuite. Id\xe9al salon, chambre ou cuisine.",alt:31,imp:null,ctr:null,faq:"Missing"},
 {k:21,h:"plafonnier-retro-moderne-a-3-ampoules-eclairage-e27",rev:51.83,mtr:"Plafonnier r\xe9tro moderne \xe0 3 ampoules - \xc9clairage E27",mdr:"\xc9l\xe9gant plafonnier design \xe0 3 ampoules E27, id\xe9al pour cuisine, salon ou salle \xe0 manger. Livr\xe9 en kit, finition laiton jaune. Commandez d\xe8s maintenant !",alt:12,imp:null,ctr:null,faq:"Missing"},
 {k:22,h:"ledsone-industriel-suspension-luminaire-retro-vintage",rev:51.66,mtr:"Suspension Luminaire Industriel Vintage C\xe2ble 95cm R\xe9glable | LEDSone",mdr:"Suspension industrielle vintage en m\xe9tal d\xf4me. C\xe2ble r\xe9glable 95cm, douille E27, id\xe9ale salon, salle \xe0 manger, restaurant ou loft. Livraison rapide LEDSone.",alt:13,imp:30,ctr:3.33,faq:"Present"},
 {k:23,h:"wall-scone",rev:51.26,mtr:"Applique Murale Vintage Noire 180\xb0 – \xc9clairage Industriel Chic",mdr:"Applique murale vintage noire orientable 180\xb0 – parfaite pour restaurants, gal\xe9ries, couloirs ou cuisines. Style industriel chic et installation facile.",alt:10,imp:null,ctr:null,faq:"Missing"},
 {k:24,h:"suspension-vintage-ledsone-5-lumieres-industriel-e27",rev:50.57,mtr:"Lustre Araign\xe9e 5 Bras Vintage E27 | LEDsone France",mdr:"Lustre araign\xe9e industriel vintage 5 lumi\xe8res E27. M\xe9tal noir mat, c\xe2ble r\xe9glable, id\xe9al salle \xe0 manger, restaurant, loft. Livraison France 5–7j.",alt:1,imp:null,ctr:null,faq:"Present"},
 {k:25,h:"suspension-araign-e-lampe-3-voies-suspension-cuivre-bross-plafonnier-clairage",rev:46.58,mtr:"Lustre Araign\xe9e 3 T\xeates – Suspension Industrielle Vintage E27",mdr:"Suspension araign\xe9e 3 t\xeates cuivre bross\xe9, douilles E27, c\xe2bles r\xe9glables 2m. Style industriel vintage cuisine, salon, loft. Livraison France 5-7j.",alt:0,imp:176,ctr:0.57,faq:"Missing"},
 {k:26,h:"agunnaryd-pendant-lamp",rev:45.09,mtr:"Suspension Industrielle Noire Steampunk LEDSone – Lustre 3 voies E27",mdr:"Suspension industrielle noire Steampunk LEDSone, 3 voies, abat-jour m\xe9tal 21 cm, fil r\xe9glable 95 cm. Id\xe9ale pour salon, salle \xe0 manger, bar ou restaurant.",alt:5,imp:null,ctr:null,faq:"Missing"},
 {k:27,h:"swan-neck-wall-light-indoor-lamp",rev:44.56,mtr:"Applique Murale Industrielle Col de Cygne E27 | 7 Finitions",mdr:"Applique murale col de cygne, m\xe9tal, 7 finitions (laiton, or rose, chrome, noir...). Douille E27, garantie 3 ans. Note 4.7/5. Livraison France.",alt:27,imp:null,ctr:null,faq:"Present"},
 {k:28,h:"copper-ceiling-rose-light-pendant-for-cable",rev:43.63,mtr:"Rosace de Plafond 100mm — Cuivre, Noir, Chrome | LEDSone",mdr:"Rosace de plafond ronde 100mm en m\xe9tal robuste. 5 finitions : cuivre, noir, chrome, laiton. Cache-fil \xe9l\xe9gant, montage facile, livraison rapide en France.",alt:3,imp:null,ctr:null,faq:"Present"},
 {k:29,h:"ledsone-abat-jour-design-moderne-en-m-tal-pour-suspension-et-plafonnier-32-cm",rev:41.67,mtr:"Abat-jour M\xe9tal Moderne 32 cm – Suspension & Plafonnier",mdr:"Abat-jour m\xe9tal 32 cm pour suspension et plafonnier – moderne, \xe9l\xe9gant et durable. Commandez vite pour un \xe9clairage chic !",alt:14,imp:null,ctr:null,faq:"Missing"},
 {k:30,h:"applique-murale-vintage-led-eclairage-retro-ajustable",rev:40.38,mtr:"Applique murale vintage LED - \xc9clairage r\xe9tro ajustable",mdr:"Transformez votre int\xe9rieur avec l'applique murale vintage LEDSone. Finition nickel satin\xe9, douille E27 r\xe9glable et style industriel. Livraison rapide. Shoppez !",alt:0,imp:null,ctr:null,faq:"Missing"},
 {k:31,h:"2-way-retro-vintage-chandelier-ceiling-spider-light-industrial-pendant-lamp-e27-4945",rev:39.70,mtr:"Suspension Araign\xe9e Vintage 2 Bras E27 – Luminaire Industriel R\xe9tro",mdr:"Lustre araign\xe9e dimmable 2 bras, style industriel vintage. Compatible variateur de lumi\xe8re E27. C\xe2ble r\xe9glable. Id\xe9al chambre ou salon. Livraison rapide France.",alt:3,imp:156,ctr:1.28,faq:"Missing"},
 {k:32,h:"applique-murale-vintage-retro-moderne-e27-pour-interieur",rev:36.86,mtr:"Applique Murale Vintage R\xe9tro Moderne E27 pour Int\xe9rieur",mdr:"\xc9l\xe9gante applique murale vintage r\xe9tro avec bras en m\xe9tal E27, id\xe9ale pour salon, cuisine, chambre ou salle \xe0 manger. Style industriel, design intemporel.",alt:10,imp:null,ctr:null,faq:"Missing"},
 {k:33,h:"suspension-luminaire-industrielle-3-lampes-metal-noir-ledsone",rev:34.80,mtr:"Suspension Industrielle 3 Lampes Noir | Cuisine & Bar",mdr:"Suspension 3 lampes m\xe9tal noir mat, style loft. C\xe2bles ajustables 1m, compatible variateur. Id\xe9ale cuisine, bar, salle \xe0 manger.",alt:9,imp:null,ctr:null,faq:"Present"},
 {k:34,h:"c-ble-plafonnier-industriel-r-tro-2-voies-e27-suspension",rev:34.06,mtr:"C\xe2ble Plafonnier Industriel R\xe9tro 2 Voies E27 Suspension",mdr:null,alt:8,imp:null,ctr:null,faq:"Missing"},
 {k:35,h:"vintage-retro-pendant-light-with-metal-shade",rev:32.70,mtr:"Suspension Vintage M\xe9tal Noir E27 – Luminaire Industriel Loft",mdr:"Suspension vintage en m\xe9tal au design industriel \xe9pur\xe9. Id\xe9ale pour cuisine, salon ou bar. Douille E27 compatible LED. Installation facile et Livraison 24h.",alt:9,imp:null,ctr:null,faq:"Missing"},
 {k:36,h:"ancienne-suspension-lustre-plafonnier-araign-e-industriel",rev:31.00,mtr:"Ancienne Suspension Lustre Araign\xe9e | LEDsone France",mdr:"Ancienne suspension lustre araign\xe9e industriel, style authentique r\xe9tro. Plafonnier m\xe9tal E27, c\xe2ble r\xe9glable. Livraison France. LEDsone.",alt:5,imp:null,ctr:null,faq:"Missing"},
 {k:37,h:"2m-black-white-round-cable-e27-base-satin-nickel-holder",rev:29.98,mtr:"E27 cable suspension luminaire 2m",mdr:"Cette suspension c\xe2ble textile est compos\xe9e de 2m m\xe8tres de c\xe2ble, d'une rosace en m\xe9tal avec une douille E27 Max 60w.",alt:2,imp:166,ctr:0.60,faq:"Missing"},
 {k:38,h:"plafonnier-cage-cristal-verre-moderne-e27",rev:29.28,mtr:"Plafonnier Cage Cristal Verre Moderne Luminaire Plafond Design E27",mdr:null,alt:0,imp:null,ctr:null,faq:"Present"},
 {k:39,h:"lot-de-3-abat-jours-vintage-suspension-industrielle-incurvee-e27",rev:28.09,mtr:"LEDSONE Lot de 3 abat-jours vintage incurv\xe9s, installation",mdr:"Ajoutez une touche chaleureuse \xe0 votre int\xe9rieur avec ces abat-jours vintage design. Parfaits pour salon, chambre ou salle \xe0 manger.",alt:5,imp:null,ctr:null,faq:"Missing"},
 {k:40,h:"dc24v-ip67-150w-waterproof-led-driver-power-supply-transformer",rev:25.19,mtr:"Transformateur LED 24V 150W \xc9tanche IP67 Alimentation Ruban LED",mdr:"Alimentation LED 24V 150W IP67 waterproof pour ruban LED, spots et \xe9clairage ext\xe9rieur. Sortie DC 24V constante, protections surcharge/court-circuit.",alt:3,imp:117,ctr:0.00,faq:"Present"},
 {k:41,h:"vintage-industrial-retro-metal-indoor-ceiling-light-flush-mount-retro-cone-shade-lamp-uk",rev:22.40,mtr:null,mdr:null,alt:0,imp:null,ctr:null,faq:"Missing"},
 {k:42,h:"suspension-lustre-suspension-lampe-suspension-plafonnier-industriel-2-t-tes",rev:22.39,mtr:"Lustre Suspension Araign\xe9e Industriel 2 T\xeates - LEDSone",mdr:"D\xe9couvrez le plafonnier araign\xe9e LEDSone noir \xe0 2 t\xeates. Un lustre industriel vintage id\xe9al pour cuisine, salon ou bar. C\xe2bles r\xe9glables. Livraison rapide !",alt:16,imp:null,ctr:null,faq:"Missing"},
 {k:43,h:"vintage-industrial-pendant-light-metal-e27",rev:21.21,mtr:"Suspension Industrielle M\xe9tal E27 | 9 Coloris – Style Loft",mdr:"Suspension industrielle en m\xe9tal, douille E27, 9 coloris (noir, vert, orange...). Style loft pour salon, restaurant, caf\xe9. Livraison France 4-10j.",alt:19,imp:null,ctr:null,faq:"Present"},
 {k:44,h:"e27-lamp-holder-20mm-female-thread-conduit-ceiling-light-socket",rev:20.97,mtr:null,mdr:null,alt:0,imp:null,ctr:null,faq:"Missing"},
 {k:45,h:"plafonnier-semi-encastre-style-ancien",rev:19.59,mtr:"Plafonnier semi‑encastr\xe9 vintage | Style ancien m\xe9tal E27",mdr:"Plafonnier semi‑encastr\xe9 style ancien en m\xe9tal E27. \xc9clairage r\xe9tro id\xe9al pour salon, chambre ou cuisine. Durable, \xe9l\xe9gant et livraison rapide en France.",alt:28,imp:null,ctr:null,faq:"Missing"},
 {k:46,h:"applique-murale-industrielle-vintage-avec-motif-c-ne",rev:19.14,mtr:"Applique Murale Industrielle C\xf4ne Vintage E27 | LEDsone",mdr:"Applique murale industrielle vintage, design c\xf4ne en m\xe9tal, culot E27. Style loft pour salon, couloir, caf\xe9 & restaurant. Livraison France.",alt:2,imp:null,ctr:null,faq:"Present"},
 {k:47,h:"indoor-wall-fitting-lounge-light-fittings",rev:18.69,mtr:"Appliques Murales Industrielles Design",mdr:"D\xe9couvrez nos appliques murales industrielles au design \xe9l\xe9gant en m\xe9tal. Id\xe9ales pour cr\xe9er une atmosph\xe8re chaleureuse et accueillante chez vous.",alt:16,imp:null,ctr:null,faq:"Present"},
 {k:48,h:"abat-jour-m-tal-pluton-plafonnier-suspension-luminaire-abat-jour",rev:18.28,mtr:"Abat-jour M\xe9tal Pluton – Suspension & Plafonnier",mdr:"D\xe9couvrez l'\xe9l\xe9gance de l'Abat-jour M\xe9tal Pluton, une suspension et plafonnier qui allie design moderne et fonctionnalit\xe9 pour sublimer votre int\xe9rieur.",alt:0,imp:null,ctr:null,faq:"Present"},
 {k:49,h:"vintage-ceiling-light-pendant-lamp-shade",rev:16.86,mtr:"Suspension Style Fermier en M\xe9tal | Luminaire \xcelet de Cuisine",mdr:"D\xe9couvrez notre suspension de style fermier avec abat-jour bol m\xe9tallique. Cordon r\xe9glable, design industriel chic, id\xe9al pour cuisine et couloir. Livraison rapide !",alt:13,imp:null,ctr:null,faq:"Present"},
 {k:50,h:"ledsone-200mm-kit-rosace-cylindrique-en-metal-a-3-trous",rev:16.46,mtr:"LEDSone Rosace Plafond Vintage 3 Trous M\xe9tal 200mm",mdr:"Rosace de plafond LEDSone 200mm en m\xe9tal, 3 trous. Parfaite pour suspensions industrielles vintage, installation facile et design \xe9l\xe9gant int\xe9rieur.",alt:4,imp:73,ctr:5.48,faq:"Missing"},
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

async function fetchShopifyBatch(handles) {
  // Use products query with OR-joined handle filter
  const handleQuery = handles.map(h => `handle:${h}`).join(' OR ');
  const gql = `{
    products(first: ${handles.length}, query: ${JSON.stringify(handleQuery)}) {
      edges {
        node {
          handle
          seo { title description }
          images(first: 50) { edges { node { altText } } }
          metafield(namespace: "custom", key: "faq_schema") { value }
        }
      }
    }
  }`;
  const resp = await shopifyGQL(gql);
  const out = {};
  if (resp.data?.products?.edges) {
    resp.data.products.edges.forEach(({ node: p }) => {
      const missingAlt = p.images.edges.filter(
        e => !e.node.altText || e.node.altText.trim() === ''
      ).length;
      out[p.handle] = {
        meta_title : p.seo?.title       || null,
        meta_desc  : p.seo?.description || null,
        alt_missing: missingAlt,
        faq        : p.metafield?.value ? 'Present' : 'Missing',
      };
    });
  }
  return out;
}

async function fetchAllShopify(handles) {
  const results = {};
  const BATCH = 10;
  for (let i = 0; i < handles.length; i += BATCH) {
    const data = await fetchShopifyBatch(handles.slice(i, i + BATCH));
    Object.assign(results, data);
  }
  return results;
}

// ─── BUILD TRACKER (missing fields + current live status) ─────────────────
function buildTracker(snapshot, shopifyMap) {
  const items = [];
  const FIELDS = [
    { key: 'meta_title', snapKey: 'mtr', label: 'Meta Title',   isMissing: v => !v },
    { key: 'meta_desc',  snapKey: 'mdr', label: 'Meta Desc',    isMissing: v => !v },
    { key: 'faq',        snapKey: 'faq', label: 'FAQ Schema',   isMissing: v => v === 'Missing' },
    { key: 'alt_missing',snapKey: 'alt', label: 'Alt Text',     isMissing: v => v > 0 },
  ];

  snapshot.forEach(s => {
    const live = shopifyMap[s.h];
    FIELDS.forEach(f => {
      const snapVal   = s[f.snapKey];
      const wasMissing = f.isMissing(snapVal);
      if (!wasMissing) return; // was OK in baseline — skip

      const liveVal   = live ? live[f.key] : null;
      const nowFixed  = live && !f.isMissing(liveVal);

      items.push({
        rank        : s.k,
        handle      : s.h,
        field       : f.label,
        field_key   : f.key,
        before      : snapVal,
        after       : liveVal,
        was_missing : true,
        now_fixed   : nowFixed,
        live_value  : liveVal,
      });
    });
  });

  return items;
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (!TOKEN) {
    return res.status(500).json({ ok: false, error: 'SHOPIFY_FR_TOKEN env var not set' });
  }

  const db = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await db.connect();

    // 1. Revenue — top 50 ledsone.fr products
    const revRes = await db.query(`
      SELECT oii.handle,
             SUM(CAST(oii.item_price  AS NUMERIC)
               * CAST(oii.item_quantity AS INTEGER)) AS revenue
      FROM order_management.orders o
      JOIN order_management.order_item_info oii ON oii.order_id = o.id
      WHERE o.sub_source_id = 233
        AND o.status = 'Completed'
        AND o.order_date BETWEEN '2026-06-06' AND '2026-07-06'
        AND oii.handle IS NOT NULL AND oii.handle != ''
      GROUP BY oii.handle
      ORDER BY revenue DESC
      LIMIT 50
    `);

    const handles    = revRes.rows.map(r => r.handle);
    const revenueMap = {};
    revRes.rows.forEach((r, i) => {
      revenueMap[r.handle] = { rank: i + 1, rev: parseFloat(r.revenue) };
    });

    // 2. GSC — impressions + CTR
    const gscRes = await db.query(`
      SELECT
        regexp_replace(
          split_part(regexp_replace(p.page, '^https?://[^/]+', ''), '?', 1),
          '^/products/', ''
        ) AS handle,
        SUM(p.impressions)         AS impressions,
        ROUND(AVG(p.ctr) * 100, 2) AS ctr_pct
      FROM google_search_console.page p
      WHERE p.sub_source  = 233
        AND p.search_type = 'web'
        AND p.page LIKE '%/products/%'
        AND p.date BETWEEN '2026-06-06' AND '2026-07-06'
        AND regexp_replace(
              split_part(regexp_replace(p.page, '^https?://[^/]+', ''), '?', 1),
              '^/products/', ''
            ) = ANY($1)
      GROUP BY handle
    `, [handles]);

    const gscMap = {};
    gscRes.rows.forEach(r => {
      gscMap[r.handle] = { imp: parseInt(r.impressions), ctr: parseFloat(r.ctr_pct) };
    });

    await db.end();

    // 3. Shopify live data
    const shopifyMap = await fetchAllShopify(handles);

    // 4. Merge main rows
    const rows = handles.map(h => {
      const rev = revenueMap[h];
      const gsc = gscMap[h]     || { imp: null, ctr: null };
      const sh  = shopifyMap[h] || { meta_title: null, meta_desc: null, alt_missing: 0, faq: 'Missing' };
      return {
        rank       : rev.rank,
        handle     : h,
        revenue    : rev.rev,
        meta_title : sh.meta_title,
        meta_desc  : sh.meta_desc,
        alt_missing: sh.alt_missing,
        faq        : sh.faq,
        impressions: gsc.imp,
        ctr        : gsc.ctr,
      };
    });

    // 5. Tracker — all originally missing fields with live status
    const tracker = buildTracker(SNAPSHOT, shopifyMap);

    return res.status(200).json({
      ok         : true,
      fetched_at : new Date().toISOString(),
      period     : '2026-06-06 to 2026-07-06',
      rows,
      snapshot   : SNAPSHOT,
      tracker,   // missing fields: was_missing=true, now_fixed=true/false
    });

  } catch (err) {
    await db.end().catch(() => {});
    console.error('[hetheesha/req1]', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
