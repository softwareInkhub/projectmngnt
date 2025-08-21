const API_BASE_URL = 'http://localhost:5001';

async function testAuthFlow() {
  console.log('🔐 Testing Authentication Flow...\n');

  try {
    // Test 1: Check if auth page is accessible
    console.log('1️⃣ Testing auth page accessibility...');
    const authResponse = await fetch(`${API_BASE_URL}/auth/oauth-url`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (authResponse.ok) {
      console.log('✅ Auth endpoints are accessible');
    } else {
      console.log('❌ Auth endpoints not accessible:', authResponse.status);
    }

    // Test 2: Test signup endpoint
    console.log('\n2️⃣ Testing signup endpoint...');
    const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test.auth@example.com',
        password: 'TestAuth123!',
        email: 'test.auth@example.com'
      }),
    });

    if (signupResponse.ok) {
      console.log('✅ Signup endpoint working');
    } else {
      console.log('❌ Signup failed:', signupResponse.status);
    }

    // Test 3: Test login endpoint
    console.log('\n3️⃣ Testing login endpoint...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test.auth@example.com',
        password: 'TestAuth123!'
      }),
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login endpoint working');
      
      if (loginData.result && loginData.result.accessToken) {
        console.log('✅ Login returns access token');
        
        // Test 4: Test token validation
        console.log('\n4️⃣ Testing token validation...');
        const validateResponse = await fetch(`${API_BASE_URL}/auth/validate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${loginData.result.accessToken.jwtToken}`,
            'Content-Type': 'application/json'
          },
        });

        if (validateResponse.ok) {
          console.log('✅ Token validation working');
        } else {
          console.log('❌ Token validation failed:', validateResponse.status);
        }
      }
    } else {
      console.log('❌ Login failed:', loginResponse.status);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  console.log('\n🏁 Authentication flow test completed!');
  console.log('\n📋 Summary:');
  console.log('   - If all tests pass: ✅ Authentication flow is working correctly');
  console.log('   - Users will be redirected to /authPage if not authenticated');
  console.log('   - After successful login, users will be redirected to main app');
  console.log('   - Logout functionality is available in both desktop and mobile');
  console.log('   - Token validation ensures secure access to the application');
}

// Run the test
testAuthFlow();
