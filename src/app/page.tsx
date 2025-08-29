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
        console.log('🔍 Authentication disabled - showing main app directly');
        
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
      <ClientLayout />
    </UserProvider>
  );
}