// Team API service
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

    console.log('Creating new team with generated ID:', teamWithId.id);

    return makeRequest<TeamData>(`/crud?tableName=project-management-teams`, {
      method: 'POST',
      body: JSON.stringify({ item: teamWithId }),
    });
  }

  static async getTeams(): Promise<ApiResponse<TeamData[]>> {
    return makeRequest<TeamData[]>(`/crud?tableName=project-management-teams`, {
      method: 'GET',
    });
  }

  static async updateTeam(id: string, team: Partial<TeamData>): Promise<ApiResponse<TeamData>> {
    console.log('TeamApiService.updateTeam called with id:', id, 'team:', team);
    
    // Use proper UPDATE endpoint with UpdateCommand
    const updatePayload = {
      key: { id: id },
      updates: {
        ...team,
        updatedAt: new Date().toISOString()
      }
    };
    
    console.log('Update payload for UpdateCommand:', updatePayload);
    
    // Use UPDATE endpoint that uses DynamoDB UpdateCommand
    return makeRequest<TeamData>(`/crud?tableName=project-management-teams&action=update`, {
      method: 'POST',
      body: JSON.stringify(updatePayload),
    });
  }

  static async deleteTeam(id: string): Promise<ApiResponse<TeamData>> {
    return makeRequest<TeamData>(`/crud?tableName=project-management-teams&id=${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  }
}
