// SEMrush Backlinks Upsert — ledsone.co.uk
// Uses @neondatabase/serverless (HTTPS/WebSocket) to bypass port-5432 restrictions.

const { neon } = require('../node_modules/@neondatabase/serverless');

const CONNECTION_STRING =
  'postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';

// ── Data fetched from SEMrush this run ──────────────────────────────────────
const OVERVIEW = {
  authority_score:   30,
  total_backlinks:   19647,
  referring_domains: 676,
  referring_ips:     749,
  follow_links:      17804,
  nofollow_links:    1852,
};

// Referring domains — dates are Unix epoch seconds from SEMrush API.
const REFDOMAINS_RAW = [
  ['ledsone.nl',                  9,  5709, 1763204426, 1787535896],
  ['directory9.biz',              5,  4503, 1699893010, 1787537017],
  ['syncee.com',                 35,  1825, 1743708314, 1787471328],
  ['coles-directory.com',        18,  1247, 1710460860, 1787517341],
  ['prolink-directory.com',       6,   941, 1699938142, 1787537630],
  ['secretsearchenginelabs.com', 15,   659, 1713428580, 1787030317],
  ['fennax.com',                  1,   395, 1781933790, 1785967652],
  ['interesting-dir.com',         6,   324, 1682744642, 1785082916],
  ['postfreedirectory.com',       7,   245, 1717630165, 1787525466],
  ['celestialdirectory.com',      7,   157, 1736384169, 1787507200],
  ['snipesocial.co.uk',          29,   157, 1701038561, 1784943134],
];

const epochToDate = (epoch) =>
  epoch ? new Date(epoch * 1000).toISOString().slice(0, 10) : null;

const REFDOMAINS = REFDOMAINS_RAW.map(([domain, ascore, backlinks_num, fs, ls]) => ({
  domain,
  ascore,
  backlinks_num,
  first_seen: epochToDate(fs),
  last_seen:  epochToDate(ls),
}));

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const sql = neon(CONNECTION_STRING);
  const snapshot_date = new Date().toISOString().slice(0, 10);
  console.log(`\n=== SEMrush backlinks upsert — snapshot_date: ${snapshot_date} ===\n`);

  try {
    // a) Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS semrush_backlinks (
        snapshot_date     DATE PRIMARY KEY,
        authority_score   INT,
        total_backlinks   INT,
        referring_domains INT,
        referring_ips     INT,
        follow_links      INT,
        nofollow_links    INT
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS semrush_refdomains (
        id               SERIAL,
        snapshot_date    DATE NOT NULL,
        domain           TEXT NOT NULL,
        authority_score  INT,
        backlinks_count  INT,
        first_seen       DATE,
        last_seen        DATE,
        PRIMARY KEY (snapshot_date, domain)
      )`;
    console.log('Tables ensured.');

    // b) Upsert overview
    await sql`
      INSERT INTO semrush_backlinks
        (snapshot_date, authority_score, total_backlinks, referring_domains, referring_ips, follow_links, nofollow_links)
      VALUES
        (${snapshot_date}, ${OVERVIEW.authority_score}, ${OVERVIEW.total_backlinks},
         ${OVERVIEW.referring_domains}, ${OVERVIEW.referring_ips},
         ${OVERVIEW.follow_links}, ${OVERVIEW.nofollow_links})
      ON CONFLICT (snapshot_date) DO UPDATE SET
        authority_score   = EXCLUDED.authority_score,
        total_backlinks   = EXCLUDED.total_backlinks,
        referring_domains = EXCLUDED.referring_domains,
        referring_ips     = EXCLUDED.referring_ips,
        follow_links      = EXCLUDED.follow_links,
        nofollow_links    = EXCLUDED.nofollow_links`;
    console.log('Backlinks overview upserted:', OVERVIEW);

    // c) Delete today's refdomains (clean re-run)
    await sql`DELETE FROM semrush_refdomains WHERE snapshot_date = ${snapshot_date}`;

    // d) Insert referring domains
    for (const row of REFDOMAINS) {
      await sql`
        INSERT INTO semrush_refdomains
          (snapshot_date, domain, authority_score, backlinks_count, first_seen, last_seen)
        VALUES
          (${snapshot_date}, ${row.domain}, ${row.ascore},
           ${row.backlinks_num}, ${row.first_seen}, ${row.last_seen})`;
    }

    // e) Summary log
    console.log(`\nSummary:`);
    console.log(`  snapshot_date:       ${snapshot_date}`);
    console.log(`  authority_score:     ${OVERVIEW.authority_score}`);
    console.log(`  total_backlinks:     ${OVERVIEW.total_backlinks}`);
    console.log(`  referring_domains:   ${OVERVIEW.referring_domains}`);
    console.log(`  referring_ips:       ${OVERVIEW.referring_ips}`);
    console.log(`  follow_links:        ${OVERVIEW.follow_links}`);
    console.log(`  nofollow_links:      ${OVERVIEW.nofollow_links}`);
    console.log(`  refdomains inserted: ${REFDOMAINS.length}`);
    console.log('\nDone ✓');
  } catch (err) {
    console.error('ERROR:', err.message || err);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
}

main();
