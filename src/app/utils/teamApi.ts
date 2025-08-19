// ========================================
// OPTIMIZED TEAM API SERVICE
// ========================================

import { apiService, ApiResponse } from './apiService';
import { TABLE_NAMES } from '../config/environment';

// Team Member Interface
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  email: string;
  status: string;
  phone: string;
  skills: string[];
  experience: string;
  projects: number;
}

// Team Data Interface
export interface TeamData {
  id?: string;
  name: string;
  description: string;
  members: string; // JSON string of TeamMember[]
  project: string;
  tasksCompleted: number;
  totalTasks: number;
  performance: number;
  velocity: number;
  health: string;
  budget: string;
  startDate: string;
  archived: boolean;
  tags: string; // JSON string of string[]
  achievements: string; // JSON string of string[]
  lastActivity: string;
  department: string;
  manager: string;
  whatsappGroupId?: string;
  whatsappGroupName?: string;
  goals?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Team with UI-specific properties
export interface TeamWithUI extends Omit<TeamData, 'members' | 'tags' | 'achievements'> {
  members: TeamMember[];
  tags: string[];
  achievements: string[];
}

// Validation function for team data
export function validateTeamData(team: Partial<TeamData>): boolean {
  if (!team.name || team.name.trim() === '') {
    console.error('Team name is required');
    return false;
  }
  if (!team.description || team.description.trim() === '') {
    console.error('Team description is required');
    return false;
  }
  if (!team.project || team.project.trim() === '') {
    console.error('Project is required');
    return false;
  }
  // Department is optional, so we don't validate it
  return true;
}

// Transform team data for UI
export function transformTeamToUI(team: TeamData): TeamWithUI {
  let members: TeamMember[] = [];
  let tags: string[] = [];
  let achievements: string[] = [];

  try {
    if (team.members && typeof team.members === 'string') {
      members = JSON.parse(team.members);
    } else if (Array.isArray(team.members)) {
      members = team.members;
    }
  } catch (e) {
    console.warn('Failed to parse team members:', e);
    members = [];
  }

  try {
    if (team.tags && typeof team.tags === 'string') {
      tags = JSON.parse(team.tags);
    } else if (Array.isArray(team.tags)) {
      tags = team.tags;
    }
  } catch (e) {
    console.warn('Failed to parse team tags:', e);
    tags = [];
  }

  try {
    if (team.achievements && typeof team.achievements === 'string') {
      achievements = JSON.parse(team.achievements);
    } else if (Array.isArray(team.achievements)) {
      achievements = team.achievements;
    }
  } catch (e) {
    console.warn('Failed to parse team achievements:', e);
    achievements = [];
  }

  return {
    ...team,
    name: team.name || 'Untitled Team',
    description: team.description || '',
    members: members,
    project: team.project || '',
    tasksCompleted: team.tasksCompleted || 0,
    totalTasks: team.totalTasks || 0,
    performance: team.performance || 0,
    velocity: team.velocity || 0,
    health: team.health || 'good',
    budget: team.budget || '',
    startDate: team.startDate || '',
    archived: team.archived || false,
    tags: tags,
    achievements: achievements,
    lastActivity: team.lastActivity || 'Just now',
    department: team.department || '',
    manager: team.manager || '',
    whatsappGroupId: team.whatsappGroupId || '',
    whatsappGroupName: team.whatsappGroupName || '',
    goals: team.goals || '',
    notes: team.notes || '',
    createdAt: team.createdAt || new Date().toISOString(),
    updatedAt: team.updatedAt || new Date().toISOString()
  };
}

// Transform UI data for API
export function transformUIToTeam(team: TeamWithUI): TeamData {
  return {
    ...team,
    members: JSON.stringify(team.members || []),
    tags: JSON.stringify(team.tags || []),
    achievements: JSON.stringify(team.achievements || [])
  };
}

export class TeamApiService {
  static async createTeam(team: TeamData): Promise<ApiResponse<TeamData>> {
    if (!validateTeamData(team)) {
      return { success: false, error: 'Invalid team data' };
    }

    // For new teams, NEVER use an existing ID - always generate a new one
    const teamWithId = {
      ...team,
      id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Always generate new ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return apiService.createItem<TeamData>(TABLE_NAMES.teams, teamWithId);
  }

  static async getTeams(): Promise<ApiResponse<TeamData[]>> {
    return apiService.getItems<TeamData>(TABLE_NAMES.teams);
  }

  static async getTeam(id: string): Promise<ApiResponse<TeamData>> {
    return apiService.getItem<TeamData>(TABLE_NAMES.teams, id);
  }

  static async updateTeam(id: string, team: Partial<TeamData>): Promise<ApiResponse<TeamData>> {
    const updates = {
      ...team,
      updatedAt: new Date().toISOString()
    };
    
    return apiService.updateItem<TeamData>(TABLE_NAMES.teams, id, updates);
  }

  static async deleteTeam(id: string): Promise<ApiResponse<TeamData>> {
    return apiService.deleteItem<TeamData>(TABLE_NAMES.teams, id);
  }
}
