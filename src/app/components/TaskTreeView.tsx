// "use client";

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Square,
//   Play,
//   CheckCircle,
//   Pause,
//   AlertCircle,
//   ChevronRight,
//   ChevronDown,
//   Plus,
//   User,
//   Calendar,
//   Flag,
//   MoreHorizontal,
//   Edit,
//   Trash2,
//   Eye,
//   Search,
//   Filter,
//   ZoomIn,
//   ZoomOut,
//   RotateCcw,
//   FolderOpen,
//   X
// } from 'lucide-react';
// import { TaskTreeNode } from '../utils/taskApi';

// interface TaskTreeViewProps {
//   tasks: TaskTreeNode[];
//   onTaskSelect: (task: TaskTreeNode) => void;
//   onAddSubtask: (parentId: string) => void;
//   onEditTask: (task: TaskTreeNode) => void;
//   onDeleteTask: (taskId: string) => void;
//   onToggleStatus: (taskId: string, newStatus: string) => Promise<void>;
//   selectedTaskId?: string | null;
//   isLandscape?: boolean;
//   onToggleLandscape?: () => void;
// }

// interface TaskNodeProps {
//   task: TaskTreeNode;
//   level: number;
//   isExpanded: boolean;
//   onToggleExpand: (taskId: string) => void;
//   onTaskSelect: (task: TaskTreeNode) => void;
//   onAddSubtask: (parentId: string) => void;
//   onEditTask: (task: TaskTreeNode) => void;
//   onDeleteTask: (taskId: string) => void;
//   onToggleStatus: (taskId: string, newStatus: string) => Promise<void>;
//   selectedTaskId?: string | null;
//   isLastChild?: boolean;
//   parentHasMoreChildren?: boolean;
//   expandedTasks: Set<string>;
// }

// const statusIcons = {
//   "To Do": Square,
//   "In Progress": Play,
//   "Done": CheckCircle,
//   "On Hold": Pause,
//   "Review": AlertCircle,
//   "Blocked": AlertCircle
// };

// const priorityColors = {
//   "High": "bg-blue-100 text-blue-800 border-blue-300",
//   "Medium": "bg-blue-50 text-blue-700 border-blue-200",
//   "Low": "bg-blue-50 text-blue-700 border-blue-200",
//   "Critical": "bg-blue-100 text-blue-800 border-blue-300"
// };

// const levelColors = [
//   "border-l-blue-500 bg-gradient-to-r from-blue-50 to-white",
//   "border-l-blue-400 bg-gradient-to-r from-blue-50 to-white", 
//   "border-l-blue-300 bg-gradient-to-r from-blue-50 to-white",
//   "border-l-blue-200 bg-gradient-to-r from-blue-50 to-white",
//   "border-l-blue-100 bg-gradient-to-r from-blue-50 to-white",
//   "border-l-blue-200 bg-gradient-to-r from-blue-50 to-white"
// ];

// const TaskNode: React.FC<TaskNodeProps> = ({
//   task,
//   level,
//   isExpanded,
//   onToggleExpand,
//   onTaskSelect,
//   onAddSubtask,
//   onEditTask,
//   onDeleteTask,
//   onToggleStatus,
//   selectedTaskId,
//   isLastChild = false,
//   parentHasMoreChildren = false,
//   expandedTasks
// }) => {
//   const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Square;
//     const isSelected = selectedTaskId === task.id;
//   const hasChildren = task.children && task.children.length > 0;
//   const isCompleted = task.status === 'Done';
//   const levelColor = levelColors[Math.min(level, levelColors.length - 1)];

//   const handleStatusToggle = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       await onToggleStatus(task.id!, task.status === 'Done' ? 'To Do' : 'Done');
//     } catch (error) {
//       console.error('Error toggling task status:', error);
//     }
//   };

//   const handleToggleExpand = (e: React.MouseEvent) => {
//                   e.stopPropagation();
//                   onToggleExpand(task.id!);
//   };

//   // Truncate text if too long
//   const truncateText = (text: string, maxLength: number = 12) => {
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength) + '...';
//   };

//   return (
//     <div className="w-full">
//       {/* Task Row */}
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         exit={{ opacity: 0, x: -20 }}
//         transition={{ duration: 0.3, ease: "easeOut" }}
//         className="relative"
//       >
//         {/* Indentation and Connecting Lines */}
//         <div className="flex items-center">
//           {/* Indentation based on level */}
//           <div style={{ width: `${level * 80}px` }} className="flex-shrink-0">
//             {/* Vertical line for non-root items */}
//             {level > 0 && (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="w-0.5 h-full bg-slate-300"></div>
//               </div>
//             )}
//           </div>
          
//           {/* Task Card with Middle-Left Connecting Line */}
//           <div className="relative">
//             {/* Middle-Left Connecting Line - Removed for cleaner look */}
            
//             <motion.div
//               className={`
//                 group relative flex flex-col p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg
//                 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer
//                 ${isSelected ? 'ring-2 ring-blue-500 border-blue-300 shadow-xl scale-105' : ''}
//                 ${isCompleted ? 'opacity-75 bg-slate-50' : ''}
//                 ${levelColor}
//                 border-l-4
//                 w-32 h-12 sm:w-56 sm:h-16
//                 shadow-md
//                 backdrop-blur-sm
//                 overflow-hidden
//               `}
//               style={{ 
//                 boxShadow: isSelected 
//                   ? '0 8px 20px rgba(59, 130, 246, 0.15), 0 3px 8px rgba(0, 0, 0, 0.1)' 
//                   : '0 3px 10px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.05)'
//               }}
//               onClick={() => onTaskSelect(task)}
//               whileHover={{ 
//                 scale: 1.02, 
//                 y: -2,
//                 boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)'
//               }}
//               whileTap={{ scale: 0.98 }}
//             >
//               {/* Top Section - Task Name and Action Buttons */}
//               <div className="flex items-center justify-between gap-1 mb-1">
//                 {/* Task Name - Top Left */}
//                 <div className="flex-1">
//                   <h4 
//                     className={`font-bold leading-tight ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'} text-base sm:text-xl truncate`}
//                     title={task.title}
//                   >
//                     {task.title}
//                   </h4>
//                 </div>
                
//                 {/* Action Buttons - Top Right */}
//                 <div className="flex items-center gap-1">
//                   {/* Expand/Collapse Toggle */}
//                   {hasChildren && (
//                     <motion.button
//                       onClick={handleToggleExpand}
//                       className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-all duration-200 rounded hover:bg-blue-50 z-10"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       title={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
//                     >
//                       <motion.div
//                         animate={{ rotate: isExpanded ? 180 : 0 }}
//                         transition={{ duration: 0.2, ease: "easeInOut" }}
//                       >
//                         <ChevronDown className="w-2 h-2 sm:w-3 sm:h-3" />
//                       </motion.div>
//                     </motion.button>
//                   )}
            
//                   {/* Action Buttons */}
//                   <motion.button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onAddSubtask(task.id!);
//                     }}
//                     className="p-0.5 hover:bg-blue-100 rounded transition-colors opacity-80 hover:opacity-100"
//                     title="Add subtask"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
//                   </motion.button>
//                   <motion.button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onEditTask(task);
//                     }}
//                     className="p-0.5 hover:bg-slate-100 rounded transition-colors opacity-80 hover:opacity-100"
//                     title="Edit task"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600" />
//                   </motion.button>
//                   <motion.button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onDeleteTask(task.id!);
//                     }}
//                     className="p-0.5 hover:bg-red-100 rounded transition-colors opacity-80 hover:opacity-100"
//                     title="Delete task"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600" />
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Subtasks Container */}
//       <AnimatePresence>
//         {isExpanded && hasChildren && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//             className="overflow-hidden mt-4"
//           >
//             {/* Professional connecting lines */}
//             <div className="relative" style={{ zIndex: 10 }}>
//               {/* Main vertical line from parent */}
//               <div 
//                 className="absolute bg-slate-500"
//                 style={{ 
//                   top: '0px',
//                   height: `${task.children!.length * 200 + 20}px`,
//                   left: `${(level + 1) * 80 - 22}px`,
//                   width: window.innerWidth < 640 ? '1px' : '2px'
//                 }}
//               ></div>
              
//               {/* Horizontal lines to each child */}
//               {task.children!.map((childTask, index) => (
//                 <div
//                   key={`line-${childTask.id}`}
//                   className="absolute bg-slate-500"
//                   style={{
//                     top: `${(index * 200) + 20}px`,
//                     left: `${(level + 1) * 80 - 22}px`,
//                     width: window.innerWidth < 640 ? '12px' : '20px',
//                     height: window.innerWidth < 640 ? '1px' : '2px'
//                   }}
//                 ></div>
//               ))}
//             </div>

//             {/* Children Nodes */}
//             <div className="space-y-4">
//               {task.children!.map((childTask, index) => (
//                 <div key={childTask.id} className="relative">
//                   <TaskNode
//                     task={childTask}
//                     level={level + 1}
//                     isExpanded={expandedTasks.has(childTask.id!)}
//                     onToggleExpand={onToggleExpand}
//                     onTaskSelect={onTaskSelect}
//                     onAddSubtask={onAddSubtask}
//                     onEditTask={onEditTask}
//                     onDeleteTask={onDeleteTask}
//                     onToggleStatus={onToggleStatus}
//                     selectedTaskId={selectedTaskId}
//                     isLastChild={index === task.children!.length - 1}
//                     parentHasMoreChildren={task.children!.length > 1}
//                     expandedTasks={expandedTasks}
//                   />
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default function TaskTreeView({
//   tasks,
//   onTaskSelect,
//   onAddSubtask,
//   onEditTask,
//   onDeleteTask,
//   onToggleStatus,
//   selectedTaskId,
//   isLandscape = false,
//   onToggleLandscape
// }: TaskTreeViewProps) {
//   const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [filterPriority, setFilterPriority] = useState('All');
//   const containerRef = useRef<HTMLDivElement>(null);

//   const toggleExpanded = (taskId: string) => {
//     const newExpanded = new Set(expandedTasks);
//     if (newExpanded.has(taskId)) {
//       newExpanded.delete(taskId);
//     } else {
//       newExpanded.add(taskId);
//     }
//     setExpandedTasks(newExpanded);
//   };

//   const isExpanded = (taskId: string) => expandedTasks.has(taskId);

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilterStatus('All');
//     setFilterPriority('All');
//   };

//   return (
//     <div className="w-full h-full flex flex-col min-h-0">
//       <div className="w-full h-full flex flex-col">
//         {/* Compact Enhanced Header */}
//         <div className="mb-2 flex-shrink-0">
//           <div className="flex items-center justify-between mb-1.5">
//             <div className="text-center flex-1">
//               <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-0.5">Task Tree</h2>
//               <p className="text-sm sm:text-base text-slate-600">Vertical tree view with indentation</p>
//             </div>
//             <div className="flex items-center gap-1">
//               {/* Landscape Toggle Button - Mobile Only */}
//               {onToggleLandscape && (
//                 <motion.button
//                   onClick={onToggleLandscape}
//                   className={`p-1 rounded-md transition-colors shadow-sm ${
//                     isLandscape 
//                       ? "bg-blue-100 text-blue-600" 
//                       : "hover:bg-white text-slate-600"
//                   }`}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   title={isLandscape ? "Exit Landscape View" : "Enter Landscape View"}
//                 >
//                   {isLandscape ? (
//                     <X className="w-3 h-3 sm:w-4 sm:h-4" />
//                   ) : (
//                     <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
//                   )}
//                 </motion.button>
//               )}
//               <motion.button
//                 className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 title="Zoom In"
//               >
//                 <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
//               </motion.button>
//               <motion.button
//                 className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 title="Zoom Out"
//               >
//                 <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
//               </motion.button>

//             </div>
//           </div>

//         </div>
        
//         {/* Task Tree Container */}
//         <div 
//           ref={containerRef}
//           className="flex-1 p-2 sm:p-4 min-h-0 h-full overflow-x-auto"
//         >


//           {/* Tree Structure */}
//           <div className="space-y-4 min-w-full flex flex-col items-start overflow-x-auto" style={{ minWidth: 'max-content' }}>
//             {tasks.length > 0 ? (
//               <AnimatePresence>
//                 {tasks.map((task, index) => (
//                   <TaskNode
//                     key={task.id}
//                     task={task}
//                     level={0}
//                     isExpanded={isExpanded(task.id!)}
//                     onToggleExpand={toggleExpanded}
//                     onTaskSelect={onTaskSelect}
//                     onAddSubtask={onAddSubtask}
//                     onEditTask={onEditTask}
//                     onDeleteTask={onDeleteTask}
//                     onToggleStatus={onToggleStatus}
//                     selectedTaskId={selectedTaskId}
//                     isLastChild={index === tasks.length - 1}
//                     parentHasMoreChildren={tasks.length > 1}
//                     expandedTasks={expandedTasks}
//                   />
//                 ))}
//               </AnimatePresence>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-8 sm:py-16 text-center">
//                 <div className="w-8 h-8 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2 sm:mb-4">
//                   <FolderOpen className="w-4 h-4 sm:w-8 sm:h-8 text-slate-400" />
//                 </div>
//                 <h3 className="text-sm sm:text-lg font-semibold text-slate-700 mb-1 sm:mb-2">No tasks found</h3>
//                 <p className="text-xs sm:text-base text-slate-500">Create your first task to get started</p>
//           </div>
//         )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
