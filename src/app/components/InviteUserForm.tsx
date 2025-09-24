// ========================================
// INVITE USER FORM COMPONENT
// ========================================

import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  UserPlus, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  X,
  MessageSquare
} from 'lucide-react';
import { InviteApiService } from '../utils/inviteApi';
// Removed calendar scheduling from invite form per requirement
import { sendInviteEmail } from '../utils/sendInviteEmail';
import { InviteFormData } from '../types/invite';

interface InviteUserFormProps {
  projectId: string;
  projectName?: string;
  currentUserId: string;
  currentUserName?: string;
  onInviteSent?: (email: string) => void;
  onClose?: () => void;
  className?: string;
}

export default function InviteUserForm({
  projectId,
  projectName = 'Project',
  currentUserId,
  currentUserName = 'Team Member',
  onInviteSent,
  onClose,
  className = ''
}: InviteUserFormProps) {
  const [formData, setFormData] = useState<InviteFormData>({
    email: '',
    projectId,
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calendar actions removed

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError('Please enter an email address');
      return;
    }
    
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!currentUserId || currentUserId.trim() === '') {
      setError('User ID is missing. Please refresh the page and try again.');
      return;
    }
    
    if (!formData.projectId || formData.projectId.trim() === '') {
      setError('Please select a project first.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('Creating invite for:', formData.email);
      console.log('Form data:', formData);
      console.log('Current user ID:', currentUserId);
      console.log('Project ID:', formData.projectId);
      
      const inviteData = {
        email: formData.email.toLowerCase().trim(),
        invitedBy: currentUserId,
        projectId: formData.projectId,
        status: 'pending' as const,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      };
      
      console.log('Invite data being sent:', inviteData);
      
      // Create invite in DynamoDB
      const inviteResponse = await InviteApiService.createInvite(inviteData);
      
      if (!inviteResponse.success || !inviteResponse.data) {
        throw new Error(inviteResponse.error || 'Failed to create invite');
      }
      
      const invite = inviteResponse.data;
      console.log('Invite created successfully:', invite.id);
      
      // Send email
      const emailResponse = await sendInviteEmail({
        email: formData.email,
        token: invite.id,
        projectName,
        inviterName: currentUserName,
        customMessage: formData.message || undefined
      });
      
      if (!emailResponse.success) {
        // If email fails, we should still show success for the invite creation
        // but log the email error
        console.error('Email sending failed:', emailResponse.error);
        setSuccess(`Invite created successfully, but email delivery failed: ${emailResponse.error}`);
      } else {
        setSuccess(`Invitation sent successfully to ${formData.email}`);
      }
      
      // Reset form
      setFormData({
        email: '',
        projectId,
        message: ''
      });
      
      // Notify parent component
      onInviteSent?.(formData.email);
      
    } catch (err) {
      console.error('Error creating invite:', err);
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    onClose?.();
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-slate-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UserPlus className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Invite Team Member</h3>
            <p className="text-sm text-slate-600">Send an invitation to join {projectName}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scheduling options removed from invite form */}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="colleague@company.com"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Custom Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Personal Message (Optional)
            </div>
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Add a personal note to your invitation..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
          <p className="text-xs text-slate-500 mt-1">
            This message will be included in the invitation email
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">Success!</p>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          {onClose && (
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !formData.email.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Invitation
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Section */}
      <div className="px-6 pb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• An invitation email will be sent to the recipient</li>
            <li>• They can click the link to accept the invitation</li>
            <li>• If they don't have an account, they'll be guided through signup</li>
            <li>• The invitation expires in 7 days</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
