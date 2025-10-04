'use client';

import { useEffect, useState } from 'react';

export default function DebugCookiesPage() {
  const [cookies, setCookies] = useState<Record<string, string>>({});
  const [authStatus, setAuthStatus] = useState<any>(null);

  useEffect(() => {
    // Get all cookies
    const allCookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        allCookies[key] = decodeURIComponent(value);
      }
    });
    setCookies(allCookies);

    // Check auth status from server-side API
    fetch('/api/debug-cookies')
      .then(res => res.json())
      .then(data => {
        console.log('🔍 Server-side cookie check:', data);
        setAuthStatus({
          ...data.auth,
          authValidValue: allCookies.auth_valid,
          authValidLocalValue: allCookies.auth_valid_local,
        });
      })
      .catch(err => {
        console.error('❌ Error checking server-side cookies:', err);
        // Fallback to client-side check
        const authValid = allCookies.auth_valid;
        const authValidLocal = allCookies.auth_valid_local;
        const idToken = allCookies.id_token;
        const accessToken = allCookies.access_token;
        
        setAuthStatus({
          authValid: !!authValid,
          authValidLocal: !!authValidLocal,
          hasIdToken: !!idToken,
          hasAccessToken: !!accessToken,
          authValidValue: authValid,
          authValidLocalValue: authValidLocal,
        });
      });

    console.log('🍪 All cookies:', allCookies);
  }, []);

  const testAuthFlow = () => {
    console.log('🧪 Testing auth flow...');
    
    // Test SSOUtils
    import('../utils/sso-utils').then(({ SSOUtils }) => {
      const isAuth = SSOUtils.isAuthenticated();
      console.log('SSOUtils.isAuthenticated():', isAuth);
      
      // Test cookie reading
      const authValid = SSOUtils.getCookieValue('auth_valid');
      const authValidLocal = SSOUtils.getCookieValue('auth_valid_local');
      console.log('auth_valid cookie:', authValid);
      console.log('auth_valid_local cookie:', authValidLocal);
    });
  };

  const checkServerSideCookies = () => {
    console.log('🔍 Checking server-side cookies...');
    fetch('/api/debug-cookies')
      .then(res => res.json())
      .then(data => {
        console.log('Server-side cookie check result:', data);
        alert(`Server-side check:\nHas tokens: ${data.auth.hasAnyToken}\nHas auth_valid: ${data.auth.hasAuthValid}`);
      })
      .catch(err => {
        console.error('Error:', err);
        alert('Error checking server-side cookies');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cookie Debug Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Auth Valid:</strong> 
              <span className={`ml-2 ${authStatus?.authValid ? 'text-green-600' : 'text-red-600'}`}>
                {authStatus?.authValid ? 'YES' : 'NO'}
              </span>
              {authStatus?.authValidValue && (
                <div className="text-sm text-gray-600">Value: {authStatus.authValidValue}</div>
              )}
            </div>
            <div>
              <strong>Auth Valid Local:</strong> 
              <span className={`ml-2 ${authStatus?.authValidLocal ? 'text-green-600' : 'text-red-600'}`}>
                {authStatus?.authValidLocal ? 'YES' : 'NO'}
              </span>
              {authStatus?.authValidLocalValue && (
                <div className="text-sm text-gray-600">Value: {authStatus.authValidLocalValue}</div>
              )}
            </div>
            <div>
              <strong>Has ID Token:</strong> 
              <span className={`ml-2 ${authStatus?.hasIdToken ? 'text-green-600' : 'text-red-600'}`}>
                {authStatus?.hasIdToken ? 'YES' : 'NO'}
              </span>
            </div>
            <div>
              <strong>Has Access Token:</strong> 
              <span className={`ml-2 ${authStatus?.hasAccessToken ? 'text-green-600' : 'text-red-600'}`}>
                {authStatus?.hasAccessToken ? 'YES' : 'NO'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">All Cookies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(cookies).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="font-mono">{key}:</span>
                <span className="font-mono text-gray-600">
                  {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={testAuthFlow}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Auth Flow
            </button>
            <button
              onClick={checkServerSideCookies}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Check Server-Side
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
