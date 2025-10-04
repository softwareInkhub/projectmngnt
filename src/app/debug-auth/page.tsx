'use client';

import { useEffect, useState } from 'react';

export default function DebugAuthPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Get all cookies
    const allCookies = document.cookie.split(';').map(c => c.trim());
    
    // Parse cookies into object
    const cookieObj: Record<string, string> = {};
    allCookies.forEach(cookie => {
      const [name, ...valueParts] = cookie.split('=');
      cookieObj[name] = valueParts.join('=');
    });

    // Get localStorage
    const localStorageData: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        localStorageData[key] = localStorage.getItem(key) || '';
      }
    }

    // Check for specific auth cookies
    const authCookies = {
      id_token: cookieObj['id_token'] ? '✅ Present' : '❌ Missing',
      access_token: cookieObj['access_token'] ? '✅ Present' : '❌ Missing',
      refresh_token: cookieObj['refresh_token'] ? '✅ Present' : '❌ Missing',
      auth_valid: cookieObj['auth_valid'] ? '✅ Present' : '❌ Missing',
      auth_valid_local: cookieObj['auth_valid_local'] ? '✅ Present' : '❌ Missing',
    };

    setDebugInfo({
      allCookies,
      cookieObj,
      authCookies,
      localStorageData,
      cookieCount: allCookies.filter(c => c).length,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleClearAll = () => {
    // Clear all cookies
    ['id_token', 'access_token', 'refresh_token', 'auth_valid', 'auth_valid_local'].forEach(name => {
      document.cookie = `${name}=; domain=.brmh.in; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
    localStorage.clear();
    sessionStorage.clear();
    alert('Cleared all auth data! Refreshing...');
    window.location.reload();
  };

  const handleTestLogin = () => {
    window.location.href = 'https://auth.brmh.in/login?next=https://projectmanagement.brmh.in/debug-auth';
  };

  if (!debugInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading debug info...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Auth Debug Panel
          </h1>
          <p className="text-gray-600 mb-6">
            Timestamp: {debugInfo.timestamp}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              🗑️ Clear All Auth Data
            </button>
            <button
              onClick={handleTestLogin}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              🔐 Test Login Flow
            </button>
          </div>

          {/* Auth Cookie Status */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              📋 Auth Cookie Status
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {Object.entries(debugInfo.authCookies).map(([name, status]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="font-mono text-sm text-gray-700">{name}</span>
                  <span className={status.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              📊 Summary
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Total Cookies:</strong> {debugInfo.cookieCount}
              </p>
              <p className="text-gray-700">
                <strong>localStorage Items:</strong> {Object.keys(debugInfo.localStorageData).length}
              </p>
            </div>
          </div>

          {/* All Cookies */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              🍪 All Cookies (as seen by JavaScript)
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-60">
              <pre className="text-green-400 text-xs font-mono">
                {JSON.stringify(debugInfo.cookieObj, null, 2)}
              </pre>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              ⚠️ Note: HttpOnly cookies (id_token, access_token, refresh_token) will NOT appear here if they are properly set as httpOnly.
            </p>
          </div>

          {/* localStorage */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              💾 localStorage
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-60">
              <pre className="text-blue-400 text-xs font-mono">
                {JSON.stringify(debugInfo.localStorageData, null, 2)}
              </pre>
            </div>
          </div>

          {/* Raw Cookie String */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              🔤 Raw Cookie String
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
              <pre className="text-yellow-400 text-xs font-mono break-all">
                {document.cookie || '(empty)'}
              </pre>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Expected Behavior:</h3>
            <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
              <li>
                <strong>If logged in:</strong> You should see <code>auth_valid</code> and <code>auth_valid_local</code> as ✅ Present
              </li>
              <li>
                <strong>HttpOnly tokens:</strong> <code>id_token</code>, <code>access_token</code>, <code>refresh_token</code> will show as ❌ Missing (this is correct - they're httpOnly)
              </li>
              <li>
                <strong>If NOT logged in:</strong> All cookies will show as ❌ Missing
              </li>
            </ul>
          </div>

          {/* Diagnostic Steps */}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">🔧 Diagnostic Steps:</h3>
            <ol className="list-decimal list-inside text-yellow-800 text-sm space-y-1">
              <li>Click "Test Login Flow" to go through authentication</li>
              <li>After login, you should be redirected back here</li>
              <li>Check if <code>auth_valid</code> cookies appear</li>
              <li>If they don't appear, check the browser console and terminal logs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

