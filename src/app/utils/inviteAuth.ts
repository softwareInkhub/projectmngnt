// ========================================
// INVITE AUTHENTICATION UTILITY
// ========================================

import { InviteApiService } from './inviteApi';
import { InviteData } from '../types/invite';

/**
 * Check for invite token in URL and handle the flow
 */
export async function handleInviteTokenFlow(
  isAuthenticated: boolean,
  currentUserId?: string,
  currentUserEmail?: string
): Promise<{
  hasInviteToken: boolean;
  invite?: InviteData;
  shouldRedirect?: string;
  error?: string;
}> {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return { hasInviteToken: false };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    return { hasInviteToken: false };
  }

  try {
    console.log('Found invite token in URL:', token);
    
    // Validate the invite
    const response = await InviteApiService.validateInvite(token);
    
    if (!response.success || !response.data) {
      return {
        hasInviteToken: true,
        error: response.error || 'Invalid or expired invitation'
      };
    }

    const invite = response.data;

    if (!isAuthenticated) {
      // User is not logged in - redirect to login with return URL
      const returnUrl = `/accept-invite?token=${token}`;
      return {
        hasInviteToken: true,
        invite,
        shouldRedirect: `/auth?returnUrl=${encodeURIComponent(returnUrl)}`
      };
    }

    // User is logged in - check if email matches
    if (currentUserEmail && currentUserEmail.toLowerCase() !== invite.email.toLowerCase()) {
      return {
        hasInviteToken: true,
        invite,
        error: `This invitation was sent to ${invite.email}, but you're logged in as ${currentUserEmail}. Please log out and log in with the correct email address.`
      };
    }

    // User is logged in and email matches - can accept the invite
    return {
      hasInviteToken: true,
      invite
    };

  } catch (error) {
    console.error('Error handling invite token:', error);
    return {
      hasInviteToken: true,
      error: 'Failed to process invitation'
    };
  }
}

/**
 * Accept an invite for the current user
 */
export async function acceptInviteForUser(
  token: string,
  userId: string
): Promise<{ success: boolean; error?: string; invite?: InviteData }> {
  try {
    console.log('Accepting invite for user:', userId);
    
    const response = await InviteApiService.updateInviteStatus(token, 'accepted', userId);
    
    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to accept invitation'
      };
    }

    return {
      success: true,
      invite: response.data
    };

  } catch (error) {
    console.error('Error accepting invite:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to accept invitation'
    };
  }
}

/**
 * Get invite token from URL
 */
export function getInviteTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
}

/**
 * Remove invite token from URL without page reload
 */
export function removeInviteTokenFromUrl(): void {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  url.searchParams.delete('token');
  
  // Update URL without page reload
  window.history.replaceState({}, '', url.toString());
}

/**
 * Create invite redirect URL for Cognito
 */
export function createInviteRedirectUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  return `${baseUrl}/accept-invite?token=${token}`;
}

/**
 * Check if current user can accept the invite
 */
export function canUserAcceptInvite(
  invite: InviteData,
  isAuthenticated: boolean,
  currentUserEmail?: string
): { canAccept: boolean; reason?: string } {
  if (!isAuthenticated) {
    return { canAccept: false, reason: 'User must be logged in' };
  }

  if (!currentUserEmail) {
    return { canAccept: false, reason: 'User email not available' };
  }

  if (currentUserEmail.toLowerCase() !== invite.email.toLowerCase()) {
    return { 
      canAccept: false, 
      reason: `Email mismatch: invite sent to ${invite.email}, user logged in as ${currentUserEmail}` 
    };
  }

  if (invite.status !== 'pending') {
    return { canAccept: false, reason: `Invite has already been ${invite.status}` };
  }

  const now = new Date();
  const expiresAt = new Date(invite.expiresAt);
  
  if (now > expiresAt) {
    return { canAccept: false, reason: 'Invite has expired' };
  }

  return { canAccept: true };
}
