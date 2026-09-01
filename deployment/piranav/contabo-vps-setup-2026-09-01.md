# Deployment — DM Dashboard Contabo VPS Setup

**Date:** 2026-09-01
**Task:** Deploy dm-dashboard to Contabo Cloud VPS Plus 4
**Environment:** Production — Contabo VPS (Ubuntu 24.04)

---

## Server Details

| Item | Value |
|---|---|
| Provider | Contabo |
| Plan | Cloud VPS Plus 4 — £12.48/month |
| Specs | 4 vCPU (AMD EPYC), 8 GB RAM, 150 GB NVMe |
| OS | Ubuntu 24.04 LTS |
| IP | 158.220.99.127 |
| Region | EU |
| Default User | root |

---

## Live URLs

| Service | URL |
|---|---|
| Dashboard (public) | http://158.220.99.127 |
| Backend API | http://158.220.99.127:8499 |
| Health check | http://158.220.99.127/api/health |

---

## Stack on Server

| Component | Details |
|---|---|
| Frontend | React + Vite — built to `/var/www/dashboard-dm/frontend/dist` |
| Backend | FastAPI — running via systemd service `dm-dashboard` on port 8499 |
| Database (local) | PostgreSQL 16 — `dm_dashboard` DB, user `dm_user` |
| Database (business) | Neon (remote, read-only) — same as local dev |
| Web server | Nginx — serves frontend + proxies `/api/` to FastAPI |
| Python env | venv at `/var/www/dashboard-dm/backend/venv` |

---

## File Structure on Server

```
/var/www/dashboard-dm/
├── backend/
│   ├── app/
│   ├── venv/
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── dist/          ← built files served by Nginx
│   ├── .env           ← VITE_API_URL=http://158.220.99.127:8499
│   └── src/
└── docs/
```

---

## Key Config Files

### `/etc/systemd/system/dm-dashboard.service`
```ini
[Unit]
Description=DM Dashboard Backend
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/dashboard-dm/backend
Environment="PATH=/var/www/dashboard-dm/backend/venv/bin"
EnvironmentFile=/var/www/dashboard-dm/backend/.env
ExecStart=/var/www/dashboard-dm/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8499
Restart=always

[Install]
WantedBy=multi-user.target
```

### `/etc/nginx/sites-available/dashboard`
```nginx
server {
    listen 80;
    server_name 158.220.99.127;

    root /var/www/dashboard-dm/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8499;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### `/var/www/dashboard-dm/backend/.env` (key values)
```
DATABASE_URL=postgresql://dm_user:***@localhost:5432/dm_dashboard
BUSINESS_DATABASE_URL=postgresql://dev_user:***@169.58.91.229:5432/ledsone
CORS_ORIGIN=http://158.220.99.127
GEMINI_API_KEY=***
```

### `/var/www/dashboard-dm/frontend/.env`
```
VITE_API_URL=http://158.220.99.127:8499
```

---

## PostgreSQL Setup

```sql
-- DB and user created
CREATE DATABASE dm_dashboard;
CREATE USER dm_user WITH PASSWORD '***';
GRANT ALL PRIVILEGES ON DATABASE dm_dashboard TO dm_user;
ALTER SCHEMA public OWNER TO dm_user;
GRANT ALL ON SCHEMA public TO dm_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dm_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dm_user;
CREATE ROLE dm_dashboard_app;
GRANT dm_dashboard_app TO dm_user;
```

---

## Useful Commands (in PuTTY)

```bash
# Backend service
systemctl start dm-dashboard
systemctl stop dm-dashboard
systemctl restart dm-dashboard
systemctl status dm-dashboard

# View backend logs
journalctl -u dm-dashboard -n 50 --no-pager

# Rebuild frontend after code change
cd /var/www/dashboard-dm/frontend
npm run build

# Restart Nginx
systemctl restart nginx

# Test backend health
curl http://localhost:8499/api/health

# Connect to DB
sudo -u postgres psql -d dm_dashboard
```

---

## Auto-Deploy Script

`/var/www/dashboard-dm/deploy.sh` — run after every `git push`:

```bash
#!/bin/bash
cd /var/www/dashboard-dm
git pull origin main
cd backend
source venv/bin/activate
pip install -r requirements.txt -q
cd ../frontend
npm install --silent
npm run build
systemctl restart dm-dashboard
echo "Deploy complete!"
```

Run with:
```bash
/var/www/dashboard-dm/deploy.sh
```

## GitHub Integration

- Repo: `git@github.com:websitetecteam-arch/dm-dashboard.git`
- Deploy key added to repo (read-only, ed25519)
- Server clones via SSH — no password needed
- `.env` files are NOT in GitHub — backed up at `/root/backend.env.backup` and `/root/frontend.env.backup`

## Notes

- Do NOT use `--reload` on uvicorn — systemd handles restarts
- Frontend must be rebuilt (`npm run build`) after any code or `.env` change
- `VITE_API_URL` must point to the server IP — not localhost
- Database was restored from local `pg_dump` backup via FileZilla + psql
- pgAdmin external access not yet enabled (port 5432 not open to public)
- After git clone, always restore `.env` files from `/root/*.env.backup`
