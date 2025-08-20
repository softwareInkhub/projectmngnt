"use client";
import {
  FolderKanban,
  Plus,
  X,
  BarChart3,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  Circle,
  Users,
  CheckSquare,
  Calendar,
  Zap,
  Building2,
  ChevronDown,
  ChevronRight,
  Building,
  BookOpen,
  User,
  Download,
  CalendarDays,
  Play,
  BarChart3 as BarChart3Icon,
  PieChart,
  LineChart,
  Filter,
  Star,
  UserCheck,
  UserPlus,
  TrendingUp,
  FolderOpen
} from "lucide-react";
import { useState, useEffect } from "react";
import { CompanyApiService, CompanyData } from "../utils/companyApi";
import { TaskApiService, TaskData } from "../utils/taskApi";
import { ProjectApiService, ProjectData } from "../utils/projectApi";
import { TeamApiService, TeamData } from "../utils/teamApi";

// Interface for company structure in the sidebar
interface CompanySidebarData {
  id: number;
  name: string;
  expanded: boolean;
  sections: {
    projects: { expanded: boolean };
    departments: { expanded: boolean; subdepartments: string[] };
    teams: { expanded: boolean; subteams: string[] };
    sprints: { expanded: boolean };
    calendar: { expanded: boolean };
    stories: { expanded: boolean; substories: string[] };
    tasks: { expanded: boolean; subtasks: string[] };
  };
}

// Interface for task structure in the sidebar
interface TaskSidebarData {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  project: string;
  expanded: boolean;
}

// Mock data for calendar events
const allCalendarEvents = [
  {
    id: 1,
    title: "Sprint Planning Meeting",
    description: "Plan tasks and assign responsibilities for the upcoming sprint",
    date: "2024-02-15",
    time: "10:00 AM",
    duration: "2 hours"
  },
  {
    id: 2,
    title: "Code Review Session",
    description: "Review pull requests and discuss implementation details",
    date: "2024-02-16",
    time: "2:00 PM",
    duration: "1 hour"
  }
];

// Mock data for reports
const allReports = [
  {
    id: 1,
    title: "Project Performance Report",
    description: "Comprehensive analysis of project metrics and KPIs",
    status: "Published",
    author: "Sarah Johnson"
  },
  {
    id: 2,
    title: "Team Productivity Analysis",
    description: "Detailed breakdown of team performance and productivity trends",
    status: "Draft",
    author: "Mike Chen"
  }
];

interface ContextSidebarProps {
  activeTab: number;
  isMobile: boolean;
  isMobileOpen: boolean;
  onMobileClose?: () => void;
  onClose?: () => void;
  onOpenTab?: (tab: string) => void;
}

export default function ContextSidebar({
  activeTab,
  isMobile,
  isMobileOpen,
  onMobileClose,
  onClose,
  onOpenTab
}: ContextSidebarProps) {
  const [companiesList, setCompaniesList] = useState<CompanyData[]>([]);
  const [tasksList, setTasksList] = useState<TaskData[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectData[]>([]);
  const [teamsList, setTeamsList] = useState<TeamData[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
  const [expandedTeams, setExpandedTeams] = useState<number[]>([]);

  // Fallback data
  const fallbackCompanies = [
    { id: "1", name: "TechCorp", industry: "Technology", status: "Active", employees: 150, location: "San Francisco", founded: "2018", website: "techcorp.com", description: "Leading technology solutions provider", size: "Medium" },
    { id: "2", name: "InnovateLab", industry: "Research", status: "Active", employees: 75, location: "Boston", founded: "2020", website: "innovatelab.com", description: "Cutting-edge research and development", size: "Small" }
  ];

  const fallbackTasks = [
    { id: "1", title: "Design System Implementation", status: "In Progress", priority: "High", assignee: "Sarah Johnson", project: "UI/UX Redesign", expanded: false },
    { id: "2", title: "API Integration Testing", status: "To Do", priority: "Medium", assignee: "Mike Chen", project: "Backend Development", expanded: false },
    { id: "3", title: "Database Optimization", status: "Done", priority: "Low", assignee: "Alex Rodriguez", project: "Performance Improvement", expanded: false }
  ];

  const fallbackProjects = [
    { id: "1", name: "E-commerce Platform", status: "In Progress", description: "Modern e-commerce solution", startDate: "2024-01-15", endDate: "2024-06-30", budget: 50000, manager: "Sarah Johnson" },
    { id: "2", name: "Mobile App Development", status: "Planning", description: "Cross-platform mobile application", startDate: "2024-03-01", endDate: "2024-08-31", budget: 75000, manager: "Mike Chen" }
  ];

  const fallbackTeams = [
    { id: "1", name: "Frontend Team", members: ["Sarah Johnson", "Alex Rodriguez"], project: "E-commerce Platform", health: "excellent", budget: "On Track", performance: 95, startDate: "2024-01-15", tasksCompleted: 12, totalTasks: 15, description: "Responsible for user interface development" },
    { id: "2", name: "Backend Team", members: ["Mike Chen", "David Kim"], project: "Mobile App", health: "good", budget: "Under Budget", performance: 88, startDate: "2024-02-01", tasksCompleted: 8, totalTasks: 12, description: "Handles server-side logic and APIs" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch companies
      setIsLoadingCompanies(true);
      const response = await CompanyApiService.getCompanies();
        if (response.success && response.data) {
          setCompaniesList(response.data);
        } else {
          setCompaniesList(fallbackCompanies as any);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
        setCompaniesError('Failed to load companies');
        setCompaniesList(fallbackCompanies as any);
    } finally {
      setIsLoadingCompanies(false);
    }

    try {
        // Fetch tasks
      setIsLoadingTasks(true);
      const response = await TaskApiService.getTasks();
        if (response.success && response.data) {
          setTasksList(response.data as any);
        } else {
          setTasksList(fallbackTasks as any);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
        setTasksError('Failed to load tasks');
        setTasksList(fallbackTasks as any);
    } finally {
      setIsLoadingTasks(false);
    }

    try {
        // Fetch projects
      setIsLoadingProjects(true);
      const response = await ProjectApiService.getProjects();
        if (response.success && response.data) {
          setProjectsList(response.data as any);
        } else {
          setProjectsList(fallbackProjects as any);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
        setProjectsError('Failed to load projects');
        setProjectsList(fallbackProjects as any);
    } finally {
      setIsLoadingProjects(false);
    }

    try {
        // Fetch teams
      setIsLoadingTeams(true);
      const response = await TeamApiService.getTeams();
        if (response.success && response.data) {
          setTeamsList(response.data as any);
        } else {
          setTeamsList(fallbackTeams as any);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
        setTeamsError('Failed to load teams');
        setTeamsList(fallbackTeams as any);
    } finally {
      setIsLoadingTeams(false);
    }
  };

    fetchData();
  }, []);

  const toggleTask = (taskId: number) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleTeam = (teamId: number) => {
    setExpandedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  // Mobile context sidebar - Enhanced
  if (isMobile) {
    return (
      <aside className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onMobileClose || onClose}
          style={{ zIndex: 49 }}
        />
        
        {/* Sidebar Content */}
        <div className="absolute right-0 h-full w-64 max-w-[75vw] bg-white shadow-2xl flex flex-col" style={{ zIndex: 50 }}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">C</span>
              </div>
              <div>
                <h2 className="text-xs font-semibold text-gray-900">Context</h2>
                <p className="text-xs text-gray-500">Quick actions</p>
              </div>
            </div>
          <button 
            onClick={onMobileClose || onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 relative z-10"
              style={{ zIndex: 51 }}
          >
              <X size={16} />
          </button>
        </div>
        
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {activeTab === 1 && (
              // Projects context
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Projects Overview</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Projects</div>
                      <div className="text-sm font-semibold">{projectsList.length}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Tasks</div>
                      <div className="text-sm font-semibold">{tasksList.length}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Teams</div>
                      <div className="text-sm font-semibold">{teamsList.length}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Companies</div>
                      <div className="text-sm font-semibold">{(companiesList.length || fallbackCompanies.length)}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-blue-50 text-blue-700 rounded-lg p-2 text-xs font-medium hover:bg-blue-100 transition-colors" onClick={() => onOpenTab?.('create-project')}>+ Project</button>
                    <button className="bg-green-50 text-green-700 rounded-lg p-2 text-xs font-medium hover:bg-green-100 transition-colors" onClick={() => onOpenTab?.('create-task')}>+ Task</button>
                    <button className="bg-purple-50 text-purple-700 rounded-lg p-2 text-xs font-medium hover:bg-purple-100 transition-colors" onClick={() => onOpenTab?.('create-team')}>+ Team</button>
                    <button className="bg-gray-50 text-gray-700 rounded-lg p-2 text-xs font-medium hover:bg-gray-100 transition-colors" onClick={() => onOpenTab?.('projects')}>All Projects</button>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Projects</h3>
                  <div className="space-y-2">
                    {projectsList.slice(0,3).map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <FolderOpen size={12} className="text-blue-600" />
                        <div className="text-xs flex-1 truncate">{p.name}</div>
                      </div>
                    ))}
                    {projectsList.length === 0 && (
                      <div className="text-xs text-gray-500">No recent items</div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
          {activeTab === 2 && (
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Task Filters</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-gray-700 text-xs font-medium hover:bg-gray-100 transition-colors">
                    <CheckSquare size={12} />
                    All Tasks
                  </button>
                    <button className="w-full flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-gray-700 text-xs font-medium hover:bg-gray-100 transition-colors">
                    <Star size={12} />
                    Favorites
                  </button>
                </div>
              </div>
              
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Tasks</h3>
                  <div className="space-y-2">
                    {tasksList.slice(0,3).map((task, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <CheckSquare size={12} className="text-green-600" />
                        <div className="text-xs flex-1 truncate">{task.title}</div>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === "Done" ? "bg-green-100 text-green-700" :
                          task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                    {tasksList.length === 0 && (
                      <div className="text-xs text-gray-500">No recent tasks</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Team Overview</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Active Teams</div>
                      <div className="text-sm font-semibold">{teamsList.length}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Total Members</div>
                      <div className="text-sm font-semibold">{teamsList.reduce((acc, team) => acc + team.members.length, 0)}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Teams</h3>
                  <div className="space-y-2">
                    {teamsList.slice(0,3).map((team, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <Users size={12} className="text-purple-600" />
                        <div className="text-xs flex-1 truncate">{team.name}</div>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          team.health === 'excellent' ? 'bg-green-100 text-green-700' :
                          team.health === 'good' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {team.health}
                        </span>
                      </div>
                    ))}
                    {teamsList.length === 0 && (
                      <div className="text-xs text-gray-500">No recent teams</div>
                    )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 4 && (
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Company Overview</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Total Companies</div>
                      <div className="text-sm font-semibold">{(companiesList.length || fallbackCompanies.length)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Active</div>
                      <div className="text-sm font-semibold">{(companiesList.length || fallbackCompanies.length)}</div>
                    </div>
                  </div>
              </div>
              
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Companies</h3>
                  <div className="space-y-2">
                    {(companiesList.length > 0 ? companiesList : fallbackCompanies).slice(0,3).map((company, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <Building2 size={12} className="text-blue-600" />
                        <div className="text-xs flex-1 truncate">{company.name}</div>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          company.status === "Active" ? "bg-green-100 text-green-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {company.status}
                        </span>
                      </div>
                    ))}
                    </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-2 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-700 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-900">Actions</div>
                <div className="text-xs text-gray-500">Quick access</div>
              </div>
              <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                <Plus size={12} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Desktop sidebar
  return (
    <>
      {(activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4 || activeTab === 5 || activeTab === 6) && (
        <aside className="sticky top-0 h-screen w-[320px] bg-white border-r border-neutral-200 flex flex-col overflow-y-auto z-20">
          {/* Header */}
          <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">
              {activeTab === 1 ? "All Projects" : 
               activeTab === 2 ? "All Tasks" : 
               activeTab === 3 ? "All Teams" : 
               activeTab === 4 ? "Companies" : 
               activeTab === 5 ? "Calendar Events" : 
               activeTab === 6 ? "All Reports" : "Context"}
            </h2>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded hover:bg-blue-100 text-blue-600" aria-label="Add Item">
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
            {/* Projects Tab */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Project Overview</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Total Projects</div>
                      <div className="text-sm font-semibold">{(projectsList.length || fallbackProjects.length)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Active</div>
                      <div className="text-sm font-semibold">{(projectsList.filter((p: any) => p.status === 'In Progress').length)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Projects</h3>
                  <div className="space-y-2">
                    {(projectsList.length > 0 ? projectsList : fallbackProjects).slice(0,3).map((project, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <FolderKanban size={12} className="text-blue-600" />
                        <div className="text-xs flex-1 truncate">{project.name}</div>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === "In Progress" ? "bg-green-100 text-green-700" :
                          project.status === "Planning" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    ))}
                    {(projectsList.length === 0 && fallbackProjects.length === 0) && (
                      <div className="text-xs text-gray-500">No recent projects</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Task Overview</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Total Tasks</div>
                      <div className="text-sm font-semibold">{(tasksList.length || fallbackTasks.length)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Completed</div>
                      <div className="text-sm font-semibold">{(tasksList.filter((t: any) => t.status === 'Done').length)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Tasks</h3>
                  <div className="space-y-2">
                    {(tasksList.length > 0 ? tasksList : fallbackTasks).slice(0,3).map((task, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <CheckSquare size={12} className="text-green-600" />
                        <div className="text-xs flex-1 truncate">{task.title}</div>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === "Done" ? "bg-green-100 text-green-700" :
                          task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                    {(tasksList.length === 0 && fallbackTasks.length === 0) && (
                      <div className="text-xs text-gray-500">No recent tasks</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Teams Tab */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Team Overview</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Total Teams</div>
                      <div className="text-sm font-semibold">{(teamsList.length || fallbackTeams.length)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Active</div>
                      <div className="text-sm font-semibold">{(teamsList.length || fallbackTeams.length)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Teams</h3>
                  <div className="space-y-2">
                    {(teamsList.length > 0 ? teamsList : fallbackTeams).slice(0,3).map((team, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <Users size={12} className="text-purple-600" />
                        <div className="text-xs flex-1 truncate">{team.name}</div>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          team.health === 'excellent' ? 'bg-green-100 text-green-700' :
                          team.health === 'good' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {team.health}
                        </span>
                      </div>
                    ))}
                    {(teamsList.length === 0 && fallbackTeams.length === 0) && (
                      <div className="text-xs text-gray-500">No recent teams</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Companies Tab */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Company Overview</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Total Companies</div>
                      <div className="text-sm font-semibold">{(companiesList.length || fallbackCompanies.length)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Active</div>
                      <div className="text-sm font-semibold">{(companiesList.length || fallbackCompanies.length)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Companies</h3>
                  <div className="space-y-2">
                    {(companiesList.length > 0 ? companiesList : fallbackCompanies).slice(0,3).map((company, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <Building2 size={12} className="text-blue-600" />
                        <div className="text-xs flex-1 truncate">{company.name}</div>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          company.status === "Active" ? "bg-green-100 text-green-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {company.status}
                        </span>
                      </div>
                    ))}
                    {(companiesList.length === 0 && fallbackCompanies.length === 0) && (
                      <div className="text-xs text-gray-500">No recent companies</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Calendar Tab */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Calendar Overview</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Total Events</div>
                      <div className="text-sm font-semibold">{allCalendarEvents.length}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">This Week</div>
                      <div className="text-sm font-semibold">{allCalendarEvents.length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Upcoming Events</h3>
                  <div className="space-y-2">
                    {allCalendarEvents.slice(0,3).map((event, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <Calendar size={12} className="text-orange-600" />
                        <div className="text-xs flex-1 truncate">{event.title}</div>
                        <span className="text-xs text-gray-500">{event.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Reports Overview</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Total Reports</div>
                      <div className="text-sm font-semibold">{allReports.length}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Published</div>
                      <div className="text-sm font-semibold">{allReports.filter(r => r.status === 'Published').length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Reports</h3>
                  <div className="space-y-2">
                    {allReports.slice(0,3).map((report, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <BarChart3 size={12} className="text-purple-600" />
                        <div className="text-xs flex-1 truncate">{report.title}</div>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === "Published" ? "bg-green-100 text-green-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
} 