// ========================================
// INVITE TYPES AND INTERFACES
// ========================================

export interface InviteData {
  id: string; // UUID token
  email: string;
  invitedBy: string; // userId of the person who sent the invite
  projectId: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expiresAt: string; // ISO date string
  acceptedAt?: string; // ISO date string
  acceptedBy?: string; // userId of the person who accepted
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  type?: string; // Optional type field to distinguish invite records
}

export interface InviteWithUI extends InviteData {
  // UI-specific computed properties
  isExpired: boolean;
  daysUntilExpiry: number;
  invitedByName?: string;
  projectName?: string;
}

export interface InviteFormData {
  email: string;
  projectId: string;
  message?: string; // Optional custom message
}

export interface InviteResponse {
  success: boolean;
  data?: InviteData;
  error?: string;
  message?: string;
}

// Validation function for invite data
export function validateInviteData(invite: Partial<InviteData>): boolean {
  if (!invite.id || typeof invite.id !== 'string') return false;
  if (!invite.email || typeof invite.email !== 'string') return false;
  if (!invite.invitedBy || typeof invite.invitedBy !== 'string') return false;
  if (!invite.projectId || typeof invite.projectId !== 'string') return false;
  if (!invite.status || !['pending', 'accepted', 'expired', 'cancelled'].includes(invite.status)) return false;
  if (!invite.expiresAt || typeof invite.expiresAt !== 'string') return false;
  if (!invite.createdAt || typeof invite.createdAt !== 'string') return false;
  if (!invite.updatedAt || typeof invite.updatedAt !== 'string') return false;
  
  return true;
}

// Transform invite data for UI
export function transformInviteToUI(invite: InviteData): InviteWithUI {
  const now = new Date();
  const expiresAt = new Date(invite.expiresAt);
  const isExpired = now > expiresAt;
  const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    ...invite,
    isExpired,
    daysUntilExpiry: Math.max(0, daysUntilExpiry)
  };
}

// Generate UUID v4
export function generateInviteToken(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate invite expiration date (7 days from now)
export function generateInviteExpiration(): string {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
  return expiresAt.toISOString();
}
