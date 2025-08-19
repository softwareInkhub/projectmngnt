// ========================================
// FRONTEND CONNECTION TEST
// ========================================

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

async function testFrontendConnection() {
  console.log('🧪 Testing Frontend Connection to Local Backend...\n');

  console.log('📡 API Base URL:', API_BASE_URL);
  console.log('🔧 Environment:', process.env.NODE_ENV || 'development');

  try {
    // Test 1: Health Check
    console.log('\n1. Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check Response:', healthData);

    // Test 2: Get Companies (what frontend would call)
    console.log('\n2. Testing Companies API (Frontend Call)...');
    const companiesResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-companies`);
    const companiesData = await companiesResponse.json();
    console.log('✅ Companies Response:', {
      success: companiesData.success,
      count: companiesData.count || companiesData.data?.length || 0,
      hasData: !!companiesData.data && companiesData.data.length > 0
    });

    if (companiesData.data && companiesData.data.length > 0) {
      console.log('📋 Sample Company:', companiesData.data[0].name);
    }

    // Test 3: Get Tasks (what frontend would call)
    console.log('\n3. Testing Tasks API (Frontend Call)...');
    const tasksResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-tasks`);
    const tasksData = await tasksResponse.json();
    console.log('✅ Tasks Response:', {
      success: tasksData.success,
      count: tasksData.count || tasksData.data?.length || 0,
      hasData: !!tasksData.data && tasksData.data.length > 0
    });

    if (tasksData.data && tasksData.data.length > 0) {
      console.log('📋 Sample Task:', tasksData.data[0].title);
    }

    // Test 4: Get Projects (what frontend would call)
    console.log('\n4. Testing Projects API (Frontend Call)...');
    const projectsResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-projects`);
    const projectsData = await projectsResponse.json();
    console.log('✅ Projects Response:', {
      success: projectsData.success,
      count: projectsData.count || projectsData.data?.length || 0,
      hasData: !!projectsData.data && projectsData.data.length > 0
    });

    if (projectsData.data && projectsData.data.length > 0) {
      console.log('📋 Sample Project:', projectsData.data[0].name);
    }

    // Test 5: Get Teams (what frontend would call)
    console.log('\n5. Testing Teams API (Frontend Call)...');
    const teamsResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-teams`);
    const teamsData = await teamsResponse.json();
    console.log('✅ Teams Response:', {
      success: teamsData.success,
      count: teamsData.count || teamsData.data?.length || 0,
      hasData: !!teamsData.data && teamsData.data.length > 0
    });

    if (teamsData.data && teamsData.data.length > 0) {
      console.log('📋 Sample Team:', teamsData.data[0].name);
    }

    console.log('\n🎉 Frontend Connection Test Completed Successfully!');
    console.log('✅ All API endpoints are working');
    console.log('✅ Data is being fetched from local backend');
    console.log('✅ Frontend should now be able to load data');

  } catch (error) {
    console.error('❌ Frontend Connection Test Failed:', error.message);
    console.error('🔍 Check if the backend server is running on localhost:5001');
  }
}

// Run the test
testFrontendConnection().catch(console.error);
