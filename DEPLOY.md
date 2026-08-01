# Deployment Guide for Azure VM

This guide will help you deploy the Web Proxy Server on your Azure VM using PM2.

## Prerequisites

- Azure VM with Ubuntu/Debian or similar Linux distribution
- SSH access to your VM
- Domain name configured (proxy.dev7.xyz)

## Step-by-Step Deployment

### 1. Connect to Your Azure VM

```bash
ssh your-username@your-azure-vm-ip
```

### 2. Install Node.js and npm

```bash
# Update package manager
sudo apt update

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install PM2 Globally

```bash
sudo npm install -g pm2
pm2 --version
```

### 4. Clone the Repository

```bash
# Navigate to your preferred directory
cd /home/your-username

# Clone the repository
git clone https://github.com/shinkensen/web-proxy-server.git
cd web-proxy-server
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit the environment file
nano .env
```

Update the `.env` file:
```env
PORT=3000
DOMAIN=proxy.dev7.xyz
NODE_ENV=production
```

### 7. Create Logs Directory

```bash
mkdir -p logs
```

### 8. Start with PM2

```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd
# Follow the command it outputs
```

### 9. Configure Firewall

```bash
# Allow port 3000 (or your chosen port)
sudo ufw allow 3000/tcp

# If UFW is not enabled
sudo ufw enable
sudo ufw status
```

### 10. Optional - Setup Nginx Reverse Proxy

For production, it's recommended to use Nginx as a reverse proxy:

```bash
# Install Nginx
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/proxy
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name proxy.dev7.xyz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/proxy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 11. Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d proxy.dev7.xyz

# Auto-renewal is enabled by default
sudo certbot renew --dry-run
```

## PM2 Management Commands

```bash
# View application status
pm2 status

# View logs
pm2 logs web-proxy

# View real-time monitoring
pm2 monit

# Restart application
pm2 restart web-proxy

# Stop application
pm2 stop web-proxy

# Start application
pm2 start web-proxy

# Delete from PM2
pm2 delete web-proxy

# Save current PM2 configuration
pm2 save
```

## Updating the Application

```bash
# Navigate to project directory
cd /home/your-username/web-proxy-server

# Pull latest changes
git pull origin master

# Install any new dependencies
npm install

# Restart with PM2
pm2 restart web-proxy
```

## Monitoring

### View Application Logs
```bash
# All logs
pm2 logs web-proxy

# Only error logs
pm2 logs web-proxy --err

# Only output logs
pm2 logs web-proxy --out

# Clear logs
pm2 flush
```

### System Resources
```bash
# Real-time monitoring
pm2 monit

# Process details
pm2 show web-proxy
```

## Troubleshooting

### Application Won't Start

1. Check PM2 logs:
```bash
pm2 logs web-proxy --lines 100
```

2. Check if port is already in use:
```bash
sudo lsof -i :3000
```

3. Verify Node.js version:
```bash
node --version  # Should be >= 18.0.0
```

### Port Access Issues

1. Check firewall:
```bash
sudo ufw status
```

2. Ensure Azure Network Security Group allows inbound traffic on port 3000 or 80/443

### PM2 Not Starting on Boot

```bash
# Re-run startup command
pm2 startup systemd

# Execute the command it provides
# Then save configuration
pm2 save
```

### Memory Issues

If the application restarts frequently due to memory:

1. Check memory usage:
```bash
pm2 monit
```

2. Adjust `max_memory_restart` in `ecosystem.config.js`

### Cannot Access Website

1. Check if application is running:
```bash
pm2 status
```

2. Check if port is listening:
```bash
sudo netstat -tulpn | grep 3000
```

3. Test locally on VM:
```bash
curl http://localhost:3000/health
```

4. Check DNS configuration for proxy.dev7.xyz

## Security Recommendations

1. **Keep packages updated:**
```bash
npm audit
npm audit fix
```

2. **Use environment variables for sensitive data** - Never commit `.env` to git

3. **Enable firewall:**
```bash
sudo ufw enable
sudo ufw status verbose
```

4. **Regular backups:**
```bash
# Backup application
tar -czf web-proxy-backup-$(date +%Y%m%d).tar.gz /path/to/web-proxy-server
```

5. **Monitor logs regularly:**
```bash
pm2 logs web-proxy
```

## Performance Tuning

### Increase PM2 Instances (Cluster Mode)

Edit `ecosystem.config.js`:
```javascript
instances: 'max',  // or specific number like 2, 4
```

Then restart:
```bash
pm2 restart web-proxy
```

### Enable PM2 Monitoring (Optional)

```bash
pm2 install pm2-server-monit
```

## Support

For issues or questions:
- GitHub Issues: https://github.com/shinkensen/web-proxy-server/issues
- Check logs: `pm2 logs web-proxy`

---

🎉 Your web proxy server should now be running on your Azure VM!
