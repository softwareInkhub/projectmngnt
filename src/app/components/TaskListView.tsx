"use client";

import React, { useState } from 'react';
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

  const renderTaskRow = (task: TaskTreeNode, level: number = 0) => {
    const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Square;
    const isSelected = selectedTaskId === task.id;
    const isHovered = hoveredTask === task.id;
    const expanded = isExpanded(task.id!);
    const children = task.children || [];
    const isCompleted = task.status === 'Done';

    return (
      <motion.div
        key={task.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {/* Main Task Row */}
        <motion.div
          className={`
            group relative flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg
            hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer
            ${isSelected ? 'ring-2 ring-blue-500 border-blue-300' : ''}
            ${isCompleted ? 'opacity-75' : ''}
          `}
          onMouseEnter={() => setHoveredTask(task.id!)}
          onMouseLeave={() => setHoveredTask(null)}
          onClick={() => onTaskSelect(task)}
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          style={{ marginLeft: `${level * 24}px` }}
        >
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
                animate={{ rotate: expanded ? 90 : 0 }}
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
            <h4 className={`font-medium text-sm break-words ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
              {task.title}
            </h4>
            {task.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                {task.description}
              </p>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[task.status as keyof typeof statusColors] || 'bg-slate-100 text-slate-700'
            }`}>
              {task.status}
            </span>
          </div>

          {/* Priority Badge */}
          {task.priority && (
            <div className="flex-shrink-0">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                priorityColors[task.priority as keyof typeof priorityColors] || 'bg-slate-100 text-slate-700'
              }`}>
                {task.priority}
              </span>
            </div>
          )}

          {/* Assignee */}
          {task.assignee && (
            <div className="flex-shrink-0 flex items-center gap-1 text-xs text-slate-500">
              <User className="w-3 h-3" />
              <span className="truncate max-w-20">{task.assignee}</span>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex-shrink-0 flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>{task.dueDate}</span>
            </div>
          )}

          {/* Action Buttons */}
          <AnimatePresence>
            {(isHovered || isSelected) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubtask(task.id!);
                  }}
                  className="p-1.5 rounded-md hover:bg-blue-100 text-blue-600 transition-colors"
                  title="Add subtask"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                  title="Edit task"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id!);
                  }}
                  className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Subtasks */}
        <AnimatePresence>
          {expanded && hasChildren(task) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mt-2"
            >
              <div className="space-y-2">
                {children.map(child => renderTaskRow(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <span className="w-8">Status</span>
          <span className="flex-1">Task</span>
          <span className="w-16">Status</span>
          <span className="w-16">Priority</span>
          <span className="w-20">Assignee</span>
          <span className="w-20">Due Date</span>
          <span className="w-20">Actions</span>
        </div>
      </div>

      {/* Task Rows */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Square className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm">No tasks available</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => renderTaskRow(task))}
        </div>
      )}
    </div>
  );
}
