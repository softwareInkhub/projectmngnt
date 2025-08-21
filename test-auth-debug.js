const API_BASE_URL = 'http://localhost:5001';

async function testAuthDebug() {
  console.log('🔍 Debugging Authentication Flow...\n');

  try {
    // Test 1: Check if backend is accessible
    console.log('1️⃣ Testing backend accessibility...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (healthResponse.ok) {
      console.log('✅ Backend is accessible');
    } else {
      console.log('❌ Backend health check failed:', healthResponse.status);
    }

    // Test 2: Test auth endpoints
    console.log('\n2️⃣ Testing auth endpoints...');
    
    // Test /auth/validate
    try {
      const validateResponse = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: 'test' }),
      });
      console.log(`✅ /auth/validate endpoint exists (${validateResponse.status})`);
    } catch (error) {
      console.log('❌ /auth/validate endpoint not available');
    }

    // Test /auth/me
    try {
      const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(`✅ /auth/me endpoint exists (${meResponse.status})`);
    } catch (error) {
      console.log('❌ /auth/me endpoint not available');
    }

    // Test /users
    try {
      const usersResponse = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(`✅ /users endpoint exists (${usersResponse.status})`);
    } catch (error) {
      console.log('❌ /users endpoint not available');
    }

    // Test 3: Test login endpoint
    console.log('\n3️⃣ Testing login endpoint...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test@example.com',
        password: 'TestPassword123!'
      }),
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login endpoint working');
      console.log('📋 Response structure:', Object.keys(loginData));
      
      if (loginData.result && loginData.result.accessToken) {
        console.log('✅ Login returns access token');
        console.log('🔑 Token structure:', Object.keys(loginData.result.accessToken));
      }
    } else {
      console.log('❌ Login endpoint failed:', loginResponse.status);
      const errorData = await loginResponse.text();
      console.log('📋 Error response:', errorData);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  console.log('\n🏁 Authentication debug test completed!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Check if backend is running on http://localhost:5001');
  console.log('   2. Verify auth endpoints are working');
  console.log('   3. Test login with real credentials');
  console.log('   4. Check browser console for frontend errors');
}

// Run the test
testAuthDebug();


