// Project API service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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

// Project Data Interface
export interface ProjectData {
  id?: string;
  name: string;
  description?: string;
  company: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  budget: string;
  team: string;
  assignee: string;
  progress: number;
  tasks: number;
  tags: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Project with UI-specific properties
export interface ProjectWithUI extends Omit<ProjectData, 'tags'> {
  tags: string[];
}

// Validation function for project data
export function validateProjectData(project: Partial<ProjectData>): boolean {
  if (!project.name || project.name.trim() === '') {
    console.error('Project name is required');
    return false;
  }
  // Make description optional - provide default if empty
  if (!project.description) {
    project.description = 'No description provided';
  }
  if (!project.company || project.company.trim() === '') {
    console.error('Company is required');
    return false;
  }
  if (!project.status || project.status.trim() === '') {
    console.error('Status is required');
    return false;
  }
  if (!project.priority || project.priority.trim() === '') {
    console.error('Priority is required');
    return false;
  }
  return true;
}

// Transform project data for UI
export function transformProjectToUI(project: ProjectData): ProjectWithUI {
  let tags: string[] = [];
  try {
    if (project.tags && typeof project.tags === 'string') {
      tags = JSON.parse(project.tags);
    } else if (Array.isArray(project.tags)) {
      tags = project.tags;
    }
  } catch (e) {
    console.warn('Failed to parse project tags:', e);
    tags = [];
  }

  return {
    ...project,
    name: project.name || 'Untitled Project',
    description: project.description || '',
    company: project.company || '',
    status: project.status || 'Planning',
    priority: project.priority || 'Medium',
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    budget: project.budget || '',
    team: project.team || '',
    assignee: project.assignee || '',
    progress: project.progress || 0,
    tasks: project.tasks || 0,
    tags: tags,
    notes: project.notes || '',
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: project.updatedAt || new Date().toISOString()
  };
}

// Transform UI data for API
export function transformUIToProject(project: ProjectWithUI): ProjectData {
  return {
    ...project,
    tags: JSON.stringify(project.tags || [])
  };
}

export class ProjectApiService {
  static async createProject(project: ProjectData): Promise<ApiResponse<ProjectData>> {
    if (!validateProjectData(project)) {
      return { success: false, error: 'Invalid project data' };
    }

    // Generate ID if not provided
    const projectWithId = {
      ...project,
      id: project.id || `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return makeRequest<ProjectData>(`/crud?tableName=project-management-projects`, {
      method: 'POST',
      body: JSON.stringify({ item: projectWithId }),
    });
  }

  static async getProjects(): Promise<ApiResponse<ProjectData[]>> {
    return makeRequest<ProjectData[]>(`/crud?tableName=project-management-projects`, {
      method: 'GET',
    });
  }

  static async updateProject(id: string, project: Partial<ProjectData>): Promise<ApiResponse<ProjectData>> {
    return makeRequest<ProjectData>(`/crud?tableName=project-management-projects&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        key: { id }, // Changed to match external API expectation
        updates: project
      }),
    });
  }

  static async deleteProject(id: string): Promise<ApiResponse<ProjectData>> {
    return makeRequest<ProjectData>(`/crud?tableName=project-management-projects&id=${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  }
}
