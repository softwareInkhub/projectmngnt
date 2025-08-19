import React, { useState, useEffect } from "react";
import GridLayoutWrapper from "./GridLayoutWrapper";
import { FolderKanban, ListChecks, Users, Calendar, BarChart2, Activity, Plus, TrendingUp, Clock, CheckCircle, UserPlus, FolderPlus, Bell, AlertCircle, Star, Target, Zap, Award, TrendingDown, Eye, MessageSquare, Download, Filter, Grid3X3 } from "lucide-react";




const stats = [
  { 
    label: "Active Projects", 
    value: 8, 
    icon: FolderKanban, 
    action: "projects",
    trend: "+12%",
    trendUp: true,
    color: "from-blue-500 to-blue-600",
    description: "From last month"
  },
  { 
    label: "Total Tasks", 
    value: 124, 
    icon: ListChecks, 
    action: "tasks",
    trend: "+8%",
    trendUp: true,
    color: "from-emerald-500 to-emerald-600",
    description: "23 completed today"
  },
  { 
    label: "Teams", 
    value: 4, 
    icon: Users, 
    action: "teams",
    trend: "+2",
    trendUp: true,
    color: "from-purple-500 to-purple-600",
    description: "12 active members"
  },
  { 
    label: "Sprints", 
    value: 6, 
    icon: Calendar, 
    action: "sprints",
    trend: "On track",
    trendUp: false,
    color: "from-orange-500 to-orange-600",
    description: "2 ending this week"
  },
];

const recentActivity = [
  { 
    user: "Alice Johnson", 
    action: "completed task", 
    target: "Design UI", 
    time: "2h ago",
    avatar: "AJ",
    type: "task-completed",
    icon: CheckCircle,
    priority: "high"
  },
  { 
    user: "Bob Smith", 
    action: "created project", 
    target: "Client Portal", 
    time: "4h ago",
    avatar: "BS",
    type: "project-created",
    icon: FolderPlus,
    priority: "medium"
  },
  { 
    user: "Charlie Davis", 
    action: "added member", 
    target: "Team Alpha", 
    time: "1d ago",
    avatar: "CD",
    type: "member-added",
    icon: UserPlus,
    priority: "low"
  },
  { 
    user: "Diana Wilson", 
    action: "started sprint", 
    target: "Sprint 3", 
    time: "1d ago",
    avatar: "DW",
    type: "sprint-started",
    icon: Calendar,
    priority: "medium"
  },
];

const projectProgress = [
  { name: "E-commerce Platform", progress: 85, status: "In Progress", color: "bg-blue-500", team: "Frontend Team", deadline: "Dec 15", budget: "$12,500" },
  { name: "Mobile App", progress: 62, status: "In Progress", color: "bg-emerald-500", team: "Mobile Team", deadline: "Jan 20", budget: "$8,200" },
  { name: "Dashboard Redesign", progress: 45, status: "In Progress", color: "bg-purple-500", team: "Design Team", deadline: "Dec 30", budget: "$5,800" },
  { name: "API Integration", progress: 92, status: "Almost Done", color: "bg-orange-500", team: "Backend Team", deadline: "Dec 10", budget: "$3,200" },
];

const teamMembers = [
  { name: "Alice Johnson", role: "UI/UX Designer", avatar: "AJ", status: "online", tasks: 8, projects: 3 },
  { name: "Bob Smith", role: "Frontend Developer", avatar: "BS", status: "online", tasks: 12, projects: 2 },
  { name: "Charlie Davis", role: "Backend Developer", avatar: "CD", status: "away", tasks: 6, projects: 4 },
  { name: "Diana Wilson", role: "Project Manager", avatar: "DW", status: "online", tasks: 15, projects: 5 },
];

const notifications = [
  { type: "success", message: "Project &apos;E-commerce Platform&apos; is 85% complete", time: "5m ago", icon: CheckCircle },
  { type: "warning", message: "Sprint &apos;Mobile App v2&apos; ends in 2 days", time: "15m ago", icon: AlertCircle },
  { type: "info", message: "New team member &apos;Eve Chen&apos; joined", time: "1h ago", icon: UserPlus },
  { type: "success", message: "All tasks completed for &apos;Dashboard Redesign&apos;", time: "2h ago", icon: CheckCircle },
];

const quickStats = [
  { label: "Tasks Completed", value: "23", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Hours Logged", value: "156", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Team Velocity", value: "87%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Code Quality", value: "A+", icon: Star, color: "text-orange-600", bg: "bg-orange-50" },
];

export default function DashboardPage({ open, onClose, onOpenTab }: { open: boolean; onClose: () => void; onOpenTab: (tabName: string, context?: any) => void }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="mobile-page mobile-space-y-3 p-3">
        {/* Mobile Header */}
        <div className="mobile-card">
          <h1 className="mobile-h2 mb-3">Dashboard</h1>
          <p className="mobile-text-sm mobile-text-secondary">Welcome back! Here's what's happening today.</p>
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

  // Desktop layout (existing code)
  return (
    <div className="h-full overflow-auto bg-neutral-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-600 mt-2">Welcome back! Here's what's happening today.</p>
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
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trendUp ? 'text-green-600' : 'text-neutral-600'
                }`}>
                  {stat.trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stat.trend}
                </div>
              </div>
              <div className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</div>
              <div className="text-neutral-600 font-medium">{stat.label}</div>
              <div className="text-sm text-neutral-500 mt-2">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-lg hover:bg-neutral-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600">{activity.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-neutral-900">{activity.user}</span>
                        <span className="text-sm text-neutral-500">{activity.time}</span>
                      </div>
                      <p className="text-neutral-600">
                        {activity.action} <span className="font-medium">{activity.target}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <activity.icon size={16} className="text-neutral-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Progress */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Project Progress</h2>
                <button className="btn-secondary text-sm">
                  View All
                </button>
              </div>
              <div className="space-y-6">
                {projectProgress.map((project, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-neutral-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-neutral-900">{project.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'Almost Done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
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
                          className={`h-2 rounded-full transition-all duration-500 ${project.color}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-neutral-500">
                        <span>{project.team}</span>
                        <span>Due: {project.deadline}</span>
                      </div>
                      <div className="text-sm text-neutral-500">
                        Budget: {project.budget}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="mt-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Team Members</h2>
              <button className="btn-secondary text-sm">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">{member.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-neutral-900 truncate">{member.name}</div>
                      <div className="text-sm text-neutral-500">{member.role}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      member.status === 'online' ? 'bg-green-500' : 'bg-neutral-300'
                    }`} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-neutral-600">
                    <span>{member.tasks} tasks</span>
                    <span>{member.projects} projects</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 