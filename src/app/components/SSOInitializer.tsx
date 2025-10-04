'use client';

import { useEffect } from 'react';
import { SSOUtils } from '../utils/sso-utils';

interface SSOInitializerProps {
  children: React.ReactNode;
}

export default function SSOInitializer({ children }: SSOInitializerProps) {
  useEffect(() => {
    // Initialize SSO on app load
    console.log('[SSOInitializer] Initializing SSO...');
    SSOUtils.syncTokensFromCookies();
    
    // Check if we have tokens after sync
    const isAuth = SSOUtils.isAuthenticated();
    console.log('[SSOInitializer] Authentication status:', isAuth);
    
    if (isAuth) {
      const user = SSOUtils.getUser();
      console.log('[SSOInitializer] Current user:', user);
    }
  }, []);

  return <>{children}</>;
}
