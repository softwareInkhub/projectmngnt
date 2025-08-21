const API_BASE_URL = 'http://localhost:5001';

async function testUserSpecificFeatures() {
  console.log('👤 Testing User-Specific Features...\n');

  try {
    // Test 1: Create a test user
    console.log('1️⃣ Creating a test user...');
    const testUser = {
      name: 'John Smith',
      email: 'john.smith@example.com',
      password: 'TestPassword123!',
      role: 'Developer',
      department: 'Engineering',
      phone: '+1-555-0123',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    };

    const createResponse = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(testUser),
    });

    if (!createResponse.ok) {
      console.log('❌ Failed to create test user:', createResponse.status);
      return;
    }

    const createData = await createResponse.json();
    console.log('✅ Test user created successfully');
    console.log(`🆔 User ID: ${createData.user?.id || 'N/A'}`);

    // Test 2: Login with the test user
    console.log('\n2️⃣ Testing login with the test user...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: testUser.email,
        password: testUser.password
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    
    if (loginData.result && loginData.result.accessToken) {
      const token = loginData.result.accessToken.jwtToken;
      console.log('✅ Access token received');

      // Test 3: Test /auth/me endpoint
      console.log('\n3️⃣ Testing /auth/me endpoint...');
      const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (meResponse.ok) {
        const meData = await meResponse.json();
        console.log('✅ /auth/me endpoint working');
        console.log(`👤 User data: ${meData.user?.name || meData.name} (${meData.user?.email || meData.email})`);
      } else {
        console.log('❌ /auth/me endpoint failed:', meResponse.status);
        console.log('📝 Note: This endpoint might not exist in your backend');
      }

      // Test 4: Test user context functionality
      console.log('\n4️⃣ Testing user context functionality...');
      const usersResponse = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        const currentUser = usersData.users?.find((u: any) => u.email === testUser.email);
        
        if (currentUser) {
          console.log('✅ User context functionality working');
          console.log(`👤 Current user: ${currentUser.name} (${currentUser.role})`);
          console.log(`📧 Email: ${currentUser.email}`);
          console.log(`🏢 Department: ${currentUser.department}`);
          console.log(`📱 Phone: ${currentUser.phone}`);
          console.log(`📅 Join Date: ${currentUser.joinDate}`);
          console.log(`🟢 Status: ${currentUser.status}`);
        } else {
          console.log('❌ User not found in users list');
        }
      } else {
        console.log('❌ Failed to fetch users:', usersResponse.status);
      }

      // Test 5: Clean up - Delete the test user
      console.log('\n5️⃣ Cleaning up - Deleting test user...');
      const deleteResponse = await fetch(`${API_BASE_URL}/users/${createData.user?.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (deleteResponse.ok) {
        console.log('✅ Test user deleted successfully');
      } else {
        console.log('❌ Failed to delete test user:', deleteResponse.status);
      }
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  console.log('\n🏁 User-specific features test completed!');
  console.log('\n📋 Summary:');
  console.log('   - If all tests pass: ✅ User-specific features are working correctly');
  console.log('   - Users will see personalized data throughout the application');
  console.log('   - Dashboard shows personalized welcome messages');
  console.log('   - Settings page displays user-specific information');
  console.log('   - User context provides data to all components');
  console.log('   - Authentication flow stores user email for context');
}

// Run the test
testUserSpecificFeatures();
