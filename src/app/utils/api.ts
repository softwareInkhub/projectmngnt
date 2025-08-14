// API utility functions for task management

export interface TaskData {
  title: string;
  description?: string;
  project: string;
  assignee: string;
  status: string;
  priority: string;
  startDate: string;
  dueDate: string;
  estimatedHours?: number | null;
  tags?: string;
  subtasks?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API base URL with fallback options
const getApiBaseUrl = () => {
  // Check for environment variable first
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Use Vercel API in production (HTTPS by default)
  if (process.env.NODE_ENV === 'production') {
    // Temporarily use the old API until AWS credentials are set
    return 'http://54.85.164.84:5001/crud';
  }
  
  return 'http://54.85.164.84:5001/crud';
};

const API_BASE_URL = getApiBaseUrl();

export class TaskApiService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}?tableName=${endpoint}`;
      
      console.log('Making API request to:', url);
      console.log('Request options:', {
        method: options.method || 'GET',
        headers: options.headers,
        body: options.body
      });
      
      // Note: Using HTTP API from HTTPS page will cause mixed content error
      // This is a temporary solution until HTTPS is configured on the API server
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.text();
          console.log('Error response body:', errorData);
          errorMessage += ` - ${errorData}`;
        } catch (e) {
          console.log('Could not read error response body');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Success response:', data);
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async createTask(taskData: TaskData): Promise<ApiResponse> {
    // Generate a unique ID for the task
    const taskId = Date.now().toString();
    
    // Simplify the data structure for the API
    const simplifiedData = {
      id: taskId, // Add the required partition key
      title: taskData.title,
      description: taskData.description || '',
      project: taskData.project,
      assignee: taskData.assignee,
      status: taskData.status,
      priority: taskData.priority,
      startDate: taskData.startDate,
      dueDate: taskData.dueDate,
      estimatedHours: taskData.estimatedHours || 0,
      tags: taskData.tags || '',
      subtasks: taskData.subtasks || '',
      comments: taskData.comments || '',
      createdAt: taskData.createdAt,
      updatedAt: taskData.updatedAt
    };

    console.log('Sending simplified data to API:', simplifiedData);

    // Wrap the data in an 'item' property as required by the API
    const requestBody = {
      item: simplifiedData
    };

    console.log('Final request body:', requestBody);

    return this.makeRequest('project-management-tasks', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  static async getTasks(): Promise<ApiResponse> {
    return this.makeRequest('project-management-tasks', {
      method: 'GET',
    });
  }

  static async updateTask(taskId: string, taskData: Partial<TaskData>): Promise<ApiResponse> {
    return this.makeRequest(`project-management-tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  static async deleteTask(taskId: string): Promise<ApiResponse> {
    return this.makeRequest(`project-management-tasks/${taskId}`, {
      method: 'DELETE',
    });
  }
}

// Helper function to validate task data
export function validateTaskData(data: Partial<TaskData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push('Task title is required');
  }

  if (!data.project?.trim()) {
    errors.push('Project is required');
  }

  if (!data.assignee?.trim()) {
    errors.push('Assignee is required');
  }

  if (!data.startDate) {
    errors.push('Start date is required');
  }

  if (!data.dueDate) {
    errors.push('Due date is required');
  }

  if (data.startDate && data.dueDate && new Date(data.startDate) > new Date(data.dueDate)) {
    errors.push('Due date must be after start date');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
