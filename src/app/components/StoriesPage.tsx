import React, { useState } from "react";
import { 
  BookOpen, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
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
  FileText,
  CheckSquare,
  Users,
  Eye,
  Share2
} from "lucide-react";

// Sample story data
const initialStories = [
  {
    id: 1,
    name: "User Authentication System",
    status: "Completed",
    priority: "High",
    assignee: "Sarah Johnson",
    reporter: "Mike Chen",
    storyPoints: 8,
    tasks: 5,
    completed: 5,
    sprint: "Sprint 1 - Q1 2024",
    epic: "User Management",
    description: "Implement secure user authentication with JWT tokens and role-based access control",
    acceptanceCriteria: [
      "Users can register with email and password",
      "Users can login and receive JWT token",
      "Password reset functionality works",
      "Role-based access control is implemented"
    ],
    created: "2024-01-01",
    updated: "2024-01-10",
    dueDate: "2024-01-15",
    archived: false,
    tags: ["Authentication", "Security", "Backend"],
    comments: [
      {
        id: 1,
        author: "Mike Chen",
        content: "Great work on the authentication system!",
        timestamp: "2024-01-10 14:30"
      },
      {
        id: 2,
        author: "Sarah Johnson",
        content: "Thanks! The JWT implementation is working perfectly.",
        timestamp: "2024-01-10 15:45"
      }
    ]
  },
  {
    id: 2,
    name: "Dashboard Layout",
    status: "In Progress",
    priority: "High",
    assignee: "Mike Chen",
    reporter: "Lisa Chen",
    storyPoints: 5,
    tasks: 3,
    completed: 2,
    sprint: "Sprint 1 - Q1 2024",
    epic: "User Interface",
    description: "Create responsive dashboard layout with customizable widgets and navigation",
    acceptanceCriteria: [
      "Dashboard is responsive on all devices",
      "Widgets can be added/removed/reordered",
      "Navigation is intuitive and accessible",
      "Theme switching works correctly"
    ],
    created: "2024-01-02",
    updated: "2024-01-12",
    dueDate: "2024-01-20",
    archived: false,
    tags: ["Frontend", "UI/UX", "Dashboard"],
    comments: [
      {
        id: 3,
        author: "Lisa Chen",
        content: "The layout looks great! Can we add more widget options?",
        timestamp: "2024-01-12 10:15"
      }
    ]
  },
  {
    id: 3,
    name: "Payment Integration",
    status: "In Progress",
    priority: "High",
    assignee: "David Kim",
    reporter: "Alex Rodriguez",
    storyPoints: 13,
    tasks: 8,
    completed: 4,
    sprint: "Sprint 2 - Q1 2024",
    epic: "E-commerce",
    description: "Integrate Stripe payment gateway for secure online transactions",
    acceptanceCriteria: [
      "Stripe API integration is complete",
      "Payment processing works for all card types",
      "Refund functionality is implemented",
      "Payment security measures are in place"
    ],
    created: "2024-01-05",
    updated: "2024-01-13",
    dueDate: "2024-01-25",
    archived: false,
    tags: ["Payment", "Stripe", "E-commerce"],
    comments: [
      {
        id: 4,
        author: "Alex Rodriguez",
        content: "Stripe integration is progressing well. Need to test with sandbox environment.",
        timestamp: "2024-01-13 16:20"
      }
    ]
  },
  {
    id: 4,
    name: "Mobile App Navigation",
    status: "To Do",
    priority: "Medium",
    assignee: "Alex Rodriguez",
    reporter: "Emma Wilson",
    storyPoints: 5,
    tasks: 4,
    completed: 0,
    sprint: "Sprint 2 - Q1 2024",
    epic: "Mobile Development",
    description: "Implement bottom navigation and gesture-based navigation for mobile app",
    acceptanceCriteria: [
      "Bottom navigation is smooth and responsive",
      "Gesture navigation works intuitively",
      "Navigation state is preserved",
      "Accessibility features are implemented"
    ],
    created: "2024-01-08",
    updated: "2024-01-08",
    dueDate: "2024-01-30",
    archived: false,
    tags: ["Mobile", "Navigation", "UI/UX"],
    comments: []
  },
  {
    id: 5,
    name: "Data Analytics Dashboard",
    status: "Planning",
    priority: "Medium",
    assignee: "Emma Wilson",
    reporter: "James Brown",
    storyPoints: 8,
    tasks: 6,
    completed: 0,
    sprint: "Sprint 3 - Q1 2024",
    epic: "Analytics",
    description: "Create comprehensive analytics dashboard with charts and data visualization",
    acceptanceCriteria: [
      "Real-time data visualization works",
      "Charts are interactive and responsive",
      "Data export functionality is available",
      "Custom date ranges can be selected"
    ],
    created: "2024-01-10",
    updated: "2024-01-10",
    dueDate: "2024-02-15",
    archived: false,
    tags: ["Analytics", "Dashboard", "Data"],
    comments: []
  }
];

interface Story {
  id: number;
  name: string;
  status: string;
  priority: string;
  assignee: string;
  reporter: string;
  storyPoints: number;
  tasks: number;
  completed: number;
  sprint: string;
  epic: string;
  description: string;
  acceptanceCriteria: string[];
  created: string;
  updated: string;
  dueDate: string;
  archived: boolean;
  tags: string[];
  comments: Array<{
    id: number;
    author: string;
    content: string;
    timestamp: string;
  }>;
}

export default function StoriesPage({ open, onClose, onOpenTab }: { 
  open: boolean, 
  onClose: () => void,
  onOpenTab?: (type: string, title?: string) => void 
}) {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState<number | null>(null);
  const [expandedStories, setExpandedStories] = useState<number[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    sprint: "",
    status: "",
    priority: "",
    storyPoints: "",
    assignee: "",
    startDate: "",
    dueDate: "",
    acceptanceCriteria: [""] as string[],
    teamMembers: [] as string[]
  });

  // Story actions
  const deleteStory = (storyId: number) => {
    setStories(prev => prev.filter(story => story.id !== storyId));
    setShowMoreMenu(null);
  };

  const archiveStory = (storyId: number) => {
    setStories(prev => prev.map(story => 
      story.id === storyId ? { ...story, archived: true } : story
    ));
    setShowMoreMenu(null);
  };

  const duplicateStory = (story: Story) => {
    const newStory = {
      ...story,
      id: Math.max(...stories.map(s => s.id)) + 1,
      name: `${story.name} (Copy)`,
      status: "To Do",
      completed: 0
    };
    setStories(prev => [...prev, newStory]);
    setShowMoreMenu(null);
  };

  const exportStory = (story: Story) => {
    const dataStr = JSON.stringify(story, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${story.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadStoryReport = (story: Story) => {
    const report = `
Story Report: ${story.name}
Status: ${story.status}
Priority: ${story.priority}
Assignee: ${story.assignee}
Reporter: ${story.reporter}
Sprint: ${story.sprint}
Epic: ${story.epic}
Story Points: ${story.storyPoints}
Tasks: ${story.completed}/${story.tasks}
Due Date: ${story.dueDate}

Description: ${story.description}

Acceptance Criteria:
${story.acceptanceCriteria.map(criteria => `- ${criteria}`).join('\n')}

Comments:
${story.comments.map(comment => `[${comment.timestamp}] ${comment.author}: ${comment.content}`).join('\n')}
    `;
    const dataBlob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${story.name}-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Toggle expansion
  const toggleStory = (storyId: number) => {
    setExpandedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setShowFilters(false);
  };

  const hasActiveFilters = searchTerm;

  // Filter stories
  const filteredStories = stories.filter(story => 
    !story.archived && (
      story.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.epic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.sprint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  // Analytics
  const analytics = {
    totalStories: stories.filter(s => !s.archived).length,
    completedStories: stories.filter(s => !s.archived && s.status === "Completed").length,
    inProgressStories: stories.filter(s => !s.archived && s.status === "In Progress").length,
    totalStoryPoints: stories.filter(s => !s.archived).reduce((sum, story) => sum + story.storyPoints, 0)
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "In Progress":
        return { icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" };
      case "Completed":
        return { icon: CheckSquare, color: "text-green-600", bg: "bg-green-100" };
      case "To Do":
        return { icon: ChevronRight, color: "text-yellow-600", bg: "bg-yellow-100" };
      case "Planning":
        return { icon: ChevronRight, color: "text-purple-600", bg: "bg-purple-100" };
      default:
        return { icon: Calendar, color: "text-neutral-600", bg: "bg-neutral-100" };
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Low":
        return "text-green-600 bg-green-100";
      default:
        return "text-neutral-600 bg-neutral-100";
    }
  };

  const handleCreateStory = () => {
    if (formData.title && formData.project) {
      const newStory: Story = {
        id: Math.max(...stories.map(s => s.id)) + 1,
        name: formData.title,
        status: formData.status || "To Do",
        priority: formData.priority || "Medium",
        assignee: formData.assignee || "Unassigned",
        reporter: "Current User",
        storyPoints: parseInt(formData.storyPoints) || 0,
        tasks: 0,
        completed: 0,
        sprint: formData.sprint || "Backlog",
        epic: "Default Epic",
        description: formData.description,
        acceptanceCriteria: formData.acceptanceCriteria.filter(criteria => criteria.trim() !== ""),
        created: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0],
        dueDate: formData.dueDate,
        archived: false,
        tags: [],
        comments: []
      };
      
      setStories(prev => [...prev, newStory]);
      setShowCreateForm(false);
      setFormData({
        title: "",
        description: "",
        project: "",
        sprint: "",
        status: "",
        priority: "",
        storyPoints: "",
        assignee: "",
        startDate: "",
        dueDate: "",
        acceptanceCriteria: [""],
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

  const addAcceptanceCriteria = () => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, ""]
    }));
  };

  const updateAcceptanceCriteria = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.map((criteria, i) => 
        i === index ? value : criteria
      )
    }));
  };

  const removeAcceptanceCriteria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index)
    }));
  };

  const availableMembers = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Wilson", "Emma Chen", "Frank Miller", "Grace Lee", "Henry Brown"];
  const projects = ["Whapi Project Management", "E-commerce Platform", "Client Portal", "Mobile App Development", "API Integration"];
  const sprints = ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"];
  const statuses = ["To Do", "In Progress", "Review", "Done", "Blocked"];
  const priorities = ["Low", "Medium", "High", "Critical"];
  const assignees = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Wilson", "Emma Chen", "Frank Miller"];

  if (!open) return null;

  return (
    <div className="w-full h-full bg-neutral-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-t-lg bg-blue-50 text-blue-700 font-semibold">
            <BookOpen className="text-blue-500 mr-1" size={20} />
            <span>Stories</span>
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
          {showCreateForm ? 'Cancel' : 'New Story'}
        </button>
      </div>

      <div className="p-6">
        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-6 bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Create New Story</h3>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Story Information */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-orange-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Story Information</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Story Title *</label>
                  <input 
                    value={formData.title} 
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-neutral-50/50 placeholder:text-neutral-400 transition-all"
                    placeholder="Enter story title"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Project *</label>
                  <select
                    value={formData.project}
                    onChange={e => setFormData(prev => ({ ...prev, project: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-neutral-50/50"
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
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-neutral-50/50 placeholder:text-neutral-400 transition-all resize-none"
                  rows={2}
                  placeholder="Describe the story requirements and goals..."
                />
              </div>

              {/* Story Details */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-3 h-3 text-green-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Story Details</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Sprint</label>
                  <select
                    value={formData.sprint}
                    onChange={e => setFormData(prev => ({ ...prev, sprint: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-neutral-50/50"
                  >
                    <option value="">Select a sprint</option>
                    {sprints.map(sprint => (
                      <option key={sprint} value={sprint}>{sprint}</option>
                    ))}
                  </select>
                </div>

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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Story Points</label>
                  <input
                    value={formData.storyPoints}
                    onChange={e => setFormData(prev => ({ ...prev, storyPoints: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-neutral-50/50 placeholder:text-neutral-400 transition-all"
                    placeholder="e.g., 3"
                    type="number"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Assignee</label>
                  <select
                    value={formData.assignee}
                    onChange={e => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-neutral-50/50"
                  >
                    <option value="">Select assignee</option>
                    {assignees.map(assignee => (
                      <option key={assignee} value={assignee}>{assignee}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-blue-600" />
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
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-neutral-50/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Due Date</label>
                  <input 
                    type="date"
                    value={formData.dueDate} 
                    onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))} 
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-neutral-50/50 transition-all"
                  />
                </div>
              </div>

              {/* Acceptance Criteria */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-3 h-3 text-purple-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Acceptance Criteria</h4>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Criteria</label>
                <div className="space-y-2">
                  {formData.acceptanceCriteria.map((criteria, index) => (
                    <div key={`criteria-${index}`} className="flex items-center gap-2">
                      <input
                        value={criteria}
                        onChange={e => updateAcceptanceCriteria(index, e.target.value)}
                        className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-50/50 placeholder:text-neutral-400 transition-all"
                        placeholder={`Acceptance criteria ${index + 1}`}
                      />
                      {formData.acceptanceCriteria.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAcceptanceCriteria(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAcceptanceCriteria}
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    <Plus size={14} />
                    Add Criteria
                  </button>
                </div>
              </div>

              {/* Team Members */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="w-3 h-3 text-indigo-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Team Members</h4>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Story Team</label>
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
                  onClick={handleCreateStory}
                  disabled={!formData.title || !formData.project}
                  className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-xs font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Create Story
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">{analytics.totalStories}</h3>
            <p className="text-neutral-600 text-sm">Total Stories</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">{analytics.completedStories}</h3>
            <p className="text-neutral-600 text-sm">Completed Stories</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">{analytics.inProgressStories}</h3>
            <p className="text-neutral-600 text-sm">In Progress</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">{analytics.totalStoryPoints}</h3>
            <p className="text-neutral-600 text-sm">Total Story Points</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search stories, assignees, or epics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button 
              className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              More Filters
            </button>

            {hasActiveFilters && (
              <button 
                className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-red-50 text-red-700 transition-colors"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
                  <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg">
                    <option>All Status</option>
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Planning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg">
                    <option>All Priorities</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Sort By</label>
                  <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg">
                    <option>Name A-Z</option>
                    <option>Story Points</option>
                    <option>Due Date</option>
                    <option>Created Date</option>
                    <option>Assignee</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stories List */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">All Stories ({filteredStories.length})</h2>
          </div>
          
          <div className="divide-y divide-neutral-200">
            {filteredStories.map((story) => {
              const StatusIcon = getStatusInfo(story.status).icon;
              const statusColor = getStatusInfo(story.status).color;
              const statusBg = getStatusInfo(story.status).bg;
              
              return (
                <div key={story.id} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => toggleStory(story.id)}
                          className="p-1 rounded hover:bg-neutral-100 transition-colors"
                        >
                          {expandedStories.includes(story.id) ? (
                            <span className="text-neutral-400">▼</span>
                          ) : (
                            <span className="text-neutral-400">▶</span>
                          )}
                        </button>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-neutral-900">{story.name}</h3>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${statusBg} ${statusColor}`}>
                          {story.status}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(story.priority)}`}>
                          {story.priority}
                        </div>
                      </div>
                      
                      <p className="text-neutral-600 mb-3">{story.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-neutral-500 mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Assignee: {story.assignee}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Reporter: {story.reporter}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          <span>{story.storyPoints} points</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span>{story.completed}/{story.tasks} tasks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {story.dueDate}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-4">
                        {story.tags.map((tag, index) => (
                          <span key={`story-tag-${index}`} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-neutral-600 mb-1">
                          <span>Progress</span>
                          <span>{story.completed}/{story.tasks} tasks ({Math.round((story.completed / story.tasks) * 100)}%)</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(story.completed / story.tasks) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Epic and Sprint */}
                      <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          <span>Epic: {story.epic}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Sprint: {story.sprint}</span>
                        </div>
                      </div>

                      {/* Acceptance Criteria and Comments */}
                      {expandedStories.includes(story.id) && (
                        <div className="ml-8 mt-4 space-y-4">
                          {/* Acceptance Criteria */}
                          <div>
                            <h4 className="text-sm font-medium text-neutral-700 mb-2">Acceptance Criteria</h4>
                            <div className="space-y-2">
                              {story.acceptanceCriteria.map((criteria, index) => (
                                <div key={`story-criteria-${index}`} className="flex items-start gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-neutral-700">{criteria}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Comments */}
                          <div>
                            <h4 className="text-sm font-medium text-neutral-700 mb-2">Comments ({story.comments.length})</h4>
                            <div className="space-y-3">
                              {story.comments.map((comment) => (
                                <div key={comment.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Users className="w-4 h-4 text-neutral-400" />
                                    <span className="text-sm font-medium text-neutral-800">{comment.author}</span>
                                    <span className="text-xs text-neutral-500">{comment.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-neutral-700">{comment.content}</p>
                                </div>
                              ))}
                              {story.comments.length === 0 && (
                                <p className="text-sm text-neutral-500 italic">No comments yet</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button 
                        className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => onOpenTab && onOpenTab("edit-story", `Edit: ${story.name}`)}
                        title="Edit Story"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-neutral-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => downloadStoryReport(story)}
                        title="Download Report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                        onClick={() => setShowMoreMenu(showMoreMenu === story.id ? null : story.id)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {/* Story Actions Menu */}
                      {showMoreMenu === story.id && (
                        <div className="absolute right-0 top-12 z-10 bg-white border border-neutral-200 rounded shadow-lg min-w-[160px]">
                          <button 
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-blue-50 text-left"
                            onClick={() => onOpenTab && onOpenTab("edit-story", `Edit: ${story.name}`)}
                          >
                            <Edit className="w-4 h-4" />
                            Edit Story
                          </button>
                          <button 
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-blue-50 text-left"
                            onClick={() => onOpenTab && onOpenTab("view-story", `View: ${story.name}`)}
                          >
                            <Eye className="w-4 h-4" />
                            View Story
                          </button>
                          <button 
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-blue-50 text-left"
                            onClick={() => duplicateStory(story)}
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate Story
                          </button>
                          <button 
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-blue-50 text-left"
                            onClick={() => exportStory(story)}
                          >
                            <Share2 className="w-4 h-4" />
                            Export Story
                          </button>
                          <button 
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-green-50 text-green-600 text-left"
                            onClick={() => downloadStoryReport(story)}
                          >
                            <Download className="w-4 h-4" />
                            Download Report
                          </button>
                          <button 
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-yellow-50 text-yellow-600 text-left"
                            onClick={() => archiveStory(story.id)}
                          >
                            <Archive className="w-4 h-4" />
                            Archive Story
                          </button>
                          <hr className="my-1" />
                          <button 
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 text-red-600 text-left"
                            onClick={() => deleteStory(story.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Story
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStories.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No stories found</h3>
              <p className="text-neutral-600 mb-4">Try adjusting your search or create a new story.</p>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowCreateForm(true)}
              >
                Create Your First Story
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 