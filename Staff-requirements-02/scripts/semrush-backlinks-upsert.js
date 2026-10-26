/**
 * SEMrush backlinks upsert — ledsone.co.uk
 * Runs as a scheduled task: fetches data already parsed from SEMrush API,
 * creates tables if needed, and upserts today's snapshot into Neon DB.
 */

const { Client } = require('../node_modules/pg');
const fs = require('fs');
const path = require('path');

const CONNECTION_STRING = process.env.NEON_CONNECTION_STRING || process.env.DATABASE_URL;
if (!CONNECTION_STRING) {
  console.error('ERROR: NEON_CONNECTION_STRING or DATABASE_URL environment variable is required');
  process.exit(1);
}

const SNAPSHOT_DATE = new Date().toISOString().slice(0, 10);

// Backlinks overview from SEMrush API (fetched this session)
const OVERVIEW = {
  authority_score:    30,
  total_backlinks:    20078,
  referring_domains:  834,
  referring_ips:      871,
  follow_links:       18293,
  nofollow_links:     1784,
};

// Convert Unix timestamp (seconds) to YYYY-MM-DD
const tsToDate = (s) => {
  if (!s || s === '') return null;
  const n = parseInt(s, 10);
  if (isNaN(n)) return null;
  return new Date(n * 1000).toISOString().slice(0, 10);
};

async function main() {
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
        snapshot_date      DATE PRIMARY KEY,
        authority_score    INT,
        total_backlinks    INT,
        referring_domains  INT,
        referring_ips      INT,
        follow_links       INT,
        nofollow_links     INT
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS semrush_refdomains (
        id              SERIAL,
        snapshot_date   DATE    NOT NULL,
        domain          TEXT    NOT NULL,
        authority_score INT,
        backlinks_count INT,
        first_seen      DATE,
        last_seen       DATE,
        PRIMARY KEY (snapshot_date, domain)
      )
    `);

    console.log('Tables ready');

    // b) Upsert backlinks overview
    await client.query(`
      INSERT INTO semrush_backlinks
        (snapshot_date, authority_score, total_backlinks, referring_domains, referring_ips, follow_links, nofollow_links)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (snapshot_date) DO UPDATE SET
        authority_score   = EXCLUDED.authority_score,
        total_backlinks   = EXCLUDED.total_backlinks,
        referring_domains = EXCLUDED.referring_domains,
        referring_ips     = EXCLUDED.referring_ips,
        follow_links      = EXCLUDED.follow_links,
        nofollow_links    = EXCLUDED.nofollow_links
    `, [
      SNAPSHOT_DATE,
      OVERVIEW.authority_score,
      OVERVIEW.total_backlinks,
      OVERVIEW.referring_domains,
      OVERVIEW.referring_ips,
      OVERVIEW.follow_links,
      OVERVIEW.nofollow_links,
    ]);

    console.log(`Upserted backlinks overview for ${SNAPSHOT_DATE}`);

    // c) Delete existing refdomains for today (clean re-run)
    await client.query('DELETE FROM semrush_refdomains WHERE snapshot_date = $1', [SNAPSHOT_DATE]);

    // d) Parse and insert referring domains from CSV
    const csvPath = process.argv[2];
    if (!csvPath) {
      throw new Error('Usage: node semrush-backlinks-upsert.js <path-to-refdomains.csv>');
    }

    const raw = fs.readFileSync(csvPath, 'utf8');
    const lines = raw.trim().split('\n');
    const dataLines = lines.slice(1); // skip header

    let insertCount = 0;

    for (const line of dataLines) {
      if (!line.trim()) continue;
      const cols = line.split(';');
      const domain        = cols[0]  || null;
      const ascore        = cols[1]  ? parseInt(cols[1], 10)  : null;
      const backlinks_num = cols[2]  ? parseInt(cols[2], 10)  : null;
      const first_seen    = tsToDate(cols[3]);
      const last_seen     = tsToDate(cols[4]);

      if (!domain) continue;

      await client.query(`
        INSERT INTO semrush_refdomains
          (snapshot_date, domain, authority_score, backlinks_count, first_seen, last_seen)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [SNAPSHOT_DATE, domain, ascore, backlinks_num, first_seen, last_seen]);

      insertCount++;
    }

    // e) Summary log
    console.log('');
    console.log('=== SEMrush Backlinks Upsert Complete ===');
    console.log(`snapshot_date:     ${SNAPSHOT_DATE}`);
    console.log(`authority_score:   ${OVERVIEW.authority_score}`);
    console.log(`total_backlinks:   ${OVERVIEW.total_backlinks}`);
    console.log(`referring_domains: ${OVERVIEW.referring_domains}`);
    console.log(`referring_ips:     ${OVERVIEW.referring_ips}`);
    console.log(`follow_links:      ${OVERVIEW.follow_links}`);
    console.log(`nofollow_links:    ${OVERVIEW.nofollow_links}`);
    console.log(`refdomains inserted: ${insertCount}`);

  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
