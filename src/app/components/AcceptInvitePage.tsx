// ========================================
// ACCEPT INVITE PAGE COMPONENT
// ========================================

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  UserPlus, 
  Clock, 
  Mail,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { InviteApiService } from '../utils/inviteApi';
import { InviteData } from '../types/invite';

interface AcceptInvitePageProps {
  isAuthenticated: boolean;
  currentUserId?: string;
  currentUserEmail?: string;
  onLoginRedirect?: (returnUrl: string) => void;
  className?: string;
}

export default function AcceptInvitePage({
  isAuthenticated,
  currentUserId,
  currentUserEmail,
  onLoginRedirect,
  className = ''
}: AcceptInvitePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load invite data on component mount
  useEffect(() => {
    if (!token) {
      setError('No invitation token provided');
      setLoading(false);
      return;
    }

    loadInvite();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadInvite = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading invite with token:', token);
      const response = await InviteApiService.validateInvite(token);
      
      if (!response.success || !response.data) {
        setError(response.error || 'Invalid or expired invitation');
        return;
      }
      
      setInvite(response.data);
      console.log('Invite loaded successfully:', response.data);
      
    } catch (err) {
      console.error('Error loading invite:', err);
      setError('Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!invite || !currentUserId) return;
    
    try {
      setAccepting(true);
      setError(null);
      
      console.log('Accepting invite:', invite.id, 'for user:', currentUserId);
      
      // Update invite status to accepted
      const response = await InviteApiService.updateInviteStatus(
        invite.id, 
        'accepted', 
        currentUserId
      );
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to accept invitation');
      }
      
      setSuccess('Invitation accepted successfully! You have been added to the project.');
      console.log('Invite accepted successfully');
      
      // Redirect to project or dashboard after a short delay
      setTimeout(() => {
        router.push(`/projects/${invite.projectId}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error accepting invite:', err);
      setError(err instanceof Error ? err.message : 'Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  const handleLoginRedirect = () => {
    if (!token) return;
    
    // Create return URL with the token
    const returnUrl = `/accept-invite?token=${token}`;
    
    if (onLoginRedirect) {
      onLoginRedirect(returnUrl);
    } else {
      // Fallback: redirect to login with return URL
      router.push(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 ${className}`}>
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md w-full text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading Invitation</h2>
          <p className="text-slate-600">Please wait while we verify your invitation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4 ${className}`}>
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Invalid Invitation</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex items-center justify-center p-4 ${className}`}>
        <div className="bg-white rounded-xl shadow-lg border border-green-200 p-8 max-w-md w-full text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Welcome to the Team!</h2>
          <p className="text-slate-600 mb-6">{success}</p>
          <p className="text-sm text-slate-500">Redirecting you to the project...</p>
        </div>
      </div>
    );
  }

  // No invite found
  if (!invite) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 ${className}`}>
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No Invitation Found</h2>
          <p className="text-slate-600 mb-6">The invitation link appears to be invalid or has expired.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Main invite display
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">You're Invited!</h1>
          <p className="text-slate-600">Join the project and start collaborating with your team</p>
        </div>

        {/* Invite Details */}
        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Invited Email</p>
                <p className="font-medium text-slate-900">{invite.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Expires</p>
                <p className="font-medium text-slate-900">
                  {new Date(invite.expiresAt).toLocaleDateString()} at {new Date(invite.expiresAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {isAuthenticated ? (
            // User is logged in
            <div>
              {currentUserEmail === invite.email ? (
                // Email matches - can accept
                <button
                  onClick={handleAcceptInvite}
                  disabled={accepting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {accepting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Accept Invitation
                    </>
                  )}
                </button>
              ) : (
                // Email doesn't match
                <div className="text-center">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-yellow-800">
                      This invitation was sent to <strong>{invite.email}</strong>, but you're logged in as <strong>{currentUserEmail}</strong>.
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Please log out and log in with the correct email address, or contact the person who sent this invitation.
                  </p>
                  <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </div>
          ) : (
            // User is not logged in
            <div className="text-center">
              <p className="text-slate-600 mb-4">
                You need to log in to accept this invitation.
              </p>
              <button
                onClick={handleLoginRedirect}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Log In to Accept
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            This invitation was sent by a team member. If you didn't expect this invitation, you can safely ignore it.
          </p>
        </div>
      </div>
    </div>
  );
}

