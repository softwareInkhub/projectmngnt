// ========================================
// TEST: BACKEND CONNECTIVITY CHECK
// ========================================

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://brmh.in";

console.log('🔍 Testing Backend Connectivity...\n');

async function testBackendConnectivity() {
  console.log(`🌐 Testing connection to: ${API_BASE_URL}/health`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    console.log('⏳ Making request...');
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📊 Response OK: ${response.ok}`);
    
    if (response.ok) {
      console.log('✅ Backend is ONLINE');
      console.log('   - Health endpoint responding');
      console.log('   - App should show online mode');
      console.log('   - No offline indicator should appear');
    } else {
      console.log('⚠️ Backend is OFFLINE');
      console.log('   - Health endpoint not responding properly');
      console.log('   - App should show offline mode');
      console.log('   - Offline indicator should appear');
    }
    
  } catch (error) {
    console.log('❌ Backend is OFFLINE');
    console.log('   - Error:', error instanceof Error ? error.message : 'Unknown error');
    console.log('   - App should show offline mode');
    console.log('   - Offline indicator should appear');
  }
}

// Run the test
testBackendConnectivity();
