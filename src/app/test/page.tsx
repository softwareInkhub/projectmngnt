"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestPage() {
  const [envInfo, setEnvInfo] = useState<any>({});
  const [apiTest, setApiTest] = useState<any>(null);

  useEffect(() => {
    // Gather environment information
    const info = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      location: typeof window !== 'undefined' ? window.location.href : 'server',
      timestamp: new Date().toISOString()
    };
    setEnvInfo(info);

    // Test API connection
    const testApi = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://brmh.in';
        const response = await fetch(`${apiUrl}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username: 'testuser', 
            password: 'testpass123', 
            email: 'test@example.com' 
          })
        });
        
        setApiTest({
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          url: response.url
        });
      } catch (error) {
        setApiTest({
          error: error instanceof Error ? error.message : 'Unknown error',
          type: 'fetch_error'
        });
      }
    };

    testApi();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Deployment Test Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
        <h2>✅ Environment Variables</h2>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(envInfo, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0fff0', borderRadius: '8px' }}>
        <h2>🔗 API Connection Test</h2>
        {apiTest ? (
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(apiTest, null, 2)}
          </pre>
        ) : (
          <p>Testing API connection...</p>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff8f0', borderRadius: '8px' }}>
        <h2>📊 Deployment Status</h2>
        <div style={{ fontSize: '16px' }}>
          {envInfo.NEXT_PUBLIC_BACKEND_URL === 'https://brmh.in' ? (
            <div style={{ color: 'green' }}>✅ Backend URL correctly set to production</div>
          ) : (
            <div style={{ color: 'red' }}>❌ Backend URL issue: {envInfo.NEXT_PUBLIC_BACKEND_URL}</div>
          )}
          
          {apiTest?.ok ? (
            <div style={{ color: 'green' }}>✅ API connection working</div>
          ) : apiTest?.error ? (
            <div style={{ color: 'orange' }}>⚠️ API connection issue: {apiTest.error}</div>
          ) : (
            <div style={{ color: 'blue' }}>⏳ Testing API connection...</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2>🔗 Quick Links</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link 
            href="/" 
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px' 
            }}
          >
            Go to Main App
          </Link>
          <Link 
            href="/authPage" 
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px' 
            }}
          >
            Go to Auth Page
          </Link>
        </div>
      </div>
    </div>
  );
}


