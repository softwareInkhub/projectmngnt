// Test script for Project and Team API and DynamoDB integration
// Using global fetch (available in Node.js 18+)

const API_BASE_URL = 'http://localhost:5001';

async function testProjectTeamAPI() {
  console.log('🧪 Testing Project and Team API and DynamoDB Integration...\n');

  // Test 1: Health Check (skipped - external server)
  console.log('1. Skipping Health Check (external server)...');
  console.log('✅ Using external server at:', API_BASE_URL);

  // Test 2: Create Project
  console.log('\n2. Testing Project Creation...');
  try {
    const projectData = {
      id: 'test-project-' + Date.now(),
      name: 'Test Project - API Integration',
      description: 'This is a test project to verify DynamoDB integration',
      company: 'Test Company',
      status: 'Planning',
      priority: 'Medium',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: '$50,000',
      team: 'Test Team',
      assignee: 'Test User',
      progress: 0,
      tasks: 0,
      tags: JSON.stringify(['test', 'api', 'dynamodb']),
      notes: 'Testing the new API service'
    };

    const createResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: projectData })
    });

    const createData = await createResponse.json();
    console.log('📋 Project Creation Response:', createData);
    if (createData.success) {
      console.log('✅ Project Created Successfully');
      const projectId = createData.id || projectData.id;
      console.log('📝 Project ID:', projectId);

      // Test 3: Update Project
      console.log('\n3. Testing Project Update...');
      const updateData = {
        name: 'Updated Test Project',
        description: 'This project has been updated',
        status: 'In Progress',
        progress: 25,
        tasks: 5
      };

      const updateResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-projects&id=${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: { id: projectId },
          updates: updateData
        })
      });

      const updateDataResponse = await updateResponse.json();
      console.log('📋 Project Update Response:', updateDataResponse);
      if (updateDataResponse.success) {
        console.log('✅ Project Updated Successfully');
      } else {
        console.log('❌ Project Update Failed:', updateDataResponse.error);
      }

      // Test 4: Delete Project
      console.log('\n4. Testing Project Deletion...');
      const deleteResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-projects&id=${projectId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: projectId })
      });

      const deleteData = await deleteResponse.json();
      console.log('📋 Project Deletion Response:', deleteData);
      if (deleteData.success) {
        console.log('✅ Project Deleted Successfully');
      } else {
        console.log('❌ Project Deletion Failed:', deleteData.error);
      }
    } else {
      console.log('❌ Project Creation Failed:', createData.error);
    }
  } catch (error) {
    console.error('❌ Project Test Error:', error.message);
  }

  // Test 5: Create Team
  console.log('\n5. Testing Team Creation...');
  try {
    const teamData = {
      id: 'test-team-' + Date.now(),
      name: 'Test Team - API Integration',
      description: 'This is a test team to verify DynamoDB integration',
      members: JSON.stringify([
        {
          id: 1,
          name: 'John Doe',
          role: 'Team Lead',
          avatar: 'JD',
          email: 'john@company.com',
          status: 'Online',
          phone: '+1-555-0123',
          skills: ['React', 'TypeScript'],
          experience: '5 years',
          projects: 10
        },
        {
          id: 2,
          name: 'Jane Smith',
          role: 'Developer',
          avatar: 'JS',
          email: 'jane@company.com',
          status: 'Online',
          phone: '+1-555-0124',
          skills: ['Vue.js', 'JavaScript'],
          experience: '3 years',
          projects: 8
        }
      ]),
      project: 'Test Project',
      tasksCompleted: 0,
      totalTasks: 0,
      performance: 85,
      velocity: 80,
      health: 'good',
      budget: '$30K',
      startDate: '2024-01-01',
      archived: false,
      tags: JSON.stringify(['test', 'api', 'dynamodb']),
      achievements: JSON.stringify(['New Team']),
      lastActivity: 'Just now',
      department: 'Engineering',
      manager: 'John Doe',
      whatsappGroupId: 'test-group-1',
      whatsappGroupName: 'Test Team Group'
    };

    const createTeamResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: teamData })
    });

    const createTeamData = await createTeamResponse.json();
    console.log('📋 Team Creation Response:', createTeamData);
    if (createTeamData.success) {
      console.log('✅ Team Created Successfully');
      const teamId = createTeamData.id || teamData.id;
      console.log('📝 Team ID:', teamId);

      // Test 6: Update Team
      console.log('\n6. Testing Team Update...');
      const updateTeamData = {
        name: 'Updated Test Team',
        description: 'This team has been updated',
        performance: 90,
        velocity: 85,
        health: 'excellent',
        tasksCompleted: 5,
        totalTasks: 10
      };

      const updateTeamResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-teams&id=${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: { id: teamId },
          updates: updateTeamData
        })
      });

      const updateTeamDataResponse = await updateTeamResponse.json();
      console.log('📋 Team Update Response:', updateTeamDataResponse);
      if (updateTeamDataResponse.success) {
        console.log('✅ Team Updated Successfully');
      } else {
        console.log('❌ Team Update Failed:', updateTeamDataResponse.error);
      }

      // Test 7: Delete Team
      console.log('\n7. Testing Team Deletion...');
      const deleteTeamResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-teams&id=${teamId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: teamId })
      });

      const deleteTeamData = await deleteTeamResponse.json();
      console.log('📋 Team Deletion Response:', deleteTeamData);
      if (deleteTeamData.success) {
        console.log('✅ Team Deleted Successfully');
      } else {
        console.log('❌ Team Deletion Failed:', deleteTeamData.error);
      }
    } else {
      console.log('❌ Team Creation Failed:', createTeamData.error);
    }
  } catch (error) {
    console.error('❌ Team Test Error:', error.message);
  }

  // Test 8: Get All Projects
  console.log('\n8. Testing Get All Projects...');
  try {
    const getProjectsResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-projects`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const getProjectsData = await getProjectsResponse.json();
    console.log('📋 Get Projects Response:', {
      success: getProjectsData.success,
      count: getProjectsData.count,
      items: getProjectsData.items ? getProjectsData.items.length : 0
    });
    if (getProjectsData.success) {
      console.log('✅ Projects Retrieved Successfully');
      console.log('📊 Total Projects:', getProjectsData.count || getProjectsData.items?.length || 0);
    } else {
      console.log('❌ Get Projects Failed:', getProjectsData.error);
    }
  } catch (error) {
    console.error('❌ Get Projects Error:', error.message);
  }

  // Test 9: Get All Teams
  console.log('\n9. Testing Get All Teams...');
  try {
    const getTeamsResponse = await fetch(`${API_BASE_URL}/crud?tableName=project-management-teams`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const getTeamsData = await getTeamsResponse.json();
    console.log('📋 Get Teams Response:', {
      success: getTeamsData.success,
      count: getTeamsData.count,
      items: getTeamsData.items ? getTeamsData.items.length : 0
    });
    if (getTeamsData.success) {
      console.log('✅ Teams Retrieved Successfully');
      console.log('📊 Total Teams:', getTeamsData.count || getTeamsData.items?.length || 0);
    } else {
      console.log('❌ Get Teams Failed:', getTeamsData.error);
    }
  } catch (error) {
    console.error('❌ Get Teams Error:', error.message);
  }

  console.log('\n🎉 Project and Team API Testing Completed!');
}

// Run the test
testProjectTeamAPI().catch(console.error);



