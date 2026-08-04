const { neon } = require('../node_modules/@neondatabase/serverless');

const CONNECTION_STRING = 'postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';

// Data fetched from SEMrush
const overview = {
  authority_score: 30,
  total_backlinks: 18368,
  referring_domains: 618,
  referring_ips: 683,
  follow_links: 16582,
  nofollow_links: 1789,
};

// Unix timestamp → YYYY-MM-DD
const tsToDate = (ts) => ts ? new Date(Number(ts) * 1000).toISOString().slice(0, 10) : null;

const refdomains = [
  ['ledsone.nl',9,5235,1763204426,1785804925],
  ['directory9.biz',5,4103,1699893010,1785813812],
  ['syncee.com',34,1801,1743708314,1785786095],
  ['coles-directory.com',18,1229,1710460860,1785815338],
  ['prolink-directory.com',6,851,1699938142,1785786647],
  ['secretsearchenginelabs.com',16,647,1713428580,1785561194],
  ['fennax.com',2,395,1781933790,1784390391],
  ['interesting-dir.com',6,321,1682744642,1782814492],
  ['postfreedirectory.com',7,223,1717630165,1785669838],
  ['celestialdirectory.com',7,157,1737774347,1785816972],
  ['snipesocial.co.uk',29,157,1701038561,1784943134],
  ['addirectory.org',6,145,1711569757,1783513444],
  ['nichey.net',12,117,1755965528,1785422524],
  ['tapalmbeaches.com',2,116,1733710059,1776165550],
  ['openbadania.pl',29,97,1699933597,1781999837],
  ['tahaduth.com',6,87,1699945193,1777357879],
  ['menagerie.media',6,67,1701298161,1784513430],
  ['yell.com',69,67,1708175365,1785797121],
  ['bulkpostads.com',13,66,1767090489,1785698274],
  ['yoo.bio',5,66,1758166442,1777646582],
  ['patriabook.com',15,57,1702388478,1785779431],
  ['golden-forum.com',26,55,1703723378,1779991710],
  ['weboworld.com',25,49,1723926437,1785239571],
  ['insta.tel',5,44,1706430448,1783136720],
  ['pointblog.net',24,42,1757403215,1785473159],
  ['kilnandclayinteriors.com',2,41,1723698409,1781558487],
  ['royallinkup.com',11,39,1693742435,1785559564],
  ['smartseobacklink.com',4,39,1715722589,1781791046],
  ['activoblog.com',24,38,1757499912,1785292327],
  ['blog-dir-new.vercel.app',5,38,1741631381,1783180380],
  ['streambang.com',5,36,1701421992,1785716921],
  ['undewall.com',5,34,1736035749,1783432334],
  ['ledsone.fr',9,33,1762055819,1784586145],
  ['ecomscout.com',15,32,1770922364,1784534971],
  ['theavtar.in',6,31,1711000904,1785514944],
  ['decorliya.co.uk',6,26,1727435640,1784459726],
  ['theseobacklink.com',12,26,1759419669,1782830889],
  ['friend007.com',6,25,1705363096,1783641637],
  ['articledirectoryzone.com',6,23,1703719961,1783433226],
  ['linkeei.com',6,23,1702045148,1785362461],
  ['blog-directory.org',20,22,1758339329,1784280280],
  ['promorapid.com',13,22,1703154684,1782014093],
  ['blog-gold.com',21,20,1759260313,1785239154],
  ['blogdigy.com',6,20,1757807721,1785816050],
  ['decorinall.com',6,20,1768649604,1782612356],
  ['geto.space',6,20,1742203866,1785393699],
  ['cloutapps.com',16,18,1707158120,1779889895],
  ['southernlanka.lk',7,18,1759774411,1773875715],
  ['video-bookmark.com',21,18,1732317086,1784879538],
  ['wego.social',21,18,1702247429,1774372971],
  ['instya.com',26,17,1758401002,1785775370],
  ['writeupcafe.com',35,17,1752892756,1785422215],
  ['aboutyoublog.com',6,16,1765550064,1785308814],
  ['advertall.co.uk',12,16,1707415472,1785795249],
  ['chumsay.com',21,16,1701296595,1777633923],
  ['dalbofest.com',2,16,1754532524,1770805613],
  ['dimoradesign.co.uk',2,16,1763397673,1783484211],
  ['myrealex.com',21,16,1704859245,1783021882],
  ['blog5.net',6,15,1758462404,1785790374],
  ['llmstxtchecker.net',8,14,1772143447,1785736154],
  ['americanaccent.com',21,13,1747868093,1778652087],
  ['ijao.in',12,13,1751107394,1777801945],
  ['premiumhomeliving.shop',2,13,1783682886,1785642049],
  ['blacksocially.com',6,12,1708357298,1780002660],
  ['company.site',50,12,1733509575,1783419063],
  ['articlecede.com',11,11,1708747790,1783783021],
  ['blogfaspec.com.br',10,11,1783176361,1785641481],
  ['bresdel.com',28,11,1704548371,1781089711],
  ['pamzden.com',2,11,1761572179,1782878609],
  ['vherso.com',6,11,1709869767,1784050825],
  ['bestfirms.org',2,10,1782591509,1785748028],
  ['bhimchat.com',22,10,1702820047,1784255218],
  ['directory-fast.com',6,10,1759452983,1785439894],
  ['electricalsone.co.uk',11,10,1727798692,1785423449],
  ['globalsourceus.in',2,10,1749740735,1782753765],
  ['kroxam.com',34,10,1753189552,1778376378],
  ['robustdirectory.com',5,10,1759531357,1784764198],
  ['vihaindia.com',2,10,1745001518,1782954232],
  ['weig-bft.com',4,10,1745231896,1774674041],
  ['worlds-directory.com',6,10,1759454692,1785341452],
  ['changingfaceshousing.com',2,9,1755396622,1777001374],
  ['directoryio.com',5,9,1765571140,1785300482],
  ['dostally.com',6,9,1714980590,1776279748],
  ['entrepreneurscruise.com',12,9,1742433040,1778485398],
  ['omg-directory.com',6,9,1766956924,1783181523],
  ['planner5d.com',59,9,1744950785,1785146641],
  ['relicelectrical.ca',9,9,1723151151,1783529375],
  ['webdirectory11.com',6,9,1768913628,1784922937],
  ['directory-nation.com',6,8,1759518031,1785801374],
  ['directoryholiday.com',6,8,1769770317,1785727131],
  ['ekcochat.com',6,8,1706795254,1771269461],
  ['gaming-walker.com',6,8,1718751343,1783258026],
  ['legit-directory.com',5,8,1770059184,1785523217],
  ['nilinknet.com',5,8,1707726069,1780792909],
  ['your-directory.com',6,8,1759520386,1784410604],
  ['yuneyoga.com',27,8,1783211742,1785786872],
  ['bluepirate.co.uk',2,7,1751105052,1774249703],
  ['buysomelamps.com',2,7,1762573653,1776856925],
  ['followingbook.com',20,7,1701515257,1784354186],
  ['kabelprofide.com',2,7,1782165093,1782892305],
  ['trendyhomeprime.com',2,7,1777094214,1785331087],
  ['articlesjust4you.com',6,6,1700185304,1785462779],
  ['evertrendcollective.co.uk',2,6,1783031343,1785146413],
  ['happyinteriors.store',2,6,1768357872,1785730786],
  ['hugsqueeze.com',13,6,1714336968,1781719480],
  ['instock.net',17,6,1723924921,1781065590],
  ['mstradeagency.com.bd',2,6,1732664802,1780408291],
  ['novapick.co.uk',2,6,1782093390,1784725314],
  ['palscity.com',33,6,1710707028,1785250458],
  ['perfect-garden.co.uk',6,6,1744288939,1785668391],
  ['rolonet.com',5,6,1763702797,1775982376],
  ['socialbookmarkssite.com',15,6,1725716855,1775866332],
  ['tb-plastic.com',2,6,1753098252,1780971033],
  ['thegeneraltrader.co.uk',0,6,1778880903,1779948458],
  ['viesearch.com',28,6,1751766876,1782690027],
  ['windowssearch-exp.com',5,6,1763131548,1785112667],
  ['alllebaneses.xyz',2,5,1753004490,1780496072],
  ['associazioneagricoltorivalleverzasca.ch',3,5,1752848541,1781879065],
  ['burrardstreetjournal.com',23,5,1738305135,1773475903],
  ['dabworldstore.com',0,5,1766249750,1778968526],
  ['kwiko.io',2,5,1753444623,1776724636],
  ['ledsone.de',11,5,1726381549,1778737676],
  ['ledsone.us',8,5,1771926362,1781515557],
  ['safetechinnovation.com',9,5,1754354269,1777397931],
  ['scmbh.com',2,5,1747395342,1776069812],
  ['tegara.net',19,5,1750146207,1782571182],
  ['thatgiftstore.com',2,5,1724563111,1784604151],
  ['udhee.com',6,5,1750221162,1783156809],
  ['veirix.com',2,5,1759276470,1775808746],
  ['zunarae.com',2,5,1756411608,1785774868],
  ['accio.com',54,4,1774986831,1785520149],
  ['adstores.shop',2,4,1777431609,1783525774],
  ['agribusinessnews.co',2,4,1738669570,1782905037],
  ['ai.florist',2,4,1717219835,1772507323],
  ['asempashop.com',0,4,1780826906,1781249600],
  ['bing.com',97,4,1759147469,1779920710],
  ['bruceonlineworld.com',2,4,1754087271,1782737092],
  ['dekorheim.store',2,4,1768892610,1773714015],
  ['electricalsafetyfirst.org.uk',58,4,1724428087,1785301589],
  ['factmags.com',4,4,1771889057,1785606876],
  ['frustratedgamers.com',5,4,1785298369,1785432698],
  ['hearthsidehome.store',1,4,1781037134,1781601299],
  ['kitabibrothers.com',2,4,1740937954,1783225142],
  ['lasch-o-mat.de',5,4,1771246309,1771418907],
  ['lilianabphotography.com',7,4,1738690351,1773053093],
  ['ljuus.ch',2,4,1784021446,1785806077],
  ['poidata.io',15,4,1756855293,1783095026],
  ['rvandwild.com',2,4,1783735743,1784651861],
  ['shopinja.com',10,4,1737973028,1782658782],
  ['submitafreearticle.com',5,4,1704904995,1780552863],
  ['takes.homes',2,4,1765172025,1783817453],
  ['theterrahome.com',6,4,1756892486,1779191282],
  ['ubooks.app',16,4,1757563790,1782506481],
  ['urgclub.com',28,4,1723781471,1781167132],
  ['youslade.com',6,4,1701398043,1784380631],
  ['acompio.co.uk',28,3,1728569114,1784846603],
  ['adpost.com',33,3,1751237713,1782170752],
  ['aidatrends.com',2,3,1765345908,1774332651],
  ['alibaba.com',80,3,1782962590,1785654877],
  ['allwebsitesdirectory.com',2,3,1767468744,1785806655],
  ['beritapagi.id',3,3,1762370971,1775287685],
  ['bestwebstats.com',2,3,1772805329,1785799064],
  ['bigalexsbestdeals.com',2,3,1756825933,1784741407],
  ['bookmark4you.com',28,3,1724781772,1777416530],
  ['broersmotor.com',2,3,1751829515,1778198425],
  ['credoeco.com',2,3,1768556739,1781803120],
  ['denbighharriers.com',2,3,1739339336,1772768219],
  ['domain.com.lc',2,3,1774968950,1785809815],
  ['domainanalysis.org',2,3,1773609660,1785079709],
  ['domainsc.com',2,3,1772692490,1785447250],
  ['egyptiandirectory.com',2,3,1769022254,1781876478],
  ['ekaplast.ro',2,3,1746631562,1777744305],
  ['getwebsiteworth.com',3,3,1765091289,1785641984],
  ['globalecommerce.org',3,3,1766040205,1785325270],
  ['growthcentr.com',2,3,1783592435,1785003037],
  ['habibnco.com',2,3,1757889021,1781922888],
  ['hebagh.cv',2,3,1770708412,1781423268],
  ['indians.cc',2,3,1769084055,1785525856],
  ['juriwaldiner.adv.br',2,3,1753658408,1780411219],
  ['lillybeautymedspasanrafael.com',6,3,1749686683,1782735797],
  ['linkcentre.com',31,3,1766718324,1784110567],
  ['linksnatcher.com',2,3,1768317019,1785680682],
  ['matarabodhiya.org',8,3,1755503419,1775516503],
  ['musweb.org',2,3,1766947399,1773137290],
  ['novari-shop.com',2,3,1769003936,1770282013],
  ['odinluxury.com',2,3,1741089771,1777864117],
  ['pietraoven.co.il',6,3,1750262040,1776763196],
  ['prosurfacecleanltd.co.uk',2,3,1764063228,1772908837],
  ['read.org.in',2,3,1767868878,1782233457],
  ['repowering.fr',5,3,1785000736,1785725824],
  ['runninglightvest.com',2,3,1740891684,1782706998],
  ['scoppa.shop',2,3,1783627903,1785661172],
  ['seodomains.website',2,3,1778813961,1785420711],
  ['simplifiedseotools.com',12,3,1710748198,1773073008],
  ['sizzlinslices.com.au',7,3,1759216972,1780251182],
  ['solomonpress.in',9,3,1750489219,1781522706],
  ['solutionstosuit.com',2,3,1773507415,1777186176],
  ['stellentdxb.com',2,3,1751119217,1772407484],
  ['tayden.shop',0,3,1780509264,1780509264],
  ['theroadtoglenlough.com',2,3,1749430156,1778602097],
].map(([domain, ascore, backlinks_num, first_seen, last_seen]) => ({
  domain,
  authority_score: ascore,
  backlinks_count: backlinks_num,
  first_seen: tsToDate(first_seen),
  last_seen: tsToDate(last_seen),
}));

async function main() {
  const snapshot_date = new Date().toISOString().slice(0, 10);

  try {
    const sql = neon(CONNECTION_STRING);
    console.log('Neon HTTP driver initialised');

    // a) Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS semrush_backlinks (
        snapshot_date DATE PRIMARY KEY,
        authority_score INT,
        total_backlinks INT,
        referring_domains INT,
        referring_ips INT,
        follow_links INT,
        nofollow_links INT
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS semrush_refdomains (
        id SERIAL,
        snapshot_date DATE NOT NULL,
        domain TEXT NOT NULL,
        authority_score INT,
        backlinks_count INT,
        first_seen DATE,
        last_seen DATE,
        PRIMARY KEY (snapshot_date, domain)
      )`;
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
        nofollow_links    = EXCLUDED.nofollow_links`;
    console.log('Upserted backlinks overview');

    // c) Delete existing refdomains for today (clean re-run)
    await sql`DELETE FROM semrush_refdomains WHERE snapshot_date = ${snapshot_date}`;

    // d) Insert all referring domains
    for (const row of refdomains) {
      await sql`
        INSERT INTO semrush_refdomains (snapshot_date, domain, authority_score, backlinks_count, first_seen, last_seen)
        VALUES (${snapshot_date}, ${row.domain}, ${row.authority_score}, ${row.backlinks_count}, ${row.first_seen}, ${row.last_seen})`;
    }

    // e) Summary log
    console.log('--- SUMMARY ---');
    console.log('snapshot_date    :', snapshot_date);
    console.log('authority_score  :', overview.authority_score);
    console.log('total_backlinks  :', overview.total_backlinks);
    console.log('referring_domains:', overview.referring_domains);
    console.log('referring_ips    :', overview.referring_ips);
    console.log('follow_links     :', overview.follow_links);
    console.log('nofollow_links   :', overview.nofollow_links);
    console.log('refdomains inserted:', refdomains.length);

  } catch (err) {
    console.error('ERROR:', err.message || err);
    process.exit(1);
  }
}

main();
