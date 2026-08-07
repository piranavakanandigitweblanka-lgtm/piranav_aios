// EOD Reader API — Option A (GitHub Contents API)
// ?action=members            → list all members + teams
// ?action=dates&member=Name  → list available EOD dates for a member
// ?action=read&member=Name&date=YYYY-MM-DD → return raw markdown for that day

const https = require('https');

const OWNER = 'digitalmarketing69140951-sys';
const REPO  = 'eod-reports';

const MEMBERS = [
  { name: 'Dilaksi',    team: 'SEO' },
  { name: 'Hetheesha',  team: 'SEO' },
  { name: 'Jakshan',    team: 'SEO' },
  { name: 'Kamsi',      team: 'SEO' },
  { name: 'Kuberan',    team: 'ADS' },
  { name: 'Mahima',     team: 'ADS' },
  { name: 'Piranav',    team: 'SEO' },
  { name: 'Ripson',     team: 'ADS' },
  { name: 'Sajeepan',   team: 'ADS' },
  { name: 'Sonya',      team: 'ADS' },
  { name: 'Sukirtha',   team: 'SEO' },
  { name: 'Thanishtika',team: 'ADS' },
  { name: 'Thasitha',   team: 'ADS' },
  { name: 'Theekshy',   team: 'ADS' },
  { name: 'Thishoban',  team: 'ADS' },
  { name: 'Thivagini',  team: 'ADS' },
  { name: 'Jefri',      team: 'ADS' },
];

function ghFetch(path) {
  return new Promise((resolve, reject) => {
    const token = process.env.GITHUB_TOKEN;
    const opts = {
      hostname: 'api.github.com',
      path,
      method: 'GET',
      headers: {
        'User-Agent': 'staff-requirements-eod/1.0',
        'Accept': 'application/vnd.github.v3+json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    };
    const req = https.request(opts, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch (e) { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const { action, member, date } = req.query;

  // ── action=members ────────────────────────────────────────────────────────
  if (!action || action === 'members') {
    return res.status(200).json({ ok: true, members: MEMBERS });
  }

  // ── action=dates ──────────────────────────────────────────────────────────
  if (action === 'dates') {
    if (!member) return res.status(400).json({ ok: false, error: 'member required' });

    const found = MEMBERS.find(m => m.name.toLowerCase() === member.toLowerCase());
    if (!found) return res.status(404).json({ ok: false, error: 'member not found' });

    const path = `/repos/${OWNER}/${REPO}/contents/eods/${found.name}`;
    const { status, data } = await ghFetch(path);

    if (status !== 200) {
      return res.status(status).json({ ok: false, error: 'GitHub API error', detail: data });
    }

    const dates = data
      .filter(f => f.name.endsWith('.md'))
      .map(f => f.name.replace('.md', ''))
      .sort()
      .reverse();

    return res.status(200).json({ ok: true, member: found.name, team: found.team, dates });
  }

  // ── action=read ───────────────────────────────────────────────────────────
  if (action === 'read') {
    if (!member) return res.status(400).json({ ok: false, error: 'member required' });
    if (!date)   return res.status(400).json({ ok: false, error: 'date required' });

    const found = MEMBERS.find(m => m.name.toLowerCase() === member.toLowerCase());
    if (!found) return res.status(404).json({ ok: false, error: 'member not found' });

    const path = `/repos/${OWNER}/${REPO}/contents/eods/${found.name}/${date}.md`;
    const { status, data } = await ghFetch(path);

    if (status === 404) {
      return res.status(404).json({ ok: false, error: 'No EOD report found for this date' });
    }
    if (status !== 200) {
      return res.status(status).json({ ok: false, error: 'GitHub API error', detail: data });
    }

    const markdown = Buffer.from(data.content, 'base64').toString('utf8');
    return res.status(200).json({
      ok: true,
      member: found.name,
      team: found.team,
      date,
      sha: data.sha,
      markdown,
    });
  }

  return res.status(400).json({ ok: false, error: `Unknown action: ${action}` });
};
