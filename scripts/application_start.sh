#!/bin/bash
cd /var/www/backend
npm install && npm install -g pm2 && npm uninstall bcrypt && npm install bcrypt
cd /var/www/backend && pm2 start 'npm start'
sudo pm2 restart 0
