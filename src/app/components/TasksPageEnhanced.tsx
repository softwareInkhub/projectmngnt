"use client";

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
  ArrowLeft,
  GitBranch
} from "lucide-react";
import { TaskApiService, TaskData, TaskWithUI, transformTaskToUI, validateTaskData, buildTaskTree, TaskTreeNode, validateParentAssignment, getAvailableParents } from "../utils/taskApi";
import { ApiResponse } from "../utils/api";
import TaskTreeView from "./TaskTreeView";
import TaskListView from "./TaskListView";
import EnhancedTaskModal from "./EnhancedTaskModal";

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

export default function TasksPageEnhanced({ context }: { context?: { company: string } }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
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
  const [showEditForm, setShowEditForm] = useState(false);

  // Nested subtask state
  const [taskTree, setTaskTree] = useState<TaskTreeNode[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"tree" | "list" | "grid">("tree");
  const [expandedTreeNodes, setExpandedTreeNodes] = useState<Set<string>>(new Set());
  
  // Enhanced task modal state
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Function to fetch tasks from API
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await TaskApiService.getTasks();

      if (response.success) {
        // Handle different response structures
        const tasksData = (response as any).items || response.data || [];

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

  // Enhanced task management functions
  const handleTaskSelect = (task: TaskTreeNode) => {
    setSelectedTaskId(task.id!);
  };

  const handleAddSubtask = (parentId: string) => {
    setParentTaskId(parentId);
    setEditingTask(null);
    setShowEnhancedModal(true);
  };

  const handleEditTask = (task: TaskTreeNode) => {
    setEditingTask(task);
    setParentTaskId(null);
    setShowEnhancedModal(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await TaskApiService.deleteTask(taskId);
        await fetchTasks();
        setSuccessMessage('Task deleted successfully');
      } catch (error) {
        setError('Failed to delete task');
      }
    }
  };

  const handleToggleStatus = async (taskId: string, newStatus: string) => {
    try {
      await TaskApiService.updateTask(taskId, { status: newStatus });
      await fetchTasks();
    } catch (error) {
      setError('Failed to update task status');
    }
  };

  const handleSubmitTask = async (taskData: TaskData) => {
    try {
      setIsSubmittingTask(true);
      
      if (editingTask) {
        await TaskApiService.updateTask(editingTask.id!, taskData);
        setSuccessMessage('Task updated successfully');
      } else {
        await TaskApiService.createTask(taskData);
        setSuccessMessage('Task created successfully');
      }
      
      await fetchTasks();
      setShowEnhancedModal(false);
      setEditingTask(null);
      setParentTaskId(null);
    } catch (error) {
      setError('Failed to save task');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const analytics = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === "Done").length,
    inProgressTasks: tasks.filter(t => t.status === "In Progress").length,
    overdueTasks: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== "Done").length,
    avgProgress: tasks.length > 0 ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length) : 0,
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get status icon component
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "To Do":
        return Square;
      case "In Progress":
        return Play;
      case "Done":
        return CheckCircle;
      case "On Hold":
        return Pause;
      case "Review":
        return Eye;
      case "Blocked":
        return AlertCircle;
      default:
        return Square;
    }
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
            <p className="text-slate-600 mt-1">Manage your project tasks and subtasks</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("tree")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "tree" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Tree View"
              >
                <GitBranch className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            {/* Create Task Button */}
            <button
              onClick={() => {
                setEditingTask(null);
                setParentTaskId(null);
                setShowEnhancedModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-900">{analytics.totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-emerald-600">{analytics.completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.inProgressTasks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{analytics.overdueTasks}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Priority</option>
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setPriorityFilter("All");
                }}
                className="px-3 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                title="Clear filters"
              >
                <FilterX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

                 {/* Enhanced Task Form - Inline */}
         {showEnhancedModal && (
           <EnhancedTaskModal
             isOpen={showEnhancedModal}
             onClose={() => {
               setShowEnhancedModal(false);
               setEditingTask(null);
               setParentTaskId(null);
             }}
             onSubmit={handleSubmitTask}
             editingTask={editingTask}
             parentTaskId={parentTaskId}
             allTasks={taskTree}
             isLoading={isSubmittingTask}
           />
         )}

         {/* Content */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           {isLoading ? (
             <div className="flex items-center justify-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
               <span className="ml-3 text-slate-600">Loading tasks...</span>
             </div>
           ) : (
             <>
               {viewMode === "tree" && (
                 <TaskTreeView
                   tasks={taskTree}
                   onTaskSelect={handleTaskSelect}
                   onAddSubtask={handleAddSubtask}
                   onEditTask={handleEditTask}
                   onDeleteTask={handleDeleteTask}
                   selectedTaskId={selectedTaskId}
                 />
               )}

               {viewMode === "list" && (
                 <TaskListView
                   tasks={taskTree}
                   onTaskSelect={handleTaskSelect}
                   onAddSubtask={handleAddSubtask}
                   onEditTask={handleEditTask}
                   onDeleteTask={handleDeleteTask}
                   onToggleStatus={handleToggleStatus}
                   selectedTaskId={selectedTaskId}
                 />
               )}

               {viewMode === "grid" && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredTasks.map((task) => (
                     <div
                       key={task.id}
                       className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                       onClick={() => handleTaskSelect(task as any)}
                     >
                       <div className="flex items-start justify-between mb-4">
                         <div className="flex items-center gap-2">
                           {React.createElement(getStatusIcon(task.status), {
                             className: 'w-5 h-5 text-slate-400',
                           })}
                           <span
                             className={`px-2 py-1 rounded-full text-xs font-medium ${
                               statusColors[task.status as keyof typeof statusColors] ||
                               'bg-slate-100 text-slate-700'
                             }`}
                           >
                             {task.status}
                           </span>
                         </div>
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleEditTask(task as any);
                           }}
                           className="p-1 hover:bg-slate-100 rounded transition-colors"
                         >
                           <MoreHorizontal className="w-4 h-4 text-slate-400" />
                         </button>
                       </div>

                       <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                         {task.title}
                       </h3>
                       
                       <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                         {task.description}
                       </p>

                       <div className="space-y-2 text-sm text-slate-500">
                         <div className="flex items-center gap-2">
                           <User className="w-4 h-4" />
                           <span>{task.assignee}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <Calendar className="w-4 h-4" />
                           <span>{task.dueDate}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <Target className="w-4 h-4" />
                           <span>{task.project}</span>
                         </div>
                       </div>

                       {/* Progress Bar */}
                       <div className="mt-4">
                         <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                           <span>Progress</span>
                           <span>{task.progress}%</span>
                         </div>
                         <div className="w-full bg-slate-200 rounded-full h-2">
                           <div
                             className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                             style={{ width: `${task.progress}%` }}
                           ></div>
                         </div>
                       </div>
                     </div>
                   ))}
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
                     onClick={() => {
                       setEditingTask(null);
                       setParentTaskId(null);
                       setShowEnhancedModal(true);
                     }}
                     className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
                   >
                     <Plus className="w-4 h-4" />
                     Create First Task
                   </button>
                 </div>
               )}
             </>
           )}
         </div>
       </div>
    </div>
  );
}
