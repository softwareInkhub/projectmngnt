import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  User,
  Tag,
  TrendingUp,
  Activity,
  Target,
  Clock,
  Star,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  Archive,
  Copy,
  Share2,
  Download,
  FilterX,
  Grid3X3,
  List,
  Bell,
  Heart,
  ExternalLink,
  GitCommit,
  DollarSign,
  CalendarDays,
  UserCheck,
  Timer,
  Flag,
  Layers,
  Zap,
  Award,
  TrendingDown,
  SortAsc,
  CheckSquare,
  Square,
  Play,
  Pause,
  StopCircle,
  RotateCcw,
  BarChart3,
  PieChart,
  LineChart,
  X,
  Building,
  Save,
  ArrowLeft
} from "lucide-react";
import { TaskApiService, TaskData, TaskWithUI, transformTaskToUI, validateTaskData, buildTaskTree, TaskTreeNode, validateParentAssignment, getAvailableParents } from "../utils/taskApi";
import { ApiResponse } from "../utils/api";
import { TaskTreeView } from "./TaskTreeView";

// Use imported interfaces and functions from taskApi.ts

// Empty initial tasks - will be populated from API
const initialTasks: any[] = [];

const statusColors = {
  "To Do": "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Done": "bg-emerald-100 text-emerald-700",
  "On Hold": "bg-orange-100 text-orange-700"
};

const priorityColors = {
  "High": "bg-red-100 text-red-700",
  "Medium": "bg-yellow-100 text-yellow-700",
  "Low": "bg-green-100 text-green-700"
};

const assignees = [
  "Sarah Johnson",
  "Mike Chen",
  "Alex Rodriguez",
  "Emily Davis",
  "David Wilson",
  "Lisa Thompson",
  "James Brown",
  "Maria Garcia"
];

const statuses = ["To Do", "In Progress", "Review", "Done", "Blocked"];
const priorities = ["Low", "Medium", "High", "Critical"];
const projects = [
  "Whapi Project Management",
  "E-commerce Platform",
  "Client Portal",
  "Mobile App Development",
  "API Integration"
];

const tags = [
  "Design", "Frontend", "Backend", "Security", "Testing",
  "Documentation", "Bug Fix", "Feature", "Refactor", "UI/UX"
];

export default function TasksPage({ context }: { context?: { company: string } }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Nested subtask state
  const [taskTree, setTaskTree] = useState<TaskTreeNode[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showTreeView, setShowTreeView] = useState(true);
  const [expandedTreeNodes, setExpandedTreeNodes] = useState<Set<string>>(new Set());

  // Function to fetch tasks from API
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await TaskApiService.getTasks();

      if (response.success) {
        // Handle different response structures
        const tasksData = (response as any).items || response.data || [];
        // Tasks loaded successfully

        if (Array.isArray(tasksData)) {
          // Transform API data to UI format
          const uiTasks = tasksData
            .filter((item: TaskData) => {
              // More lenient filter - check for title or name
              const hasTitle = item.title && item.title.trim() !== '';
              const hasName = (item as any).name && (item as any).name.trim() !== '';
              const hasRequiredFields = hasTitle || hasName;
              return hasRequiredFields;
            })
            .map((item: TaskData) => transformTaskToUI(item));

          setTasks(uiTasks);

          // Build task tree for nested view
          const tree = buildTaskTree(tasksData);
          setTaskTree(tree);
        } else {
          console.warn('Tasks data is not an array:', tasksData);
          setTasks([]);
          setTaskTree([]);
        }
      } else {
        console.error('Failed to fetch tasks:', response.error);
        setError('Failed to load tasks');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: context?.company || projects[0],
    assignee: assignees[0],
    status: statuses[0],
    priority: priorities[1],
    dueDate: "",
    startDate: "",
    estimatedHours: "",
    tags: [] as string[],
    subtasks: [] as { id: number; title: string; completed: boolean }[],
    comments: "",
    parentId: null as string | null
  });

  const analytics = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === "Done").length,
    inProgressTasks: tasks.filter(t => t.status === "In Progress").length,
    overdueTasks: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== "Done").length,
    avgProgress: tasks.length > 0 ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length) : 0,
    totalTimeSpent: tasks.reduce((sum, t) => {
      const timeSpent = t.timeSpent || '0h';
      return sum + parseInt(timeSpent.replace('h', '') || '0');
    }, 0),
    totalEstimatedTime: tasks.reduce((sum, t) => {
      const estimatedTime = t.estimatedTime || '0h';
      return sum + parseInt(estimatedTime.replace('h', '') || '0');
    }, 0)
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = (task.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (task.assignee?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (task.tags || []).some((tag: string) => (tag?.toLowerCase() || '').includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Task filtering completed

  const toggleTask = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setPriorityFilter("All");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return CheckCircle;
      case "In Progress":
        return Play;
      case "To Do":
        return Square;
      case "On Hold":
        return Pause;
      default:
        return Clock;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Prepare task data for API
    const taskData: TaskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      project: formData.project.trim(),
      assignee: formData.assignee.trim(),
      status: formData.status,
      priority: formData.priority,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : 0,
      tags: formData.tags.join(','), // Convert array to comma-separated string
      subtasks: JSON.stringify(formData.subtasks), // Convert to JSON string
      comments: formData.comments.trim(),
      parentId: formData.parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Form data being sent to API:', taskData);
    console.log('Form data type check:', {
      title: typeof taskData.title,
      description: typeof taskData.description,
      project: typeof taskData.project,
      assignee: typeof taskData.assignee,
      status: typeof taskData.status,
      priority: typeof taskData.priority,
      startDate: typeof taskData.startDate,
      dueDate: typeof taskData.dueDate,
      estimatedHours: typeof taskData.estimatedHours,
      tags: typeof taskData.tags,
      subtasks: typeof taskData.subtasks,
      comments: typeof taskData.comments
    });

    // Validate task data
    const validation = validateTaskData(taskData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("About to call TaskApiService.createTask...");

      // Use API service to create task
      const response = await TaskApiService.createTask(taskData);
      console.log("API response received:", response);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create task');
      }

      console.log("Task created successfully:", response.data);

      // Show success message
      setSuccessMessage(`Task "${formData.title}" created successfully!`);

      // Refresh tasks from API to show the newly created task
      await fetchTasks();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

      // Reset form and hide it
      setShowCreateForm(false);
      setFormData({
        title: "",
        description: "",
        project: context?.company || projects[0],
        assignee: assignees[0],
        status: statuses[0],
        priority: priorities[1],
        dueDate: "",
        startDate: "",
        estimatedHours: "",
        tags: [],
        subtasks: [],
        comments: "",
        parentId: null
      });

    } catch (err) {
      console.error("Error creating task:", err);
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSubtask = () => {
    const newSubtask = {
      id: Date.now(),
      title: "",
      completed: false
    };
    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask]
    }));
  };

  const updateSubtask = (id: number, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(subtask =>
        subtask.id === id ? { ...subtask, [field]: value } : subtask
      )
    }));
  };

  const removeSubtask = (id: number) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(subtask => subtask.id !== id)
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t: string) => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  // CRUD Operations
  const deleteTask = async (taskId: string) => {
    try {
      const response = await TaskApiService.deleteTask(taskId);

      if (response.success) {
        setSuccessMessage('Task deleted successfully!');
        await fetchTasks(); // Refresh the task list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to delete task');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
    setOpenMenuId(null);
  };

  const updateTask = async (taskData: TaskData) => {
    try {
      if (!taskData.id) {
        setError('Task ID is required for update');
        return;
      }

      // Only send the fields that should be updated, not the entire object
      const updateFields = {
        title: taskData.title,
        description: taskData.description,
        project: taskData.project,
        assignee: taskData.assignee,
        status: taskData.status,
        priority: taskData.priority,
        startDate: taskData.startDate,
        dueDate: taskData.dueDate,
        estimatedHours: taskData.estimatedHours,
        tags: taskData.tags,
        subtasks: taskData.subtasks,
        comments: taskData.comments,
        updatedAt: new Date().toISOString()
      };

      console.log('Updating task with ID:', taskData.id);
      console.log('Update fields:', updateFields);

      const response = await TaskApiService.updateTask(taskData.id, updateFields);

      console.log('Update response:', response);

      if (response.success) {
        setSuccessMessage('Task updated successfully!');
        await fetchTasks(); // Refresh the task list
        setTimeout(() => setSuccessMessage(null), 3000);
        setShowEditForm(false);
        setEditingTask(null);
      } else {
        console.error('Task update failed:', response.error);
        setError(`Failed to update task: ${response.error}`);
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError(`Failed to update task: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);

    // Parse tags and subtasks from strings to arrays
    let tags = [];
    let subtasks = [];

    try {
      if (task.tags && typeof task.tags === 'string') {
        tags = task.tags.split(',').filter((tag: string) => tag.trim());
      } else if (Array.isArray(task.tags)) {
        tags = task.tags;
      }
    } catch (e) {
      console.warn('Error parsing tags:', e);
    }

    try {
      if (task.subtasks && typeof task.subtasks === 'string') {
        subtasks = JSON.parse(task.subtasks);
      } else if (Array.isArray(task.subtasks)) {
        subtasks = task.subtasks;
      }
    } catch (e) {
      console.warn('Error parsing subtasks:', e);
    }

    setFormData({
      title: task.title,
      description: task.description,
      project: task.project,
      assignee: task.assignee,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      startDate: task.startDate || '',
      estimatedHours: task.estimatedHours ? task.estimatedHours.toString() : '',
      tags: tags,
      subtasks: subtasks,
      comments: task.comments || '',
      parentId: task.parentId || null
    });
    setShowEditForm(true);
    setOpenMenuId(null);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!editingTask) return;

    const updatedTaskData: TaskData = {
      id: editingTask.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      project: formData.project.trim(),
      assignee: formData.assignee.trim(),
      status: formData.status,
      priority: formData.priority,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : 0,
      tags: formData.tags.join(','),
      subtasks: JSON.stringify(formData.subtasks),
      comments: formData.comments.trim(),
      parentId: formData.parentId,
      createdAt: editingTask.createdAt,
      updatedAt: new Date().toISOString()
    };

    await updateTask(updatedTaskData);
    setIsSubmitting(false);
  };

  const toggleMenu = (taskId: string) => {
    setOpenMenuId(openMenuId === taskId ? null : taskId);
  };

  const closeMenu = () => {
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.task-menu')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Task Tree Functions
  const handleTaskSelect = (task: TaskTreeNode) => {
    setSelectedTaskId(task.id!);
  };

  const handleAddSubtask = (parentId: string) => {
    setFormData(prev => ({
      ...prev,
      parentId: parentId
    }));
    setShowCreateForm(true);
    setShowEditForm(false);
  };

  const handleEditTaskFromTree = (task: TaskTreeNode) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      project: task.project,
      assignee: task.assignee,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      startDate: task.startDate || '',
      estimatedHours: task.estimatedHours ? task.estimatedHours.toString() : '',
      tags: task.tags ? task.tags.split(',').filter(tag => tag.trim() !== '') : [],
      subtasks: [],
      comments: task.comments || '',
      parentId: task.parentId || null
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleDeleteTaskFromTree = async (task: TaskTreeNode) => {
    if (confirm(`Are you sure you want to delete "${task.title}"? This will also delete all its subtasks.`)) {
      await deleteTask(task.id!);
    }
  };

  const handleToggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTreeNodes);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTreeNodes(newExpanded);

    // Update the task tree with expanded state
    const updateTreeExpandedState = (nodes: TaskTreeNode[]): TaskTreeNode[] => {
      return nodes.map(node => ({
        ...node,
        isExpanded: newExpanded.has(node.id!),
        children: updateTreeExpandedState(node.children)
      }));
    };

    setTaskTree(updateTreeExpandedState(taskTree));
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">


      {/* Enhanced Header - Mobile Optimized */}
      <div className="flex items-center justify-between gap-2 md:gap-3 px-3 md:px-6 py-3 md:py-4 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-md md:shadow-lg">
            <CheckSquare className="text-white mr-0.5 md:mr-1" size={16} />
            <span className="text-sm md:text-base">{context?.company ? `${context.company} Tasks` : 'Tasks'}</span>
          </div>
          {context?.company && (
            <div className="text-xs md:text-sm text-slate-600">
              Managing tasks for {context.company}
            </div>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setShowTreeView(!showTreeView)}
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 text-slate-700 font-medium transition-all duration-200 hover:scale-105 focus-ring"
          >
            <Layers size={16} />
            {showTreeView ? 'Hide Tree' : 'Show Tree'}
          </button>
          <button
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 text-slate-700 font-medium transition-all duration-200 hover:scale-105 focus-ring"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold focus-ring"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            {showCreateForm ? 'Cancel' : 'New Task'}
          </button>
        </div>

        {/* Mobile Actions - Compact */}
        <div className="flex items-center gap-1.5 md:hidden shrink-0">
          <button
            onClick={() => setShowTreeView(!showTreeView)}
            className="h-8 px-3 bg-white/80 backdrop-blur-sm rounded-md shadow-md border border-white/20 text-slate-700 text-xs font-medium"
          >
            {showTreeView ? 'Hide' : 'Tree'}
          </button>
          <button
            className="h-8 px-3 bg-white/80 backdrop-blur-sm rounded-md shadow-md border border-white/20 text-slate-700 text-xs"
          >
            Export
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="h-8 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-md shadow-md text-xs font-medium"
          >
            {showCreateForm ? 'Cancel' : 'New'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg text-slate-600">Loading tasks from database...</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Success!</span>
            </div>
            <p className="text-green-700 mt-1">{successMessage}</p>
          </div>
        )}

        {/* Task Creation Form */}
        {(showCreateForm || showEditForm) && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{showEditForm ? 'Edit Task' : 'Create New Task'}</h2>
                  <p className="text-slate-600">{showEditForm ? 'Update the task details below.' : 'Fill in the details below to create a new task.'}</p>
                </div>
              </div>
            </div>

            <form onSubmit={showEditForm ? handleUpdateSubmit : handleSubmit} className="space-y-8">
              {/* Task Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Task Information</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Task Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter task title"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Project *
                      </label>
                      <div className="relative">
                        <select
                          value={formData.project}
                          onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                          required
                        >
                          {projects.map(project => (
                            <option key={project} value={project}>{project}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Building className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                      {showNewProject && (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={newProject}
                            onChange={(e) => setNewProject(e.target.value)}
                            placeholder="Enter new project name"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowNewProject(!showNewProject)}
                        className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                      >
                        {showNewProject ? "Cancel" : "+ Add New Project"}
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Parent Task
                      </label>
                      <div className="relative">
                        <select
                          value={formData.parentId || ''}
                          onChange={(e) => {
                            const parentId = e.target.value || null;
                            // Validate parent assignment
                            if (editingTask && parentId) {
                              const taskDataArray = tasks.map(t => ({
                                id: t.id,
                                title: t.title,
                                description: t.description,
                                project: t.project,
                                assignee: t.assignee,
                                status: t.status,
                                priority: t.priority,
                                dueDate: t.dueDate,
                                startDate: t.startDate,
                                estimatedHours: t.estimatedHours,
                                tags: t.tags.join(','),
                                subtasks: JSON.stringify(t.subtasks),
                                comments: t.comments,
                                progress: t.progress,
                                timeSpent: t.timeSpent,
                                estimatedTime: t.estimatedTime,
                                parentId: t.parentId,
                                createdAt: t.createdAt,
                                updatedAt: t.updatedAt
                              }));
                              const validation = validateParentAssignment(editingTask.id!, parentId, taskDataArray);
                              if (!validation.isValid) {
                                alert(validation.error);
                                return;
                              }
                            }
                            setFormData(prev => ({ ...prev, parentId }));
                          }}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="">No Parent (Root Task)</option>
                          {getAvailableParents(editingTask?.id || null, tasks.map(t => ({
                            id: t.id,
                            title: t.title,
                            description: t.description,
                            project: t.project,
                            assignee: t.assignee,
                            status: t.status,
                            priority: t.priority,
                            dueDate: t.dueDate,
                            startDate: t.startDate,
                            estimatedHours: t.estimatedHours,
                            tags: t.tags.join(','),
                            subtasks: JSON.stringify(t.subtasks),
                            comments: t.comments,
                            progress: t.progress,
                            timeSpent: t.timeSpent,
                            estimatedTime: t.estimatedTime,
                            parentId: t.parentId,
                            createdAt: t.createdAt,
                            updatedAt: t.updatedAt
                          }))).map(task => (
                            <option key={task.id} value={task.id}>
                              {task.title}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Layers className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Select a parent task to create a subtask, or leave empty for a root task
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Assignee *
                      </label>
                      <div className="relative">
                        <select
                          value={formData.assignee}
                          onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                          required
                        >
                          {assignees.map(assignee => (
                            <option key={assignee} value={assignee}>{assignee}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the task goals, requirements, and key deliverables..."
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Task Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        required
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Flag className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Priority *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        required
                      >
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Estimated Hours
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.estimatedHours}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                        placeholder="e.g., 8"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Clock className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Timeline</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Due Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Tags</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${formData.tags.includes(tag)
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtasks */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Subtasks</h3>
                  </div>
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Subtask</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.subtasks.map((subtask, index) => (
                    <div key={subtask.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={(e) => updateSubtask(subtask.id, "completed", e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <input
                        type="text"
                        value={subtask.title}
                        onChange={(e) => updateSubtask(subtask.id, "title", e.target.value)}
                        placeholder={`Subtask ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubtask(subtask.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Initial Comments</h3>
                </div>

                <div>
                  <textarea
                    value={formData.comments}
                    onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Add any initial comments or notes about this task..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">Error</span>
                  </div>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEditForm(false);
                    setEditingTask(null);
                  }}
                  disabled={isSubmitting}
                  className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Cancel</span>
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{showEditForm ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-4 h-4" />
                        <span>{showEditForm ? 'Update Task' : 'Create Task'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Analytics Cards - Mobile Optimized */}
        {!isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-2 animate-fade-in">
            <div className="bg-white rounded-md border border-slate-200 p-2 md:p-2.5 h-16 md:h-20 flex items-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-green-50 rounded-md flex items-center justify-center mr-2 md:mr-3">
                <CheckSquare className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-lg font-semibold text-slate-900">{analytics.totalTasks}</h3>
                <p className="text-xs text-slate-500">Total Tasks</p>
              </div>
              <div className="flex items-center gap-1 ml-1 md:ml-2">
                <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-500" />
                <span className="text-xs text-slate-400">+3</span>
              </div>
            </div>

            <div className="bg-white rounded-md border border-slate-200 p-2 md:p-2.5 h-16 md:h-20 flex items-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-50 rounded-md flex items-center justify-center mr-2 md:mr-3">
                <Play className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-lg font-semibold text-slate-900">{analytics.inProgressTasks}</h3>
                <p className="text-xs text-slate-500">In Progress</p>
              </div>
              <div className="flex items-center gap-1 ml-1 md:ml-2">
                <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-500" />
                <span className="text-xs text-slate-400">50%</span>
              </div>
            </div>

            <div className="bg-white rounded-md border border-slate-200 p-2 md:p-2.5 h-16 md:h-20 flex items-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-purple-50 rounded-md flex items-center justify-center mr-2 md:mr-3">
                <CheckCircle className="w-2.5 h-2.5 md:w-3 md:h-3 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-lg font-semibold text-slate-900">{analytics.completedTasks}</h3>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
              <div className="flex items-center gap-1 ml-1 md:ml-2">
                <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-500" />
                <span className="text-xs text-slate-400">+2</span>
              </div>
            </div>

            <div className="bg-white rounded-md border border-slate-200 p-2 md:p-2.5 h-16 md:h-20 flex items-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-orange-50 rounded-md flex items-center justify-center mr-2 md:mr-3">
                <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-lg font-semibold text-slate-900">{analytics.overdueTasks}</h3>
                <p className="text-xs text-slate-500">Overdue</p>
              </div>
              <div className="flex items-center gap-1 ml-1 md:ml-2">
                <TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3 text-red-500" />
                <span className="text-xs text-slate-400">!</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Search and Filters - Mobile Optimized */}
        {!isLoading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-2xl p-2.5 md:p-6 shadow-lg border border-white/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex flex-col lg:flex-row gap-2 md:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 text-slate-700 w-3.5 h-3.5 md:w-4 md:h-4" />
                <input
                  type="text"
                  placeholder="Search tasks, descriptions, or assignees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border-2 border-emerald-300 rounded-md md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm text-sm md:text-base transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 md:gap-3">
                <button
                  className="group flex items-center gap-1 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-3 border border-white/20 rounded-md md:rounded-xl hover:bg-white/50 transition-all duration-200 hover:scale-105 focus-ring text-xs md:text-sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-3 h-3 md:w-4 md:h-4" />
                  Filters
                </button>

                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1 md:p-2 rounded-md transition-all duration-200 ${viewMode === "grid"
                        ? "bg-emerald-100 text-emerald-600"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    <Grid3X3 size={14} className="md:w-[18px] md:h-[18px]" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1 md:p-2 rounded-md transition-all duration-200 ${viewMode === "list"
                        ? "bg-emerald-100 text-emerald-600"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    <List size={14} className="md:w-[18px] md:h-[18px]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-white/20 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    >
                      <option value="All">All Statuses</option>
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    >
                      <option value="All">All Priorities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FilterX className="w-4 h-4" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Task Tree View */}
        {showTreeView && !isLoading && (
          <div className="mb-6">
            <TaskTreeView
              tasks={taskTree}
              selectedTaskId={selectedTaskId || undefined}
              onTaskSelect={handleTaskSelect}
              onAddSubtask={handleAddSubtask}
              onEditTask={handleEditTaskFromTree}
              onDeleteTask={handleDeleteTaskFromTree}
              onToggleExpand={handleToggleExpand}
            />
          </div>
        )}

        {/* Task Grid/List View */}
        {!isLoading && (
  <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
    {viewMode === 'grid' ? (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4 lg:gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id}>
            {/* GRID card content for task (use your current JSX here) */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
              <div className="p-2 md:p-4">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-2 md:mb-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-xs md:text-sm lg:text-base truncate">
                        {task.title}
                      </h3>
                    </div>
                  </div>
                  <div className="relative task-menu">
                    <button
                      onClick={() => toggleMenu(task.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenuId === task.id && (
                      <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-50 animate-fade-in">
                        <div className="py-1">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Task
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(JSON.stringify(task, null, 2));
                              setSuccessMessage('Task details copied to clipboard!');
                              setTimeout(() => setSuccessMessage(null), 2000);
                              closeMenu();
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Details
                          </button>
                          <button
                            onClick={() => {
                              setSuccessMessage('Archive feature coming soon!');
                              setTimeout(() => setSuccessMessage(null), 2000);
                              closeMenu();
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Archive className="w-4 h-4" />
                            Archive
                          </button>
                          <div className="border-t border-slate-200 my-1"></div>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
                                deleteTask(task.id);
                              }
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Task
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-slate-500 mb-2 md:mb-4 line-clamp-2">
                  {task.description || "No description provided"}
                </p>

                {/* Progress and Tasks Section */}
                <div className="grid grid-cols-2 gap-2 md:gap-4 mb-2 md:mb-4">
                  <div className="text-center">
                    <div className="text-base md:text-lg font-bold text-slate-900">{task.progress}%</div>
                    <div className="text-xs text-slate-500">Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base md:text-lg font-bold text-slate-900">{task.subtasks?.length || 0}</div>
                    <div className="text-xs text-slate-500">Tasks</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 mb-2 md:mb-4"></div>

                {/* Status/Priority Tags */}
                <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4">
                  <span
                    className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${
                      statusColors[task.status as keyof typeof statusColors] ||
                      'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${
                      priorityColors[task.priority as keyof typeof priorityColors] ||
                      'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                {/* Details Section */}
                <div className="space-y-1 md:space-y-2 mb-2 md:mb-4">
                  <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-slate-600">
                    <Building className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                    <span className="truncate">{task.project}</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-slate-600">
                    <User className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                    <span>1 members</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-slate-600">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                    <span>{task.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-slate-600">
                    <Target className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>

                {/* View Details Link */}
                <div className="pt-1 md:pt-2">
                  <button className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200 group"
          >
            <div className="p-3 md:p-5">
              {/* list card content */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {React.createElement(getStatusIcon(task.status), {
                      className: 'w-6 h-6 text-slate-400',
                    })}
                  </div>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm md:text-base font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-1.5 ml-3">
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${
                            statusColors[task.status as keyof typeof statusColors] ||
                            'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.status}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${
                            priorityColors[task.priority as keyof typeof priorityColors] ||
                            'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-slate-600 mt-0.5 md:mt-1 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 md:flex md:items-center md:gap-6 mt-2 md:mt-3 text-[11px] md:text-sm text-slate-500">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <User className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="truncate">{task.assignee}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Building className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="truncate">{task.project}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{task.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{task.timeSpent}</span>
                      </div>
                    </div>

                    {/* Progress Bar for List View */}
                    <div className="mt-2.5 md:mt-4">
                      <div className="flex items-center justify-between text-[10px] md:text-sm text-slate-600 mb-1 md:mb-2">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1 md:h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-1 md:h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}


      {/* Empty State */}
      {!isLoading && filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks found</h3>
          <p className="text-slate-600 mb-4">Try adjusting your search or create a new task.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create First Task
          </button>
        </div>
      )}
    </div> 
    </div > 
  );
} 
