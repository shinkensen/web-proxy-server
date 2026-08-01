# 🚀 Quick Start Guide

## ✅ Repository Published
**GitHub URL**: https://github.com/shinkensen/web-proxy-server

## 📦 What You Have

A complete web proxy server with:
- ✨ Modern, beautiful dark-themed UI
- 🔒 Secure proxy functionality with CORS and Helmet
- 📱 Fully responsive design
- ⚡ PM2-ready for production deployment
- 🌐 Configured for proxy.dev7.xyz

## 🎯 Current Status on Azure VM

Based on your terminal output, you've successfully:
1. ✅ Cloned the repository
2. ✅ Installed dependencies (115 packages, 0 vulnerabilities)
3. ✅ Started with PM2
4. ✅ Server is running on port 3000

**PM2 Status**: `web-proxy` is online and running

## 🌐 Access Your Proxy

### On Azure VM:
```
http://your-azure-vm-ip:3000
```

### Once DNS is configured:
```
http://proxy.dev7.xyz:3000
```

## 🔧 Common Commands

### PM2 Management
```bash
# View status
pm2 status

# View logs
pm2 logs web-proxy

# Restart
pm2 restart web-proxy

# Stop
pm2 stop web-proxy

# Monitor
pm2 monit
```

### Update Code
```bash
cd ~/web-proxy-server
git pull origin master
npm install
pm2 restart web-proxy
```

## 🚨 Troubleshooting

### Port 3000 Not Accessible?
```bash
# Check if running
pm2 status

# Check Azure firewall
# In Azure Portal: VM → Networking → Add inbound port rule
# Port: 3000
# Protocol: TCP
# Action: Allow
```

### Can't Connect to Proxy?
```bash
# Test locally on VM
curl http://localhost:3000/health

# Should return: {"status":"ok","domain":"proxy.dev7.xyz",...}
```

## 🎨 Features

### Frontend (http://your-server:3000)
- Clean, modern interface with purple gradient design
- URL input with validation
- Quick access buttons (Google, YouTube, Wikipedia, Reddit)
- Iframe-based proxy viewer with controls
- Responsive mobile-friendly design

### Backend
- Express.js server
- http-proxy-middleware for proxying
- Security headers with Helmet
- CORS enabled
- Gzip compression
- Health check endpoint

## 📡 API Endpoints

### Health Check
```bash
GET http://your-server:3000/health
```

### Proxy a URL
```bash
GET http://your-server:3000/proxy?url=https://example.com
```

### Fetch API
```bash
GET http://your-server:3000/api/fetch?url=https://example.com
```

## 🔐 Production Setup (Optional)

### Setup Nginx Reverse Proxy
```bash
sudo apt install nginx

# Configure nginx to proxy port 80 to 3000
sudo nano /etc/nginx/sites-available/proxy

# Add:
server {
    listen 80;
    server_name proxy.dev7.xyz;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}

# Enable and restart
sudo ln -s /etc/nginx/sites-available/proxy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Setup SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d proxy.dev7.xyz
```

## 📝 Configuration

### Environment Variables (.env)
```env
PORT=3000
DOMAIN=proxy.dev7.xyz
NODE_ENV=production
```

### PM2 Config (ecosystem.config.js)
- Auto-restart on crash
- Logs in ./logs/ directory
- Memory limit: 1GB
- Cluster mode ready

## 🎉 You're All Set!

Your web proxy server is:
- ✅ Built and tested locally
- ✅ Published to GitHub: https://github.com/shinkensen/web-proxy-server
- ✅ Deployed on Azure VM with PM2
- ✅ Running and ready to use!

Visit: `http://YOUR-AZURE-VM-IP:3000`

---

**Need help?** Check the full documentation:
- [README.md](README.md) - Full documentation
- [DEPLOY.md](DEPLOY.md) - Detailed deployment guide
- [GitHub Issues](https://github.com/shinkensen/web-proxy-server/issues) - Report problems
