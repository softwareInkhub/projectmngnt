const API_BASE_URL = 'http://localhost:5001';

async function testUserIntegration() {
  console.log('🧪 Testing User Integration with project-management-users table...\n');

  try {
    // Test 1: Get all users
    console.log('1️⃣ Testing GET /users...');
    const usersResponse = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log('✅ Users fetched successfully');
      console.log(`📊 Found ${usersData.users?.length || 0} users in database`);
      if (usersData.users && usersData.users.length > 0) {
        console.log('👥 Sample users:');
        usersData.users.slice(0, 3).forEach(user => {
          console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
        });
      }
    } else {
      console.log('❌ Failed to fetch users:', usersResponse.status, usersResponse.statusText);
    }

    // Test 2: Create a test user
    console.log('\n2️⃣ Testing POST /users (create user)...');
    const testUser = {
      name: 'Test User',
      email: 'test.user@example.com',
      password: 'TestPassword123!',
      role: 'Developer',
      department: 'Engineering',
      phone: '+1-555-0123',
      status: 'Active'
    };

    const createResponse = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(testUser),
    });

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ Test user created successfully');
      console.log(`🆔 User ID: ${createData.user?.id || 'N/A'}`);
      
      // Test 3: Update the test user
      console.log('\n3️⃣ Testing PUT /users/{id} (update user)...');
      const updateData = {
        id: createData.user?.id,
        name: 'Updated Test User',
        role: 'Manager'
      };

      const updateResponse = await fetch(`${API_BASE_URL}/users/${createData.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (updateResponse.ok) {
        console.log('✅ Test user updated successfully');
      } else {
        console.log('❌ Failed to update user:', updateResponse.status);
      }

      // Test 4: Delete the test user
      console.log('\n4️⃣ Testing DELETE /users/{id} (delete user)...');
      const deleteResponse = await fetch(`${API_BASE_URL}/users/${createData.user?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (deleteResponse.ok) {
        console.log('✅ Test user deleted successfully');
      } else {
        console.log('❌ Failed to delete user:', deleteResponse.status);
      }
    } else {
      console.log('❌ Failed to create test user:', createResponse.status, createResponse.statusText);
    }

    // Test 5: Test auth endpoints
    console.log('\n5️⃣ Testing auth endpoints...');
    
    // Test signup
    const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'auth.test@example.com',
        password: 'AuthTest123!',
        email: 'auth.test@example.com'
      }),
    });

    if (signupResponse.ok) {
      console.log('✅ Auth signup endpoint working');
    } else {
      console.log('❌ Auth signup failed:', signupResponse.status);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  console.log('\n🏁 User integration test completed!');
  console.log('\n📋 Summary:');
  console.log('   - If all tests pass: ✅ Backend is properly connected to project-management-users table');
  console.log('   - If tests fail: ❌ Check backend configuration and database connection');
  console.log('   - Mock data has been removed from frontend components');
  console.log('   - Real users from signup/auth will now appear in admin panel and webapp');
}

// Run the test
testUserIntegration();
