// Dashboard auth — DB-backed credential verification
// POST /api/auth  { username, password, page_key }           → login
// POST /api/auth  { action:'list-users', username, password } → admin only
// POST /api/auth  { action:'update-password', username, password, target_user, new_password } → admin only

const crypto = require('crypto');
const { Client } = require('pg');

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function makeClient() {
  return new Client({
    connectionString: process.env.NEON_RW_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    statement_timeout: 15000,
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const { action, username, password, page_key, target_user, new_password } = req.body || {};
  if (!username || !password) return res.status(400).json({ ok: false, error: 'Missing fields' });

  const u = username.trim().toLowerCase();
  const h = sha256(password);

  const db = makeClient();
  try {
    await db.connect();

    // Fetch requesting user from DB
    const { rows } = await db.query(
      'SELECT hash, page_key FROM dashboard_credentials WHERE username=$1',
      [u]
    );
    const user = rows[0];

    // Verify identity
    const isValid = user && user.hash === h;
    const isAdmin = isValid && u === 'admin';

    // === action: list-users ===
    if (action === 'list-users') {
      if (!isAdmin) return res.status(401).json({ ok: false, error: 'Admin only' });
      const all = await db.query(
        'SELECT username, page_key FROM dashboard_credentials WHERE username != \'admin\' ORDER BY username'
      );
      return res.status(200).json({ ok: true, users: all.rows });
    }

    // === action: update-password ===
    if (action === 'update-password') {
      if (!isAdmin) return res.status(401).json({ ok: false, error: 'Admin only' });
      if (!target_user || !new_password) return res.status(400).json({ ok: false, error: 'Missing target_user or new_password' });

      const t = target_user.trim().toLowerCase();
      const newHash = sha256(new_password.trim());

      const result = await db.query(
        'UPDATE dashboard_credentials SET hash=$1, updated_at=now() WHERE username=$2',
        [newHash, t]
      );
      if (result.rowCount === 0) return res.status(404).json({ ok: false, error: `User "${t}" not found` });

      return res.status(200).json({ ok: true, message: `Password for "${t}" updated instantly.` });
    }

    // === action: login (default) ===
    if (!page_key) return res.status(400).json({ ok: false, error: 'Missing page_key' });
    if (!isValid)  return res.status(401).json({ ok: false, error: 'Invalid credentials' });

    // Admin bypasses page_key check
    if (isAdmin) return res.status(200).json({ ok: true });

    // User must match their own page_key
    if (user.page_key !== page_key) return res.status(401).json({ ok: false, error: 'Invalid credentials' });

    return res.status(200).json({ ok: true });

  } catch (err) {
    return res.status(500).json({ ok: false, error: 'DB error: ' + err.message });
  } finally {
    db.end().catch(() => {});
  }
};
