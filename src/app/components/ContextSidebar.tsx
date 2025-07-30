"use client";
import {
  FolderKanban,
  Plus,
  X,
  BarChart3,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Circle,
  Users,
  CheckSquare,
  Calendar,
  Zap,
  Eye,
  Edit,
  Archive,
  Trash2,
  MoreHorizontal,
  Building2,
  ChevronDown,
  ChevronRight,
  Building,
  BookOpen,
  User,
  Download,
  Save,
  ArrowLeft,
  Tag,
  MapPin,
  Globe,
  Phone,
  Mail,
  CalendarDays,
  Clock3,
  Target as TargetIcon,
  MessageSquare,
  CheckSquare as CheckSquareIcon,
  Square,
  Play,
  Pause,
  StopCircle,
  RotateCcw,
  BarChart3 as BarChart3Icon,
  PieChart,
  LineChart
} from "lucide-react";
import { useState } from "react";

// Mock data for all projects from all companies
const allProjects = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "Modern e-commerce platform with advanced features",
    company: "Whapi Corp",
    status: "In Progress",
    progress: 65,
    priority: "High",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    budget: "$150,000",
    members: [
      { name: "Sarah Johnson", role: "Project Lead", avatar: "SJ", online: true },
      { name: "Mike Chen", role: "Frontend Dev", avatar: "MC", online: true },
      { name: "Alex Lee", role: "Backend Dev", avatar: "AL", online: false }
    ],
    tasks: [
      { name: "User authentication system", status: "Completed", due: "2 days ago" },
      { name: "Payment integration", status: "In Progress", due: "Tomorrow" },
      { name: "Mobile responsive design", status: "Pending", due: "Next week" }
    ]
  },
  {
    id: 2,
    name: "Client Portal",
    description: "Customer-facing portal for client management",
    company: "Whapi Corp",
    status: "Planning",
    progress: 25,
    priority: "Medium",
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    budget: "$200,000",
    members: [
      { name: "Alice Davis", role: "Project Manager", avatar: "AD", online: true },
      { name: "David Wilson", role: "UI/UX Designer", avatar: "DW", online: true }
    ],
    tasks: [
      { name: "Requirements gathering", status: "Completed", due: "1 week ago" },
      { name: "Design mockups", status: "In Progress", due: "This week" },
      { name: "Development setup", status: "Pending", due: "Next month" }
    ]
  },
  {
    id: 3,
    name: "Inkhub Docs",
    description: "Documentation platform for development teams",
    company: "Inkhub",
    status: "Active",
    progress: 45,
    priority: "Medium",
    startDate: "2024-02-01",
    endDate: "2024-07-31",
    budget: "$120,000",
    members: [
      { name: "Emma Foster", role: "Tech Lead", avatar: "EF", online: true },
      { name: "Frank Garcia", role: "Developer", avatar: "FG", online: false }
    ],
    tasks: [
      { name: "API documentation", status: "Completed", due: "3 days ago" },
      { name: "User guides", status: "In Progress", due: "This week" },
      { name: "Search functionality", status: "Pending", due: "Next week" }
    ]
  }
];

// Mock data for all tasks
const allTasks = [
  {
    id: 1,
    title: "Design User Interface Components",
    description: "Create reusable UI components for the dashboard with modern design patterns",
    status: "In Progress",
    priority: "High",
    assignee: "Sarah Johnson",
    dueDate: "2024-02-15",
    project: "E-commerce Platform",
    tags: ["Design", "Frontend"],
    progress: 75,
    timeSpent: "12h",
    estimatedTime: "16h",
    comments: 8,
    likes: 5,
    views: 24,
    created: "2024-01-20",
    lastActivity: "2 hours ago"
  },
  {
    id: 2,
    title: "Implement Authentication System",
    description: "Set up JWT authentication with role-based access control",
    status: "To Do",
    priority: "High",
    assignee: "Mike Chen",
    dueDate: "2024-02-20",
    project: "E-commerce Platform",
    tags: ["Backend", "Security"],
    progress: 0,
    timeSpent: "0h",
    estimatedTime: "24h",
    comments: 3,
    likes: 2,
    views: 18,
    created: "2024-01-22",
    lastActivity: "1 day ago"
  },
  {
    id: 3,
    title: "Database Schema Design",
    description: "Design and implement the database schema for the e-commerce platform",
    status: "Completed",
    priority: "Medium",
    assignee: "Alex Lee",
    dueDate: "2024-02-10",
    project: "Client Portal",
    tags: ["Database", "Backend"],
    progress: 100,
    timeSpent: "20h",
    estimatedTime: "18h",
    comments: 12,
    likes: 8,
    views: 35,
    created: "2024-01-15",
    lastActivity: "3 days ago"
  }
];

// Mock data for all teams
const allTeams = [
  {
    id: 1,
    name: "Frontend Development",
    description: "Responsible for user interface and user experience",
    company: "Whapi Corp",
    lead: "Sarah Johnson",
    members: [
      { name: "Sarah Johnson", role: "Team Lead", avatar: "SJ", online: true },
      { name: "Mike Chen", role: "UI/UX Designer", avatar: "MC", online: true },
      { name: "Alice Davis", role: "Frontend Developer", avatar: "AD", online: false }
    ],
    projects: ["E-commerce Platform", "Client Portal"],
    activeTasks: 8,
    completedTasks: 12
  },
  {
    id: 2,
    name: "Backend Development",
    description: "Handles server-side logic and database operations",
    company: "Whapi Corp",
    lead: "Alex Lee",
    members: [
      { name: "Alex Lee", role: "Team Lead", avatar: "AL", online: false },
      { name: "Henry Miller", role: "Senior Developer", avatar: "HM", online: true },
      { name: "Frank Garcia", role: "Backend Developer", avatar: "FG", online: true }
    ],
    projects: ["E-commerce Platform", "Whapi Project Management"],
    activeTasks: 6,
    completedTasks: 15
  },
  {
    id: 3,
    name: "Quality Assurance",
    description: "Ensures product quality through testing and validation",
    company: "Whapi Corp",
    lead: "Ivy Chen",
    members: [
      { name: "Ivy Chen", role: "QA Lead", avatar: "IC", online: false },
      { name: "Grace Brown", role: "QA Engineer", avatar: "GB", online: true }
    ],
    projects: ["Whapi Project Management"],
    activeTasks: 4,
    completedTasks: 8
  },
  {
    id: 4,
    name: "Product Management",
    description: "Defines product strategy and manages development roadmap",
    company: "Inkhub",
    lead: "Emma Foster",
    members: [
      { name: "Emma Foster", role: "Product Manager", avatar: "EF", online: true },
      { name: "Sarah Johnson", role: "Project Lead", avatar: "SJ", online: true }
    ],
    projects: ["Inkhub Docs"],
    activeTasks: 3,
    completedTasks: 5
  }
];

const companies = [
  {
    id: 1,
    name: "whapi project management",
    expanded: true,
    sections: {
      projects: { expanded: false },
      departments: { expanded: false, subdepartments: [] },
      teams: { expanded: false, subteams: [] },
      sprints: { expanded: false },
      calendar: { expanded: false },
      stories: { expanded: false, substories: ["User Authentication", "Payment Integration", "Mobile Design"] },
      tasks: { expanded: false, subtasks: ["Task 1", "Task 2", "Task 3"] }
    }
  }
];

// Mock data for calendar events
const allCalendarEvents = [
  {
    id: 1,
    title: "Sprint Planning Meeting",
    description: "Plan tasks and assign responsibilities for the upcoming sprint",
    date: "2024-02-15",
    time: "10:00 AM",
    duration: "2 hours",
    type: "Meeting",
    attendees: ["Sarah Johnson", "Mike Chen", "Alex Lee"],
    project: "E-commerce Platform",
    status: "Scheduled"
  },
  {
    id: 2,
    title: "Code Review Session",
    description: "Review pull requests and discuss implementation details",
    date: "2024-02-16",
    time: "2:00 PM",
    duration: "1 hour",
    type: "Review",
    attendees: ["Alex Lee", "Henry Miller"],
    project: "Whapi Project Management",
    status: "Confirmed"
  },
  {
    id: 3,
    title: "Client Demo Presentation",
    description: "Present project progress to client stakeholders",
    date: "2024-02-17",
    time: "11:00 AM",
    duration: "1.5 hours",
    type: "Presentation",
    attendees: ["Emma Foster", "Sarah Johnson", "Client Team"],
    project: "Client Portal",
    status: "Pending"
  },
  {
    id: 4,
    title: "Team Retrospective",
    description: "Discuss what went well and areas for improvement",
    date: "2024-02-18",
    time: "3:00 PM",
    duration: "1 hour",
    type: "Retrospective",
    attendees: ["All Team Members"],
    project: "Inkhub Docs",
    status: "Scheduled"
  }
];

// Mock data for reports
const allReports = [
  {
    id: 1,
    title: "Project Performance Report",
    description: "Comprehensive analysis of project metrics and KPIs",
    type: "Performance",
    date: "2024-02-14",
    author: "Sarah Johnson",
    status: "Published",
    metrics: {
      completionRate: "78%",
      velocity: "85",
      qualityScore: "92%",
      budgetUtilization: "87%"
    },
    projects: ["E-commerce Platform", "Client Portal"]
  },
  {
    id: 2,
    title: "Team Productivity Analysis",
    description: "Detailed breakdown of team performance and productivity trends",
    type: "Productivity",
    date: "2024-02-13",
    author: "Alex Lee",
    status: "Draft",
    metrics: {
      tasksCompleted: "156",
      averageCycleTime: "3.2 days",
      teamVelocity: "89",
      defectRate: "2.1%"
    },
    teams: ["Frontend Development", "Backend Development"]
  },
  {
    id: 3,
    title: "Budget vs Actual Report",
    description: "Financial analysis comparing planned vs actual project costs",
    type: "Financial",
    date: "2024-02-12",
    author: "Emma Foster",
    status: "Published",
    metrics: {
      totalBudget: "$450,000",
      actualSpent: "$387,000",
      variance: "+$63,000",
      efficiency: "86%"
    },
    projects: ["All Active Projects"]
  },
  {
    id: 4,
    title: "Quality Metrics Dashboard",
    description: "Quality assurance metrics and testing coverage analysis",
    type: "Quality",
    date: "2024-02-11",
    author: "Ivy Chen",
    status: "Published",
    metrics: {
      testCoverage: "94%",
      defectDensity: "1.8",
      customerSatisfaction: "4.6/5",
      uptime: "99.7%"
    },
    projects: ["Whapi Project Management"]
  }
];



export default function ContextSidebar({ 
  activeTab = 0, 
  onAddProject, 
  onAddDepartments, 
  onAddTeams, 
  onAddSprints,
  onAddStories,
  onAddTasks,
  onOpenCompanyProjects,
  onClose
}: {
  activeTab?: number,
  onAddProject?: () => void,
  onAddDepartments?: () => void,
  onAddTeams?: () => void,
  onAddSprints?: () => void,
  onAddStories?: () => void,
  onAddTasks?: () => void,
  onOpenCompanyProjects?: (companyName: string) => void,
  onClose?: () => void,
}) {
  const [companiesList, setCompaniesList] = useState(companies);
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
  const [expandedTeams, setExpandedTeams] = useState<number[]>([]);
  const [expandedCalendarEvents, setExpandedCalendarEvents] = useState<number[]>([]);
  const [expandedReports, setExpandedReports] = useState<number[]>([]);

  // Helper to toggle section expansion
  const toggleSection = (companyId: number, section: string) => {
    setCompaniesList(prev => prev.map(c =>
      c.id === companyId
        ? { ...c, sections: { ...c.sections, [section]: { ...c.sections[section as keyof typeof c.sections], expanded: !c.sections[section as keyof typeof c.sections].expanded } } }
        : c
    ));
  };

  // Helper to toggle nested section expansion (like stories within sprints)
  const toggleNestedSection = (companyId: number, parentSection: string, nestedSection: string) => {
    console.log('Toggling nested section:', { companyId, parentSection, nestedSection });
    setCompaniesList(prev => {
      const newList = prev.map(c =>
        c.id === companyId
          ? { 
              ...c, 
              sections: { 
                ...c.sections, 
                                [parentSection]: {
                  ...c.sections[parentSection as keyof typeof c.sections],
                  [nestedSection]: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ...(c.sections[parentSection as keyof typeof c.sections] as any)[nestedSection],
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    expanded: !(c.sections[parentSection as keyof typeof c.sections] as any)[nestedSection].expanded
                  }
                } 
              } 
            }
          : c
      );
      console.log('New companies list:', newList);
      return newList;
    });
  };

  // Helper functions for expanding/collapsing items
  const toggleProject = (projectId: number) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
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

  const toggleCalendarEvent = (eventId: number) => {
    setExpandedCalendarEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const toggleReport = (reportId: number) => {
    setExpandedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

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
              {onClose && (
                <button 
                  className="p-1 rounded hover:bg-neutral-100 text-neutral-600" 
                  aria-label="Close sidebar"
                  onClick={onClose}
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
            {activeTab === 1 && (
              /* All Projects Content */
              <div className="space-y-3">
                {allProjects.map((project) => (
                  <div key={project.id} className="border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-neutral-900">{project.name}</h3>
                      <button
                        onClick={() => toggleProject(project.id)}
                        className="p-1 rounded hover:bg-neutral-100"
                      >
                        {expandedProjects.includes(project.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-600 mb-2">{project.description}</p>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{project.status}</span>
                      <span>{project.progress}%</span>
                    </div>
                    {expandedProjects.includes(project.id) && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-neutral-600">
                          <strong>Company:</strong> {project.company}
                        </div>
                        <div className="text-xs text-neutral-600">
                          <strong>Budget:</strong> {project.budget}
                        </div>
                        <div className="text-xs text-neutral-600">
                          <strong>Timeline:</strong> {project.startDate} - {project.endDate}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 2 && (
              /* All Tasks Content */
              <div className="space-y-3">
                {allTasks.map((task) => (
                  <div key={task.id} className="border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-neutral-900">{task.title}</h3>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="p-1 rounded hover:bg-neutral-100"
                      >
                        {expandedTasks.includes(task.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-600 mb-2">{task.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {task.status}
                      </span>
                      <span className="text-neutral-500">{task.assignee}</span>
                    </div>
                    {expandedTasks.includes(task.id) && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-neutral-600">
                          <strong>Project:</strong> {task.project}
                        </div>
                        <div className="text-xs text-neutral-600">
                          <strong>Due:</strong> {task.dueDate}
                        </div>
                        <div className="text-xs text-neutral-600">
                          <strong>Progress:</strong> {task.progress}%
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 3 && (
              /* All Teams Content */
              <div className="space-y-3">
                {allTeams.map((team) => (
                  <div key={team.id} className="border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-neutral-900">{team.name}</h3>
                      <button
                        onClick={() => toggleTeam(team.id)}
                        className="p-1 rounded hover:bg-neutral-100"
                      >
                        {expandedTeams.includes(team.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-600 mb-2">{team.description}</p>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>Lead: {team.lead}</span>
                      <span>{team.activeTasks} active tasks</span>
                    </div>
                    {expandedTeams.includes(team.id) && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-neutral-600">
                          <strong>Company:</strong> {team.company}
                        </div>
                        <div className="text-xs text-neutral-600">
                          <strong>Members:</strong> {team.members.length}
                        </div>
                        <div className="text-xs text-neutral-600">
                          <strong>Projects:</strong> {team.projects.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 4 && (
              /* Companies Content */
              <nav className="space-y-1">
                {companiesList.map((company) => (
                  <div key={company.id} className="space-y-1">
                    {/* Company Header */}
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

                    {/* Company Sections - Only show when expanded */}
                    {company.expanded && (
                      <div className="ml-6 space-y-1">
                        {/* Projects */}
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50 group">
                          <ChevronRight size={16} className="text-neutral-400" />
                          <FolderKanban size={16} className="text-blue-400" />
                          <span className="text-sm font-medium">Projects</span>
                          <button
                            className="ml-auto w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                            onClick={() => { 
                              if (onOpenCompanyProjects) onOpenCompanyProjects(company.name);
                            }}
                          >
                            <Plus size={12} className="text-white" />
                          </button>
                        </div>

                        {/* Departments */}
                        <div>
                          <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50 group"
                            onClick={() => toggleSection(company.id, "departments")}
                          >
                            {company.sections.departments.expanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                            <Building size={16} className="text-purple-500" />
                            <span className="text-sm font-medium">Departments</span>
                            <button
                              className="ml-auto w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                              onClick={e => { e.stopPropagation(); if (onAddDepartments) onAddDepartments(); }}
                            >
                              <Plus size={12} className="text-white" />
                            </button>
                          </div>
                          {company.sections.departments.expanded && (
                            <div className="ml-6 space-y-1">
                              {company.sections.departments.subdepartments && company.sections.departments.subdepartments.map((sub) => (
                                <div key={sub} className="flex items-center gap-2 px-3 py-1 rounded-lg text-neutral-600 hover:bg-neutral-100">
                                  <ChevronRight size={14} className="text-neutral-300" />
                                  <Building size={14} className="text-purple-400" />
                                  <span className="text-xs">{sub}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Teams */}
                        <div>
                          <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50 group"
                            onClick={() => toggleSection(company.id, "teams")}
                          >
                            {company.sections.teams.expanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                            <Users size={16} className="text-blue-500" />
                            <span className="text-sm font-medium">Teams</span>
                            <button
                              className="ml-auto w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                              onClick={e => { e.stopPropagation(); if (onAddTeams) onAddTeams(); }}
                            >
                              <Plus size={12} className="text-white" />
                            </button>
                          </div>
                          {company.sections.teams.expanded && (
                            <div className="ml-6 space-y-1">
                              {company.sections.teams.subteams && company.sections.teams.subteams.map((sub) => (
                                <div key={sub} className="flex items-center gap-2 px-3 py-1 rounded-lg text-neutral-600 hover:bg-neutral-100">
                                  <ChevronRight size={14} className="text-neutral-300" />
                                  <Building size={14} className="text-blue-400" />
                                  <span className="text-xs">{sub}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Sprints */}
                        <div>
                          <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50 group"
                            onClick={() => toggleSection(company.id, "sprints")}
                          >
                            {company.sections.sprints.expanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                            <Zap size={16} className="text-pink-500" />
                            <span className="text-sm font-medium">Sprints</span>
                            <button
                              className="ml-auto w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                              onClick={e => { e.stopPropagation(); if (onAddSprints) onAddSprints(); }}
                            >
                              <Plus size={12} className="text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Calendar */}
                        <div>
                          <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50 group"
                            onClick={() => toggleSection(company.id, "calendar")}
                          >
                            {company.sections.calendar.expanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                            <Calendar size={16} className="text-purple-500" />
                            <span className="text-sm font-medium">Calendar</span>
                          </div>
                          {company.sections.calendar.expanded && (
                            <div className="ml-6 space-y-1">
                              <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-neutral-600 hover:bg-neutral-100">
                                <Calendar size={14} className="text-purple-400" />
                                <span className="text-xs">Sprint Calendar</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Stories */}
                        <div>
                          <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50 group"
                            onClick={() => toggleSection(company.id, "stories")}
                          >
                            {company.sections.stories.expanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                            <BookOpen size={16} className="text-orange-500" />
                            <span className="text-sm font-medium">Stories</span>
                            <button
                              className="ml-auto w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                              onClick={e => { e.stopPropagation(); if (onAddStories) onAddStories(); }}
                            >
                              <Plus size={12} className="text-white" />
                            </button>
                          </div>
                          {company.sections.stories.expanded && (
                            <div className="ml-6 space-y-1">
                              {company.sections.stories.substories && company.sections.stories.substories.map((story) => (
                                <div key={story} className="flex items-center gap-2 px-3 py-1 rounded-lg text-neutral-600 hover:bg-neutral-100">
                                  <ChevronRight size={14} className="text-neutral-300" />
                                  <BookOpen size={14} className="text-orange-400" />
                                  <span className="text-xs">{story}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Tasks */}
                        <div>
                          <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-neutral-700 hover:bg-neutral-50 group"
                            onClick={() => toggleSection(company.id, "tasks")}
                          >
                            {company.sections.tasks.expanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                            <CheckSquare size={16} className="text-green-500" />
                            <span className="text-sm font-medium">Tasks</span>
                            <button
                              className="ml-auto w-6 h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                              onClick={e => { e.stopPropagation(); if (onAddTasks) onAddTasks(); }}
                            >
                              <Plus size={12} className="text-white" />
                            </button>
                          </div>
                          {company.sections.tasks.expanded && (
                            <div className="ml-6 space-y-1">
                              {company.sections.tasks.subtasks && company.sections.tasks.subtasks.map((task) => (
                                <div key={task} className="flex items-center gap-2 px-3 py-1 rounded-lg text-neutral-600 hover:bg-neutral-100">
                                  <ChevronRight size={14} className="text-neutral-300" />
                                  <CheckSquare size={14} className="text-green-400" />
                                  <span className="text-xs">{task}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            )}

            {activeTab === 5 && (
              /* Calendar Events Content */
              <div className="space-y-3">
                {allCalendarEvents.map((event) => (
                  <div key={event.id} className="border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-neutral-900">{event.title}</h3>
                      <button
                        onClick={() => toggleCalendarEvent(event.id)}
                        className="p-1 rounded hover:bg-neutral-100"
                      >
                        {expandedCalendarEvents.includes(event.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-600 mb-2">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>{event.date} at {event.time}</span>
                      <span>{event.duration}</span>
                    </div>
                    {expandedCalendarEvents.includes(event.id) && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-neutral-600">
                          <strong>Type:</strong> {event.type}
                        </div>
                        <div className="text-xs text-neutral-600">
                          <strong>Project:</strong> {event.project}
                        </div>
                        <div className="text-xs text-neutral-600">
                          <strong>Attendees:</strong> {event.attendees.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 6 && (
              /* All Reports Content */
              <div className="space-y-3">
                {allReports.map((report) => (
                  <div key={report.id} className="border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-neutral-900">{report.title}</h3>
                      <button
                        onClick={() => toggleReport(report.id)}
                        className="p-1 rounded hover:bg-neutral-100"
                      >
                        {expandedReports.includes(report.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
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
                    {expandedReports.includes(report.id) && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-neutral-600">
                          <strong>Type:</strong> {report.type}
                        </div>
                        <div className="text-xs text-neutral-600">
                          <strong>Date:</strong> {report.date}
                        </div>
                        <div className="text-xs text-neutral-600">
                          <strong>Metrics:</strong> {Object.entries(report.metrics).map(([key, value]) => `${key}: ${value}`).join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
} 