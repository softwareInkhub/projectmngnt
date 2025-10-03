# 🐛 Authentication Debugging & Troubleshooting Guide

This guide helps you debug authentication issues between the central auth system and the projectmngnt app.

## 🔍 **Quick Debug Commands**

Open your browser console and run these commands:

```javascript
// Get comprehensive auth debug info
window.debugAuth.log()

// Test the auth flow
window.debugAuth.test()

// Clear all auth data and start fresh
window.debugAuth.clear()

// Get raw debug info
window.debugAuth.getInfo()
```

## 🚨 **Common Issues & Solutions**

### Issue 1: No redirect to auth.brmh.in

**Symptoms:**
- User visits projectmngnt app but doesn't get redirected to login
- App loads normally without authentication check

**Debug Steps:**
1. Check browser console for middleware logs:
   ```javascript
   // Look for these logs in console:
   // "[Middleware] Checking authentication: ..."
   // "[Middleware] No auth token found, redirecting to central auth: ..."
   ```

2. Check if middleware is running:
   ```javascript
   // In browser console, check if you see middleware logs
   console.log('Middleware should log authentication checks')
   ```

3. Verify middleware configuration:
   - Check `middleware.ts` exists in project root
   - Verify `matcher` configuration includes your routes

**Solutions:**
- Ensure `middleware.ts` is in the project root (not in `src/`)
- Check that the route you're visiting is not excluded by the matcher
- Verify Next.js version supports middleware

### Issue 2: Tokens exist but app doesn't recognize user

**Symptoms:**
- User has tokens in localStorage/cookies
- App still shows as not authenticated
- UserContext shows `currentUser: null`

**Debug Steps:**
1. Check token format consistency:
   ```javascript
   window.debugAuth.log()
   // Look for mismatched token keys:
   // localStorage.access_token vs localStorage.accessToken
   ```

2. Check token validity:
   ```javascript
   window.debugAuth.test()
   // Look for "Has valid JWT format: false"
   ```

3. Check UserContext logs:
   ```javascript
   // Look for these logs in console:
   // "🔄 fetchCurrentUser - token exists: true/false"
   // "❌ No valid tokens found"
   ```

**Solutions:**
- Clear all auth data: `window.debugAuth.clear()`
- Re-authenticate through central auth
- Check if tokens are expired (JWT tokens have expiration)

### Issue 3: Cookie vs localStorage mismatch

**Symptoms:**
- Backend sets cookies but frontend checks localStorage
- Different token storage formats between apps

**Debug Steps:**
1. Check both storage types:
   ```javascript
   const info = window.debugAuth.getInfo()
   console.log('localStorage tokens:', info.localStorage)
   console.log('Cookie tokens:', info.cookies)
   ```

2. Check cookie domain:
   ```javascript
   document.cookie // Should show cookies with domain=.brmh.in
   ```

**Solutions:**
- Central auth now stores tokens in both formats for compatibility
- Backend sets cookies with `.brmh.in` domain for cross-subdomain sharing
- If cookies aren't working, localStorage should still work

### Issue 4: Domain/CORS issues

**Symptoms:**
- CORS errors in browser console
- Cookies not being set/read across domains
- Authentication works on one domain but not another

**Debug Steps:**
1. Check domain compatibility:
   ```javascript
   window.debugAuth.test()
   // Look for domain compatibility results
   ```

2. Check CORS configuration:
   ```javascript
   // In browser console, check for CORS errors
   // Look for "Access-Control-Allow-Origin" errors
   ```

3. Check cookie domain:
   ```javascript
   document.cookie // Should show cookies for .brmh.in domain
   ```

**Solutions:**
- Ensure all apps are on `*.brmh.in` subdomains
- Check backend CORS configuration includes your domain
- Verify cookie domain is set to `.brmh.in`

## 🔧 **Step-by-Step Debugging Process**

### Step 1: Check Authentication State
```javascript
// Run this first
window.debugAuth.log()
```

### Step 2: Test Auth Flow
```javascript
// Run comprehensive tests
window.debugAuth.test()
```

### Step 3: Check Network Requests
1. Open browser DevTools → Network tab
2. Look for failed requests to:
   - `https://auth.brmh.in/*`
   - `https://brmh.in/auth/*`
3. Check response status codes and error messages

### Step 4: Check Console Logs
Look for these specific log patterns:

**Middleware Logs:**
```
[Middleware] Checking authentication: { pathname: "/dashboard", hasIdTokenCookie: false, ... }
[Middleware] No auth token found, redirecting to central auth: https://...
```

**UserContext Logs:**
```
🔄 fetchCurrentUser - token exists: true/false
🔄 fetchCurrentUser - id token exists: true/false
✅ Got user data from JWT token: {...}
❌ No valid tokens found
```

**Auth Service Logs:**
```
[AuthService] Stored user info from ID token: {...}
[Auth] Login successful, redirecting to: https://...
```

### Step 5: Manual Token Verification
```javascript
// Check if tokens are valid JWTs
const token = localStorage.getItem('id_token')
if (token) {
  try {
    const parts = token.split('.')
    const payload = JSON.parse(atob(parts[1]))
    console.log('Token payload:', payload)
    console.log('Token expires:', new Date(payload.exp * 1000))
  } catch (e) {
    console.error('Invalid token format:', e)
  }
}
```

## 🛠️ **Manual Fixes**

### Fix 1: Clear All Auth Data
```javascript
// Clear everything and start fresh
window.debugAuth.clear()
// Then visit: https://auth.brmh.in/login?next=https://your-projectmngnt-url
```

### Fix 2: Manual Token Storage
If tokens exist but aren't being read:
```javascript
// Copy tokens from one format to another
const accessToken = localStorage.getItem('accessToken')
const idToken = localStorage.getItem('idToken')

if (accessToken && !localStorage.getItem('access_token')) {
  localStorage.setItem('access_token', accessToken)
}
if (idToken && !localStorage.getItem('id_token')) {
  localStorage.setItem('id_token', idToken)
}
```

### Fix 3: Force Redirect to Auth
```javascript
// Force redirect to central auth
window.location.href = 'https://auth.brmh.in/login?next=' + encodeURIComponent(window.location.href)
```

## 🔄 **Complete Reset Process**

If nothing else works, perform a complete reset:

1. **Clear all browser data:**
   ```javascript
   window.debugAuth.clear()
   // Or manually clear in DevTools → Application → Storage
   ```

2. **Clear browser cookies:**
   - Go to DevTools → Application → Cookies
   - Delete all cookies for your domain

3. **Restart authentication flow:**
   - Visit: `https://auth.brmh.in/login`
   - Login with your credentials
   - Should redirect back to projectmngnt app

4. **Verify tokens are stored:**
   ```javascript
   window.debugAuth.log()
   ```

## 📊 **Environment-Specific Debugging**

### Development (localhost)
```javascript
// Check if running on localhost
console.log('Domain:', window.location.hostname)
// Should be 'localhost' or '127.0.0.1'
```

### Production (Vercel)
```javascript
// Check if running on Vercel
console.log('Domain:', window.location.hostname)
// Should be something like 'projectmngnt.vercel.app'
```

### Custom Domain
```javascript
// Check if running on custom domain
console.log('Domain:', window.location.hostname)
// Should be something like 'projectmngnt.brmh.in'
```

## 🚨 **Emergency Contacts & Resources**

### Backend Logs
- Check backend console for authentication errors
- Look for CORS rejections
- Verify token exchange is working

### Frontend Logs
- Browser console shows all client-side errors
- Network tab shows failed requests
- Application tab shows storage issues

### Common Error Messages
- `CORS: Rejected origin` → Backend CORS issue
- `Invalid token format` → JWT parsing error
- `No valid tokens found` → Missing or expired tokens
- `Network error during authentication` → Backend connectivity issue

## 📝 **Debug Checklist**

- [ ] Middleware is running (check console logs)
- [ ] Tokens exist in localStorage (check debug output)
- [ ] Tokens are valid JWT format (check test results)
- [ ] User info is extracted from tokens (check debug output)
- [ ] No CORS errors in network tab
- [ ] Backend is responding (check network requests)
- [ ] Domain compatibility is correct (check test results)
- [ ] Cookies are set with correct domain (check Application tab)

## 🎯 **Quick Wins**

1. **Always start with:** `window.debugAuth.log()`
2. **Check the obvious:** Are tokens actually there?
3. **Verify format:** Are they valid JWTs?
4. **Test flow:** `window.debugAuth.test()`
5. **Clear and retry:** `window.debugAuth.clear()` then re-authenticate

---

**💡 Pro Tip:** Keep the browser console open while testing authentication. Most issues will show up as error messages or failed network requests.
