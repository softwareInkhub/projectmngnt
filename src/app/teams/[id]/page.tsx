"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Target, 
  Clock, 
  Tag, 
  FileText, 
  CheckSquare, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Folder, 
  Building, 
  Users, 
  DollarSign, 
  TrendingUp, 
  MessageSquare, 
  Eye, 
  Heart, 
  MoreHorizontal, 
  Plus, 
  Search, 
  X, 
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Globe,
  Briefcase,
  Award,
  Star,
  Activity,
  BarChart3,
  PieChart,
  UserCheck,
  UserX,
  UserPlus,
  Settings,
  Zap,
  Target as TargetIcon,
  Users2,
  Crown,
  Shield,
  Trophy,
  Medal
} from 'lucide-react';
import { TeamApiService, TeamData, TeamWithUI, transformTeamToUI } from '../../utils/teamApi';
import { ProjectApiService } from '../../utils/projectApi';
import { TaskApiService, TaskData } from '../../utils/taskApi';
import { CompanyApiService, CompanyData } from '../../utils/companyApi';

// Status colors
const statusColors = {
  'Active': 'bg-green-100 text-green-700 border-green-200',
  'Inactive': 'bg-red-100 text-red-700 border-red-200',
  'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Suspended': 'bg-gray-100 text-gray-700 border-gray-200'
};

// Priority colors
const priorityColors = {
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Low': 'bg-green-100 text-green-700 border-green-200'
};

// Health colors
const healthColors = {
  'good': 'bg-green-100 text-green-700 border-green-200',
  'warning': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'critical': 'bg-red-100 text-red-700 border-red-200',
  'excellent': 'bg-blue-100 text-blue-700 border-blue-200'
};

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const [team, setTeam] = useState<TeamData | null>(null);
  const [teamUI, setTeamUI] = useState<TeamWithUI | null>(null);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDemoTeam, setIsDemoTeam] = useState(false);

  // Fetch team data
  const fetchTeam = useCallback(async () => {
    if (!teamId) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching team with ID:', teamId);
      const response = await TeamApiService.getTeam(teamId);
      
      console.log('Team API response:', response);

      if (response.success) {
        let teamData: TeamData | null = null;
        
        if (response.data) {
          teamData = response.data as TeamData;
        } else if ((response as any).item) {
          teamData = (response as any).item as TeamData;
        } else if (response.items && Array.isArray(response.items) && response.items.length > 0) {
          teamData = response.items[0] as TeamData;
        }

        if (teamData) {
          console.log('Found real team data:', teamData);
          setTeam(teamData);
          setTeamUI(transformTeamToUI(teamData));
        } else {
          console.log('No team data found in response, checking if team exists...');
          // Try to get all teams to see if this team exists
          const allTeamsResponse = await TeamApiService.getTeams();
          if (allTeamsResponse.success && allTeamsResponse.data) {
            const allTeams = Array.isArray(allTeamsResponse.data) ? allTeamsResponse.data : [];
            // Use string comparison for ID matching
            let foundTeam = allTeams.find(t => String(t.id) === String(teamId));
            
            // If teamId is a number (0, 1, 2, etc.), map it to the corresponding team by index
            if (!foundTeam && !isNaN(Number(teamId))) {
              const index = parseInt(teamId);
              if (index >= 0 && index < allTeams.length) {
                foundTeam = allTeams[index];
                console.log(`Team ID "${teamId}" mapped to team at index ${index}:`, foundTeam);
              } else {
                console.log(`Team ID "${teamId}" (index ${index}) is out of range. Available teams: ${allTeams.length}`);
              }
            }
            if (foundTeam) {
              console.log('Found team in all teams list:', foundTeam);
              setTeam(foundTeam);
              setTeamUI(transformTeamToUI(foundTeam));
            } else {
              // Create a demo team if no team is found
              console.log('No team found, creating demo team...');
              const demoTeam: TeamData = {
                id: teamId,
                name: `Demo Team ${teamId}`,
                description: 'This is a demo team created for testing purposes.',
                project: 'Demo Project',
                members: JSON.stringify([
                  { id: "member-1", name: 'Demo Member 1', role: 'Team Lead', status: 'Active', projects: 2 },
                  { id: "member-2", name: 'Demo Member 2', role: 'Developer', status: 'Active', projects: 1 },
                  { id: "member-3", name: 'Demo Member 3', role: 'Designer', status: 'Active', projects: 1 }
                ]),
                tasksCompleted: 8,
                totalTasks: 15,
                performance: 85,
                velocity: 75,
                health: 'good',
                budget: '$30,000',
                startDate: '2024-01-01',
                archived: false,
                tags: JSON.stringify(['demo', 'test']),
                achievements: JSON.stringify(['Demo Achievement']),
                lastActivity: 'Recently',
                department: 'Demo Department',
                manager: 'Demo Manager',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              setTeam(demoTeam);
              setTeamUI(transformTeamToUI(demoTeam));
              setIsDemoTeam(true);
            }
          } else {
            // Create a demo team if API fails
            console.log('API failed, creating demo team...');
            const demoTeam: TeamData = {
              id: teamId,
              name: `Demo Team ${teamId}`,
              description: 'This is a demo team created for testing purposes.',
              project: 'Demo Project',
              members: JSON.stringify([
                { id: "member-1", name: 'Demo Member 1', role: 'Team Lead', status: 'Active', projects: 2 },
                { id: "member-2", name: 'Demo Member 2', role: 'Developer', status: 'Active', projects: 1 },
                { id: "member-3", name: 'Demo Member 3', role: 'Designer', status: 'Active', projects: 1 }
              ]),
              tasksCompleted: 8,
              totalTasks: 15,
              performance: 85,
              velocity: 75,
              health: 'good',
              budget: '$30,000',
              startDate: '2024-01-01',
              archived: false,
              tags: JSON.stringify(['demo', 'test']),
              achievements: JSON.stringify(['Demo Achievement']),
              lastActivity: 'Recently',
              department: 'Demo Department',
              manager: 'Demo Manager',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setTeam(demoTeam);
            setTeamUI(transformTeamToUI(demoTeam));
            setIsDemoTeam(true);
          }
        }
      } else {
        throw new Error(response.error || 'Failed to fetch team');
      }
    } catch (err) {
      console.error('Error fetching team:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch team');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  // Fetch team's project
  const fetchTeamProject = useCallback(async () => {
    if (!team?.project) return;

    try {
      const response = await ProjectApiService.getProjects();
      if (response.success && response.data) {
        const allProjects = Array.isArray(response.data) ? response.data : [];
        const teamProject = allProjects.find(p => p.name === team.project);
        if (teamProject) {
          setProject(teamProject);
        }
      }
    } catch (error) {
      console.error('Error fetching team project:', error);
    }
  }, [team?.project]);

  // Fetch team's tasks
  const fetchTeamTasks = useCallback(async () => {
    if (!team?.project) return;

    try {
      const response = await TaskApiService.getTasks();
      if (response.success && response.data) {
        const allTasks = Array.isArray(response.data) ? response.data : [];
        // Filter tasks that belong to this team's project
        const teamTasks = allTasks.filter(t => t.project === team.project);
        setTasks(teamTasks);
      }
    } catch (error) {
      console.error('Error fetching team tasks:', error);
    }
  }, [team?.project]);

  // Fetch team's company (if project has company info)
  const fetchTeamCompany = useCallback(async () => {
    if (!project?.company) return;

    try {
      const response = await CompanyApiService.getCompanies();
      if (response.success && response.data) {
        const allCompanies = Array.isArray(response.data) ? response.data : [];
        const teamCompany = allCompanies.find(c => c.name === project.company);
        if (teamCompany) {
          setCompany(teamCompany);
        }
      }
    } catch (error) {
      console.error('Error fetching team company:', error);
    }
  }, [project?.company]);

  // Main data fetching effect
  useEffect(() => {
    fetchTeam();
  }, [teamId, fetchTeam]);

  // Fetch related data when team is loaded
  useEffect(() => {
    if (team) {
      fetchTeamProject();
      fetchTeamTasks();
    }
  }, [team, fetchTeamProject, fetchTeamTasks]);

  // Fetch company when project is loaded
  useEffect(() => {
    if (project) {
      fetchTeamCompany();
    }
  }, [project, fetchTeamCompany]);

  const handleBack = () => {
    router.back();
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getPriorityColor = (priority: string) => {
    return priorityColors[priority as keyof typeof priorityColors] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getHealthColor = (health: string) => {
    return healthColors[health as keyof typeof healthColors] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error && !team) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Team</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!team || !teamUI) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Team Not Found</h2>
          <p className="text-slate-600 mb-4">The team you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border-b border-green-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Team Details</h1>
                <p className="text-sm text-slate-500">View and manage team information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              {/* Team Header */}
              <div className="p-4 sm:p-6 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    <div className="min-w-0 flex-1">
                                             <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1 truncate">{team.name}</h2>
                       <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                         <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getHealthColor(team.health || 'good')}`}>
                           {team.health || 'Good'} Health
                         </span>
                         <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                           {team.department || 'General'}
                         </span>
                       </div>
                       {isDemoTeam && (
                         <p className="text-xs text-yellow-600 mt-1">
                           ⚠️ Demo team
                         </p>
                       )}
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">{team.description}</p>

                {/* Team Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{teamUI.members.length}</div>
                    <div className="text-xs text-slate-600">Members</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{tasks.length}</div>
                    <div className="text-xs text-slate-600">Tasks</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">{team.tasksCompleted}</div>
                    <div className="text-xs text-slate-600">Completed</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{team.performance}%</div>
                    <div className="text-xs text-slate-600">Performance</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-slate-200">
                <nav className="flex space-x-4 sm:space-x-6 lg:space-x-8 px-4 sm:px-6 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview', icon: FileText },
                    { id: 'members', label: 'Members', icon: Users },
                    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
                    { id: 'performance', label: 'Performance', icon: BarChart3 },
                    { id: 'analytics', label: 'Analytics', icon: PieChart }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Icon size={14} className="sm:w-4 sm:h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Team Information */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Team Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                              <Users size={12} className="sm:w-3.5 sm:h-3.5" />
                              Department
                            </label>
                            <p className="text-xs sm:text-sm text-slate-900">{team.department || 'General'}</p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                              <User size={12} className="sm:w-3.5 sm:h-3.5" />
                              Manager
                            </label>
                            <p className="text-xs sm:text-sm text-slate-900">{team.manager || 'Not assigned'}</p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                              <Target size={12} className="sm:w-3.5 sm:h-3.5" />
                              Project
                            </label>
                            <p className="text-xs sm:text-sm text-slate-900">{team.project || 'Not assigned'}</p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                              <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                              Start Date
                            </label>
                            <p className="text-xs sm:text-sm text-slate-900">{team.startDate || 'Not set'}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                              <DollarSign size={12} className="sm:w-3.5 sm:h-3.5" />
                              Budget
                            </label>
                            <p className="text-xs sm:text-sm text-slate-900">{team.budget || 'Not set'}</p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                              <Zap size={12} className="sm:w-3.5 sm:h-3.5" />
                              Velocity
                            </label>
                            <p className="text-xs sm:text-sm text-slate-900">{team.velocity || 0} points/week</p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                              <Activity size={12} className="sm:w-3.5 sm:h-3.5" />
                              Last Activity
                            </label>
                            <p className="text-xs sm:text-sm text-slate-900">{team.lastActivity || 'Recently'}</p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                              <Shield size={12} className="sm:w-3.5 sm:h-3.5" />
                              Health Status
                            </label>
                            <p className="text-xs sm:text-sm text-slate-900 capitalize">{team.health || 'Good'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {teamUI.tags.length > 0 && (
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-1 sm:gap-2">
                          <Tag size={12} className="sm:w-3.5 sm:h-3.5" />
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {teamUI.tags.map((tag, index) => (
                            <span
                              key={`team-tag-${index}`}
                              className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Achievements */}
                    {teamUI.achievements.length > 0 && (
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-1 sm:gap-2">
                          <Trophy size={12} className="sm:w-3.5 sm:h-3.5" />
                          Achievements
                        </h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {teamUI.achievements.map((achievement, index) => (
                            <span
                              key={`team-achievement-${index}`}
                              className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs"
                            >
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'members' && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Team Members</h3>
                    {teamUI.members.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {teamUI.members.map((member, index) => (
                          <div
                            key={member.id || index}
                            className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-xs sm:text-sm font-medium text-blue-600">
                                      {member.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-slate-900 truncate">{member.name}</h4>
                                    <p className="text-xs sm:text-sm text-slate-600">{member.role}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 ml-2">
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${getStatusColor(member.status)}`}>
                                    {member.status}
                                  </span>
                                  <span className="text-xs text-slate-600">
                                    {member.projects} projects
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8 text-slate-500">
                        <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-slate-300" />
                        <p className="text-sm sm:text-base">No members found</p>
                        <p className="text-xs sm:text-sm">This team has no members yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'tasks' && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Team Tasks</h3>
                    {tasks.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-slate-900 truncate">{task.title}</h4>
                                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{task.description}</p>
                                <div className="flex items-center gap-1 sm:gap-2 mt-2">
                                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                                    {task.status}
                                  </span>
                                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 ml-2">
                                <div className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                                  {task.assignee}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8 text-slate-500">
                        <CheckSquare className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-slate-300" />
                        <p className="text-sm sm:text-base">No tasks found</p>
                        <p className="text-xs sm:text-sm">This team has no tasks yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Team Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="p-3 sm:p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-900 mb-2 sm:mb-3 text-sm sm:text-base">Task Completion</h4>
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Completed</span>
                            <span>{team.tasksCompleted}</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Total</span>
                            <span>{team.totalTasks}</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Completion Rate</span>
                            <span>{team.totalTasks > 0 ? Math.round((team.tasksCompleted / team.totalTasks) * 100) : 0}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 sm:p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-900 mb-2 sm:mb-3 text-sm sm:text-base">Performance Metrics</h4>
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Performance</span>
                            <span>{team.performance}%</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Velocity</span>
                            <span>{team.velocity || 0} pts/week</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Health</span>
                            <span className="capitalize">{team.health || 'Good'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Team Analytics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="p-3 sm:p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-900 mb-2 sm:mb-3 text-sm sm:text-base">Task Status Distribution</h4>
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>To Do</span>
                            <span>{tasks.filter(t => t.status === 'To Do').length}</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>In Progress</span>
                            <span>{tasks.filter(t => t.status === 'In Progress').length}</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Done</span>
                            <span>{tasks.filter(t => t.status === 'Done').length}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 sm:p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-900 mb-2 sm:mb-3 text-sm sm:text-base">Member Activity</h4>
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Active Members</span>
                            <span>{teamUI.members.filter(m => m.status === 'Active').length}</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Total Members</span>
                            <span>{teamUI.members.length}</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Avg Projects/Member</span>
                            <span>{teamUI.members.length > 0 ? Math.round(teamUI.members.reduce((acc, m) => acc + m.projects, 0) / teamUI.members.length) : 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Quick Stats</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-slate-600">Total Members</span>
                    <span className="text-xs sm:text-sm font-medium text-slate-900">{teamUI.members.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-slate-600">Active Members</span>
                    <span className="text-xs sm:text-sm font-medium text-slate-900">
                      {teamUI.members.filter(m => m.status === 'Active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-slate-600">Total Tasks</span>
                    <span className="text-xs sm:text-sm font-medium text-slate-900">{tasks.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-slate-600">Completion Rate</span>
                    <span className="text-xs sm:text-sm font-medium text-slate-900">
                      {team.totalTasks > 0 ? Math.round((team.tasksCompleted / team.totalTasks) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Team Meta */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Team Meta</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Created</label>
                    <p className="text-xs sm:text-sm text-slate-900">{team.createdAt}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Last Updated</label>
                    <p className="text-xs sm:text-sm text-slate-900">{team.updatedAt}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Team ID</label>
                    <p className="text-xs sm:text-sm text-slate-900 font-mono break-all">{team.id}</p>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              {project && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Project Info</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Project Name</label>
                      <p className="text-xs sm:text-sm text-slate-900">{project.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                      <p className="text-xs sm:text-sm text-slate-900">{project.status}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Progress</label>
                      <p className="text-xs sm:text-sm text-slate-900">{project.progress}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

