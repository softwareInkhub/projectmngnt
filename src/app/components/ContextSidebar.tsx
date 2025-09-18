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
  ChevronLeft,
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
import { useRouter } from "next/navigation";
import { CompanyApiService, CompanyData } from "../utils/companyApi";
import { TaskApiService, TaskData } from "../utils/taskApi";
import { ProjectApiService, ProjectData } from "../utils/projectApi";
import { TeamApiService, TeamData } from "../utils/teamApi";
import UniversalDetailsModal from "./UniversalDetailsModal";
import ProjectSelector from "./ProjectSelector";

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
    id: "calendar-event-1",
    title: "Sprint Planning Meeting",
    description: "Plan tasks and assign responsibilities for the upcoming sprint",
    date: "2024-02-15",
    time: "10:00 AM",
    duration: "2 hours"
  },
  {
    id: "calendar-event-2",
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
    id: "report-1",
    title: "Project Performance Report",
    description: "Comprehensive analysis of project metrics and KPIs",
    status: "Published",
    author: "Sarah Johnson"
  },
  {
    id: "report-2",
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
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function ContextSidebar({
  activeTab,
  isMobile,
  isMobileOpen,
  onMobileClose,
  onClose,
  onOpenTab
}: ContextSidebarProps) {
  const router = useRouter();
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    itemType: 'project' | 'task' | 'team' | 'company';
    itemId: string;
  }>({
    isOpen: false,
    itemType: 'project',
    itemId: ''
  });

  // Professional themes with gradients for project boxes
  const projectBoxThemes = [
    { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-800' },
    { bg: 'bg-gradient-to-br from-gray-100 to-gray-200', border: 'border-gray-300', text: 'text-gray-800' },
    { bg: 'bg-gradient-to-br from-zinc-100 to-zinc-200', border: 'border-zinc-300', text: 'text-zinc-800' },
    { bg: 'bg-gradient-to-br from-neutral-100 to-neutral-200', border: 'border-neutral-300', text: 'text-neutral-800' },
    { bg: 'bg-gradient-to-br from-stone-100 to-stone-200', border: 'border-stone-300', text: 'text-stone-800' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch companies
        setIsLoadingCompanies(true);
        const companiesResponse = await CompanyApiService.getCompanies();
        if (companiesResponse.success && companiesResponse.data) {
          setCompaniesList(companiesResponse.data);
        } else {
          setCompaniesList([]);
        }
      } catch (error) {
        setCompaniesList([]);
      } finally {
        setIsLoadingCompanies(false);
      }

      try {
        // Fetch tasks
        setIsLoadingTasks(true);
        const tasksResponse = await TaskApiService.getTasks();
        if (tasksResponse.success && tasksResponse.data) {
          setTasksList(tasksResponse.data as any);
        } else {
          setTasksList([]);
        }
      } catch (error) {
        setTasksList([]);
      } finally {
        setIsLoadingTasks(false);
      }

      try {
        // Fetch projects
        setIsLoadingProjects(true);
        const projectsResponse = await ProjectApiService.getProjects();
        if (projectsResponse.success && projectsResponse.data) {
          setProjectsList(projectsResponse.data as any);
        } else {
          setProjectsList([]);
        }
      } catch (error) {
        setProjectsList([]);
      } finally {
        setIsLoadingProjects(false);
      }

      try {
        // Fetch teams
        setIsLoadingTeams(true);
        const teamsResponse = await TeamApiService.getTeams();
        if (teamsResponse.success && teamsResponse.data) {
          setTeamsList(teamsResponse.data as any);
        } else {
          setTeamsList([]);
        }
      } catch (error) {
        setTeamsList([]);
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

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  const openDetailsModal = (itemType: 'project' | 'task' | 'team' | 'company', itemId: string) => {
    setDetailsModal({
      isOpen: true,
      itemType,
      itemId
    });
  };

  const closeDetailsModal = () => {
    setDetailsModal({
      isOpen: false,
      itemType: 'project',
      itemId: ''
    });
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
        <div className="absolute right-0 h-full w-60 max-w-[75vw] bg-white shadow-2xl flex flex-col" style={{ zIndex: 50 }}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">C</span>
              </div>
              <div>
                <h2 className="text-xs font-bold text-gray-900">Context</h2>
                <p className="text-sm text-gray-500">Quick actions</p>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Status Summary</h3>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-base text-slate-700">Planning</div>
                      <div className="text-2xl font-bold text-slate-800">{projectsList.filter((p: any) => p.status === 'Planning').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg p-2 border border-emerald-300">
                      <div className="text-base text-emerald-700">In Progress</div>
                      <div className="text-2xl font-bold text-emerald-800">{projectsList.filter((p: any) => p.status === 'In Progress').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-base text-slate-700">Completed</div>
                      <div className="text-2xl font-bold text-slate-800">{projectsList.filter((p: any) => p.status === 'Completed').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg p-2 border border-amber-300">
                      <div className="text-base text-amber-700">On Hold</div>
                      <div className="text-2xl font-bold text-amber-800">{projectsList.filter((p: any) => p.status === 'On Hold').length}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-blue-50 text-blue-700 rounded-lg p-2 text-sm font-medium hover:bg-blue-100 transition-colors" onClick={() => onOpenTab?.('create-project')}>+ Project</button>
                    <button className="bg-green-50 text-green-700 rounded-lg p-2 text-sm font-medium hover:bg-green-100 transition-colors" onClick={() => onOpenTab?.('create-task')}>+ Task</button>
                    <button className="bg-purple-50 text-purple-700 rounded-lg p-2 text-sm font-medium hover:bg-purple-100 transition-colors" onClick={() => onOpenTab?.('create-team')}>+ Team</button>
                    <button className="bg-gray-50 text-gray-700 rounded-lg p-2 text-sm font-medium hover:bg-gray-100 transition-colors" onClick={() => onOpenTab?.('projects')}>All Projects</button>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
                  {projectsList.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-base">
                      {projectsList.slice(0, 8).map((p, idx) => {
                        const theme = projectBoxThemes[idx % projectBoxThemes.length];
                        return (
                        <li
                          key={(p as any).id || idx}
                          className={`truncate px-2 py-1 rounded-md border ${theme.border} ${theme.bg} ${theme.text} transition-colors cursor-pointer`}
                          onClick={() => { const id = (p as any).id; if (id) openDetailsModal('project', id.toString()); }}
                          title={p.name}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter') { const id = (p as any).id; if (id) openDetailsModal('project', id.toString()); } }}
                        >
                          {p.name}
                        </li>
                      );})}
                    </ul>
                  ) : (
                    <div className="text-base text-gray-500">No projects</div>
                  )}
                </div>
              </div>
            )}
            
          {activeTab === 2 && (
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Task Filters</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors">
                    <CheckSquare size={12} />
                    All Tasks
                  </button>
                    <button className="w-full flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors">
                    <Star size={12} />
                    Favorites
                  </button>
                </div>
              </div>
              
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Recent Tasks</h3>
                  <div className="space-y-2">
                    {tasksList.slice(0,3).map((task, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <CheckSquare size={12} className="text-green-600" />
                        <div className="text-sm flex-1 truncate">{task.title}</div>
                        <span className={`px-1.5 py-0.5 rounded-full text-sm font-medium ${
                          task.status === "Done" ? "bg-green-100 text-green-700" :
                          task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                    {tasksList.length === 0 && (
                      <div className="text-sm text-gray-500">No recent tasks</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Team Status Summary</h3>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg p-2 border border-pink-300">
                      <div className="text-base text-pink-700">Active Teams</div>
                      <div className="text-2xl font-bold text-pink-800">{teamsList.length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg p-2 border border-pink-300">
                      <div className="text-base text-pink-700">Total Members</div>
                      <div className="text-2xl font-bold text-pink-800">{teamsList.reduce((acc, team) => acc + (Array.isArray(team.members) ? team.members.length : 0), 0)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg p-2 border border-pink-300">
                      <div className="text-base text-pink-700">High Performance</div>
                      <div className="text-2xl font-bold text-pink-800">{teamsList.filter((t: any) => t.performance >= 80).length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg p-2 border border-pink-300">
                      <div className="text-base text-pink-700">On Track</div>
                      <div className="text-2xl font-bold text-pink-800">{teamsList.filter((t: any) => t.health === 'excellent' || t.health === 'good').length}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Teams</h3>
                  {teamsList.length > 0 ? (
                    <ul className="space-y-2">
                      {teamsList.slice(0, 8).map((team, idx) => {
                        const teamThemes = [
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' }
                        ];
                        const theme = teamThemes[idx % teamThemes.length];
                        return (
                        <li
                          key={`context-team-${team.id || idx}`}
                          className={`flex items-center px-2 py-1.5 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} transition-colors cursor-pointer hover:shadow-sm`}
                          onClick={() => { if (team.id) openDetailsModal('team', team.id.toString()); }}
                          title={team.name}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' && team.id) openDetailsModal('team', team.id.toString()); }}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${theme.dot}`}></div>
                          <span className="text-base font-medium truncate">{team.name}</span>
                        </li>
                      );})}
                    </ul>
                  ) : (
                    <div className="text-base text-gray-500">No teams</div>
                  )}
                </div>
              </div>
            )}

          {activeTab === 4 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Status Summary</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-sm font-semibold text-slate-700">Total Companies</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{companiesList.length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg p-2 border border-emerald-300">
                      <div className="text-sm font-semibold text-emerald-700">Active</div>
                      <div className="text-3xl font-bold text-emerald-800 mt-1">{companiesList.length}</div>
                    </div>
                  </div>
                </div>
              
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Companies</h3>
                  {companiesList.length > 0 ? (
                    <ul className="space-y-2">
                      {companiesList.slice(0, 8).map((company, idx) => {
                        const companyThemes = [
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' }
                        ];
                        const theme = companyThemes[idx % companyThemes.length];
                        return (
                        <li
                          key={company.id || idx}
                          className={`flex items-center px-2 py-1.5 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} transition-colors cursor-pointer hover:shadow-sm`}
                          onClick={() => { if (company.id) openDetailsModal('company', company.id.toString()); }}
                          title={company.name}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' && company.id) openDetailsModal('company', company.id.toString()); }}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${theme.dot}`}></div>
                          <span className="text-base font-medium truncate">{company.name}</span>
                        </li>
                      );})}
                    </ul>
                  ) : (
                    <div className="text-base text-gray-500">No companies</div>
                  )}
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
                <div className="text-sm font-medium text-gray-900">Actions</div>
                <div className="text-sm text-gray-500">Quick access</div>
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
        <aside className={`sticky top-0 h-screen bg-white border-r border-neutral-200 flex flex-col overflow-y-auto z-20 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-52'
        }`}>

                      {/* Expand button - Only show when collapsed */}
            {isCollapsed && (
              <div className="pt-4 flex justify-center">
                <button 
                  onClick={toggleCollapse}
                  className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors group"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight size={16} className="text-blue-600 group-hover:text-blue-700" />
                </button>
              </div>
            )}
            
            {/* Header - Only show when expanded */}
          {!isCollapsed && (
            <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-800">
                {activeTab === 1 ? "All Projects" : 
                 activeTab === 2 ? "All Tasks" : 
                 activeTab === 3 ? "All Teams" : 
                 activeTab === 4 ? "Companies" : 
                 activeTab === 5 ? "Calendar Events" : 
                 activeTab === 6 ? "All Reports" : "Context"}
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleCollapse}
                  className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors group"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft size={16} className="text-blue-600 group-hover:text-blue-700" />
                </button>
              </div>
            </div>
          )}

          {/* Content based on active tab */}
          <div className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isCollapsed ? 'px-2 py-2' : 'px-4 py-4'
          } space-y-4`}>
            
            {/* Collapsed State - Show nothing, just empty space */}
            {isCollapsed && (
              <div className="flex flex-col items-center space-y-4 pt-4">
                {/* Navigation icons are completely hidden in collapsed state */}
              </div>
            )}
            
            {/* Expanded State - Show full content */}
            {!isCollapsed && (
              <>
                {/* Projects Tab */}
                {activeTab === 1 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Status Summary</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Planning</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{projectsList.filter((p: any) => p.status === 'Planning').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">In Progress</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{projectsList.filter((p: any) => p.status === 'In Progress').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Completed</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{projectsList.filter((p: any) => p.status === 'Completed').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">On Hold</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{projectsList.filter((p: any) => p.status === 'On Hold').length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects</h3>
                  {projectsList.length > 0 ? (
                    <ul className="space-y-3">
                      {projectsList.map((project, idx) => {
                        const theme = projectBoxThemes[idx % projectBoxThemes.length];
                        return (
                        <li
                          key={(project as any).id || idx}
                          className={`flex items-center px-3 py-2 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} transition-colors cursor-pointer hover:shadow-sm`}
                          onClick={() => { const id = (project as any).id; if (id) openDetailsModal('project', id.toString()); }}
                          title={project.name}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter') { const id = (project as any).id; if (id) openDetailsModal('project', id.toString()); } }}
                        >
                          <div className={`w-2 h-2 rounded-full mr-3 bg-gradient-to-br from-slate-400 to-slate-600`}></div>
                           <span className="text-base font-medium truncate">{project.name}</span>
                        </li>
                      );})}
                    </ul>
                  ) : (
                    <div className="text-base text-gray-500">No projects</div>
                  )}
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Task Status Summary</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">To Do</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{tasksList.filter((t: any) => t.status === 'To Do').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">In Progress</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{tasksList.filter((t: any) => t.status === 'In Progress').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Done</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{tasksList.filter((t: any) => t.status === 'Done').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Blocked</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{tasksList.filter((t: any) => t.status === 'Blocked').length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Tasks</h3>
                  {tasksList.length > 0 ? (
                    <ul className="space-y-2">
                      {tasksList.slice(0, 8).map((task, idx) => {
                        const taskThemes = [
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' }
                        ];
                        const theme = taskThemes[idx % taskThemes.length];
                        return (
                        <li
                          key={task.id || idx}
                          className={`flex items-center px-2 py-1.5 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} transition-colors cursor-pointer hover:shadow-sm`}
                          onClick={() => { if (task.id) openDetailsModal('task', task.id.toString()); }}
                          title={task.title}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' && task.id) openDetailsModal('task', task.id.toString()); }}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${theme.dot}`}></div>
                          <span className="text-base font-medium truncate">{task.title}</span>
                        </li>
                      );})}
                    </ul>
                  ) : (
                    <div className="text-base text-gray-500">No tasks</div>
                  )}
                </div>
              </div>
            )}

            {/* Teams Tab */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Team Status Summary</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Active</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{teamsList.filter((t: any) => t.status === 'Active').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Inactive</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{teamsList.filter((t: any) => t.status === 'Inactive').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">On Hold</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{teamsList.filter((t: any) => t.status === 'On Hold').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Total</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{teamsList.length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Teams</h3>
                  {teamsList.length > 0 ? (
                    <ul className="space-y-3">
                      {teamsList.slice(0, 8).map((team, idx) => {
                        const teamThemes = [
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' }
                        ];
                        const theme = teamThemes[idx % teamThemes.length];
                        return (
                        <li
                          key={`context-team-${team.id || idx}`}
                          className={`flex items-center px-3 py-2 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} transition-colors cursor-pointer hover:shadow-sm`}
                          onClick={() => { if (team.id) openDetailsModal('team', team.id.toString()); }}
                          title={team.name}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' && team.id) openDetailsModal('team', team.id.toString()); }}
                        >
                          <div className={`w-2 h-2 rounded-full mr-3 ${theme.dot}`}></div>
                          <span className="text-sm font-medium truncate">{team.name}</span>
                        </li>
                      );})}
                    </ul>
                  ) : (
                    <div className="text-base text-gray-500">No teams</div>
                  )}
                </div>
              </div>
            )}

            {/* Companies Tab */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Status Summary</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Active</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{companiesList.filter((c: any) => c.status === 'Active').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Inactive</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{companiesList.filter((c: any) => c.status === 'Inactive').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">On Hold</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{companiesList.filter((c: any) => c.status === 'On Hold').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Total</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{companiesList.length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Companies</h3>
                  {companiesList.length > 0 ? (
                    <ul className="space-y-3">
                      {companiesList.slice(0, 8).map((company, idx) => {
                        const companyThemes = [
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' }
                        ];
                        const theme = companyThemes[idx % companyThemes.length];
                        return (
                        <li
                          key={company.id || idx}
                          className={`flex items-center px-3 py-2 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} transition-colors cursor-pointer hover:shadow-sm`}
                          onClick={() => { if (company.id) openDetailsModal('company', company.id.toString()); }}
                          title={company.name}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' && company.id) openDetailsModal('company', company.id.toString()); }}
                        >
                          <div className={`w-2 h-2 rounded-full mr-3 ${theme.dot}`}></div>
                          <span className="text-sm font-medium truncate">{company.name}</span>
                        </li>
                      );})}
                    </ul>
                  ) : (
                    <div className="text-base text-gray-500">No companies</div>
                  )}
                </div>
              </div>
            )}

            {/* Calendar Tab */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Calendar Status Summary</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Total Events</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{allCalendarEvents.length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">This Week</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{allCalendarEvents.length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Upcoming</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{allCalendarEvents.length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Completed</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">0</div>
                    </div>
                  </div>
                </div>
                
                <ProjectSelector 
                  onProjectSelect={(project) => {
                    console.log('Selected project:', project);
                    // You can add navigation logic here if needed
                  }}
                />
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Reports Status Summary</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Total Reports</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{allReports.length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Published</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{allReports.filter(r => r.status === 'Published').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">Draft</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{allReports.filter(r => r.status === 'Draft').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border border-slate-300">
                      <div className="text-xs font-semibold text-slate-700">In Review</div>
                      <div className="text-3xl font-bold text-slate-800 mt-1">{allReports.filter(r => r.status === 'In Review').length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Reports</h3>
                  {allReports.length > 0 ? (
                    <ul className="space-y-2">
                      {allReports.slice(0, 8).map((report, idx) => {
                        const reportThemes = [
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' },
                          { bg: 'bg-gradient-to-br from-slate-100 to-slate-200', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-600' }
                        ];
                        const theme = reportThemes[idx % reportThemes.length];
                        return (
                        <li
                          key={report.id || idx}
                          className={`flex items-center px-2 py-1.5 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} transition-colors cursor-pointer hover:shadow-sm`}
                          title={report.title}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${theme.dot}`}></div>
                          <span className="text-base font-medium truncate">{report.title}</span>
                        </li>
                      );})}
                    </ul>
                  ) : (
                    <div className="text-base text-gray-500">No reports</div>
                  )}
                </div>
              </div>
            )}
              </>
            )}
          </div>
        </aside>
      )}
      
      {/* Universal Details Modal */}
      <UniversalDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={closeDetailsModal}
        itemType={detailsModal.itemType}
        itemId={detailsModal.itemId}
      />
    </>
  );
}
