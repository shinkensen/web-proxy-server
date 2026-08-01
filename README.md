# Web Proxy Server

A modern, fast, and secure web proxy server with a beautiful frontend UI. Built with Node.js, Express, and vanilla JavaScript.

![Web Proxy](https://img.shields.io/badge/proxy-web-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

✨ **Modern UI** - Beautiful, responsive interface with dark mode design  
🚀 **Fast & Reliable** - High-performance proxy with minimal latency  
🔒 **Secure** - HTTPS support and secure headers configuration  
🎯 **Anonymous Browsing** - Hide your IP address and browse privately  
📱 **Mobile Friendly** - Fully responsive design works on all devices  
⚡ **PM2 Ready** - Production-ready with PM2 process manager configuration  

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PM2 (for production deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/shinkensen/web-proxy-server.git
cd web-proxy-server
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env file with your settings
```

4. **Start the server**

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Using PM2:**
```bash
npm run pm2:start
```

## PM2 Deployment on Azure VM

### Setup on Azure VM

1. **SSH into your Azure VM**
```bash
ssh user@your-azure-vm-ip
```

2. **Install Node.js and PM2**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

3. **Clone and setup the project**
```bash
git clone https://github.com/shinkensen/web-proxy-server.git
cd web-proxy-server
npm install
```

4. **Configure environment**
```bash
cp .env.example .env
nano .env  # Edit with your settings
```

5. **Start with PM2**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

6. **Configure firewall (if needed)**
```bash
sudo ufw allow 3000/tcp
sudo ufw enable
```

### PM2 Commands

```bash
# Start the application
npm run pm2:start

# Stop the application
npm run pm2:stop

# Restart the application
npm run pm2:restart

# View logs
npm run pm2:logs

# Monitor
pm2 monit

# View status
pm2 status
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DOMAIN=proxy.dev7.xyz
NODE_ENV=production
```

### PM2 Configuration

The `ecosystem.config.js` file contains PM2 configuration:

```javascript
module.exports = {
  apps: [{
    name: 'web-proxy',
    script: './server.js',
    instances: 1,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DOMAIN: 'proxy.dev7.xyz'
    }
  }]
};
```

## Usage

1. Open your browser and navigate to `http://localhost:3000` (or your configured domain)
2. Enter any URL in the input field
3. Click "Go" or press Enter
4. The website will load through the proxy in the iframe below

### Quick Access Links

The interface includes quick access buttons for popular websites:
- Google
- YouTube
- Wikipedia
- Reddit

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and configuration.

### Proxy Endpoint
```
GET /proxy?url=<target_url>
```
Proxies requests to the target URL.

### Fetch API
```
GET /api/fetch?url=<target_url>
```
Fetches content from the target URL and returns it.

## Architecture

```
web-proxy-server/
├── public/              # Frontend files
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styling
│   └── script.js       # Client-side JavaScript
├── server.js           # Express server
├── ecosystem.config.js # PM2 configuration
├── package.json        # Dependencies
├── .env.example        # Environment variables template
└── README.md           # Documentation
```

## Technologies Used

- **Backend**: Node.js, Express
- **Proxy**: http-proxy-middleware
- **Security**: Helmet, CORS
- **Compression**: compression
- **Process Manager**: PM2
- **Frontend**: Vanilla JavaScript, CSS3, HTML5

## Security Features

- CORS enabled for cross-origin requests
- Helmet.js for secure HTTP headers
- No logging of browsing history
- SSL/TLS support ready
- Secure proxy headers handling

## Performance

- Gzip compression enabled
- Efficient proxy middleware
- Cluster mode support with PM2
- Memory limit controls
- Auto-restart on failures

## Troubleshooting

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000
# Or on Windows
netstat -ano | findstr :3000

# Kill the process or change PORT in .env
```

### PM2 not starting
```bash
# Check PM2 logs
pm2 logs web-proxy

# Restart PM2
pm2 restart web-proxy
```

### Connection refused
- Check if the server is running
- Verify firewall settings
- Ensure correct PORT configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Domain Configuration

This proxy server is configured to connect to **proxy.dev7.xyz**. The domain is displayed in the footer and can be verified via the `/health` endpoint.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ for anonymous and secure web browsing
