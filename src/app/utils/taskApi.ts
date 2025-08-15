// Task API service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://54.85.164.84:5001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  // Additional properties from your API response
  items?: T[];
  count?: number;
  pagesFetched?: number;
}

async function makeRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Handle different response structures
    if (data.success !== undefined) {
      // Return the response as-is - let components handle the structure
      return data;
    } else {
      return { success: true, data };
    }
  } catch (error) {
    console.error('API request failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Task Data Interface
export interface TaskData {
  id?: string;
  title: string;
  description: string;
  project: string;
  assignee: string;
  status: string;
  priority: string;
  dueDate: string;
  startDate: string;
  estimatedHours?: number;
  tags: string;
  subtasks: string;
  comments: string;
  progress?: number;
  timeSpent?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Task with UI-specific fields
export interface TaskWithUI extends Omit<TaskData, 'tags' | 'subtasks' | 'comments'> {
  progress: number;
  timeSpent: string;
  estimatedTime: string;
  comments: number;
  likes: number;
  views: number;
  created: string;
  lastActivity: string;
  tags: string[];
  subtasks: { id: number; title: string; completed: boolean }[];
}

// Task API Service
export class TaskApiService {
  static async createTask(task: TaskData): Promise<ApiResponse<TaskData>> {
    // Ensure task has an ID
    const taskWithId = {
      ...task,
      id: task.id || `task-${Date.now()}`
    };
    
    return makeRequest<TaskData>('/crud?tableName=project-management-tasks', {
      method: 'POST',
      body: JSON.stringify({ item: taskWithId }),
    });
  }

  static async getTasks(): Promise<ApiResponse<TaskData[]>> {
    return makeRequest<TaskData[]>('/crud?tableName=project-management-tasks', {
      method: 'GET',
    });
  }

  static async updateTask(id: string, task: Partial<TaskData>): Promise<ApiResponse<TaskData>> {
    return makeRequest<TaskData>(`/crud?tableName=project-management-tasks&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        key: { id },
        updates: task 
      }),
    });
  }

  static async deleteTask(id: string): Promise<ApiResponse<TaskData>> {
    return makeRequest<TaskData>(`/crud?tableName=project-management-tasks&id=${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  }

  static async getTaskById(id: string): Promise<ApiResponse<TaskData>> {
    return makeRequest<TaskData>(`/crud?tableName=project-management-tasks&id=${id}`, {
      method: 'GET',
    });
  }
}

// Helper function to validate task data
export function validateTaskData(data: Partial<TaskData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push('Title is required');
  }

  if (!data.project?.trim()) {
    errors.push('Project is required');
  }

  if (!data.assignee?.trim()) {
    errors.push('Assignee is required');
  }

  if (!data.status?.trim()) {
    errors.push('Status is required');
  }

  if (!data.priority?.trim()) {
    errors.push('Priority is required');
  }

  // Email validation removed as TaskData doesn't have email field

  if (data.estimatedHours && (isNaN(data.estimatedHours) || data.estimatedHours < 0)) {
    errors.push('Estimated hours must be a positive number');
  }

  return { isValid: errors.length === 0, errors };
}

// Helper function to transform API task data to UI format
export function transformTaskToUI(task: TaskData): TaskWithUI {
  
  let parsedSubtasks = [];
  try {
    if (task.subtasks) {
      parsedSubtasks = JSON.parse(task.subtasks);
    }
  } catch (error) {
    console.warn('Failed to parse subtasks for task:', task.id, error);
    parsedSubtasks = [];
  }

  const estimatedHours = task.estimatedHours || 0;
  const transformedTask = {
    ...task,
    title: task.title || (task as any).name || 'Untitled Task',
    description: task.description || '',
    project: task.project || 'Default Project',
    assignee: task.assignee || 'Unassigned',
    status: task.status || 'To Do',
    priority: task.priority || 'Medium',
    dueDate: task.dueDate || new Date().toISOString().split('T')[0],
    startDate: task.startDate || new Date().toISOString().split('T')[0],
    estimatedHours: estimatedHours,
    progress: task.progress || 0,
    timeSpent: task.timeSpent || "0h",
    estimatedTime: estimatedHours ? `${estimatedHours}h` : "0h",
    comments: 0,
    likes: 0,
    views: 0,
    created: task.createdAt ? task.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    lastActivity: "Just now",
    tags: task.tags ? task.tags.split(',').filter((tag: string) => tag.trim() !== '') : [],
    subtasks: parsedSubtasks
  };
  
  return transformedTask;
}

// Helper function to transform UI task data to API format
export function transformUIToTask(task: TaskWithUI): TaskData {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    startDate: task.startDate,
    estimatedHours: task.estimatedHours,
    tags: task.tags.join(','),
    subtasks: JSON.stringify(task.subtasks),
    comments: task.comments.toString(),
    progress: task.progress,
    timeSpent: task.timeSpent,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

