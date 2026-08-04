const { neon } = require('@neondatabase/serverless');

// ─── RAW SEMRUSH DATA ────────────────────────────────────────────────────────

const LEDSONE_RAW = `keyword;position;volume;traffic;url;kd;intent
ledsone;1;590;472;https://ledsone.co.uk/;41.00;2
wire connectors;3;4400;286;https://ledsone.co.uk/collections/wire-connectors;22.00;1
intitle:ledsone;1;170;136;https://ledsone.co.uk/;37.00;2
b22 bulb;4;4400;132;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;22.00;1
spider lights;1;720;95;https://ledsone.co.uk/collections/spider-light;9.00;1
ledstone;1;110;88;https://ledsone.co.uk/;34.00;2
bayonet bulb;6;3600;86;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;20.00;1
retro light shades;2;590;77;https://ledsone.co.uk/collections/lampshades;8.00;1
ledsone uk limited;1;90;72;https://ledsone.co.uk/;0.0;2
ledsone lighting;1;90;72;https://ledsone.co.uk/;41.00;2
ledsone ltd;1;90;72;https://ledsone.co.uk/;38.00;2
wiring and connectors;2;2900;69;https://ledsone.co.uk/collections/wire-connectors;31.00;1
bayonet light bulb;5;2900;69;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;23.00;1
white blackboard;8;3600;68;https://ledsone.co.uk/collections/white-board;42.00;1
bag for papers;7;2900;55;https://ledsone.co.uk/collections/office-items;23.00;1
3 core cable;6;2400;52;https://ledsone.co.uk/blogs/new/understanding-3-core-electrical-cables-types-uses-and-color-codes;15.00;1
spider light fitting;1;390;51;https://ledsone.co.uk/collections/spider-light;9.00;1
plug in hanging light fixtures;2;590;48;https://ledsone.co.uk/collections/plugin-lighting;12.00;0
retro lamp shades;2;720;46;https://ledsone.co.uk/collections/lampshades;22.00;1
bulbs for dimmers;2;1000;44;https://ledsone.co.uk/collections/dimmable-led-bulbs;17.00;1
what is an e27 bulb;1;320;42;https://ledsone.co.uk/blogs/new/e27-bulb-guide;11.00;1
lamp shade holder;2;320;42;https://ledsone.co.uk/products/screw-e27-plain-holder-white-with-ring-bakelite-lamp-holder;8.00;1
led transformer 24v;1;320;42;https://ledsone.co.uk/collections/dc-24v-transformer;8.00;0
brackets for ceiling lights;2;320;42;https://ledsone.co.uk/collections/ceiling-rose-brackets;28.00;0
e27 edison screw bulb;6;1300;39;https://ledsone.co.uk/blogs/new/e27-bulb-guide;12.00;1
plug in hanging pendant lamp;4;1300;39;https://ledsone.co.uk/collections/plugin-lighting;10.00;1
spider light;3;880;38;https://ledsone.co.uk/collections/spider-light;7.00;1
e27 light bulb;10;2900;37;https://ledsone.co.uk/collections/e27-base-bulb;22.00;1
screw light bulbs e27;7;1600;35;https://ledsone.co.uk/blogs/new/e27-bulb-guide;20.00;1
2 core cable;5;1300;31;https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;9.00;1
weight scale scale;9;4400;30;https://ledsone.co.uk/collections/weighing-scale;38.00;1
pendant plug light;7;1300;28;https://ledsone.co.uk/collections/plugin-lighting;9.00;1
b22 light bulb;7;1300;28;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;19.00;1
edison bulb;7;1300;28;https://ledsone.co.uk/collections/e27-base-bulb;16.00;1
cage light shade;1;210;27;https://ledsone.co.uk/collections/wire-cage-pendant-light;16.00;1
white board white;18;18100;27;https://ledsone.co.uk/products/magnetic-white-board-for-home-office-school-5276;22.00;1
e27 screw bulb holder;2;210;27;https://ledsone.co.uk/collections/metal-holders;18.00;1
pendant light spider;2;210;27;https://ledsone.co.uk/collections/spider-light;6.00;1
e27 bulb;16;18100;27;https://ledsone.co.uk/collections/e27-base-bulb;16.00;1
mould resistant shower curtain;2;320;26;https://ledsone.co.uk/products/fabric-solid-color-shower-curtain-for-bathtub-shower-5288;26.00;1
what is e27 bulb;1;320;26;https://ledsone.co.uk/blogs/new/e27-bulb-guide;8.00;1
big bag for laundry;3;720;25;https://ledsone.co.uk/collections/laundry-bags;16.00;1
hanging lights with plug in;2;390;25;https://ledsone.co.uk/collections/plugin-lighting;16.00;3
pendant lamp;6;1000;24;https://ledsone.co.uk/collections/pendant-lights;22.00;0
pendant lamp plug;6;1300;24;https://ledsone.co.uk/collections/plugin-lighting;11.00;1
hanging lamp plug;6;1300;24;https://ledsone.co.uk/collections/plugin-lighting;15.00;1
cage hanging light;1;90;22;https://ledsone.co.uk/collections/wire-cage-pendant-light;10.00;1
vintage e27 light bulbs;2;170;22;https://ledsone.co.uk/collections/vintage-bulbs;10.00;0
conduit lighting;3;260;21;https://ledsone.co.uk/collections/conduit-lighting;11.00;1
pipe lights;2;260;21;https://ledsone.co.uk/collections/pipe-lighting;10.00;1
spider pendant light;2;320;20;https://ledsone.co.uk/collections/spider-light;9.00;1
spider ceiling light;2;320;20;https://ledsone.co.uk/collections/spider-light;8.00;1
double sided tape;20;12100;18;https://ledsone.co.uk/products/double-sided-heavy-duty-mounting-removable-tape;21.00;1
light pendant holder;1;140;18;https://ledsone.co.uk/collections/pendant-holder;9.00;1
12v transformer;3;720;17;https://ledsone.co.uk/collections/dc-12v-transformer;19.00;1
e27 screw light bulbs;7;720;17;https://ledsone.co.uk/blogs/new/e27-bulb-guide;10.00;1
outdoor electrical cable connectors;2;210;17;https://ledsone.co.uk/products/longlife-waterproof-electrical-junction-box-cable-connector-wire-ip68-outdoor-uk;19.00;1
spider pendant lamp;2;210;17;https://ledsone.co.uk/collections/spider-light;7.00;1
holder for lamp shade;2;210;17;https://ledsone.co.uk/products/screw-e27-plain-holder-white-with-ring-bakelite-lamp-holder;7.00;1
bayonet fitting light bulbs;6;720;17;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;17.00;1
pendant light with plug in;2;210;17;https://ledsone.co.uk/collections/plugin-lighting;7.00;0
ceiling hooks for lighting;6;590;17;https://ledsone.co.uk/collections/hooks-and-rings;9.00;1
led transformer 12v;1;210;17;https://ledsone.co.uk/collections/dc-12v-transformer;11.00;1
edison screw lamp holder;4;480;16;https://ledsone.co.uk/products/black-screw-e27-light-bulb-lamp-holder-base-pendant-socket-4378;7.00;1
shower curtain;35;22200;15;https://ledsone.co.uk/collections/shower-curtain;34.00;1
plug in hanging light;6;720;15;https://ledsone.co.uk/collections/plugin-lighting;10.00;1
led lights bayonet;7;720;15;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;9.00;1
buriable junction box;2;110;14;https://ledsone.co.uk/products/waterproof-junction-box-underground-cable-line-protection-sleeve-connectors-ip66;9.00;1
bayonet fit light bulbs;7;1600;14;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;11.00;1
bayonet decorative light bulbs;2;110;14;https://ledsone.co.uk/collections/led-bulbs;14.00;1
light bulb with holder;5;590;14;https://ledsone.co.uk/collections/holder;28.00;1
transformer 24v;1;110;14;https://ledsone.co.uk/collections/dc-24v-transformer;16.00;1
white board;24;9900;14;https://ledsone.co.uk/collections/white-board;34.00;1
bayonet fitting led bulbs;7;590;14;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;12.00;1
shower slippers;4;480;14;https://ledsone.co.uk/products/home-slippers-men-women-non-slip-bathing-shower-sandals-5256;24.00;1
led transformer 12v;3;320;14;https://ledsone.co.uk/collections/dc-12v-transformer;9.00;1
edison screw e27 lamp;2;590;14;https://ledsone.co.uk/collections/e27-base-bulb;9.00;1
b22 bulb;10;4400;13;https://ledsone.co.uk/collections/led-bulbs;22.00;1
e27 lamp base;3;170;13;https://ledsone.co.uk/collections/metal-holders;23.00;1
weight scale scale;12;4400;13;https://ledsone.co.uk/collections/weighing-scale;38.00;1
steampunk wall lights;1;170;13;https://ledsone.co.uk/products/vintage-industrial-water-pipe-lamp-retro-light-steampunk-wall-sconce-free-bulb;7.00;1
shower curtain mould proof;3;170;13;https://ledsone.co.uk/products/fabric-solid-color-shower-curtain-for-bathtub-shower-5288;20.00;1
hanging pendant lights plug in;2;170;13;https://ledsone.co.uk/collections/plugin-lighting;6.00;0
pendant light holder;1;170;13;https://ledsone.co.uk/collections/pendant-holder;9.00;1
rope hanging lamp;1;170;13;https://ledsone.co.uk/collections/hemp-rope-lighting;9.00;1
lamp shade holder ring;2;170;13;https://ledsone.co.uk/products/screw-e27-plain-holder-white-with-ring-bakelite-lamp-holder;7.00;1
covered electrical wire;3;390;13;https://ledsone.co.uk/collections/vintage-cables;9.00;1
light shade;26;8100;12;https://ledsone.co.uk/collections/lighting-shades;25.00;1
hanging from chains;7;480;11;https://ledsone.co.uk/collections/cord-grip-and-hanging-chains;23.00;1
fitting a pendant light;6;590;11;https://ledsone.co.uk/pages/pi;21.00;1
hanging pendant plug in light;2;140;11;https://ledsone.co.uk/collections/plugin-lighting;8.00;1
electrical cable connectors types;6;880;11;https://ledsone.co.uk/collections/wire-connectors;33.00;1
luxury bath accessories;7;480;11;https://ledsone.co.uk/collections/bath-set;15.00;1
ceiling rope lighting;2;170;11;https://ledsone.co.uk/collections/hemp-rope-lighting;7.00;1
decorative light bulbs bayonet fitting;3;140;11;https://ledsone.co.uk/collections/led-bulbs;12.00;1
light bulb bayonet;4;390;11;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;16.00;1
power adapter dc 12v;2;170;11;https://ledsone.co.uk/products/12v-10a-power-supply-adapter-transformer;21.00;1
2 core electrical cable;5;480;11;https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;9.00;1
spider hanging lights;1;90;11;https://ledsone.co.uk/collections/spider-light;10.00;1
bayonet led lamps;8;880;11;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;9.00;1
light with plug in;4;390;11;https://ledsone.co.uk/collections/plugin-lighting;7.00;0
chain for hanging plants;7;880;11;https://ledsone.co.uk/collections/cord-grip-and-hanging-chains;26.00;1
lampshade pendant lighting;14;2900;11;https://ledsone.co.uk/pages/lamp-shades-for-pendant-table-floor-lights;18.00;0
3 core wire;5;390;11;https://ledsone.co.uk/blogs/new/understanding-3-core-electrical-cables-types-uses-and-color-codes;12.00;1
e27 vintage light bulbs;2;90;11;https://ledsone.co.uk/collections/vintage-bulbs;0.0;1
ceiling light hooks;5;390;11;https://ledsone.co.uk/collections/hooks-and-rings;10.00;1
electrical connectors push fit;2;140;11;https://ledsone.co.uk/products/32a-spring-lever-push-fit-reusable-5-way-wire-connectors;7.00;1
rope lighting for ceiling;1;170;11;https://ledsone.co.uk/collections/hemp-rope-lighting;8.00;1
pendant spider light;2;90;11;https://ledsone.co.uk/collections/spider-light;5.00;0
light shade holder;2;140;11;https://ledsone.co.uk/products/screw-e27-plain-holder-white-with-ring-bakelite-lamp-holder;20.00;1
anti mould shower curtain;7;480;10;https://ledsone.co.uk/products/fabric-solid-color-shower-curtain-for-bathtub-shower-5288;22.00;1
bayonet fit led bulbs;8;480;10;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;11.00;1
connector with wire;11;3600;10;https://ledsone.co.uk/collections/wire-connectors-junction-box;35.00;1
zipper file folder;3;390;9;https://ledsone.co.uk/products/10-pack-plastic-thick-zipper-document-file-wateoof-folder-5284;27.00;1
240 volt 12 volt dc transformer;3;140;9;https://ledsone.co.uk/products/dc-12v-ip20-power-supply;21.00;1
pipework lights;2;110;9;https://ledsone.co.uk/collections/pipe-lighting;5.00;0
cartoon clipboard;2;140;9;https://ledsone.co.uk/products/4-pack-a4-cartoon-design-clipboard-with-ruler-scale-clipboard-5280;25.00;1
metal black lampshade;2;110;9;https://ledsone.co.uk/products/ledsone-industrial-vintage-32cm-black-pendant-retro-metal-lamp-shade-e27-uk-holder;16.00;1
slippers for bathing;2;260;9;https://ledsone.co.uk/products/home-slippers-men-women-non-slip-bathing-shower-sandals-5256;17.00;1
chrome light shade;2;140;9;https://ledsone.co.uk/products/modern-ceiling-pendant-light-shades-chrome-colour-lamp-shades-easy-fit;16.00;1
light shade cage;1;110;9;https://ledsone.co.uk/collections/wire-cage-pendant-light;0.0;1
240v to 12 volt converter;4;260;9;https://ledsone.co.uk/products/dc12v-80w-ip20-universal-regulated-switching-power-supply;22.00;1
conduit light fittings;2;110;9;https://ledsone.co.uk/collections/conduit-lighting;8.00;1
240v to 12v power supply;2;110;9;https://ledsone.co.uk/products/dc-12v-ip20-power-supply;17.00;1
plug in pendant light;9;1300;9;https://ledsone.co.uk/collections/plugin-lighting;11.00;1
vintage filament bulbs e27;2;110;9;https://ledsone.co.uk/collections/vintage-bulbs;10.00;1
hanging lamps with plug;6;390;9;https://ledsone.co.uk/collections/plugin-lighting;13.00;1
weighing machine scale;17;6600;9;https://ledsone.co.uk/collections/weighing-scale;34.00;1
hanging pendant plug in lights;2;140;9;https://ledsone.co.uk/collections/plugin-lighting;6.00;1
rope ceiling lights;2;140;9;https://ledsone.co.uk/collections/hemp-rope-lighting;9.00;1
light cage pendant;2;110;9;https://ledsone.co.uk/collections/wire-cage-pendant-light;5.00;1
plug in light fixture;2;110;9;https://ledsone.co.uk/collections/plugin-lighting;17.00;1
2 core wire;4;320;9;https://ledsone.co.uk/blogs/understanding-2-core-electrical-cable-the-essentials-1/understanding-2-core-electrical-cable-the-essentials;13.00;1
ceiling light bracket;7;480;9;https://ledsone.co.uk/collections/ceiling-rose-brackets;18.00;1
12v led light transformer;3;210;9;https://ledsone.co.uk/collections/dc-12v-transformer;15.00;1
e27 bulb base;2;260;9;https://ledsone.co.uk/collections/metal-holders;24.00;1
3 pendant light;8;480;9;https://ledsone.co.uk/collections/three-outlet-lighting;16.00;1
e27 filament light bulb;5;320;9;https://ledsone.co.uk/collections/e27-base-bulb;9.00;1
plug for light bulb;4;260;9;https://ledsone.co.uk/products/vintage-industrial-lamp-light-bulb-copper-holder-e27-light-socket;28.00;1
12 volt transformer;2;210;9;https://ledsone.co.uk/collections/dc-12v-transformer;12.00;1
light in a cage;2;110;9;https://ledsone.co.uk/collections/wire-cage-pendant-light;8.00;1
outdoor chandelier;7;480;9;https://ledsone.co.uk/products/6-light-crystal-chandelier-light-adjustable-farmhouse-candle-ceiling-pendant-fixture-e14-base-hanging-light;9.00;1
240v to 12v converter;2;390;9;https://ledsone.co.uk/products/dc12v-80w-ip20-universal-regulated-switching-power-supply;21.00;1
pounder stone;29;12100;8;https://ledsone.co.uk/products/pestle-and-mortar-marble-set-spice-herb-crusher-grinder-paste-grinding;30.00;1
dc 5v;5;390;8;https://ledsone.co.uk/collections/dc-5v-transformer;16.00;1
e27 led bulb;24;5400;8;https://ledsone.co.uk/collections/e27-base-bulb;12.00;1
lights that plug in;12;1600;8;https://ledsone.co.uk/collections/plugin-lighting;10.00;1
vintage glass light shades;8;390;8;https://ledsone.co.uk/collections/lampshades;6.00;1
sconce;25;5400;8;https://ledsone.co.uk/collections/wall-light;32.00;1
bayonet bulb sizes;6;390;8;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;19.00;1
240v to12v transformer;6;390;8;https://ledsone.co.uk/products/dc-12v-ip20-power-supply;9.00;1
e27 bulb led filament;4;170;7;https://ledsone.co.uk/collections/e27-base-bulb;6.00;1
cage lamp pendant;2;110;7;https://ledsone.co.uk/collections/wire-cage-pendant-light;7.00;1
vintage light bulbs e27;5;170;7;https://ledsone.co.uk/collections/vintage-bulbs;6.00;1
ceiling hooks for lamps;5;320;7;https://ledsone.co.uk/collections/hooks-and-rings/hooks-and-rings;9.00;1
caged lamp shade;3;110;7;https://ledsone.co.uk/collections/wire-cage;8.00;1
d.c 5v;3;210;7;https://ledsone.co.uk/collections/dc-5v-transformer;14.00;0
types of electrical cable connectors;5;390;7;https://ledsone.co.uk/collections/wire-connectors;23.00;1
retro e27 bulb;2;90;7;https://ledsone.co.uk/collections/vintage-bulbs;8.00;1
12 volt dc transformer;2;170;7;https://ledsone.co.uk/collections/dc-12v-transformer;8.00;1
rope ceiling light;3;210;7;https://ledsone.co.uk/collections/hemp-collection;9.00;1
ceiling lamp with switch;2;110;7;https://ledsone.co.uk/products/ceiling-rose-with-toggle-switch-on-off-ceiling-lights;20.00;1
bayonet cap lamps;12;2400;7;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;8.00;1
sbled light bulb;13;1900;7;https://ledsone.co.uk/collections/led-bulbs;22.00;1
vintage led bulbs;5;260;7;https://ledsone.co.uk/collections/led-bulbs;13.00;1
pipe lamp;2;90;7;https://ledsone.co.uk/collections/pipe-lighting;8.00;1
b22 bayonet bulb;6;320;7;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;15.00;1
waterproof cable connector;9;1000;7;https://ledsone.co.uk/products/longlife-waterproof-electrical-junction-box-cable-connector-wire-ip68-outdoor-uk;9.00;1
bulb receptacle;3;1000;7;https://ledsone.co.uk/products/vintage-industrial-lamp-light-bulb-copper-holder-e27-light-socket;22.00;1
dry erase board;5;320;7;https://ledsone.co.uk/collections/white-board;9.00;0
decorative light bulbs bayonet;3;110;7;https://ledsone.co.uk/collections/led-bulbs;9.00;1
socket with holder;4;320;7;https://ledsone.co.uk/products/3-pack-e14-bulb-holder-edison-small-screw-ses-black-plastic-lamp-holder-4364;25.00;1
hanging pendant light with plug;2;110;7;https://ledsone.co.uk/collections/plugin-lighting;6.00;1
pendant lamps plug in;2;110;7;https://ledsone.co.uk/collections/plugin-lighting;9.00;1
ceiling bracket light;4;210;7;https://ledsone.co.uk/collections/ceiling-rose-brackets;28.00;1
light bracket;4;260;7;https://ledsone.co.uk/collections/ceiling-rose-brackets;9.00;1
cage for pendant light;3;110;7;https://ledsone.co.uk/collections/wire-cage-pendant-light;4.00;1
red ceiling light;6;320;7;https://ledsone.co.uk/products/red-pendant-light-lampshade-ceiling-light-shade-with-bulb;17.00;1
pendant light that plugs in;5;320;7;https://ledsone.co.uk/collections/plugin-lighting;9.00;0
rose fitting;3;320;7;https://ledsone.co.uk/collections/single-outlet-ceiling-rose;9.00;1
12v ac adapter;6;320;7;https://ledsone.co.uk/products/240v-to-12v-power-supply-universal-adapter;23.00;1
bulb size e27;3;260;7;https://ledsone.co.uk/collections/e27-base-bulb;18.00;1
light bulbs bayonet;6;320;7;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;15.00;1
rope lights;15;2400;7;https://ledsone.co.uk/collections/hemp-rope-lighting;14.00;1
screw holder bulb;2;170;7;https://ledsone.co.uk/collections/metal-holders;14.00;1
vintage retro lampshades;4;210;7;https://ledsone.co.uk/collections/lampshades/vintage-lighting;17.00;1
bulb shade holder;4;210;7;https://ledsone.co.uk/products/screw-e27-plain-holder-white-with-ring-bakelite-lamp-holder;8.00;1
chrome lampshade;2;210;7;https://ledsone.co.uk/products/modern-ceiling-pendant-light-shades-chrome-colour-lamp-shades-easy-fit;20.00;1
light bulb socket e27;3;170;7;https://ledsone.co.uk/collections/metal-holders;8.00;1
pendant lamp hook;3;110;7;https://ledsone.co.uk/products/pendant-light-cable-hook-cord-clip-cable-ceiling-or-wall-mounted-4433;9.00;1
e27 retro bulb;4;170;7;https://ledsone.co.uk/collections/vintage-bulbs;8.00;1
ceiling rope lights;3;170;7;https://ledsone.co.uk/collections/hemp-rope-lighting;17.00;1
led globe b22;5;320;7;https://ledsone.co.uk/collections/b22-led-bulbs;9.00;0
light cage shade;2;170;7;https://ledsone.co.uk/collections/wire-cage-pendant-light;6.00;1
bracket ceiling light;8;320;7;https://ledsone.co.uk/collections/ceiling-rose-brackets;22.00;1
cage pendant light fixture;2;110;7;https://ledsone.co.uk/collections/wire-cage-pendant-light;4.00;1
bayonet mount led bulb;9;720;6;https://ledsone.co.uk/blogs/new/b22-bayonet-bulbs-explained-your-essential-led-buying-guide;10.00;0
e27 light bulb socket;5;210;6;https://ledsone.co.uk/collections/metal-holders;21.00;1
holder socket;6;320;6;https://ledsone.co.uk/collections/metal-holders;12.00;1
types of light fixtures;3;140;6;https://ledsone.co.uk/blogs/new/types-of-lamp-fixtures;14.00;1`;

const LEDHUT_RAW = `keyword;position;volume;traffic;url;kd;intent
led bulbs;1;5400;1339;https://ledhut.co.uk/collections/led-light-bulbs;30.00;1
light bulbs;3;12100;786;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;27.00;1
gu10 led lights;1;2900;719;https://ledhut.co.uk/collections/gu10-led-bulbs;15.00;0
gu10 led bulbs;1;5400;712;https://ledhut.co.uk/collections/gu10-led-bulbs;14.00;1
bulb;1;8100;664;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;38.00;1
led lights;8;33100;628;https://ledhut.co.uk/;31.00;1
gu10 bulbs;1;4400;580;https://ledhut.co.uk/collections/gu10-led-bulbs;19.00;1
light bulbs led bulbs;1;4400;580;https://ledhut.co.uk/collections/led-light-bulbs;28.00;1
led bulb led lighting;1;3600;475;https://ledhut.co.uk/collections/led-light-bulbs;33.00;1
e27 led lamp bulb;1;3600;475;https://ledhut.co.uk/collections/e27-led-bulbs-es;17.00;1
led spotlights;2;3600;475;https://ledhut.co.uk/collections/led-spotlights;15.00;1
led hut;1;590;472;https://ledhut.co.uk/;49.00;2
led lights and bulbs;1;1900;471;https://ledhut.co.uk/collections/led-light-bulbs;34.00;1
led light bulbs;1;5400;442;https://ledhut.co.uk/collections/led-light-bulbs;32.00;1
light bulb;3;12100;423;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;28.00;3
led bulb;1;2900;382;https://ledhut.co.uk/collections/led-light-bulbs;28.00;1
led light light bulbs;1;2900;382;https://ledhut.co.uk/collections/led-light-bulbs;23.00;1
dimmable light bulbs;2;2900;382;https://ledhut.co.uk/collections/dimmable-led-bulbs;28.00;1
gu10 bulb;2;8100;356;https://ledhut.co.uk/collections/gu10-led-bulbs;15.00;1
gu10 light bulb;1;2400;316;https://ledhut.co.uk/collections/gu10-led-bulbs;23.00;1
ledhut;1;390;312;https://ledhut.co.uk/;50.00;2
flood light flood light;1;3600;295;https://ledhut.co.uk/collections/led-flood-lights;10.00;1
bulbs with led;1;3600;295;https://ledhut.co.uk/collections/led-light-bulbs;34.00;1
led bulb bulb;1;3600;295;https://ledhut.co.uk/collections/led-light-bulbs;25.00;1
light with bulb;4;12100;290;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;16.00;1
gu10;1;4400;286;https://ledhut.co.uk/collections/gu10-led-bulbs;25.00;1
flood light lights;2;4400;286;https://ledhut.co.uk/collections/led-flood-lights;20.00;1
g9 led bulb;8;12100;266;https://ledhut.co.uk/collections/led-light-bulbs/g9;13.00;1
light bulb fittings;1;1000;248;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;15.00;1
led bulbs uk;1;1000;248;https://ledhut.co.uk/collections/led-light-bulbs;26.00;1
led flood light;1;1000;248;https://ledhut.co.uk/collections/led-flood-lights;11.00;1
led e27 led;1;2900;237;https://ledhut.co.uk/collections/e27-led-bulbs-es;11.00;1
flood lights;2;2900;237;https://ledhut.co.uk/collections/led-flood-lights;12.00;1
led light bulbs uk;1;880;218;https://ledhut.co.uk/collections/led-light-bulbs;19.00;1
l e d spot light;2;1600;211;https://ledhut.co.uk/collections/led-spotlights;9.00;1
led flood lights;1;2400;196;https://ledhut.co.uk/collections/led-flood-lights;20.00;1
led lamp bulb;1;2400;196;https://ledhut.co.uk/collections/led-light-bulbs;33.00;1
led bulb led;1;2400;196;https://ledhut.co.uk/collections/led-light-bulbs;22.00;1
spotlights;6;8100;194;https://ledhut.co.uk/collections/led-spotlights;20.00;1
led bulb and;1;2900;188;https://ledhut.co.uk/collections/led-light-bulbs;34.00;1
gu10 led bulb;3;2900;188;https://ledhut.co.uk/collections/gu10-led-bulbs;20.00;1
commercial led lighting;1;720;178;https://ledhut.co.uk/collections/commercial-led-lighting;11.00;0
led floodlights;1;720;178;https://ledhut.co.uk/collections/led-flood-lights;20.00;1
led dimmer light bulbs;1;720;178;https://ledhut.co.uk/collections/dimmable-led-bulbs;21.00;0
gu10 led light bulbs;1;720;178;https://ledhut.co.uk/collections/gu10-led-bulbs;21.00;0
led bayonet lamps;1;720;178;https://ledhut.co.uk/collections/b22-led-bulbs-bayonet;9.00;1
led for flood light;1;1300;171;https://ledhut.co.uk/collections/led-flood-lights;15.00;1
gu10 led;1;1300;171;https://ledhut.co.uk/collections/gu10-led-bulbs;10.00;1
gu10 light bulbs;2;1300;171;https://ledhut.co.uk/collections/gu10-led-bulbs;17.00;1
dimmable led bulbs;1;1300;171;https://ledhut.co.uk/collections/dimmable-led-bulbs;19.00;1
e27 led bulb;4;5400;162;https://ledhut.co.uk/collections/e27-led-bulbs-es;12.00;1
e14 led light;4;3600;158;https://ledhut.co.uk/collections/e14-led-bulbs-ses;12.00;1
led lamp light bulb;1;3600;158;https://ledhut.co.uk/collections/led-light-bulbs;33.00;1
led downlight led;3;3600;158;https://ledhut.co.uk/collections/led-downlights;16.00;1
e27;2;2400;156;https://ledhut.co.uk/collections/e27-led-bulbs-es;14.00;1
e27 bulbs;2;1900;155;https://ledhut.co.uk/collections/e27-led-bulbs-es;16.00;1
led gu10 bulb;1;590;146;https://ledhut.co.uk/collections/gu10-led-bulbs;13.00;1
light bulbs led uk;1;590;146;https://ledhut.co.uk/collections/led-light-bulbs;23.00;1
led gu10;1;590;146;https://ledhut.co.uk/collections/gu10-led-bulbs;17.00;1
dimmable led light bulbs;1;590;146;https://ledhut.co.uk/collections/dimmable-led-bulbs;21.00;1
led flood lights outdoor;1;590;146;https://ledhut.co.uk/collections/led-flood-lights;20.00;1
dimmer led bulbs;1;590;146;https://ledhut.co.uk/collections/dimmable-led-bulbs;18.00;1
spot lights;8;6600;145;https://ledhut.co.uk/collections/led-spotlights;30.00;1
led flood light led;1;1000;132;https://ledhut.co.uk/collections/led-flood-lights;19.00;1
led gu10 bulbs;2;1000;132;https://ledhut.co.uk/collections/gu10-led-bulbs;30.00;1
led floodlight;1;1000;132;https://ledhut.co.uk/collections/led-flood-lights;11.00;1
e27 light bulbs led;1;1000;132;https://ledhut.co.uk/collections/e27-led-bulbs-es;10.00;1
edison screw bulb;2;1600;131;https://ledhut.co.uk/collections/e27-led-bulbs-es;23.00;1
cu10 led bulbs;4;2900;127;https://ledhut.co.uk/collections/dimmable-led-bulbs/gu10;18.00;1
e27 light bulb;3;2900;127;https://ledhut.co.uk/collections/e27-led-bulbs-es;22.00;1
downlight led lamp;4;3600;126;https://ledhut.co.uk/collections/led-downlights;16.00;1
spotlights with led;5;3600;126;https://ledhut.co.uk/collections/led-spotlights;13.00;1
e27 bulb;7;18100;126;https://ledhut.co.uk/collections/e27-led-bulbs-es;16.00;1
led bulba;1;480;119;https://ledhut.co.uk/collections/led-light-bulbs;28.00;0
e27 bulb led warm white;1;480;119;https://ledhut.co.uk/collections/e27-led-bulbs-es;9.00;1
light bulb led;1;480;119;https://ledhut.co.uk/collections/led-light-bulbs;27.00;1
outdoor led flood lights;1;480;119;https://ledhut.co.uk/collections/led-flood-lights;20.00;1
e27 filament bulb;1;480;119;https://ledhut.co.uk/collections/e27-led-filament-bulbs-es;10.00;1
led spot lights;2;880;116;https://ledhut.co.uk/collections/led-spotlights;9.00;1
christmas lights 1000 warm white;1;880;116;https://ledhut.co.uk/products/treebright-1000-led-christmas-tree-lights-with-timer-25m-white-warm-white;9.00;1
led lightbulbs;1;880;116;https://ledhut.co.uk/collections/led-light-bulbs;30.00;1
e27 light bulbs;1;880;116;https://ledhut.co.uk/collections/e27-led-bulbs-es;21.00;1
led gu10 led bulbs;2;1300;106;https://ledhut.co.uk/collections/gu10-led-bulbs;8.00;1
light bulbs dimming;2;2400;105;https://ledhut.co.uk/collections/dimmable-led-bulbs;22.00;1
ledowe;7;14800;103;https://ledhut.co.uk/collections/led-light-bulbs;39.00;1
led equivalent of 60w;1;390;96;https://ledhut.co.uk/blogs/news/led-equivalent-wattages-against-traditional-lighting;15.00;1
led lamps for downlights;7;4400;96;https://ledhut.co.uk/collections/led-downlights;17.00;1
led dimmable bulbs;1;390;96;https://ledhut.co.uk/collections/dimmable-led-bulbs;25.00;1
e27 es bulb;1;720;95;https://ledhut.co.uk/collections/e27-led-bulbs-es;10.00;1
gu10 a led;1;720;95;https://ledhut.co.uk/collections/gu10-led-bulbs;10.00;1
led;9;18100;90;https://ledhut.co.uk/collections/led-light-bulbs;41.00;1
led in bulb;2;3600;86;https://ledhut.co.uk/collections/shop-led-bulbs-by-fitting;17.00;1
g9 led light bulb;6;3600;86;https://ledhut.co.uk/collections/led-light-bulbs/g9;19.00;1
e14 led light globes;7;3600;86;https://ledhut.co.uk/collections/e14-led-bulbs-ses;20.00;1
led downlights;7;4400;83;https://ledhut.co.uk/collections/led-downlights;22.00;1
bulbs dimmable;3;1900;83;https://ledhut.co.uk/collections/dimmable-led-bulbs;18.00;1
led light fittings;3;1000;82;https://ledhut.co.uk/collections/light-fittings-fixtures;19.00;1
60 watt equivalent in led;1;320;79;https://ledhut.co.uk/blogs/news/led-equivalent-wattages-against-traditional-lighting;9.00;1
led replacement bulbs;1;320;79;https://ledhut.co.uk/collections/led-light-bulbs;31.00;1`;

const LIGHTINGCOMPANY_RAW = `keyword;position;volume;traffic;url;kd;intent
light fittings;2;12100;1597;https://www.lightingcompany.co.uk/ceiling-lights-c3;43.00;1
the lighting company;1;1300;1040;https://www.lightingcompany.co.uk/;52.00;2
best reading lamps;8;33100;728;https://www.lightingcompany.co.uk/table-floor-lamps-c5/reading-craft-lights-c38;22.00;0
the lighting company minehead;1;880;704;https://www.lightingcompany.co.uk/;26.00;1
lighting uk ceiling;1;2400;595;https://www.lightingcompany.co.uk/ceiling-lights-c3;22.00;1
lighting company;1;720;576;https://www.lightingcompany.co.uk/;72.00;0
the lighting company uk;1;720;576;https://www.lightingcompany.co.uk/;34.00;2
table light shades;2;3600;475;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;17.00;1
chandelier in a bedroom;1;1900;471;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;11.00;1
chandelier light;3;6600;429;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18;19.00;0
chandelier in the bedroom;1;1600;396;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;11.00;1
light fixtures;2;2900;382;https://www.lightingcompany.co.uk/ceiling-lights-c3;39.00;1
households outdoor lights advice;1;4400;360;https://www.lightingcompany.co.uk/blog/the-definitive-guide-to-outdoor-lights/;23.00;1
light fitting;2;4400;360;https://www.lightingcompany.co.uk/ceiling-lights-c3;33.00;1
ceiling light shades;3;5400;351;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33;26.00;1
light fixture;1;1300;322;https://www.lightingcompany.co.uk/ceiling-lights-c3;40.00;1
cream lampshade;1;1300;322;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120/cream-and-ivory-t209;13.00;1
chandeliers in the bedroom;1;2400;316;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;11.00;1
lights and bulb;2;4400;286;https://www.lightingcompany.co.uk/light-bulbs-c95;24.00;0
bathroom mirror lights;2;1900;250;https://www.lightingcompany.co.uk/bathroom-lights-c1/mirror-lights-c87;15.00;1
lighting fixtures;2;1900;250;https://www.lightingcompany.co.uk/ceiling-lights-c3;34.00;1
floor lamp shades;2;1900;250;https://www.lightingcompany.co.uk/table-floor-lamps-c5/floor-lamp-shades-c323;13.00;1
bathroom chandeliers;1;1000;248;https://www.lightingcompany.co.uk/bathroom-lights-c1/bathroom-chandeliers-ip44-c75;13.00;0
light fitting ceiling;2;3600;234;https://www.lightingcompany.co.uk/ceiling-lights-c3;32.00;0
floor lamp with gold;2;3600;234;https://www.lightingcompany.co.uk/table-floor-lamps-c5/gold-antique-gold-t46;13.00;1
ceiling lights uk;4;3600;234;https://www.lightingcompany.co.uk/ceiling-lights-c3;19.00;1
wall light;8;12100;229;https://www.lightingcompany.co.uk/wall-lights-c15;27.00;1
light fixtures for a bathroom;1;1600;211;https://www.lightingcompany.co.uk/bathroom-lights-c1;22.00;1
blue table lamp;1;1600;211;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamps-c127/blue-t73;11.00;1
lighting light fixture;2;2400;196;https://www.lightingcompany.co.uk/ceiling-lights-c3;30.00;1
chandeliers for sale;1;720;178;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18;22.00;3
ceiling light fixtures uk;2;1300;171;https://www.lightingcompany.co.uk/ceiling-lights-c3;22.00;1
lighting company uk;1;210;168;https://www.lightingcompany.co.uk/;69.00;0
lighting and sconces;3;2400;156;https://www.lightingcompany.co.uk/wall-lights-c15;22.00;1
glass bulb shades;4;2400;156;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;12.00;1
antique brass ceiling lights;4;2400;156;https://www.lightingcompany.co.uk/ceiling-lights-c3/brass-antique-aged-brass-t21;16.00;0
kitchen with pendant lighting;4;2400;156;https://www.lightingcompany.co.uk/ceiling-lights-c3/pendant-lights-c8;12.00;1
ceiling lights united kingdom;3;2400;156;https://www.lightingcompany.co.uk/ceiling-lights-c3;23.00;1
rustic ceiling lights;1;590;146;https://www.lightingcompany.co.uk/ceiling-lights-c3/rustic-lighting-c29;9.00;1
touch table lamps for bedroom;1;590;146;https://www.lightingcompany.co.uk/table-floor-lamps-c5/touch-lamps-c126;12.00;0
lamp shades table lamps uk;1;590;146;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;13.00;0
living room pendant light;1;590;146;https://www.lightingcompany.co.uk/ceiling-lights-c3/pendant-lights-c8/lounge-and-living-room-lights-t125;12.00;1
bathroom lights over mirror;1;590;146;https://www.lightingcompany.co.uk/bathroom-lights-c1/mirror-lights-c87;16.00;1
over mirror bathroom light;1;590;146;https://www.lightingcompany.co.uk/bathroom-lights-c1/mirror-lights-c87;16.00;1
thelightingcompany;1;170;136;https://www.lightingcompany.co.uk/;35.00;2
waterproof bathroom ceiling lights;2;1000;132;https://www.lightingcompany.co.uk/bathroom-lights-c1/modern-bathroom-lighting-c2;16.00;0
crystalline lamp;1;1000;132;https://www.lightingcompany.co.uk/table-floor-lamps-c5/crystal-t1;9.00;1
large ceiling lights;2;1000;132;https://www.lightingcompany.co.uk/ceiling-lights-c3/extra-large-and-oversized-ceiling-lights-c125;17.00;0
green ceiling light;2;1000;132;https://www.lightingcompany.co.uk/ceiling-lights-c3/green-and-verdigris-t33;12.00;0
chrome ceiling lights;2;1000;132;https://www.lightingcompany.co.uk/ceiling-lights-c3/chrome-t45;13.00;0
chandelier crystal chandeliers;2;1600;131;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/crystal-t1;16.00;0
lamp shades for table;8;5400;129;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;17.00;1
table lamp shades;7;5400;129;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;22.00;1
lampshade lamp;7;5400;129;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;34.00;3
lampshade pendant lighting;3;2900;127;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33;18.00;0
lighting shop;4;2900;127;https://www.lightingcompany.co.uk/;67.00;0
table lamps for living room;7;6600;125;https://www.lightingcompany.co.uk/table-floor-lamps-c5/modern-table-lamps-c25/lounge-and-living-room-lights-t125;20.00;1
wall light fixture with switch;2;1900;123;https://www.lightingcompany.co.uk/wall-lights-c15/switched-wall-lights-c189;11.00;1
table lighting uk;3;1900;123;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamps-c127;16.00;1
british table lamps;4;1900;123;https://www.lightingcompany.co.uk/table-floor-lamps-c5/british-made-in-uk-lighting-t23;9.00;0
green table lamp;2;1900;123;https://www.lightingcompany.co.uk/table-floor-lamps-c5/green-and-verdigris-t33;14.00;1
lights for the mirror;1;1900;123;https://www.lightingcompany.co.uk/bathroom-lights-c1/mirror-lights-c87;12.00;1
bedroom chandelier;3;1900;123;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;14.00;1
bedroom chandeliers;1;480;119;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/bedroom-lights-guest-room-and-hotel-bedroom-lights-t127;8.00;0
victorian wall lights;1;480;119;https://www.lightingcompany.co.uk/wall-lights-c15/period-wall-lights-c45;9.00;1
chandelier sale;1;480;119;https://www.lightingcompany.co.uk/sale/ceiling-lights-c3/chandeliers-c18/crystal-t1;22.00;3
table lampshades for living room;1;480;119;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120/lounge-and-living-room-lights-t125;7.00;1
ceiling light sloped ceiling;1;480;119;https://www.lightingcompany.co.uk/ceiling-lights-c3/sloping-ceiling-lights-c209;5.00;1
restaurant lighting;1;480;119;https://www.lightingcompany.co.uk/hospitality-leisure-c94/restaurant-lighting-c114;12.00;1
victorian chandelier;1;480;119;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/victorian-edwardian-lights-t22;11.00;1
art deco light shades;1;480;119;https://www.lightingcompany.co.uk/art-nouveau-art-deco-lighting-t32;7.00;1
lamp shades for lamps;9;5400;118;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120;22.00;1
glass ceiling lamp shades;1;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;14.00;0
large chandeliers;2;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/large-chandeliers-60cm-and-over-in-diameter-c273;13.00;1
bulbs screw in;2;880;116;https://www.lightingcompany.co.uk/light-bulbs-c95/edison-screw-es-e27-c140;15.00;1
glass lamp shade;2;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;11.00;1
copper ceiling light;2;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/copper-t77;16.00;1
small chandelier;1;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/small-chandeliers-less-than-40cm-diameter-c271;12.00;0
white light shade ceiling;1;880;116;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/white-t41;22.00;0
brass spotlights;1;880;116;https://www.lightingcompany.co.uk/spot-lights-c21/brass-antique-aged-brass-t21;9.00;1
bathroom lights uk;2;880;116;https://www.lightingcompany.co.uk/bathroom-lights-c1;25.00;1
the lighting co;1;140;112;https://www.lightingcompany.co.uk/;66.00;2
the lighting company taunton;1;140;112;https://www.lightingcompany.co.uk/;24.00;1
black wall lights;5;3600;108;https://www.lightingcompany.co.uk/wall-lights-c15/switched-wall-lights-c189/black-t18;9.00;0
cream lamp shades;2;1300;106;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120/cream-and-ivory-t209;21.00;0
ceiling light big;1;1300;106;https://www.lightingcompany.co.uk/ceiling-lights-c3/extra-large-and-oversized-ceiling-lights-c125;20.00;1
lighting shop near me;2;1300;106;https://www.lightingcompany.co.uk/;56.00;3
contemporary modern ceiling lights;3;1300;106;https://www.lightingcompany.co.uk/ceiling-lights-c3/modern-ceiling-lighting-c7;15.00;1
ceiling lamp big;2;1300;106;https://www.lightingcompany.co.uk/ceiling-lights-c3/extra-large-and-oversized-ceiling-lights-c125;22.00;1
gold pendant light fixture;2;1300;106;https://www.lightingcompany.co.uk/ceiling-lights-c3/pendant-lights-c8/gold-antique-gold-t46;8.00;0
glass light shades;4;2400;105;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;21.00;1
dining room ceiling lights;3;1600;104;https://www.lightingcompany.co.uk/ceiling-lights-c3/modern-ceiling-lighting-c7/dining-room-lighting-t126;12.00;0
lamp shades for floor lamps;4;1600;104;https://www.lightingcompany.co.uk/table-floor-lamps-c5/floor-lamp-shades-c323;9.00;0
lightening bulb;1;1600;104;https://www.lightingcompany.co.uk/light-bulbs-c95;16.00;1
bathroom light fittings;9;5400;102;https://www.lightingcompany.co.uk/bathroom-lights-c1;27.00;1
glass lamp shades;4;2900;101;https://www.lightingcompany.co.uk/ceiling-lights-c3/easy-fit-ceiling-lights-and-shades-c33/glass-t20;10.00;0
chandeliers in gold;2;2900;101;https://www.lightingcompany.co.uk/ceiling-lights-c3/chandeliers-c18/gold-antique-gold-t46;9.00;1
designer lighting uk;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/designer-lighting-for-ceilings-c4;26.00;0
slope ceiling light fixture;1;390;96;https://www.lightingcompany.co.uk/ceiling-lights-c3/sloping-ceiling-lights-c209;14.00;0
cream lamp shades for table lamps;1;390;96;https://www.lightingcompany.co.uk/table-floor-lamps-c5/table-lamp-shades-c120/cream-and-ivory-t209;18.00;1`;

const INDUSTVILLE_RAW = `keyword;position;volume;traffic;url;kd;intent
industville;1;3600;2880;https://www.industville.co.uk/;28.00;2
industville lighting;1;1300;1040;https://www.industville.co.uk/;22.00;2
industville uk;1;1300;1040;https://www.industville.co.uk/;21.00;2
industville lighting uk;1;1300;1040;https://www.industville.co.uk/;22.00;2
bar in lights;1;1900;471;https://www.industville.co.uk/collections/restaurant-bar-and-coffee-shop-lighting;11.00;1
industrial wall lights;1;1300;322;https://www.industville.co.uk/collections/wall-lights;9.00;0
kitchen with pendant lighting;2;2400;316;https://www.industville.co.uk/collections/kitchen-island-lighting;12.00;1
kitchen pendant lighting;1;2400;316;https://www.industville.co.uk/collections/kitchen-island-lighting;11.00;0
industriville;1;390;312;https://www.industville.co.uk/;27.00;2
industville lights;1;390;312;https://www.industville.co.uk/collections/ceiling-lights;22.00;2
kitchen pendant lights island;2;3600;295;https://www.industville.co.uk/collections/kitchen-island-lighting;9.00;1
kitchen island lighting;2;3600;295;https://www.industville.co.uk/collections/kitchen-island-lighting;15.00;0
lights for the kitchen island;2;3600;295;https://www.industville.co.uk/collections/kitchen-island-lighting;16.00;1
industiville;1;320;256;https://www.industville.co.uk/;28.00;2
industrville;1;320;256;https://www.industville.co.uk/;34.00;2
industrial ceiling lights;1;1000;248;https://www.industville.co.uk/collections/ceiling-lights;9.00;0
pendant lights in the kitchen;2;3600;234;https://www.industville.co.uk/collections/kitchen-island-lighting;17.00;1
bulkhead light;2;3600;234;https://www.industville.co.uk/collections/bulkhead-lights;16.00;1
industville wall lights;1;260;208;https://www.industville.co.uk/collections/wall-lights;19.00;2
outside bulkhead lights;1;720;178;https://www.industville.co.uk/collections/bulkhead-lights;13.00;0
industrial pendant lighting;1;720;178;https://www.industville.co.uk/collections/ceiling-lights;8.00;1
large pendant lighting;1;720;178;https://www.industville.co.uk/collections/large-decorative-lights;9.00;0
edison with bulb;1;1300;171;https://www.industville.co.uk/collections/led-decorative-light-bulbs;17.00;1
vintage light wall;1;1300;171;https://www.industville.co.uk/collections/wall-lights;9.00;1
hallway light;3;2400;156;https://www.industville.co.uk/collections/hallway-lights;15.00;1
kitchen pendant light;1;590;146;https://www.industville.co.uk/collections/kitchen-island-lighting;15.00;1
industrial lighting wall lights;1;590;146;https://www.industville.co.uk/collections/wall-lights;13.00;1
retro filament bulbs;2;1000;132;https://www.industville.co.uk/collections/led-decorative-light-bulbs;12.00;1
hanging kitchen lights;2;1000;132;https://www.industville.co.uk/collections/kitchen-island-lighting;21.00;0
vintage light bulbs;2;1000;132;https://www.industville.co.uk/collections/led-decorative-light-bulbs;9.00;1
giant ceiling light;1;1000;132;https://www.industville.co.uk/collections/large-decorative-lights;11.00;0
ceiling industrial lamp;1;1000;132;https://www.industville.co.uk/collections/ceiling-lights;9.00;1
contemporary wall lights;3;1600;131;https://www.industville.co.uk/collections/wall-lights;9.00;0
glass ceiling light;2;1600;131;https://www.industville.co.uk/collections/glass-lights;10.00;1
bedroom lighting ideas;5;2900;127;https://www.industville.co.uk/collections/bedroom-lights;16.00;1
large pendant light;1;480;119;https://www.industville.co.uk/collections/large-decorative-lights;8.00;1
bar lighting;1;480;119;https://www.industville.co.uk/collections/restaurant-bar-and-coffee-shop-lighting;10.00;1
edison light bulb;1;880;116;https://www.industville.co.uk/collections/led-decorative-light-bulbs;16.00;1
wall lights vintage;1;880;116;https://www.industville.co.uk/collections/wall-lights;8.00;1
edison bulb;1;1300;106;https://www.industville.co.uk/collections/led-decorative-light-bulbs;16.00;1
bulkhead lights;2;1300;106;https://www.industville.co.uk/collections/bulkhead-lights;17.00;1
hanging kitchen island lighting;3;2400;105;https://www.industville.co.uk/collections/kitchen-island-lighting;12.00;1
hall lights;4;1600;104;https://www.industville.co.uk/collections/hallway-lights;16.00;0
kitchen pendant lights;4;1600;104;https://www.industville.co.uk/collections/kitchen-island-lighting;19.00;0
industrial ceiling light;1;390;96;https://www.industville.co.uk/collections/ceiling-lights;8.00;0
edison light bulb lighting;1;390;96;https://www.industville.co.uk/collections/led-decorative-light-bulbs;16.00;1
glass lights;1;390;96;https://www.industville.co.uk/collections/glass-lights;9.00;1
pendant kitchen lights;2;720;95;https://www.industville.co.uk/collections/kitchen-island-lighting;17.00;0
bulkhead lights outdoor;1;720;95;https://www.industville.co.uk/collections/bulkhead-lights;14.00;1
industvile;1;110;88;https://www.industville.co.uk/;23.00;2
lighting ideas for the bedroom;5;2900;87;https://www.industville.co.uk/collections/bedroom-lights;23.00;1
brass light fittings;3;1300;84;https://www.industville.co.uk/collections/brass-lights;9.00;0
waterproof bathroom ceiling lights;3;1000;82;https://www.industville.co.uk/collections/bathroom-lights;16.00;0
metal lamp shades;3;1000;82;https://www.industville.co.uk/collections/lighting-shades-and-lampshades;20.00;1
bulb holder with bulb;1;1000;82;https://www.industville.co.uk/collections/light-bulb-holders;13.00;1
glass ceiling lights;2;1000;82;https://www.industville.co.uk/collections/glass-lights;10.00;0
hanging kitchen lights pendant;2;1000;82;https://www.industville.co.uk/collections/kitchen-island-lighting;16.00;1
wall industrial lights;2;1000;82;https://www.industville.co.uk/collections/wall-lights;9.00;1
edison e27 bulb;1;320;79;https://www.industville.co.uk/collections/led-decorative-light-bulbs;15.00;1
e27 edison bulb;1;320;79;https://www.industville.co.uk/collections/led-decorative-light-bulbs;16.00;1
bulkhead outdoor lights;1;320;79;https://www.industville.co.uk/collections/bulkhead-lights;16.00;0
cottage ceiling light;1;320;79;https://www.industville.co.uk/collections/cottage-ceiling-lights-wall-sconces;7.00;1
massive pendant light;1;320;79;https://www.industville.co.uk/collections/large-decorative-lights;8.00;0
brass lights;2;590;77;https://www.industville.co.uk/collections/brass-lights;16.00;1
kitchen pendant light fixtures;2;590;77;https://www.industville.co.uk/collections/kitchen-island-lighting;8.00;0
outdoor bulkhead lights;1;590;77;https://www.industville.co.uk/collections/bulkhead-lights;16.00;1
industville rugs;1;90;72;https://www.industville.co.uk/collections/homeware;20.00;1
brass metal pendant light;2;880;72;https://www.industville.co.uk/collections/metal-decorative-lights;9.00;1
outdoor bulkhead light;2;880;72;https://www.industville.co.uk/collections/bulkhead-lights;16.00;1
contemporary lounge lights;3;1000;65;https://www.industville.co.uk/collections/living-room-lights;16.00;1
bulk head light;3;1000;65;https://www.industville.co.uk/collections/bulkhead-lights;16.00;1
retro wall lights;3;1000;65;https://www.industville.co.uk/collections/wall-lights;9.00;1
retro incandescent light bulbs;3;1000;65;https://www.industville.co.uk/collections/led-decorative-light-bulbs;29.00;1
pendant lamp kitchen island;3;1000;65;https://www.industville.co.uk/collections/kitchen-island-lighting;9.00;1
vintage light bulb lights;3;1000;65;https://www.industville.co.uk/collections/led-decorative-light-bulbs;8.00;1
industrial kitchen lighting;1;260;64;https://www.industville.co.uk/collections/kitchen-lights;10.00;0
pendant lights for a kitchen;1;260;64;https://www.industville.co.uk/collections/kitchen-island-lighting;12.00;0
hair salon lighting;1;260;64;https://www.industville.co.uk/blogs/news/the-complete-guide-to-salon-lighting-and-design-ideas;9.00;1
wall lights industrial;1;260;64;https://www.industville.co.uk/collections/wall-lights;8.00;1
industrial pendant lights;1;260;64;https://www.industville.co.uk/collections/ceiling-lights;7.00;0
edison led light bulb;1;260;64;https://www.industville.co.uk/collections/led-decorative-light-bulbs;9.00;1
alabaster pendant light;1;260;64;https://www.industville.co.uk/products/alabaster-slope-pendant-light-8-inch-brass;7.00;1
industrial light shade;1;480;63;https://www.industville.co.uk/collections/lighting-shades-and-lampshades;12.00;1
industrial wall light;1;480;63;https://www.industville.co.uk/collections/wall-lights;8.00;1
kitchen island lighting ideas;2;720;59;https://www.industville.co.uk/collections/kitchen-island-lighting;16.00;1
exterior bulkhead lights;2;720;59;https://www.industville.co.uk/collections/bulkhead-lights;13.00;0
over kitchen island pendant lights;3;720;59;https://www.industville.co.uk/collections/kitchen-island-lighting;9.00;1
50 small bathroom ideas;2;720;59;https://www.industville.co.uk/blogs/news/50-small-bathroom-ideas-that-increase-space;47.00;1
kitchen hanging lights;3;880;57;https://www.industville.co.uk/collections/kitchen-island-lighting;28.00;1
vintage wall lights;4;1300;57;https://www.industville.co.uk/collections/wall-lights;8.00;1
hanging lights for kitchen;2;880;57;https://www.industville.co.uk/collections/kitchen-island-lighting;22.00;0
industrial light fixtures;1;210;52;https://www.industville.co.uk/collections/ceiling-lights;7.00;1
decorative led bulbs;1;210;52;https://www.industville.co.uk/collections/led-decorative-light-bulbs;14.00;1
metal ceiling light;1;210;52;https://www.industville.co.uk/collections/metal-decorative-lights;11.00;1
cottage lighting;1;210;52;https://www.industville.co.uk/collections/cottage-ceiling-lights-wall-sconces;9.00;1
industrial style ceiling lamps;1;210;52;https://www.industville.co.uk/collections/ceiling-lights;7.00;0
metal lighting pendants;1;210;52;https://www.industville.co.uk/collections/metal-decorative-lights;14.00;0
industrial style wall lights;1;210;52;https://www.industville.co.uk/collections/wall-lights;7.00;1
e27 bulb edison;1;210;52;https://www.industville.co.uk/collections/led-decorative-light-bulbs;13.00;1
waterproof bathroom wall lights;1;210;52;https://www.industville.co.uk/collections/bathroom-lights;5.00;1`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function parseRaw(raw) {
  const lines = raw.trim().split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(';');
    if (parts.length < 7) continue;
    rows.push({
      keyword: parts[0].trim().toLowerCase(),
      position: parseInt(parts[1], 10),
      volume: parseInt(parts[2], 10) || 0,
      traffic: parseInt(parts[3], 10) || 0,
      url: parts[4].trim(),
      kd: parseFloat(parts[5]) || 0,
      intent: parts[6].trim(),
    });
  }
  return rows;
}

// Build ledsone keyword map: keyword -> best (lowest) position
function buildLedsoneMap(rows) {
  const map = {};
  for (const r of rows) {
    if (!map[r.keyword] || r.position < map[r.keyword]) {
      map[r.keyword] = r.position;
    }
  }
  return map;
}

// Branded terms to exclude (partial match)
const BRANDED_TERMS = ['ledhut', 'led hut', 'lightingcompany', 'lighting company', 'industville', 'ledsone', 'ledstone', 'industriville', 'industrville', 'industiville', 'industvile', 'thelightingcompany', 'the lighting company', 'ledhut'];

function isBranded(keyword) {
  const kw = keyword.toLowerCase();
  return BRANDED_TERMS.some(b => kw.includes(b));
}

function buildGapList(competitorRows, ledsoneMap) {
  const gaps = [];
  for (const r of competitorRows) {
    if (r.position > 10) continue; // competitor not in top 10
    if (isBranded(r.keyword)) continue; // skip branded
    const ledsonePos = ledsoneMap[r.keyword];
    // Gap: ledsone absent OR ranks > 20
    if (ledsonePos === undefined || ledsonePos > 20) {
      const opportunityScore = r.volume * (10 / r.position);
      gaps.push({
        keyword: r.keyword,
        competitor_position: r.position,
        volume: r.volume,
        competitor_traffic: r.traffic,
        competitor_url: r.url,
        keyword_difficulty: r.kd,
        intent: r.intent,
        ledsone_position: ledsonePos || null,
        opportunity_score: Math.round(opportunityScore),
      });
    }
  }
  // Sort by opportunity score desc, take top 50
  gaps.sort((a, b) => b.opportunity_score - a.opportunity_score);
  return gaps.slice(0, 50);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  const ledsoneRows = parseRaw(LEDSONE_RAW);
  const ledsoneMap = buildLedsoneMap(ledsoneRows);
  console.log(`ledsone keyword map built: ${Object.keys(ledsoneMap).length} keywords`);

  const competitors = [
    { domain: 'ledhut.co.uk', raw: LEDHUT_RAW },
    { domain: 'lightingcompany.co.uk', raw: LIGHTINGCOMPANY_RAW },
    { domain: 'industville.co.uk', raw: INDUSTVILLE_RAW },
  ];

  const allGaps = {};
  for (const comp of competitors) {
    const rows = parseRaw(comp.raw);
    const gaps = buildGapList(rows, ledsoneMap);
    allGaps[comp.domain] = gaps;
    console.log(`\n[${comp.domain}] gap keywords found: ${gaps.length}`);
    console.log('  Top 3:');
    gaps.slice(0, 3).forEach((g, i) => {
      console.log(`    ${i + 1}. "${g.keyword}" | pos ${g.competitor_position} | vol ${g.volume} | score ${g.opportunity_score}`);
    });
  }

  // ─── DATABASE ──────────────────────────────────────────────────────────────
  const sql = neon('postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require');
  console.log('\nConnected to Neon DB (HTTP)');

  // Ensure table exists
  await sql`
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
  `;
  console.log('Table ensured.');

  const summary = {};

  for (const comp of competitors) {
    const domain = comp.domain;
    const gaps = allGaps[domain];

    // Full refresh for this competitor
    await sql`DELETE FROM semrush_keyword_gap WHERE competitor_domain = ${domain}`;
    console.log(`\nDeleted existing rows for ${domain}`);

    let inserted = 0;
    for (const g of gaps) {
      await sql`
        INSERT INTO semrush_keyword_gap
          (keyword, competitor_domain, competitor_position, volume, competitor_traffic,
           competitor_url, keyword_difficulty, intent, ledsone_position, opportunity_score, snapshot_date)
         VALUES (
           ${g.keyword}, ${domain}, ${g.competitor_position}, ${g.volume}, ${g.competitor_traffic},
           ${g.competitor_url}, ${g.keyword_difficulty}, ${g.intent}, ${g.ledsone_position}, ${g.opportunity_score},
           CURRENT_DATE
         )
         ON CONFLICT (keyword, competitor_domain) DO UPDATE SET
           competitor_position = EXCLUDED.competitor_position,
           volume = EXCLUDED.volume,
           competitor_traffic = EXCLUDED.competitor_traffic,
           opportunity_score = EXCLUDED.opportunity_score,
           snapshot_date = CURRENT_DATE
      `;
      inserted++;
    }
    summary[domain] = inserted;
    console.log(`Inserted ${inserted} rows for ${domain}`);
  }
  console.log('\n─── SUMMARY ─────────────────────────────────────────────');
  let total = 0;
  for (const [domain, count] of Object.entries(summary)) {
    console.log(`  ${domain}: ${count} rows`);
    total += count;
  }
  console.log(`  TOTAL: ${total} rows inserted`);
  console.log('─────────────────────────────────────────────────────────');
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
