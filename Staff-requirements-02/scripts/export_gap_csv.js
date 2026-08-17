'use strict';
/**
 * Export keyword gap results to CSV (fallback when Neon is unreachable)
 */
const fs = require('fs');
const path = require('path');

// ─── Shared data (subset of semrush_keyword_gap.js) ──────────────────────────

const ledsoneMap = {
  'e27 bulb': 6, 'wire connectors': 3, 'spider lights': 1,
  'plug in pendant light': 3, 'wiring and connectors': 2, 'bayonet light bulb': 5,
  'retro light shades': 2, 'b22 bulb': 8, '3 core cable': 6,
  'spider light fitting': 1, 'plug in hanging light fixtures': 2, 'white blackboard': 9,
  'retro lamp shades': 2, 'bulbs for dimmers': 2, 'what is an e27 bulb': 1,
  'lamp shade holder': 2, 'led rope light fixture': 1, 'led transformer 24v': 1,
  'brackets for ceiling lights': 2, 'e27 edison screw bulb': 6, '24v transformer': 2,
  'plug in hanging pendant lamp': 4, 'spider light': 3, 'e27 light bulb': 10,
  'screw light bulbs e27': 7, 'hanging lamp plug': 4, '2 core cable': 5,
  'b22 light bulb': 7, 'wall lights': 28, 'cage light shade': 1,
  'white board white': 21, 'spider pendant light': 2, 'mould resistant shower curtain': 2,
  'what is e27 bulb': 1, 'big bag for laundry': 3, 'pendant lamp': 6,
  'pendant lamp plug': 6, 'cage hanging light': 1, 'ceiling rose': 23,
  'vintage e27 light bulbs': 2, 'light cage shade': 1, 'ceiling hooks for lights': 2,
  'conduit lighting': 3, 'pipe lights': 2, 'transformer 12v led': 2,
  'spider ceiling light': 2, 'light pendant holder': 1, 'pendant light': 22,
  '12v transformer': 3, 'bayonet mount led bulb': 7, 'e27 screw light bulbs': 7,
  'spider pendant lamp': 2, 'bayonet fitting light bulbs': 7, 'pendant light with plug in': 2,
  'pendant light spider': 2, 'ceiling hooks for lighting': 6, 'led transformers 12v': 1,
  'edison screw lamp holder': 4, 'shower curtain': 33, 'plug in hanging light': 6,
  'bayonet decorative light bulbs': 2, 'light bulb with holder': 5, 'transformer 24v': 1,
  'edison screw bulb': 8, 'light shades': 21, 'bayonet fitting led bulbs': 7,
  'led transformer 12v': 3, 'edison screw e27 lamp': 2, 'tape': 25,
  'e27 lamp base': 3, 'hanging lights with plug in': 4, 'steampunk wall lights': 1,
  'shower curtain mould proof': 3, 'ceiling bracket light': 2, '12v lighting transformer': 3,
  'pendant light holder': 1, 'rope hanging lamp': 1, 'lamp shade holder ring': 2,
  'led lights bayonet': 7, 'covered electrical wire': 3, 'pendant plug light': 8,
  'hanging from chains': 7, 'fitting a pendant light': 6, 'hanging pendant plug in light': 2,
  'electrical cable connectors types': 6, 'decorative light bulbs bayonet fitting': 3,
  'power adapter dc 12v': 2, '2 core electrical cable': 5, 'spider hanging lights': 1,
  'bayonet led lamps': 8, 'light with plug in': 4, 'lampshade pendant lighting': 14,
  '3 core wire': 5, '12v led lighting transformer': 3, 'e27 vintage light bulbs': 2,
  'e27 bulb base': 2, 'spider light pendant': 2, 'rope lighting for ceiling': 1,
  'pendant spider light': 2, 'anti mould shower curtain': 7, 'bayonet fit led bulbs': 8,
  '3m double sided tape': 12, 'zipper file folder': 3, '240 volt 12 volt dc transformer': 3,
  'pipework lights': 2, 'light bracket for ceiling': 2, 'metal black lampshade': 2,
  'slippers for bathing': 2, 'chrome light shade': 2, 'light shade cage': 1,
  '240v to 12 volt converter': 4, 'conduit light fittings': 2, '240v to 12v power supply': 2,
  'electric light bulb fittings': 7, 'vintage filament bulbs e27': 2, 'hanging lamps with plug': 6,
  'pendant lights': 24, 'weighing machine scale': 16, 'hanging pendant plug in lights': 2,
  'rope ceiling lights': 2, 'plug in light fixture': 2, 'swag light': 2,
  'bulb holder screw': 3, '2 core wire': 4, 'ceiling light bracket': 7,
  'light fitting bracket': 4, '12v led light transformer': 3, '3 pendant light': 8,
  'electrical connectors push fit': 3, 'e27 filament light bulb': 5, 'mini pendant lamp': 4,
  'plug for light bulb': 4, '12 volt transformer': 2, 'outdoor chandelier': 7,
  '240v to 12v converter': 2, 'pulley pendant light': 2, 'mini whiteboard': 26,
  'dc 5v': 5, 'e27 led bulb': 22, 'lights that plug in': 12,
  'vintage glass light shades': 8, 'bayonet bulb sizes': 6, '240v to12v transformer': 6,
  'e27 bulb led filament': 4, 'cage lamp pendant': 2, 'vintage light bulbs e27': 5,
  'ceiling hooks for lamps': 5, 'd.c 5v': 3, 'retro e27 bulb': 2,
  'slippery sandals': 4, 'light bulb bayonet': 4, '12 volt dc transformer': 2,
  'rope ceiling light': 3, 'ceiling lamp with switch': 2, 'sbled light bulb': 13,
  'vintage led bulbs': 5, 'pipe lamp': 2, 'b22 bayonet bulb': 6,
  'waterproof cable connector': 9, 'bulb receptacle': 3, 'dry erase board': 5,
  'decorative light bulbs bayonet': 3, 'socket with holder': 4, 'hanging pendant light with plug': 2,
  'pendant lamps plug in': 2, 'light bracket': 4, 'cage for pendant light': 3,
  'red ceiling light': 6, 'crow lamp': 6, 'edison screw bulb e27': 9,
  'types of light fixtures': 3, 'e27 light bulb base': 3, 'cage lamp shade': 3,
  'corded pendant lamp': 3, 'holder for lamp shade': 3, 'led tape light transformer': 4,
  'small screw bulb': 12,
};

const BRANDED = [
  'ledhut','led hut','lumilife',
  'lightingcompany','lighting company','thelightingcompany','the lighting company','the lighting co',
  'industville','industriville','industiville','industrville','industvile',
  'ledsone','ledstone','intitle:ledsone',
];
function isBranded(kw) {
  const lower = kw.toLowerCase();
  return BRANDED.some(b => lower.includes(b));
}

function buildGaps(domain, keywords) {
  const gaps = [];
  for (const [kw,pos,vol,traffic,url,kd,intent] of keywords) {
    if (pos > 10) continue;
    if (isBranded(kw)) continue;
    const ledsonePos = ledsoneMap[kw] !== undefined ? ledsoneMap[kw] : null;
    if (ledsonePos !== null && ledsonePos <= 20) continue;
    const oppScore = Math.round(vol * (10/pos) * 100) / 100;
    gaps.push({ kw, domain, pos, vol, traffic, url, kd, intent, ledsonePos, oppScore });
  }
  gaps.sort((a,b) => b.oppScore - a.oppScore);
  return gaps.slice(0, 50);
}

// Inline the same keyword arrays (abbreviated references)
const { LEDHUT_KEYWORDS, LIGHTINGCOMPANY_KEYWORDS, INDUSTVILLE_KEYWORDS } = require('./keyword_data');

const allGaps = [
  ...buildGaps('ledhut.co.uk', LEDHUT_KEYWORDS),
  ...buildGaps('lightingcompany.co.uk', LIGHTINGCOMPANY_KEYWORDS),
  ...buildGaps('industville.co.uk', INDUSTVILLE_KEYWORDS),
];

const header = 'keyword,competitor_domain,competitor_position,volume,competitor_traffic,competitor_url,keyword_difficulty,intent,ledsone_position,opportunity_score,snapshot_date';
const rows = allGaps.map(g => [
  JSON.stringify(g.kw), g.domain, g.pos, g.vol, g.traffic,
  JSON.stringify(g.url), g.kd, g.intent, g.ledsonePos ?? '', g.oppScore,
  new Date().toISOString().slice(0,10),
].join(','));

const csv = [header, ...rows].join('\n');
const outPath = path.join(__dirname, '../data/semrush_keyword_gap.csv');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, csv);
console.log(`Written ${rows.length} rows to ${outPath}`);
