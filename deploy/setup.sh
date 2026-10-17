#!/usr/bin/env bash
# GLC Property: one-time server setup (run as root on the server). Safe to run again.
#   bash deploy/setup.sh glcproperty.online
# Needs: MongoDB running locally, nginx, python3, node + npm, certbot (optional, for https).
set -euo pipefail

DOMAIN="${1:-glcproperty.online}"
APP=/var/www/glc-property
PORT="${PORT:-8010}"
REPO=https://github.com/glccoinzone-afk/glc_property.git

[ "$(id -u)" = 0 ] || { echo "run as root"; exit 1; }
command -v node >/dev/null || { echo "node is missing"; exit 1; }
command -v nginx >/dev/null || { echo "nginx is missing"; exit 1; }
if ss -ltn | grep -q ":${PORT} "; then
  [ -f /etc/systemd/system/glc-property.service ] || { echo "port ${PORT} is already used: run with PORT=8011 bash deploy/setup.sh"; exit 1; }
fi

if [ ! -d "$APP/.git" ]; then git clone "$REPO" "$APP"; else git -C "$APP" pull --ff-only origin main; fi
cd "$APP"

# backend
python3 -m venv backend/venv
./backend/venv/bin/pip install -q --upgrade pip
./backend/venv/bin/pip install -q -r deploy/requirements.txt

if [ ! -f backend/.env ]; then
  JWT=$(python3 -c 'import secrets;print(secrets.token_urlsafe(48))')
  ADMINPW=$(python3 -c 'import secrets;print(secrets.token_urlsafe(9))')
  cat > backend/.env <<EOT
APP_ENV=production
MONGO_URL=mongodb://localhost:27017
DB_NAME=glc_property
JWT_SECRET=${JWT}
CORS_ORIGINS=https://${DOMAIN},https://www.${DOMAIN}
ADMIN_EMAIL=admin@${DOMAIN}
ADMIN_PASSWORD=${ADMINPW}
EOT
  chmod 600 backend/.env
  echo "=== ADMIN LOGIN (note it now, change it after login) ==="
  echo "email: admin@${DOMAIN}    password: ${ADMINPW}"
  echo "========================================================"
fi

# frontend
echo "REACT_APP_BACKEND_URL=https://${DOMAIN}" > frontend/.env
( cd frontend && npm install --legacy-peer-deps --no-audit --no-fund && npm run build )

# service
cat > /etc/systemd/system/glc-property.service <<EOT
[Unit]
Description=GLC Property API
After=network.target mongod.service

[Service]
WorkingDirectory=${APP}/backend
ExecStart=${APP}/backend/venv/bin/uvicorn server:app --host 127.0.0.1 --port ${PORT}
Restart=always
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
EOT
chown -R www-data:www-data "$APP"
systemctl daemon-reload
systemctl enable --now glc-property
systemctl restart glc-property

# nginx
cat > /etc/nginx/sites-available/glc-property <<EOT
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    root ${APP}/frontend/build;
    index index.html;
    client_max_body_size 20m;

    location /api/ {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    location / {
        try_files \$uri /index.html;
    }
}
EOT
ln -sf /etc/nginx/sites-available/glc-property /etc/nginx/sites-enabled/glc-property
nginx -t && systemctl reload nginx

sleep 2
curl -fsS "http://127.0.0.1:${PORT}/api/health" && echo
echo "Next: point DNS A record of ${DOMAIN} (and www) to this server, then: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
