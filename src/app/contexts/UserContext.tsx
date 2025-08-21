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

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        setCurrentUser(null);
        return;
      }

      let userData = null;

      // First, try to get user info from the auth/me endpoint
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          userData = data.user || data;
          console.log('✅ User data fetched from /auth/me');
        }
      } catch (authMeError) {
        console.log('Auth /me endpoint not available, trying users endpoint...');
      }

      // If /auth/me doesn't work, try to get user by email from localStorage
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
              
              // Find user by email or phone number
              const user = usersData.users?.find((u: UserData) => 
                u.email === email || u.phone === email
              );
              
              if (user) {
                userData = user;
                console.log('✅ User data fetched from /users by email/phone');
              }
            }
          } catch (usersError) {
            console.log('Users endpoint not available');
          }
        }
      }

      if (userData) {
        setCurrentUser(userData);
      } else {
        console.log('No user data found');
        setCurrentUser(null);
      }

    } catch (err) {
      console.error('Error fetching current user:', err);
      setError('Failed to fetch user data');
      setCurrentUser(null);
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

  // Fetch user data when component mounts
  useEffect(() => {
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
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};