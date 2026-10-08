---
name: pgadmin-remote-access-2026-09-02
description: New capability — configure PostgreSQL on Contabo VPS to accept remote pgAdmin connections from Windows
metadata:
  type: capability
---

# Capability — pgAdmin Remote Access to Contabo PostgreSQL

**Date:** 2026-09-02
**Engineer:** Piranav

---

## Capability Demonstrated

Configured the Contabo VPS PostgreSQL instance to accept external connections from pgAdmin on a Windows PC.

---

## Steps Learned

### 1. Allow PostgreSQL to listen on all interfaces
```bash
nano /etc/postgresql/16/main/postgresql.conf
# Change:  #listen_addresses = 'localhost'
# To:       listen_addresses = '*'
```

### 2. Allow external user connections
```bash
nano /etc/postgresql/16/main/pg_hba.conf
# Add at bottom:
host    dm_dashboard    dm_user    0.0.0.0/0    md5
```

### 3. Restart PostgreSQL
```bash
systemctl restart postgresql
```

### 4. pgAdmin connection details
```
Host:     158.220.99.127
Port:     5432
Database: dm_dashboard
Username: dm_user
```

---

## Key Notes

- UFW was inactive on this server — no firewall rule needed
- `listen_addresses = 'localhost'` is the default — PostgreSQL ignores external connections until changed
- `0.0.0.0/0` in pg_hba.conf allows any IP — fine for internal tool, tighten if needed
- After any pg_hba.conf or postgresql.conf change, always restart PostgreSQL
