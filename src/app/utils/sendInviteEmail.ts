// ========================================
// AWS SES EMAIL UTILITY FOR INVITES
// ========================================

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || ''
  }
});

export interface InviteEmailData {
  email: string;
  token: string;
  projectName?: string;
  inviterName?: string;
  customMessage?: string;
}

/**
 * Send invite email using AWS SES
 */
export async function sendInviteEmail(emailData: InviteEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const { email, token, projectName = 'Project', inviterName = 'Team Member', customMessage } = emailData;
    
    // Generate the invite link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myapp.com';
    const inviteLink = `${baseUrl}/accept-invite?token=${token}`;
    
    // Email template
    const subject = `You're invited to join ${projectName}`;
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Project Invitation</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .button:hover { background: #0056b3; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .highlight { background: #e3f2fd; padding: 15px; border-radius: 6px; border-left: 4px solid #2196f3; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 You're Invited!</h1>
              <p>Join ${projectName} and start collaborating</p>
            </div>
            
            <div class="content">
              <h2>Hello!</h2>
              <p><strong>${inviterName}</strong> has invited you to join <strong>${projectName}</strong> on our project management platform.</p>
              
              ${customMessage ? `
                <div class="highlight">
                  <strong>Personal Message:</strong><br>
                  "${customMessage}"
                </div>
              ` : ''}
              
              <p>Click the button below to accept your invitation and get started:</p>
              
              <div style="text-align: center;">
                <a href="${inviteLink}" class="button">Accept Invitation</a>
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Click the button above to accept your invitation</li>
                <li>If you don't have an account, you'll be guided through the signup process</li>
                <li>Once logged in, you'll automatically be added to the project</li>
                <li>Start collaborating with your team immediately!</li>
              </ul>
              
              <div class="highlight">
                <strong>⚠️ Important:</strong> This invitation will expire in 7 days. If you don't accept it by then, you'll need to request a new invitation.
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #007bff;">${inviteLink}</p>
            </div>
            
            <div class="footer">
              <p>This invitation was sent to ${email}</p>
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
              <p>© 2024 Project Management Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const textBody = `
      You're Invited to Join ${projectName}!
      
      Hello!
      
      ${inviterName} has invited you to join ${projectName} on our project management platform.
      
      ${customMessage ? `Personal Message: "${customMessage}"` : ''}
      
      To accept your invitation, click this link:
      ${inviteLink}
      
      What happens next?
      - Click the link above to accept your invitation
      - If you don't have an account, you'll be guided through the signup process
      - Once logged in, you'll automatically be added to the project
      - Start collaborating with your team immediately!
      
      Important: This invitation will expire in 7 days.
      
      This invitation was sent to ${email}
      If you didn't expect this invitation, you can safely ignore this email.
    `;
    
    // Send email command
    const command = new SendEmailCommand({
      Source: process.env.NEXT_PUBLIC_FROM_EMAIL || 'noreply@myapp.com',
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8'
          },
          Text: {
            Data: textBody,
            Charset: 'UTF-8'
          }
        }
      }
    });
    
    console.log('Sending invite email to:', email);
    const result = await sesClient.send(command);
    console.log('Email sent successfully:', result.MessageId);
    
    return { success: true };
    
  } catch (error) {
    console.error('Error sending invite email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

/**
 * Send a simple test email to verify SES configuration
 */
export async function sendTestEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const command = new SendEmailCommand({
      Source: process.env.NEXT_PUBLIC_FROM_EMAIL || 'noreply@myapp.com',
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Subject: {
          Data: 'Test Email from Project Management Platform',
          Charset: 'UTF-8'
        },
        Body: {
          Text: {
            Data: 'This is a test email to verify SES configuration.',
            Charset: 'UTF-8'
          }
        }
      }
    });
    
    await sesClient.send(command);
    return { success: true };
    
  } catch (error) {
    console.error('Error sending test email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send test email' 
    };
  }
}
