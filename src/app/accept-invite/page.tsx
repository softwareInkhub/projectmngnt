// ========================================
// ACCEPT INVITE PAGE
// ========================================

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AcceptInvitePage from '../components/AcceptInvitePage';
import { handleInviteTokenFlow, acceptInviteForUser } from '../utils/inviteAuth';
import { InviteData } from '../types/invite';

export default function AcceptInviteRoute() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is authenticated via Cognito
      const token = localStorage.getItem('access_token');
      const userEmail = localStorage.getItem('user_email');
      const userId = localStorage.getItem('user_id');

      if (token && userEmail && userId) {
        setIsAuthenticated(true);
        setCurrentUserEmail(userEmail);
        setCurrentUserId(userId);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = (returnUrl: string) => {
    // Redirect to Cognito Hosted UI with return URL
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const redirectUri = encodeURIComponent(returnUrl);
    
    if (cognitoDomain && clientId) {
      const cognitoUrl = `https://${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${redirectUri}`;
      window.location.href = cognitoUrl;
    } else {
      // Fallback to local auth page
      router.push(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AcceptInvitePage
      isAuthenticated={isAuthenticated}
      currentUserId={currentUserId}
      currentUserEmail={currentUserEmail}
      onLoginRedirect={handleLoginRedirect}
    />
  );
}

