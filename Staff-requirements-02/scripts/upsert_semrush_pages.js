#!/usr/bin/env node
'use strict';

const { Client } = require('../node_modules/pg');

const CONNECTION_STRING =
  'postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';

// Raw SEMrush output (semicolon-delimited, first line is header)
const RAW_DATA = `Url;Traffic;Number of Keywords;Traffic (%)
https://ledsone.co.uk/;921;153;9.27
https://ledsone.co.uk/blogs/new/e27-bulb-guide;834;90;8.39
https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;578;109;5.81
https://ledsone.co.uk/collections/plugin-lighting;453;119;4.56
https://ledsone.co.uk/collections/wire-connectors;403;81;4.05
https://ledsone.co.uk/collections/spider-light;305;16;3.07
https://ledsone.co.uk/collections/e27-base-bulb;219;262;2.20
https://ledsone.co.uk/collections/dc-12v-transformer;176;38;1.77
https://ledsone.co.uk/collections/vintage-bulbs;152;120;1.53
https://ledsone.co.uk/products/lampshade-wall-light-wall-light-chandelier-shades;143;19;1.43
https://ledsone.co.uk/blogs/new/understanding-3-core-electrical-cables-types-uses-and-color-codes;131;40;1.31
https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;129;26;1.29
https://ledsone.co.uk/products/12w-modern-led-adjustable-tilt-angle-downlight-recessed-round-ceiling-spotlights;129;19;1.29
https://ledsone.co.uk/collections/white-board;126;167;1.26
https://ledsone.co.uk/collections/wire-cage-pendant-light;110;29;1.10
https://ledsone.co.uk/collections/metal-holders;104;64;1.04
https://ledsone.co.uk/products/3-light-black-industrial-hanging-ceiling-pendant-lights;103;40;1.03
https://ledsone.co.uk/products/vintage-industrial-loft-style-metal-ceiling-light-modern-orange-dome-pendant-lampshade;102;14;1.02
https://ledsone.co.uk/products/tiffany-style-table-lamp-for-home-decor;102;31;1.02
https://ledsone.co.uk/collections/ceiling-rose-brackets;102;17;1.02
https://ledsone.co.uk/collections/dc-24v-transformer;100;14;1.00
https://ledsone.co.uk/collections/lampshades;96;104;0.96
https://ledsone.co.uk/collections/led-bulbs;87;138;0.87
https://ledsone.co.uk/products/vintage-industrial-3head-ceiling-pendant-light-black-hanging-light-metal-dome-shape-shade-indoor-light-fitting-for-hotel-restaurants-bar-dining-room;86;24;0.86
https://ledsone.co.uk/products/screw-e27-plain-holder-white-with-ring-bakelite-lamp-holder;84;22;0.84
https://ledsone.co.uk/blogs/new/transformers-for-led-lighting-complete-guide;78;45;0.78
https://ledsone.co.uk/collections/hemp-rope-lighting;77;34;0.77
https://ledsone.co.uk/blogs/new/led-light-bulbs-buying-guide;77;41;0.77
https://ledsone.co.uk/collections/wall-light;70;265;0.70
https://ledsone.co.uk/collections/hooks-and-rings;68;42;0.68
https://ledsone.co.uk/products/fabric-solid-color-shower-curtain-for-bathtub-shower-5288;68;16;0.68
https://ledsone.co.uk/collections/dimmable-led-bulbs;67;72;0.67
https://ledsone.co.uk/products/led-decorative-outdoor-wall-light-up-down-lights;67;72;0.67
https://ledsone.co.uk/products/vintage-c35-e14-4w-bent-tip-candle-led-flame-light-bulb;66;12;0.66
https://ledsone.co.uk/collections/lampshades/metal-pendant-light;64;8;0.64
https://ledsone.co.uk/collections/hemp-collection;61;12;0.61
https://ledsone.co.uk/products/vintage-industrial-retro-metal-indoor-ceiling-light-flush-mount-retro-cone-shade-lamp-uk;55;18;0.55
https://ledsone.co.uk/products/modern-large-crystal-ceiling-light-gold-pendant-chandelier-lamp-for-living-room-4117;53;28;0.53
https://ledsone.co.uk/products/industrial-vintage-iron-wheel-ceiling-light-pendant-lamp-edison-lighting-fixture;52;10;0.52
https://ledsone.co.uk/products/ledsone-industrial-vintage-32cm-black-pendant-retro-metal-lamp-shade-e27-uk-holder;51;15;0.51
https://ledsone.co.uk/products/plastic-mailing-bags-postage-bag-strong-bag;50;3;0.50
https://ledsone.co.uk/collections/pipe-lighting;49;15;0.49
https://ledsone.co.uk/products/vintage-tiffany-style-stained-glass-shade-fixtures-4541;48;38;0.48
https://ledsone.co.uk/blogs/new/bulb-holder-types-every-cap-fitting-explained-e27-b22-gu10-more;47;16;0.47
https://ledsone.co.uk/products/zip-ties-releasable-heavy-duty-reusable-cable-ties-wraps;44;30;0.44
https://ledsone.co.uk/products/industrial-wooden-hemp-rope-e27-wall-mounted-sconce-4568;44;11;0.44
https://ledsone.co.uk/products/double-sided-heavy-duty-mounting-removable-tape;42;173;0.42
https://ledsone.co.uk/collections/pendant-lights;42;144;0.42
https://ledsone.co.uk/products/3a-60a-lighting-chock-block-connection-12-way-electric-wire-terminal-connector;42;18;0.42
https://ledsone.co.uk/products/white-gypsum-board-screws-self-drilling-pack;40;10;0.40`;

function classifyUrl(url) {
  if (url === 'https://ledsone.co.uk/') return 'homepage';
  if (url.includes('/blogs/'))       return 'blog';
  if (url.includes('/collections/')) return 'collection';
  if (url.includes('/products/'))    return 'product';
  return 'other';
}

async function main() {
  const snapshotDate = new Date().toISOString().slice(0, 10);
  console.log(`Snapshot date: ${snapshotDate}`);

  // Parse data — skip header (first line)
  const lines = RAW_DATA.trim().split('\n').slice(1);
  const rows = lines.map(line => {
    const parts = line.split(';');
    const url            = parts[0].trim();
    const traffic        = parseInt(parts[1].trim(), 10);
    const keywords_count = parseInt(parts[2].trim(), 10);
    const traffic_share  = parseFloat(parts[3].trim());
    const page_type      = classifyUrl(url);
    return { url, traffic, keywords_count, traffic_share, page_type };
  });

  console.log(`Parsed ${rows.length} rows from SEMrush data`);

  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to Neon PostgreSQL');

    // Ensure table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS semrush_pages (
        snapshot_date  DATE    NOT NULL,
        page_url       TEXT    NOT NULL,
        traffic        INT,
        keywords_count INT,
        traffic_share  NUMERIC,
        page_type      TEXT,
        PRIMARY KEY (snapshot_date, page_url)
      )
    `);
    console.log('Table semrush_pages ready');

    let upserted = 0;
    for (const row of rows) {
      await client.query(
        `INSERT INTO semrush_pages
           (snapshot_date, page_url, traffic, keywords_count, traffic_share, page_type)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (snapshot_date, page_url) DO UPDATE SET
           traffic        = EXCLUDED.traffic,
           keywords_count = EXCLUDED.keywords_count,
           traffic_share  = EXCLUDED.traffic_share,
           page_type      = EXCLUDED.page_type`,
        [snapshotDate, row.url, row.traffic, row.keywords_count, row.traffic_share, row.page_type]
      );
      upserted++;
    }

    console.log(`\nUpserted ${upserted} rows into semrush_pages for snapshot_date=${snapshotDate}`);

    // Summary by page_type
    const summary = await client.query(`
      SELECT page_type, COUNT(*) AS count, SUM(traffic) AS total_traffic
      FROM semrush_pages
      WHERE snapshot_date = $1
      GROUP BY page_type
      ORDER BY total_traffic DESC
    `, [snapshotDate]);

    console.log('\nBreakdown by page_type:');
    summary.rows.forEach(r => {
      console.log(`  ${r.page_type.padEnd(12)} ${String(r.count).padStart(3)} pages   traffic: ${r.total_traffic}`);
    });

  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
