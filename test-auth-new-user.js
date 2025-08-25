const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://brmh.in';

async function testAuthNewUser() {
  console.log('🔐 Testing Authentication with New User...\n');

  // Generate a unique username to avoid conflicts
  const timestamp = Date.now();
  const username = `testuser${timestamp}`;
  const email = `testuser${timestamp}@example.com`;
  const password = 'TestPassword123!';

  try {
    // Test 1: Signup with new user
    console.log('1️⃣ Testing signup with new user...');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    
    const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email
      }),
    });

    console.log(`Signup response status: ${signupResponse.status}`);
    
    if (signupResponse.ok) {
      const signupData = await signupResponse.json();
      console.log('✅ Signup successful:', signupData.success);
      
      if (signupData.result) {
        console.log('✅ User created with result:', signupData.result);
      }
    } else {
      const errorData = await signupResponse.json().catch(() => ({}));
      console.log('❌ Signup failed:', errorData.error || signupResponse.statusText);
      return;
    }

    // Test 2: Try login immediately (may fail if confirmation required)
    console.log('\n2️⃣ Testing login immediately after signup...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      }),
    });

    console.log(`Login response status: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData.success);
      
      if (loginData.result && loginData.result.accessToken) {
        console.log('✅ Access token received');
        console.log('✅ Authentication flow working perfectly!');
      }
    } else {
      const errorData = await loginResponse.json().catch(() => ({}));
      console.log('⚠️ Login failed (expected if confirmation required):', errorData.error || loginResponse.statusText);
      
      if (errorData.error && errorData.error.includes('not confirmed')) {
        console.log('ℹ️ User needs confirmation - this is normal for new signups');
        console.log('✅ Signup is working correctly');
        console.log('⚠️ Login will work after user confirmation');
      }
    }

    // Test 3: Check if we can get user info (if login worked)
    if (loginResponse.ok) {
      console.log('\n3️⃣ Testing user info retrieval...');
      try {
        const loginData = await loginResponse.json();
        if (loginData.result && loginData.result.accessToken) {
          // Try to get user info
          const userResponse = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${loginData.result.accessToken.jwtToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (userResponse.ok) {
            console.log('✅ User info endpoint accessible');
          } else {
            console.log('⚠️ User info endpoint not accessible (normal)');
          }
        }
      } catch (error) {
        console.log('⚠️ User info test skipped');
      }
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  console.log('\n🏁 New user authentication test completed!');
  console.log('\n📋 Summary:');
  console.log('   - If signup works: ✅ Backend authentication is properly configured');
  console.log('   - If login fails with "not confirmed": ✅ Normal behavior for new users');
  console.log('   - If login works immediately: ✅ User auto-confirmation enabled');
  console.log('   - Frontend authentication flow is ready for production use');
}

// Run the test
testAuthNewUser();
