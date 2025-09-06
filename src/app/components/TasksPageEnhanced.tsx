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

  const handleSubmitTask = async (taskData: TaskData) => {
    try {
      setIsSubmittingTask(true);
      if (editingTask) {
        await TaskApiService.updateTask(editingTask.id!, taskData);
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
    <div className="min-h-screen bg-slate-100">
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
      <div className="bg-blue-100 border-b border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 px-3 md:px-8 py-1 md:py-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <ListChecks className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">Tasks</h1>
              <p className="text-slate-600 mt-1 text-xl">Manage your project tasks and subtasks</p>
            </div>
          </div>
          {/* Actions (responsive) */}
          <div className="hidden md:flex items-center gap-3">
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
              className="hidden md:flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold text-xl"
              >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
              Create Task
              </button>
          </div>
          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2">
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
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold text-base"
            >
              <Plus size={16} />
              Create
              </button>
          </div>
            </div>
          </div>

           {isLoading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {filteredTasks.map((task, index) => {
            // Colorful themes for task cards - matching project card design
            const taskThemes = [
              { bg: 'bg-blue-100', avatar: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
              { bg: 'bg-green-100', avatar: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
              { bg: 'bg-purple-100', avatar: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
              { bg: 'bg-yellow-100', avatar: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
              { bg: 'bg-pink-100', avatar: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
              { bg: 'bg-indigo-100', avatar: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
              { bg: 'bg-cyan-100', avatar: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
              { bg: 'bg-rose-100', avatar: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' }
            ];

            const theme = taskThemes[index % taskThemes.length];
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
                className={`${theme.bg} ${theme.border} rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 group relative cursor-pointer p-4 h-32`}
                       onClick={() => handleTaskSelect(task as any)}
                     >
                {/* Task Header with Avatar and Menu - Exact same layout as project cards */}
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Task Avatar - Same size and style as project cards */}
                    <div className={`w-10 h-10 ${theme.avatar} rounded-full flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0`}>
                      <span className={`text-sm font-bold ${theme.text}`}>
                        {getInitials(task.title || 'Task')}
                           </span>
                         </div>

                    {/* Task Info - Same layout as project cards */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold text-gray-900 truncate group-hover:underline transition-colors`}>
                        {task.title || 'Untitled Task'}
                      </h3>
                      <p className="text-base text-gray-600 truncate mt-1">
                        {subtaskCount} {subtaskCount === 1 ? 'subtask' : 'subtasks'}
                      </p>
                    </div>
                  </div>

                  {/* Three-dot Menu - Same position as project cards */}
                  <div className="relative flex-shrink-0">
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                        // Handle menu toggle here if needed
                           }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                         >
                      <MoreHorizontal className="w-4 h-4" />
                         </button>
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
