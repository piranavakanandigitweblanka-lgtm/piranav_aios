# Implementation — Contabo VPS Setup

**Date:** 2026-09-01
**Task:** Full server setup and deployment of dm-dashboard on Contabo VPS
**Engineer:** Piranav

---

## Implementation Steps

### Stage 1 — Server Setup
1. Purchased Contabo Cloud VPS Plus 4 (£12.48/month, EU region)
2. Reinstalled OS — Ubuntu 24.04 LTS via Contabo control panel
3. Connected via PuTTY SSH as root

### Stage 2 — Package Installation
```bash
apt update && apt upgrade -y
apt install python3 python3-pip python3-venv postgresql postgresql-contrib nginx git -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install nodejs -y
```

### Stage 3 — File Upload
- Uploaded project files to `/var/www/dashboard-dm/` via FileZilla (SFTP)
- Structure: `backend/`, `frontend/`, `docs/`

### Stage 4 — PostgreSQL Setup
```bash
systemctl start postgresql && systemctl enable postgresql
sudo -u postgres psql
```
```sql
CREATE DATABASE dm_dashboard;
CREATE USER dm_user WITH PASSWORD '***';
GRANT ALL PRIVILEGES ON DATABASE dm_dashboard TO dm_user;
CREATE ROLE dm_dashboard_app;
GRANT dm_dashboard_app TO dm_user;
ALTER SCHEMA public OWNER TO dm_user;
GRANT ALL ON SCHEMA public TO dm_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dm_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dm_user;
```

### Stage 5 — Database Restore
```bash
# Local PC — export
pg_dump -U dm_dashboard_app -h localhost -p 5432 dm_dashboard -f dm_backup.sql

# Upload via FileZilla to /root/dm_backup.sql on server

# Server — restore as superuser
cp /root/dm_backup.sql /tmp/dm_backup.sql
chmod 644 /tmp/dm_backup.sql
systemctl stop dm-dashboard
sudo -u postgres dropdb dm_dashboard
sudo -u postgres createdb dm_dashboard
sudo -u postgres psql -d dm_dashboard -f /tmp/dm_backup.sql
```

### Stage 6 — Backend Setup
```bash
cd /var/www/dashboard-dm/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
nano .env   # set DATABASE_URL, CORS_ORIGIN
```

Key `.env` changes from local:
- `DATABASE_URL`: `postgresql+psycopg://` → `postgresql://` (psycopg_pool format)
- `CORS_ORIGIN`: `http://localhost:5199` → `http://158.220.99.127`

### Stage 7 — systemd Service
```bash
nano /etc/systemd/system/dm-dashboard.service
systemctl daemon-reload
systemctl start dm-dashboard
systemctl enable dm-dashboard
```

### Stage 8 — Frontend Build
```bash
cd /var/www/dashboard-dm/frontend
echo "VITE_API_URL=http://158.220.99.127:8499" > .env
npm install
npm run build
```

### Stage 9 — Nginx Configuration
```bash
nano /etc/nginx/sites-available/dashboard
ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```
