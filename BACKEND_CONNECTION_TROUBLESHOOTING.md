# Backend Connection Troubleshooting Guide

## 🚨 Current Issue
Your frontend is getting "Failed to fetch" errors because it cannot connect to your backend server at `http://54.85.164.84:5001`.

## 🔍 Diagnosis
- ✅ Ping test: 100% packet loss (server not reachable)
- ✅ Curl test: "Unable to connect to the remote server"
- ✅ API test: "fetch failed" error

## 🛠️ Solutions

### Option 1: Check if your server is running
```bash
# SSH into your server
ssh user@54.85.164.84

# Check if your API server is running
ps aux | grep node
# or
systemctl status your-api-service
# or
pm2 list
```

### Option 2: Start your API server if it's down
```bash
# Navigate to your API directory
cd /path/to/your/api

# Start the server
node server.js
# or
npm start
# or
pm2 start server.js
```

### Option 3: Check if IP address changed
1. Log into your cloud provider (AWS, DigitalOcean, etc.)
2. Check the current IP address of your server
3. Update the API URL in your frontend code

### Option 4: Update API URL in frontend
If your server has a new IP address, update these files:

1. **Environment Variable (Recommended)**
   Create a `.env.local` file in your project root:
   ```
   NEXT_PUBLIC_API_URL=http://YOUR_NEW_SERVER_IP:5001
   ```

2. **Or update the hardcoded URLs in these files:**
   - `src/app/utils/api.ts`
   - `src/app/utils/companyApi.ts`
   - `src/app/utils/projectApi.ts`
   - `src/app/utils/teamApi.ts`
   - `src/app/utils/taskApi.ts`

### Option 5: Check firewall settings
```bash
# On your server, check if port 5001 is open
sudo netstat -tlnp | grep :5001
# or
sudo ufw status
```

### Option 6: Test server connectivity
```bash
# Test if the server responds
curl http://YOUR_SERVER_IP:5001/health
# or
curl http://YOUR_SERVER_IP:5001/crud?tableName=project-management-companies
```

## 🔧 Quick Fix Steps

1. **Find your server's current IP address**
2. **SSH into your server and start the API service**
3. **Update the API URL in your frontend**
4. **Test the connection**

## 📝 Example: If your server IP is now 192.168.1.100

1. Create `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://192.168.1.100:5001
   ```

2. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

3. Test the connection:
   ```bash
   node test-api.js
   ```

## 🆘 Still having issues?

1. **Check server logs** for any errors
2. **Verify DynamoDB credentials** are correct
3. **Ensure CORS is enabled** on your backend
4. **Check if the server is listening on the correct port**

## 📞 Next Steps

Once you've identified your server's current IP address and ensured it's running:

1. Update the `NEXT_PUBLIC_API_URL` environment variable
2. Restart your Next.js development server
3. Test the API connection
4. Your frontend should now be able to fetch data from DynamoDB

---
**Last Updated**: December 2024
**Status**: ⚠️ **BACKEND CONNECTION ISSUE - NEEDS FIXING**


