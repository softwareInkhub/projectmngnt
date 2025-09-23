# User Invite Integration Example

This document shows how to integrate the User Invite by Email feature into your existing project management app.

## 1. Add Invite Section to Project Detail Page

Add the `ProjectInviteSection` component to your project detail page:

```tsx
// In your project detail page (e.g., src/app/projects/[id]/page.tsx)
import ProjectInviteSection from '../../components/ProjectInviteSection';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [currentUser, setCurrentUser] = useState(null);
  
  // ... your existing project logic ...

  return (
    <div className="container mx-auto p-6">
      {/* Your existing project content */}
      
      {/* Add the invite section */}
      <div className="mt-8">
        <ProjectInviteSection
          projectId={params.id}
          projectName={project.name}
          currentUserId={currentUser?.id}
          currentUserName={currentUser?.name}
        />
      </div>
    </div>
  );
}
```

## 2. Add Invite Button to Project List

Add a quick invite button to your project list items:

```tsx
// In your project list component
import { useState } from 'react';
import InviteUserForm from './InviteUserForm';

export default function ProjectList() {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleQuickInvite = (project) => {
    setSelectedProject(project);
    setShowInviteForm(true);
  };

  return (
    <div>
      {/* Your existing project list */}
      {projects.map(project => (
        <div key={project.id} className="project-card">
          {/* Your existing project content */}
          
          <div className="project-actions">
            <button
              onClick={() => handleQuickInvite(project)}
              className="invite-button"
            >
              <UserPlus className="w-4 h-4" />
              Invite
            </button>
          </div>
        </div>
      ))}

      {/* Invite Form Modal */}
      {showInviteForm && selectedProject && (
        <div className="modal-overlay">
          <InviteUserForm
            projectId={selectedProject.id}
            projectName={selectedProject.name}
            currentUserId={currentUser.id}
            currentUserName={currentUser.name}
            onInviteSent={() => setShowInviteForm(false)}
            onClose={() => setShowInviteForm(false)}
          />
        </div>
      )}
    </div>
  );
}
```

## 3. Handle Invite Token in App Layout

Add invite token handling to your main app layout:

```tsx
// In your main layout or app component
import { useEffect } from 'react';
import { handleInviteTokenFlow } from './utils/inviteAuth';

export default function AppLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check for invite token on app load
    const checkInviteToken = async () => {
      const result = await handleInviteTokenFlow(
        isAuthenticated,
        currentUser?.id,
        currentUser?.email
      );

      if (result.hasInviteToken) {
        if (result.shouldRedirect) {
          window.location.href = result.shouldRedirect;
        } else if (result.error) {
          // Show error toast
          console.error('Invite error:', result.error);
        } else if (result.invite) {
          // Show invite acceptance dialog
          // You can create a modal component for this
        }
      }
    };

    checkInviteToken();
  }, [isAuthenticated, currentUser]);

  return (
    <div>
      {children}
    </div>
  );
}
```

## 4. Add Invite Management to User Dashboard

Create an invite management section for users:

```tsx
// Create a new component: src/app/components/UserInviteDashboard.tsx
import { useInvites } from '../hooks/useInvites';

export default function UserInviteDashboard({ userId }) {
  const { invites, loading, error, cancelInvite } = useInvites({ userId });

  return (
    <div className="invite-dashboard">
      <h2>My Invitations</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="invite-list">
          {invites.map(invite => (
            <div key={invite.id} className="invite-item">
              <div>
                <h3>{invite.projectName}</h3>
                <p>Status: {invite.status}</p>
                <p>Expires: {new Date(invite.expiresAt).toLocaleDateString()}</p>
              </div>
              
              {invite.status === 'pending' && (
                <div className="invite-actions">
                  <a 
                    href={`/accept-invite?token=${invite.id}`}
                    className="accept-button"
                  >
                    Accept Invitation
                  </a>
                  <button
                    onClick={() => cancelInvite(invite.id)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 5. Environment Variables Setup

Add these to your `.env.local`:

```env
# AWS SES Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_access_key
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_secret_key
NEXT_PUBLIC_FROM_EMAIL=noreply@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Cognito Configuration (if using Cognito Hosted UI)
NEXT_PUBLIC_COGNITO_DOMAIN=your-cognito-domain
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id

# DynamoDB Table Name
NEXT_PUBLIC_DYNAMODB_INVITES_TABLE=project-management-invites
```

## 6. DynamoDB Table Setup

Create the invites table in DynamoDB with the schema from `INVITE_SCHEMA.md`:

```bash
# Using AWS CLI
aws dynamodb create-table \
  --table-name project-management-invites \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=projectId,AttributeType=S \
    AttributeName=invitedBy,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=ProjectInvites,KeySchema='[{AttributeName=projectId,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}]',Projection='{ProjectionType=ALL}',ProvisionedThroughput='{ReadCapacityUnits=5,WriteCapacityUnits=5}' \
    IndexName=UserInvites,KeySchema='[{AttributeName=invitedBy,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}]',Projection='{ProjectionType=ALL}',ProvisionedThroughput='{ReadCapacityUnits=5,WriteCapacityUnits=5}' \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

## 7. AWS SES Setup

1. **Verify your domain** in AWS SES
2. **Create an IAM user** with SES permissions
3. **Add the credentials** to your environment variables
4. **Test email sending** using the `sendTestEmail` function

## 8. Usage Flow

### Sending an Invite:
1. User clicks "Invite Member" on a project
2. `InviteUserForm` opens with email field
3. User enters email and optional message
4. System creates invite record in DynamoDB
5. System sends email via AWS SES
6. User sees success message

### Accepting an Invite:
1. User clicks link in email: `https://yourapp.com/accept-invite?token=abc123`
2. `AcceptInvitePage` loads and validates token
3. If user not logged in → redirects to Cognito login
4. If user logged in → shows accept button
5. User clicks accept → invite status updated to "accepted"
6. User redirected to project page

### Managing Invites:
1. Project owners can see all pending invites
2. Users can see invites sent to them
3. Invites automatically expire after 7 days
4. Users can cancel pending invites

## 9. Customization Options

### Custom Email Templates:
Modify the `sendInviteEmail` function to use your brand colors and messaging.

### Custom Expiration Times:
Change the 7-day expiration in the `generateInviteExpiration` function.

### Additional Invite Fields:
Add more fields to the `InviteData` interface and form as needed.

### Integration with User Management:
Connect the invite system with your existing user creation/management flow.

## 10. Testing

Test the complete flow:
1. Create a project
2. Send an invite to a test email
3. Check the email was received
4. Click the invite link
5. Complete the login/signup flow
6. Verify the user was added to the project

This integration provides a complete, production-ready user invitation system that works seamlessly with your existing infrastructure!

