import pg from "pg";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ ok: false, cause: "missing_env", error: "DATABASE_URL not configured" });
  }

  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 12000,
    statement_timeout: 10000,
  });

  try {
    await client.connect();

    // Step 1 — get latest date and derive rolling windows
    const { rows: dateRows } = await client.query(
      `SELECT MAX(date) AS latest_date FROM google_ads.campaign_performance`
    );
    const latestDate = dateRows[0].latest_date;
    if (!latestDate) throw new Error("No data in google_ads.campaign_performance");

    const { rows: windowRows } = await client.query(`
      SELECT
        $1::date                            AS latest_date,
        ($1::date - INTERVAL '1 day')::date AS l30_end,
        ($1::date - INTERVAL '30 days')::date AS l30_start,
        ($1::date - INTERVAL '31 days')::date AS bl_end,
        ($1::date - INTERVAL '60 days')::date AS bl_start,
        ($1::date - INTERVAL '1 day')::date  AS d60_end,
        ($1::date - INTERVAL '60 days')::date AS d60_start,
        ($1::date - INTERVAL '1 day')::date  AS d90_end,
        ($1::date - INTERVAL '90 days')::date AS d90_start
    `, [latestDate]);
    const w = windowRows[0];

    // Step 2 — per-campaign aggregates for all 4 windows
    const { rows: campaigns } = await client.query(`
      SELECT
        cp.campaign_id,
        c.campaign_name,
        c.budget,
        c.campaign_status,

        -- L30
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.cost             ELSE 0 END)::numeric, 2) AS l30_cost,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversions      ELSE 0 END)::numeric, 4) AS l30_conv,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $1 AND $2 THEN cp.conversion_value ELSE 0 END)::numeric, 2) AS l30_cv,
        COUNT(DISTINCT CASE WHEN cp.date BETWEEN $1 AND $2 AND cp.cost > 0 THEN cp.date END) AS l30_days,

        -- Before Last
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.cost             ELSE 0 END)::numeric, 2) AS bl_cost,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversions      ELSE 0 END)::numeric, 4) AS bl_conv,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $3 AND $4 THEN cp.conversion_value ELSE 0 END)::numeric, 2) AS bl_cv,

        -- D60
        ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.cost             ELSE 0 END)::numeric, 2) AS d60_cost,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.conversions      ELSE 0 END)::numeric, 4) AS d60_conv,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $5 AND $6 THEN cp.conversion_value ELSE 0 END)::numeric, 2) AS d60_cv,

        -- D90
        ROUND(SUM(CASE WHEN cp.date BETWEEN $7 AND $8 THEN cp.cost             ELSE 0 END)::numeric, 2) AS d90_cost,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $7 AND $8 THEN cp.conversions      ELSE 0 END)::numeric, 4) AS d90_conv,
        ROUND(SUM(CASE WHEN cp.date BETWEEN $7 AND $8 THEN cp.conversion_value ELSE 0 END)::numeric, 2) AS d90_cv

      FROM google_ads.campaign_performance cp
      JOIN google_ads.campaigns c ON c.campaign_id = cp.campaign_id
      WHERE (c.campaign_name ILIKE '%Sonya%' OR cp.campaign_id = 20810136438)
      GROUP BY cp.campaign_id, c.campaign_name, c.budget, c.campaign_status
      ORDER BY l30_cost DESC
    `, [w.l30_start, w.l30_end, w.bl_start, w.bl_end, w.d60_start, w.d60_end, w.d90_start, w.d90_end]);

    // Step 3 — compute ROAS for each window (cv/cost * 100), never expose raw connection details
    const result = campaigns.map(r => {
      const roas = (cost, cv) => cost > 0 ? Math.round((cv / cost) * 10000) / 100 : 0;
      return {
        id:     String(r.campaign_id),
        name:   r.campaign_name,
        budget: r.budget ? Number(r.budget) : null,
        status: r.campaign_status,
        days:   Number(r.l30_days),
        l30: { cost: Number(r.l30_cost), conv: Number(r.l30_conv), cv: Number(r.l30_cv), roas: roas(r.l30_cost, r.l30_cv) },
        bl:  { cost: Number(r.bl_cost),  conv: Number(r.bl_conv),  cv: Number(r.bl_cv),  roas: roas(r.bl_cost,  r.bl_cv)  },
        d60: { cost: Number(r.d60_cost), conv: Number(r.d60_conv), cv: Number(r.d60_cv), roas: roas(r.d60_cost, r.d60_cv) },
        d90: { cost: Number(r.d90_cost), conv: Number(r.d90_conv), cv: Number(r.d90_cv), roas: roas(r.d90_cost, r.d90_cv) },
      };
    });

    const fmt = d => d.toISOString().slice(0, 10);

    return res.status(200).json({
      ok: true,
      meta: {
        latest_date:  fmt(latestDate instanceof Date ? latestDate : new Date(latestDate)),
        l30_start:    fmt(new Date(w.l30_start)),
        l30_end:      fmt(new Date(w.l30_end)),
        bl_start:     fmt(new Date(w.bl_start)),
        bl_end:       fmt(new Date(w.bl_end)),
        d60_start:    fmt(new Date(w.d60_start)),
        d60_end:      fmt(new Date(w.d60_end)),
        d90_start:    fmt(new Date(w.d90_start)),
        d90_end:      fmt(new Date(w.d90_end)),
        total_campaigns: result.length,
        active_campaigns: result.filter(c => c.l30.cost > 0).length,
      },
      campaigns: result,
    });

  } catch (err) {
    const msg = err.message || "";
    let cause = "unknown";
    if (/password|authentication|SASL/i.test(msg))                        cause = "authentication";
    else if (/database .+ does not exist/i.test(msg))                      cause = "incorrect_database";
    else if (/timeout|ETIMEDOUT|ECONNREFUSED|ENOTFOUND/i.test(msg))        cause = "firewall_or_network_timeout";
    else if (/ssl|TLS/i.test(msg))                                         cause = "ssl";
    else if (/permission denied/i.test(msg))                               cause = "missing_permissions";
    return res.status(500).json({ ok: false, cause, error: msg });
  } finally {
    await client.end().catch(() => {});
  }
}
