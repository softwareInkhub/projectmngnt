"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  TaskTreeNode,
  TaskData,
} from "../utils/taskApi";
import TaskTreeView from "./TaskTreeView";
import TaskListView from "./TaskListView";
import EnhancedTaskModal from "./EnhancedTaskModal";

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

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await TaskApiService.getTasks();
      if (response.success) {
        const tasksData = (response as any).items || response.data || [];
        const uiTasks = tasksData.map((item: TaskData) =>
          transformTaskToUI(item)
        );
          setTasks(uiTasks);
          const tree = buildTaskTree(tasksData);
          setTaskTree(tree);
      } else {
        setError("Failed to load tasks");
      }
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
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
    if (!task.id || task.id.trim() === "") return;
    router.push(`/tasks/${task.id}`);
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
        // Exclude id from update data since it's part of the primary key
        const { id, ...updateData } = taskData;
        await TaskApiService.updateTask(editingTask.id!, updateData);
        setSuccessMessage("Task updated successfully");
      } else {
        await TaskApiService.createTask(taskData);
        setSuccessMessage("Task created successfully");
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
          {error}
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
          selectedTaskId={null}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 p-1 overflow-x-hidden">
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
                      <p className="text-sm text-gray-600 truncate">
                        {subtaskCount} {subtaskCount === 1 ? 'task' : 'tasks'}
                      </p>
                    </div>
                  </div>

                  {/* Three-dot Menu - Same position as project cards */}
                  <div className="relative flex-shrink-0">
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             e.preventDefault();
                             e.nativeEvent.stopImmediatePropagation();
                             console.log('Grid menu clicked for task:', task.id);
                             setOpenMenuId(openMenuId === task.id ? null : task.id);
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

                         {/* Dropdown Menu */}
                         {openMenuId === task.id && (
                           <div 
                             className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-[9999] animate-in slide-in-from-top-2 duration-200"
                             onClick={(e) => e.stopPropagation()}
                           >
                             <div className="py-1">
                               <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'view'); }} className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                 <Eye size={14} />View Details
                               </button>
                               <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'edit'); }} className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                 <Edit size={14} />Edit
                               </button>
                               <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'add-subtask'); }} className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                 <Plus size={14} />Add Subtask
                               </button>
                               <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'delete'); }} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                 <Trash2 size={14} />Delete
                               </button>
                             </div>
                           </div>
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

      {showEnhancedModal && (
        <EnhancedTaskModal
          isOpen={showEnhancedModal}
          onClose={() => setShowEnhancedModal(false)}
          onSubmit={handleSubmitTask}
          editingTask={editingTask}
          parentTaskId={parentTaskId}
          allTasks={tasks}
          isLoading={isSubmittingTask}
        />
      )}
    </div>
  );
}
