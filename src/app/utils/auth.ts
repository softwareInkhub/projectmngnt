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

    // First, try to validate with backend
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.log('Backend validation failed, trying fallback validation...');
    }

    // Fallback validation: Check if token exists and has basic JWT structure
    if (token && token.split('.').length === 3) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp > currentTime) {
          console.log('Token validated using fallback method');
          return true;
        } else if (!payload.exp) {
          console.log('Token validated (no expiration field)');
          return true;
        } else {
          console.log('Token expired');
          return false;
        }
      } catch (error) {
        console.log('Token structure invalid');
        return false;
      }
    }

    return false;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};
