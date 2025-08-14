# HTTPS Setup for API Server

## Option 1: Using Let's Encrypt (Free SSL)

1. **SSH into your server:**
   ```bash
   ssh user@54.85.164.84
   ```

2. **Install Certbot:**
   ```bash
   sudo apt update
   sudo apt install certbot
   ```

3. **Get SSL certificate:**
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```

4. **Configure your API server to use HTTPS:**
   ```javascript
   const https = require('https');
   const fs = require('fs');
   
   const options = {
     key: fs.readFileSync('/etc/letsencrypt/live/your-domain.com/privkey.pem'),
     cert: fs.readFileSync('/etc/letsencrypt/live/your-domain.com/fullchain.pem')
   };
   
   https.createServer(options, app).listen(5001);
   ```

## Option 2: Using Nginx as Reverse Proxy

1. **Install Nginx:**
   ```bash
   sudo apt install nginx
   ```

2. **Configure Nginx:**
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;
       
       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
       
       location / {
           proxy_pass http://localhost:5001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Option 3: Using Cloudflare (Easiest)

1. **Add your domain to Cloudflare**
2. **Enable SSL/TLS encryption mode: "Full"**
3. **Update your API URL to use Cloudflare proxy**

## Option 4: Using a CORS Proxy Service

If you can't modify the server, use a reliable CORS proxy:

```javascript
// Update API_BASE_URL to use a reliable proxy
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.allorigins.win/raw?url=http://54.85.164.84:5001/crud'
  : 'http://54.85.164.84:5001/crud';
```
