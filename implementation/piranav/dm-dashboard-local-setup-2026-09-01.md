# Implementation — DM Dashboard Local Setup

**Date:** 2026-09-01
**Task:** Set up dm-dashboard locally on Piranav's PC

---

## Steps Executed

### 1. Repo Clone
```
git clone https://github.com/websitetecteam-arch/dm-dashboard
# into: C:\Users\PC\Documents\piranav_aios\dm-dashboard
```

### 2. PostgreSQL Password Reset
- Edited `C:\Program Files\PostgreSQL\18\data\pg_hba.conf`
- Changed `127.0.0.1/32 scram-sha-256` → `trust`
- Restarted service (Admin PowerShell): `Restart-Service postgresql-x64-18`
- Logged in without password, ran: `ALTER USER postgres PASSWORD 'postgres123';`
- Reverted `pg_hba.conf` back to `scram-sha-256`, restarted service

### 3. Database Setup
```sql
CREATE ROLE dm_dashboard_app WITH LOGIN PASSWORD 'uh46Pk6NRho4rnnz1A1ETxWu';
CREATE DATABASE dm_dashboard OWNER dm_dashboard_app;
```

### 4. Dump Restore
```
PGPASSWORD='uh46Pk6NRho4rnnz1A1ETxWu' pg_restore -U dm_dashboard_app -h 127.0.0.1
  -d dm_dashboard --clean --if-exists dm_dashboard_backup_2026-09-01.dump
```

### 5. Backend .env
- Teammate sent `.env` as a handoff doc with instructions mixed in
- Rewrote file keeping only actual env vars
- Key fix: removed all header/instruction text from top of file

### 6. Python 3.13 + venv
```
# Installed Python 3.13 at C:\Program Files\Python313\
"C:\Program Files\Python313\python.exe" -m venv venv
venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 7. Frontend Setup
```
copy .env.example .env
# Fixed port: VITE_API_URL=http://localhost:8199 → http://localhost:8499
npm install
```

### 8. Password Reset for piranav
```python
# Generated hash via venv python:
import bcrypt; bcrypt.hashpw(b'piranav123', bcrypt.gensalt(12))
# Updated in DB:
UPDATE public.users SET password_hash = '<hash>' WHERE username = 'piranav';
```
