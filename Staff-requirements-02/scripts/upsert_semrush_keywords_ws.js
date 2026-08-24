// upsert_semrush_keywords_ws.js — uses @neondatabase/serverless (WebSocket) to bypass TCP/5432 restrictions
'use strict';

const { neon, neonConfig } = require('../node_modules/@neondatabase/serverless');
const ws = require('../node_modules/ws');

// Configure WebSocket for non-browser environment
neonConfig.webSocketConstructor = ws;

const CONNECTION_STRING = 'postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';

// Raw SEMrush semicolon-delimited data (header + rows)
const RAW_DATA = `Keyword;Position;Previous Position;Search Volume;CPC;Url;Traffic;Keyword Difficulty;Intents
ledsone;1;1;590;1.77;https://ledsone.co.uk/;472;41.00;2
wire connectors;2;2;4400;0.27;https://ledsone.co.uk/collections/wire-connectors;360;29.00;1
intitle:ledsone;1;1;140;1.89;https://ledsone.co.uk/;112;40.00;2
spider lights;1;1;720;0.45;https://ledsone.co.uk/collections/spider-light;95;9.00;1
ledstone;1;1;110;3.21;https://ledsone.co.uk/;88;34.00;2
plug in pendant light;3;3;1300;0.31;https://ledsone.co.uk/collections/plugin-lighting;84;15.00;1
plug in hanging pendant lamp;2;2;1300;0.31;https://ledsone.co.uk/collections/plugin-lighting;84;17.00;1
ledsone uk limited;1;1;90;1.40;https://ledsone.co.uk/;72;0.0;2
ledsone lighting;1;1;90;0.87;https://ledsone.co.uk/;72;41.00;2
ledsone ltd;1;1;90;1.15;https://ledsone.co.uk/;72;38.00;2
wiring and connectors;2;2;2900;0.25;https://ledsone.co.uk/collections/wire-connectors;69;31.00;1
bayonet light bulb;5;5;2900;0.30;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;69;23.00;1
retro light shades;2;2;480;0.24;https://ledsone.co.uk/collections/lampshades/metal-pendant-light;63;13.00;1
ceiling light bracket;2;2;480;0.23;https://ledsone.co.uk/collections/ceiling-rose-brackets;63;32.00;1
e27 bulb;14;14;18100;0.28;https://ledsone.co.uk/collections/e27-base-bulb;54;21.00;1
3 core cable;6;6;2400;0.22;https://ledsone.co.uk/blogs/new/understanding-3-core-electrical-cables-types-uses-and-color-codes;52;15.00;1
spider light fitting;1;1;390;0.36;https://ledsone.co.uk/collections/spider-light;51;9.00;1,3
plug in hanging light fixtures;2;2;590;0.32;https://ledsone.co.uk/collections/plugin-lighting;48;12.00;0
connectors for wiring;4;4;3600;0.27;https://ledsone.co.uk/collections/wire-connectors;46;37.00;1
weighing machine scale;8;8;6600;0.44;https://ledsone.co.uk/collections/weighing-scale;46;28.00;1
retro lamp shades;2;2;720;0.23;https://ledsone.co.uk/collections/lampshades;46;22.00;1,3
bulbs for dimmers;2;2;1000;0.18;https://ledsone.co.uk/collections/dimmable-led-bulbs;44;17.00;1
what is an e27 bulb;1;1;320;0.31;https://ledsone.co.uk/blogs/new/e27-bulb-guide;42;11.00;1
led rope light fixture;1;1;320;0.37;https://ledsone.co.uk/collections/hemp-collection;42;10.00;1
led transformer 24v;1;1;320;0.62;https://ledsone.co.uk/collections/dc-24v-transformer;42;8.00;0
brackets for ceiling lights;2;2;320;0.22;https://ledsone.co.uk/collections/ceiling-rose-brackets;42;28.00;0
e27 edison screw bulb;6;6;1300;0.28;https://ledsone.co.uk/blogs/new/e27-bulb-guide;39;12.00;1
24v transformer;2;2;480;0.64;https://ledsone.co.uk/collections/dc-24v-transformer;39;19.00;1
e27 light bulb;10;10;2900;0.26;https://ledsone.co.uk/collections/e27-base-bulb;37;22.00;1
screw light bulbs e27;7;7;1600;0.31;https://ledsone.co.uk/blogs/new/e27-bulb-guide;35;20.00;1
white blackboard;9;9;3600;0.61;https://ledsone.co.uk/collections/white-board;32;41.00;1
hanging lamp plug;4;4;1300;0.31;https://ledsone.co.uk/collections/plugin-lighting;31;10.00;1
2 core cable;5;5;1300;0.29;https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;31;9.00;1
b22 light bulb;7;7;1300;0.26;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;28;19.00;1
cage light shade;1;1;210;0.26;https://ledsone.co.uk/collections/wire-cage-pendant-light;27;16.00;1,3
pipework lights;1;1;110;1.45;https://ledsone.co.uk/collections/pipe-lighting;27;7.00;1
spider pendant light;2;2;320;0.34;https://ledsone.co.uk/collections/spider-light;26;7.00;1
mould resistant shower curtain;2;2;320;0.27;https://ledsone.co.uk/products/fabric-solid-color-shower-curtain-for-bathtub-shower-5288;26;26.00;1
what is e27 bulb;1;1;320;0.35;https://ledsone.co.uk/blogs/new/e27-bulb-guide;26;8.00;1
bracket ceiling light;2;2;320;0.23;https://ledsone.co.uk/collections/ceiling-rose-brackets;26;25.00;0
big bag for laundry;3;3;720;0.33;https://ledsone.co.uk/collections/laundry-bags;25;16.00;1
pendant lamp;6;6;1000;0.43;https://ledsone.co.uk/collections/pendant-lights;24;22.00;0
pendant lamp plug;6;6;1300;0.29;https://ledsone.co.uk/collections/plugin-lighting;24;11.00;1,3
b22 bulb;11;11;4400;0.31;https://ledsone.co.uk/collections/led-bulbs/b22-base-bulb;22;23.00;1
cage hanging light;1;1;90;0.48;https://ledsone.co.uk/collections/wire-cage-pendant-light;22;10.00;1,3
vintage e27 light bulbs;2;2;170;0.38;https://ledsone.co.uk/collections/vintage-bulbs;22;10.00;0
light cage shade;1;1;170;0.29;https://ledsone.co.uk/collections/wire-cage-pendant-light;22;13.00;1
ceiling hooks for lights;2;2;170;0.25;https://ledsone.co.uk/collections/hooks-and-rings;22;15.00;1
conduit lighting;3;3;260;0.61;https://ledsone.co.uk/collections/conduit-lighting;21;8.00;1
pipe lights;2;2;260;0.89;https://ledsone.co.uk/collections/pipe-lighting;21;10.00;1
spider light;3;3;880;0.55;https://ledsone.co.uk/collections/spider-light;21;9.00;1
transformer 12v led;2;2;260;0.37;https://ledsone.co.uk/collections/dc-12v-transformer;21;22.00;1
spider ceiling light;2;2;320;0.49;https://ledsone.co.uk/collections/spider-light;20;8.00;1
double sided tape;19;19;12100;0.35;https://ledsone.co.uk/products/double-sided-heavy-duty-mounting-removable-tape;18;20.00;1
white blackboard;10;10;3600;0.61;https://ledsone.co.uk/collections/white-board;18;41.00;1
light pendant holder;1;1;140;0.39;https://ledsone.co.uk/collections/pendant-holder;18;9.00;1
12v transformer;3;3;720;0.29;https://ledsone.co.uk/collections/dc-12v-transformer;17;19.00;1
bayonet mount led bulb;7;7;720;0.25;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;17;10.00;1
e27 screw light bulbs;7;7;720;0.31;https://ledsone.co.uk/blogs/new/e27-bulb-guide;17;10.00;1
spider pendant lamp;2;2;210;0.46;https://ledsone.co.uk/collections/spider-light;17;7.00;1,3
bayonet fitting light bulbs;7;7;720;0.28;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;17;17.00;1
pendant light spider;2;2;210;0.34;https://ledsone.co.uk/collections/spider-light;17;6.00;0,1
ceiling hooks for lighting;6;6;590;0.32;https://ledsone.co.uk/collections/hooks-and-rings;17;9.00;1
led transformers 12v;1;1;210;0.41;https://ledsone.co.uk/collections/dc-12v-transformer;17;11.00;1,3
edison screw lamp holder;4;4;480;0.48;https://ledsone.co.uk/products/black-screw-e27-light-bulb-lamp-holder-base-pendant-socket-4378;16;7.00;1
shower curtain;30;30;22200;0.29;https://ledsone.co.uk/collections/shower-curtain;15;32.00;1
plug in hanging light;6;6;720;0.29;https://ledsone.co.uk/collections/plugin-lighting;15;10.00;1
bayonet decorative light bulbs;2;2;110;0.26;https://ledsone.co.uk/collections/led-bulbs;14;14.00;1
light bulb with holder;5;5;590;0.28;https://ledsone.co.uk/collections/holder;14;28.00;1
transformer 24v;1;1;110;0.23;https://ledsone.co.uk/collections/dc-24v-transformer;14;16.00;1,3
white board;19;19;9900;0.61;https://ledsone.co.uk/collections/white-board;14;32.00;1
edison screw bulb;8;8;1600;0.34;https://ledsone.co.uk/blogs/new/e27-bulb-guide;14;13.00;1
light shades;22;22;9900;0.25;https://ledsone.co.uk/collections/lighting-shades;14;34.00;1
bayonet fitting led bulbs;7;7;590;0.25;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;14;12.00;1
living room wall lighting ideas;3;3;320;0.29;https://ledsone.co.uk/blogs/new/wall-lighting-ideas-living-room;14;10.00;1
led transformer 12v;3;3;320;0.41;https://ledsone.co.uk/collections/dc-12v-transformer;14;9.00;1,3
edison screw e27 lamp;2;2;590;0.33;https://ledsone.co.uk/collections/e27-base-bulb;14;9.00;1
3m double sided tape;11;11;3600;0.35;https://ledsone.co.uk/products/double-sided-heavy-duty-mounting-removable-tape;14;24.00;1
tape;22;22;9900;2.08;https://ledsone.co.uk/collections/tapes;14;28.00;1
e27 lamp base;3;3;170;0.31;https://ledsone.co.uk/collections/metal-holders;13;23.00;1
hanging lights with plug in;4;4;390;0.31;https://ledsone.co.uk/collections/plugin-lighting;13;16.00;1
weight scale scale;14;14;4400;0.37;https://ledsone.co.uk/collections/weighing-scale;13;28.00;1,3
steampunk wall lights;1;1;170;0.27;https://ledsone.co.uk/products/vintage-industrial-water-pipe-lamp-retro-light-steampunk-wall-sconce-free-bulb;13;7.00;1
ceiling bracket light;2;2;170;0.23;https://ledsone.co.uk/collections/ceiling-rose-brackets;13;26.00;1
12v lighting transformer;3;3;210;0.33;https://ledsone.co.uk/collections/dc-12v-transformer;13;10.00;1
pendant light holder;1;1;170;0.29;https://ledsone.co.uk/collections/pendant-holder;13;9.00;1
rope hanging lamp;1;1;170;0.53;https://ledsone.co.uk/collections/hemp-rope-lighting;13;9.00;1
lamp shade holder ring;2;2;170;0.21;https://ledsone.co.uk/products/screw-e27-plain-holder-white-with-ring-bakelite-lamp-holder;13;7.00;1,3
led lights bayonet;7;7;720;0.25;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;13;9.00;1
covered electrical wire;3;3;390;0.29;https://ledsone.co.uk/collections/vintage-cables;13;9.00;1
laundry bag;26;26;8100;0.31;https://ledsone.co.uk/collections/laundry-bags;12;26.00;1
white board white;25;25;18100;0.94;https://ledsone.co.uk/collections/white-board;12;22.00;1
pendant plug light;8;8;1300;0.31;https://ledsone.co.uk/collections/plugin-lighting;11;11.00;1
fitting a pendant light;6;6;590;0.34;https://ledsone.co.uk/pages/pi;11;21.00;1
hanging pendant plug in light;2;2;140;0.41;https://ledsone.co.uk/collections/plugin-lighting;11;8.00;1
electrical cable connectors types;6;6;880;0.42;https://ledsone.co.uk/collections/wire-connectors;11;33.00;1
decorative light bulbs bayonet fitting;3;3;140;0.26;https://ledsone.co.uk/collections/led-bulbs;11;12.00;1
2 core electrical cable;5;5;480;0.29;https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;11;9.00;1
spider hanging lights;1;1;90;0.46;https://ledsone.co.uk/collections/spider-light;11;10.00;1,3
bayonet led lamps;8;8;880;0.25;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;11;9.00;1`;

async function main() {
  console.log('Connecting via Neon serverless (WebSocket)...');
  const sql = neon(CONNECTION_STRING);

  try {
    // Quick connectivity check
    await sql`SELECT 1`;
    console.log('Connected OK.');

    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS semrush_keywords (
        snapshot_date       DATE,
        keyword             TEXT,
        position            INT,
        prev_position       INT,
        volume              INT,
        cpc                 NUMERIC,
        url                 TEXT,
        traffic             INT,
        keyword_difficulty  NUMERIC,
        intent              TEXT,
        PRIMARY KEY (snapshot_date, keyword)
      )
    `;

    const snapshot_date = new Date().toISOString().slice(0, 10);
    const lines = RAW_DATA.split('\n');
    const dataLines = lines.slice(1).filter(l => l.trim() !== '');

    let upsertCount = 0;
    for (const line of dataLines) {
      const cols = line.split(';');
      if (cols.length < 9) {
        console.warn('Skipping malformed line:', line);
        continue;
      }
      const [keyword, position, prev_position, volume, cpc, url, traffic, keyword_difficulty, intent] = cols;

      await sql`
        INSERT INTO semrush_keywords
          (snapshot_date, keyword, position, prev_position, volume, cpc, url, traffic, keyword_difficulty, intent)
        VALUES (
          ${snapshot_date},
          ${keyword.trim()},
          ${parseInt(position, 10) || null},
          ${parseInt(prev_position, 10) || null},
          ${parseInt(volume, 10) || null},
          ${parseFloat(cpc) || null},
          ${url.trim()},
          ${parseInt(traffic, 10) || null},
          ${parseFloat(keyword_difficulty) || null},
          ${intent.trim()}
        )
        ON CONFLICT (snapshot_date, keyword)
        DO UPDATE SET
          position           = EXCLUDED.position,
          prev_position      = EXCLUDED.prev_position,
          volume             = EXCLUDED.volume,
          cpc                = EXCLUDED.cpc,
          url                = EXCLUDED.url,
          traffic            = EXCLUDED.traffic,
          keyword_difficulty = EXCLUDED.keyword_difficulty,
          intent             = EXCLUDED.intent
      `;
      upsertCount++;
    }

    console.log(`Upserted ${upsertCount} rows for snapshot_date=${snapshot_date}.`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
