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

// Consistent light gradient theme for all rows
const rowTheme = { bg: 'bg-gradient-to-r from-blue-50 to-blue-100', border: 'border-blue-200' };

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
      <div className="w-full space-y-3 px-4 ml-6 overflow-x-hidden">
        {flattenedTasks.map((task, index) => {
          const theme = rowTheme;
          const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Square;
          const isCompleted = task.status === 'Done';

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`${theme.bg} ${theme.border} rounded-lg border p-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
              style={{ marginLeft: `${task.level * 20}px` }}
              onClick={() => onTaskSelect(task)}
            >
               {/* Simplified Task Card */}
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   {/* Hierarchy Indicator */}
                   {task.level > 0 && (
                     <div className="flex items-center">
                       {Array.from({ length: task.level }, (_, i) => (
                         <div key={i} className="w-3 h-px bg-slate-300 mr-1"></div>
                       ))}
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></div>
                     </div>
                   )}
                   
                   {/* Task Title */}
                   <div className="flex-1 min-w-0">
                     <h4 className={`font-bold text-xl ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                       {task.title || 'Untitled Task'}
                     </h4>
                   </div>

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
                 </div>

                 {/* Action Buttons */}
                 <div className="flex items-center gap-2">
                   {/* Three-dot Menu */}
                   <div className="relative">
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         e.preventDefault();
                         e.nativeEvent.stopImmediatePropagation();
                         console.log('Mobile menu clicked for task:', task.id);
                         setOpenMenuId(openMenuId === task.id ? null : (task.id || null));
                       }}
                       onMouseDown={(e) => {
                         e.stopPropagation();
                       }}
                       className="p-1 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110 relative z-10"
                     >
                       <MoreHorizontal className="w-4 h-4" />
                     </button>

                     {/* Dropdown Menu */}
                     {openMenuId === task.id && (
                       <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-[9999] animate-in slide-in-from-top-2 duration-200">
                         <div className="py-1">
                           <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'view'); }} className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Eye size={14} />View Details</button>
                           <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'edit'); }} className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Edit size={14} />Edit</button>
                           <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'add-subtask'); }} className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Plus size={14} />Add Subtask</button>
                           <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'delete'); }} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} />Delete</button>
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Edit Button */}
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       handleMenuAction(task, 'edit');
                     }}
                     className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                   >
                     <Edit className="w-4 h-4" />
                   </button>

                   {/* Delete Button */}
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       handleMenuAction(task, 'delete');
                     }}
                     className="p-1 text-red-500 hover:text-red-700 transition-colors"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
               </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Desktop Layout - Table View
  return (
    <div className="w-full ml-2 overflow-x-hidden">
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
              <th className="text-left px-2 py-1.5 w-16 text-lg font-bold text-slate-900">ID</th>
              <th className="text-left px-3 py-1.5 text-lg font-bold text-slate-900">Task Name</th>
              <th className="text-left px-3 py-1.5 w-12 text-lg font-bold text-slate-900">%</th>
              <th className="text-left px-2 py-1.5 text-lg font-bold text-slate-900">Assignee</th>
              <th className="text-left px-3 py-1.5 text-lg font-bold text-slate-900">Status</th>
              <th className="text-left px-3 py-1.5 text-lg font-bold text-slate-900">Priority</th>
              <th className="text-left px-3 py-1.5 text-lg font-bold text-slate-900">Due Date</th>
              <th className="text-left px-3 py-1.5 text-lg font-bold text-slate-900">Progress</th>
              <th className="text-left px-2 py-1.5 text-lg font-bold text-slate-900">Tags</th>
              <th className="text-right px-2 py-1.5 w-10 text-lg font-bold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="text-lg overflow-visible">
        {flattenedTasks.map((task, index) => {
          const theme = rowTheme;
          const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Square;
          const isCompleted = task.status === 'Done';

          return (
            <tr
              key={task.id}
              className={`cursor-pointer border ${theme.border} ${theme.bg} rounded-lg shadow-sm hover:shadow-md transition-all duration-200`}
              onClick={() => onTaskSelect(task)}
            >
              {/* ID */}
              <td className="px-2 py-2 text-slate-600 align-middle text-lg">{task.id?.slice(-8) || 'N/A'}</td>
              
              {/* Task Name */}
              <td className="px-3 py-2 align-middle">
                <div className="flex items-center gap-3">
                  {/* Hierarchy Indicator */}
                  {task.level > 0 && (
                    <div className="flex items-center">
                      {Array.from({ length: task.level }, (_, i) => (
                        <div key={i} className="w-4 h-px bg-slate-300 mr-1"></div>
                      ))}
                      <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                    </div>
                  )}
                  {/* Task Title */}
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-900 font-semibold text-2xl">{task.title || 'Untitled Task'}</div>
                    {task.description && (
                      <div className="text-lg text-slate-500 line-clamp-1">{task.description}</div>
                    )}
                  </div>

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
                </div>
              </td>

              {/* Progress Percentage */}
              <td className="px-3 py-2 text-slate-900 font-semibold align-middle text-2xl">{isCompleted ? '100' : '0'}%</td>
              
              {/* Assignee */}
              <td className="px-2 py-2 align-middle">
                {task.assignee && (
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-base flex items-center justify-center font-bold">
                      {getInitials(task.assignee)}
                    </div>
                    <span className="text-lg text-slate-700">{task.assignee}</span>
                  </div>
                )}
              </td>

              {/* Status */}
              <td className="px-3 py-2 align-middle">
                <span className={`px-2 py-1 rounded-full text-lg font-medium ${
                  statusColors[task.status as keyof typeof statusColors] || 'bg-slate-200 text-slate-700'
                }`}>
                  {task.status}
                </span>
              </td>

              {/* Priority */}
              <td className="px-3 py-2 align-middle">
                {task.priority && (
                  <span className={`px-2 py-1 rounded-full text-lg font-medium ${
                    priorityColors[task.priority as keyof typeof priorityColors] || 'bg-slate-200 text-slate-700'
                  }`}>
                    {task.priority}
                  </span>
                )}
              </td>

              {/* Due Date */}
              <td className="px-3 py-2 text-slate-700 align-middle text-lg">{task.dueDate || 'No date'}</td>

              {/* Progress Bar */}
              <td className="px-3 py-2 align-middle">
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${isCompleted ? 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-lg text-slate-700">{isCompleted ? '100' : '0'}</span>
                </div>
              </td>

              {/* Tags */}
              <td className="px-2 py-2 align-middle">
                {task.tags && Array.isArray(task.tags) && task.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {(task.tags as string[]).slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-base font-medium">
                        {tag}
                      </span>
                    ))}
                    {(task.tags as string[]).length > 2 && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-base font-medium">
                        +{(task.tags as string[]).length - 2}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-lg text-slate-500">No tags</span>
                )}
              </td>

              {/* Actions */}
              <td className="px-2 py-2 align-middle">
                <div className="relative flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      e.nativeEvent.stopImmediatePropagation();
                      console.log('Desktop menu clicked for task:', task.id);
                      setOpenMenuId(openMenuId === task.id ? null : (task.id || null));
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110 relative z-10"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === task.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-[9999] animate-in slide-in-from-top-2 duration-200">
                      <div className="py-1">
                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'view'); }} className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Eye size={14} />View Details</button>
                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'edit'); }} className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Edit size={14} />Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'add-subtask'); }} className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Plus size={14} />Add Subtask</button>
                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'delete'); }} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} />Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
          </tbody>
        </table>
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