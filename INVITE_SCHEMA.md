# DynamoDB Invite Table Schema

## Table Name
`project-management-invites`

## Primary Key
- **Partition Key (PK)**: `id` (String) - UUID token for the invite

## Attributes

| Attribute | Type | Description | Required |
|-----------|------|-------------|----------|
| `id` | String | UUID token (used as primary key) | Yes |
| `email` | String | Email address of the invited user | Yes |
| `invitedBy` | String | User ID of the person who sent the invite | Yes |
| `projectId` | String | ID of the project the user is being invited to | Yes |
| `status` | String | Invite status: `pending`, `accepted`, `expired`, `cancelled` | Yes |
| `expiresAt` | String | ISO date string when the invite expires (7 days from creation) | Yes |
| `acceptedAt` | String | ISO date string when the invite was accepted | No |
| `acceptedBy` | String | User ID of the person who accepted the invite | No |
| `createdAt` | String | ISO date string when the invite was created | Yes |
| `updatedAt` | String | ISO date string when the invite was last updated | Yes |

## Global Secondary Indexes (Recommended)

### GSI1: Project Invites
- **Partition Key**: `projectId`
- **Sort Key**: `createdAt`
- **Purpose**: Query all invites for a specific project

### GSI2: User Invites
- **Partition Key**: `invitedBy`
- **Sort Key**: `createdAt`
- **Purpose**: Query all invites sent by a specific user

### GSI3: Email Invites
- **Partition Key**: `email`
- **Sort Key**: `createdAt`
- **Purpose**: Query all invites for a specific email address

## Example Item

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@company.com",
  "invitedBy": "user-123",
  "projectId": "project-456",
  "status": "pending",
  "expiresAt": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-08T10:30:00.000Z",
  "updatedAt": "2024-01-08T10:30:00.000Z"
}
```

## Example Accepted Item

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@company.com",
  "invitedBy": "user-123",
  "projectId": "project-456",
  "status": "accepted",
  "expiresAt": "2024-01-15T10:30:00.000Z",
  "acceptedAt": "2024-01-10T14:20:00.000Z",
  "acceptedBy": "user-789",
  "createdAt": "2024-01-08T10:30:00.000Z",
  "updatedAt": "2024-01-10T14:20:00.000Z"
}
```

## TTL (Time To Live) - Optional

Consider adding a TTL attribute to automatically clean up expired invites:

```json
{
  "ttl": 1705320600
}
```

Where `ttl` is a Unix timestamp (seconds since epoch) set to the same value as `expiresAt`.

## Environment Variables Required

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

## CRUD Operations

The invite system uses your existing CRUD Lambda APIs with these operations:

### Create Invite
```javascript
POST /crud?tableName=project-management-invites
{
  "item": {
    "id": "uuid-token",
    "email": "user@example.com",
    "invitedBy": "user-123",
    "projectId": "project-456",
    "status": "pending",
    "expiresAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-08T10:30:00.000Z",
    "updatedAt": "2024-01-08T10:30:00.000Z"
  }
}
```

### Get Invite by Token
```javascript
GET /crud?tableName=project-management-invites&id=uuid-token
```

### Update Invite Status
```javascript
PUT /crud?tableName=project-management-invites&id=uuid-token
{
  "key": { "id": "uuid-token" },
  "updates": {
    "status": "accepted",
    "acceptedBy": "user-789",
    "acceptedAt": "2024-01-10T14:20:00.000Z",
    "updatedAt": "2024-01-10T14:20:00.000Z"
  }
}
```

### Delete/Cancel Invite
```javascript
DELETE /crud?tableName=project-management-invites&id=uuid-token
{
  "id": "uuid-token"
}
```

## Security Considerations

1. **Token Security**: UUIDs are used as tokens - they're unpredictable and hard to guess
2. **Email Validation**: Always validate email format on both frontend and backend
3. **Expiration**: Invites automatically expire after 7 days
4. **Rate Limiting**: Consider implementing rate limiting for invite creation
5. **Email Verification**: The system relies on email ownership for security
6. **Access Control**: Only project members should be able to send invites

## Integration with Existing Systems

This invite system integrates with:
- **AWS Cognito**: For user authentication
- **DynamoDB**: For data persistence using existing CRUD APIs
- **AWS SES**: For email delivery
- **Existing Project Management**: Seamlessly adds invite functionality to projects

