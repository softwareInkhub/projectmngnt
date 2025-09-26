'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData } from '../utils/userApi';

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

      const token = localStorage.getItem('access_token');
      const email = localStorage.getItem('user_email');
      
      console.log('🔄 fetchCurrentUser - token exists:', !!token);
      console.log('🔄 fetchCurrentUser - email exists:', !!email, email);
      console.log('🔄 fetchCurrentUser - API_BASE_URL:', API_BASE_URL);
      
      if (!token) {
        console.log('❌ No access token found');
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      let userData = null;

      // First, try to get user info from an optional auth endpoint (tolerate 404)
      try {
        const AUTH_ENDPOINT = (process.env.NEXT_PUBLIC_AUTH_ENDPOINT || '/auth').trim();
        console.log(`🔄 Trying AUTH endpoint: ${AUTH_ENDPOINT}`);
        const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINT}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
        });
        console.log(`🔄 AUTH endpoint response status:`, response.status);
        if (response.ok) {
          const data = await response.json();
          console.log(`🔄 AUTH endpoint response data:`, data);
          userData = (data && (data.user || data)) || null;
          if (userData) {
            console.log(`✅ Got user data from AUTH endpoint:`, userData);
            setCurrentUser(userData);
            setLoading(false);
            return;
          }
        } else if (response.status !== 404) {
          // Only log non-404 issues; 404 just means endpoint not present on this backend
          const errorText = await response.text();
          console.log(`❌ AUTH endpoint failed with status:`, response.status, errorText);
        }
      } catch (authProbeError) {
        console.log('❌ Auth probe error:', authProbeError);
      }

      // If /auth doesn't work, try to decode JWT token for user info
      if (!userData) {
        try {
          const idToken = localStorage.getItem('id_token');
          if (idToken) {
            // Decode JWT token (simple base64 decode of payload)
            const payload = JSON.parse(atob(idToken.split('.')[1]));
            if (payload) {
              userData = {
                id: payload.sub || payload['cognito:username'] || 'cognito-user',
                name: payload.name || payload.given_name || payload['cognito:username'] || 'User',
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
      }

      // If /auth doesn't work, try to get user by email from localStorage
      if (!userData) {
        const email = localStorage.getItem('user_email');
        if (email) {
          try {
            // Try to find user in the users list
            const usersResponse = await fetch(`${API_BASE_URL}/users`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (usersResponse.ok) {
              const usersData = await usersResponse.json();
              
              // Find user by email or phone number (case insensitive)
              const user = usersData.users?.find((u: UserData) => 
                u.email?.toLowerCase() === email.toLowerCase() || 
                u.phone === email ||
                u.name?.toLowerCase() === email.split('@')[0].toLowerCase()
              );
              
              if (user) {
                userData = user;
              }
            }
          } catch (usersError) {
            // Silent error handling
          }
        }
      }


      // If still no user data found, create a minimal user object with available info
      if (!userData && email) {
        userData = {
          id: 'temp-user',
          name: 'User', // Use generic name instead of email prefix
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

      // If still no user data found, don't redirect immediately - let main page handle it
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

  // Fetch user data when component mounts
  useEffect(() => {
    console.log('🔄 UserContext useEffect - calling fetchCurrentUser');
    fetchCurrentUser();
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