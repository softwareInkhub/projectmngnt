// import React, { useState, useEffect } from "react";
// import { 
//   CheckSquare, 
//   X, 
//   Calendar, 
//   User, 
//   Tag, 
//   Clock, 
//   Plus, 
//   Trash2,
//   AlertCircle,
//   CheckCircle,
//   Play,
//   Pause,
//   Square,
//   CheckCircle2
// } from "lucide-react";
// import { TaskApiService, TaskData, validateTaskData } from "../utils/taskApi";

// interface CreateTaskModalProps {
//   open: boolean;
//   onClose: () => void;
//   context?: { company: string };
//   onTaskCreated?: (task: any) => void;
// }

// const assignees = [
//   "Sarah Johnson",
//   "Mike Chen", 
//   "Alex Rodriguez",
//   "Emily Davis",
//   "David Wilson",
//   "Lisa Thompson",
//   "James Brown",
//   "Maria Garcia"
// ];

// const statuses = ["To Do", "In Progress", "Review", "Done", "Blocked"];
// const priorities = ["Low", "Medium", "High", "Critical"];
// const projects = [
//   "Whapi Project Management",
//   "E-commerce Platform", 
//   "Client Portal",
//   "Mobile App Development",
//   "API Integration"
// ];

// const tags = [
//   "Design", "Frontend", "Backend", "Security", "Testing", 
//   "Documentation", "Bug Fix", "Feature", "Refactor", "UI/UX"
// ];

// export default function CreateTaskModal({ open, onClose, context, onTaskCreated }: CreateTaskModalProps) {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     project: context?.company || projects[0],
//     assignee: assignees[0],
//     status: statuses[0],
//     priority: priorities[1],
//     dueDate: "",
//     startDate: "",
//     estimatedHours: "",
//     tags: [] as string[],
//     subtasks: [] as { id: number; title: string; completed: boolean }[],
//     attachments: [] as string[],
//     comments: ""
//   });

//   const [showNewProject, setShowNewProject] = useState(false);
//   const [newProject, setNewProject] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [existingTasks, setExistingTasks] = useState<TaskData[]>([]);

//   // Fetch existing tasks when modal opens
//   useEffect(() => {
//     if (open) {
//       const fetchTasks = async () => {
//         try {
//           const response = await TaskApiService.getTasks();
//           const tasks = response.data || [];
//           setExistingTasks(tasks);
//         } catch (error) {
//           console.error('Error fetching tasks:', error);
//         }
//       };
//       fetchTasks();
//     }
//   }, [open]);

//   if (!open) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     // Prepare task data for API
//     const taskData: TaskData = {
//       title: formData.title.trim(),
//       description: formData.description.trim(),
//       project: formData.project.trim(),
//       assignee: formData.assignee.trim(),
//       status: formData.status,
//       priority: formData.priority,
//       startDate: formData.startDate,
//       dueDate: formData.dueDate,
//       estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : 0, // Default to 0 if not set
//       tags: formData.tags.join(','), // Convert array to comma-separated string
//       subtasks: JSON.stringify(formData.subtasks), // Convert to JSON string
//       comments: formData.comments.trim(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };

//     // Validate task data
//     const validation = validateTaskData(taskData);
//     if (!validation.isValid) {
//       setError(validation.errors.join(', '));
//       setIsSubmitting(false);
//       return;
//     }

//           try {
//         // Use API service to create task
//         const response = await TaskApiService.createTask(taskData);

//       if (!response.success) {
//         throw new Error(response.error || 'Failed to create task');
//       }

//       console.log("Task created successfully:", response.data);
      
//       // Call success callback if provided
//       if (onTaskCreated) {
//         onTaskCreated(response.data);
//       }
      
//       // Close modal and reset form
//       onClose();
      
//     } catch (err) {
//       console.error("Error creating task:", err);
//       setError(err instanceof Error ? err.message : 'Failed to create task');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const addSubtask = () => {
//     const newSubtask = {
//       id: Date.now(),
//       title: "",
//       completed: false
//     };
//     setFormData(prev => ({
//       ...prev,
//       subtasks: [...prev.subtasks, newSubtask]
//     }));
//   };

//   const updateSubtask = (id: number, field: string, value: string | boolean) => {
//     setFormData(prev => ({
//       ...prev,
//       subtasks: prev.subtasks.map(subtask => 
//         subtask.id === id ? { ...subtask, [field]: value } : subtask
//       )
//     }));
//   };

//   const removeSubtask = (id: number) => {
//     setFormData(prev => ({
//       ...prev,
//       subtasks: prev.subtasks.filter(subtask => subtask.id !== id)
//     }));
//   };

//   const toggleTag = (tag: string) => {
//     setFormData(prev => ({
//       ...prev,
//       tags: prev.tags.includes(tag) 
//         ? prev.tags.filter(t => t !== tag)
//         : [...prev.tags, tag]
//     }));
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-4 rounded-t-xl">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                 <CheckSquare className="w-4 h-4 text-green-600" />
//               </div>
//               <div>
//                 <h2 className="text-lg font-bold text-slate-900">Create New Task</h2>
//                 <p className="text-sm text-slate-600">Fill in the details below to create a new task.</p>
//               </div>
//             </div>
//             <button 
//               onClick={onClose}
//               className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-4 space-y-6">
//           {/* Task Information */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <CheckSquare className="w-3 h-3 text-blue-600" />
//               </div>
//               <h3 className="text-base font-semibold text-slate-900">Task Information</h3>
//             </div>

//             <div className="space-y-3">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Task Title *
//                   </label>
//                   <select
//                     value={formData.title}
//                     onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                     required
//                   >
//                     <option value="">Select Existing Task</option>
//                     {existingTasks.map((task) => (
//                       <option key={task.id} value={task.title}>
//                         {task.title}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Project *
//                   </label>
//                   <div className="relative">
//                     <select
//                       value={formData.project}
//                       onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
//                       className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
//                       required
//                     >
//                       {projects.map(project => (
//                         <option key={project} value={project}>{project}</option>
//                       ))}
//                     </select>
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                       {/* Building icon removed as per new_code */}
//                     </div>
//                   </div>
//                   {showNewProject && (
//                     <div className="mt-2">
//                       <input
//                         type="text"
//                         value={newProject}
//                         onChange={(e) => setNewProject(e.target.value)}
//                         placeholder="Enter new project name"
//                         className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
//                       />
//                     </div>
//                   )}
//                   <button
//                     type="button"
//                     onClick={() => setShowNewProject(!showNewProject)}
//                     className="text-sm text-blue-600 hover:text-blue-700 mt-1"
//                   >
//                     {showNewProject ? "Cancel" : "+ Add New Project"}
//                   </button>
//                 </div>

//                 <div>
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Assignee *
//                   </label>
//                   <div className="relative">
//                     <select
//                       value={formData.assignee}
//                       onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
//                       className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
//                       required
//                     >
//                       {assignees.map(assignee => (
//                         <option key={assignee} value={assignee}>{assignee}</option>
//                       ))}
//                     </select>
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                       <User className="w-4 h-4 text-slate-400" />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                     placeholder="Describe the task goals, requirements, and key deliverables..."
//                     rows={2}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Task Details */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
//                 {/* Target icon removed as per new_code */}
//               </div>
//               <h3 className="text-base font-semibold text-slate-900">Task Details</h3>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Status *
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={formData.status}
//                     onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
//                     required
//                   >
//                     {statuses.map(status => (
//                       <option key={status} value={status}>{status}</option>
//                     ))}
//                   </select>
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                     {/* Flag icon removed as per new_code */}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Priority *
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={formData.priority}
//                     onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
//                     required
//                   >
//                     {priorities.map(priority => (
//                       <option key={priority} value={priority}>{priority}</option>
//                     ))}
//                   </select>
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                     <AlertCircle className="w-4 h-4 text-slate-400" />
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Estimated Hours
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     value={formData.estimatedHours}
//                     onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
//                     placeholder="e.g., 8"
//                     className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                   />
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                     <Clock className="w-4 h-4 text-slate-400" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Timeline */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
//                 <Calendar className="w-3 h-3 text-orange-600" />
//               </div>
//               <h3 className="text-base font-semibold text-slate-900">Timeline</h3>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Start Date *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={formData.startDate}
//                     onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                     required
//                   />
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                     {/* CalendarDays icon removed as per new_code */}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Due Date *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={formData.dueDate}
//                     onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
//                     className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                     required
//                   />
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                     {/* CalendarDays icon removed as per new_code */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Tags */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
//                 <Tag className="w-3 h-3 text-indigo-600" />
//               </div>
//               <h3 className="text-base font-semibold text-slate-900">Tags</h3>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {tags.map(tag => (
//                 <button
//                   key={tag}
//                   type="button"
//                   onClick={() => toggleTag(tag)}
//                   className={`px-2 py-1 rounded-full text-sm font-medium transition-colors ${
//                     formData.tags.includes(tag)
//                       ? "bg-blue-100 text-blue-700 border border-blue-200"
//                       : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
//                   }`}
//                 >
//                   {tag}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Subtasks */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
//                   <CheckSquare className="w-4 h-4 text-green-600" />
//                 </div>
//                 <h3 className="text-base font-semibold text-slate-900">Subtasks</h3>
//               </div>
//               <button
//                 type="button"
//                 onClick={addSubtask}
//                 className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
//               >
//                 <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
//                 <span>Add Subtask</span>
//               </button>
//             </div>

//             <div className="space-y-3">
//               {formData.subtasks.map((subtask, index) => (
//                 <div key={subtask.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
//                   <input
//                     type="checkbox"
//                     checked={subtask.completed}
//                     onChange={(e) => updateSubtask(subtask.id, "completed", e.target.checked)}
//                     className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 rounded focus:ring-green-500"
//                   />
//                   <input
//                     type="text"
//                     value={subtask.title}
//                     onChange={(e) => updateSubtask(subtask.id, "title", e.target.value)}
//                     placeholder={`Subtask ${index + 1}`}
//                     className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeSubtask(subtask.id)}
//                     className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
//                   >
//                     <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Comments */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
//                 {/* MessageSquare icon removed as per new_code */}
//               </div>
//               <h3 className="text-base font-semibold text-slate-900">Initial Comments</h3>
//             </div>

//             <div>
//               <textarea
//                 value={formData.comments}
//                 onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
//                 placeholder="Add any initial comments or notes about this task..."
//                 rows={2}
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
//               />
//             </div>
//           </div>

//           {/* Error Display */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <div className="flex items-center space-x-2">
//                 <AlertCircle className="w-5 h-5 text-red-600" />
//                 <span className="text-red-800 font-medium">Error</span>
//               </div>
//               <p className="text-red-700 mt-1">{error}</p>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex items-center justify-between pt-6 border-t border-slate-200">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <X className="w-4 h-4" />
//               <span>Cancel</span>
//             </button>

//             <div className="flex items-center space-x-3">
//               <button
//                 type="button"
//                 disabled={isSubmitting}
//                 className="px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {/* Save icon removed as per new_code */}
//                 <span>Save Draft</span>
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Creating...</span>
//                   </>
//                 ) : (
//                   <>
//                     <CheckSquare className="w-4 h-4" />
//                     <span>Create Task</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// } 