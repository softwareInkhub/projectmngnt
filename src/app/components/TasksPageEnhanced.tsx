"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  FilterX,
  List,
  Grid3X3,
  GitBranch,
  RotateCcw,
  X,
  CheckSquare,
  Play,
  ListChecks,
  MoreHorizontal,
  User,
  Calendar,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  TaskApiService,
  transformTaskToUI,
  buildTaskTree,
  flattenTaskTree,
  TaskTreeNode,
  TaskData,
} from "../utils/taskApi";
import TaskTreeView from "./TaskTreeView";
import TaskListView from "./TaskListView";
import EnhancedTaskModal from "./EnhancedTaskModal";
import UniversalDetailsModal from "./UniversalDetailsModal";
import { useTaskUpdates } from "../hooks/useTaskUpdates";

const initialTasks: any[] = [];
const statuses = ["To Do", "In Progress", "Review", "Done", "Blocked"];
const priorities = ["Low", "Medium", "High", "Critical"];

export default function TasksPageEnhanced({
  context,
}: {
  context?: { company: string };
}) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskTree, setTaskTree] = useState<TaskTreeNode[]>([]);
  const [viewMode, setViewMode] = useState<"tree" | "list" | "grid">("list");
  const [isLandscape, setIsLandscape] = useState(false);
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    itemType: 'task' as 'task' | 'project',
    itemId: ''
  });
  const [notification, setNotification] = useState<string | null>(null);

  // Task updates hook with fallback
  const { updateTaskField, isUpdating, retryFailedUpdates } = useTaskUpdates({
    onUpdate: (updatedTask) => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? transformTaskToUI(updatedTask) : t));
      setTaskTree(prev => {
        const flatTasks = flattenTaskTree(prev);
        const updatedFlatTasks = flatTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        return buildTaskTree(updatedFlatTasks);
      });
      setError(null); // Clear any previous errors
    },
    onError: (error) => {
      console.error('Task update error:', error);
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 5000);
    },
    onLocalSave: (message) => {
      console.log('Task saved locally:', message);
      setNotification(message);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  });

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await TaskApiService.getTasks();
      console.log('Tasks fetched from API:', response);
      
      if (response.success) {
        const tasksData = response.data || [];
        console.log('🔄 Raw tasks data from API:', tasksData);
        
        const uiTasks = tasksData.map((item: TaskData) => {
          const transformed = transformTaskToUI(item);
          console.log(`🔄 Transformed task ${item.id} (${item.title}):`, {
            originalSubtasks: item.subtasks,
            transformedSubtasks: transformed.subtasks
          });
          return transformed;
        });
        
        setTasks(uiTasks);
        const tree = buildTaskTree(tasksData);
        setTaskTree(tree);
      } else {
        console.error('Failed to fetch tasks:', response.error);
        setError('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Error fetching tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate dropdown position
  const calculateDropdownPosition = (buttonElement: HTMLButtonElement) => {
    const rect = buttonElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    return {
      top: rect.bottom + scrollTop + 4, // 4px gap
      left: rect.right + scrollLeft - 160 // 160px is dropdown width, align to right edge
    };
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
      setDropdownPosition(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || task.status === statusFilter) &&
      (priorityFilter === "All" || task.priority === priorityFilter)
  );

  const handleTaskSelect = (task: TaskTreeNode) => {
    console.log('=== TASK DETAILS MODAL DEBUG ===');
    console.log('Opening details modal for task:', task.id);
    console.log('Task type:', typeof task.id);
    console.log('Task ID length:', task.id?.length);
    console.log('Is task ID empty?', !task.id || task.id.trim() === '');
    console.log('Current tasks:', tasks.map(t => ({ id: t.id, title: t.title })));
    
    // Ensure we have a valid task ID
    if (!task.id || task.id.trim() === '') {
      console.error('Invalid task ID:', task.id);
      return;
    }
    
    // Open the Universal Details Modal
    setDetailsModal({
      isOpen: true,
      itemType: 'task',
      itemId: task.id
    });
  };

  // Close Universal Details Modal
  const closeDetailsModal = () => {
    setDetailsModal({
      isOpen: false,
      itemType: 'task',
      itemId: ''
    });
  };

  const handleMenuAction = (task: TaskTreeNode, action: string) => {
    setOpenMenuId(null);
    switch (action) {
      case 'view':
        handleTaskSelect(task);
        break;
      case 'edit':
        setEditingTask(task as any);
        setShowEnhancedModal(true);
        break;
      case 'add-subtask':
        setParentTaskId(task.id!);
        setShowEnhancedModal(true);
        break;
      case 'delete':
        handleDeleteTask(task.id!);
        break;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskApiService.deleteTask(taskId);
      fetchTasks();
      setSuccessMessage("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task");
    }
  };

  const handleSubmitTask = async (taskData: TaskData) => {
    try {
      setIsSubmittingTask(true);
      if (editingTask) {
        // Exclude fields that might conflict with backend _metadata field
        const { 
          id, 
          subtasks, 
          description, 
          comments, 
          tags, 
          progress,
          timeSpent,
          estimatedHours,
          createdAt, 
          updatedAt,
          ...updateData 
        } = taskData;
        await TaskApiService.updateTask(editingTask.id!, updateData);
        setSuccessMessage("Task updated successfully");
      } else {
        const newTask = await TaskApiService.createTask(taskData);
        setSuccessMessage("Task created successfully");
        
        // If this is a subtask (has parentTaskId), update the parent task's subtasks list
        if (parentTaskId && newTask.success && newTask.data) {
          try {
            // Find the parent task to get its current subtasks
            const parentTask = tasks.find(task => task.id === parentTaskId);
            if (parentTask) {
              // Parse existing subtasks
              let currentSubtasks = [];
              if (parentTask.subtasks) {
                if (typeof parentTask.subtasks === 'string') {
                  try {
                    currentSubtasks = JSON.parse(parentTask.subtasks);
                  } catch (error) {
                    console.warn('Failed to parse existing subtasks:', error);
                    currentSubtasks = [];
                  }
                } else if (Array.isArray(parentTask.subtasks)) {
                  currentSubtasks = parentTask.subtasks;
                }
              }

              // Add the new subtask
              const newSubtask = {
                id: newTask.data.id,
                title: newTask.data.title || 'Untitled Task',
                completed: false
              };

              const updatedSubtasks = [...currentSubtasks, newSubtask];

              // Update the parent task's subtasks in the database
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://brmh.in'}/crud?tableName=tasks&id=${parentTaskId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  key: { id: parentTaskId },
                  updates: { subtasks: JSON.stringify(updatedSubtasks) }
                }),
              });

              if (response.ok) {
                console.log(`✅ Parent task updated with new subtask: ${newTask.data.title}`);
              } else {
                console.warn(`⚠️ Failed to update parent task with new subtask:`, response.status, response.statusText);
              }
            }
          } catch (error) {
            console.error('Error updating parent task with new subtask:', error);
          }
        }
      }
      await fetchTasks();
      setShowEnhancedModal(false);
      setEditingTask(null);
      setParentTaskId(null);
    } catch (error) {
      setError("Failed to save task");
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const analytics = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "Done").length,
    inProgressTasks: tasks.filter((t) => t.status === "In Progress").length,
    overdueTasks: tasks.filter(
      (t) => new Date(t.dueDate) < new Date() && t.status !== "Done"
    ).length,
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="min-h-screen bg-slate-100 overflow-x-hidden">
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <div className="flex gap-2">
              <button 
                onClick={fetchTasks}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                Retry Fetch
              </button>
              <button 
                onClick={retryFailedUpdates}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                Retry Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local Save Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{notification}</span>
          </div>
        </div>
      )}
      

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 px-3 md:px-8 py-1 md:py-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
              <ListChecks className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">Tasks</h1>
              <p className="text-slate-600 mt-1 text-xl">Manage your project tasks and subtasks</p>
            </div>
          </div>
          {/* Actions (responsive) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Desktop search/filters */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 text-xl" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32">
              <option value="All">All Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Done">Done</option>
              <option value="Blocked">Blocked</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32">
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            {/* View Toggle Buttons */}
            <div className="flex items-center bg-white rounded-lg border border-slate-300 p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <List size={16} />
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Grid3X3 size={16} />
                Grid
              </button>
              <button
                onClick={() => setViewMode("tree")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === "tree"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <GitBranch size={16} />
                Tree
              </button>
            </div>
              {/* Create Task Button */}
              <button
                onClick={() => {
                  setEditingTask(null);
                  setParentTaskId(null);
                  setShowEnhancedModal(true);
                }}
              className="hidden md:flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold text-xl"
              >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
              Create Task
              </button>
          </div>
          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile search */}
            <div className="relative flex-1 max-w-28">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-7 pr-2 py-2 border border-slate-300 rounded-md text-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-full" 
              />
            </div>
            {/* Mobile filters */}
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-1.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white w-16">
              <option value="All">Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Done">Done</option>
              <option value="Blocked">Blocked</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-1.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white w-16">
              <option value="All">Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            {/* Mobile View Toggle */}
            <div className="flex items-center bg-white rounded-lg border border-slate-300 p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <List size={14} />
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Grid3X3 size={14} />
                Grid
              </button>
              <button
                onClick={() => setViewMode("tree")}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  viewMode === "tree"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <GitBranch size={14} />
                Tree
              </button>
            </div>
              <button
                onClick={() => {
                setEditingTask(null);
                setParentTaskId(null);
                setShowEnhancedModal(true);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold text-base"
            >
              <Plus size={16} />
              Create
              </button>
          </div>
            </div>
          </div>

          {/* Inline Task Form - Show at top of page when editing */}
          {showEnhancedModal && (
            <div className="px-3 md:px-8 py-4">
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
                allTasks={tasks}
                isLoading={isSubmittingTask}
              />
            </div>
          )}

           {isLoading ? (
        <div className="flex justify-center items-center mt-10 overflow-x-hidden">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center text-gray-500 mt-10 overflow-x-hidden">
          No tasks found. Create a new one!
                       </div>
      ) : viewMode === "list" ? (
                 <TaskListView
                   tasks={taskTree}
                   onTaskSelect={handleTaskSelect}
          onAddSubtask={(parentId) => {
            setParentTaskId(parentId);
            setShowEnhancedModal(true);
          }}
          onEditTask={(task) => {
            setEditingTask(task as any);
            setShowEnhancedModal(true);
          }}
          onDeleteTask={async (taskId) => {
            await TaskApiService.deleteTask(taskId);
            fetchTasks();
            setSuccessMessage("Task deleted");
          }}
          onToggleStatus={async (taskId, status) => {
            await TaskApiService.updateTask(taskId, { status });
            fetchTasks();
          }}
          onUpdateTaskField={(taskId: string, field: keyof TaskTreeNode, value: string | number) => {
            // Only allow updating fields that exist in TaskData
            const allowedFields: (keyof TaskData)[] = ['title', 'description', 'assignee', 'status', 'priority', 'dueDate', 'progress'];
            if (allowedFields.includes(field as keyof TaskData)) {
              return updateTaskField(taskId, field as keyof TaskData, value);
            }
            return Promise.resolve(false);
          }}
          onRefreshTasks={fetchTasks}
          selectedTaskId={null}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 p-1 overflow-x-hidden" style={{ isolation: 'auto' }}>
          {filteredTasks.map((task, index) => {
            // Consistent light gradient theme for all task cards
            const theme = { bg: 'bg-gradient-to-br from-blue-50 to-blue-100', avatar: 'bg-gradient-to-br from-blue-100 to-blue-200', text: 'text-blue-700', border: 'border-blue-200' };
            const getInitials = (title: string) => {
              return title
                .split(' ')
                .map(word => word.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2);
            };

            // Count subtasks for display
            const subtaskCount = task.children ? task.children.length : 0;

            return (
                     <div
                       key={task.id}
                className={`${theme.bg} ${theme.border} rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 group relative cursor-pointer p-3 h-16`}
                       onClick={(e) => {
                         // Don't trigger task selection if clicking on the menu button
                         if (e.target instanceof HTMLElement && e.target.closest('button[data-menu-button]')) {
                           return;
                         }
                         handleTaskSelect(task as any);
                       }}
                     >
                {/* Task Header with Avatar and Menu - Exact same layout as project cards */}
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Task Avatar - Same size and style as project cards */}
                    <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0`}>
                      <span className={`text-sm font-bold text-white`}>
                        {getInitials(task.title || 'Task')}
                           </span>
                         </div>

                    {/* Task Info - Same layout as project cards */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold text-gray-900 truncate group-hover:underline transition-colors`}>
                        {task.title || 'Untitled Task'}
                      </h3>
                      <div className="space-y-0.5 text-base text-gray-600">
                        <div className="truncate">
                          <span className="font-medium">Assignee:</span> {task.assignee || 'Unassigned'}
                        </div>
                        <div className="truncate">
                          <span className="font-medium">Priority:</span> 
                          <span className={`ml-1 px-1.5 py-0.5 rounded text-base font-medium ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            task.priority === 'Low' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.priority || 'Medium'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Three-dot Menu - Same position as project cards */}
                  <div className="relative flex-shrink-0">
                         <button
                           ref={(el) => {
                             if (task.id) {
                               buttonRefs.current[task.id] = el;
                             }
                           }}
                           onClick={(e) => {
                             e.stopPropagation();
                             e.preventDefault();
                             e.nativeEvent.stopImmediatePropagation();
                             console.log('Grid menu clicked for task:', task.id);
                             
                             if (openMenuId === task.id) {
                               setOpenMenuId(null);
                               setDropdownPosition(null);
                             } else {
                               setOpenMenuId(task.id || null);
                               if (task.id && buttonRefs.current[task.id]) {
                                 const position = calculateDropdownPosition(buttonRefs.current[task.id]!);
                                 setDropdownPosition(position);
                               }
                             }
                           }}
                           onMouseDown={(e) => {
                             e.stopPropagation();
                             e.nativeEvent.stopImmediatePropagation();
                           }}
                      className="relative z-10 p-1 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                      data-menu-button="true"
                         >
                      <MoreHorizontal className="w-5 h-5" />
                         </button>

                         {/* Dropdown Menu - Portal */}
                         {openMenuId === task.id && dropdownPosition && createPortal(
                           <div 
                             className="fixed w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-[99999] animate-in slide-in-from-top-2 duration-200"
                             style={{
                               top: `${dropdownPosition.top}px`,
                               left: `${dropdownPosition.left}px`
                             }}
                             onClick={(e) => e.stopPropagation()}
                           >
                             <div className="py-1">
                               <button 
                                 onClick={(e) => { 
                                   e.stopPropagation(); 
                                   setOpenMenuId(null);
                                   setDropdownPosition(null);
                                   handleMenuAction(task, 'view'); 
                                 }} 
                                 className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                               >
                                 <Eye size={14} />View Details
                               </button>
                               <button 
                                 onClick={(e) => { 
                                   e.stopPropagation(); 
                                   setOpenMenuId(null);
                                   setDropdownPosition(null);
                                   handleMenuAction(task, 'edit'); 
                                 }} 
                                 className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                               >
                                 <Edit size={14} />Edit
                               </button>
                               <button 
                                 onClick={(e) => { 
                                   e.stopPropagation(); 
                                   setOpenMenuId(null);
                                   setDropdownPosition(null);
                                   handleMenuAction(task, 'add-subtask'); 
                                 }} 
                                 className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                               >
                                 <Plus size={14} />Add Subtask
                               </button>
                               <button 
                                 onClick={(e) => { 
                                   e.stopPropagation(); 
                                   setOpenMenuId(null);
                                   setDropdownPosition(null);
                                   handleMenuAction(task, 'delete'); 
                                 }} 
                                 className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                               >
                                 <Trash2 size={14} />Delete
                               </button>
                             </div>
                           </div>,
                           document.body
                         )}
                       </div>
                         </div>
                       </div>
            );
          })}
                         </div>
      ) : (
                       <TaskTreeView
                         tasks={taskTree}
                         onTaskSelect={handleTaskSelect}
          onAddSubtask={(parentId) => {
            setParentTaskId(parentId);
            setShowEnhancedModal(true);
          }}
          onEditTask={(task) => {
            setEditingTask(task as any);
                       setShowEnhancedModal(true);
                     }}
          onDeleteTask={async (taskId) => {
            await TaskApiService.deleteTask(taskId);
            fetchTasks();
            setSuccessMessage("Task deleted");
          }}
          onToggleStatus={async (taskId, status) => {
            await TaskApiService.updateTask(taskId, { status });
            fetchTasks();
          }}
          selectedTaskId={null}
                         isLandscape={isLandscape}
                         onToggleLandscape={() => setIsLandscape(!isLandscape)}
                       />
               )}


      {/* Universal Details Modal */}
      {detailsModal.isOpen && (
        <UniversalDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={closeDetailsModal}
          itemType={detailsModal.itemType}
          itemId={detailsModal.itemId}
        />
      )}
    </div>
  );
}
