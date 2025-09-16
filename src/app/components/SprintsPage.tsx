import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Archive, 
  Copy, 
  Download, 
  Search, 
  Filter, 
  X, 
  Plus,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  BarChart3,
  DollarSign,
  Target,
  Zap,
  Flag,
  Users
} from "lucide-react";

// Sample sprint data
const initialSprints = [
  {
    id: "sprint-1",
    name: "Sprint 1 - Q1 2024",
    status: "In Progress",
    startDate: "2024-01-01",
    endDate: "2024-01-15",
    tasks: 24,
    completed: 18,
    velocity: 85,
    team: "Frontend Development",
    description: "Initial sprint focusing on core UI components and user authentication",
    created: "2024-01-01",
    lastActivity: "2 hours ago",
    archived: false,
    stories: [
      {
        id: "sprint-story-1",
        name: "User Authentication System",
        status: "Completed",
        priority: "High",
        assignee: "Sarah Johnson",
        storyPoints: 8,
        tasks: 5,
        completed: 5
      },
      {
        id: "sprint-story-2",
        name: "Dashboard Layout",
        status: "In Progress",
        priority: "High",
        assignee: "Mike Chen",
        storyPoints: 5,
        tasks: 3,
        completed: 2
      },
      {
        id: "sprint-story-3",
        name: "Navigation Component",
        status: "Completed",
        priority: "Medium",
        assignee: "Alex Rodriguez",
        storyPoints: 3,
        tasks: 2,
        completed: 2
      }
    ]
  },
  {
    id: "sprint-2",
    name: "Sprint 2 - Q1 2024",
    status: "Planning",
    startDate: "2024-01-16",
    endDate: "2024-01-30",
    tasks: 32,
    completed: 0,
    velocity: 0,
    team: "Backend Development",
    description: "Backend API development and database schema implementation",
    created: "2024-01-10",
    lastActivity: "1 day ago",
    archived: false,
    stories: [
      {
        id: "sprint-story-4",
        name: "API Authentication",
        status: "To Do",
        priority: "High",
        assignee: "David Kim",
        storyPoints: 8,
        tasks: 4,
        completed: 0
      },
      {
        id: "sprint-story-5",
        name: "Database Schema",
        status: "To Do",
        priority: "High",
        assignee: "Tom Anderson",
        storyPoints: 6,
        tasks: 3,
        completed: 0
      },
      {
        id: "sprint-story-6",
        name: "User Management API",
        status: "To Do",
        priority: "Medium",
        assignee: "Emma Wilson",
        storyPoints: 5,
        tasks: 3,
        completed: 0
      }
    ]
  },
  {
    id: "sprint-3",
    name: "Sprint 3 - Q1 2024",
    status: "Completed",
    startDate: "2023-12-15",
    endDate: "2023-12-29",
    tasks: 28,
    completed: 28,
    velocity: 100,
    team: "UI/UX Design",
    description: "Design system implementation and component library",
    created: "2023-12-10",
    lastActivity: "1 week ago",
    archived: false,
    stories: [
      {
        id: "sprint-story-7",
        name: "Design System",
        status: "Completed",
        priority: "High",
        assignee: "Alex Rodriguez",
        storyPoints: 10,
        tasks: 6,
        completed: 6
      },
      {
        id: "sprint-story-8",
        name: "Component Library",
        status: "Completed",
        priority: "High",
        assignee: "Maria Garcia",
        storyPoints: 8,
        tasks: 4,
        completed: 4
      },
      {
        id: "sprint-story-9",
        name: "Style Guide",
        status: "Completed",
        priority: "Medium",
        assignee: "Rachel Green",
        storyPoints: 3,
        tasks: 2,
        completed: 2
      }
    ]
  },
  {
    id: "sprint-4",
    name: "Sprint 4 - Q1 2024",
    status: "In Progress",
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    tasks: 20,
    completed: 8,
    velocity: 40,
    team: "Quality Assurance",
    description: "Testing automation and quality assurance processes",
    created: "2024-01-25",
    lastActivity: "30 minutes ago",
    archived: false,
    stories: [
      {
        id: "sprint-story-10",
        name: "Test Automation Setup",
        status: "In Progress",
        priority: "High",
        assignee: "Lisa Thompson",
        storyPoints: 6,
        tasks: 3,
        completed: 2
      },
      {
        id: "sprint-story-11",
        name: "Manual Testing",
        status: "In Progress",
        priority: "Medium",
        assignee: "James Brown",
        storyPoints: 4,
        tasks: 2,
        completed: 1
      },
      {
        id: "sprint-story-12",
        name: "Performance Testing",
        status: "To Do",
        priority: "Medium",
        assignee: "Chris Lee",
        storyPoints: 5,
        tasks: 2,
        completed: 0
      }
    ]
  },
  {
    id: "sprint-5",
    name: "Sprint 5 - Q1 2024",
    status: "Planning",
    startDate: "2024-02-16",
    endDate: "2024-03-01",
    tasks: 18,
    completed: 0,
    velocity: 0,
    team: "Product Strategy",
    description: "Product roadmap planning and feature prioritization",
    created: "2024-02-01",
    lastActivity: "2 days ago",
    archived: false,
    stories: [
      {
        id: "sprint-story-13",
        name: "Market Research",
        status: "To Do",
        priority: "High",
        assignee: "Lisa Chen",
        storyPoints: 5,
        tasks: 3,
        completed: 0
      },
      {
        id: "sprint-story-14",
        name: "Feature Prioritization",
        status: "To Do",
        priority: "High",
        assignee: "James Brown",
        storyPoints: 4,
        tasks: 2,
        completed: 0
      },
      {
        id: "sprint-story-15",
        name: "Roadmap Planning",
        status: "To Do",
        priority: "Medium",
        assignee: "Rachel Green",
        storyPoints: 3,
        tasks: 2,
        completed: 0
      }
    ]
  }
];

interface Sprint {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  tasks: number;
  completed: number;
  velocity: number;
  team: string;
  description: string;
  created: string;
  lastActivity: string;
  archived: boolean;
  stories: Array<{
    id: number;
    name: string;
    status: string;
    priority: string;
    assignee: string;
    storyPoints: number;
    tasks: number;
    completed: number;
  }>;
}

export default function SprintsPage({ open, onClose, onOpenTab }: { 
  open: boolean, 
  onClose: () => void,
  onOpenTab?: (type: string, title?: string) => void 
}) {
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState<number | null>(null);
  const [expandedSprints, setExpandedSprints] = useState<number[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  
  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    project: "",
    status: "",
    priority: "",
    startDate: "",
    endDate: "",
    velocity: "",
    teamMembers: [] as string[]
  });

  // Sprint actions
  const deleteSprint = (sprintId: number) => {
    setSprints(prev => prev.filter(sprint => sprint.id !== sprintId));
    setShowMoreMenu(null);
  };

  const archiveSprint = (sprintId: number) => {
    setSprints(prev => prev.map(sprint => 
      sprint.id === sprintId ? { ...sprint, archived: true } : sprint
    ));
    setShowMoreMenu(null);
  };

  const duplicateSprint = (sprint: Sprint) => {
    const newSprint = {
      ...sprint,
      id: Math.max(...sprints.map(s => s.id)) + 1,
      name: `${sprint.name} (Copy)`,
      status: "Planning",
      completed: 0,
      velocity: 0
    };
    setSprints(prev => [...prev, newSprint]);
    setShowMoreMenu(null);
  };

  const exportSprint = (sprint: Sprint) => {
    const dataStr = JSON.stringify(sprint, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sprint.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadSprintReport = (sprint: Sprint) => {
    const report = `
Sprint Report: ${sprint.name}
Team: ${sprint.team}
Status: ${sprint.status}
Duration: ${sprint.startDate} to ${sprint.endDate}
Tasks: ${sprint.completed}/${sprint.tasks} (${sprint.velocity}% complete)
Velocity: ${sprint.velocity}%

Stories:
${sprint.stories.map(story => `- ${story.name} (${story.status}) - ${story.assignee}`).join('\n')}
    `;
    const dataBlob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sprint.name}-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Toggle expansion
  const toggleSprint = (sprintId: number) => {
    setExpandedSprints(prev => 
      prev.includes(sprintId) 
        ? prev.filter(id => id !== sprintId)
        : [...prev, sprintId]
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setShowFilters(false);
  };

  const hasActiveFilters = searchTerm;

  // Filter sprints
  const filteredSprints = sprints.filter(sprint => 
    !sprint.archived && (
      sprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sprint.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sprint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sprint.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Analytics
  const analytics = {
    totalSprints: sprints.filter(s => !s.archived).length,
    activeSprints: sprints.filter(s => !s.archived && s.status === "In Progress").length,
    completedSprints: sprints.filter(s => !s.archived && s.status === "Completed").length,
    avgVelocity: Math.round(sprints.filter(s => !s.archived && s.status === "Completed").reduce((sum, sprint) => sum + sprint.velocity, 0) / sprints.filter(s => !s.archived && s.status === "Completed").length || 0)
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "In Progress":
        return { icon: Clock, color: "text-blue-600", bg: "bg-blue-100" };
      case "Completed":
        return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" };
      case "Planning":
        return { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-100" };
      default:
        return { icon: Clock, color: "text-neutral-600", bg: "bg-neutral-100" };
    }
  };

  const handleCreateSprint = () => {
    if (formData.name && formData.project) {
      const newSprint: Sprint = {
        id: Math.max(...sprints.map(s => s.id)) + 1,
        name: formData.name,
        status: formData.status || "Planning",
        startDate: formData.startDate,
        endDate: formData.endDate,
        velocity: parseInt(formData.velocity) || 0,
        description: formData.description,
        created: new Date().toISOString().split('T')[0],
        lastActivity: "Just now",
        archived: false,
        tasks: 0,
        completed: 0,
        team: "Default Team",
        stories: []
      };
      
      setSprints(prev => [...prev, newSprint]);
      setShowCreateForm(false);
      setFormData({
        name: "",
        description: "",
        project: "",
        status: "",
        priority: "",
        startDate: "",
        endDate: "",
        velocity: "",
        teamMembers: []
      });
    }
  };

  const toggleMember = (member: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(member) 
        ? prev.teamMembers.filter(m => m !== member)
        : [...prev.teamMembers, member]
    }));
  };

  const availableMembers = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Wilson", "Emma Chen", "Frank Miller", "Grace Lee", "Henry Brown"];
  const projects = ["Whapi Project Management", "E-commerce Platform", "Client Portal", "Mobile App Development", "API Integration"];
  const statuses = ["Planning", "Active", "Completed", "On Hold"];
  const priorities = ["Low", "Medium", "High", "Critical"];

  if (!open) return null;

  return (
    <div className="w-full h-full bg-neutral-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-t-lg bg-blue-50 text-blue-700 font-semibold">
            <Calendar className="text-blue-500 mr-1" size={20} />
            <span>Sprints</span>
          </div>
          <button onClick={onClose} className="ml-2 text-neutral-400 hover:text-red-500" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus size={16} />
          {showCreateForm ? 'Cancel' : 'New Sprint'}
        </button>
      </div>

      <div className="p-6">
        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-6 bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Create New Sprint</h3>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Sprint Information */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-3 h-3 text-pink-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Sprint Information</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Sprint Name *</label>
                  <input 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-neutral-50/50 placeholder:text-neutral-400 transition-all"
                    placeholder="Enter sprint name"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Project *</label>
                  <select
                    value={formData.project}
                    onChange={e => setFormData(prev => ({ ...prev, project: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-neutral-50/50"
                  >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-neutral-50/50 placeholder:text-neutral-400 transition-all resize-none"
                  rows={2}
                  placeholder="Describe the sprint goals and objectives..."
                />
              </div>

              {/* Sprint Details */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-3 h-3 text-green-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Sprint Details</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-neutral-50/50"
                  >
                    <option value="">Select status</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-neutral-50/50"
                  >
                    <option value="">Select priority</option>
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Velocity</label>
                  <input
                    value={formData.velocity}
                    onChange={e => setFormData(prev => ({ ...prev, velocity: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-neutral-50/50 placeholder:text-neutral-400 transition-all"
                    placeholder="e.g., 20 story points"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-orange-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Timeline</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Start Date</label>
                  <input 
                    type="date"
                    value={formData.startDate} 
                    onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))} 
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-neutral-50/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">End Date</label>
                  <input 
                    type="date"
                    value={formData.endDate} 
                    onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))} 
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-neutral-50/50 transition-all"
                  />
                </div>
              </div>

              {/* Team Members */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-3 h-3 text-blue-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Team Members</h4>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Sprint Team</label>
                <div className="flex flex-wrap gap-1">
                  {availableMembers.map(member => (
                    <button
                      key={member}
                      type="button"
                      onClick={() => toggleMember(member)}
                      className={`px-2 py-1 rounded-md border text-xs font-medium transition-all ${
                        formData.teamMembers.includes(member) 
                          ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:border-neutral-300'
                      }`}
                    >
                      {member}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleCreateSprint}
                  disabled={!formData.name || !formData.project}
                  className="flex-1 px-3 py-2 bg-pink-600 text-white rounded-lg text-xs font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Create Sprint
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Sprints</p>
                <p className="text-2xl font-bold text-neutral-900">{analytics.totalSprints}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+15% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Active Sprints</p>
                <p className="text-2xl font-bold text-neutral-900">{analytics.activeSprints}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+8% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Completed Sprints</p>
                <p className="text-2xl font-bold text-neutral-900">{analytics.completedSprints}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Avg Velocity</p>
                <p className="text-2xl font-bold text-neutral-900">{analytics.avgVelocity}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+5% from last month</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search sprints, projects, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>

        {/* Sprints List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              All Sprints ({filteredSprints.length})
            </h3>
          </div>

          <div className="space-y-4">
            {filteredSprints.map((sprint) => (
              <div
                key={sprint.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSprint(sprint.id)}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      {expandedSprints.includes(sprint.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-neutral-900">{sprint.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          sprint.status === "Active" ? "bg-green-100 text-green-700" :
                          sprint.status === "Completed" ? "bg-purple-100 text-purple-700" :
                          sprint.status === "Planning" ? "bg-yellow-100 text-yellow-700" :
                          "bg-neutral-100 text-neutral-700"
                        }`}>
                          {sprint.status}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">{sprint.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => onOpenTab && onOpenTab("edit-sprint", `Edit: ${sprint.name}`)}
                      title="Edit Sprint"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                      onClick={() => setShowMoreMenu(showMoreMenu === sprint.id ? null : sprint.id)}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {/* Sprint Actions Menu */}
                    {showMoreMenu === sprint.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10">
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-neutral-50 text-neutral-700 text-left"
                          onClick={() => duplicateSprint(sprint)}
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate Sprint
                        </button>
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-neutral-50 text-neutral-700 text-left"
                          onClick={() => exportSprint(sprint)}
                        >
                          <Download className="w-4 h-4" />
                          Export Sprint
                        </button>
                        <hr className="my-1" />
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 text-red-600 text-left"
                          onClick={() => deleteSprint(sprint.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Sprint
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sprint Details */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">Default Project</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">{sprint.startDate} - {sprint.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">{sprint.velocity} velocity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">Created {sprint.created}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSprints.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No sprints found</h3>
              <p className="text-neutral-600 mb-4">Try adjusting your search or create a new sprint.</p>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowCreateForm(true)}
              >
                Create Your First Sprint
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 