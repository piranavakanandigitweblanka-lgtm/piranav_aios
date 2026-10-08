# Capability — Contabo VPS Setup & Linux Server Deployment

**Date:** 2026-09-01
**Type:** New capability acquired — Linux VPS deployment
**Engineer:** Piranav

---

## Capability Demonstrated

Piranav successfully deployed a full-stack web application (React + FastAPI + PostgreSQL) to a Linux VPS from scratch with no prior cloud server experience.

---

## Skills Acquired

### Linux Server Administration
- SSH via PuTTY to remote server
- apt package management (install, update)
- File navigation and editing with nano
- systemd service management (start, stop, enable, status)
- journalctl for log inspection
- File permissions and ownership (chmod, chown)

### PostgreSQL on Linux
- Install and configure PostgreSQL 16 on Ubuntu
- Create databases, users, roles via psql
- Grant schema and table privileges
- Restore pg_dump backups via psql
- Diagnose and fix permission errors

### Nginx
- Configure Nginx as reverse proxy for FastAPI
- Serve React static files from dist folder
- Route `/api/` requests to backend port
- Test config with `nginx -t`

### Python/FastAPI Deployment
- Create and activate Python venv on Linux
- Install requirements from requirements.txt
- Run uvicorn as systemd service
- Debug startup errors via journalctl

### React/Vite Deployment
- Set environment variables via `.env` for production
- Build production bundle with `npm run build`
- Understand why `VITE_API_URL` must be rebuilt after change

### File Transfer
- FileZilla SFTP for Windows → Linux file transfer
- pg_dump from Windows PostgreSQL 18

---

## Key Troubleshooting Patterns Learned

| Problem | Diagnosis | Fix |
|---|---|---|
| Port already in use | Another process holds the port | `pkill -f uvicorn` |
| Permission denied for schema | App user doesn't own schema | `ALTER SCHEMA public OWNER TO dm_user` |
| Failed to fetch (frontend) | VITE_API_URL still localhost | Rebuild frontend after `.env` change |
| DB connection timeout | Wrong URL format | `postgresql://` not `postgresql+psycopg://` |
| pg_dump not found | Not in PATH on Windows | Use full path to pg_dump.exe |

---

## GitHub Auto-Deploy Pattern

```bash
# 1. Generate SSH key on server
ssh-keygen -t ed25519 -C "server-name"
cat /root/.ssh/id_ed25519.pub   # add this to GitHub repo → Settings → Deploy keys

# 2. Test connection
ssh -T git@github.com

# 3. Clone repo
git clone git@github.com:org/repo.git /var/www/app

# 4. Create deploy.sh
chmod +x /var/www/app/deploy.sh

# 5. Deploy after every git push
/var/www/app/deploy.sh
```

---

## Reusable Pattern — Deploy Any FastAPI + React App to VPS

1. Install: Python, Node.js 20, PostgreSQL, Nginx
2. Upload code via FileZilla
3. Create venv + pip install requirements
4. Set `.env` with production values
5. Create systemd service for backend
6. Build frontend with `npm run build`
7. Configure Nginx — serve dist, proxy /api
8. Restore database from pg_dump backup
