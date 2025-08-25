const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://brmh.in';

async function testAuthEndpoints() {
  console.log('🔐 Testing Authentication Endpoints...\n');

  try {
    // Test 1: Check if auth endpoints are accessible
    console.log('1️⃣ Testing auth endpoints accessibility...');
    
    const endpoints = [
      '/auth/signup',
      '/auth/login',
      '/auth/validate',
      '/auth/me'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.status === 405) {
          console.log(`✅ ${endpoint} - Method not allowed (expected for GET)`);
        } else if (response.status === 404) {
          console.log(`❌ ${endpoint} - Not found`);
        } else {
          console.log(`✅ ${endpoint} - Status: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint} - Error: ${error.message}`);
      }
    }

    // Test 2: Test signup endpoint
    console.log('\n2️⃣ Testing signup endpoint...');
    const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test.user@example.com',
        password: 'TestPassword123!',
        email: 'test.user@example.com'
      }),
    });

    console.log(`Signup response status: ${signupResponse.status}`);
    
    if (signupResponse.ok) {
      const signupData = await signupResponse.json();
      console.log('✅ Signup successful:', signupData.success);
    } else {
      const errorData = await signupResponse.json().catch(() => ({}));
      console.log('❌ Signup failed:', errorData.error || signupResponse.statusText);
    }

    // Test 3: Test login endpoint
    console.log('\n3️⃣ Testing login endpoint...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test.user@example.com',
        password: 'TestPassword123!'
      }),
    });

    console.log(`Login response status: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData.success);
      
      if (loginData.result && loginData.result.accessToken) {
        console.log('✅ Access token received');
        
        // Test 4: Test token validation
        console.log('\n4️⃣ Testing token validation...');
        const validateResponse = await fetch(`${API_BASE_URL}/auth/validate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${loginData.result.accessToken.jwtToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(`Token validation status: ${validateResponse.status}`);
        
        if (validateResponse.ok) {
          console.log('✅ Token validation successful');
        } else {
          console.log('❌ Token validation failed');
        }
      }
    } else {
      const errorData = await loginResponse.json().catch(() => ({}));
      console.log('❌ Login failed:', errorData.error || loginResponse.statusText);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  console.log('\n🏁 Authentication endpoints test completed!');
  console.log('\n📋 Summary:');
  console.log('   - If signup/login work: ✅ Backend authentication is properly configured');
  console.log('   - If endpoints return 404: ❌ Backend auth endpoints not implemented');
  console.log('   - If network errors: ❌ Check backend server connection');
}

// Run the test
testAuthEndpoints();
