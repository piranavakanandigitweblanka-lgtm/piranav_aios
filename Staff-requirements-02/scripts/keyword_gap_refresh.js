#!/usr/bin/env node
/**
 * Weekly SEO Keyword Gap Refresh
 * Compares ledsone.co.uk vs 3 competitors and upserts gap keywords into Neon DB
 */

const { Pool } = require('pg');

// ─── RAW SEMRUSH DATA ────────────────────────────────────────────────────────

const LEDSONE_RAW = `ledsone;1;590;472;https://ledsone.co.uk/;41.00;2
wire connectors;2;4400;360;https://ledsone.co.uk/collections/wire-connectors;29.00;1
intitle:ledsone;1;140;112;https://ledsone.co.uk/;40.00;2
spider lights;1;720;95;https://ledsone.co.uk/collections/spider-light;9.00;1
ledstone;1;110;88;https://ledsone.co.uk/;34.00;2
plug in pendant light;3;1300;84;https://ledsone.co.uk/collections/plugin-lighting;15.00;1
plug in hanging pendant lamp;2;1300;84;https://ledsone.co.uk/collections/plugin-lighting;17.00;1
ledsone uk limited;1;90;72;https://ledsone.co.uk/;0.0;2
ledsone lighting;1;90;72;https://ledsone.co.uk/;41.00;2
ledsone ltd;1;90;72;https://ledsone.co.uk/;38.00;2
wiring and connectors;2;2900;69;https://ledsone.co.uk/collections/wire-connectors;31.00;1
bayonet light bulb;5;2900;69;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;23.00;1
retro light shades;2;480;63;https://ledsone.co.uk/collections/lampshades/metal-pendant-light;13.00;1
ceiling light bracket;2;480;63;https://ledsone.co.uk/collections/ceiling-rose-brackets;32.00;1
e27 bulb;14;18100;54;https://ledsone.co.uk/collections/e27-base-bulb;21.00;1
3 core cable;6;2400;52;https://ledsone.co.uk/blogs/new/understanding-3-core-electrical-cables-types-uses-and-color-codes;15.00;1
spider light fitting;1;390;51;https://ledsone.co.uk/collections/spider-light;9.00;1,3
plug in hanging light fixtures;2;590;48;https://ledsone.co.uk/collections/plugin-lighting;12.00;0
connectors for wiring;4;3600;46;https://ledsone.co.uk/collections/wire-connectors;37.00;1
weighing machine scale;8;6600;46;https://ledsone.co.uk/collections/weighing-scale;28.00;1
retro lamp shades;2;720;46;https://ledsone.co.uk/collections/lampshades;22.00;1,3
bulbs for dimmers;2;1000;44;https://ledsone.co.uk/collections/dimmable-led-bulbs;17.00;1
what is an e27 bulb;1;320;42;https://ledsone.co.uk/blogs/new/e27-bulb-guide;11.00;1
led rope light fixture;1;320;42;https://ledsone.co.uk/collections/hemp-collection;10.00;1
led transformer 24v;1;320;42;https://ledsone.co.uk/collections/dc-24v-transformer;8.00;0
brackets for ceiling lights;2;320;42;https://ledsone.co.uk/collections/ceiling-rose-brackets;28.00;0
e27 edison screw bulb;6;1300;39;https://ledsone.co.uk/blogs/new/e27-bulb-guide;12.00;1
24v transformer;2;480;39;https://ledsone.co.uk/collections/dc-24v-transformer;19.00;1
e27 light bulb;10;2900;37;https://ledsone.co.uk/collections/e27-base-bulb;22.00;1
screw light bulbs e27;7;1600;35;https://ledsone.co.uk/blogs/new/e27-bulb-guide;20.00;1
white blackboard;9;3600;32;https://ledsone.co.uk/collections/white-board;41.00;1
hanging lamp plug;4;1300;31;https://ledsone.co.uk/collections/plugin-lighting;10.00;1
2 core cable;5;1300;31;https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;9.00;1
b22 light bulb;7;1300;28;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;19.00;1
cage light shade;1;210;27;https://ledsone.co.uk/collections/wire-cage-pendant-light;16.00;1,3
pipework lights;1;110;27;https://ledsone.co.uk/collections/pipe-lighting;7.00;1
spider pendant light;2;320;26;https://ledsone.co.uk/collections/spider-light;7.00;1
mould resistant shower curtain;2;320;26;https://ledsone.co.uk/products/fabric-solid-color-shower-curtain-for-bathtub-shower-5288;26.00;1
what is e27 bulb;1;320;26;https://ledsone.co.uk/blogs/new/e27-bulb-guide;8.00;1
bracket ceiling light;2;320;26;https://ledsone.co.uk/collections/ceiling-rose-brackets;25.00;1
big bag for laundry;3;720;25;https://ledsone.co.uk/collections/laundry-bags;16.00;1
pendant lamp;6;1000;24;https://ledsone.co.uk/collections/pendant-lights;22.00;0
pendant lamp plug;6;1300;24;https://ledsone.co.uk/collections/plugin-lighting;11.00;1,3
b22 bulb;11;4400;22;https://ledsone.co.uk/collections/led-bulbs/b22-base-bulb;23.00;1
cage hanging light;1;90;22;https://ledsone.co.uk/collections/wire-cage-pendant-light;10.00;1,3
vintage e27 light bulbs;2;170;22;https://ledsone.co.uk/collections/vintage-bulbs;10.00;0
light cage shade;1;170;22;https://ledsone.co.uk/collections/wire-cage-pendant-light;13.00;1
ceiling hooks for lights;2;170;22;https://ledsone.co.uk/collections/hooks-and-rings;15.00;1
conduit lighting;3;260;21;https://ledsone.co.uk/collections/conduit-lighting;8.00;1
pipe lights;2;260;21;https://ledsone.co.uk/collections/pipe-lighting;10.00;1
spider light;3;880;21;https://ledsone.co.uk/collections/spider-light;9.00;1
transformer 12v led;2;260;21;https://ledsone.co.uk/collections/dc-12v-transformer;22.00;1
spider ceiling light;2;320;20;https://ledsone.co.uk/collections/spider-light;8.00;1
double sided tape;19;12100;18;https://ledsone.co.uk/products/double-sided-heavy-duty-mounting-removable-tape;20.00;1
white blackboard;10;3600;18;https://ledsone.co.uk/collections/white-board;41.00;1
light pendant holder;1;140;18;https://ledsone.co.uk/collections/pendant-holder;9.00;1
12v transformer;3;720;17;https://ledsone.co.uk/collections/dc-12v-transformer;19.00;1
bayonet mount led bulb;7;720;17;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;10.00;1
e27 screw light bulbs;7;720;17;https://ledsone.co.uk/blogs/new/e27-bulb-guide;10.00;1
spider pendant lamp;2;210;17;https://ledsone.co.uk/collections/spider-light;7.00;1,3
bayonet fitting light bulbs;7;720;17;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;17.00;1
pendant light spider;2;210;17;https://ledsone.co.uk/collections/spider-light;6.00;0,1
ceiling hooks for lighting;6;590;17;https://ledsone.co.uk/collections/hooks-and-rings;9.00;1
led transformers 12v;1;210;17;https://ledsone.co.uk/collections/dc-12v-transformer;11.00;1,3
edison screw lamp holder;4;480;16;https://ledsone.co.uk/products/black-screw-e27-light-bulb-lamp-holder-base-pendant-socket-4378;7.00;1
shower curtain;30;22200;15;https://ledsone.co.uk/collections/shower-curtain;32.00;1
plug in hanging light;6;720;15;https://ledsone.co.uk/collections/plugin-lighting;10.00;1
bayonet decorative light bulbs;2;110;14;https://ledsone.co.uk/collections/led-bulbs;14.00;1
light bulb with holder;5;590;14;https://ledsone.co.uk/collections/holder;28.00;1
transformer 24v;1;110;14;https://ledsone.co.uk/collections/dc-24v-transformer;16.00;1,3
white board;19;9900;14;https://ledsone.co.uk/collections/white-board;32.00;1
edison screw bulb;8;1600;14;https://ledsone.co.uk/blogs/new/e27-bulb-guide;13.00;1
light shades;22;9900;14;https://ledsone.co.uk/collections/lighting-shades;34.00;1
bayonet fitting led bulbs;7;590;14;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;12.00;1
living room wall lighting ideas;3;320;14;https://ledsone.co.uk/blogs/new/wall-lighting-ideas-living-room;10.00;1
led transformer;7;880;11;https://ledsone.co.uk/blogs/new/transformers-for-led-lighting-complete-guide;10.00;1
led transformer 12v;3;320;14;https://ledsone.co.uk/collections/dc-12v-transformer;9.00;1,3
edison screw e27 lamp;2;590;14;https://ledsone.co.uk/collections/e27-base-bulb;9.00;1
3m double sided tape;11;3600;14;https://ledsone.co.uk/products/double-sided-heavy-duty-mounting-removable-tape;24.00;1
tape;22;9900;14;https://ledsone.co.uk/collections/tapes;28.00;1
e27 lamp base;3;170;13;https://ledsone.co.uk/collections/metal-holders;23.00;1
hanging lights with plug in;4;390;13;https://ledsone.co.uk/collections/plugin-lighting;16.00;1
weight scale scale;14;4400;13;https://ledsone.co.uk/collections/weighing-scale;28.00;1,3
steampunk wall lights;1;170;13;https://ledsone.co.uk/products/vintage-industrial-water-pipe-lamp-retro-light-steampunk-wall-sconce-free-bulb;7.00;1
ceiling bracket light;2;170;13;https://ledsone.co.uk/collections/ceiling-rose-brackets;26.00;1
12v lighting transformer;3;210;13;https://ledsone.co.uk/collections/dc-12v-transformer;10.00;1
pendant light holder;1;170;13;https://ledsone.co.uk/collections/pendant-holder;9.00;1
rope hanging lamp;1;170;13;https://ledsone.co.uk/collections/hemp-rope-lighting;9.00;1
lamp shade holder ring;2;170;13;https://ledsone.co.uk/products/screw-e27-plain-holder-white-with-ring-bakelite-lamp-holder;7.00;1,3
led lights bayonet;7;720;13;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;9.00;1
covered electrical wire;3;390;13;https://ledsone.co.uk/collections/vintage-cables;9.00;1
laundry bag;26;8100;12;https://ledsone.co.uk/collections/laundry-bags;26.00;1
white board white;25;18100;12;https://ledsone.co.uk/collections/white-board;22.00;1
pendant plug light;8;1300;11;https://ledsone.co.uk/collections/plugin-lighting;11.00;1
fitting a pendant light;6;590;11;https://ledsone.co.uk/pages/pi;21.00;1
hanging pendant plug in light;2;140;11;https://ledsone.co.uk/collections/plugin-lighting;8.00;1
electrical cable connectors types;6;880;11;https://ledsone.co.uk/collections/wire-connectors;33.00;1
decorative light bulbs bayonet fitting;3;140;11;https://ledsone.co.uk/collections/led-bulbs;12.00;1
2 core electrical cable;5;480;11;https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;9.00;1
spider hanging lights;1;90;11;https://ledsone.co.uk/collections/spider-light;10.00;1,3
bayonet led lamps;8;880;11;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;9.00;1
light with plug in;4;390;11;https://ledsone.co.uk/collections/plugin-lighting;7.00;0
pendant light with plug in;2;260;11;https://ledsone.co.uk/collections/plugin-lighting;9.00;1
lampshade pendant lighting;14;2900;11;https://ledsone.co.uk/pages/lamp-shades-for-pendant-table-floor-lights;18.00;0
3 core wire;5;390;11;https://ledsone.co.uk/blogs/new/understanding-3-core-electrical-cables-types-uses-and-color-codes;12.00;1
12v led lighting transformer;3;260;11;https://ledsone.co.uk/collections/dc-12v-transformer;14.00;1
e27 vintage light bulbs;2;90;11;https://ledsone.co.uk/collections/vintage-bulbs;0.0;1
e27 bulb base;2;320;11;https://ledsone.co.uk/collections/metal-holders;27.00;1
spider light pendant;2;140;11;https://ledsone.co.uk/collections/spider-light;5.00;1
rose gold ceiling lamp;2;170;11;https://ledsone.co.uk/collections/rose-gold-lighting;10.00;1
rope lighting for ceiling;1;170;11;https://ledsone.co.uk/collections/hemp-rope-lighting;8.00;1
pendant spider light;2;90;11;https://ledsone.co.uk/collections/spider-light;5.00;0,1
anti mould shower curtain;7;480;10;https://ledsone.co.uk/products/fabric-solid-color-shower-curtain-for-bathtub-shower-5288;22.00;0,1
bayonet fit led bulbs;8;480;10;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;11.00;1
240 volt 12 volt dc transformer;3;140;9;https://ledsone.co.uk/products/dc-12v-ip20-power-supply;21.00;0,1
light bracket for ceiling;2;110;9;https://ledsone.co.uk/collections/ceiling-rose-brackets;28.00;1
slippers for bathing;2;260;9;https://ledsone.co.uk/products/home-slippers-men-women-non-slip-bathing-shower-sandals-5256;17.00;1
chrome light shade;2;140;9;https://ledsone.co.uk/products/modern-ceiling-pendant-light-shades-chrome-colour-lamp-shades-easy-fit;16.00;1
light shade cage;1;110;9;https://ledsone.co.uk/collections/wire-cage-pendant-light;0.0;1
240v to 12 volt converter;4;260;9;https://ledsone.co.uk/products/dc-12v-ip20-power-supply;22.00;1
conduit light fittings;2;110;9;https://ledsone.co.uk/collections/conduit-lighting;8.00;1
electric light bulb fittings;7;390;9;https://ledsone.co.uk/collections/holder;28.00;1
hanging lamps with plug;6;390;9;https://ledsone.co.uk/collections/plugin-lighting;13.00;1
pendant lights;22;6600;9;https://ledsone.co.uk/collections/pendant-lights/pendant-lights;28.00;1
hanging pendant plug in lights;2;140;9;https://ledsone.co.uk/collections/plugin-lighting;6.00;1
rope ceiling lights;2;140;9;https://ledsone.co.uk/collections/hemp-rope-lighting;9.00;1
plug in light fixture;2;110;9;https://ledsone.co.uk/collections/plugin-lighting;17.00;1
swag light;2;140;9;https://ledsone.co.uk/products/single-ceiling-pendant-lamp-shade-swag-hanging-light;23.00;1
bulb holder screw;3;140;9;https://ledsone.co.uk/collections/metal-holders;6.00;1,3
light fitting bracket;4;140;9;https://ledsone.co.uk/collections/ceiling-rose-brackets;30.00;0,1
12v led light transformer;3;210;9;https://ledsone.co.uk/collections/dc-12v-transformer;15.00;1,3
wardrobe organiser;22;6600;9;https://ledsone.co.uk/collections/storage-bags;34.00;1
12v lighting transformers;2;140;9;https://ledsone.co.uk/collections/dc-12v-transformer;9.00;1
3 pendant light;8;480;9;https://ledsone.co.uk/collections/three-outlet-lighting;16.00;1
electrical connectors push fit;3;140;9;https://ledsone.co.uk/products/32a-spring-lever-push-fit-reusable-5-way-wire-connectors;15.00;1,3
e27 filament light bulb;5;320;9;https://ledsone.co.uk/collections/e27-base-bulb;9.00;1
mini pendant lamp;4;210;9;https://ledsone.co.uk/products/mini-pendant-light-metal-e27;16.00;1
plug for light bulb;4;260;9;https://ledsone.co.uk/products/vintage-industrial-lamp-light-bulb-copper-holder-e27-light-socket;28.00;1
lamp shade chrome;2;140;9;https://ledsone.co.uk/products/modern-ceiling-pendant-light-shades-chrome-colour-lamp-shades-easy-fit;21.00;1
12 volt transformer;2;210;9;https://ledsone.co.uk/collections/dc-12v-transformer;12.00;1,3
outdoor chandelier;7;480;9;https://ledsone.co.uk/products/6-light-crystal-chandelier-light-adjustable-farmhouse-candle-ceiling-pendant-fixture-e14-base-hanging-light;9.00;1
240v to 12v converter;2;390;9;https://ledsone.co.uk/products/dc12v-80w-ip20-universal-regulated-switching-power-supply;21.00;1
pulley pendant light;2;110;9;https://ledsone.co.uk/collections/pulley-wheel-pendant-light;16.00;1
mini whiteboard;23;5400;8;https://ledsone.co.uk/collections/white-board;17.00;1
dc 5v;5;390;8;https://ledsone.co.uk/collections/dc-5v-transformer;16.00;1
e27 led bulb;22;5400;8;https://ledsone.co.uk/collections/e27-base-bulb;12.00;1
whiteboard;42;27100;8;https://ledsone.co.uk/collections/white-board;78.00;1
wall light;32;12100;8;https://ledsone.co.uk/collections/wall-light;18.00;1
lights that plug in;12;1600;8;https://ledsone.co.uk/collections/plugin-lighting;10.00;1
vintage glass light shades;8;390;8;https://ledsone.co.uk/collections/lampshades;6.00;1
bayonet bulb sizes;6;390;8;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;19.00;1
3m both side tape;12;2900;8;https://ledsone.co.uk/products/double-sided-heavy-duty-mounting-removable-tape;15.00;1
240v to12v transformer;6;390;8;https://ledsone.co.uk/products/dc-12v-ip20-power-supply;9.00;1
e27 bulb led filament;4;170;7;https://ledsone.co.uk/collections/e27-base-bulb;6.00;1
cage lamp pendant;2;110;7;https://ledsone.co.uk/collections/wire-cage-pendant-light;7.00;1
vintage light bulbs e27;5;170;7;https://ledsone.co.uk/collections/vintage-bulbs;6.00;1,3
chrome lamp shade;2;170;7;https://ledsone.co.uk/products/modern-ceiling-pendant-light-shades-chrome-colour-lamp-shades-easy-fit;19.00;1
e27 bulbs;14;2400;7;https://ledsone.co.uk/collections/e27-base-bulb;13.00;1
ceiling hooks for lamps;5;320;7;https://ledsone.co.uk/collections/hooks-and-rings/hooks-and-rings;9.00;1
d.c 5v;3;210;7;https://ledsone.co.uk/collections/dc-5v-transformer;14.00;0,1
retro e27 bulb;2;90;7;https://ledsone.co.uk/collections/vintage-bulbs;8.00;1
slippery sandals;4;880;7;https://ledsone.co.uk/products/non-slip-sandals;17.00;1
light bulb bayonet;4;320;7;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;16.00;1
rope ceiling light;3;210;7;https://ledsone.co.uk/collections/hemp-collection;9.00;1,3
ceiling lamp with switch;2;110;7;https://ledsone.co.uk/products/ceiling-rose-with-toggle-switch-on-off-ceiling-lights;20.00;1
metal black lampshade;2;110;7;https://ledsone.co.uk/products/ledsone-industrial-vintage-32cm-black-pendant-retro-metal-lamp-shade-e27-uk-holder;20.00;1
sbled light bulb;13;1900;7;https://ledsone.co.uk/collections/led-bulbs;22.00;1
vintage led bulbs;5;260;7;https://ledsone.co.uk/collections/led-bulbs;13.00;1
pipe lamp;2;90;7;https://ledsone.co.uk/collections/pipe-lighting;8.00;1
b22 bayonet bulb;6;320;7;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;15.00;1
waterproof cable connector;9;1000;7;https://ledsone.co.uk/products/longlife-waterproof-electrical-junction-box-cable-connector-wire-ip68-outdoor-uk;9.00;1,3
bulb receptacle;3;1000;7;https://ledsone.co.uk/products/vintage-industrial-lamp-light-bulb-copper-holder-e27-light-socket;22.00;1
dry erase board;5;320;7;https://ledsone.co.uk/collections/white-board;9.00;0
decorative light bulbs bayonet;3;110;7;https://ledsone.co.uk/collections/led-bulbs;9.00;1
socket with holder;4;320;7;https://ledsone.co.uk/products/3-pack-e14-bulb-holder-edison-small-screw-ses-black-plastic-lamp-holder-4364;25.00;1
pendant lamps plug in;2;110;7;https://ledsone.co.uk/collections/plugin-lighting;9.00;1
light bracket;4;260;7;https://ledsone.co.uk/collections/ceiling-rose-brackets;9.00;1
cage for pendant light;3;110;7;https://ledsone.co.uk/collections/wire-cage-pendant-light;4.00;1,3
red ceiling light;6;320;7;https://ledsone.co.uk/products/red-pendant-light-lampshade-ceiling-light-shade-with-bulb;17.00;1
pendant light that plugs in;4;210;7;https://ledsone.co.uk/collections/plugin-lighting;7.00;1
rose fitting;3;320;7;https://ledsone.co.uk/collections/single-outlet-ceiling-rose;9.00;1
12v ac adapter;6;320;7;https://ledsone.co.uk/products/240v-to-12v-power-supply-universal-adapter;23.00;1
bulb size e27;3;260;7;https://ledsone.co.uk/collections/e27-base-bulb;18.00;1
light bulbs bayonet;6;320;7;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;15.00;1
rope lights;15;2400;7;https://ledsone.co.uk/collections/hemp-rope-lighting;14.00;1
screw holder bulb;2;170;7;https://ledsone.co.uk/collections/metal-holders;14.00;1
chrome lampshade;2;210;7;https://ledsone.co.uk/products/modern-ceiling-pendant-light-shades-chrome-colour-lamp-shades-easy-fit;20.00;1
mould proof shower curtain;6;320;7;https://ledsone.co.uk/products/fabric-solid-color-shower-curtain-for-bathtub-shower-5288;22.00;1
pendant lamp hook;3;110;7;https://ledsone.co.uk/products/pendant-light-cable-hook-cord-clip-cable-ceiling-or-wall-mounted-4433;9.00;1,3
ceiling rope lights;3;170;7;https://ledsone.co.uk/collections/hemp-rope-lighting;17.00;1
led globe b22;5;320;7;https://ledsone.co.uk/collections/b22-led-bulbs;9.00;0
transformer led 12v;3;210;6;https://ledsone.co.uk/collections/dc-12v-transformer;14.00;1
crow lamp;6;260;6;https://ledsone.co.uk/products/black-raven-shape-rasin-bird-table-lamps-desk-lamp;15.00;1
lamp and socket;5;210;6;https://ledsone.co.uk/products/vintage-industrial-lamp-light-bulb-copper-holder-e27-light-socket;22.00;1
edison screw bulb e27;9;320;6;https://ledsone.co.uk/collections/e27-base-bulb;19.00;1
types of light fixtures;3;140;6;https://ledsone.co.uk/blogs/new/types-of-lamp-fixtures;14.00;1
e27 light bulb base;3;210;6;https://ledsone.co.uk/collections/metal-holders;30.00;1
cage lamp shade;3;140;6;https://ledsone.co.uk/collections/wire-cage;16.00;1,3
scale weighing scale;24;4400;6;https://ledsone.co.uk/pl/collections/weighing-scale;28.00;1
corded pendant lamp;3;210;6;https://ledsone.co.uk/collections/plugin-lighting;28.00;1,3`;

const LEDHUT_RAW = `led light bulbs;1;5400;1339;https://ledhut.co.uk/collections/led-light-bulbs;33.00;1
light bulbs led bulbs;1;4400;1091;https://ledhut.co.uk/collections/led-light-bulbs;30.00;1
bulb;1;8100;1069;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;47.00;1
bulbs with led;1;3600;892;https://ledhut.co.uk/collections/led-light-bulbs;34.00;1
e27 bulb;2;18100;796;https://ledhut.co.uk/collections/e27-led-bulbs-es;21.00;1
led lights;6;33100;728;https://ledhut.co.uk/;50.00;1
gu10 led lights;1;2900;719;https://ledhut.co.uk/collections/gu10-led-bulbs;15.00;0
gu10 bulb;2;8100;664;https://ledhut.co.uk/collections/gu10-led-bulbs;15.00;1
led in bulb;1;3600;475;https://ledhut.co.uk/collections/led-light-bulbs;26.00;1
led spotlights;2;3600;475;https://ledhut.co.uk/collections/led-spotlights;15.00;1
led hut;1;590;472;https://ledhut.co.uk/;49.00;2
led lights and bulbs;1;1900;471;https://ledhut.co.uk/collections/led-light-bulbs;34.00;0,1
led bulbs;1;5400;442;https://ledhut.co.uk/collections/led-light-bulbs;33.00;1
dimmable light bulbs;2;2900;382;https://ledhut.co.uk/collections/dimmable-led-bulbs;28.00;1
gu10 bulbs;1;4400;360;https://ledhut.co.uk/collections/gu10-led-bulbs;16.00;1
e27 led bulb;1;5400;351;https://ledhut.co.uk/collections/e27-led-bulbs-es;12.00;1
gu10 led bulbs;1;5400;351;https://ledhut.co.uk/collections/gu10-led-bulbs;17.00;1
led;5;18100;343;https://ledhut.co.uk/;49.00;1
ledowe;7;14800;325;https://ledhut.co.uk/collections/led-light-bulbs;54.00;1
dimmable led bulbs;1;1300;322;https://ledhut.co.uk/collections/dimmable-led-bulbs;19.00;1
e27 bulbs;1;2400;316;https://ledhut.co.uk/collections/e27-led-bulbs-es;13.00;1
led bulb led;1;2400;316;https://ledhut.co.uk/collections/led-light-bulbs;28.00;1
gu10 light bulb;1;2400;316;https://ledhut.co.uk/collections/gu10-led-bulbs;23.00;1
ledhut;1;390;312;https://ledhut.co.uk/;50.00;2
led lamp light bulb;1;3600;295;https://ledhut.co.uk/collections/led-light-bulbs;32.00;1
light bulbs;5;12100;290;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;25.00;1
light with bulb;3;12100;290;https://ledhut.co.uk/collections/led-light-bulbs;12.00;1
light bulb;4;12100;290;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;28.00;3
gu10;1;4400;286;https://ledhut.co.uk/collections/gu10-led-bulbs;15.00;1
flood light lights;2;4400;286;https://ledhut.co.uk/collections/led-flood-lights;20.00;1
light bulb fittings;1;1000;248;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;15.00;1
led bulbs uk;1;1000;248;https://ledhut.co.uk/collections/led-light-bulbs;26.00;1
led floodlight;1;1000;248;https://ledhut.co.uk/collections/led-flood-lights;10.00;1
flood lights;2;2900;237;https://ledhut.co.uk/collections/led-flood-lights;12.00;1
led light light bulbs;1;3600;234;https://ledhut.co.uk/collections/led-light-bulbs;28.00;1
led bulb bulb;1;3600;234;https://ledhut.co.uk/collections/led-light-bulbs;31.00;1
led light bulbs uk;1;880;218;https://ledhut.co.uk/collections/led-light-bulbs;19.00;0,1
led flood lights;1;2400;196;https://ledhut.co.uk/collections/led-flood-lights;11.00;1
led bulb;1;2900;188;https://ledhut.co.uk/collections/led-light-bulbs;28.00;1
led lamp bulb;1;2900;188;https://ledhut.co.uk/collections/led-light-bulbs;32.00;1
gu10 led bulb;2;2900;188;https://ledhut.co.uk/collections/gu10-led-bulbs;12.00;1
commercial led lighting;1;720;178;https://ledhut.co.uk/collections/commercial-led-lighting;11.00;0
led floodlights;1;720;178;https://ledhut.co.uk/collections/led-flood-lights;20.00;1
led dimmer light bulbs;1;720;178;https://ledhut.co.uk/collections/dimmable-led-bulbs;21.00;0
gu10 led light bulbs;1;720;178;https://ledhut.co.uk/collections/gu10-led-bulbs;21.00;0
led for flood light;1;1300;171;https://ledhut.co.uk/collections/led-flood-lights;15.00;1
gu10 led;1;1300;171;https://ledhut.co.uk/collections/gu10-led-bulbs;10.00;1
gu10 light bulbs;2;1300;171;https://ledhut.co.uk/collections/gu10-led-bulbs;17.00;1
led bulb led lighting;1;3600;158;https://ledhut.co.uk/collections/led-light-bulbs;34.00;1
e27 led lamp bulb;1;3600;158;https://ledhut.co.uk/collections/e27-led-bulbs-es;13.00;1
led e27 led;1;3600;158;https://ledhut.co.uk/collections/e27-led-bulbs-es;11.00;1
l e d spot light;2;1900;155;https://ledhut.co.uk/collections/led-spotlights;12.00;1
led gu10 bulb;1;590;146;https://ledhut.co.uk/collections/gu10-led-bulbs;13.00;0,1
light bulbs led uk;1;590;146;https://ledhut.co.uk/collections/led-light-bulbs;21.00;1
led gu10;1;590;146;https://ledhut.co.uk/collections/gu10-led-bulbs;17.00;1
dimmable led light bulbs;1;590;146;https://ledhut.co.uk/collections/dimmable-led-bulbs;21.00;1
led flood lights outdoor;1;590;146;https://ledhut.co.uk/collections/led-flood-lights;20.00;1
lumilife;1;170;136;https://ledhut.co.uk/collections/lumilife;16.00;2
led flood light led;1;1000;132;https://ledhut.co.uk/collections/led-flood-lights;19.00;1
led gu10 bulbs;1;1000;132;https://ledhut.co.uk/collections/gu10-led-bulbs;22.00;1
dimmers and led bulbs;1;1000;132;https://ledhut.co.uk/collections/dimmable-led-bulbs;23.00;1
led flood light;1;1000;132;https://ledhut.co.uk/collections/led-flood-lights;15.00;1
e27 light bulbs led;1;1000;132;https://ledhut.co.uk/collections/e27-led-bulbs-es;10.00;1
led spotlight;2;1600;131;https://ledhut.co.uk/collections/led-spotlights;12.00;1
cu10 led bulbs;4;2900;127;https://ledhut.co.uk/collections/dimmable-led-bulbs/gu10;18.00;1
e27 light bulb;3;2900;127;https://ledhut.co.uk/collections/e27-led-bulbs-es;22.00;1
e27;2;2900;127;https://ledhut.co.uk/collections/e27-led-bulbs-es;13.00;1
flood light flood light;2;3600;126;https://ledhut.co.uk/collections/led-flood-lights;11.00;1
lamp led g9;6;6600;125;https://ledhut.co.uk/collections/led-light-bulbs/g9;17.00;1
driver per led;2;1900;123;https://ledhut.co.uk/collections/drivers-fittings-switches;16.00;1
led bulba;1;480;119;https://ledhut.co.uk/collections/led-light-bulbs;28.00;0
e27 bulb led warm white;1;480;119;https://ledhut.co.uk/collections/e27-led-bulbs-es;9.00;1,3
light bulb led;1;480;119;https://ledhut.co.uk/collections/led-light-bulbs;27.00;1
outdoor led flood lights;1;480;119;https://ledhut.co.uk/collections/led-flood-lights;20.00;0,1
e27 filament bulb;1;480;119;https://ledhut.co.uk/collections/e27-led-filament-bulbs-es;10.00;1
led spot lights;2;880;116;https://ledhut.co.uk/collections/led-spotlights;9.00;1
christmas lights 1000 warm white;1;880;116;https://ledhut.co.uk/products/treebright-1000-led-christmas-tree-lights-with-timer-25m-white-warm-white;9.00;1,3
led lightbulbs;1;880;116;https://ledhut.co.uk/collections/led-light-bulbs;30.00;1
led light bulbs dimmable;1;880;116;https://ledhut.co.uk/collections/dimmable-led-bulbs;13.00;1
e27 light bulbs;1;880;116;https://ledhut.co.uk/collections/e27-led-bulbs-es;21.00;1
led bulb and;1;3600;108;https://ledhut.co.uk/collections/led-light-bulbs;37.00;1
led gu10 led bulbs;2;1300;106;https://ledhut.co.uk/collections/gu10-led-bulbs;8.00;1
spotlights;9;8100;105;https://ledhut.co.uk/collections/led-spotlights;28.00;0
light bulbs dimming;2;2400;105;https://ledhut.co.uk/collections/dimmable-led-bulbs;22.00;1
light e14 bulb;10;8100;105;https://ledhut.co.uk/blogs/news/your-guide-to-e14-led-bulbs;14.00;1
e14 led bulb;7;4400;105;https://ledhut.co.uk/blogs/news/your-guide-to-e14-led-bulbs;14.00;1
led lamp led lamp;1;2400;105;https://ledhut.co.uk/collections/led-light-bulbs;22.00;1
spotlights with led;5;2900;101;https://ledhut.co.uk/collections/led-spotlights;17.00;1
led equivalent of 60w;1;390;96;https://ledhut.co.uk/blogs/news/led-equivalent-wattages-against-traditional-lighting;15.00;1
led lamp bulb light;1;390;96;https://ledhut.co.uk/collections/led-light-bulbs;33.00;1
led dimmable bulbs;1;390;96;https://ledhut.co.uk/collections/dimmable-led-bulbs;25.00;1
e27 es bulb;1;720;95;https://ledhut.co.uk/collections/e27-led-bulbs-es;10.00;1
1000 warm white christmas lights;1;720;95;https://ledhut.co.uk/products/treebright-1000-led-christmas-tree-lights-with-timer-25m-white-warm-white;22.00;0,1
flood light;6;3600;86;https://ledhut.co.uk/collections/led-flood-lights;16.00;1
downlight led lamp;5;3600;86;https://ledhut.co.uk/collections/led-downlights;21.00;1
led lighting;4;3600;86;https://ledhut.co.uk/;48.00;1
led downlight led;4;3600;86;https://ledhut.co.uk/collections/led-downlights;20.00;1
led light bulb;1;1300;84;https://ledhut.co.uk/collections/led-light-bulbs;34.00;1
bulbs dimmable;3;1900;83;https://ledhut.co.uk/collections/dimmable-led-bulbs;18.00;1
led light fittings;3;1000;82;https://ledhut.co.uk/collections/light-fittings-fixtures;19.00;0,1`;

const LIGHTINGCOMPANY_RAW = `light fittings;2;12100;1597;https://www.lightingcompany.co.uk/ceiling-lights-c3;33.00;0
the lighting company;1;1300;1040;https://www.lightingcompany.co.uk/;52.00;2
light fixtures;1;2900;719;https://www.lightingcompany.co.uk/ceiling-lights-c3;37.00;1
lighting uk ceiling;1;2400;595;https://www.lightingcompany.co.uk/ceiling-lights-c3;22.00;1
table light shades;2;4400;580;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;26.00;1
light fitting;1;4400;580;https://www.lightingcompany.co.uk/ceiling-lights-c3;32.00;1
lighting company;1;720;576;https://www.lightingcompany.co.uk/;72.00;0
the lighting company uk;1;720;576;https://www.lightingcompany.co.uk/;34.00;2
light fitting ceiling;2;3600;475;https://www.lightingcompany.co.uk/ceiling-lights-c3;33.00;0
chandelier in a bedroom;1;1900;471;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;11.00;1
best reading lamps;9;33100;430;https://www.lightingcompany.co.uk/table-floor-lamps-c5/reading-craft-lights-c38;19.00;0
lights and bulb;1;4400;360;https://www.lightingcompany.co.uk/light-bulbs-c95;36.00;0
light fixture;1;1300;322;https://www.lightingcompany.co.uk/ceiling-lights-c3;40.00;1,3
cream lampshade;1;1300;322;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120/cream-and-ivory-t209;13.00;1
chandeliers in the bedroom;1;2400;316;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;11.00;1
bathroom light fixtures;2;2400;316;https://www.lightingcompany.co.uk/bathroom-lights-c1;27.00;1
households outdoor lights advice;1;4400;286;https://www.lightingcompany.co.uk/blog/the-definitive-guide-to-outdoor-lights/;22.00;1
bathroom mirror lights;2;1900;250;https://www.lightingcompany.co.uk/bathroom-lights-c1/mirror-lights-c87;15.00;1
lighting fixtures;2;1900;250;https://www.lightingcompany.co.uk/ceiling-lights-c3;34.00;1
floor lamp shades;2;1900;250;https://www.lightingcompany.co.uk/table-floor-lamps-c5/floor-lamp-shades-c323;13.00;1
large ceiling lights;1;1000;248;https://www.lightingcompany.co.uk/ceiling-lights-c3/extra-large-and-oversized-ceiling-lights-c125;14.00;0
bathroom chandeliers;1;1000;248;https://www.lightingcompany.co.uk/bathroom-lights-c1/bathroom-chandeliers-ip44-c75;13.00;0
glass lamp shades for ceiling lights;1;880;218;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;9.00;0
chandelier in the bedroom;1;1600;211;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;11.00;1
light fittings uk;2;1600;211;https://www.lightingcompany.co.uk/ceiling-lights-c3;34.00;1
light fixtures for a bathroom;1;1600;211;https://www.lightingcompany.co.uk/bathroom-lights-c1;22.00;1
lighting light fixture;2;2400;196;https://www.lightingcompany.co.uk/ceiling-lights-c3;30.00;1
ceiling light shades;4;5400;189;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/lounge-and-living-room-lights-t125;21.00;1
tiffany lamps tiffany lamps;8;9900;188;https://www.lightingcompany.co.uk/tiffany-lights-t26;24.00;0
chandeliers for sale;1;720;178;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18;22.00;3
ceiling light fixtures uk;2;1300;171;https://www.lightingcompany.co.uk/ceiling-lights-c3;22.00;1
table lamp shades uk;2;1300;171;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;20.00;1
lighting company uk;1;210;168;https://www.lightingcompany.co.uk/;69.00;0
floor lamp with gold;2;3600;158;https://www.lightingcompany.co.uk/table-floor-lamps-c5/gold-antique-gold-t46;13.00;1
lighting and sconces;3;2400;156;https://www.lightingcompany.co.uk/wall-lights-c15;22.00;1
antique brass ceiling lights;4;2400;156;https://www.lightingcompany.co.uk/ceiling-lights-c3/brass-antique-aged-brass-t21;16.00;0
kitchen with pendant lighting;4;2400;156;https://www.lightingcompany.co.uk/ceiling-lights-c3/pendant-lights-c8;12.00;1
ceiling light fixture;3;2400;156;https://www.lightingcompany.co.uk/ceiling-lights-c3;33.00;1
ceiling lights united kingdom;3;2400;156;https://www.lightingcompany.co.uk/ceiling-lights-c3;23.00;1
british outdoor lighting;2;1900;155;https://www.lightingcompany.co.uk/outdoor-lights-c27/british-made-in-uk-lighting-t23;12.00;0
rustic ceiling lights;1;590;146;https://www.lightingcompany.co.uk/ceiling-lights-c3/rustic-lighting-c29;9.00;1,3
touch table lamps for bedroom;1;590;146;https://www.lightingcompany.co.uk/table-floor-lamps-c5/touch-lamps-c126;12.00;0
lamp shades table lamps uk;1;590;146;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;12.00;0
living room pendant light;1;590;146;https://www.lightingcompany.co.uk/ceiling-lights-c3/pendant-lights-c8/lounge-and-living-room-lights-t125;12.00;1
bathroom lights over mirror;1;590;146;https://www.lightingcompany.co.uk/bathroom-lights-c1/mirror-lights-c87;16.00;0,1
glass ceiling light shades;1;590;146;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;11.00;1
over mirror bathroom light;1;590;146;https://www.lightingcompany.co.uk/bathroom-lights-c1/mirror-lights-c87;16.00;1
fit a light;3;6600;145;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-to-install-lighting-t252;22.00;1
thelightingcompany;1;170;136;https://www.lightingcompany.co.uk/;21.00;2
ceiling light;10;27100;135;https://www.lightingcompany.co.uk/ceiling-lights-c3;32.00;1
waterproof bathroom ceiling lights;2;1000;132;https://www.lightingcompany.co.uk/bathroom-lights-c1/modern-bathroom-lighting-c2;16.00;0
green ceiling light;2;1000;132;https://www.lightingcompany.co.uk/ceiling-lights-c3/green-and-verdigris-t33;12.00;0
chrome ceiling lights;2;1000;132;https://www.lightingcompany.co.uk/ceiling-lights-c3/chrome-t45;13.00;0
dining room ceiling lights;2;1600;131;https://www.lightingcompany.co.uk/ceiling-lights-c3/modern-ceiling-lighting-c7/dining-room-lighting-t126;13.00;0
chandelier crystal chandeliers;2;1600;131;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/crystal-t1;16.00;0
lampshade pendant lighting;3;2900;127;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33;18.00;0
lighting shop;4;2900;127;https://www.lightingcompany.co.uk/;67.00;0
chandelier light;7;6600;125;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18;27.00;1
wall light fixture with switch;2;1900;123;https://www.lightingcompany.co.uk/wall-lights-c15/switched-wall-lights-c189;11.00;1
table lighting uk;3;1900;123;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamps-c127;16.00;1
british table lamps;4;1900;123;https://www.lightingcompany.co.uk/table-floor-lamps-c5/british-made-in-uk-lighting-t23;9.00;0
lights for the mirror;1;1900;123;https://www.lightingcompany.co.uk/bathroom-lights-c1/mirror-lights-c87;12.00;1
bedroom chandelier;3;1900;123;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;14.00;1
bedroom chandeliers;1;480;119;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;8.00;0
ceiling light fixture uk;1;480;119;https://www.lightingcompany.co.uk/ceiling-lights-c3;22.00;1
victorian wall lights;1;480;119;https://www.lightingcompany.co.uk/wall-lights-c15/period-wall-lights-c45;9.00;1,3
table lampshades for living room;1;480;119;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120/lounge-and-living-room-lights-t125;7.00;1
restaurant lighting;1;480;119;https://www.lightingcompany.co.uk/hospitality-leisure-c94/restaurant-lighting-c114;12.00;1
victorian chandelier;1;480;119;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/victorian-edwardian-lights-t22;11.00;1
art deco light shades;1;480;119;https://www.lightingcompany.co.uk/art-nouveau-art-deco-lighting-t32;9.00;1
cream table lampshades;1;480;119;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120/cream-and-ivory-t209;10.00;1
table lamp shades;6;5400;118;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;28.00;1
glass ceiling lamp shades;1;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;14.00;0
large chandeliers;2;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/large-chandeliers-60cm-and-over-in-diameter-c273;13.00;1
chandelier in a bathroom;1;880;116;https://www.lightingcompany.co.uk/bathroom-lights-c1/bathroom-chandeliers-ip44-c75;13.00;1
glass lamp shade;2;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;11.00;0,1
copper ceiling light;2;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/copper-t77;16.00;1
washroom mirror lights;2;880;116;https://www.lightingcompany.co.uk/bathroom-lights-c1/mirror-lights-c87;9.00;0
small chandelier;1;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/small-chandeliers-less-than-40cm-diameter-c271;12.00;0
white light shade ceiling;1;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/white-t41;22.00;0
brass spotlights;1;880;116;https://www.lightingcompany.co.uk/spot-lights-c21/brass-antique-aged-brass-t21;9.00;1
bathroom lights uk;2;880;116;https://www.lightingcompany.co.uk/bathroom-lights-c1;25.00;1
the lighting co;1;140;112;https://www.lightingcompany.co.uk/;66.00;2
the lighting company taunton;1;140;112;https://www.lightingcompany.co.uk/;32.00;1
cream lamp shades;2;1300;106;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120/cream-and-ivory-t209;21.00;0
retro lamp;2;1300;106;https://www.lightingcompany.co.uk/table-floor-lamps-c5/retro-style-lighting-t12;18.00;1,3
glass light shade;2;1300;106;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;16.00;1
floor lamp shade;2;1300;106;https://www.lightingcompany.co.uk/table-floor-lamps-c5/floor-lamp-shades-c323;14.00;0
ceiling lamp big;2;1300;106;https://www.lightingcompany.co.uk/ceiling-lights-c3/extra-large-and-oversized-ceiling-lights-c125;22.00;1
art deco wall lights;3;1300;106;https://www.lightingcompany.co.uk/wall-lights-c15/art-nouveau-art-deco-lighting-t32;8.00;1,3
gold pendant light fixture;2;1300;106;https://www.lightingcompany.co.uk/ceiling-lights-c3/pendant-lights-c8/gold-antique-gold-t46;8.00;0
glass light shades;4;2400;105;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;21.00;1
lightening bulb;1;1600;104;https://www.lightingcompany.co.uk/light-bulbs-c95;16.00;1
blue table lamp;2;1600;104;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamps-c127/blue-t73;11.00;0
lamp shades for table;7;5400;102;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;22.00;1
chandeliers in gold;2;2900;101;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/gold-antique-gold-t46;9.00;1
ceiling lightshade uk;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33;24.00;0
designer lighting uk;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/designer-lighting-for-ceilings-c4;26.00;0
lights sloped ceilings;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/sloping-ceiling-lights-c209;9.00;1
slope ceiling light fixture;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/sloping-ceiling-lights-c209;14.00;0`;

const INDUSTVILLE_RAW = `industville;1;3600;2880;https://www.industville.co.uk/;29.00;2
industville lighting;1;1300;1040;https://www.industville.co.uk/;22.00;2
industville uk;1;1300;1040;https://www.industville.co.uk/;21.00;2
industville lighting uk;1;1300;1040;https://www.industville.co.uk/;22.00;2
pendant lights in the kitchen;1;3600;475;https://www.industville.co.uk/collections/kitchen-island-lighting;16.00;1
bar in lights;1;1900;471;https://www.industville.co.uk/collections/restaurant-bar-and-coffee-shop-lighting;11.00;1
hall lights;1;1600;396;https://www.industville.co.uk/collections/hallway-lights;16.00;0
vintage wall lights;1;1300;322;https://www.industville.co.uk/collections/wall-lights;9.00;1
kitchen with pendant lighting;2;2400;316;https://www.industville.co.uk/collections/kitchen-island-lighting;12.00;1
industriville;1;390;312;https://www.industville.co.uk/;27.00;2
industville lights;1;390;312;https://www.industville.co.uk/collections/ceiling-lights;22.00;2,3
industiville;1;320;256;https://www.industville.co.uk/;28.00;2
industrial ceiling lights;1;1000;248;https://www.industville.co.uk/collections/ceiling-lights;9.00;0
industville wall lights;1;260;208;https://www.industville.co.uk/collections/wall-lights;19.00;2
industrville;1;260;208;https://www.industville.co.uk/;22.00;2
kitchen pendant lighting;2;2400;196;https://www.industville.co.uk/collections/kitchen-island-lighting;13.00;0
outside bulkhead lights;1;720;178;https://www.industville.co.uk/collections/bulkhead-lights;13.00;0
industrial pendant lighting;1;720;178;https://www.industville.co.uk/collections/ceiling-lights;8.00;1
large pendant lighting;1;720;178;https://www.industville.co.uk/collections/large-decorative-lights;9.00;0
edison with bulb;1;1300;171;https://www.industville.co.uk/collections/led-decorative-light-bulbs;17.00;1
edison bulb;1;1300;171;https://www.industville.co.uk/collections/led-decorative-light-bulbs;12.00;1
vintage light wall;1;1300;171;https://www.industville.co.uk/collections/wall-lights;9.00;1
industrial wall lights;1;1300;171;https://www.industville.co.uk/collections/wall-lights;9.00;0
hallway light;3;2400;156;https://www.industville.co.uk/collections/hallway-lights;15.00;1
wall sconces wall sconces;3;4400;154;https://www.industville.co.uk/collections/wall-lights;19.00;1
industrial lighting wall lights;1;590;146;https://www.industville.co.uk/collections/wall-lights;13.00;1
retro filament bulbs;2;1000;132;https://www.industville.co.uk/collections/led-decorative-light-bulbs;12.00;1
hanging kitchen lights;2;1000;132;https://www.industville.co.uk/collections/kitchen-island-lighting;21.00;0
vintage light bulbs;2;1000;132;https://www.industville.co.uk/collections/led-decorative-light-bulbs;9.00;1
giant ceiling light;1;1000;132;https://www.industville.co.uk/collections/large-decorative-lights;11.00;0
ceiling industrial lamp;1;1000;132;https://www.industville.co.uk/collections/ceiling-lights;9.00;0,1
bedroom lighting ideas;5;2900;127;https://www.industville.co.uk/collections/bedroom-lights;16.00;1
bulkhead light;2;3600;126;https://www.industville.co.uk/collections/bulkhead-lights;16.00;1
industrial lighting;4;1900;123;https://www.industville.co.uk/;15.00;0
large pendant light;1;480;119;https://www.industville.co.uk/collections/large-decorative-lights;8.00;1
bar lighting;1;480;119;https://www.industville.co.uk/collections/restaurant-bar-and-coffee-shop-lighting;10.00;1
edison light bulb;1;880;116;https://www.industville.co.uk/collections/led-decorative-light-bulbs;16.00;1
wall lights vintage;1;880;116;https://www.industville.co.uk/collections/wall-lights;9.00;1
kitchen pendant lights island;3;3600;108;https://www.industville.co.uk/collections/kitchen-island-lighting;11.00;1
bulkhead lights;2;1300;106;https://www.industville.co.uk/collections/bulkhead-lights;17.00;1,3
bulkhead;3;4400;105;https://www.industville.co.uk/collections/bulkhead-lights;27.00;1
hanging kitchen island lighting;3;2400;105;https://www.industville.co.uk/collections/kitchen-island-lighting;12.00;1
kitchen pendant lights;4;1600;104;https://www.industville.co.uk/collections/kitchen-island-lighting;19.00;0
semi flush mount ceiling light;3;1600;104;https://www.industville.co.uk/collections/low-ceiling-lights;9.00;0
glass lights;1;390;96;https://www.industville.co.uk/collections/glass-lights;9.00;1
pendant kitchen lights;2;720;95;https://www.industville.co.uk/collections/kitchen-island-lighting;17.00;0
bulkhead lights outdoor;1;720;95;https://www.industville.co.uk/collections/bulkhead-lights;14.00;1
kitchen island lighting ideas;2;720;95;https://www.industville.co.uk/collections/kitchen-island-lighting;17.00;1
edison bulbs;1;720;95;https://www.industville.co.uk/collections/led-decorative-light-bulbs;17.00;1
industvile;1;110;88;https://www.industville.co.uk/;23.00;2
lighting ideas for the bedroom;5;2900;87;https://www.industville.co.uk/collections/bedroom-lights;23.00;1
hanging light pendants for kitchen;4;3600;86;https://www.industville.co.uk/collections/kitchen-island-lighting;19.00;0
lights for the kitchen island;4;3600;86;https://www.industville.co.uk/collections/kitchen-island-lighting;18.00;0,1
brass light fittings;3;1300;84;https://www.industville.co.uk/collections/brass-lights;9.00;0
waterproof bathroom ceiling lights;3;1000;82;https://www.industville.co.uk/collections/bathroom-lights;16.00;0
metal lamp shades;3;1000;82;https://www.industville.co.uk/collections/lighting-shades-and-lampshades;20.00;1
bulb holder with bulb;1;1000;82;https://www.industville.co.uk/collections/light-bulb-holders;13.00;1
glass ceiling lights;2;1000;82;https://www.industville.co.uk/collections/glass-lights;10.00;0
hanging kitchen lights pendant;2;1000;82;https://www.industville.co.uk/collections/kitchen-island-lighting;16.00;1
wall industrial lights;2;1000;82;https://www.industville.co.uk/collections/wall-lights;9.00;1
edison e27 bulb;1;320;79;https://www.industville.co.uk/collections/led-decorative-light-bulbs;15.00;0,1
alabaster light;1;320;79;https://www.industville.co.uk/collections/alabaster-lighting;10.00;1,3
e27 edison bulb;1;320;79;https://www.industville.co.uk/collections/led-decorative-light-bulbs;15.00;1
bulkhead outdoor lights;1;320;79;https://www.industville.co.uk/collections/bulkhead-lights;16.00;0
cottage ceiling light;1;320;79;https://www.industville.co.uk/collections/cottage-ceiling-lights-wall-sconces;7.00;1
large pendant lights;1;320;79;https://www.industville.co.uk/collections/large-decorative-lights;9.00;0
massive pendant light;1;320;79;https://www.industville.co.uk/collections/large-decorative-lights;8.00;0
brass lights;2;590;77;https://www.industville.co.uk/collections/brass-lights;16.00;1
kitchen pendant light;2;590;77;https://www.industville.co.uk/collections/kitchen-island-lighting;17.00;0
outdoor bulkhead lights;1;590;77;https://www.industville.co.uk/collections/bulkhead-lights;16.00;1
industville rugs;1;90;72;https://www.industville.co.uk/collections/homeware;20.00;1,3
outdoor bulkhead light;2;880;72;https://www.industville.co.uk/collections/bulkhead-lights;16.00;1
kitchen island lights;5;1900;66;https://www.industville.co.uk/collections/kitchen-island-lighting;18.00;0,1
contemporary lounge lights;3;1000;65;https://www.industville.co.uk/collections/living-room-lights;16.00;1
retro incandescent light bulbs;3;1000;65;https://www.industville.co.uk/collections/led-decorative-light-bulbs;29.00;1
brass metal pendant light;1;1000;65;https://www.industville.co.uk/collections/metal-decorative-lights;11.00;1
pendant lamp kitchen island;3;1000;65;https://www.industville.co.uk/collections/kitchen-island-lighting;9.00;1
vintage light bulb lights;3;1000;65;https://www.industville.co.uk/collections/led-decorative-light-bulbs;8.00;1
industrial kitchen lighting;1;260;64;https://www.industville.co.uk/collections/kitchen-lights;10.00;0
wall lights industrial;1;260;64;https://www.industville.co.uk/collections/wall-lights;8.00;1
industrial pendant lights;1;260;64;https://www.industville.co.uk/collections/ceiling-lights;8.00;0
industrial light shade;1;480;63;https://www.industville.co.uk/collections/lighting-shades-and-lampshades;12.00;1
hallway lamp;2;720;59;https://www.industville.co.uk/collections/hallway-lights;12.00;1
kitchen hanging lights;3;720;59;https://www.industville.co.uk/collections/kitchen-island-lighting;21.00;0
exterior bulkhead lights;2;720;59;https://www.industville.co.uk/collections/bulkhead-lights;13.00;0
over kitchen island pendant lights;3;720;59;https://www.industville.co.uk/collections/kitchen-island-lighting;9.00;1
brass light;2;720;59;https://www.industville.co.uk/collections/brass-lights;11.00;1,3
50 small bathroom ideas;2;720;59;https://www.industville.co.uk/blogs/news/50-small-bathroom-ideas-that-increase-space;47.00;1
bulk head light;2;880;57;https://www.industville.co.uk/collections/bulkhead-lights;16.00;1
pendant light fixtures glass;5;2400;57;https://www.industville.co.uk/collections/glass-lights;14.00;1
bronze ceiling light;2;880;57;https://www.industville.co.uk/collections/bronze-lights;9.00;1
hanging lights for kitchen;2;880;57;https://www.industville.co.uk/collections/kitchen-island-lighting;22.00;0
industrial light fixtures;1;210;52;https://www.industville.co.uk/collections/ceiling-lights;7.00;1
decorative led bulbs;1;210;52;https://www.industville.co.uk/collections/led-decorative-light-bulbs;14.00;1
cottage lighting;1;210;52;https://www.industville.co.uk/collections/cottage-ceiling-lights-wall-sconces;9.00;1
industrial style ceiling lamps;1;210;52;https://www.industville.co.uk/collections/ceiling-lights;7.00;1
metal lighting pendants;1;210;52;https://www.industville.co.uk/collections/metal-decorative-lights;14.00;0
industrial style wall lights;1;210;52;https://www.industville.co.uk/collections/wall-lights;7.00;1
e27 bulb edison;1;210;52;https://www.industville.co.uk/collections/led-decorative-light-bulbs;13.00;1
waterproof bathroom wall lights;1;210;52;https://www.industville.co.uk/collections/bathroom-lights;5.00;1`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function parseSemrush(raw) {
  const rows = [];
  for (const line of raw.trim().split('\n')) {
    const parts = line.split(';');
    if (parts.length < 7) continue;
    rows.push({
      keyword:  parts[0].trim().toLowerCase(),
      position: parseInt(parts[1], 10),
      volume:   parseInt(parts[2], 10) || 0,
      traffic:  parseInt(parts[3], 10) || 0,
      url:      parts[4].trim(),
      kd:       parseFloat(parts[5]) || 0,
      intent:   parts[6].trim(),
    });
  }
  return rows;
}

// Build a quick-lookup map keyword -> ledsone position (best position if dupes)
function buildLedsoneMap(rows) {
  const map = {};
  for (const r of rows) {
    if (!map[r.keyword] || r.position < map[r.keyword]) {
      map[r.keyword] = r.position;
    }
  }
  return map;
}

// Branded terms to exclude (lower-cased)
const BRAND_TERMS = ['ledhut', 'led hut', 'lightingcompany', 'lighting company', 'industville', 'ledsone'];
function isBranded(kw) {
  return BRAND_TERMS.some(b => kw.includes(b));
}

function buildGaps(competitorRows, ledsoneMap, competitorDomain) {
  const gaps = [];
  for (const r of competitorRows) {
    const kw = r.keyword;
    // Only consider top-10 positions for competitor
    if (r.position > 10) continue;
    // Exclude branded terms
    if (isBranded(kw)) continue;
    // Check ledsone position
    const ledsonePos = ledsoneMap[kw] || null;
    if (ledsonePos !== null && ledsonePos <= 20) continue; // ledsone ranks 1-20 → not a gap
    // It's a gap
    const opportunityScore = r.volume * (10 / r.position);
    gaps.push({
      keyword:            kw,
      competitor_domain:  competitorDomain,
      competitor_position: r.position,
      volume:             r.volume,
      competitor_traffic: r.traffic,
      competitor_url:     r.url,
      keyword_difficulty: r.kd,
      intent:             r.intent,
      ledsone_position:   ledsonePos,
      opportunity_score:  Math.round(opportunityScore * 100) / 100,
    });
  }
  // Sort by opportunity_score DESC, take top 50
  gaps.sort((a, b) => b.opportunity_score - a.opportunity_score);
  return gaps.slice(0, 50);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false },
  });

  try {
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
    console.log('✅ Table ensured');

    // Parse data
    const ledsoneRows   = parseSemrush(LEDSONE_RAW);
    const ledhutRows    = parseSemrush(LEDHUT_RAW);
    const lcRows        = parseSemrush(LIGHTINGCOMPANY_RAW);
    const industRows    = parseSemrush(INDUSTVILLE_RAW);

    const ledsoneMap = buildLedsoneMap(ledsoneRows);
    console.log(`📊 ledsone.co.uk keywords indexed: ${Object.keys(ledsoneMap).length}`);

    const competitors = [
      { domain: 'ledhut.co.uk',          rows: ledhutRows   },
      { domain: 'lightingcompany.co.uk', rows: lcRows        },
      { domain: 'industville.co.uk',     rows: industRows    },
    ];

    const summary = [];

    for (const comp of competitors) {
      console.log(`\n🔍 Processing ${comp.domain}...`);

      // Full refresh: delete existing rows for this competitor
      const delRes = await pool.query(
        'DELETE FROM semrush_keyword_gap WHERE competitor_domain = $1',
        [comp.domain]
      );
      console.log(`   Deleted ${delRes.rowCount} old rows`);

      const gaps = buildGaps(comp.rows, ledsoneMap, comp.domain);
      console.log(`   Found ${gaps.length} gap keywords (top 50 by opportunity score)`);

      if (gaps.length === 0) {
        summary.push({ domain: comp.domain, inserted: 0, top3: [] });
        continue;
      }

      // Batch insert
      let inserted = 0;
      for (const g of gaps) {
        await pool.query(`
          INSERT INTO semrush_keyword_gap
            (keyword, competitor_domain, competitor_position, volume, competitor_traffic,
             competitor_url, keyword_difficulty, intent, ledsone_position, opportunity_score, snapshot_date)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CURRENT_DATE)
          ON CONFLICT (keyword, competitor_domain) DO UPDATE SET
            competitor_position = EXCLUDED.competitor_position,
            volume              = EXCLUDED.volume,
            competitor_traffic  = EXCLUDED.competitor_traffic,
            opportunity_score   = EXCLUDED.opportunity_score,
            snapshot_date       = CURRENT_DATE
        `, [g.keyword, g.competitor_domain, g.competitor_position, g.volume,
            g.competitor_traffic, g.competitor_url, g.keyword_difficulty,
            g.intent, g.ledsone_position, g.opportunity_score]);
        inserted++;
      }

      const top3 = gaps.slice(0, 3).map(g => `"${g.keyword}" (vol ${g.volume}, pos ${g.competitor_position}, score ${g.opportunity_score})`);
      console.log(`   ✅ Inserted/updated ${inserted} rows`);
      console.log(`   🏆 Top 3:`);
      top3.forEach((t, i) => console.log(`      ${i+1}. ${t}`));

      summary.push({ domain: comp.domain, inserted, top3 });
    }

    // Final summary
    console.log('\n═══════════════════════════════════════════════════');
    console.log('SUMMARY — Weekly SEO Keyword Gap Refresh');
    console.log('═══════════════════════════════════════════════════');
    for (const s of summary) {
      console.log(`\n${s.domain}: ${s.inserted} rows inserted`);
      s.top3.forEach((t, i) => console.log(`  ${i+1}. ${t}`));
    }

    // Verify row counts from DB
    console.log('\n📋 DB verification:');
    const check = await pool.query(`
      SELECT competitor_domain, COUNT(*) as cnt
      FROM semrush_keyword_gap
      GROUP BY competitor_domain
      ORDER BY competitor_domain
    `);
    for (const row of check.rows) {
      console.log(`  ${row.competitor_domain}: ${row.cnt} total rows in DB`);
    }

    return summary;

  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
