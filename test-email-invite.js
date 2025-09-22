// ========================================
// TEST EMAIL INVITE FUNCTIONALITY
// ========================================

const { sendInviteEmail, sendTestEmail } = require('./src/app/utils/sendInviteEmail.ts');

async function testEmailInvite() {
  console.log('🧪 Testing Email Invite Functionality...\n');
  
  // Test 1: Send a test email
  console.log('1. Testing basic email sending...');
  try {
    const testResult = await sendTestEmail('test@example.com');
    if (testResult.success) {
      console.log('✅ Test email sent successfully');
    } else {
      console.log('❌ Test email failed:', testResult.error);
    }
  } catch (error) {
    console.log('❌ Test email error:', error.message);
  }
  
  console.log('\n2. Testing invite email...');
  try {
    const inviteResult = await sendInviteEmail({
      email: 'test@example.com',
      token: 'test-token-123',
      projectName: 'Test Project',
      inviterName: 'Test User',
      customMessage: 'This is a test invitation'
    });
    
    if (inviteResult.success) {
      console.log('✅ Invite email sent successfully');
    } else {
      console.log('❌ Invite email failed:', inviteResult.error);
    }
  } catch (error) {
    console.log('❌ Invite email error:', error.message);
  }
  
  console.log('\n📧 Email test completed!');
}

// Run the test
testEmailInvite().catch(console.error);
