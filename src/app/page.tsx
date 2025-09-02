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
        console.log('🔍 Checking authentication status...');
        
        const accessToken = localStorage.getItem('access_token');
        const idToken = localStorage.getItem('id_token');
        
        // Check if user has valid tokens (not mock tokens)
        if (accessToken && idToken && accessToken !== 'mock-token-disabled') {
          console.log('✅ User authenticated, showing main app');
          setIsAuthenticated(true);
        } else {
          console.log('❌ User not authenticated, redirecting to auth page');
          router.push('/authPage');
        }
      } catch (error) {
        console.error('❌ Error checking authentication:', error);
        router.push('/authPage');
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
          <p className="text-gray-600">Loading application...</p>
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