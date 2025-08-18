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
    author: "Alex Lee"
  }
];

export default function ContextSidebar({ 
  activeTab, 
  onOpenTab, 
  onAddDepartments, 
  onAddTeams, 
  onAddSprints,
  onAddStories,
  onAddTasks,
  onOpenCompanyProjects,
  onClose,
  isMobile,
  isMobileOpen,
  onMobileClose
}: {
  activeTab: number;
  onOpenTab: (tabName: string, context?: any) => void;
  onAddDepartments?: () => void;
  onAddTeams?: () => void;
  onAddSprints?: () => void;
  onAddStories?: () => void;
  onAddTasks?: () => void;
  onOpenCompanyProjects?: (companyName: string) => void;
  onClose: () => void;
  isMobile: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const [expandedTeams, setExpandedTeams] = useState<number[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
  
  // State for companies from API
  const [companiesList, setCompaniesList] = useState<CompanySidebarData[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [companiesError, setCompaniesError] = useState<string | null>(null);

  // State for tasks from API
  const [tasksList, setTasksList] = useState<TaskSidebarData[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [projectsList, setProjectsList] = useState<ProjectData[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [teamsList, setTeamsList] = useState<TeamData[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  // Fallback companies if API fails
  const fallbackCompanies: CompanySidebarData[] = [
    {
      id: 1,
      name: "TechCorp Solutions",
      expanded: false,
      sections: {
        projects: { expanded: false },
        departments: { expanded: false, subdepartments: [] },
        teams: { expanded: false, subteams: [] },
        sprints: { expanded: false },
        calendar: { expanded: false },
        stories: { expanded: false, substories: [] },
        tasks: { expanded: false, subtasks: [] }
      }
    },
    {
      id: 2,
      name: "Innovate Labs",
      expanded: false,
      sections: {
        projects: { expanded: false },
        departments: { expanded: false, subdepartments: [] },
        teams: { expanded: false, subteams: [] },
        sprints: { expanded: false },
        calendar: { expanded: false },
        stories: { expanded: false, substories: [] },
        tasks: { expanded: false, subtasks: [] }
      }
    }
  ];

  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      setIsLoadingCompanies(true);
      setCompaniesError(null);
      
      const response = await CompanyApiService.getCompanies();
      
      if (response.success) {
        // Handle different response structures
        const companiesData = response.items || response.data || [];
        console.log('Companies response structure:', { success: response.success, count: (response as any).count, itemsLength: companiesData.length });
        console.log('CompaniesData type:', typeof companiesData, 'IsArray:', Array.isArray(companiesData));
        console.log('CompaniesData value:', companiesData);
        
        if (Array.isArray(companiesData)) {
          const transformedCompanies: CompanySidebarData[] = companiesData
            .filter((item: any) => item.name && item.id)
            .map((item: any, index: number) => ({
              id: parseInt(item.id) || index + 1,
              name: item.name,
              expanded: false,
              sections: {
                projects: { expanded: false },
                departments: { expanded: false, subdepartments: [] },
                teams: { expanded: false, subteams: [] },
                sprints: { expanded: false },
                calendar: { expanded: false },
                stories: { expanded: false, substories: [] },
                tasks: { expanded: false, subtasks: [] }
              }
            }));
          
          setCompaniesList(transformedCompanies);
          console.log('Transformed companies count:', transformedCompanies.length);
        } else {
          console.warn('Companies data is not an array:', companiesData);
          setCompaniesList([]);
        }
      } else {
        setCompaniesList([]);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompaniesError(null);
      setCompaniesList([]);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setIsLoadingTasks(true);
      setTasksError(null);
      
      const response = await TaskApiService.getTasks();
      
      if (response.success) {
        // Handle different response structures
        const tasksData = response.items || response.data || [];
        
        if (Array.isArray(tasksData)) {
          const transformedTasks: TaskSidebarData[] = tasksData
            .filter((item: any) => item.title && item.id)
            .map((item: any) => ({
              id: item.id,
              title: item.title,
              status: item.status || 'To Do',
              priority: item.priority || 'Medium',
              assignee: item.assignee || 'Unassigned',
              project: item.project || 'Default Project',
              expanded: false
            }));
          
          setTasksList(transformedTasks);
        } else {
          setTasksList([]);
        }
      } else {
        setTasksList([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasksError(null);
      setTasksList([]);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true);
      setProjectsError(null);
      
      const response = await ProjectApiService.getProjects();
      
      if (response.success) {
        // Handle different response structures
        const projectsData = (response as any).items || response.data || [];
        
        if (Array.isArray(projectsData)) {
          setProjectsList(projectsData);
        } else {
          setProjectsList([]);
        }
      } else {
        setProjectsList([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjectsError(null);
      setProjectsList([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Fetch teams from API
  const fetchTeams = async () => {
    try {
      setIsLoadingTeams(true);
      setTeamsError(null);
      
      const response = await TeamApiService.getTeams();
      
      if (response.success) {
        // Handle different response structures
        const teamsData = (response as any).items || response.data || [];
        
        if (Array.isArray(teamsData)) {
          setTeamsList(teamsData);
        } else {
          setTeamsList([]);
        }
      } else {
        setTeamsList([]);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeamsError(null);
      setTeamsList([]);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  // Load companies, tasks, projects, and teams on component mount
  useEffect(() => {
    fetchCompanies();
    fetchTasks();
    fetchProjects();
    fetchTeams();
  }, []);

  // Helper to toggle section expansion
  const toggleSection = (companyId: number, section: string) => {
    setCompaniesList(prev => prev.map(c =>
      c.id === companyId
        ? { ...c, sections: { ...c.sections, [section]: { ...c.sections[section as keyof typeof c.sections], expanded: !c.sections[section as keyof typeof c.sections].expanded } } }
        : c
    ));
  };

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

  // Mobile context sidebar
  if (isMobile) {
    return (
      <aside className={`mobile-sidebar mobile-right-0 mobile-left-auto ${isMobileOpen ? 'open' : ''}`}>
        <div className="mobile-flex mobile-items-center mobile-justify-between p-3 border-b border-neutral-200 flex-shrink-0">
          <h2 className="mobile-h3">Context</h2>
          <button 
            onClick={onMobileClose || onClose}
            className="mobile-btn mobile-btn-secondary mobile-text-xs"
          >
            <X size={14} />
          </button>
        </div>
        
        <div className="mobile-space-y-3 p-3 flex-1 overflow-y-auto">
          {activeTab === 2 && (
            <div className="mobile-space-y-3">
              <div className="mobile-card">
                <h3 className="mobile-h4 mb-2">Task Filters</h3>
                <div className="mobile-space-y-2">
                  <button className="mobile-btn mobile-btn-secondary mobile-text-xs mobile-w-full mobile-justify-start">
                    <CheckSquare size={12} />
                    All Tasks
                  </button>
                  <button className="mobile-btn mobile-btn-secondary mobile-text-xs mobile-w-full mobile-justify-start">
                    <Star size={12} />
                    Favorites
                  </button>
                </div>
              </div>
              
              <div className="mobile-card">
                <h3 className="mobile-h4 mb-2">Recent Tasks</h3>
                <div className="mobile-space-y-2">
                  {tasksList.slice(0, 3).map((task, idx) => (
                    <div key={idx} className="mobile-flex mobile-items-center mobile-gap-2 mobile-p-2 mobile-rounded-lg mobile-bg-neutral-50">
                      <div className="mobile-w-6 mobile-h-6 mobile-rounded-full mobile-bg-green-100 mobile-flex mobile-items-center mobile-justify-center">
                        <CheckSquare size={12} className="text-green-600" />
                      </div>
                      <div className="mobile-flex-1">
                        <div className="mobile-text-xs font-medium truncate">{task.title}</div>
                        <div className="mobile-text-xs mobile-text-secondary">{task.assignee}</div>
                      </div>
                      <span className={`mobile-px-2 mobile-py-1 mobile-rounded-full mobile-text-xs mobile-font-medium ${
                        task.status === "Done" ? "mobile-bg-green-100 mobile-text-green-700" :
                        task.status === "In Progress" ? "mobile-bg-blue-100 mobile-text-blue-700" :
                        "mobile-bg-gray-100 mobile-text-gray-700"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div className="mobile-space-y-3">
              <div className="mobile-card">
                <h3 className="mobile-h4 mb-2">Company Filters</h3>
                <div className="mobile-space-y-2">
                  <button className="mobile-btn mobile-btn-secondary mobile-text-xs mobile-w-full mobile-justify-start">
                    <Building size={12} />
                    All Companies
                  </button>
                  <button className="mobile-btn mobile-btn-secondary mobile-text-xs mobile-w-full mobile-justify-start">
                    <Star size={12} />
                    Favorites
                  </button>
                </div>
              </div>
              
              <div className="mobile-card">
                <h3 className="mobile-h4 mb-2">Recent Companies</h3>
                <div className="mobile-space-y-2">
                  {(companiesList.length > 0 ? companiesList : fallbackCompanies).slice(0, 3).map((company, idx) => (
                    <div key={idx} className="mobile-flex mobile-items-center mobile-gap-2 mobile-p-2 mobile-rounded-lg mobile-bg-neutral-50">
                      <div className="mobile-w-6 mobile-h-6 mobile-rounded-full mobile-bg-blue-100 mobile-flex mobile-items-center mobile-justify-center">
                        <span className="mobile-text-xs font-medium text-blue-600">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                      <div className="mobile-flex-1">
                        <div className="mobile-text-xs font-medium">{company.name}</div>
                        <div className="mobile-text-xs mobile-text-secondary">Company</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  return (
    <>
      {(activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4 || activeTab === 5 || activeTab === 6) && (
        <aside className="sticky top-0 h-screen w-[260px] bg-white border-r border-neutral-200 flex flex-col overflow-y-auto z-20">
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
            {activeTab === 2 && (
              /* Tasks Content */
              <nav className="space-y-1">
                {isLoadingTasks ? (
                  <div className="text-center py-4">Loading tasks...</div>
                ) : tasksError ? (
                  <div className="text-center py-4 text-red-500">{tasksError}</div>
                ) : tasksList.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-sm text-gray-500 mb-2">No tasks found</div>
                    </div>
                ) : (
                  tasksList.map((task) => (
                    <div key={task.id} className="space-y-1">
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50 relative group">
                      <button
                          className="p-1 rounded hover:bg-neutral-100 transition-colors"
                          onClick={() => {
                            setTasksList(prev => prev.map(t =>
                              t.id === task.id ? { ...t, expanded: !t.expanded } : t
                            ));
                          }}
                        >
                          {task.expanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                      </button>
                        <CheckSquare size={18} className="text-green-500" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-neutral-800 truncate">{task.title}</div>
                          <div className="text-xs text-neutral-500 truncate">{task.assignee} • {task.project}</div>
                    </div>
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === "Done" ? "bg-green-100 text-green-700" :
                            task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                            task.status === "To Do" ? "bg-gray-100 text-gray-700" :
                            "bg-yellow-100 text-yellow-700"
                      }`}>
                        {task.status}
                      </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === "High" ? "bg-red-100 text-red-700" :
                            task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        </div>
                      </div>
                  ))
                )}
              </nav>
            )}

            {activeTab === 1 && (
              /* Projects Content */
              <nav className="space-y-1">
                {isLoadingProjects ? (
                  <div className="text-center py-4">Loading projects...</div>
                ) : projectsError ? (
                  <div className="text-center py-4 text-red-500">{projectsError}</div>
                ) : projectsList.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-sm text-gray-500 mb-2">No projects found</div>
                  </div>
                ) : (
                  projectsList.map((project) => (
                    <div key={project.id} className="space-y-1">
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50 relative group">
                        <FolderOpen size={18} className="text-blue-500" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-neutral-800 truncate">{project.name}</div>
                          <div className="text-xs text-neutral-500 truncate">{project.company} • {project.assignee}</div>
                    </div>
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === "Completed" ? "bg-green-100 text-green-700" :
                            project.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                            project.status === "Planning" ? "bg-gray-100 text-gray-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {project.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.priority === "High" ? "bg-red-100 text-red-700" :
                            project.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {project.priority}
                      </span>
                        </div>
                        </div>
                      </div>
                  ))
                    )}
              </nav>
            )}

            {activeTab === 3 && (
              /* Teams Content */
              <nav className="space-y-1">
                {isLoadingTeams ? (
                  <div className="text-center py-4">Loading teams...</div>
                ) : teamsError ? (
                  <div className="text-center py-4 text-red-500">{teamsError}</div>
                ) : teamsList.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-sm text-gray-500 mb-2">No teams found</div>
                    </div>
                ) : (
                  teamsList.map((team) => (
                    <div key={team.id} className="space-y-1">
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50 relative group">
                        <Users size={18} className="text-purple-500" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-neutral-800 truncate">{team.name}</div>
                          <div className="text-xs text-neutral-500 truncate">{team.project} • {team.department}</div>
                    </div>
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            team.health === "excellent" ? "bg-green-100 text-green-700" :
                            team.health === "good" ? "bg-blue-100 text-blue-700" :
                            team.health === "warning" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {team.health}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {team.budget}
                          </span>
                        </div>
                        </div>
                      </div>
                  ))
                    )}
              </nav>
            )}

            {activeTab === 4 && (
              /* Companies Content */
              <nav className="space-y-1">
                {isLoadingCompanies ? (
                  <div className="text-center py-4">Loading companies...</div>
                ) : companiesError ? (
                  <div className="text-center py-4 text-red-500">{companiesError}</div>
                ) : (companiesList.length === 0 && !isLoadingCompanies) ? (
                  <div className="text-center py-4">
                    <div className="text-sm text-gray-500 mb-2">Using sample data</div>
                    {fallbackCompanies.map((company) => (
                      <div key={company.id} className="space-y-1">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50 relative group">
                          <button
                            className="p-1 rounded hover:bg-neutral-100 transition-colors"
                            onClick={() => {
                              setCompaniesList(prev => prev.map(c =>
                                c.id === company.id ? { ...c, expanded: !c.expanded } : c
                              ));
                            }}
                          >
                            {company.expanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                          </button>
                          <Building2 size={18} className="text-blue-500" />
                          <span className="text-sm font-semibold text-neutral-800 flex-1">{company.name}</span>
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-600">AI</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  companiesList.map((company) => (
                  <div key={company.id} className="space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50 relative group">
                      <button
                        className="p-1 rounded hover:bg-neutral-100 transition-colors"
                        onClick={() => {
                          setCompaniesList(prev => prev.map(c =>
                            c.id === company.id ? { ...c, expanded: !c.expanded } : c
                          ));
                        }}
                      >
                        {company.expanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                      </button>
                      <Building2 size={18} className="text-blue-500" />
                      <span className="text-sm font-semibold text-neutral-800 flex-1">{company.name}</span>
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-600">AI</span>
                      </div>
                    </div>


                          </div>
                  ))
                )}
              </nav>
            )}

            {activeTab === 5 && (
              /* Calendar Events Content */
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-neutral-800">Calendar Views</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50">
                    <Calendar size={16} className="text-blue-500" />
                    <span className="text-sm">Month View</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50">
                    <Calendar size={16} className="text-green-500" />
                    <span className="text-sm">Week View</span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <h3 className="text-sm font-semibold text-neutral-800 mb-3">Upcoming Events</h3>
                {allCalendarEvents.map((event) => (
                    <div key={event.id} className="border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50 cursor-pointer mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-neutral-900">{event.title}</h3>
                    </div>
                    <p className="text-xs text-neutral-600 mb-2">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>{event.date} at {event.time}</span>
                      <span>{event.duration}</span>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}

            {activeTab === 6 && (
              /* All Reports Content */
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-neutral-800">Report Categories</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50">
                    <BarChart3 size={16} className="text-blue-500" />
                    <span className="text-sm">Project Analytics</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50">
                    <PieChart size={16} className="text-green-500" />
                    <span className="text-sm">Team Performance</span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <h3 className="text-sm font-semibold text-neutral-800 mb-3">Recent Reports</h3>
                {allReports.map((report) => (
                    <div key={report.id} className="border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50 cursor-pointer mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-neutral-900">{report.title}</h3>
                    </div>
                    <p className="text-xs text-neutral-600 mb-2">{report.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${
                        report.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {report.status}
                      </span>
                      <span className="text-neutral-500">{report.author}</span>
                    </div>
                        </div>
                  ))}
                        </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
} 