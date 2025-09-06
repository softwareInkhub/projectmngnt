"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  CheckSquare, 
  Square, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  Flag,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { TaskTreeNode } from '../utils/taskApi';

interface TaskListViewProps {
  tasks: TaskTreeNode[];
  onTaskSelect: (task: TaskTreeNode) => void;
  onAddSubtask: (parentId: string) => void;
  onEditTask: (task: TaskTreeNode) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string, newStatus: string) => Promise<void>;
  selectedTaskId?: string | null;
}

const statusIcons = {
  "To Do": Square,
  "In Progress": Clock,
  "Done": CheckSquare,
  "On Hold": AlertCircle,
  "Review": Clock,
  "Blocked": AlertCircle
};

const statusColors = {
  "To Do": "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Done": "bg-emerald-100 text-emerald-700",
  "On Hold": "bg-orange-100 text-orange-700",
  "Review": "bg-purple-100 text-purple-700",
  "Blocked": "bg-red-100 text-red-700"
};

const priorityColors = {
  "High": "bg-red-100 text-red-700",
  "Medium": "bg-yellow-100 text-yellow-700",
  "Low": "bg-green-100 text-green-700",
  "Critical": "bg-red-200 text-red-800"
};

// Helper function to get initials
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Colorful row themes
const rowThemes = [
  { bg: 'bg-blue-100', border: 'border-blue-200' },
  { bg: 'bg-green-100', border: 'border-green-200' },
  { bg: 'bg-purple-100', border: 'border-purple-200' },
  { bg: 'bg-yellow-100', border: 'border-yellow-200' },
  { bg: 'bg-pink-100', border: 'border-pink-200' },
  { bg: 'bg-indigo-100', border: 'border-indigo-200' },
  { bg: 'bg-cyan-100', border: 'border-cyan-200' },
  { bg: 'bg-rose-100', border: 'border-rose-200' }
];

export default function TaskListView({
  tasks,
  onTaskSelect,
  onAddSubtask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  selectedTaskId
}: TaskListViewProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const isExpanded = (taskId: string) => expandedTasks.has(taskId);
  const hasChildren = (task: TaskTreeNode) => task.children && task.children.length > 0;

  const handleStatusToggle = (task: TaskTreeNode) => {
    const newStatus = task.status === 'Done' ? 'To Do' : 'Done';
    onToggleStatus(task.id!, newStatus);
  };

  const handleMenuAction = (task: TaskTreeNode, action: string) => {
    setOpenMenuId(null);
    switch (action) {
      case 'view':
        onTaskSelect(task);
        break;
      case 'edit':
        onEditTask(task);
        break;
      case 'add-subtask':
        onAddSubtask(task.id!);
        break;
      case 'delete':
        onDeleteTask(task.id!);
        break;
    }
  };

  // Flatten tasks for table display
  const flattenTasks = (taskList: TaskTreeNode[], level: number = 0): (TaskTreeNode & { level: number })[] => {
    const result: (TaskTreeNode & { level: number })[] = [];
    
    taskList.forEach(task => {
      result.push({ ...task, level });
      if (isExpanded(task.id!) && task.children) {
        result.push(...flattenTasks(task.children, level + 1));
      }
    });
    
    return result;
  };

  const flattenedTasks = flattenTasks(tasks);

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="w-full space-y-3 px-4">
        {flattenedTasks.map((task, index) => {
          const theme = rowThemes[index % rowThemes.length];
          const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Square;
          const isCompleted = task.status === 'Done';

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`${theme.bg} ${theme.border} rounded-lg border p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
              onClick={() => onTaskSelect(task)}
            >
              {/* Task Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Expand/Collapse Button */}
                  {hasChildren(task) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(task.id!);
                      }}
                      className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <motion.div
                        animate={{ rotate: isExpanded(task.id!) ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </button>
                  )}

                  {/* Status Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusToggle(task);
                    }}
                    className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <StatusIcon className={`w-4 h-4 ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`} />
                  </button>

                  {/* Task Title */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-lg ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {task.title || 'Untitled Task'}
                    </h4>
                    {task.description && (
                      <p className="text-base text-slate-600 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Three-dot Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === task.id ? null : task.id);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === task.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="py-1">
                        <button onClick={() => handleMenuAction(task, 'view')} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Eye size={14} />View Details</button>
                        <button onClick={() => handleMenuAction(task, 'edit')} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Edit size={14} />Edit</button>
                        <button onClick={() => handleMenuAction(task, 'add-subtask')} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Plus size={14} />Add Subtask</button>
                        <button onClick={() => handleMenuAction(task, 'delete')} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} />Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Task Details */}
              <div className="flex items-center gap-4 text-base">
                {/* Status Badge */}
                <span className={`px-3 py-1.5 rounded-full text-base font-medium ${
                  statusColors[task.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                }`}>
                  {task.status}
                </span>

                {/* Priority Badge */}
                {task.priority && (
                  <span className={`px-3 py-1.5 rounded-full text-base font-medium ${
                    priorityColors[task.priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-700'
                  }`}>
                    {task.priority}
                  </span>
                )}

                {/* Assignee */}
                {task.assignee && (
                  <div className="flex items-center gap-2 text-base text-slate-600">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-700">
                        {getInitials(task.assignee)}
                      </span>
                    </div>
                    <span className="truncate max-w-20">{task.assignee}</span>
                  </div>
                )}

                {/* Due Date */}
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-base text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{task.dueDate}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Desktop Layout - Table View
  return (
    <div className="w-full">
      {/* Table Header */}
      <div className="bg-blue-100 rounded-lg border border-blue-200 shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 text-base font-semibold text-slate-900">
          <div className="col-span-1">ID</div>
          <div className="col-span-3">Task Name</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-1">Assignee</div>
          <div className="col-span-1">Due Date</div>
          <div className="col-span-1">Progress</div>
          <div className="col-span-1">Tags</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="space-y-2 mt-2">
        {flattenedTasks.map((task, index) => {
          const theme = rowThemes[index % rowThemes.length];
          const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Square;
          const isCompleted = task.status === 'Done';

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`${theme.bg} ${theme.border} rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
              onClick={() => onTaskSelect(task)}
            >
              <div className="grid grid-cols-12 gap-4 p-4 items-center">
                {/* ID */}
                <div className="col-span-1 text-base font-medium text-slate-700 truncate">
                  {task.id?.slice(-8) || 'N/A'}
                </div>

                {/* Task Name */}
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    {/* Expand/Collapse Button */}
                    {hasChildren(task) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(task.id!);
                        }}
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <motion.div
                          animate={{ rotate: isExpanded(task.id!) ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      </button>
                    )}

                    {/* Status Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusToggle(task);
                      }}
                      className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <StatusIcon className={`w-4 h-4 ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`} />
                    </button>

                    {/* Task Title */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-lg ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {task.title || 'Untitled Task'}
                      </h4>
                      {task.description && (
                        <p className="text-base text-slate-600 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <span className={`px-3 py-1.5 rounded-full text-base font-medium ${
                    statusColors[task.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status}
                  </span>
                </div>

                {/* Priority */}
                <div className="col-span-1">
                  {task.priority && (
                    <span className={`px-3 py-1.5 rounded-full text-base font-medium ${
                      priorityColors[task.priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-700'
                    }`}>
                      {task.priority}
                    </span>
                  )}
                </div>

                {/* Assignee */}
                <div className="col-span-1">
                  {task.assignee && (
                    <div className="flex items-center gap-2 text-base text-slate-600">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-700">
                          {getInitials(task.assignee)}
                        </span>
                      </div>
                      <span className="truncate max-w-20">{task.assignee}</span>
                    </div>
                  )}
                </div>

                {/* Due Date */}
                <div className="col-span-1 text-base text-slate-600 whitespace-nowrap">
                  {task.dueDate || 'No date'}
                </div>

                {/* Progress */}
                <div className="col-span-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${isCompleted ? 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-base font-medium text-slate-700">
                      {isCompleted ? '100' : '0'}%
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="col-span-1">
                  {task.tags && Array.isArray(task.tags) && task.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {task.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                      {task.tags.length > 2 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          +{task.tags.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-base text-slate-500">No tags</span>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-1 relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === task.id ? null : task.id);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === task.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="py-1">
                        <button onClick={() => handleMenuAction(task, 'view')} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Eye size={14} />View Details</button>
                        <button onClick={() => handleMenuAction(task, 'edit')} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Edit size={14} />Edit</button>
                        <button onClick={() => handleMenuAction(task, 'add-subtask')} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Plus size={14} />Add Subtask</button>
                        <button onClick={() => handleMenuAction(task, 'delete')} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} />Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {flattenedTasks.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Square className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-lg">No tasks available</p>
        </div>
      )}
    </div>
  );
}