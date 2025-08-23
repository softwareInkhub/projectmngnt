// ========================================
// BACKEND CONNECTION TEST
// ========================================

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://brmh.in';

console.log('🔍 Testing Backend Connection...');
console.log(`📍 Backend URL: ${API_BASE_URL}`);
console.log('');

async function testBackendConnection() {
  const endpoints = [
    '/health',
    '/auth/oauth-url',
    '/crud?tableName=project-management-companies',
    '/users'
  ];

  for (const endpoint of endpoints) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔗 Testing: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout for faster testing
        signal: AbortSignal.timeout(5000)
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log(`   ✅ SUCCESS: Endpoint is accessible`);
      } else {
        console.log(`   ⚠️  WARNING: Endpoint returned ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`   ❌ TIMEOUT: Request took too long`);
      } else if (error.code === 'ENOTFOUND') {
        console.log(`   ❌ ERROR: Domain not found`);
      } else if (error.code === 'ECONNREFUSED') {
        console.log(`   ❌ ERROR: Connection refused`);
      } else {
        console.log(`   ❌ ERROR: ${error.message}`);
      }
    }
    
    console.log('');
  }
}

// Test the connection
testBackendConnection().then(() => {
  console.log('🏁 Backend connection test completed!');
  console.log('');
  console.log('📋 Summary:');
  console.log('- If you see ✅ SUCCESS: Endpoints are working');
  console.log('- If you see ❌ ERROR: Backend might not be ready yet');
  console.log('- If you see ⚠️  WARNING: Endpoint exists but might need authentication');
}).catch(error => {
  console.error('💥 Test failed:', error);
});
