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
        // Check for access token
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          console.log('No access token found, redirecting to auth page');
          router.push('/authPage');
          return;
        }

        // Validate token with backend (with fallback)
        const isValid = await validateToken();
        
        if (isValid) {
          console.log('Token is valid, user is authenticated');
          setIsAuthenticated(true);
        } else {
          console.log('Token is invalid, but keeping user logged in for now');
          // Don't clear tokens immediately - let user stay logged in
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Don't clear tokens on error - let user stay logged in
        console.log('Authentication check failed, but keeping user logged in');
        setIsAuthenticated(true);
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