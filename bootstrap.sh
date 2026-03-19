#!/bin/bash
set -e

echo "🚀 Starting VPS setup..."

# ---- 1. System update ----
apt update && apt upgrade -y

# ---- 2. Install Docker ----
apt install -y ca-certificates curl gnupg

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "✅ Docker installed: $(docker --version)"

# ---- 3. Install PostgreSQL 16 ----
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/keyrings/postgresql.gpg

echo "deb [signed-by=/etc/apt/keyrings/postgresql.gpg] https://apt.postgresql.org/pub/repos/apt $(. /etc/os-release && echo "$VERSION_CODENAME")-pgdg main" \
  | tee /etc/apt/sources.list.d/pgdg.list > /dev/null

apt update
apt install -y postgresql-16

# ---- Wait for PostgreSQL to fully start ----
echo "⏳ Waiting for PostgreSQL to start..."
systemctl enable postgresql
systemctl start postgresql

# Poll until socket is ready (max 30 seconds)
for i in $(seq 1 30); do
  if sudo -u postgres psql -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
    break
  fi
  echo "   waiting... ($i/30)"
  sleep 1
done

# Final check — exit if still not ready
if ! sudo -u postgres psql -c "SELECT 1" > /dev/null 2>&1; then
  echo "❌ PostgreSQL failed to start after 30 seconds"
  systemctl status postgresql
  exit 1
fi

echo "✅ PostgreSQL installed: $(psql --version)"

# ---- 4. Create database & user ----
sudo -u postgres psql <<SQL
CREATE USER myapp WITH PASSWORD 'changeme_strong_password';
CREATE DATABASE myapp_db OWNER myapp;
GRANT ALL PRIVILEGES ON DATABASE myapp_db TO myapp;
SQL

echo "✅ Database and user created"

# ---- 5. Allow Docker bridge to reach PostgreSQL ----
DOCKER_BRIDGE_IP="172.17.0.1"

sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost,$DOCKER_BRIDGE_IP'/" \
  /etc/postgresql/16/main/postgresql.conf

echo "host    myapp_db    myapp    172.17.0.0/16    scram-sha-256" \
  >> /etc/postgresql/16/main/pg_hba.conf

systemctl restart postgresql

# Wait for restart
echo "⏳ Waiting for PostgreSQL to restart..."
for i in $(seq 1 30); do
  if sudo -u postgres psql -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ PostgreSQL restarted successfully"
    break
  fi
  echo "   waiting... ($i/30)"
  sleep 1
done

echo "✅ PostgreSQL configured for Docker bridge"

# ---- 6. Install Certbot ----
apt install -y certbot

echo "✅ Certbot installed"

# ---- 7. Create deploy user ----
useradd -m -s /bin/bash deploy
usermod -aG docker deploy

echo "✅ Deploy user created"

# ---- 8. Create app directory ----
mkdir -p /opt/webpexo
chown deploy:deploy /opt/webpexo

echo "✅ App directory created at /opt/webpexo"

# ---- 9. Setup backup script ----
mkdir -p /opt/backups/postgres

cat > /opt/backups/postgres/backup.sh <<'EOF'
#!/bin/bash
set -e

DB_NAME="myapp_db"
BACKUP_DIR="/opt/backups/postgres"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=7

sudo -u postgres pg_dump "$DB_NAME" | gzip > "$BACKUP_FILE"

find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "[$(date)] Backup saved: $BACKUP_FILE"
EOF

chmod +x /opt/backups/postgres/backup.sh

(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backups/postgres/backup.sh >> /var/log/pg_backup.log 2>&1") | crontab -

echo "✅ Backup script created and scheduled at 2am daily"

# ---- 10. Firewall ----
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "✅ Firewall configured"

echo ""
echo "✅ VPS setup complete!"
echo ""
echo "Next steps:"
echo "  1. Upload your project:  rsync -avz --exclude node_modules --exclude .git ./ deploy@YOUR_VPS_IP:/opt/webpexo/"
echo "  2. Issue SSL certs:      certbot certonly --standalone -d webpexo.com -d www.webpexo.com"
echo "                           certbot certonly --standalone -d api.webpexo.com"
echo "  3. SSH in as deploy:     ssh deploy@YOUR_VPS_IP"
echo "  4. Start the stack:      cd /opt/webpexo && docker compose up -d --build"