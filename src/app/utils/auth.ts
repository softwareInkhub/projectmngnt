// Centralized auth utilities for BRMH project management app
// This app now uses the central auth system at auth.brmh.in

import { SSOUtils } from './sso-utils';

export const isAuthenticated = (): boolean => {
  return SSOUtils.isAuthenticated();
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token') || SSOUtils.getTokensFromCookies().accessToken || null;
};

export const getIdToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('id_token') || SSOUtils.getTokensFromCookies().idToken || null;
};

export const clearAuthData = (): void => {
  SSOUtils.logout();
};

// Initialize SSO on app load
export const initializeSSO = (): void => {
  if (typeof window !== 'undefined') {
    SSOUtils.syncTokensFromCookies();
  }
};
