# Auth Debugging Instructions

## Problem
After logging in via `auth.brmh.in`, cookies are set but not visible to the middleware or client JavaScript.

## Debugging Steps

### Step 1: Access Debug Page
```
1. Open: https://projectmanagement.brmh.in/debug-auth
2. This page will show all visible cookies
```

### Step 2: Check Middleware Logs
```bash
# In terminal where dev server is running, you should see:
[ProjectMngnt Middleware] ==================
[ProjectMngnt Middleware] Auth check for: /debug-auth
[ProjectMngnt Middleware] All cookie names: [...]
[ProjectMngnt Middleware] Has id_token: true/false
[ProjectMngnt Middleware] Total cookies: X
[ProjectMngnt Middleware] ==================
```

### Step 3: Test Login Flow
```
1. On debug page, click "Test Login Flow"
2. You'll be redirected to auth.brmh.in
3. Login with credentials
4. You'll be redirected back to /debug-auth
5. Check what cookies are now visible
```

### Step 4: Check Browser DevTools
```
1. Open DevTools (F12)
2. Go to Application → Cookies → projectmanagement.brmh.in
3. Look for these cookies:
   - id_token (should be httpOnly: Yes)
   - access_token (should be httpOnly: Yes)
   - refresh_token (should be httpOnly: Yes)
   - auth_valid (should be httpOnly: No) ← This is what we need!
   - auth_valid_local (should be httpOnly: No) ← This too!
```

## Expected Behavior

### If Everything Works ✅
- **Middleware logs show:** Has id_token: true, Has access_token: true
- **Middleware logs show:** "✅ User authenticated via cookies, allowing access"
- **Middleware logs show:** "🍪 Set auth_valid cookies"
- **Debug page shows:** auth_valid: ✅ Present, auth_valid_local: ✅ Present
- **Browser DevTools shows:** All 5 cookies present

### If Cookies Are Missing ❌
- **Middleware logs show:** Has id_token: false, Has access_token: false
- **Middleware logs show:** "❌ No auth token found, redirecting"
- **Debug page shows:** All cookies: ❌ Missing
- **Browser DevTools shows:** No cookies or only some cookies

## Common Issues & Fixes

### Issue 1: Cookies Not Being Set by auth.brmh.in
**Symptoms:**
- Middleware logs show 0 cookies
- Browser DevTools shows no cookies

**Possible Causes:**
- auth.brmh.in backend not setting cookies with domain `.brmh.in`
- Cookies set with wrong SameSite attribute
- HTTPS/SSL issues

**Fix:**
Check auth.brmh.in backend code. Cookies should be set like:
```typescript
response.cookie('id_token', token, {
  domain: '.brmh.in',  // Note the dot!
  httpOnly: true,
  secure: true,
  sameSite: 'lax',  // or 'none' for cross-site
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

### Issue 2: Cookies Set But Not Sent to projectmanagement.brmh.in
**Symptoms:**
- Browser DevTools shows cookies under .brmh.in
- But middleware doesn't see them

**Possible Causes:**
- SameSite attribute blocking cross-site cookies
- Path mismatch
- Timing issue (cookies not sent on first request after redirect)

**Fix:**
This is why we set `auth_valid` cookies! If httpOnly tokens are present in browser but middleware doesn't see them, we have a bigger issue with cookie transmission.

### Issue 3: auth_valid Cookies Not Being Set
**Symptoms:**
- Middleware sees tokens (logs show "✅ User authenticated")
- But auth_valid cookies don't appear in client

**Possible Causes:**
- Middleware response cookies not being sent properly
- Browser blocking cookie setting
- Domain mismatch

**Fix:**
Check middleware logs for "🍪 Set auth_valid cookies". If this message appears but cookies still don't show up, there might be a browser security policy blocking them.

## Debug Commands

### Check Cookies in Browser Console
```javascript
// Run in browser console on projectmanagement.brmh.in
console.log('All cookies:', document.cookie);
console.log('Has auth_valid:', document.cookie.includes('auth_valid=1'));
console.log('Has auth_valid_local:', document.cookie.includes('auth_valid_local=1'));
```

### Check What Middleware Sees
```javascript
// This is logged in terminal - look for:
"All cookie names: ['cookie1', 'cookie2', ...]"
```

### Force Clear Everything
```javascript
// Run in browser console
['id_token', 'access_token', 'refresh_token', 'auth_valid', 'auth_valid_local'].forEach(name => {
  document.cookie = `${name}=; domain=.brmh.in; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
});
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## What to Look For

### 1. In Terminal (Middleware Logs)
```
✅ GOOD:
[ProjectMngnt Middleware] Has id_token: true
[ProjectMngnt Middleware] Has access_token: true
[ProjectMngnt Middleware] ✅ User authenticated
[ProjectMngnt Middleware] 🍪 Set auth_valid cookies

❌ BAD:
[ProjectMngnt Middleware] Total cookies: 0
[ProjectMngnt Middleware] Has ANY token? false
[ProjectMngnt Middleware] ❌ No auth token found
```

### 2. In Browser DevTools
```
✅ GOOD - Should see under "Cookies":
Name              Value       Domain      Path  HttpOnly  Secure  SameSite
id_token          eyJ...      .brmh.in    /     Yes       Yes     Lax
access_token      eyJ...      .brmh.in    /     Yes       Yes     Lax
refresh_token     eyJ...      .brmh.in    /     Yes       Yes     Lax
auth_valid        1           .brmh.in    /     No        Yes     Lax
auth_valid_local  1           (current)   /     No        Yes     Lax

❌ BAD - Empty or missing cookies
```

### 3. On Debug Page
```
✅ GOOD:
id_token: ❌ Missing (expected - it's httpOnly)
access_token: ❌ Missing (expected - it's httpOnly)
auth_valid: ✅ Present
auth_valid_local: ✅ Present

❌ BAD:
All cookies showing: ❌ Missing
```

## Next Steps Based on Findings

### Scenario A: Middleware Sees No Cookies
**Problem:** auth.brmh.in is not setting cookies properly
**Action:** Check auth.brmh.in backend code for cookie setting logic

### Scenario B: Middleware Sees Tokens But Doesn't Set auth_valid
**Problem:** Response cookie setting not working
**Action:** Check middleware response handling, might be a Next.js config issue

### Scenario C: Middleware Sets auth_valid But Client Can't See It
**Problem:** Browser security policy or domain mismatch
**Action:** Check browser console for errors, try different browsers

### Scenario D: Everything Works in DevTools But Client Code Fails
**Problem:** Client-side JavaScript timing issue
**Action:** Add delays or use different detection method

## Testing Checklist

- [ ] Visit /debug-auth page
- [ ] Check middleware logs in terminal
- [ ] Click "Test Login Flow"
- [ ] Login successfully
- [ ] Redirected back to /debug-auth
- [ ] Check if auth_valid cookies appear
- [ ] Check middleware logs for token detection
- [ ] Check middleware logs for cookie setting
- [ ] Take screenshots of:
  - [ ] Browser DevTools Cookies tab
  - [ ] Terminal middleware logs
  - [ ] Debug page output

## Report Format

When reporting the issue, please include:

1. **Terminal Logs:**
   ```
   [Copy middleware logs here]
   ```

2. **Browser DevTools Cookies:**
   ```
   [Screenshot or list of cookies]
   ```

3. **Debug Page Output:**
   ```
   [Screenshot or copy JSON output]
   ```

4. **Browser Console:**
   ```
   [Any errors or warnings]
   ```

This will help identify exactly where the cookie flow is breaking!

