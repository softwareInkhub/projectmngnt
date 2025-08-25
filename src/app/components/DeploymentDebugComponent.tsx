"use client";
import { useState, useEffect } from 'react';

export default function DeploymentDebugComponent() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gatherDebugInfo = async () => {
      const info = {
        // Environment variables
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
        
        // Browser info
        userAgent: navigator.userAgent,
        location: window.location.href,
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        port: window.location.port,
        
        // API test
        apiTest: null as any,
        
        // Timestamp
        timestamp: new Date().toISOString()
      };

      // Test API connection
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://brmh.in';
        const response = await fetch(`${apiUrl}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'test', password: 'test', email: 'test@test.com' })
        });
        
        info.apiTest = {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          url: response.url
        };
      } catch (error) {
        info.apiTest = {
          error: error instanceof Error ? error.message : 'Unknown error',
          type: 'fetch_error'
        };
      }

      setDebugInfo(info);
      setLoading(false);
    };

    gatherDebugInfo();
  }, []);

  if (loading) {
    return <div>Loading debug info...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
      <h2>Deployment Debug Info</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Environment Variables:</h3>
        <pre>{JSON.stringify({
          NODE_ENV: debugInfo.NODE_ENV,
          NEXT_PUBLIC_BACKEND_URL: debugInfo.NEXT_PUBLIC_BACKEND_URL,
          NEXT_PUBLIC_APP_NAME: debugInfo.NEXT_PUBLIC_APP_NAME
        }, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Browser Info:</h3>
        <pre>{JSON.stringify({
          userAgent: debugInfo.userAgent,
          location: debugInfo.location,
          protocol: debugInfo.protocol,
          hostname: debugInfo.hostname,
          port: debugInfo.port
        }, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>API Test:</h3>
        <pre>{JSON.stringify(debugInfo.apiTest, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Timestamp:</h3>
        <pre>{debugInfo.timestamp}</pre>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Deployment Status:</h3>
        {debugInfo.NEXT_PUBLIC_BACKEND_URL === 'https://brmh.in' ? (
          <div style={{ color: 'green' }}>✅ Backend URL correctly set to production</div>
        ) : (
          <div style={{ color: 'red' }}>❌ Backend URL not set correctly: {debugInfo.NEXT_PUBLIC_BACKEND_URL}</div>
        )}
        
        {debugInfo.apiTest?.ok ? (
          <div style={{ color: 'green' }}>✅ API connection working</div>
        ) : (
          <div style={{ color: 'red' }}>❌ API connection failed: {JSON.stringify(debugInfo.apiTest)}</div>
        )}
      </div>
    </div>
  );
}
