'use client';

import { useEffect, useState } from 'react';
import { SSOUtils } from '../utils/sso-utils';

export default function DebugAuthPage() {
  const [authInfo, setAuthInfo] = useState<any>(null);
  const [cookies, setCookies] = useState<Record<string, string>>({});

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

    // Get auth info
    const isAuth = SSOUtils.isAuthenticated();
    const tokens = SSOUtils.getTokens();
    const user = SSOUtils.getUser();
    
    setAuthInfo({
      isAuthenticated: isAuth,
      tokens: {
        hasAccessToken: !!tokens.accessToken,
        hasIdToken: !!tokens.idToken,
        hasRefreshToken: !!tokens.refreshToken,
        accessTokenLength: tokens.accessToken?.length || 0,
        idTokenLength: tokens.idToken?.length || 0,
      },
      user,
      localStorage: {
        accessToken: !!localStorage.getItem('access_token'),
        idToken: !!localStorage.getItem('id_token'),
        refreshToken: !!localStorage.getItem('refresh_token'),
      }
    });
  }, []);

  const handleSyncTokens = () => {
    SSOUtils.syncTokensToLocalStorage();
    window.location.reload();
  };

  const handleLogout = async () => {
    await SSOUtils.logout();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Authentication Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Is Authenticated:</span>
                <span className={`font-bold ${authInfo?.isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                  {authInfo?.isAuthenticated ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Auth Valid Flag:</span>
                <span className={cookies.auth_valid ? 'text-green-600' : 'text-red-600'}>
                  {cookies.auth_valid ? 'SET' : 'NOT SET'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Auth Valid Local:</span>
                <span className={cookies.auth_valid_local ? 'text-green-600' : 'text-red-600'}>
                  {cookies.auth_valid_local ? 'SET' : 'NOT SET'}
                </span>
              </div>
            </div>
          </div>

          {/* Token Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Token Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Access Token:</span>
                <span className={authInfo?.tokens?.hasAccessToken ? 'text-green-600' : 'text-red-600'}>
                  {authInfo?.tokens?.hasAccessToken ? `YES (${authInfo.tokens.accessTokenLength} chars)` : 'NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ID Token:</span>
                <span className={authInfo?.tokens?.hasIdToken ? 'text-green-600' : 'text-red-600'}>
                  {authInfo?.tokens?.hasIdToken ? `YES (${authInfo.tokens.idTokenLength} chars)` : 'NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Refresh Token:</span>
                <span className={authInfo?.tokens?.hasRefreshToken ? 'text-green-600' : 'text-red-600'}>
                  {authInfo?.tokens?.hasRefreshToken ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>User ID:</span>
                <span>{authInfo?.user?.id || 'Not available'}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span>{authInfo?.user?.email || 'Not available'}</span>
              </div>
              <div className="flex justify-between">
                <span>Name:</span>
                <span>{authInfo?.user?.name || 'Not available'}</span>
              </div>
            </div>
          </div>

          {/* LocalStorage Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">LocalStorage</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Access Token:</span>
                <span className={authInfo?.localStorage?.accessToken ? 'text-green-600' : 'text-red-600'}>
                  {authInfo?.localStorage?.accessToken ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ID Token:</span>
                <span className={authInfo?.localStorage?.idToken ? 'text-green-600' : 'text-red-600'}>
                  {authInfo?.localStorage?.idToken ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Refresh Token:</span>
                <span className={authInfo?.localStorage?.refreshToken ? 'text-green-600' : 'text-red-600'}>
                  {authInfo?.localStorage?.refreshToken ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* All Cookies */}
        <div className="bg-white p-6 rounded-lg shadow mt-6">
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

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={handleSyncTokens}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sync Tokens from Cookies
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Refresh Page
            </button>
          </div>
        </div>

        {/* Raw Data */}
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Raw Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({ authInfo, cookies }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}