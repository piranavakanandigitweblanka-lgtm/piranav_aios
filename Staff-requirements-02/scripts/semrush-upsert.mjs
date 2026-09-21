import { neon, neonConfig } from '../node_modules/@neondatabase/serverless/index.mjs';

const CONNECTION_STRING = 'postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const RAW_CSV = `Keyword;Position;Previous Position;Search Volume;CPC;Url;Traffic;Keyword Difficulty;Intents
ledsone;1;1;590;2.07;https://ledsone.co.uk/;472;42.00;2
connector with wire;1;1;3600;0.31;https://ledsone.co.uk/collections/wire-connectors;295;35.00;1
wire connectors;1;1;4400;0.31;https://ledsone.co.uk/collections/wire-connectors;286;22.00;1
wiring and connectors;1;1;3600;0.31;https://ledsone.co.uk/collections/wire-connectors;126;30.00;1
ledsone lighting;1;1;140;1.21;https://ledsone.co.uk/;112;40.00;2
intitle:ledsone;1;1;140;1.89;https://ledsone.co.uk/;112;40.00;2
ledsone ltd;1;1;110;1.52;https://ledsone.co.uk/;88;38.00;2
bayonet bulb;5;5;3600;0.34;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;86;12.00;1
plug in pendant light;3;3;1300;0.31;https://ledsone.co.uk/collections/plugin-lighting;84;15.00;1
plug in hanging pendant lamp;2;2;1300;0.31;https://ledsone.co.uk/collections/plugin-lighting;84;17.00;1
lamparade;2;2;1000;0.00;https://ledsone.co.uk/es/collections/table-lamps;82;22.00;1
connectors for wiring;2;1;3600;0.31;https://ledsone.co.uk/collections/wire-connectors;79;34.00;1,3
ledsone uk ltd;1;1;90;1.66;https://ledsone.co.uk/;72;36.00;2
white blackboard;7;7;3600;0.00;https://ledsone.co.uk/collections/white-board;68;61.00;1
retro light shades;2;2;480;0.24;https://ledsone.co.uk/collections/lampshades/metal-pendant-light;63;13.00;1
e27 light bulb;7;7;2900;0.00;https://ledsone.co.uk/blogs/new/e27-bulb-guide;63;25.00;1
ceiling light bracket;2;2;480;0.23;https://ledsone.co.uk/collections/ceiling-rose-brackets;63;32.00;1
plug in hanging light fixtures;2;2;720;0.31;https://ledsone.co.uk/collections/plugin-lighting;59;10.00;0
b22 bulb;8;8;4400;0.29;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;57;23.00;1
spider light fitting;1;1;390;0.36;https://ledsone.co.uk/collections/spider-light;51;9.00;1,3
spider lights;2;2;590;0.62;https://ledsone.co.uk/collections/spider-light;48;8.00;1
bulb receptacle;2;2;1000;0.46;https://ledsone.co.uk/products/vintage-industrial-lamp-light-bulb-copper-holder-e27-light-socket;44;23.00;1
what is an e27 bulb;1;1;320;0.30;https://ledsone.co.uk/blogs/new/e27-bulb-guide;42;10.00;1
vintage e27 light bulbs;1;1;170;0.48;https://ledsone.co.uk/collections/vintage-bulbs;42;7.00;1
led rope light fixture;1;1;320;0.37;https://ledsone.co.uk/collections/hemp-collection;42;10.00;1
led transformer 24v;1;1;320;0.51;https://ledsone.co.uk/collections/dc-24v-transformer;42;6.00;1
hanging lamp fittings;3;3;1300;0.59;https://ledsone.co.uk/collections/pendant-holder;39;27.00;0
e27 edison screw bulb;6;6;1300;0.28;https://ledsone.co.uk/blogs/new/e27-bulb-guide;39;12.00;1
24v transformer;2;2;480;0.64;https://ledsone.co.uk/collections/dc-24v-transformer;39;19.00;1
electrical cable connectors;2;2;880;0.29;https://ledsone.co.uk/collections/wire-connectors;38;25.00;1
pendant light;12;12;12100;0.62;https://ledsone.co.uk/collections/pendant-lights;36;24.00;1
screw light bulbs e27;7;7;1600;0.34;https://ledsone.co.uk/collections/e27-base-bulb;35;15.00;1
pipe lights;1;1;260;0.51;https://ledsone.co.uk/collections/pipe-lighting;34;11.00;1
what is e27 bulb;1;1;260;0.33;https://ledsone.co.uk/blogs/new/e27-bulb-guide;34;14.00;1
brackets for ceiling lights;2;2;260;0.23;https://ledsone.co.uk/collections/ceiling-rose-brackets;34;28.00;1
hanging lamp plug;4;4;1300;0.31;https://ledsone.co.uk/collections/plugin-lighting;31;10.00;1
hanging lamps with plug;2;2;480;0.31;https://ledsone.co.uk/collections/plugin-lighting;31;9.00;1
retro lamp shades;4;4;720;0.36;https://ledsone.co.uk/collections/lampshades;31;16.00;0,1
b22 light bulb;7;7;1300;0.26;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;28;19.00;1
pipework lights;1;1;110;1.45;https://ledsone.co.uk/collections/pipe-lighting;27;7.00;1
spider pendant lamp;1;1;210;0.43;https://ledsone.co.uk/collections/spider-light;27;8.00;1
pendant lamps plug in;1;1;110;0.31;https://ledsone.co.uk/collections/plugin-lighting;27;8.00;1
e27 bulb;22;22;18100;0.29;https://ledsone.co.uk/collections/e27-base-bulb;27;21.00;1
hanging pendant plug in light;2;2;320;0.31;https://ledsone.co.uk/collections/plugin-lighting;26;9.00;1
spider pendant light;2;2;320;0.34;https://ledsone.co.uk/collections/spider-light;26;7.00;1
spider ceiling light;1;1;320;0.43;https://ledsone.co.uk/collections/spider-light;26;9.00;1
bracket ceiling light;2;2;320;0.23;https://ledsone.co.uk/collections/ceiling-rose-brackets;26;25.00;1
pendant lamp plug;6;6;1300;0.29;https://ledsone.co.uk/collections/plugin-lighting;24;11.00;1,3
white board white;22;22;14800;1.12;https://ledsone.co.uk/collections/white-board;22;25.00;1
rope lighting for ceiling;1;1;170;0.42;https://ledsone.co.uk/collections/hemp-rope-lighting;22;23.00;1
light cage shade;1;1;170;0.29;https://ledsone.co.uk/collections/wire-cage-pendant-light;22;13.00;1
ceiling hooks for lights;2;2;170;0.25;https://ledsone.co.uk/collections/hooks-and-rings;22;15.00;1
conduit lighting;3;3;260;0.61;https://ledsone.co.uk/collections/conduit-lighting;21;8.00;1
light bracket;2;2;260;0.37;https://ledsone.co.uk/collections/ceiling-rose-brackets;21;10.00;1,3
spider light;3;3;880;0.55;https://ledsone.co.uk/collections/spider-light;21;9.00;1
transformer 12v led;2;2;260;0.37;https://ledsone.co.uk/collections/dc-12v-transformer;21;22.00;1
black and gold chandelier;3;3;320;0.47;https://ledsone.co.uk/products/black-and-gold-crystal-chandelier-light;20;7.00;1,3
decorative incandescent bulbs;2;2;320;0.37;https://ledsone.co.uk/collections/incandescent-bulbs;20;11.00;1
lighting halloween;6;6;1000;0.30;https://ledsone.co.uk/blogs/new/halloween-decoration-lighting-tips;19;16.00;1
ledstone;1;1;140;3.07;https://ledsone.co.uk/;18;13.00;2
light pendant holder;1;1;140;0.39;https://ledsone.co.uk/collections/pendant-holder;18;9.00;1
steampunk wall lights;1;1;140;0.26;https://ledsone.co.uk/products/vintage-industrial-water-pipe-lamp-retro-light-steampunk-wall-sconce-free-bulb;18;11.00;1
wall light;28;28;12100;0.46;https://ledsone.co.uk/collections/wall-light;18;15.00;1,3
12v transformer;3;3;720;0.29;https://ledsone.co.uk/collections/dc-12v-transformer;17;19.00;1
bayonet mount led bulb;7;7;720;0.25;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;17;10.00;1
bayonet fitting light bulbs;7;7;720;0.28;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;17;17.00;1
pendant light spider;2;2;210;0.34;https://ledsone.co.uk/collections/spider-light;17;6.00;0,1
plug in pendant lamp;3;3;390;0.31;https://ledsone.co.uk/collections/plugin-lighting;17;9.00;1
clear double sided tape;3;3;390;0.30;https://ledsone.co.uk/products/duty-transparent-double-sided-heavy-acrylic-clear-mounting-tape-5207;17;15.00;1
retro lampshade;4;4;480;0.21;https://ledsone.co.uk/collections/lampshades;16;16.00;1,3
transformer 12v;1;1;260;0.29;https://ledsone.co.uk/collections/dc-12v-transformer;16;10.00;1
e27 filament bulb;4;4;480;0.45;https://ledsone.co.uk/collections/e27-base-bulb;16;9.00;1
plug in hanging light;6;6;720;0.29;https://ledsone.co.uk/collections/plugin-lighting;15;10.00;1
240v to12v converter;2;2;320;0.22;https://ledsone.co.uk/products/dc12v-80w-ip20-universal-regulated-switching-power-supply;14;16.00;0,1
bayonet decorative light bulbs;2;2;110;0.27;https://ledsone.co.uk/collections/led-bulbs;14;13.00;1
light bulb with holder;5;5;590;0.28;https://ledsone.co.uk/collections/holder;14;28.00;1
hanging lamp with plug;2;2;320;0.31;https://ledsone.co.uk/collections/plugin-lighting;14;9.00;1
dry erase board;2;2;320;1.12;https://ledsone.co.uk/collections/white-board;14;25.00;1
white board;20;20;9900;0.79;https://ledsone.co.uk/collections/white-board;14;23.00;1
edison screw bulb;8;8;1600;0.34;https://ledsone.co.uk/blogs/new/e27-bulb-guide;14;13.00;1
light shades;24;24;9900;0.31;https://ledsone.co.uk/collections/lighting-shades;14;28.00;1
living room wall lighting ideas;3;3;320;0.29;https://ledsone.co.uk/blogs/new/wall-lighting-ideas-living-room;14;10.00;1
led transformer 12v;3;3;320;0.40;https://ledsone.co.uk/collections/dc-12v-transformer;14;16.00;1,3
b22 bulb;14;14;4400;0.29;https://ledsone.co.uk/collections/led-bulbs/b22-base-bulb;13;23.00;1
hanging lights with plug in;4;4;390;0.31;https://ledsone.co.uk/collections/plugin-lighting;13;16.00;1
2 core cable;6;6;1000;0.28;https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;13;9.00;1
ceiling bracket light;2;2;170;0.23;https://ledsone.co.uk/collections/ceiling-rose-brackets;13;26.00;1
decorative incandescent light bulbs;3;3;390;0.43;https://ledsone.co.uk/collections/incandescent-bulbs;13;9.00;1
12v lighting transformer;3;3;210;0.33;https://ledsone.co.uk/collections/dc-12v-transformer;13;10.00;1
black gold chandelier;2;2;210;0.47;https://ledsone.co.uk/products/black-and-gold-crystal-chandelier-light;13;7.00;1
12 volt transformer;3;3;210;0.27;https://ledsone.co.uk/collections/dc-12v-transformer;13;12.00;1
led lights bayonet;7;7;720;0.25;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;13;9.00;1
covered electrical wire;3;3;390;0.30;https://ledsone.co.uk/collections/vintage-cables;13;17.00;1
wall lights;30;30;40500;0.46;https://ledsone.co.uk/collections/wall-light;12;25.00;1
pendant plug light;8;8;1300;0.31;https://ledsone.co.uk/collections/plugin-lighting;11;11.00;1
fitting a pendant light;6;6;590;0.34;https://ledsone.co.uk/pages/pi;11;21.00;1
e27 screw light bulbs;10;10;880;0.34;https://ledsone.co.uk/blogs/new/e27-bulb-guide;11;18.00;1
screw bulb holder e27;3;3;390;0.53;https://ledsone.co.uk/collections/metal-holders;11;23.00;1
2 core electrical cable;5;5;480;0.28;https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;11;14.00;1
light shade cage;2;2;140;0.29;https://ledsone.co.uk/collections/wire-cage-pendant-light;11;16.00;1`;

async function main() {
  const sql = neon(CONNECTION_STRING);
  console.log('Neon HTTP client initialized');

  // Create table if it doesn't exist
  await sql`
    CREATE TABLE IF NOT EXISTS semrush_keywords (
      snapshot_date DATE NOT NULL,
      keyword TEXT NOT NULL,
      position INT,
      prev_position INT,
      volume INT,
      cpc NUMERIC,
      url TEXT,
      traffic INT,
      keyword_difficulty NUMERIC,
      intent TEXT,
      PRIMARY KEY (snapshot_date, keyword)
    )
  `;
  console.log('Table ensured');

  const snapshot_date = new Date().toISOString().slice(0, 10);
  const lines = RAW_CSV.split('\n');
  const dataLines = lines.slice(1); // skip header

  let upserted = 0;
  for (const line of dataLines) {
    if (!line.trim()) continue;
    const parts = line.split(';');
    const [keyword, position, prev_position, volume, cpc, url, traffic, keyword_difficulty, intent] = parts;

    await sql`
      INSERT INTO semrush_keywords
        (snapshot_date, keyword, position, prev_position, volume, cpc, url, traffic, keyword_difficulty, intent)
      VALUES (
        ${snapshot_date}::date,
        ${keyword},
        ${parseInt(position) || null},
        ${parseInt(prev_position) || null},
        ${parseInt(volume) || null},
        ${parseFloat(cpc) || null},
        ${url},
        ${parseInt(traffic) || null},
        ${parseFloat(keyword_difficulty) || null},
        ${intent ? intent.trim() : null}
      )
      ON CONFLICT (snapshot_date, keyword) DO UPDATE SET
        position = EXCLUDED.position,
        prev_position = EXCLUDED.prev_position,
        volume = EXCLUDED.volume,
        cpc = EXCLUDED.cpc,
        url = EXCLUDED.url,
        traffic = EXCLUDED.traffic,
        keyword_difficulty = EXCLUDED.keyword_difficulty,
        intent = EXCLUDED.intent
    `;
    upserted++;
  }

  console.log(`Upserted ${upserted} rows for snapshot_date=${snapshot_date}`);
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
