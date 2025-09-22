// ========================================
// INVITE API SERVICE
// ========================================

import { apiService, ApiResponse } from './apiService';
import { TABLE_NAMES } from '../config/environment';
import { 
  InviteData, 
  InviteWithUI, 
  transformInviteToUI, 
  validateInviteData,
  generateInviteToken,
  generateInviteExpiration 
} from '../types/invite';

export class InviteApiService {
  /**
   * Create a new invite
   */
  static async createInvite(inviteData: Omit<InviteData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<InviteData>> {
    console.log('=== INVITE API DEBUG ===');
    console.log('TABLE_NAMES object:', TABLE_NAMES);
    console.log('TABLE_NAMES.users:', TABLE_NAMES.users);
    console.log('Fallback table name:', TABLE_NAMES.users || 'project-management-users');
    
    const token = generateInviteToken();
    const now = new Date().toISOString();
    
    const invite: InviteData = {
      ...inviteData,
      id: token, // Use token as the ID for easy lookup
      createdAt: now,
      updatedAt: now
    };

    if (!validateInviteData(invite)) {
      return { success: false, error: 'Invalid invite data' };
    }

    console.log('Creating invite in DynamoDB:', invite);
    console.log('Using table:', TABLE_NAMES.users || 'project-management-users');
    console.log('This should NOT use project-management-invites table!');
    
    // Use users table with invite prefix since invites table doesn't exist
    return apiService.createItem<InviteData>(TABLE_NAMES.users || 'project-management-users', {
      ...invite,
      id: `invite-${invite.id}`, // Prefix to distinguish from regular users
      type: 'invite' // Add type field to distinguish invite records
    });
  }

  /**
   * Get invite by token
   */
  static async getInviteByToken(token: string): Promise<ApiResponse<InviteData>> {
    console.log('Fetching invite by token:', token);
    return apiService.getItem<InviteData>(TABLE_NAMES.users || 'project-management-users', `invite-${token}`);
  }

  /**
   * Get all invites for a project
   */
  static async getInvitesByProject(projectId: string): Promise<ApiResponse<InviteData[]>> {
    console.log('Fetching invites for project:', projectId);
    // Get all users and filter for invites
    const response = await apiService.getItems<any>(TABLE_NAMES.users || 'project-management-users');
    
    if (response.success && response.data) {
      const filteredInvites = response.data
        .filter((item: any) => item.type === 'invite' && item.projectId === projectId)
        .map((item: any) => ({
          ...item,
          id: item.id.replace('invite-', '') // Remove prefix for API consistency
        }));
      return {
        ...response,
        data: filteredInvites
      };
    }
    
    return response;
  }

  /**
   * Get all invites sent by a user
   */
  static async getInvitesByUser(userId: string): Promise<ApiResponse<InviteData[]>> {
    console.log('Fetching invites sent by user:', userId);
    // Get all users and filter for invites
    const response = await apiService.getItems<any>(TABLE_NAMES.users || 'project-management-users');
    
    if (response.success && response.data) {
      const filteredInvites = response.data
        .filter((item: any) => item.type === 'invite' && item.invitedBy === userId)
        .map((item: any) => ({
          ...item,
          id: item.id.replace('invite-', '') // Remove prefix for API consistency
        }));
      return {
        ...response,
        data: filteredInvites
      };
    }
    
    return response;
  }

  /**
   * Update invite status
   */
  static async updateInviteStatus(
    token: string, 
    status: InviteData['status'], 
    acceptedBy?: string
  ): Promise<ApiResponse<InviteData>> {
    const updateData: Partial<InviteData> = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (status === 'accepted' && acceptedBy) {
      updateData.acceptedBy = acceptedBy;
      updateData.acceptedAt = new Date().toISOString();
    }

    console.log('Updating invite status:', { token, status, acceptedBy });
    return apiService.updateItem<InviteData>(
      TABLE_NAMES.users || 'project-management-users', 
      `invite-${token}`, 
      updateData
    );
  }

  /**
   * Cancel/delete an invite
   */
  static async cancelInvite(token: string): Promise<ApiResponse<InviteData>> {
    console.log('Cancelling invite:', token);
    return apiService.deleteItem<InviteData>(TABLE_NAMES.users || 'project-management-users', `invite-${token}`);
  }

  /**
   * Check if invite is valid (not expired and pending)
   */
  static async validateInvite(token: string): Promise<ApiResponse<InviteData>> {
    const response = await this.getInviteByToken(token);
    
    if (!response.success || !response.data) {
      return { success: false, error: 'Invite not found' };
    }

    const invite = response.data;
    const now = new Date();
    const expiresAt = new Date(invite.expiresAt);

    if (now > expiresAt) {
      // Auto-update expired invites
      await this.updateInviteStatus(token, 'expired');
      return { success: false, error: 'Invite has expired' };
    }

    if (invite.status !== 'pending') {
      return { success: false, error: `Invite has already been ${invite.status}` };
    }

    return response;
  }

  /**
   * Transform invite data for UI
   */
  static transformInviteForUI(invite: InviteData): InviteWithUI {
    return transformInviteToUI(invite);
  }
}
