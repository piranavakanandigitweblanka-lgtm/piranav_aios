#!/usr/bin/env node
/**
 * semrush-upsert.js — Upsert latest SEMrush domain_rank data into Neon semrush_history
 *
 * Usage:  NEON_DATABASE_URL="postgresql://..." node scripts/semrush-upsert.js
 *
 * Data last fetched by scheduled agent: 2026-08-17
 * SEMrush report: domain_rank, database: uk, target: ledsone.co.uk
 */

const { Client } = require('../node_modules/pg');

const CONN = process.env.NEON_DATABASE_URL;
if (!CONN) {
  console.error('ERROR: NEON_DATABASE_URL environment variable is not set.');
  console.error('Example: NEON_DATABASE_URL="postgresql://neondb_owner:<pass>@<host>/neondb?sslmode=require" node scripts/semrush-upsert.js');
  process.exit(1);
}

// ─── Freshly fetched SEMrush data (2026-08-17) ─────────────────────────────
const ROWS = [
  {
    month:             '2026-08-01',
    rank:              49162,
    organic_keywords:  11062,
    kw_top3:           166,
    kw_top4_10:        633,
    kw_top11_20:       1834,
    kw_top21_100:      7532,   // sum positions_21_30…91_100
    traffic_est:       9932,
    traffic_cost_gbp:  4181,
    paid_keywords:     11,
    paid_traffic:      110,
  },
  {
    month:             '2026-07-01',
    rank:              50183,
    organic_keywords:  11485,
    kw_top3:           null,   // breakdown not fetched for July
    kw_top4_10:        null,
    kw_top11_20:       null,
    kw_top21_100:      null,
    traffic_est:       9551,
    traffic_cost_gbp:  3960,
    paid_keywords:     11,
    paid_traffic:      110,
  },
];

async function main() {
  const client = new Client({ connectionString: CONN, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected to Neon.');

  // 1. Check actual columns present in the table
  const colRes = await client.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_name = 'semrush_history' ORDER BY ordinal_position`
  );
  const cols = colRes.rows.map(r => r.column_name);
  console.log('semrush_history columns:', cols.join(', '));

  const hasBreakdown = cols.includes('kw_top3');

  // 2. Upsert each row
  for (const row of ROWS) {
    if (hasBreakdown) {
      await client.query(
        `INSERT INTO semrush_history
           (month, rank, organic_keywords, kw_top3, kw_top4_10, kw_top11_20, kw_top21_100,
            traffic_est, traffic_cost_gbp, paid_keywords, paid_traffic)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (month) DO UPDATE SET
           rank             = EXCLUDED.rank,
           organic_keywords = EXCLUDED.organic_keywords,
           kw_top3          = COALESCE(EXCLUDED.kw_top3,          semrush_history.kw_top3),
           kw_top4_10       = COALESCE(EXCLUDED.kw_top4_10,       semrush_history.kw_top4_10),
           kw_top11_20      = COALESCE(EXCLUDED.kw_top11_20,      semrush_history.kw_top11_20),
           kw_top21_100     = COALESCE(EXCLUDED.kw_top21_100,     semrush_history.kw_top21_100),
           traffic_est      = EXCLUDED.traffic_est,
           traffic_cost_gbp = EXCLUDED.traffic_cost_gbp,
           paid_keywords    = EXCLUDED.paid_keywords,
           paid_traffic     = EXCLUDED.paid_traffic`,
        [
          row.month, row.rank, row.organic_keywords,
          row.kw_top3, row.kw_top4_10, row.kw_top11_20, row.kw_top21_100,
          row.traffic_est, row.traffic_cost_gbp, row.paid_keywords, row.paid_traffic,
        ]
      );
    } else {
      await client.query(
        `INSERT INTO semrush_history
           (month, rank, organic_keywords, traffic_est, traffic_cost_gbp, paid_keywords, paid_traffic)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (month) DO UPDATE SET
           rank             = EXCLUDED.rank,
           organic_keywords = EXCLUDED.organic_keywords,
           traffic_est      = EXCLUDED.traffic_est,
           traffic_cost_gbp = EXCLUDED.traffic_cost_gbp,
           paid_keywords    = EXCLUDED.paid_keywords,
           paid_traffic     = EXCLUDED.paid_traffic`,
        [
          row.month, row.rank, row.organic_keywords,
          row.traffic_est, row.traffic_cost_gbp, row.paid_keywords, row.paid_traffic,
        ]
      );
    }
    console.log(`Upserted ${row.month}`);
  }

  // 3. Verify
  const verify = await client.query(
    `SELECT month, rank, organic_keywords, traffic_est
     FROM semrush_history ORDER BY month DESC LIMIT 5`
  );
  console.log('\n=== Latest semrush_history rows ===');
  console.table(verify.rows);

  await client.end();
  console.log('\nDone. Neon upsert complete.');
}

main().catch(e => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
