#!/bin/bash
# ============================================================
# Manual Neon DB import script for keyword gap data
# Run this from a machine with access to Neon DB
# ============================================================
# Usage: bash keyword_gap_db_import.sh
# Requires: node, pg (already in package.json)

CONN="postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require"

echo "Running keyword gap DB import..."
node -e "
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: '$CONN',
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await pool.query(\`
    CREATE TABLE IF NOT EXISTS semrush_keyword_gap (
      id SERIAL PRIMARY KEY,
      keyword TEXT NOT NULL,
      competitor_domain TEXT NOT NULL,
      competitor_position INT,
      volume INT,
      competitor_traffic INT,
      competitor_url TEXT,
      keyword_difficulty NUMERIC,
      intent TEXT,
      ledsone_position INT,
      opportunity_score NUMERIC,
      snapshot_date DATE DEFAULT CURRENT_DATE,
      UNIQUE(keyword, competitor_domain)
    )
  \`);
  console.log('Table ensured');

  const data = JSON.parse(fs.readFileSync('data/keyword_gap_latest.json'));
  let total = 0;

  for (const [domain, gaps] of Object.entries(data)) {
    await pool.query('DELETE FROM semrush_keyword_gap WHERE competitor_domain = \$1', [domain]);
    for (const g of gaps) {
      await pool.query(\`
        INSERT INTO semrush_keyword_gap
          (keyword, competitor_domain, competitor_position, volume, competitor_traffic,
           competitor_url, keyword_difficulty, intent, ledsone_position, opportunity_score, snapshot_date)
        VALUES (\$1,\$2,\$3,\$4,\$5,\$6,\$7,\$8,\$9,\$10,CURRENT_DATE)
        ON CONFLICT (keyword, competitor_domain) DO UPDATE SET
          competitor_position=EXCLUDED.competitor_position, volume=EXCLUDED.volume,
          competitor_traffic=EXCLUDED.competitor_traffic, opportunity_score=EXCLUDED.opportunity_score,
          snapshot_date=CURRENT_DATE
      \`, [g.keyword, g.competitor_domain, g.competitor_position, g.volume,
          g.competitor_traffic, g.competitor_url, g.keyword_difficulty,
          g.intent, g.ledsone_position, g.opportunity_score]);
      total++;
    }
    console.log(domain + ': ' + gaps.length + ' rows inserted');
    gaps.slice(0,3).forEach((g,i) => console.log('  '+(i+1)+'. '+g.keyword+' score='+g.opportunity_score));
  }

  const check = await pool.query('SELECT competitor_domain, COUNT(*) cnt FROM semrush_keyword_gap GROUP BY competitor_domain ORDER BY competitor_domain');
  console.log('\\nDB verification:');
  check.rows.forEach(r => console.log(' ', r.competitor_domain + ':', r.cnt, 'rows'));
  await pool.end();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
" 2>&1
