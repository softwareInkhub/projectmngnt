"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
import ResizableTable, { 
  ResizableTableHeader, 
  ResizableTableHeaderCell, 
  ResizableTableBody, 
  ResizableTableCell 
} from './ResizableTable';
import EditableTableCell from './EditableTableCell';

interface TaskListViewProps {
  tasks: TaskTreeNode[];
  onTaskSelect: (task: TaskTreeNode) => void;
  onAddSubtask: (parentId: string) => void;
  onEditTask: (task: TaskTreeNode) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string, newStatus: string) => Promise<void>;
  onUpdateTaskField?: (taskId: string, field: keyof TaskTreeNode, value: string | number) => Promise<boolean>;
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
  onUpdateTaskField,
  selectedTaskId
}: TaskListViewProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

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
      setDropdownPosition(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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
      <div className="w-full space-y-3 px-4 ml-6 overflow-x-hidden overflow-y-visible">
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
                     <div className="flex items-center mr-2">
                       {/* Vertical line connector */}
                       <div className="w-px h-5 bg-slate-300 mr-2"></div>
                       {/* Horizontal line */}
                       <div className="w-2 h-px bg-slate-300 mr-1"></div>
                       {/* Bullet point */}
                       <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
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
                       ref={(el) => {
                         if (task.id) {
                           buttonRefs.current[task.id] = el;
                         }
                       }}
                       onClick={(e) => {
                         e.stopPropagation();
                         e.preventDefault();
                         console.log('Menu clicked for task:', task.id);
                         
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
                       className="p-1 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110 relative z-20"
                     >
                       <MoreHorizontal className="w-4 h-4" />
                     </button>

                     {/* Dropdown Menu - Portal */}
                     {openMenuId === task.id && dropdownPosition && createPortal(
                       <div 
                         className="fixed w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] animate-in slide-in-from-top-2 duration-200"
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
    <div className="w-full ml-2 overflow-x-hidden overflow-y-visible">
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <ResizableTable 
          defaultColumnWidths={{
            id: 80,
            name: 300,
            progress: 100,
            assignee: 150,
            status: 120,
            priority: 100,
            dueDate: 120,
            progressBar: 150,
            tags: 150,
            actions: 100
          }}
          defaultRowHeight={55}
        >
          <table className="w-full resizable-table">
            <ResizableTableHeader>
              <tr>
                <ResizableTableHeaderCell columnKey="id" className="text-lg font-bold text-slate-900">ID</ResizableTableHeaderCell>
                <ResizableTableHeaderCell columnKey="name" className="text-lg font-bold text-slate-900">Task Name</ResizableTableHeaderCell>
                <ResizableTableHeaderCell columnKey="progress" className="text-lg font-bold text-slate-900">%</ResizableTableHeaderCell>
                <ResizableTableHeaderCell columnKey="assignee" className="text-lg font-bold text-slate-900">Assignee</ResizableTableHeaderCell>
                <ResizableTableHeaderCell columnKey="status" className="text-lg font-bold text-slate-900">Status</ResizableTableHeaderCell>
                <ResizableTableHeaderCell columnKey="priority" className="text-lg font-bold text-slate-900">Priority</ResizableTableHeaderCell>
                <ResizableTableHeaderCell columnKey="dueDate" className="text-lg font-bold text-slate-900">Due Date</ResizableTableHeaderCell>
                <ResizableTableHeaderCell columnKey="progressBar" className="text-lg font-bold text-slate-900">Progress</ResizableTableHeaderCell>
                <ResizableTableHeaderCell columnKey="tags" className="text-lg font-bold text-slate-900">Tags</ResizableTableHeaderCell>
                <ResizableTableHeaderCell columnKey="actions" className="text-center text-lg font-bold text-slate-900">Actions</ResizableTableHeaderCell>
              </tr>
            </ResizableTableHeader>
            <ResizableTableBody>
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
                    <ResizableTableCell columnKey="id" className="text-slate-600 text-lg" style={{ paddingLeft: `${16 + (task.level * 24)}px` }}>{task.id?.slice(-8) || 'N/A'}</ResizableTableCell>
              
                    {/* Task Name */}
                    <ResizableTableCell columnKey="name" className="align-middle">
                <div className="flex items-center gap-3">
                  {/* Hierarchy Indicator */}
                  {task.level > 0 && (
                    <div className="flex items-center mr-2">
                      {/* Vertical line connector */}
                      <div className="w-px h-6 bg-slate-300 mr-2"></div>
                      {/* Horizontal line */}
                      <div className="w-3 h-px bg-slate-300 mr-1"></div>
                      {/* Bullet point */}
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                    </div>
                  )}
                  {/* Task Title */}
                  <div className="flex-1 min-w-0">
                    <div 
                      className="text-slate-900 font-semibold text-2xl editable-cell"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EditableTableCell
                        value={task.title || 'Untitled Task'}
                        onSave={(newValue) => onUpdateTaskField?.(task.id || '', 'title', newValue) || Promise.resolve(false)}
                        type="text"
                        className="text-slate-900 font-semibold text-2xl"
                        placeholder="Task title"
                      />
                    </div>
                    {task.description && (
                      <div 
                        className="text-lg text-slate-500 line-clamp-1 editable-cell"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EditableTableCell
                          value={task.description || ''}
                          onSave={(newValue) => onUpdateTaskField?.(task.id || '', 'description', newValue) || Promise.resolve(false)}
                          type="text"
                          className="text-lg text-slate-500"
                          placeholder="Task description"
                        />
                      </div>
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
                    </ResizableTableCell>

                    {/* Progress Percentage */}
                    <ResizableTableCell columnKey="progress" className="text-slate-900 font-semibold text-2xl">{isCompleted ? '100' : '0'}%</ResizableTableCell>
              
                    {/* Assignee */}
                    <ResizableTableCell columnKey="assignee" className="align-middle">
                      {task.assignee && (
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-base flex items-center justify-center font-bold flex-shrink-0">
                            {getInitials(task.assignee)}
                          </div>
                          <div 
                            className="text-lg text-slate-700 truncate editable-cell"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <EditableTableCell
                              value={task.assignee || ''}
                              onSave={(newValue) => onUpdateTaskField?.(task.id || '', 'assignee', newValue) || Promise.resolve(false)}
                              type="text"
                              className="text-lg text-slate-700 truncate"
                              placeholder="Assignee"
                            />
                          </div>
                        </div>
                      )}
                    </ResizableTableCell>

                    {/* Status */}
                    <ResizableTableCell columnKey="status" className="align-middle">
                      <div 
                        className="editable-cell"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EditableTableCell
                          value={task.status || 'To Do'}
                          onSave={(newValue) => onUpdateTaskField?.(task.id || '', 'status', newValue) || Promise.resolve(false)}
                          type="select"
                          options={['To Do', 'In Progress', 'Review', 'Done', 'Blocked', 'On Hold']}
                          className={`px-2 py-1 rounded-full text-lg font-medium ${
                            statusColors[task.status as keyof typeof statusColors] || 'bg-slate-200 text-slate-700'
                          }`}
                        />
                      </div>
                    </ResizableTableCell>

                    {/* Priority */}
                    <ResizableTableCell columnKey="priority" className="align-middle">
                      <div 
                        className="editable-cell"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EditableTableCell
                          value={task.priority || 'Medium'}
                          onSave={(newValue) => onUpdateTaskField?.(task.id || '', 'priority', newValue) || Promise.resolve(false)}
                          type="select"
                          options={['Low', 'Medium', 'High', 'Critical']}
                          className={`px-2 py-1 rounded-full text-lg font-medium ${
                            priorityColors[task.priority as keyof typeof priorityColors] || 'bg-slate-200 text-slate-700'
                          }`}
                        />
                      </div>
                    </ResizableTableCell>

                    {/* Due Date */}
                    <ResizableTableCell columnKey="dueDate" className="text-slate-700 text-lg">
                      <div 
                        className="editable-cell"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EditableTableCell
                          value={task.dueDate || ''}
                          onSave={(newValue) => onUpdateTaskField?.(task.id || '', 'dueDate', newValue) || Promise.resolve(false)}
                          type="date"
                          className="text-slate-700 text-lg"
                        />
                      </div>
                    </ResizableTableCell>

                    {/* Progress Bar */}
                    <ResizableTableCell columnKey="progressBar" className="align-middle">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${isCompleted ? 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 flex-shrink-0">{isCompleted ? '100' : '0'}%</span>
                      </div>
                    </ResizableTableCell>

                    {/* Tags */}
                    <ResizableTableCell columnKey="tags" className="align-middle">
                      {task.tags && Array.isArray(task.tags) && task.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {(task.tags as string[]).slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-base font-medium flex-shrink-0">
                              {tag}
                            </span>
                          ))}
                          {(task.tags as string[]).length > 2 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-base font-medium flex-shrink-0">
                              +{(task.tags as string[]).length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-lg text-slate-500">No tags</span>
                      )}
                    </ResizableTableCell>

                    {/* Actions */}
                    <ResizableTableCell columnKey="actions" className="align-middle">
                <div className="relative flex justify-center">
                  <button
                    ref={(el) => {
                      if (el) buttonRefs.current[task.id!] = el;
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      e.nativeEvent.stopImmediatePropagation();
                      console.log('Desktop menu clicked for task:', task.id);
                      
                      if (openMenuId === task.id) {
                        setOpenMenuId(null);
                        setDropdownPosition(null);
                      } else {
                        setOpenMenuId(task.id || null);
                        const buttonRef = buttonRefs.current[task.id!];
                        if (buttonRef) {
                          const position = calculateDropdownPosition(buttonRef);
                          setDropdownPosition(position);
                        }
                      }
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110 relative z-10"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu - Portal */}
                  {openMenuId === task.id && dropdownPosition && createPortal(
                    <div 
                      className="fixed w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] animate-in slide-in-from-top-2 duration-200"
                      style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-1">
                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'view'); }} className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Eye size={14} />View Details</button>
                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'edit'); }} className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Edit size={14} />Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'add-subtask'); }} className="w-full px-3 py-2 text-left text-base text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Plus size={14} />Add Subtask</button>
                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction(task, 'delete'); }} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} />Delete</button>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
                    </ResizableTableCell>
                  </tr>
                );
              })}
            </ResizableTableBody>
          </table>
        </ResizableTable>
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