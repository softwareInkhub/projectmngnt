// ========================================
// INVITES HOOK
// ========================================

import { useState, useEffect, useCallback } from 'react';
import { InviteApiService } from '../utils/inviteApi';
import { InviteData, InviteWithUI } from '../types/invite';

interface UseInvitesOptions {
  projectId?: string;
  userId?: string;
  autoFetch?: boolean;
}

interface UseInvitesReturn {
  invites: InviteWithUI[];
  loading: boolean;
  error: string | null;
  fetchInvites: () => Promise<void>;
  createInvite: (email: string, message?: string) => Promise<{ success: boolean; error?: string }>;
  cancelInvite: (token: string) => Promise<{ success: boolean; error?: string }>;
  refreshInvites: () => Promise<void>;
}

export function useInvites({
  projectId,
  userId,
  autoFetch = true
}: UseInvitesOptions = {}): UseInvitesReturn {
  const [invites, setInvites] = useState<InviteWithUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvites = useCallback(async () => {
    if (!projectId && !userId) {
      setError('Either projectId or userId must be provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response;
      if (projectId) {
        response = await InviteApiService.getInvitesByProject(projectId);
      } else if (userId) {
        response = await InviteApiService.getInvitesByUser(userId);
      }

      if (response?.success && response.data) {
        const transformedInvites = response.data.map(invite => 
          InviteApiService.transformInviteForUI(invite)
        );
        setInvites(transformedInvites);
      } else {
        setError(response?.error || 'Failed to fetch invites');
        setInvites([]);
      }
    } catch (err) {
      console.error('Error fetching invites:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch invites');
      setInvites([]);
    } finally {
      setLoading(false);
    }
  }, [projectId, userId]);

  const createInvite = useCallback(async (
    email: string, 
    message?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!projectId || !userId) {
      return { success: false, error: 'Missing projectId or userId' };
    }

    try {
      const response = await InviteApiService.createInvite({
        email: email.toLowerCase().trim(),
        invitedBy: userId,
        projectId,
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

      if (response.success) {
        // Refresh invites list
        await fetchInvites();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to create invite' };
      }
    } catch (err) {
      console.error('Error creating invite:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create invite' 
      };
    }
  }, [projectId, userId, fetchInvites]);

  const cancelInvite = useCallback(async (
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await InviteApiService.cancelInvite(token);

      if (response.success) {
        // Refresh invites list
        await fetchInvites();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to cancel invite' };
      }
    } catch (err) {
      console.error('Error cancelling invite:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to cancel invite' 
      };
    }
  }, [fetchInvites]);

  const refreshInvites = useCallback(async () => {
    await fetchInvites();
  }, [fetchInvites]);

  // Auto-fetch invites on mount and when dependencies change
  useEffect(() => {
    if (autoFetch && (projectId || userId)) {
      fetchInvites();
    }
  }, [autoFetch, projectId, userId, fetchInvites]);

  return {
    invites,
    loading,
    error,
    fetchInvites,
    createInvite,
    cancelInvite,
    refreshInvites
  };
}
