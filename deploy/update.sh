#!/usr/bin/env bash
# GLC Property: update after new code is merged to main (run as root on the server).
set -euo pipefail
APP=/var/www/glc-property
git config --global --get-all safe.directory | grep -qx "$APP" || git config --global --add safe.directory "$APP"   # the app is owned by www-data, git refuses root otherwise
cd "$APP"
git pull --ff-only origin main
./backend/venv/bin/pip install -q -r deploy/requirements.txt
( cd frontend && npm install --legacy-peer-deps --no-audit --no-fund && npm run build )
chown -R www-data:www-data "$APP"
systemctl restart glc-property
sleep 2
curl -fsS http://127.0.0.1:"$(grep -oP '(?<=--port )\d+' /etc/systemd/system/glc-property.service)"/api/health && echo
echo "Updated: $(git rev-parse --short HEAD)"
