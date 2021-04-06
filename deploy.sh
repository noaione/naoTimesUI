#!/bin/bash

# Since I'm using NVM
PATH=~/.nvm/versions/node/v14.15.1/bin:$PATH
cd /var/www/naotimes-webui

# Pull newest commit
git pull

# Install deps and build
pnpm install --frozen-lockfile
pnpm run build

# Restart pm2
pm2 restart --silent naoTimesUI

