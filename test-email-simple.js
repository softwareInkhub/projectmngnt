// ========================================
// SIMPLE EMAIL TEST SCRIPT
// ========================================

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Load environment variables
require('dotenv').config();

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

async function testEmailSending() {
  console.log('🧪 Testing AWS SES Email Sending...\n');
  
  console.log('Environment check:');
  console.log('- AWS_REGION:', process.env.AWS_REGION || 'NOT SET');
  console.log('- AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET');
  console.log('- AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET');
  console.log('- FROM_EMAIL:', process.env.NEXT_PUBLIC_FROM_EMAIL || 'NOT SET');
  
  try {
    const command = new SendEmailCommand({
      Source: process.env.NEXT_PUBLIC_FROM_EMAIL || 'noreply@projectmngnt.com',
      Destination: {
        ToAddresses: ['test@example.com']
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
    
    console.log('\n📧 Sending test email...');
    const result = await sesClient.send(command);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.MessageId);
    
  } catch (error) {
    console.log('❌ Email sending failed:');
    console.log('Error:', error.message);
    
    if (error.name === 'MessageRejected') {
      console.log('\n💡 This might be because:');
      console.log('- The FROM_EMAIL is not verified in AWS SES');
      console.log('- The email address is not in the verified list');
      console.log('- AWS SES is in sandbox mode');
    }
    
    if (error.name === 'InvalidParameterValue') {
      console.log('\n💡 This might be because:');
      console.log('- Invalid email format');
      console.log('- Missing required parameters');
    }
  }
}

// Run the test
testEmailSending().catch(console.error);
