const { Client } = require('../node_modules/pg');

const CONNECTION_STRING = 'postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=verify-full';

// Data fetched from SEMrush on 2026-09-21
const OVERVIEW_CSV = `total;domains_num;ips_num;follows_num;nofollows_num;score;trust_score;urls_num;ipclassc_num;texts_num;forms_num;frames_num;images_num
19737;728;806;17981;1786;29;29;13515;433;18981;0;0;918`;

const REFDOMAINS_CSV = `domain;domain_ascore;backlinks_num;first_seen;last_seen
ledsone.nl;8;5801;1763204426;1789913852
directory9.biz;5;4842;1699893010;1789956551
syncee.com;35;1718;1743708314;1789935709
coles-directory.com;17;1226;1710460860;1789944742
prolink-directory.com;5;1041;1699938142;1789958352
secretsearchenginelabs.com;15;600;1713428580;1789591623
fennax.com;1;395;1781933790;1786716830
postfreedirectory.com;7;263;1717630165;1789785641
interesting-dir.com;6;251;1682744642;1785082916
celestialdirectory.com;7;157;1736384169;1789943540
snipesocial.co.uk;29;152;1701038561;1784943134
addirectory.org;6;135;1704156187;1787869398
nichey.net;5;116;1755965528;1789852094
tahaduth.com;6;87;1699945193;1777357879
lidsone.com;0;81;1789250582;1789956844
yell.com;67;77;1708175365;1789818285
menagerie.media;6;67;1701298161;1789693517
bulkpostads.com;13;64;1754686562;1788006938
yoo.bio;5;63;1758166442;1777646582
patriabook.com;14;57;1702388478;1788788511
openbadania.pl;29;56;1702369961;1788374006
golden-forum.com;26;55;1703723378;1779991710
weboworld.com;19;51;1723926437;1787244209
blog-directory.org;20;48;1757255753;1789951463
blogfaspec.com.br;10;46;1783176361;1789946798
pointblog.net;24;42;1757403215;1789949741
royallinkup.com;5;41;1693742435;1789887257
insta.tel;5;40;1706430448;1784708810
smartseobacklink.com;4;39;1715722589;1781791046
activoblog.com;24;38;1757499912;1785292327
streambang.com;5;38;1701421992;1789666301
undewall.com;5;34;1736035749;1787982295
ecomscout.com;19;33;1770922364;1789314281
ledsone.fr;11;31;1762055819;1789546071
theavtar.in;5;31;1711000904;1789670571
blog-dir-new.vercel.app;5;30;1741631381;1783180380
kilnandclayinteriors.com;2;29;1723698409;1788110324
linkeei.com;6;28;1701642251;1789860606
decorliya.co.uk;6;26;1727435640;1789797790
theseobacklink.com;12;26;1759419669;1782830889
friend007.com;6;25;1704416274;1788783822
articledirectoryzone.com;6;23;1703719961;1783433226
blog-gold.com;21;20;1759260313;1785239154
blogdigy.com;14;20;1757807721;1789947754
geto.space;6;20;1742203866;1789516057
promorapid.com;14;20;1704762499;1787437902
winnowmarket.com;6;20;1787448972;1789632937
cloutapps.com;6;19;1702378531;1785499556
southernlanka.lk;7;18;1759774411;1773875715
video-bookmark.com;21;18;1732317086;1788752132
instya.com;26;17;1758401002;1789827380
writeupcafe.com;37;17;1752892756;1789371754
aboutyoublog.com;6;16;1765550064;1787333497
advertall.co.uk;12;16;1707415472;1789377620
dimoradesign.co.uk;6;16;1763397673;1785783240
myrealex.com;21;16;1704859245;1783021882
perfect-garden.co.uk;7;16;1744288939;1788462016
wego.social;21;16;1702247429;1782635935
blog5.net;6;15;1758462404;1789903575
ledskinn.com;6;15;1788567682;1789634264
americanaccent.com;21;14;1747868093;1788391092
blacksocially.com;6;14;1708357298;1789617514
llmstxtchecker.net;13;14;1772143447;1789573787
decorinall.com;8;13;1768810051;1787266051
electricalsone.co.uk;11;13;1725261574;1788731375
parse.gl;31;13;1777952315;1788792353
premiumhomeliving.shop;0;13;1783682886;1786653012
tapalmbeaches.com;2;13;1733710059;1776165550
company.site;50;12;1733509575;1785357216
ijao.in;12;12;1751107394;1777801945
vihaindia.com;2;12;1745001518;1786165556
articlecede.com;5;11;1706714962;1788079772
bestfirms.org;5;11;1782591509;1789887118
bresdel.com;32;11;1703739707;1787065119
ledsone.de;12;11;1726381549;1789846661
pamzden.com;2;11;1761572179;1782878609
beesetups.com;13;10;1785559260;1789808889
bhimchat.com;6;10;1702820047;1789823627
chumsay.com;21;10;1701296595;1777633923
directory-fast.com;6;10;1759452983;1787366675
directoryio.com;5;10;1765571140;1788143556
frustratedgamers.com;5;10;1785298369;1786538117
globalsourceus.in;2;10;1749740735;1782753765
novapulseplus.com;6;10;1788133346;1789853613
planner5d.com;60;10;1744950785;1789885242
robustdirectory.com;5;10;1759531357;1788453479
worlds-directory.com;6;10;1759454692;1788443706
changingfaceshousing.com;2;9;1755396622;1777001374
omg-directory.com;6;9;1766956924;1788771161
relicelectrical.ca;9;9;1723151151;1783529375
webdirectory11.com;6;9;1768913628;1788374473
directory-nation.com;6;8;1759518031;1788347174
directoryholiday.com;6;8;1769770317;1788554053
dostally.com;6;8;1720000094;1776279748
gaming-walker.com;6;8;1718751343;1783585797
kroxam.com;34;8;1753450322;1778376378
legit-directory.com;5;8;1770059184;1789349263
nilinknet.com;5;8;1702402809;1780792909
tb-plastic.com;7;8;1753098252;1784281451
yuneyoga.com;27;8;1783211742;1785786872
alibaba.com;79;7;1782962590;1789295839
associazioneagricoltorivalleverzasca.ch;3;7;1750694116;1785623821
bing.com;96;7;1769023275;1788139536
entrepreneurscruise.com;12;7;1749014275;1778485398
followingbook.com;18;7;1701515257;1789275893
instock.net;15;7;1723924921;1786965355
kabelprofide.com;2;7;1782165093;1782892305
ledsone.us;10;7;1771926362;1788912689
thatgiftstore.com;2;7;1724563111;1788648021
trendyhomeprime.com;2;7;1777094214;1789853490
vividfinds.co.uk;2;7;1787044887;1789696464
your-directory.com;6;7;1759520386;1784410604
articlesjust4you.com;6;6;1700185304;1785718049
bluepirate.co.uk;2;6;1751105052;1774249703
evertrendcollective.co.uk;2;6;1783031343;1785146413
fixithomehub.com;2;6;1786775238;1789523967
happyinteriors.store;6;6;1768357872;1789250779
hugsqueeze.com;13;6;1714336968;1781719480
hunted.space;16;6;1782917325;1789132600
mstradeagency.com.bd;2;6;1732664802;1780408291
novamarketing.ai;7;6;1784568336;1789338152
novapick.co.uk;2;6;1782093390;1787873862
rolonet.com;5;6;1763702797;1775982376
socialbookmarkssite.com;15;6;1725716855;1775866332
thegeneraltrader.co.uk;0;6;1778880903;1779948458
theterrahome.com;7;6;1756892486;1788844662
ubooks.app;16;6;1757563790;1786153118
urgclub.com;28;6;1703183349;1785846448
viesearch.com;28;6;1751766876;1782690027
windowssearch-exp.com;5;6;1763131548;1786055723
accio.com;54;5;1774986831;1788528292
buysomelamps.com;2;5;1762573653;1776856925
gearcycler.com;6;5;1784049059;1789760069
habibnco.com;6;5;1757889021;1786122498
ljuus.ch;2;5;1784021446;1789685095
palscity.com;33;5;1711366520;1785250458
prinsnova.uk;0;5;1788288807;1789137337
repowering.fr;5;5;1785000736;1789787246
runninglightvest.com;2;5;1740891684;1786237868
safetechinnovation.com;9;5;1754354269;1777397931
scmbh.com;2;5;1747395342;1776069812
tegara.net;19;5;1750146207;1782571182
udhee.com;6;5;1750221162;1783156809
vherso.com;6;5;1708042164;1789168999
zunarae.com;2;5;1756411608;1785774868
adstores.shop;2;4;1777431609;1786111554
agribusinessnews.co;2;4;1738669570;1782905037
alllebaneses.xyz;2;4;1753004490;1780496072
asempashop.com;0;4;1780826906;1781249600
bruceonlineworld.com;2;4;1754087271;1786696092
croftandkind.co.uk;2;4;1788324057;1789255282
dabworldstore.com;0;4;1766249750;1778968526
electricalsafetyfirst.org.uk;55;4;1724428087;1789551345
fabricadestiri.ro;2;4;1785792597;1789682095
factmags.com;4;4;1771889057;1789729170
hearthsidehome.store;1;4;1781037134;1781601299
kitabibrothers.com;2;4;1740937954;1783225142
livestiri.ro;2;4;1784272714;1789409065
outletvibe.com;2;4;1760260814;1784947657
poidata.io;19;4;1756855293;1786681933
rvandwild.com;2;4;1783735743;1784651861
shopinja.com;10;4;1737973028;1782658782
submitafreearticle.com;5;4;1704904995;1780552863
takes.homes;2;4;1765172025;1788031649
weig-bft.com;4;4;1745620959;1774674041
westernsport.com;28;4;1786140166;1788187611
youslade.com;6;4;1701398043;1784380631
adpost.com;37;3;1751237713;1787129210
adsbench.com;2;3;1789907607;1789907607
aidatrends.com;2;3;1765345908;1774332651
allwebsitesdirectory.com;2;3;1767468744;1789374609
americanliberty.news;19;3;1753753413;1783883311
americanstonecenter.com;7;3;1785280803;1787015071
b2b-invest.ro;2;3;1786416385;1789316704
beritapagi.id;3;3;1762370971;1775287685
bestwebstats.com;2;3;1772805329;1788947358
bigalexsbestdeals.com;2;3;1756825933;1784741407
broersmotor.com;2;3;1751829515;1778198425
credoeco.com;2;3;1768556739;1781803120
derbytelegraph.co.uk;50;3;1778914352;1786523132
domain.com.lc;2;3;1774968950;1789323050
domainanalysis.org;2;3;1773609660;1787893831
domainsc.com;4;3;1772692490;1789627971
egyptiandirectory.com;2;3;1769022254;1781876478
getwebsiteworth.com;3;3;1765091289;1788287334
globalecommerce.org;3;3;1766040205;1789517836
godstudio.co.in;8;3;1758522610;1783631668
growthcentr.com;3;3;1783592435;1789955664
iecarmendecarupa.edu.co;8;3;1756675692;1787606095
indians.cc;3;3;1769084055;1789952831
jizzaxteatr.uz;2;3;1752975309;1788208857
juriwaldiner.adv.br;2;3;1755950407;1784052182
knows.sbs;2;3;1771119732;1789305582
lillybeautymedspasanrafael.com;6;3;1749686683;1782735797
linkcentre.com;31;3;1766718324;1784110567
linksnatcher.com;2;3;1768317019;1787459212
lydiaroyrealestate.com;2;3;1782609882;1788005360
masqueunaradio.com.ar;2;3;1751189627;1786839479
musweb.org;2;3;1766947399;1773137290
myodastore.com;0;3;1789686027;1789950476`;

function parseOverview(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(';');
  const vals = lines[1].split(';');
  const row = {};
  headers.forEach((h, i) => { row[h] = vals[i]; });
  return {
    authority_score: parseInt(row['score']) || 0,
    total_backlinks: parseInt(row['total']) || 0,
    referring_domains: parseInt(row['domains_num']) || 0,
    referring_ips: parseInt(row['ips_num']) || 0,
    follow_links: parseInt(row['follows_num']) || 0,
    nofollow_links: parseInt(row['nofollows_num']) || 0,
  };
}

function parseRefdomains(csv) {
  const lines = csv.trim().split('\n');
  // skip header
  return lines.slice(1).map(line => {
    const parts = line.split(';');
    const [domain, ascore, backlinks_num, first_seen, last_seen] = parts;
    const toDate = s => s && /^\d+$/.test(s.trim())
      ? new Date(parseInt(s.trim()) * 1000).toISOString().slice(0, 10)
      : null;
    return {
      domain: domain ? domain.trim() : null,
      authority_score: ascore ? parseInt(ascore.trim()) : null,
      backlinks_count: backlinks_num ? parseInt(backlinks_num.trim()) : null,
      first_seen: toDate(first_seen),
      last_seen: toDate(last_seen),
    };
  }).filter(r => r.domain);
}

async function main() {
  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to Neon DB');

    const snapshot_date = new Date().toISOString().slice(0, 10);
    console.log('snapshot_date:', snapshot_date);

    // a) Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS semrush_backlinks (
        snapshot_date DATE PRIMARY KEY,
        authority_score INT,
        total_backlinks INT,
        referring_domains INT,
        referring_ips INT,
        follow_links INT,
        nofollow_links INT
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS semrush_refdomains (
        id SERIAL,
        snapshot_date DATE NOT NULL,
        domain TEXT NOT NULL,
        authority_score INT,
        backlinks_count INT,
        first_seen DATE,
        last_seen DATE,
        PRIMARY KEY (snapshot_date, domain)
      )
    `);
    console.log('Tables ensured.');

    // b) Upsert overview
    const overview = parseOverview(OVERVIEW_CSV);
    console.log('Overview:', overview);

    await client.query(`
      INSERT INTO semrush_backlinks
        (snapshot_date, authority_score, total_backlinks, referring_domains, referring_ips, follow_links, nofollow_links)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (snapshot_date) DO UPDATE SET
        authority_score = EXCLUDED.authority_score,
        total_backlinks = EXCLUDED.total_backlinks,
        referring_domains = EXCLUDED.referring_domains,
        referring_ips = EXCLUDED.referring_ips,
        follow_links = EXCLUDED.follow_links,
        nofollow_links = EXCLUDED.nofollow_links
    `, [
      snapshot_date,
      overview.authority_score,
      overview.total_backlinks,
      overview.referring_domains,
      overview.referring_ips,
      overview.follow_links,
      overview.nofollow_links,
    ]);
    console.log('Upserted backlinks overview row.');

    // c) Delete existing refdomains for today
    await client.query(`DELETE FROM semrush_refdomains WHERE snapshot_date = $1`, [snapshot_date]);
    console.log('Deleted existing refdomains for', snapshot_date);

    // d) Insert all referring domain rows
    const refdomains = parseRefdomains(REFDOMAINS_CSV);
    console.log(`Parsed ${refdomains.length} referring domains`);

    for (const r of refdomains) {
      await client.query(`
        INSERT INTO semrush_refdomains
          (snapshot_date, domain, authority_score, backlinks_count, first_seen, last_seen)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [snapshot_date, r.domain, r.authority_score, r.backlinks_count, r.first_seen, r.last_seen]);
    }

    // e) Log summary
    const countResult = await client.query(
      `SELECT COUNT(*) FROM semrush_refdomains WHERE snapshot_date = $1`, [snapshot_date]
    );
    console.log('\n=== UPSERT COMPLETE ===');
    console.log('snapshot_date:', snapshot_date);
    console.log('authority_score:', overview.authority_score);
    console.log('total_backlinks:', overview.total_backlinks);
    console.log('referring_domains:', overview.referring_domains);
    console.log('referring_ips:', overview.referring_ips);
    console.log('follow_links:', overview.follow_links);
    console.log('nofollow_links:', overview.nofollow_links);
    console.log('referring domains inserted:', countResult.rows[0].count);

  } catch (err) {
    console.error('ERROR:', err.message || err);
    console.error('Stack:', err.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
