"use client";
import { useState, useEffect } from 'react';
import { CompanyApiService } from '../utils/companyApi';
import { TaskApiService } from '../utils/taskApi';

export default function ApiTestComponent() {
  const [companiesData, setCompaniesData] = useState<any>(null);
  const [tasksData, setTasksData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo([]);

        addDebugInfo('Starting API test...');
        addDebugInfo(`NODE_ENV: ${process.env.NODE_ENV}`);
        addDebugInfo(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'NOT_SET'}`);
        addDebugInfo(`NEXT_PUBLIC_: ${process.env.NEXT_PUBLIC_API_BASE_URL}`);

        // Test if fetch is available
        addDebugInfo(`Fetch available: ${typeof fetch !== 'undefined' ? 'YES' : 'NO'}`);

        // Test direct fetch first
        addDebugInfo('Testing direct fetch...');
        try {
          const directResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-companies`);
          addDebugInfo(`Direct fetch status: ${directResponse.status}`);
          addDebugInfo(`Direct fetch ok: ${directResponse.ok}`);
          
          if (directResponse.ok) {
            const directData = await directResponse.json();
            addDebugInfo(`Direct fetch successful: ${directResponse.status}`);
            addDebugInfo(`Direct fetch data count: ${directData.count || 0}`);
            addDebugInfo(`Direct fetch items: ${directData.items?.length || 0}`);
          } else {
            addDebugInfo(`Direct fetch failed with status: ${directResponse.status}`);
          }
        } catch (directError) {
          addDebugInfo(`Direct fetch error: ${directError}`);
        }

        // Test companies API
        addDebugInfo('Testing companies API service...');
        const companiesResponse = await CompanyApiService.getCompanies();
        addDebugInfo(`Companies API response: ${companiesResponse.success ? 'SUCCESS' : 'FAILED'}`);
        if (!companiesResponse.success) {
          addDebugInfo(`Companies API error: ${companiesResponse.error}`);
        }
        setCompaniesData(companiesResponse);

        // Test tasks API
        addDebugInfo('Testing tasks API service...');
        const tasksResponse = await TaskApiService.getTasks();
        addDebugInfo(`Tasks API response: ${tasksResponse.success ? 'SUCCESS' : 'FAILED'}`);
        if (!tasksResponse.success) {
          addDebugInfo(`Tasks API error: ${tasksResponse.error}`);
        }
        setTasksData(tasksResponse);

        addDebugInfo('API test completed');

      } catch (err) {
        console.error('API test failed:', err);
        addDebugInfo(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h3>Testing API connection...</h3>
        <div style={{ background: '#f5f5f5', padding: '10px', maxHeight: '200px', overflow: 'auto' }}>
          {debugInfo.map((info, index) => (
            <div key={index} style={{ fontSize: '12px', marginBottom: '5px' }}>{info}</div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h3>API Test Failed</h3>
        <p>Error: {error}</p>
        <div style={{ background: '#f5f5f5', padding: '10px', maxHeight: '200px', overflow: 'auto' }}>
          {debugInfo.map((info, index) => (
            <div key={index} style={{ fontSize: '12px', marginBottom: '5px' }}>{info}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>API Test Results</h2>
      
      <div style={{ background: '#f5f5f5', padding: '10px', maxHeight: '200px', overflow: 'auto', marginBottom: '20px' }}>
        <h4>Debug Info:</h4>
        {debugInfo.map((info, index) => (
          <div key={index} style={{ fontSize: '12px', marginBottom: '5px' }}>{info}</div>
        ))}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Companies API</h3>
        <p>Success: {companiesData?.success ? '✅' : '❌'}</p>
        <p>Count: {companiesData?.count || 0}</p>
        <p>Items: {companiesData?.items?.length || 0}</p>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto', maxHeight: '200px' }}>
          {JSON.stringify(companiesData, null, 2)}
        </pre>
      </div>

      <div>
        <h3>Tasks API</h3>
        <p>Success: {tasksData?.success ? '✅' : '❌'}</p>
        <p>Count: {tasksData?.count || 0}</p>
        <p>Items: {tasksData?.items?.length || 0}</p>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto', maxHeight: '200px' }}>
          {JSON.stringify(tasksData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
