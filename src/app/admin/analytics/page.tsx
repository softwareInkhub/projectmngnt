'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import ResizableTable, { 
  ResizableTableHeader, 
  ResizableTableHeaderCell, 
  ResizableTableBody, 
  ResizableTableCell 
} from '../../components/ResizableTable';

// Mock data for analytics
const monthlyData = [
  { month: 'Jan', projects: 12, tasks: 45, teams: 8, revenue: 125000 },
  { month: 'Feb', projects: 15, tasks: 52, teams: 9, revenue: 138000 },
  { month: 'Mar', projects: 18, tasks: 61, teams: 11, revenue: 152000 },
  { month: 'Apr', projects: 22, tasks: 68, teams: 12, revenue: 168000 },
  { month: 'May', projects: 25, tasks: 75, teams: 14, revenue: 185000 },
  { month: 'Jun', projects: 28, tasks: 82, teams: 15, revenue: 198000 },
];

const taskStatusData = [
  { name: 'Completed', value: 45, color: '#10b981' },
  { name: 'In Progress', value: 30, color: '#3b82f6' },
  { name: 'To Do', value: 15, color: '#6b7280' },
  { name: 'Blocked', value: 10, color: '#ef4444' },
];

const teamPerformanceData = [
  { team: 'Frontend', performance: 85, velocity: 12, health: 'good' },
  { team: 'Backend', performance: 92, velocity: 15, health: 'excellent' },
  { team: 'Design', performance: 78, velocity: 8, health: 'good' },
  { team: 'QA', performance: 88, velocity: 10, health: 'excellent' },
  { team: 'DevOps', performance: 95, velocity: 18, health: 'excellent' },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your project management system</p>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$1.2M</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
              <p className="text-sm text-blue-600">+8% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Target size={24} className="text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-sm text-purple-600">+5% from last month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Performance</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
              <p className="text-sm text-orange-600">+3% from last month</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <TrendingUp size={24} className="text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="projects" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="tasks" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Task Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
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
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Team Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
        <div className="overflow-x-auto">
          <ResizableTable 
            defaultColumnWidths={{
              team: 150,
              performance: 200,
              velocity: 120,
              health: 100
            }}
            defaultRowHeight={50}
          >
            <table className="w-full resizable-table">
              <ResizableTableHeader>
                <tr>
                  <ResizableTableHeaderCell columnKey="team" className="text-xs font-medium text-gray-500 uppercase tracking-wider">Team</ResizableTableHeaderCell>
                  <ResizableTableHeaderCell columnKey="performance" className="text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</ResizableTableHeaderCell>
                  <ResizableTableHeaderCell columnKey="velocity" className="text-xs font-medium text-gray-500 uppercase tracking-wider">Velocity</ResizableTableHeaderCell>
                  <ResizableTableHeaderCell columnKey="health" className="text-xs font-medium text-gray-500 uppercase tracking-wider">Health</ResizableTableHeaderCell>
                </tr>
              </ResizableTableHeader>
              <ResizableTableBody>
                {teamPerformanceData.map((team, index) => (
                  <motion.tr
                    key={team.team}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <ResizableTableCell columnKey="team" className="text-sm font-medium text-gray-900">{team.team}</ResizableTableCell>
                    <ResizableTableCell columnKey="performance">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${team.performance}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 flex-shrink-0">{team.performance}%</span>
                      </div>
                    </ResizableTableCell>
                    <ResizableTableCell columnKey="velocity" className="text-sm text-gray-600">{team.velocity} pts/sprint</ResizableTableCell>
                    <ResizableTableCell columnKey="health">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        team.health === 'excellent' ? 'bg-emerald-100 text-emerald-800' :
                        team.health === 'good' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {team.health}
                      </span>
                    </ResizableTableCell>
                  </motion.tr>
                ))}
              </ResizableTableBody>
            </table>
          </ResizableTable>
        </div>
      </motion.div>
    </div>
  );
}
