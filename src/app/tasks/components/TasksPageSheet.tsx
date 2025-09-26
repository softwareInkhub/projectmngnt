"use client";

import React, { useState } from "react";
import { 
  X, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Download, 
  MoreHorizontal,
  Users,
  FileText,
  Target,
  BarChart3,
  Clock,
  Calendar,
  CheckSquare,
  Grid3X3
} from "lucide-react";
import GridLayoutWrapper from "../../components/GridLayoutWrapper";

interface Task {
  id: string | number;
  name: string;
  status: string;
  priority: string;
  assignee: string;
  reporter: string;
  storyPoints: number;
  story: string;
  sprint: string;
  epic: string;
  description: string;
  acceptanceCriteria: string[];
  created: string;
  updated: string;
  dueDate: string;
  completedDate: string | null;
  archived: boolean;
  tags: string[];
  timeSpent: string;
  timeEstimate: string;
  comments: Array<{
    id: string | number;
    author: string;
    content: string;
    timestamp: string;
  }>;
}

export default function TasksPageSheet({ open, onClose, onOpenTab, context }: { 
  open: boolean, 
  onClose: () => void,
  onOpenTab?: (type: string, title?: string, context?: any) => void,
  context?: { company: string }
}) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      name: "Implement user authentication",
      status: "In Progress",
      priority: "High",
              assignee: "",
        reporter: "",
      storyPoints: 8,
      story: "User Management",
      sprint: "Sprint 1",
      epic: "Authentication System",
      description: "Implement secure user authentication with JWT tokens and password hashing",
      acceptanceCriteria: [
        "Users can register with email and password",
        "Users can login with valid credentials",
        "Passwords are properly hashed",
        "JWT tokens are generated and validated"
      ],
      created: "2024-01-15",
      updated: "2024-01-20",
      dueDate: "2024-02-01",
      completedDate: null,
      archived: false,
      tags: ["authentication", "security", "backend"],
      timeSpent: "12h",
      timeEstimate: "16h",
      comments: [
        {
          id: "comment-1",
          author: "",
          content: "Started implementing JWT token generation",
          timestamp: "2024-01-18T10:30:00Z"
        }
      ]
    },
    {
      id: "task-2",
      name: "Design responsive dashboard",
      status: "Done",
      priority: "Medium",
      assignee: "Alice Johnson",
      reporter: "Bob Wilson",
      storyPoints: 5,
      story: "UI/UX Design",
      sprint: "Sprint 1",
      epic: "Dashboard Redesign",
      description: "Create a responsive dashboard layout with modern design principles",
      acceptanceCriteria: [
        "Dashboard is responsive on all devices",
        "Design follows material design principles",
        "All widgets are properly aligned",
        "Color scheme is consistent"
      ],
      created: "2024-01-10",
      updated: "2024-01-25",
      dueDate: "2024-01-30",
      completedDate: "2024-01-25",
      archived: false,
      tags: ["design", "frontend", "responsive"],
      timeSpent: "8h",
      timeEstimate: "10h",
      comments: [
        {
          id: "comment-2",
          author: "Alice Johnson",
          content: "Completed responsive design implementation",
          timestamp: "2024-01-25T14:20:00Z"
        }
      ]
    },
    {
      id: "task-3",
      name: "Fix API rate limiting",
      status: "Review",
      priority: "High",
      assignee: "Mike Brown",
      reporter: "Sarah Davis",
      storyPoints: 3,
      story: "API Optimization",
      sprint: "Sprint 2",
      epic: "Performance Improvements",
      description: "Implement proper rate limiting for API endpoints to prevent abuse",
      acceptanceCriteria: [
        "Rate limiting is applied to all endpoints",
        "Proper error responses are returned",
        "Rate limits are configurable",
        "Monitoring is in place"
      ],
      created: "2024-01-22",
      updated: "2024-01-28",
      dueDate: "2024-02-05",
      completedDate: null,
      archived: false,
      tags: ["api", "security", "performance"],
      timeSpent: "6h",
      timeEstimate: "8h",
      comments: [
        {
          id: "comment-3",
          author: "Mike Brown",
          content: "Implemented basic rate limiting, ready for review",
          timestamp: "2024-01-28T09:15:00Z"
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState<string | number | null>(null);
  const [isGridMode, setIsGridMode] = useState(false);

  const defaultTaskLayout = [
    { i: 'task-1', x: 0, y: 0, w: 6, h: 4 },
    { i: 'task-2', x: 6, y: 0, w: 6, h: 4 },
    { i: 'task-3', x: 0, y: 4, w: 6, h: 4 }
  ];

  const deleteTask = (taskId: string | number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setShowMoreMenu(null);
  };

  const duplicateTask = (task: Task) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      name: `${task.name} (Copy)`,
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
      completedDate: null,
      status: "To Do"
    };
    setTasks([...tasks, newTask]);
    setShowMoreMenu(null);
  };

  const exportTask = (task: Task) => {
    const dataStr = JSON.stringify(task, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `task-${task.id}-${task.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowMoreMenu(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPriorityFilter("");
    setAssigneeFilter("");
  };

  const handleCreateTask = () => {
      const newTask: Task = {
        id: `task-${Date.now()}`,
      name: "New Task",
      status: "To Do",
      priority: "Medium",
      assignee: "Unassigned",
      reporter: "Current User",
      storyPoints: 3,
      story: "General",
      sprint: "Backlog",
      epic: "General",
      description: "Task description",
      acceptanceCriteria: ["Criteria 1", "Criteria 2"],
        created: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completedDate: null,
        archived: false,
      tags: ["new"],
        timeSpent: "0h",
      timeEstimate: "8h",
        comments: []
      };
    setTasks([...tasks, newTask]);
      setShowCreateForm(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    const matchesAssignee = !assigneeFilter || task.assignee === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const statuses = [...new Set(tasks.map(task => task.status))];
  const priorities = [...new Set(tasks.map(task => task.priority))];
  const assignees = [...new Set(tasks.map(task => task.assignee))];

  if (!open) return null;

  const renderTaskCard = (task: Task) => (
    <div key={task.id} className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-3 h-3 rounded-full ${
              task.priority === 'High' ? 'bg-red-500' :
              task.priority === 'Medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`} />
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              task.status === 'Done' ? 'bg-green-100 text-green-700' :
              task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
              task.status === 'Review' ? 'bg-yellow-100 text-yellow-700' :
              task.status === 'Blocked' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
                        }`}>
                          {task.status}
                        </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              task.priority === 'High' ? 'bg-red-100 text-red-700' :
              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {task.priority}
                        </span>
                      </div>
          
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">{task.name}</h3>
                      <p className="text-sm text-neutral-600 mt-1">{task.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => onOpenTab && onOpenTab("edit-task", `Edit: ${task.name}`)}
                      title="Edit Task"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                      onClick={() => setShowMoreMenu(showMoreMenu === task.id ? null : task.id)}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {showMoreMenu === task.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10">
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-neutral-50 text-neutral-700 text-left"
                          onClick={() => duplicateTask(task)}
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate Task
                        </button>
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-neutral-50 text-neutral-700 text-left"
                          onClick={() => exportTask(task)}
                        >
                          <Download className="w-4 h-4" />
                          Export Task
                        </button>
                        <hr className="my-1" />
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 text-red-600 text-left"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Task
                        </button>
                      </div>
                    )}
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">{task.story}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">{task.sprint}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">{task.storyPoints} points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">{task.timeSpent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">Due {task.dueDate}</span>
                  </div>
                </div>
              </div>
  );

  const renderGridTask = (task: Task) => (
    <div key={`task-${task.id}`} className="h-full">
      <div className="bg-white rounded-lg border border-gray-200 p-4 h-full hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              task.priority === 'High' ? 'bg-red-500' :
              task.priority === 'Medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`} />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              task.status === 'Done' ? 'bg-green-100 text-green-700' :
              task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
              task.status === 'Review' ? 'bg-yellow-100 text-yellow-700' :
              task.status === 'Blocked' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {task.status}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenTab && onOpenTab("edit-task", `Edit: ${task.name}`, task)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => duplicateTask(task)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 text-red-400 hover:text-red-600 rounded"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{task.description}</p>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Users size={12} />
            <span>{task.assignee}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={12} />
            <span>Due {task.dueDate}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} />
            <span>{task.timeEstimate}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Story:</span>
            <span className="text-xs font-medium text-gray-700">{task.story}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Points:</span>
            <span className="text-xs font-medium text-gray-700">{task.storyPoints}</span>
          </div>
        </div>
        
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {task.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={`task-tag-${index}`}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderNoTasksFound = () => (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No tasks found</h3>
              <p className="text-neutral-600 mb-4">Try adjusting your search or create a new task.</p>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowCreateForm(true)}
              >
                Create Your First Task
              </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-neutral-900">Tasks</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsGridMode(!isGridMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isGridMode 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
                title="Toggle Grid View"
              >
                <Grid3X3 size={20} />
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Filters */}
            <div className="p-6 border-b border-neutral-200">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Priorities</option>
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
                
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Assignees</option>
                  {assignees.map(assignee => (
                    <option key={assignee} value={assignee}>{assignee}</option>
                  ))}
                </select>
                
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
                
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create Task
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  All Tasks ({filteredTasks.length})
                </h3>
              </div>

              {filteredTasks.length === 0 ? (
                renderNoTasksFound()
              ) : isGridMode ? (
                <GridLayoutWrapper
                  title="Tasks Grid"
                  compact={true}
                  defaultLayout={defaultTaskLayout}
                  storageKey={`tasks-grid-${context?.company || 'default'}`}
                  className="mb-4"
                >
                  {filteredTasks.map(renderGridTask)}
                </GridLayoutWrapper>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map(renderTaskCard)}
            </div>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 