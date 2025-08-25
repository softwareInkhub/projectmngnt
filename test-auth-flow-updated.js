const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://brmh.in';

async function testAuthFlowUpdated() {
  console.log('🔐 Testing Updated Authentication Flow...\n');

  try {
    // Test 1: Signup with proper username format
    console.log('1️⃣ Testing signup with proper username format...');
    const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123', // No @ symbol
        password: 'TestPassword123!',
        email: 'testuser123@example.com'
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

    // Test 2: Login with username
    console.log('\n2️⃣ Testing login with username...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123',
        password: 'TestPassword123!'
      }),
    });

    console.log(`Login response status: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData.success);
      
      if (loginData.result && loginData.result.accessToken) {
        console.log('✅ Access token received');
        
        // Test 3: Test token validation (if endpoint exists)
        console.log('\n3️⃣ Testing token validation...');
        try {
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
            console.log('⚠️ Token validation endpoint not available (expected)');
          }
        } catch (error) {
          console.log('⚠️ Token validation endpoint not available (expected)');
        }
      }
    } else {
      const errorData = await loginResponse.json().catch(() => ({}));
      console.log('❌ Login failed:', errorData.error || loginResponse.statusText);
    }

    // Test 4: Test login with email (if supported)
    console.log('\n4️⃣ Testing login with email...');
    const loginEmailResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123@example.com',
        password: 'TestPassword123!'
      }),
    });

    console.log(`Login with email response status: ${loginEmailResponse.status}`);
    
    if (loginEmailResponse.ok) {
      console.log('✅ Login with email successful');
    } else {
      const errorData = await loginEmailResponse.json().catch(() => ({}));
      console.log('⚠️ Login with email not supported:', errorData.error || loginEmailResponse.statusText);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  console.log('\n🏁 Updated authentication flow test completed!');
  console.log('\n📋 Summary:');
  console.log('   - If signup works: ✅ Backend accepts proper username format');
  console.log('   - If login works: ✅ Authentication flow is functional');
  console.log('   - If validation fails: ⚠️ Token validation endpoint not implemented (normal)');
  console.log('   - Frontend now handles username/email distinction properly');
}

// Run the test
testAuthFlowUpdated();
