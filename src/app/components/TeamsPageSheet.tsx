import React, { useState } from "react";
import { 
  Users, 
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
  MessageSquare,
  Award,
  Share2
} from "lucide-react";

// Sample team data
const initialTeams = [
  {
    id: 1,
    name: "Frontend Development",
    lead: "Sarah Johnson",
    members: 12,
    projects: 3,
    performance: 92,
    department: "Engineering",
    status: "Active",
    description: "Responsible for user interface and user experience development",
    created: "2024-01-15",
    lastActivity: "2 hours ago",
    archived: false,
    subteams: [
      {
        id: 1,
        name: "React Team",
        lead: "Mike Chen",
        members: 6,
        projects: 2,
        performance: 94,
        focus: "Frontend Development"
      },
      {
        id: 2,
        name: "UI Components",
        lead: "Alex Rodriguez",
        members: 3,
        projects: 1,
        performance: 91,
        focus: "Component Library"
      },
      {
        id: 3,
        name: "User Experience",
        lead: "Emma Wilson",
        members: 3,
        projects: 1,
        performance: 87,
        focus: "UX Optimization"
      }
    ]
  },
  {
    id: 2,
    name: "Backend Development",
    lead: "David Kim",
    members: 8,
    projects: 2,
    performance: 88,
    department: "Engineering",
    status: "Active",
    description: "Server-side development and database management",
    created: "2024-01-20",
    lastActivity: "1 hour ago",
    archived: false,
    subteams: [
      {
        id: 4,
        name: "Node.js Team",
        lead: "David Kim",
        members: 5,
        projects: 2,
        performance: 89,
        focus: "Backend Development"
      },
      {
        id: 5,
        name: "Database Team",
        lead: "Tom Anderson",
        members: 3,
        projects: 1,
        performance: 96,
        focus: "Data Management"
      }
    ]
  },
  {
    id: 3,
    name: "Quality Assurance",
    lead: "Lisa Thompson",
    members: 6,
    projects: 2,
    performance: 95,
    department: "Engineering",
    status: "Active",
    description: "Testing and quality control for all projects",
    created: "2024-02-01",
    lastActivity: "30 minutes ago",
    archived: false,
    subteams: [
      {
        id: 6,
        name: "Manual Testing",
        lead: "Lisa Thompson",
        members: 3,
        projects: 1,
        performance: 93,
        focus: "Manual Testing"
      },
      {
        id: 7,
        name: "Automation Testing",
        lead: "James Brown",
        members: 3,
        projects: 1,
        performance: 97,
        focus: "Test Automation"
      }
    ]
  },
  {
    id: 4,
    name: "Product Strategy",
    lead: "Lisa Chen",
    members: 4,
    projects: 2,
    performance: 87,
    department: "Product",
    status: "Active",
    description: "Product strategy and roadmap planning",
    created: "2024-01-10",
    lastActivity: "3 hours ago",
    archived: false,
    subteams: [
      {
        id: 8,
        name: "Market Research",
        lead: "James Brown",
        members: 2,
        projects: 1,
        performance: 85,
        focus: "Market Analysis"
      },
      {
        id: 9,
        name: "Product Planning",
        lead: "Lisa Chen",
        members: 2,
        projects: 1,
        performance: 89,
        focus: "Roadmap Planning"
      }
    ]
  },
  {
    id: 5,
    name: "UI/UX Design",
    lead: "Alex Rodriguez",
    members: 5,
    projects: 4,
    performance: 90,
    department: "Design",
    status: "Active",
    description: "User interface and user experience design",
    created: "2024-01-25",
    lastActivity: "1 hour ago",
    archived: false,
    subteams: [
      {
        id: 10,
        name: "Visual Design",
        lead: "Maria Garcia",
        members: 2,
        projects: 2,
        performance: 92,
        focus: "Visual Identity"
      },
      {
        id: 11,
        name: "Interaction Design",
        lead: "Alex Rodriguez",
        members: 3,
        projects: 2,
        performance: 88,
        focus: "User Interactions"
      }
    ]
  }
];

interface Team {
  id: number;
  name: string;
  lead: string;
  members: number;
  projects: number;
  performance: number;
  department: string;
  status: string;
  description: string;
  created: string;
  lastActivity: string;
  archived: boolean;
  subteams: Array<{
    id: number;
    name: string;
    lead: string;
    members: number;
    projects: number;
    performance: number;
    focus: string;
  }>;
}

export default function TeamsPageSheet({ open, onClose, onOpenTab, context }: { 
  open: boolean, 
  onClose: () => void,
  onOpenTab?: (type: string, title?: string, context?: any) => void,
  context?: { company: string }
}) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState<number | null>(null);
  const [expandedTeams, setExpandedTeams] = useState<number[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "",
    company: "",
    manager: "",
    whatsappGroupId: "",
    whatsappGroupName: "",
    startDate: "",
    teamMembers: [] as string[]
  });

  // Team actions
  const deleteTeam = (teamId: number) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
    setShowMoreMenu(null);
  };

  const archiveTeam = (teamId: number) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, archived: true } : team
    ));
    setShowMoreMenu(null);
  };

  const duplicateTeam = (team: Team) => {
    const newTeam = {
      ...team,
      id: Math.max(...teams.map(t => t.id)) + 1,
      name: `${team.name} (Copy)`,
      status: "Planning"
    };
    setTeams(prev => [...prev, newTeam]);
    setShowMoreMenu(null);
  };

  const exportTeam = (team: Team) => {
    const dataStr = JSON.stringify(team, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${team.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Contact actions
  const contactTeamLead = (team: Team, method: 'email' | 'phone' | 'message') => {
    switch (method) {
      case 'email':
        window.open(`mailto:${team.lead.toLowerCase().replace(' ', '.')}@company.com`);
        break;
      case 'phone':
        window.open(`tel:+1-555-${String(team.id).padStart(4, '0')}`);
        break;
      case 'message':
        console.log(`Opening chat with ${team.lead}`);
        break;
    }
  };

  // Toggle expansion
  const toggleTeam = (teamId: number) => {
    setExpandedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setShowFilters(false);
  };

  const hasActiveFilters = searchTerm;

  // Filter teams
  const filteredTeams = teams.filter(team => 
    !team.archived && (
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Analytics
  const analytics = {
    totalTeams: teams.filter(t => !t.archived).length,
    totalMembers: teams.filter(t => !t.archived).reduce((sum, team) => sum + team.members, 0),
    totalProjects: teams.filter(t => !t.archived).reduce((sum, team) => sum + team.projects, 0),
    avgPerformance: Math.round(teams.filter(t => !t.archived).reduce((sum, team) => sum + team.performance, 0) / teams.filter(t => !t.archived).length)
  };

  const handleCreateTeam = () => {
    if (formData.name && formData.department) {
      const newTeam: Team = {
        id: Math.max(...teams.map(t => t.id)) + 1,
        name: formData.name,
        lead: formData.manager || "Unassigned", // Assuming lead is manager for new teams
        members: formData.teamMembers.length,
        projects: 0,
        performance: 0, // Placeholder, will be calculated
        department: formData.department,
        status: "Active",
        description: formData.description,
        created: new Date().toISOString().split('T')[0],
        lastActivity: "Just now",
        archived: false,
        subteams: []
      };
      
      setTeams(prev => [...prev, newTeam]);
      setShowCreateForm(false);
      setFormData({
        name: "",
        description: "",
        department: "",
        company: "",
        manager: "",
        whatsappGroupId: "",
        whatsappGroupName: "",
        startDate: "",
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
  const departments = ["Engineering", "Design", "Marketing", "Sales", "Product", "Operations"];
  // Companies will be fetched from API
const companies: string[] = [];
  const managers = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Wilson", "Emma Chen"];
  const whatsappGroups = [
    { id: "1", name: "Development Team" },
    { id: "2", name: "Design Team" },
    { id: "3", name: "Marketing Team" },
    { id: "4", name: "Sales Team" },
    { id: "5", name: "Product Team" }
  ];

  if (!open) return null;

  return (
    <div className="w-full h-full bg-neutral-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-t-lg bg-blue-50 text-blue-700 font-semibold">
            <Users className="text-blue-500 mr-1" size={20} />
            <span>{context?.company ? `${context.company} Teams` : 'Teams'}</span>
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
          {showCreateForm ? 'Cancel' : 'New Team'}
        </button>
      </div>

      <div className="p-6">
        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-6 bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Create New Team</h3>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Team Information */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-3 h-3 text-blue-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Team Information</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Team Name *</label>
                  <input 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-neutral-50/50 placeholder:text-neutral-400 transition-all"
                    placeholder="Enter team name"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-neutral-50/50"
                  >
                    <option value="">Select a department</option>
                    {departments.map(department => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-neutral-50/50 placeholder:text-neutral-400 transition-all resize-none"
                  rows={2}
                  placeholder="Describe the team's role and responsibilities..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Company</label>
                <select
                  value={formData.company}
                  onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-neutral-50/50"
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>

              {/* Team Details */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-3 h-3 text-green-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Team Details</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Manager</label>
                  <select
                    value={formData.manager}
                    onChange={e => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-neutral-50/50"
                  >
                    <option value="">Select manager</option>
                    {managers.map(manager => (
                      <option key={manager} value={manager}>{manager}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">WhatsApp Group</label>
                  <select
                    value={formData.whatsappGroupId}
                    onChange={e => {
                      const group = whatsappGroups.find(g => g.id === e.target.value);
                      setFormData(prev => ({ 
                        ...prev, 
                        whatsappGroupId: e.target.value,
                        whatsappGroupName: group?.name || ""
                      }));
                    }}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-neutral-50/50"
                  >
                    <option value="">Select a WhatsApp group</option>
                    {whatsappGroups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-orange-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Timeline</h4>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Start Date</label>
                <input 
                  type="date"
                  value={formData.startDate} 
                  onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))} 
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-neutral-50/50 transition-all"
                />
              </div>

              {/* Team Members */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-3 h-3 text-purple-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Team Members</h4>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Team Members</label>
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
                  onClick={handleCreateTeam}
                  disabled={!formData.name || !formData.department}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Create Team
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
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-1">{analytics.totalTeams}</h3>
            <p className="text-neutral-600 text-sm">Total Teams</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-1">{analytics.totalMembers}</h3>
            <p className="text-neutral-600 text-sm">Total Members</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-1">{analytics.totalProjects}</h3>
            <p className="text-neutral-600 text-sm">Total Projects</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-1">{analytics.avgPerformance}%</h3>
            <p className="text-neutral-600 text-sm">Avg Performance</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search teams, leads, or departments..."
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
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Department</label>
                  <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg">
                    <option>All Departments</option>
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>Design</option>
                    <option>Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Performance</label>
                  <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg">
                    <option>All Performance</option>
                    <option>90%+ (Excellent)</option>
                    <option>80-89% (Good)</option>
                    <option>70-79% (Average)</option>
                    <option>&lt;70% (Needs Improvement)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Sort By</label>
                  <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg">
                    <option>Name A-Z</option>
                    <option>Most Members</option>
                    <option>Most Projects</option>
                    <option>Highest Performance</option>
                    <option>Recently Created</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Teams List */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">All Teams ({filteredTeams.length})</h2>
          </div>
          
          <div className="divide-y divide-neutral-200">
            {filteredTeams.map((team) => (
              <div key={team.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => toggleTeam(team.id)}
                        className="p-1 rounded hover:bg-neutral-100 transition-colors"
                      >
                        {expandedTeams.includes(team.id) ? (
                          <span className="text-neutral-400">▼</span>
                        ) : (
                          <span className="text-neutral-400">▶</span>
                        )}
                      </button>
                      <Users className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-semibold text-neutral-900">{team.name}</h3>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        team.status === "Active" ? "bg-green-100 text-green-700" : 
                        team.status === "Planning" ? "bg-yellow-100 text-yellow-700" : 
                        "bg-neutral-100 text-neutral-700"
                      }`}>
                        {team.status}
                      </div>
                    </div>
                    
                    <p className="text-neutral-600 mb-3">{team.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-neutral-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Lead: {team.lead}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{team.members} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>{team.projects} projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span>{team.performance}% performance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Created {team.created}</span>
                      </div>
                    </div>

                    {/* Contact Actions */}
                    <div className="flex items-center gap-2 mb-4">
                      <button 
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                        onClick={() => contactTeamLead(team, 'email')}
                      >
                        <Mail className="w-3 h-3" />
                        Email Lead
                      </button>
                      <button 
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                        onClick={() => contactTeamLead(team, 'phone')}
                      >
                        <Phone className="w-3 h-3" />
                        Call Lead
                      </button>
                      <button 
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
                        onClick={() => contactTeamLead(team, 'message')}
                      >
                        <MessageSquare className="w-3 h-3" />
                        Message Lead
                      </button>
                    </div>

                    {/* Sub-teams */}
                    {expandedTeams.includes(team.id) && (
                      <div className="ml-8 mt-4 space-y-3">
                        <h4 className="text-sm font-medium text-neutral-700 mb-3">Sub-teams ({team.subteams.length})</h4>
                        {team.subteams.map((subteam) => (
                          <div key={subteam.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                            <div className="flex items-center gap-3">
                              <Users className="w-4 h-4 text-blue-400" />
                              <div>
                                <h5 className="font-medium text-neutral-800 text-sm">{subteam.name}</h5>
                                <p className="text-xs text-neutral-600">Lead: {subteam.lead} • {subteam.focus}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <p className="text-xs font-medium">{subteam.members}</p>
                                <p className="text-xs text-neutral-500">Members</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-medium">{subteam.projects}</p>
                                <p className="text-xs text-neutral-500">Projects</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-medium">{subteam.performance}%</p>
                                <p className="text-xs text-neutral-500">Performance</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => onOpenTab && onOpenTab("edit-team", `Edit: ${team.name}`)}
                      title="Edit Team"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                      onClick={() => setShowMoreMenu(showMoreMenu === team.id ? null : team.id)}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {/* Team Actions Menu */}
                    {showMoreMenu === team.id && (
                      <div className="absolute right-0 top-12 z-10 bg-white border border-neutral-200 rounded shadow-lg min-w-[160px]">
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-blue-50 text-left"
                          onClick={() => onOpenTab && onOpenTab("edit-team", `Edit: ${team.name}`)}
                        >
                          <Edit className="w-4 h-4" />
                          Edit Team
                        </button>
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-blue-50 text-left"
                          onClick={() => duplicateTeam(team)}
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate Team
                        </button>
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-blue-50 text-left"
                          onClick={() => exportTeam(team)}
                        >
                          <Share2 className="w-4 h-4" />
                          Export Team
                        </button>
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-yellow-50 text-yellow-600 text-left"
                          onClick={() => archiveTeam(team.id)}
                        >
                          <Archive className="w-4 h-4" />
                          Archive Team
                        </button>
                        <hr className="my-1" />
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 text-red-600 text-left"
                          onClick={() => deleteTeam(team.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Team
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTeams.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No teams found</h3>
              <p className="text-neutral-600 mb-4">Try adjusting your search or create a new team.</p>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => onOpenTab && onOpenTab("create-team", "Create Team")}
              >
                Create Your First Team
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 