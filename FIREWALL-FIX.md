# 🔥 Azure Firewall Fix for Port 3000

## Problem
Your DNS is configured correctly (proxy.dev7.xyz → 20.63.102.6), and the server is running on the VM, but connections time out because Azure's firewall is blocking port 3000.

## ✅ Solution: Open Port 3000 in Azure

### Option 1: Azure Portal (Easiest)

1. **Go to Azure Portal**: https://portal.azure.com
2. **Find your VM**:
   - Search for "Virtual machines"
   - Click on your VM (rux)
3. **Open Networking**:
   - In the left sidebar, click "**Networking**" or "**Network settings**"
4. **Add Inbound Port Rule**:
   - Click "**Add inbound port rule**" or "**Add inbound security rule**"
5. **Configure the rule**:
   ```
   Source: Any
   Source port ranges: *
   Destination: Any
   Service: Custom
   Destination port ranges: 3000
   Protocol: TCP
   Action: Allow
   Priority: 310 (or any available number)
   Name: Allow-Port-3000
   ```
6. **Click "Add"**
7. **Wait 1-2 minutes** for the rule to take effect

### Option 2: Azure CLI

```bash
# Get your VM's resource group and NSG name
az vm show --name rux --query "networkProfile.networkInterfaces[0].id" -o tsv

# Add the rule
az network nsg rule create \
  --resource-group YOUR_RESOURCE_GROUP \
  --nsg-name YOUR_NSG_NAME \
  --name Allow-Port-3000 \
  --protocol tcp \
  --priority 310 \
  --destination-port-range 3000 \
  --access Allow \
  --direction Inbound
```

## 🧪 Test After Opening Port

### 1. Test with curl (from your local machine)
```bash
curl http://20.63.102.6:3000/health
# Should return: {"status":"ok","domain":"proxy.dev7.xyz",...}
```

### 2. Test with domain
```bash
curl http://proxy.dev7.xyz:3000/health
```

### 3. Test in browser
```
http://proxy.dev7.xyz:3000
```

## 🎯 Current Status

✅ DNS Record: proxy → 20.63.102.6 (Correct!)  
✅ Server Running: PM2 shows web-proxy online  
✅ Server Logs: Listening on 0.0.0.0:3000  
❌ **Firewall: Port 3000 blocked (THIS IS THE ISSUE)**  

## 📊 Verification Commands (On VM)

```bash
# Check if server is listening
sudo netstat -tlnp | grep 3000

# Test locally on VM
curl http://localhost:3000/health

# Check PM2 status
pm2 status

# View server logs
pm2 logs web-proxy --lines 20
```

## 🚀 After Fixing Firewall

Once port 3000 is open, your proxy will be accessible at:
- **http://proxy.dev7.xyz:3000**
- **http://20.63.102.6:3000**

## 🔒 Optional: Setup Nginx Reverse Proxy (Port 80)

To access without `:3000`, setup Nginx:

```bash
# On your VM
sudo apt update
sudo apt install nginx -y

# Create nginx config
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then:
```bash
sudo ln -s /etc/nginx/sites-available/proxy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Make sure port 80 is also open in Azure firewall!

## 🔐 Add SSL (Optional)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d proxy.dev7.xyz
```

---

**TL;DR**: Open port 3000 in Azure Portal → Networking → Add inbound port rule
