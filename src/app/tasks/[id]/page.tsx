"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Calendar, User, Target, Clock, Tag, FileText, CheckSquare, Square, AlertCircle, Play, Pause, CheckCircle, XCircle, Folder, Building, Users, DollarSign, TrendingUp, MessageSquare, Eye, Heart, MoreHorizontal, Plus, Search, X, ChevronDown } from 'lucide-react';
import { TaskApiService, TaskData, transformTaskToUI, TaskWithUI } from '../../utils/taskApi';
import { ProjectApiService } from '../../utils/projectApi';

const statusIcons = {
  'To Do': Square,
  'In Progress': Play,
  'Review': Pause,
  'Done': CheckCircle,
  'Blocked': XCircle,
  'Cancelled': AlertCircle
};

const priorityColors = {
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Low': 'bg-green-100 text-green-700 border-green-200'
};

const statusColors = {
  'To Do': 'bg-slate-100 text-slate-700 border-slate-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'Review': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Done': 'bg-green-100 text-green-700 border-green-200',
  'Blocked': 'bg-red-100 text-red-700 border-red-200',
  'Cancelled': 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<TaskWithUI | null>(null);
  const [project, setProject] = useState<any>(null);
  const [subtasks, setSubtasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDemoTask, setIsDemoTask] = useState(false);
  
  // Subtask dropdown state
  const [showSubtaskDropdown, setShowSubtaskDropdown] = useState(false);
  const [allTasks, setAllTasks] = useState<TaskData[]>([]);
  const [subtaskSearchTerm, setSubtaskSearchTerm] = useState('');
  const [selectedTaskForSubtask, setSelectedTaskForSubtask] = useState<TaskData | null>(null);
  const [isCreatingSubtask, setIsCreatingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchTask = useCallback(async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching task with ID:', taskId);
      const response = await TaskApiService.getTaskById(taskId);
      
      console.log('Task API response:', response);

      if (response.success) {
        let taskData: TaskData | null = null;
        
        if (response.data) {
          taskData = response.data as TaskData;
        } else if ((response as any).item) {
          taskData = (response as any).item as TaskData;
        } else if (response.items && Array.isArray(response.items) && response.items.length > 0) {
          taskData = response.items[0] as TaskData;
        }

        if (taskData) {
          const transformedTask = transformTaskToUI(taskData);
          setTask(transformedTask);
          setIsDemoTask(false);
          
          if (taskData.project) {
            try {
              const projectResponse = await ProjectApiService.getProject(taskData.project);
              if (projectResponse.success && projectResponse.data) {
                setProject(projectResponse.data);
              }
            } catch (projectError) {
              console.warn('Could not fetch project data:', projectError);
            }
          }
        } else {
          throw new Error('No task data found in response');
        }
      } else {
        throw new Error(response.error || 'Failed to fetch task');
      }
    } catch (err) {
      console.error('Error fetching task:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch task');
      
      const demoTask: TaskWithUI = {
        id: taskId,
        title: 'Demo Task for Testing',
        description: 'This is a demo task created for testing purposes.',
        project: 'Demo Project',
        assignee: 'Demo User',
        status: 'In Progress',
        priority: 'Medium',
        dueDate: '2024-12-31',
        startDate: '2024-01-01',
        estimatedHours: 8,
        progress: 65,
        timeSpent: '5h 30m',
        estimatedTime: '8h',
        comments: 3,
        likes: 2,
        views: 15,
        created: '2024-01-15',
        lastActivity: '2 hours ago',
        tags: ['demo', 'testing', 'frontend'],
        subtasks: [
          { id: 1, title: 'Design mockups', completed: true },
          { id: 2, title: 'Frontend implementation', completed: true },
          { id: 3, title: 'Backend integration', completed: false },
          { id: 4, title: 'Testing and QA', completed: false }
        ],
        parentId: null
      };
      setTask(demoTask);
      setIsDemoTask(true);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  // Fetch all tasks for subtask dropdown
  const fetchAllTasks = useCallback(async () => {
    try {
      const response = await TaskApiService.getTasks();
      if (response.success && response.data) {
        const tasks = Array.isArray(response.data) ? response.data : [];
        // Filter out the current task to avoid self-reference
        const filteredTasks = tasks.filter(t => t.id !== taskId);
        setAllTasks(filteredTasks);
      }
    } catch (error) {
      console.error('Error fetching all tasks:', error);
    }
  }, [taskId]);

  // Fetch subtasks for the current task
  const fetchSubtasks = useCallback(async () => {
    try {
      const response = await TaskApiService.getTasks();
      if (response.success && response.data) {
        const tasks = Array.isArray(response.data) ? response.data : [];
        // Filter tasks that have the current task as their parent
        const taskSubtasks = tasks.filter(t => t.parentId === taskId);
        setSubtasks(taskSubtasks);
      }
    } catch (error) {
      console.error('Error fetching subtasks:', error);
    }
  }, [taskId]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSubtaskDropdown(false);
        setIsCreatingSubtask(false);
        setSubtaskSearchTerm('');
        setSelectedTaskForSubtask(null);
        setNewSubtaskTitle('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Main data fetching effect
  useEffect(() => {
    fetchTask();
    fetchAllTasks();
    fetchSubtasks();
  }, [taskId, fetchTask, fetchAllTasks, fetchSubtasks]);

  const handleBack = () => {
    router.back();
  };

  const handleEditTask = () => {
    console.log('Edit task:', task?.id);
  };

  const handleDeleteTask = async () => {
    if (!task?.id) return;
    
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await TaskApiService.deleteTask(task.id);
        if (response.success) {
          router.back();
        } else {
          setError('Failed to delete task');
        }
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task');
      }
    }
  };

  // Subtask handlers
  const handleAddSubtaskClick = () => {
    setShowSubtaskDropdown(!showSubtaskDropdown);
    setIsCreatingSubtask(false);
    setSubtaskSearchTerm('');
    setSelectedTaskForSubtask(null);
    setNewSubtaskTitle('');
  };

  const handleSelectExistingTask = async (selectedTask: TaskData) => {
    try {
      // Update the selected task to have the current task as its parent
      // Remove the id field as it's the primary key and cannot be updated
      const { id, ...updateData } = selectedTask;
      const updatedTask = {
        ...updateData,
        parentId: taskId
      };
      
      const response = await TaskApiService.updateTask(selectedTask.id!, updatedTask);
      if (response.success) {
        // Refresh the current task to show the new subtask
        await fetchTask();
        await fetchAllTasks();
        await fetchSubtasks();
        setShowSubtaskDropdown(false);
        setSelectedTaskForSubtask(null);
        setSubtaskSearchTerm('');
        setSuccessMessage(`"${selectedTask.title}" has been added as a subtask!`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to add subtask');
      }
    } catch (err) {
      console.error('Error adding subtask:', err);
      setError('Failed to add subtask');
    }
  };

  const handleCreateNewSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;

    try {
      const newSubtask: TaskData = {
        title: newSubtaskTitle,
        description: `Subtask of: ${task?.title}`,
        project: task?.project || 'Default Project',
        assignee: task?.assignee || 'Unassigned',
        status: 'To Do',
        priority: 'Medium',
        dueDate: task?.dueDate || new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        estimatedHours: 2,
        tags: 'subtask',
        subtasks: '[]',
        comments: '0',
        parentId: taskId
      };

      const response = await TaskApiService.createTask(newSubtask);
      if (response.success) {
        // Refresh the current task to show the new subtask
        await fetchTask();
        await fetchAllTasks();
        await fetchSubtasks();
        setShowSubtaskDropdown(false);
        setIsCreatingSubtask(false);
        setNewSubtaskTitle('');
        setSuccessMessage(`"${newSubtaskTitle}" has been created as a subtask!`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to create subtask');
      }
    } catch (err) {
      console.error('Error creating subtask:', err);
      setError('Failed to create subtask');
    }
  };

  const filteredTasks = allTasks.filter(task => 
    task.title.toLowerCase().includes(subtaskSearchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(subtaskSearchTerm.toLowerCase())
  );

  // Check if a task is already a subtask of the current task
  const isAlreadySubtask = (taskItem: TaskData) => {
    return taskItem.parentId === taskId;
  };

  const getPriorityColor = (priority: string) => {
    return priorityColors[priority as keyof typeof priorityColors] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const StatusIcon = task ? statusIcons[task.status as keyof typeof statusIcons] || Square : Square;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Task</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Task Not Found</h2>
          <p className="text-slate-600 mb-4">The task you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border-b border-green-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Task Details</h1>
                <p className="text-sm text-slate-500">View and manage task information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              {/* Task Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <StatusIcon className="w-6 h-6 text-slate-400" />
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">{task.title}</h2>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {isDemoTask && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      Demo Task
                    </span>
                  )}
                </div>

                <p className="text-slate-600 mb-4">{task.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Progress</span>
                    <span className="text-sm text-slate-600">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-slate-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: FileText },
                    { id: 'subtasks', label: 'Subtasks', icon: CheckSquare },
                    { id: 'comments', label: 'Comments', icon: MessageSquare },
                    { id: 'activity', label: 'Activity', icon: TrendingUp }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Task Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Task Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2">
                              <User size={14} />
                              Assignee
                            </label>
                            <p className="text-sm text-slate-900">{task.assignee}</p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2">
                              <Folder size={14} />
                              Project
                            </label>
                            <p className="text-sm text-slate-900">{task.project}</p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2">
                              <Calendar size={14} />
                              Start Date
                            </label>
                            <p className="text-sm text-slate-900">{task.startDate}</p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2">
                              <Target size={14} />
                              Due Date
                            </label>
                            <p className="text-sm text-slate-900">{task.dueDate}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2">
                              <Clock size={14} />
                              Estimated Time
                            </label>
                            <p className="text-sm text-slate-900">{task.estimatedTime}</p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2">
                              <Clock size={14} />
                              Time Spent
                            </label>
                            <p className="text-sm text-slate-900">{task.timeSpent}</p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2">
                              <CheckSquare size={14} />
                              Subtasks
                            </label>
                            <p className="text-sm text-slate-900">
                              {subtasks.filter(st => st.status === 'Done').length} of {subtasks.length} completed
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2">
                              <MessageSquare size={14} />
                              Comments
                            </label>
                            <p className="text-sm text-slate-900">{task.comments}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {task.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Tag size={14} />
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {task.tags.map((tag, index) => (
                            <span
                              key={`task-detail-tag-${index}`}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'subtasks' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">Subtasks</h3>
                      <div className="relative" ref={dropdownRef}>
                        <button 
                          onClick={handleAddSubtaskClick}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus size={14} />
                          Add Subtask
                        </button>
                        
                        {/* Dropdown */}
                        {showSubtaskDropdown && (
                          <div className="absolute right-0 sm:right-0 top-full mt-2 w-72 sm:w-80 md:w-96 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-w-[calc(100vw-2rem)]">
                            <div className="p-3 sm:p-4 border-b border-slate-200">
                              <h4 className="text-sm font-semibold text-slate-900 mb-3">Add Subtask</h4>
                              
                              {/* Search */}
                              <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                  type="text"
                                  placeholder="Search tasks..."
                                  value={subtaskSearchTerm}
                                  onChange={(e) => setSubtaskSearchTerm(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              
                              {/* Create New Subtask */}
                              <div className="mb-3">
                                <button
                                  onClick={() => setIsCreatingSubtask(!isCreatingSubtask)}
                                  className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                                >
                                  <Plus size={14} />
                                  Create New Subtask
                                </button>
                                
                                {isCreatingSubtask && (
                                  <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                                    <input
                                      type="text"
                                      placeholder="Enter subtask title..."
                                      value={newSubtaskTitle}
                                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={handleCreateNewSubtask}
                                        disabled={!newSubtaskTitle.trim()}
                                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Create
                                      </button>
                                      <button
                                        onClick={() => {
                                          setIsCreatingSubtask(false);
                                          setNewSubtaskTitle('');
                                        }}
                                        className="px-3 py-1 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Existing Tasks */}
                              <div>
                                <h5 className="text-xs font-medium text-slate-600 mb-2">Select from existing tasks:</h5>
                                                                 <div className="max-h-48 overflow-y-auto space-y-1">
                                                                      {filteredTasks.length > 0 ? (
                                     filteredTasks.map((taskItem) => (
                                       <button
                                         key={taskItem.id}
                                         onClick={() => !isAlreadySubtask(taskItem) && handleSelectExistingTask(taskItem)}
                                         disabled={isAlreadySubtask(taskItem)}
                                         className={`w-full text-left p-1.5 sm:p-2 text-sm rounded-lg transition-colors ${
                                           isAlreadySubtask(taskItem)
                                             ? 'text-slate-400 bg-slate-50 cursor-not-allowed'
                                             : 'text-slate-700 hover:bg-slate-100'
                                         }`}
                                       >
                                         <div className="font-medium text-xs sm:text-sm">{taskItem.title}</div>
                                         <div className="text-xs text-slate-500 truncate">{taskItem.description}</div>
                                                                                 <div className="flex items-center gap-1 sm:gap-2 mt-1">
                                           <span className={`px-1 py-0.5 text-xs rounded ${getStatusColor(taskItem.status)}`}>
                                             {taskItem.status}
                                           </span>
                                           <span className={`px-1 py-0.5 text-xs rounded ${getPriorityColor(taskItem.priority)}`}>
                                             {taskItem.priority}
                                           </span>
                                           {isAlreadySubtask(taskItem) && (
                                             <span className="px-1 py-0.5 text-xs rounded bg-green-100 text-green-700">
                                               Already Subtask
                                             </span>
                                           )}
                                         </div>
                                      </button>
                                    ))
                                  ) : (
                                    <div className="text-center py-4 text-slate-500">
                                      <p className="text-sm">No tasks found</p>
                                      {subtaskSearchTerm && (
                                        <p className="text-xs">Try adjusting your search</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {subtasks.length > 0 ? (
                        subtasks.map((subtask) => (
                          <div
                            key={subtask.id}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                          >
                            <button className="flex-shrink-0">
                              {subtask.status === 'Done' ? (
                                <CheckSquare className="w-5 h-5 text-green-600" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-400" />
                              )}
                            </button>
                            <div className="flex-1">
                              <span className={`text-sm font-medium ${subtask.status === 'Done' ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                {subtask.title}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-1 py-0.5 text-xs rounded ${getStatusColor(subtask.status)}`}>
                                  {subtask.status}
                                </span>
                                <span className={`px-1 py-0.5 text-xs rounded ${getPriorityColor(subtask.priority)}`}>
                                  {subtask.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <CheckSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                          <p>No subtasks yet</p>
                          <p className="text-sm">Click "Add Subtask" to get started</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Comments</h3>
                    <div className="text-center py-8 text-slate-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>No comments yet</p>
                      <button className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Add Comment
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Activity</h3>
                    <div className="text-center py-8 text-slate-500">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>No activity recorded yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Views</span>
                    <div className="flex items-center gap-1">
                      <Eye size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">{task.views}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Likes</span>
                    <div className="flex items-center gap-1">
                      <Heart size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">{task.likes}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Comments</span>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">{task.comments}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              {project && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Project</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Project Name</label>
                      <p className="text-sm text-slate-900">{project.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Company</label>
                      <p className="text-sm text-slate-900">{project.company}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Progress</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">{project.progress || 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Task Meta */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Task Meta</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Created</label>
                    <p className="text-sm text-slate-900">{task.created}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Last Activity</label>
                    <p className="text-sm text-slate-900">{task.lastActivity}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Task ID</label>
                    <p className="text-sm text-slate-900 font-mono">{task.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
