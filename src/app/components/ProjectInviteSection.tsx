// ========================================
// PROJECT INVITE SECTION COMPONENT
// ========================================

import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Clock, 
  CheckCircle, 
  X, 
  AlertCircle,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import InviteUserForm from './InviteUserForm';
import { useInvites } from '../hooks/useInvites';
import { InviteWithUI } from '../types/invite';

interface ProjectInviteSectionProps {
  projectId: string;
  projectName: string;
  currentUserId: string;
  currentUserName?: string;
  className?: string;
}

export default function ProjectInviteSection({
  projectId,
  projectName,
  currentUserId,
  currentUserName,
  className = ''
}: ProjectInviteSectionProps) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showAllInvites, setShowAllInvites] = useState(false);
  
  const {
    invites,
    loading,
    error,
    createInvite,
    cancelInvite,
    refreshInvites
  } = useInvites({
    projectId,
    userId: currentUserId,
    autoFetch: true
  });

  const handleInviteSent = async (email: string) => {
    console.log('Invite sent to:', email);
    setShowInviteForm(false);
    await refreshInvites();
  };

  const handleCancelInvite = async (token: string) => {
    const result = await cancelInvite(token);
    if (result.success) {
      console.log('Invite cancelled successfully');
    } else {
      console.error('Failed to cancel invite:', result.error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-slate-600 bg-slate-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const pendingInvites = invites.filter(invite => invite.status === 'pending');
  const otherInvites = invites.filter(invite => invite.status !== 'pending');

  return (
    <div className={`bg-white rounded-xl border border-slate-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Team Invitations</h3>
              <p className="text-sm text-slate-600">Invite team members to join {projectName}</p>
            </div>
          </div>
          <button
            onClick={() => setShowInviteForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading invitations...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Invites */}
            {pendingInvites.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-3">
                  Pending Invitations ({pendingInvites.length})
                </h4>
                <div className="space-y-3">
                  {pendingInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">{invite.email}</p>
                          <p className="text-sm text-slate-600">
                            Expires in {invite.daysUntilExpiry} day{invite.daysUntilExpiry !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invite.status)}`}>
                          {getStatusIcon(invite.status)}
                          {invite.status}
                        </span>
                        <button
                          onClick={() => handleCancelInvite(invite.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Cancel invitation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Invites */}
            {otherInvites.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-slate-900">
                    Recent Invitations ({otherInvites.length})
                  </h4>
                  <button
                    onClick={() => setShowAllInvites(!showAllInvites)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {showAllInvites ? 'Hide' : 'Show All'}
                  </button>
                </div>
                
                {showAllInvites && (
                  <div className="space-y-3">
                    {otherInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">{invite.email}</p>
                            <p className="text-sm text-slate-600">
                              {invite.status === 'accepted' && invite.acceptedAt
                                ? `Accepted on ${new Date(invite.acceptedAt).toLocaleDateString()}`
                                : `Invited on ${new Date(invite.createdAt).toLocaleDateString()}`
                              }
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invite.status)}`}>
                          {getStatusIcon(invite.status)}
                          {invite.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {invites.length === 0 && (
              <div className="text-center py-8">
                <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-900 mb-2">No Invitations Yet</h4>
                <p className="text-slate-600 mb-4">
                  Start building your team by inviting members to join this project.
                </p>
                <button
                  onClick={() => setShowInviteForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Send First Invitation
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invite Form Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <InviteUserForm
              projectId={projectId}
              projectName={projectName}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              onInviteSent={handleInviteSent}
              onClose={() => setShowInviteForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
