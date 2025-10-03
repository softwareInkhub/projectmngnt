// SSO utilities for BRMH project management app
// This app now uses the central auth system at auth.brmh.in

export class SSOUtils {
  /**
   * Check if user is authenticated by checking both cookies and localStorage
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check cookies first (primary SSO method)
    const cookieIdToken = this.getCookieValue('id_token');
    const cookieAccessToken = this.getCookieValue('access_token');
    
    // Check localStorage as fallback
    const localIdToken = localStorage.getItem('id_token');
    const localAccessToken = localStorage.getItem('access_token');
    
    return !!(cookieIdToken || cookieAccessToken || (localIdToken && localAccessToken));
  }

  /**
   * Check if user is authenticated via cookies specifically
   */
  static isAuthenticatedViaCookies(): boolean {
    if (typeof window === 'undefined') return false;
    
    const cookieIdToken = this.getCookieValue('id_token');
    const cookieAccessToken = this.getCookieValue('access_token');
    
    return !!(cookieIdToken || cookieAccessToken);
  }

  /**
   * Get tokens from cookies
   */
  static getTokensFromCookies(): {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
  } {
    if (typeof window === 'undefined') return {};
    
    return {
      accessToken: this.getCookieValue('access_token'),
      idToken: this.getCookieValue('id_token'),
      refreshToken: this.getCookieValue('refresh_token')
    };
  }

  /**
   * Sync tokens from cookies to localStorage
   */
  static syncTokensFromCookies(): void {
    if (typeof window === 'undefined') return;
    
    const tokens = this.getTokensFromCookies();
    
    if (tokens.accessToken) {
      localStorage.setItem('access_token', tokens.accessToken);
    }
    if (tokens.idToken) {
      localStorage.setItem('id_token', tokens.idToken);
    }
    if (tokens.refreshToken) {
      localStorage.setItem('refresh_token', tokens.refreshToken);
    }

    // Extract user info from ID token if available
    if (tokens.idToken) {
      try {
        const payload = JSON.parse(atob(tokens.idToken.split('.')[1]));
        if (payload.sub) localStorage.setItem('user_id', payload.sub);
        if (payload.email) localStorage.setItem('user_email', payload.email);
        if (payload.name || payload.given_name) {
          localStorage.setItem('user_name', payload.name || payload.given_name);
        }
        console.log('[SSOUtils] Synced tokens and user info from cookies to localStorage');
      } catch (error) {
        console.error('[SSOUtils] Error extracting user info from ID token:', error);
      }
    }
  }

  /**
   * Get cookie value by name
   */
  static getCookieValue(name: string): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return undefined;
  }

  /**
   * Clear all authentication data and redirect to login
   */
  static async logout(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear cookies by setting them to expire
    const domain = '.brmh.in';
    document.cookie = `access_token=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `id_token=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `refresh_token=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    console.log('[SSOUtils] Cleared all auth data, redirecting to login');
    
    // Redirect to centralized auth
    window.location.href = 'https://auth.brmh.in/login';
  }

  /**
   * Fetch user profile from backend
   */
  static async fetchUserProfile(backendUrl: string): Promise<any> {
    const accessToken = localStorage.getItem('access_token') || this.getCookieValue('access_token');
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${backendUrl}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, clear auth and redirect
        await this.logout();
        throw new Error('Authentication expired');
      }
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Store user info in localStorage for easy access
    if (data.sub) localStorage.setItem('user_id', data.sub);
    if (data.email) localStorage.setItem('user_email', data.email);
    if (data.name || data.given_name) {
      localStorage.setItem('user_name', data.name || data.given_name);
    }
    
    return data;
  }

  /**
   * Get current user info from localStorage
   */
  static getCurrentUser(): {
    id?: string;
    email?: string;
    name?: string;
  } {
    if (typeof window === 'undefined') return {};
    
    return {
      id: localStorage.getItem('user_id') || undefined,
      email: localStorage.getItem('user_email') || undefined,
      name: localStorage.getItem('user_name') || undefined
    };
  }
}

// Legacy exports for backward compatibility
export const isAuthenticated = (): boolean => SSOUtils.isAuthenticated();
export const getAuthToken = (): string | null => localStorage.getItem('access_token') || SSOUtils.getCookieValue('access_token') || null;
export const getIdToken = (): string | null => localStorage.getItem('id_token') || SSOUtils.getCookieValue('id_token') || null;
export const clearAuthData = (): void => {
  SSOUtils.logout();
};
