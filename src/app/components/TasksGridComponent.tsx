"use client";

import React, { useState } from "react";
import { 
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
  CheckSquare
} from "lucide-react";

interface Task {
  id: number;
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
    id: number;
    author: string;
    content: string;
    timestamp: string;
  }>;
}

export default function TasksGridComponent({ onOpenTab, context }: { 
  onOpenTab?: (type: string, title?: string, context?: any) => void,
  context?: { company: string }
}) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "grid-task-1",
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
          id: "grid-comment-1",
          author: "",
          content: "Started implementing JWT token generation",
          timestamp: "2024-01-18T10:30:00Z"
        }
      ]
    },
    {
      id: "grid-task-2",
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
          id: "grid-comment-2",
          author: "Alice Johnson",
          content: "Completed responsive design implementation",
          timestamp: "2024-01-25T14:20:00Z"
        }
      ]
    },
    {
      id: "grid-task-3",
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
          id: "grid-task-3",
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
  const [assigneeFilter, setAssigneFilter] = useState<string>("");
  const [showMoreMenu, setShowMoreMenu] = useState<number | null>(null);

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setShowMoreMenu(null);
  };

  const duplicateTask = (task: Task) => {
    const newTask = {
      ...task,
      id: Math.max(...tasks.map(t => t.id)) + 1,
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
    setAssigneFilter("");
  };

  const handleCreateTask = () => {
    const newTask: Task = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
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

  const renderTaskCard = (task: Task) => (
    <div key={task.id} className="bg-white rounded-lg border border-neutral-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
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
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              task.priority === 'High' ? 'bg-red-100 text-red-700' :
              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {task.priority}
            </span>
          </div>
          
          <h3 className="text-sm font-semibold text-neutral-900 mb-1 line-clamp-2">{task.name}</h3>
          <p className="text-xs text-neutral-600 line-clamp-2">{task.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 mt-2">
        <button 
          className="p-1 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          onClick={() => onOpenTab && onOpenTab("edit-task", `Edit: ${task.name}`)}
          title="Edit Task"
        >
          <Edit className="w-3 h-3" />
        </button>
        <button 
          className="p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
          onClick={() => setShowMoreMenu(showMoreMenu === task.id ? null : task.id)}
        >
          <MoreHorizontal className="w-3 h-3" />
        </button>
        
        {showMoreMenu === task.id && (
          <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10">
            <button 
              className="flex items-center gap-1 w-full px-2 py-1 text-xs hover:bg-neutral-50 text-neutral-700 text-left"
              onClick={() => duplicateTask(task)}
            >
              <Copy className="w-3 h-3" />
              Duplicate
            </button>
            <button 
              className="flex items-center gap-1 w-full px-2 py-1 text-xs hover:bg-neutral-50 text-neutral-700 text-left"
              onClick={() => exportTask(task)}
            >
              <Download className="w-3 h-3" />
              Export
            </button>
            <hr className="my-1" />
            <button 
              className="flex items-center gap-1 w-full px-2 py-1 text-xs hover:bg-red-50 text-red-600 text-left"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-neutral-400" />
          <span className="text-neutral-600 truncate">{task.assignee}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-neutral-400" />
          <span className="text-neutral-600 truncate">Due {task.dueDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <BarChart3 className="w-3 h-3 text-neutral-400" />
          <span className="text-neutral-600">{task.storyPoints} pts</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-neutral-400" />
          <span className="text-neutral-600">{task.timeSpent}</span>
        </div>
      </div>
    </div>
  );

  const renderNoTasksFound = () => (
    <div className="p-4 text-center">
      <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-2">
        <CheckSquare className="w-4 h-4 text-neutral-400" />
      </div>
      <h3 className="text-sm font-medium text-neutral-900 mb-1">No tasks found</h3>
      <p className="text-xs text-neutral-600 mb-3">Try adjusting your search or create a new task.</p>
      <button 
        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
        onClick={handleCreateTask}
      >
        Create Task
      </button>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 lg:p-8 h-full">
      <div className="max-w-7xl mx-auto space-y-6 h-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Tasks
              </h1>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full font-medium">
                {filteredTasks.length} Tasks
              </span>
            </div>
            <p className="text-slate-600 text-base font-medium">
              Manage and track all your tasks efficiently.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 text-slate-700 font-medium transition-all duration-200 hover:scale-105"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
            <button
              className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
              onClick={handleCreateTask}
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
              New Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value="">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex-1 overflow-auto">
          {filteredTasks.length === 0 ? (
            renderNoTasksFound()
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTasks.map(renderTaskCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 