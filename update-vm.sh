#!/bin/bash
# Update script for web-proxy-server on Azure VM

echo "🔄 Updating web-proxy-server..."

cd ~/web-proxy-server

echo "📥 Pulling latest code from GitHub..."
git pull origin master

echo "📦 Installing any new dependencies..."
npm install

echo "🔄 Restarting PM2 process..."
pm2 restart web-proxy

echo "💾 Saving PM2 configuration..."
pm2 save

echo "✅ Update complete!"
echo "🌐 Server running at: http://proxy.dev7.xyz:3000"

pm2 status
