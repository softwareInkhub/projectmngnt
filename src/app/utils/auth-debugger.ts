// Comprehensive authentication debugging utility
// This helps identify and resolve authentication issues

export interface AuthDebugReport {
  timestamp: string;
  url: string;
  domain: string;
  middleware: {
    hasIdToken: boolean;
    hasAccessToken: boolean;
    hasAnyToken: boolean;
    authValidFlag: boolean;
    authValidLocalFlag: boolean;
  };
  localStorage: {
    accessToken: boolean;
    idToken: boolean;
    refreshToken: boolean;
    userId: boolean;
    userEmail: boolean;
    userName: boolean;
  };
  cookies: {
    idToken: boolean;
    accessToken: boolean;
    refreshToken: boolean;
    authValid: boolean;
    authValidLocal: boolean;
  };
  ssoStatus: {
    isInitialized: boolean;
    isAuthenticated: boolean;
    hasConsistentTokens: boolean;
  };
  recommendations: string[];
}

export function getCookieValue(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}

export function generateAuthDebugReport(): AuthDebugReport {
  const timestamp = new Date().toISOString();
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const domain = typeof window !== 'undefined' ? window.location.hostname : '';
  
  // Check middleware-related cookies
  const authValidFlag = !!getCookieValue('auth_valid');
  const authValidLocalFlag = !!getCookieValue('auth_valid_local');
  const cookieIdToken = !!getCookieValue('id_token');
  const cookieAccessToken = !!getCookieValue('access_token');
  
  // Check localStorage
  const localAccessToken = !!localStorage.getItem('access_token');
  const localIdToken = !!localStorage.getItem('id_token');
  const localRefreshToken = !!localStorage.getItem('refresh_token');
  const localUserId = !!localStorage.getItem('user_id');
  const localUserEmail = !!localStorage.getItem('user_email');
  const localUserName = !!localStorage.getItem('user_name');
  
  // Check SSO status
  const ssoInitialized = typeof document !== 'undefined' && 
    document.documentElement.getAttribute('data-sso-initialized') === 'true';
  
  const isAuthenticated = authValidFlag || authValidLocalFlag || 
    (localAccessToken && localIdToken) || (cookieAccessToken && cookieIdToken);
  
  const hasConsistentTokens = (localAccessToken && localIdToken) || 
    (cookieAccessToken && cookieIdToken);
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (!isAuthenticated) {
    recommendations.push('❌ No authentication found - user needs to login');
  } else if (!hasConsistentTokens) {
    recommendations.push('⚠️ Inconsistent token state - tokens may be httpOnly');
    recommendations.push('💡 Try syncing tokens from cookies to localStorage');
  } else if (!ssoInitialized) {
    recommendations.push('⚠️ SSO not initialized - check SSOInitializer component');
  } else {
    recommendations.push('✅ Authentication appears to be working correctly');
  }
  
  if (authValidFlag || authValidLocalFlag) {
    recommendations.push('✅ Middleware has validated httpOnly cookies');
  }
  
  if (localAccessToken && localIdToken) {
    recommendations.push('✅ Tokens available in localStorage');
  }
  
  return {
    timestamp,
    url,
    domain,
    middleware: {
      hasIdToken: cookieIdToken,
      hasAccessToken: cookieAccessToken,
      hasAnyToken: cookieIdToken || cookieAccessToken,
      authValidFlag,
      authValidLocalFlag,
    },
    localStorage: {
      accessToken: localAccessToken,
      idToken: localIdToken,
      refreshToken: localRefreshToken,
      userId: localUserId,
      userEmail: localUserEmail,
      userName: localUserName,
    },
    cookies: {
      idToken: cookieIdToken,
      accessToken: cookieAccessToken,
      refreshToken: !!getCookieValue('refresh_token'),
      authValid: authValidFlag,
      authValidLocal: authValidLocalFlag,
    },
    ssoStatus: {
      isInitialized: ssoInitialized,
      isAuthenticated,
      hasConsistentTokens,
    },
    recommendations,
  };
}

export function logAuthDebugReport(): void {
  const report = generateAuthDebugReport();
  
  console.group('🔍 Comprehensive Auth Debug Report');
  console.log('📅 Timestamp:', report.timestamp);
  console.log('🌐 URL:', report.url);
  console.log('🏠 Domain:', report.domain);
  
  console.group('🛡️ Middleware Status');
  console.log('Has ID Token Cookie:', report.middleware.hasIdToken);
  console.log('Has Access Token Cookie:', report.middleware.hasAccessToken);
  console.log('Has Any Token Cookie:', report.middleware.hasAnyToken);
  console.log('Auth Valid Flag:', report.middleware.authValidFlag);
  console.log('Auth Valid Local Flag:', report.middleware.authValidLocalFlag);
  console.groupEnd();
  
  console.group('💾 LocalStorage Status');
  console.log('Access Token:', report.localStorage.accessToken);
  console.log('ID Token:', report.localStorage.idToken);
  console.log('Refresh Token:', report.localStorage.refreshToken);
  console.log('User ID:', report.localStorage.userId);
  console.log('User Email:', report.localStorage.userEmail);
  console.log('User Name:', report.localStorage.userName);
  console.groupEnd();
  
  console.group('🍪 Cookie Status');
  console.log('ID Token:', report.cookies.idToken);
  console.log('Access Token:', report.cookies.accessToken);
  console.log('Refresh Token:', report.cookies.refreshToken);
  console.log('Auth Valid:', report.cookies.authValid);
  console.log('Auth Valid Local:', report.cookies.authValidLocal);
  console.groupEnd();
  
  console.group('🔐 SSO Status');
  console.log('Is Initialized:', report.ssoStatus.isInitialized);
  console.log('Is Authenticated:', report.ssoStatus.isAuthenticated);
  console.log('Has Consistent Tokens:', report.ssoStatus.hasConsistentTokens);
  console.groupEnd();
  
  console.group('💡 Recommendations');
  report.recommendations.forEach(rec => console.log(rec));
  console.groupEnd();
  
  console.groupEnd();
  
  return report;
}

export function fixAuthIssues(): void {
  console.log('🔧 Attempting to fix authentication issues...');
  
  const report = generateAuthDebugReport();
  
  // If we have auth_valid flags but no localStorage tokens, try to sync
  if ((report.middleware.authValidFlag || report.middleware.authValidLocalFlag) && 
      (!report.localStorage.accessToken || !report.localStorage.idToken)) {
    
    console.log('🔄 Syncing tokens from cookies to localStorage...');
    
    // Try to get tokens from cookies and sync to localStorage
    const cookieAccessToken = getCookieValue('access_token');
    const cookieIdToken = getCookieValue('id_token');
    const cookieRefreshToken = getCookieValue('refresh_token');
    
    if (cookieAccessToken) {
      localStorage.setItem('access_token', cookieAccessToken);
      console.log('✅ Synced access token to localStorage');
    }
    
    if (cookieIdToken) {
      localStorage.setItem('id_token', cookieIdToken);
      console.log('✅ Synced ID token to localStorage');
      
      // Extract user info from ID token
      try {
        const payload = JSON.parse(atob(cookieIdToken.split('.')[1]));
        if (payload.sub) localStorage.setItem('user_id', payload.sub);
        if (payload.email) localStorage.setItem('user_email', payload.email);
        if (payload.name || payload.given_name) {
          localStorage.setItem('user_name', payload.name || payload.given_name);
        }
        console.log('✅ Extracted user info from ID token');
      } catch (error) {
        console.error('❌ Error extracting user info from ID token:', error);
      }
    }
    
    if (cookieRefreshToken) {
      localStorage.setItem('refresh_token', cookieRefreshToken);
      console.log('✅ Synced refresh token to localStorage');
    }
  }
  
  // Dispatch a custom event to trigger re-authentication checks
  const event = new CustomEvent('auth-fix-applied');
  window.dispatchEvent(event);
  
  console.log('✅ Auth fix attempts completed');
}

// Make debugging functions available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).authDebugger = {
    report: generateAuthDebugReport,
    log: logAuthDebugReport,
    fix: fixAuthIssues,
  };
  console.log('🔧 Auth debugger available: window.authDebugger');
}
