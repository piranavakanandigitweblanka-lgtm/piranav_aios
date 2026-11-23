// SEMrush → Neon DB upsert script
// Run from: piranav_aios/Staff-requirements-02/
// Usage: CONNECTION_STRING=<neon-url> node semrush_upsert_template.js
// The full data-embedded version was generated on 2026-11-23 by the scheduled agent.
// Replace OVERVIEW_CSV and REFDOMAINS_CSV with fresh SEMrush data each run,
// or refactor to pass data in via CLI args / environment.

const { Client } = require('./node_modules/pg');

const CONNECTION_STRING = process.env.CONNECTION_STRING;
if (!CONNECTION_STRING) {
  console.error('Set CONNECTION_STRING env var to the Neon DB URL');
  process.exit(1);
}

function unixToDate(ts) {
  if (!ts || ts === '0') return null;
  return new Date(parseInt(ts, 10) * 1000).toISOString().slice(0, 10);
}

async function upsert({ overview, refdomains }) {
  const client = new Client({ connectionString: CONNECTION_STRING, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const snapshot_date = new Date().toISOString().slice(0, 10);

  await client.query(`
    CREATE TABLE IF NOT EXISTS semrush_backlinks (
      snapshot_date DATE PRIMARY KEY,
      authority_score INT, total_backlinks INT, referring_domains INT,
      referring_ips INT, follow_links INT, nofollow_links INT
    )`);
  await client.query(`
    CREATE TABLE IF NOT EXISTS semrush_refdomains (
      id SERIAL, snapshot_date DATE NOT NULL, domain TEXT NOT NULL,
      authority_score INT, backlinks_count INT, first_seen DATE, last_seen DATE,
      PRIMARY KEY (snapshot_date, domain)
    )`);

  await client.query(`
    INSERT INTO semrush_backlinks
      (snapshot_date, authority_score, total_backlinks, referring_domains, referring_ips, follow_links, nofollow_links)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    ON CONFLICT (snapshot_date) DO UPDATE SET
      authority_score=EXCLUDED.authority_score, total_backlinks=EXCLUDED.total_backlinks,
      referring_domains=EXCLUDED.referring_domains, referring_ips=EXCLUDED.referring_ips,
      follow_links=EXCLUDED.follow_links, nofollow_links=EXCLUDED.nofollow_links`,
    [snapshot_date, overview.authority_score, overview.total_backlinks,
     overview.referring_domains, overview.referring_ips, overview.follow_links, overview.nofollow_links]);

  await client.query(`DELETE FROM semrush_refdomains WHERE snapshot_date=$1`, [snapshot_date]);

  let count = 0;
  for (const row of refdomains) {
    await client.query(
      `INSERT INTO semrush_refdomains (snapshot_date,domain,authority_score,backlinks_count,first_seen,last_seen)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [snapshot_date, row.domain, row.authority_score, row.backlinks_count,
       unixToDate(row.first_seen), unixToDate(row.last_seen)]);
    count++;
  }

  console.log(`Done. snapshot_date=${snapshot_date}, refdomains_inserted=${count}`);
  console.log('Overview:', overview);
  await client.end();
}

module.exports = { upsert };
