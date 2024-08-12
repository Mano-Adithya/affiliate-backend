#!/bin/bash
cd /var/www/backend
chmod +x application_start.sh
chmod +x *.sh
rm -rf *
rm -rf .env
sudo npm uninstall -g pm2
