// ========================================
// API DEBUG COMPONENT
// ========================================

import { useState, useEffect } from 'react';
import { CompanyApiService } from '../utils/companyApi';
import { TaskApiService } from '../utils/taskApi';
import { ProjectApiService } from '../utils/projectApi';
import { TeamApiService } from '../utils/teamApi';
import { env } from '../config/environment';

export default function ApiDebugComponent() {
  const [apiStatus, setApiStatus] = useState<{
    companies: { loading: boolean; success?: boolean; error?: string; count?: number };
    tasks: { loading: boolean; success?: boolean; error?: string; count?: number };
    projects: { loading: boolean; success?: boolean; error?: string; count?: number };
    teams: { loading: boolean; success?: boolean; error?: string; count?: number };
  }>({
    companies: { loading: true },
    tasks: { loading: true },
    projects: { loading: true },
    teams: { loading: true }
  });

  const [config, setConfig] = useState({
    apiBaseUrl: '',
    debugMode: false,
    environment: ''
  });

  useEffect(() => {
    // Get configuration
    setConfig({
      apiBaseUrl: env.apiBaseUrl,
      debugMode: env.debugMode,
      environment: env.isDevelopment ? 'development' : 'production'
    });

    // Test all API endpoints
    testAllApis();
  }, []);

  const testAllApis = async () => {
    console.log('🧪 Testing all API endpoints...');

    // Test Companies API
    try {
      const companiesResponse = await CompanyApiService.getCompanies();
      setApiStatus(prev => ({
        ...prev,
        companies: {
          loading: false,
          success: companiesResponse.success,
          error: companiesResponse.error,
          count: companiesResponse.data?.length || 0
        }
      }));
      console.log('✅ Companies API:', companiesResponse);
    } catch (error) {
      setApiStatus(prev => ({
        ...prev,
        companies: {
          loading: false,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
      console.error('❌ Companies API Error:', error);
    }

    // Test Tasks API
    try {
      const tasksResponse = await TaskApiService.getTasks();
      setApiStatus(prev => ({
        ...prev,
        tasks: {
          loading: false,
          success: tasksResponse.success,
          error: tasksResponse.error,
          count: tasksResponse.data?.length || 0
        }
      }));
      console.log('✅ Tasks API:', tasksResponse);
    } catch (error) {
      setApiStatus(prev => ({
        ...prev,
        tasks: {
          loading: false,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
      console.error('❌ Tasks API Error:', error);
    }

    // Test Projects API
    try {
      const projectsResponse = await ProjectApiService.getProjects();
      setApiStatus(prev => ({
        ...prev,
        projects: {
          loading: false,
          success: projectsResponse.success,
          error: projectsResponse.error,
          count: projectsResponse.data?.length || 0
        }
      }));
      console.log('✅ Projects API:', projectsResponse);
    } catch (error) {
      setApiStatus(prev => ({
        ...prev,
        projects: {
          loading: false,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
      console.error('❌ Projects API Error:', error);
    }

    // Test Teams API
    try {
      const teamsResponse = await TeamApiService.getTeams();
      setApiStatus(prev => ({
        ...prev,
        teams: {
          loading: false,
          success: teamsResponse.success,
          error: teamsResponse.error,
          count: teamsResponse.data?.length || 0
        }
      }));
      console.log('✅ Teams API:', teamsResponse);
    } catch (error) {
      setApiStatus(prev => ({
        ...prev,
        teams: {
          loading: false,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
      console.error('❌ Teams API Error:', error);
    }
  };

  const getStatusColor = (status: { loading: boolean; success?: boolean; error?: string }) => {
    if (status.loading) return 'text-yellow-600';
    if (status.success) return 'text-green-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: { loading: boolean; success?: boolean; error?: string }) => {
    if (status.loading) return '⏳';
    if (status.success) return '✅';
    return '❌';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">🔧 API Connection Debug</h2>
      
      {/* Configuration */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">API Base URL:</span>
            <span className="ml-2 text-blue-600">{config.apiBaseUrl}</span>
          </div>
          <div>
            <span className="font-medium">Debug Mode:</span>
            <span className={`ml-2 ${config.debugMode ? 'text-green-600' : 'text-red-600'}`}>
              {config.debugMode ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div>
            <span className="font-medium">Environment:</span>
            <span className="ml-2 text-purple-600">{config.environment}</span>
          </div>
        </div>
      </div>

      {/* API Status */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">API Endpoints Status</h3>
        
        {Object.entries(apiStatus).map(([apiName, status]) => (
          <div key={apiName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{getStatusIcon(status)}</span>
              <div>
                <span className="font-medium capitalize">{apiName}</span>
                {status.count !== undefined && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({status.count} items)
                  </span>
                )}
              </div>
            </div>
            <div className={`text-sm font-medium ${getStatusColor(status)}`}>
              {status.loading ? 'Loading...' : status.success ? 'Connected' : 'Failed'}
            </div>
          </div>
        ))}
      </div>

      {/* Error Details */}
      {Object.entries(apiStatus).some(([_, status]) => status.error) && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">Error Details</h4>
          {Object.entries(apiStatus).map(([apiName, status]) => 
            status.error && (
              <div key={`api-debug-${apiName}`} className="text-sm text-red-700 mb-1">
                <span className="font-medium capitalize">{apiName}:</span> {status.error}
              </div>
            )
          )}
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-4">
        <button
          onClick={testAllApis}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh API Status
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Troubleshooting</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Make sure the backend server is running on localhost:5001</li>
          <li>• Check browser console for detailed error messages</li>
          <li>• Verify environment variables in .env.local</li>
          <li>• Ensure CORS is enabled on the backend</li>
        </ul>
      </div>
    </div>
  );
}
