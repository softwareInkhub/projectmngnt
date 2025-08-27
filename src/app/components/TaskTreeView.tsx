"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Square,
  Play,
  CheckCircle,
  Pause,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Plus,
  User,
  Calendar,
  Flag,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FolderOpen
} from 'lucide-react';
import { TaskTreeNode } from '../utils/taskApi';

interface TaskTreeViewProps {
  tasks: TaskTreeNode[];
  onTaskSelect: (task: TaskTreeNode) => void;
  onAddSubtask: (parentId: string) => void;
  onEditTask: (task: TaskTreeNode) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string, newStatus: string) => Promise<void>;
  selectedTaskId?: string | null;
}

interface TaskNodeProps {
  task: TaskTreeNode;
  level: number;
  isExpanded: boolean;
  onToggleExpand: (taskId: string) => void;
  onTaskSelect: (task: TaskTreeNode) => void;
  onAddSubtask: (parentId: string) => void;
  onEditTask: (task: TaskTreeNode) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string, newStatus: string) => Promise<void>;
  selectedTaskId?: string | null;
  isLastChild?: boolean;
  parentHasMoreChildren?: boolean;
  expandedTasks: Set<string>;
}

const statusIcons = {
  "To Do": Square,
  "In Progress": Play,
  "Done": CheckCircle,
  "On Hold": Pause,
  "Review": AlertCircle,
  "Blocked": AlertCircle
};

const priorityColors = {
  "High": "bg-red-50 text-red-700 border-red-200",
  "Medium": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Low": "bg-green-50 text-green-700 border-green-200",
  "Critical": "bg-red-100 text-red-800 border-red-300"
};

const levelColors = [
  "border-l-blue-500 bg-gradient-to-r from-blue-50 to-white",
  "border-l-green-500 bg-gradient-to-r from-green-50 to-white", 
  "border-l-purple-500 bg-gradient-to-r from-purple-50 to-white",
  "border-l-orange-500 bg-gradient-to-r from-orange-50 to-white",
  "border-l-pink-500 bg-gradient-to-r from-pink-50 to-white",
  "border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-white"
];

const TaskNode: React.FC<TaskNodeProps> = ({
  task,
  level,
  isExpanded,
  onToggleExpand,
  onTaskSelect,
  onAddSubtask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  selectedTaskId,
  isLastChild = false,
  parentHasMoreChildren = false,
  expandedTasks
}) => {
  const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Square;
  const isSelected = selectedTaskId === task.id;
  const hasChildren = task.children && task.children.length > 0;
  const isCompleted = task.status === 'Done';
  const levelColor = levelColors[Math.min(level, levelColors.length - 1)];

  const handleStatusToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onToggleStatus(task.id!, task.status === 'Done' ? 'To Do' : 'Done');
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(task.id!);
  };

  // Truncate text if too long
  const truncateText = (text: string, maxLength: number = 12) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="w-full">
      {/* Task Row */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative"
      >
        {/* Indentation and Connecting Lines */}
        <div className="flex items-center">
          {/* Indentation based on level */}
          <div style={{ width: `${level * 80}px` }} className="flex-shrink-0">
            {/* Vertical line for non-root items */}
            {level > 0 && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-0.5 h-full bg-slate-300"></div>
              </div>
            )}
          </div>

          {/* Task Card with Middle-Left Connecting Line */}
          <div className="relative">
            {/* Middle-Left Connecting Line - Removed for cleaner look */}
            
            <motion.div
              className={`
                group relative flex flex-col p-1.5 sm:p-3 bg-white border border-slate-200 rounded-lg
                hover:border-slate-300 hover:shadow-lg transition-all duration-300 cursor-pointer
                ${isSelected ? 'ring-2 ring-blue-500 border-blue-300 shadow-xl scale-105' : ''}
                ${isCompleted ? 'opacity-75 bg-slate-50' : ''}
                ${levelColor}
                border-l-4
                w-28 h-16 sm:w-48 sm:h-32
                shadow-md
                backdrop-blur-sm
                overflow-hidden
              `}
              style={{ 
                boxShadow: isSelected 
                  ? '0 8px 20px rgba(59, 130, 246, 0.15), 0 3px 8px rgba(0, 0, 0, 0.1)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.05)'
              }}
              onClick={() => onTaskSelect(task)}
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Top Section - Status and Actions */}
              <div className="flex items-center justify-between mb-0.5 sm:mb-2">
                {/* Status Checkbox */}
                <motion.button
                  onClick={handleStatusToggle}
                  className="w-2.5 h-2.5 sm:w-4 sm:h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors rounded-sm hover:bg-slate-100 z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <StatusIcon className={`w-2.5 h-2.5 sm:w-4 sm:h-4 ${isCompleted ? 'text-green-600' : 'text-slate-400'}`} />
                </motion.button>

                {/* Action Buttons and Expand Toggle */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {/* Expand/Collapse Toggle */}
                  {hasChildren && (
                    <motion.button
                      onClick={handleToggleExpand}
                      className="w-3 h-3 sm:w-6 sm:h-6 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all duration-200 rounded-md hover:bg-blue-50 z-10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
                    >
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <ChevronDown className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                      </motion.div>
                    </motion.button>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-0.5 sm:gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddSubtask(task.id!);
                      }}
                      className="p-0.5 sm:p-1 hover:bg-blue-100 rounded transition-colors"
                      title="Add subtask"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus className="w-2 h-2 sm:w-3 sm:h-3 text-blue-600" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}
                      className="p-0.5 sm:p-1 hover:bg-slate-100 rounded transition-colors"
                      title="Edit task"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="w-2 h-2 sm:w-3 sm:h-3 text-slate-600" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id!);
                      }}
                      className="p-0.5 sm:p-1 hover:bg-red-100 rounded transition-colors"
                      title="Delete task"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-2 h-2 sm:w-3 sm:h-3 text-red-600" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Middle Section - Task Title and Priority */}
              <div className="flex-1 flex flex-col justify-center mb-0.5 sm:mb-2">
                <h4 
                  className={`font-semibold leading-tight mb-0.5 sm:mb-1 ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'} text-[10px] sm:text-sm`}
                  title={task.title}
                >
                  {truncateText(task.title, window.innerWidth < 640 ? 12 : 20)}
                </h4>
                
                {task.priority && (
                  <span className={`px-1 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[8px] sm:text-xs font-medium border ${priorityColors[task.priority as keyof typeof priorityColors] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                    {task.priority}
                  </span>
                )}
              </div>

              {/* Bottom Section - Assignee, Due Date, and Subtask Count */}
              <div className="space-y-0.5 sm:space-y-1">
                {task.assignee && (
                  <div className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-xs text-slate-500">
                    <User className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="truncate" title={task.assignee}>
                      {truncateText(task.assignee, window.innerWidth < 640 ? 8 : 15)}
                    </span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-xs text-slate-500">
                    <Calendar className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="text-[8px] sm:text-xs">{task.dueDate}</span>
                  </div>
                )}
                {hasChildren && (
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] sm:text-xs text-slate-400 font-medium bg-slate-100 px-1 py-0.5 sm:px-2 sm:py-0.5 rounded-full">
                      {task.children!.length} subtasks
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Subtasks Container */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-4"
          >
            {/* Professional connecting lines */}
            <div className="relative" style={{ zIndex: 10 }}>
              {/* Main vertical line from parent */}
              <div 
                className="absolute bg-slate-500"
                style={{ 
                  top: '0px',
                  height: `${task.children!.length * 200 + 20}px`,
                  left: `${(level + 1) * 80 - 22}px`,
                  width: window.innerWidth < 640 ? '1px' : '2px'
                }}
              ></div>
              
              {/* Horizontal lines to each child */}
              {task.children!.map((childTask, index) => (
                <div
                  key={`line-${childTask.id}`}
                  className="absolute bg-slate-500"
                  style={{
                    top: `${(index * 200) + 20}px`,
                    left: `${(level + 1) * 80 - 22}px`,
                    width: window.innerWidth < 640 ? '12px' : '20px',
                    height: window.innerWidth < 640 ? '1px' : '2px'
                  }}
                ></div>
              ))}
            </div>

            {/* Children Nodes */}
            <div className="space-y-4">
              {task.children!.map((childTask, index) => (
                <div key={childTask.id} className="relative">
                  <TaskNode
                    task={childTask}
                    level={level + 1}
                    isExpanded={expandedTasks.has(childTask.id!)}
                    onToggleExpand={onToggleExpand}
                    onTaskSelect={onTaskSelect}
                    onAddSubtask={onAddSubtask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onToggleStatus={onToggleStatus}
                    selectedTaskId={selectedTaskId}
                    isLastChild={index === task.children!.length - 1}
                    parentHasMoreChildren={task.children!.length > 1}
                    expandedTasks={expandedTasks}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function TaskTreeView({
  tasks,
  onTaskSelect,
  onAddSubtask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  selectedTaskId
}: TaskTreeViewProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const containerRef = useRef<HTMLDivElement>(null);

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

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('All');
    setFilterPriority('All');
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-1.5 flex flex-col">
      <div className="w-full h-full flex flex-col">
        {/* Compact Enhanced Header */}
        <div className="mb-2 flex-shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-0.5">Task Tree</h2>
              <p className="text-xs sm:text-sm text-slate-600">Vertical tree view with indentation</p>
            </div>
            <div className="flex items-center gap-1">
              <motion.button
                className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
              </motion.button>
              <motion.button
                className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
              </motion.button>
              <motion.button
                className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Reset View"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
              </motion.button>
            </div>
          </div>

          {/* Compact Enhanced Search and Filter Bar - Mobile: Top Right, Web: Normal */}
          <div className="sm:flex flex-col sm:flex-row items-center gap-1.5 bg-white rounded-lg p-2.5 shadow-sm border border-slate-100">
            {/* Mobile: Compact search only */}
            <div className="sm:hidden relative w-32">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 pr-2 py-1 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs"
              />
            </div>
            
            {/* Web: Full search and filters */}
            <div className="hidden sm:flex flex-col sm:flex-row items-center gap-1.5 w-full">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-2 py-1.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-1.5 w-full sm:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2 py-1.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                  <option value="On Hold">On Hold</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-2 py-1.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                >
                  <option value="All">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Critical">Critical</option>
                </select>
                <motion.button
                  onClick={clearFilters}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1 justify-center text-xs sm:text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                  Clear
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Task Tree Container */}
        <div 
          ref={containerRef}
          className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 p-2 sm:p-4 overflow-auto overflow-x-auto sm:overflow-x-visible min-h-0"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}
        >
          {/* Mobile Horizontal Scroll Bar */}
          <div className="sm:hidden w-full h-1 bg-slate-100 rounded-full mb-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
          </div>

          {/* Tree Structure */}
          <div className="space-y-4 min-w-full" style={{ minWidth: 'max-content' }}>
            {tasks.length > 0 ? (
              <AnimatePresence>
                {tasks.map((task, index) => (
                  <TaskNode
                    key={task.id}
                    task={task}
                    level={0}
                    isExpanded={isExpanded(task.id!)}
                    onToggleExpand={toggleExpanded}
                    onTaskSelect={onTaskSelect}
                    onAddSubtask={onAddSubtask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onToggleStatus={onToggleStatus}
                    selectedTaskId={selectedTaskId}
                    isLastChild={index === tasks.length - 1}
                    parentHasMoreChildren={tasks.length > 1}
                    expandedTasks={expandedTasks}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 sm:py-16 text-center">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                  <FolderOpen className="w-4 h-4 sm:w-8 sm:h-8 text-slate-400" />
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-slate-700 mb-1 sm:mb-2">No tasks found</h3>
                <p className="text-xs sm:text-base text-slate-500">Create your first task to get started</p>
              </div>
            )}
          </div>

          {/* Mobile Bottom Scroll Indicator */}
          <div className="sm:hidden w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Bar at Bottom */}
        <div className="sm:hidden w-full h-2 bg-slate-100 rounded-lg mt-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
