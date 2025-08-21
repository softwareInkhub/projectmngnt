// Test User Management API
const BASE_URL = 'http://localhost:5001';

async function testUserManagement() {
  console.log('🧪 Testing User Management API...\n');

  // Test 1: Get all users
  console.log('1. Testing GET /users');
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success:', data.users?.length || 0, 'users found');
    } else {
      console.log('❌ Failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 2: Create a new user
  console.log('\n2. Testing POST /users');
  try {
    const newUser = {
      name: 'Test User',
      email: 'test.user@company.com',
      password: 'password123',
      role: 'Developer',
      department: 'Engineering',
      phone: '+1-555-0127',
      companyId: '1',
      teamId: '1'
    };

    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newUser),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success: User created with ID:', data.user?.id);
      return data.user?.id; // Return for next tests
    } else {
      const errorData = await response.json();
      console.log('❌ Failed:', response.status, errorData.message || response.statusText);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 3: Update user role
  console.log('\n3. Testing PATCH /users/{id}/role');
  try {
    const userId = '1'; // Use existing user ID
    const response = await fetch(`${BASE_URL}/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ role: 'Manager' }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success: Role updated to', data.user?.role);
    } else {
      const errorData = await response.json();
      console.log('❌ Failed:', response.status, errorData.message || response.statusText);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 4: Get specific user
  console.log('\n4. Testing GET /users/{id}');
  try {
    const userId = '1';
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success: User found:', data.user?.name);
    } else {
      const errorData = await response.json();
      console.log('❌ Failed:', response.status, errorData.message || response.statusText);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n🏁 User Management API tests completed!');
}

// Run tests
testUserManagement().catch(console.error);
