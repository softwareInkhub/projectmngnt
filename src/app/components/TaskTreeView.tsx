"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Circle, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  Flag,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import { TaskTreeNode } from '../utils/taskApi';

interface TaskTreeViewProps {
  tasks: TaskTreeNode[];
  onTaskSelect: (task: TaskTreeNode) => void;
  onAddSubtask: (parentId: string) => void;
  onEditTask: (task: TaskTreeNode) => void;
  onDeleteTask: (taskId: string) => void;
  selectedTaskId?: string | null;
}

const statusIcons = {
  "To Do": Circle,
  "In Progress": Clock,
  "Done": CheckCircle,
  "On Hold": AlertCircle,
  "Review": Clock,
  "Blocked": AlertCircle
};

const priorityColors = {
  "High": "text-red-500",
  "Medium": "text-yellow-500", 
  "Low": "text-green-500",
  "Critical": "text-red-600"
};

export default function TaskTreeView({
  tasks,
  onTaskSelect,
  onAddSubtask,
  onEditTask,
  onDeleteTask,
  selectedTaskId
}: TaskTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const toggleNode = (taskId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedNodes(newExpanded);
  };

  const isExpanded = (taskId: string) => expandedNodes.has(taskId);
  const hasChildren = (task: TaskTreeNode) => task.children && task.children.length > 0;

  const renderTaskNode = (task: TaskTreeNode, level: number = 0) => {
    const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Circle;
    const isSelected = selectedTaskId === task.id;
    const isHovered = hoveredTask === task.id;
    const expanded = isExpanded(task.id!);
    const children = task.children || [];

    return (
      <motion.div
        key={task.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {/* Task Node */}
        <motion.div
          className={`
            group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
            ${isSelected 
              ? 'bg-blue-50 border border-blue-200 shadow-sm' 
              : 'hover:bg-slate-50 border border-transparent'
            }
            ${level > 0 ? 'ml-6' : ''}
          `}
          onMouseEnter={() => setHoveredTask(task.id!)}
          onMouseLeave={() => setHoveredTask(null)}
          onClick={() => onTaskSelect(task)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren(task) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(task.id!);
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

          {/* Status Icon */}
          <div className="flex-shrink-0">
            <StatusIcon className={`w-4 h-4 ${task.status === 'Done' ? 'text-green-500' : 'text-slate-400'}`} />
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-medium text-sm truncate ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                {task.title}
              </h4>
              {task.priority && (
                <Flag className={`w-3 h-3 ${priorityColors[task.priority as keyof typeof priorityColors] || 'text-slate-400'}`} />
              )}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-slate-500">
              {task.assignee && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="truncate">{task.assignee}</span>
                </div>
              )}
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{task.dueDate}</span>
                </div>
              )}
            </div>
          </div>

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

        {/* Children */}
        <AnimatePresence>
          {expanded && hasChildren(task) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-l-2 border-slate-200 ml-6 mt-2">
                {children.map(child => renderTaskNode(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="w-full space-y-2">
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <Circle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm">No tasks available</p>
        </div>
      ) : (
        tasks.map(task => renderTaskNode(task))
      )}
    </div>
  );
}
