'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, User, Target, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { TeamApiService, TeamData } from '../../utils/teamApi';
import { ProjectApiService, ProjectData } from '../../utils/projectApi';

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamData | null>(null);
  const [formData, setFormData] = useState<Partial<TeamData>>({
    name: '',
    description: '',
    project: '',
    members: '',
    tasksCompleted: 0,
    totalTasks: 0,
    performance: 85,
    velocity: 80,
    health: 'good',
    budget: '',
    startDate: '',
    archived: false,
    tags: '',
    achievements: '',
    department: '',
    manager: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsRes, projectsRes] = await Promise.all([
        TeamApiService.getTeams(),
        ProjectApiService.getProjects()
      ]);

      if (teamsRes.success) {
        const teamsData = teamsRes.items || teamsRes.data || [];
        setTeams(Array.isArray(teamsData) ? teamsData as TeamData[] : []);
      }

      if (projectsRes.success) {
        const projectsData = projectsRes.items || projectsRes.data || [];
        setProjects(Array.isArray(projectsData) ? projectsData as ProjectData[] : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setTeams([]); // Set empty arrays if API fails
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    try {
      const response = await TeamApiService.createTeam(formData as TeamData);
      if (response.success) {
        setShowCreateModal(false);
        setFormData({
          name: '',
          description: '',
          project: '',
          members: '',
          tasksCompleted: 0,
          totalTasks: 0,
          performance: 85,
          velocity: 80,
          health: 'good',
          budget: '',
          startDate: '',
          archived: false,
          tags: '',
          achievements: '',
          department: '',
          manager: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleEditTeam = async () => {
    if (!editingTeam?.id) return;
    
    try {
      const response = await TeamApiService.updateTeam(editingTeam.id, formData);
      if (response.success) {
        setShowCreateModal(false);
        setEditingTeam(null);
        setFormData({
          name: '',
          description: '',
          project: '',
          members: '',
          tasksCompleted: 0,
          totalTasks: 0,
          performance: 85,
          velocity: 80,
          health: 'good',
          budget: '',
          startDate: '',
          archived: false,
          tags: '',
          achievements: '',
          department: '',
          manager: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleDeleteTeam = async (team: TeamData) => {
    if (!team.id) return;
    
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        const response = await TeamApiService.deleteTeam(team.id);
        if (response.success) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'bg-emerald-100 text-emerald-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const parseMembers = (membersJson: string) => {
    try {
      const members = JSON.parse(membersJson || '[]');
      return Array.isArray(members) ? members.length : 0;
    } catch {
      return 0;
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Team Name',
      sortable: true,
      render: (value: string, row: TeamData) => (
        <div className="flex items-center">
          <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
            <Users size={16} className="text-orange-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.project}</div>
          </div>
        </div>
      )
    },
    {
      key: 'members',
      label: 'Members',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center text-sm text-gray-600">
          <User size={14} className="mr-1" />
          {parseMembers(value)} members
        </div>
      )
    },
    {
      key: 'health',
      label: 'Health',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getHealthColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'performance',
      label: 'Performance',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{value}%</span>
        </div>
      )
    },
    {
      key: 'velocity',
      label: 'Velocity',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center text-sm text-gray-600">
          <TrendingUp size={14} className="mr-1" />
          {value} pts/sprint
        </div>
      )
    },
    {
      key: 'tasksCompleted',
      label: 'Tasks',
      sortable: true,
      render: (value: number, row: TeamData) => (
        <div className="flex items-center text-sm text-gray-600">
          <Target size={14} className="mr-1" />
          {value}/{row.totalTasks || 0}
        </div>
      )
    },
    {
      key: 'startDate',
      label: 'Start Date',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className="mr-1" />
          {value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not set'}
        </div>
      )
    },
    {
      key: 'budget',
      label: 'Budget',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign size={14} className="mr-1" />
          {value || 'Not set'}
        </div>
      )
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-1">Manage all teams in the system</p>
        </div>
      </motion.div>

      {/* Data Table */}
      <DataTable
        data={teams}
        columns={columns}
        title="Teams"
        onCreateNew={() => setShowCreateModal(true)}
        onEdit={(team) => {
          setEditingTeam(team);
          setFormData(team);
          setShowCreateModal(true);
        }}
        onDelete={handleDeleteTeam}
        searchPlaceholder="Search teams..."
      />

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingTeam ? 'Edit Team' : 'Create New Team'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                <input
                  type="text"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Health</label>
                <select
                  value={formData.health}
                  onChange={(e) => setFormData({ ...formData, health: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Performance (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.performance}
                  onChange={(e) => setFormData({ ...formData, performance: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Velocity</label>
                <input
                  type="number"
                  min="0"
                  value={formData.velocity}
                  onChange={(e) => setFormData({ ...formData, velocity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $100,000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingTeam(null);
                  setFormData({
                    name: '',
                    description: '',
                    project: '',
                    members: '',
                    tasksCompleted: 0,
                    totalTasks: 0,
                    performance: 85,
                    velocity: 80,
                    health: 'good',
                    budget: '',
                    startDate: '',
                    archived: false,
                    tags: '',
                    achievements: '',
                    department: '',
                    manager: ''
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingTeam ? handleEditTeam : handleCreateTeam}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingTeam ? 'Update Team' : 'Create Team'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
