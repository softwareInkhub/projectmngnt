'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData } from '../utils/userApi';
import { logAuthDebugInfo } from '../utils/debug-auth';
import { logAuthDebugReport } from '../utils/auth-debugger';

interface UserContextType {
  currentUser: UserData | null;
  loading: boolean;
  error: string | null;
  fetchCurrentUser: () => Promise<void>;
  updateCurrentUser: (userData: Partial<UserData>) => void;
  clearCurrentUser: () => void;
  refreshUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://brmh.in";

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Log comprehensive debug info to help troubleshoot
      logAuthDebugReport();

      // First, try to sync tokens from cookies to localStorage
      // This handles the case where tokens are httpOnly and need to be synced
      const { SSOUtils } = await import('../utils/sso-utils');
      SSOUtils.syncTokensFromCookies();

      const token = localStorage.getItem('access_token');
      const idToken = localStorage.getItem('id_token');
      const email = localStorage.getItem('user_email');
      const userId = localStorage.getItem('user_id');
      const userName = localStorage.getItem('user_name');
      
      console.log('🔄 fetchCurrentUser - token exists:', !!token);
      console.log('🔄 fetchCurrentUser - id token exists:', !!idToken);
      console.log('🔄 fetchCurrentUser - user info exists:', !!userId, !!userName);
      
      // Check if we have tokens in localStorage OR if auth_valid flag is set (indicating httpOnly cookies exist)
      const authValidFlag = SSOUtils.getCookieValue('auth_valid');
      const authValidLocalFlag = SSOUtils.getCookieValue('auth_valid_local');
      
      if ((!token || !idToken) && !authValidFlag && !authValidLocalFlag) {
        console.log('❌ No valid tokens found');
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      // Create user data from stored information
      let userData = null;

      // Try to decode JWT token for user info
      try {
        if (idToken) {
          // Decode JWT token (simple base64 decode of payload)
          const payload = JSON.parse(atob(idToken.split('.')[1]));
          if (payload) {
            userData = {
              id: userId || payload.sub || payload['cognito:username'] || 'cognito-user',
              name: userName || payload.name || payload.given_name || payload['cognito:username'] || 'User',
              email: payload.email || email || '',
              role: 'User',
              status: 'Active',
              department: 'Unknown',
              joinDate: new Date(payload.iat * 1000).toISOString().split('T')[0],
              lastActive: new Date().toISOString(),
              phone: payload.phone_number || '',
              companyId: '',
              teamId: ''
            };
            console.log('✅ Got user data from JWT token:', userData);
          }
        }
      } catch (jwtError) {
        console.log('❌ JWT decode error:', jwtError);
      }

      // If still no user data found, create a minimal user object with available info
      if (!userData && email) {
        userData = {
          id: userId || 'temp-user',
          name: userName || 'User',
          email: email,
          role: 'User',
          status: 'Active',
          department: 'Unknown',
          joinDate: new Date().toISOString().split('T')[0],
          lastActive: new Date().toISOString(),
          phone: '',
          companyId: '',
          teamId: ''
        };
        console.log('✅ Created minimal user data from email:', userData);
      }

      // If still no user data found, set to null
      if (!userData) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      setCurrentUser(userData);

    } catch (err) {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentUser = (userData: Partial<UserData>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...userData });
    }
  };

  const clearCurrentUser = () => {
    setCurrentUser(null);
    setError(null);
  };

  const refreshUserData = () => {
    fetchCurrentUser();
  };

  // Fetch user data when component mounts or SSO initializes
  useEffect(() => {
    const handleSSOInitialized = () => {
      console.log('🔄 UserContext - SSO initialized, calling fetchCurrentUser');
      fetchCurrentUser();
    };

    // Check if SSO is already initialized
    const ssoInitialized = typeof document !== 'undefined' && document.documentElement.getAttribute('data-sso-initialized');
    if (ssoInitialized) {
      console.log('🔄 UserContext useEffect - SSO already initialized, calling fetchCurrentUser');
      fetchCurrentUser();
    } else {
      // Listen for the SSO initialization event
      window.addEventListener('sso-initialized', handleSSOInitialized);
      
      // Fallback timeout in case event doesn't fire
      const timer = setTimeout(() => {
        console.log('🔄 UserContext useEffect - timeout fallback, calling fetchCurrentUser');
        fetchCurrentUser();
      }, 1500);
      
      return () => {
        window.removeEventListener('sso-initialized', handleSSOInitialized);
        clearTimeout(timer);
      };
    }
  }, []);

  // Listen for storage changes (when user logs in/out)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        if (e.newValue) {
          fetchCurrentUser();
        } else {
          clearCurrentUser();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: UserContextType = {
    currentUser,
    loading,
    error,
    fetchCurrentUser,
    updateCurrentUser,
    clearCurrentUser,
    refreshUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};