// "use client";

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   X, 
//   Plus, 
//   User, 
//   Calendar, 
//   Flag, 
//   Tag, 
//   FileText,
//   ChevronDown,
//   ChevronUp,
//   Check
// } from 'lucide-react';
// import { TaskData, TaskTreeNode, getAvailableParents } from '../utils/taskApi';

// interface EnhancedTaskModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (taskData: TaskData) => void;
//   editingTask?: TaskData | null;
//   parentTaskId?: string | null;
//   allTasks: TaskTreeNode[];
//   isLoading?: boolean;
// }

// const statuses = ["To Do", "In Progress", "Review", "Done", "Blocked"];
// const priorities = ["Low", "Medium", "High", "Critical"];
// const assignees = [
//   "Sarah Johnson", "Mike Chen", "Alex Rodriguez", "Emily Davis",
//   "David Wilson", "Lisa Thompson", "James Brown", "Maria Garcia"
// ];

// export default function EnhancedTaskModal({
//   isOpen,
//   onClose,
//   onSubmit,
//   editingTask,
//   parentTaskId,
//   allTasks,
//   isLoading = false
// }: EnhancedTaskModalProps) {
//   const [formData, setFormData] = useState<TaskData>({
//     title: "",
//     description: "",
//     project: "",
//     assignee: assignees[0],
//     status: statuses[0],
//     priority: priorities[1],
//     dueDate: "",
//     startDate: "",
//     estimatedHours: 0,
//     tags: "",
//     subtasks: "",
//     comments: "",
//     parentId: null
//   });

//   const [showParentSelector, setShowParentSelector] = useState(false);
//   const [selectedParentId, setSelectedParentId] = useState<string | null>(parentTaskId || null);
//   const [errors, setErrors] = useState<string[]>([]);

//   // Initialize form data when editing or when parent task is provided
//   useEffect(() => {
//     if (editingTask) {
//       // Parse subtasks from JSON string to display as readable text
//       let subtasksText = "";
//       if (editingTask.subtasks) {
//         try {
//           const subtasksArray = JSON.parse(editingTask.subtasks);
//           if (Array.isArray(subtasksArray)) {
//             subtasksText = subtasksArray.map((subtask: any) => subtask.title || subtask).join('\n');
//           } else {
//             subtasksText = editingTask.subtasks;
//           }
//         } catch (error) {
//           // If parsing fails, use the raw string
//           subtasksText = editingTask.subtasks;
//         }
//       }

//       setFormData({
//         title: editingTask.title ?? "",
//         description: editingTask.description ?? "",
//         project: editingTask.project ?? "",
//         assignee: editingTask.assignee ?? assignees[0],
//         status: editingTask.status ?? statuses[0],
//         priority: editingTask.priority ?? priorities[1],
//         dueDate: editingTask.dueDate ?? "",
//         startDate: editingTask.startDate ?? "",
//         estimatedHours: editingTask.estimatedHours ?? 0,
//         tags: editingTask.tags ?? "",
//         subtasks: subtasksText,
//         comments: editingTask.comments ?? "",
//         parentId: editingTask.parentId ?? null,
//         id: editingTask.id
//       });
//       setSelectedParentId(editingTask.parentId || null);
//     } else if (parentTaskId) {
//       setFormData(prev => ({
//         ...prev,
//         parentId: parentTaskId
//       }));
//       setSelectedParentId(parentTaskId);
//     } else {
//       // Reset form for new task
//       setFormData({
//         title: "",
//         description: "",
//         project: "",
//         assignee: assignees[0],
//         status: statuses[0],
//         priority: priorities[1],
//         dueDate: "",
//         startDate: "",
//         estimatedHours: 0,
//         tags: "",
//         subtasks: "",
//         comments: "",
//         parentId: null
//       });
//       setSelectedParentId(null);
//     }
//     setErrors([]);
//   }, [editingTask, parentTaskId, isOpen]);

//   const handleInputChange = (field: keyof TaskData, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
    
//     // Clear errors when user starts typing
//     if (errors.length > 0) {
//       setErrors([]);
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: string[] = [];

//     if (!(formData.title ?? "").trim()) {
//       newErrors.push('Title is required');
//     }

//     if (!(formData.project ?? "").trim()) {
//       newErrors.push('Project is required');
//     }

//     if (!(formData.assignee ?? "").trim()) {
//       newErrors.push('Assignee is required');
//     }

//     if (!(formData.status ?? "").trim()) {
//       newErrors.push('Status is required');
//     }

//     if (formData.dueDate && formData.startDate) {
//       const startDate = new Date(formData.startDate);
//       const dueDate = new Date(formData.dueDate);
//       if (startDate > dueDate) {
//         newErrors.push('Start date cannot be after due date');
//       }
//     }

//     setErrors(newErrors);
//     return newErrors.length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     // Convert subtasks text to JSON format
//     let subtasksJson = "";
//     if ((formData.subtasks ?? "") && typeof formData.subtasks === 'string' && (formData.subtasks ?? "").trim()) {
//       const subtasksArray = formData.subtasks
//         .split('\n')
//         .map(line => line.trim())
//         .filter(line => line.length > 0)
//         .map(title => ({ id: Date.now() + Math.random(), title, completed: false }));
//       subtasksJson = JSON.stringify(subtasksArray);
//     }

//     const taskData: TaskData = {
//       ...formData,
//       subtasks: subtasksJson,
//       parentId: selectedParentId,
//       id: editingTask?.id || undefined
//     };

//     // Clear the subtasks field after submission since they'll be created as separate tasks
//     if (!editingTask) {
//       setFormData(prev => ({
//         ...prev,
//         subtasks: ""
//       }));
//     }

//     onSubmit(taskData);
//   };

//   const getAvailableParentTasks = () => {
//     const availableTasks = editingTask ? getAvailableParents(editingTask.id!, allTasks) : allTasks;
//     console.log('Available parent tasks:', {
//       total: allTasks.length,
//       available: availableTasks.length,
//       editingTask: editingTask?.title,
//       sampleTasks: availableTasks.slice(0, 3).map(t => ({ id: t.id, title: t.title, parentId: t.parentId }))
//     });
//     return availableTasks;
//   };

//   const getParentTaskTitle = (parentId: string | null) => {
//     if (!parentId) return "No parent (root task)";
//     const parent = allTasks.find(task => task.id === parentId);
//     return parent ? parent.title : "Unknown parent";
//   };

//   if (!isOpen) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6"
//     >
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-slate-900">
//           {editingTask ? 'Edit Task' : 'Create New Task'}
//         </h1>
//         <p className="text-slate-600">
//           {editingTask ? 'Update task details and settings' : 'Set up a new task with all the essential details'}
//         </p>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Error Messages */}
//         {errors.length > 0 && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//             <ul className="text-red-700  space-y-0.5">
//               {errors.map((error, index) => (
//                 <li key={`error-${index}`}>• {error}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Parent Task Selection */}
//         <div className="space-y-1">
//           <label className="block text-sm font-medium mb-1">
//             Parent Task
//           </label>
//           <div className="relative">
//             <button
//               type="button"
//               onClick={() => setShowParentSelector(!showParentSelector)}
//               className="w-full flex items-center justify-between p-2 border border-slate-300 rounded-lg bg-white hover:border-slate-400 transition-colors"
//             >
//               <span className=" text-slate-900">
//                 {getParentTaskTitle(selectedParentId)}
//               </span>
//               {showParentSelector ? (
//                 <ChevronUp className="w-3 h-3 text-slate-500" />
//               ) : (
//                 <ChevronDown className="w-3 h-3 text-slate-500" />
//               )}
//             </button>
            
//             <AnimatePresence>
//               {showParentSelector && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
//                 >
//                   <div className="p-1.5">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSelectedParentId(null);
//                         setShowParentSelector(false);
//                       }}
//                       className={`w-full text-left p-1.5 rounded-md  hover:bg-slate-100 transition-colors ${
//                         selectedParentId === null ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
//                       }`}
//                     >
//                       <div className="flex items-center gap-1.5">
//                         {selectedParentId === null && <Check className="w-3 h-3" />}
//                         <span>No parent (root task)</span>
//                       </div>
//                     </button>
                    
//                     {getAvailableParentTasks().map((task) => (
//                       <button
//                         key={task.id}
//                         type="button"
//                         onClick={() => {
//                           setSelectedParentId(task.id!);
//                           setShowParentSelector(false);
//                         }}
//                         className={`w-full text-left p-1.5 rounded-md  hover:bg-slate-100 transition-colors ${
//                           selectedParentId === task.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
//                         }`}
//                       >
//                         <div className="flex items-center gap-1.5">
//                           {selectedParentId === task.id && <Check className="w-3 h-3" />}
//                           <span className="truncate">{task.title}</span>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* Title */}
//         <div className="space-y-1">
//           <label className="block text-sm font-medium mb-1">
//             Task Title *
//           </label>
//           <input
//             type="text"
//             value={formData.title}
//             onChange={(e) => handleInputChange('title', e.target.value)}
//             className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
//             placeholder="Enter task title"
//           />
//         </div>

//         {/* Description */}
//         <div className="space-y-1">
//           <label className="block text-sm font-medium mb-1">
//             Description
//           </label>
//           <textarea
//             value={formData.description}
//             onChange={(e) => handleInputChange('description', e.target.value)}
//             rows={2}
//             className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
//             placeholder="Enter task description"
//           />
//         </div>

//         {/* Project and Assignee */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-1">
//             <label className="block text-sm font-medium mb-1">
//               Project *
//             </label>
//             <input
//               type="text"
//               value={formData.project}
//               onChange={(e) => handleInputChange('project', e.target.value)}
//               className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
//               placeholder="Enter project name"
//             />
//           </div>
          
//           <div className="space-y-1">
//             <label className="block text-sm font-medium mb-1">
//               Assignee *
//             </label>
//             <select
//               value={formData.assignee}
//               onChange={(e) => handleInputChange('assignee', e.target.value)}
//               className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
//             >
//               {assignees.map((assignee) => (
//                 <option key={assignee} value={assignee}>
//                   {assignee}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Status and Priority */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-1">
//             <label className="block text-sm font-medium mb-1">
//               Status *
//             </label>
//             <select
//               value={formData.status}
//               onChange={(e) => handleInputChange('status', e.target.value)}
//               className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
//             >
//               {statuses.map((status) => (
//                 <option key={status} value={status}>
//                   {status}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div className="space-y-1">
//             <label className="block text-sm font-medium mb-1">
//               Priority
//             </label>
//             <select
//               value={formData.priority}
//               onChange={(e) => handleInputChange('priority', e.target.value)}
//               className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
//             >
//               {priorities.map((priority) => (
//                 <option key={priority} value={priority}>
//                   {priority}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Dates */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-1">
//             <label className="block text-sm font-medium mb-1">
//               Start Date
//             </label>
//             <input
//               type="date"
//               value={formData.startDate}
//               onChange={(e) => handleInputChange('startDate', e.target.value)}
//               className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
//             />
//           </div>
          
//           <div className="space-y-1">
//             <label className="block text-sm font-medium mb-1">
//               Due Date
//             </label>
//             <input
//               type="date"
//               value={formData.dueDate}
//               onChange={(e) => handleInputChange('dueDate', e.target.value)}
//               className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
//             />
//           </div>
//         </div>

//         {/* Estimated Hours */}
//         <div className="space-y-1">
//           <label className="block text-sm font-medium mb-1">
//             Estimated Hours
//           </label>
//           <input
//             type="number"
//             value={formData.estimatedHours || ''}
//             onChange={(e) => handleInputChange('estimatedHours', e.target.value ? parseFloat(e.target.value) : 0)}
//             className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
//             placeholder="Enter estimated hours"
//             min="0"
//             step="0.5"
//           />
//         </div>

//                  {/* Tags */}
//          <div className="space-y-1">
//            <label className="block text-sm font-medium mb-1">
//              Tags
//            </label>
//            <input
//              type="text"
//              value={formData.tags}
//              onChange={(e) => handleInputChange('tags', e.target.value)}
//              className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
//              placeholder="Enter tags (comma separated)"
//            />
//          </div>

//          {/* Subtasks */}
//          <div className="space-y-1">
//            <label className="block text-sm font-medium mb-1">
//              Subtasks
//            </label>
//            <textarea
//              value={formData.subtasks}
//              onChange={(e) => handleInputChange('subtasks', e.target.value)}
//              rows={2}
//              className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
//              placeholder="Enter subtask names, one per line:&#10;Subtask 1&#10;Subtask 2&#10;Subtask 3"
//            />
//            <p className=" text-slate-500">
//              Enter each subtask on a new line. These will be displayed as individual subtasks in the tree view.
//            </p>
//          </div>

//          {/* Comments */}
//          <div className="space-y-1">
//            <label className="block text-sm font-medium mb-1">
//              Comments
//            </label>
//            <textarea
//              value={formData.comments}
//              onChange={(e) => handleInputChange('comments', e.target.value)}
//              rows={2}
//              className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
//              placeholder="Enter additional comments or notes"
//            />
//          </div>

//          {/* Actions */}
//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
//           >
//             {isLoading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Plus className="w-4 h-4" />
//                 {editingTask ? 'Update Task' : 'Create Task'}
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </motion.div>
//   );
// }
