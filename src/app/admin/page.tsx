'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  Building2,
  FolderOpen,
  CheckSquare,
  Users,
  User,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

import { KpiCard } from './components/KpiCard';
import { ActivityFeed } from './components/ActivityFeed';
import { CompanyApiService } from '../utils/companyApi';
import { ProjectApiService } from '../utils/projectApi';
import { TaskApiService } from '../utils/taskApi';
import { TeamApiService } from '../utils/teamApi';

// Mock data for charts
const taskStatusData = [
  { name: 'To Do', value: 25, color: '#6B7280' },
  { name: 'In Progress', value: 35, color: '#3B82F6' },
  { name: 'Review', value: 20, color: '#F59E0B' },
  { name: 'Done', value: 20, color: '#10B981' },
];

const projectGrowthData = [
  { month: 'Jan', projects: 12 },
  { month: 'Feb', projects: 18 },
  { month: 'Mar', projects: 15 },
  { month: 'Apr', projects: 22 },
  { month: 'May', projects: 28 },
  { month: 'Jun', projects: 35 },
];

const mockActivities = [
  {
    id: '1',
    type: 'project' as const,
    action: 'created',
    entity: 'E-commerce Platform',
    user: 'John Doe',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'task' as const,
    action: 'completed',
    entity: 'User Authentication',
    user: 'Jane Smith',
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    type: 'company' as const,
    action: 'updated',
    entity: 'TechCorp Inc.',
    user: 'Mike Johnson',
    timestamp: '6 hours ago'
  },
  {
    id: '4',
    type: 'team' as const,
    action: 'joined',
    entity: 'Frontend Team',
    user: 'Sarah Wilson',
    timestamp: '1 day ago'
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    companies: 0,
    projects: 0,
    tasks: 0,
    teams: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [companiesRes, projectsRes, tasksRes, teamsRes] = await Promise.all([
          CompanyApiService.getCompanies(),
          ProjectApiService.getProjects(),
          TaskApiService.getTasks(),
          TeamApiService.getTeams()
        ]);

        setStats({
          companies: companiesRes.items?.length || companiesRes.data?.length || 0,
          projects: projectsRes.items?.length || projectsRes.data?.length || 0,
          tasks: tasksRes.items?.length || tasksRes.data?.length || 0,
          teams: teamsRes.items?.length || teamsRes.data?.length || 0,
          users: 0 // Mock data for now
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default values if API is not available
        setStats({
          companies: 0,
          projects: 0,
          tasks: 0,
          teams: 0,
          users: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your project management system</p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Companies"
          value={stats.companies}
          change="+12%"
          changeType="positive"
          icon={Building2}
          color="blue"
        />
        <KpiCard
          title="Active Projects"
          value={stats.projects}
          change="+8%"
          changeType="positive"
          icon={FolderOpen}
          color="green"
        />
        <KpiCard
          title="Total Tasks"
          value={stats.tasks}
          change="+15%"
          changeType="positive"
          icon={CheckSquare}
          color="purple"
        />
        <KpiCard
          title="Teams"
          value={stats.teams}
          change="+5%"
          changeType="positive"
          icon={Users}
          color="orange"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Status Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {taskStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Project Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={projectGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ActivityFeed activities={mockActivities} />
      </motion.div>
    </div>
  );
}
