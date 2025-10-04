'use client';

import { useEffect, useState } from 'react';
import { SSOUtils } from '../utils/sso-utils';

interface SSOInitializerProps {
  children: React.ReactNode;
}

export default function SSOInitializer({ children }: SSOInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeSSO = async () => {
      console.log('[SSOInitializer] Initializing SSO...');
      
      try {
        // Initialize SSO (this handles httpOnly cookies)
        const result = await SSOUtils.initialize();
        console.log('[SSOInitializer] SSO initialized:', result);
        
        if (result.isAuthenticated && result.user) {
          console.log('[SSOInitializer] User authenticated:', result.user);
        }
      } catch (error) {
        console.error('[SSOInitializer] Failed to initialize SSO:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeSSO();
  }, []);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
