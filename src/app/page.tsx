'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from './components/ClientLayout';
import { UserProvider } from './contexts/UserContext';
import { validateToken } from './utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://brmh.in";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log('🔍 Authentication disabled - bypassing login requirement');
        
        // Set mock tokens to bypass authentication
        if (!localStorage.getItem('access_token')) {
          localStorage.setItem('access_token', 'mock-token-disabled');
          localStorage.setItem('id_token', 'mock-token-disabled');
          localStorage.setItem('refresh_token', 'mock-token-disabled');
        }
        
        console.log('✅ Authentication bypassed, showing main app');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ Error in authentication bypass:', error);
        setIsAuthenticated(true); // Still show the app even on error
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show main app only if authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to auth page
  }

  return (
    <UserProvider>
      <div className="relative">
        {/* Authentication Disabled Notice */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <strong>Authentication Disabled:</strong> Login/signup functionality is temporarily disabled. You can now access the application directly.
              </p>
            </div>
          </div>
        </div>
        
        <ClientLayout />
      </div>
    </UserProvider>
  );
}