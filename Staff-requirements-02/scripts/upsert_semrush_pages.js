const { Client } = require('../node_modules/pg');

const CONNECTION_STRING = 'postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require&uselibpqcompat=true';

const RAW_DATA = `Url;Traffic;Number of Keywords;Traffic (%)
https://ledsone.co.uk/;893;142;9.17
https://ledsone.co.uk/collections/wire-connectors;543;82;5.57
https://ledsone.co.uk/collections/plugin-lighting;469;115;4.81
https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;438;102;4.49
https://ledsone.co.uk/blogs/new/e27-bulb-guide;397;85;4.07
https://ledsone.co.uk/collections/spider-light;289;16;2.96
https://ledsone.co.uk/collections/e27-base-bulb;271;250;2.78
https://ledsone.co.uk/products/lampshade-wall-light-wall-light-chandelier-shades;236;19;2.42
https://ledsone.co.uk/collections/dc-12v-transformer;183;36;1.87
https://ledsone.co.uk/collections/ceiling-rose-brackets;174;17;1.78
https://ledsone.co.uk/collections/vintage-bulbs;143;121;1.46
https://ledsone.co.uk/collections/white-board;132;172;1.35
https://ledsone.co.uk/products/12w-modern-led-adjustable-tilt-angle-downlight-recessed-round-ceiling-spotlights;129;18;1.32
https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;126;25;1.29
https://ledsone.co.uk/blogs/new/understanding-3-core-electrical-cables-types-uses-and-color-codes;125;40;1.28
https://ledsone.co.uk/products/3-light-black-industrial-hanging-ceiling-pendant-lights;115;37;1.18
https://ledsone.co.uk/collections/wire-cage-pendant-light;103;27;1.05
https://ledsone.co.uk/products/vintage-industrial-loft-style-metal-ceiling-light-modern-orange-dome-pendant-lampshade;103;16;1.05
https://ledsone.co.uk/products/tiffany-style-table-lamp-for-home-decor;102;30;1.04
https://ledsone.co.uk/collections/metal-holders;101;62;1.03
https://ledsone.co.uk/collections/dc-24v-transformer;100;15;1.02
https://ledsone.co.uk/collections/led-bulbs;93;135;0.95
https://ledsone.co.uk/collections/weighing-scale;90;92;0.92
https://ledsone.co.uk/collections/lampshades;88;102;0.90
https://ledsone.co.uk/products/vintage-industrial-3head-ceiling-pendant-light-black-hanging-light-metal-dome-shape-shade-indoor-light-fitting-for-hotel-restaurants-bar-dining-room;87;24;0.89
https://ledsone.co.uk/products/double-sided-heavy-duty-mounting-removable-tape;86;179;0.88
https://ledsone.co.uk/collections/hemp-rope-lighting;79;35;0.81
https://ledsone.co.uk/blogs/new/transformers-for-led-lighting-complete-guide;74;44;0.75
https://ledsone.co.uk/blogs/new/led-light-bulbs-buying-guide;70;40;0.71
https://ledsone.co.uk/collections/pipe-lighting;68;14;0.69
https://ledsone.co.uk/collections/lampshades/metal-pendant-light;68;9;0.69
https://ledsone.co.uk/collections/dimmable-led-bulbs;66;72;0.67
https://ledsone.co.uk/products/led-decorative-outdoor-wall-light-up-down-lights;66;65;0.67
https://ledsone.co.uk/products/kitchen-cabinet-door-handles-cupboard-drawer-black-handles-furniture;62;42;0.63
https://ledsone.co.uk/products/fabric-solid-color-shower-curtain-for-bathtub-shower-5288;62;15;0.63
https://ledsone.co.uk/collections/hemp-collection;61;14;0.62
https://ledsone.co.uk/collections/hooks-and-rings;60;35;0.61
https://ledsone.co.uk/products/modern-large-crystal-ceiling-light-gold-pendant-chandelier-lamp-for-living-room-4117;56;28;0.57
https://ledsone.co.uk/products/vintage-industrial-retro-metal-indoor-ceiling-light-flush-mount-retro-cone-shade-lamp-uk;54;18;0.55
https://ledsone.co.uk/products/industrial-vintage-iron-wheel-ceiling-light-pendant-lamp-edison-lighting-fixture;52;10;0.53
https://ledsone.co.uk/products/plastic-mailing-bags-postage-bag-strong-bag;50;3;0.51
https://ledsone.co.uk/blogs/new/bulb-holder-types-every-cap-fitting-explained-e27-b22-gu10-more;47;15;0.48
https://ledsone.co.uk/products/vintage-c35-e14-4w-bent-tip-candle-led-flame-light-bulb;47;12;0.48
https://ledsone.co.uk/products/vintage-tiffany-style-stained-glass-shade-fixtures-4541;47;35;0.48
https://ledsone.co.uk/products/zip-ties-releasable-heavy-duty-reusable-cable-ties-wraps;46;30;0.47
https://ledsone.co.uk/products/industrial-wooden-hemp-rope-e27-wall-mounted-sconce-4568;45;10;0.46
https://ledsone.co.uk/products/3a-60a-lighting-chock-block-connection-12-way-electric-wire-terminal-connector;45;20;0.46
https://ledsone.co.uk/collections/laundry-bags;42;54;0.43
https://ledsone.co.uk/products/screw-e27-plain-holder-white-with-ring-bakelite-lamp-holder;41;20;0.42
https://ledsone.co.uk/products/modern-large-spider-braided-pendant-lamp-3heads-clusters-of-hanging-yellow-cone-shades-ceiling-lamp-lighting-3433;40;11;0.41`;

function classifyPageType(url) {
  if (url === 'https://ledsone.co.uk/') return 'homepage';
  if (url.includes('/blogs/')) return 'blog';
  if (url.includes('/collections/')) return 'collection';
  if (url.includes('/products/')) return 'product';
  return 'other';
}

async function main() {
  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Neon DB');

    // Ensure table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS semrush_pages (
        snapshot_date DATE NOT NULL,
        page_url TEXT NOT NULL,
        traffic INT,
        keywords_count INT,
        traffic_share NUMERIC,
        page_type TEXT,
        PRIMARY KEY (snapshot_date, page_url)
      )
    `);
    console.log('Table ready');

    const snapshot_date = new Date().toISOString().slice(0, 10);
    const lines = RAW_DATA.split('\n');
    // Skip header (first line)
    const dataLines = lines.slice(1).filter(l => l.trim() !== '');

    let upsertCount = 0;
    for (const line of dataLines) {
      const parts = line.split(';');
      if (parts.length < 4) continue;
      const url = parts[0].trim();
      const traffic = parseInt(parts[1].trim(), 10);
      const keywords_count = parseInt(parts[2].trim(), 10);
      const traffic_share = parseFloat(parts[3].trim());
      const page_type = classifyPageType(url);

      await client.query(`
        INSERT INTO semrush_pages (snapshot_date, page_url, traffic, keywords_count, traffic_share, page_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (snapshot_date, page_url)
        DO UPDATE SET
          traffic = EXCLUDED.traffic,
          keywords_count = EXCLUDED.keywords_count,
          traffic_share = EXCLUDED.traffic_share,
          page_type = EXCLUDED.page_type
      `, [snapshot_date, url, traffic, keywords_count, traffic_share, page_type]);

      upsertCount++;
    }

    console.log(`Successfully upserted ${upsertCount} rows for snapshot_date=${snapshot_date}`);

    // Quick verification
    const result = await client.query(
      'SELECT page_type, COUNT(*) as count, SUM(traffic) as total_traffic FROM semrush_pages WHERE snapshot_date=$1 GROUP BY page_type ORDER BY total_traffic DESC',
      [snapshot_date]
    );
    console.log('\nSummary by page_type:');
    result.rows.forEach(r => {
      console.log(`  ${r.page_type}: ${r.count} pages, ${r.total_traffic} traffic`);
    });

  } catch (err) {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
