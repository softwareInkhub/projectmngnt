'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Calendar, User, Target, Clock, Tag } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { TaskApiService, TaskData } from '../../utils/taskApi';
import { ProjectApiService, ProjectData } from '../../utils/projectApi';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);
  const [formData, setFormData] = useState<Partial<TaskData>>({
    title: '',
    description: '',
    project: '',
    assignee: '',
    status: 'To Do',
    priority: 'Medium',
    startDate: '',
    dueDate: '',
    estimatedHours: 0,
    tags: '',
    subtasks: '',
    comments: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        TaskApiService.getTasks(),
        ProjectApiService.getProjects()
      ]);

      if (tasksRes.success) {
        const tasksData = tasksRes.items || tasksRes.data || [];
        setTasks(Array.isArray(tasksData) ? tasksData as TaskData[] : []);
      }

      if (projectsRes.success) {
        const projectsData = projectsRes.items || projectsRes.data || [];
        setProjects(Array.isArray(projectsData) ? projectsData as ProjectData[] : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setTasks([]); // Set empty arrays if API fails
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      const response = await TaskApiService.createTask(formData as TaskData);
      if (response.success) {
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          project: '',
          assignee: '',
          status: 'To Do',
          priority: 'Medium',
          startDate: '',
          dueDate: '',
          estimatedHours: 0,
          tags: '',
          subtasks: '',
          comments: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = async () => {
    if (!editingTask?.id) return;
    
    try {
      const response = await TaskApiService.updateTask(editingTask.id, formData);
      if (response.success) {
        setShowCreateModal(false);
        setEditingTask(null);
        setFormData({
          title: '',
          description: '',
          project: '',
          assignee: '',
          status: 'To Do',
          priority: 'Medium',
          startDate: '',
          dueDate: '',
          estimatedHours: 0,
          tags: '',
          subtasks: '',
          comments: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (task: TaskData) => {
    if (!task.id) return;
    
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await TaskApiService.deleteTask(task.id);
        if (response.success) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Done': return 'bg-green-100 text-green-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Task Title',
      sortable: true,
      render: (value: string, row: TaskData) => (
        <div className="flex items-center">
          <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <CheckSquare size={16} className="text-purple-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.project}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'assignee',
      label: 'Assignee',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center text-sm text-gray-600">
          <User size={14} className="mr-1" />
          {value || 'Unassigned'}
        </div>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className="mr-1" />
          {value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not set'}
        </div>
      )
    },
    {
      key: 'estimatedHours',
      label: 'Est. Hours',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={14} className="mr-1" />
          {value || 0}h
        </div>
      )
    },
    {
      key: 'progress',
      label: 'Progress',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${value || 0}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{value || 0}%</span>
        </div>
      )
    },
    {
      key: 'tags',
      label: 'Tags',
      sortable: false,
      render: (value: any) => {
        const tagsString = typeof value === 'string' ? value : String(value || '');
        const tags = tagsString ? tagsString.split(',').filter(tag => tag.trim()) : [];
        
        return (
          <div className="flex items-center text-sm text-gray-600">
            <Tag size={14} className="mr-1" />
            {tags.length > 0 ? tags.slice(0, 2).join(', ') : 'No tags'}
            {tags.length > 2 && (
              <span className="text-xs text-gray-400 ml-1">+{tags.length - 2}</span>
            )}
          </div>
        );
      }
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
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage all tasks in the system</p>
        </div>
      </motion.div>

      {/* Data Table */}
      <DataTable
        data={tasks}
        columns={columns}
        title="Tasks"
        onCreateNew={() => setShowCreateModal(true)}
        onEdit={(task) => {
          setEditingTask(task);
          setFormData(task);
          setShowCreateModal(true);
        }}
        onDelete={handleDeleteTask}
        searchPlaceholder="Search tasks..."
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
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                <input
                  type="number"
                  min="0"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
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
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="frontend, urgent, bug"
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingTask(null);
                  setFormData({
                    title: '',
                    description: '',
                    project: '',
                    assignee: '',
                    status: 'To Do',
                    priority: 'Medium',
                    startDate: '',
                    dueDate: '',
                    estimatedHours: 0,
                    tags: '',
                    subtasks: '',
                    comments: ''
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingTask ? handleEditTask : handleCreateTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
