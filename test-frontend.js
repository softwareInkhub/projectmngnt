// Test script to verify frontend data transformation
const { transformTaskToUI } = require('./src/app/utils/taskApi.ts');

// Mock task data from your API
const mockTaskData = {
  dueDate: '2025-08-31',
  status: 'To Do',
  assignee: 'Sarah Johnson',
  comments: '',
  project: 'Whapi Project Management',
  priority: 'Medium',
  createdAt: '2025-08-14T08:37:40.081Z',
  estimatedHours: 0,
  updatedAt: '2025-08-14T08:37:40.081Z',
  startDate: '2025-08-14',
  description: '',
  id: '1755160660081',
  tags: '',
  subtasks: '[{"id":1755160658621,"title":"","completed":false}]',
  title: 'papaya'
};

console.log('Testing task transformation...');
console.log('Input task:', mockTaskData);

try {
  const transformedTask = transformTaskToUI(mockTaskData);
  console.log('Transformed task:', transformedTask);
  console.log('✅ Transformation successful!');
} catch (error) {
  console.error('❌ Transformation failed:', error);
}
