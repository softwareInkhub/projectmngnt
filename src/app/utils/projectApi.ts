// ========================================
// OPTIMIZED PROJECT API SERVICE
// ========================================

import { apiService, ApiResponse } from './apiService';
import { TABLE_NAMES } from '../config/environment';

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
  // Add null/undefined check
  if (!project) {
    console.error('Project data is null or undefined');
    return {
      id: '',
      name: 'Project Not Found',
      description: 'This project could not be loaded.',
      company: '',
      status: 'Unknown',
      priority: 'Medium',
      startDate: '',
      endDate: '',
      budget: '',
      team: '',
      assignee: '',
      progress: 0,
      tasks: 0,
      tags: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

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

    return apiService.createItem<ProjectData>(TABLE_NAMES.projects, projectWithId);
  }

  static async getProjects(): Promise<ApiResponse<ProjectData[]>> {
    return apiService.getItems<ProjectData>(TABLE_NAMES.projects);
  }

  static async getProject(id: string): Promise<ApiResponse<ProjectData>> {
    return apiService.getItem<ProjectData>(TABLE_NAMES.projects, id);
  }

  static async updateProject(id: string, project: Partial<ProjectData>): Promise<ApiResponse<ProjectData>> {
    return apiService.updateItem<ProjectData>(TABLE_NAMES.projects, id, project);
  }

  static async deleteProject(id: string): Promise<ApiResponse<ProjectData>> {
    return apiService.deleteItem<ProjectData>(TABLE_NAMES.projects, id);
  }
}
