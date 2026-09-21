const { neon } = require('../node_modules/@neondatabase/serverless');

const CONNECTION_STRING = 'postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const RAW_DATA = `Url;Traffic;Number of Keywords;Traffic (%)
https://ledsone.co.uk/collections/wire-connectors;942;87;9.85
https://ledsone.co.uk/;892;163;9.33
https://ledsone.co.uk/collections/plugin-lighting;585;108;6.12
https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;404;114;4.22
https://ledsone.co.uk/blogs/new/e27-bulb-guide;362;94;3.78
https://ledsone.co.uk/collections/e27-base-bulb;255;230;2.66
https://ledsone.co.uk/collections/spider-light;244;18;2.55
https://ledsone.co.uk/collections/dc-12v-transformer;202;32;2.11
https://ledsone.co.uk/collections/ceiling-rose-brackets;186;17;1.94
https://ledsone.co.uk/collections/white-board;154;193;1.61
https://ledsone.co.uk/collections/vintage-bulbs;132;113;1.38
https://ledsone.co.uk/products/12w-modern-led-adjustable-tilt-angle-downlight-recessed-round-ceiling-spotlights;123;16;1.28
https://ledsone.co.uk/collections/metal-holders;111;53;1.16
https://ledsone.co.uk/products/3-light-black-industrial-hanging-ceiling-pendant-lights;102;19;1.06
https://ledsone.co.uk/products/tiffany-style-table-lamp-for-home-decor;101;26;1.05
https://ledsone.co.uk/collections/dc-24v-transformer;97;16;1.01
https://ledsone.co.uk/collections/lampshades;94;99;0.98
https://ledsone.co.uk/collections/wall-light;92;327;0.96
https://ledsone.co.uk/products/vintage-industrial-loft-style-metal-ceiling-light-modern-orange-dome-pendant-lampshade;87;16;0.91
https://ledsone.co.uk/collections/led-bulbs;87;117;0.91
https://ledsone.co.uk/products/zip-ties-releasable-heavy-duty-reusable-cable-ties-wraps;85;38;0.88
https://ledsone.co.uk/es/collections/table-lamps;82;1;0.85
https://ledsone.co.uk/collections/pendant-holder;80;17;0.83
https://ledsone.co.uk/collections/hemp-rope-lighting;79;44;0.82
https://ledsone.co.uk/collections/pipe-lighting;76;12;0.79
https://ledsone.co.uk/products/vintage-industrial-lamp-light-bulb-copper-holder-e27-light-socket;69;32;0.72
https://ledsone.co.uk/products/dc12v-80w-ip20-universal-regulated-switching-power-supply;68;19;0.71
https://ledsone.co.uk/products/vintage-industrial-retro-metal-indoor-ceiling-light-flush-mount-retro-cone-shade-lamp-uk;68;19;0.71
https://ledsone.co.uk/collections/lampshades/metal-pendant-light;68;13;0.71
https://ledsone.co.uk/products/black-and-gold-crystal-chandelier-light;64;45;0.66
https://ledsone.co.uk/products/double-sided-heavy-duty-mounting-removable-tape;63;151;0.65
https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;63;22;0.65
https://ledsone.co.uk/collections/hemp-collection;61;14;0.63
https://ledsone.co.uk/collections/pendant-lights;60;167;0.62
https://ledsone.co.uk/products/kitchen-cabinet-door-handles-cupboard-drawer-black-handles-furniture;58;37;0.60
https://ledsone.co.uk/blogs/new/bulb-holder-types-every-cap-fitting-explained-e27-b22-gu10-more;55;12;0.57
https://ledsone.co.uk/collections/wire-cage-pendant-light;55;21;0.57
https://ledsone.co.uk/collections/incandescent-bulbs;54;87;0.56
https://ledsone.co.uk/blogs/new/understanding-3-core-electrical-cables-types-uses-and-color-codes;53;38;0.55
https://ledsone.co.uk/products/plastic-mailing-bags-postage-bag-strong-bag;50;3;0.52
https://ledsone.co.uk/products/modern-vintage-industrial-e27-retro-orange-ceiling-wall-lamp-shade-pendant-light;48;35;0.50
https://ledsone.co.uk/collections/weighing-scale;48;95;0.50
https://ledsone.co.uk/collections/hooks-and-rings;47;26;0.49
https://ledsone.co.uk/blogs/new/led-light-bulbs-buying-guide;47;44;0.49
https://ledsone.co.uk/collections/wire-cage;46;24;0.48
https://ledsone.co.uk/products/fabric-solid-color-shower-curtain-for-bathtub-shower-5288;45;13;0.47
https://ledsone.co.uk/collections/holder;44;68;0.46
https://ledsone.co.uk/blogs/new/transformers-for-led-lighting-complete-guide;44;40;0.46
https://ledsone.co.uk/products/lampshade-wall-light-wall-light-chandelier-shades;43;14;0.45
https://ledsone.co.uk/products/3a-60a-lighting-chock-block-connection-12-way-electric-wire-terminal-connector;42;20;0.43`;

function classifyUrl(url) {
  if (url === 'https://ledsone.co.uk/') return 'homepage';
  if (url.includes('/blogs/')) return 'blog';
  if (url.includes('/collections/')) return 'collection';
  if (url.includes('/products/')) return 'product';
  return 'other';
}

async function main() {
  const snapshotDate = new Date().toISOString().slice(0, 10);
  const lines = RAW_DATA.split('\n');
  const dataLines = lines.slice(1).filter(l => l.trim());

  try {
    const sql = neon(CONNECTION_STRING);

    await sql`
      CREATE TABLE IF NOT EXISTS semrush_pages (
        snapshot_date DATE NOT NULL,
        page_url TEXT NOT NULL,
        traffic INT,
        keywords_count INT,
        traffic_share NUMERIC,
        page_type TEXT,
        PRIMARY KEY (snapshot_date, page_url)
      )
    `;

    console.log(`[semrush-pages] Upserting ${dataLines.length} rows for snapshot ${snapshotDate}...`);

    let count = 0;
    for (const line of dataLines) {
      const parts = line.split(';');
      const url = parts[0].trim();
      const traffic = parseInt(parts[1].trim(), 10);
      const keywords_count = parseInt(parts[2].trim(), 10);
      const traffic_share = parseFloat(parts[3].trim());
      const page_type = classifyUrl(url);

      await sql`
        INSERT INTO semrush_pages (snapshot_date, page_url, traffic, keywords_count, traffic_share, page_type)
        VALUES (${snapshotDate}::date, ${url}, ${traffic}, ${keywords_count}, ${traffic_share}, ${page_type})
        ON CONFLICT (snapshot_date, page_url)
        DO UPDATE SET
          traffic = EXCLUDED.traffic,
          keywords_count = EXCLUDED.keywords_count,
          traffic_share = EXCLUDED.traffic_share,
          page_type = EXCLUDED.page_type
      `;
      count++;
    }

    console.log(`[semrush-pages] Done — ${count} rows upserted.`);
  } catch (err) {
    console.error('[semrush-pages] ERROR:', err.message || err);
    console.error(err.stack || '');
    process.exit(1);
  }
}

main();
