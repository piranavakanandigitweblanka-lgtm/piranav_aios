#!/usr/bin/env node
'use strict';

const { Client } = require('../node_modules/pg');

// Set NEON_CONNECTION_STRING env var before running
const CONNECTION_STRING = process.env.NEON_CONNECTION_STRING || (() => { throw new Error('NEON_CONNECTION_STRING env var not set'); })();

const OVERVIEW_CSV = `ascore;total;domains_num;ips_num;follows_num;nofollows_num
30;20269;837;881;18428;1840`;

const REFDOMAINS_CSV = `domain;domain_ascore;backlinks_num;first_seen;last_seen
ledsone.nl;8;5954;1763204426;1792369391
directory9.biz;5;4957;1699893010;1792375693
syncee.com;35;1643;1743708314;1792333561
coles-directory.com;17;1238;1710460860;1792332430
prolink-directory.com;5;1086;1699938142;1792374446
secret searchenginelabs.com;16;580;1713428580;1792327389
fennax.com;1;395;1781933790;1786716830
postfreedirectory.com;6;240;1717630165;1791354561
interesting-dir.com;6;175;1682744642;1785082916
celestialdirectory.com;7;157;1736384169;1792363100
snipesocial.co.uk;29;152;1701038561;1784943134
addirectory.org;6;124;1704156187;1790775702
lidsone.com;2;121;1789250582;1792375423
nichey.net;5;115;1755965528;1792054829
blogfaspec.com.br;11;84;1783176361;1792376946
yell.com;69;83;1708175365;1792258220
tahaduth.com;6;81;1699945193;1777357879
menagerie.media;6;72;1701298161;1792217864
yoo.bio;5;63;1758166442;1777646582
patriabook.com;16;57;1702388478;1792226715
bulkpostads.com;13;56;1754686562;1788006938
golden-forum.com;26;53;1703723378;1779991710
blog-directory.org;20;47;1757255753;1792335144
weboworld.com;19;44;1723926437;1787244209
pointblog.net;24;42;1757427275;1792355973
royallinkup.com;5;41;1693742435;1792278943
activoblog.com;24;38;1757505037;1785292327
streambang.com;5;38;1701421992;1791817673
insta.tel;5;37;1706430448;1784708810
smartseobacklink.com;4;37;1715722589;1781791046
undewall.com;5;36;1736035749;1791338343
openbadania.pl;29;35;1703136521;1791436189
ecomscout.com;19;33;1770922364;1789314281
theavtar.in;5;31;1711000904;1790116727
promorapid.com;14;30;1703154684;1790578928
decor liya.co.uk;2;28;1727435640;1792099841
kilnandclayinteriors.com;2;28;1723698409;1788494993
ledsone.fr;11;28;1763735160;1790512533
linkeei.com;6;28;1701642251;1792212708
theseobacklink.com;12;26;1759419669;1782830889
friend007.com;6;25;1704416274;1792195074
trustado.com;2;24;1789891116;1792254740
winnowmarket.com;6;24;1787448972;1791238555
articledirectoryzone.com;6;23;1703719961;1791728878
blog-dir-new.vercel.app;5;20;1741631381;1783180380
blog-gold.com;21;20;1759273499;1785239154
blogdigy.com;6;20;1757827273;1792370179
geto.space;6;20;1742203866;1791624223
bresdel.com;32;19;1703739707;1791951767
cloutapps.com;6;19;1702378531;1785499556
electricalsone.co.uk;17;18;1725261574;1792079517
southernlanka.lk;7;18;1759774411;1773875715
video-bookmark.com;21;18;1732317086;1790114741
instya.com;23;17;1758401002;1792290798
writeupcafe.com;39;17;1752892756;1791637290
aboutyoublog.com;6;16;1765550064;1787333497
advertall.co.uk;12;16;1707415472;1792034878
dimoradesign.co.uk;6;16;1763397673;1785783240
myrealex.com;21;16;1704859245;1783021882
perfect-garden.co.uk;7;16;1744288939;1791175286
hunted.space;7;15;1782917325;1791514080
ledskinn.com;6;15;1788567682;1790882032
americanaccent.com;21;14;1747868093;1789474221
bestfirms.org;5;14;1782591509;1791343917
blacksocially.com;6;14;1708357298;1790786830
blog5.net;6;14;1772301005;1791144159
llmstxtchecker.net;14;14;1772143447;1791334720
adsbench.com;7;13;1789907607;1791226404
beesetups.com;15;13;1785559260;1792336381
novapulseplus.com;6;13;1788133346;1791901099
parse.gl;31;13;1777952315;1788792353
premiumhomeliving.shop;0;13;1783682886;1786653012
company.site;50;12;1733509575;1785357216
vihaindia.com;2;12;1745001518;1786165556
articlecede.com;11;11;1706714962;1791203312
decor inall.com;7;11;1768810051;1791974425
ledsone.de;12;11;1726381549;1789846661
pamzden.com;2;11;1761572179;1782878609
bhimchat.com;6;10;1702820047;1791388430
directory-fast.com;6;10;1759452983;1787366675
directoryio.com;5;10;1765571140;1791858637
frustratedgamers.com;5;10;1785298369;1786538117
globalsourceus.in;2;10;1749740735;1782753765
planner5d.com;60;10;1744950785;1791971531
robustdirectory.com;5;10;1759531357;1788453479
wego.social;21;10;1702247429;1782635935
worlds-directory.com;6;10;1759454692;1788443706
ijao.in;12;9;1751107394;1777801945
omg-directory.com;6;9;1766956924;1788771161
relicelectrical.ca;9;9;1723151151;1783529375
viesearch.com;29;9;1751766876;1792345048
webdirectory11.com;6;9;1768913628;1788374473
yuneyoga.com;30;9;1783211742;1792313241
changingfaceshousing.com;2;8;1755587299;1777001374
directory-nation.com;6;8;1759518031;1788347174
directoryholiday.com;6;8;1769770317;1788554053
followingbook.com;17;8;1701515257;1792258774
legit-directory.com;5;8;1770059184;1789349263
nilinknet.com;5;8;1702402809;1780792909
novapick.co.uk;2;8;1782093390;1792173875
tapalmbeaches.com;2;8;1733794112;1776165550
tb-plastic.com;7;8;1753098252;1784281451
alibaba.com;79;7;1782962590;1791362554
associazioneagricoltorivalleverzasca.ch;3;7;1750694116;1785623821
bing.com;96;7;1769023275;1791322383
era-zine.com;12;7;1785138802;1792356565
gaming-walker.com;6;7;1718751343;1783585797
instock.net;16;7;1723924921;1790756223
kabelprofide.com;2;7;1782165093;1782892305
ledsone.us;10;7;1771926362;1788912689
thatgiftstore.com;2;7;1724563111;1790341566
trendyhomeprime.com;2;7;1777094214;1792347604
vividfinds.co.uk;2;7;1787044887;1789696464
articlesjust4you.com;6;6;1700185304;1789316272
chumsay.com;21;6;1716914816;1777633923
dostally.com;6;6;1720000094;1776279748
entrepreneurscruise.com;12;6;1749014275;1778485398
evertrendcollective.co.uk;2;6;1783031343;1785146413
fbaglobal.org.br;2;6;1785983872;1790632716
fixithomehub.com;2;6;1786775238;1792116737
happyinteriors.store;6;6;1768357872;1789250779
hugsqueeze.com;13;6;1714336968;1781719480
mstradeagency.com.bd;2;6;1732664802;1780408291
novamarketing.ai;8;6;1784568336;1791986366
thegeneraltrader.co.uk;0;6;1778880903;1788935814
theterrahome.com;8;6;1756892486;1791083941
ubooks.app;16;6;1757563790;1786153118
urgclub.com;22;6;1703183349;1790162057
uschool.asia;7;6;1790860375;1792321095
windowssearch-exp.com;5;6;1763131548;1786055723
your-directory.com;6;6;1759520386;1784410604
accio.com;54;5;1774986831;1790925008
buysomelamps.com;2;5;1762573653;1776856925
futurexperience.shop;2;5;1759650582;1790932805
gearcycler.com;7;5;1784049059;1792243691
habibnco.com;6;5;1757889021;1786122498
kroxam.com;34;5;1754896082;1778376378
ljuus.ch;2;5;1784021446;1792122023
palscity.com;33;5;1711366520;1788441902
prinsnova.uk;0;5;1788288807;1789137337
repowering.fr;5;5;1785000736;1791541572
rolonet.com;5;5;1765132501;1775982376
runninglightvest.com;2;5;1740891684;1786237868
safetechinnovation.com;9;5;1754354269;1777397931
stylenpatternuk.com;2;5;1790623541;1792199050
takes.homes;2;5;1765172025;1791146888
tegara.net;19;5;1750146207;1782571182
udhee.com;6;5;1750221162;1783156809
vherso.com;6;5;1708042164;1789168999
adstores.shop;2;4;1777431609;1786111554
agribusinessnews.co;2;4;1738669570;1782905037
allare.io;3;4;1776644288;1790358631
alllebaneses.xyz;2;4;1753004490;1780496072
asempashop.com;0;4;1780826906;1781249600
bruceonlineworld.com;2;4;1754087271;1786696092
croftandkind.co.uk;2;4;1788324057;1791714704
dabworldstore.com;0;4;1766249750;1778968526
electricalsafetyfirst.org.uk;55;4;1724428087;1791319877
fabricadestiri.ro;2;4;1785792597;1791984960
factmags.com;4;4;1771889057;1791652568
find-open.co.uk;24;4;1780734896;1791408605
hearthsidehome.store;1;4;1781037134;1781601299
jizzaxteatr.uz;2;4;1752975309;1790502106
kitabibrothers.com;2;4;1740937954;1783225142
livestiri.ro;2;4;1784272714;1790819834
lydiaroyrealestate.com;2;4;1782609882;1791888407
mjc-fs.com;20;4;1791743929;1792349357
outletvibe.com;2;4;1760260814;1784947657
poidata.io;19;4;1756855293;1786681933
rvandwild.com;2;4;1783735743;1784651861
sizzlinslices.com.au;7;4;1759216972;1788712450
socialbookmarkssite.com;15;4;1725716855;1775866332
submitafreearticle.com;5;4;1704904995;1789829337
westernsport.com;28;4;1786140166;1788187611
youslade.com;6;4;1701398043;1784380631
zunarae.com;2;4;1756411608;1785774868
6i62sy-kg.myshopify.com;0;3;1790546192;1791723733
adpost.com;34;3;1776238872;1791799628
allmartltd.com;7;3;1784935596;1790747819
allwebsitesdirectory.com;2;3;1767468744;1791829623
americanstonecenter.com;7;3;1785280803;1787015071
b2b-invest.ro;2;3;1786416385;1792126555
beritapagi.id;3;3;1762370971;1775287685
bestwebstats.com;3;3;1772805329;1792009977
bigalexsbestdeals.com;2;3;1756825933;1784741407
bizjetnation.com;7;3;1783387234;1792339411
bookmark4you.com;30;3;1724781772;1791236825
broersmotor.com;2;3;1751829515;1778198425
credoeco.com;2;3;1768556739;1781803120
derbytelegraph.co.uk;50;3;1778914352;1786523132
domain.com.lc;2;3;1774968950;1791317611
domainanalysis.org;2;3;1773609660;1791720725
domainsc.com;2;3;1772692490;1791380365
egyptiandirectory.com;2;3;1769022254;1781876478
getwebsiteworth.com;3;3;1765091289;1790067802
globalecommerce.org;3;3;1766040205;1789517836
godstudio.co.in;8;3;1758522610;1783631668
growthcentr.com;3;3;1783592435;1792227894
iecarmendecarupa.edu.co;8;3;1756675692;1787606095
indians.cc;3;3;1769084055;1791896344`;

function parseUnixOrYYYYMMDD(s) {
  if (!s) return null;
  // Unix timestamp (10+ digit number)
  if (/^\d{9,11}$/.test(s)) {
    return new Date(parseInt(s, 10) * 1000).toISOString().slice(0, 10);
  }
  // YYYYMMDD format
  if (/^\d{8}$/.test(s)) {
    return s.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  }
  return null;
}

async function main() {
  const snapshot_date = new Date().toISOString().slice(0, 10);

  // Parse overview
  const overviewLines = OVERVIEW_CSV.trim().split('\n');
  const overviewVals = overviewLines[1].split(';');
  const overview = {
    authority_score: parseInt(overviewVals[0], 10),
    total_backlinks: parseInt(overviewVals[1], 10),
    referring_domains: parseInt(overviewVals[2], 10),
    referring_ips: parseInt(overviewVals[3], 10),
    follow_links: parseInt(overviewVals[4], 10),
    nofollow_links: parseInt(overviewVals[5], 10),
  };

  // Parse refdomains
  const refdLines = REFDOMAINS_CSV.trim().split('\n');
  const refdRows = refdLines.slice(1).map(line => {
    const parts = line.split(';');
    return {
      domain: parts[0],
      authority_score: parts[1] ? parseInt(parts[1], 10) : null,
      backlinks_count: parts[2] ? parseInt(parts[2], 10) : null,
      first_seen: parseUnixOrYYYYMMDD(parts[3]),
      last_seen: parseUnixOrYYYYMMDD(parts[4]),
    };
  });

  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to Neon DB');

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
    console.log('Tables ensured');

    // b) Upsert overview
    await client.query(`
      INSERT INTO semrush_backlinks
        (snapshot_date, authority_score, total_backlinks, referring_domains, referring_ips, follow_links, nofollow_links)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
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
    console.log(`Upserted backlinks overview for ${snapshot_date}`);

    // c) Delete existing refdomains for today
    await client.query('DELETE FROM semrush_refdomains WHERE snapshot_date = $1', [snapshot_date]);
    console.log(`Cleared existing refdomains for ${snapshot_date}`);

    // d) Insert all refdomains
    for (const row of refdRows) {
      await client.query(`
        INSERT INTO semrush_refdomains
          (snapshot_date, domain, authority_score, backlinks_count, first_seen, last_seen)
        VALUES ($1,$2,$3,$4,$5,$6)
      `, [snapshot_date, row.domain, row.authority_score, row.backlinks_count, row.first_seen, row.last_seen]);
    }

    // e) Log summary
    console.log('\n=== UPSERT COMPLETE ===');
    console.log(`snapshot_date:     ${snapshot_date}`);
    console.log(`authority_score:   ${overview.authority_score}`);
    console.log(`total_backlinks:   ${overview.total_backlinks}`);
    console.log(`referring_domains: ${overview.referring_domains}`);
    console.log(`referring_ips:     ${overview.referring_ips}`);
    console.log(`follow_links:      ${overview.follow_links}`);
    console.log(`nofollow_links:    ${overview.nofollow_links}`);
    console.log(`refdomains inserted: ${refdRows.length}`);

  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
