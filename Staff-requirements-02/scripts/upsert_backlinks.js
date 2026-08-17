// SEMrush Backlinks Upsert Script — ledsone.co.uk
// Uses @neondatabase/serverless (HTTPS/WebSocket) so it works in proxy environments.

const { neon } = require('../node_modules/@neondatabase/serverless');

const CONNECTION_STRING =
  'postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const snapshot_date = new Date().toISOString().slice(0, 10);

// ── STEP 1: Backlinks Overview (SEMrush backlinks_overview) ──────────────────
// Raw: ascore;total;domains_num;ips_num;follows_num;nofollows_num
const OVERVIEW_RAW = `ascore;total;domains_num;ips_num;follows_num;nofollows_num
30;19239;656;734;17405;1838`;

// ── STEP 2: Referring Domains (SEMrush backlinks_refdomains, top 200) ────────
// Raw: domain;domain_ascore;backlinks_num;first_seen;last_seen
// first_seen / last_seen are Unix timestamps (seconds)
const REFDOMAINS_RAW = `domain;domain_ascore;backlinks_num;first_seen;last_seen
ledsone.nl;9;5550;1763204426;1786872456
directory9.biz;5;4367;1699893010;1786928447
syncee.com;35;1820;1743708314;1786931451
coles-directory.com;18;1246;1710460860;1786931661
prolink-directory.com;6;913;1699938142;1786926364
secretsearchenginelabs.com;15;657;1713428580;1786876398
fennax.com;1;395;1781933790;1785967652
interesting-dir.com;6;324;1682744642;1785082916
postfreedirectory.com;7;238;1717630165;1786898177
celestialdirectory.com;7;157;1737774347;1786932771
snipesocial.co.uk;29;157;1701038561;1784943134
addirectory.org;6;151;1711569757;1785798951
nichey.net;12;120;1755965528;1786851024
tapalmbeaches.com;2;116;1733710059;1776165550
openbadania.pl;29;97;1699933597;1781999837
tahaduth.com;6;87;1699945193;1777357879
yell.com;68;70;1708175365;1786905771
bulkpostads.com;13;69;1767090489;1786853961
menagerie.media;6;67;1701298161;1786914267
yoo.bio;5;66;1758166442;1777646582
patriabook.com;14;57;1702388478;1786604910
golden-forum.com;26;55;1703723378;1779991710
weboworld.com;20;50;1723926437;1785306959
insta.tel;5;44;1706430448;1784708810
pointblog.net;24;42;1757403215;1786930992
kilnandclayinteriors.com;2;41;1723698409;1784944700
royallinkup.com;5;39;1693742435;1786933019
smartseobacklink.com;4;39;1715722589;1781791046
activoblog.com;24;38;1757499912;1785292327
blog-dir-new.vercel.app;5;38;1741631381;1783180380
streambang.com;5;38;1701421992;1786374701
ledsone.fr;10;34;1762055819;1786073661
undewall.com;5;34;1736035749;1785635020
ecomscout.com;15;32;1770922364;1784534971
theavtar.in;6;31;1711000904;1786691637
linkeei.com;6;27;1702045148;1786792993
blog-directory.org;20;26;1757255753;1786349794
decorliya.co.uk;6;26;1727435640;1786896434
theseobacklink.com;12;26;1759419669;1782830889
friend007.com;6;25;1705363096;1786753261
promorapid.com;13;24;1703154684;1784001100
articledirectoryzone.com;6;23;1703719961;1783433226
blog-gold.com;21;20;1759260313;1785239154
blogdigy.com;16;20;1757807721;1786743210
decorinall.com;8;20;1768649604;1786740947
geto.space;6;20;1742203866;1786473528
cloutapps.com;6;19;1707158120;1785499556
blogfaspec.com.br;10;18;1783176361;1786821232
southernlanka.lk;7;18;1759774411;1773875715
video-bookmark.com;21;18;1732317086;1786563384
wego.social;21;18;1702247429;1782635935
instya.com;25;17;1758401002;1786918079
writeupcafe.com;35;17;1752892756;1785422215
aboutyoublog.com;6;16;1765550064;1785308814
advertall.co.uk;12;16;1707415472;1786513539
chumsay.com;21;16;1701296595;1777633923
dalbofest.com;2;16;1754532524;1770805613
dimoradesign.co.uk;6;16;1763397673;1785783240
myrealex.com;21;16;1704859245;1783021882
perfect-garden.co.uk;7;16;1744288939;1786714279
blog5.net;6;15;1758462404;1786644713
americanaccent.com;23;14;1747868093;1784978982
llmstxtchecker.net;8;14;1772143447;1786053443
ijao.in;12;13;1751107394;1777801945
premiumhomeliving.shop;2;13;1783682886;1785642049
blacksocially.com;6;12;1708357298;1780002660
company.site;50;12;1733509575;1785357216
articlecede.com;11;11;1708747790;1783783021
bestfirms.org;4;11;1782591509;1786453438
bresdel.com;28;11;1704548371;1781089711
electricalsone.co.uk;11;11;1725261574;1786897713
gaming-walker.com;6;11;1718751343;1783585797
pamzden.com;2;11;1761572179;1782878609
vherso.com;6;11;1709869767;1784050825
vihaindia.com;2;11;1745001518;1784619357
bhimchat.com;14;10;1702820047;1786009664
directory-fast.com;6;10;1759452983;1785943644
frustratedgamers.com;5;10;1785298369;1786538117
globalsourceus.in;2;10;1749740735;1782753765
kroxam.com;34;10;1753189552;1778376378
robustdirectory.com;5;10;1759531357;1786295724
weig-bft.com;4;10;1745231896;1774674041
worlds-directory.com;6;10;1759454692;1786819616
changingfaceshousing.com;2;9;1755396622;1777001374
directoryio.com;5;9;1765571140;1786840452
dostally.com;6;9;1714980590;1776279748
entrepreneurscruise.com;12;9;1742433040;1778485398
omg-directory.com;6;9;1766956924;1786220582
planner5d.com;59;9;1744950785;1786180070
relicelectrical.ca;9;9;1723151151;1783529375
webdirectory11.com;6;9;1768913628;1784922937
directory-nation.com;6;8;1759518031;1785846112
directoryholiday.com;6;8;1769770317;1785727131
ekcochat.com;6;8;1706795254;1771269461
legit-directory.com;5;8;1770059184;1786038870
nilinknet.com;5;8;1707726069;1780792909
parse.gl;31;8;1777952315;1786708058
tb-plastic.com;7;8;1753098252;1784281451
your-directory.com;6;8;1759520386;1784410604
yuneyoga.com;27;8;1783211742;1785786872
associazioneagricoltorivalleverzasca.ch;3;7;1750694116;1785623821
bluepirate.co.uk;2;7;1751105052;1774249703
buysomelamps.com;2;7;1762573653;1776856925
followingbook.com;20;7;1701515257;1784354186
kabelprofide.com;2;7;1782165093;1782892305
trendyhomeprime.com;2;7;1777094214;1786375436
articlesjust4you.com;6;6;1700185304;1785718049
evertrendcollective.co.uk;2;6;1783031343;1785146413
fixithomehub.com;0;6;1786775238;1786858401
happyinteriors.store;2;6;1768357872;1786851280
hugsqueeze.com;13;6;1714336968;1781719480
instock.net;17;6;1723924921;1781065590
ledsone.de;17;6;1726381549;1786606523
mstradeagency.com.bd;2;6;1732664802;1780408291
novamarketing.ai;7;6;1784568336;1786850028
novapick.co.uk;2;6;1782093390;1786119954
palscity.com;33;6;1710707028;1785250458
rolonet.com;5;6;1763702797;1775982376
socialbookmarkssite.com;15;6;1725716855;1775866332
thatgiftstore.com;2;6;1724563111;1786781916
thegeneraltrader.co.uk;0;6;1778880903;1779948458
urgclub.com;28;6;1723781471;1785846448
viesearch.com;28;6;1751766876;1782690027
windowssearch-exp.com;5;6;1763131548;1785112667
alllebaneses.xyz;2;5;1753004490;1780496072
bing.com;92;5;1759147469;1784766082
burrardstreetjournal.com;23;5;1738305135;1773475903
dabworldstore.com;0;5;1766249750;1778968526
kwiko.io;2;5;1753444623;1776724636
ledsone.us;8;5;1771926362;1781515557
repowering.fr;5;5;1785000736;1786594058
safetechinnovation.com;9;5;1754354269;1777397931
scmbh.com;2;5;1747395342;1776069812
tegara.net;19;5;1750146207;1782571182
ubooks.app;16;5;1757563790;1784493316
udhee.com;6;5;1750221162;1783156809
veirix.com;2;5;1759276470;1775808746
zunarae.com;2;5;1756411608;1785774868
accio.com;54;4;1774986831;1785520149
adstores.shop;2;4;1777431609;1786111554
agribusinessnews.co;2;4;1738669570;1782905037
ai.florist;2;4;1717219835;1772507323
alibaba.com;80;4;1782962590;1786079642
asempashop.com;0;4;1780826906;1781249600
beesetups.com;12;4;1785559260;1786889366
bruceonlineworld.com;2;4;1754087271;1782737092
dekorheim.store;2;4;1768892610;1773714015
electricalsafetyfirst.org.uk;57;4;1724428087;1786364884
factmags.com;4;4;1771889057;1786417119
habibnco.com;6;4;1757889021;1785602762
hearthsidehome.store;1;4;1781037134;1781601299
juriwaldiner.adv.br;2;4;1753658408;1784052182
kitabibrothers.com;2;4;1740937954;1783225142
lasch-o-mat.de;5;4;1771246309;1771418907
lilianabphotography.com;7;4;1738690351;1773053093
livestiri.ro;2;4;1784272714;1786881274
ljuus.ch;2;4;1784021446;1786870103
outletvibe.com;2;4;1760260814;1784947657
poidata.io;19;4;1756855293;1786681933
runninglightvest.com;2;4;1740891684;1785724331
rvandwild.com;2;4;1783735743;1784651861
shopinja.com;10;4;1737973028;1782658782
submitafreearticle.com;5;4;1704904995;1780552863
takes.homes;2;4;1765172025;1786582720
theterrahome.com;6;4;1756892486;1779191282
westernsport.com;27;4;1786140166;1786212725
youslade.com;6;4;1701398043;1784380631
acompio.co.uk;28;3;1728569114;1784846603
adpost.com;33;3;1751237713;1782170752
aidatrends.com;2;3;1765345908;1774332651
allwebsitesdirectory.com;2;3;1767468744;1786561393
americanliberty.news;19;3;1753753413;1783883311
b2b-invest.ro;2;3;1786416385;1786795414
beritapagi.id;3;3;1762370971;1775287685
bestwebstats.com;2;3;1772805329;1786002368
bigalexsbestdeals.com;2;3;1756825933;1784741407
bookmark4you.com;28;3;1724781772;1777416530
broersmotor.com;2;3;1751829515;1778198425
credoeco.com;2;3;1768556739;1781803120
denbighharriers.com;2;3;1739339336;1772768219
derbytelegraph.co.uk;50;3;1778914352;1786523132
domain.com.lc;2;3;1774968950;1786848470
domainanalysis.org;2;3;1773609660;1786147525
domainsc.com;2;3;1772692490;1786134782
egyptiandirectory.com;2;3;1769022254;1781876478
ekaplast.ro;2;3;1746631562;1777744305
getwebsiteworth.com;3;3;1765091289;1786529680
globalecommerce.org;3;3;1766040205;1785325270
godstudio.co.in;8;3;1758522610;1783631668
growthcentr.com;2;3;1783592435;1786063871
hebagh.cv;2;3;1770708412;1781423268
indians.cc;3;3;1769084055;1786616283
lillybeautymedspasanrafael.com;6;3;1749686683;1782735797
linkcentre.com;31;3;1766718324;1784110567
linksnatcher.com;2;3;1768317019;1786004418
matarabodhiya.org;8;3;1755503419;1775516503
musweb.org;2;3;1766947399;1773137290
novari-shop.com;2;3;1769003936;1770282013
odinluxury.com;2;3;1741089771;1777864117
pietraoven.co.il;6;3;1750262040;1776763196`;

// ── Parsers ───────────────────────────────────────────────────────────────────

function parseOverview(raw) {
  const lines = raw.trim().split('\n');
  const vals = lines[1].split(';');
  return {
    authority_score:   parseInt(vals[0], 10),
    total_backlinks:   parseInt(vals[1], 10),
    referring_domains: parseInt(vals[2], 10),
    referring_ips:     parseInt(vals[3], 10),
    follow_links:      parseInt(vals[4], 10),
    nofollow_links:    parseInt(vals[5], 10),
  };
}

// Convert Unix timestamp (seconds) → 'YYYY-MM-DD' or null
function unixToDate(ts) {
  if (!ts || ts === '' || ts === '0') return null;
  const n = parseInt(ts, 10);
  if (isNaN(n) || n <= 0) return null;
  return new Date(n * 1000).toISOString().slice(0, 10);
}

function parseRefdomains(raw) {
  const lines = raw.trim().split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(';');
    if (parts.length < 5) continue;
    rows.push({
      domain:          parts[0].trim(),
      authority_score: parts[1] !== '' ? parseInt(parts[1], 10) : null,
      backlinks_count: parts[2] !== '' ? parseInt(parts[2], 10) : null,
      first_seen:      unixToDate(parts[3]),
      last_seen:       unixToDate(parts[4]),
    });
  }
  return rows;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const overview   = parseOverview(OVERVIEW_RAW);
  const refdomains = parseRefdomains(REFDOMAINS_RAW);

  const sql = neon(CONNECTION_STRING);

  try {
    // a) Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS semrush_backlinks (
        snapshot_date    DATE PRIMARY KEY,
        authority_score  INT,
        total_backlinks  INT,
        referring_domains INT,
        referring_ips    INT,
        follow_links     INT,
        nofollow_links   INT
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS semrush_refdomains (
        id              SERIAL,
        snapshot_date   DATE NOT NULL,
        domain          TEXT NOT NULL,
        authority_score INT,
        backlinks_count INT,
        first_seen      DATE,
        last_seen       DATE,
        PRIMARY KEY (snapshot_date, domain)
      )
    `;
    console.log('Tables ensured');

    // b) Upsert backlinks overview
    await sql`
      INSERT INTO semrush_backlinks
        (snapshot_date, authority_score, total_backlinks, referring_domains, referring_ips, follow_links, nofollow_links)
      VALUES (
        ${snapshot_date},
        ${overview.authority_score},
        ${overview.total_backlinks},
        ${overview.referring_domains},
        ${overview.referring_ips},
        ${overview.follow_links},
        ${overview.nofollow_links}
      )
      ON CONFLICT (snapshot_date) DO UPDATE SET
        authority_score   = EXCLUDED.authority_score,
        total_backlinks   = EXCLUDED.total_backlinks,
        referring_domains = EXCLUDED.referring_domains,
        referring_ips     = EXCLUDED.referring_ips,
        follow_links      = EXCLUDED.follow_links,
        nofollow_links    = EXCLUDED.nofollow_links
    `;
    console.log('Upserted backlinks overview');

    // c) Delete today's refdomains for clean re-run
    await sql`DELETE FROM semrush_refdomains WHERE snapshot_date = ${snapshot_date}`;

    // d) Insert referring domains one by one
    let inserted = 0;
    for (const row of refdomains) {
      await sql`
        INSERT INTO semrush_refdomains
          (snapshot_date, domain, authority_score, backlinks_count, first_seen, last_seen)
        VALUES (
          ${snapshot_date},
          ${row.domain},
          ${row.authority_score},
          ${row.backlinks_count},
          ${row.first_seen},
          ${row.last_seen}
        )
        ON CONFLICT (snapshot_date, domain) DO NOTHING
      `;
      inserted++;
    }

    // e) Summary log
    console.log('\n════ SNAPSHOT SUMMARY ════');
    console.log(`snapshot_date     : ${snapshot_date}`);
    console.log(`authority_score   : ${overview.authority_score}`);
    console.log(`total_backlinks   : ${overview.total_backlinks}`);
    console.log(`referring_domains : ${overview.referring_domains}`);
    console.log(`referring_ips     : ${overview.referring_ips}`);
    console.log(`follow_links      : ${overview.follow_links}`);
    console.log(`nofollow_links    : ${overview.nofollow_links}`);
    console.log(`refdomains rows   : ${inserted}`);
    console.log('══════════════════════════');

  } catch (err) {
    console.error('ERROR:', err.message || err);
    process.exit(1);
  }
}

main();
