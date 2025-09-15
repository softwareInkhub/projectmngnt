'use client';

import React, { useState } from 'react';
import GridLayoutWrapper from './GridLayoutWrapper';
import { 
  FolderKanban, 
  ListChecks, 
  Users, 
  Calendar, 
  BarChart2, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  UserPlus, 
  FolderPlus, 
  Bell, 
  AlertCircle, 
  Star, 
  Target, 
  Zap, 
  Award, 
  TrendingDown, 
  Eye, 
  MessageSquare, 
  Download, 
  Filter,
  Plus
} from 'lucide-react';

// Dashboard widget components
const StatsWidget = ({ title, value, icon: Icon, trend, trendUp, color, description }: any) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div className="flex items-center gap-1">
        {trendUp ? (
          <TrendingUp size={12} className="text-green-500" />
        ) : (
          <TrendingDown size={12} className="text-gray-400" />
        )}
        <span className="text-xs text-gray-500">{trend}</span>
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{title}</div>
    <div className="text-xs text-gray-400 mt-1">{description}</div>
  </div>
);

const ActivityWidget = ({ activities }: any) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
    <div className="flex items-center gap-2 mb-4">
      <Activity size={16} className="text-blue-600" />
      <h3 className="font-semibold text-gray-900">Recent Activity</h3>
    </div>
    <div className="space-y-3">
      {activities.map((activity: any, index: number) => (
        <div key={`activity-${index}`} className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold flex items-center justify-center">
            {activity.avatar}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{activity.user}</div>
            <div className="text-xs text-gray-600">{activity.action} {activity.target}</div>
            <div className="text-xs text-gray-400">{activity.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProgressWidget = ({ projects }: any) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
    <div className="flex items-center gap-2 mb-4">
      <BarChart2 size={16} className="text-green-600" />
      <h3 className="font-semibold text-gray-900">Project Progress</h3>
    </div>
    <div className="space-y-4">
      {projects.map((project: any, index: number) => (
        <div key={`project-${index}`} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">{project.name}</span>
            <span className="text-sm text-gray-600">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-full ${project.color} rounded-full transition-all duration-300`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">{project.team} • Due {project.deadline}</div>
        </div>
      ))}
    </div>
  </div>
);

const TeamWidget = ({ members }: any) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
    <div className="flex items-center gap-2 mb-4">
      <Users size={16} className="text-purple-600" />
      <h3 className="font-semibold text-gray-900">Team Overview</h3>
    </div>
    <div className="space-y-3">
      {members.map((member: any, index: number) => (
        <div key={`member-${index}`} className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-sm font-semibold flex items-center justify-center">
              {member.avatar}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-white ${
              member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{member.name}</div>
            <div className="text-xs text-gray-600">{member.role}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-gray-900">{member.tasks} tasks</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const NotificationsWidget = ({ notifications }: any) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
    <div className="flex items-center gap-2 mb-4">
      <Bell size={16} className="text-orange-600" />
      <h3 className="font-semibold text-gray-900">Notifications</h3>
    </div>
    <div className="space-y-3">
      {notifications.map((notification: any, index: number) => (
        <div key={`notification-${index}`} className="flex items-start gap-3">
          <div className={`p-1 rounded ${
            notification.type === 'success' ? 'bg-green-100 text-green-600' :
            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            <notification.icon size={12} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-700">{notification.message}</div>
            <div className="text-xs text-gray-400">{notification.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuickActionsWidget = ({ onOpenTab }: any) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
    <div className="flex items-center gap-2 mb-4">
      <Zap size={16} className="text-indigo-600" />
      <h3 className="font-semibold text-gray-900">Quick Actions</h3>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onOpenTab?.('create-project')}
        className="flex items-center gap-2 p-2 text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Plus size={14} />
        New Project
      </button>
      <button
        onClick={() => onOpenTab?.('create-task')}
        className="flex items-center gap-2 p-2 text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Plus size={14} />
        Add Task
      </button>
      <button
        onClick={() => onOpenTab?.('create-team')}
        className="flex items-center gap-2 p-2 text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Plus size={14} />
        Add Team
      </button>
      <button
        onClick={() => onOpenTab?.('create-sprint')}
        className="flex items-center gap-2 p-2 text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Plus size={14} />
        New Sprint
      </button>
    </div>
  </div>
);

// Sample data
const stats = [
  { 
    label: "Active Projects", 
    value: 8, 
    icon: FolderKanban, 
    trend: "+12%",
    trendUp: true,
    color: "bg-blue-500",
    description: "From last month"
  },
  { 
    label: "Total Tasks", 
    value: 124, 
    icon: ListChecks, 
    trend: "+8%",
    trendUp: true,
    color: "bg-green-500",
    description: "23 completed today"
  },
  { 
    label: "Teams", 
    value: 4, 
    icon: Users, 
    trend: "+2",
    trendUp: true,
    color: "bg-purple-500",
    description: "12 active members"
  },
  { 
    label: "Sprints", 
    value: 6, 
    icon: Calendar, 
    trend: "On track",
    trendUp: false,
    color: "bg-orange-500",
    description: "2 ending this week"
  },
];

const recentActivity = [
  { user: "Alice Johnson", action: "completed task", target: "Design UI", time: "2h ago", avatar: "AJ" },
  { user: "Bob Smith", action: "created project", target: "Client Portal", time: "4h ago", avatar: "BS" },
  { user: "Charlie Davis", action: "added member", target: "Team Alpha", time: "1d ago", avatar: "CD" },
];

const projectProgress = [
  { name: "E-commerce Platform", progress: 85, color: "bg-blue-500", team: "Frontend Team", deadline: "Dec 15" },
  { name: "Mobile App", progress: 62, color: "bg-green-500", team: "Mobile Team", deadline: "Jan 20" },
  { name: "Dashboard Redesign", progress: 45, color: "bg-purple-500", team: "Design Team", deadline: "Dec 30" },
];

const teamMembers = [
  { name: "Alice Johnson", role: "UI/UX Designer", avatar: "AJ", status: "online", tasks: 8 },
  { name: "Bob Smith", role: "Frontend Developer", avatar: "BS", status: "online", tasks: 12 },
  { name: "Charlie Davis", role: "Backend Developer", avatar: "CD", status: "away", tasks: 6 },
];

const notifications = [
  { type: "success", message: "Project 'E-commerce Platform' is 85% complete", time: "5m ago", icon: CheckCircle },
  { type: "warning", message: "Sprint 'Mobile App v2' ends in 2 days", time: "15m ago", icon: AlertCircle },
  { type: "info", message: "New team member 'Eve Chen' joined", time: "1h ago", icon: UserPlus },
];

// Default layout for dashboard widgets
const defaultLayout = [
  { i: 'stats-1', x: 0, y: 0, w: 3, h: 2, minW: 2, maxW: 6 },
  { i: 'stats-2', x: 3, y: 0, w: 3, h: 2, minW: 2, maxW: 6 },
  { i: 'stats-3', x: 6, y: 0, w: 3, h: 2, minW: 2, maxW: 6 },
  { i: 'stats-4', x: 9, y: 0, w: 3, h: 2, minW: 2, maxW: 6 },
  { i: 'activity', x: 0, y: 2, w: 4, h: 4, minW: 3, maxW: 6 },
  { i: 'progress', x: 4, y: 2, w: 4, h: 4, minW: 3, maxW: 6 },
  { i: 'team', x: 8, y: 2, w: 4, h: 4, minW: 3, maxW: 6 },
  { i: 'notifications', x: 0, y: 6, w: 6, h: 3, minW: 4, maxW: 8 },
  { i: 'quick-actions', x: 6, y: 6, w: 6, h: 3, minW: 4, maxW: 8 },
];

export default function GridDashboard({ onOpenTab }: { onOpenTab?: (type: string) => void }) {
  const [isGridMode, setIsGridMode] = useState(false);

  const handleLayoutChange = (layout: any, layouts: any) => {
    console.log('Layout changed:', layout, layouts);
  };

  const handleSaveLayout = (layouts: any) => {
    console.log('Layout saved:', layouts);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Manage your projects with customizable layouts</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGridMode(!isGridMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isGridMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isGridMode ? 'Exit Grid Mode' : 'Grid Mode'}
            </button>
            {!isGridMode && (
              <button
                onClick={() => setIsGridMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Customize Layout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      {isGridMode ? (
        <GridLayoutWrapper
          title="Dashboard Layout"
          defaultLayout={defaultLayout}
          onLayoutChange={handleLayoutChange}
          onSaveLayout={handleSaveLayout}
          className="p-4"
        >
          <div key="stats-1">
            <StatsWidget {...stats[0]} />
          </div>
          <div key="stats-2">
            <StatsWidget {...stats[1]} />
          </div>
          <div key="stats-3">
            <StatsWidget {...stats[2]} />
          </div>
          <div key="stats-4">
            <StatsWidget {...stats[3]} />
          </div>
          <div key="activity">
            <ActivityWidget activities={recentActivity} />
          </div>
          <div key="progress">
            <ProgressWidget projects={projectProgress} />
          </div>
          <div key="team">
            <TeamWidget members={teamMembers} />
          </div>
          <div key="notifications">
            <NotificationsWidget notifications={notifications} />
          </div>
          <div key="quick-actions">
            <QuickActionsWidget onOpenTab={onOpenTab} />
          </div>
        </GridLayoutWrapper>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <StatsWidget key={`stat-${index}`} {...stat} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ActivityWidget activities={recentActivity} />
            <ProgressWidget projects={projectProgress} />
            <TeamWidget members={teamMembers} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <NotificationsWidget notifications={notifications} />
            <QuickActionsWidget onOpenTab={onOpenTab} />
          </div>
        </div>
      )}
    </div>
  );
} 