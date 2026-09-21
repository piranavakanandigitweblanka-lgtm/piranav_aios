/**
 * Weekly SEO Keyword Gap Refresh
 * Compares ledsone.co.uk vs 3 competitors and writes gap data to Neon DB
 * Run: node scripts/seo-keyword-gap-refresh.js
 */

const { Pool } = require('pg');

const CONN = 'postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb';

// ─── RAW SEMRUSH DATA (collected 2026-09-21) ───────────────────────────────

const LEDSONE_CSV = `keyword;position;volume;traffic;url;kd;intent
ledsone;1;590;472;https://ledsone.co.uk/;42;2
connector with wire;1;3600;295;https://ledsone.co.uk/collections/wire-connectors;35;1
wire connectors;1;4400;286;https://ledsone.co.uk/collections/wire-connectors;22;1
wiring and connectors;1;3600;126;https://ledsone.co.uk/collections/wire-connectors;30;1
ledsone lighting;1;140;112;https://ledsone.co.uk/;40;2
intitle:ledsone;1;140;112;https://ledsone.co.uk/;40;2
ledsone ltd;1;110;88;https://ledsone.co.uk/;38;2
bayonet bulb;5;3600;86;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;12;1
plug in pendant light;3;1300;84;https://ledsone.co.uk/collections/plugin-lighting;15;1
plug in hanging pendant lamp;2;1300;84;https://ledsone.co.uk/collections/plugin-lighting;17;1
lamparade;2;1000;82;https://ledsone.co.uk/es/collections/table-lamps;22;1
connectors for wiring;2;3600;79;https://ledsone.co.uk/collections/wire-connectors;34;1
ledsone uk ltd;1;90;72;https://ledsone.co.uk/;36;2
white blackboard;7;3600;68;https://ledsone.co.uk/collections/white-board;61;1
retro light shades;2;480;63;https://ledsone.co.uk/collections/lampshades/metal-pendant-light;13;1
e27 light bulb;7;2900;63;https://ledsone.co.uk/blogs/new/e27-bulb-guide;25;1
ceiling light bracket;2;480;63;https://ledsone.co.uk/collections/ceiling-rose-brackets;32;1
plug in hanging light fixtures;2;720;59;https://ledsone.co.uk/collections/plugin-lighting;10;0
b22 bulb;8;4400;57;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;23;1
spider light fitting;1;390;51;https://ledsone.co.uk/collections/spider-light;9;1
spider lights;2;590;48;https://ledsone.co.uk/collections/spider-light;8;1
bulb receptacle;2;1000;44;https://ledsone.co.uk/products/vintage-industrial-lamp-light-bulb-copper-holder-e27-light-socket;23;1
what is an e27 bulb;1;320;42;https://ledsone.co.uk/blogs/new/e27-bulb-guide;10;1
vintage e27 light bulbs;1;170;42;https://ledsone.co.uk/collections/vintage-bulbs;7;1
led rope light fixture;1;320;42;https://ledsone.co.uk/collections/hemp-collection;10;1
led transformer 24v;1;320;42;https://ledsone.co.uk/collections/dc-24v-transformer;6;1
hanging lamp fittings;3;1300;39;https://ledsone.co.uk/collections/pendant-holder;27;0
e27 edison screw bulb;6;1300;39;https://ledsone.co.uk/blogs/new/e27-bulb-guide;12;1
24v transformer;2;480;39;https://ledsone.co.uk/collections/dc-24v-transformer;19;1
electrical cable connectors;2;880;38;https://ledsone.co.uk/collections/wire-connectors;25;1
pendant light;12;12100;36;https://ledsone.co.uk/collections/pendant-lights;24;1
screw light bulbs e27;7;1600;35;https://ledsone.co.uk/collections/e27-base-bulb;15;1
pipe lights;1;260;34;https://ledsone.co.uk/collections/pipe-lighting;11;1
what is e27 bulb;1;260;34;https://ledsone.co.uk/blogs/new/e27-bulb-guide;14;1
brackets for ceiling lights;2;260;34;https://ledsone.co.uk/collections/ceiling-rose-brackets;28;1
hanging lamp plug;4;1300;31;https://ledsone.co.uk/collections/plugin-lighting;10;1
hanging lamps with plug;2;480;31;https://ledsone.co.uk/collections/plugin-lighting;9;1
retro lamp shades;4;720;31;https://ledsone.co.uk/collections/lampshades;16;0
b22 light bulb;7;1300;28;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;19;1
pipework lights;1;110;27;https://ledsone.co.uk/collections/pipe-lighting;7;1
spider pendant lamp;1;210;27;https://ledsone.co.uk/collections/spider-light;8;1
pendant lamps plug in;1;110;27;https://ledsone.co.uk/collections/plugin-lighting;8;1
e27 bulb;22;18100;27;https://ledsone.co.uk/collections/e27-base-bulb;21;1
hanging pendant plug in light;2;320;26;https://ledsone.co.uk/collections/plugin-lighting;9;1
spider pendant light;2;320;26;https://ledsone.co.uk/collections/spider-light;7;1
spider ceiling light;1;320;26;https://ledsone.co.uk/collections/spider-light;9;1
bracket ceiling light;2;320;26;https://ledsone.co.uk/collections/ceiling-rose-brackets;25;1
pendant lamp plug;6;1300;24;https://ledsone.co.uk/collections/plugin-lighting;11;1
white board white;22;14800;22;https://ledsone.co.uk/collections/white-board;25;1
rope lighting for ceiling;1;170;22;https://ledsone.co.uk/collections/hemp-rope-lighting;23;1
light cage shade;1;170;22;https://ledsone.co.uk/collections/wire-cage-pendant-light;13;1
ceiling hooks for lights;2;170;22;https://ledsone.co.uk/collections/hooks-and-rings;15;1
conduit lighting;3;260;21;https://ledsone.co.uk/collections/conduit-lighting;8;1
light bracket;2;260;21;https://ledsone.co.uk/collections/ceiling-rose-brackets;10;1
spider light;3;880;21;https://ledsone.co.uk/collections/spider-light;9;1
transformer 12v led;2;260;21;https://ledsone.co.uk/collections/dc-12v-transformer;22;1
black and gold chandelier;3;320;20;https://ledsone.co.uk/products/black-and-gold-crystal-chandelier-light;7;1
decorative incandescent bulbs;2;320;20;https://ledsone.co.uk/collections/incandescent-bulbs;11;1
lighting halloween;6;1000;19;https://ledsone.co.uk/blogs/new/halloween-decoration-lighting-tips;16;1
ledstone;1;140;18;https://ledsone.co.uk/;13;2
light pendant holder;1;140;18;https://ledsone.co.uk/collections/pendant-holder;9;1
steampunk wall lights;1;140;18;https://ledsone.co.uk/products/vintage-industrial-water-pipe-lamp-retro-light-steampunk-wall-sconce-free-bulb;11;1
wall light;28;12100;18;https://ledsone.co.uk/collections/wall-light;15;1
12v transformer;3;720;17;https://ledsone.co.uk/collections/dc-12v-transformer;19;1
bayonet mount led bulb;7;720;17;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;10;1
bayonet fitting light bulbs;7;720;17;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;17;1
pendant light spider;2;210;17;https://ledsone.co.uk/collections/spider-light;6;0
plug in pendant lamp;3;390;17;https://ledsone.co.uk/collections/plugin-lighting;9;1
clear double sided tape;3;390;17;https://ledsone.co.uk/products/duty-transparent-double-sided-heavy-acrylic-clear-mounting-tape-5207;15;1
retro lampshade;4;480;16;https://ledsone.co.uk/collections/lampshades;16;1
transformer 12v;1;260;16;https://ledsone.co.uk/collections/dc-12v-transformer;10;1
e27 filament bulb;4;480;16;https://ledsone.co.uk/collections/e27-base-bulb;9;1
plug in hanging light;6;720;15;https://ledsone.co.uk/collections/plugin-lighting;10;1
240v to12v converter;2;320;14;https://ledsone.co.uk/products/dc12v-80w-ip20-universal-regulated-switching-power-supply;16;0
bayonet decorative light bulbs;2;110;14;https://ledsone.co.uk/collections/led-bulbs;13;1
light bulb with holder;5;590;14;https://ledsone.co.uk/collections/holder;28;1
hanging lamp with plug;2;320;14;https://ledsone.co.uk/collections/plugin-lighting;9;1
dry erase board;2;320;14;https://ledsone.co.uk/collections/white-board;25;1
white board;20;9900;14;https://ledsone.co.uk/collections/white-board;23;1
edison screw bulb;8;1600;14;https://ledsone.co.uk/blogs/new/e27-bulb-guide;13;1
light shades;24;9900;14;https://ledsone.co.uk/collections/lighting-shades;28;1
living room wall lighting ideas;3;320;14;https://ledsone.co.uk/blogs/new/wall-lighting-ideas-living-room;10;1
led transformer 12v;3;320;14;https://ledsone.co.uk/collections/dc-12v-transformer;16;1
b22 bulb;14;4400;13;https://ledsone.co.uk/collections/led-bulbs/b22-base-bulb;23;1
hanging lights with plug in;4;390;13;https://ledsone.co.uk/collections/plugin-lighting;16;1
2 core cable;6;1000;13;https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;9;1
ceiling bracket light;2;170;13;https://ledsone.co.uk/collections/ceiling-rose-brackets;26;1
decorative incandescent light bulbs;3;390;13;https://ledsone.co.uk/collections/incandescent-bulbs;9;1
12v lighting transformer;3;210;13;https://ledsone.co.uk/collections/dc-12v-transformer;10;1
black gold chandelier;2;210;13;https://ledsone.co.uk/products/black-and-gold-crystal-chandelier-light;7;1
12 volt transformer;3;210;13;https://ledsone.co.uk/collections/dc-12v-transformer;12;1
led lights bayonet;7;720;13;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;9;1
covered electrical wire;3;390;13;https://ledsone.co.uk/collections/vintage-cables;17;1
wall lights;30;40500;12;https://ledsone.co.uk/collections/wall-light;25;1
pendant plug light;8;1300;11;https://ledsone.co.uk/collections/plugin-lighting;11;1
fitting a pendant light;6;590;11;https://ledsone.co.uk/pages/pi;21;1
e27 screw light bulbs;10;880;11;https://ledsone.co.uk/blogs/new/e27-bulb-guide;18;1
screw bulb holder e27;3;390;11;https://ledsone.co.uk/collections/metal-holders;23;1
2 core electrical cable;5;480;11;https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;14;1
light shade cage;2;140;11;https://ledsone.co.uk/collections/wire-cage-pendant-light;16;1
240v to 12 volt converter;2;320;11;https://ledsone.co.uk/products/dc12v-80w-ip20-universal-regulated-switching-power-supply;21;1
wiring a ceiling rose;3;480;11;https://ledsone.co.uk/collections/ceiling-rose-brackets;10;1
plug in hanging light fixture;2;170;11;https://ledsone.co.uk/collections/plugin-lighting;9;1
plug in light chandelier;2;170;11;https://ledsone.co.uk/collections/plugin-lighting;16;1
pendant light with plug in;2;260;11;https://ledsone.co.uk/collections/plugin-lighting;9;1
12v led lighting transformer;3;260;11;https://ledsone.co.uk/collections/dc-12v-transformer;14;1
e27 bulb base;2;320;11;https://ledsone.co.uk/collections/metal-holders;27;1
spider light pendant;2;140;11;https://ledsone.co.uk/collections/spider-light;5;1
pendant light holder;2;170;11;https://ledsone.co.uk/collections/pendant-holder;8;1
240v to 24v transformer;3;260;11;https://ledsone.co.uk/products/led-driver-universal-regulated-switching-power-supply-transformer-ac-240v-dc-24v;13;1
led transformer;7;880;11;https://ledsone.co.uk/blogs/new/transformers-for-led-lighting-complete-guide;10;1
rose gold ceiling lamp;2;170;11;https://ledsone.co.uk/collections/rose-gold-lighting;10;1
anti mould shower curtain;7;480;10;https://ledsone.co.uk/products/fabric-solid-color-shower-curtain-for-bathtub-shower-5288;22;0
light bracket for ceiling;2;110;9;https://ledsone.co.uk/collections/ceiling-rose-brackets;28;1
ceiling light fixture flush;13;6600;9;https://ledsone.co.uk/collections/ceiling-lights-for-flash-lights;12;1
retro e27 bulb;2;110;9;https://ledsone.co.uk/collections/vintage-bulbs;8;1
corded pendant lamp;2;210;9;https://ledsone.co.uk/collections/plugin-lighting;11;1
led bayonet bulb;8;480;9;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;9;1
modern pendant lamp;4;320;9;https://ledsone.co.uk/blogs/new/10-stylish-pendant-lights-for-a-modern-kitchen;14;1
b22 bayonet bulb;7;390;9;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;21;1
decorative light bulbs bayonet;2;110;9;https://ledsone.co.uk/collections/led-bulbs;10;1
electric light bulb fittings;7;390;9;https://ledsone.co.uk/collections/holder;28;1
bc22 light bulb;8;1000;9;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;16;1
weighing machine scale;15;6600;9;https://ledsone.co.uk/collections/weighing-scale;29;1
hanging pendant plug in lights;2;140;9;https://ledsone.co.uk/collections/plugin-lighting;19;1
swag light;2;140;9;https://ledsone.co.uk/products/single-ceiling-pendant-lamp-shade-swag-hanging-light;23;1
bulb holder screw;3;140;9;https://ledsone.co.uk/collections/metal-holders;6;1
mold proof shower curtain;4;320;9;https://ledsone.co.uk/products/fabric-solid-color-shower-curtain-for-bathtub-shower-5288;21;1
light fitting bracket;4;140;9;https://ledsone.co.uk/collections/ceiling-rose-brackets;30;0
12v led light transformer;2;210;9;https://ledsone.co.uk/collections/dc-12v-transformer;9;1
hooks for hanging lamps;2;140;9;https://ledsone.co.uk/collections/hooks-and-rings;15;1
wardrobe organiser;21;6600;9;https://ledsone.co.uk/collections/storage-bags;36;1
12v lighting transformers;2;140;9;https://ledsone.co.uk/collections/dc-12v-transformer;9;1
electrical connectors push fit;3;140;9;https://ledsone.co.uk/products/32a-spring-lever-push-fit-reusable-5-way-wire-connectors;15;1
mini pendant lamp;4;210;9;https://ledsone.co.uk/collections/pendant-lights;16;1
lamp shade chrome;2;140;9;https://ledsone.co.uk/products/modern-ceiling-pendant-light-shades-chrome-colour-lamp-shades-easy-fit;21;1
bayonet bulb sizes;4;390;9;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;22;1
240v to 12v converter;2;390;9;https://ledsone.co.uk/products/dc12v-80w-ip20-universal-regulated-switching-power-supply;21;1
240v to12v transformer;4;390;9;https://ledsone.co.uk/products/dc12v-80w-ip20-universal-regulated-switching-power-supply;14;1
pulley pendant light;2;110;9;https://ledsone.co.uk/collections/pulley-wheel-pendant-light;16;1
e27 led bulb;25;5400;8;https://ledsone.co.uk/collections/e27-base-bulb;16;1
whiteboard;43;27100;8;https://ledsone.co.uk/collections/white-board;72;1
lights that hang;13;2900;8;https://ledsone.co.uk/collections/chandeliers-lighting;17;1
vintage glass light shades;8;390;8;https://ledsone.co.uk/collections/lampshades;6;1
sconce;21;5400;8;https://ledsone.co.uk/collections/wall-light;31;1
dimmable light bulbs;15;2900;8;https://ledsone.co.uk/collections/dimmable-led-bulbs;22;1
cage light shade;2;210;7;https://ledsone.co.uk/collections/wire-cage-pendant-light;21;1
stained glass lamp shades;8;590;7;https://ledsone.co.uk/products/vintage-tiffany-style-stained-glass-shade-fixtures-4541;16;1
cage lamp pendant;2;110;7;https://ledsone.co.uk/collections/wire-cage-pendant-light;7;1
vintage light bulbs e27;5;170;7;https://ledsone.co.uk/collections/vintage-bulbs;6;1
chrome lamp shade;2;170;7;https://ledsone.co.uk/products/modern-ceiling-pendant-light-shades-chrome-colour-lamp-shades-easy-fit;19;1
24v to 24v transformer;2;210;7;https://ledsone.co.uk/collections/dc-24v-transformer;9;1
e27 bulbs;14;2400;7;https://ledsone.co.uk/collections/e27-base-bulb;13;1
flush light;9;880;7;https://ledsone.co.uk/collections/ceiling-lights-for-flash-lights;16;1
light bulb bayonet;4;320;7;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;16;1
e27 lamp base;4;170;7;https://ledsone.co.uk/collections/metal-holders;24;1
e27 base;1;110;7;https://ledsone.co.uk/collections/metal-holders;27;1
vintage led bulbs;5;260;7;https://ledsone.co.uk/collections/led-bulbs;13;1
conduit light fittings;3;110;7;https://ledsone.co.uk/collections/conduit-lighting;4;1
black wire light shade;3;170;7;https://ledsone.co.uk/collections/wire-cage;16;1
plug in ceiling light;7;590;7;https://ledsone.co.uk/collections/plugin-lighting;16;1
dimmable led module;5;320;7;https://ledsone.co.uk/collections/led-modules;9;1
light with plug in;5;320;7;https://ledsone.co.uk/collections/plugin-lighting;9;1
e27 bulb what is;3;170;7;https://ledsone.co.uk/blogs/new/e27-bulb-guide;15;1
e27 bulb size;6;320;7;https://ledsone.co.uk/blogs/new/e27-bulb-guide;17;1
pendant plug in lamp;2;110;7;https://ledsone.co.uk/collections/plugin-lighting;9;1
bayonet fitting led bulbs;9;590;7;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;10;1
pendant light that plugs in;4;210;7;https://ledsone.co.uk/collections/plugin-lighting;7;1
led e27 vintage;2;110;7;https://ledsone.co.uk/collections/vintage-bulbs;10;1
lampshade for hanging light;14;2400;7;https://ledsone.co.uk/collections/easy-fit-lamp-shades-cages;31;1
rope lights;15;2400;7;https://ledsone.co.uk/collections/hemp-rope-lighting;14;1
e27 filament light bulb;5;320;7;https://ledsone.co.uk/collections/e27-base-bulb;10;1
e27 screw lamp holder;4;320;7;https://ledsone.co.uk/collections/metal-holders;25;1
raven lamp;2;170;7;https://ledsone.co.uk/products/black-raven-shape-rasin-bird-table-lamps-desk-lamp;25;1
led pendant lights;10;720;6;https://ledsone.co.uk/collections/pendant-lights;11;1
lamp and socket;5;210;6;https://ledsone.co.uk/products/vintage-industrial-lamp-light-bulb-copper-holder-e27-light-socket;22;1
e27 light bulb base;3;210;6;https://ledsone.co.uk/collections/metal-holders;30;1
cage lamp shade;3;140;6;https://ledsone.co.uk/collections/wire-cage;16;1
filament light bulbs e27;2;140;6;https://ledsone.co.uk/collections/e27-base-bulb;10;1
holder for lamp shade;3;210;6;https://ledsone.co.uk/products/screw-e27-plain-holder-white-with-ring-bakelite-lamp-holder;7;1
e27 bulb filament;4;260;6;https://ledsone.co.uk/collections/e27-base-bulb;9;1`;

const LEDHUT_CSV = `keyword;position;volume;traffic;url;kd;intent
led light bulbs;1;5400;712;https://ledhut.co.uk/collections/led-light-bulbs;18;1
led bulbs;1;5400;712;https://ledhut.co.uk/collections/led-light-bulbs;25;1
led lights;5;33100;628;https://ledhut.co.uk/;41;1
led lights and bulbs;1;2400;595;https://ledhut.co.uk/collections/led-light-bulbs;43;1
led;4;18100;543;https://ledhut.co.uk/collections/led-light-bulbs;41;1
ledowe;3;14800;518;https://ledhut.co.uk/collections/led-light-bulbs;28;1
bulbs with led;1;3600;475;https://ledhut.co.uk/collections/led-light-bulbs;31;1
led bulb bulb;1;3600;475;https://ledhut.co.uk/collections/led-light-bulbs;21;1
led hut;1;590;472;https://ledhut.co.uk/;44;2
e27 bulb;5;18100;434;https://ledhut.co.uk/collections/e27-led-bulbs-es;21;1
light with bulb;1;12100;423;https://ledhut.co.uk/collections/led-light-bulbs;19;1
light bulbs;3;12100;363;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;27;1
light bulb;2;12100;363;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;22;1
led lamp led lamp;1;4400;360;https://ledhut.co.uk/collections/led-light-bulbs;33;1
bulb;3;8100;356;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;33;1
gu10 bulb;2;8100;356;https://ledhut.co.uk/collections/gu10-led-bulbs;20;1
e27 led bulb;1;5400;351;https://ledhut.co.uk/collections/e27-led-bulbs-es;16;1
gu10 led bulbs;2;5400;351;https://ledhut.co.uk/collections/gu10-led-bulbs;22;1
dimmable led bulbs;1;1300;322;https://ledhut.co.uk/collections/dimmable-led-bulbs;19;1
e27 bulbs;1;2400;316;https://ledhut.co.uk/collections/e27-led-bulbs-es;13;1
led bulb led;1;2400;316;https://ledhut.co.uk/collections/led-light-bulbs;28;1
gu10 light bulb;1;2400;316;https://ledhut.co.uk/collections/gu10-led-bulbs;23;1
ledhut;1;390;312;https://ledhut.co.uk/;50;2
led in bulb;1;3600;295;https://ledhut.co.uk/collections/led-light-bulbs;24;1
led bulb led lighting;1;3600;295;https://ledhut.co.uk/collections/led-light-bulbs;28;1
led light light bulbs;1;3600;295;https://ledhut.co.uk/collections/led-light-bulbs;24;1
led spotlights;2;3600;295;https://ledhut.co.uk/collections/led-spotlights;16;1
gu10 bulbs;1;4400;286;https://ledhut.co.uk/collections/gu10-led-bulbs;15;1
light bulbs led bulbs;1;4400;286;https://ledhut.co.uk/collections/led-light-bulbs;24;1
light bulb fittings;1;1000;248;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;15;1
led bulbs uk;1;1000;248;https://ledhut.co.uk/collections/led-light-bulbs;26;1
led floodlight;1;1000;248;https://ledhut.co.uk/collections/led-flood-lights;10;1
gu10 led lights;1;2900;237;https://ledhut.co.uk/collections/gu10-led-bulbs;14;1
lights for lights;6;9900;237;https://ledhut.co.uk/;43;1
dimmable light bulbs;2;2900;237;https://ledhut.co.uk/collections/dimmable-led-bulbs;22;1
e27 led lamp bulb;1;3600;234;https://ledhut.co.uk/collections/e27-led-bulbs-es;11;1
led e27 led;1;3600;234;https://ledhut.co.uk/collections/e27-led-bulbs-es;11;1
downlight led lamp;2;3600;234;https://ledhut.co.uk/collections/led-downlights;14;1
led light bulbs uk;1;880;218;https://ledhut.co.uk/collections/led-light-bulbs;23;1
led e 27 bulb;1;1600;211;https://ledhut.co.uk/collections/e27-led-bulbs-es;13;1
led flood lights;1;2400;196;https://ledhut.co.uk/collections/led-flood-lights;11;1
gu10;2;4400;193;https://ledhut.co.uk/collections/gu10-led-bulbs;20;1
e14 led bulb;3;4400;193;https://ledhut.co.uk/collections/e14-led-bulbs-ses;29;1
led bulb;1;2900;188;https://ledhut.co.uk/collections/led-light-bulbs;28;1
led lamp bulb;1;2900;188;https://ledhut.co.uk/collections/led-light-bulbs;32;1
gu10 led bulb;2;2900;188;https://ledhut.co.uk/collections/gu10-led-bulbs;12;1
led floodlights;1;720;178;https://ledhut.co.uk/collections/led-flood-lights;20;1
led dimmer light bulbs;1;720;178;https://ledhut.co.uk/collections/dimmable-led-bulbs;26;1
gu10 led light bulbs;1;720;178;https://ledhut.co.uk/collections/gu10-led-bulbs;21;1
gu10 led uk;1;720;178;https://ledhut.co.uk/collections/gu10-led-bulbs;9;1
dimmable led light bulbs;1;720;178;https://ledhut.co.uk/collections/dimmable-led-bulbs;26;1
led for flood light;1;1300;171;https://ledhut.co.uk/collections/led-flood-lights;18;1
gu10 light bulbs;2;1300;171;https://ledhut.co.uk/collections/gu10-led-bulbs;17;1
led light;5;6600;158;https://ledhut.co.uk/collections/led-light-bulbs;33;1
light bulbs dimming;2;2400;156;https://ledhut.co.uk/collections/dimmable-led-bulbs;24;1
l e d spot light;2;1900;155;https://ledhut.co.uk/collections/led-spotlights;12;1
light bulbs led uk;1;590;146;https://ledhut.co.uk/collections/led-light-bulbs;21;1
led lights bulbs;1;590;146;https://ledhut.co.uk/collections/led-light-bulbs;22;1
e27 bulb led;1;590;146;https://ledhut.co.uk/collections/e27-led-bulbs-es;15;1
led flood lights outdoor;1;590;146;https://ledhut.co.uk/collections/led-flood-lights;10;1
lumilife;1;170;136;https://ledhut.co.uk/collections/lumilife;16;2
led flood light led;1;1000;132;https://ledhut.co.uk/collections/led-flood-lights;18;1
led gu10 bulbs;1;1000;132;https://ledhut.co.uk/collections/gu10-led-bulbs;22;1
dimmers and led bulbs;1;1000;132;https://ledhut.co.uk/collections/dimmable-led-bulbs;23;1
led flood light;1;1000;132;https://ledhut.co.uk/collections/led-flood-lights;15;1
e27 light bulbs led;1;1000;132;https://ledhut.co.uk/collections/e27-led-bulbs-es;10;1
led spotlight;2;1600;131;https://ledhut.co.uk/collections/led-spotlights;12;1
e27;2;2900;127;https://ledhut.co.uk/collections/e27-led-bulbs-es;13;1
flood light flood light;2;3600;126;https://ledhut.co.uk/collections/led-flood-lights;10;1
flood light;3;3600;126;https://ledhut.co.uk/collections/led-flood-lights;22;1
led bulb and;1;3600;126;https://ledhut.co.uk/collections/led-light-bulbs;36;1
driver per led;2;1900;123;https://ledhut.co.uk/collections/drivers-fittings-switches;16;1
led bulba;1;480;119;https://ledhut.co.uk/collections/led-light-bulbs;28;1
light bulb led;1;480;119;https://ledhut.co.uk/collections/led-light-bulbs;28;1
outdoor led flood lights;1;480;119;https://ledhut.co.uk/collections/led-flood-lights;20;1
led spot lights;1;880;116;https://ledhut.co.uk/collections/led-spotlights;12;1
christmas lights 1000 warm white;1;880;116;https://ledhut.co.uk/products/treebright-1000-led-christmas-tree-lights-with-timer-25m-white-warm-white;18;1
led lightbulbs;1;880;116;https://ledhut.co.uk/collections/led-light-bulbs;30;1
warm white christmas lights 1000;2;880;116;https://ledhut.co.uk/products/treebright-1000-led-christmas-tree-lights-with-timer-25m-white-warm-white;22;1
led light bulbs dimmable;1;880;116;https://ledhut.co.uk/collections/dimmable-led-bulbs;13;1
e27 light bulbs;1;880;116;https://ledhut.co.uk/collections/e27-led-bulbs-es;21;1
e14 led light;3;3600;108;https://ledhut.co.uk/collections/e14-led-bulbs-ses;12;1
gu10 led;1;1300;106;https://ledhut.co.uk/collections/gu10-led-bulbs;14;1
led lamps for downlights;4;4400;105;https://ledhut.co.uk/collections/led-downlights;16;1
light bulb led e27;1;1600;104;https://ledhut.co.uk/collections/e27-led-bulbs-es;11;1
spotlights with led;5;2900;101;https://ledhut.co.uk/collections/led-spotlights;17;1
led screw in bulbs;1;390;96;https://ledhut.co.uk/collections/e27-led-bulbs-es;20;1
led e27 bulb;1;390;96;https://ledhut.co.uk/collections/e27-led-bulbs-es;15;1
led equivalent of 60w;1;390;96;https://ledhut.co.uk/blogs/news/led-equivalent-wattages-against-traditional-lighting;15;1
led lamp bulb light;1;390;96;https://ledhut.co.uk/collections/led-light-bulbs;33;1
led dimmable bulbs;1;390;96;https://ledhut.co.uk/collections/dimmable-led-bulbs;25;1
1000 warm white christmas lights;1;720;95;https://ledhut.co.uk/products/treebright-1000-led-christmas-tree-lights-with-timer-25m-white-warm-white;22;1
led hut uk;1;110;88;https://ledhut.co.uk/;39;2
e27 light bulb;4;2900;87;https://ledhut.co.uk/collections/e27-led-bulbs-es;25;1
flood lights;4;2900;87;https://ledhut.co.uk/collections/led-flood-lights;15;1
led light bulb;1;1300;84;https://ledhut.co.uk/collections/led-light-bulbs;34;1
bulbs dimmable;3;1900;83;https://ledhut.co.uk/collections/dimmable-led-bulbs;18;1
lights with led;6;4400;83;https://ledhut.co.uk/collections/commercial-led-lighting;30;1
led strip lights;15;27100;81;https://ledhut.co.uk/collections/led-strip-lights;31;1
edison e27 bulb;1;320;79;https://ledhut.co.uk/collections/e27-led-bulbs-es;14;1`;

const LIGHTINGCO_CSV = `keyword;position;volume;traffic;url;kd;intent
the lighting company;1;1300;1040;https://www.lightingcompany.co.uk/;52;2
best reading lamps;7;33100;794;https://www.lightingcompany.co.uk/table-floor-lamps-c5/reading-craft-lights-c38;16;0
light fixtures;1;2900;719;https://www.lightingcompany.co.uk/ceiling-lights-c3;37;1
table light shades;2;4400;580;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;23;1
lighting company;1;720;576;https://www.lightingcompany.co.uk/;72;0
the lighting company uk;1;720;576;https://www.lightingcompany.co.uk/;51;2
chandelier in a bedroom;1;1900;471;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;14;1
light fitting;1;4400;360;https://www.lightingcompany.co.uk/ceiling-lights-c3;39;1
cream lampshade;1;1300;322;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120/cream-and-ivory-t209;13;1
chandeliers in the bedroom;1;2400;316;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;11;1
bathroom light fixtures;2;2400;316;https://www.lightingcompany.co.uk/bathroom-lights-c1;27;1
light fittings;6;12100;290;https://www.lightingcompany.co.uk/ceiling-lights-c3;38;1
light light bulb;5;12100;266;https://www.lightingcompany.co.uk/light-bulbs-c95;27;1
bathroom mirror lights;2;1900;250;https://www.lightingcompany.co.uk/bathroom-lights-c1/mirror-lights-c87;15;1
bedroom chandelier;1;1900;250;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;12;0
large ceiling lights;1;1000;248;https://www.lightingcompany.co.uk/ceiling-lights-c3/extra-large-and-oversized-ceiling-lights-c125;14;0
bathroom chandeliers;1;1000;248;https://www.lightingcompany.co.uk/bathroom-lights-c1/bathroom-chandeliers-ip44-c75;13;0
lamp shades for lamps;3;6600;231;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;22;1
chandeliers for sale;1;880;218;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18;20;3
glass lamp shades for ceiling lights;1;880;218;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;9;0
chandelier in the bedroom;1;1600;211;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;11;1
light fittings uk;2;1600;211;https://www.lightingcompany.co.uk/ceiling-lights-c3;34;1
lighting light fixture;2;2400;196;https://www.lightingcompany.co.uk/ceiling-lights-c3;30;1
glass light shades;2;2400;196;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;13;1
households outdoor lights advice;2;4400;193;https://www.lightingcompany.co.uk/blog/the-definitive-guide-to-outdoor-lights/;17;1
lamp shades for table;3;5400;189;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;25;0
vintage floor light;1;720;178;https://www.lightingcompany.co.uk/table-floor-lamps-c5/traditional-standard-floor-lamps-c12;9;1
long ceiling lights;1;720;178;https://www.lightingcompany.co.uk/ceiling-lights-c3/pendant-lights-c8/long-drop-stairwell-lighting-t129;17;1
small chandeliers;1;720;178;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/small-chandeliers-less-than-40cm-diameter-c271;10;0
ceiling light fixtures uk;2;1300;171;https://www.lightingcompany.co.uk/ceiling-lights-c3;22;1
table lamp shades uk;2;1300;171;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;20;1
lighting company uk;1;210;168;https://www.lightingcompany.co.uk/;72;0
table lamps and shades;3;3600;158;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;22;1
light fitting ceiling;4;3600;158;https://www.lightingcompany.co.uk/ceiling-lights-c3;32;1
lighting and sconces;3;2400;156;https://www.lightingcompany.co.uk/wall-lights-c15;22;1
ceiling light fixture;3;2400;156;https://www.lightingcompany.co.uk/ceiling-lights-c3;33;1
ceiling lights united kingdom;3;2400;156;https://www.lightingcompany.co.uk/ceiling-lights-c3;23;1
lighting fixtures;2;1900;155;https://www.lightingcompany.co.uk/ceiling-lights-c3;37;1
british outdoor lighting;2;1900;155;https://www.lightingcompany.co.uk/outdoor-lights-c27/british-made-in-uk-lighting-t23;12;0
bulb;9;8100;153;https://www.lightingcompany.co.uk/light-bulbs-c95;33;1
rustic ceiling lights;1;590;146;https://www.lightingcompany.co.uk/ceiling-lights-c3/rustic-lighting-c29;9;1
touch table lamps for bedroom;1;590;146;https://www.lightingcompany.co.uk/table-floor-lamps-c5/touch-lamps-c126;12;0
lamp shades table lamps uk;1;590;146;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;12;0
bathroom lights over mirror;1;590;146;https://www.lightingcompany.co.uk/bathroom-lights-c1/mirror-lights-c87;16;0
glass ceiling light shades;1;590;146;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;11;1
blue ceiling light;1;590;146;https://www.lightingcompany.co.uk/ceiling-lights-c3/blue-t73;22;1
table lamp lamp shade;1;590;146;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;17;1
thelightingcompany;1;170;136;https://www.lightingcompany.co.uk/;21;2
waterproof bathroom ceiling lights;2;1000;132;https://www.lightingcompany.co.uk/bathroom-lights-c1/modern-bathroom-lighting-c2;16;0
green ceiling light;2;1000;132;https://www.lightingcompany.co.uk/ceiling-lights-c3/green-and-verdigris-t33;12;0
bathroom light shades;2;1000;132;https://www.lightingcompany.co.uk/bathroom-lights-c1/glass-t20;19;0
silver ceiling lights;2;1000;132;https://www.lightingcompany.co.uk/ceiling-lights-c3/satin-chrome-matt-chrome-satin-silver-t44;20;0
dining room ceiling lights;2;1600;131;https://www.lightingcompany.co.uk/ceiling-lights-c3/modern-ceiling-lighting-c7/dining-room-lighting-t126;13;0
bathroom light fittings;6;5400;129;https://www.lightingcompany.co.uk/bathroom-lights-c1;28;1
lampshades uk;3;2900;127;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;18;1
lampshade pendant lighting;3;2900;127;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33;23;0
table lighting uk;3;1900;123;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamps-c127;16;1
british table lamps;4;1900;123;https://www.lightingcompany.co.uk/table-floor-lamps-c5/british-made-in-uk-lighting-t23;9;0
ceiling light fixture uk;1;480;119;https://www.lightingcompany.co.uk/ceiling-lights-c3;22;1
victorian wall lights;1;480;119;https://www.lightingcompany.co.uk/wall-lights-c15/period-wall-lights-c45;9;1
cream lamp shades for table lamps;1;480;119;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120/cream-and-ivory-t209;17;1
victorian chandelier;1;480;119;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/victorian-edwardian-lights-t22;11;1
art deco light shades;1;480;119;https://www.lightingcompany.co.uk/art-nouveau-art-deco-lighting-t32;9;1
cream table lampshades;1;480;119;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120/cream-and-ivory-t209;10;1
standing light shades;1;480;119;https://www.lightingcompany.co.uk/table-floor-lamps-c5/floor-lamp-shades-c323;16;1
large chandeliers;2;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/large-chandeliers-60cm-and-over-in-diameter-c273;10;1
chandelier in a bathroom;1;880;116;https://www.lightingcompany.co.uk/bathroom-lights-c1/bathroom-chandeliers-ip44-c75;13;1
glass lamp shade;2;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;11;0
washroom mirror lights;2;880;116;https://www.lightingcompany.co.uk/bathroom-lights-c1/mirror-lights-c87;9;0
the lighting co;1;140;112;https://www.lightingcompany.co.uk/;66;2
the lighting company taunton;1;140;112;https://www.lightingcompany.co.uk/;32;1
floor lamp;25;74000;111;https://www.lightingcompany.co.uk/table-floor-lamps-c5/floor-lamps-c128;37;1
light with bulb;8;12100;108;https://www.lightingcompany.co.uk/light-bulbs-c95;19;1
cream lamp shades;2;1300;106;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120/cream-and-ivory-t209;21;0
led light fittings;3;1300;106;https://www.lightingcompany.co.uk/integrated-led-fittings-t290;18;0
light fixture;2;1300;106;https://www.lightingcompany.co.uk/ceiling-lights-c3;40;1
light fixtures for a bathroom;2;1300;106;https://www.lightingcompany.co.uk/bathroom-lights-c1;25;0
retro lamp;2;1300;106;https://www.lightingcompany.co.uk/table-floor-lamps-c5/retro-style-lighting-t12;18;1
glass light shade;2;1300;106;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;16;1
floor lamp shade;2;1300;106;https://www.lightingcompany.co.uk/table-floor-lamps-c5/floor-lamp-shades-c323;14;0
art deco wall lights;3;1300;106;https://www.lightingcompany.co.uk/wall-lights-c15/art-nouveau-art-deco-lighting-t32;8;1
gold pendant light fixture;2;1300;106;https://www.lightingcompany.co.uk/ceiling-lights-c3/pendant-lights-c8/gold-antique-gold-t46;8;0
lightening bulb;1;1600;104;https://www.lightingcompany.co.uk/light-bulbs-c95;16;1
blue table lamp;2;1600;104;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamps-c127/blue-t73;11;0
pink table lamp;2;1600;104;https://www.lightingcompany.co.uk/table-floor-lamps-c5/pink-t208;17;1
lamp shades lamp shades;7;5400;102;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;24;1
ceiling lights light fixtures;3;2900;101;https://www.lightingcompany.co.uk/ceiling-lights-c3;28;1
chandeliers in gold;2;2900;101;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/gold-antique-gold-t46;9;1
ceiling light fittings;6;4400;96;https://www.lightingcompany.co.uk/ceiling-lights-c3;29;1
silver ceiling light;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/satin-chrome-matt-chrome-satin-silver-t44;22;0
ceiling lightshade uk;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33;24;0
designer lighting uk;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/designer-lighting-for-ceilings-c4;20;0
lights sloped ceilings;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/sloping-ceiling-lights-c209;9;1
slope ceiling light fixture;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/sloping-ceiling-lights-c209;14;0
sloped ceiling lighting;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/sloping-ceiling-lights-c209;9;1
sloped ceiling fixtures;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/sloping-ceiling-lights-c209;9;1
hotel lighting;1;390;96;https://www.lightingcompany.co.uk/hospitality-leisure-c94;9;1
utility room lighting;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/kitchen-and-utility-room-lights-t133;12;1
large chandelier;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/large-chandeliers-60cm-and-over-in-diameter-c273;7;1
globe lighting;1;390;96;https://www.lightingcompany.co.uk/lighting-trends-c146/globe-lighting-c172;12;1`;

const INDUSTVILLE_CSV = `keyword;position;volume;traffic;url;kd;intent
industville;1;3600;2880;https://www.industville.co.uk/;28;2
industville lighting;1;1600;1280;https://www.industville.co.uk/collections/ceiling-lights;25;2
industville uk;1;1600;1280;https://www.industville.co.uk/;21;2
industville lighting uk;1;1300;1040;https://www.industville.co.uk/;22;2
pendant lights in the kitchen;1;3600;475;https://www.industville.co.uk/collections/kitchen-island-lighting;18;1
hall lights;1;1600;396;https://www.industville.co.uk/collections/hallway-lights;16;0
industville lights;1;480;384;https://www.industville.co.uk/;22;2
vintage wall lights;1;1300;322;https://www.industville.co.uk/collections/wall-lights;9;1
industriville;1;390;312;https://www.industville.co.uk/;27;2
industiville;1;320;256;https://www.industville.co.uk/;28;2
industrial ceiling lights;1;1000;248;https://www.industville.co.uk/collections/ceiling-lights;9;0
commercial lighting;2;1600;211;https://www.industville.co.uk/collections/commercial-lighting;14;0
industville wall lights;1;260;208;https://www.industville.co.uk/collections/wall-lights;19;2
industrville;1;260;208;https://www.industville.co.uk/;22;2
kitchen pendant lighting;2;2400;196;https://www.industville.co.uk/collections/kitchen-island-lighting;13;0
bulkhead lights outdoor;1;720;178;https://www.industville.co.uk/collections/bulkhead-lights;13;1
industrial pendant lighting;1;720;178;https://www.industville.co.uk/collections/ceiling-lights;8;0
edison bulb;1;1300;171;https://www.industville.co.uk/collections/led-decorative-light-bulbs;12;1
vintage light wall;1;1300;171;https://www.industville.co.uk/collections/wall-lights;9;1
industrial wall lights;1;1300;171;https://www.industville.co.uk/collections/wall-lights;9;0
hallway light;3;2400;156;https://www.industville.co.uk/collections/hallway-lights;15;1
stone lighting;1;170;136;https://www.industville.co.uk/collections/stone-lighting;17;1
metal light shade;1;1000;132;https://www.industville.co.uk/collections/lighting-shades-and-lampshades;17;1
retro filament bulbs;2;1000;132;https://www.industville.co.uk/collections/led-decorative-light-bulbs;12;1
vintage light bulbs;2;1000;132;https://www.industville.co.uk/collections/led-decorative-light-bulbs;9;1
living room illumination;4;3600;126;https://www.industville.co.uk/collections/living-room-lights;12;1
industrial lighting;4;1900;123;https://www.industville.co.uk/;15;0
bar lighting;1;480;119;https://www.industville.co.uk/collections/restaurant-bar-and-coffee-shop-lighting;10;1
metallic light shades;1;880;116;https://www.industville.co.uk/collections/lighting-shades-and-lampshades;22;1
edison light bulb;1;880;116;https://www.industville.co.uk/collections/led-decorative-light-bulbs;15;1
wall lights vintage;1;880;116;https://www.industville.co.uk/collections/wall-lights;9;1
large pendant lighting;2;880;116;https://www.industville.co.uk/collections/large-decorative-lights;9;0
bulkhead light;3;3600;108;https://www.industville.co.uk/collections/bulkhead-lights;19;1
decorative light bulbs;2;1300;106;https://www.industville.co.uk/collections/led-decorative-light-bulbs;14;0
bulkhead lights;2;1300;106;https://www.industville.co.uk/collections/bulkhead-lights;17;1
kitchen with pendant lighting;2;2400;105;https://www.industville.co.uk/collections/kitchen-island-lighting;16;1
hanging kitchen island lighting;3;2400;105;https://www.industville.co.uk/collections/kitchen-island-lighting;12;1
semi flush mount ceiling light;3;1600;104;https://www.industville.co.uk/collections/low-ceiling-lights;9;0
industrial lighting wall lights;1;390;96;https://www.industville.co.uk/collections/wall-lights;13;1
industrial pendant light;1;390;96;https://www.industville.co.uk/collections/ceiling-lights;8;0
industrial kitchen lights;1;390;96;https://www.industville.co.uk/collections/kitchen-lights;9;1
kitchen island lighting ideas;2;720;95;https://www.industville.co.uk/collections/kitchen-island-lighting;17;1
50 small bathroom ideas;1;720;95;https://www.industville.co.uk/blogs/news/50-small-bathroom-ideas-that-increase-space;46;1
edison bulbs;1;720;95;https://www.industville.co.uk/collections/led-decorative-light-bulbs;17;1
industville rugs;1;110;88;https://www.industville.co.uk/collections/homeware;16;1
industvile;1;110;88;https://www.industville.co.uk/;21;2
brass light fittings;3;1300;84;https://www.industville.co.uk/collections/brass-lights;9;0
edison with bulb;1;1300;84;https://www.industville.co.uk/collections/led-decorative-light-bulbs;21;1
giant ceiling light;2;1300;84;https://www.industville.co.uk/collections/large-decorative-lights;11;0
waterproof bathroom ceiling lights;3;1000;82;https://www.industville.co.uk/collections/bathroom-lights;16;0
metal lamp shades;3;1000;82;https://www.industville.co.uk/collections/lighting-shades-and-lampshades;20;1
bulb holder with bulb;1;1000;82;https://www.industville.co.uk/collections/light-bulb-holders;13;1
wall industrial lights;2;1000;82;https://www.industville.co.uk/collections/wall-lights;9;1
huge pendant lamp;1;320;79;https://www.industville.co.uk/collections/large-decorative-lights;10;1
alabaster light;1;320;79;https://www.industville.co.uk/collections/alabaster-lighting;10;1
e27 edison bulb;1;320;79;https://www.industville.co.uk/collections/led-decorative-light-bulbs;15;1
large pendant lights;1;320;79;https://www.industville.co.uk/collections/large-decorative-lights;9;0
industrial interiors home decor;1;320;79;https://www.industville.co.uk/blogs/news/9-ways-you-can-achieve-the-industrial-look;19;1
ip65 lights outdoor;1;320;79;https://www.industville.co.uk/collections/ip65-lights;10;0
massive pendant light;1;320;79;https://www.industville.co.uk/collections/large-decorative-lights;9;0
huge hanging lights;1;320;79;https://www.industville.co.uk/collections/large-decorative-lights;9;0
kitchen pendant light;2;590;77;https://www.industville.co.uk/collections/kitchen-island-lighting;17;0
outdoor bulkhead lights;1;590;77;https://www.industville.co.uk/collections/bulkhead-lights;16;1
ceiling industrial lamp;1;880;72;https://www.industville.co.uk/collections/ceiling-lights;11;1
outdoor bulkhead light;2;880;72;https://www.industville.co.uk/collections/bulkhead-lights;16;1
kitchen island lights;5;1900;66;https://www.industville.co.uk/collections/kitchen-island-lighting;18;0
task lighting;2;1000;65;https://www.industville.co.uk/blogs/technical-installations/what-is-task-lighting;23;1
retro incandescent light bulbs;3;1000;65;https://www.industville.co.uk/collections/led-decorative-light-bulbs;29;1
brass metal pendant light;1;1000;65;https://www.industville.co.uk/collections/metal-decorative-lights;11;1
vintage light bulb lights;3;1000;65;https://www.industville.co.uk/collections/led-decorative-light-bulbs;8;1
retro ceiling light;1;260;64;https://www.industville.co.uk/collections/vintage-retro-ceiling-pendant-lights;8;1
industrial kitchen lighting;1;260;64;https://www.industville.co.uk/collections/kitchen-lights;10;0
metal pendant light;1;260;64;https://www.industville.co.uk/collections/metal-decorative-lights;9;1
ceiling lamp industrial;1;260;64;https://www.industville.co.uk/collections/ceiling-lights;10;1
industrial pendant lights;1;260;64;https://www.industville.co.uk/collections/ceiling-lights;8;0
farmhouse ceiling lights;1;260;64;https://www.industville.co.uk/collections/cottage-ceiling-lights-wall-sconces;16;1
pendant industrial lighting fixtures;1;480;63;https://www.industville.co.uk/collections/ceiling-lights;13;1
vintage wall light;1;480;63;https://www.industville.co.uk/collections/wall-lights;8;1
glass light;1;480;63;https://www.industville.co.uk/collections/glass-lights;9;1
ip65 outdoor lights;1;480;63;https://www.industville.co.uk/collections/ip65-lights;10;1
hallway lamp;2;720;59;https://www.industville.co.uk/collections/hallway-lights;12;1
kitchen hanging lights;3;720;59;https://www.industville.co.uk/collections/kitchen-island-lighting;21;0
outside bulkhead lights;2;720;59;https://www.industville.co.uk/collections/bulkhead-lights;16;1
brass light;2;720;59;https://www.industville.co.uk/collections/brass-lights;11;1
contemporary lounge lights;3;1300;57;https://www.industville.co.uk/collections/living-room-lights;18;1
bulk head light;2;880;57;https://www.industville.co.uk/collections/bulkhead-lights;16;1
pendant light fixtures glass;5;2400;57;https://www.industville.co.uk/collections/glass-lights;14;1
bronze ceiling light;2;880;57;https://www.industville.co.uk/collections/bronze-lights;9;1
kitchen pendant lights;4;1900;57;https://www.industville.co.uk/collections/kitchen-island-lighting;15;1
bedroom lighting ideas;6;2900;55;https://www.industville.co.uk/collections/bedroom-lights;21;1
cottage lighting;1;210;52;https://www.industville.co.uk/collections/cottage-ceiling-lights-wall-sconces;9;1
wall lights industrial;1;210;52;https://www.industville.co.uk/collections/wall-lights;9;0
industrial style ceiling lamps;1;210;52;https://www.industville.co.uk/collections/ceiling-lights;7;1
swan neck outdoor light;1;210;52;https://www.industville.co.uk/collections/swan-neck-wall-lights;9;0
alabaster lighting;1;210;52;https://www.industville.co.uk/collections/alabaster-lighting;7;1
industrial style wall lights;1;210;52;https://www.industville.co.uk/collections/wall-lights;9;1
waterproof bathroom wall lights;1;210;52;https://www.industville.co.uk/collections/bathroom-lights;10;0
vintage style wall lights;1;210;52;https://www.industville.co.uk/collections/wall-lights;6;1
retro industrial ceiling lights;1;210;52;https://www.industville.co.uk/collections/ceiling-lights;6;1`;

// ─── BRANDED TERM EXCLUSIONS ──────────────────────────────────────────────

const BRANDED_TERMS = [
  'ledhut', 'led hut', 'ledhut uk', 'led hut uk', 'lumilife',
  'lightingcompany', 'the lighting company', 'the lighting co', 'thelightingcompany',
  'lighting company', 'lighting company uk',
  'industville', 'industiville', 'industrville', 'industriville', 'industvile',
  'industville lighting', 'industville uk', 'industville lights', 'industville wall lights', 'industville rugs',
  'ledsone', 'ledsone lighting', 'ledsone ltd', 'ledsone uk ltd', 'ledstone', 'intitle:ledsone',
  'ledowe',
];

function isBranded(keyword) {
  const kw = keyword.toLowerCase();
  return BRANDED_TERMS.some(term => kw.includes(term));
}

// ─── CSV PARSER ───────────────────────────────────────────────────────────

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  // skip header
  return lines.slice(1).map(line => {
    const parts = line.split(';');
    return {
      keyword: parts[0].trim().toLowerCase(),
      position: parseInt(parts[1]) || 999,
      volume: parseInt(parts[2]) || 0,
      traffic: parseInt(parts[3]) || 0,
      url: parts[4] ? parts[4].trim() : '',
      kd: parseFloat(parts[5]) || 0,
      intent: parts[6] ? parts[6].trim() : '',
    };
  });
}

// ─── BUILD GAP LIST ───────────────────────────────────────────────────────

function buildGapList(ledsoneMap, competitorRows, competitorDomain) {
  const gaps = [];
  for (const row of competitorRows) {
    if (isBranded(row.keyword)) continue;
    if (row.position > 10) continue;   // competitor must be in top 10

    const ledsoneEntry = ledsoneMap.get(row.keyword);
    const ledsonePos = ledsoneEntry ? ledsoneEntry.position : null;

    // Gap: ledsone not ranking or ranking worse than 20
    if (ledsonePos !== null && ledsonePos <= 20) continue;

    const opportunityScore = row.volume * (10 / row.position);
    gaps.push({
      keyword: row.keyword,
      competitor_domain: competitorDomain,
      competitor_position: row.position,
      volume: row.volume,
      competitor_traffic: row.traffic,
      competitor_url: row.url,
      keyword_difficulty: row.kd,
      intent: row.intent,
      ledsone_position: ledsonePos,
      opportunity_score: Math.round(opportunityScore * 100) / 100,
    });
  }
  // Sort by opportunity_score desc, take top 50
  gaps.sort((a, b) => b.opportunity_score - a.opportunity_score);
  return gaps.slice(0, 50);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────

async function main() {
  const pool = new Pool({
    connectionString: CONN,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Parse ledsone keyword map
    const ledsoneRows = parseCSV(LEDSONE_CSV);
    const ledsoneMap = new Map();
    for (const r of ledsoneRows) {
      if (!ledsoneMap.has(r.keyword)) {
        ledsoneMap.set(r.keyword, r);
      }
    }
    console.log(`ledsone.co.uk: ${ledsoneMap.size} keywords loaded`);

    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS semrush_keyword_gap (
        id SERIAL PRIMARY KEY,
        keyword TEXT NOT NULL,
        competitor_domain TEXT NOT NULL,
        competitor_position INT,
        volume INT,
        competitor_traffic INT,
        competitor_url TEXT,
        keyword_difficulty NUMERIC,
        intent TEXT,
        ledsone_position INT,
        opportunity_score NUMERIC,
        snapshot_date DATE DEFAULT CURRENT_DATE,
        UNIQUE(keyword, competitor_domain)
      )
    `);
    console.log('Table semrush_keyword_gap ready.');

    const competitorData = [
      { domain: 'ledhut.co.uk', csv: LEDHUT_CSV },
      { domain: 'lightingcompany.co.uk', csv: LIGHTINGCO_CSV },
      { domain: 'industville.co.uk', csv: INDUSTVILLE_CSV },
    ];

    for (const { domain, csv } of competitorData) {
      const rows = parseCSV(csv);
      const gaps = buildGapList(ledsoneMap, rows, domain);

      // Full refresh for this competitor
      const delRes = await pool.query(
        'DELETE FROM semrush_keyword_gap WHERE competitor_domain = $1',
        [domain]
      );
      console.log(`\n${domain}: deleted ${delRes.rowCount} old rows`);

      let inserted = 0;
      for (const g of gaps) {
        await pool.query(`
          INSERT INTO semrush_keyword_gap
            (keyword, competitor_domain, competitor_position, volume, competitor_traffic,
             competitor_url, keyword_difficulty, intent, ledsone_position, opportunity_score, snapshot_date)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CURRENT_DATE)
          ON CONFLICT (keyword, competitor_domain) DO UPDATE SET
            competitor_position = EXCLUDED.competitor_position,
            volume = EXCLUDED.volume,
            competitor_traffic = EXCLUDED.competitor_traffic,
            competitor_url = EXCLUDED.competitor_url,
            keyword_difficulty = EXCLUDED.keyword_difficulty,
            intent = EXCLUDED.intent,
            ledsone_position = EXCLUDED.ledsone_position,
            opportunity_score = EXCLUDED.opportunity_score,
            snapshot_date = CURRENT_DATE
        `, [
          g.keyword, g.competitor_domain, g.competitor_position, g.volume,
          g.competitor_traffic, g.competitor_url, g.keyword_difficulty,
          g.intent, g.ledsone_position, g.opportunity_score,
        ]);
        inserted++;
      }

      console.log(`${domain}: inserted ${inserted} gap rows`);
      console.log(`  Top 3 opportunities:`);
      gaps.slice(0, 3).forEach((g, i) => {
        console.log(`  ${i + 1}. "${g.keyword}" | pos ${g.competitor_position} | vol ${g.volume} | score ${g.opportunity_score}`);
      });
    }

    // Final summary
    const summary = await pool.query(`
      SELECT competitor_domain, COUNT(*) as rows, MAX(snapshot_date) as date
      FROM semrush_keyword_gap
      GROUP BY competitor_domain
      ORDER BY competitor_domain
    `);
    console.log('\n─── FINAL SUMMARY ───');
    for (const r of summary.rows) {
      console.log(`${r.competitor_domain}: ${r.rows} rows (snapshot: ${r.date})`);
    }

    console.log('\nDone.');
  } catch (err) {
    console.error('ERROR:', err.message || err);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
