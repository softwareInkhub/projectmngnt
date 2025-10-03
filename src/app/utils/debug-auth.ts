// Debug utility for authentication troubleshooting
// This helps identify issues in the auth flow

export interface AuthDebugInfo {
  localStorage: {
    access_token: string | null;
    id_token: string | null;
    refresh_token: string | null;
    user_id: string | null;
    user_email: string | null;
    user_name: string | null;
    accessToken: string | null;
    idToken: string | null;
    refreshToken: string | null;
  };
  cookies: {
    id_token: string | null;
    access_token: string | null;
    refresh_token: string | null;
  };
  url: string;
  domain: string;
  timestamp: string;
}

export function getAuthDebugInfo(): AuthDebugInfo {
  if (typeof window === 'undefined') {
    return {
      localStorage: {} as any,
      cookies: {} as any,
      url: '',
      domain: '',
      timestamp: new Date().toISOString()
    };
  }

  return {
    localStorage: {
      access_token: localStorage.getItem('access_token'),
      id_token: localStorage.getItem('id_token'),
      refresh_token: localStorage.getItem('refresh_token'),
      user_id: localStorage.getItem('user_id'),
      user_email: localStorage.getItem('user_email'),
      user_name: localStorage.getItem('user_name'),
      accessToken: localStorage.getItem('accessToken'),
      idToken: localStorage.getItem('idToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    },
    cookies: {
      id_token: getCookie('id_token'),
      access_token: getCookie('access_token'),
      refresh_token: getCookie('refresh_token'),
    },
    url: window.location.href,
    domain: window.location.hostname,
    timestamp: new Date().toISOString()
  };
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  return null;
}

export function logAuthDebugInfo(): AuthDebugInfo {
  const debugInfo = getAuthDebugInfo();
  console.group('🔍 Auth Debug Info');
  console.log('📅 Timestamp:', debugInfo.timestamp);
  console.log('🌐 URL:', debugInfo.url);
  console.log('🏠 Domain:', debugInfo.domain);
  console.log('💾 LocalStorage:', debugInfo.localStorage);
  console.log('🍪 Cookies:', debugInfo.cookies);
  console.log('✅ Has tokens:', {
    localStorage: !!(debugInfo.localStorage.access_token && debugInfo.localStorage.id_token),
    cookies: !!(debugInfo.cookies.access_token && debugInfo.cookies.id_token),
    either: !!(debugInfo.localStorage.access_token && debugInfo.localStorage.id_token) || 
            !!(debugInfo.cookies.access_token && debugInfo.cookies.id_token)
  });
  console.groupEnd();
  
  return debugInfo;
}

export function clearAllAuthData(): void {
  if (typeof window === 'undefined') return;
  
  console.log('🧹 Clearing all auth data...');
  
  // Clear localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_name');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  console.log('✅ All auth data cleared');
}

export function testAuthFlow(): {
  hasAnyTokens: boolean;
  hasConsistentTokens: boolean;
  hasUserInfo: boolean;
  isLocalhost: boolean;
  isBrmhDomain: boolean;
  hasValidJWT: boolean;
} {
  console.group('🧪 Testing Auth Flow');
  
  const debugInfo = getAuthDebugInfo();
  
  // Test 1: Check if we have any tokens
  const hasAnyTokens = !!(debugInfo.localStorage.access_token || debugInfo.localStorage.id_token || 
                         debugInfo.cookies.access_token || debugInfo.cookies.id_token);
  
  console.log('Test 1 - Has any tokens:', hasAnyTokens);
  
  // Test 2: Check token format consistency
  const hasConsistentTokens = !!(debugInfo.localStorage.access_token && debugInfo.localStorage.id_token);
  console.log('Test 2 - Has consistent localStorage tokens:', hasConsistentTokens);
  
  // Test 3: Check if user info exists
  const hasUserInfo = !!(debugInfo.localStorage.user_id || debugInfo.localStorage.user_email);
  console.log('Test 3 - Has user info:', hasUserInfo);
  
  // Test 4: Check domain compatibility
  const isLocalhost = debugInfo.domain.includes('localhost');
  const isBrmhDomain = debugInfo.domain.includes('brmh.in') || debugInfo.domain.includes('vercel.app');
  console.log('Test 4 - Domain compatibility:', { isLocalhost, isBrmhDomain });
  
  // Test 5: Check if tokens are valid JWT format
  let hasValidJWT = false;
  try {
    if (debugInfo.localStorage.id_token) {
      const parts = debugInfo.localStorage.id_token.split('.');
      if (parts.length === 3) {
        JSON.parse(atob(parts[1]));
        hasValidJWT = true;
      }
    }
  } catch (e) {
    console.log('JWT validation failed:', e);
  }
  console.log('Test 5 - Has valid JWT format:', hasValidJWT);
  
  console.groupEnd();
  
  return {
    hasAnyTokens,
    hasConsistentTokens,
    hasUserInfo,
    isLocalhost,
    isBrmhDomain,
    hasValidJWT
  };
}

// Make debug functions available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugAuth = {
    getInfo: getAuthDebugInfo,
    log: logAuthDebugInfo,
    clear: clearAllAuthData,
    test: testAuthFlow
  };
  console.log('🔧 Auth debug functions available: window.debugAuth');
}
