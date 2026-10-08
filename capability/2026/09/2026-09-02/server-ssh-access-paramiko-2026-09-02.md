---
name: server-ssh-access-paramiko-2026-09-02
description: New capability — direct SSH and PostgreSQL access to Contabo VPS via Python paramiko, no PuTTY needed
metadata:
  type: capability
---

# Capability — Direct Server SSH Access via Paramiko

**Date:** 2026-09-02
**Engineer:** Piranav

---

## Capability Demonstrated

Claude can now connect directly to the Contabo VPS and PostgreSQL database using Python paramiko — without the user needing to use PuTTY.

---

## SSH Connection Pattern

```python
import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('158.220.99.127', username='root', password='***')

stdin, stdout, stderr = client.exec_command('your command here')
print(stdout.read().decode(errors='replace'))
client.close()
```

## PostgreSQL Connection Pattern

```python
import psycopg

conn = psycopg.connect(
    host='158.220.99.127',
    port=5432,
    dbname='dm_dashboard',
    user='dm_user',
    password='***'
)
cur = conn.execute('SELECT COUNT(*) FROM users')
print(cur.fetchone()[0])
conn.close()
```

---

## Verified Working

- SSH: `whoami` → `root` ✅
- Services: `dm-dashboard` active, `nginx` active ✅
- PostgreSQL: `SELECT COUNT(*) FROM users` → 15 ✅

---

## Install Requirements

```bash
python3 -m pip install paramiko psycopg[binary]
```

---

## Use Cases

- Run deploy.sh remotely
- Check service status
- View backend logs
- Query database directly
- Restart services after changes
