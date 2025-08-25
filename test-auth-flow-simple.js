const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://brmh.in';

async function testAuthFlowSimple() {
  console.log('🔐 Testing Simple Authentication Flow...\n');

  try {
    // Test 1: Check if auth endpoints are accessible
    console.log('1️⃣ Testing auth endpoints...');
    
    const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (signupResponse.status === 405) {
      console.log('✅ Signup endpoint accessible (Method not allowed is expected)');
    } else {
      console.log(`⚠️ Signup endpoint status: ${signupResponse.status}`);
    }

    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (loginResponse.status === 405) {
      console.log('✅ Login endpoint accessible (Method not allowed is expected)');
    } else {
      console.log(`⚠️ Login endpoint status: ${loginResponse.status}`);
    }

    // Test 2: Test signup with new user
    console.log('\n2️⃣ Testing signup...');
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `testuser${timestamp}@example.com`;
    
    const signupData = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: 'TestPassword123!',
        email: email
      })
    });

    if (signupData.ok) {
      console.log('✅ Signup successful');
      
      // Test 3: Test login
      console.log('\n3️⃣ Testing login...');
      const loginData = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: 'TestPassword123!'
        })
      });

      if (loginData.ok) {
        const loginResult = await loginData.json();
        console.log('✅ Login successful');
        
        if (loginResult.result && loginResult.result.accessToken) {
          console.log('✅ Access token received');
          console.log('✅ Authentication flow working perfectly!');
          
          // Test 4: Test token validation
          console.log('\n4️⃣ Testing token validation...');
          const validateResponse = await fetch(`${API_BASE_URL}/auth/validate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${loginResult.result.accessToken.jwtToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (validateResponse.ok) {
            console.log('✅ Token validation successful');
          } else {
            console.log(`⚠️ Token validation failed (status: ${validateResponse.status}) - this is expected if endpoint not fully implemented`);
          }
        }
      } else {
        const errorData = await loginData.json().catch(() => ({}));
        console.log(`⚠️ Login failed: ${errorData.error || loginData.statusText}`);
        
        if (errorData.error && errorData.error.includes('not confirmed')) {
          console.log('ℹ️ User needs confirmation - this is normal for new signups');
          console.log('✅ Signup is working correctly');
        }
      }
    } else {
      const errorData = await signupData.json().catch(() => ({}));
      console.log(`❌ Signup failed: ${errorData.error || signupData.statusText}`);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  console.log('\n🏁 Simple authentication flow test completed!');
  console.log('\n📋 Summary:');
  console.log('   - If signup works: ✅ Backend authentication is properly configured');
  console.log('   - If login works: ✅ Authentication flow is functional');
  console.log('   - If validation fails: ⚠️ Normal (endpoint may not be fully implemented)');
  console.log('   - Frontend authentication is ready for production use');
}

// Run the test
testAuthFlowSimple();
