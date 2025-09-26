'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users as UsersIcon,
  FolderOpen as FolderOpenIcon,
  CheckSquare as CheckSquareIcon,
  Building2,
  Calendar as CalendarIcon,
  MoreHorizontal,
  Eye,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { UserProvider } from '../contexts/UserContext';
import InviteUserForm from '../components/InviteUserForm';
import { ProjectApiService } from '../utils/projectApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://brmh.in";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedProjectName, setSelectedProjectName] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const idToken = localStorage.getItem('id_token');
        const uid = localStorage.getItem('user_id') || 'demo-user-123';
        const uname = localStorage.getItem('user_name') || 'Demo User';
        
        console.log('Auth check - User ID:', uid);
        console.log('Auth check - User Name:', uname);
        
        setCurrentUserId(uid);
        setCurrentUserName(uname);
        
        // Check if user has valid tokens (not mock tokens)
        if (accessToken && idToken && accessToken !== 'mock-token-disabled') {
          setIsAuthenticated(true);
        } else {
          router.push('/authPage');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/authPage');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [router]);

  // Listen for auth success events from auth page
  useEffect(() => {
    const handleAuthSuccess = () => {
      console.log('Auth success event received, redirecting to dashboard...');
      setIsAuthenticated(true);
    };

    window.addEventListener('auth-success', handleAuthSuccess);
    
    return () => {
      window.removeEventListener('auth-success', handleAuthSuccess);
    };
  }, []);

  // If needed, you can trigger the invite modal via a custom event elsewhere
  useEffect(() => {
    const handleOpenInviteModal = () => setShowInvite(true);
    window.addEventListener('open-invite-modal', handleOpenInviteModal);
    return () => window.removeEventListener('open-invite-modal', handleOpenInviteModal);
  }, []);

  // Fetch projects for selector (when authenticated)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects for invite selector...');
        const response = await ProjectApiService.getProjects();
        console.log('Projects API response:', response);
        
        if (response.success) {
          const items: any[] = (response as any).data || (response as any).items || [];
          console.log('Projects loaded:', items.length, 'items');
          setProjects(items);
          
          if (items.length > 0) {
            const first = items[0];
            const projectId = first.id || `project-${Date.now()}`;
            const projectName = first.name || 'Demo Project';
            
            console.log('Setting default project:', { projectId, projectName });
            setSelectedProjectId(projectId);
            setSelectedProjectName(projectName);
          } else {
            // Create a default project if none exist
            const defaultProjectId = `default-project-${Date.now()}`;
            const defaultProjectName = 'Default Project';
            
            console.log('No projects found, using default:', { defaultProjectId, defaultProjectName });
            setSelectedProjectId(defaultProjectId);
            setSelectedProjectName(defaultProjectName);
          }
        } else {
          console.warn('Failed to fetch projects:', response.error);
          // Use default project
          const defaultProjectId = `default-project-${Date.now()}`;
          const defaultProjectName = 'Default Project';
          setSelectedProjectId(defaultProjectId);
          setSelectedProjectName(defaultProjectName);
        }
      } catch (e) {
        console.warn('Failed to load projects for invite selector:', e);
        // Use default project
        const defaultProjectId = `default-project-${Date.now()}`;
        const defaultProjectName = 'Default Project';
        setSelectedProjectId(defaultProjectId);
        setSelectedProjectName(defaultProjectName);
      }
    };
    if (isAuthenticated) fetchProjects();
  }, [isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to auth page
  }

  return (
    <UserProvider>
      {/* Consolidated Dashboard Content - Inlined */}
      <InlinedDashboard
        onOpenTab={(tabName: string) => {
          console.log('Open tab requested:', tabName);
        }}
      />

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200">
            {/* Project selector header */}
            <div className="p-4 border-b border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  const pid = e.target.value;
                  setSelectedProjectId(pid);
                  const proj = projects.find((p) => (p.id || '') === pid);
                  setSelectedProjectName(proj?.name || '');
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              >
                {projects.map((p, idx) => (
                  <option key={p.id || `proj-${idx}`} value={p.id || ''}>{p.name || p.id}</option>
                ))}
              </select>
            </div>

            {/* Invite Form */}
            {selectedProjectId && currentUserId ? (
              <InviteUserForm
                projectId={selectedProjectId}
                projectName={selectedProjectName}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                onInviteSent={() => setShowInvite(false)}
                onClose={() => setShowInvite(false)}
                className="border-0"
              />
            ) : (
              <div className="p-6 text-center text-slate-600">
                <p>Loading project data...</p>
                <p className="text-sm mt-2">Please wait while we prepare the invite form.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </UserProvider>
  );
}

// ================= Inlined Dashboard (from components/ZohoStyleDashboard.tsx) =================

interface WidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

const Widget: React.FC<WidgetProps> = ({ title, children, className = '', actions }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
    {children}
  </motion.div>
);

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  trend?: number[];
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color,
  trend 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        {change && (
          <div className="flex items-center">
            {changeType === 'positive' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : changeType === 'negative' ? (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            ) : null}
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {change}
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 h-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend.map((value, index) => ({ value, index }))}>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={changeType === 'positive' ? '#10B981' : changeType === 'negative' ? '#EF4444' : '#6B7280'}
              fill={changeType === 'positive' ? '#10B981' : changeType === 'negative' ? '#EF4444' : '#6B7280'}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )}
  </motion.div>
);

interface InlinedDashboardProps {
  onOpenTab: (tabName: string, context?: any) => void;
}

const projectGrowthData = [
  { month: 'Jan', projects: 12, revenue: 24000 },
  { month: 'Feb', projects: 18, revenue: 36000 },
  { month: 'Mar', projects: 15, revenue: 30000 },
  { month: 'Apr', projects: 22, revenue: 44000 },
  { month: 'May', projects: 28, revenue: 56000 },
  { month: 'Jun', projects: 35, revenue: 70000 },
];

const taskStatusData = [
  { name: 'Completed', value: 45, color: '#10B981' },
  { name: 'In Progress', value: 30, color: '#3B82F6' },
  { name: 'Pending', value: 15, color: '#F59E0B' },
  { name: 'Overdue', value: 10, color: '#EF4444' },
];

const teamPerformanceData = [
  { team: 'Frontend', tasks: 24, completed: 20, efficiency: 83 },
  { team: 'Backend', tasks: 18, completed: 16, efficiency: 89 },
  { team: 'Design', tasks: 15, completed: 14, efficiency: 93 },
  { team: 'QA', tasks: 12, completed: 11, efficiency: 92 },
];

const recentActivities = [
  { id: 1, user: 'John Doe', action: 'completed task', target: 'User Authentication', time: '2 min ago', type: 'success' },
  { id: 2, user: 'Sarah Wilson', action: 'created project', target: 'E-commerce Platform', time: '15 min ago', type: 'info' },
  { id: 3, user: 'Mike Johnson', action: 'updated status', target: 'Database Migration', time: '1 hour ago', type: 'warning' },
  { id: 4, user: 'Emily Davis', action: 'assigned task', target: 'UI Redesign', time: '2 hours ago', type: 'info' },
  { id: 5, user: 'Alex Brown', action: 'completed sprint', target: 'Sprint 12', time: '3 hours ago', type: 'success' },
];

const upcomingDeadlines = [
  { id: 1, title: 'Project Alpha Launch', date: '2024-01-15', priority: 'high', status: 'on-track' },
  { id: 2, title: 'Client Presentation', date: '2024-01-18', priority: 'medium', status: 'at-risk' },
  { id: 3, title: 'Code Review', date: '2024-01-20', priority: 'low', status: 'on-track' },
  { id: 4, title: 'Team Meeting', date: '2024-01-22', priority: 'medium', status: 'on-track' },
];

function InlinedDashboard({ onOpenTab }: InlinedDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    teamMembers: 0,
    companies: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          totalProjects: 24,
          activeTasks: 156,
          teamMembers: 48,
          companies: 12,
          completedTasks: 89,
          overdueTasks: 7,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your projects today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Time</p>
              <p className="text-lg font-semibold text-gray-900">{currentTime.toLocaleTimeString()}</p>
            </div>
            <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <button onClick={() => onOpenTab('projects')} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FolderOpenIcon className="w-4 h-4" />
            <span>Projects</span>
          </button>
          <button onClick={() => onOpenTab('tasks')} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <CheckSquareIcon className="w-4 h-4" />
            <span>Tasks</span>
          </button>
          <button onClick={() => onOpenTab('teams')} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <UsersIcon className="w-4 h-4" />
            <span>Teams</span>
          </button>
          <button onClick={() => onOpenTab('calendar')} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Projects" value={stats.totalProjects} change="+12%" changeType="positive" icon={FolderOpenIcon} color="from-blue-500 to-blue-600" trend={[12,15,18,20,22,24]} />
        <MetricCard title="Active Tasks" value={stats.activeTasks} change="+8%" changeType="positive" icon={CheckSquareIcon} color="from-green-500 to-green-600" trend={[120,130,140,145,150,156]} />
        <MetricCard title="Team Members" value={stats.teamMembers} change="+5%" changeType="positive" icon={UsersIcon} color="from-purple-500 to-purple-600" trend={[40,42,44,46,47,48]} />
        <MetricCard title="Companies" value={stats.companies} change="+2%" changeType="positive" icon={Building2} color="from-orange-500 to-orange-600" trend={[10,11,11,12,12,12]} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Growth Chart */}
        <Widget title="Project Growth & Revenue" actions={
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded hover:bg-gray-100"><Eye className="w-4 h-4 text-gray-500"/></button>
            <button className="p-1 rounded hover:bg-gray-100"><Download className="w-4 h-4 text-gray-500"/></button>
            <button className="p-1 rounded hover:bg-gray-100"><MoreHorizontal className="w-4 h-4 text-gray-500"/></button>
          </div>
        }>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <RechartsTooltip />
              <Line yAxisId="left" type="monotone" dataKey="projects" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Widget>

        {/* Task Status Distribution */}
        <Widget title="Task Status Distribution" actions={<div className="flex items-center space-x-2"><button className="p-1 rounded hover:bg-gray-100"><RefreshCw className="w-4 h-4 text-gray-500"/></button></div>}>
          <div className="flex items-center justify-between h-64">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={taskStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {taskStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-40 space-y-3">
              {taskStatusData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Widget>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Performance */}
        <Widget title="Team Performance">
          <div className="space-y-4">
            {teamPerformanceData.map((team) => (
              <div key={team.team} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{team.team}</p>
                  <p className="text-sm text-gray-500">{team.completed}/{team.tasks} tasks</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{team.efficiency}%</p>
                  <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: `${team.efficiency}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Widget>

        {/* Recent Activity */}
        <Widget title="Recent Activity" actions={<button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>}>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-green-500' : activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900"><span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span></p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Widget>

        {/* Upcoming Deadlines */}
        <Widget title="Upcoming Deadlines" actions={<button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View Calendar</button>}>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{deadline.title}</p>
                  <p className="text-sm text-gray-500">{deadline.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${deadline.priority === 'high' ? 'bg-red-100 text-red-800' : deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {deadline.priority}
                  </span>
                  {deadline.status === 'on-track' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>
    </div>
  );
}
