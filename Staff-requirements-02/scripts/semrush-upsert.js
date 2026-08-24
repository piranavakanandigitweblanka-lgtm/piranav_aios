#!/usr/bin/env node
/**
 * semrush-upsert.js — Upsert latest SEMrush domain_rank data into Neon semrush_history
 *
 * Uses @neondatabase/serverless (HTTPS) so it works in proxy environments where
 * direct pg TCP is blocked.
 *
 * Usage:  node scripts/semrush-upsert.js
 *         (NEON_DATABASE_URL env var overrides the default connection string)
 *
 * Data last fetched by scheduled agent: 2026-08-24
 * SEMrush report: domain_rank, database: uk, target: ledsone.co.uk
 */

const { neon } = require('../node_modules/@neondatabase/serverless');

const CONN = process.env.NEON_DATABASE_URL ||
  'postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';

// ─── Freshly fetched SEMrush data (2026-08-24) ─────────────────────────────
// domain_rank report, database: uk, target: ledsone.co.uk
// positions_21_100 = sum of positions_21_30…91_100: 2409+2204+1443+636+347+132+57+23 = 7251
const ROWS = [
  {
    month:             '2026-08-01',
    rank:              50139,
    organic_keywords:  10735,
    kw_top3:           167,
    kw_top4_10:        643,
    kw_top11_20:       1826,
    kw_top21_100:      7251,
    traffic_est:       9737,
    traffic_cost_gbp:  4185,
    paid_keywords:     11,
    paid_traffic:      110,
  },
];

async function main() {
  const sql = neon(CONN);
  console.log('Connected to Neon (serverless HTTPS driver).');

  // 1. Check actual columns present in the table
  const colRes = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'semrush_history' ORDER BY ordinal_position
  `;
  const cols = colRes.map(r => r.column_name);
  console.log('semrush_history columns:', cols.join(', '));

  const hasBreakdown = cols.includes('kw_top3');

  // 2. Upsert each row
  for (const row of ROWS) {
    if (hasBreakdown) {
      await sql`
        INSERT INTO semrush_history
          (month, rank, organic_keywords, kw_top3, kw_top4_10, kw_top11_20, kw_top21_100,
           traffic_est, traffic_cost_gbp, paid_keywords, paid_traffic)
        VALUES
          (${row.month}, ${row.rank}, ${row.organic_keywords}, ${row.kw_top3}, ${row.kw_top4_10},
           ${row.kw_top11_20}, ${row.kw_top21_100}, ${row.traffic_est}, ${row.traffic_cost_gbp},
           ${row.paid_keywords}, ${row.paid_traffic})
        ON CONFLICT (month) DO UPDATE SET
          rank             = EXCLUDED.rank,
          organic_keywords = EXCLUDED.organic_keywords,
          kw_top3          = COALESCE(EXCLUDED.kw_top3,      semrush_history.kw_top3),
          kw_top4_10       = COALESCE(EXCLUDED.kw_top4_10,   semrush_history.kw_top4_10),
          kw_top11_20      = COALESCE(EXCLUDED.kw_top11_20,  semrush_history.kw_top11_20),
          kw_top21_100     = COALESCE(EXCLUDED.kw_top21_100, semrush_history.kw_top21_100),
          traffic_est      = EXCLUDED.traffic_est,
          traffic_cost_gbp = EXCLUDED.traffic_cost_gbp,
          paid_keywords    = EXCLUDED.paid_keywords,
          paid_traffic     = EXCLUDED.paid_traffic
      `;
    } else {
      await sql`
        INSERT INTO semrush_history
          (month, rank, organic_keywords, traffic_est, traffic_cost_gbp, paid_keywords, paid_traffic)
        VALUES
          (${row.month}, ${row.rank}, ${row.organic_keywords}, ${row.traffic_est},
           ${row.traffic_cost_gbp}, ${row.paid_keywords}, ${row.paid_traffic})
        ON CONFLICT (month) DO UPDATE SET
          rank             = EXCLUDED.rank,
          organic_keywords = EXCLUDED.organic_keywords,
          traffic_est      = EXCLUDED.traffic_est,
          traffic_cost_gbp = EXCLUDED.traffic_cost_gbp,
          paid_keywords    = EXCLUDED.paid_keywords,
          paid_traffic     = EXCLUDED.paid_traffic
      `;
    }
    console.log(`Upserted ${row.month}`);
  }

  // 3. Verify
  const verify = await sql`
    SELECT month, rank, organic_keywords, traffic_est
    FROM semrush_history ORDER BY month DESC LIMIT 3
  `;
  console.log('\n=== Latest semrush_history rows ===');
  console.table(verify);

  console.log('\nDone. Neon upsert complete.');
}

main().catch(e => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
