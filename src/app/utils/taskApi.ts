// ========================================
// OPTIMIZED TASK API SERVICE
// ========================================

import { apiService, ApiResponse } from './apiService';
import { TABLE_NAMES } from '../config/environment';

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
  parentId?: string | null; // New field for nested subtasks
  createdAt?: string;
  updatedAt?: string;
}

// Task Tree Node Interface for nested structure
export interface TaskTreeNode extends TaskData {
  children: TaskTreeNode[];
  level: number;
  isExpanded?: boolean;
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
  parentId?: string | null;
}

// Task API Service
export class TaskApiService {
  static async createTask(task: TaskData): Promise<ApiResponse<TaskData>> {
    // Ensure task has an ID
    const taskWithId = {
      ...task,
      id: task.id || `task-${Date.now()}`
    };
    
    return apiService.createItem<TaskData>(TABLE_NAMES.tasks, taskWithId);
  }

  static async getTasks(): Promise<ApiResponse<TaskData[]>> {
    return apiService.getItems<TaskData>(TABLE_NAMES.tasks);
  }

  static async getTaskById(id: string): Promise<ApiResponse<TaskData>> {
    return apiService.getItem<TaskData>(TABLE_NAMES.tasks, id);
  }

  static async updateTask(id: string, task: Partial<TaskData>): Promise<ApiResponse<TaskData>> {
    // Strip any UI-only fields defensively in case callers pass TaskTreeNode-like objects
    const { level, children, isExpanded, ...rest } = task as any;
    const safeUpdates: Partial<TaskData> = { ...rest };
    // Ensure id is not included in updates
    if ((safeUpdates as any).id !== undefined) {
      delete (safeUpdates as any).id;
    }

    return apiService.updateItem<TaskData>(TABLE_NAMES.tasks, id, safeUpdates);
  }

  static async deleteTask(id: string): Promise<ApiResponse<TaskData>> {
    return apiService.deleteItem<TaskData>(TABLE_NAMES.tasks, id);
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
    created: task.createdAt && typeof task.createdAt === 'string' ? task.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    lastActivity: "Just now",
    tags: task.tags && typeof task.tags === 'string' ? task.tags.split(',').filter((tag: string) => tag.trim() !== '') : [],
    subtasks: parsedSubtasks,
    parentId: task.parentId || null
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
    tags: Array.isArray(task.tags) ? task.tags.join(',') : '',
    subtasks: Array.isArray(task.subtasks) ? JSON.stringify(task.subtasks) : '[]',
    comments: task.comments !== undefined ? task.comments.toString() : '0',
    progress: task.progress,
    timeSpent: task.timeSpent,
    parentId: task.parentId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

// Tree building function to convert flat task list to nested tree structure
export function buildTaskTree(tasks: TaskData[]): TaskTreeNode[] {
  const taskMap = new Map<string, TaskTreeNode>();
  
  // Create map of all tasks with children array
  tasks.forEach(task => {
    // Preserve the original subtasks field for arrow detection
    taskMap.set(task.id!, {
      ...task,
      children: [],
      level: 0,
      isExpanded: false,
      // Ensure subtasks field is preserved
      subtasks: task.subtasks || ""
    });
  });
  
  const roots: TaskTreeNode[] = [];
  
  // Build tree structure
  tasks.forEach(task => {
    const node = taskMap.get(task.id!);
    if (!node) return;
    
    if (task.parentId && taskMap.has(task.parentId)) {
      // This is a child task
      const parent = taskMap.get(task.parentId);
      if (parent) {
        node.level = parent.level + 1;
        parent.children.push(node);
      }
    } else {
      // This is a root task
      roots.push(node);
    }
  });
  
  return roots;
}

// Function to get all descendants of a task (for circular reference validation)
export function getTaskDescendants(taskId: string, tasks: TaskData[]): string[] {
  const descendants: string[] = [];
  const taskMap = new Map<string, TaskData>();
  
  tasks.forEach(task => taskMap.set(task.id!, task));
  
  function collectDescendants(currentId: string) {
    tasks.forEach(task => {
      if (task.parentId === currentId) {
        descendants.push(task.id!);
        collectDescendants(task.id!);
      }
    });
  }
  
  collectDescendants(taskId);
  return descendants;
}

// Function to validate parent assignment and prevent circular references
export function validateParentAssignment(
  taskId: string, 
  newParentId: string | null, 
  tasks: TaskData[]
): { isValid: boolean; error?: string } {
  // Cannot assign to itself
  if (taskId === newParentId) {
    return { isValid: false, error: 'A task cannot be its own parent' };
  }
  
  // If no parent, it's valid
  if (!newParentId) {
    return { isValid: true };
  }
  
  // Check if new parent exists
  const parentExists = tasks.some(task => task.id === newParentId);
  if (!parentExists) {
    return { isValid: false, error: 'Parent task does not exist' };
  }
  
  // Check for circular references
  const descendants = getTaskDescendants(taskId, tasks);
  if (descendants.includes(newParentId)) {
    return { isValid: false, error: 'Cannot assign parent: would create circular reference' };
  }
  
  return { isValid: true };
}

// Function to get all possible parent tasks (excluding the current task and its descendants)
export function getAvailableParents(
  currentTaskId: string | null, 
  tasks: TaskData[]
): TaskData[] {
  if (!currentTaskId) {
    return tasks; // All tasks are available for root tasks
  }
  
  const descendants = getTaskDescendants(currentTaskId, tasks);
  return tasks.filter(task => 
    task.id !== currentTaskId && 
    !descendants.includes(task.id!)
  );
}

// Function to flatten tree back to array (useful for operations)
export function flattenTaskTree(tree: TaskTreeNode[]): TaskData[] {
  const result: TaskData[] = [];
  
  function traverse(node: TaskTreeNode) {
    const { children, level, isExpanded, ...taskData } = node;
    result.push(taskData);
    children.forEach(child => traverse(child));
  }
  
  tree.forEach(node => traverse(node));
  return result;
}

