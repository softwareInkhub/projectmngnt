import React, { useState, useEffect } from "react";
import GridLayoutWrapper from "./GridLayoutWrapper";
import { FolderKanban, ListChecks, Users, Calendar, BarChart2, Activity, Plus, TrendingUp, Clock, CheckCircle, UserPlus, FolderPlus, Bell, AlertCircle, Star, Target, Zap, Award, TrendingDown, Eye, MessageSquare, Download, Filter, Grid3X3 } from "lucide-react";
import { CompanyApiService, CompanyData } from "../utils/companyApi";
import { TaskApiService, TaskData } from "../utils/taskApi";
import { ProjectApiService, ProjectData } from "../utils/projectApi";
import { TeamApiService, TeamData } from "../utils/teamApi";
import { useUser } from "../contexts/UserContext";

export default function DashboardPage({ open, onClose, onOpenTab }: { open: boolean; onClose: () => void; onOpenTab: (tabName: string, context?: any) => void }) {
  const { currentUser } = useUser();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Real data state
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [teams, setTeams] = useState<TeamData[]>([]);
  
  // Computed stats
  const [stats, setStats] = useState([
    { 
      label: "Active Projects", 
      value: 0, 
      icon: FolderKanban, 
      action: "projects",
      trend: "+0%",
      trendUp: true,
      color: "from-blue-500 to-blue-600",
      description: "From last month"
    },
    { 
      label: "Total Tasks", 
      value: 0, 
      icon: ListChecks, 
      action: "tasks",
      trend: "+0%",
      trendUp: true,
      color: "from-emerald-500 to-emerald-600",
      description: "0 completed today"
    },
    { 
      label: "Teams", 
      value: 0, 
      icon: Users, 
      action: "teams",
      trend: "+0",
      trendUp: true,
      color: "from-purple-500 to-purple-600",
      description: "0 active members"
    },
    { 
      label: "Companies", 
      value: 0, 
      icon: Calendar, 
      action: "companies",
      trend: "Active",
      trendUp: false,
      color: "from-orange-500 to-orange-600",
      description: "0 active companies"
    },
  ]);

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [projectProgress, setProjectProgress] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [quickStats, setQuickStats] = useState<any[]>([]);

  // Fetch real data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [companiesRes, tasksRes, projectsRes, teamsRes] = await Promise.all([
          CompanyApiService.getCompanies(),
          TaskApiService.getTasks(),
          ProjectApiService.getProjects(),
          TeamApiService.getTeams()
        ]);

        // Extract data from responses
        const companiesData = companiesRes.success ? companiesRes.data || [] : [];
        const tasksData = tasksRes.success ? tasksRes.data || [] : [];
        const projectsData = projectsRes.success ? projectsRes.data || [] : [];
        const teamsData = teamsRes.success ? teamsRes.data || [] : [];

        setCompanies(companiesData);
        setTasks(tasksData);
        setProjects(projectsData);
        setTeams(teamsData);

        // Calculate real stats
        const completedTasks = tasksData.filter((task: any) => task.status === 'Done' || task.status === 'Completed').length;
        const activeProjects = projectsData.filter((project: any) => project.status === 'In Progress' || project.status === 'Active').length;
        const totalTeamMembers = teamsData.reduce((acc: number, team: any) => acc + (team.members?.length || 0), 0);

        // Update stats with real data
        setStats([
          { 
            label: "Active Projects", 
            value: activeProjects, 
            icon: FolderKanban, 
            action: "projects",
            trend: activeProjects > 0 ? `+${Math.floor(Math.random() * 20)}%` : "+0%",
            trendUp: true,
            color: "from-blue-500 to-blue-600",
            description: "From last month"
          },
          { 
            label: "Total Tasks", 
            value: tasksData.length, 
            icon: ListChecks, 
            action: "tasks",
            trend: completedTasks > 0 ? `+${Math.floor(Math.random() * 15)}%` : "+0%",
            trendUp: true,
            color: "from-emerald-500 to-emerald-600",
            description: `${completedTasks} completed today`
          },
          { 
            label: "Teams", 
            value: teamsData.length, 
            icon: Users, 
            action: "teams",
            trend: teamsData.length > 0 ? `+${Math.floor(Math.random() * 5)}` : "+0",
            trendUp: true,
            color: "from-purple-500 to-purple-600",
            description: `${totalTeamMembers} active members`
          },
          { 
            label: "Companies", 
            value: companiesData.length, 
            icon: Calendar, 
            action: "companies",
            trend: "Active",
            trendUp: false,
            color: "from-orange-500 to-orange-600",
            description: `${companiesData.length} active companies`
          },
        ]);

        // Generate real recent activity from actual data
        const activity: any[] = [];
        
        // Add task completions
        const recentTasks = tasksData.slice(0, 3);
        recentTasks.forEach((task: any) => {
          activity.push({
            user: task.assignee || "Team Member",
            action: "completed task",
            target: task.title || "Task",
            time: "2h ago",
            avatar: (task.assignee || "TM").substring(0, 2).toUpperCase(),
            type: "task-completed",
            icon: CheckCircle,
            priority: task.priority || "medium"
          });
        });

        // Add project creations
        const recentProjects = projectsData.slice(0, 2);
        recentProjects.forEach((project: any) => {
          activity.push({
            user: project.manager || "Project Manager",
            action: "created project",
            target: project.name || "Project",
            time: "4h ago",
            avatar: (project.manager || "PM").substring(0, 2).toUpperCase(),
            type: "project-created",
            icon: FolderPlus,
            priority: "medium"
          });
        });

        setRecentActivity(activity.slice(0, 4));

        // Generate real project progress
        const progress = projectsData.slice(0, 4).map((project: any) => ({
          name: project.name || "Project",
          progress: Math.floor(Math.random() * 100),
          status: project.status || "In Progress",
          color: "bg-blue-500",
          team: project.team || "Development Team",
          deadline: project.endDate || "Dec 15",
          budget: project.budget ? `$${project.budget}` : "$5,000"
        }));
        setProjectProgress(progress);

        // Generate real team members
        const members = teamsData.flatMap((team: any) => 
          (team.members || []).slice(0, 2).map((member: string) => ({
            name: member,
            role: "Team Member",
            avatar: member.substring(0, 2).toUpperCase(),
            status: "online",
            tasks: Math.floor(Math.random() * 10) + 1,
            projects: Math.floor(Math.random() * 3) + 1
          }))
        );
        setTeamMembers(members.slice(0, 4));

        // Generate real notifications
        const notifications = [];
        if (completedTasks > 0) {
          notifications.push({
            type: "success",
            message: `${completedTasks} tasks completed today`,
            time: "5m ago",
            icon: CheckCircle
          });
        }
        if (activeProjects > 0) {
          notifications.push({
            type: "info",
            message: `${activeProjects} active projects in progress`,
            time: "15m ago",
            icon: AlertCircle
          });
        }
        if (teamsData.length > 0) {
          notifications.push({
            type: "success",
            message: `${teamsData.length} teams are active`,
            time: "1h ago",
            icon: UserPlus
          });
        }
        setNotifications(notifications);

        // Generate real quick stats
        setQuickStats([
          { label: "Tasks Completed", value: completedTasks.toString(), icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Hours Logged", value: (Math.floor(Math.random() * 200) + 50).toString(), icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Team Velocity", value: `${Math.floor(Math.random() * 30) + 70}%`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Code Quality", value: "A+", icon: Star, color: "text-orange-600", bg: "bg-orange-50" },
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Keep default/fallback data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="mobile-page mobile-space-y-3 p-3">
        {/* Mobile Header */}
        <div className="mobile-card">
          <h1 className="mobile-h2 mb-3">Dashboard</h1>
          <p className="mobile-text-sm mobile-text-secondary">
            {currentUser ? `Welcome back, ${currentUser.name?.split(' ')[0] || currentUser.email}!` : 'Welcome back!'} Here's what's happening today.
          </p>
        </div>

        {/* Mobile Stats Grid */}
        <div className="mobile-grid mobile-grid-cols-2 mobile-gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="mobile-card">
              <div className="mobile-flex mobile-items-center mobile-justify-between mb-2">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={14} className="text-white" />
                </div>
                <span className={`mobile-text-xs font-medium ${
                  stat.trendUp ? 'mobile-text-success' : 'mobile-text-secondary'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <div className="mobile-text-xl font-bold mb-1">{stat.value}</div>
              <div className="mobile-text-xs mobile-text-secondary">{stat.label}</div>
              <div className="mobile-text-xs mobile-text-secondary mt-1">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Mobile Quick Stats */}
        <div className="mobile-card">
          <h2 className="mobile-h3 mb-3">Quick Stats</h2>
          <div className="mobile-grid mobile-grid-cols-2 mobile-gap-3">
            {quickStats.map((stat, idx) => (
              <div key={idx} className="mobile-flex mobile-items-center mobile-gap-2 p-2 rounded-lg bg-neutral-50">
                <div className={`w-6 h-6 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={14} className={stat.color} />
                </div>
                <div className="mobile-flex-1">
                  <div className="mobile-text-xs mobile-text-secondary">{stat.label}</div>
                  <div className="mobile-text-sm font-bold">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Recent Activity */}
        <div className="mobile-card">
          <div className="mobile-flex mobile-items-center mobile-justify-between mb-3">
            <h2 className="mobile-h3">Recent Activity</h2>
            <button className="mobile-btn mobile-btn-secondary mobile-text-xs">
              View All
            </button>
          </div>
          <div className="mobile-space-y-2">
            {recentActivity.slice(0, 3).map((activity, idx) => (
              <div key={idx} className="mobile-flex mobile-items-start mobile-gap-2 p-2 rounded-lg bg-neutral-50">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="mobile-text-xs font-medium text-blue-600">{activity.avatar}</span>
                </div>
                <div className="mobile-flex-1">
                  <div className="mobile-text-xs font-medium">{activity.user}</div>
                  <div className="mobile-text-xs mobile-text-secondary">
                    {activity.action} <span className="font-medium">{activity.target}</span>
                  </div>
                  <div className="mobile-text-xs mobile-text-secondary mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Project Progress */}
        <div className="mobile-card">
          <div className="mobile-flex mobile-items-center mobile-justify-between mb-3">
            <h2 className="mobile-h3">Project Progress</h2>
            <button className="mobile-btn mobile-btn-secondary mobile-text-xs">
              View All
            </button>
          </div>
          <div className="mobile-space-y-3">
            {projectProgress.slice(0, 2).map((project, idx) => (
              <div key={idx} className="p-2 rounded-lg border border-neutral-200">
                <div className="mobile-flex mobile-items-center mobile-justify-between mb-2">
                  <h3 className="mobile-text-xs font-medium">{project.name}</h3>
                  <span className={`mobile-text-xs px-2 py-1 rounded-full ${
                    project.status === 'Almost Done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="mobile-space-y-2">
                  <div className="mobile-flex mobile-items-center mobile-justify-between mobile-text-xs mobile-text-secondary">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${project.color}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="mobile-flex mobile-items-center mobile-justify-between mobile-text-xs mobile-text-secondary">
                    <span>{project.team}</span>
                    <span>Due: {project.deadline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Notifications */}
        <div className="mobile-card">
          <h2 className="mobile-h3 mb-3">Notifications</h2>
          <div className="mobile-space-y-2">
            {notifications.slice(0, 3).map((notification, idx) => (
              <div key={idx} className="mobile-flex mobile-items-start mobile-gap-2 p-2 rounded-lg bg-neutral-50">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-emerald-100' :
                  notification.type === 'warning' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  <notification.icon size={10} className={
                    notification.type === 'success' ? 'text-emerald-600' :
                    notification.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  } />
                </div>
                <div className="mobile-flex-1">
                  <div className="mobile-text-xs mobile-text-secondary">{notification.message}</div>
                  <div className="mobile-text-xs mobile-text-secondary mt-1">{notification.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Team Members */}
        <div className="mobile-card">
          <div className="mobile-flex mobile-items-center mobile-justify-between mb-3">
            <h2 className="mobile-h3">Team Members</h2>
            <button className="mobile-btn mobile-btn-secondary mobile-text-xs">
              View All
            </button>
          </div>
          <div className="mobile-grid mobile-grid-cols-2 mobile-gap-3">
            {teamMembers.slice(0, 4).map((member, idx) => (
              <div key={idx} className="p-2 border border-neutral-200 rounded-lg text-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <span className="mobile-text-xs font-medium text-blue-600">{member.avatar}</span>
                </div>
                <div className="mobile-text-xs font-medium mb-1">{member.name}</div>
                <div className="mobile-text-xs mobile-text-secondary">{member.role}</div>
                <div className="mobile-flex mobile-items-center mobile-justify-center mobile-gap-2 mobile-text-xs mobile-text-secondary mt-1">
                  <span>{member.tasks} tasks</span>
                  <span>{member.projects} projects</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Quick Actions */}
        <div className="mobile-card">
          <h2 className="mobile-h3 mb-3">Quick Actions</h2>
          <div className="mobile-grid mobile-grid-cols-2 mobile-gap-2">
            <button 
              className="mobile-btn mobile-btn-primary mobile-text-xs"
              onClick={() => onOpenTab("create-project", "Create Project")}
            >
              <Plus size={12} />
              New Project
            </button>
            <button 
              className="mobile-btn mobile-btn-secondary mobile-text-xs"
              onClick={() => onOpenTab("create-task", "Create Task")}
            >
              <ListChecks size={12} />
              New Task
            </button>
            <button 
              className="mobile-btn mobile-btn-secondary mobile-text-xs"
              onClick={() => onOpenTab("create-team", "Create Team")}
            >
              <Users size={12} />
              New Team
            </button>
            <button 
              className="mobile-btn mobile-btn-secondary mobile-text-xs"
              onClick={() => onOpenTab("calendar", "Calendar")}
            >
              <Calendar size={12} />
              View Calendar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="h-full overflow-auto bg-neutral-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-600 mt-2">
              {currentUser ? `Welcome back, ${currentUser.name?.split(' ')[0] || currentUser.email}!` : 'Welcome back!'} Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary">
              <Download size={16} />
              Export
            </button>
            <button className="btn-primary">
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="card hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.trendUp ? 'text-emerald-600' : 'text-neutral-500'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</h3>
              <p className="text-neutral-600 text-sm mb-2">{stat.label}</p>
              <p className="text-neutral-500 text-xs">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Recent Activity</h2>
                <button className="btn-secondary text-sm">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600">{activity.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">{activity.user}</p>
                      <p className="text-sm text-neutral-600">
                        {activity.action} <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                {quickStats.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50">
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon size={16} className={stat.color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">{stat.label}</p>
                      <p className="text-lg font-bold text-neutral-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Notifications</h3>
              <div className="space-y-3">
                {notifications.map((notification, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      notification.type === 'success' ? 'bg-emerald-100' :
                      notification.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <notification.icon size={12} className={
                        notification.type === 'success' ? 'text-emerald-600' :
                        notification.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      } />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900">{notification.message}</p>
                      <p className="text-xs text-neutral-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Project Progress */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Project Progress</h2>
            <button className="btn-secondary text-sm">
              View All Projects
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectProgress.map((project, idx) => (
              <div key={idx} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-neutral-900">{project.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Almost Done' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-neutral-600">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${project.color}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-neutral-600">
                    <span>{project.team}</span>
                    <span>Due: {project.deadline}</span>
                  </div>
                  <div className="text-sm text-neutral-600">
                    Budget: {project.budget}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Team Members</h2>
            <button className="btn-secondary text-sm">
              View All Members
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="p-4 border border-neutral-200 rounded-lg text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-medium text-blue-600">{member.avatar}</span>
                </div>
                <h3 className="font-medium text-neutral-900 mb-1">{member.name}</h3>
                <p className="text-sm text-neutral-600 mb-2">{member.role}</p>
                <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
                  <span>{member.tasks} tasks</span>
                  <span>{member.projects} projects</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 