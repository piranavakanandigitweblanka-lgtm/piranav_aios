"""
Sajeepan Dashboard — Daily Auto-Update Script
Queries ledsone-db-mcp PostgreSQL and regenerates the JS data blocks in sajeepan.html.

Usage:
  python scripts/sajeepan_update.py

Environment variables required (set as GitHub Actions secrets):
  LEDSONE_DB_HOST
  LEDSONE_DB_PORT
  LEDSONE_DB_NAME
  LEDSONE_DB_USER
  LEDSONE_DB_PASSWORD

Target file:
  Staff-requirements/pages/sajeepan.html
"""

import os
import re
import json
import psycopg2
from datetime import date, timedelta

# ── DB connection ──────────────────────────────────────────────────────────────
conn = psycopg2.connect(
    host=os.environ['LEDSONE_DB_HOST'],
    port=int(os.environ.get('LEDSONE_DB_PORT', 5432)),
    dbname=os.environ['LEDSONE_DB_NAME'],
    user=os.environ['LEDSONE_DB_USER'],
    password=os.environ['LEDSONE_DB_PASSWORD'],
    connect_timeout=15,
    sslmode='require'
)
cur = conn.cursor()

CAMPAIGN_IDS = ['21069663519','21242723265','22079334413','23110323532','23516313256','23590572906']
IDS_SQL = "','".join(CAMPAIGN_IDS)
THIRTY_AGO = (date.today() - timedelta(days=30)).isoformat()
TODAY = date.today().isoformat()

print(f"Querying ledsone-db-mcp | window: {THIRTY_AGO} → {TODAY}")

# ── 1. Campaign master ─────────────────────────────────────────────────────────
cur.execute(f"""
    SELECT campaign_id, campaign_name, campaign_status, campaign_primary_status,
           budget_status, budget, target_roas
    FROM google_ads.campaigns
    WHERE campaign_id IN ('{IDS_SQL}')
    ORDER BY campaign_id
""")
camp_rows = {r[0]: r for r in cur.fetchall()}

# ── 2. Campaign performance (30d current) ─────────────────────────────────────
cur.execute(f"""
    SELECT campaign_id,
           ROUND(SUM(cost)::numeric,2),
           ROUND(SUM(conversion_value)::numeric,2),
           ROUND(SUM(conversions)::numeric,2),
           SUM(clicks), SUM(impressions),
           ROUND((SUM(conversion_value)/NULLIF(SUM(cost),0)*100)::numeric,2)
    FROM google_ads.campaign_performance
    WHERE campaign_id IN ('{IDS_SQL}')
      AND date >= '{THIRTY_AGO}'
    GROUP BY campaign_id
""")
perf_cur = {r[0]: r for r in cur.fetchall()}

# ── 3. Campaign performance (prev 30d) ────────────────────────────────────────
SIXTY_AGO = (date.today() - timedelta(days=60)).isoformat()
cur.execute(f"""
    SELECT campaign_id,
           ROUND(SUM(cost)::numeric,2),
           ROUND(SUM(conversion_value)::numeric,2),
           ROUND(SUM(conversions)::numeric,2),
           ROUND((SUM(conversion_value)/NULLIF(SUM(cost),0)*100)::numeric,2)
    FROM google_ads.campaign_performance
    WHERE campaign_id IN ('{IDS_SQL}')
      AND date >= '{SIXTY_AGO}' AND date < '{THIRTY_AGO}'
    GROUP BY campaign_id
""")
perf_prev = {r[0]: r for r in cur.fetchall()}

# ── 4. Daily trend (30d combined) ─────────────────────────────────────────────
cur.execute(f"""
    SELECT date,
           ROUND(SUM(cost)::numeric,2),
           ROUND(SUM(conversion_value)::numeric,2),
           ROUND(SUM(conversions)::numeric,2),
           ROUND((SUM(conversion_value)/NULLIF(SUM(cost),0)*100)::numeric,2)
    FROM google_ads.campaign_performance
    WHERE campaign_id IN ('{IDS_SQL}')
      AND date >= '{THIRTY_AGO}'
    GROUP BY date ORDER BY date
""")
trend_rows = cur.fetchall()

# ── 5. Top 50 products by conversion value (30d) ──────────────────────────────
cur.execute(f"""
    SELECT
        pp.product_item_id,
        pp.campaign_id,
        ROUND(SUM(pp.cost)::numeric,2),
        ROUND(SUM(pp.conversion_value)::numeric,2),
        ROUND(SUM(pp.conversions)::numeric,2),
        SUM(pp.clicks),
        SUM(pp.impressions),
        ROUND((SUM(pp.conversion_value)/NULLIF(SUM(pp.cost),0)*100)::numeric,2),
        mp.title,
        mp.brand,
        mp.sale_price,
        mp.availability,
        mp.image_link,
        mp.product_type
    FROM google_ads.product_performance pp
    LEFT JOIN (
        SELECT DISTINCT ON (product_id)
            product_id, title, brand, sale_price, availability, image_link, product_type
        FROM google_ads.merchant_products
        ORDER BY product_id, updated_at DESC
    ) mp ON UPPER(REPLACE(pp.product_item_id, '-sh', '')) = mp.product_id
    WHERE pp.campaign_id IN ('{IDS_SQL}')
      AND pp.date >= '{THIRTY_AGO}'
    GROUP BY pp.product_item_id, pp.campaign_id,
             mp.title, mp.brand, mp.sale_price, mp.availability, mp.image_link, mp.product_type
    ORDER BY SUM(pp.conversion_value) DESC
    LIMIT 54
""")
product_rows = cur.fetchall()

# ── 6. Zero-conversion products with spend > £10 ─────────────────────────────
cur.execute(f"""
    SELECT
        pp.product_item_id,
        pp.campaign_id,
        ROUND(SUM(pp.cost)::numeric,2),
        0, 0, SUM(pp.clicks), SUM(pp.impressions), 0,
        mp.title, mp.brand, mp.sale_price, mp.availability, mp.image_link, mp.product_type
    FROM google_ads.product_performance pp
    LEFT JOIN (
        SELECT DISTINCT ON (product_id)
            product_id, title, brand, sale_price, availability, image_link, product_type
        FROM google_ads.merchant_products
        ORDER BY product_id, updated_at DESC
    ) mp ON UPPER(REPLACE(pp.product_item_id, '-sh', '')) = mp.product_id
    WHERE pp.campaign_id IN ('{IDS_SQL}')
      AND pp.date >= '{THIRTY_AGO}'
    GROUP BY pp.product_item_id, pp.campaign_id,
             mp.title, mp.brand, mp.sale_price, mp.availability, mp.image_link, mp.product_type
    HAVING SUM(pp.conversions) = 0 AND SUM(pp.cost) > 10
    ORDER BY SUM(pp.cost) DESC
    LIMIT 6
""")
zero_conv_rows = cur.fetchall()

cur.close()
conn.close()
print("DB queries complete.")

# ── Build JS strings ───────────────────────────────────────────────────────────

def jstr(v):
    if v is None:
        return 'null'
    if isinstance(v, str):
        escaped = v.replace('\\', '\\\\').replace("'", "\\'")
        return f"'{escaped}'"
    return str(v)

# CAMPAIGNS array
camp_js_lines = []
for cid in CAMPAIGN_IDS:
    c = camp_rows.get(cid)
    p = perf_cur.get(cid)
    pv = perf_prev.get(cid)
    if not c or not p:
        continue
    cost, cv, conv, clicks, imps, roas = p[1], p[2], p[3], p[4], p[5], p[6]
    pcost = pv[1] if pv else 0
    pcv   = pv[2] if pv else 0
    pconv = pv[3] if pv else 0
    proas = pv[4] if pv else 0
    troas = float(c[6]) if c[6] else 0
    line = (
        f"  {{ id:{jstr(cid)}, name:{jstr(c[1])},\n"
        f"    short:{jstr(c[1].split('|')[3].strip() if '|' in c[1] else cid)}, "
        f"status:{jstr(c[2])}, primary:{jstr(c[3])}, budget:{float(c[5])}, target_roas:{troas},\n"
        f"    l30:{{ cost:{cost}, cv:{cv}, conv:{conv}, clicks:{clicks}, imps:{imps}, roas:{roas} }},\n"
        f"    prev:{{ cost:{pcost}, cv:{pcv}, conv:{pconv}, roas:{proas} }}\n"
        f"  }}"
    )
    camp_js_lines.append(line)
campaigns_js = "const CAMPAIGNS = [\n" + ",\n".join(camp_js_lines) + "\n];"

# TREND array
trend_js_lines = []
for row in trend_rows:
    d = row[0].strftime('%m/%d')
    trend_js_lines.append(
        f"  {{d:{jstr(d)},cost:{row[1]},cv:{row[2]},conv:{row[3]},roas:{row[4]}}}"
    )
trend_js = "const TREND = [\n" + ",\n".join(trend_js_lines) + "\n];"

# PRODUCTS array (top + zero-conv)
def prod_line(row):
    item, cid, cost, cv, conv, clicks, imps, roas = row[0:8]
    title, brand, price, avail, img, ptype = row[8:14]
    return (
        f"  {{item:{jstr(item)},cid:{jstr(cid)},cost:{cost},cv:{cv},conv:{conv},"
        f"clicks:{clicks},imps:{imps},roas:{roas},"
        f"title:{jstr(title)},brand:{jstr(brand)},price:{jstr(price)},"
        f"avail:{jstr(avail)},img:{jstr(img)},type:{jstr(ptype)}}}"
    )

all_products = list(product_rows) + list(zero_conv_rows)
products_js = "const PRODUCTS = [\n" + ",\n".join(prod_line(r) for r in all_products) + "\n];"

# Data date comment
data_date = trend_rows[-1][0].strftime('%Y-%m-%d') if trend_rows else TODAY
date_comment = f"/* AUTO-UPDATED: {TODAY} | Data window: {THIRTY_AGO} → {data_date} */"

# ── Patch sajeepan.html ────────────────────────────────────────────────────────
html_path = os.path.join(
    os.path.dirname(__file__), '..', 'Staff-requirements', 'pages', 'sajeepan.html'
)
html_path = os.path.normpath(html_path)

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

def replace_block(html, marker_start, marker_end, new_content):
    pattern = rf'{re.escape(marker_start)}.*?{re.escape(marker_end)}'
    replacement = f'{marker_start}\n{new_content}\n{marker_end}'
    result, count = re.subn(pattern, replacement, html, count=1, flags=re.DOTALL)
    if count == 0:
        raise ValueError(f"Marker not found: {marker_start}")
    return result

html = replace_block(html, '/* CAMPAIGNS_START */', '/* CAMPAIGNS_END */', campaigns_js)
html = replace_block(html, '/* TREND_START */', '/* TREND_END */', trend_js)
html = replace_block(html, '/* PRODUCTS_START */', '/* PRODUCTS_END */', products_js)
html = re.sub(r'/\* AUTO-UPDATED:.*?\*/', date_comment, html, count=1)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"sajeepan.html updated | {len(all_products)} products | data to {data_date}")
