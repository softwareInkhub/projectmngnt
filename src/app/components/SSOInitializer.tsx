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
    
    // Sync tokens from cookies to localStorage first
    SSOUtils.syncTokensFromCookies();
    
    // Check authentication status
    const isAuth = SSOUtils.isAuthenticated();
    console.log('[SSOInitializer] Authentication status:', isAuth);
    
    if (isAuth) {
      const user = SSOUtils.getCurrentUser();
      console.log('[SSOInitializer] Current user:', user);
    } else {
      console.log('[SSOInitializer] No authentication found, user will be redirected by middleware/AuthGuard');
    }
    
    // Set a data attribute to indicate SSO initialization is complete
    document.documentElement.setAttribute('data-sso-initialized', 'true');
    
    // Dispatch a custom event to notify other components that SSO initialization is complete
    const event = new CustomEvent('sso-initialized', { 
      detail: { isAuthenticated: isAuth } 
    });
    window.dispatchEvent(event);
    
  }, []);

  return <>{children}</>;
}
