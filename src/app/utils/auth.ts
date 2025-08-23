const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://brmh.in";

export const logout = () => {
  // Clear all tokens from localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires');
  localStorage.removeItem('user_email');
  
  // Clear any other auth-related data
  sessionStorage.removeItem('oauth_state');
  
  // Redirect to auth page
  window.location.href = '/authPage';
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const validateToken = async (): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) return false;

    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};
