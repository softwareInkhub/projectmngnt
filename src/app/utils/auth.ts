// Centralized auth utilities for BRMH project management app
// This app now uses the central auth system at auth.brmh.in

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  const idToken = localStorage.getItem('id_token');
  return !!(token && idToken);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const getIdToken = (): string | null => {
  return localStorage.getItem('id_token');
};

export const clearAuthData = (): void => {
  // Clear all authentication tokens
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_email');
  
  // Clear all session data
  sessionStorage.clear();
  
  console.log('✅ Auth data cleared');
};
